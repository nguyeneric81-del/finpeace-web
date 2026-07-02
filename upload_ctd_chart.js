const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* CTD đang vận động tích lũy trong một biên độ lớn (Darvas Box) từ 70,000 VND đến 92,000 VND trong suốt 9 tháng qua. Giá hiện tại (72,300 VND) đang nằm dưới đường trung bình động dài hạn SMA 200 ngày (quanh 76,376 VND) và cụm MA20/MA50 (quanh 72.5K - 77.5K).
* Khối lượng giao dịch (Volume) ở nhịp điều chỉnh giảm tiệm cận biên dưới của hộp tích lũy đã cạn kiệt rất sâu, phiên gần nhất đạt 580K cổ phiếu (thấp hơn nhiều so với trung bình 20 phiên là 735K). Điều này cho thấy lực cung bán rát đã được triệt tiêu hoàn toàn tại vùng giá thấp.
* Điểm mua kích hoạt tối ưu theo đồ thị là điểm Breakout vượt 73,400 VND (vượt qua đường xu hướng giảm ngắn hạn) để xác nhận dòng tiền quay trở lại đẩy giá kiểm định lại dải MA200 và hướng về biên trên của hộp tích lũy.

**2. Tính đối xứng (Symmetry)**
* Cận dưới của hộp tích lũy quanh vùng 69,000 - 70,000 VND (biểu diễn bởi hộp màu xanh trên đồ thị) đóng vai trò hỗ trợ rất cứng và đối xứng với các chu kỳ kiểm định đáy trước đó vào tháng 12/2025 và tháng 2/2026.
* Điểm dừng lỗ đặt tại 69,300 VND (ngay dưới đáy cũ và biên dưới của hộp) giúp hạn chế rủi ro ở mức tối thiểu (-5.59%), trong khi mục tiêu chốt lời hướng về biên trên của hộp tại 92,700 VND mang lại tỷ lệ lợi nhuận vượt trội (+26.29%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Coteccons (CTD) giữ vững vị thế nhà thầu xây dựng dân dụng và công nghiệp số 1 Việt Nam với backlog dự án khổng lồ từ các tập đoàn FDI lớn (như Lego, Pandora). Rủi ro tài chính thấp và năng lực thi công vượt trội giúp cổ phiếu có sức chống chịu cực tốt trước các biến động ngành xây dựng. Rủi ro phân cực ngành ở mức thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan CTD ---');

  // 1. Tìm kiếm kịch bản giao dịch CTD cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch CTD hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'CTD')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản CTD hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Xây dựng Coteccons',
        strategy_name: 'Breakout Kênh tích lũy phẳng (Darvas Box) kiệt cung',
        timeframe: 'Trung hạn',
        entry_zone: '73,400',
        stop_loss: '69,300',
        take_profit: '92,700',
        risk_reward: '4.71',
        sector: 'Xây dựng & Đầu tư công',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Coteccons (CTD) giữ vững vị thế nhà thầu xây dựng dân dụng và công nghiệp số 1 Việt Nam với backlog dự án khổng lồ từ các tập đoàn FDI lớn (như Lego, Pandora). Rủi ro tài chính thấp và năng lực thi công vượt trội giúp cổ phiếu có sức chống chịu cực tốt trước các biến động ngành xây dựng.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTD.png',
        created_at: new Date().toISOString(),
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 73,400","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 92,700","Cắt lỗ nếu đóng cửa dưới 69,300"]',
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
    console.log('Không tìm thấy kịch bản CTD nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'CTD',
        company_name: 'Công ty Cổ phần Xây dựng Coteccons',
        strategy_name: 'Breakout Kênh tích lũy phẳng (Darvas Box) kiệt cung',
        timeframe: 'Trung hạn',
        entry_zone: '73,400',
        stop_loss: '69,300',
        take_profit: '92,700',
        risk_reward: '4.71',
        sector: 'Xây dựng & Đầu tư công',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Coteccons (CTD) giữ vững vị thế nhà thầu xây dựng dân dụng và công nghiệp số 1 Việt Nam với backlog dự án khổng lồ từ các tập đoàn FDI lớn (như Lego, Pandora). Rủi ro tài chính thấp và năng lực thi công vượt trội giúp cổ phiếu có sức chống chịu cực tốt trước các biến động ngành xây dựng.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTD.png',
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 73,400","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 92,700","Cắt lỗ nếu đóng cửa dưới 69,300"]'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781513447744.jpg';
  
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
