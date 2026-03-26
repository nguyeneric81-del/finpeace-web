const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
require('dotenv').config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Superbase URL or Key in .env.local")
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const FPT_VVIA_ASSESSMENT = {
  id: crypto.randomUUID(),
  title: "[VVIA] Phân Tích Cơ Bản: FPT - Kịch bản AI Bào mòn Outsourcing & Góc nhìn Định chế",
  topic_slug: "fpt-vvia-ai-stress-test",
  date_label: "Tháng 3/2026",
  data_point: "Stress Test 10% Tăng Trưởng",
  published: true,
  category: "Company_VVIA",
  companies: [
    {
      "ticker": "FPT",
      "name": "CTCP FPT"
    }
  ],
  key_stats: [
    {"label": "Tăng trưởng Global IT", "value": "Tụt về 10% do AI", "positive": false},
    {"label": "Fair Value (DCF)", "value": "111.000 VNĐ", "positive": false},
    {"label": "ROIC (Căng cứng)", "value": "16.5%", "positive": false},
    {"label": "Tiền mặt ròng", "value": "26.000 Tỷ VNĐ", "positive": true}
  ],
  analyst_view: `
**1. Tầng Benjamin Graham (Pháo Đài Tiền Mặt Cứu Giá)**
*Nguồn Data: BCTC Hợp nhất Q4 - FPT*
- **Tiền Mặt = 26.000 Tỷ VNĐ:** Tuy AI (Trí tuệ Nhân tạo) đang đấm mạnh vào Tương lai Outsourcing, Quá khứ đã để lại cho FPT một tấm khiên Titan đủ cho Ban lãnh đạo rẽ hướng đầu tư thay vì chỉ làm thợ code.
- **Current Ratio 1.35 & D/E 0.58:** Lợi thế phòng thủ Graham bảo vệ khỏi nguy cơ vỡ nợ, nhưng không chống được suy giảm định giá dài hạn.

**2. Tầng Warren Buffett & Greenblatt (Con Hào Kém Sắc & Cỗ Phanh ROIC)**
- Mảng Global IT bị AI như Copilot cắn trả, khiến Pricing Power giảm sút. Biên lợi gộp giật lùi từ 38.5% xuống mức Báo Động 31%. Tốc độ tăng trưởng doanh thu dự phóng bị cắt máu từ 28% xuống còn **10%/năm**.
- **ROIC Rải Đá:** Tụt thẳng từ kỷ lục 25.2% xuống **16.5%** vì rào cản nhân công giá rẻ bị phá vỡ. FPT phải đốt CAPEX khủng khiếp vào Datacenter và GPU để bắt kịp thế giới.

**3. Tính Toán Định Giá (Re-Valuation Formulas)**
- **Mô hình DCF Chiết khấu:** Đạt mức **111.000 VNĐ/cp** (Trường hợp g=10%, WACC=11%).
- **Mô hình Graham (MoS 50%):** Ép giá nhặt xác ở mức **104.000 VNĐ/cp**.
*=> Khuyến Nghị Cắt Ruột:* Vùng giải ngân an toàn từ 104k - 111k. Đi xa hơn vùng này là Trả Tiền cho Kỳ vọng. Nhớ lại vụ Warren Buffett cắt lỗ toàn bộ Mảng công nghệ IBM năm 2018 khi Con hào IT phai nhạt vì Kỷ nguyên AWS Cloud đè bẹp.

**4. Lớp Bọc Thép Định tính (Broker & Media Convergence)**
- **Góc nhìn Định Chế (SSI/VNDirect):** Giới Phân Tích đang Say Rượu Lạc Quan, duy trì mốc Target Price > 135.000đ và ước tính Tăng trưởng rực rỡ >20%.
- **Báo chí Thực tế:** *"FPT chi hàng trăm triệu USD mua Nvidia"* - Câu nói của Ban Lãnh đạo xác nhận chính xác nguy cơ cạn kiệt Con hào Giá rẻ. AI đang ép FPT phải ném cả Núi Tiền vào Đốt Lò CAPEX để tồn tại. Góc nhìn của Máy Tính ngược dòng đánh bại niềm kiêu hãnh của Đám đông!
`
}

async function uploadVVIA() {
  console.log("🔍 Đang gỡ bỏ nhãn `published` đối với các bài phân tích cũ của FPT...")
  const { error: archiveErr } = await supabase
    .from('macro_insights')
    .update({ published: false })
    .contains('companies', '[{"ticker":"FPT"}]')
    .eq('published', true)
  
  if (archiveErr) {
    console.error("Lỗi khi Archive bài báo cũ:", archiveErr)
    return
  }
  console.log("✅ Gỡ bỏ bài cũ thành công.")

  console.log("🚀 Đang bắn bản Đánh giá Giá trị VVIA (V4) lên Supabase...")
  const { data, error } = await supabase
    .from('macro_insights')
    .insert(FPT_VVIA_ASSESSMENT)
    .select()

  if (error) {
    console.error("❌ Lỗi Upload Supabase:", error)
  } else {
    console.log("🎉 Upload thành công Báo cáo FPT! ID:", data[0].id)
    console.log("Sếp đã có thể vào Discord và gõ lệnh: !fa FPT hoặc !coban FPT")
  }
}

uploadVVIA()
