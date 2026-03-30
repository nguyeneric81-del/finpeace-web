import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/stock-price?ticker=FPT
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const ticker = searchParams.get('ticker')?.toUpperCase()

    if (!ticker) {
        return NextResponse.json({ error: 'Missing ticker' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('stock_prices')
        .select('ticker, price, date')
        .eq('ticker', ticker)
        .order('date', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        return NextResponse.json({ ticker, price: null, date: null })
    }

    return NextResponse.json({
        ticker: data.ticker,
        price: data.price,
        date: data.date,
    })
}
