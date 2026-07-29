const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertVCIPlan() {
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
  const filePath = `charts/vci-${Date.now()}${fileExt}`;
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
- VCI đã chịu một nhịp giảm sâu từ vùng đỉnh 31.000đ về sát hỗ trợ lịch sử quanh **18.000đ - 18.500đ**. Giá hiện tại vẫn đang giao dịch dưới đường SMA200 (quanh 25.744đ).
- **Tín hiệu đảo chiều**: Cực kỳ mạnh mẽ khi giá chạm đáy 18.150đ vào ngày 28/07/2026, lập tức thu hút lực cầu bắt đáy lớn (Buying Climax) đẩy giá hồi phục kèm **Volume tăng vọt lên 16.48 triệu cổ phiếu** (gấp 1.8 lần trung bình 20 phiên). Phiên hôm nay (29/7) tiếp đà hồi phục tăng +3.3%, chính thức **breakout khỏi kênh nêm giảm ngắn hạn**.
- Chỉ báo RSI (14) tạo đáy phân kỳ ngắn hạn quanh vùng 20 và hiện đã hồi phục lên 38.45, xác nhận cấu trúc tạo đáy thành công.

**2. Tính đối xứng (Symmetry)**
- Biên độ giảm ~40% từ đỉnh là mức chiết khấu điển hình trong lịch sử các nhịp điều chỉnh lớn của VCI. Cấu trúc thời gian điều chỉnh hơn 4 tháng tạo nền tích lũy đối xứng, cho thấy lực cung bán tháo đã kiệt quệ hoàn toàn tại vùng giá này.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: Nhóm chứng khoán nhạy sóng với dòng tiền phục hồi của VNINDEX và kỳ vọng nâng hạng thị trường cuối năm. VCI là công ty có mảng tự doanh và IB (ngân hàng đầu tư) hàng đầu, có đà bật nảy mạnh khi thị trường ấm lại.
- *Rủi ro*: Thanh khoản thị trường chung yếu có thể làm chậm nhịp hồi phục. Rủi ro này được quản trị chặt chẽ bằng mức dừng lỗ cực ngắn (chỉ 6% dưới đáy cũ 19.350đ).

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò tại nền)`;

  const planPayload = {
    ticker: 'VCI',
    company_name: 'Chứng khoán Vietcap (VCI)',
    strategy_name: 'Mua đảo chiều từ nêm giảm tại hỗ trợ lịch sử',
    entry_zone: '19.80 - 20.60',
    stop_loss: '19.35',
    take_profit: '26.05',
    risk_reward: '4.36',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Chứng khoán',
    risk_level: 'Trung bình',
    catalyst_note: 'Kỳ vọng phục hồi thị trường và nâng hạng cuối năm, hoạt động tự doanh/IB khởi sắc.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan VCI vào Database...');
  
  // Xoá plan cũ của VCI nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'VCI');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert VCI:', error);
  } else {
    console.log('✅ Đã insert thành công VCI Plan mới:', data[0].id);
  }
}

insertVCIPlan();
