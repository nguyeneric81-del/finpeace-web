import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const supabase = await createClient()

  const [plansRes, txRes, snapRes] = await Promise.all([
    supabase
      .from('sip_service_plans')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true }),
    supabase
      .from('sip_transactions')
      .select('id, stock_code, order_date, unit, total_value, buy_price')
      .eq('user_id', userId)
      .order('order_date', { ascending: false }),
    supabase
      .from('sip_performance_snapshots')
      .select('month, stock_code, cumulative_nav, sip_return_pct, vnindex_return_pct')
      .eq('user_id', userId)
      .order('month', { ascending: false }),
  ])

  return NextResponse.json({
    plans: plansRes.data || [],
    transactions: txRes.data || [],
    snapshots: snapRes.data || [],
  })
}
