const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const ticker = 'VPB';
    console.log('Fetching VPB trading plan...');
    const { data: tp, error: getError } = await supabase
      .from('trading_plans')
      .select('id')
      .eq('ticker', ticker)
      .single();

    if (getError || !tp) {
      throw new Error(`Failed to find VPB trading plan: ${getError?.message}`);
    }

    console.log('VPB plan ID:', tp.id);

    // 1. Upload the chart image
    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781509072401.jpg';
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
Cổ phiếu VPB đang vận động tích lũy chặt chẽ quanh dải hỗ trợ Fibonacci 0.5 (khoảng giá 25.600 - 26.250). Phiên giao dịch ngày 15/06 chứng kiến đà bật hồi +0.96% lên 26.250 với khối lượng đạt 16.44 triệu cổ phiếu, cho thấy lực cung bán ra đã được hấp thụ ổn định tại vùng nền hỗ trợ. Giá đang tiệm cận đường xu hướng giảm ngắn hạn. Điểm kích hoạt breakout vượt qua kháng cự chéo ngắn hạn tại 27.450 sẽ xác nhận nhịp tăng mới hướng về mục tiêu đỉnh cũ.

**2. Tính đối xứng (Symmetry)**
Vùng tích lũy quanh Fibo 0.5 (25.600 - 26.250) tương ứng chặt chẽ về mặt kỹ thuật với các sóng đẩy tăng trung hạn trước đó. Cấu trúc giá hiện tại cho thấy sự tôn trọng đặc biệt đối với vùng hỗ trợ này.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
Ngành ngân hàng duy trì vị thế dẫn dắt với dòng tiền lớn tham gia. Vị thế của VPB có rủi ro thấp nhờ vùng cắt lỗ Stop Loss chỉ cách điểm mua -7.10%, bảo toàn vốn tối đa trong kịch bản tiêu cực.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [2/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)
`;

    const planUpdate = {
      strategy_name: 'Trend Following / Breakout Trendline',
      timeframe: 'Ngắn – Trung hạn (1 – 3 tháng)',
      entry_zone: '27.450',
      stop_loss: '25.500 (-7.10%)',
      take_profit: '33.850 (+23.32%)',
      risk_reward: '3.28',
      max_position_pct: 10,
      indicators: ['MA20', 'RSI', 'Bollinger Bands'],
      entry_criteria: [
        'Giá đóng cửa breakout đường xu hướng giảm ngắn hạn vượt 27.450',
        'Khối lượng giao dịch tăng cao xác nhận lực mua bứt phá'
      ],
      exit_criteria: [
        'Cắt lỗ dứt khoát nếu đóng cửa thủng hỗ trợ 25.500',
        'Chốt lời chủ động khi tiệm cận kháng cự đỉnh cũ quanh 33.850'
      ],
      analyst_note: analystNote,
      wave_index: 'Sideway 2',
      is_confirmed: true, // Approved and Live!
      status: 'active',
      chart_image_url: chartUrl,
      sector: 'Ngân hàng',
      risk_level: 'Thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Kỳ vọng tăng trưởng tín dụng phục hồi mạnh mẽ trong quý 2 và dòng tiền khối ngoại quay trở lại các cổ phiếu ngân hàng lớn có định giá rẻ.',
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

    console.log('Updating VPB trading plan record...');
    const { data: updatedPlan, error: updateError } = await supabase
      .from('trading_plans')
      .update(planUpdate)
      .eq('id', tp.id)
      .select();

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log('Successfully updated VPB Trading Plan in Supabase database!');
    console.log('Updated Record:', updatedPlan[0]);

  } catch (err) {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
  }
}

run();
