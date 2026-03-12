require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function go() {
    const userId = '8e1ba6ed-24a0-47df-b7d5-edc0b472af1b'
    
    // API logic:
    const { data: portfolio } = await supabase
        .from('customer_portfolios')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single()
    
    console.log(portfolio ? 'Portfolio found' : 'No portfolio')
    if (!portfolio) {
        return console.log('Returned null')
    }

    const tickers = portfolio.extracted_tickers || []
    console.log('Tickers', tickers)

    if (!tickers.length) {
        return console.log('No tickers')
    }

    const { data: plans } = await supabase
        .from('trading_plans')
        .select('*')
        .in('ticker', tickers)
        .eq('status', 'active')
    
    console.log('Plans found', plans?.length)

    const matchedTickers = (plans || []).map(p => p.ticker)
    const { data: signals } = await supabase
        .from('price_signals')
        .select('*')
        .in('ticker', matchedTickers)
        .eq('date', new Date().toISOString().split('T')[0])
    
    console.log('Signals found', signals?.length)
}
go()
