const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu BID đang giao dịch tích lũy nén chặt biên độ ngay trên đường **Xu hướng Tăng (Uptrend Line)** dài hạn. Giá đóng cửa phiên gần nhất đạt **41,600 VND** (+1.34%), hiện đang nén chặt ngay sát dưới đường SMA 200 ngày (41.7K) và SMA 20 ngày (42.3K).
* Thanh khoản (Volume) sụt giảm sâu sắc, chỉ đạt 3.4M cổ phiếu (thấp hơn nhiều so với trung bình 20 phiên là 5.8M). Đây là dấu hiệu của sự cạn kiệt cung bán hoàn toàn tại vùng cạnh dưới của tam giác, biểu thị cho sự nén giá cực hạn (VCP).
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **43,300 VND** khi giá breakout thành công hộp cản ngang ngắn hạn và vượt cản động SMA 200 ngày để mở ra xu hướng tăng mới.

**2. Tính đối xứng (Symmetry)**
* Vùng giá tích lũy nén chặt biên độ quanh 41K - 43K là bệ đệm đối xứng lý tưởng với nhịp điều chỉnh giảm trước đó. Chu kỳ nén kéo dài hơn 40 phiên là sự tích lũy động lượng vững vàng để chuẩn bị hướng về đỉnh cũ quanh mốc chốt lời mục tiêu **54,500 VND** (+25.87%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng quốc doanh dẫn dắt dòng tiền thị trường và có chất lượng tài sản tốt nhất hệ thống. BIDV là ngân hàng có ưu thế chi phí vốn cực thấp và hệ số an toàn vốn vững chắc. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan BID ---');

  // 1. Tìm kiếm kịch bản giao dịch BID cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch BID hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'BID')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản BID hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        strategy_name: 'Breakout Hộp Tích Lũy Ngang & Hồi Phục Từ Trendline',
        timeframe: 'Trung hạn',
        entry_zone: '43,300',
        stop_loss: '40,400',
        take_profit: '54,500',
        risk_reward: '3.86',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'BIDV (BID) tiếp tục là một trong những ngân hàng quốc doanh lớn nhất với tăng trưởng tín dụng phục hồi tốt và trích lập dự phòng cao tạo bộ đệm tài sản an toàn. Nhịp tích lũy trên trendline dài hạn cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/BID.png',
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
    console.log('Không tìm thấy kịch bản BID nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'BID',
        company_name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
        strategy_name: 'Breakout Hộp Tích Lũy Ngang & Hồi Phục Từ Trendline',
        timeframe: 'Trung hạn',
        entry_zone: '43,300',
        stop_loss: '40,400',
        take_profit: '54,500',
        risk_reward: '3.86',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'BIDV (BID) tiếp tục là một trong những ngân hàng quốc doanh lớn nhất với tăng trưởng tín dụng phục hồi tốt và trích lập dự phòng cao tạo bộ đệm tài sản an toàn. Nhịp tích lũy trên trendline dài hạn cạn kiệt thanh khoản mở ra cơ hội giao dịch breakout ngắn hạn an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/BID.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781511177888.jpg';
  
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
