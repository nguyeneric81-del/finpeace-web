require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'DGC',
    company_name: 'CTCP Tập đoàn HC Đức Giang',
    strategy_name: 'Breakout Nền tảng lớn - Trend Following',
    timeframe: 'Trung - Dài hạn',
    entry_zone: '129.50 - 132.50',
    stop_loss: '114.70 (-12.57%)',
    take_profit: '173.90 (+32.55%)',
    risk_reward: '1:2.58',
    max_position_pct: 15,
    indicators: ['Price Action', 'Volume Analysis', 'Support/Resistance', 'Trendline'],
    entry_criteria: 'Cổ phiếu bứt thoạt cản chéo kèm dòng tiền lớn xác nhận. Giải ngân mua gom quanh mốc bùng nổ 131.',
    exit_criteria: 'Cắt lỗ khi giá gãy 114.70 (hỗ trợ cứng vùng đáy cũ). Chốt lời khi giá đạt target đo lường của nền giá quanh 173.90.',
    analyst_note: 'Hưởng lợi từ chu kỳ công nghệ và nhu cầu chất bán dẫn toàn cầu. Kỹ thuật DGC đang nén chặt và Breakout rất đẹp. R:R 2.58 cho một nhịp cầm trung hạn là mức sinh lời tuyệt vời để đánh cược.',
    sector: 'Hóa chất - Phân bón',
    risk_level: 'Trung Bình',
    conviction_level: 'Rất Cao',
    catalyst_note: 'Dự án Tổ hợp Hóa chất Nghi Sơn, Giá phốt pho phục hồi',
    expected_holding_days: 120,
    capital_allocation_pct: 15,
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
