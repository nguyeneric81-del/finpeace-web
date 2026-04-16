import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tickersParam = searchParams.get('tickers')

  if (!tickersParam) {
    return NextResponse.json({ error: 'Missing tickers parameter' }, { status: 400 })
  }

  const tickers = tickersParam.split(',').map(t => t.trim().toUpperCase())

  // We fetch the latest published valuation reports for these tickers
  const { data, error } = await supabase
    .from('sip_asset_valuations')
    .select('*')
    .in('stock_code', tickers)
    .eq('status', 'PUBLISHED')
    .order('update_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Supabase returns all versions, we only want the LATEST one per ticker if there are multiple.
  const latestValuations = data.reduce((acc: any[], current) => {
    const x = acc.find(item => item.stock_code === current.stock_code);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return NextResponse.json({ valuations: latestValuations })
}
