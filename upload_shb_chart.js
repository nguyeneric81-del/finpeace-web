const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu SHB đã có nhịp điều chỉnh đáng kể từ đỉnh 19.5K về vùng hỗ trợ cực mạnh quanh 13.1K - 13.5K.
* Hiện tại, giá đang phản ứng tích cực khi chạm vùng hỗ trợ ngang cứng. Phiên hôm nay xuất hiện nến xanh hồi phục tăng lên mức 13,800 VND (+1.10%).
* Thanh khoản đang cạn kiệt dần (Volume chỉ đạt 37M cổ phiếu so với trung bình 20 phiên là 50M), cho thấy áp lực bán rát tại vùng đáy cũ đã hoàn toàn biến mất. Cổ phiếu đang tích lũy năng lượng rất tốt ngay phía trên đường hỗ trợ ngang trung hạn.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 13,300 VND đóng vai trò là đáy hỗ trợ cực mạnh từ đầu năm 2026. Giá điều chỉnh về đây luôn thu hút dòng tiền lớn tham gia đỡ giá.
* Quá trình nén giá trong mô hình nêm giảm cho thấy áp lực điều chỉnh sắp kết thúc và cổ phiếu đang tích lũy động lượng cho nhịp hồi phục đối xứng hướng về đỉnh cũ.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng đang có sự phân hóa nhưng giữ vai trò nâng đỡ thị trường tốt. SHB là ngân hàng thương mại có định giá hấp dẫn với P/B ở vùng lịch sử. Rủi ro phân cực ngành ở mức trung bình.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan SHB ---');

  // 1. Tìm kiếm kịch bản giao dịch SHB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch SHB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'SHB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản SHB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
        strategy_name: 'Tích lũy nêm giảm & Breakout cản chéo',
        timeframe: 'Trung hạn',
        entry_zone: '14,400',
        stop_loss: '13,300',
        take_profit: '18,950',
        risk_reward: '4.14',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'SHB tích lũy chặt chẽ ở vùng hỗ trợ ngang cứng trung hạn, lực bán cạn kiệt dứt điểm. Dòng vốn nội ngoại ổn định nâng đỡ cổ phiếu ngân hàng định giá P/B siêu chiết khấu.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/SHB.png',
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
    console.log('Không tìm thấy kịch bản SHB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'SHB',
        company_name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
        strategy_name: 'Tích lũy nêm giảm & Breakout cản chéo',
        timeframe: 'Trung hạn',
        entry_zone: '14,400',
        stop_loss: '13,300',
        take_profit: '18,950',
        risk_reward: '4.14',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'SHB tích lũy chặt chẽ ở vùng hỗ trợ ngang cứng trung hạn, lực bán cạn kiệt dứt điểm. Dòng vốn nội ngoại ổn định nâng đỡ cổ phiếu ngân hàng định giá P/B siêu chiết khấu.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/SHB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781249209529.jpg';
  
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
