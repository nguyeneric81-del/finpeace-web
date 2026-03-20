import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // ─── 1. LP Views + Leads ────────────────────────────────────────────────────
  const { data: views7d } = await supabase.from('lp_views').select('id').gte('created_at', since7d)
  const { data: leads7dData } = await supabase.from('agent_leads')
    .select('id, crm_stage, phone, created_at').gte('created_at', since7d)
  const { data: allLeadsData } = await supabase.from('agent_leads').select('id, crm_stage, phone')

  const totalViews7d = views7d?.length ?? 0
  const leads7d = leads7dData ?? []
  const allLeads = allLeadsData ?? []
  const totalLeads7d = leads7d.length
  const validPhoneRe = /^0[35789]\d{8}$/
  const validPhones = allLeads.filter(l => l.phone && validPhoneRe.test(l.phone.replace(/\s/g, '')))
  const validPhoneRate = allLeads.length > 0 ? Math.round((validPhones.length / allLeads.length) * 100) : 0
  const cr = totalViews7d > 0 ? +(totalLeads7d / totalViews7d * 100).toFixed(1) : 0
  const stageCounts = { new: 0, contacted: 0, qualified: 0, opened: 0 }
  for (const l of allLeads) {
    const s = l.crm_stage as keyof typeof stageCounts
    if (s in stageCounts) stageCounts[s]++
  }

  // ─── 2. Campaign breakdown ──────────────────────────────────────────────────
  type CampaignRow = {
    id: string; slug: string | null; campaign_name: string | null
    status: string | null; agent_code: string | null; agent_name: string | null
    views_7d: number | null; leads_7d: number | null; budget_allocated: number | null
  }
  let byCampaign: CampaignRow[] = []
  try {
    const { data } = await supabase.from('lp_campaign_stats')
      .select('id, slug, campaign_name, status, agent_code, agent_name, views_7d, leads_7d, budget_allocated')
      .order('leads_7d', { ascending: false })
    byCampaign = (data ?? []) as CampaignRow[]
  } catch {
    const { data } = await supabase.from('agent_landing_pages').select('id, slug, campaign_name, status, agent_id, budget_allocated')
    byCampaign = (data ?? []).map((c: { id: string; slug?: string | null; campaign_name?: string | null; status?: string | null; budget_allocated?: number | null }) => ({
      ...c, agent_code: null, agent_name: null, views_7d: 0, leads_7d: 0,
    })) as CampaignRow[]
  }

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
    agent_code: code, agent_name: AGENT_NAMES[code] ?? code, ...stats,
    cr: stats.views > 0 ? +(stats.leads / stats.views * 100).toFixed(1) : 0,
  })).sort((a, b) => b.leads - a.leads)

  const totalBudget = byCampaign.reduce((s, c) => s + (c.budget_allocated ?? 0), 0)
  const totalConverted = stageCounts.qualified + stageCounts.opened
  const cac = totalConverted > 0 ? Math.round(totalBudget / totalConverted) : null

  // ─── 3. Content Analytics ───────────────────────────────────────────────────
  const { data: contentViews7d } = await supabase.from('content_views')
    .select('slug, content_type, pillar').gte('created_at', since7d)
  const { data: reactions } = await supabase.from('content_reactions')
    .select('slug, content_type, pillar, reaction')

  const viewsBySlug: Record<string, { slug: string; content_type: string; pillar: string | null; views: number }> = {}
  for (const v of contentViews7d ?? []) {
    if (!viewsBySlug[v.slug]) viewsBySlug[v.slug] = { slug: v.slug, content_type: v.content_type, pillar: v.pillar, views: 0 }
    viewsBySlug[v.slug].views++
  }
  const topByViews = Object.values(viewsBySlug).sort((a, b) => b.views - a.views).slice(0, 10)

  const reactionsBySlug: Record<string, { slug: string; content_type: string; pillar: string | null; likes: number; loves: number; total: number }> = {}
  for (const r of reactions ?? []) {
    if (!reactionsBySlug[r.slug]) reactionsBySlug[r.slug] = { slug: r.slug, content_type: r.content_type, pillar: r.pillar, likes: 0, loves: 0, total: 0 }
    if (r.reaction === 'like') reactionsBySlug[r.slug].likes++
    if (r.reaction === 'love') reactionsBySlug[r.slug].loves++
    reactionsBySlug[r.slug].total++
  }
  const topByReactions = Object.values(reactionsBySlug).sort((a, b) => b.total - a.total).slice(0, 10)

  // ─── 4. KB Account Requests ─────────────────────────────────────────────────
  const { data: kbRequestsPending } = await supabase.from('kb_account_requests')
    .select('*').eq('status', 'pending').order('requested_at', { ascending: false }).limit(20)
  const { data: kbRequestsCounts } = await supabase.from('kb_account_requests').select('status')
  const kbCounts = { pending: 0, completed: 0, expired: 0 }
  for (const r of kbRequestsCounts ?? []) {
    const s = r.status as keyof typeof kbCounts
    if (s in kbCounts) kbCounts[s]++
  }

  return NextResponse.json({
    kpis: { views_7d: totalViews7d, leads_7d: totalLeads7d, cr_pct: cr, valid_phone_rate: validPhoneRate, cac, total_leads_all_time: allLeads.length },
    funnel: { views: totalViews7d, new: stageCounts.new, contacted: stageCounts.contacted, qualified: stageCounts.qualified, opened: stageCounts.opened },
    by_campaign: byCampaign.slice(0, 20),
    by_agent: byAgentArr,
    content: { top_by_views: topByViews, top_by_reactions: topByReactions },
    kb_requests: { counts: kbCounts, pending: kbRequestsPending ?? [] },
  })
}
