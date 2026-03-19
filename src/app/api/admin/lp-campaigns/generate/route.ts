import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { SALES_CONFIG } from '@/lib/salesConfig'
import crypto from 'crypto'

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? ''
const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.choices[0]?.message?.content ?? ''
}

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const {
    agent_code,
    content_type,
    content_slug,
    target_audience_hint,
    campaign_name,
    news_context,  // optional: { title, category, analyst_view, data_point }
  } = await req.json()

  if (!agent_code || !content_type || !content_slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 1. Fetch agent profile + persona
  const { data: agent, error: agentErr } = await supabase
    .from('sales_agents')
    .select('id, code, full_name, brand_name, brand_tagline, title, persona')
    .eq('code', agent_code)
    .single()

  if (agentErr || !agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // 2. Fetch base content
  let baseContent = ''
  let contentTitle = ''

  if (content_type === 'macro_insight') {
    const { data: insight } = await supabase
      .from('macro_insights')
      .select('title, analyst_view, behind_story, key_stats, data_point')
      .eq('topic_slug', content_slug)
      .single()
    if (insight) {
      contentTitle = insight.title
      baseContent = `
Tiêu đề: ${insight.title}
Data point: ${insight.data_point}
Analyst view: ${insight.analyst_view}
Behind story: ${JSON.stringify(insight.behind_story)}
Key stats: ${JSON.stringify(insight.key_stats)}
      `
    }
  } else if (content_type === 'knowledgebase') {
    // Query kb_articles table in Supabase (seeded via scripts/seed_kb_articles.mjs)
    const { data: article } = await supabase
      .from('kb_articles')
      .select('title, summary, pillar')
      .eq('slug', content_slug)
      .maybeSingle()
    if (article) {
      contentTitle = article.title
      baseContent = `
Tiêu đề: ${article.title}
Pillar: ${article.pillar}
Nội dung tóm tắt: ${article.summary}
      `
    }
  }

  if (!baseContent) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  // 3. Build AI prompt
  const persona = agent.persona ?? {}
  const lang = persona.language_primary ?? 'vi'
  const tone = persona.tone_of_voice ?? 'professional'
  const targetAudience = target_audience_hint ?? persona.target_audience ?? 'nhà đầu tư cá nhân'
  const avoid = (persona.avoid ?? []).join(', ')

  // Build news context block if provided
  const newsBlock = news_context?.title
    ? `
## Bối cảnh tin tức hôm nay (Admin đã chọn để mix vào LP)
- Tin tức: ${news_context.title}
- Danh mục: ${news_context.category ?? ''}
- Dữ liệu thực tế: ${news_context.data_point ?? ''}
- Phân tích: ${news_context.analyst_view ?? ''}

Nhiệm vụ: Hãy mix tin tức này vào ngữ cảnh Landing Page để tạo cầu nối giữa sự kiện thời sự và kiến thức đầu tư. Hook càng cụ thể và thời sự càng tốt.
`.trim()
    : ''

  const prompt = `
Bạn là ${agent.full_name} (${agent.title}), một chuyên gia tư vấn tài chính.
Brand: ${agent.brand_name ?? agent.full_name}
Tagline: ${agent.brand_tagline ?? ''}
Tone: ${tone}
Target audience: ${targetAudience}
${avoid ? `Không được: ${avoid}` : ''}

Dựa trên nội dung sau, hãy tạo nội dung landing page cá nhân hóa theo phong cách của bạn, viết bằng ngôn ngữ: ${lang === 'ko' ? '한국어 (Korean)' : lang === 'en' ? 'English' : 'Tiếng Việt'}.

---
${baseContent}
---

${newsBlock ? newsBlock + '\n\n---' : ''}

Trả về JSON với đúng format sau (không thêm markdown):
{
  "hook": "1 câu hook hấp dẫn mở đầu, phản ánh đúng pain point của ${targetAudience}${news_context?.title ? ' và liên quan đến tin tức hôm nay' : ''}",
  "body": [
    {"section": "Tại sao bạn cần biết điều này", "text": "..."},
    {"section": "Điều này có nghĩa gì với danh mục của bạn", "text": "..."},
    {"section": "Bước tiếp theo", "text": "..."}
  ],
  "cta": "1 câu call-to-action thuyết phục"
}
`

  // 4. Call Groq (llama-3.3-70b-versatile)
  let generated: { hook: string; body: { section: string; text: string }[]; cta: string }

  try {
    const text = (await callGroq(prompt)).trim()
    const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    generated = JSON.parse(jsonStr)
  } catch (e) {
    return NextResponse.json({ error: 'AI generation failed', details: String(e) }, { status: 500 })
  }


  // 5. Save draft campaign
  const previewToken = crypto.randomBytes(16).toString('hex')

  const { data: campaign, error: insertErr } = await supabase
    .from('agent_landing_pages')
    .upsert({
      agent_id: agent.id,
      slug: content_slug,
      topic: contentTitle,
      campaign_name: campaign_name || contentTitle,
      content_type,
      status: 'draft',
      generated_hook: generated.hook,
      generated_body: generated.body,
      generated_cta: generated.cta,
      preview_token: previewToken,
      custom_hook: generated.hook,
      custom_cta: generated.cta,
      admin_notes: news_context?.title ? `Mix tin tức: ${news_context.title}` : null,
    }, { onConflict: 'agent_id,slug' })
    .select()
    .single()

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const previewUrl = `/lp/${agent_code}/${content_slug}?preview=${previewToken}`

  return NextResponse.json({
    success: true,
    campaign_id: campaign.id,
    preview_url: previewUrl,
    generated,
  })
}
