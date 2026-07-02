const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function insertTCBPlan() {
  const artifactsDir = '/Users/tuananhnguyen/.gemini/antigravity-ide/brain/d28b4275-4a45-4dfb-87a8-a0e5667fb790';
  const files = fs.readdirSync(artifactsDir)
    .filter(f => f.startsWith('media__') && f.endsWith('.jpg'))
    .map(f => ({ name: f, time: fs.statSync(path.join(artifactsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
    
  if (files.length === 0) {
    console.error('Không tìm thấy file ảnh đồ thị nào!');
    return;
  }
  
  const imagePath = path.join(artifactsDir, files[0].name);
  console.log('Using latest image for TCB:', imagePath);

  const filePath = `charts/tcb-${Date.now()}.jpg`;
  console.log('Đang upload ảnh lên advisor-charts bucket...');
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('advisor-charts')
    .upload(filePath, fileBuffer, { contentType: 'image/jpeg', upsert: true });

  if (uploadError) {
    console.error('Lỗi khi upload ảnh:', uploadError);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploadData.path}`;
  console.log('✅ Upload ảnh thành công. Link:', publicUrl);

  const analystNote = `**1. Hành vi Giá & Khối lượng cụ thể**
- TCB đã thiết lập nhịp giảm kéo dài từ vùng đỉnh 180 ngày gần 37.4K về vùng đáy ngắn hạn quanh 30.8K – 31.0K. Tại vùng này, nguồn cung bắt đầu có tín hiệu cạn kiệt rõ rệt khi khối lượng giao dịch trung bình giảm sâu dưới mức 20 phiên.
- **Phiên ngày 23/06/2026**: Giá tạo một cây nến tăng mạnh (Close: 32,050 VND) đóng cửa tiệm cận đường SMA 20 ngày (31.6K) với **khối lượng bùng nổ đạt 28.2M cổ phiếu** (gấp gần 3 lần trung bình 20 phiên là 9.9M). Đây là phiên **xác nhận lực cầu chủ động (Buying Pivot)** đẩy giá thoát khỏi đường Trendline giảm phía trên của kênh giá song song.

**2. Tính đối xứng (Symmetry)**
- Nhịp giảm từ đỉnh 34K về 30.8K kéo dài khoảng 18 phiên với biên độ giảm xấp xỉ **9.4%**. Nhịp giảm này có tính chất đối xứng hoàn hảo với nhịp điều chỉnh hồi tháng 4 (biên độ giảm ~9.6% và diễn ra trong 16 phiên). 
- Do cấu trúc thời gian và biên độ điều chỉnh đã đạt mức bão hòa của nhịp giảm trước, việc xuất hiện phiên bùng nổ thanh khoản ngày 23/06 là tín hiệu xác nhận dòng tiền lớn chấp nhận hấp thụ cung ở vùng giá thấp để đảo chiều xu hướng.

**3. Đánh giá Nhóm ngành - Rủi ro phân cực**
- **Nhóm ngành**: Ngân hàng (Sector nhạy cảm với chu kỳ kinh tế và đang được hưởng lợi nhờ dòng tiền lớn luân chuyển).
- **Rủi ro phân cực / Mức độ rủi ro**: **Trung bình** (Nhờ nền tảng tài chính của TCB cực kỳ vững mạnh với CAR duy trì 15.2% và tỷ lệ bao phủ nợ xấu cao).
- **Độ tự tin (Conviction Level)**: **Cao** (Xác nhận dòng tiền lớn nổ Vol rất thuyết phục tại hỗ trợ).

**4. Trend Analyzer Matrix**
- Trục Xu hướng (Trend Score): 3/5
- Trục Dao động (Sideway Score): 4/5
- Matrix Evaluation: Vùng Tích lũy Tuyệt đối / Nén Đáy (PASS / Buy Trigger)`;

  const planPayload = {
    ticker: 'TCB',
    company_name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    strategy_name: 'Mua Breakout Hộp Tích Lũy Đáy & Retest Cản Ngang',
    entry_zone: '33.65 - 33.85',
    stop_loss: '31.55',
    take_profit: '41.00',
    risk_reward: '3.11',
    timeframe: 'Ngắn hạn (15 ngày)',
    conviction_level: 'High',
    max_position_pct: 10,
    is_confirmed: true,
    status: 'active',
    chart_image_url: publicUrl,
    analyst_note: analystNote
  };

  console.log('Đang Insert Plan TCB vào Database...');
  
  // Clean up any old active plans for TCB
  await supabase.from('trading_plans').delete().eq('ticker', 'TCB');

  const { data, error } = await supabase.from('trading_plans').insert(planPayload).select();
  
  if (error) {
    console.error('Lỗi khi insert TCB:', error);
  } else {
    console.log('✅ Đã insert thành công TCB Plan mới ID:', data[0].id);
  }
}

insertTCBPlan();
