require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'HDB',
      company_name: 'Ngân hàng TMCP Phát triển TPHCM',
      strategy_name: 'Trend Following / Bắt đáy nén tại Trendline',
      timeframe: 'Trung hạn (30 - 45 ngày)',
      entry_zone: '24.50 - 25.30 (Hiện tại giá 24.30 đang lọt bẫy săn bắt)',
      stop_loss: '23.71 (-6.21%)',
      take_profit: '28.77 (+13.81%)',
      risk_reward: 2.22,
      max_position_pct: 20,
      indicators: ['Wash-out tại vùng hỗ trợ cứng', 'Volume cạn 50% sau phiên bị xả lớn', 'Chiết khấu 19% chạm quy mô sóng chỉnh 2023'],
      entry_criteria: [
        'Mở 10% tại vùng giá 24.30 - 24.50 ngay lập tức',
        'Gia tăng tiếp 10% khi giá vòng lên xác nhận xanh phủ định nến giảm',
        'Thanh khoản rũ bỏ cạn kiệt dứt điểm'
      ],
      exit_criteria: [
        'Cắt lỗ quyết liệt nếu gãy hẳn mốc 23.71',
        'Cầm nắm vượt đỉnh để hướng mục tiêu Take Profit 28.77'
      ],
      analyst_note: 'Hành vi giá & Khối lượng: Phiên Wash-out khốc liệt ngày 23/3 ghi nhận mức rũ hàng cực lớn 42.7 triệu cổ tại mốc 24.300. Xung lực bán lập tức cạn kiệt 50% vào ngày 24/3 khi giá đi ngang với 20.7 triệu cổ, cho thấy phe Gấu không còn đủ hàng để đâm lủng hỗ trợ cứng này. Về Tính đối xứng (Symmetry): biên độ rơi -19% từ đỉnh sóng 30,000 hoàn toàn trùng khớp với mức chiết khấu trung hạn của cú rũ đầu 2023. Điểm nổ thời gian cho nhịp bật nảy (Rebound) T+ đã đạt cực hạn. Vùng giá 24.3x hiện tại mang lại tỉ lệ R:R rất hời lên đến 2.22.',
      wave_index: 'Uptrend (Pha Wash-out đáy)',
      is_confirmed: true,
      status: 'active',
      sector: 'Ngân hàng (Finance)',
      risk_level: 'Chấp nhận được',
      conviction_level: 'Trung bình - Khá',
      catalyst_note: 'Hành vi xả kho Margin cuối quý được hấp thụ tốt, kết quả kinh doanh tạo mặt bằng hấp dẫn.',
      expected_holding_days: 45,
      capital_allocation_pct: 20
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774443350713.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded HDB Plan with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
