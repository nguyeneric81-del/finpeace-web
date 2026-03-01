import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System Prompt - Trích xuất cả Tên khách hàng + Dữ liệu tài chính
const TELEGRAM_FINANCIAL_SKILL_PROMPT = `
Hành động như một kế toán viên FinPeace. Bạn nhận tin nhắn từ Tư vấn viên báo cáo thông tin tài chính của khách hàng.
Nhiệm vụ: Trích xuất TÊN KHÁCH HÀNG và thông tin tài chính rồi trả về DUY NHẤT một chuỗi JSON chuẩn.
KHÔNG GIẢI THÍCH THÊM BẤT KỲ CHỮ NÀO NGOÀI JSON.

CẤU TRÚC JSON:
{
  "client_name": "Tên khách hàng được đề cập (chỉ HỌ TÊN, ví dụ: Yến Lê, Tiến Vinh)",
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

Chú ý: Nếu nhắc đến mục tiêu nghỉ hưu/mua nhà dài hạn → action = "update_wealth_scenario", data = { "target_amount":..., "target_years":..., "monthly_cashflow":... }
`;

// Nhận Webhook từ Telegram
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 Webhook Telegram:", JSON.stringify(body, null, 2));

        const message = body.message;
        if (!message || !message.text) {
            return NextResponse.json({ message: "Ignored non-text event" }, { status: 200 });
        }

        const userText = message.text;
        const chatId = message.chat.id;

        // Lệnh cơ bản
        if (userText === '/start' || userText === '/help') {
            return await sendTelegramMessage(chatId,
                "👋 Chào mừng đến với Trợ lý FinPeace AI!\n\n" +
                "Hãy nhắn thông tin tài chính của khách, Bot sẽ tự nhận diện và cập nhật vào đúng account!\n\n" +
                "📌 Ví dụ:\n" +
                "• 'Chị Yến mua bảo hiểm Bảo Việt 2 tỷ'\n" +
                "• 'Anh Vinh vay ngân hàng 500 triệu mua xe'\n" +
                "• 'Chị Lan gửi tiết kiệm MBBank 300 triệu'\n\n" +
                "Bot sẽ tự tìm đúng khách và cập nhật dữ liệu real-time!"
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return await sendTelegramMessage(chatId, "❌ Thiếu GEMINI_API_KEY.");
        }

        await sendTelegramMessage(chatId, "🔍 Đang nhận diện khách hàng và phân tích dữ liệu...");

        // --- GEMINI AI PARSE ---
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(`${TELEGRAM_FINANCIAL_SKILL_PROMPT}\n\nTin nhắn từ Tư vấn viên: "${userText}"`);
        const responseText = result.response.text();

        let payload;
        try {
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            payload = JSON.parse(cleanJson);
        } catch (e) {
            console.error("❌ AI không parse được JSON:", responseText);
            return await sendTelegramMessage(chatId, "❌ AI không hiểu tin nhắn này. Vui lòng thêm rõ tên khách và số tiền.");
        }

        console.log("🤖 AI Payload:", payload);

        const clientName = payload.client_name;
        if (!clientName) {
            return await sendTelegramMessage(chatId, "❌ Không nhận ra tên khách hàng. Hãy nhắn rõ hơn, ví dụ: 'Chị Yến mua bảo hiểm...'");
        }

        // --- SUPABASE ADMIN CLIENT (bypass RLS) ---
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        // Tìm khách hàng theo tên (tìm kiếm mờ - ilike)
        const searchName = clientName.trim();
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .ilike('full_name', `%${searchName}%`)
            .limit(1);

        if (profileError || !profiles || profiles.length === 0) {
            console.error("❌ Không tìm thấy khách:", searchName, profileError);
            return await sendTelegramMessage(chatId,
                `❌ Không tìm thấy khách hàng tên "${clientName}" trong hệ thống.\n\n` +
                `Tên trong hệ thống cần khớp chính xác. Kiểm tra lại tên hoặc đăng ký tài khoản trước.`
            );
        }

        const profile = profiles[0];
        console.log("✅ Tìm thấy khách:", profile.full_name, profile.email);

        let replyMsg = "";

        if (payload.action === 'add_client_asset') {
            const assetData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('client_assets').insert([assetData]);
            if (error) throw error;
            replyMsg = `✅ Cập nhật thành công cho ${profile.full_name}!\n\n` +
                `💎 Nhóm: ${assetData.asset_group}\n` +
                `🏢 Tài sản: ${assetData.asset_name}\n` +
                `💰 Giá trị: ${new Intl.NumberFormat('vi-VN').format(assetData.amount)} VNĐ\n\n` +
                `📊 Dashboard của ${profile.full_name} đang cập nhật real-time!`;
        }

        if (payload.action === 'update_wealth_scenario') {
            const scenarioData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('wealth_scenarios').insert([scenarioData]);
            if (error) throw error;
            replyMsg = `✅ Đã cập nhật Kịch Bản Tương Lai cho ${profile.full_name}!`;
        }

        await sendTelegramMessage(chatId, replyMsg);
        return NextResponse.json({ success: true, client: profile.full_name }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Lỗi Webhook:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper gửi tin nhắn Telegram
async function sendTelegramMessage(chatId: number, text: string) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return NextResponse.json({ error: "Missing Bot Token" }, { status: 500 });

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Send Reply Error" }, { status: 500 });
    }
}
