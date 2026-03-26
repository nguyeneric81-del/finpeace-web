const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadVCGChart() {
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/378d9462-9fc2-4c8f-8959-a71a6c051fe1/media__1774447549657.png';
  
  if (!fs.existsSync(imagePath)) {
    console.error('File ảnh không tồn tại:', imagePath);
    return;
  }

  const fileExt = 'png';
  const filePath = `charts/vcg-${Date.now()}.${fileExt}`;
  
  console.log('Đang upload ảnh lên bucket advisor-charts...');
  
  const fileBuffer = fs.readFileSync(imagePath);
  
  const { data, error } = await supabase.storage
    .from('advisor-charts')
    .upload(filePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    console.error('Lỗi khi upload ảnh:', error);
    return;
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${data.path}`;
  console.log('✅ Upload ảnh thành công. Link:', publicUrl);

  console.log('Đang cập nhật link ảnh vào Trading Plan mã VCG...');
  const { data: updateData, error: updateError } = await supabase
    .from('trading_plans')
    .update({ chart_image_url: publicUrl })
    .eq('ticker', 'VCG')
    .eq('status', 'active');

  if (updateError) {
    console.error('Lỗi khi cập nhật link ảnh:', updateError);
  } else {
    console.log('✅ Đã link ảnh vào Trading Plan VCG thành công!');
  }
}

uploadVCGChart();
