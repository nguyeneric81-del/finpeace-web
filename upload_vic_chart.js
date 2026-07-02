const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VIC đã trải qua nhịp điều chỉnh đáng kể từ đỉnh 232.4K về sát vùng cản ngang đỉnh cũ đã vượt qua. Hiện tại, giá đóng cửa phiên gần nhất đạt **192,800 VND** (-1.38%), giá đang nằm dưới các đường MA20 (206K) và MA50 (203K) nhưng vẫn duy trì khoảng cách an toàn rất lớn phía trên đường SMA 200 ngày (147.7K).
* Thanh khoản (Volume) có xu hướng sụt giảm sâu, chỉ đạt khoảng 3.2M cổ phiếu/phiên, tiệm cận mức trung bình 20 phiên. Điều này cho thấy áp lực bán rát tại vùng đáy cũ đã biến mất, lực cung được hấp thụ ổn định tại các vùng hỗ trợ phía dưới.
* Điểm mua pullback tối ưu được xác lập tại vùng hỗ trợ ngang cứng và mức Fibonacci 0.5 (quanh vùng giá **177,800 VND**), cho tỷ lệ Risk:Reward cực kỳ tối ưu.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 175K - 178K là ngưỡng hỗ trợ Fib 0.5 rất mạnh, đồng thời là đỉnh cũ tích lũy đã vượt qua trước đó. Sự đối xứng của nhịp tăng trước từ đáy 123.5K lên đỉnh 232.4K cho thấy nhịp điều chỉnh về Fib 0.5 là vùng nén lý tưởng để khởi động con sóng tăng tiếp theo hướng thẳng về đỉnh cũ **232,400 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Tập đoàn đa ngành Vingroup giữ vai trò dẫn dắt dòng tiền thị trường. Với mảng bất động sản Vinhomes duy trì phong độ và hoạt động công nghiệp xe điện VinFast được đẩy mạnh xuất khẩu toàn cầu, Vingroup có bệ đỡ vĩ mô vững chắc. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VIC ---');

  // 1. Tìm kiếm kịch bản giao dịch VIC cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VIC hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VIC')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VIC hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Tập đoàn Vingroup',
        strategy_name: 'Pullback hỗ trợ Fib 0.5 & Retest Đỉnh Cũ Tích Lũy',
        timeframe: 'Trung hạn',
        entry_zone: '177,800',
        stop_loss: '164,300',
        take_profit: '232,400',
        risk_reward: '4.04',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Vingroup (VIC) tiếp tục đẩy mạnh các dự án phát triển công nghiệp ô tô điện VinFast xuất khẩu toàn cầu cùng hoạt động bất động sản hồi phục mạnh mẽ. Cú điều chỉnh về Fib 0.5 hợp lưu với bệ đỡ đỉnh cũ mở ra cơ hội tích lũy trung hạn rất an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VIC.png',
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
    console.log('Không tìm thấy kịch bản VIC nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VIC',
        company_name: 'Tập đoàn Vingroup',
        strategy_name: 'Pullback hỗ trợ Fib 0.5 & Retest Đỉnh Cũ Tích Lũy',
        timeframe: 'Trung hạn',
        entry_zone: '177,800',
        stop_loss: '164,300',
        take_profit: '232,400',
        risk_reward: '4.04',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Vingroup (VIC) tiếp tục đẩy mạnh các dự án phát triển công nghiệp ô tô điện VinFast xuất khẩu toàn cầu cùng hoạt động bất động sản hồi phục mạnh mẽ. Cú điều chỉnh về Fib 0.5 hợp lưu với bệ đỡ đỉnh cũ mở ra cơ hội tích lũy trung hạn rất an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VIC.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781510148000.jpg';
  
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
