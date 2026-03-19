import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/news-today
// Đọc macro_insights mới nhất từ Supabase (fed daily by macro_insights_feeder.py)
export async function GET(req: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') ?? '10')

  const { data, error } = await supabase
    .from('macro_insights')
    .select(`
      id, topic_slug, title, category, date_label, data_point,
      analyst_view, impact_value, companies, key_stats, published
    `)
    .eq('published', true)
    .order('id', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[/api/admin/news-today] Supabase error:', error)
    return NextResponse.json({ articles: [], error: error.message })
  }

  const articles = (data ?? []).map((item, idx) => ({
    id: `insight-${item.id}`,
    topic_slug: item.topic_slug,
    title: item.title,
    category: item.category ?? 'Vĩ Mô',
    date_label: item.date_label ?? '',
    analyst_view: item.analyst_view ?? null,
    impact_value: item.impact_value ?? null,
    companies: (item.companies ?? []) as { ticker: string; name: string; plan: string }[],
    key_stats: (item.key_stats ?? []) as { label: string; value: string; positive: boolean }[],
    kb_article: null,
    kb_article_slug: null,
    impact_score: Math.max(1, 3 - Math.floor(idx / 2)) as 1 | 2 | 3,
  }))

  return NextResponse.json({
    articles,
    date: null,
    is_today: true,
    source: 'supabase',
  })
}
