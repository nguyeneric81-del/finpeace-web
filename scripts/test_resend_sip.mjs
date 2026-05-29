import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env from finpeace-web/.env.local
const envPath = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local';
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const resend = new Resend(envConfig.RESEND_API_KEY);

async function sendTestEmail() {
  const clientName = "Nguyễn Tuấn Anh";
  const clientEmail = "nguyeneric81@gmail.com";
  const ticker = "GAS";
  const fullName = "Tổng Công ty Khí Việt Nam - CTCP";
  const quarter = "Quý I/2026";
  const date = "07/05/2026";
  
  const bizReview = "Quý 1/2026, PV GAS (GAS) ghi nhận doanh thu thuần 38.020 tỷ đồng (hoàn thành ~26,8% kế hoạch) và lợi nhuận sau thuế đạt 2.994 tỷ đồng (hoàn thành khoảng 33,2% – 33,3% kế hoạch năm). Dù doanh thu tăng mạnh, biên lợi nhuận bị thu hẹp do giá vốn tăng nhanh.";
  const sipReview = "Với những biến động khó lường của tình hình chiến sự trên thế giới, ảnh hưởng trực tiếp đến nguồn cung xăng dầu, giá cố phiếu GAS tăng rất mạnh và sau đó đã điều chỉnh về vùng hợp lý, Nhà đầu tư có thể tiếp tục tích sản.";
  const status = "Đạt kỳ vọng kế hoạch kinh doanh";
  const intrinsicValue = "85,690";
  const maxPrice = "77,121";
  const recommendation = "Duy trì tích sản khi giá thị trường **NHỎ HƠN** giá tích sản tối đa";

  // Read purple banner for CID attachment
  const imagePath = '/Users/tuananhnguyen/.gemini/antigravity/brain/0e418469-f536-4cf7-b3b8-43b68d7037b9/scratch/header_small.jpg';
  const bannerBuffer = fs.readFileSync(imagePath);

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: sans-serif, Arial, Helvetica; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
  .wrapper { background-color: #f8f9fa; padding: 20px 10px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .header img { width: 100%; height: auto; display: block; border: 0; }
  .content { padding: 30px; }
  .section-title { font-weight: bold; color: #1a1a1a; margin-top: 25px; margin-bottom: 10px; font-size: 18px; border-bottom: 2px solid #9c27b0; display: inline-block; padding-bottom: 2px; }
  .table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #f0f0f0; }
  .table th, .table td { border: 1px solid #f0f0f0; padding: 12px; text-align: left; font-size: 14px; }
  .table th { background-color: #fbfbfb; font-weight: bold; color: #555; }
  .ticker-header { background-color: #1a1a1a; color: #ffffff !important; }
  .recommendation-cell { color: #9c27b0; font-weight: bold; }
  p { margin-bottom: 15px; }
  .highlight-box { background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9c27b0; }
</style>
</head>
<body>
<div class="wrapper">
<div class="container">
  <div class="header">
    <img src="cid:banner_sip" alt="FinPeace SIP Banner" width="600">
  </div>
  <div class="content">
    <p>Mến chào Quý khách <strong>${clientName}</strong>,</p>
    <p>Cảm ơn Quý khách đã đồng hành cùng FinPeace trong chương trình <strong>ĐỒNG HÀNH TÍCH SẢN CỔ PHIẾU</strong>.</p>
    <p>FinPeace cập nhật kết quả kinh doanh cổ phiếu <strong>${ticker}</strong> ${quarter} như sau:</p>
    
    <table class="table">
      <tr>
        <td colspan="2" class="ticker-header" style="background-color: #1a1a1a; color: #ffffff; padding: 15px;"><strong>${fullName} (${ticker})</strong></td>
      </tr>
      <tr>
        <td style="background-color: #fdfdfd;"><strong>Ngày cập nhật: ${date}</strong></td>
        <td style="background-color: #fdfdfd;"></td>
      </tr>
    </table>

    <div class="section-title">➢ Nhận định về doanh nghiệp</div>
    <p>${bizReview}</p>

    <div class="section-title">➢ Nhận định về tích sản</div>
    <p>${sipReview}</p>

    <div class="highlight-box">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; color: #666; font-size: 12px;">Tình trạng</th>
            <th style="text-align: center; padding: 8px; color: #666; font-size: 12px;">Giá trị nội tại</th>
            <th style="text-align: center; padding: 8px; color: #666; font-size: 12px;">Tích sản tối đa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold;">${status}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 16px;">${intrinsicValue}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 16px; color: #9c27b0;">${maxPrice}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <span style="font-size: 12px; color: #666;">Khuyến nghị:</span><br>
        <strong style="color: #9c27b0; font-size: 15px;">${recommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</strong>
      </div>
    </div>

    <p style="margin-top: 30px;">Nếu có bất cứ thắc mắc nào, Quý khách vui lòng liên hệ <strong>0567883888 (Hotline CSKH)</strong> hoặc <strong>0946941276 (Nhân viên CSKH Thư)</strong> để nhận được sự hỗ trợ.</p>
    <p>Chúc Quý khách sớm đạt mục tiêu tài chính.</p>
    <p>Trân trọng,<br><strong style="color: #9c27b0;">FinPeace Advisor</strong></p>
  </div>
</div>
</div>
</body>
</html>
  `;

  console.log(`Sending CID-embedded email to ${clientEmail}...`);

  try {
    const { data, error } = await resend.emails.send({
      from: envConfig.RESEND_FROM_EMAIL || 'FinPeace Advisor <advisor@finpeace.cloud>',
      to: [clientEmail],
      subject: `[FinPeace] Cập nhật Kết quả Kinh doanh ${ticker} - ${quarter}`,
      html: htmlTemplate,
      attachments: [
        {
          filename: 'banner_sip.jpg',
          content: bannerBuffer,
          content_id: 'banner_sip',
        }
      ]
    });

    if (error) {
      console.error('Error from Resend:', error);
    } else {
      console.log('Email sent successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

sendTestEmail();
