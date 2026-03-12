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
    ticker: 'TCB',
    company_name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    timeframe: 'Trung - Dài hạn',
    strategy_name: 'Mua hỗ trợ Kênh giá chéo (Trendline Support)',
    entry_zone: '29.5 - 31.5',
    stop_loss: '27.16',
    take_profit: '41.46',
    risk_reward: '1:3.91',
    entry_criteria: 'Mở vị thế khi giá điều chỉnh về cận dưới của kênh giá tăng (vùng 29.5 - 31.5). Đặc biệt lưu ý giải ngân mạnh khi có tín hiệu nến rút chân quanh mốc 30.0.',
    analyst_note: 'TCB đã chính thức thoát khỏi kênh giá tích luỹ kéo dài từ 2021 đến cuối 2023. Nhịp giảm sâu gần đây vô tình đưa TCB quay trở lại retest đường Trendline đỉnh cũ (hiện đóng vai trò là Hỗ trợ cực mạnh). Điểm mua tại đây tuân thủ hoàn hảo nguyên lý Overlapping trong cấu trúc sóng tăng. Với mốc chặn lỗ ngắn (27.1) và không gian tăng trưởng mở lên đỉnh mới (41.5), đây là điểm cược mang tính xác suất thắng và Tỷ suất R:R vượt trội.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', // Temporary placeholder
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting TCB:', error)
  } else {
    console.log('Successfully inserted TCB trading plan:', data)
  }
}

run()
