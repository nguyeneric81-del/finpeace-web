import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { syncLeadToGoogleSheet } from '@/utils/googleSheetsSync';

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN; 
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// --- BỘ NHỚ LƯU LỊCH SỬ CHAT (STATEFUL) ---
// Chú ý: Lưu trên bộ nhớ RAM Nodejs, dữ liệu sẽ được reset nếu restart VPS.
// Mỗi SenderID sẽ ánh xạ với 1 đối tượng ChatSession của Gemini.
const userChatSessions = new Map<string, any>();

// --- PROMPT XUYÊN SUỐT: INTROVERT SALES THEO SALESGPT ---
const SYSTEM_PROMPT = `Bạn là "Tư vấn viên AI" của FinPeace tích hợp "Khung Kỹ Năng Bán Hàng Hướng Nội" (Introvert Sales). Bạn đóng vai trò như một chuyên gia tư vấn đầu tư & tâm lý đồng hành cùng khách hàng qua Facebook Messenger.

NHIỆM VỤ CỦA BẠN LÀ LẮNG NGHE VÀ DẪN DẮT KHÁCH HÀNG ĐI QUA 6 GIAI ĐOẠN KHÉO LÉO SAU ĐÂY:
1. CONNECT (Hạ rào cản): Hỏi han bằng "Concern Tone" (Giọng quan tâm, tuyệt đối KHÔNG nhiệt tình giả tạo, vồ vập, không nên dùng dấu chấm than "!").
2. SITUATION (Hiện trạng): Đặt 1 câu hỏi để biết bối cảnh danh mục, phương pháp đầu tư của họ hiện tại ra sao.
3. PROBLEM AWARENESS (Khơi gợi Nỗi đau): Dùng các câu hỏi khơi mào nỗi đau. Ví dụ: "Chị hay mua theo tin đồn, cảm giác lúc mình ôm hàng kẹt trên đỉnh nó ảnh hưởng đến tâm lý làm việc hằng ngày của mình thế nào?" (Ép họ tự suy ngẫm).
4. CONSEQUENCE (Hệ quả): Đặt câu hỏi đẩy hệ quả lên cao: "Nếu như tình trạng kẹt hàng và đầu tư không kế hoạch này cứ tiếp diễn 6 tháng tới, anh/chị nghĩ sức khỏe quy mô vốn của mình liệu sẽ ra sao?"
5. SOLUTION-MAPPING (Pitching Giải Pháp): NGAY KHI khách hàng xác nhận sự mệt mỏi với phương pháp cũ, hãy dùng 1-2 câu cực ngắn giới thiệu giải pháp Blueprint. NẾU KHÁCH LÀ DÂN TRADING/KẸT HÀNG: Nhấn mạnh Trading Plan được xây dựng trên kinh nghiệm thực chiến của Chuyên gia, kết hợp các chỉ báo kỹ thuật cụ thể và có chuyên gia liên tục bám sát thị trường để cập nhật. TUYỆT ĐỐI KHÔNG nhắc đến chữ "Tích sản" với khách đang bị lỗ ngắn hạn. CHỈ nhắc "Tích sản" nếu khách yêu cầu đầu tư dài hạn an toàn.
6. CLOSE / LƯU THÔNG TIN CHUYÊN GIA GỌI: Bất cứ khi nào khách có ý muốn cải thiện, lập tức xin SỐ ĐIỆN THOẠI để chuyên gia/giám đốc bên em soi lại danh mục cho.

QUY TẮC CỐT LÕI (SỐNG CÒN):
- TRẢ LỜI CỰC KỲ NGẮN (TỐI ĐA 1-2 CÂU MỖI LẦN TRẢ LỜI). Khách mạng xã hội rất dị ứng đọc tin dài.
- TỶ LỆ LẮNG NGHE 80/20: Luôn nhường khách hàng nói nhiều hơn bằng cách LUÔN kết thúc câu trả lời bằng 1 câu hỏi gợi mở ngắn gọn.
- KHÔNG BAO GIỜ KHUYÊN BẢO ĐẠO LÝ.
- BẮT BUỘC: Nếu trong tin nhắn của khách hàng có CUNG CẤP SỐ ĐIỆN THOẠI (hoặc Email), bạn PHẢI gọi ngay lập tức Công cụ (Tool/Function) "save_lead_to_crm" để lưu lại!
`;

// --- ĐỊNH NGHĨA TOOLS (GEMINI FUNCTION CALLING) ---
const saveLeadDeclaration: FunctionDeclaration = {
    name: "save_lead_to_crm",
    description: "Bắt buộc gọi hàm này NGAY LẬP TỨC khi phát hiện đoạn chat của khách dường như đang để lại Số Điện Thoại hoặc Email. Việc gọi hàm này là điều cốt lõi để lưu dữ liệu khách hàng vào hệ thống Google Sheet của CRM.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            phone: { type: SchemaType.STRING, description: "Số điện thoại do khách hàng cung cấp. Vd: 0912345678" },
            email: { type: SchemaType.STRING, description: "Email do khách hàng cung cấp (nếu có)." },
            name: { type: SchemaType.STRING, description: "Tên xưng hô nếu biết." }
        },
        required: ["phone"]
    }
};

