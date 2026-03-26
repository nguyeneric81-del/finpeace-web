require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'SHB',
      company_name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
      strategy_name: 'Trend Following / Giữ trend sau Breakout nền 2 năm',
      timeframe: 'Trung hạn (60 - 90 ngày)',
      entry_zone: '14.45 - 15.41 (Test lại đỉnh hộp Darvas cũ)',
      stop_loss: '14.07 (-8.70%)',
      take_profit: '18.91 (+22.71%)',
      risk_reward: 2.61,
      max_position_pct: 20,
      indicators: ['Nhịp rũ bỏ cạn kiệt 50% Vol', 'Breakout siêu nền 2 năm'],
      entry_criteria: [
        'Rải 3 mẻ (30-30-40) nhặt dần khi giá nén quanh 14.50',
        'Phiên rút chân nến xác nhận dòng tiền đỡ giá',
        'Vol cạn kiệt dứt điểm dưới mức trung bình'
      ],
      exit_criteria: [
        'Cắt lỗ tuyệt đối nếu giá quay lại chui vào nền (dưới 14.00)',
        'Liên tục nâng chặn lãi (Trailing stop) khi giá vượt đỉnh 16.3'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Phiên 23/03 SHB bị đạp thủng 15.00 với Vol xả lũ 85.7 triệu cổ (vượt TB 72 triệu cổ/phiên). Sự hoảng loạn được dập tắt ngay phiên 24/03 khi giá chững đà tại 14.45, Vol đột biến cạn kiệt (-50%) chỉ còn 35.8 triệu cổ. Nhịp rũ bỏ này cho thấy lượng cung đeo bám lỏng lẻo đã bị vắt sạch. Tính đối xứng (Symmetry): Biên độ giảm -11.6% từ đỉnh 16.3 hoàn toàn lý tưởng sau 1 nhịp breakout khỏi chiếc "hộp Darvas" tích lũy khổng lồ kéo dài suốt 2 năm (từ 2022). Thời gian nén 2 năm là nguồn năng lượng khổng lồ không thể dập tắt chỉ sau 1 nhịp chỉnh ngắn. Vùng giá 14.4x hiện nay là mốc gia nhập hấp dẫn với R:R 2.61 cho một trend lớn.',
      wave_index: 'Uptrend (Pullback)',
      is_confirmed: true,
      status: 'active',
      sector: 'Ngân hàng (Finance)',
      risk_level: 'Chấp nhận được',
      conviction_level: 'Cao',
      catalyst_note: 'Cấu trúc nén khủng 2 năm chờ bung sức mạnh. Vol cạn kiệt siêu mượt.',
      expected_holding_days: 75,
      capital_allocation_pct: 20
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774443725797.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded SHB Plan with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
