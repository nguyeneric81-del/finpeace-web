require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'DGC',
    company_name: 'CTCP Tập đoàn HC Đức Giang',
    strategy_name: 'Giao dịch sóng Elliott - Bắt đáy Sóng 2',
    timeframe: 'Trung - Dài hạn',
    entry_zone: '80.90 - 86.50',
    stop_loss: '61.88 (-28.33%)',
    take_profit: '115.59 (+33.88%)',
    risk_reward: '1:1.20',
    max_position_pct: 10,
    indicators: ['Elliott Wave', 'Trendline', 'Price Action'],
    entry_criteria: 'Giá bứt phá cản chéo và đang trong nhịp test lại tạo Sóng (2). Mua gom quanh 80.90 - 86.50 đón Sóng (3).',
    exit_criteria: 'Cắt lỗ khi thủng 61.88 (phá vỡ cấu trúc chân sóng 1). Chốt lời khi giá đạt target đo lường của Sóng (3) quanh 115.x.',
    analyst_note: 'Chart vẽ ra kịch bản sóng Elliott kinh điển. Tuy nhiên Stoploss dài (-28%) nên cần quản trị rủi ro khắt khe, phân bổ tỷ trọng nhỏ. Đổi lại, biên lợi nhuận Sóng 3 cực kỳ hấp dẫn (lên đỉnh cũ 115).',
    sector: 'Hóa chất',
    risk_level: 'Cao',
    conviction_level: 'Trung Bình',
    catalyst_note: 'Dự án Nghi Sơn, giá Hóa chất hồi phục',
    expected_holding_days: 180,
    capital_allocation_pct: 10,
    status: 'active',
    chart_image_url: '/charts/dgc.png'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu DGC:', error);
  } else {
    console.log('Chèn thành công DGC!', data);
  }
}

go();
