const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const ticker = 'MWG';
    console.log('Fetching MWG trading plan...');
    const { data: tp, error: getError } = await supabase
      .from('trading_plans')
      .select('id')
      .eq('ticker', ticker)
      .single();

    if (getError || !tp) {
      throw new Error(`Failed to find MWG trading plan: ${getError?.message}`);
    }

    console.log('MWG plan ID:', tp.id);

    // 1. Upload the chart image
    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781508567620.jpg';
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
Cổ phiếu MWG đang hình thành một cấu trúc tích lũy biên độ rộng tại vùng nền hỗ trợ dài hạn quanh 74.200 - 76.000. Phiên giao dịch ngày 15/06 chứng kiến sức bật mạnh tăng +3.80% lên 79.300 với khối lượng gia tăng lên 6.96 triệu cổ phiếu, báo hiệu dòng tiền cầu bắt đáy chủ động hấp thụ lượng cung bán ra. Giá đang tiệm cận và chuẩn bị kiểm định bứt phá đường xu hướng giảm ngắn hạn. Điểm kích hoạt breakout vượt 80.500 sẽ là tín hiệu chính thức để vào vị thế mua mới.

**2. Tính đối xứng (Symmetry)**
Nhịp chỉnh từ đỉnh 94.400 kéo dài 22 phiên đối xứng khá tốt với nhịp tăng trước đó. Vùng hỗ trợ cứng 74.200 - 76.000 hoạt động tin cậy và đã được test đáy thành công nhiều lần.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
Ngành bán lẻ đang có sự hồi phục vĩ mô nhờ sức mua nội địa cải thiện. Vị thế kỹ thuật của MWG có rủi ro thấp do biên cắt lỗ Stop Loss nằm ngay sát nền hỗ trợ cứng của Darvas Box.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [2/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)
`;

    const planUpdate = {
      strategy_name: 'Trend Following / Breakout Trendline',
      timeframe: 'Ngắn – Trung hạn (1 – 3 tháng)',
      entry_zone: '80.500',
      stop_loss: '75.400 (-6.34%)',
      take_profit: '94.500 (+17.39%)',
      risk_reward: '2.75',
      max_position_pct: 10,
      indicators: ['MA20', 'RSI', 'Bollinger Bands'],
      entry_criteria: [
        'Giá đóng cửa breakout đường xu hướng giảm ngắn hạn vượt 80.500',
        'Khối lượng khớp lệnh tăng mạnh củng cố đà tăng'
      ],
      exit_criteria: [
        'Cắt lỗ dứt khoát nếu đóng cửa thủng hỗ trợ 75.400',
        'Chốt lời chủ động tại kháng cự đỉnh cũ quanh 94.500'
      ],
      analyst_note: analystNote,
      wave_index: 'Sideway 2',
      is_confirmed: true, // Approved and Live!
      status: 'active',
      chart_image_url: chartUrl,
      sector: 'Bán lẻ',
      risk_level: 'Thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Kỳ vọng tăng trưởng doanh thu từ chuỗi Bách Hóa Xanh đạt điểm hòa vốn và mở rộng lợi nhuận ròng, cộng hưởng với kết quả kinh doanh bán lẻ quý 2 khả quan.',
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

    console.log('Updating MWG trading plan record...');
    const { data: updatedPlan, error: updateError } = await supabase
      .from('trading_plans')
      .update(planUpdate)
      .eq('id', tp.id)
      .select();

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    console.log('Successfully updated MWG Trading Plan in Supabase database!');
    console.log('Updated Record:', updatedPlan[0]);

  } catch (err) {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
  }
}

run();
