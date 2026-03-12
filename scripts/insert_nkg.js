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
    ticker: 'NKG',
    company_name: 'CTCP Thép Nam Kim',
    timeframe: 'Trung - Dài hạn',
    strategy_name: 'Mua hỗ trợ Nền Giá',
    entry_zone: '13.5 - 14.3',
    stop_loss: '12.74',
    take_profit: '20.10',
    risk_reward: '1:4.98',
    entry_criteria: 'Mở vị thế quanh ngưỡng giá hiện tại (13.9 - 14.3) sát biên dưới của hộp tích lũy ngang. Chủ động giải ngân dần khi giá rung lắc về gần mốc 13.5.',
    analyst_note: 'Cấu trúc biểu đồ của NKG thể hiện pha Tích luỹ (Accumulation) đi ngang biên độ lớn kể từ cuối năm 2022. Hiện tại, hành động giá đang co cụm và lùi về kiểm định hỗ trợ của một chiếc hộp (Darvas) nhỏ nội bộ. Xét về tính cân xứng thời gian & giá (Price-Time Symmetry), điểm mua ở sát cạnh dưới mang lại một vị thế an toàn có rủi ro rất thấp (Cắt lỗ dứt khoát nếu thủng 12.74) trong khi giữ biên kỳ vọng rộng mở lên tận vùng target 20. Đây là ván cược sinh lời lý tưởng cho dòng tiền nhàn rỗi kiên nhẫn tích luỹ tài sản.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', // Temporary placeholder
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting NKG:', error)
  } else {
    console.log('Successfully inserted NKG trading plan:', data)
  }
}

run()
