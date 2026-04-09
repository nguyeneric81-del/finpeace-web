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
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/a47d43cf-0f8f-4a7d-b989-91a6e19c6abc/media__1775746268341.png'
  const fileBuffer = fs.readFileSync(imagePath)
  const filename = `CSV_Trend_${Date.now()}.png`

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
CSV đang cho thấy hành vi ép nén cạn cung kinh điển tại cạnh dưới của Trading Range khổng lồ. Mức thanh khoản lèo tèo hiện tại (khoảng 493K, thấp hơn gần một nửa so với trung bình 20 phiên) chứng minh rằng lượng cung trôi nổi đã cạn kiệt, phe Bán (Bears) không còn muốn bán đuổi ở mức định giá này. Đây là vùng "đất lành" (Sweet spot) lý tưởng để Smart Money lặng lẽ thiết lập vị thế. 

### 2. Tính Đối Xứng (Symmetry)
Nhìn sang nửa Trái màn hình, nhịp tăng giá khốc liệt (Rally) trước đó được đánh dấu bằng mũi tên xanh dốc ngược. Mô hình hiện tại là sự giải phóng Áp lực (correction) và tái thiết lập (Re-accumulation) đối xứng thời gian với toàn bộ con sóng Tăng. Nếu lịch sử lặp lại, khi phe Mua tái chiếm ưu thế, lực nén của hộp tím này sẽ đẩy giá bật một lèo về mục tiêu \`34.x\` ở cạnh trên, giống với tính chu kỳ bật - nén của một cái lò xo.

### 3. Hệ trục tọa độ Point-Scoring & Rủi ro
*   **Trục Trend (0/5):** Bị gãy trend ngắn hạn khi rơi từ đỉnh 34 nên mọi chỉ báo (MA/MACD) đều tiêu cực.
*   **Trục Sideway (4/5):** RSI ở vùng quá bán dội lên, Bollinger Bands bó hẹp và giá phản ứng tích cực tại đường băng dưới (Lower band), tín hiệu phân kỳ ngầm.
*   **Kết luận:** Phương pháp *Nén đáy* phát huy tối đa công năng khi R:R đạt **3.46**. Đặt lệnh Cắt lỗ tại 25.5 hoàn toàn an toàn do được nền tảng tích luỹ của nhiều tổ chức trước đó bảo vệ.`

  console.log('Inserting Trading Plan into Database...')
  const { data, error } = await supabase.from('trading_plans').insert({
    ticker: 'CSV',
    company_name: 'Hóa chất Cơ bản Miền Nam',
    sector: 'Hóa chất / Vật liệu cơ bản',
    strategy_name: 'Vùng Tích lũy Tuyệt đối / Nén Đáy (Chân nền lớn)',
    timeframe: 'DAILY',
    entry_zone: '26.80 - 27.80',
    stop_loss: 25.52,
    take_profit: 34.01,
    risk_reward: 3.46,
    risk_level: 'trung_binh',
    conviction_level: 'cao',
    analyst_note: analystNote,
    catalyst_note: 'Chờ đợi chu kỳ nhóm hóa chất phục hồi cùng nền giá ép cung kịch kim.',
    chart_image_url: chartUrl,
    expected_holding_days: 30,
    capital_allocation_pct: 10,
    status: 'active',
    exec_status: 'waiting_buy',
    is_confirmed: true
  }).select()

  if (error) {
    console.error('DB Insert Error:', error)
    process.exit(1)
  }

  console.log('Inserted CSV Trading Plan successfully! Row ID:', data[0].id)
}

uploadAndPushPlan()
