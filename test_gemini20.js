const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/4125d7f0-7527-4a01-8c5b-b7642dae2e5a/media__1772645505895.png'; // FPT chart
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = 'image/png';

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Đây là đồ thị chứng khoán. Hãy phân tích JSON cấu trúc sau (chỉ trả về JSON, ko giải thích):
{
  "strategy_name": "Tên chiến lược",
  "price_series": [mảng 20 số tương đối]
}`;

        console.log('Sending request to Gemini 2.0 Flash...');
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        console.log('Response:', result.response.text());
    } catch (err) {
        console.error('Gemini Error:', err);
    }
}
main();
