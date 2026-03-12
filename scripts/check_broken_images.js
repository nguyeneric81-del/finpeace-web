const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabase
    .from('trading_plans')
    .select('ticker, chart_image_url')
    .eq('chart_image_url', 'https://i.ibb.co/6PZkVg8/ctd-chart.png')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Mã bị lỗi ảnh:', data.map(d => d.ticker).join(', '))
  }
}

run()
