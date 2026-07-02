const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu BSR đã trải qua một nhịp điều chỉnh đáng kể từ đỉnh 39.6K về sát vùng hỗ trợ cản chéo (Uptrend line dài hạn bắt đầu từ cuối năm 2025). Hiện tại, giá đang đóng cửa ở mức 28,100 VND.
* Đường SMA 200 ngày (quanh mốc 22.1K) nằm khá xa phía dưới, đóng vai trò là chốt chặn xu hướng dài hạn cực kỳ vững chắc.
* Thanh khoản (Volume) trong những phiên gần đây sụt giảm rõ rệt, chỉ đạt 4.4M cổ phiếu (so với trung bình 20 phiên trước đó là 11.8M), cho thấy áp lực bán hoảng loạn đã hoàn toàn biến mất. Lực cung đang cạn kiệt dứt điểm.
* Vùng mua tối ưu được xác lập quanh mốc **26,950 VND**, tương ứng với đường hỗ trợ xu hướng tăng (Uptrend Line) nâng đỡ giá, cho tỷ lệ Risk:Reward cực kỳ hấp dẫn.

**2. Tính đối xứng (Symmetry)**
* Nhịp điều chỉnh giảm từ đỉnh 39.6K đã đưa giá về vùng chiết khấu lý tưởng. Đường xu hướng tăng dài hạn đã liên tục được tôn trọng trong quá khứ. Quá trình nén giá theo mô hình tam giác lớn đang đi đến giai đoạn cuối, hứa hẹn nhịp hồi phục đối xứng mạnh mẽ hướng thẳng về mục tiêu đỉnh cũ quanh 39.6K.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Dầu khí và Năng lượng có tính phòng thủ cao và hoạt động sản xuất kinh doanh cốt lõi ổn định. BSR là doanh nghiệp lọc hóa dầu hàng đầu Việt Nam, dòng tiền hoạt động kinh doanh cực kỳ dồi dào và chuẩn bị niêm yết chuyển sàn sang HOSE là chất xúc tác lớn nâng tầm định giá. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan BSR ---');

  // 1. Tìm kiếm kịch bản giao dịch BSR cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch BSR hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'BSR')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản BSR hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'CTCP Lọc hóa Dầu Bình Sơn',
        strategy_name: 'Hồi phục từ trendline hỗ trợ Uptrend & Tích lũy tam giác',
        timeframe: 'Trung hạn',
        entry_zone: '26,950',
        stop_loss: '24,500',
        take_profit: '39,600',
        risk_reward: '5.16',
        sector: 'Dầu khí',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'BSR có hoạt động kinh doanh cốt lõi cực kỳ ổn định, vị thế thống lĩnh ngành lọc hóa dầu Việt Nam. Nhu cầu năng lượng tăng trưởng, kết hợp nâng cấp mở rộng nhà máy Dung Quất là catalyst tăng trưởng dài hạn. Đồ thị tích lũy cạn vol rất chặt ngay trên trendline dài hạn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/BSR.png',
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
    console.log('Không tìm thấy kịch bản BSR nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'BSR',
        company_name: 'CTCP Lọc hóa Dầu Bình Sơn',
        strategy_name: 'Hồi phục từ trendline hỗ trợ Uptrend & Tích lũy tam giác',
        timeframe: 'Trung hạn',
        entry_zone: '26,950',
        stop_loss: '24,500',
        take_profit: '39,600',
        risk_reward: '5.16',
        sector: 'Dầu khí',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'BSR có hoạt động kinh doanh cốt lõi cực kỳ ổn định, vị thế thống lĩnh ngành lọc hóa dầu Việt Nam. Nhu cầu năng lượng tăng trưởng, kết hợp nâng cấp mở rộng nhà máy Dung Quất là catalyst tăng trưởng dài hạn. Đồ thị tích lũy cạn vol rất chặt ngay trên trendline dài hạn.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/BSR.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781250919820.jpg';
  
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
