import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/kb-performance
// Returns KB leads aggregated by pillar, article, track, and time
export async function GET() {
  const supabase = createAdminClient()

  const { data: leads, error } = await supabase
    .from('kb_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = leads ?? []

  // ── Aggregate by pillar ──
  const byPillar: Record<string, number> = {}
  const byArticle: Record<string, { pillar: string; count: number }> = {}
  const byTrack: Record<string, number> = {}
  const byDay: Record<string, number> = {}

  for (const l of all) {
    const p = l.pillar || 'unknown'
    byPillar[p] = (byPillar[p] || 0) + 1

    const slug = l.article_slug || 'unknown'
    if (!byArticle[slug]) byArticle[slug] = { pillar: p, count: 0 }
    byArticle[slug].count++

    const t = l.track || 'unknown'
    byTrack[t] = (byTrack[t] || 0) + 1

    const day = l.created_at?.split('T')[0] || 'unknown'
    byDay[day] = (byDay[day] || 0) + 1
  }

  // Sort articles by count desc
  const topArticles = Object.entries(byArticle)
    .map(([slug, v]) => ({ slug, pillar: v.pillar, count: v.count }))
    .sort((a, b) => b.count - a.count)

  // Sort pillars
  const pillarRanking = Object.entries(byPillar)
    .map(([pillar, count]) => ({ pillar, count }))
    .sort((a, b) => b.count - a.count)

  // Last 30 days trend
  const last30 = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({ date, count }))

  // Recent leads (last 20)
  const recentLeads = all.slice(0, 20).map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    pillar: l.pillar,
    article_slug: l.article_slug,
    track: l.track,
    source: l.source,
    sales_code: l.sales_code,
    created_at: l.created_at,
  }))

  return NextResponse.json({
    total: all.length,
    byTrack,
    pillarRanking,
    topArticles,
    trend: last30,
    recentLeads,
  })
}
