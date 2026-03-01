import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

// Khởi tạo Gemini AI (Yêu cầu biến môi trường GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Bổ sung Skill Nguyên thủy cho System Prompt của Gemini
const ZALO_FINANCIAL_SKILL_PROMPT = `
Hành động như một kế toán viên FinPeace. Bạn nhận được tin nhắn từ khách hàng (hoặc qua trợ lý tư vấn).
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

// Xác thực Zalo Webhook bằng GET method
export async function GET(request: Request) {
    return NextResponse.json({ message: "Zalo Webhook v1 is active. Please use POST to send events." }, { status: 200 });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("📥 Nhận Webhook từ Zalo:", JSON.stringify(body, null, 2));

        // 1. Zalo OA sẽ gửi Event 'user_send_text' khi khách hàng nhắn tin
        if (body.event_name !== 'user_send_text') {
            return NextResponse.json({ message: "Ignored event" }, { status: 200 });
        }

        const userText = body.message?.text;
        const senderId = body.sender?.id;

        if (!userText) {
            return NextResponse.json({ error: "Missing text message" }, { status: 400 });
        }

        // --- TÍCH HỢP GEMINI AI ---
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ Thiếu GEMINI_API_KEY");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(`${ZALO_FINANCIAL_SKILL_PROMPT}\n\nTin nhắn khách hàng: "${userText}"`);
        const responseText = result.response.text();

        // --- XỬ LÝ CHUỖI JSON ---
        let payload;
        try {
            // Lọc loại bỏ dấu markdown ```json ... ``` nếu AI lỡ gen ra
            const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            payload = JSON.parse(cleanJsonString);
        } catch (e) {
            console.error("❌ AI không trả về chuẩn JSON:", responseText);
            // Phản hồi lỗi về Zalo (Yêu cầu Zalo OA Access Token)
            // Lẽ ra cần gọi API send message của Zalo ở đây. Nhưng trong phạm vi Demo, Webhook bỏ qua.
            return NextResponse.json({ error: "Failed to parse AI output" }, { status: 400 });
        }

        console.log("🤖 AI đã phân tích payload:", payload);

        // --- ĐẨY DATA VÀO SUPABASE THÔNG QUA NỘI BỘ ---
        const supabase = await createClient();

        // Mặc định email khách VIP cho buổi Demo ngày mai vì Zalo UID chưa được gán map.
        const defaultEmail = 'tienvinh0108@gmail.com';

        const { data: profile } = await supabase.from('profiles').select('id, full_name').eq('email', defaultEmail).single();
        if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (payload.action === 'add_client_asset') {
            const assetData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('client_assets').insert([assetData]);
            if (error) throw error;
            console.log("✅ (Zalo Bot) Đã gieo khối tài sản:", assetData.asset_name);
        }

        if (payload.action === 'update_wealth_scenario') {
            const scenarioData = { user_id: profile.id, ...payload.data };
            const { error } = await supabase.from('wealth_scenarios').insert([scenarioData]);
            if (error) throw error;
            console.log("✅ (Zalo Bot) Đã gieo kịch bản sinh mệnh");
        }

        // --- TRẢ LỜI NGƯỜI DÙNG BẰNG ZALO SEND MESSAGE API ---
        // TODO: (Sếp cần cung cấp Access Token OA để hệ thống gọi phản hồi tự động).
        // Trong trường hợp này Webhook âm thầm thay đổi Data Supabase và Cây Sinh Mệnh trên Web sẽ nhảy.

        return NextResponse.json({ success: true, message: "Parsed and Pushed" }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Lỗi Webhook Zalo:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
