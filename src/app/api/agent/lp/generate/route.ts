import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { PILLARS, Article } from '@/app/knowledgebase/data'
import crypto from 'crypto'

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? ''
const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 1500 }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.choices[0]?.message?.content ?? ''
}

// POST /api/agent/lp/generate
// Security: agent_code forced từ session, không cho override
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.app_metadata?.role
  if (role !== 'agent' && role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const adminSupabase = createAdminClient()

  // Lấy agent record — force agent_code từ session
  const { data: agent } = await adminSupabase
    .from('sales_agents')
    .select('id, code, full_name, brand_name, brand_tagline, title, persona')
    .eq('auth_user_id', user.id)
    .single()

  if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })

  const { content_type, content_slug, campaign_name, target_audience_hint, news_context } = await req.json()

  if (!content_type || !content_slug) {
    return NextResponse.json({ error: 'Missing content_type or content_slug' }, { status: 400 })
  }

  // ── Fetch base content ──────────────────────────────────────────────────────
  let baseContent = ''
  let contentTitle = ''

  if (content_type === 'macro_insight') {
    const { data: insight } = await adminSupabase
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
      baseContent = `Tiêu đề: ${insight.title}\nDanh mục: ${insight.category ?? ''}${insight.date_label ? ` (${insight.date_label})` : ''}\nData point: ${insight.data_point ?? ''}\nAnalyst view: ${insight.analyst_view ?? ''}\nBehind story:\n${behindStory}\nKey stats:\n${keyStatsStr}`.trim()
    }
  } else if (content_type === 'knowledgebase') {
    const { data: article } = await adminSupabase
      .from('kb_articles')
      .select('title, summary, pillar, difficulty, tags, read_time, references')
      .eq('slug', content_slug)
      .maybeSingle()
    if (article) {
      contentTitle = article.title
      baseContent = `Tiêu đề: ${article.title}\nPillar: ${article.pillar}\nĐộ khó: ${article.difficulty ?? ''}\nTóm tắt:\n${article.summary}`.trim()
    } else {
      for (const pillar of PILLARS) {
        const found = (pillar.articles as Article[]).find(a => a.slug === content_slug)
        if (found) {
          contentTitle = found.title
          baseContent = `Tiêu đề: ${found.title}\nPillar: ${pillar.title}\nTóm tắt:\n${found.summary}`.trim()
          break
        }
      }
    }
  }

  if (!baseContent) return NextResponse.json({ error: `Content not found: ${content_slug}` }, { status: 404 })

  // ── Build AI prompt ─────────────────────────────────────────────────────────
  const persona = agent.persona ?? {}
  const tone: string = persona.tone_of_voice ?? 'chuyên nghiệp nhưng gần gũi'
  const targetAudience: string = target_audience_hint ?? persona.target_audience ?? 'nhà đầu tư cá nhân'
  const strengths: string = (persona.strengths ?? []).join(', ')
  const avoid: string = (persona.avoid ?? []).join(', ')
  const lang: string = persona.language_primary ?? 'vi'
  const langLabel = lang === 'ko' ? '한국어 (Korean)' : lang === 'en' ? 'English' : 'Tiếng Việt'

  const audiencePainMap: Record<string, string> = {
    'f0': 'sợ mất tiền, không biết bắt đầu', 'office': 'không có thời gian, cần giải pháp đơn giản',
    'trader': 'muốn edge kỹ thuật, cần tín hiệu', 'nha dau tu': 'muốn tăng trưởng dài hạn',
  }
  const inferredPain = Object.entries(audiencePainMap).find(([k]) => targetAudience.toLowerCase().includes(k))?.[1]
    ?? 'cần thông tin rõ ràng, có thể hành động ngay'

  const sectionsByType = content_type === 'macro_insight'
    ? [`{"section": "Chuyện gì đang xảy ra và tại sao bạn cần biết ngay", "text": "..."}`,
       `{"section": "Tác động thực tế đến danh mục của ${targetAudience}", "text": "..."}`,
       `{"section": "Cơ hội hoặc rủi ro bạn không nên bỏ lỡ", "text": "..."}`,
       `{"section": "Bước hành động cụ thể bạn nên làm ngay hôm nay", "text": "..."}`]
    : [`{"section": "Tại sao kiến thức này quan trọng với ${targetAudience}", "text": "..."}`,
       `{"section": "Sai lầm phổ biến mà hầu hết người mới mắc phải", "text": "..."}`,
       `{"section": "Cách áp dụng thực tế — đơn giản nhất có thể", "text": "..."}`,
       `{"section": "Bắt đầu ngay — không cần hoàn hảo, chỉ cần bắt đầu", "text": "..."}`]

  const newsBlock = news_context?.title
    ? `## Tin tức hôm nay\n- ${news_context.title}\n- ${news_context.analyst_view ?? ''}\nKết nối tin này vào hook để tạo urgency.`
    : ''

  const prompt = `Bạn là ${agent.full_name} — ${agent.title}. Brand: ${agent.brand_name ?? agent.full_name}. Tagline: ${agent.brand_tagline ?? ''}. Tone: ${tone}. Thế mạnh: ${strengths || 'phân tích sâu'}. ${avoid ? `TRÁNH: ${avoid}` : ''}\nTarget: ${targetAudience}. Pain: ${inferredPain}. Ngôn ngữ: ${langLabel}.\n---\nNỘI DUNG:\n${baseContent}\n---\n${newsBlock ? newsBlock + '\n---\n' : ''}Tạo Landing Page cá nhân hoá. Hook chạm đúng pain của ${targetAudience}.\nTrả về JSON thuần (không markdown):\n{"hook": "1 câu <= 25 từ", "body": [${sectionsByType.join(', ')}], "cta": "1 câu <= 15 từ"}`

  let generated: { hook: string; body: { section: string; text: string }[]; cta: string }
  try {
    const text = (await callGroq(prompt)).trim()
    const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    generated = JSON.parse(jsonStr)
  } catch (e) {
    return NextResponse.json({ error: 'AI generation failed', details: String(e) }, { status: 500 })
  }

  // ── Save draft — status 'pending_review' (agent cannot self-approve) ──────
  const previewToken = crypto.randomBytes(16).toString('hex')
  const { data: campaign, error: insertErr } = await adminSupabase
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
      admin_notes: news_context?.title ? `Mix tin: ${news_context.title}` : null,
    }, { onConflict: 'agent_id,slug' })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    campaign_id: campaign.id,
    preview_url: `/lp/${agent.code}/${content_slug}?preview=${previewToken}`,
    generated,
  })
}
