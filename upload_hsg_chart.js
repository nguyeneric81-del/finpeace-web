const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu HSG đang đi về giai đoạn cuối của mô hình tích lũy Tam giác hướng lên (Ascending Triangle) kéo dài từ cuối năm 2025.
* Giá hiện tại (12,050 VND) nằm dưới đường trung bình động dài hạn SMA 200 ngày (quanh 12,737 VND) và cụm MA20/MA50 (quanh 12,180 VND).
* Khối lượng giao dịch (Volume) đang có dấu hiệu kiệt cung rất rõ rệt khi Vol phiên gần nhất chỉ đạt 2.14M (thấp hơn nhiều so với mức trung bình 20 phiên là 3.41M). Cấu trúc cạn kiệt thanh khoản này báo hiệu một nhịp bứt phá (breakout) mạnh mẽ sắp diễn ra khi có lực cầu kích hoạt.

**2. Tính đối xứng (Symmetry)**
* Cấu trúc đáy sau cao hơn đáy trước (Higher Lows) dọc theo đường xu hướng hỗ trợ (Ascending Support Line) từ tháng 5/2025 được tôn trọng rất tốt.
* Biên độ biến động của các nhịp điều chỉnh giảm ngày càng thu hẹp (Volatility Contraction). Khoảng thời gian tích lũy kéo dài hơn 6 tháng cho thấy năng lượng tích lũy đã đủ lớn để mở ra con sóng tăng trung hạn hướng về vùng đỉnh cũ 15.x - 16.x.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Ngành Thép đang đón nhận nhiều yếu tố hỗ trợ vĩ mô: Giá thép HRC thế giới phục hồi và Luật Đất đai sửa đổi có hiệu lực kỳ vọng khơi thông nguồn cung bất động sản dân dụng trong nước.
* HSG có lợi thế cạnh tranh lớn về mạng lưới bán lẻ tôn mạ nội địa, giúp tối ưu biên lợi nhuận tốt khi chu kỳ ngành đảo chiều. Rủi ro phân cực của cổ phiếu so với thị trường chung là rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan HSG ---');

  // 1. Tìm kiếm kịch bản giao dịch HSG cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch HSG hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'HSG')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản HSG hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Tập đoàn Hoa Sen',
        strategy_name: 'Breakout Tam giác tích lũy & SMA 200 ngày',
        timeframe: 'Trung hạn',
        entry_zone: '12,900',
        stop_loss: '12,300',
        take_profit: '15,550',
        risk_reward: '4.42',
        sector: 'Thép / Vật liệu xây dựng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Hoa Sen (HSG) hưởng lợi từ giá thép cuộn cán nóng (HRC) thế giới phục hồi và luật đất đai sửa đổi thúc đẩy thị trường bất động sản dân dụng. Cấu trúc tích lũy tam giác kiệt cung sát SMA 200 ngày mở ra cơ hội mua breakout cực kỳ tối ưu.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/HSG.png',
        created_at: new Date().toISOString(),
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 12,900","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 15,550","Cắt lỗ nếu đóng cửa dưới 12,300"]',
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
    console.log('Không tìm thấy kịch bản HSG nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'HSG',
        company_name: 'Công ty Cổ phần Tập đoàn Hoa Sen',
        strategy_name: 'Breakout Tam giác tích lũy & SMA 200 ngày',
        timeframe: 'Trung hạn',
        entry_zone: '12,900',
        stop_loss: '12,300',
        take_profit: '15,550',
        risk_reward: '4.42',
        sector: 'Thép / Vật liệu xây dựng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Hoa Sen (HSG) hưởng lợi từ giá thép cuộn cán nóng (HRC) thế giới phục hồi và luật đất đai sửa đổi thúc đẩy thị trường bất động sản dân dụng. Cấu trúc tích lũy tam giác kiệt cung sát SMA 200 ngày mở ra cơ hội mua breakout cực kỳ tối ưu.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/HSG.png',
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 12,900","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 15,550","Cắt lỗ nếu đóng cửa dưới 12,300"]'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781512681364.jpg';
  
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
