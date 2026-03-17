import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { SALES_CONFIG, MANAGER_EMAIL } from '@/lib/salesConfig'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    const body = await request.json()
    const { full_name, email, phone, agentCode, topicSlug, lpId, agentId } = body

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

    // ── 2. Send email notification ────────────────────────────
    const sales = SALES_CONFIG[agentCode]
    const salesName = sales?.name ?? agentCode
    const salesEmail = sales?.email

    const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    const lpName = topicSlug?.replace(/-/g, ' ') ?? 'Landing Page'

    const emailHtml = `
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

    // Send to Manager + Sales (if email exists)
    const toList = [MANAGER_EMAIL]
    if (salesEmail && salesEmail !== MANAGER_EMAIL) toList.push(salesEmail)

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'FinPeace Advisor <advisor@finpeace.cloud>',
            to: toList,
            subject: `🔔 Lead mới: ${full_name || phone} (${salesName}) — FinPeace`,
            html: emailHtml,
        })
    } catch (emailErr) {
        // Don't fail the request if email fails — lead is already saved
        console.error('[Lead Email Notify]', emailErr)
    }

    return NextResponse.json({ success: true })
}
