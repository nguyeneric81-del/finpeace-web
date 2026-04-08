import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/** Add N business days (skip Sat/Sun) */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dow = result.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return result
}

export async function GET(req: NextRequest) {
  // Find all plans with exec_status = 'bought' where T+2 has passed
  const now = new Date()

  const { data: plans, error } = await supabase
    .from('trading_plans')
    .select('id, ticker, bought_at, holding_since')
    .eq('exec_status', 'bought')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const toPromote = (plans || []).filter(p => {
    if (!p.bought_at) return false
    const holdingSince = p.holding_since
      ? new Date(p.holding_since)
      : addBusinessDays(new Date(p.bought_at), 2)
    return now >= holdingSince
  })

  if (toPromote.length === 0) {
    return NextResponse.json({ promoted: 0, message: 'Không có plan nào cần promote' })
  }

  const ids = toPromote.map(p => p.id)
  const { error: updateErr } = await supabase
    .from('trading_plans')
    .update({ exec_status: 'holding', holding_since: now.toISOString() })
    .in('id', ids)
    .eq('exec_status', 'bought') // safety guard

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    promoted: toPromote.length,
    tickers: toPromote.map(p => p.ticker),
  })
}
