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

        console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam.
Nhiệm vụ:
1. Liệt kê tất cả các mã chứng khoán (tickers).
2. Trích xuất "Giá vốn" (Avg Cost) và "Giá hiện tại" (Current Price) cho từng mã nếu có.
3. Phân tích cơ cấu danh mục.

Yêu cầu trả về định dạng JSON duy nhất:
{
  "items": [
    {"ticker": "VNM", "avg_cost": 72.5, "current_price": 71.2},
    {"ticker": "HPG", "avg_cost": 28.1, "current_price": 30.5}
  ],
  "assessment": {
    "summary": "Mô tả phong cách danh mục...",
    "sectors": ["Ngân hàng (40%)", "..."],
    "risk_level": "Trung bình / Cao / Thấp",
    "advice": "Lời khuyên chiến lược..."
  }
}
- Chỉ trả về JSON, không thêm text giải thích.`;

        console.log('Sending request to Gemini...');
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
