const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data } = await supabase.from('sip_service_plans').select('stock_code');
  const unique = Array.from(new Set(data.map(d => d.stock_code)));
  console.log("Tickers tracked in SIP:", unique);
}

check();
