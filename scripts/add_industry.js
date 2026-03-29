const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../src/app/knowledgebase/data.ts');
let content = fs.readFileSync(dataFile, 'utf8');

const mapping = {
    'vvia-bank-': 'Ngân hàng',
    'vvia-re-': 'Bất động sản',
    'vvia-tech-': 'Công nghệ',
    'vvia-securities-': 'Chứng khoán',
    'vvia-steel-': 'Thép'
};

for (const [prefix, industry] of Object.entries(mapping)) {
    const regex = new RegExp(`(slug: '${prefix}.*',)`, 'g');
    content = content.replace(regex, `$1\n                industry: '${industry}',`);
}

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Successfully injected industry field into data.ts!');
