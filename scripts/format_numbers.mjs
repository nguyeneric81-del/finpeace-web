import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../src/app/knowledgebase/content/phan-tich-doanh-nghiep');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace anything like: 2757.557020527 tỷ
    content = content.replace(/(\d+\.\d{2,})\s*tỷ/g, (match, p1) => {
        return Math.round(parseFloat(p1)).toLocaleString('vi-VN') + ' tỷ';
    });

    // Replace any other long decimals (e.g. 27.5685557225325 -> 27.57)
    content = content.replace(/\b(\d+\.\d{3,})\b/g, (match, p1) => {
        return parseFloat(p1).toFixed(2);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Formatted ${file}`);
}
