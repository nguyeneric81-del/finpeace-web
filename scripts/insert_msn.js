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
    ticker: 'MSN',
    company_name: 'CTCP Tập đoàn Masan',
    timeframe: 'Trung hạn (Mid-term)',
    strategy_name: 'Mua hỗ trợ Kênh giá chéo & Nền giá ngang',
    entry_zone: '64.9 - 73.1',
    stop_loss: '54.9',
    take_profit: '103.0',
    risk_reward: '1:1.65',
    entry_criteria: 'Mở vị thế thăm dò quanh vùng giá hiện tại (73.x). Ưu tiên mua gom thêm khi giá test lại vùng cân bằng 65-68. Tránh mua đuổi nếu giá vọt qua vùng kháng cự chéo nhỏ màu cam.',
    analyst_note: 'MSN đang vận động trong một cấu trúc Sideway Down biên độ rộng từ cuối năm 2021. Tuy nhiên, hành động giá gần đây đang cho thấy vùng hỗ trợ (đường chéo màu cam hướng lên) liên tục được kiểm định thành công với áp lực bán cạn kiệt. Nếu MSN thoát khỏi biên trên của tam giác hẹp hiện tại, cổ phiếu hoàn toàn đủ động lượng hình thành một nhịp "Markup" mạnh mẽ hướng tới vùng 103.0. Vị thế Mua lúc này là cược vào sự chuyển tiếp từ Pha Tích Lũy sang Pha Tăng Trưởng.',
    chart_image_url: 'https://i.ibb.co/6PZkVg8/ctd-chart.png', // Temporary placeholder until a specific MSN chart is provided or required
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert([newPlan])
    .select()

  if (error) {
    console.error('Error inserting MSN:', error)
  } else {
    console.log('Successfully inserted MSN trading plan:', data)
  }
}

run()
