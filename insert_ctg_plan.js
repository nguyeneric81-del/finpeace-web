const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertCTGPlan() {
  const artifactsDir = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ccbbd93f-3dd7-4163-a228-9c10c1ffd4fd';
  const files = fs.readdirSync(artifactsDir)
    .filter(f => f.startsWith('media__') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')))
    .map(f => ({ name: f, time: fs.statSync(path.join(artifactsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
    
  if (files.length === 0) {
    console.error('Không tìm thấy file ảnh nào!');
    return;
  }
  
  const imagePath = path.join(artifactsDir, files[0].name);
  console.log('Using latest image:', imagePath);

  const fileExt = path.extname(imagePath);
  const filePath = `charts/ctg-${Date.now()}${fileExt}`;
  console.log('Đang upload ảnh lên bucket advisor-charts...');
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filePath, fileBuffer, { contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png', upsert: true });

  if (uploadError) {
    console.error('Lỗi khi upload ảnh:', uploadError);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploadData.path}`;
  console.log('✅ Upload ảnh thành công. Link:', publicUrl);

  const markdownNote = `**1. Hành vi Giá & Khối lượng cụ thể**
- CTG đang trong xu hướng điều chỉnh trung hạn dưới đường SMA200 (quanh 34.576đ) sau khi đứt gãy mốc hỗ trợ trung gian tại 33.000đ (hình chữ nhật màu xanh lam phía trên).
- **Tín hiệu đảo chiều**: Giá đã hoàn thành nhịp giảm sâu và tìm thấy lực đỡ cực kỳ vững chắc tại **hỗ trợ lịch sử 28.300đ - 28.600đ** (đây là nền giá tích lũy khởi đầu của sóng tăng lớn năm 2025). Sau khi test đáy 28.400đ thành công vào ngày 28/07, CTG đã bùng nổ tăng +3.75% hướng lên 30.450đ trong phiên hôm nay (30/7), xác nhận cấu trúc nến đảo chiều rũ bỏ mạnh mẽ.
- Chỉ báo RSI (14) tạo đáy nhọn quanh vùng quá bán cực hạn (20) và hiện đã hướng lên mạnh mẽ đạt 41.49, thoát khỏi kênh xu hướng giảm ngắn hạn.

**2. Tính đối xứng (Symmetry)**
- Nhịp chiết khấu ~25% từ đỉnh năm 2026 về vùng 28.300đ đối xứng hoàn hảo về mặt thời gian và biên độ với các nhịp điều chỉnh lớn trước đây của nhóm ngân hàng quốc doanh. Vùng giá 28.x xác nhận là vùng định giá siêu rẻ kích hoạt dòng tiền tổ chức tham gia gom hàng trở lại.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: VietinBank là một trong ba ngân hàng quốc doanh lớn nhất Việt Nam, luôn được ưu tiên về tăng trưởng tín dụng và sở hữu tệp khách hàng doanh nghiệp nhà nước bền vững. Sóng gió nợ xấu đã được phản ánh vào giá bán tháo vừa qua.
- *Rủi ro*: Rủi ro nợ xấu gia tăng và áp lực trích lập dự phòng trong ngắn hạn. Tuy nhiên, rủi ro này được giới hạn tối đa chỉ ~5.6% nhờ điểm cắt lỗ cực kỳ an toàn ngay sát dưới hỗ trợ cứng (28.350đ).

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò tại nền)`;

  const planPayload = {
    ticker: 'CTG',
    company_name: 'Ngân hàng VietinBank (CTG)',
    strategy_name: 'Mua đảo chiều từ nêm giảm tại hỗ trợ lịch sử',
    entry_zone: '29.00 - 30.45',
    stop_loss: '28.35',
    take_profit: '34.85',
    risk_reward: '2.82',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Ngân hàng',
    risk_level: 'Trung bình',
    catalyst_note: 'VietinBank dẫn đầu tăng trưởng tín dụng quốc doanh, định giá rẻ lịch sử kích hoạt dòng tiền.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan CTG vào Database...');
  
  // Xoá plan cũ của CTG nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'CTG');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert CTG:', error);
  } else {
    console.log('✅ Đã insert thành công CTG Plan mới:', data[0].id);
  }
}

insertCTGPlan();
