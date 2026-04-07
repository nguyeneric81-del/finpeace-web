import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const [
      agentLeadsRes,
      kbLeadsRes,
      contentViewsRes,
      contentReactionsRes,
      rawNewsRes,
      agentLpRes,
      kbLeadsByPillarRes,
      viewsByPillarRes,
      lpStatusRes,
    ] = await Promise.all([
      supabase.from('agent_leads').select('id, crm_stage, registered_at, converted_at'),
      supabase.from('kb_leads').select('id, pillar, created_at'),
      supabase.from('content_views').select('id, content_type, pillar, created_at'),
      supabase.from('content_reactions').select('id, reaction, created_at'),
      supabase.from('raw_news').select('id, status, crawl_date').order('crawl_date', { ascending: false }).limit(200),
      supabase.from('agent_landing_pages').select('id, status, views, created_at, budget_allocated, budget_spent'),
      supabase.from('kb_leads').select('pillar').not('pillar', 'is', null),
      supabase.from('content_views').select('pillar, content_type').eq('content_type', 'knowledgebase').not('pillar', 'is', null),
      supabase.from('agent_landing_pages').select('status'),
    ])

    const agentLeads = agentLeadsRes.data || []
    const kbLeads = kbLeadsRes.data || []
    const contentViews = contentViewsRes.data || []
    const reactions = contentReactionsRes.data || []
    const rawNews = rawNewsRes.data || []
    const lps = agentLpRes.data || []
    const kbLeadsByPillarRaw = kbLeadsByPillarRes.data || []
    const viewsByPillarRaw = viewsByPillarRes.data || []
    const lpStatus = lpStatusRes.data || []

    // CRM funnel
    const crmFunnel = agentLeads.reduce<Record<string, number>>((acc, l) => {
      const stage = l.crm_stage as string
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {})

    // KB leads by pillar
    const kbByPillar = kbLeadsByPillarRaw.reduce<Record<string, number>>((acc, l) => {
      const pillar = l.pillar as string
      if (pillar) acc[pillar] = (acc[pillar] || 0) + 1
      return acc
    }, {})

    // Content views by pillar
    const viewsByPillar = viewsByPillarRaw.reduce<Record<string, number>>((acc, v) => {
      const pillar = v.pillar as string
      if (pillar) acc[pillar] = (acc[pillar] || 0) + 1
      return acc
    }, {})

    // Weekly leads trend (last 8 weeks)
    const now = new Date()
    const weeksData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7 * (7 - i))
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      const label = `T${weekStart.getDate()}/${weekStart.getMonth() + 1}`

      const agentCount = agentLeads.filter((l) => {
        const d = new Date(l.registered_at as string)
        return d >= weekStart && d < weekEnd
      }).length

      const kbCount = kbLeads.filter((l) => {
        const d = new Date(l.created_at as string)
        return d >= weekStart && d < weekEnd
      }).length

      return { label, agent: agentCount, kb: kbCount }
    })

    // News pipeline stats
    const newsStatus = { pending: 0, approved: 0, ignored: 0 }
    rawNews.forEach((n) => {
      if (n.status === 'pending') newsStatus.pending++
      else if (n.status === 'approved') newsStatus.approved++
      else newsStatus.ignored++
    })

    // LP status
    const lpByStatus = lpStatus.reduce<Record<string, number>>((acc, l) => {
      const status = l.status as string
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const totalLpViews = lps.reduce((sum, lp) => sum + ((lp.views as number) || 0), 0)
    const totalBudget = lps.reduce((sum, lp) => sum + ((lp.budget_allocated as number) || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          agent_leads_total: agentLeads.length,
          kb_leads_total: kbLeads.length,
          content_views_total: contentViews.length,
          reactions_total: reactions.length,
          lp_count: lps.length,
          lp_views_total: totalLpViews,
          raw_news_total: rawNews.length,
          news_approved: newsStatus.approved,
        },
        crm_funnel: crmFunnel,
        weekly_trend: weeksData,
        kb_by_pillar: Object.entries(kbByPillar)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([pillar, count]) => ({ pillar, count })),
        views_by_pillar: Object.entries(viewsByPillar)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([pillar, count]) => ({ pillar, count })),
        news_pipeline: newsStatus,
        lp_by_status: lpByStatus,
        budget: { allocated: totalBudget },
      },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
