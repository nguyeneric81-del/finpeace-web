const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VTP đang tích lũy nêm chặt biên độ trong mẫu hình **Nêm Giảm (Falling Wedge)** ở vùng đáy trung hạn. Giá đóng cửa phiên gần nhất đạt **65,400 VND** (+2.35%), hiện đang dao động tích lũy ngay sát phía trên vùng hỗ trợ ngang cứng quanh mốc 62.7K.
* Thanh khoản (Volume) sụt giảm sâu, chỉ đạt 202K cổ phiếu (chưa đầy 40% so với trung bình 20 phiên là 551K). Đây là dấu hiệu của sự cạn kiệt cung bán hoàn toàn tại vùng cạnh dưới của tam giác, biểu thị cho sự nén giá cực hạn (VCP).
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **66,000 VND** khi giá breakout thành công mẫu hình tam giác hướng lên và vượt cản chéo ngắn hạn để mở ra xu thế đảo chiều tăng hồi phục.

**2. Tính đối xứng (Symmetry)**
* Ngưỡng **62,700 VND** là mốc hỗ trợ ngang cực kỳ vững chắc nâng đỡ nến giá. Nhịp nén giảm tích lũy kéo dài hơn 30 phiên từ vùng đỉnh ngắn hạn là sự chuẩn bị đối xứng cần thiết để khởi động nhịp hồi phục trung hạn hướng về đường kháng cự SMA 200 ngày quanh mốc chốt lời mục tiêu **75,600 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Logistics & Chuyển phát nhanh tăng trưởng ổn định theo dòng chảy thương mại điện tử nội địa và quốc tế. VTP sở hữu ưu thế tuyệt đối về mạng lưới bưu cục phủ rộng toàn quốc và hậu thuẫn mạnh mẽ từ tập đoàn Viettel. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VTP ---');

  // 1. Tìm kiếm kịch bản giao dịch VTP cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VTP hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VTP')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VTP hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Tổng Cổ phần Bưu chính Viettel',
        strategy_name: 'Tích Lũy Nêm Giảm Đáy & Breakout Cản Chéo Ngắn Hạn',
        timeframe: 'Trung hạn',
        entry_zone: '66,000',
        stop_loss: '62,700',
        take_profit: '75,600',
        risk_reward: '2.91',
        sector: 'Logistics',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VTP hưởng lợi từ sự bùng nổ của thương mại điện tử, dịch vụ chuyển phát nhanh nội địa và mở rộng hoạt động logistics quốc tế. Cấu trúc nén nêm giảm cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VTP.png',
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
    console.log('Không tìm thấy kịch bản VTP nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VTP',
        company_name: 'Tổng Cổ phần Bưu chính Viettel',
        strategy_name: 'Tích Lũy Nêm Giảm Đáy & Breakout Cản Chéo Ngắn Hạn',
        timeframe: 'Trung hạn',
        entry_zone: '66,000',
        stop_loss: '62,700',
        take_profit: '75,600',
        risk_reward: '2.91',
        sector: 'Logistics',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VTP hưởng lợi từ sự bùng nổ của thương mại điện tử, dịch vụ chuyển phát nhanh nội địa và mở rộng hoạt động logistics quốc tế. Cấu trúc nén nêm giảm cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VTP.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781510808914.jpg';
  
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
