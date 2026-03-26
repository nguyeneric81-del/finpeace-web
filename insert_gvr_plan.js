require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    const plan = {
      ticker: 'GVR',
      company_name: 'Tập đoàn Công nghiệp Cao su Việt Nam',
      strategy_name: 'Trend Following / Bắt đáy nén tại Trendline',
      timeframe: 'Trung hạn (60 - 90 ngày)',
      entry_zone: '28.70 - 31.30 (Vùng test Trendline dài hạn)',
      stop_loss: '24.96 (-20.28%)',
      take_profit: '39.48 (+26.09%)',
      risk_reward: 1.29,
      max_position_pct: 10,
      indicators: ['Giá chạm trendline nối đáy từ 2022', 'Chiết khấu 38% từ đỉnh', 'Volume phân phối cạn kiệt'],
      entry_criteria: [
        'Rải 3 mẻ (30-30-40) quanh vùng 28.7 - 31.3',
        'Cây nến ngày đảo chiều rút chân khi đóng cửa',
        'Vol tăng trở lại >= 5 triệu cổ lấp gap giảm'
      ],
      exit_criteria: [
        'Thủng dứt khoát mốc 24.90 (Đáy hộp tích luỹ cũ)',
        'Chốt 1/2 khi chạm vùng cản tâm lý 36.00'
      ],
      analyst_note: 'GVR vừa trải qua một nhịp rũ bỏ khốc liệt từ vùng đỉnh 46.5 về 28.6. Giá nén chặt tại Hỗ trợ Trendline 2 năm. Rủi ro thủng nền tương đối lớn (-20%) nên giải ngân thăm dò với 10% vốn.',
      wave_index: 'Sideway Accumulation (Test Đáy)',
      is_confirmed: true,
      status: 'active',
      sector: 'Cao su / BĐS Khu Công Nghiệp',
      risk_level: 'Cao',
      conviction_level: 'Thường',
      catalyst_note: 'Chuyển đổi quy hoạch quỹ đất cao su Phước Hoà, Dầu Tiếng. Giá mủ cao su TG ủng hộ đà hồi phục.',
      expected_holding_days: 75,
      capital_allocation_pct: 10
    };

    const { data: tp, error: insertErr } = await supabase.from('trading_plans').insert(plan).select().single();
    if (insertErr) throw insertErr;

    const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774442554619.png';
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = `charts/${tp.id}/${Date.now()}.png`;

    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from('advisor-charts')
      .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw uploadErr;

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;

    await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
    console.log(`✅ Uploaded GVR Plan with Chart: ${chartUrl}`);
  } catch (err) {
    console.error('Lỗi Run:', err);
  }
}

run();
