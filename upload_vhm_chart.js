const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VHM đã trải qua nhịp điều chỉnh đáng kể từ đỉnh 173.3K về sát vùng cản chéo và đường SMA 200 ngày (quanh mốc 115.8K - 116.9K). Hiện tại, giá đóng cửa phiên gần nhất đạt **135,800 VND** (-2.09%), nến giá đang bám sát dải dưới Bollinger Band (Lower Band: 137.4K).
* Thanh khoản (Volume) duy trì ở mức trung bình ổn định (4.3M so với trung bình 20 phiên là 4.6M), không có áp lực bán tháo hoảng loạn tại vùng giá này, thể hiện lực cung đang suy kiệt dần tại vùng hỗ trợ.
* Điểm mua pullback tối ưu được xác lập tại vùng hỗ trợ ngang cứng và mức Fibonacci 0.618 (quanh vùng giá **123,200 VND**), cho tỷ lệ Risk:Reward cực kỳ tối ưu.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 120.6K - 123.2K là ngưỡng hỗ trợ Fib 0.618 rất mạnh, đồng thời là đỉnh cũ tích lũy đã vượt qua trước đó. Sự đối xứng của nhịp tăng trước từ đáy 87.7K lên đỉnh 173.3K cho thấy nhịp điều chỉnh về Fib 0.618 là vùng nén lý tưởng để khởi động con sóng tăng tiếp theo hướng thẳng về đỉnh cũ 173.3K.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Bất động sản đang đón nhận nhiều chính sách hỗ trợ tích cực và bước vào chu kỳ phục hồi rõ rệt. Vinhomes có sức khỏe tài chính vượt trội, đòn bẩy nợ thấp nhất ngành và dòng tiền bán hàng dồi dào. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VHM ---');

  // 1. Tìm kiếm kịch bản giao dịch VHM cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VHM hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VHM')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VHM hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Vinhomes',
        strategy_name: 'Pullback hỗ trợ Fib 0.618 & Retest SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '123,200',
        stop_loss: '114,600',
        take_profit: '173,300',
        risk_reward: '5.83',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'FPT Corp và VHM là hai trụ cột lớn của rổ chỉ số VN30. Vinhomes (VHM) tiếp tục dẫn đầu thị trường bất động sản với quỹ đất sạch lớn, doanh thu bán hàng từ các đại dự án dồi dào. Nhịp pullback về sát SMA 200 ngày hợp lưu với hỗ trợ cứng Fib 0.618 mở ra cơ hội mua tích lũy cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VHM.png',
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
    console.log('Không tìm thấy kịch bản VHM nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VHM',
        company_name: 'Công ty Cổ phần Vinhomes',
        strategy_name: 'Pullback hỗ trợ Fib 0.618 & Retest SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '123,200',
        stop_loss: '114,600',
        take_profit: '173,300',
        risk_reward: '5.83',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'FPT Corp và VHM là hai trụ cột lớn của rổ chỉ số VN30. Vinhomes (VHM) tiếp tục dẫn đầu thị trường bất động sản với quỹ đất sạch lớn, doanh thu bán hàng từ các đại dự án dồi dào. Nhịp pullback về sát SMA 200 ngày hợp lưu với hỗ trợ cứng Fib 0.618 mở ra cơ hội mua tích lũy cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VHM.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781509800518.jpg';
  
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
