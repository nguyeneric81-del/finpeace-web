const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu CTR đang giao dịch tích lũy nén biên độ ở cuối mẫu hình **Tam giác Đối xứng (Symmetrical Triangle)**. Giá đóng cửa phiên gần nhất là **86,900 VND** (-1.03%), đang tích lũy nén chặt dưới đường SMA 200 ngày (88.2K) và SMA 20 ngày (90.2K).
* Khối lượng giao dịch (Volume) tiếp tục duy trì ở mức thấp (khoảng 527K cổ phiếu), thể hiện áp lực cung bán ra đã kiệt quệ hoàn toàn tại vùng hỗ trợ chéo dưới, báo hiệu quá trình tích lũy tạo nền đã hoàn tất.
* Điểm kích hoạt mua breakout (ENTRY) được xác định tại mốc giá **90,400 VND** khi giá vượt qua đường cản chéo và SMA 200 ngày với thanh khoản bùng nổ.

**2. Tính đối xứng (Symmetry)**
* Vùng giá tích lũy nén chặt biên độ quanh 81K - 90K là bước đệm đối xứng lý tưởng với nhịp điều chỉnh giảm trước đó. Chu kỳ nén kéo dài hơn 50 phiên là sự tích lũy động lượng vững vàng để chuẩn bị hướng về đỉnh cũ quanh mốc chốt lời mục tiêu **112,800 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm hạ tầng viễn thông tăng trưởng bền vững nhờ lộ trình thương mại hóa mạng 5G quốc gia và nhu cầu thuê trạm BTS của các nhà mạng. CTR sở hữu vị thế TowerCo hàng đầu Việt Nam với nguồn thu nhập định kỳ ổn định. Rủi ro phân cực ngành cực kỳ thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan CTR ---');

  // 1. Tìm kiếm kịch bản giao dịch CTR cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch CTR hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'CTR')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản CTR hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Tổng Công ty Cổ phần Công trình Viettel',
        strategy_name: 'Tích Lũy Tam Giác Đối Xứng & Breakout SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '90,400',
        stop_loss: '85,300',
        take_profit: '112,800',
        risk_reward: '4.39',
        sector: 'Công nghệ - Viễn thông',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'CTR hưởng lợi trực tiếp từ xu hướng phủ sóng 5G toàn quốc và nhu cầu thuê trạm BTS ngày càng tăng cao của các nhà mạng. Cấu trúc tích lũy tam giác cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTR.png',
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
    console.log('Không tìm thấy kịch bản CTR nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'CTR',
        company_name: 'Tổng Công ty Cổ phần Công trình Viettel',
        strategy_name: 'Tích Lũy Tam Giác Đối Xứng & Breakout SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '90,400',
        stop_loss: '85,300',
        take_profit: '112,800',
        risk_reward: '4.39',
        sector: 'Công nghệ - Viễn thông',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'CTR hưởng lợi trực tiếp từ xu hướng phủ sóng 5G toàn quốc và nhu cầu thuê trạm BTS ngày càng tăng cao của các nhà mạng. Cấu trúc tích lũy tam giác cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/CTR.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781510934608.jpg';
  
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
