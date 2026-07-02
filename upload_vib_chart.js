const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VIB đã có nhịp điều chỉnh đáng kể từ đỉnh 23.5K về vùng hỗ trợ cực mạnh quanh 15.0K - 16.0K.
* Hiện tại, giá đang phản ứng tích cực khi chạm đường xu hướng tăng (Uptrend line) dài hạn. Phiên hôm nay xuất hiện nến xanh hồi phục tăng lên mức 16,250 VND (+1.88%).
* Thanh khoản đang cạn kiệt dần (Volume chỉ đạt 6.1M cổ phiếu so với trung bình 20 phiên là 8.5M), cho thấy áp lực bán rát tại vùng đáy cũ đã hoàn toàn biến mất. Cổ phiếu đang tích lũy năng lượng rất tốt ngay phía trên đường hỗ trợ trung dài hạn.

**2. Tính đối xứng (Symmetry)**
* Đường xu hướng tăng dài hạn từ năm 2025 đóng vai trò là xương sống cho xu hướng tăng của VIB. Giá điều chỉnh về trendline này luôn có lực cầu tổ chức tham gia đỡ giá và tạo đáy chu kỳ mới.
* Quá trình nén giá trong mô hình tam giác cho thấy cấu trúc tăng trưởng vẫn nguyên vẹn và đang chuẩn bị cho nhịp tăng đối xứng tiếp theo.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngân hàng đóng vai trò dẫn dắt chỉ số VNINDEX. VIB có câu chuyện kinh doanh bán lẻ xuất sắc, hiệu quả sinh lời trên vốn (ROE) đứng đầu hệ thống, đang được định giá rất rẻ tại vùng hỗ trợ dài hạn. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VIB ---');

  // 1. Tìm kiếm kịch bản giao dịch VIB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VIB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VIB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VIB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Quốc tế Việt Nam',
        strategy_name: 'Breakout Tam giác hội tụ & Tích lũy trên Trendline dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '17,150',
        stop_loss: '16,100',
        take_profit: '20,550',
        risk_reward: '3.24',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VIB duy trì tỷ suất cổ tức cao, hiệu quả hoạt động hàng đầu ngành (tập trung mạnh vào mảng bán lẻ tiêu dùng và cho vay mua nhà) và định giá P/B đang ở mức hấp dẫn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VIB.png',
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
    console.log('Không tìm thấy kịch bản VIB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VIB',
        company_name: 'Ngân hàng TMCP Quốc tế Việt Nam',
        strategy_name: 'Breakout Tam giác hội tụ & Tích lũy trên Trendline dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '17,150',
        stop_loss: '16,100',
        take_profit: '20,550',
        risk_reward: '3.24',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VIB duy trì tỷ suất cổ tức cao, hiệu quả hoạt động hàng đầu ngành (tập trung mạnh vào mảng bán lẻ tiêu dùng và cho vay mua nhà) và định giá P/B đang ở mức hấp dẫn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VIB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781247674987.jpg';
  
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
