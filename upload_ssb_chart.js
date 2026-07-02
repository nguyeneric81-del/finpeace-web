const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu SSB đã thiết lập một vùng tích lũy đi ngang cực kỳ chặt chẽ (Darvas Box) kéo dài suốt hơn 8 tháng qua, dao động từ biên dưới 13.6K đến biên trên 15.0K. Hiện tại, giá đang đóng cửa quanh mốc 14,500 VND.
* Đường SMA 200 ngày (quanh mốc 14,714 VND) đang đóng vai trò là kháng cự động ngắn hạn. Giá đang nén rất sát dưới đường trung bình này.
* Thanh khoản (Volume) trong những phiên gần đây sụt giảm sâu, trung bình phiên chỉ đạt 2.1M - 2.8M cổ phiếu (thấp hơn trung bình 20 phiên là 2.6M), cho thấy sự cạn kiệt thanh khoản đặc trưng của giai đoạn cuối pha tích lũy nền phẳng.
* Điểm mua tối ưu sẽ kích hoạt khi giá **breakout dứt điểm vượt hẳn vùng kháng cự biên trên hộp Darvas tại 15,000 VND** đi kèm khối lượng bùng nổ để xác nhận xu hướng đẩy giá mới.

**2. Tính đối xứng (Symmetry)**
* Vùng giá 14,300 VND là ngưỡng hỗ trợ ngang tin cậy đóng vai trò làm điểm chặn lỗ (Stop Loss) cực kỳ an toàn. Nền giá tích lũy phẳng kéo dài hơn 8 tháng là một vùng đệm năng lượng khổng lồ. Nhịp bứt phá sau đó sẽ tạo ra biên tăng đối xứng hướng thẳng về kháng cự đỉnh cũ quanh mốc 17,550 VND.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Ngân hàng duy trì sự ổn định cao và thu hút dòng tiền thị trường tốt. SeABank có tốc độ tăng trưởng ổn định, cơ cấu tài sản lành mạnh và chiến lược số hóa mạnh mẽ. Rủi ro phân cực của nhóm ngành ở mức thấp, đảm bảo sự an toàn cho vị thế tích lũy.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [3/5]
- Trục Dao động (Sideway Score): [3/5]
- Matrix Evaluation: Tranh chấp Hỗn loạn (Messy - PASS khi Breakout vượt 15,000 VND)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan SSB ---');

  // 1. Tìm kiếm kịch bản giao dịch SSB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch SSB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'SSB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản SSB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Đông Nam Á',
        strategy_name: 'Breakout nền phẳng Darvas Box & Vượt SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '15,000',
        stop_loss: '14,300',
        take_profit: '17,550',
        risk_reward: '3.64',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'SSB tích lũy nền phẳng chặt chẽ kéo dài hơn 8 tháng từ quý 4/2025. Dòng tiền cạn kiệt dứt điểm trong nền phẳng và chuẩn bị nổ volume khi vượt SMA200 và cản 15.0K.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/SSB.png',
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
    console.log('Không tìm thấy kịch bản SSB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'SSB',
        company_name: 'Ngân hàng TMCP Đông Nam Á',
        strategy_name: 'Breakout nền phẳng Darvas Box & Vượt SMA 200',
        timeframe: 'Trung hạn',
        entry_zone: '15,000',
        stop_loss: '14,300',
        take_profit: '17,550',
        risk_reward: '3.64',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'SSB tích lũy nền phẳng chặt chẽ kéo dài hơn 8 tháng từ quý 4/2025. Dòng tiền cạn kiệt dứt điểm trong nền phẳng và chuẩn bị nổ volume khi vượt SMA200 và cản 15.0K.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/SSB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781250652999.jpg';
  
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
