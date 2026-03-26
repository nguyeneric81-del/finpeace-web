require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'GAS',
      company_name: 'Tổng Công ty Khí Việt Nam',
      strategy_name: 'Trend Following / Cược chân nền giá Kỷ nguyên',
      timeframe: 'Trung hạn (90 - 120 ngày)',
      entry_zone: '84.00 - 86.00 (Vùng mua tùy chỉnh an toàn theo Setup mới)',
      stop_loss: '77.74 (-9.38%)',
      take_profit: '119.73 (+39.56%)',
      risk_reward: 4.22,
      max_position_pct: 10,
      indicators: ['Test lại nắp hộp nền giá Tám Năm', 'Volume bốc hơi 60% quanh đáy'],
      entry_criteria: [
        'Mở mua thăm dò 10% NAV quanh dải giá 84 - 86',
        'Cung bắt đáy không bị áp lực bán tháo tháo chạy'
      ],
      exit_criteria: [
        'Cắt máu dứt khoát nếu cổ phiếu chọc thủng mốc 77.74 (Phá sản toàn bộ nền giá 8 năm)',
        'Liên tục ôm hàng tới khi đạt mức độ phi mã về tiệm cận 120'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Cú sụt giảm tàn khốc từ đỉnh 131k đã đưa GAS lùi thẳng về chạm mốc 80.70. Điểm sáng chói lọi xuất hiện khi rơi vào vùng hỗ trợ siêu cứng này, thanh khoản của GAS trong ngày 24/03 đã bị vắt kiệt tức tưởi, chỉ còn 1.89 triệu cổ (bốc hơi hơn 60% so với volume xả lũ các phiên trước). Cung giá thấp hiển nhiên đã tê liệt hoàn toàn. Tính đối xứng (Symmetry): Tuyệt tác thực sự nằm ở khung thời gian siêu dài. Kể từ 2018, GAS đã mất ròng rã 8 năm để đan kết một "Hộp Darvas" tích lũy thế kỷ. Con siêu sóng vừa rồi chính là thành quả Breakout nền giá đó. Cú chỉnh kinh hoàng đưa giá về sát 80k hiện nay mang tính chất của một pha Throw-back hoàn hảo để Test lại chính xác cái nắp hộp 8 năm kia. R:R lên tới 4.22 cho ta một tỉ lệ quá khủng khiếp để cược. Tuy nhiên do tính chất dò mìn, tỉ trọng phân bổ giới hạn ở mức 10%.',
      wave_index: 'Pullback (Test nắp hộp 8 năm)',
      is_confirmed: true,
      status: 'active',
      sector: 'Dầu khí / Năng lượng (Oil & Gas)',
      risk_level: 'Chấp nhận được',
      conviction_level: 'Cực kỳ cao',
      catalyst_note: 'Bệ đỡ 8 năm kiến tạo nên một trong những setup vững chắc nhất VNINDEX.',
      expected_holding_days: 120,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774444736585.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded GAS Plan (Vùng 84-86, NAV 10%) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
