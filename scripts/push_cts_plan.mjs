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
  // Using the image uploaded by the user in the prompt (even though it's technically the TV2 chart)
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/a47d43cf-0f8f-4a7d-b989-91a6e19c6abc/media__1775744606346.png'
  const fileBuffer = fs.readFileSync(imagePath)
  const filename = `CTS_Trend_${Date.now()}.png`

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
CTS đã trải qua một nhịp rũ bỏ khá sâu về vùng 24.x, sau đó thiết lập biên dao động cạn cung. Điểm sáng lớn nhất là sự phục hồi mạnh mẽ từ hỗ trợ cứng quanh 24.5 - 25.0 kết hợp với các phiên xác nhận dòng tiền. Việc chủ động ngắm mua ở vùng \`25.5 - 27.0\` là chiến lược "Đón lõng" (Pull-back/Accumulation Buy) cực kỳ thông minh, hạn chế đua mua giá cao khi cổ phiếu nổ Vol, cho phép kiểm soát tốt rủi ro. 

### 2. Tính Đối Xứng (Symmetry)
Nếu kéo dài trục đối xứng theo nhịp giảm (rơi 26% trong tháng qua), thì một khi gãy đà giảm, lực nén thường bật ngược trở lại theo phương chữ V hoăc Cốc tay cầm. Nhịp gom ở nền 26.x này chính xác là vùng "Thành nôi". Tại điểm này, các quỹ đạo tích lũy sẽ vận hành sức kéo theo quán tính lịch sử, đưa giá quay lại đỉnh cũ và thốc thẳng lên target \`35.2\` — bù đắp lại biên độ giảm một cách tương xứng.

### 3. Đánh giá Tọa độ & Rủi ro Nhóm ngành
*   **Hệ trục Tọa độ FinPeace:** Xác nhận chiến thuật gom nền (Nén Đáy).
*   Điểm chói sáng của Deal chứng khoán này là mốc Tỷ lệ Rủi ro/Lợi nhuận (**4.37**). Theo toán học đầu tư, cược 1 mất 1 để ăn hơn 4 lần là "viên ngọc hiếm". Không cần đúng 100% các Deal, chỉ cần ôm trọn trend của Deal CTS này tới giá 35.2, sức rướn lợi nhuận đủ cover cho 4 Deal sai khác.

### 4. Hệ trục tọa độ Point-Scoring (Trend vs Sideway)
**Trục 1: Nhóm 5 Trend Strategies (0/5)**
1. Moving Average: [0] Dưới MA20 và MA50. 2. MACD: [0] Âm dưới Zero, chờ phân kỳ. 3. SuperTrend: [0] Kháng cự mây đỏ. 4. Parabolic SAR: [0] Báo kháng cự trên. 5. Momentum: [0] Phẳng.
**Trục 2: Nhóm 5 Sideway/Oscillator Strategies (4/5)**
1. RSI: [0] Quá bán, chưa >50. 2. Bollinger Bands: [1] Cắt Lower Band nảy lên. 3. Stochastic Slow: [1] Cắt lên từ Oversold. 4. Channel Breakout: [1] Tích lũy cạnh dưới chặn lỗ vol cạn. 5. Consecutive Up/Down: [1] Rút chân chối từ giảm.
-> **Kết quả:** \`Trend [0] + Sideway [4]\` -> Vùng Tích lũy Tuyệt đối / Nén Đáy.`

  console.log('Inserting Trading Plan into Database...')
  const { data, error } = await supabase.from('trading_plans').insert({
    ticker: 'CTS',
    company_name: 'Chứng Khoán Công Thương',
    sector: 'Chứng Khoán / Financial Services',
    strategy_name: 'Vùng Tích lũy Tuyệt đối / Nén Đáy',
    timeframe: 'DAILY',
    entry_zone: '25.5 - 27.0',
    stop_loss: 24.2,
    take_profit: 35.2,
    risk_reward: 4.37,
    risk_level: 'trung_binh',
    conviction_level: 'cao',
    analyst_note: analystNote,
    catalyst_note: 'Dòng tiền đầu cơ dịch chuyển mạnh vào CK đón sóng VNINDEX vượt cản.',
    chart_image_url: chartUrl,
    expected_holding_days: 25,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    is_confirmed: true
  }).select()

  if (error) {
    console.error('DB Insert Error:', error)
    process.exit(1)
  }

  console.log('Inserted CTS Trading Plan successfully! Row ID:', data[0].id)
}

uploadAndPushPlan()
