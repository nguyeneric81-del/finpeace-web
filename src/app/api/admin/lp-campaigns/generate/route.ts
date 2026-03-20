import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { PILLARS, Article } from '@/app/knowledgebase/data'
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
      max_tokens: 1500,
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
    news_context,  // optional: { title, category, description, analyst_view, data_point }
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

  // 2. Fetch base content — inject ALL available fields
  let baseContent = ''
  let contentTitle = ''

  if (content_type === 'macro_insight') {
    const { data: insight } = await supabase
      .from('macro_insights')
      .select('title, analyst_view, behind_story, key_stats, data_point, category, date_label')
      .eq('topic_slug', content_slug)
      .single()
    if (insight) {
      contentTitle = insight.title
      const keyStatsStr = Array.isArray(insight.key_stats)
        ? (insight.key_stats as { label: string; value: string }[]).map(s => `• ${s.label}: ${s.value}`).join('\n')
        : JSON.stringify(insight.key_stats ?? {})
      const behindStory = typeof insight.behind_story === 'object' && insight.behind_story !== null
        ? Object.entries(insight.behind_story as Record<string, string>).map(([k, v]) => `[${k}] ${v}`).join('\n')
        : String(insight.behind_story ?? '')
      baseContent = `
Tiêu đề: ${insight.title}
Danh mục: ${insight.category ?? ''}${insight.date_label ? ` (${insight.date_label})` : ''}
Data point nổi bật: ${insight.data_point ?? ''}
Analyst view (góc nhìn chuyên gia): ${insight.analyst_view ?? ''}
Behind the story (câu chuyện đằng sau):
${behindStory}
Key statistics:
${keyStatsStr}
      `.trim()
    }
  } else if (content_type === 'knowledgebase') {
    // 1st: try Supabase kb_articles
    const { data: article } = await supabase
      .from('kb_articles')
      .select('title, summary, pillar, difficulty, tags, read_time, references')
      .eq('slug', content_slug)
      .maybeSingle()
    if (article) {
      contentTitle = article.title
      baseContent = `
Tiêu đề: ${article.title}
Pillar / Chủ đề lớn: ${article.pillar}
Độ khó: ${article.difficulty ?? ''}
Thời gian đọc: ${article.read_time ?? ''} phút
Tags liên quan: ${(article.tags ?? []).join(', ')}
Tóm tắt nội dung:
${article.summary}
${article.references?.length ? `\nTham khảo: ${(article.references as string[]).join(', ')}` : ''}
      `.trim()
    } else {
      // 2nd fallback: PILLARS hardcoded data
      for (const pillar of PILLARS) {
        const found = (pillar.articles as Article[]).find((a) => a.slug === content_slug)
        if (found) {
          contentTitle = found.title
          baseContent = `
Tiêu đề: ${found.title}
Pillar / Chủ đề lớn: ${pillar.title} — ${pillar.subtitle ?? ''}
Mô tả pillar: ${pillar.description ?? ''}
Độ khó: ${found.difficulty ?? ''}
Thời gian đọc: ${found.readTime ?? ''} phút
Tags liên quan: ${(found.tags ?? []).join(', ')}
Tóm tắt nội dung:
${found.summary}
${found.references?.length ? `\nTham khảo: ${found.references.join(', ')}` : ''}
          `.trim()
          break
        }
      }
    }
  }

  if (!baseContent) {
    return NextResponse.json({ error: `Content not found for slug: "${content_slug}". Check content_type and slug.` }, { status: 404 })
  }

  // 3. Build AI prompt — rich, dynamic, persona-aware
  const persona = agent.persona ?? {}
  const lang: string = persona.language_primary ?? 'vi'
  const tone: string = persona.tone_of_voice ?? 'chuyên nghiệp nhưng gần gũi'
  const targetAudience: string = target_audience_hint ?? persona.target_audience ?? 'nhà đầu tư cá nhân'
  const avoid: string = (persona.avoid ?? []).join(', ')
  const strengths: string = (persona.strengths ?? []).join(', ')
  const langLabel = lang === 'ko' ? '한국어 (Korean)' : lang === 'en' ? 'English' : 'Tiếng Việt'

  // Infer pain points from audience hint for richer hook
  const audiencePainMap: Record<string, string> = {
    'f0': 'sợ mất tiền, không biết bắt đầu, bị ngợp bởi thông tin',
    'nguoi moi': 'không có nền tảng, dễ bị FOMO, không phân biệt được tin tốt/xấu',
    'office': 'không có thời gian theo dõi thị trường, cần giải pháp đơn giản',
    'trader': 'muốn edge kỹ thuật, cần tín hiệu rõ ràng, dễ bị over-trading',
    'nha dau tu': 'muốn tăng trưởng dài hạn, sợ rủi ro lạm phát, thiếu chiến lược rõ',
    'siet': 'đang thua lỗ hoặc stuck, cần định hướng lại',
  }
  const audienceLower = targetAudience.toLowerCase()
  const inferredPain = Object.entries(audiencePainMap).find(([k]) => audienceLower.includes(k))?.[1]
    ?? 'cần thông tin rõ ràng, dễ hiểu, có thể hành động ngay'

  // Dynamic section structure based on content type
  const sectionsByType = content_type === 'macro_insight'
    ? [
        `{"section": "Chuyện gì đang xảy ra và tại sao bạn cần biết ngay", "text": "..."}`,
        `{"section": "Tác động thực tế đến danh mục của ${targetAudience}", "text": "..."}`,
        `{"section": "Cơ hội hoặc rủi ro bạn không nên bỏ lỡ", "text": "..."}`,
        `{"section": "Bước hành động cụ thể bạn nên làm ngay hôm nay", "text": "..."}`,
      ]
    : [
        `{"section": "Tại sao kiến thức này quan trọng với ${targetAudience}", "text": "..."}`,
        `{"section": "Sai lầm phổ biến mà hầu hết người mới mắc phải", "text": "..."}`,
        `{"section": "Cách áp dụng thực tế — đơn giản nhất có thể", "text": "..."}`,
        `{"section": "Bắt đầu ngay — không cần hoàn hảo, chỉ cần bắt đầu", "text": "..."}`,
      ]

  // Build news context block
  const newsBlock = news_context?.title
    ? `
## 📰 Tin tức thị trường hôm nay (mix vào LP để tạo urgency)
- Tiêu đề: ${news_context.title}
- Danh mục: ${news_context.category ?? ''}
- Mô tả ngắn: ${news_context.analyst_view ?? news_context.description ?? ''}

YÊU CẦU: Hãy kết nối tin tức này vào hook và section đầu tiên để tạo cầu nối giữa sự kiện thời sự và kiến thức đầu tư. Hook càng cụ thể, thời sự, cảm giác NGAY BÂY GIỜ càng tốt.
`.trim()
    : ''

  const prompt = `
Bạn là ${agent.full_name} — ${agent.title}.
Brand của bạn: ${agent.brand_name ?? agent.full_name}
Tagline: ${agent.brand_tagline ?? ''}
Phong cách viết (tone): ${tone}
Thế mạnh của bạn: ${strengths || 'phân tích sâu, tư vấn cá nhân hoá'}
${avoid ? `KHÔNG được dùng: ${avoid}` : ''}

ĐỐI TƯỢNG TARGET: ${targetAudience}
Pain point của họ: ${inferredPain}
Ngôn ngữ viết: ${langLabel}

---
## NỘI DUNG CƠ SỞ (${content_type === 'macro_insight' ? 'Macro Insight' : 'Knowledge Base'})
${baseContent}
---

${newsBlock ? newsBlock + '\n\n---\n\n' : ''}
NHIỆM VỤ: Dựa trên nội dung trên, hãy tạo nội dung Landing Page được cá nhân hoá hoàn toàn theo phong cách của bạn (${agent.full_name}).
- Hook phải NGAY LẬP TỨC chạm đúng pain point của ${targetAudience}
- Body phải có tính thực tế cao, dùng ví dụ cụ thể, không nói chung chung
- CTA phải tạo cảm giác cấp bách nhẹ nhàng (không spam, không aggressive)
- Toàn bộ viết theo tone: ${tone}

Trả về JSON DẠNG THUẦN (không markdown, không \`\`\`):
{
  "hook": "1 câu hook (<= 25 từ), bắt đầu bằng 1 tình huống hoặc con số cụ thể${news_context?.title ? ', liên quan đến tin tức hôm nay' : ''}",
  "body": [
    ${sectionsByType[0]},
    ${sectionsByType[1]},
    ${sectionsByType[2]},
    ${sectionsByType[3]}
  ],
  "cta": "1 câu call-to-action (<= 15 từ), thuyết phục, cụ thể và không sáo rỗng"
}
`.trim()

  // 4. Call Groq (llama-3.3-70b-versatile)
  let generated: { hook: string; body: { section: string; text: string }[]; cta: string }

  try {
    const text = (await callGroq(prompt)).trim()
    const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
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
