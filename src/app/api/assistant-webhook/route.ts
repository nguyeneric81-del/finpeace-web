import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt: Trợ lý cá nhân thông minh của Sếp Tuấn Anh
const ASSISTANT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Cá Nhân thông minh của Sếp Tuấn Anh - một chuyên gia tư vấn tài chính cá nhân tại FinPeace.

Nhiệm vụ của bạn:
- Trả lời MỌI câu hỏi một cách thông minh, ngắn gọn, súc tích
- Hỗ trợ soạn email, tin nhắn, tài liệu chuyên nghiệp
- Phân tích tình huống tài chính, thị trường, đầu tư
- Gợi ý chiến lược cho các cuộc tư vấn khách hàng
- Tóm tắt thông tin nhanh, tra cứu kiến thức
- Dịch thuật, chỉnh sửa văn bản

Phong cách trả lời:
- Thân thiện, chuyên nghiệp, như một trợ lý riêng đáng tin cậy
- Trả lời tiếng Việt trừ khi được yêu cầu ngôn ngữ khác
- Câu trả lời ngắn gọn (≤ 200 từ), chỉ dài khi cần thiết
- Dùng emoji phù hợp để dễ đọc trên Telegram
- Nếu chủ đề liên quan tài chính/khách hàng, ưu tiên góc nhìn của chuyên gia tư vấn`;

async function sendTelegramMessage(chatId: number, text: string, botToken: string) {
    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch (e) {
        console.error("Lỗi gửi Telegram:", e);
    }
}

// Xử lý AI trong background - không block response cho Telegram
async function processWithAI(userText: string, chatId: number, botToken: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            await sendTelegramMessage(chatId, "❌ Thiếu GEMINI_API_KEY.", botToken);
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.8,
            },
        });

        const result = await chat.sendMessage(
            `${ASSISTANT_SYSTEM_PROMPT}\n\nTin nhắn của Sếp: ${userText}`
        );

        const responseText = result.response.text();

        // Telegram giới hạn 4096 ký tự mỗi tin nhắn
        if (responseText.length > 4000) {
            const chunks: string[] = [];
            let remaining = responseText;
            while (remaining.length > 4000) {
                chunks.push(remaining.slice(0, 4000));
                remaining = remaining.slice(4000);
            }
            if (remaining) chunks.push(remaining);
            for (const chunk of chunks) {
                await sendTelegramMessage(chatId, chunk, botToken);
            }
        } else {
            await sendTelegramMessage(chatId, responseText, botToken);
        }
    } catch (error: any) {
        console.error("❌ Lỗi AI Assistant:", error);
        await sendTelegramMessage(chatId, `❌ Lỗi xử lý: ${error.message}`, botToken);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const message = body.message;

        if (!message || !message.text) {
            return NextResponse.json({ ok: true }, { status: 200 });
        }

        const userText = message.text;
        const chatId = message.chat.id;
        const BOT_TOKEN = process.env.ASSISTANT_BOT_TOKEN || '';

        // Lệnh /start - reply nhanh
        if (userText === '/start' || userText === '/help') {
            sendTelegramMessage(chatId,
                "🤖 <b>Xin chào Sếp Tuấn Anh!</b>\n\n" +
                "Tôi là Trợ Lý AI Cá Nhân của Sếp, được vận hành bởi Gemini AI.\n\n" +
                "📌 Tôi có thể giúp:\n" +
                "• Soạn email, tin nhắn, tài liệu\n" +
                "• Phân tích tài chính, thị trường\n" +
                "• Gợi ý chiến lược tư vấn khách hàng\n" +
                "• Trả lời mọi câu hỏi\n\n" +
                "Hãy nhắn bất cứ điều gì! 💬",
                BOT_TOKEN
            );
            return NextResponse.json({ ok: true }, { status: 200 });
        }

        // ⚡ Return 200 ngay cho Telegram (tránh retry/loop)
        // Xử lý AI trong background
        processWithAI(userText, chatId, BOT_TOKEN);

        return NextResponse.json({ ok: true }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Lỗi Webhook Assistant:", error);
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}
