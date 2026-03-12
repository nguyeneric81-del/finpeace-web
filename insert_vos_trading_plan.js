require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function go() {
  const plan = {
    ticker: 'VOS',
    company_name: 'CTCP Vận tải biển Việt Nam',
    strategy_name: 'Mua tại biên dưới Nền tảng lớn',
    timeframe: 'Trung hạn (Mid-term)',
    entry_zone: '13.80 - 14.40',
    stop_loss: '11.63 (-15.78%)',
    take_profit: '20.24 (+46.56%)',
    risk_reward: '1:2.85',
    max_position_pct: 10,
    indicators: ['Breakout chéo'],
    entry_criteria: 'Mở vị thế quanh 13.80 - 14.40. Cổ phiếu đang có dấu hiệu mớm dòng tiền sau khi bật lên từ vùng đáy hộp tích lũy nhiều năm.',
    exit_criteria: 'Target hướng về đỉnh của hộp sideway. Cắt lỗ khi thủng sâu dưới 11.63.',
    analyst_note: 'VOS có một cấu trúc đi ngang cực kỳ hoành tráng kéo dài từ sau nhịp tăng nóng năm 2021. Giá đã rũ bỏ và nén chặt ở nửa dưới của hộp, vừa xuất hiện tín hiệu phá vỡ đường kháng cự chéo. Cùng với bệ đỡ Vĩ mô từ giá cước vận tải phục hồi, đây là một kèo Swing Trade siêu lợi nhuận.',
    sector: 'Cảng biển - Logistics',
    risk_level: 'Cao',
    conviction_level: 'Khá',
    catalyst_note: 'Giá cước vận tải phục hồi',
    expected_holding_days: 90,
    capital_allocation_pct: 10,
    status: 'active'
  };

  const { data, error } = await supabase.from('trading_plans').upsert(plan, { onConflict: 'ticker' });
  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error);
  } else {
    console.log('Chèn thành công VOS!', data);
  }
}

go();
