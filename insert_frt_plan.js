const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertFRTPlan() {
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
  const filePath = `charts/frt-${Date.now()}${fileExt}`;
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
- FRT đã trải qua nhịp đè giá (downtrend) mạnh từ đỉnh 170.000đ về sát vùng hỗ trợ lịch sử quanh **100.000đ - 103.000đ**. Giá hiện tại đang giao dịch dưới các đường SMA20, SMA50 và SMA200.
- **Tín hiệu đảo chiều**: Cực kỳ tích cực khi giá chạm vùng 100.200đ vào ngày 23/07/2026, xuất hiện lực cầu bắt đáy cực mạnh (Buying Climax) đẩy giá hồi phục lên 109.000đ, đi kèm **Volume tăng vọt đạt 788.600 cổ phiếu** (gấp hơn 3 lần trung bình 20 phiên). Đây là phiên rũ bỏ (shakeout) kinh điển xác nhận dòng tiền tổ chức hấp thụ toàn bộ lực cung hoảng loạn ở vùng đáy.

**2. Tính đối xứng (Symmetry)**
- Nhịp giảm vừa qua kéo dài liên tục gần 4 tháng. Vùng hỗ trợ quanh 100.000đ trùng khớp với đáy tích lũy của tháng 4/2025, tạo nên sự cân bằng đối xứng hoàn hảo về cấu trúc thời gian và biên độ điều chỉnh (~40% từ đỉnh). Khả năng FRT đã tìm thấy vùng đáy trung hạn tại đây.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: Kỳ vọng vào sự hồi phục của mảng bán lẻ thiết bị công nghệ (FPT Shop) nửa cuối năm và động lực tăng trưởng doanh thu dài hạn đến từ chuỗi nhà thuốc Long Châu.
- *Rủi ro*: Thị trường chung VNINDEX có thể có nhịp rung lắc kéo theo đà bán chéo ngắn hạn. Tuy nhiên, với điểm cắt lỗ chặt chẽ ngay dưới đáy cũ (102.900đ), rủi ro được giới hạn tối đa.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò tại nền)`;

  const planPayload = {
    ticker: 'FRT',
    company_name: 'Bán lẻ Kỹ thuật số FPT (FRT)',
    strategy_name: 'Mua đảo chiều đáy hỗ trợ lịch sử',
    entry_zone: '108.00 - 110.50',
    stop_loss: '102.90',
    take_profit: '140.00',
    risk_reward: '3.88',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Bán lẻ',
    risk_level: 'Trung bình',
    catalyst_note: 'Phục hồi sức mua bán lẻ nửa cuối năm, chuỗi nhà thuốc Long Châu tiếp tục mở rộng.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan FRT vào Database...');
  
  // Xoá plan cũ của FRT nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'FRT');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert FRT:', error);
  } else {
    console.log('✅ Đã insert thành công FRT Plan mới:', data[0].id);
  }
}

insertFRTPlan();
