const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu CTS đã bứt phá (**BREAKOUT**) thành công qua đường cản chéo ngắn hạn của mẫu hình **Tam giác Đối xứng (Symmetrical Triangle)**. Giá đóng cửa phiên gần nhất đạt **22,950 VND** (+6.99% tăng kịch trần), đóng cửa trên dải Bollinger Upper (22.5K), đồng thời vượt qua SMA 20 ngày (21.5K) và SMA 50 ngày (21.3K).
* Thanh khoản (Volume) có sự cải thiện vượt bậc khi đạt 1.72M cổ phiếu, cao gấp đôi mức trung bình 20 phiên trước đó (953K). Điều này xác nhận lực cầu chủ động đẩy giá mạnh mẽ đi kèm dòng tiền lớn gia nhập để phá vỡ thế tích lũy.
* Điểm kích hoạt lệnh mua (ENTRY) được xác định ngay tại mức giá **22,950 VND** tại điểm nổ volume breakout.

**2. Tính đối xứng (Symmetry)**
* Vùng giá tích lũy nén chặt biên độ quanh 20K - 22.5K là bệ đỡ đối xứng lý tưởng với nhịp điều chỉnh giảm trước đó. Chu kỳ tích lũy kéo dài hơn 30 phiên là sự chuẩn bị động lượng vững vàng để chuẩn bị hướng về đỉnh cũ quanh mốc chốt lời mục tiêu **29,400 VND** (+28.11%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Chứng khoán phản ánh trực tiếp sức khỏe dòng tiền thị trường. CTS có lợi thế sở hữu dòng vốn lớn và khách hàng từ ngân hàng mẹ VietinBank. Rủi ro phân cực ngành rất thấp nhờ triển vọng cải thiện thanh khoản thị trường chung.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan CTS ---');

  // 1. Tìm kiếm kịch bản giao dịch CTS cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch CTS hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'CTS')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản CTS hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Chứng Khoán Công Thương',
        strategy_name: 'Breakout Tam Giác Tích Lũy Đáy & Retest Hỗ Trợ Chéo',
        timeframe: 'Trung hạn',
        entry_zone: '22,950',
        stop_loss: '21,300',
        take_profit: '29,400',
        risk_reward: '3.91',
        sector: 'Chứng Khoán / Financial Services',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'CTS có lợi thế quy mô lớn trực thuộc VietinBank, hoạt động tự doanh và môi giới hồi phục tốt theo xu hướng thanh khoản thị trường. Cấu trúc breakout tam giác tích lũy đáy mở ra cơ hội mua thăm dò cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTS.png',
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
    console.log('Không tìm thấy kịch bản CTS nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'CTS',
        company_name: 'Chứng Khoán Công Thương',
        strategy_name: 'Breakout Tam Giác Tích Lũy Đáy & Retest Hỗ Trợ Chéo',
        timeframe: 'Trung hạn',
        entry_zone: '22,950',
        stop_loss: '21,300',
        take_profit: '29,400',
        risk_reward: '3.91',
        sector: 'Chứng Khoán / Financial Services',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'CTS có lợi thế quy mô lớn trực thuộc VietinBank, hoạt động tự doanh và môi giới hồi phục tốt theo xu hướng thanh khoản thị trường. Cấu trúc breakout tam giác tích lũy đáy mở ra cơ hội mua thăm dò cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTS.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781511711376.jpg';
  
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
