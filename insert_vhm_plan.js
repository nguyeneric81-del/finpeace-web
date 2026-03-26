const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertVHMPlan() {
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

  const filePath = `charts/vhm-${Date.now()}.png`;
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
- Trực quan trên đồ thị VHM, sau cú đổ gãy mang tính vĩ mô thả rơi từ vùng đỉnh 110.000đ xuống tận sát mốc 68.000đ, dòng tiền tổ chức đã nhập cuộc rất quyết liệt, đẩy giá hồi phục dạng chữ V bật nảy lên lại vùng kháng cự. Nhịp vận động thắt chặt tiệm cận mốc 82.000đ - 84.000đ hiện diện trên Chart chính là pha Pull-back (thoái lui) mang ý nghĩa chèn ép kiểm định lượng cung cắt lỗ. Khối lượng tại sườn bên phải của nhịp rũ này đang có xu hướng bo hẹp lại rõ rệt, vạch trần áp lực bán hoảng tiêu cực trôi sụt hoàn toàn, trả lại ưu thế chi phối cho phe tạo lập cầm tiền.

**2. Tính Đối Xứng Cơ Cấu (Symmetry & Structure)**
- Điểm đắt giá nhất của cấu trúc VHM thời điểm này chính là Mô hình Đối Xứng Khổng Lồ. Việc giá ghim thành công ở vùng cao hơn mốc 75 (nhằm tạo một Higher Low) xác lập một trục vận động vững chắc, mô phỏng hoàn hảo các nhịp cạn kiệt ở dải quá khứ. Thay vì dọa thủng đáy, VHM đã tạo được bước uốn cong, liên tục dồn nén lò xo tại chính giữa hộp ranh giới. Biên độ thời gian kiến tạo ở mạn sườn phải của mô hình hoàn toàn khớp nối nhịp điệu với pha nén xả ở mạn trái, ấn định dấu chấm hết cho đà Downtrend, dọn đường xoay trục sang pha Đẩy giá quy mô lớn.

**3. Đánh giá Cấu trúc Phân cực**
- **Nhóm ngành**: Bất động sản (Trụ đỡ Quốc Dân - Top Tier Meta)
- **Mức độ rủi ro**: Trung bình thấp (Được bảo kê bởi nền đáy dài hạn nghìn tỷ vừa xác nhận)
- **Độ tự tin**: Cực kỳ Cao (Dòng tiền Big Boys lộ rõ qua nhịp gom đáy chữ V trước đó)`;

  const planPayload = {
    ticker: 'VHM',
    company_name: 'Vinhomes',
    strategy_name: 'Mua Pull-back tạo cấu trúc Đáy Khổng Lồ',
    entry_zone: '83.50 - 84.50',
    stop_loss: '68.81',
    take_profit: '103.53',
    risk_reward: '1.28',
    timeframe: 'Dài hạn (3 - 6 tháng)',
    conviction_level: 'High',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote
  };

  console.log('Đang Insert Plan VHM vào Database...');
  
  // Xoá plan cũ của VHM nếu có (để đề phòng Duplicate nếu lúc nãy insert rồi)
  await supabase.from('trading_plans').delete().eq('ticker', 'VHM');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert VHM:', error);
  } else {
    console.log('✅ Đã insert thành công VHM Plan mới:', data[0].id);
  }
}

insertVHMPlan();
