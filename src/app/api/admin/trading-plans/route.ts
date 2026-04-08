import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const execStatus = req.nextUrl.searchParams.get('exec_status') || 'all'

  let query = supabase
    .from('trading_plans')
    .select(`
      id, ticker, company_name, sector, status, exec_status,
      entry_zone, stop_loss, take_profit, risk_reward, conviction_level,
      bought_price, bought_at, holding_since,
      sold_half_price, sold_half_at,
      sold_all_price, sold_all_at,
      exec_note, created_at, is_confirmed
    `)
    .order('created_at', { ascending: false })

  if (execStatus !== 'all') {
    query = query.eq('exec_status', execStatus)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ plans: data || [] })
}
