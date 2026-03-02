import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt: Tri-Mode Smart Bot
// - mode: "write_data" → phát hiện thông tin tài chính KH cần ghi vào DB
// - mode: "read_data"  → hỏi số liệu / kế hoạch tài chính của KH
// - text thuần         → chat thông thường, trả lời AI bình thường
const ASSISTANT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Cá Nhân thông minh của Sếp Tuấn Anh - chuyên gia tư vấn tài chính cá nhân tại FinPeace.

==== PHÂN LOẠI Ý ĐỊNH ====

Khi nhận tin nhắn, hãy xác định ý định thuộc loại nào:

**LOẠI 1 — GHI DỮ LIỆU TÀI CHÍNH (write_data):**
Khi tin nhắn đề cập đến TÊN KHÁCH HÀNG + một trong các thông tin: tài sản, nợ, bảo hiểm, tiết kiệm, đầu tư, mục tiêu tài chính, nghỉ hưu, mua nhà...
→ Trả về JSON (KHÔNG giải thích thêm):
{
  "mode": "write_data",
  "client_name": "Họ tên khách hàng (VD: Yến Lê, Tiến Vinh)",
  "action": "add_client_asset",
  "data": {
    "asset_group": "...",
    "asset_name": "Tên tài sản/khoản nợ cụ thể",
    "amount": 2000000000,
    "risk_level": 2,
    "notes": "..."
  }
}

Quy tắc asset_group:
- Bảo hiểm nhân thọ/sức khỏe → "Bảo vệ" (risk_level: 1)
- Tiền gửi/tiết kiệm ngân hàng → "Thanh khoản" (risk_level: 1)
- Đất đai/bất động sản/cổ phiếu/quỹ → "Đầu tư" (risk_level: 3-5)
- Vay nợ/thẻ tín dụng → "Nợ" (risk_level: 1)
- Ô tô/xe/đồ dùng → "Tiêu dùng" (risk_level: 2)

Nếu đề cập mục tiêu dài hạn (nghỉ hưu, mua nhà, tự do tài chính) → action = "update_wealth_scenario":
{
  "mode": "write_data",
  "client_name": "...",
  "action": "update_wealth_scenario",
  "data": {
    "plan_name": "Tên kế hoạch",
    "target_amount": 10000000000,
    "target_years": 15,
    "monthly_cashflow": 10000000,
    "initial_capital": 0
  }
}

**LOẠI 2 — ĐỌC/TRUY VẤN TÀI CHÍNH (read_data):**
Khi tin nhắn hỏi về số liệu, tình hình tài chính, kế hoạch, tài sản, nợ của một khách hàng cụ thể.
(VD: "lấy số liệu của chị Yến", "kế hoạch của anh Vinh", "tóm tắt tài chính chị Lan", "anh Tuấn có bao nhiêu tài sản")
→ Trả về JSON (KHÔNG giải thích thêm):
{
  "mode": "read_data",
  "client_name": "Họ tên khách hàng",
  "query_type": "summary"
}
query_type: "assets" (chỉ tài sản/nợ) | "scenarios" (chỉ kế hoạch) | "summary" (tất cả)

