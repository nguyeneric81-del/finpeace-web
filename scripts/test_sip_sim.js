const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data } = await supabase.from('sip_performance_snapshots')
    .select('month, sip_return_pct')
    .eq('stock_code', 'SSI')
    .order('month', { ascending: true })
    .limit(100);
  
  const unique = Array.from(new Set(data.map(d => JSON.stringify({m: d.month, ret: d.sip_return_pct}))))
    .map(s => JSON.parse(s))
    .sort((a,b) => a.m.localeCompare(b.m));
    
  console.log(unique);
}

check();
