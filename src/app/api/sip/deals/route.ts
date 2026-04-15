import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get('customerId')

  if (!customerId) return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })

  const { data, error } = await supabase
    .from('sip_deals')
    .select('*')
    .eq('customer_id', customerId)
    .order('order_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deals: data })
}
