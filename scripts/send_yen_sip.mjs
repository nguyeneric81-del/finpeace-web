import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env from finpeace-web/.env.local
const envPath = '/Users/tuananhnguyen/workspace-gravity/finpeace-web/.env.local';
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const resend = new Resend(envConfig.RESEND_API_KEY);

async function sendSipEmail(clientName, clientEmail, ticker, fullName, quarter, date, bizReview, sipReview, status, intrinsicValue, maxPrice, recommendation) {
  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: sans-serif, Arial, Helvetica; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
  .wrapper { background-color: #f8f9fa; padding: 40px 10px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .header { padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f0; }
  .header img { height: 40px; width: auto; }
  .content { padding: 40px; }
  .section-title { font-weight: bold; color: #1a1a1a; margin-top: 30px; margin-bottom: 12px; font-size: 18px; border-bottom: 2px solid #00b060; display: inline-block; padding-bottom: 2px; }
  .table { width: 100%; border-collapse: collapse; margin: 25px 0; border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; }
  .table th, .table td { border: 1px solid #f0f0f0; padding: 15px; text-align: left; font-size: 14px; }
  .table th { background-color: #fbfbfb; font-weight: bold; color: #555; }
  .ticker-header { background-color: #1a1a1a; color: #ffffff !important; }
  .footer { font-size: 12px; color: #888; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
  .recommendation-cell { color: #00b060; font-weight: bold; }
  p { margin-bottom: 18px; }
  .highlight-box { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00b060; }
</style>
</head>
<body>
<div class="wrapper">
<div class="container">
  <div class="header">
    <img src="https://finpeace.cloud/logo.png" alt="FinPeace Logo">
  </div>
  <div class="content">
    <p>Mến chào Quý khách <strong>${clientName}</strong>,</p>
    <p>Cảm ơn Quý khách đã đồng hành cùng FinPeace trong chương trình <strong>ĐỒNG HÀNH TÍCH SẢN CỔ PHIẾU</strong>.</p>
    <p>FinPeace cập nhật kết quả kinh doanh cổ phiếu <strong>${ticker}</strong> ${quarter} như sau:</p>
    
    <table class="table">
      <tr>
        <td colspan="2" class="ticker-header" style="background-color: #1a1a1a; color: #ffffff; padding: 18px;"><strong>${fullName} (${ticker})</strong></td>
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
            <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 16px; color: #00b060;">${maxPrice}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <span style="font-size: 12px; color: #666;">Khuyến nghị:</span><br>
        <strong style="color: #00b060; font-size: 15px;">${recommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</strong>
      </div>
    </div>

    <p style="margin-top: 35px;">Nếu có bất cứ thắc mắc nào, Quý khách vui lòng liên hệ hotline <strong style="color: #00b060;">0946941276 (Thư)</strong> để nhận được sự hỗ trợ.</p>
    <p>Chúc Quý khách sớm đạt mục tiêu tài chính.</p>
    <p>Trân trọng,<br><strong style="color: #00b060;">FinPeace Advisor</strong></p>
  </div>
</div>
</div>
</body>
</html>
  `;

  console.log(`Sending email to ${clientName} (${clientEmail})...`);

  try {
    const { data, error } = await resend.emails.send({
      from: envConfig.RESEND_FROM_EMAIL || 'FinPeace Advisor <advisor@finpeace.cloud>',
      to: [clientEmail],
      subject: `[FinPeace] Cập nhật Kết quả Kinh doanh ${ticker} - ${quarter}`,
      html: htmlTemplate,
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

// Data for Le Hai Yen (MIG)
const yenData = {
  clientName: "Lê Hải Yến",
  clientEmail: "yenle@finpeace.vn",
  ticker: "MIG",
  fullName: "Tổng Công ty cổ phần Bảo hiểm Quân Đội",
  quarter: "Quý I/2026",
  date: "07/05/2026",
  bizReview: "Trong quý 1/2026, MIG ghi nhận doanh thu phí bảo hiểm đạt 1.409,47 tỷ đồng (tăng 7,3% so với cùng kỳ) và lợi nhuận sau thuế đạt 102,23 tỷ đồng (tăng 1,77% so với cùng kỳ). So với kế hoạch năm 2026, lợi nhuận quý 1 đã hoàn thành khoảng 18,6% mục tiêu năm.",
  sipReview: "Với KQKD Quý 1 duy trì được sự ổn định và kế hoạch kinh doanh đầy tham vọng, MIG phù hợp cho mục tiêu đầu tư trung và dài hạn, đặc biệt là khi 'game' tìm kiếm cổ đông chiến lược được hiện thực hóa.",
  status: "Đạt kỳ vọng kế hoạch kinh doanh",
  intrinsicValue: "21,500",
  maxPrice: "19,350",
  recommendation: "Duy trì tích sản khi giá thị trường **NHỎ HƠN** giá tích sản tối đa"
};

sendSipEmail(
  yenData.clientName,
  yenData.clientEmail,
  yenData.ticker,
  yenData.fullName,
  yenData.quarter,
  yenData.date,
  yenData.bizReview,
  yenData.sipReview,
  yenData.status,
  yenData.intrinsicValue,
  yenData.maxPrice,
  yenData.recommendation
);
