const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* NLG đang tích lũy chặt chẽ trong mẫu hình Tam giác giảm (Descending Triangle) kéo dài từ cuối năm 2025. Giá hiện tại (26,250 VND) nằm dưới đường trung bình động dài hạn SMA 200 ngày (quanh 31,155 VND) và MA50 (quanh 26,640 VND) nhưng đã lấy lại đường MA20 (quanh 25,677 VND).
* Khối lượng giao dịch (Volume) đang siết chặt cạn kiệt rất rõ rệt ở vùng đáy tích lũy, phiên gần nhất đạt 1.42M cổ phiếu (thấp hơn so với trung bình 20 phiên). Điều này cho thấy lực cung bán tháo vùng giá thấp đã cạn kiệt hoàn toàn.
* Do giá vẫn nằm dưới cản chéo và MA50, điểm giải ngân tối ưu nhất là điểm mua breakout vượt 26,650 VND đi kèm khối lượng gia tăng thuyết phục.

**2. Tính đối xứng (Symmetry)**
* Vùng hỗ trợ phẳng (Flat Support) quanh vùng 24,500 - 25,000 VND (biểu diễn bởi hộp màu xanh trên đồ thị) được kiểm định thành công nhiều lần từ tháng 3 đến tháng 6/2026.
* Biên độ các nhịp điều chỉnh thu hẹp dần (Volatility Contraction) đi kèm thời gian tích lũy tạo nén hơn 3 tháng, cho thấy cổ phiếu đang chuẩn bị bước vào pha bứt phá mạnh mẽ về biên độ để hướng về vùng SMA 200 ngày và đỉnh cũ.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nam Long là doanh nghiệp bất động sản sở hữu phân khúc nhà ở vừa túi tiền (affordable housing) có sức cầu thực lớn nhất thị trường hiện tại. Lịch sử triển khai dự án uy tín và dòng tiền bàn giao ổn định từ Mizuki Park và Akari City giúp giảm thiểu tối đa rủi ro tài chính. Rủi ro phân cực ngành ở mức thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan NLG ---');

  // 1. Tìm kiếm kịch bản giao dịch NLG cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch NLG hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'NLG')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản NLG hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Đầu tư Nam Long',
        strategy_name: 'Breakout Tam giác tích lũy kiệt cung & Hỗ trợ đáy',
        timeframe: 'Trung hạn',
        entry_zone: '26,650',
        stop_loss: '24,550',
        take_profit: '32,300',
        risk_reward: '2.69',
        sector: 'Bất động sản dân dụng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Nam Long (NLG) hưởng lợi từ phân khúc nhà ở vừa túi tiền (affordable housing) có nhu cầu thực lớn nhất thị trường, cùng tiến độ bàn giao dự án Mizuki Park và Akari City ổn định. Cấu trúc tích lũy nén đáy tam giác giảm kiệt cung tạo cơ hội mua breakout an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/NLG.png',
        created_at: new Date().toISOString(),
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 26,650","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 32,300","Cắt lỗ nếu đóng cửa dưới 24,550"]',
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
    console.log('Không tìm thấy kịch bản NLG nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'NLG',
        company_name: 'Công ty Cổ phần Đầu tư Nam Long',
        strategy_name: 'Breakout Tam giác tích lũy kiệt cung & Hỗ trợ đáy',
        timeframe: 'Trung hạn',
        entry_zone: '26,650',
        stop_loss: '24,550',
        take_profit: '32,300',
        risk_reward: '2.69',
        sector: 'Bất động sản dân dụng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Nam Long (NLG) hưởng lợi từ phân khúc nhà ở vừa túi tiền (affordable housing) có nhu cầu thực lớn nhất thị trường, cùng tiến độ bàn giao dự án Mizuki Park và Akari City ổn định. Cấu trúc tích lũy nén đáy tam giác giảm kiệt cung tạo cơ hội mua breakout an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/NLG.png',
        entry_criteria: '["Giá đóng cửa xác nhận vượt hẳn 26,650","Volume vượt trung bình 20 phiên"]',
        exit_criteria: '["Chốt lời tại 32,300","Cắt lỗ nếu đóng cửa dưới 24,550"]'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781513107597.jpg';
  
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
