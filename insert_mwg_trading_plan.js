require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'MWG',
    company_name: 'CTCP Thế Giới Di Động',
    strategy_name: 'Breakout vùng tích lũy dài hạn - Trend Following',
    timeframe: 'Trung hạn',
    entry_zone: '79.50 - 82.50',
    stop_loss: '75.80 (-5.97%)',
    take_profit: '92.06 (+14.20%)',
    risk_reward: '1:2.38',
    max_position_pct: 15,
    indicators: ['Price Action', 'Volume Analysis', 'Support/Resistance'],
    entry_criteria: 'Cổ phiếu kết thúc chu kỳ tích lũy dài hạn. Giải ngân quanh mốc 80.61 (mở rộng mua gom từ 79.50-82.50).',
    exit_criteria: 'Cắt lỗ khi giá đóng cửa gãy mốc 75.80 (vi phạm cấu trúc tăng ngắn hạn). Chốt lời khi chạm vùng đỉnh cũ quanh 92.06.',
    analyst_note: 'Bách Hóa Xanh hòa vốn, mảng điện máy phục hồi. Về kỹ thuật, MWG đang tái hiện pha Markup với mô hình tích lũy rũ bỏ cạn cung. Vùng cắt lỗ ngắn (<6%) rất phù hợp để đi vốn.',
    sector: 'Bán lẻ',
    risk_level: 'Trung Bình',
    conviction_level: 'Cao',
    catalyst_note: 'Phục hồi sức mua bán lẻ thiết yếu & ICT',
    expected_holding_days: 90,
    capital_allocation_pct: 15,
    status: 'active',
    chart_image_url: '/charts/mwg.png'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } else {
    console.log('Chèn thành công MWG!', data);
  }
}

go();
