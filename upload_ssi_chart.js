const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu SSI đang giao dịch trong một nhịp điều chỉnh kéo dài từ đỉnh năm 2025. Giá đóng cửa phiên gần nhất là **26,150 VND**, nằm dưới các đường trung bình động MA20 (27,197), MA50 (27,760) và MA200 (31,787).
* Lực bán trong các phiên gần đây đang cho thấy sự cạn kiệt rõ nét: Volume giảm mạnh trên các nến đỏ (phiên 11/06 chỉ đạt 7.4M cổ phiếu, bằng một nửa trung bình 20 phiên là 15.3M).
* Vùng giá **25,900 VND** là vùng hỗ trợ hội tụ rất mạnh, bao gồm cạnh dưới hộp tích lũy cũ và đường xu hướng tăng (Uptrend Line) nâng đỡ dài hạn kéo dài từ cuối năm 2022, hợp lưu với Fibonacci Retracement 0.618 (26,350).
* Trạng thái kỹ thuật ngắn hạn đang cực kỳ quá bán (Stochastic %K ở mức 0.00), dải Bollinger Lower tiệm cận sát mốc 26,026 VND, báo hiệu lực bán đã căng cứng và chuẩn bị xuất hiện nhịp phục hồi kỹ thuật.

**2. Phân tích Tính Đối Xứng (Symmetry)**
* Nhịp điều chỉnh ngắn hạn gần đây từ đỉnh 28,800 về 26,150 kéo dài khoảng 12 phiên, tương đối đồng đều với độ dài các nhịp điều chỉnh rung lắc trong quá khứ của SSI (thường từ 10 - 15 phiên).
* Mức chiết khấu từ đỉnh ngắn hạn về vùng hỗ trợ mục tiêu 25,900 là khoảng 10%, tạo độ nén hợp lý cho nhịp bật phục hồi trung hạn hướng về vùng MA200 và kháng cự cũ quanh **31,200 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Dịch vụ tài chính (Chứng khoán) có độ nhạy rất cao với thị trường chung (Beta lớn). Khi chỉ số chung kiểm định đáy thành công và thanh khoản cạn kiệt, nhóm Chứng khoán sẽ là nhóm đầu tiên phát tín hiệu đảo chiều. Mức độ rủi ro trung bình nhờ vùng mua an toàn tiệm cận sát hỗ trợ dài hạn.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [1/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Limit Trigger tại 25,900)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan SSI ---');

  // 1. Tìm kiếm kịch bản giao dịch SSI cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch SSI hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'SSI')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  const planPayload = {
    ticker: 'SSI',
    company_name: 'Cổ phần Chứng khoán SSI',
    strategy_name: 'Pullback hỗ trợ ngang & Kênh xu hướng tăng dài hạn',
    timeframe: 'Trung hạn',
    entry_zone: '25,900',
    stop_loss: '23,950',
    take_profit: '31,200',
    risk_reward: '2.72',
    sector: 'Dịch vụ tài chính',
    risk_level: 'Trung bình',
    conviction_level: 'Thường',
    analyst_note: ANALYST_NOTE,
    catalyst_note: 'Hưởng lợi từ câu chuyện nâng hạng thị trường, kỳ vọng dòng tiền thông minh sớm quay lại nhóm dịch vụ tài chính khi thanh khoản thị trường hồi phục.',
    is_confirmed: true,
    expected_holding_days: 60,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    exchange: 'HOSE',
    logo_url: 'https://vsd.vn/Images/Logo/SSI.png',
    created_at: new Date().toISOString(),
    bought_price: null,
    bought_at: null,
    holding_since: null,
    sold_half_price: null,
    sold_half_at: null,
    sold_all_price: null,
    sold_all_at: null
  };

  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản SSI hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update(planPayload)
      .eq('id', planId);

    if (updateErr) {
      console.error('Lỗi khi cập nhật kịch bản giao dịch:', updateErr);
      return;
    }
  } else {
    console.log('Không tìm thấy kịch bản SSI nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert(planPayload)
      .select('id')
      .single();

    if (insertErr || !newPlan) {
      console.error('Lỗi khi chèn kịch bản giao dịch mới:', insertErr);
      return;
    }
    planId = newPlan.id;
  }

  // 2. Upload ảnh đồ thị lên Supabase Storage
  console.log('Bước 2: Đọc và tải ảnh đồ thị kỹ thuật lên Supabase Storage...');
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781490476754.jpg';
  
  if (!fs.existsSync(imagePath)) {
    console.error(`Không tìm thấy file ảnh đồ thị tại đường dẫn: ${imagePath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const fileName = `charts/${planId}/${Date.now()}.jpg`;

  const { data: uploaded, error: uploadErr } = await supabase.storage
    .from('advisor-charts')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (uploadErr || !uploaded) {
    console.error('Lỗi khi upload ảnh đồ thị:', uploadErr);
    return;
  }

  const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;
  console.log(`Upload thành công. Link ảnh public: ${chartUrl}`);

  // 3. Cập nhật chart_image_url vào Trading Plan
  console.log('Bước 3: Cập nhật đường dẫn ảnh vào bản ghi kịch bản...');
  const { error: updateChartErr } = await supabase
    .from('trading_plans')
    .update({ chart_image_url: chartUrl })
    .eq('id', planId);

  if (updateChartErr) {
    console.error('Lỗi khi cập nhật link ảnh đồ thị:', updateChartErr);
    return;
  }
  console.log('Cập nhật link ảnh thành công!');
  console.log('--- Hoàn tất quy trình xử lý ---');
}

run();
