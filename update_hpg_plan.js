const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const ticker = 'HPG';
    console.log('Fetching HPG trading plan...');
    const { data: tp, error: getError } = await supabase
      .from('trading_plans')
      .select('id')
      .eq('ticker', ticker)
      .single();

    if (getError || !tp) {
      throw new Error(`Failed to find HPG trading plan: ${getError?.message}`);
    }

    console.log('HPG plan ID:', tp.id);

    // 1. Upload the chart image
    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781508357391.jpg';
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
Cổ phiếu HPG đang giao dịch tích lũy ổn định trong biên độ hẹp (Darvas Box) từ 23.200 đến 27.000. Phiên giao dịch ngày 15/06 chứng kiến đà hồi phục mạnh mẽ tăng +3.45% đóng cửa tại 24.000 với khối lượng khớp lệnh bùng nổ đạt 28.35 triệu cổ phiếu, vượt hẳn mức trung bình 20 phiên (20.68 triệu). Giá đang tiệm cận để kiểm định và bứt phá đường xu hướng giảm ngắn hạn. Việc vượt qua mức kháng cự ngắn hạn 24.200 sẽ kích hoạt điểm mua gia tăng động lượng.

**2. Tính đối xứng (Symmetry)**
Chu kỳ điều chỉnh kéo dài khoảng 22 phiên từ vùng đỉnh cũ, tương thích đối xứng về mặt thời gian với các sóng điều chỉnh trước đó. Mức hỗ trợ biên dưới 23.100 - 23.200 đã chứng minh lực cầu hấp thụ cực kỳ tốt và đóng vai trò chốt chặn tin cậy.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
Ngành thép đang có tín hiệu tạo đáy vĩ mô rõ ràng, triển vọng nhu cầu nội địa ổn định. HPG là đầu tàu với biên lợi nhuận kỳ vọng cải thiện trong quý 2. Mức độ rủi ro của deal này là thấp do điểm cắt lỗ nằm ngay sát biên dưới của hộp tích lũy.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [2/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)
`;

    const planUpdate = {
      strategy_name: 'Trend Following / Breakout Trendline',
      timeframe: 'Ngắn – Trung hạn (1 – 3 tháng)',
      entry_zone: '24.200',
      stop_loss: '23.100 (-4.55%)',
      take_profit: '27.500 (+13.64%)',
      risk_reward: '3.0',
      max_position_pct: 10,
      indicators: ['MA20', 'RSI', 'Bollinger Bands'],
      entry_criteria: [
        'Giá breakout đường xu hướng giảm ngắn hạn vượt 24.200',
        'Khối lượng giao dịch tăng mạnh xác nhận dòng tiền'
      ],
      exit_criteria: [
        'Cắt lỗ dứt khoát nếu đóng cửa thủng hỗ trợ hộp 23.100',
        'Chốt lời chủ động khi giá tiệm cận biên trên hộp quanh 27.500'
      ],
      analyst_note: analystNote,
      wave_index: 'Sideway 2',
      is_confirmed: true, // Approved and Live!
      status: 'active',
      chart_image_url: chartUrl,
      sector: 'Thép',
      risk_level: 'Thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Sự phục hồi biên lợi nhuận của ngành thép trong quý 2 và dòng tiền khối ngoại quay trở lại các cổ phiếu blue-chip tại vùng định giá an toàn.',
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

    console.log('Updating HPG trading plan record...');
    const { data: updatedPlan, error: updateError } = await supabase
      .from('trading_plans')
      .update(planUpdate)
      .eq('id', tp.id)
      .select();

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log('Successfully updated HPG Trading Plan in Supabase database!');
    console.log('Updated Record:', updatedPlan[0]);

  } catch (err) {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
  }
}

run();
