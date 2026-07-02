const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu HDB đã điều chỉnh từ đỉnh ngắn hạn 28.1K về sát dải dưới Bollinger Bands và tiệm cận đường SMA 200 ngày (quanh mốc 25.9K). Hiện tại, giá đóng cửa phiên gần nhất đạt **25,100 VND**.
* Thanh khoản đang cạn kiệt rất rõ rệt (Volume phiên gần nhất chỉ đạt 4.9M cổ phiếu so với trung bình 20 phiên là 10.3M), cho thấy lực cung bán tháo tại vùng đáy ngắn hạn đã được hấp thụ hết. Cổ phiếu đang tích lũy nén năng lượng rất tốt.
* Để đảm bảo an toàn và xác nhận dòng tiền lớn gia tăng trở lại, điểm mua tối ưu sẽ là khi giá **breakout vượt cản chéo kháng cự tại mốc 25,450 VND** với khối lượng xác nhận.

**2. Tính đối xứng (Symmetry)**
* Vùng giá **24,000 VND - 24,500 VND** đóng vai trò là bệ đỡ xu hướng tăng trung hạn dài hạn của HDB từ năm 2025. Nhịp điều chỉnh giảm biên độ hẹp dần và kéo dài từ đầu năm 2026 tạo ra sự nén giá đối xứng rất tốt để chuẩn bị cho nhịp tăng tiếp theo hướng về đỉnh cũ.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng duy trì kết quả kinh doanh tăng trưởng ổn định và đóng vai trò nâng đỡ thị trường tốt. HDBank nổi bật với tỷ lệ sinh lời ROE dẫn đầu hệ thống, biên NIM ổn định và thu hút dòng vốn ngoại tốt nhờ định giá P/E, P/B chiết khấu sâu. Rủi ro phân cực của nhóm ngành ở mức thấp, cổ phiếu có tính phòng thủ cao.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan HDB ---');

  // 1. Tìm kiếm kịch bản giao dịch HDB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch HDB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'HDB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản HDB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
        strategy_name: 'Breakout nêm hội tụ & Hồi phục từ hỗ trợ dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '25,450',
        stop_loss: '24,050',
        take_profit: '29,900',
        risk_reward: '3.18',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'HDB duy trì kết quả kinh doanh tăng trưởng ấn tượng trong nhóm ngân hàng thương mại cổ phần tư nhân. Định giá P/E và P/B ở mức chiết khấu cao, thu hút dòng vốn ngoại mạnh mẽ. Cổ phiếu đang tích lũy cạn kiệt ở cuối mẫu hình nêm hội tụ.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/HDB.png',
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
    console.log('Không tìm thấy kịch bản HDB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'HDB',
        company_name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
        strategy_name: 'Breakout nêm hội tụ & Hồi phục từ hỗ trợ dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '25,450',
        stop_loss: '24,050',
        take_profit: '29,900',
        risk_reward: '3.18',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'HDB duy trì kết quả kinh doanh tăng trưởng ấn tượng trong nhóm ngân hàng thương mại cổ phần tư nhân. Định giá P/E và P/B ở mức chiết khấu cao, thu hút dòng vốn ngoại mạnh mẽ. Cổ phiếu đang tích lũy cạn kiệt ở cuối mẫu hình nêm hội tụ.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/HDB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781250456982.jpg';
  
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
