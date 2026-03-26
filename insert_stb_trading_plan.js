require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPlan() {
  const plan = {
    ticker: 'STB',
    company_name: 'Sacombank',
    strategy_name: 'Trend Following / Mua Pullback tại Trendline',
    timeframe: 'Ngắn – Trung hạn (1 – 3 tháng)',
    entry_zone: '58.70 – 63.00 (Vùng test lại đỉnh cũ / Trendline)',
    stop_loss: '54.39 (-8.85%)',
    take_profit: '69.00 (+9.52%)',
    risk_reward: 1.39,
    max_position_pct: 20,
    indicators: ['Trendline tăng dài hạn', 'RSI trung tính', 'Khối lượng bán cạn kiệt'],
    entry_criteria: [
      'Giá điều chỉnh chững đà rơi quanh vùng 58-60',
      'Đóng cửa (Close) giữ nguyên trên trendline chéo',
      'Nến bật hồi có thanh khoản'
    ],
    exit_criteria: [
      'Cắt lỗ dứt khoát nếu thủng 54.39 (Gãy cấu trúc tăng)',
      'Chốt lời 50% khi chạm 66.0, phần còn lại hold theo trend lên 69.0'
    ],
    analyst_note: 'STB duy trì cấu trúc tăng (Uptrend) cực kỳ mượt mà từ đầu năm. Pha điều chỉnh hiện tại đang đưa giá về lại sát đường Trendline hỗ trợ kiêm vùng đỉnh cũ đã phá. Vùng 58-63 là setup rủi ro/lợi nhuận cực đẹp để tham gia vị thế mua lên cho nhịp sóng tiếp theo.',
    wave_index: 'Trending 3 (Đẩy giá)',
    is_confirmed: false, // Plan Đang Ủ
    status: 'active'
  };

  const { data, error } = await supabase
    .from('trading_plans')
    .insert(plan)
    .select();

  if (error) {
    console.error('Lỗi khi chèn STB:', error);
  } else {
    console.log('Chèn thành công STB Trading Plan:', data[0].id);
  }
}

insertPlan();
