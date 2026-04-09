import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { data, error } = await supabase
    .from('trading_plans')
    .select('ticker, status, exec_status, created_at, is_confirmed')
    .eq('status', 'active')
    .order('is_confirmed', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (data) {
     console.log(`Total active plans: ${data.length}`);
     data.forEach((p, idx) => console.log(`${idx}: ${p.ticker} (exec_status: ${p.exec_status}, created_at: ${p.created_at})`))
  }
}
run()
