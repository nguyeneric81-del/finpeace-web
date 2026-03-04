const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/4125d7f0-7527-4a01-8c5b-b7642dae2e5a/media__1772645505895.png'; // FPT chart
        const base64Image = fs.readFileSync(imagePath).toString('base64');
        const mimeType = 'image/png';

        const modelsToTest = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-2.5-flash-lite',
            'gemini-flash-latest',
            'gemini-flash-lite-latest',
            'gemini-2.0-flash-lite',
            'gemini-1.5-pro'
        ];

        for (const m of modelsToTest) {
            console.log(`\nTesting: ${m}`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const prompt = `Đây là đồ thị chứng khoán. Hãy phân tích JSON cấu trúc sau (chỉ trả về JSON, ko giải thích): {"strategy_name": "Tên", "price_series": [10 số]}`;
                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: base64Image, mimeType } }
                ]);
                console.log(`SUCCESS [${m}]:`, result.response.text().substring(0, 100));
                return; // Stop on first success
            } catch (err) {
                console.log(`FAILED [${m}]: ${err.message.split('\n')[0].substring(0, 200)}`);
            }
        }
    } catch (err) {
        console.error('Fatal:', err);
    }
}
main();