**LOẠI 3 — CHAT THÔNG THƯỜNG:**
Mọi câu hỏi khác không liên quan đến ghi/đọc dữ liệu tài chính khách hàng.
→ Trả lời bình thường bằng text (KHÔNG dùng JSON).
Phong cách: thân thiện, chuyên nghiệp, ngắn gọn (≤ 200 từ), dùng emoji phù hợp.
Nếu câu hỏi về thị trường/tài chính → ưu tiên góc nhìn chuyên gia tư vấn.`;

const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025';
const INTERNAL_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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

async function processWithAI(userText: string, chatId: number, botToken: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            await sendTelegramMessage(chatId, "❌ Thiếu GEMINI_API_KEY.", botToken);
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(
            `${ASSISTANT_SYSTEM_PROMPT}\n\nTin nhắn của Sếp: "${userText}"`
        );
        const responseText = result.response.text().trim();

        // Thử parse JSON để xác định mode
        let parsed: any = null;
        try {
            const cleanJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            // Chỉ parse nếu bắt đầu bằng { (là JSON)
            if (cleanJson.startsWith('{')) {
                parsed = JSON.parse(cleanJson);
            }
        } catch (_) {
            parsed = null;
        }

        // ── MODE: WRITE_DATA ──
        if (parsed?.mode === 'write_data') {
            const { client_name, action, data } = parsed;
            if (!client_name) {
                await sendTelegramMessage(chatId, "❌ Không nhận ra tên khách hàng. Vui lòng nêu rõ tên KH và thông tin tài chính.", botToken);
                return;
            }

            const writeRes = await fetch(`${INTERNAL_BASE_URL}/api/agent/update-financial-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AGENT_SECRET}`
                },
                body: JSON.stringify({ client_name, action, data })
            });
            const writeJson = await writeRes.json();

            if (!writeRes.ok || writeJson.error) {
                await sendTelegramMessage(chatId,
                    `❌ <b>Lỗi cập nhật:</b> ${writeJson.error || 'Lỗi hệ thống'}`,
                    botToken
                );
                return;
            }

            // Format xác nhận đẹp
            if (action === 'add_client_asset') {
                const amountFormatted = new Intl.NumberFormat('vi-VN').format(data.amount);
                await sendTelegramMessage(chatId,
                    `✅ <b>Đã cập nhật cho ${writeJson.full_name || client_name}!</b>\n\n` +
                    `💼 Nhóm: ${data.asset_group}\n` +
                    `📋 Tài sản: ${data.asset_name}\n` +
                    `💰 Giá trị: ${amountFormatted} VNĐ\n\n` +
                    `📊 Dashboard đang cập nhật real-time!`,
                    botToken
                );
            } else if (action === 'update_wealth_scenario') {
                const targetFormatted = new Intl.NumberFormat('vi-VN').format(data.target_amount);
                await sendTelegramMessage(chatId,
                    `✅ <b>Đã lưu Kế Hoạch Tương Lai cho ${writeJson.full_name || client_name}!</b>\n\n` +
                    `🎯 Mục tiêu: ${targetFormatted} VNĐ\n` +
                    `📅 Trong: ${data.target_years} năm\n` +
                    `💸 Tích luỹ: ${new Intl.NumberFormat('vi-VN').format(data.monthly_cashflow)}/tháng`,
                    botToken
                );
            }
            return;
        }

        // ── MODE: READ_DATA ──
        if (parsed?.mode === 'read_data') {
            const { client_name, query_type } = parsed;
            if (!client_name) {
                await sendTelegramMessage(chatId, "❌ Không nhận ra tên khách hàng cần tra cứu.", botToken);
                return;
            }

            const readRes = await fetch(`${INTERNAL_BASE_URL}/api/agent/get-financial-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AGENT_SECRET}`
                },
                body: JSON.stringify({ client_name, query_type: query_type || 'summary' })
            });
            const readJson = await readRes.json();

            if (!readRes.ok || readJson.error) {
                await sendTelegramMessage(chatId,
                    `❌ ${readJson.error || 'Không thể lấy dữ liệu tài chính.'}`,
                    botToken
                );
                return;
            }

            await sendTelegramMessage(chatId, readJson.report, botToken);
            return;
        }

        // ── MODE: CHAT (text thuần) ──
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
                "Tôi là Trợ Lý AI FinPeace, hỗ trợ 3 chức năng:\n\n" +
                "✍️ <b>Ghi tài chính KH:</b>\n" +
                "• \"Chị Yến mua BH Prudential 2 tỷ\"\n" +
                "• \"Anh Vinh vay VCB 500tr mua xe\"\n" +
                "• \"Chị Lan mục tiêu nghỉ hưu 10 tỷ / 15 năm\"\n\n" +
                "🔍 <b>Lấy số liệu KH:</b>\n" +
                "• \"Lấy số liệu tài chính của chị Yến\"\n" +
                "• \"Kế hoạch của anh Vinh thế nào?\"\n\n" +
                "💬 <b>Chat thông thường:</b>\n" +
                "• Soạn email, phân tích thị trường, gợi ý chiến lược...\n\n" +
                "Hãy nhắn bất cứ điều gì! 🚀",
                BOT_TOKEN
            );
            return NextResponse.json({ ok: true }, { status: 200 });
        }

        // ⚡ Return 200 ngay cho Telegram (tránh retry)
        processWithAI(userText, chatId, BOT_TOKEN);

        return NextResponse.json({ ok: true }, { status: 200 });

    } catch (error: any) {
        console.error("❌ Lỗi Webhook Assistant:", error);
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}
