require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: tp, error: getErr } = await supabase.from('trading_plans').select('id').eq('ticker', 'STB').single();
  if (getErr || !tp) return console.log("Lỗi: Không tìm thấy STB plan", getErr);

  const payload = {
    sector: 'Ngân hàng / Finance',
    risk_level: 'Trung bình',
    conviction_level: 'Cao',
    catalyst_note: 'Động lực từ uptrend mạnh trên W-chart, chờ tín hiệu từ việc đấu giá nợ VAMC. Khối lượng đỡ vùng 60 rất uy tín.',
    expected_holding_days: 45,
    capital_allocation_pct: 20,
    is_confirmed: true // Trigger Live Signal -> chuyển sang Đủ Tiêu Chuẩn Trade
  };

  const { error: updateErr } = await supabase.from('trading_plans').update(payload).eq('id', tp.id);
  if (updateErr) {
    console.error('Lỗi khi update metada STB:', updateErr);
  } else {
    console.log('✅ Đã cập nhật Metadata cho STB thành công!');
  }
}

run();
