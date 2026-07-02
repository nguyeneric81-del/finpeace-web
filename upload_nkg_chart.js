const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu NKG đang giao dịch dưới các đường trung bình động MA20 (13,602), MA50 (14,012) và MA200 (15,378). Xu hướng trung hạn vẫn là điều chỉnh giảm từ đỉnh 16.5K.
* Điểm sáng lớn nhất là **thanh khoản cực kỳ cạn kiệt**: Khối lượng giao dịch trong các phiên gần đây liên tục sụt giảm sâu (chỉ đạt quanh 1.0M cổ phiếu so với trung bình 20 phiên là 1.77M). Đây là dấu hiệu của việc cạn cung bán ráo (VCP - Volatility Contraction Pattern) tại cạnh dưới của hộp hỗ trợ cũ.
* Vùng giá **13,000 VND** là bệ đỡ ngang cứng được test thành công nhiều lần. Hiện tại, Stochastic Slow đã phát tín hiệu mua sớm khi đường \`%K\` (30.00) cắt hướng lên trên đường \`%D\` (16.67) từ vùng quá bán sâu. RSI (14d) tiệm cận vùng oversold (29.63), báo hiệu dư địa giảm thêm không còn nhiều.

**2. Phân tích Tính Đối Xứng (Symmetry)**
* Nhịp điều chỉnh giảm từ đỉnh tháng 3 (quanh 15.5K) về hỗ trợ 13.0K kéo dài khoảng 3 tháng với biên độ thoải dần, tạo ra một cấu trúc nêm giảm đối xứng lý tưởng. Sự cạn kiệt thanh khoản ở vùng đáy nêm cho thấy lực cung đã kiệt quệ, tạo cơ hội cho nhịp phục hồi trung hạn hướng về vùng MA200 và kháng cự hộp trên quanh **16,500 VND**.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm thép đang có sự phân cực tốt nhờ nhu cầu xuất khẩu tôn mạ phục hồi tại thị trường EU/Mỹ. NKG là doanh nghiệp có tỷ trọng xuất khẩu cao nên sẽ được hưởng lợi trực tiếp từ xu hướng này khi chênh lệch giá thép trong nước và quốc tế ổn định. Mức độ rủi ro trung bình nhờ vùng mua an toàn tiệm cận sát hỗ trợ dài hạn.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [2/5]
- Matrix Evaluation: Vùng Tích lũy Hỗ trợ / Chờ tín hiệu đảo chiều (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan NKG ---');

  // 1. Tìm kiếm kịch bản giao dịch NKG cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch NKG hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'NKG')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  const planPayload = {
    ticker: 'NKG',
    company_name: 'Cổ phần Thép Nam Kim',
    strategy_name: 'Mua khi breakout đường xu hướng giảm ngắn hạn',
    timeframe: 'Trung hạn',
    entry_zone: '13,600',
    stop_loss: '12,800',
    take_profit: '16,500',
    risk_reward: '3.63',
    sector: 'Thép',
    risk_level: 'Trung bình',
    conviction_level: 'Thường',
    analyst_note: ANALYST_NOTE,
    catalyst_note: 'Nhu cầu xuất khẩu tôn mạ tôn màu phục hồi mạnh ở thị trường châu Âu và Mỹ; chi phí HRC đầu vào giảm giúp cải thiện biên lợi nhuận gộp trong các quý tới.',
    is_confirmed: true,
    expected_holding_days: 60,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    exchange: 'HOSE',
    logo_url: 'https://vsd.vn/Images/Logo/NKG.png',
    created_at: new Date().toISOString(),
    entry_criteria: 'Mua khi giá đóng cửa dứt khoát trên mốc 13.600 với volume lớn để xác nhận phá vỡ đường xu hướng giảm ngắn hạn.',
    exit_criteria: 'Cắt lỗ khi giá đóng cửa thủng hỗ trợ 12.800. Chốt lời khi tiệm cận vùng kháng cự đỉnh cũ 16.500.',
    bought_price: null,
    bought_at: null,
    holding_since: null,
    sold_half_price: null,
    sold_half_at: null,
    sold_all_price: null,
    sold_all_at: null
  };

  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản NKG hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update(planPayload)
      .eq('id', planId);

    if (updateErr) {
      console.error('Lỗi khi cập nhật kịch bản giao dịch:', updateErr);
      return;
    }
  } else {
    console.log('Không tìm thấy kịch bản NKG nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert(planPayload)
      .select('id')
      .single();

    if (insertErr || !newPlan) {
      console.error('Lỗi khi chèn kịch bản giao dịch mới:', insertErr);
      return;
    }
    planId = newPlan.id;
  }

  // 2. Upload ảnh đồ thị lên Supabase Storage
  console.log('Bước 2: Đọc và tải ảnh đồ thị kỹ thuật lên Supabase Storage...');
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781492011846.jpg';
  
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

  // 3. Cập nhật chart_image_url vào Trading Plan
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
