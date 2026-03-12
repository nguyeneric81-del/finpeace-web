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
    ticker: 'VDS',
    company_name: 'CTCP Chứng khoán Rồng Việt',
    timeframe: 'Trung - Dài hạn',
    strategy_name: 'Mua tại Cạnh dưới Tam giác tích luỹ',
    entry_zone: '13.0 - 14.5',
    stop_loss: '11.76',
    take_profit: '21.38',
    risk_reward: '1:4.62',
    entry_criteria: 'Mở vị thế gom dần khi giá điều chỉnh về vùng hội tụ hỗ trợ (từ 13.0 đến sát 14.5). Điểm Entry lý tưởng mô phỏng trên chart là 13.47.',
    analyst_note: 'VDS đang bóp biên độ giao dịch rất chặt trong cấu trúc mẫu hình Tam giác. Giá lùi về cạnh dưới kết hợp với nhịp cạn Volume là một điểm tựa rủi ro cực tốt. Điểm Stop Loss 11.76 tuy khá sâu để phòng thủ các cú Spring rũ bỏ, nhưng bù lại mang đến tỷ suất R:R ~4.6 lần. Cấu trúc Price-Time Symmetry cho thấy đây là giai đoạn cuối của quá trình nén lực, sẵn sàng cho một nhịp nổ thanh khoản.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', 
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting VDS:', error)
  } else {
    console.log('Successfully inserted VDS trading plan:', data)
  }
}

run()
