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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/a47d43cf-0f8f-4a7d-b989-91a6e19c6abc/media__1775744606346.png'
  const fileBuffer = fs.readFileSync(imagePath)
  const filename = `TV2_Trend_${Date.now()}.png`

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

  const analystNote = `### 1. Hành vi Giá & Khối lượng
TV2 đang có sự điều tiết cực kỳ an toàn tại vùng hỗ trợ cứng \`36.00 - 37.00\`. Mặc dù đã có các nhịp test xuống vùng đáy của hộp Sideway hiện tại, lực bán gần như không xuất hiện rõ rệt (Volume cạn kiệt, chỉ bằng một nửa thông thường). Sự chối từ giảm giá (Rejection) khi chạm cạnh dưới cho thấy Smart Money đang đỡ cung cực tốt. Việc giá neo lại trên MA20 (37.1) là một tín hiệu sống lại của động lượng ngắn hạn.

### 2. Tính Đối Xứng (Symmetry)
Nếu xét hệ quy chiếu với nhịp tăng trưởng trước đó, TV2 đang trải qua nhịp nén và thoái lui mang tính thanh lọc (correction). Quỹ đạo nén này tương đương với nhịp Sideway hộp phía trước đó (vùng màu tím trước đợt Rally rũ). Tính đối xứng củng cố xác suất đây là một cái bệ phóng (Launchpad) thứ 2 để đi lên đỉnh mục tiêu \`42.x\` chứ không phải cấu trúc phân phối.

### 3. Đánh giá Tọa độ & Rủi ro
*   **Hệ trục Tọa độ FinPeace:** Trend [1] + Sideway [5] -> Xác nhận trạng thái **Nén Đáy**.
*   Các chỉ báo xung lượng (RSI) đang nằm vùng tiệm cận 48, cực kỳ thoáng đãng để tạo đà bứt phá mà không gặp tình trạng Overbought. Tỷ lệ Risk/Reward cho Deal này là vô cùng triển vọng (cắt lỗ ngắn ở 34.9, chốt lời dài ở 42).`

  console.log('Inserting Trading Plan into Database...')
  const { data, error } = await supabase.from('trading_plans').insert({
    ticker: 'TV2',
    company_name: 'Tư Vấn Xây Dựng Điện 2',
    sector: 'Xây dựng Công nghiệp / Năng lượng',
    strategy_name: 'Vùng Tích lũy Tuyệt đối / Nén Đáy (Nền số 2)',
    timeframe: 'DAILY',
    entry_zone: '36.50 - 37.50',
    stop_loss: 34.96,
    take_profit: 42.17,
    risk_reward: 2.57,
    risk_level: 'trung_binh',
    conviction_level: 'cao',
    analyst_note: analystNote,
    catalyst_note: 'Đón sóng hạ tầng điện và giải ngân đầu tư mảng năng lượng.',
    chart_image_url: chartUrl,
    expected_holding_days: 20,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    is_confirmed: true
  }).select()

  if (error) {
    console.error('DB Insert Error:', error)
    process.exit(1)
  }

  console.log('Inserted TV2 Trading Plan successfully! Row ID:', data[0].id)
}

uploadAndPushPlan()
