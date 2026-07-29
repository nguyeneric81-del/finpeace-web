const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertHPGPlan() {
  const artifactsDir = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/ccbbd93f-3dd7-4163-a228-9c10c1ffd4fd';
  const files = fs.readdirSync(artifactsDir)
    .filter(f => f.startsWith('media__') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')))
    .map(f => ({ name: f, time: fs.statSync(path.join(artifactsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
    
  if (files.length === 0) {
    console.error('Không tìm thấy file ảnh nào!');
    return;
  }
  
  const imagePath = path.join(artifactsDir, files[0].name);
  console.log('Using latest image:', imagePath);

  const fileExt = path.extname(imagePath);
  const filePath = `charts/hpg-${Date.now()}${fileExt}`;
  console.log('Đang upload ảnh lên bucket advisor-charts...');
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filePath, fileBuffer, { contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png', upsert: true });

  if (uploadError) {
    console.error('Lỗi khi upload ảnh:', uploadError);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploadData.path}`;
  console.log('✅ Upload ảnh thành công. Link:', publicUrl);

  const markdownNote = `**1. Hành vi Giá & Khối lượng cụ thể**
- HPG đang chịu áp lực đè giá trung hạn từ đỉnh 28.000đ xuống và đang giao dịch dưới đường SMA200 (quanh 23.910đ).
- **Tín hiệu đảo chiều**: Giá đã tìm thấy lực đỡ rất tốt khi test lại vùng hỗ trợ lịch sử quanh **20.000đ - 20.500đ**. Tại đây, HPG hình thành cấu trúc nêm giảm nhỏ (falling wedge) với 3 lần chối từ giảm (rejection) rất rõ nét vào các ngày 23/7, 28/7 và đặc biệt là phiên hôm nay (29/7) với nến xanh tăng mạnh hướng lên mốc 21.550đ, đi kèm thanh khoản cải thiện đáng kể (hơn 29.6 triệu cổ phiếu).
- Động lượng RSI (14) hồi phục mạnh mẽ từ vùng quá bán sâu (đạt 42.73) và đã chính thức **breakout kênh xu hướng giảm ngắn hạn của RSI** (đường xu hướng màu xanh dương vẽ trong pane RSI).

**2. Tính đối xứng (Symmetry)**
- Biên độ điều chỉnh từ đỉnh về vùng 20.000đ là ~28%. Nhịp rơi này đối xứng hoàn hảo với các cú điều chỉnh mang tính chu kỳ tích lũy trước đây của HPG trước khi bước vào sóng tăng mới. Việc giữ vững được mốc 20.100đ xác nhận vùng giá trị hấp dẫn kích hoạt lực cầu tổ chức.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: Kỳ vọng sản lượng thép phục hồi trong các quý cuối năm nhờ giải ngân đầu tư công và thị trường bất động sản ấm dần lên. Dự án Dung Quất 2 đi vào hoạt động sẽ là cú hích doanh thu dài hạn.
- *Rủi ro*: Giá thép thế giới biến động bất lợi hoặc đà bán ròng của khối ngoại. Tuy nhiên, điểm dừng lỗ chặt chẽ ngay dưới 20.050đ giúp giảm thiểu tối đa rủi ro cho tài khoản.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Thăm dò tại nền)`;

  const planPayload = {
    ticker: 'HPG',
    company_name: 'Tập đoàn Hòa Phát (HPG)',
    strategy_name: 'Mua đảo chiều từ nêm giảm tại hỗ trợ lịch sử',
    entry_zone: '21.00 - 21.55',
    stop_loss: '20.05',
    take_profit: '24.60',
    risk_reward: '2.14',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Thép / Vật liệu xây dựng',
    risk_level: 'Trung bình',
    catalyst_note: 'Sản lượng phục hồi nửa cuối năm, dự án Dung Quất 2 đi vào hoạt động.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan HPG vào Database...');
  
  // Xoá plan cũ của HPG nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'HPG');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert HPG:', error);
  } else {
    console.log('✅ Đã insert thành công HPG Plan mới:', data[0].id);
  }
}

insertHPGPlan();
