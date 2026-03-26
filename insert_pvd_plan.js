require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'PVD',
      company_name: 'Giăng khoan Dầu khí (PVD)',
      strategy_name: 'Trend Following / Đánh Breakout vượt nền',
      timeframe: 'Trung hạn (60 ngày)',
      entry_zone: '35.00 - 36.00 (Chờ giá phục hồi băng qua cản cũ)',
      stop_loss: '31.92 (-11.01%)',
      take_profit: '42.64 (+18.87%)',
      risk_reward: 1.71,
      max_position_pct: 10,
      indicators: ['Chờ xác nhận vòng lên kháng cự', 'Đồng pha Trendline lớn tuần'],
      entry_criteria: [
        'Tuyệt đối không bắt đáy tại 33.x',
        'Chờ giá đóng cửa dứt khoát trên 35 để xác nhận tiền vào',
        'Đi 10% NAV để dò mìn lấy lợi thế.'
      ],
      exit_criteria: [
        'Thủng gãy hoàn toàn Trendline kênh giá tại 31.9 (Cắt lỗ toàn bộ)',
        'Gồng tiếp lên target 42.6 khi dòng P có dòng tiền lan toả.'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Dù PVD rớt thảm từ 45.5 xuống 33.5, chuỗi rơi này đã ghi nhận trạng thái cạn cung rõ nét vào phiên 24/03 (Volume chỉ còn 5.5 triệu cổ, bằng nửa trung bình 20 phiên). Phe xả hàng gần như đã ngừng bắn khi giá tiệm cận Trendline hỗ trợ dài hạn. Tuy nhiên, hành động mua rẻ tại Hỗ trợ không được thiết lập. Sếp yêu cầu một chiến lược Entry thận trọng hơn ở mốc 35.00 - 36.00. Điều này mang ý nghĩa: Chỉ khi phe Bò chứng minh được sức mạnh bằng cách đẩy giá vượt ngược trở lại viền cổ 35, lúc đó vị thế mua mới được kích hoạt để tránh rủi ro False-break rớt tiếp. Phân bổ rủi ro siêu an toàn với chỉ 10% NAV. Tính đối xứng (Symmetry): Biên độ rơi -26% hiện tại khá đối xứng với các cú rơi lịch sử của PVD trong Uptrend. R:R ở mức 1.71 tại giá mục tiêu hoàn toàn xứng đáng để theo dõi nhịp nén này.',
      wave_index: 'Uptrend (Pullback / Chờ xác nhận Breakout nền giá)',
      is_confirmed: true,
      status: 'active',
      sector: 'Dầu khí / Năng lượng',
      risk_level: 'Thấp (do đi size siêu bé 10% và bắt Breakout an toàn)',
      conviction_level: 'Khá',
      catalyst_note: 'Chờ giá dầu ủng hộ và dòng tiền xoay vòng về nhóm năng lượng.',
      expected_holding_days: 60,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774445112632.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded PVD Plan (Entry: 35-36, NAV 10%) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
