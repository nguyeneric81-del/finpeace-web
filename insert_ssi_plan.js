const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertSSIPlan() {
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
  const filePath = `charts/ssi-${Date.now()}${fileExt}`;
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
- SSI đang trong xu hướng điều chỉnh trung hạn dưới đường SMA200 (quanh 29.295đ) và đã tạm thời đánh mất mốc hỗ trợ ngang quan trọng ở 26.000đ (được đánh dấu bằng hình chữ nhật màu xanh lam ở giữa).
- **Tín hiệu đảo chiều**: Giá đã có nhịp rũ bỏ (Washout) sâu về sát hỗ trợ lịch sử quanh **21.700đ - 22.000đ** vào ngày 28/07. Tại đây, SSI xuất hiện nến rút chân mạnh kèm **khối lượng giao dịch tăng vọt lên 30.4 triệu cổ phiếu** (cao hơn đáng kể so với mức trung bình 20 phiên là 22 triệu). Hôm nay (30/7), giá bùng nổ tăng +3.66% hướng lên 24.100đ, xác nhận mẫu hình hai đáy ngắn hạn và breakout đường trendline giảm của nêm.
- Chỉ báo RSI (14) thoát khỏi vùng quá bán, tạo đáy phân kỳ tăng nhẹ và **chính thức breakout đường trendline giảm ngắn hạn của RSI** (đường màu xanh vẽ ở pane RSI).

**2. Tính đối xứng (Symmetry)**
- Biên độ giảm ~38% từ đỉnh gần nhất về đáy là khoảng 38%, cân bằng thời gian điều chỉnh tích lũy 4 tháng qua. Nhịp giảm rũ bỏ này tạo cơ sở đối xứng tốt để thiết lập một sóng hồi phục kiểm định lại vùng kháng cự cũ (quanh SMA200 và vùng 29.000 - 30.000đ).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: SSI có lợi thế dẫn đầu về thị phần và nguồn lực tài chính mạnh để hưởng lợi trực tiếp khi hệ thống KRX vận hành và lộ trình nâng hạng thị trường chứng khoán được đẩy mạnh.
- *Rủi ro*: Rủi ro thanh khoản toàn thị trường sụt giảm làm thu hẹp biên lợi nhuận mảng môi giới. Chúng ta khống chế rủi ro bằng mức dừng lỗ chặt chẽ ngay dưới 22.250đ (ngay dưới vùng đáy rũ bỏ 21.700đ).

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò tại nền)`;

  const planPayload = {
    ticker: 'SSI',
    company_name: 'CTCP Chứng khoán SSI (SSI)',
    strategy_name: 'Mua đảo chiều từ nêm giảm tại hỗ trợ lịch sử',
    entry_zone: '23.50 - 24.10',
    stop_loss: '22.25',
    take_profit: '29.85',
    risk_reward: '3.47',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Chứng khoán',
    risk_level: 'Trung bình',
    catalyst_note: 'Hưởng lợi KRX và nâng hạng thị trường chứng khoán, vị thế dẫn đầu thị phần.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan SSI vào Database...');
  
  // Xoá plan cũ của SSI nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'SSI');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert SSI:', error);
  } else {
    console.log('✅ Đã insert thành công SSI Plan mới:', data[0].id);
  }
}

insertSSIPlan();
