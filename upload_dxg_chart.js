const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu DXG đang giao dịch tích lũy nén chặt biên độ trong mẫu hình **Tam giác Hướng lên (Ascending Triangle)** ở vùng đáy trung hạn. Giá đóng cửa phiên gần nhất đạt **13,050 VND** (+1.95%), hiện đang dao động tích lũy ngay sát dưới đường SMA 20 ngày (13.0K) và SMA 50 ngày (13.2K), trong khi SMA 200 ngày (15.0K) đang dốc xuống đóng vai trò là kháng cự dài hạn phía trên.
* Thanh khoản (Volume) có xu hướng sụt giảm sâu sắc trong nhịp tích lũy, đạt khoảng 9.0M cổ phiếu/phiên (thấp hơn nhiều so với trung bình 20 phiên là 13.3M). Điều này chứng minh áp lực bán tháo đã được hấp thụ cạn kiệt, tạo tiền đề nén giá lý tưởng cho nhịp bùng nổ tiếp theo.
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **14,550 VND** khi giá breakout thành công hộp cản ngang ngắn hạn và vượt cản động SMA 200 ngày để xác nhận xu thế đảo chiều tăng hồi phục.

**2. Tính đối xứng (Symmetry)**
* Ngưỡng **13,600 VND** là mốc hỗ trợ ngang cực kỳ vững chắc nâng đỡ nến giá (hợp lưu với trendline tăng chéo dưới). Nhịp nén giảm từ đỉnh ngắn hạn về vùng hỗ trợ tạo ra sự chuẩn bị đối xứng lý tưởng để chuẩn bị hướng về đỉnh phục hồi cũ quanh mốc chốt lời mục tiêu **17,700 VND** (+21.65%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Bất động sản và dịch vụ môi giới bất động sản hồi phục mạnh mẽ theo xu hướng phục hồi của thanh khoản thị trường bất động sản. DXG giữ vị thế top đầu mảng môi giới bất động sản tại Việt Nam, rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan DXG ---');

  // 1. Tìm kiếm kịch bản giao dịch DXG cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch DXG hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'DXG')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản DXG hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Tập đoàn Đất Xanh',
        strategy_name: 'Giao dịch Breakout Hộp Tích Lũy Đáy & Retest Cản Ngang',
        timeframe: 'Trung hạn',
        entry_zone: '14,550',
        stop_loss: '13,600',
        take_profit: '17,700',
        risk_reward: '3.32',
        sector: 'Bất động sản / Real Estate',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Đất Xanh (DXG) tiếp tục đẩy mạnh các dự án phát triển bất động sản và dịch vụ môi giới bất động sản hồi phục mạnh mẽ theo thanh khoản thị trường. Nhịp tích lũy đáy phẳng cạn cung mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/DXG.png',
        created_at: new Date().toISOString(),
        bought_price: null,
        bought_at: null,
        holding_since: null,
        sold_half_price: null,
        sold_half_at: null,
        sold_all_price: null,
        sold_all_at: null
      })
      .eq('id', planId);

    if (updateErr) {
      console.error('Lỗi khi cập nhật kịch bản giao dịch:', updateErr);
      return;
    }
  } else {
    console.log('Không tìm thấy kịch bản DXG nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'DXG',
        company_name: 'Công ty Cổ phần Tập đoàn Đất Xanh',
        strategy_name: 'Giao dịch Breakout Hộp Tích Lũy Đáy & Retest Cản Ngang',
        timeframe: 'Trung hạn',
        entry_zone: '14,550',
        stop_loss: '13,600',
        take_profit: '17,700',
        risk_reward: '3.32',
        sector: 'Bất động sản / Real Estate',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Đất Xanh (DXG) tiếp tục đẩy mạnh các dự án phát triển bất động sản và dịch vụ môi giới bất động sản hồi phục mạnh mẽ theo thanh khoản thị trường. Nhịp tích lũy đáy phẳng cạn cung mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/DXG.png'
      })
      .select('id')
      .single();

    if (insertErr || !newPlan) {
      console.error('Lỗi khi chèn kịch bản giao dịch mới:', insertErr);
      return;
    }
    planId = newPlan.id;
  }

  // 3. Upload ảnh đồ thị lên Supabase Storage
  console.log('Bước 2: Đọc và tải ảnh đồ thị kỹ thuật lên Supabase Storage...');
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781512353018.jpg';
  
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

  // 4. Cập nhật chart_image_url vào Trading Plan
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
