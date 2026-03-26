const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertTPBPlan() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774448590720.png';
  
  if (!fs.existsSync(imagePath)) {
    console.error('File ảnh không tồn tại:', imagePath);
    return;
  }

  const filePath = `charts/tpb-${Date.now()}.png`;
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
- TPB đang trải qua pha rung lắc mạnh kéo từ biên trên hộp (vùng 20.000đ) dạt về trung chuyển giữa giá. Tại các phiên rũ bỏ sâu về sát 15.100đ, lực cung có xu hướng yếu đi nhiều, xen kẽ với những phiên rút chân (Pinbar) mang thanh khoản cải thiện lên mức 19.7 triệu cổ (ngang mức trung bình 20 phiên). Sự đan xen nến cung - cầu tại khu vực nhạy cảm này cho thấy áp lực bán hoảng loạn đã vơi bớt, nhường chỗ cho dòng tiền Smart Money rải mồi gom hàng một cách chủ động. Khối lượng sẽ đóng vai trò xác nhận then chốt khi giá bứt lại lên trên vùng 16.500đ.

**2. Tính Đối Xứng Cơ Cấu (Symmetry & Structure)**
- Trên bức tranh lớn từ đầu năm 2022, TPB nằm trọn trong chiếc hộp đi ngang kéo dài miệt mài. Nhìn vào các gợn sóng nội tại, mỗi nhịp giảm khoảng 18-20% tính từ đỉnh gần nhất thường được đối xứng bằng một chuỗi tuần hoàn phục hồi (Recovery Phase) kéo lại kháng cự đỉnh hộp cũ. Nhịp điều chỉnh hiện tại (từ 20.000 về 15.000) một lần nữa lặp lại biên độ chiết khấu kinh điển này. Tính đối xứng vạch ra kỳ vọng vùng trũng hiện tại sẽ là bệ phóng lý tưởng cho pha Mark-up (Đẩy giá) hướng về trần trên 19.000+.

**3. Đánh giá Cấu trúc Phân cực**
- **Nhóm ngành**: Ngân hàng (Big Beta, Dẫn dắt thanh khoản)
- **Mức độ rủi ro**: Trung bình thấp (Rủi ro hệ thống bị khóa chặt bởi ngưỡng hỗ trợ cứng viền dưới hộp)
- **Độ tự tin**: Cao (Sự hội tụ giữa biên độ đối xứng và tín hiệu cạn cung ngắn hạn)`;

  const planPayload = {
    ticker: 'TPB',
    company_name: 'Tien Phong Bank',
    strategy_name: 'Mua xác nhận phục hồi từ Cạnh Giữa hộp',
    entry_zone: '16.50 - 16.80',
    stop_loss: '14.90',
    take_profit: '19.37',
    risk_reward: '1.55',
    timeframe: 'Trung hạn (4-12 tuần)',
    conviction_level: 'High',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote
  };

  console.log('Đang Insert Plan TPB vào Database...');
  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert TPB:', error);
  } else {
    console.log('✅ Đã insert thành công TPB Plan:', data[0].id);
  }
}

insertTPBPlan();
