import { Resend } from 'resend'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.RESEND_FROM_EMAIL || 'FinPeace Advisor <advisor@finpeace.cloud>'

const apiKey = 'fp_mcp_Rtxf-BwxaNZtu8_q_lP9qRaNrXdJALIm'
const userName = 'Yến Lê'
const userEmail = 'yenle@finpeace.vn'
const serverUrl = 'https://finpeace.vn/api/mcp'

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; color: #94a3b8; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }
    .key-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 18px; margin: 20px 0; text-align: center; }
    .key-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .key-value { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 16px; font-weight: 700; color: #0284c7; word-break: break-all; }
    .section-title { font-size: 16px; font-weight: 700; margin: 24px 0 12px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .code-block { background: #0f172a; color: #f8fafc; border-radius: 8px; padding: 16px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 13px; overflow-x: auto; margin: 12px 0; }
    .prompt-list { background: #f8fafc; border-radius: 8px; padding: 16px 20px; border-left: 4px solid #0ea5e9; margin: 16px 0; }
    .prompt-list li { margin-bottom: 8px; font-size: 14px; color: #334155; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 13px; color: #64748b; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px; margin-left: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FinPeace Corporate MCP</h1>
      <p>Cấp quyền truy cập Kho Dữ Liệu BCTC & Phân tích Doanh nghiệp</p>
    </div>
    
    <div class="content">
      <div class="greeting">Chào chị ${userName},</div>
      <p>Hệ thống FinPeace AI xin gửi thông tin cấp quyền quản trị viên cao cấp (Admin) đối với <strong>FinPeace MCP Server</strong>. Máy chủ này kết nối trực tiếp với Data Warehouse gồm <strong>1.524 doanh nghiệp niêm yết (HOSE, HNX, UPCOM)</strong> và hơn <strong>14.500 bản ghi BCTC</strong> chuẩn hóa.</p>
      
      <div class="key-box">
        <div class="key-label">API KEY CỦA CHỊ (QUYỀN ADMIN - VĨNH VIỄN)</div>
        <div class="key-value">${apiKey}</div>
      </div>

      <div class="section-title">1. Hướng Dẫn Kết Nối Với Claude Desktop / Cursor</div>
      <p style="font-size: 14px; color: #475569;">Chị chỉ cần thêm cấu hình sau vào file cấu hình MCP của Claude Desktop (<code>claude_desktop_config.json</code>) hoặc Cursor IDE:</p>
      
      <div class="code-block">
{
  "mcpServers": {
    "finpeace-data": {
      "serverUrl": "${serverUrl}",
      "env": {
        "Authorization": "Bearer ${apiKey}"
      }
    }
  }
}
      </div>

      <div class="section-title">2. Các Câu Hỏi Mẫu Chị Có Thể Chat Trực Tiếp Với AI</div>
      <div class="prompt-list">
        <ul>
          <li><strong>Hồ sơ công ty:</strong> <em>"Cho tôi biết mã HPG niêm yết sàn nào, thuộc ngành gì và tên đầy đủ?"</em></li>
          <li><strong>Báo cáo KQKD:</strong> <em>"Tóm tắt doanh thu và lợi nhuận sau thuế của TCB trong 4 quý gần nhất?"</em></li>
          <li><strong>Cân đối kế toán & Ngân hàng:</strong> <em>"Kiểm tra Tổng tài sản, Dư nợ cho vay và Tiền gửi khách hàng của Techcombank?"</em></li>
          <li><strong>So sánh cổ phiếu:</strong> <em>"So sánh doanh thu và lợi nhuận 4 quý gần đây của HPG, NKG và HSG?"</em></li>
          <li><strong>Chỉ tiêu chuyên sâu:</strong> <em>"Tìm khoản mục Chi phí dự phòng rủi ro và Chi phí lãi vay của MBB?"</em></li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #475569; margin-top: 24px;">Nếu chị cần hỗ trợ cấu hình hoặc mở rộng thêm các chỉ số chuyên sâu, xin vui lòng liên hệ đội ngũ kỹ thuật FinPeace.</p>
    </div>

    <div class="footer">
      <p style="margin: 0;">FinPeace Technology Ecosystem &bull; Empowering Financial Freedom</p>
    </div>
  </div>
</body>
</html>
`

async function sendMail() {
    console.log(`Đang gửi email tới: ${userEmail}...`)
    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [userEmail],
            subject: '[FinPeace AI] Cấp quyền & Hướng dẫn kết nối FinPeace Corporate MCP Server',
            html: htmlContent
        })

        if (error) {
            console.error('❌ Lỗi gửi mail Resend:', error)
        } else {
            console.log('✅ GỬI EMAIL THÀNH CÔNG! Email ID:', data?.id)
        }
    } catch (err) {
        console.error('❌ Exception khi gửi mail:', err)
    }
}

sendMail()
