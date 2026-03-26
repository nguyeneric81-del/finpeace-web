const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadPlan() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774451864186.png';
  const fileName = `hpg_plan_${Date.now()}.png`;

  console.log('Uploading image...');
  const fileBuffer = fs.readFileSync(imagePath);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png'
    });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return;
  }

  const { data: urlData } = supabase.storage
    .from('advisor-charts')
    .getPublicUrl(fileName);
    
  const publicUrl = urlData.publicUrl;
  console.log('Image uploaded:', publicUrl);

  const analystNote = `# 📉 TRADING PLAN HPG - BƯỚC VÀO PHA ĐẨY GIÁ (MARKUP)

**1. Hành vi Giá & Khối lượng cụ thể:**
- **Cấu trúc hiện tại:** HPG đang vận động trong một biên độ Sideway tích lũy hẹp (hộp vàng) ngay dưới vùng kháng cự 26.8. Việc giữ được nền giá 25.x với khối lượng cạn kiệt cho thấy áp lực cung đã suy yếu đáng kể và phe Mua đang gom hàng chủ động ở ngưỡng trên đường MA50.
- **Tín hiệu kích hoạt (Trigger):** Việc bứt phá dứt khoát qua ngưỡng **26.8** sẽ xác nhận HPG chính thức thoát khỏi vùng giằng co tích lũy, kích hoạt Pha Đẩy Giá (Markup Phase).

**2. Tính đối xứng (Symmetry):**
- **Nhịp tăng trước:** Nhịp tăng từ nền giá thấp gần nhất (như mũi tên xanh trên hình) cho thấy HPG có thói quen chạy một chuỗi sóng mở rộng rất bền bỉ, dứt khoát nếu được khơi mào. 
- **Kỳ vọng đối xứng:** Nếu phe Mua xác nhận thanh khoản bứt phá vùng 26.8, kịch bản lặp lại biến độ tăng (Symmetry Movement) sẽ tịnh tiến HPG thẳng về vùng cung cũ của đợt phân phối trước đó, chính là ngưỡng (29.5 - 29.6).

**3. Đánh giá Nhóm ngành - Rủi ro phân cực:**
- **Nhóm ngành (Sector):** Thép / Xây dựng nguyên liệu (Cơ bản vững vàng, kỳ vọng phục hồi biên lợi nhuận lõi năm nay).
- **Mức độ Rủi ro (Risk Level):** Thấp (Mã bluechip có thanh khoản thuộc hàng sâu nhất thị trường, độ trễ và biến động được kiểm soát rất tốt).
- **Độ tự tin (Conviction Level):** Cao (Cấu trúc Set-up nén chặt, tỷ lệ rũ bỏ (shake-out) thấp giúp hạn chế nhiễu).`;

  console.log('Archiving old HPG plans...');
  await supabase.from('trading_plans').update({ status: 'archived' }).eq('ticker', 'HPG');

  console.log('Upserting into trading_plans...');
  const { error: insertError } = await supabase
    .from('trading_plans')
    .upsert({
      ticker: 'HPG',
      company_name: 'Tập đoàn Hòa Phát',
      strategy_name: 'Breakout Kháng cự nền (Markup Phase)',
      timeframe: '1D',
      sector: 'Thép',
      risk_level: 'Thấp',
      conviction_level: 'Cao',
      catalyst_note: 'Kỳ vọng chu kỳ giá nguyên liệu chạm đáy phục hồi và sóng đầu tư công nội địa.',
      expected_holding_days: 35, // ~5 weeks
      max_position_pct: 10,
      analyst_note: analystNote,
      status: 'active',
      is_confirmed: false,
      chart_image_url: publicUrl,
      entry_zone: '> 26.8',
      stop_loss: '25.15',
      take_profit: '29.58',
      risk_reward: '1.68'
    }, { onConflict: 'ticker' });

  if (insertError) {
    console.error('Insert Error:', insertError);
  } else {
    console.log('Success! Trading plan for HPG published.');
  }
}

uploadPlan();
