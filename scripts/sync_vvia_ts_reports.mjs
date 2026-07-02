import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncVviaReports() {
    const reportsDir = path.join(__dirname, '../src/app/knowledgebase/content/phan-tich-doanh-nghiep');
    
    if (!fs.existsSync(reportsDir)) {
        console.error(`Directory not found: ${reportsDir}`);
        return;
    }

    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.ts'));
    
    for (const filename of files) {
        const filepath = path.join(reportsDir, filename);
        let rawCode = fs.readFileSync(filepath, 'utf-8');
        
        // Extract ticker from filename (e.g., vvia-retail-mwg-2026.ts -> MWG)
        const match = filename.match(/-([a-z0-9]+)-2026\.ts$/);
        if (!match) continue;
        const ticker = match[1].toUpperCase();
        
        // Clean up TS specific syntax to evaluate as pure JS
        rawCode = rawCode.replace(/import type .*?\n/g, '');
        rawCode = rawCode.replace(/export\s+const\s+[a-zA-Z0-9_]+\s*(:\s*ContentBlock\[\])?\s*=\s*\[/g, 'return [');
        
        let contentObj;
        try {
            // Evaluate the cleaned code
            const func = new Function(rawCode);
            contentObj = func();
        } catch (e) {
            console.error(`❌ Lỗi parse JS cho ${ticker}:`, e.message);
            continue;
        }

        // Build Markdown Analyst View
        let markdown = `# Phân Tích Cơ Bản: ${ticker}\n\n`;
        for (const block of contentObj) {
            if (block.type === 'intro') {
                markdown += `${block.content}\n\n`;
            } else if (block.type === 'key-insight') {
                markdown += `### ${block.title}\n${block.content}\n\n`;
            } else if (block.type === 'steps') {
                markdown += `### ${block.title}\n${block.content}\n\n`;
                if (block.items) {
                    for (const item of block.items) {
                        markdown += `- **${item.icon} ${item.title}**: ${item.body}\n  *${item.highlight}*\n`;
                    }
                }
            }
        }
        
        console.log(`Đang đồng bộ ${ticker}...`);
        
        const record = {
            id: crypto.randomUUID(),
            topic_slug: `phan-tich-doanh-nghiep/${filename.replace('.ts', '')}`,
            title: `Báo cáo Phân tích VVIA: ${ticker}`,
            category: 'Doanh Nghiệp',
            date_label: 'Q1/2026',
            data_point: 'VVIA Updated',
            published: true,
            companies: [{ ticker: ticker, name: ticker }],
            analyst_view: markdown,
            key_stats: [
                { label: "VVIA AI Model", value: "Checked", positive: true },
                { label: "Data Source", value: "FiinTrade", positive: true }
            ]
        };
        
        try {
            // Cập nhật macro_insights
            const { error } = await supabase.from('macro_insights').upsert(record, { onConflict: 'topic_slug' });
            if (error) throw error;
            console.log(`✅ Đã đồng bộ thành công: ${ticker}`);
        } catch (e) {
            console.error(`❌ Lỗi đồng bộ ${ticker}:`, e.message);
        }
    }
    console.log("🎉 Hoàn tất đồng bộ toàn bộ báo cáo VVIA lên Supabase!");
}

syncVviaReports().catch(console.error);
