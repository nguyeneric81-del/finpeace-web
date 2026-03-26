const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: tp } = await supabase.from('trading_plans').select('id').eq('ticker', 'STB').single();
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774441372362.png';
  const fileBuffer = fs.readFileSync(imagePath);
  const fileName = `charts/${tp.id}/${Date.now()}.png`;

  const { data: uploaded, error } = await supabase.storage.from('advisor-charts').upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });
  if (error) return console.error(error);

  const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`;
  await supabase.from('trading_plans').update({ chart_image_url: chartUrl }).eq('id', tp.id);
  console.log('Xong: ' + chartUrl);
}
run();
