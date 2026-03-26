const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertCTGPlan() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774448237899.png';
  
  if (!fs.existsSync(imagePath)) {
    console.error('File ảnh không tồn tại:', imagePath);
    return;
  }

  const filePath = `charts/ctg-${Date.now()}.png`;
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
- Kể từ khi tạo đỉnh ngắn hạn quanh mốc hạn 36.000đ, CTG hiện đang trong pha rũ bỏ (shakeout) kỹ thuật. Ở phiên gần nhất chạm ngưỡng 33.550đ, lực cung có xu hướng thoái lui đáng kể khi Volume chỉ khớp rải rác 6.42 triệu cổ phiếu (thấp hơn tới ~50% so với khối lượng trung bình 20 phiên là 12.89 triệu). Sự thu hẹp biên độ giao động đi kèm thanh khoản kiệt quệ ngay tại vùng nền chứng nhận trạng thái "cạn cung cục bộ", tạo bước nén đà hoàn hảo trước khi luân chuyển dòng tiền lớn.

**2. Tính Đối Xứng Cơ Cấu (Symmetry & Structure)**
- Điểm sáng của CTG trên đồ thị dài hạn là cấu trúc "Xếp chồng nền tảng" vững chãi (Darvas Box gối đầu). Từ 2023 đến nay, cổ phiếu liên tục có form bức tốc qua kháng cự rồi nới lỏng dạt về tạo đỉnh hộp mới, tiếp đó retest lại vùng hỗ trợ cũ. Pha neo giá hiện tại (từ 32.000 đến 36.000) có lượng thời gian tĩnh chuẩn mực và mô phỏng hoàn hảo biên độ tích lũy nửa đầu năm 2021. Tính cân bằng đối xứng thời gian hàm ý nhịp đi ngang sắp sửa bước vào hồi kết để kích hoạt pha Markup bức thoát hướng lên. 

**3. Đánh giá Cấu trúc Phân cực**
- **Nhóm ngành**: Ngân hàng (Dòng dẫn dắt chỉ số - Market Leaders)
- **Mức độ rủi ro**: Thấp (Giao dịch tiệm cận vùng nền phòng ngự trung hạn đã được xác lập)
- **Độ tự tin**: Cao (Đồng thuận kép trạng thái tiết cung và cấu trúc uptrend tiếp diễn)`;

  const planPayload = {
    ticker: 'CTG',
    company_name: 'VietinBank',
    strategy_name: 'Đua Lệnh Vượt Cản / Nền Giá Số 3',
    entry_zone: '35.60 - 36.00',
    stop_loss: '32.86',
    take_profit: '39.31',
    risk_reward: '1.19',
    timeframe: 'Ngắn - Trung hạn (4-8 tuần)',
    conviction_level: 'High',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote
  };

  console.log('Đang Insert Plan CTG vào Database...');
  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert CTG:', error);
  } else {
    console.log('✅ Đã insert thành công CTG Plan:', data[0].id);
  }
}

insertCTGPlan();
