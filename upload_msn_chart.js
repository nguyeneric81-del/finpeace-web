const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu MSN đã trải qua nhịp điều chỉnh đáng kể từ đỉnh 85.5K về vùng hỗ trợ cực mạnh quanh 70.8K - 71.0K.
* Hiện tại, giá đang phản ứng tích cực khi chạm đường xu hướng tăng (Uptrend line) dài hạn. Phiên hôm nay xuất hiện nến xanh hồi phục tăng lên mức 71,900 VND (+1.27%).
* Thanh khoản đang cạn kiệt dần (Volume chỉ đạt 1.7M cổ phiếu so với trung bình 20 phiên là 3.6M), cho thấy áp lực bán rát tại vùng đáy cũ đã hoàn toàn biến mất. Cổ phiếu đang tích lũy năng lượng rất tốt ngay phía trên đường hỗ trợ trung dài hạn.

**2. Tính đối xứng (Symmetry)**
* Đường xu hướng tăng dài hạn từ năm 2025 đóng vai trò là xương sống cho xu hướng tăng của MSN. Giá điều chỉnh về trendline này luôn có lực cầu tổ chức tham gia đỡ giá và tạo đáy chu kỳ mới.
* Quá trình nén giá trong mô hình tam giác cho thấy cấu trúc tăng trưởng vẫn nguyên vẹn và đang chuẩn bị cho nhịp tăng đối xứng tiếp theo.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành hàng tiêu dùng có sự phòng thủ và bền vững cao. Masan Group giữ vị thế hàng đầu về bán lẻ và tiêu dùng tại Việt Nam với mạng lưới rộng lớn, dòng tiền dồi dào. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan MSN ---');

  // 1. Tìm kiếm kịch bản giao dịch MSN cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch MSN hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'MSN')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản MSN hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Tập đoàn Masan',
        strategy_name: 'Hồi phục từ Trendline dài hạn & Tích lũy tam giác',
        timeframe: 'Trung hạn',
        entry_zone: '70,300 - 73,200',
        stop_loss: '70,300',
        take_profit: '85,400',
        risk_reward: '4.21',
        sector: 'Hàng tiêu dùng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Sự phục hồi sức mua tiêu dùng trong nước, mảng kinh doanh tiêu dùng cốt lõi (Masan Consumer) tăng trưởng ổn định và kế hoạch IPO TCX hỗ trợ định giá tập đoàn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/MSN.png',
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
    console.log('Không tìm thấy kịch bản MSN nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'MSN',
        company_name: 'Tập đoàn Masan',
        strategy_name: 'Hồi phục từ Trendline dài hạn & Tích lũy tam giác',
        timeframe: 'Trung hạn',
        entry_zone: '70,300 - 73,200',
        stop_loss: '70,300',
        take_profit: '85,400',
        risk_reward: '4.21',
        sector: 'Hàng tiêu dùng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Sự phục hồi sức mua tiêu dùng trong nước, mảng kinh doanh tiêu dùng cốt lõi (Masan Consumer) tăng trưởng ổn định và kế hoạch IPO TCX hỗ trợ định giá tập đoàn.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/MSN.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781248821302.jpg';
  
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
