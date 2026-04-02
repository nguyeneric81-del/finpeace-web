import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { syncLeadToGoogleSheet } from '@/utils/googleSheetsSync'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/kb-account/request
export async function POST(req: Request) {
  try {
    const { user_email, user_name, user_phone, content_type, content_slug, content_title } = await req.json()

    if (!user_email || !content_type || !content_slug) {
      return NextResponse.json({ ok: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    // Check nếu đã có request pending cho content này
    const { data: existing } = await supabase
      .from('kb_account_requests')
      .select('id, status')
      .eq('user_email', user_email)
      .eq('content_slug', content_slug)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ ok: true, already_requested: true })
    }

    // Insert request
    const { data: request, error } = await supabase
      .from('kb_account_requests')
      .insert({
        user_email,
        user_name: user_name ?? null,
        user_phone: user_phone ?? null,
        content_type,
        content_slug,
        content_title: content_title ?? null,
      })
      .select('id, expires_at')
      .single()

    if (error) throw error

    // Notify agent via email
    await resend.emails.send({
      from: 'FinPeace <noreply@finpeace.cloud>',
      to: ['tuananhfinpeace@gmail.com'],
      subject: `🔓 Yêu cầu mở tài khoản KB — ${user_name ?? user_email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0d1119; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #c4a67a; margin-bottom: 16px;">🔓 Yêu cầu mở tài khoản KB</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8;">Khách hàng</td><td style="padding: 8px 0; font-weight: bold;">${user_name ?? '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0;">${user_email}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">SĐT</td><td style="padding: 8px 0;">${user_phone ?? '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Content</td><td style="padding: 8px 0;">${content_title ?? content_slug} (${content_type})</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Hạn xử lý</td><td style="padding: 8px 0; color: #f59e0b;">⏰ ${new Date(request.expires_at).toLocaleDateString('vi-VN')}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="https://advisor.finpeace.cloud/advisor/admin/lp-manager" style="background: #c4a67a; color: #0d1119; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              → Vào LP Manager xử lý
            </a>
          </div>
          <p style="margin-top: 16px; color: #64748b; font-size: 12px;">⚠️ Nếu không xử lý trong 3 ngày, request sẽ tự động hết hạn</p>
        </div>
      `,
    })

    // Sync as a new lead
    syncLeadToGoogleSheet({
      email: user_email,
      phone: user_phone || '',
      name: user_name || '',
      agent: 'FinPeace (Account Request)',
      source: `KB Account Request: ${content_title || content_slug}`
    });

    return NextResponse.json({ ok: true, request_id: request.id, expires_at: request.expires_at })
  } catch (err) {
    console.error('KB request error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
