import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { Resend } from 'resend';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const systemInstruction = `Bạn là trợ lý Chuyên gia Phân tích Đầu tư Cấp cao của FinPeace.
Nhiệm vụ của bạn là chắp bút viết ra các "Hồ Sơ Đầu Tư Tích Sản" (Marketing Material dùng để Sales gửi khách hàng Zalo/Email) dựa trên những số liệu khô khan (Giá hiện tại, Giá trị nội tại, Tăng trưởng, Business Outlook).
Văn phong yêu cầu: 
- Thuyết phục, chắc chắn, tập trung vào phương pháp Đầu tư Tích Sản (SIP), dùng các từ ngữ mạnh như "không thể thay thế", "cơ hội lịch sử", "tuyệt vời", "kỷ luật", "mua và quên đi", "kỳ quan".
- Cấm đưa vào những lời khuyên đầu cơ, đầu tư ngắn hạn, mua lướt sóng.
- Trình bày dạng Markdown với Header đầy đủ rõ ràng.`;

const TEMPLATE = `
HÃY DÙNG CHÍNH XÁC CẤU TRÚC SAU ĐÂY VỚI SỐ LIỆU TƯƠNG ỨNG:

[Mã Cổ Phiếu]
HỒ SƠ ĐẦU TƯ TÍCH SẢN [Tên Đầy Đủ Doanh Nghiệp]
"[SLOGAN 3-5 TỪ MẠNH MẼ VỀ ƯU ĐIỂM CỐT LÕI]"
[1 Câu Slogan Phụ 3 Yếu Tố - Ví dụ: Tầm nhìn 10 năm - Vị thế số 1 - Tăng trưởng bền vững]
Cập nhật: [Ngày hiện tại]

[1 Câu mở đoạn đầy cảm xúc thuyết phục hãy đầu tư vào đây]
- Giá thị trường tại thời điểm báo cáo: [current_price]
- Giá mua tích sản tối đa: [max_buy_price]

### TẠI SAO LÀ [Mã Cổ Phiếu] CHO NHÀ ĐẦU TƯ BẬN RỘN?
Nếu bạn không có thời gian theo dõi bảng điện hàng ngày, hãy chọn doanh nghiệp "không thể thay thế". 
- Giá trị nội tại: [intrinsic_value] đ (Hiện tại đang được định giá RẺ so với giá trị thực).
- Mức tăng trưởng kỳ vọng: >[expected_growth] / năm (Duy trì bền vững trong dài hạn).
- Vị thế: [Cập nhật ngắn gọn 1 câu siêu mạnh về vị thế cty dựa vào Data Business Outlook]

### 3 ĐIỂM NHẤN CHIẾN LƯỢC
[Dựa vào thông tin Business Outlook, sinh ra 3 điểm nhấn chiến lược định dạng Header 4: #### 1. [Tên Cú Hích]. Dưới mỗi Header là các gạch đầu dòng phân tích bằng những lời lẽ Marketing cuốn hút thay vì số liệu cứng ngắc]

### BẢNG SO SÁNH NHANH CHO NHÀ ĐẦU TƯ
[Tạo bảng chứa các cột: Chỉ số | Hiện tại/Dự báo | Ý nghĩa với Nhà đầu tư. Đưa Giá trị Nội Tại, KQKD 5 năm tới vào]

### CHIẾN LƯỢC TÍCH SẢN ĐƠN GIẢN CHO "NEWBIE"
Cốt lõi triết lý Đầu tư Tích Sản (SIP - Systematic Investment Plan) tại FinPeace:
- Kỷ luật đơn giản: Chỉ cần mua khi giá không vượt quá [max_buy_price] đ. Đây là vùng giá rủi ro thấp để nắm giữ dài hạn. Định kỳ đầu tư hàng tháng/quý không quan tâm bảng điện.
- Triết lý: "Mua và quên đi". Hãy để lãi kép và sức mạnh của nền kinh tế Việt Nam làm việc cho tài khoản của bạn.
Lưu ý & Miễn trừ:
Báo cáo dựa trên các phân tích cơ bản và số liệu dự báo tăng trưởng. NĐT đăng ký chương trình Đồng hành Tích sản cùng FinPeace để cập nhật dữ liệu liên tục hằng Quý.
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const TARGETS = ['FPT', 'MBB', 'PNJ'];
  console.log('Fetching data for', TARGETS.join(', '));
  
  const { data: valuations, error } = await supabase
    .from('sip_asset_valuations')
    .select('stock_code, new_intrinsic_value, max_buy_price, expected_growth, business_outlook')
    .in('stock_code', TARGETS);
    
  if (error || !valuations) {
    console.error('Error fetching data', error);
    return;
  }
  
  const uniqueVals = [];
  const seenStr = new Set();
  for (const v of valuations) {
    if(!seenStr.has(v.stock_code)) {
      uniqueVals.push(v);
      seenStr.add(v.stock_code);
    }
  }

  const { data: prices } = await supabase
    .from('stock_prices')
    .select('ticker, price')
    .in('ticker', TARGETS)
    .order('date', { ascending: false });

  const getPrice = (t) => {
    const p = prices?.find(p => p.ticker === t)?.price;
    return p ? p * 1000 : null; 
  };

  let combinedMarkdown = '# KẾT QUẢ GEN POC - HỒ SƠ TÍCH SẢN TỰ ĐỘNG (FPT, MBB, PNJ)\n\n---\n\n';

  for (const val of uniqueVals) {
    const cp = getPrice(val.stock_code) || (val.max_buy_price ? Number(val.max_buy_price) * 0.9 : 0);
    const intValue = val.new_intrinsic_value ? Number(val.new_intrinsic_value).toLocaleString('vi-VN') : 'Đang cập nhật';
    const mbPrice = val.max_buy_price ? Number(val.max_buy_price).toLocaleString('vi-VN') : 'Đang cập nhật';
    
    let gro = val.expected_growth || 'TBD';
    if (!isNaN(gro) && Number(gro) <= 1) {
      gro = (Number(gro) * 100) + '%';
    } else {
      gro = String(gro);
    }

    const context = `
      MÃ CỔ PHIẾU: ${val.stock_code}
      GIÁ HIỆN TẠI (Current Price): ${cp.toLocaleString('vi-VN')} đ
      GIÁ ĐỊNH GIÁ (Intrinsic Value): ${intValue} đ
      GIÁ MUA TỐI ĐA TÍCH SẢN (Max Buy Price): ${mbPrice} đ
      TĂNG TRƯỞNG KỲ VỌNG: ${gro}
      ===== BUSINESS OUTLOOK (Dữ liệu nền tảng làm nguyên liệu) =====
      ${val.business_outlook}
    `;

    const prompt = `Viết "Hồ sơ Đầu tư Tích sản" cho mã cổ phiếu ${val.stock_code} dựa trên form mẫu BẮT BUỘC dưới đây và dữ liệu do Hệ thống thu thập cung cấp. Đảm bảo ngôn từ Marketing lôi kéo khách đăng ký Tích Sản.

    ${context}
    
    ============= FORM MẪU BẮT BUỘC ==============
    ${TEMPLATE}
    `;
    
    console.log(`Generating profile for ${val.stock_code} via Groq Llama 3...`);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content || '';
      combinedMarkdown += text + '\n\n---\n\n';
      await delay(1000);
    } catch(e) {
      console.error(`Failed on ${val.stock_code}:`, e.message);
    }
  }

  const artifactPath = '/Users/tuananhnguyen/.gemini/antigravity/brain/c0e8b002-c0d6-4496-ae32-63bceee76487/sales_profile_poc.md';
  fs.writeFileSync(artifactPath, combinedMarkdown, 'utf-8');
  console.log(`Saved backup to ${artifactPath}`);

  // Use marked to generate clean HTML
  const { marked } = await import('marked');
  const htmlContent = marked.parse(combinedMarkdown);

  console.log('Sending email...');
  
  const emailToSend = async (toEmail) => {
      return await resend.emails.send({
        from: 'FinPeace System <advisor@finpeace.cloud>',
        to: toEmail,
        subject: '[PoC] Demo Khởi tạo Tự động Hồ Sơ Tích Sản (Sales Material) bằng AI',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="padding: 15px; border-radius: 8px; background: #e0f2fe; border: 1px solid #7dd3fc; margin-bottom: 30px;">
              <h2 style="margin-top:0; color: #0284c7;">Antigravity Llama 3 System Notification</h2>
              <p>Chào anh Tuấn Anh và chị Yến,<br/>
              Đây là Bản chạy thử (Proof of Concept) của hệ thống tạo <b>Hồ Sơ Đầu Tư Tích Sản tự động</b> bằng LLaMA-3 thay cho Gemini (do giới hạn free tier).</p>
            </div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              ${htmlContent}
            </div>
          </div>
        `
      });
  }

  try {
     const res1 = await emailToSend('nguyeneric81@gmail.com');
     console.log('Sent to Eric:', res1);
  } catch(e) { console.error('Failed to send to Eric', e)}
  
  try {
     const res2 = await emailToSend('yenle@finpeace.vn');
     console.log('Sent to Yen:', res2);
  } catch(e) { console.error('Failed to send to Yen', e)}
}

main().catch(console.error);
