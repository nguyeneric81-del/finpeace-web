require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'ACB',
      company_name: 'Ngân hàng TMCP Á Châu',
      strategy_name: 'Trend Following / Sideway Accumulation (Test Đáy Hộp)',
      timeframe: 'Trung hạn (60 - 90 ngày)',
      entry_zone: '23.80 - 24.07 (Nhặt dần vùng giá nhúng quanh 23.x)',
      stop_loss: '21.98 (-8.68%)',
      take_profit: '27.84 (+15.66%)',
      risk_reward: 1.80,
      max_position_pct: 30,
      indicators: ['Về sát hỗ trợ cứng 22.5', 'Volume cạn kiệt dứt điểm', 'Chiết khấu 17% chạm quy mô sóng chỉnh Lớn'],
      entry_criteria: [
        'Rải 3 mẻ (30-30-40) nhặt dần khi giá nén quanh 23.10 - 23.80',
        'Cây nến ngày tiếp tục duy trì màu xanh kèm Vol tăng nhẹ',
        'Tín hiệu MACD Histogram Histogram thu hẹp đà giảm'
      ],
      exit_criteria: [
        'Cắt lỗ tuyệt đối nếu giá thủng đáy hộp cũ (dưới 21.90)',
        'Mở biên chốt dần (Scaling out) khi giá vượt đỉnh 24.6'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Phiên 23/03 mã bị ép mạnh về 22,500 với Volume khá lớn (17.1 triệu). Tuy nhiên, ngay phiên hôm sau (24/03), giá đã lập tức giật ngược (rebound) đóng cửa ở 23,100, tháo cạn lượng cung lỏng lẻo. Thanh khoản rút về mức cực kỳ lành mạnh (14 triệu cổ). Dấu hiệu rõ ràng của bàn tay tạo lập đang gom hàng quanh vùng 22.x - 23.x! Tính đối xứng (Symmetry): Xét trên Chart W, ACB đã có một chiếc hộp tích lũy siêu dài từ giữa 2021 đến 2023. Sau nhịp Markup, quy luật "Tính đối xứng Thời gian" lại lặp lại khi cổ phiếu xây một chiếc hộp mới ở vùng đỉnh cao (22.5 - 27.8). Cú rũ từ 27,200 về 22,500 (chiết khấu -17%) là biên độ ép hàng chuẩn bài cho dòng Bank vốn hóa lớn. Tại mốc 23.1, ACB đang nén ở đáy hộp mới, xác suất sụt giảm tiếp là rất thấp. Kế hoạch hiện tại mang tỷ lệ R:R ~1.8 rất phù hợp để giải ngân size vốn lớn.',
      wave_index: 'Sideway Accumulation (Nhịp nghỉ nền số 2)',
      is_confirmed: true,
      status: 'active',
      sector: 'Ngân hàng / Bảo hiểm / Tài chính',
      risk_level: 'Rất thấp (Safe bet)',
      conviction_level: 'Cao',
      catalyst_note: 'Cấu trúc hộp nén nền tảng giá cao cực kỳ an toàn. Vol cạn kiệt cho thấy ít cung đeo bám.',
      expected_holding_days: 75,
      capital_allocation_pct: 30
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774444212747.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded ACB Plan with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
