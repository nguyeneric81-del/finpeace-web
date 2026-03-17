import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { SALES_CONFIG } from '@/lib/salesConfig'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST /api/cron/lead-digest — call weekly (e.g., every Monday 8am)
export async function POST() {
  const supabase = await createClient()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Get new leads per agent (last 7 days)
  const { data: leads } = await supabase
    .from('agent_leads')
    .select(`
      id, full_name, phone, email, registered_at, ref_code,
      agent_landing_pages!landing_page_id(slug, campaign_name)
    `)
    .gte('registered_at', weekAgo.toISOString())
    .order('registered_at', { ascending: false })

  if (!leads || leads.length === 0) {
    return NextResponse.json({ message: 'No leads this week, no emails sent.' })
  }

  // Group by agent ref_code
  const byAgent: Record<string, typeof leads> = {}
  for (const lead of leads) {
    const code = lead.ref_code
    if (!byAgent[code]) byAgent[code] = []
    byAgent[code].push(lead)
  }

  const results: { agent: string; sent: boolean; count: number }[] = []

  for (const [agentCode, agentLeads] of Object.entries(byAgent)) {
    const salesInfo = SALES_CONFIG[agentCode as keyof typeof SALES_CONFIG]
    if (!salesInfo?.email) continue

    const leadRows = agentLeads
      .map((l, i) => {
        const lp = l.agent_landing_pages as any
        const date = new Date(l.registered_at).toLocaleDateString('vi-VN')
        return `
        <tr style="border-bottom:1px solid #1e2535;">
          <td style="padding:10px;color:#e2e8f0;">${i + 1}. ${l.full_name || '—'}</td>
          <td style="padding:10px;color:#7dd3fc;">${l.phone || '—'}</td>
          <td style="padding:10px;color:#94a3b8;">${l.email || '—'}</td>
          <td style="padding:10px;color:#c4a67a;">${date}</td>
          <td style="padding:10px;color:#6ee7b7;font-size:12px;">${lp?.campaign_name || lp?.slug || '—'}</td>
        </tr>`
      })
      .join('')

    const html = `
<!DOCTYPE html>
<html>
<body style="background:#0d1119;font-family:'Inter',sans-serif;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#111827;border-radius:12px;padding:24px;border:1px solid #1e2535;">
      <div style="margin-bottom:20px;">
        <span style="color:#c4a67a;font-size:14px;text-transform:uppercase;letter-spacing:2px;">FinPeace</span>
        <h2 style="color:#f1f5f9;margin:8px 0;">📊 Leads tuần này — ${salesInfo.name}</h2>
        <p style="color:#64748b;margin:0;">Tuần từ ${weekAgo.toLocaleDateString('vi-VN')} đến ${now.toLocaleDateString('vi-VN')}</p>
      </div>

      <div style="background:#0f172a;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="color:#c4a67a;font-size:28px;font-weight:bold;margin:0;">${agentLeads.length} leads mới</p>
        <p style="color:#64748b;margin:4px 0 0;">Liên hệ ngay để convert thành tài khoản KB</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#1e2535;">
            <th style="padding:10px;text-align:left;color:#94a3b8;font-size:12px;">#</th>
            <th style="padding:10px;text-align:left;color:#94a3b8;font-size:12px;">SĐT</th>
            <th style="padding:10px;text-align:left;color:#94a3b8;font-size:12px;">Email</th>
            <th style="padding:10px;text-align:left;color:#94a3b8;font-size:12px;">Ngày ĐK</th>
            <th style="padding:10px;text-align:left;color:#94a3b8;font-size:12px;">Campaign</th>
          </tr>
        </thead>
        <tbody>${leadRows}</tbody>
      </table>

      <div style="margin-top:24px;padding:16px;background:#1e2535;border-radius:8px;">
        <p style="color:#64748b;font-size:12px;margin:0;">
          Email tự động gửi hàng tuần (thứ Hai 8:00) — FinPeace Advisory System
        </p>
      </div>
    </div>
  </div>
</body>
</html>`

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'FinPeace <advisor@finpeace.cloud>',
      to: [salesInfo.email],
      cc: ['nguyeneric81@gmail.com', 'yenle@finpeace.vn'],
      subject: `📊 ${agentLeads.length} leads tuần này — ${salesInfo.name} | FinPeace`,
      html,
    })

    results.push({ agent: agentCode, sent: !error, count: agentLeads.length })
  }

  return NextResponse.json({ results, total_leads: leads.length })
}

// GET — manual trigger check
export async function GET() {
  return NextResponse.json({ message: 'Lead digest cron ready. POST to trigger.' })
}
