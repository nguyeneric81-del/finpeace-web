import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

// GET: lấy portfolio + trading plans gần nhất của user
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) return NextResponse.json({ error: 'Thiếu user_id' }, { status: 400 })

    // Lấy portfolio gần nhất
    const { data: portfolio, error } = await supabase
        .from('customer_portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single()

    if (error || !portfolio) {
        return NextResponse.json({ result: null, error: error?.message || 'Not found' })
    }

    const tickers: string[] = portfolio.extracted_tickers || []

    if (!tickers.length) {
        return NextResponse.json({
            result: {
                extracted_tickers: [],
                matched_plans: [],
                pending_tickers: []
            }
        })
    }

    // Lấy trading plans phù hợp
    const { data: plans } = await supabase
        .from('trading_plans')
        .select('*')
        .in('ticker', tickers)
        .eq('status', 'active')

    // Fetch the latest signals for these matched plans today
    const matchedTickers = (plans || []).map((p: any) => p.ticker)
    
    let latestSignals = []
    if (matchedTickers.length > 0) {
        const { data: signals } = await supabase
            .from('price_signals')
            .select('*')
            .in('ticker', matchedTickers)
            .eq('date', new Date().toISOString().split('T')[0])
            
        latestSignals = signals || []
    }

    // Gắn signal vào plan
    const enhancedPlans = (plans || []).map((p: any) => {
        const signal = latestSignals.find(s => s.ticker === p.ticker)
        return {
            ...p,
            latest_signal: signal ? {
                type: signal.signal_type,
                label: signal.signal_label,
                current_price: signal.current_price,
                detail: signal.signal_detail
            } : null
        }
    })

    const pendingTickers = tickers.filter(t => !matchedTickers.includes(t))

    return NextResponse.json({
        result: {
            extracted_tickers: tickers,
            matched_plans: enhancedPlans,
            pending_tickers: pendingTickers,
            allocation_assessment: portfolio.allocation_assessment
        }
    })
}
