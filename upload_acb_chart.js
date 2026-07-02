const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu ACB đang vận động trong một xu hướng tăng (Uptrend) rất khỏe, được nâng đỡ vững chắc bởi đường xu hướng tăng (Uptrend line) dài hạn và đường SMA 200 ngày (quanh mốc 24.6K).
* Giá hiện tại (quanh 26,750 VND) đang tiệm cận kháng cự biên trên. Phiên bùng nổ ngày 03/06 ghi nhận khối lượng giao dịch kỷ lục lên tới hơn 60.7M cổ phiếu, chứng tỏ dòng tiền lớn tham gia đẩy giá cực kỳ quyết liệt.
* Với đà tăng dốc hiện tại, việc mua đuổi ngay tại vùng kháng cự 26.7K - 27.0K sẽ có tỷ lệ R:R kém tối ưu. Do đó, điểm mua tốt nhất là khi cổ phiếu có nhịp điều chỉnh pullback (retest) về lại vùng hỗ trợ đỉnh cũ vừa vượt qua.

**2. Tính đối xứng (Symmetry)**
* Cấu trúc nâng đáy (Higher Lows) được thiết lập rất đều đặn từ tháng 04/2025. Nhịp tăng mạnh mẽ này phản ánh sự đồng điệu với sóng tăng trước đó và đang mở ra cơ hội tiến sát mục tiêu trung hạn quanh 29.5K.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngân hàng đóng vai trò dẫn dắt chỉ số VNINDEX. ACB là ngân hàng TMCP hàng đầu về an toàn tài sản, nợ xấu cực thấp, hiệu quả sinh lời ROE cao và ổn định. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [4/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Quá Mua / Rủi ro Chốt Lời (HOLD / Chỉ Mua khi Pullback retest cạn cung)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan ACB ---');

  // 1. Tìm kiếm kịch bản giao dịch ACB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch ACB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'ACB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản ACB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Á Châu',
        strategy_name: 'Hồi phục từ SMA 200 & Pullback hỗ trợ xu hướng tăng',
        timeframe: 'Trung hạn',
        entry_zone: '24,600 - 25,500',
        stop_loss: '23,350',
        take_profit: '29,500',
        risk_reward: '3.92',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Tăng trưởng tín dụng bán lẻ phục hồi mạnh mẽ, tỷ lệ nợ xấu ở mức thấp nhất hệ thống, hiệu quả sinh lời ROE cao và ổn định.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/ACB.png',
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
    console.log('Không tìm thấy kịch bản ACB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'ACB',
        company_name: 'Ngân hàng TMCP Á Châu',
        strategy_name: 'Hồi phục từ SMA 200 & Pullback hỗ trợ xu hướng tăng',
        timeframe: 'Trung hạn',
        entry_zone: '24,600 - 25,500',
        stop_loss: '23,350',
        take_profit: '29,500',
        risk_reward: '3.92',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Tăng trưởng tín dụng bán lẻ phục hồi mạnh mẽ, tỷ lệ nợ xấu ở mức thấp nhất hệ thống, hiệu quả sinh lời ROE cao và ổn định.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/ACB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781248302265.jpg';
  
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
