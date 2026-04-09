import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function uploadAndPushPlan() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/a47d43cf-0f8f-4a7d-b989-91a6e19c6abc/media__1775746675429.png'
  const fileBuffer = fs.readFileSync(imagePath)
  const filename = `DXG_Trend_${Date.now()}.png`

  console.log('Uploading image to Supabase Storage (advisor-charts)...')
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filename, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    })

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('advisor-charts')
    .getPublicUrl(filename)
    
  const chartUrl = publicUrlData.publicUrl
  console.log('Image uploaded! URL:', chartUrl)

  const analystNote = `### 1. Hành vi Giá & Khối lượng (Price Action & Volume)
Cấu trúc Sideway rộng thênh thang của DXG vừa trải qua một đợt Spring (Rũ cạn cung) cực khắt khe xuống vòng 12.8 - 12.9. Hành vi giá xoay trục với đỉnh điểm là 2 phiên nổ Vol khổng lồ đã thổi bùng động lượng, giúp DXG đâm xuyên dứt khoát qua cụm MA20 và MA50. Khối lượng này kích hoạt pha sang tay mạnh mẽ: Hàng trôi nổi của nđt yếu vía đã được Smart Money gom trọn.

### 2. Tính Đối Xứng (Symmetry)
Nửa bên trái đồ thị, chúng ta ghi nhận một con sóng tăng trưởng thốc (đẩy giá) tạo góc chữ V đẹp mắt. Hộp tích lũy màu tím hiện tại là pha Consolidation đi ngang với đỉnh thấp dần để ru ngủ phe Cầm Tiền. Cú giật râu tại đáy 12.8 phá vỡ hoàn toàn trạng thái ngủ gật. Nhịp Spring bật lên từ đây sẽ sao chép tốc độ của đường chéo dốc trước đó, mục tiêu càn quét kháng cự 17.9x.

### 3. Chiến thuật Retest & Quản trị Rủi ro
Thay vì mua đuổi trong nếp nổ Volume đang fomo trên vùng giá 14.8, chiến lược lùi Entry về \`13.5 - 14.5\` tận dụng tối đa nhịp nghỉ (Breathing Space) của cổ phiếu sau cây Breakout. Đội tạo lập thường có thói quen Watch-Out test lại nguồn cung nhỏ lẻ trước khi đánh chìm cản chéo. Điểm gom rải rác quanh MA20 ép rủi ro cắt lỗ xuống chỉ còn \`-7.2%\`, mở ra mức tỷ lệ R:R vô cùng hoàn hảo là **3.88**.

### 4. Hệ trục tọa độ Point-Scoring (Trend vs Sideway)
**Trục 1: Nhóm Trend (Động lượng Xu hướng) - Điểm: 4/5**
1. Cắt MA: [1] Vượt đỉnh MA20 & MA50. 2. Momentum: [1] Lực đẩy Vol khổng lồ, gia tốc cao. 3. MACD: [1] Cắt lên xanh dương. 4. Parabolic SAR: [1] Lật sang kênh hỗ trợ.
**Trục 2: Nhóm Sideway (Độ nén/Dao động) - Điểm: 2/5**
1. RSI: [1] Đạt mốc dư địa hoàn hảo quanh 60. 2. Channel Breakout: [1] Đánh lật điểm Spring ở kênh dưới.
-> **Kết luận:** \`Trend [4] + Sideway [2]\` -> Xác nhận Khởi nguồn Tín hiệu Breakout Tăng / Cơn lốc Dòng Tiền.`

  console.log('Inserting Trading Plan into Database...')
  const { data, error } = await supabase.from('trading_plans').insert({
    ticker: 'DXG',
    company_name: 'Đất Xanh Group',
    sector: 'Bất động sản / Real Estate',
    strategy_name: 'Breakout Tăng / Retest MA20',
    timeframe: 'DAILY',
    entry_zone: '13.50 - 14.50',
    stop_loss: 12.98,
    take_profit: 17.96,
    risk_reward: 3.88,
    risk_level: 'trung_binh',
    conviction_level: 'cao',
    analyst_note: analystNote,
    catalyst_note: 'Dòng tiền đầu cơ cực mạnh đánh thoát đáy chu kỳ tích lũy.',
    chart_image_url: chartUrl,
    expected_holding_days: 35,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    is_confirmed: true
  }).select()

  if (error) {
    console.error('DB Insert Error:', error)
    process.exit(1)
  }

  console.log('Inserted DXG Trading Plan successfully! Row ID:', data[0].id)
}

uploadAndPushPlan()
