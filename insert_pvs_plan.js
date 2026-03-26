require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'PVS',
      company_name: 'Dịch vụ Kỹ thuật Dầu khí Việt Nam',
      strategy_name: 'Trend Following / Giao dịch Pullback tại Kênh dốc lên',
      timeframe: 'Trung hạn (60 ngày)',
      entry_zone: '44.40 - 44.50 (Vùng mua tùy chỉnh chờ xác nhận nhịp Rebound)',
      stop_loss: '38.20 (-14.10%)',
      take_profit: '52.07 (+17.09%)',
      risk_reward: 1.21,
      max_position_pct: 10,
      indicators: ['Kiểm tra Trendline hỗ trợ dài hạn', 'Áp lực bán suy yếu dần'],
      entry_criteria: [
        'Khuyến nghị chưa giải ngân tại mốc 42.x hiện tại',
        'Chiến lược mua an toàn được kích hoạt khi dòng tiền đưa giá vượt dứt khoát qua ngưỡng 44.47'
      ],
      exit_criteria: [
        'Dừng lỗ kỷ luật nếu giá vi phạm mốc 38.20, phá vỡ cấu trúc Uptrend',
        'Theo dõi diễn biến tại vùng cung tiềm năng 52.x để tiến hành hiện thực hóa lợi nhuận'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Mặc dù chuỗi rớt giá từ đỉnh cục bộ (trên 44.0) về vùng 42.0 diễn ra liên tiếp, tuy nhiên khối lượng giao dịch không cho thấy dấu hiệu phân phối hay bán tháo từ tổ chức. Thanh khoản ở các phiên giảm duy trì ở ngưỡng trung bình thấp, phản ánh đặc tính của một nhịp rũ bỏ cung (shake-out) nhằm thanh lọc nhóm nhà đầu tư cá nhân trước khi bước vào sóng mới. Tính đối xứng (Symmetry): PVS duy trì cấu trúc vận động vững chắc trong một Kênh giá tăng (Ascending Channel) thiết lập từ cuối năm 2024. Nhịp điều chỉnh hiện tại đưa giá về kiểm tra chính xác đường Trendline hỗ trợ cạnh dưới. Trong quá khứ, mỗi nhịp chạm Trendline này đều kích hoạt sóng đẩy (Impulse Wave) tương đối chuẩn mực. Vùng hỗ trợ này còn được gia cố thêm bởi ranh giới của nền giá tích lũy cũ (38-44). Dựa trên nguyên lý quản trị rủi ro, điểm giải ngân tiêu chuẩn được thiết lập tại 44.47. Tỷ lệ R:R phái sinh giữ vững ở mức 1.21, đi kèm phân bổ vốn mặc định 10% NAV nhằm kiểm soát biến động.',
      wave_index: 'Đẩy giá (Pullback kiểm tra Điểm tựa Trendline)',
      is_confirmed: true,
      status: 'active',
      sector: 'Dầu khí / Năng lượng (Oil & Gas Services)',
      risk_level: 'Gắn liền với hỗ trợ kênh giá (Rủi ro hệ thống kiểm soát)',
      conviction_level: 'Cao',
      catalyst_note: 'Sự vận động nhịp nhàng trong cấu trúc Ascending Channel dài hạn.',
      expected_holding_days: 60,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774446093948.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded PVS Plan (NAV 10% mặc định) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
