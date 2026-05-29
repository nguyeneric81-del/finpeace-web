import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load env from finpeace-web folder since we are executing in workspace root or finpeace-web
dotenv.config({ path: '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const filePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/4f04de1b-10be-4864-8bbb-0d5da20f56f7/brokerage_advisory_sop.md';
  const mdContent = fs.readFileSync(filePath, 'utf-8');
  
  // Convert MD to HTML for the email body
  const htmlContent = marked.parse(mdContent);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="padding: 15px; border-radius: 8px; background: #f0fdf4; border: 1px solid #86efac; margin-bottom: 30px;">
        <h2 style="margin-top:0; color: #166534;">Antigravity Hệ Thống Thông Báo</h2>
        <p>Kính gửi Ban Giám Đốc,<br/>
        Theo yêu cầu, Trợ lý AI xin gửi anh/chị <b>Sổ tay Vận hành: Quy chuẩn Kiểm soát Chất lượng Tư vấn Đầu tư</b> mới nhất.<br/>
        Chi tiết nội dung đã được chuyển hóa bên dưới, anh/chị cũng có thể tải file đính kèm.</p>
      </div>
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        ${htmlContent}
      </div>
    </div>
  `;

  console.log('Sending email to nguyeneric81@gmail.com and yenle@finpeace.vn via Resend...');

  try {
    const data = await resend.emails.send({
      from: 'FinPeace System <advisor@finpeace.cloud>',
      to: ['nguyeneric81@gmail.com', 'yenle@finpeace.vn'],
      subject: '[FINPEACE] Sổ tay Vận hành & Quy chuẩn Kiểm soát Môi giới (Chính Thức)',
      html: htmlBody,
      attachments: [
        {
          filename: 'brokerage_advisory_sop.md',
          content: fs.readFileSync(filePath)
        }
      ]
    });
    console.log('Email sent successfully!', data);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

main().catch(console.error);
