import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/raw-news?date=2026-03-19&status=pending&category=macro
// Returns raw crawled news for News Intelligence tab
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get('date')  // YYYY-MM-DD, default today
  const status = searchParams.get('status')   // pending|approved|ignored|all
  const category = searchParams.get('category')

  const supabase = createAdminClient()

  let query = supabase
    .from('raw_news')
    .select('id, crawl_date, title, link, description, source, published_at, tags, category, tickers, relevance, status')
    .order('relevance', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100)

  if (dateParam) {
    query = query.eq('crawl_date', dateParam)
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ articles: [], error: error.message })

  // Get distinct available dates for nav
  const { data: dates } = await supabase
    .from('raw_news')
    .select('crawl_date')
    .order('crawl_date', { ascending: false })
    .limit(10)

  const distinctDates = [...new Set((dates ?? []).map(d => d.crawl_date))]

  return NextResponse.json({
    articles: data ?? [],
    available_dates: distinctDates,
    current_date: dateParam ?? null,
  })
}
