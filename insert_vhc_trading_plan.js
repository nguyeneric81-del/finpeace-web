require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'VHC',
    company_name: 'CTCP Vĩnh Hoàn',
    strategy_name: 'Breakout vùng tích lũy dài hạn - Trend Following',
    timeframe: 'Trung - Dài hạn',
    entry_zone: '57.50 - 59.00',
    stop_loss: '51.97 (-11.74%)',
    take_profit: '75.23 (+27.77%)',
    risk_reward: '1:2.37',
    max_position_pct: 15,
    indicators: ['Price Action', 'Darvas Box', 'Volume Analysis', 'Support/Resistance'],
    entry_criteria: 'Cổ phiếu hoàn thành giai đoạn tích lũy (kéo dài từ cuối năm 2022). Giải ngân mạnh khi giá đóng cửa giữ vững trên mốc 58.70 đi kèm xác nhận volume.',
    exit_criteria: 'Cắt lỗ khi giá đóng cửa gãy mốc 51.97 (hỗ trợ cứng của nhịp rũ bỏ trước đó). Chốt lời chủ động dần khi chạm MA/Kháng cự quanh 70-72 và gồng lãi cuối lên 75.23.',
    analyst_note: 'VHC có tính chu kỳ Symmetry rõ nét. Bứt phá khỏi hộp Box Darvas khổng lồ này báo hiệu pha Đẩy giá (Markup) lớn tiếp theo.',
    sector: 'Xuất khẩu Thủy sản',
    risk_level: 'Trung Bình',
    conviction_level: 'Trung Bình - Cao',
    catalyst_note: 'Hưởng lợi xuất khẩu Cá Tra, chu kỳ kinh tế hồi phục',
    expected_holding_days: 120,
    capital_allocation_pct: 15,
    status: 'active',
    chart_image_url: '/charts/vhc.png'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } else {
    console.log('Chèn thành công VHC!', data);
  }
}

go();
