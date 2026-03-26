require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'VPB',
      company_name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
      strategy_name: 'Trend Following / Chờ Xác Nhận Cầu Vào Xoay Chiều',
      timeframe: 'Trung hạn (60 - 90 ngày)',
      entry_zone: '26.50 - 27.00 (Vùng mua tùy chỉnh chờ xác nhận nhịp Rebound)',
      stop_loss: '23.42 (-12.45%)',
      take_profit: '30.98 (+15.81%)',
      risk_reward: 1.27,
      max_position_pct: 10,
      indicators: ['Test đỉnh hộp cũ 4 năm', 'Dòng tiền 31 triệu cổ nhúng nảy hộp'],
      entry_criteria: [
        'Không mua mù ở giá hiện tại 25.x',
        'Chỉ kích hoạt Vị thế 10% NAV khi giá hồi về và break qua vùng cản mỏng 26.50'
      ],
      exit_criteria: [
        'Cắt máu dứt khoát nếu thủng hỗ trợ sâu 23.42',
        'Canh chốt từng phần khi tiến về lại đỉnh cũ 30.x'
      ],
      analyst_note: 'Hành vi Giá & Khối lượng: Một pha ép hàng quá kinh khủng tại mốc 24.0. Phiên rớt 23/03 khiến nến đâm thủng 24, nhưng ngay sau đó (24/03), dòng tiền khổng lồ lên tới 31.3 triệu cổ phiếu đã nhảy vào hốt trọn ổ, đẩy giá giật ngược lên 25.25. Đây là bằng chứng đanh thép cho thấy phe Cầm Tiền đang nằm chầu chực ở dưới nắp hộp để bắt đáy. Dẫu vậy, Sếp Tuấn Anh đề ra chiến lược an toàn cực cao: Không bắt đáy 25.x, mà chờ giá ngóc trở lại vùng 26.5-27.0 để ăn chắc nến xác nhận dòng tiền. Tính đối xứng (Symmetry): Ròng rã 4 năm trời từ 2021 đến 2025, VPB kẹp cứng trong nền giá bên dưới 24. Nhịp Markup đánh lên 36 rồi bị đạp mạnh tay về lại 24 (rơi -33%) cấu thành một pha "Throwback" đối xứng vòng cung mẫu mực. Việc test thành công nắp hộp này và nảy lên biến mốc 24 thành hỗ trợ siêu cường của thập kỷ. Với điểm mua nới lên 26.75, R:R phái sinh tự động scale lại tỷ lệ 1.27 - hoàn toàn hợp lý cho vị thế ném đá 10% NAV.',
      wave_index: 'Pullback (Throwback về Base 4 năm)',
      is_confirmed: true,
      status: 'active',
      sector: 'Ngân hàng / Bảo hiểm / Tài chính',
      risk_level: 'Thấp (Chờ Break vùng an toàn)',
      conviction_level: 'Cao',
      catalyst_note: 'Test lại cứ điểm siêu Hỗ trợ 4 năm. Có lực cầu bắt đáy lớn.',
      expected_holding_days: 75,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774445587117.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded VPB Plan (Entry: 26.5-27.0, NAV 10%, R:R 1.27) with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
