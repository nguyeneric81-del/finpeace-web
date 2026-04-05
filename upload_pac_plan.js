const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://slooouceqcarcccryjyt.supabase.co';
const supabaseKey = 'sb_secret_Xr5mJStvMoCqBLU2_5qhow_chvFxoMc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/aacb35c7-bc2f-49a5-a77f-3fa04d020a71/media__1775185442467.png';
  const fileBuffer = fs.readFileSync(imagePath);
  const fileName = `PAC_trend_${Date.now()}.png`;

  console.log('Uploading image...');
  const { data, error } = await supabase.storage
    .from('advisor-charts')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    console.error('Upload Error:', error);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('advisor-charts')
    .getPublicUrl(fileName);
    
  const publicUrl = publicUrlData.publicUrl;
  console.log('Uploaded Chart URL:', publicUrl);

  const analystNote = `**1. Hành vi Giá & Khối lượng (Price Action & Volume)**\nPAC đang đi đến điểm cuối của một pha Sideway (Volatility Contraction) khổng lồ kéo dài từ giữa năm 2024. Đáng chú ý nhất là điểm nổ Volume lịch sử dội vào liên tục giai đoạn cuối tháng 3/2026 (các phiên 24/3 đến 27/3 với KL khớp từ 1.5M - 2.5M cổ phiếu/phiên so với mức TB chỉ quanh 1M). Hành động giá bứt vỡ Trendline chéo (đường màu vàng) đi kèm khối lượng đột biến là tín hiệu rõ ràng của dòng tiền Tạo lập (Smart Money) vừa nhập cuộc để chuẩn bị kéo nhịp mới. Phiên gần nhất giá điều chỉnh đi ngang với thanh khoản cạn kiệt cho thấy lực chốt lời T+ rất yếu, mở ra điểm mua re-test hoàn hảo.\n\n**2. Tính đối xứng (Symmetry)**\nLịch sử đồ thị PAC thể hiện bản chất nhịp điệu cực mạnh. Nhịp Markup gần nhất (Đầu 2024) cổ phiếu đánh thốc từ vùng tích lũy 16.x lên tận đỉnh 36.x (Tăng hơn 100% trong khung thời gian ngắn). Hiện tại, quá trình gom hàng hơn 6 tháng trong chiếc "Hộp Darvas" (biên 21-28) đã hoàn tất. Tính đối xứng (Symmetry - Mũi tên xanh lá) cho thấy từ điểm bứt nền 25 hiện tại, cổ phiếu dư sức tái lập một nhịp đẩy tương tự nhắm về đỉnh thời đại 32.x - 36.x.\n\n**3. Đánh giá Nhóm ngành - Rủi ro phân cực**\nTrong bối cảnh thị trường Vĩ mô đang bị nhiễu động bởi Bank/Chứng/Thép (ảnh hưởng vĩ mô tỷ giá, FED), một cổ phiếu ngách sản xuất thực như PAC trở thành nơi trú ẩn an toàn và hút dòng tiền đầu cơ. Dòng tiền đã bị "nhốt" ở đây hoàn toàn là dòng tiền đánh gối đầu mảng Sản xuất thay vì dòng tiền F0.\n\n---\n**Hệ thống Trục Tọa độ Xu hướng (Trend vs Sideway Scoring):**\n📌 **Trend Score:** 4/5 (Volume nổ xác nhận xu hướng, nến đè trên MA20/MA50, động lượng mạnh thoát nền).\n📌 **Sideway Score:** 4/5 (Breakout Darvas Box thành công, tạo mô hình cờ đuôi nheo cạn cung sau break).\n=> **Kết luận Radar:** \`[Tín hiệu Breakout Tăng / Siêu Vuốt Xu Hướng]\`. Trạng thái: **PASS (BUY)** múc mạnh tay nền giá 25.x này.`;

  const tradingPlan = {
    ticker: 'PAC',
    company_name: 'Pin Ắc Quy miền Nam',
    strategy_name: 'Breakout Darvas Box',
    timeframe: '20 - 45 ngày',
    entry_zone: '25.00 - 25.50',
    stop_loss: '24.06 (-5.5%)',
    take_profit: '32.42 (+27.3%)',
    risk_reward: '4.97',
    max_position_pct: '10',
    analyst_note: analystNote,
    sector: 'Công nghiệp',
    risk_level: 'Thấp',
    conviction_level: 'Cao',
    catalyst_note: 'Dòng tiền đột biến sau nén chặt biên dài, KQKD duy trì ổn định làm hầm trú ẩn.',
    expected_holding_days: 30,
    capital_allocation_pct: 10,
    status: 'active',
    chart_image_url: publicUrl
  };

  console.log('Inserting into trading_plans...');
  const { data: dbData, error: dbError } = await supabase
    .from('trading_plans')
    .upsert(tradingPlan, { onConflict: 'ticker' });

  if (dbError) {
    console.error('DB Error:', dbError);
  } else {
    console.log('Success! Saved Trading Plan for PAC.');
  }
}
run();
