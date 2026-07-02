const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu MBB đã có nhịp điều chỉnh đáng kể từ đỉnh 29.5K về vùng hỗ trợ cực mạnh quanh 24.5K - 25.0K.
* Hiện tại, giá đang phản ứng tích cực khi chạm vùng hỗ trợ ngang cứng. Phiên hôm nay xuất hiện nến xanh hồi phục tăng lên mức 25,100 VND (+1.41%).
* Thanh khoản đang cạn kiệt dần (Volume chỉ đạt 4.5M cổ phiếu so với trung bình 20 phiên là 14.4M), cho thấy áp lực bán rát tại vùng đáy cũ đã hoàn toàn biến mất. Cổ phiếu đang tích lũy năng lượng rất tốt ngay phía trên đường hỗ trợ ngang trung hạn.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 24,450 VND đóng vai trò là đáy hỗ trợ cực mạnh từ đầu năm 2026. Giá điều chỉnh về đây luôn thu hút dòng tiền lớn tham gia đỡ giá.
* Quá trình nén giá trong mô hình nêm giảm cho thấy áp lực điều chỉnh sắp kết thúc và cổ phiếu đang tích lũy động lượng cho nhịp hồi phục đối xứng hướng về đỉnh cũ.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngân hàng đóng vai trò dẫn dắt chỉ số VNINDEX. MBB duy trì tốc độ tăng trưởng tín dụng cao, tỷ lệ nợ xấu được kiểm soát tốt và định giá P/B đang ở vùng chiết khấu sâu. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan MBB ---');

  // 1. Tìm kiếm kịch bản giao dịch MBB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch MBB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'MBB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản MBB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Quân đội',
        strategy_name: 'Breakout Nêm giảm & Hồi phục từ Hỗ trợ Đáy cũ',
        timeframe: 'Trung hạn',
        entry_zone: '25,700',
        stop_loss: '24,450',
        take_profit: '29,500',
        risk_reward: '3.04',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'MBB duy trì tốc độ tăng trưởng tín dụng cao, tỷ lệ nợ xấu được kiểm soát tốt và định giá P/B đang ở vùng chiết khấu sâu.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/MBB.png',
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
    console.log('Không tìm thấy kịch bản MBB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'MBB',
        company_name: 'Ngân hàng TMCP Quân đội',
        strategy_name: 'Breakout Nêm giảm & Hồi phục từ Hỗ trợ Đáy cũ',
        timeframe: 'Trung hạn',
        entry_zone: '25,700',
        stop_loss: '24,450',
        take_profit: '29,500',
        risk_reward: '3.04',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'MBB duy trì tốc độ tăng trưởng tín dụng cao, tỷ lệ nợ xấu được kiểm soát tốt và định giá P/B đang ở vùng chiết khấu sâu.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/MBB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781248044106.jpg';
  
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
