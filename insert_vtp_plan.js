const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertVTPPlan() {
  const artifactsDir = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1';
  const files = fs.readdirSync(artifactsDir)
    .filter(f => f.startsWith('media__') && f.endsWith('.png'))
    .map(f => ({ name: f, time: fs.statSync(path.join(artifactsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
    
  if (files.length === 0) {
    console.error('Không tìm thấy file ảnh nào!');
    return;
  }
  
  const imagePath = path.join(artifactsDir, files[0].name);
  console.log('Using latest image:', imagePath);

  const filePath = `charts/vtp-${Date.now()}.png`;
  console.log('Đang upload ảnh lên bucket advisor-charts...');
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filePath, fileBuffer, { contentType: 'image/png', upsert: true });

  if (uploadError) {
    console.error('Lỗi khi upload ảnh:', uploadError);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploadData.path}`;
  console.log('✅ Upload ảnh thành công. Link:', publicUrl);

  const markdownNote = `**1. Hành vi Giá & Khối lượng (Price Action & Volume)**
- Cổ phiếu VTP đang vận động trong mẫu hình tiếp diễn (Pennant / Cờ đuôi nheo) sau nhịp tăng giá mạnh trước đó. Các sóng điều chỉnh (pull-back) có biên độ giảm dần, cho thấy lực cung đang suy yếu tại vùng giá thấp. Thanh khoản cạn kiệt trong các phiên giảm hoặc đi ngang là tín hiệu xác nhận trạng thái tiết cung. Việc thiết lập điểm mua (Buy Stop) khi giá bứt phá mốc 96.00 nhằm đảm bảo vị thế chỉ được kích hoạt khi dòng tiền lớn chính thức xác nhận xu hướng tiếp diễn, giảm thiểu rủi ro chôn vốn trong vùng sideway.

**2. Tính Đối Xứng Cơ Cấu (Symmetry & Structure)**
- Xét trên bình diện trung hạn, VTP đã hoàn thiện một chu kỳ đẩy giá với góc dốc ổn định. Theo nguyên lý đo lường mục tiêu của cấu trúc tiếp diễn, biên độ dao động của vùng nén hiện tại (80 - 96) có sự cân bằng tỷ lệ với nhịp tăng trước đó. Khi giá có nến xác nhận vượt qua ngưỡng cản 96.00, mô hình sẽ hoàn thiện và mở rộng mục tiêu tăng giá theo thước đo Fibonacci hướng tới vùng kháng cự 132.50.

**3. Đánh giá Cấu trúc Phân cực**
- **Nhóm ngành**: Vận tải & Logistics (Sức mạnh tương đối - RS duy trì ở mức cao so với chỉ số chung).
- **Mức độ rủi ro**: Chấp nhận được (Lệnh kích hoạt có điều kiện giúp chủ động quản trị rủi ro ngay từ đầu).
- **Độ tự tin**: Cao (Sự đồng thuận giữa cấu trúc kỹ thuật cạn cung và xu hướng ngành).`;

  const planPayload = {
    ticker: 'VTP',
    company_name: 'CTCP Bưu chính Viettel',
    strategy_name: 'Mua Breakout xác nhận Cờ Đuôi Nheo',
    entry_zone: '96.00 - 96.70',
    stop_loss: '83.40',
    take_profit: '132.50',
    risk_reward: '2.79',
    timeframe: 'Trung/Dài Hạn (3 - 6 tháng)',
    conviction_level: 'High',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote
  };

  console.log('Đang Insert Plan VTP vào Database...');
  
  await supabase.from('trading_plans').delete().eq('ticker', 'VTP');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert VTP:', error);
  } else {
    console.log('✅ Đã insert thành công VTP Plan mới:', data[0].id);
  }
}

insertVTPPlan();
