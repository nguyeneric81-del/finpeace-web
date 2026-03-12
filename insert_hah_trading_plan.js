require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'HAH',
    company_name: 'CTCP Vận tải và Xếp dỡ Hải An',
    strategy_name: 'Breakout Nền tảng lớn - Tiếp diễn xu hướng Tăng',
    timeframe: 'Trung hạn (Mid-term)',
    entry_zone: '57.5 - 58.5',
    stop_loss: '53.87 (-7.95%)',
    take_profit: '70.68 (+20.81%)',
    risk_reward: '1:2.59',
    max_position_pct: 15,
    indicators: ['Breakout Margin'],
    entry_criteria: 'Mở vị thế mua quanh vùng giá 58.0. Cổ phiếu vừa có nhịp bứt thoát khỏi hộp tích lũy thứ hai tính từ chu kỳ tạo đáy, phe Mua đang kiểm soát xu hướng.',
    exit_criteria: 'Target chốt lời theo độ rộng của nhịp tăng trước đó hoặc kháng cự mạnh dài hạn. Cắt lỗ khi thủng 53.87.',
    analyst_note: 'HAH kết thúc chu kỳ giảm và bước vào pha Đáy Giá (Markup). Hưởng lợi Vĩ mô từ SCFI neo cao, HAH nhận thêm tàu mới. Setup xu hướng Win-rate cao.',
    sector: 'Cảng biển - Logistics',
    risk_level: 'Trung Bình',
    conviction_level: 'Cao',
    catalyst_note: 'Tái ký hợp đồng cước giá cao',
    expected_holding_days: 60,
    capital_allocation_pct: 15,
    status: 'active',
    chart_image_url: '/charts/hah.png'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } else {
    console.log('Chèn thành công HAH!', data);
  }
}

go();
