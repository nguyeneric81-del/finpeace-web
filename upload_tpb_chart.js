const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu TPB đã hoàn thành nhịp giảm điều chỉnh và đang thiết lập nền tích lũy đi ngang (Sideway Accumulation) chặt chẽ trong biên độ 15.1K - 16.5K.
* Giá hiện tại (quanh 16,350 VND) đã bứt phá thành công lên trên các đường MA20 (15,770 VND) và MA50 (16,009 VND) với một cây nến xanh tăng điểm dứt khoát (+3.15%).
* Dòng tiền lớn ghi nhận sự gia tăng đột biến vào phiên ngày 05/06 với khối lượng giao dịch đạt hơn 28.6M cổ phiếu (gấp 3 lần trung bình 20 phiên). Phiên giao dịch ngày hôm nay tiếp tục cho thấy lực cầu chủ động đẩy giá lên sát đường xu hướng giảm dài hạn.

**2. Tính đối xứng (Symmetry)**
* TPB đã hoàn thành chu kỳ giảm kéo dài và đang tạo mẫu hình đáy bo tròn (Rounding Bottom) hoặc vai đầu vai ngược nhỏ tại vùng hỗ trợ 15.1K - 15.6K.
* Nhịp tích lũy cạn cung này có thời gian tương đối dài và vững chắc, tạo dư địa lớn cho sóng tăng phục hồi trung hạn hướng về vùng đỉnh cũ.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngân hàng đóng vai trò dẫn dắt chỉ số VNINDEX. TPBank có câu chuyện hồi phục chất lượng tài sản và tăng trưởng tín dụng tốt, thu hút sự quan tâm lớn từ khối ngoại ở vùng định giá rẻ. Rủi ro phân cực ngành rất thấp.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [3/5]
- Trục Dao động (Sideway Score): [5/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan TPB ---');

  // 1. Tìm kiếm kịch bản giao dịch TPB cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch TPB hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'TPB')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản TPB hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Ngân hàng TMCP Tiên Phong',
        strategy_name: 'Tích lũy hộp Đáy & Hồi phục từ Hỗ trợ Trung hạn',
        timeframe: 'Trung hạn',
        entry_zone: '16,000 - 17,000',
        stop_loss: '16,000',
        take_profit: '21,700',
        risk_reward: '4.70',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Sự phục hồi tăng trưởng tín dụng và NIM của TPBank, dòng tiền lớn gia tăng đột biến tại vùng đáy.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/TPB.png',
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
    console.log('Không tìm thấy kịch bản TPB nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'TPB',
        company_name: 'Ngân hàng TMCP Tiên Phong',
        strategy_name: 'Tích lũy hộp Đáy & Hồi phục từ Hỗ trợ Trung hạn',
        timeframe: 'Trung hạn',
        entry_zone: '16,000 - 17,000',
        stop_loss: '16,000',
        take_profit: '21,700',
        risk_reward: '4.70',
        sector: 'Ngân hàng',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'Sự phục hồi tăng trưởng tín dụng và NIM của TPBank, dòng tiền lớn gia tăng đột biến tại vùng đáy.',
        is_confirmed: true,
        expected_holding_days: 60,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/TPB.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781246400189.jpg';
  
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
