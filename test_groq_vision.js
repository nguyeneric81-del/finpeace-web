const fs = require('fs');
const Groq = require('groq-sdk');
require('dotenv').config({ path: '.env.local' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    try {
        const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/4125d7f0-7527-4a01-8c5b-b7642dae2e5a/media__1772645505895.png';
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = 'image/png';

        console.log('Testing with model: llama-3.2-11b-vision-preview (to confirm if decommissioned)');
        console.log('Testing with model: meta-llama/llama-4-scout-17b-16e-instruct');

        const completion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Bạn là trợ lý phân tích đồ thị chứng khoán chuyên nghiệp. Hãy đọc đồ thị này và trả về 1 JSON hợp lệ với cấu trúc sau:
{
  "strategy_name": "Tên chiến lược ngắn gọn (VD: Vượt cản, Tích lũy đáy)",
  "entry_zone": "Mức giá điểm vào (khoảng giá)",
  "stop_loss": "Mức giá cắt lỗ",
  "take_profit": "Mức giá chốt lời",
  "wave_index": "Tình trạng sóng (VD: Trending 3, Sideway 4)",
  "area_symmetry_note": "Ghi chú tương xứng diện tích/thời gian",
  "analyst_note": "Vài dòng phân tích lý do chọn điểm vào này.",
  "price_series": [mảng CHÍNH XÁC 20 số]
}
QUAN TRỌNG VỀ 'price_series': Hãy dùng mắt ước lượng hình dạng đường giá (đóng cửa/thân nến) từ trái qua phải trên toàn bộ đồ thị, chia đều thành 20 điểm thời gian. Mỗi điểm là 1 con số tương đối phản ánh ĐỘ CAO của giá so với trục tung bên phải. Ví dụ: [60, 62, 59, 65, ...]. Đảm bảo có đúng 20 phần tử số. TRẢ VỀ DUY NHẤT CHUỖI JSON.`
                        },
                        {
                            type: 'image_url',
                            image_url: { url: `data:${mimeType};base64,${base64Image}` }
                        }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 1500,
        });

        console.log('Response:', completion.choices[0]?.message?.content);
    } catch (err) {
        console.error('Groq Error:', err.message);
    }

}
main();
