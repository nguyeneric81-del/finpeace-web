const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const tickers = ['CTD', 'MSN', 'NKG', 'TCB', 'VDS', 'VND'];
  for (const ticker of tickers) {
    const chartUrl = `/charts/${ticker}.png`;
    const { error } = await supabase
      .from('trading_plans')
      .update({ chart_image_url: chartUrl })
      .eq('ticker', ticker);
    if (error) console.error(`Error updating ${ticker}:`, error);
    else console.log(`Updated ${ticker} with ${chartUrl}`);
  }
}
run();
