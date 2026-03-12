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
    ticker: 'VND',
    company_name: 'CTCP Chứng khoán VNDIRECT',
    timeframe: 'Trung - Dài hạn',
    strategy_name: 'Mua hỗ trợ Nền Giá & Kênh Chéo',
    entry_zone: '14.5 - 15.5',
    stop_loss: '13.56',
    take_profit: '24.36',
    risk_reward: '1:5.97',
    entry_criteria: 'Kiên nhẫn chờ đợi các nhịp rung lắc của thị trường đưa VND quay về test lại vùng 14.5 - 15.5. Tránh mua rượt đuổi tại vùng giá chênh vênh 17.x hiện tại để bảo toàn biên độ R:R.',
    analyst_note: 'Cấu trúc biểu đồ của VND đang dao động trong một kênh song song lớn hướng lên. Điểm mua lý tưởng được thiết lập tại vùng giao cắt giữa cạnh dưới của Hộp tích luỹ (vùng 15) và hỗ trợ chéo nối từ đáy năm 2020. Việc giữ nguyên tắc chặn lỗ ở 13.56 giúp giới hạn rủi ro cực thấp, mở ra không gian tăng trưởng khổng lồ lên Target 24.36. Cấu trúc này cần thời gian để chín muồi.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', 
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting VND:', error)
  } else {
    console.log('Successfully inserted VND trading plan:', data)
  }
}

run()
