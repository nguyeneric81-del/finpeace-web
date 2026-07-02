const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ANALYST_NOTE = `**1. Hành vi Giá & Khối lượng cụ thể**
* Cổ phiếu VRE đang giao dịch trong mẫu hình nêm hội tụ/tam giác lớn kéo dài từ năm 2025. Giá hiện tại đóng cửa phiên gần nhất là **28,600 VND** (-1.89%).
* Đường SMA 200 ngày (quanh mốc 31.3K) nằm ngay phía trên, đóng vai trò là kháng cự động ngắn hạn.
* Thanh khoản (Volume) trong những phiên gần đây sụt giảm rõ rệt, chỉ đạt 1.9M cổ phiếu (so với trung bình 20 phiên là 5.0M), cho thấy áp lực bán cạn kiệt dứt điểm.
* Điểm mua pullback tối ưu được thiết lập tại vùng hỗ trợ ngang cứng hợp lưu với đường xu hướng tăng nâng đỡ (Uptrend Line) dài hạn tại vùng giá **27,450 VND**, cho tỷ lệ Risk:Reward cực kỳ hấp dẫn.

**2. Phân tích Tính Đối Xứng (Symmetry)**
* Vùng giá 27.0K - 27.5K là bệ đỡ xu hướng rất mạnh được thiết lập qua nhiều nhịp kiểm định thành công từ quý 3/2025. Nhịp điều chỉnh giảm từ đỉnh ngắn hạn 37.5K về sát trendline hỗ trợ tạo ra sự nén giá đối xứng lý tưởng để chuẩn bị cho nhịp hồi phục trung hạn tiếp theo hướng về đỉnh cũ quanh mốc 37,450 VND.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
* Nhóm ngành Bất động sản bán lẻ có tính phòng thủ và phục hồi cao theo sức mua tiêu dùng trong nước. Vincom Retail giữ vị thế độc quyền nhóm TTTM phân khúc lớn tại Việt Nam. Rủi ro phân cực ngành rất thấp nhờ mô hình kinh doanh cho thuê thu tiền đều đặn.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): [0/5]
- Trục Dao động (Sideway Score): [4/5]
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

async function run() {
  console.log('--- Bắt đầu quy trình xử lý Trading Plan VRE ---');

  // 1. Tìm kiếm kịch bản giao dịch VRE cũ
  console.log('Bước 1: Tìm kiếm kịch bản giao dịch VRE hiện tại...');
  const { data: existingPlan, error: queryErr } = await supabase
    .from('trading_plans')
    .select('id')
    .eq('ticker', 'VRE')
    .single();

  if (queryErr && queryErr.code !== 'PGRST116') {
    console.error('Lỗi khi truy vấn kịch bản hiện tại:', queryErr);
    return;
  }

  let planId = '';
  if (existingPlan) {
    planId = existingPlan.id;
    console.log(`Tìm thấy kịch bản VRE hiện tại với ID: ${planId}. Tiến hành cập nhật thông tin mới...`);
    const { error: updateErr } = await supabase
      .from('trading_plans')
      .update({
        company_name: 'Cổ phần Vincom Retail',
        strategy_name: 'Pullback hỗ trợ ngang & Kênh xu hướng tăng dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '27,450',
        stop_loss: '25,300',
        take_profit: '37,450',
        risk_reward: '4.65',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VRE sở hữu và vận hành hệ thống trung tâm thương mại lớn nhất Việt Nam. Doanh thu cho thuê ổn định với dòng tiền tự do dồi dào. Cổ phiếu đang tích lũy hội tụ ở cuối mẫu hình nêm lớn, điều chỉnh về hỗ trợ cứng 27.4K là cơ hội mua tích lũy cực kỳ tốt.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VRE.png',
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
    console.log('Không tìm thấy kịch bản VRE nào. Tiến hành tạo mới hoàn toàn...');
    const { data: newPlan, error: insertErr } = await supabase
      .from('trading_plans')
      .insert({
        ticker: 'VRE',
        company_name: 'Cổ phần Vincom Retail',
        strategy_name: 'Pullback hỗ trợ ngang & Kênh xu hướng tăng dài hạn',
        timeframe: 'Trung hạn',
        entry_zone: '27,450',
        stop_loss: '25,300',
        take_profit: '37,450',
        risk_reward: '4.65',
        sector: 'Bất động sản',
        risk_level: 'Thấp',
        conviction_level: 'Cao',
        analyst_note: ANALYST_NOTE,
        catalyst_note: 'VRE sở hữu và vận hành hệ thống trung tâm thương mại lớn nhất Việt Nam. Doanh thu cho thuê ổn định với dòng tiền tự do dồi dào. Cổ phiếu đang tích lũy hội tụ ở cuối mẫu hình nêm lớn, điều chỉnh về hỗ trợ cứng 27.4K là cơ hội mua tích lũy cực kỳ tốt.',
        is_confirmed: true,
        expected_holding_days: 75,
        capital_allocation_pct: 10,
        status: 'active',
        exec_status: 'waiting_buy',
        exchange: 'HOSE',
        logo_url: 'https://vsd.vn/Images/Logo/VRE.png'
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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ad017940-cb8b-433e-acf5-3d27368bc547/media__1781252432567.jpg';
  
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
