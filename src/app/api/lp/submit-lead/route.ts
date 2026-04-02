import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { SALES_CONFIG, GLOBAL_CC_EMAILS } from '@/lib/salesConfig'
import { syncLeadToGoogleSheet } from '@/utils/googleSheetsSync'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    const body = await request.json()
    const { full_name, email, phone, agentCode, topicSlug, lpId, agentId, contentType: bodyContentType } = body

    if (!agentCode || (!email && !phone)) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // ── 1. Save lead ─────────────────────────────────────────
    const { error } = await supabase.from('agent_leads').insert({
        agent_id: agentId,
        landing_page_id: lpId || null,
        full_name: full_name || null,
        email: email || null,
        phone: phone || null,
        ref_code: agentCode,
        utm_source: topicSlug,
        status: 'new',
    })

    if (error) {
        console.error('[LP Lead Submit]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ── 1b. Resolve content URL for unlock ───────────────────
    let contentUrl: string | null = null
    let contentTitle: string | null = null
    let resolvedContentType = bodyContentType ?? 'macro_insight'

    const BASE = 'https://finpeace.cloud'
    const ADVISOR_BASE = 'https://advisor.finpeace.cloud'

    if (lpId) {
        const { data: lpData } = await supabase
            .from('agent_landing_pages')
            .select('content_type, slug, topic, macro_insight_id')
            .eq('id', lpId)
            .single()
        if (lpData) {
            resolvedContentType = lpData.content_type ?? 'macro_insight'
            contentTitle = lpData.topic ?? topicSlug

            if (resolvedContentType === 'macro_insight') {
                // Look up the specific insight ID for a precise detail page URL
                const { data: insight } = await supabase
                    .from('macro_insights')
                    .select('id')
                    .eq('topic_slug', lpData.slug)
                    .single()
                contentUrl = insight?.id
                    ? `${ADVISOR_BASE}/advisor/macro-insights/${insight.id}`
                    : `${ADVISOR_BASE}/advisor/macro-insights`

            } else if (resolvedContentType === 'knowledgebase') {
                // macro_insight_id field repurposed to store KB pillar slug
                const pillar = lpData.macro_insight_id
                contentUrl = pillar
                    ? `${BASE}/knowledgebase/${pillar}`
                    : `${BASE}/knowledgebase`
            }
        }
    }


    // ── 2. Send sales notification email ─────────────────────

    const sales = SALES_CONFIG[agentCode]
    const salesName = sales?.name ?? agentCode
    const salesEmail = sales?.email

    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    const lpName = contentTitle ?? topicSlug?.replace(/-/g, ' ') ?? 'Landing Page'

    const salesEmailHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
        <div style="background: #1e3a5f; border-left: 4px solid #38bdf8; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">🔔 Lead mới từ Landing Page</p>
          <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #f8fafc;">FinPeace CRM</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px;">Sales phụ trách</td><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-weight: 600; color: #38bdf8;">${salesName}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px;">Họ tên khách</td><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-weight: 600;">${full_name || '—'}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px;">Số điện thoại</td><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-weight: 600; font-size: 16px; color: #34d399;">${phone || '—'}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #1e293b;">${email || '—'}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px;">Landing Page</td><td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 12px; color: #64748b;">${lpName}</td></tr>
          <tr><td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Thời gian</td><td style="padding: 10px 0; font-size: 12px;">${now}</td></tr>
        </table>
        <div style="margin-top: 24px; padding: 12px; background: #1e293b; border-radius: 8px;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">📌 Liên hệ khách trong vòng <strong style="color: #fbbf24">24 giờ</strong> để tăng tỷ lệ convert.</p>
        </div>
      </div>
    `

    const toList = salesEmail ? [salesEmail] : GLOBAL_CC_EMAILS
    const ccList = salesEmail ? GLOBAL_CC_EMAILS.filter(e => e !== salesEmail) : []

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'FinPeace Advisor <advisor@finpeace.cloud>',
            to: toList,
            cc: ccList.length > 0 ? ccList : undefined,
            subject: `🔔 Lead mới: ${full_name || phone} (${salesName}) — FinPeace`,
            html: salesEmailHtml,
        })
    } catch (emailErr) {
        console.error('[Lead Email Notify]', emailErr)
    }

    // ── 3. Send visitor welcome email (if email provided) ────
    if (email && contentUrl) {
        const firstName = full_name?.split(' ').pop() ?? full_name ?? 'bạn'
        const contentLabel = resolvedContentType === 'macro_insight'
            ? 'Macro Insights — Phân tích Vĩ mô'
            : 'Knowledgebase — Kiến thức Đầu tư'

        const visitorEmailHtml = `
<!DOCTYPE html>
<html>
<body style="background:#0d1119;font-family:'Inter',sans-serif;margin:0;padding:24px;">
  <div style="max-width:540px;margin:0 auto;">
    <div style="background:#111827;border-radius:16px;padding:32px;border:1px solid #1e2535;">
      <p style="color:#c4a67a;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">FinPeace Research</p>
      <h2 style="color:#f1f5f9;margin:0 0 8px;font-size:22px;">Chào ${firstName}! 🎉</h2>
      <p style="color:#64748b;margin:0 0 24px;font-size:14px;">Cảm ơn bạn đã đăng ký. ${salesName} sẽ liên hệ với bạn trong vòng 24 giờ.</p>

      <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #c4a67a33;">
        <p style="color:#c4a67a;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">🔓 Nội dung đã mở khóa</p>
        <p style="color:#f1f5f9;font-weight:600;margin:0 0 4px;">${lpName}</p>
        <p style="color:#64748b;font-size:13px;margin:0 0 16px;">${contentLabel}</p>
        <a href="${contentUrl}" style="display:inline-block;background:#c4a67a;color:#0d1119;padding:12px 24px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;">Xem nội dung ngay →</a>
      </div>

      <p style="color:#334155;font-size:12px;margin:0;">© ${salesName} · Powered by FinPeace Research Platform</p>
    </div>
  </div>
</body>
</html>`

        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL ?? 'FinPeace Advisor <advisor@finpeace.cloud>',
                to: [email],
                subject: `🔓 Nội dung đã mở khóa: ${lpName} — FinPeace`,
                html: visitorEmailHtml,
            })
        } catch (err) {
            console.error('[Visitor Welcome Email]', err)
        }
    }

    // ── 4. Sync lead to Google Sheet (async hook) ────────────
    syncLeadToGoogleSheet({
        email: email || '',
        phone: phone || '',
        name: full_name || '',
        agent: `${agentCode} (LP)`,
        source: `Landing Page: ${lpName}`
    });

    return NextResponse.json({ success: true, contentUrl, contentTitle: lpName })
}
