const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../src/app/knowledgebase/data.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const slugsToEnable = [
    'vvia-tech-fpt-2026',
    'vvia-steel-hpg-2026',
    'vvia-securities-ssi-2026',
    'vvia-bank-mbb-2026',
    'vvia-bank-tcb-2026'
];

slugsToEnable.forEach(slug => {
    // Tìm regex chính xác slug
    const regex = new RegExp(`(slug: '${slug}',)`, 'g');
    // Thay thế slug đó bằng slug gốc kèm cờ flashcards
    content = content.replace(regex, `$1\n                hasFlashcards: true,`);
});

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Successfully enabled hasFlashcards for 5 companies!');
