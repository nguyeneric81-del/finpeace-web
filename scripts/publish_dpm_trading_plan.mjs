import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slooouceqcarcccryjyt.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function publishDpmPlan() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/1a347b1b-77ed-45e1-9d93-e2b5e461430f/.user_uploaded/media_1788489692750.jpg'
  
  if (!fs.existsSync(imagePath)) {
    console.error('Image not found at:', imagePath)
    process.exit(1)
  }

  const fileBuffer = fs.readFileSync(imagePath)
  const filename = `DPM_Inverse_HS_${Date.now()}.jpg`

  console.log('1. Đang tải ảnh đồ thị lên Supabase Storage (advisor-charts)...')
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) {
    console.error('Lỗi Upload Storage:', uploadError)
    process.exit(1)
  }

  const { data: publicUrlData } = supabase.storage
    .from('advisor-charts')
    .getPublicUrl(filename)

  const chartUrl = publicUrlData.publicUrl
  console.log('✅ Đã upload ảnh thành công! URL:', chartUrl)

  const analystNote = `### 1. Hành vi Giá & Khối lượng (Price Action & Volume)
* **Cấu trúc Vai Đầu Vai Ngược (Inverse Head & Shoulders):** DPM đã hoàn tất giai đoạn tích lũy tạo đáy 3 tháng qua với mô hình đảo chiều kinh điển:
  - *Vai trái (Left Shoulder):* Thiết lập đáy tại vùng 21.20 - 21.50 vào tháng 6/2026.
  - *Đầu (Head):* Nhịp rũ bỏ hoảng loạn cực đại xuyên thủng các hỗ trợ về 20.60 vào đầu tháng 7/2026.
  - *Vai phải (Right Shoulder):* Đáy sau nâng cao rõ rệt (Higher Low) tại vùng 21.80 - 22.00 vào tháng 8/2026, xác nhận áp lực cung đã cạn kiệt.
* **Khối lượng bùng nổ (Volume Confirmation):** Tại phiên bứt phá đường viền cổ (Neckline 23.00), khối lượng khớp lệnh vọt lên 309.35K đơn vị, đạt mức volume mua chủ động cao nhất trong hơn 2 tháng qua.
* **Thử thách SMA 200:** Giá đang tiệm cận và chuẩn bị xuyên phá đường SMA 200 ngày (vùng 23.56). Việc đóng nến trên SMA200 sẽ kích hoạt dòng tiền xu hướng trung dài hạn từ các quỹ tổ chức.
* **Động lượng RSI (14):** Đạt 62.47, bứt phá dốc đứng lên trên đường trung bình 52.33, xung lực tăng dồi dào và chưa chạm ngưỡng Quá mua (> 70).

### 2. Tính Đối Xứng (Symmetry)
* Biên độ nhịp hồi phục từ đáy Head lên đường Neckline là +2,250 đ (+10.96% trong 45 phiên).
* Theo nguyên lý Price-Time Symmetry, nhịp đẩy giá sau Breakout kỳ vọng sẽ đạt bước sóng tăng tối thiểu tương đương +2,250 đ (lên 25.30) và mở rộng mục tiêu đầy đủ tới 26.35 (+14.57%) trong vòng 45 - 65 phiên giao dịch tiếp theo.

### 3. Đánh Giá Nhóm Ngành & Động Lực Tăng Giá (Catalyst & Macro)
* **Chu kỳ tiêu thụ nông nghiệp:** Bước vào giai đoạn cao điểm phục vụ mùa vụ Đông Xuân cuối năm tại thị trường nội địa.
* **Xu hướng giá phân bón quốc tế:** Giá Ure/NPK thế giới có dấu hiệu tạo đáy trung hạn và hồi phục nhẹ.
* **Nền tảng tài chính an toàn:** DPM nắm giữ lượng tiền mặt dồi dào, không chịu rủi ro nợ vay tài chính và duy trì lịch sử trả cổ tức tiền mặt cao đều đặn, tạo bệ đỡ định giá an toàn trong mọi biến động thị trường.

### 4. Trend Analyzer Matrix
* Trục Xu hướng (Trend Score): 4/5
* Trục Dao động (Sideway Score): 2/5
* Matrix Evaluation: Trend [4/5] + Sideway [2/5] — Tín hiệu Bứt Phá Đảo Chiều Đáy / Breakout Tăng (PASS / Buy Trigger)`

  const catalystNote = 'Mô hình Vai Đầu Vai Ngược nổ vol xác nhận đảo chiều đáy; bước vào chu kỳ cao điểm gieo trồng vụ Đông Xuân và giá phân bón thế giới hồi phục.'

  console.log('2. Đang cập nhật Trading Plan vào bảng trading_plans...')
  
  const { data: updatedData, error: updateError } = await supabase
    .from('trading_plans')
    .update({
      company_name: 'Tổng Công ty Phân bón và Hóa chất Dầu khí - CTCP',
      sector: 'Hóa chất & Phân bón',
      strategy_name: 'Mô hình Vai Đầu Vai Ngược (Inverse Head & Shoulders Breakout)',
      timeframe: 'DAILY',
      entry_zone: '22.950 - 23.100',
      stop_loss: '21.850',
      take_profit: '26.350',
      support_price: 21850,
      resistance_price: 26350,
      risk_reward: '1:2.91',
      max_position_pct: 10,
      capital_allocation_pct: 10,
      expected_holding_days: 67,
      risk_level: 'Trung bình',
      conviction_level: 'Cao',
      analyst_note: analystNote,
      catalyst_note: catalystNote,
      chart_image_url: chartUrl,
      status: 'active',
      exec_status: 'waiting_buy',
      is_confirmed: true,
      exchange: 'HOSE',
      updated_at: new Date().toISOString()
    })
    .eq('id', '7c8d3495-a54a-4354-b3a3-6d61f906eb28')
    .select()

  if (updateError) {
    console.error('Lỗi Update DB:', updateError)
    process.exit(1)
  }

  console.log('✅ Đã cập nhật Trading Plan DPM thành công! Plan ID:', updatedData[0].id)
}

publishDpmPlan()
