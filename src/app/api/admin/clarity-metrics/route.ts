import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/clarity-metrics
// Trả về full-funnel metrics cho Clarity Monitor Performance tab
export async function GET() {
  const supabase = createAdminClient()

  // 1. LP Views (7d) — từ lp_views
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: views7d } = await supabase
    .from('lp_views')
    .select('id, lp_id, created_at')
    .gte('created_at', since7d)

  const totalViews7d = views7d?.length ?? 0

  // 2. Leads (7d) — từ agent_leads
  const { data: leads7dData } = await supabase
    .from('agent_leads')
    .select('id, landing_page_id, crm_stage, phone, created_at, ref_code')
    .gte('created_at', since7d)
    .order('created_at', { ascending: false })

  const leads7d = leads7dData ?? []
  const totalLeads7d = leads7d.length

  // 3. All leads — để tính funnel stage breakdown
  const { data: allLeadsData } = await supabase
    .from('agent_leads')
    .select('id, crm_stage, phone')

  const allLeads = allLeadsData ?? []

  // SĐT valid: bắt đầu bằng 0 và có 9-10 chữ số
  const validPhoneRe = /^0[35789]\d{8}$/
  const validPhones = allLeads.filter(l => l.phone && validPhoneRe.test(l.phone.replace(/\s/g, '')))
  const validPhoneRate = allLeads.length > 0
    ? Math.round((validPhones.length / allLeads.length) * 100)
    : 0

  // 4. Funnel stage breakdown (tất cả thời gian)
  const stageCounts = { new: 0, contacted: 0, qualified: 0, opened: 0 }
  for (const l of allLeads) {
    const s = l.crm_stage as keyof typeof stageCounts
    if (s in stageCounts) stageCounts[s]++
  }

  // 5. CR%
  const cr = totalViews7d > 0 ? +(totalLeads7d / totalViews7d * 100).toFixed(1) : 0

  // 6. By campaign — lấy từ lp_campaign_stats nếu có
  type CampaignRow = {
    id: string
    slug: string | null
    campaign_name: string | null
    status: string | null
    agent_code: string | null
    agent_name: string | null
    views_7d: number | null
    leads_7d: number | null
    budget_allocated: number | null
  }

  let byCampaign: CampaignRow[] = []
  try {
    const { data } = await supabase
      .from('lp_campaign_stats')
      .select('id, slug, campaign_name, status, agent_code, agent_name, views_7d, leads_7d, budget_allocated')
      .order('leads_7d', { ascending: false })
    byCampaign = (data ?? []) as CampaignRow[]
  } catch {
    // fallback nếu view không tồn tại
    const { data } = await supabase
      .from('agent_landing_pages')
      .select('id, slug, campaign_name, status, agent_id, budget_allocated, approved_at')
    byCampaign = (data ?? []).map((c: { id: string; slug?: string | null; campaign_name?: string | null; status?: string | null; agent_id?: string | null; budget_allocated?: number | null }) => ({
      ...c,
      agent_code: null,
      agent_name: null,
      views_7d: 0,
      leads_7d: 0,
    })) as CampaignRow[]
  }

  // 7. By agent aggregate
  const AGENT_NAMES: Record<string, string> = {
    mq01: 'Minh Quang', aduc02: 'Anh Đức', thuy03: 'Lê Thuỷ', huyen04: 'Minaviko', mduc05: 'Minh Đức'
  }
  const byAgent: Record<string, { views: number; leads: number; campaigns: number }> = {}
  for (const c of byCampaign) {
    const code = c.agent_code ?? 'unknown'
    if (!byAgent[code]) byAgent[code] = { views: 0, leads: 0, campaigns: 0 }
    byAgent[code].views += c.views_7d ?? 0
    byAgent[code].leads += c.leads_7d ?? 0
    byAgent[code].campaigns++
  }

  const byAgentArr = Object.entries(byAgent).map(([code, stats]) => ({
    agent_code: code,
    agent_name: AGENT_NAMES[code] ?? code,
    ...stats,
    cr: stats.views > 0 ? +(stats.leads / stats.views * 100).toFixed(1) : 0,
  })).sort((a, b) => b.leads - a.leads)

  // 8. Budget / CAC
  const totalBudget = byCampaign.reduce((s, c) => s + (c.budget_allocated ?? 0), 0)
  const totalConverted = stageCounts.qualified + stageCounts.opened
  const cac = totalConverted > 0 ? Math.round(totalBudget / totalConverted) : null

  return NextResponse.json({
    kpis: {
      views_7d: totalViews7d,
      leads_7d: totalLeads7d,
      cr_pct: cr,
      valid_phone_rate: validPhoneRate,
      cac,
      total_leads_all_time: allLeads.length,
    },
    funnel: {
      views: totalViews7d,
      new: stageCounts.new,
      contacted: stageCounts.contacted,
      qualified: stageCounts.qualified,
      opened: stageCounts.opened,
    },
    by_campaign: byCampaign.slice(0, 20),
    by_agent: byAgentArr,
  })
}
