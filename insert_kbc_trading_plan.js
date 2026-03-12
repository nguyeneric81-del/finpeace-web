require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'KBC',
    company_name: 'CTCP Đô thị Kinh Bắc',
    strategy_name: 'Breakout nền giá dốc lên - Trend Following',
    timeframe: 'Trung - Dài hạn',
    entry_zone: '30.00 - 32.00',
    stop_loss: '27.71 (-10.03%)',
    take_profit: '41.83 (+35.81%)',
    risk_reward: '1:3.57',
    max_position_pct: 15,
    indicators: ['Trendline', 'Darvas Box', 'Price Action', 'Support/Resistance'],
    entry_criteria: 'Cổ phiếu bứt phá khỏi cản chéo và kháng cự ngang 30.80. Mua gom quanh 30.00-32.00.',
    exit_criteria: 'Cắt lỗ khi giá gãy 27.71 (thủng trendline hỗ trợ ngắn trung hạn). Chốt lời dần khi tiếp cận vùng đỉnh cũ 41.83.',
    analyst_note: 'FDI dồi dào hỗ trợ nhóm BĐS KCN. Form chart tích lũy tốt, tỷ lệ R:R = 3.57 cực kỳ hấp dẫn. Cửa đánh thốc lên 4x rất sáng sủa khi vượt mốc 32.',
    sector: 'Bất động sản KCN',
    risk_level: 'Cao',
    conviction_level: 'Cao',
    catalyst_note: 'Mở bán KCN mới, làn sóng vốn FDI',
    expected_holding_days: 150,
    capital_allocation_pct: 15,
    status: 'active',
    chart_image_url: '/charts/kbc.png'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } else {
    console.log('Chèn thành công KBC!', data);
  }
}

go();
