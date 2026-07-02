const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VND đã bứt phá thành công khỏi đường xu hướng giảm (Downtrend Line) kéo dài từ cuối năm 2025.
* Giá hiện tại đang nằm trên cả đường MA20 (17,016 VND) và MA50 (16,368 VND). Đường MA20 hướng lên trên MA50 xác nhận tín hiệu Golden Cross ngắn đến trung hạn.
* Phiên bùng nổ ngày 03/06 ghi nhận khối lượng giao dịch cực đại đạt hơn 29.1M cổ phiếu (vượt xa mức trung bình 20 phiên là 19.1M), cho thấy dòng tiền lớn đã nhập cuộc để đẩy giá bứt thoát khỏi kênh giảm. Nhịp điều chỉnh hiện tại đi kèm Volume thu hẹp cho thấy lực cung bán rát đã được hấp thụ hết.

**2. Tính đối xứng (Symmetry)**
* VND đã thiết lập đáy trung hạn quanh vùng 14K và đang hình thành các đáy sau cao hơn đáy trước (Higher Lows) rất rõ ràng (14K -> 15.5K -> 16.6K).
* Sự đối xứng về mặt biên độ và thời gian của nhịp hồi phục này cho thấy cấu trúc tăng giá mới đang được củng cố bền vững.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm cổ phiếu dịch vụ tài chính / chứng khoán có độ nhạy cao với thanh khoản thị trường. Thanh khoản của VNINDEX đang phục hồi tốt làm gia tăng doanh thu tự doanh và môi giới. Rủi ro phân cực ở mức trung bình.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [4/5]
- Trục Dao động (Sideway Score): [2/5]
- Matrix Evaluation: Tín hiệu Breakout Tăng / Siêu Vuốt Xu Hướng (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VND ---');

  // 1. Tìm kiếm kịch bản giao dịch VND cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VND hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VND')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VND hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Chứng khoán VNDIRECT',
        strategy_name: 'Breakout Đường xu hướng giảm & Tích lũy kênh tăng giá mới',
        timeframe: 'Trung hạn',
        entry_zone: '16,900 - 17,500',
        stop_loss: '15,850',
        take_profit: '20,900',
        risk_reward: '2.74',
        sector: 'Dịch vụ tài chính',
        risk_level: 'Trung bình',
        conviction_level: 'Thường',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Thanh khoản thị trường cải thiện và kỳ vọng kết quả kinh doanh quý 2 của nhóm ngành chứng khoán khả quan.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VND.png',
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
    console.log('Không tìm thấy kịch bản VND nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VND',
        company_name: 'Công ty Cổ phần Chứng khoán VNDIRECT',
        strategy_name: 'Breakout Đường xu hướng giảm & Tích lũy kênh tăng giá mới',
        timeframe: 'Trung hạn',
        entry_zone: '16,900 - 17,500',
        stop_loss: '15,850',
        take_profit: '20,900',
        risk_reward: '2.74',
        sector: 'Dịch vụ tài chính',
        risk_level: 'Trung bình',
        conviction_level: 'Thường',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Thanh khoản thị trường cải thiện và kỳ vọng kết quả kinh doanh quý 2 của nhóm ngành chứng khoán khả quan.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VND.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781235172982.jpg';
  
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
