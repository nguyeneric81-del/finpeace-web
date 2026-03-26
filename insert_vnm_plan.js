require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'VNM',
      company_name: 'CTCP Sữa Việt Nam',
      strategy_name: 'Nhịp phục hồi từ đáy hộp nền tảng',
      timeframe: 'Trung hạn (90 ngày)',
      entry_zone: '64.00 - 64.10 (Chờ xác nhận dòng tiền vượt cản)',
      stop_loss: '57.53 (-10.22%)',
      take_profit: '72.97 (+13.87%)',
      risk_reward: 1.36,
      max_position_pct: 10,
      indicators: ['Phân kỳ khối lượng tại vùng hỗ trợ', 'Test đáy hộp Sideway dài hạn'],
      entry_criteria: [
        'Hành động giá hiện tại (61.x) chưa xác nhận đảo chiều',
        'Kích hoạt vị thế khi vận động giá vượt dải kháng cự cơ sở 64.00'
      ],
      exit_criteria: [
        'Kỷ luật cắt lỗ khi giá đóng cửa dưới 57.53, vi phạm đáy nền tảng',
        'Kỳ vọng chốt lời tại vùng cung 72.x với lợi nhuận kỳ vọng ~14%'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Giai đoạn điều chỉnh từ vùng đỉnh ngắn hạn (75.500) về mốc 60.000 đang có dấu hiệu cạn kiệt lực cung. Đáng chú ý, tại phiên giao dịch ngày 24/03, khi giá tiệm cận vùng hỗ trợ chiến lược, khối lượng giao dịch sụt giảm mạnh chỉ còn 2.69 triệu cổ phiếu (thấp hơn đáng kể so với mức trung bình 20 phiên là 12.6 triệu). Sự sụt giảm thanh khoản ở vùng giá thấp xác nhận trạng thái tiết cung cục bộ, cho thấy áp lực bán đã được hấp thụ phần lớn và không còn duy trì đà giảm sâu. Tính Đối Xứng Cơ Cấu (Symmetry & Structure): Trên khung thời gian dài hạn (2018-2026), VNM vận động trong một cấu trúc hộp đi ngang (Sideway Accumulation) quy mô cực lớn. Nhịp chiết khấu hiện tại (giảm khoảng 18% từ đỉnh gần nhất) mang tính chất kiểm định (Test) lại vùng hỗ trợ viền cổ của các cấu trúc nền tảng trước đó. Vùng kiểm định hiện tại đóng vai trò là điểm hội tụ kỹ thuật lý tưởng để khởi tạo một chu kỳ phục hồi tiến về cạnh trên của hộp tích lũy.',
      wave_index: 'Tích Lũy (Kiểm định cạnh dưới Hộp đi ngang)',
      is_confirmed: true,
      status: 'active',
      sector: 'Hàng tiêu dùng (Consumer Staples)',
      risk_level: 'Trung bình thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Khối lượng giao dịch sụt giảm mạnh xác nhận vùng đáy tiềm năng của nền giá Sideway dài hạn.',
      expected_holding_days: 90,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774446465774.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded VNM Plan (Institutional Note, NAV 10%) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
