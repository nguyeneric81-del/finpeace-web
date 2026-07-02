const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu GEX đã trải qua nhịp điều chỉnh đáng kể từ đỉnh 37.4K về sát vùng hỗ trợ SMA 200 ngày (quanh mốc 29.4K - 30.7K). Hiện tại, giá đóng cửa phiên gần nhất đạt **30,600 VND** (+3.73%), giá đang nằm dưới MA20 (32.4K) nhưng vẫn duy trì khoảng cách an toàn phía trên đường SMA 50 ngày (30.1K) và SMA 200 ngày (29.4K).
* Thanh khoản (Volume) có xu hướng sụt giảm sâu trong nhịp tích lũy, đạt khoảng 10.2M cổ phiếu/phiên (thấp hơn so với trung bình 20 phiên là 12.1M). Đây là dấu hiệu của sự cạn kiệt cung bán hoàn toàn tại vùng hỗ trợ chéo chéo dưới trên Fib 0.618.
* Điểm kích hoạt lệnh mua (ENTRY) được xác định tại mức giá **28,250 VND** khi giá pullback về sát hỗ trợ cứng Fib 0.618 chéo dưới để tối ưu hóa vị thế.

**2. Tính đối xứng (Symmetry)**
* Vùng giá tích lũy nén chặt biên độ quanh 28K - 28.5K là bệ đỡ đối xứng lý tưởng với nhịp điều chỉnh giảm trước đó. Chu kỳ tích lũy kéo dài hơn 30 phiên là sự chuẩn bị động lượng vững vàng để chuẩn bị hướng về đỉnh cũ quanh mốc chốt lời mục tiêu **37,450 VND** (+32.57%).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành thiết bị điện và hạ tầng công nghiệp tăng trưởng ổn định theo Quy hoạch điện VIII và làn sóng dịch chuyển FDI. GEX sở hữu vị thế đầu ngành thiết bị điện và hạ tầng khu công nghiệp lớn tại Việt Nam, rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [1/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò 30% tại nền)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan GEX ---');

  // 1. Tìm kiếm kịch bản giao dịch GEX cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch GEX hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'GEX')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản GEX hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Tập đoàn GELEX',
        strategy_name: 'Pullback hỗ trợ Fib 0.618 & Retest SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '28,250',
        stop_loss: '26,550',
        take_profit: '37,450',
        risk_reward: '5.41',
        sector: 'Công nghiệp',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'GELEX (GEX) dẫn đầu mảng thiết bị điện tại Việt Nam, đồng thời sở hữu danh mục năng lượng tái tạo và bất động sản khu công nghiệp tiềm năng. Cú điều chỉnh về Fib 0.618 sát SMA 200 mở ra cơ hội mua tích lũy trung hạn cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GEX.png',
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
    console.log('Không tìm thấy kịch bản GEX nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'GEX',
        company_name: 'Công ty Cổ phần Tập đoàn GELEX',
        strategy_name: 'Pullback hỗ trợ Fib 0.618 & Retest SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '28,250',
        stop_loss: '26,550',
        take_profit: '37,450',
        risk_reward: '5.41',
        sector: 'Công nghiệp',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'GELEX (GEX) dẫn đầu mảng thiết bị điện tại Việt Nam, đồng thời sở hữu danh mục năng lượng tái tạo và bất động sản khu công nghiệp tiềm năng. Cú điều chỉnh về Fib 0.618 sát SMA 200 mở ra cơ hội mua tích lũy trung hạn cực kỳ an toàn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GEX.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781512566456.jpg';
  
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
