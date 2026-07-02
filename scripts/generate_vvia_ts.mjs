import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 4 Mã Bán Lẻ
const TICKERS = ['MWG', 'FRT', 'PNJ', 'DGW'];

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function fetchTickerData(ticker) {
    try {
        const { data, error } = await supabase
            .from('financial_quarterly_reports')
            .select('*')
            .eq('ticker', ticker)
            .order('year', { ascending: false })
            .order('quarter', { ascending: false })
            .limit(1)
            .maybeSingle();
            
        if (error) throw error;
        return data;
    } catch (e) {
        console.error(`❌ Lỗi fetch data Supabase cho ${ticker}:`, e.message);
        return null;
    }
}

async function generateVviaTS(ticker, data) {
    console.log(`🧠 Đang dùng Groq LLM để viết báo cáo cho ${ticker}...`);
    
    const prompt = `
Bạn là Cố vấn Đầu tư Lõi (Core Value Investment Advisor) của FinPeace, áp dụng khung phân tích Vietnam Value Investing Analyzer (VVIA).
Hãy viết bài phân tích cho mã chứng khoán ${ticker} (Ngành: Bán lẻ) theo chuẩn VVIA.

Dữ liệu tài chính hiện tại từ cơ sở dữ liệu nội bộ (FiinTrade import):
- P/E TTM: ${data?.pe_ttm ? data.pe_ttm.toFixed(2) : 'N/A'}
- P/B TTM: ${data?.pb_ttm ? data.pb_ttm.toFixed(2) : 'N/A'}
- Vốn hóa: ${data?.market_cap ? Math.round(data.market_cap).toLocaleString('vi-VN') : 'N/A'} tỷ VNĐ
- Lợi nhuận sau thuế: ${data?.profit_after_tax ? Math.round(data.profit_after_tax).toLocaleString('vi-VN') : 'N/A'} tỷ VNĐ (Tăng trưởng: ${(data?.profit_after_tax_yoy * 100).toFixed(1)}%)
- Doanh thu: ${data?.net_revenue ? Math.round(data.net_revenue).toLocaleString('vi-VN') : 'N/A'} tỷ VNĐ (Tăng trưởng: ${(data?.net_revenue_yoy * 100).toFixed(1)}%)

KỶ LUẬT ĐẦU RA (QUAN TRỌNG):
Bạn CHỈ ĐƯỢC PHÉP xuất ra ĐÚNG ĐỊNH DẠNG CODE TypeScript (không có markdown code blocks, không giải thích thêm). Code này export mảng \`content\` kiểu \`ContentBlock[]\`.

CHỈ ĐẠO CHUYÊN MÔN RIÊNG CHO NGÀNH BÁN LẺ:
Bạn BẮT BUỘC phải "tìm và chỉ ra tính đặc thù" của công ty ${ticker} ở Tầng 2 (Warren Buffett - Con Hào Kinh Tế) bằng cách phân tích cơ cấu doanh thu dựa trên 3 trụ cột sống còn sau:
1. Vòng quay Hàng tồn kho (Inventory Turnover): Mô hình giam vốn nhiều hay ít.
2. Chi phí cố định / Cửa hàng: Rủi ro điểm hòa vốn (Mặt bằng ngã tư đắt đỏ hay ngõ hẻm, mô hình chuỗi hay bán buôn).
3. Quyền lực Định giá (Pricing Power): Hàng xa xỉ/sức khỏe (niềm tin, không trả giá) hay Hàng công nghệ/thiết yếu (cuộc chiến dìm giá).

Cấu trúc BẮT BUỘC của các block:
1. Block \`intro\`: Đánh giá chung, chèn Lợi nhuận Quý mới nhất.
2. Các block \`key-insight\`: Dành cho 4 Tầng (Graham, Buffett, Greenblatt, Piotroski). Tiêu đề phải có Emojis.
3. Block \`steps\`: Storytelling với cụ Warren Buffett uống Cherry Coke phân tích mã chứng khoán này.
Lưu ý: Bỏ qua phần Widget.

Ví dụ Output mong đợi:
import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** ${data?.profit_after_tax ? Math.round(data.profit_after_tax).toLocaleString('vi-VN') : 'N/A'} tỷ VND (Cập nhật Q${data?.quarter}/${data?.year})\\n\\n**Đánh giá tổng quan:** 🟢 **Tích cực** — ...'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham... P/B hiện tại là ${data?.pb_ttm ? data.pb_ttm.toFixed(2) : 'N/A'}...'
    },
    // ... các tầng khác
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích ${ticker}?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Bán Lẻ',
                body: '"Charlie coi kìa..."',
                highlight: 'Bài học rút ra...'
            }
        ]
    }
];
`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 2500
            })
        });

        const json = await response.json();
        if (!json.choices) {
            console.error("Groq API Error:", JSON.stringify(json, null, 2));
            return null;
        }
        let code = json.choices[0].message.content.trim();
        
        // Remove markdown block if model added it
        if (code.startsWith('\`\`\`typescript')) {
            code = code.replace(/^\`\`\`typescript\n/, '').replace(/\n\`\`\`$/, '');
        } else if (code.startsWith('\`\`\`ts')) {
            code = code.replace(/^\`\`\`ts\n/, '').replace(/\n\`\`\`$/, '');
        } else if (code.startsWith('\`\`\`')) {
            code = code.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
        }

        return code;
    } catch (e) {
        console.error(`❌ Lỗi gọi LLM cho ${ticker}:`, e.message);
        return null;
    }
}

async function main() {
    console.log("🚀 Bắt đầu tự động lấy dữ liệu TCBS & Tạo báo cáo VVIA...");
    
    const outputDir = path.join(__dirname, '../src/app/knowledgebase/content/phan-tich-doanh-nghiep');
    
    // Create dir if not exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Lặp qua các mã
    const targets = TICKERS;
    
    for (const ticker of targets) {
        const data = await fetchTickerData(ticker);
        if (data) {
            const tsCode = await generateVviaTS(ticker, data);
            if (tsCode) {
                const outputFilePath = path.join(outputDir, `vvia-retail-${ticker.toLowerCase()}-2026.ts`);
                fs.writeFileSync(outputFilePath, tsCode, 'utf-8');
                console.log(`✅ Đã lưu file: ${outputFilePath}`);
            }
        }
        await new Promise(r => setTimeout(r, 2000)); // Rate limit
    }
    
    console.log("🎉 Hoàn tất!");
}

main().catch(console.error);
