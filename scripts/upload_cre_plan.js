const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Init Supabase Service Role client to bypass RLS if any
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Thiếu biến môi trường Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/ad01f8d1-9fdf-40d7-9763-8b57f886329a/media__1774758518285.png';
  const fileName = `CRE_${Date.now()}.png`;
  
  // 1. Upload ảnh
  console.log('Đang upload ảnh lên Supabase Storage...');
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    console.log('! Lỗi Upload Storage, tạo bucket nếu chưa có...');
    // Thử tạo bucket nếu chưa tồn tại
    await supabase.storage.createBucket('advisor-charts', { public: true });
    // Retry upload
    const retry = await supabase.storage.from('advisor-charts').upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });
    if (retry.error) {
       console.error('Lỗi upload sau retry:', retry.error);
       return;
    }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('advisor-charts')
    .getPublicUrl(fileName);

  console.log('✅ Upload ảnh thành công:', publicUrl);

  const analystNote = `## Tóm tắt Cấu trúc & Tọa độ
- **Cấu trúc vĩ mô**: **Sideway Tích Luỹ (Hộp Darvas lớn)**. Giá dao động kẹp giữa hai vùng Hỗ trợ (6.00 - 6.50) và Kháng cự (9.50 - 10.00) chạy ngang từ 2023 đến nay.
- **Tọa độ chấm điểm**: Trạng thái **Nén Đáy -> Chuyển giao Breakout**. Phe Mua đã đoạt lại quyền kiểm soát tại cận dưới của hộp.

## 1. Hành vi Giá & Khối lượng (Price Action & Volume)
- **Hành vi Giá**: CRE vừa trải qua một đợt rũ bỏ (markdown) bào mòn từ đỉnh hộp về sát đáy hộp. Giai đoạn tạo đáy diễn ra dưới 7.00 với Vol cạn kiệt. Phiên bứt phá ngày 27/03/2026 đóng nến trần (+6.99%) tại mức 7.65, đâm xuyên qua cụm MA20 (7.13) và MA50 (7.47), xác nhận xu hướng giảm ngắn hạn đã kết thúc.
- **Hành vi Khối lượng**: Khối lượng khớp lệnh nổ tung lên 909.7K cổ phiếu (gấp 4 lần trung bình 20 phiên là 233K). Dòng tiền tạo lập (Smart money) đã bắt đầu để lại dấu chân gom hàng quyết liệt tại vùng cản này.

## 2. Phân tích Tính Đối Xứng (Symmetry)
- Nhịp điều chỉnh giảm từ biên trên (9.58) xuống biên dưới (6.42) đã triệt tiêu hoàn toàn động lượng bán. Trong quá khứ các nhịp bật tại biên dưới (vùng giá 6.x) của CRE đều mở ra các nhịp tăng kéo dài 2-3 tháng vươn thẳng lên vùng cản tử thần 9.5x - 10.00. Sự đối xứng nhịp đập của hộp tích lũy ủng hộ phe Long.

## 3. Cấu trúc Phân cực (Sector & Risk)
- **Nhóm ngành Sector**: Bất động sản (Midcap / Dịch vụ môi giới).
- **Risk Level (Rủi ro)**: Thấp - Trung Bình. Entry hiện tại khá sát nệm đỡ vững chắc của hộp Sideway bền vững hơn 2 năm, xuất suất đánh thủng là rất thấp.
- **Conviction (Độ tự tin)**: Cao. Cấu trúc R/R thỏa mãn tuyệt đối nguyên tắc đánh biên Sideway tỷ lệ 1:2.
- **Catalyst kì vọng**: Dòng tiền đầu cơ dịch chuyển tìm chiết khấu sâu ở nhóm Bất động sản đi kèm thanh khoản thị trường địa ốc ấm lên cuối chu kỳ lãi suất thấp.`;

  // 2. Insert Database
  console.log('Đang Insert Trading Plan record...');
  const newPlan = {
    ticker: 'CRE',
    company_name: 'Bất động sản Thế Kỷ (CRE) - HOSE',
    strategy_name: 'Breakout Nén Đáy / Đánh Biên Sideway',
    timeframe: 'Trung hạn (45 ngày)',
    entry_zone: '7.40 - 7.65',
    stop_loss: '6.42',
    take_profit: '9.58',
    risk_reward: '1:2',
    max_position_pct: 10,
    analyst_note: analystNote,
    chart_image_url: publicUrl,
    status: 'active'
  };

  // Do UPSERT in case it already exists (to prevent duplicate errors and update existing CRE plan)
  const { data: dbData, error: dbError } = await supabase
    .from('trading_plans')
    .upsert(newPlan, { onConflict: 'ticker' })
    .select();

  if (dbError) {
    if (dbError.code === 'PGRST116' || dbError.code === '23505') {
       console.log('Warning on Upsert, trying root insert without upsert explicitly');
       const { error: insertErr } = await supabase.from('trading_plans').insert(newPlan);
       if(insertErr) console.error(insertErr);
       else console.log('✅ Inserted Successfully.');
    } else {
       console.error('❌ Lỗi khi insert Trading Plan:', dbError);
    }
  } else {
    console.log('✅ Lưu Trading Plan thành công!', dbData?.[0]?.ticker);
  }
}

main();
