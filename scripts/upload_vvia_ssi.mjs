import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SSI_MD = fs.readFileSync('/Users/tuananhnguyen/.gemini/antigravity/brain/c0e8b002-c0d6-4496-ae32-63bceee76487/artifacts/vvia_SSI_Q1_2026.md', 'utf-8');

async function main() {
    console.log("🚀 Đang đẩy dữ liệu VVIA SSI (Re-upload) lên Supabase...");
    
    // As per user request: Max buy price is removed, CTA changed, expected growth is 15%
    const record = {
        stock_code: 'SSI',
        quarter_update: 'Q1/2026',
        business_outlook: SSI_MD,
        sip_outlook: 'Thuộc rổ Cổ phiếu tấn công rủi ro cao, chu kỳ Beta cao. Định giá không còn quá rẻ để "Mua nhắm mắt", nhưng câu chuyện Nâng hạng thị trường bắt buộc danh mục nào cũng phải có đại diện.',
        cta: 'DUY TRÌ TÍCH SẢN. Không FOMO khi thị trường đang hưng phấn tột độ (Thanh khoản > 30k tỷ/phiên). Chỉ mạnh tay gạt mua thêm vào những tuần thị trường sập hầm xám xịt do call-margin.',
        expected_growth: '15%',
        max_buy_price: 35800,
        status: 'PUBLISHED',
        update_date: new Date().toISOString()
    };

    const { data: existing } = await supabase
        .from('sip_asset_valuations')
        .select('id')
        .eq('stock_code', record.stock_code)
        .eq('quarter_update', record.quarter_update)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from('sip_asset_valuations')
            .update(record)
            .eq('id', existing.id);
        if (error) console.error(`❌ Cập nhật lỗi ${record.stock_code}:`, error);
        else console.log(`✅ Cập nhật thành công ${record.stock_code} với Expected Growth 15%`);
    } else {
        const { error } = await supabase
            .from('sip_asset_valuations')
            .insert([record]);
        if (error) console.error(`❌ Insert lỗi ${record.stock_code}:`, error);
        else console.log(`✅ Đã thêm mới ${record.stock_code}`);
    }
    console.log("🎉 Hoàn tất upload DB SSI!");
}

main().catch(console.error);
