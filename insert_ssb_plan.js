require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'SSB',
      company_name: 'Ngân hàng TMCP Đông Nam Á',
      strategy_name: 'Trend Following / Bắt đáy hộp kỹ thuật',
      timeframe: 'Trung hạn (45 - 60 ngày)',
      entry_zone: '16.80 - 17.20 (Vùng hỗ trợ cực mạnh tại đáy hộp)',
      stop_loss: '15.82 (-8.02%)',
      take_profit: '20.04 (+16.01%)',
      risk_reward: 2.06,
      max_position_pct: 5,
      indicators: ['Thanh khoản cạn kiệt (-90%)', 'Chạm biên dưới hộp Darvas'],
      entry_criteria: [
        'Vào tỷ trọng 5% NAV quanh vùng giá nhúng 16.80 hiện tại',
        'Vol bán cực thấp dưới mức 2 triệu cổ/ngày'
      ],
      exit_criteria: [
        'Cắt lỗ quyết liệt nếu thủng đáy hộp cũ (dưới 15.80)',
        'Liên tục nâng chặn lãi khi cổ phiếu kéo thẳng về 20.x'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Yếu tố cạn cung ở SSB đang bước vào giai đoạn đỉnh điểm. Ghi nhận ngày 18/03, SSB có nhịp kích tiền Vol nổ 26.3 triệu nhưng sau đó bị đạp lại. Đặc biệt nhất là suốt các phiên rung lắc sau đó (nhất là 24/03), áp lực bán đã bốc hơi tới 90%, thanh khoản cạn kiệt chỉ còn 1.9 triệu cổ phiếu. Việc giá không gãy tiếp trong bối cảnh thanh khoản rỗng ruột chứng tỏ lượng cung kẹp giá thấp đã bị vắt kiệt. Tính đối xứng (Symmetry): Trên đồ thị lớn, SSB kẹt trong hộp tích lũy từ giữa 2023. Nhịp rơi từ cạnh trên (20.04) về cạnh dưới (15.82) mang theo biên độ chiết khấu 21%, tạo nên cú "Shake-out" hoàn hảo đối xứng với các nhịp rũ bỏ lớn trước đây. Đây có thể coi là vùng hỗ trợ đáy nén thời gian siêu cứng (Spring), một bệ nảy vô cùng lý tưởng để Rebound. Tuy nhiên, theo yêu cầu quản trị rủi ro mới nhất, kèo này chỉ nên phân bổ NAV nhỏ, giải ngân thăm dò với 5%.',
      wave_index: 'Sideway Accumulation (Test đáy nền ngang)',
      is_confirmed: true,
      status: 'active',
      sector: 'Ngân hàng / Bảo hiểm / Tài chính',
      risk_level: 'Rất thấp (Đã cạn Vol ở đáy)',
      conviction_level: 'Cực cao',
      catalyst_note: 'Nén Vol cực biên quanh vùng đáy. Lực cung giá thấp không còn một mống.',
      expected_holding_days: 60,
      capital_allocation_pct: 5
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774444461028.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded SSB Plan (NAV 5%) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
