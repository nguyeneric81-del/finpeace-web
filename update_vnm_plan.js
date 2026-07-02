const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const ticker = 'VNM';
    console.log('Fetching VNM trading plan...');
    const { data: tp, error: getError } = await supabase
      .from('trading_plans')
      .select('id')
      .eq('ticker', ticker)
      .single();

    if (getError || !tp) {
      throw new Error(`Failed to find VNM trading plan: ${getError?.message}`);
    }

    console.log('VNM plan ID:', tp.id);

    // 1. Upload the chart image
    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781508842241.jpg';
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Media file not found at ${imagePath}`);
    }

    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.jpg`;

    console.log('Uploading chart image to Supabase storage...');
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;
    console.log('Uploaded chart URL:', chartUrl);

    // 2. Prepare new trading plan details
    const analystNote = `**1. Hành vi Giá & Khối lượng cụ thể**
Cổ phiếu VNM đang thiết lập cấu trúc tích lũy nền ngang chặt chẽ ở vùng đáy biên dưới hộp Darvas Box (quanh 57.800 - 58.500). Phiên giao dịch ngày 15/06 ghi nhận nhịp hồi phục tích cực tăng +0.85% đóng cửa ở 59.500 với khối lượng khớp lệnh ổn định 1.77 triệu cổ phiếu, cho thấy áp lực cung đã cạn kiệt sau chuỗi ngày đè giá. Đường xu hướng giảm ngắn hạn đang chuẩn bị được bứt phá. Điểm mua breakout kích hoạt quanh mốc 60.100 để hướng về vùng đỉnh hộp cũ.

**2. Tính đối xứng (Symmetry)**
Vùng hỗ trợ 57.800 - 58.500 là chốt chặn tin cậy, đối xứng rất tốt qua các sóng điều chỉnh dài hạn đáy hộp. Cấu trúc tích lũy này cho thấy lực cầu bền bỉ luôn tham gia nâng đỡ khi giá chạm biên dưới.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
Ngành thực phẩm và đồ uống mang tính phòng thủ cao với dòng tiền kinh doanh cực kỳ ổn định. Điểm cộng của deal này là rủi ro thấp nhờ vùng cắt lỗ Stop Loss chỉ cách điểm mua -4.16%, bảo toàn vốn tối đa.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [2/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)
`;

    const planUpdate = {
      strategy_name: 'Trend Following / Breakout Trendline',
      timeframe: 'Ngắn – Trung hạn (1 – 3 tháng)',
      entry_zone: '60.100',
      stop_loss: '57.600 (-4.16%)',
      take_profit: '67.600 (+12.48%)',
      risk_reward: '3.0',
      max_position_pct: 10,
      indicators: ['MA20', 'RSI', 'Bollinger Bands'],
      entry_criteria: [
        'Giá đóng cửa breakout đường xu hướng giảm ngắn hạn vượt 60.100',
        'Khối lượng khớp lệnh tăng duy trì xác nhận dòng tiền cầu'
      ],
      exit_criteria: [
        'Cắt lỗ dứt khoát nếu đóng cửa thủng hỗ trợ 57.600',
        'Chốt lời chủ động tại kháng cự biên trên hộp quanh 67.600'
      ],
      analyst_note: analystNote,
      wave_index: 'Sideway 2',
      is_confirmed: true, // Approved and Live!
      status: 'active',
      chart_image_url: chartUrl,
      sector: 'Hàng tiêu dùng (Consumer Staples)',
      risk_level: 'Thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Kỳ vọng sự phục hồi nhu cầu sữa nội địa trong quý 2 và động thái cơ cấu lại danh mục của các quỹ lớn đối với cổ phiếu blue-chip phòng thủ định giá rẻ.',
      expected_holding_days: 30,
      capital_allocation_pct: 10,
      exec_status: 'waiting_buy', // Reset execution status to waiting buy
      bought_price: null,
      bought_at: null,
      holding_since: null,
      sold_half_price: null,
      sold_half_at: null,
      sold_all_price: null,
      sold_all_at: null,
      exec_note: null
    };

    console.log('Updating VNM trading plan record...');
    const { data: updatedPlan, error: updateError } = await supabase
      .from('trading_plans')
      .update(planUpdate)
      .eq('id', tp.id)
      .select();

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log('Successfully updated VNM Trading Plan in Supabase database!');
    console.log('Updated Record:', updatedPlan[0]);

  } catch (err) {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
  }
}

run();
