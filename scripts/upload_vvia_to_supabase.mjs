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

const FPT_MD = fs.readFileSync('/Users/tuananhnguyen/.gemini/antigravity/brain/c0e8b002-c0d6-4496-ae32-63bceee76487/artifacts/vvia_FPT_Q1_2026.md', 'utf-8');
const HPG_MD = fs.readFileSync('/Users/tuananhnguyen/.gemini/antigravity/brain/c0e8b002-c0d6-4496-ae32-63bceee76487/artifacts/vvia_HPG_Q1_2026.md', 'utf-8');

async function main() {
    console.log("🚀 Đang đẩy dữ liệu VVIA Report lên Supabase bảng sip_asset_valuations...");
    
    const records = [
        {
            stock_code: 'FPT',
            quarter_update: 'Q1/2026',
            business_outlook: FPT_MD,
            sip_outlook: 'Ở mức định giá P/E 17.5, FPT đang ở vùng Giá trị thực tế (Fair Value).',
            cta: 'DUY TRÌ TÍCH SẢN TỶ TRỌNG CŨ. Vẫn là cổ phiếu trụ cột phòng thủ tốt, nhưng không nên dồn mua đuổi (FOMO) ở vùng giá hưng phấn.',
            expected_growth: '15%',
            max_buy_price: 110000, 
            status: 'PUBLISHED',
            update_date: new Date().toISOString()
        },
        {
            stock_code: 'HPG',
            quarter_update: 'Q1/2026',
            business_outlook: HPG_MD,
            sip_outlook: 'Siêu cổ phiếu chu kỳ đang bước vào pha Đáy Phục Hồi mạnh mẽ. Việc định giá thấp hơn chuẩn Graham báo hiệu đây là MỎ VÀNG cho Tích sản.',
            cta: 'TĂNG TỐC TÍCH SẢN TỐI ĐA (Aggressive SIP). HPG 2026 là câu chuyện của khối tài sản ngầm đã bắt đầu đẻ trứng vàng.',
            expected_growth: '15%',
            max_buy_price: 31000,
            status: 'PUBLISHED',
            update_date: new Date().toISOString()
        }
    ];

    for (const record of records) {
        // Query to see if it exists
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
            else console.log(`✅ Cập nhật thành công ${record.stock_code} (${record.quarter_update})`);
        } else {
            const { error } = await supabase
                .from('sip_asset_valuations')
                .insert([record]);
            if (error) console.error(`❌ Insert lỗi ${record.stock_code}:`, error);
            else console.log(`✅ Đã thêm mới ${record.stock_code} (${record.quarter_update})`);
        }
    }
    console.log("🎉 Hoàn tất upload DB!");
}

main().catch(console.error);
