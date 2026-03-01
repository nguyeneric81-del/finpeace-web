import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
Hành động như một kế toán viên FinPeace. Bạn nhận tin nhắn từ Tư vấn viên báo cáo thông tin tài chính của khách hàng.
Nhiệm vụ: Trích xuất TÊN KHÁCH HÀNG và thông tin tài chính rồi trả về DUY NHẤT một chuỗi JSON chuẩn.
KHÔNG GIẢI THÍCH THÊM BẤT KỲ CHỮ NÀO NGOÀI JSON.

CẤU TRÚC JSON:
{
  "client_name": "Tên khách hàng (chỉ HỌ TÊN như: Yến Lê, Tiến Vinh)",
  "action": "add_client_asset",
  "data": {
    "asset_group": "...",
    "asset_name": "Tên tài sản/khoản nợ",
    "amount": 2000000000,
    "risk_level": 2,
    "notes": "..."
  }
}

Quy tắc asset_group:
- Bảo hiểm nhân thọ/sức khỏe → "Bảo vệ" (risk_level: 1)
- Tiền gửi/tiết kiệm ngân hàng → "Thanh khoản" (risk_level: 1)
- Đất đai/bất động sản → "Đầu tư" (risk_level: 3)
- Cổ phiếu/chứng khoán → "Đầu tư" (risk_level: 5)
- Vay nợ/thẻ tín dụng → "Nợ" (risk_level: 1)
- Ô tô/xe/đồ dùng → "Tiêu dùng" (risk_level: 2)

Nếu nhắc đến mục tiêu nghỉ hưu/mua nhà dài hạn → action = "update_wealth_scenario", data = { "target_amount":..., "target_years":..., "monthly_cashflow":... }
`;

async function sendTelegramMessage(chatId: number, text: string) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });
    } catch (e) {
        console.error("Lỗi gửi Telegram:", e);
    }
}

// Xử lý logic AI + Supabase trong background (không block response)
async function processMessageInBackground(userText: string, chatId: number) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            await sendTelegramMessage(chatId, "❌ Thiếu GEMINI_API_KEY.");
            return;
        }

        // Gọi Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nTin nhắn từ Tư vấn viên: "${userText}"`);
        const responseText = result.response.text();

        let payload;
        try {
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            payload = JSON.parse(cleanJson);
        } catch (e) {
            await sendTelegramMessage(chatId, "❌ AI không hiểu tin nhắn này. Vui lòng nêu rõ tên khách và số tiền.");
            return;
        }

        const clientName = payload.client_name;
        if (!clientName) {
            await sendTelegramMessage(chatId, "❌ Không nhận ra tên khách. Ví dụ: 'Chị Yến mua bảo hiểm Bảo Việt 2 tỷ'");
            return;
        }

        // Supabase với Service Role Key
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .ilike('full_name', `%${clientName.trim()}%`)
            .limit(1);

        if (!profiles || profiles.length === 0) {
            await sendTelegramMessage(chatId, `❌ Không tìm thấy khách hàng tên "${clientName}" trong hệ thống.`);
            return;
        }

        const profile = profiles[0];

        if (payload.action === 'add_client_asset') {
            const assetData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('client_assets').insert([assetData]);
            if (error) throw error;
            await sendTelegramMessage(chatId,
                `✅ Cập nhật thành công cho ${profile.full_name}!\n\n` +
                `💎 Nhóm: ${assetData.asset_group}\n` +
                `🏢 Tài sản: ${assetData.asset_name}\n` +
                `💰 Giá trị: ${new Intl.NumberFormat('vi-VN').format(assetData.amount)} VNĐ\n\n` +
                `📊 Dashboard đang cập nhật real-time!`
            );
        } else if (payload.action === 'update_wealth_scenario') {
            const { error } = await supabase.from('wealth_scenarios').insert([{ user_id: profile.id, ...payload.data }]);
            if (error) throw error;
            await sendTelegramMessage(chatId, `✅ Đã cập nhật Kịch Bản Tương Lai cho ${profile.full_name}!`);
        }
    } catch (error: any) {
        console.error("❌ Lỗi background processing:", error);
        await sendTelegramMessage(chatId, `❌ Lỗi hệ thống: ${error.message}`);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const message = body.message;

        // Bỏ qua nếu không có text
        if (!message || !message.text) {
            return NextResponse.json({ ok: true }, { status: 200 });
        }

        const userText = message.text;
        const chatId = message.chat.id;

        // Lệnh cơ bản - reply nhanh
        if (userText === '/start' || userText === '/help') {
            // Không await - bắn và quên để return 200 ngay
            sendTelegramMessage(chatId,
                "👋 Chào mừng đến với Trợ lý FinPeace AI!\n\n" +
                "Nhắn thông tin tài chính của khách, Bot tự nhận diện và cập nhật!\n\n" +
                "📌 Ví dụ:\n" +
                "• 'Chị Yến mua bảo hiểm Bảo Việt 2 tỷ'\n" +
                "• 'Anh Vinh vay ngân hàng 500 triệu mua xe'"
            );
            return NextResponse.json({ ok: true }, { status: 200 });
        }

        // ⚡ QUAN TRỌNG: Return 200 ngay lập tức cho Telegram
        // Sau đó xử lý AI/Supabase trong background
        // Điều này ngăn Telegram retry webhook khi Gemini mất > 5s
        processMessageInBackground(userText, chatId);

        return NextResponse.json({ ok: true }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Lỗi Webhook:", error);
        return NextResponse.json({ ok: false }, { status: 200 }); // Vẫn trả 200 để Telegram không retry
    }
}
