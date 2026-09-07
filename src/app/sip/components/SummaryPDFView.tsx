'use client';

import React, { useState } from 'react';
import {
  Printer, Copy, Check, ArrowLeft, ShieldCheck, Award,
  Sparkles, Building, Phone, Calendar, User, FileText,
  TrendingUp, CheckCircle, QrCode, Compass, HeartHandshake,
  Shield, Layers
} from 'lucide-react';
import { ClientKYCInfo, FinancialGoal, SIPStock } from '../types';
import { evaluateCFPHealth } from '../utils/tvmEngine';

interface Props {
  clientKYC: ClientKYCInfo;
  goals: FinancialGoal[];
  stocks: SIPStock[];
  onBackToKYC: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

export default function SummaryPDFView({
  clientKYC,
  goals,
  stocks,
  onBackToKYC
}: Props) {
  const [copied, setCopied] = useState(false);
  const totalMonthlyAll = goals.reduce((acc, g) => acc + g.monthlyContribution, 0);
  const cfpHealth = evaluateCFPHealth(clientKYC, totalMonthlyAll);

  // In trang sang PDF chuẩn khổ A4
  const handlePrint = () => {
    window.print();
  };

  // Copy tóm tắt kịch bản gửi Zalo/Telegram
  const handleCopyZaloMessage = () => {
    let text = `📋 BẢN KẾ HOẠCH TÍCH SẢN BÌNH AN TÀI CHÍNH (FINPEACE SIP)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 Khách hàng: ${clientKYC.fullName || 'Quý khách'} (Mã: ${clientKYC.clientId})\n`;
    text += `🧭 Vị thế: ${
      clientKYC.currentLand === 'wasteland'
        ? 'Vùng Đất Hoang ➔ Đang chuyển giao'
        : clientKYC.currentLand === 'peace_oasis'
        ? 'Vùng Đất Bình An'
        : 'Vùng Đất Kiểm Soát & Phát Triển'
    }\n`;
    text += `🧠 Hồ sơ DISC: Nhóm ${clientKYC.discType} (${
      clientKYC.discType === 'S'
        ? 'Người Nuôi Dưỡng - Bền bỉ, an toàn'
        : clientKYC.discType === 'D'
        ? 'Người Kiến Tạo - Quyết đoán, bứt phá'
        : clientKYC.discType === 'C'
        ? 'Nhà Hoạch Định - Chuẩn mực, số liệu'
        : 'Người Kết Nối - Sôi nổi, cân bằng'
    })\n`;
    text += `🛡️ Hầm trú ẩn (Quỹ khẩn cấp): ${clientKYC.emergencyFundMonths} tháng chi tiêu (${cfpHealth.emergencyStatus === 'secure' ? 'Vững chắc' : 'Cần bổ sung'})\n`;
    text += `💰 Tỷ lệ tích sản PYF (Trả cho mình trước): ${cfpHealth.pyfRate}% thu nhập\n`;
    text += `👨‍💼 Chuyên viên tư vấn: ${clientKYC.advisorName || 'FinPeace Advisor'} (${clientKYC.advisorPhone || 'Hotline FinPeace'})\n\n`;

    goals.forEach((g, idx) => {
      const targetBillion = (g.targetAmount / 1e9).toFixed(2);
      const monthlyMillion = (g.monthlyContribution / 1e6).toFixed(1);
      text += `🎯 MỤC TIÊU ${idx + 1}: ${g.name.toUpperCase()}\n`;
      text += `• Số tiền mục tiêu: ${targetBillion} TỶ ĐỒNG sau ${g.years} NĂM\n`;
      text += `• Dòng tiền tích sản: ${monthlyMillion} TRIỆU/THÁNG\n`;
      text += `• Tăng trưởng bình quân cần đạt (CAGR): ${g.requiredAnnualReturn}%/NĂM (Điểm ngọt FinPeace)\n`;
      text += `• Rổ cổ phiếu tích sản đề xuất (Tầng 2 Tháp Tài Sản):\n`;

      g.suggestedPortfolio.forEach(p => {
        text += `   + [${p.ticker}] ${p.name}: ${p.weightPct}% (${fmt(p.monthlyAmount)}đ/tháng) — Giá mua tối đa: ${fmt(p.maxBuyPrice)}đ (${p.cta})\n`;
      });
      text += `\n`;
    });

    text += `💡 4 NGUYÊN TẮC VÀNG TÍCH SẢN (SÁCH BÌNH AN TÀI CHÍNH):\n`;
    text += `1. Gom mua định kỳ hàng tháng (DCA), không phỏng đoán đỉnh đáy ngắn hạn.\n`;
    text += `2. Chỉ mua khi thị giá dưới Giá tích sản tối đa (Biên an toàn >10%).\n`;
    text += `3. Giữ vững Tầng 1 Tháp tài sản (Hầm trú ẩn 3-6 tháng lương).\n`;
    text += `4. Định kỳ hàng quý FinPeace cùng quý khách review KQKD doanh nghiệp.\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👉 Cần hỗ trợ lệnh gom mua hoặc thắc mắc, quý khách liên hệ hotline ${clientKYC.advisorPhone || '0988.888.888'} để được hỗ trợ tức thì!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Ẩn khi in ấn) */}
      <div className="print:hidden p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToKYC}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chỉnh sửa KYC</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyZaloMessage}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép kịch bản Zalo!' : 'Copy Tin Nhắn Gửi Zalo/Telegram'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu File PDF (Chuẩn A4)</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* KHUNG TRANG A4 BÁO CÁO TỔNG HỢP (PRINT STYLES OPTIMIZED)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        id="sip-pdf-content"
        className="mx-auto max-w-4xl bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-6 print:max-w-none print:rounded-none font-sans"
      >
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-amber-500 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950">FINPEACE</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold tracking-widest uppercase">
                Bình An Tài Chính
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống Hoạch định Quản lý Gia sản Theo Chuẩn Quốc Tế (CFP Standard)
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase">Mã Hồ Sơ KYC</div>
            <div className="text-base font-black font-mono text-amber-600">{clientKYC.clientId}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ngày lập: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            BẢN KẾ HOẠCH TÍCH SẢN CỔ PHIẾU DÀI HẠN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ứng dụng Mô hình Tháp Tài Sản 3 Tầng & Chiến lược Tích sản Hệ thống (FinPeace SIP)
          </p>
        </div>

        {/* Client & Advisor Profile Cards */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6">
          <div>
            <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-amber-800 uppercase">
              <User className="w-3.5 h-3.5" />
              <span>HỒ SƠ KHÁCH HÀNG (CFP KYC)</span>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Họ và tên:</span> <strong className="text-slate-800">{clientKYC.fullName || 'Quý khách'}</strong></div>
              <div><span className="text-slate-500">Số điện thoại:</span> <span className="font-mono text-slate-800">{clientKYC.phone || 'N/A'}</span></div>
              <div><span className="text-slate-500">Năm sinh / Tuổi:</span> <span className="text-slate-800">{clientKYC.birthYear || 'N/A'} ({cfpHealth.age} tuổi)</span></div>
              <div>
                <span className="text-slate-500">Vị trí bản đồ:</span>{' '}
                <strong className="text-slate-700">
                  {clientKYC.currentLand === 'wasteland' ? 'Vùng Đất Hoang (Đang tái thiết)' : clientKYC.currentLand === 'peace_oasis' ? 'Vùng Đất Bình An' : 'Vùng Đất Kiểm Soát & Phát Triển'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Tính cách DISC:</span>{' '}
                <span className="font-bold text-emerald-700">
                  Nhóm {clientKYC.discType} - {
                    clientKYC.discType === 'S' ? 'Người Nuôi Dưỡng (Bền bỉ, an toàn)' :
                    clientKYC.discType === 'D' ? 'Người Kiến Tạo (Quyết đoán, bứt phá)' :
                    clientKYC.discType === 'C' ? 'Nhà Hoạch Định (Chuẩn mực, BCTC)' :
                    'Người Kết Nối (Cân bằng, sôi nổi)'
                  }
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-amber-800 uppercase">
              <Building className="w-3.5 h-3.5" />
              <span>ĐÁNH GIÁ SỨC KHỎE TÀI CHÍNH</span>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-500">Chuyên viên phụ trách:</span> <strong className="text-slate-800">{clientKYC.advisorName || 'Nguyễn Tuấn Anh'}</strong></div>
              <div><span className="text-slate-500">Hotline / Zalo:</span> <span className="font-mono text-slate-800">{clientKYC.advisorPhone || '0988 888 888'}</span></div>
              <div>
                <span className="text-slate-500">Tầng 1 (Hầm Trú Ẩn):</span>{' '}
                <span className={`font-semibold ${cfpHealth.emergencyStatus === 'secure' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {clientKYC.emergencyFundMonths} tháng chi tiêu ({cfpHealth.emergencyStatus === 'secure' ? 'Vững chắc' : 'Đang tích lũy'})
                </span>
              </div>
              <div>
                <span className="text-slate-500">Tỷ lệ tiết kiệm PYF:</span>{' '}
                <strong className="font-mono text-emerald-700">{cfpHealth.pyfRate}% thu nhập</strong>
              </div>
              <div>
                <span className="text-slate-500">Phân bổ 100 - Tuổi:</span>{' '}
                <span className="text-slate-700 font-medium">Tăng trưởng {cfpHealth.growthAllocationTarget}% • Phòng thủ {cfpHealth.defensiveAllocationTarget}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mô hình Tháp Tài Sản 3 Tầng */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs mb-6 space-y-2">
          <div className="font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wide">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>MÔ HÌNH THÁP TÀI SẢN 3 TẦNG (TRÍCH SÁCH BÌNH AN TÀI CHÍNH)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-slate-700 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-amber-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tầng 1 (Chân Đế)</span>
              <strong className="text-slate-800 block text-xs mt-0.5">Tài Sản Bảo Vệ</strong>
              <span className="text-[11px] text-slate-500">Quỹ khẩn cấp 3-6 tháng + Bảo hiểm sức khỏe</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Tầng 2 (Thân Tháp - Đang Lập)</span>
              <strong className="text-amber-900 block text-xs mt-0.5">Cỗ Máy Tích Sản SIP</strong>
              <span className="text-[11px] text-amber-800 font-semibold">Cổ phiếu Core FinPeace (CAGR 12-18%/năm)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-amber-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tầng 3 (Đỉnh Tháp)</span>
              <strong className="text-slate-800 block text-xs mt-0.5">Tài Sản Mạo Hiểm</strong>
              <span className="text-[11px] text-slate-500">Đầu cơ trading ngắn hạn (tối đa 2% - 5%)</span>
            </div>
          </div>
        </div>

        {/* Goals & TVM Results */}
        <div className="space-y-6 mb-6">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>1. KẾ HOẠCH ĐA MỤC TIÊU & TỶ SUẤT TĂNG TRƯỞNG YÊU CẦU</span>
            </h2>
            <span className="text-[11px] text-slate-500">Thuật toán TVM Goal-Seeking</span>
          </div>

          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={goal.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900 text-sm">
                    {idx + 1}. {goal.name}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black font-mono">
                    CAGR cần đạt: {goal.requiredAnnualReturn}% / năm
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs py-2 bg-slate-50 rounded-lg px-3">
                  <div>
                    <span className="text-slate-500 block">Số tiền mục tiêu (FV)</span>
                    <strong className="font-mono text-slate-900">{fmt(goal.targetAmount)} đ</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Thời gian tích lũy</span>
                    <strong className="font-mono text-slate-900">{goal.years} năm ({goal.years * 12} tháng)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Vốn ban đầu (PV)</span>
                    <strong className="font-mono text-slate-900">{fmt(goal.initialCapital)} đ</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tích sản mỗi tháng</span>
                    <strong className="font-mono text-emerald-700">{fmt(goal.monthlyContribution)} đ/tháng</strong>
                  </div>
                </div>

                {/* Suggested Portfolio Table */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 mb-1.5">
                    Danh mục cổ phiếu tích sản khuyến nghị cho mục tiêu này:
                  </div>
                  <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">Mã CP</th>
                        <th className="py-2 px-2.5">Doanh Nghiệp</th>
                        <th className="py-2 px-2 text-right">Thị Giá</th>
                        <th className="py-2 px-2 text-right">Giá Mua Tối Đa</th>
                        <th className="py-2 px-2 text-center">Tỷ Trọng</th>
                        <th className="py-2 px-2.5 text-right">Giải Ngân/Tháng</th>
                        <th className="py-2 px-2.5 text-center">Trạng Thái CTA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {goal.suggestedPortfolio.map(p => (
                        <tr key={p.ticker}>
                          <td className="py-2 px-2.5 font-black font-mono text-amber-700">{p.ticker}</td>
                          <td className="py-2 px-2.5 text-slate-700">{p.name}</td>
                          <td className="py-2 px-2 text-right font-mono text-slate-600">{fmt(p.currentPrice)} đ</td>
                          <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-700">{fmt(p.maxBuyPrice)} đ</td>
                          <td className="py-2 px-2 text-center font-bold text-slate-800">{p.weightPct}%</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-700">{fmt(p.monthlyAmount)} đ</td>
                          <td className="py-2 px-2.5 text-center font-semibold text-emerald-700 text-[11px]">{p.cta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triết lý sách Bình An Tài Chính */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. BỐN NGUYÊN TẮC VÀNG TÍCH SẢN FINPEACE (BÌNH AN TÀI CHÍNH)</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div>
              <strong>1. Tiêu chí Không Chết:</strong> Doanh nghiệp sở hữu Moat vững chắc, dòng tiền kinh doanh dương, khó giảm quá 50% LNST trong 5 năm tới.
            </div>
            <div>
              <strong>2. Tăng trưởng Bền vững:</strong> Lợi nhuận tăng trưởng 2 chữ số đều đặn qua các chu kỳ kinh tế lớn.
            </div>
            <div>
              <strong>3. Biên An Toàn Định Giá:</strong> Luôn mua dưới Giá tích sản tối đa (chiết khấu &gt;10% so với Giá trị Nội tại).
            </div>
            <div>
              <strong>4. Kỷ Luật Pay Yourself First:</strong> Tích sản ngay đầu mỗi tháng khi có thu nhập, không dùng đòn bẩy margin, không phỏng đoán đỉnh đáy.
            </div>
          </div>
        </div>

        {/* Trích dẫn sách */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/60 text-center my-6">
          <p className="text-xs font-serif italic text-slate-700 leading-relaxed">
            "Bình an tài chính không có nghĩa là bạn phải sở hữu số tiền khổng lồ. Nó có nghĩa là bạn biết rõ mình đang ở đâu, đang đi về đâu, và an tâm vào con đường tích lũy kỷ luật mỗi ngày."
          </p>
          <span className="text-[10px] text-amber-800 font-bold mt-1 block">
            — Nguyễn Tuấn Anh & Yến Lê (Trích sách "Bình An Tài Chính" 2025)
          </span>
        </div>

        {/* Signature Block */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="font-bold text-slate-800 uppercase">KHÁCH HÀNG XÁC NHẬN</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cam kết kỷ luật và đồng hành</div>
            <div className="h-16 flex items-end justify-center font-semibold text-slate-600">
              {clientKYC.fullName || '................................................'}
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-800 uppercase">ĐẠI DIỆN FINPEACE WEALTH ADVISORY</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Xác nhận và theo dõi định kỳ</div>
            <div className="h-16 flex items-end justify-center font-semibold text-slate-800">
              {clientKYC.advisorName || 'Nguyễn Tuấn Anh'}
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 pt-6 mt-6 border-t border-slate-100">
          Tài liệu được phát hành bởi Hệ sinh thái FinPeace. Dữ liệu định giá cập nhật theo BCTC Q2/2026 và chuẩn mực CFP.
        </div>
      </div>
    </div>
  );
}
