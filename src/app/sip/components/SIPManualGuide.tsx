'use client';

import React from 'react';
import {
  BookOpen, ShieldCheck, Target, TrendingUp, Award,
  HelpCircle, MessageCircle, AlertTriangle, CheckCircle2,
  Compass, Layers, HeartHandshake, Sparkles, UserCheck
} from 'lucide-react';

export default function SIPManualGuide() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>CẨM NANG VÀ TRIẾT LÝ TÍCH SẢN FINPEACE (SIP MANUAL & CFP FRAMEWORK)</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          Khung Hoạch Định Quản Lý Gia Sản & Tác Phẩm "Bình An Tài Chính"
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Tích hợp chuẩn mực Hoạch định Tài chính Quốc tế (CFP) cùng triết lý thực chiến từ cuốn sách <i>"Bình An Tài Chính"</i> của Chủ tịch FinPeace Nguyễn Tuấn Anh & Chuyên gia Yến Lê.
        </p>
      </div>

      {/* 1. LỘ TRÌNH 3 VÙNG ĐẤT TÀI CHÍNH */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
          <Compass className="w-4 h-4" />
          <span>1. BẢN ĐỒ TÂM LÝ: HÀNH TRÌNH QUA 3 VÙNG ĐẤT TÀI CHÍNH</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tài chính không chỉ là những con số vô hồn trên bảng điện. Đó là hành trình dịch chuyển tâm lý từ nỗi sợ hãi đến sự tự do tự thân:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-400">Giai đoạn 1</span>
            <div className="font-bold text-white text-sm">🏜️ VÙNG ĐẤT HOANG</div>
            <p className="text-slate-400">
              Khách hàng cảm thấy bất an, mơ hồ về tiền bạc, né tránh nhìn vào tài khoản ngân hàng, dễ bị cảm xúc xoa dịu dẫn đến chi tiêu mất kiểm soát hoặc rơi vào bẫy đòn bẩy nợ nần.
            </p>
            <div className="text-amber-300/90 font-semibold text-[11px] pt-1 border-t border-slate-800">
              👉 Vai trò Advisor: Thấu cảm, lắng nghe, giúp khách hàng dũng cảm nhìn thẳng vào sự thật tài chính mà không phán xét.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-amber-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">Giai đoạn 2</span>
            <div className="font-bold text-white text-sm">🌱 VÙNG ĐẤT KIỂM SOÁT & PHÁT TRIỂN</div>
            <p className="text-slate-400">
              Khởi động tư duy <strong>Pay Yourself First (Trả cho mình trước 20-30%)</strong>, xây dựng Hầm trú ẩn (Quỹ khẩn cấp), dựng Tháp tài sản và khởi động cỗ máy tích sản cổ phiếu dài hạn SIP.
            </p>
            <div className="text-amber-300/90 font-semibold text-[11px] pt-1 border-t border-slate-800">
              👉 Vai trò Advisor: Người Huấn luyện viên (Wealth Coach) giám sát kỷ luật gom mua định kỳ theo đúng định giá nội tại.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Giai đoạn 3</span>
            <div className="font-bold text-white text-sm">🏝️ VÙNG ĐẤT BÌNH AN</div>
            <p className="text-slate-400">
              Đạt tới trạng thái <strong>Tài chính tự thân</strong>: Cỗ máy Vốn tài chính làm việc thay Vốn con người, tạo ra dòng tiền cổ tức an nhàn, sống tự tin và an yên trọn vẹn trong hiện tại.
            </p>
            <div className="text-emerald-400 font-semibold text-[11px] pt-1 border-t border-slate-800">
              👉 Vai trò Advisor: Cùng khách hàng bảo toàn di sản gia đình, chuyển giao giá trị và tri thức tài chính cho thế hệ con cháu.
            </div>
          </div>
        </div>
      </div>

      {/* 2. MÔ HÌNH THÁP TÀI SẢN 3 TẦNG */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
          <Layers className="w-4 h-4" />
          <span>2. MÔ HÌNH THÁP TÀI SẢN (THE ASSET PYRAMID RULES)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Nguyên tắc xây tháp bất di bất dịch của FinPeace: <strong>Xây từ gốc lên ngọn</strong>. Khách hàng không bao giờ được nhảy bổ vào đầu tư mạo hiểm khi chân đế chưa vững:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 font-mono font-black text-sm">TẦNG 1</div>
            <div className="space-y-1">
              <strong className="text-white text-sm">Tài Sản Bảo Vệ (Chân Đế Vững Chắc)</strong>
              <p className="text-slate-400">
                Gồm <strong>Hầm Trú Ẩn (Quỹ Khẩn Cấp 3 - 6 tháng chi phí sinh hoạt gửi tiết kiệm)</strong> và <strong>Áo Giáp (Bảo hiểm nhân thọ/sức khỏe bảo vệ người trụ cột)</strong>. Đảm bảo dù sóng gió bão tố bất ngờ ập đến, gia đình không bao giờ phải bán tháo cổ phiếu hay bán rẻ tài sản.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-amber-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black text-sm">TẦNG 2</div>
            <div className="space-y-1">
              <strong className="text-amber-400 text-sm">Cỗ Máy Tích Sản Tạo Dòng Tiền & Tăng Trưởng (Lõi Danh Mục)</strong>
              <p className="text-slate-300">
                Tập trung vào <strong>Cổ phiếu Tích sản SIP FinPeace</strong> (Doanh nghiệp đầu ngành, Moat lớn, trả cổ tức tiền mặt và tăng trưởng bền vững qua các chu kỳ kinh tế). Chiếm <strong>70% - 90%</strong> tài sản tài chính của khách hàng.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 font-mono font-black text-sm">TẦNG 3</div>
            <div className="space-y-1">
              <strong className="text-white text-sm">Tài Sản Mạo Hiểm (Đỉnh Tháp)</strong>
              <p className="text-slate-400">
                Đầu cơ ngắn hạn (trading lướt sóng, tiền kỹ thuật số). Khuyến nghị phân bổ tối đa <strong>2% - 5%</strong> tổng tài sản. Đóng vai trò trải nghiệm thị trường chứ không được phép ảnh hưởng đến sự bình an tài chính của gia đình.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MA TRẬN TÂM LÝ HỌC DISC TRONG TƯ VẤN */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase">
          <UserCheck className="w-4 h-4" />
          <span>3. MA TRẬN TÍNH CÁCH ĐẦU TƯ DISC & NGHỆ THUẬT TƯ VẤN (WEALTH COACHING)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="font-bold text-rose-400 text-sm">🚀 Nhóm D (Dominance) - Người Kiến Tạo</div>
            <p className="text-slate-300">
              <strong>Đặc điểm:</strong> Quyết đoán, thích chinh phục mục tiêu lớn, thích tốc độ và bứt phá. Dễ mạo hiểm dùng margin hoặc mua dồn một mã.
            </p>
            <div className="text-slate-400 italic">
              💬 <strong>Cách tư vấn:</strong> Nhấn mạnh mục tiêu tài sản lớn, đề xuất các mã chu kỳ thu hoạch lớn (HPG, FRT, GMD, TCX). Luôn nhắc nhở: <i>"Người chiến thắng vĩ đại nhất là người sống sót qua mọi cuộc suy thoái mà không cháy tài khoản."</i>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="font-bold text-amber-400 text-sm">🤝 Nhóm I (Influence) - Người Kết Nối</div>
            <p className="text-slate-300">
              <strong>Đặc điểm:</strong> Nhiệt huyết, thích giao lưu bạn bè, dễ bị cuốn theo các trào lưu đám đông trên mạng xã hội (FOMO).
            </p>
            <div className="text-slate-400 italic">
              💬 <strong>Cách tư vấn:</strong> Giúp khách hàng thiết lập lịch trích tiền gom mua tự động vào ngày cố định hàng tháng (DCA) để loại bỏ cảm xúc nhất thời, đề xuất các thương hiệu quốc dân quen thuộc (MWG, FPT, MBB).
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">🛡️ Nhóm S (Steadiness) - Người Nuôi Dưỡng</div>
            <p className="text-slate-300">
              <strong>Đặc điểm:</strong> Điềm tĩnh, yêu thích sự ổn định, kiên nhẫn và bền bỉ. Đây là nhóm đối tượng <strong>hoàn hảo nhất</strong> cho chiến lược tích sản SIP.
            </p>
            <div className="text-slate-400 italic">
              💬 <strong>Cách tư vấn:</strong> Nhấn mạnh sự an toàn tuyệt đối của VCB, VNM, MIG, ACB. Cho khách thấy dòng tiền cổ tức tiền mặt đều đặn như nguồn thu nhập thứ hai nuôi dưỡng gia đình.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
            <div className="font-bold text-sky-400 text-sm">📊 Nhóm C (Conscientiousness) - Nhà Hoạch Định</div>
            <p className="text-slate-300">
              <strong>Đặc điểm:</strong> Tỉ mỉ, yêu số liệu, nghiên cứu kỹ từng dòng BCTC. Tuy nhiên dễ mắc bẫy "tê liệt vì phân tích" (Analysis Paralysis), bỏ lỡ điểm mua vì quá cầu toàn.
            </p>
            <div className="text-slate-400 italic">
              💬 <strong>Cách tư vấn:</strong> Cung cấp báo cáo định giá P/E Fair, Sanity Check Consensus của các CTCK hàng đầu (Vietcap, SSI, HSC) và công thức Biên an toàn &gt;10% để thuyết phục lý trí của họ.
            </div>
          </div>
        </div>
      </div>

      {/* 4. ĐIỂM NGỌT SINH LỜI (THE SWEET SPOT) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase">
          <Award className="w-4 h-4" />
          <span>4. ĐIỂM NGỌT SINH LỜI (THE SWEET SPOT: 12% - 18%/NĂM)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tích sản FinPeace không cổ vũ khách hàng ảo tưởng làm giàu sau một đêm. Chúng tôi hướng tới điểm ngọt sinh lời tối ưu:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="font-bold text-slate-300">Tiết kiệm Ngân hàng</div>
            <div className="text-lg font-black font-mono text-slate-400 mt-1">4.5% - 6.0%</div>
            <p className="text-[11px] text-slate-500 mt-1">An toàn nhưng không chống trượt giá và lạm phát dài hạn (giá nhà đất tăng 10-15%/năm).</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="font-bold text-amber-400">Điểm Ngọt Tích Sản FinPeace</div>
            <div className="text-lg font-black font-mono text-amber-300 mt-1">12.0% - 18.0%</div>
            <p className="text-[11px] text-slate-300 mt-1">Gấp 2.5 - 3 lần lãi suất tiết kiệm. Vốn tăng gấp đôi sau 4-5 năm nhờ sức mạnh lãi kép.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="font-bold text-rose-400">Kỳ vọng Siêu lợi nhuận</div>
            <div className="text-lg font-black font-mono text-rose-400 mt-1">&gt; 25% - 35%</div>
            <p className="text-[11px] text-slate-500 mt-1">Thường đòi hỏi đòn bẩy lớn, rủi ro mất vốn cực cao, phá vỡ sự bình an trong tâm trí.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
