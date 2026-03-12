const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const tickers = ['MSN', 'NKG', 'CTD', 'TCB', 'VDS', 'VND']

  const { data, error } = await supabase
    .from('trading_plans')
    .update({ chart_image_url: null })
    .in('ticker', tickers)
    .select('ticker')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Đã xoá ảnh bị lỗi cho các mã:', data.map(d => d.ticker).join(', '))
  }
}

run()
