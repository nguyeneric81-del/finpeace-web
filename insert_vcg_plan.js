const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertPlan() {
  const planPayload = {
    ticker: 'VCG',
    company_name: 'Vinaconex',
    strategy_name: 'Mua Hỗ trợ Trendline / Biên dưới Hộp Sideway dài hạn',
    entry_zone: '21.90 - 22.60',
    stop_loss: '19.08',
    take_profit: '27.55',
    risk_reward: '1.67',
    timeframe: 'Trung hạn (3-6 tháng)',
    conviction_level: 'High',
    max_position_pct: 5, // CUSTOM CONSTRAINT: 5% NAV
    is_confirmed: true,
    status: 'active',
    analyst_note: 'VCG đang vận động trong một cấu trúc Sideway dài hạn kéo dài từ 2022 (quanh vùng biên độ 16.00 - 36.00). Hành động giá hiện tại cho thấy sự tôn trọng đối với đường Trendline hỗ trợ dốc lên (nối từ đáy 2022 đến nay). Về mặt khối lượng (Volume), áp lực cung đã suy kiệt tại vùng 21-22, tạo điều kiện thuận lợi cho một nhịp phục hồi kỹ thuật (Rebound) hướng về vùng kháng cự ngắn hạn 27-28. Tính đối xứng (Symmetry) trong các nhịp điều chỉnh trước đó củng cố độ tin cậy của vùng nền giá hiện tại. Tuân thủ định mức giải ngân tối đa 5% NAV do đặc thù Beta cao và thời gian chờ đợi phá vỡ có thể kéo dài.'
  };

  // Đẩy plan lên Database
  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  if (error) {
    console.error('Lỗi khi insert VCG:', error);
  } else {
    console.log('✅ Đã insert thành công VCG Plan (NAV 5%):', data[0].id);
  }
}

insertPlan();
