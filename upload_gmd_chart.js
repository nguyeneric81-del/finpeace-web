const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* GMD đang duy trì cấu trúc tăng giá trung và dài hạn (Uptrend) rất khỏe mạnh, liên tục tạo đỉnh/đáy sau cao hơn đỉnh/đáy trước. Giá hiện tại (79,600 VND) nằm hoàn toàn trên đường SMA 200 ngày (quanh 68,020 VND) và cụm MA20/MA50 (quanh 75.0K - 74.4K).
* Lực cầu gia tăng mạnh mẽ thể hiện qua khối lượng giao dịch (Volume) bùng nổ đạt 4.24M trong phiên gần nhất (vượt trội so với mức trung bình 20 phiên là 837K).
* Giá hiện tại đang tiệm cận kháng cự hộp trên (quanh 81K-82K) và vượt ra ngoài dải Bollinger Bands Upper (78,484 VND). Việc giải ngân mua mới ngay tại 79,600 VND sẽ khiến tỷ lệ R:R không còn tối ưu (rủi ro điều chỉnh ngắn hạn cao). Cần kiên nhẫn chờ nhịp điều chỉnh (pullback) về vùng hỗ trợ 71,700 - 73,000 VND hoặc chờ cổ phiếu xây nền tích lũy chặt chẽ mới quanh 78,000 VND.

**2. Tính đối xứng (Symmetry)**
* Kênh xu hướng tăng giá của GMD được nâng đỡ rất tốt bởi đường xu hướng hỗ trợ (Ascending Support Line) kéo dài từ giữa năm 2025 đến nay. Biên độ các nhịp chỉnh điều chỉnh trước đó đều dao động quanh mức 6-8% trước khi bật tăng mạnh trở lại.
* Vùng giá 71,700 VND là điểm hội tụ của đường xu hướng tăng và biên dưới hộp tích lũy trung hạn. Cắt lỗ đặt tại 67,400 VND (ngay dưới SMA 200) là chốt chặn an toàn và tối ưu về mặt tỷ lệ rủi ro.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Hoạt động xuất nhập khẩu phục hồi tích cực thúc đẩy sản lượng hàng hóa thông qua chuỗi cảng nước sâu của Gemadept (đặc biệt là Gemalink).
* GMD sở hữu năng lực vận hành cảng và logistics hàng đầu Việt Nam với lợi thế cạnh tranh bền vững, thu hút dòng tiền ngoại lâu dài. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [5/5]
- Trục Dao động (Sideway Score): [1/5]
- Matrix Evaluation: Tín hiệu Breakout Tăng / Siêu Vuốt Xu Hướng (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan GMD ---');

  // 1. Tìm kiếm kịch bản giao dịch GMD cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch GMD hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'GMD')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản GMD hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Công ty Cổ phần Gemadept',
        strategy_name: 'Pullback kênh xu hướng tăng & Hỗ trợ tích lũy',
        timeframe: 'Trung hạn',
        entry_zone: '71,700 - 73,000',
        stop_loss: '67,400',
        take_profit: '88,600',
        risk_reward: '3.93',
        sector: 'Cảng biển & Logistics',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Gemadept (GMD) hưởng lợi lớn từ sự phục hồi của hoạt động xuất nhập khẩu toàn cầu và sản lượng hàng hóa qua cảng nước sâu Gemalink tăng trưởng mạnh mẽ. Cấu trúc tích lũy kênh giá tăng dài hạn kết hợp với dòng tiền lớn gia nhập tạo đà bứt phá hướng về vùng đỉnh thời đại mới.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GMD.png',
        created_at: new Date().toISOString(),
        entry_criteria: '["Giá điều chỉnh kiểm định lại vùng 71,700 - 73,000 với volume cạn kiệt","Lực cầu chủ động gia tăng khi chạm hỗ trợ"]',
        exit_criteria: '["Chốt lời mục tiêu tại 88,600","Cắt lỗ nếu đóng cửa dưới 67,400"]',
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
    console.log('Không tìm thấy kịch bản GMD nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'GMD',
        company_name: 'Công ty Cổ phần Gemadept',
        strategy_name: 'Pullback kênh xu hướng tăng & Hỗ trợ tích lũy',
        timeframe: 'Trung hạn',
        entry_zone: '71,700 - 73,000',
        stop_loss: '67,400',
        take_profit: '88,600',
        risk_reward: '3.93',
        sector: 'Cảng biển & Logistics',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Gemadept (GMD) hưởng lợi lớn từ sự phục hồi của hoạt động xuất nhập khẩu toàn cầu và sản lượng hàng hóa qua cảng nước sâu Gemalink tăng trưởng mạnh mẽ. Cấu trúc tích lũy kênh giá tăng dài hạn kết hợp với dòng tiền lớn gia nhập tạo đà bứt phá hướng về vùng đỉnh thời đại mới.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/GMD.png',
        entry_criteria: '["Giá điều chỉnh kiểm định lại vùng 71,700 - 73,000 với volume cạn kiệt","Lực cầu chủ động gia tăng khi chạm hỗ trợ"]',
        exit_criteria: '["Chốt lời mục tiêu tại 88,600","Cắt lỗ nếu đóng cửa dưới 67,400"]'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790/media__1781512937188.jpg';
  
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
