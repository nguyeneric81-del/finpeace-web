const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const newPlan = {
    ticker: 'CTD',
    company_name: 'CTCP Xây dựng Coteccons',
    timeframe: 'Dài hạn (Long-term)',
    strategy_name: 'Mua hỗ trợ Kênh giá tăng',
    entry_zone: '75.0 - 79.0',
    stop_loss: '68.0',
    take_profit: '109.0',
    risk_reward: '1:3.1',
    entry_criteria: 'Mở vị thế khi giá tiệm cận cạnh dưới của kênh giá tăng màu cam (vùng 78.x). Ưu tiên gia tăng tỷ trọng khi xuất hiện các phiên rút chân hoặc Vol cạn kiệt tại vùng hỗ trợ này.',
    analyst_note: 'Cấu trúc dài hạn của CTD cho thấy cổ phiếu đã bứt phá khỏi trendline giảm từ đỉnh 2018 và đang thiết lập một kênh tăng giá trung-dài hạn rất ổn định. Nhịp điều chỉnh gần đây đưa giá về test lại đúng cạnh dưới của kênh giá định hướng. Với điểm tựa rủi ro rõ ràng (Stoploss ~68) và vùng target rộng (109), đây là cơ hội mở vị thế lý tưởng theo phương pháp Price-Time Symmetry.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', 
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting CTD:', error)
  } else {
    console.log('Successfully inserted CTD trading plan:', data)
  }
}

run()
