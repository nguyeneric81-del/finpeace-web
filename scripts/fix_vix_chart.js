const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient('https://slooouceqcarcccryjyt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsb29vdWNlcWNhcmNjY3J5anl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI3ODAwNiwiZXhwIjoyMDg3ODU0MDA2fQ.TTlJCaPVwZ3P-ggbXuP6-u6thMGz5uD-UHgQpCac_9I');

const BUCKET_NAME = 'advisor-portfolios';
const filePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/4125d7f0-7527-4a01-8c5b-b7642dae2e5a/media__1772639105326.png';
const fileName = `manual_upload/VIX_${Date.now()}.png`;

async function uploadFix() {
    const fileBuffer = fs.readFileSync(filePath);

    // Upload image
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        return;
    }

    const imageUrl = `https://slooouceqcarcccryjyt.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${uploadData.path}`;
    console.log('Image uploaded:', imageUrl);

    // Update trading plan
    const { error: dbError } = await supabase
        .from('trading_plans')
        .update({ chart_image_url: imageUrl })
        .eq('ticker', 'VIX');

    if (dbError) {
        console.error('DB Error:', dbError);
    } else {
        console.log('Successfully updated VIX chart_image_url');
    }
}

uploadFix();
