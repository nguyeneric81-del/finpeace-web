const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabase.from('trading_plans').select('ticker, chart_image_url').in('ticker', ['VHM', 'MSN'])
  console.log(data)
}
run();