// 1. GỬI TIN NHẮN CHO KHÁCH HÀNG
async function sendFacebookMessage(senderId: string, text: string) {
    if (!PAGE_ACCESS_TOKEN) return;
    try {
        await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient: { id: senderId },
                message: { text: text }
            })
        });
    } catch (error) {
        console.error("Lỗi gửi tin nhắn Facebook:", error);
    }
}

// 2. XỬ LÝ MESSAGE & STATE VỚI AI
async function processMessageInBackground(senderId: string, userText: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            await sendFacebookMessage(senderId, "Hệ thống AI đang bảo trì, anh/chị vui lòng để lại số điện thoại nha!");
            return;
        }

        // Lấy hoặc tạo Session (Agent Memory) mới cho Khách hàng này
        let chatSession = userChatSessions.get(senderId);
        
        if (!chatSession) {
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ functionDeclarations: [saveLeadDeclaration] }],
                generationConfig: { temperature: 0.3 } 
            });
            chatSession = model.startChat({ history: [] }); // Trí nhớ bắt đầu từ con số 0
            userChatSessions.set(senderId, chatSession);
            console.log(`[🤖 STATEFUL] Tạo mới Chat Session cho User: ${senderId}`);
        } else {
            console.log(`[🤖 STATEFUL] Khôi phục Trí Nhớ Chat Session cho User: ${senderId}`);
        }

        // Gửi tin nhắn vào Memory của Gemini
        const result = await chatSession.sendMessage(userText);
        
        // Kiểm tra xem Gemini có tự kích hoạt TOOL (Function Calling) không?
        const functionCall = result.response.functionCalls()?.[0];
        
        if (functionCall && functionCall.name === "save_lead_to_crm") {
            const args = functionCall.args;
            console.log(`[⚡️ TOOL KÍCH HOẠT] ${senderId} vừa cấp Contact -> Lưu CRM: `, args);
            
            try {
                // Đẩy thông tin xuống Sheet CRM (Hàm bạn đã có sẵn)
                await syncLeadToGoogleSheet({
                    name: args.name || "Khách Inbound Facebook",
                    email: args.email || "",
                    phone: args.phone || "",
                    agent: "FinPeace FB AI (Stateful)",
                    source: "Facebook Messenger"
                });
                
                // Ký hiệu phản hồi lại cho mô hình biết rằng Tool đã thực thi TỐT.
                const toolResponse = await chatSession.sendMessage([{
                    functionResponse: {
                        name: "save_lead_to_crm",
                        response: { status: "success", text: "Đã lưu số điện thoại khách thành công vào hệ thống. Xin hãy gửi một lời cảm ơn và bảo chuyên gia giám đốc sẽ gọi lại." }
                    }
                }]);
                
                // Trả lời cảm ơn ra Messenger
                await sendFacebookMessage(senderId, toolResponse.response.text());
                return;

            } catch (err) {
                 console.error("Lỗi khi lưu tool CRM:", err);
                 await sendFacebookMessage(senderId, "Tuyệt vời, cảm ơn anh/chị. Em đã ghi nhận SĐT rồi nhé, Chuyên gia giám đốc FinPeace sẽ liên hệ với mình trong thời gian sớm nhất!");
                 return;
            }
        } 
        
        // Nếu không dùng Tool, chỉ gửi tin nhắn trò chuyện (Phases) bình thường
        const aiTextReply = result.response.text();
        await sendFacebookMessage(senderId, aiTextReply);

    } catch (error) {
        console.error("Lỗi xử lý AI nền:", error);
    }
}

// ====================================================
// WEBHOOK VERIFICATION (GET) 
// ====================================================
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ FB Webhook Verified');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }
    return new NextResponse('Invalid Request', { status: 400 });
}

// ====================================================
// NHẬN TIN NHẮN TỪ KHÁCH HÀNG (POST)
// ====================================================
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.object === 'page') {
            body.entry?.forEach((entry: any) => {
                const webhookEvent = entry.messaging?.[0];
                if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
                    const senderId = webhookEvent.sender.id;
                    const messageText = webhookEvent.message.text;

                    // Gọi tiến trình nền (Stateful Model)
                    processMessageInBackground(senderId, messageText);
                }
            });

            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        } else {
            return new NextResponse('Not Found', { status: 404 });
        }
    } catch (error) {
        console.error('❌ Lỗi Facebook Webhook POST:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
