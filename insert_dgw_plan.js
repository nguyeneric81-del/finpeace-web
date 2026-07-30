const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertDGWPlan() {
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
  const filePath = `charts/dgw-${Date.now()}${fileExt}`;
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
- DGW đã kết thúc chu kỳ giảm giá kéo dài từ đầu năm 2026. Trước đó giá đã đánh mất mốc hỗ trợ cứng ở 35.500đ - 36.000đ (hình chữ nhật màu xanh lam ở giữa) và trượt sâu về vùng quá bán quanh 31.450đ.
- **Tín hiệu đảo chiều & Breakout**: Phiên ngày 28/07 hình thành nến rút chân washout cực mạnh tại đáy 31.450đ. Phiên hôm nay (30/7) DGW tăng mạnh +3.82% lên 36.700đ, **chính thức phá vỡ đường xu hướng giảm trung hạn** (đường xu hướng màu xanh dương nối các đỉnh từ đầu năm).
- *Chiến lược Mua Retest*: Giá sau khi phá vỡ trendline giảm thường có xu hướng quay lại kiểm định (retest) vùng cản vừa vượt qua (quanh 35.500đ) kết hợp với đường cản ngang cũ nay trở thành hỗ trợ mới. Đây là điểm vào lệnh tối ưu và an toàn nhất.
- Chỉ báo RSI (14) đã tạo đáy thành công ở vùng 25 và hướng lên vùng trung tính 47.86, thể hiện dòng tiền đầu cơ đang quay trở lại nhóm bán lẻ.

**2. Tính đối xứng (Symmetry)**
- Độ chiết khấu ~45% từ đỉnh năm 2026 đã đưa DGW về vùng định giá rẻ đối xứng với nhịp tích lũy lớn giữa năm 2025. Nhịp rũ bỏ washout ngày 28/07 loại bỏ hoàn toàn các nhà đầu cơ đu bám cuối cùng trước khi giá thiết lập sóng tăng hồi phục.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- *Động lực tăng giá (Catalyst)*: Nhóm bán lẻ công nghệ (ICT) bước vào mùa cao điểm mua sắm (Back-to-school) trong Q3 và Q4. Nhu cầu lên đời điện thoại và laptop học sinh/sinh viên sẽ giúp kết quả kinh doanh của DGW hồi phục rõ nét.
- *Rủi ro*: Sức mua yếu do tình hình kinh tế chung chậm hồi phục. Tuy nhiên điểm stop loss chặt chẽ ngay dưới 32.900đ sẽ bảo vệ an toàn cho vị thế.

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 1/5
- Trục Dao động (Sideway Score): 5/5
- Matrix Evaluation: Mua khi Retest xu hướng / Breakout Reversal (PASS / Buy Thăm dò khi retest)`;

  const planPayload = {
    ticker: 'DGW',
    company_name: 'CTCP Thế giới Số (DGW)',
    strategy_name: 'Mua khi Retest xu hướng / Breakout Reversal',
    entry_zone: '35.00 - 36.70',
    stop_loss: '32.90',
    take_profit: '42.20',
    risk_reward: '2.58',
    timeframe: 'Trung hạn (45 - 60 ngày)',
    conviction_level: 'Normal',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: markdownNote,
    sector: 'Bán lẻ',
    risk_level: 'Trung bình',
    catalyst_note: 'Mùa cao điểm mua sắm Back-to-school Q3 và nâng cấp thiết bị điện tử cuối năm.',
    expected_holding_days: 60,
    capital_allocation_pct: 10
  };

  console.log('Đang Insert Plan DGW vào Database...');
  
  // Xoá plan cũ của DGW nếu có
  await supabase.from('trading_plans').delete().eq('ticker', 'DGW');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert DGW:', error);
  } else {
    console.log('✅ Đã insert thành công DGW Plan mới:', data[0].id);
  }
}

insertDGWPlan();
