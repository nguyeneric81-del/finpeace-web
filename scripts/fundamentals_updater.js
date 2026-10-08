// fundamentals_updater.js – fetches fundamentals via TradingView and upserts to Supabase
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const TradingView = require('@mathieuc/tradingview');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function today(){
  return new Date().toISOString().split('T')[0];
}

async function upsertFundamentals(tickers){
  console.log('Fetching fundamentals for', tickers.join(','));
  const fundamentals = await TradingView.getFundamentals(tickers);
  const records = fundamentals.map(f=>({
    ticker: f.ticker,
    date: today(),
    price: f.price,
    pe: f.pe,
    pb: f.pb,
    eps: f.eps,
    roe: f.roe,
    market_cap: f.marketCap,
    dividend_yield: f.dividendYield,
    piotroski_score: f.piotroskiScore,
    analyst_buy_pct: f.analystBuyPct,
    analyst_hold_pct: f.analystHoldPct,
    analyst_sell_pct: f.analystSellPct,
    source: 'tradingview',
    updated_at: new Date().toISOString()
  }));
  const {data,error}=await supabase.from('fundamental_metrics').upsert(records,{onConflict:'ticker,date'});
  if(error){console.error('Supabase upsert error:',error);process.exit(1);} 
  console.log(`Upserted ${records.length} rows.`);
}

(async()=>{const tickers=process.argv.slice(2);if(!tickers.length){console.error('Provide tickers e.g. node fundamentals_updater.js POW');process.exit(1);}await upsertFundamentals(tickers);})();
