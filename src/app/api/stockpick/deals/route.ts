import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const tier = req.nextUrl.searchParams.get('tier') || 'FREE'

  // Fetch active trading plans
  const { data: plans, error } = await supabase
    .from('trading_plans')
    .select(`
      id, ticker, company_name, strategy_name, timeframe,
      entry_zone, stop_loss, take_profit, risk_reward,
      sector, risk_level, conviction_level,
      analyst_note, catalyst_note, is_confirmed,
      expected_holding_days, chart_image_url, status,
      created_at
    `)
    .eq('status', 'active')
    .order('is_confirmed', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !plans) {
    return NextResponse.json({ error: 'Không thể tải dữ liệu' }, { status: 500 })
  }

  // Fetch latest price signals for all tickers
  const tickers = [...new Set(plans.map(p => p.ticker))]
  const { data: signals } = await supabase
    .from('price_signals')
    .select('ticker, current_price, signal_type, signal_label, signal_detail, generated_at')
    .in('ticker', tickers)
    .order('generated_at', { ascending: false })

  // Map latest signal per ticker
  const signalMap: Record<string, any> = {}
  signals?.forEach(s => {
    if (!signalMap[s.ticker]) signalMap[s.ticker] = s
  })

  // Merge and deduplicate by ticker (take first/latest per ticker)
  const seen = new Set<string>()
  const merged = plans
    .filter(p => {
      if (seen.has(p.ticker)) return false
      seen.add(p.ticker)
      return true
    })
    .map(p => ({
      ...p,
      signal: signalMap[p.ticker] || null,
    }))

  const totalDeals = merged.length

  // Tier limits: FREE = 3, BRONZE = 10
  const limit = tier === 'BRONZE' ? 10 : 3
  const visibleDeals = merged.slice(0, limit)
  const lockedCount = Math.max(0, totalDeals - limit)

  return NextResponse.json({
    deals: visibleDeals,
    totalDeals,
    lockedCount,
    tier,
  })
}
