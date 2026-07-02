const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VCB đang giao dịch tích lũy chặt chẽ trong mẫu hình **Tam giác Đối xứng (Symmetrical Triangle)** kéo dài hơn 6 tháng qua. Giá đóng cửa phiên gần nhất đạt **61,700 VND**, dao động quanh ngưỡng giao cắt của đường SMA 200 ngày (61,807 VND) và SMA 50 ngày (61,156 VND).
* Khối lượng giao dịch (Volume) sụt giảm rõ rệt, chỉ đạt từ 2.3M - 3.1M cổ phiếu trong các phiên gần đây (thấp hơn nhiều so với trung bình 20 phiên là 7.5M). Điều này xác nhận áp lực bán tại vùng đáy cũ đã hoàn toàn cạn kiệt, cổ phiếu đang ở giai đoạn nén biên độ cuối cùng trước khi bứt phá.
* Điểm mua tối ưu thiết lập tại **61,800 VND**, ngay sát đường hỗ trợ chéo và MA200 để tối ưu hóa tỷ lệ lợi nhuận/rủi ro.

**2. Tính đối xứng (Symmetry)**
* Ngưỡng **57,500 VND** đóng vai trò là bệ nâng đỡ ngang vững chắc đã vượt qua các nhịp kiểm định thành công trước đó. Thời gian tích lũy nén giá kéo dài hơn 40 phiên từ đỉnh ngắn hạn là sự chuẩn bị đối xứng hoàn hảo cho một nhịp bứt phá mạnh mẽ hướng về vùng đỉnh cũ quanh mốc chốt lời mục tiêu **75,700 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng đang là động lực nâng đỡ chỉ số với kỳ vọng tăng trưởng tín dụng cải thiện mạnh mẽ. VCB dẫn đầu toàn ngành về chất lượng tài sản, tỷ lệ bao phủ nợ xấu cao và chi phí vốn (CASA) tối ưu.
* Rủi ro phân cực ngành của VCB cực kỳ thấp, đồng thời được củng cố bởi dòng tiền mua ròng bền bỉ của khối ngoại tại vùng giá chiết khấu sâu.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VCB ---');

  // 1. Tìm kiếm kịch bản giao dịch VCB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VCB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VCB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VCB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
        strategy_name: 'Tích lũy Tam giác Đối xứng & Retest Hỗ trợ SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '61,800',
        stop_loss: '57,500',
        take_profit: '75,700',
        risk_reward: '3.23',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Vị thế đầu ngành ngân hàng quốc doanh, lợi nhuận bền vững và lực cầu ngoại hỗ trợ đắc lực. Cấu trúc nén tam giác dài hạn cạn kiệt cung mở ra vị thế mua rất an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VCB.png',
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
    console.log('Không tìm thấy kịch bản VCB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VCB',
        company_name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
        strategy_name: 'Tích lũy Tam giác Đối xứng & Retest Hỗ trợ SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '61,800',
        stop_loss: '57,500',
        take_profit: '75,700',
        risk_reward: '3.23',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Vị thế đầu ngành ngân hàng quốc doanh, lợi nhuận bền vững và lực cầu ngoại hỗ trợ đắc lực. Cấu trúc nén tam giác dài hạn cạn kiệt cung mở ra vị thế mua rất an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VCB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781509308433.jpg';
  
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
