import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: lấy portfolio + trading plans gần nhất của user
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) return NextResponse.json({ error: 'Thiếu user_id' }, { status: 400 })

    // Lấy portfolio gần nhất
    const { data: portfolio } = await supabase
        .from('customer_portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!portfolio || !portfolio.extracted_tickers?.length) {
        return NextResponse.json({ result: null })
    }

    const tickers: string[] = portfolio.extracted_tickers

    // Lấy trading plans phù hợp
    const { data: plans } = await supabase
        .from('trading_plans')
        .select('*')
        .in('ticker', tickers)
        .eq('status', 'active')

    const matchedTickers = (plans || []).map((p: any) => p.ticker)
    const pendingTickers = tickers.filter(t => !matchedTickers.includes(t))

    return NextResponse.json({
        result: {
            extracted_tickers: tickers,
            matched_plans: plans || [],
            pending_tickers: pendingTickers
        }
    })
}
