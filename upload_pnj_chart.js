const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu PNJ đã xác lập vùng đáy ngắn hạn quanh 62K - 63K và đang phục hồi tốt về vùng giá hiện tại là **65,000 VND** (+4.84%). Giá hiện đang giao dịch tích lũy nén chặt ngay sát dưới đường SMA 200 ngày (65.8K) và đường SMA 50 ngày (68.1K).
* Thanh khoản (Volume) sụt giảm sâu trong nhịp tích lũy, đạt khoảng 783K cổ phiếu (thấp hơn so với trung bình 20 phiên là 900K). Đây là dấu hiệu của sự cạn kiệt cung bán hoàn toàn tại vùng cạnh dưới của tam giác, biểu thị cho sự nén giá cực hạn (VCP) trên Fib 0.5.
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **66,800 VND** khi giá breakout thành công hộp cản ngang ngắn hạn và vượt cản động SMA 200 ngày để xác nhận xu thế đảo chiều tăng hồi phục.

**2. Tính đối xứng (Symmetry)**
* Ngưỡng **62,500 VND** là mốc hỗ trợ ngang cực kỳ vững chắc nâng đỡ nến giá. Nhịp nén giảm tích lũy kéo dài hơn 30 phiên từ vùng đỉnh cũ 84.7K về Fib 0.5 là sự chuẩn bị đối xứng cần thiết để khởi động nhịp hồi phục trung hạn hướng về vùng đỉnh cũ quanh mốc chốt lời mục tiêu **84,700 VND** (+26.80%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Bán lẻ & Trang sức tăng trưởng ổn định theo tốc độ gia tăng tiêu dùng tầng lớp trung lưu trong nước. PNJ sở hữu thị phần độc tôn phân khúc bán lẻ trang sức lớn tại Việt Nam với kết quả kinh doanh liên tục tăng trưởng. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan PNJ ---');

  // 1. Tìm kiếm kịch bản giao dịch PNJ cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch PNJ hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'PNJ')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản PNJ hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Vàng bạc Đá quý Phú Nhuận',
        strategy_name: 'Breakout Hộp Tích Lũy Đáy & Hồi Phục Từ Fib 0.5',
        timeframe: 'Trung hạn',
        entry_zone: '66,800',
        stop_loss: '62,500',
        take_profit: '84,700',
        risk_reward: '4.16',
        sector: 'Bán lẻ',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'PNJ tiếp tục giữ vững vị thế số 1 trong thị trường bán lẻ trang sức tại Việt Nam nhờ hệ thống cửa hàng rộng lớn và kết quả kinh doanh tăng trưởng đều đặn. Nhịp tích lũy đáy trên Fib 0.5 cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/PNJ.png',
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
    console.log('Không tìm thấy kịch bản PNJ nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'PNJ',
        company_name: 'Công ty Cổ phần Vàng bạc Đá quý Phú Nhuận',
        strategy_name: 'Breakout Hộp Tích Lũy Đáy & Hồi Phục Từ Fib 0.5',
        timeframe: 'Trung hạn',
        entry_zone: '66,800',
        stop_loss: '62,500',
        take_profit: '84,700',
        risk_reward: '4.16',
        sector: 'Bán lẻ',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'PNJ tiếp tục giữ vững vị thế số 1 trong thị trường bán lẻ trang sức tại Việt Nam nhờ hệ thống cửa hàng rộng lớn và kết quả kinh doanh tăng trưởng đều đặn. Nhịp tích lũy đáy trên Fib 0.5 cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/PNJ.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781511956048.jpg';
  
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
