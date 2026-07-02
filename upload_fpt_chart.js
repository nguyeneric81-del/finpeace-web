const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu FPT đã xác lập vùng đáy ngắn hạn quanh 67K - 70K và đang phục hồi về vùng giá hiện tại là **73,700 VND**. Giá hiện nằm ngay sát dưới đường SMA 50 ngày (73.6K) và SMA 20 ngày (73.8K), trong khi SMA 200 ngày (87.9K) đang dốc xuống đóng vai trò là kháng cự dài hạn phía trên.
* Điểm đáng chú ý nhất là thanh khoản (Volume) có xu hướng sụt giảm rất sâu, chỉ đạt 3.5M - 5.6M cổ phiếu/phiên (thấp hơn 50% so với trung bình 20 phiên là 11.2M). Điều này chứng minh lượng cung bán tháo đã được hấp thụ cạn kiệt, tạo tiền đề nén giá lý tưởng cho nhịp bùng nổ tiếp theo.
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **78,200 VND** khi giá breakout thành công mẫu hình tam giác hướng lên và vượt cản ngang nền đáy để mở ra xu hướng tăng mới.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 72K - 78K đóng vai trò là vùng tích lũy gom hàng vững chắc sau nhịp điều chỉnh dài. Thời gian nén giá hơn 40 phiên vừa qua là sự chuẩn bị đối xứng cần thiết cho một nhịp hồi phục trung hạn mạnh mẽ, nhắm tới mục tiêu chốt lời tại vùng cản cũ là **97,700 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Công nghệ thông tin vẫn giữ tốc độ tăng trưởng cao nhất thị trường nhờ xu hướng chuyển đổi số toàn cầu và xuất khẩu phần mềm bền bỉ sang Nhật/Mỹ. FPT là doanh nghiệp công nghệ số 1 Việt Nam với các dự án lớn về AI và Bán dẫn.
* Rủi ro phân cực ngành cực kỳ thấp nhờ tính chất phòng thủ tăng trưởng đặc thù của nhóm công nghệ thông tin.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan FPT ---');

  // 1. Tìm kiếm kịch bản giao dịch FPT cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch FPT hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'FPT')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản FPT hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần FPT',
        strategy_name: 'Giao dịch Breakout Hộp Tích Lũy Đáy & Retest Cản Ngang',
        timeframe: 'Trung hạn',
        entry_zone: '78,200',
        stop_loss: '74,300',
        take_profit: '97,700',
        risk_reward: '5.00',
        sector: 'Công nghệ',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'FPT Corp tiếp tục dẫn đầu xu thế chuyển đổi số, xuất khẩu phần mềm sang Nhật/Mỹ tăng trưởng mạnh mẽ và đầu tư mạnh vào AI/Bán dẫn. Cấu trúc nén đáy phẳng cạn cung mở ra cơ hội giao dịch breakout cực kỳ hấp dẫn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/FPT.png',
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
    console.log('Không tìm thấy kịch bản FPT nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'FPT',
        company_name: 'Công ty Cổ phần FPT',
        strategy_name: 'Giao dịch Breakout Hộp Tích Lũy Đáy & Retest Cản Ngang',
        timeframe: 'Trung hạn',
        entry_zone: '78,200',
        stop_loss: '74,300',
        take_profit: '97,700',
        risk_reward: '5.00',
        sector: 'Công nghệ',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'FPT Corp tiếp tục dẫn đầu xu thế chuyển đổi số, xuất khẩu phần mềm sang Nhật/Mỹ tăng trưởng mạnh mẽ và đầu tư mạnh vào AI/Bán dẫn. Cấu trúc nén đáy phẳng cạn cung mở ra cơ hội giao dịch breakout cực kỳ hấp dẫn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/FPT.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781509630281.jpg';
  
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
