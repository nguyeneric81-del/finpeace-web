const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateVCGNote() {
  const markdownNote = `**1. Hành vi Giá & Khối lượng (Price Action & Volume)**
- Khi giá lùi sâu về sát mốc 21.000đ - 22.000đ (cạnh dưới nền tảng Sideway), áp lực thanh khoản (Volume) có dấu hiệu cạn kiệt cục bộ rõ rệt. Đồ thị ghi nhận các nhịp Stop Hunt với volume thấp dần, chứng tỏ lượng hàng kẹp phía trên đã ngưng xả. Sự cạn cung ở vùng giao tranh kết hợp lực cầu bắt đáy âm thầm là nền tảng chẹn đứng đà rơi, xác lập lợi thế áp đảo rủi ro hiện hữu.

**2. Tính Đối Xứng Cơ Cấu (Symmetry & Structure)**
- VCG vận động vắt qua một cấu trúc hộp đi ngang khổng lồ với các cạnh là 16.000 - 36.000. Dòng tiền kiến tạo nên đường Trendline dốc lên vững chãi nâng đỡ các đáy lớn. Nhịp nén biên độ hiện tại chạm chính xác điểm hội tụ: cạnh dưới hộp tích lũy và Trendline chéo hỗ trợ dài hạn. Tính đối xứng của biên độ/thời gian với lịch sử retest trước đó khẳng định đây là "Vùng rũ bỏ cuối cùng".

**3. Đánh giá Cấu trúc Phân cực**
- **Nhóm ngành**: Xây dựng (Beta cao)
- **Mức độ rủi ro**: Chấp nhận được (Kiểm soát bởi điểm mua hội tụ MA+Trendline)
- **Độ tự tin**: Cao (Đồng thuận kép Cấu trúc Giá - Volume)

*Lưu ý: Tỷ trọng vốn phân bổ phải tuân thủ tuyệt đối ngắt lùi ở mức 5% NAV.*`;

  const { data, error } = await supabase
    .from('trading_plans')
    .update({ analyst_note: markdownNote })
    .eq('ticker', 'VCG')
    .eq('status', 'active');

  if (error) {
    console.error('Lỗi khi update bản ghi VCG:', error);
  } else {
    console.log('✅ Đã update thành công Analyst Note định dạng Markdown cho VCG!');
  }
}

updateVCGNote();
