import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch macro insights
    const { data: macroInsights } = await supabase
      .from('macro_insights')
      .select('id, title, category, data_point, analyst_view, accent_color, impact_positive, date_label, narrow_industry, companies, key_stats')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(6)

    // Fetch KB articles
    const { data: kbArticles } = await supabase
      .from('kb_articles')
      .select('id, slug, pillar, title, summary')
      .order('created_at', { ascending: false })
      .limit(8)

    // Fetch trading stats
    const { data: tradingStats } = await supabase
      .from('trading_plans')
      .select('exec_status')
      .eq('status', 'active')

    const stats = {
      total: tradingStats?.length || 0,
      waiting: tradingStats?.filter(t => t.exec_status === 'waiting_buy').length || 0,
      bought: tradingStats?.filter(t => t.exec_status === 'bought').length || 0,
      holding: tradingStats?.filter(t => t.exec_status === 'holding').length || 0,
      partial: tradingStats?.filter(t => t.exec_status === 'partial_sold').length || 0,
    }

    // Fetch recent raw news (approved)
    const { data: recentNews } = await supabase
      .from('raw_news')
      .select('id, title, source, published_at, category, tickers')
      .eq('status', 'approved')
      .order('published_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      macroInsights: macroInsights || [],
      kbArticles: kbArticles || [],
      stats,
      recentNews: recentNews || [],
    })
  } catch (error) {
    console.error('Home API error:', error)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}
