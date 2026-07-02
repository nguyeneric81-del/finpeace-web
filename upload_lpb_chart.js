const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu LPB đã có nhịp điều chỉnh đáng kể từ đỉnh vùng 55.0K về sát đường xu hướng tăng (Uptrend Line) nâng đỡ dài hạn và tiệm cận đường SMA 200 ngày (quanh mốc 43.9K). Hiện tại, giá đóng cửa phiên gần nhất đạt **45,500 VND** (-1.19%).
* Thanh khoản (Volume) có sự cạn kiệt dứt điểm, phiên gần nhất chỉ đạt 306K cổ phiếu (so với trung bình 20 phiên là 1.0M), cho thấy lực cung bán tháo ở sườn phải nhịp chỉnh đã cạn kiệt hoàn toàn.
* Điểm mua pullback tối ưu được xác lập tại vùng hội tụ hỗ trợ mạnh giữa đường cản chéo đã vượt, trendline nâng đỡ và SMA 200 ngày tại vùng giá **44,150 VND**, cho tỷ lệ Risk:Reward cực kỳ hấp dẫn.

**2. Phân tích Tính Đối Xứng (Symmetry)**
* Ngưỡng 44.1K là vùng hỗ trợ cứng hợp lưu giữa nhiều chỉ báo kỹ thuật quan trọng. Việc nén giá chặt chẽ sau nhịp điều chỉnh -17% từ đỉnh tạo ra lực nén lò xo đối xứng lý tưởng để chuẩn bị cho nhịp tăng trưởng tiếp theo hướng về đỉnh cũ quanh mốc **54,800 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng tiếp tục là trụ đỡ dẫn dắt xu hướng tăng trưởng của thị trường vĩ mô. LPBank sở hữu lợi thế lớn về quy mô mạng lưới huy động vùng nông thôn và định vị thương hiệu mới. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan LPB ---');

  // 1. Tìm kiếm kịch bản giao dịch LPB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch LPB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'LPB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản LPB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Lộc Phát Việt Nam',
        strategy_name: 'Retest đỉnh cũ vượt cản chéo & Hỗ trợ SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '44,150',
        stop_loss: '41,500',
        take_profit: '54,800',
        risk_reward: '4.02',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'LPBank duy trì tốc độ tăng trưởng tín dụng cao, lợi thế bưu điện độc quyền lớn, cấu trúc tài sản lành mạnh và dòng tiền nâng đỡ từ khối ngoại lớn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/LPB.png',
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
    console.log('Không tìm thấy kịch bản LPB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'LPB',
        company_name: 'Ngân hàng TMCP Lộc Phát Việt Nam',
        strategy_name: 'Retest đỉnh cũ vượt cản chéo & Hỗ trợ SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '44,150',
        stop_loss: '41,500',
        take_profit: '54,800',
        risk_reward: '4.02',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'LPBank duy trì tốc độ tăng trưởng tín dụng cao, lợi thế bưu điện độc quyền lớn, cấu trúc tài sản lành mạnh và dòng tiền nâng đỡ từ khối ngoại lớn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/LPB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781252652661.jpg';
  
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
