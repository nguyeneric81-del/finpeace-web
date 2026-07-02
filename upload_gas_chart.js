const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu GAS sau khi thiết lập đỉnh tại 131.5K đã hoàn thành nhịp giảm điều chỉnh sâu về vùng 73.1K - 73.4K (Fibonacci 0.0).
* Hiện tại, giá đang phản ứng rất tốt với đường trung bình động dài hạn SMA 200 ngày (quanh 78.4K) và đường xu hướng tăng dài hạn. Phiên hôm nay ghi nhận nến xanh hồi phục lên mức 83,900 VND (+1.70%).
* Sức bán đã cạn kiệt rõ rệt khi khối lượng giao dịch (Volume) giảm sâu chỉ còn 530K cổ phiếu (so với trung bình 20 phiên là 2.1M). Việc "kiệt vol" ở vùng hỗ trợ cứng là tín hiệu rất tích cực cho thấy phe bán đã dừng tay và cổ phiếu đang tích lũy động lượng để bứt phá đường xu hướng giảm ngắn hạn.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 73.1K đóng vai trò là đáy chu kỳ tích lũy cũ. Việc giá điều chỉnh về đây, tạo đáy cao hơn và giữ vững trên SMA 200 cho thấy cấu trúc tăng trưởng dài hạn của GAS vẫn được tôn trọng hoàn toàn.
* Tỷ lệ hồi phục từ Fibonacci 0.0 hướng lên 0.618 (109.3K) có tính đối xứng cao với nhịp sóng tăng mạnh mẽ hồi cuối năm 2025.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành tiện ích và năng lượng (khí đốt) có sự phòng thủ và bền vững cao. PV GAS giữ vị thế độc quyền phân phối khí tại Việt Nam với dòng tiền dồi dào, ít bị ảnh hưởng bởi biến động vĩ mô ngắn hạn. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [2/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan GAS ---');

  // 1. Tìm kiếm kịch bản giao dịch GAS cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch GAS hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'GAS')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản GAS hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Tổng Công ty Khí Việt Nam - CTCP',
        strategy_name: 'Hồi phục từ SMA 200 & Tích lũy Fibonacci 0.0 - 0.236',
        timeframe: 'Trung hạn',
        entry_zone: '78,600 - 84,000',
        stop_loss: '72,500',
        take_profit: '109,300',
        risk_reward: '5.03',
        sector: 'Tiện ích',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Nhu cầu tiêu thụ khí công nghiệp phục hồi mạnh mẽ và dự án chuỗi khí điện lô B Ô Môn mang lại dòng tiền dài hạn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GAS.png',
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
    console.log('Không tìm thấy kịch bản GAS nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'GAS',
        company_name: 'Tổng Công ty Khí Việt Nam - CTCP',
        strategy_name: 'Hồi phục từ SMA 200 & Tích lũy Fibonacci 0.0 - 0.236',
        timeframe: 'Trung hạn',
        entry_zone: '78,600 - 84,000',
        stop_loss: '72,500',
        take_profit: '109,300',
        risk_reward: '5.03',
        sector: 'Tiện ích',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Nhu cầu tiêu thụ khí công nghiệp phục hồi mạnh mẽ và dự án chuỗi khí điện lô B Ô Môn mang lại dòng tiền dài hạn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GAS.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781246651124.jpg';
  
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
