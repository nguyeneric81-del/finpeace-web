import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const tier = req.nextUrl.searchParams.get('tier') || 'FREE'
  const userId = req.nextUrl.searchParams.get('userId')

  // Fetch active trading plans
  const { data: plans, error } = await supabase
    .from('trading_plans')
    .select(`
      id, ticker, company_name, strategy_name, timeframe,
      entry_zone, stop_loss, take_profit, risk_reward,
      sector, risk_level, conviction_level,
      analyst_note, catalyst_note, is_confirmed,
      expected_holding_days, capital_allocation_pct,
      chart_image_url, status, created_at
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

  let stockspick_credits = 0
  let unlockedDealIds = new Set<string>()

  // Fetch credits and unlocked deals for Bronze
  if (userId && tier === 'BRONZE') {
    const { data: profile } = await supabase
      .from('advisor_users')
      .select('stockspick_credits')
      .eq('id', userId)
      .single()
    
    if (profile) stockspick_credits = profile.stockspick_credits || 0

    const { data: unlockedData } = await supabase
      .from('user_unlocked_deals')
      .select('deal_id')
      .eq('user_id', userId)
    
    if (unlockedData) {
      unlockedData.forEach(ud => unlockedDealIds.add(ud.deal_id))
    }
  }

  const FREE_DEALS_COUNT = 3
  const MAX_FREE_BLURRED = 5
  
  const totalDeals = merged.length
  let visibleDeals = []
  let lockedCount = 0

  if (tier === 'FREE') {
    // 3 deals unlock mồi, 5 deals mờ
    const freeFull = merged.slice(0, FREE_DEALS_COUNT).map(d => ({ ...d, is_locked: false }))
    const freeBlurred = merged.slice(FREE_DEALS_COUNT, FREE_DEALS_COUNT + MAX_FREE_BLURRED).map(d => ({
      id: d.id,
      ticker: d.ticker,
      company_name: d.company_name,
      sector: d.sector,
      created_at: d.created_at,
      status: d.status,
      is_confirmed: d.is_confirmed,
      is_locked: true,
      strategy_name: d.strategy_name,
      // hide details
      entry_zone: null, stop_loss: null, take_profit: null, risk_reward: '0', risk_level: null, timeframe: null,
      analyst_note: null, catalyst_note: null, chart_image_url: null, signal: null
    }))
    
    visibleDeals = [...freeFull, ...freeBlurred]
    lockedCount = Math.max(0, totalDeals - FREE_DEALS_COUNT) // All others are technically locked
  } else {
    // BRONZE
    visibleDeals = merged.map((d, index) => {
      // Đầu tiên 3 deal luôn free
      const isFreePool = index < FREE_DEALS_COUNT
      const isUnlockedByUser = unlockedDealIds.has(d.id)
      const isLocked = !isFreePool && !isUnlockedByUser

      if (isLocked) {
        return {
          id: d.id,
          ticker: d.ticker,
          company_name: d.company_name,
          sector: d.sector,
          created_at: d.created_at,
          status: d.status,
          is_confirmed: d.is_confirmed,
          is_locked: true,
          strategy_name: d.strategy_name,
          // Hide details
          entry_zone: null, stop_loss: null, take_profit: null, risk_reward: '0', risk_level: null, timeframe: null,
          analyst_note: null, catalyst_note: null, chart_image_url: null, signal: null
        }
      }

      return { ...d, is_locked: false }
    })
    lockedCount = visibleDeals.filter(d => d.is_locked).length
  }

  return NextResponse.json({
    deals: visibleDeals,
    totalDeals,
    lockedCount,
    tier,
    credits: stockspick_credits
  })
}
