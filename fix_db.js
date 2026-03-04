const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  const fptSeries = [60,62,63,65,66,68,70,71,73,75,76,78,79,80,82,85,88,90,93,95];
  const ssiSeries = [30,31,31,30,29,31,32,32,33,34,35,36,36,37,38,39,39,40,41,42];
  
  await supabase.from('trading_plans').update({ price_series: fptSeries }).eq('ticker', 'FPT');
  await supabase.from('trading_plans').update({ price_series: ssiSeries }).eq('ticker', 'SSI');
  console.log("DB Fixed.");
}
fix();
