import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Gemini AI (Yêu cầu biến môi trường GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Bổ sung Skill Nguyên thủy cho System Prompt của Gemini
const TELEGRAM_FINANCIAL_SKILL_PROMPT = `
Hành động như một kế toán viên FinPeace. Bạn nhận được tin nhắn từ khách hàng qua Telegram.
Nhiệm vụ: Trích xuất thông tin tài sản, nợ nần, thanh khoản, mục tiêu tương lai và trả về DUY NHẤT một chuỗi JSON chuẩn.
KHÔNG GIẢI THÍCH MỘT TỪ NÀO KHÁC NGOÀI JSON TEXT.

CẤU TRÚC KẾT QUẢ TRẢ VỀ:
{
  "action": "add_client_asset", // HOẶC "update_wealth_scenario"
  "data": {
    "asset_group": "...", // "Nợ" | "Thanh khoản" | "Đầu tư" | "Bảo vệ" | "Tiêu dùng"
    "asset_name": "Tên được nhắc đến",
    "amount": 50000000, // Số tiền dạng số nguyên
    "risk_level": 3, // rủi ro 1->5
    "notes": "..."
  }
}

Chú ý: Nếu khách hàng đề cập mục tiêu nghỉ hưu/mua nhà lâu dài thì action là "update_wealth_scenario" kèm data: { "target_amount":..., "target_years":..., "monthly_cashflow":... }
`;

// Nhận Webhook từ Telegram Platform
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 Nhận Webhook từ Telegram:", JSON.stringify(body, null, 2));

        // Telegram gửi Message Object bên trong Update
        const message = body.message;

        // Nếu không có text (ví dụ user gửi ảnh), bỏ qua
        if (!message || !message.text) {
            return NextResponse.json({ message: "Ignored non-text event" }, { status: 200 });
        }

        const userText = message.text;
        const chatId = message.chat.id;

        // Bỏ qua các tin nhắn lệnh bot cơ bản
        if (userText === '/start' || userText === '/help') {
            return await sendTelegramMessage(chatId, "👋 Chào mừng đến với Trợ lý FinPeace AI.\nHãy chat mọi giao dịch Tài sản/Nợ của bạn, tôi sẽ đưa nó vào Tháp Sinh Mệnh ngay lập tức!\n\nVí dụ: 'Tôi vừa mua xe VF8 trả góp 800 triệu'");
        }

        // --- TÍCH HỢP GEMINI AI ---
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ Thiếu GEMINI_API_KEY");
            return await sendTelegramMessage(chatId, "Hệ thống AI đang bảo trì (Thiếu API Key).");
        }

        // Gửi thông báo 'Đang xử lý...'
        await sendTelegramMessage(chatId, "⏳ Đang phân tích ngôn ngữ tự nhiên...");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(`${TELEGRAM_FINANCIAL_SKILL_PROMPT}\n\nTin nhắn khách hàng: "${userText}"`);
        const responseText = result.response.text();

        // --- XỬ LÝ CHUỖI JSON TỪ AI ---
        let payload;
        try {
            // Lọc loại bỏ dấu markdown nếu có
            const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            payload = JSON.parse(cleanJsonString);
        } catch (e) {
            console.error("❌ AI không trả về chuẩn JSON:", responseText);
            return await sendTelegramMessage(chatId, "❌ Rất tiếc, AI không hiểu được câu thoại này. Bạn có thể nói rõ hơn số tiền và phân loại không?");
        }

        console.log("🤖 AI đã phân tích JSON Payload:", payload);

        // --- ĐẨY DATA VÀO SUPABASE QUA SERVICE ROLE (bypass RLS) ---
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, serviceKey);

        // Mặc định Account Khách VIP (Nguyễn Tiến Vinh) Demo Sáng mai
        const defaultEmail = 'tienvinh0108@gmail.com';

        const { data: profile } = await supabase.from('profiles').select('id, full_name').eq('email', defaultEmail).single();
        if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

        let replyMsg = "";

        if (payload.action === 'add_client_asset') {
            const assetData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('client_assets').insert([assetData]);
            if (error) throw error;
            replyMsg = `✅ (FinPeace AI) - Gieo thành công khối dữ liệu:\n💎 Nhóm: ${assetData.asset_group}\n🏢 Tên: ${assetData.asset_name}\n💰 Giá trị: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(assetData.amount)}\n\n(Tháp Tài Sản Real-time trên màn hình Khách hàng đang nới rộng!)`;
        }

        if (payload.action === 'update_wealth_scenario') {
            const scenarioData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('wealth_scenarios').insert([scenarioData]);
            if (error) throw error;
            replyMsg = `✅ (FinPeace AI) - Đã tái cấu trúc Kịch Bản Sinh Mệnh theo Mục tiêu mới!`;
        }

        // --- TRẢ LỜI NGƯỜI DÙNG QUẢ TELEGRAM ---
        await sendTelegramMessage(chatId, replyMsg);

        return NextResponse.json({ success: true, message: "Handled Telegram Update" }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Lỗi Webhook Telegram:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Hàm Helpers gửi tin nhắn ngược về Telegram
async function sendTelegramMessage(chatId: number, text: string) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return NextResponse.json({ error: "Missing Bot Token" }, { status: 500 });

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });
        return NextResponse.json({ success: true }, { status: 200 }); // Trả về cho Webhook
    } catch (e) {
        console.error("Lỗi gửi tin Teleram", e);
        return NextResponse.json({ error: "Send Reply Error" }, { status: 500 });
    }
}
