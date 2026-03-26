'use client'

import React, { useEffect, useRef } from 'react'
import {
  Compass, ShieldAlert, Target, TrendingUp, Handshake,
  Brain, FileSearch, ArrowRight, Zap, Target as TargetIcon, 
  Leaf, TreePine, Droplet, Users, ShieldCheck, Flame, ChevronDown
} from 'lucide-react'

export default function TrainingDeckClient() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Quick helper to scroll to next slide
  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[#020617] text-slate-200"
      style={{ scrollBehavior: 'smooth', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}
    >
      
      {/* SLIDE 1: INTRO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center p-12 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#020617] to-[#020617] opacity-60 pointer-events-none" />
        <div className="z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold tracking-widest uppercase text-sm mb-8 animate-fade-in">
            <Compass className="w-5 h-5" /> PHASE 1: RESET MINDSET
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-8 leading-tight tracking-tight">
            Đừng chỉ là Sale, <br/>hãy là Wealth Advisor
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            Hành trình lột xác từ "người bán lệnh 3 chữ cái" trở thành vị Kiến trúc sư Quản trị Tài sản chuyên nghiệp.
          </p>
        </div>
        <button onClick={scrollDown} className="absolute bottom-12 animate-bounce p-4 rounded-full bg-white/5 hover:bg-white/10 transition">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </button>
      </section>

      {/* SLIDE 2: SỰ THẬT MẤT LÒNG */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[#0B1120]">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16 flex items-center gap-6">
            <ShieldAlert className="w-16 h-16 text-rose-500" /> Tại sao Khách Hàng Không Tin Broker Nữa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 p-10 rounded-3xl border border-rose-500/20">
              <span className="text-6xl font-black text-slate-800 mb-6 block">01</span>
              <h3 className="text-3xl font-bold text-white mb-4">Giá trị 3 chữ cái = 0</h3>
              <p className="text-xl text-slate-400 leading-relaxed">Tin tức tràn lan F319, Zalo, Tiktok. Khách hàng không cần rước thêm một người "phím mã" vô thưởng vô phạt.</p>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-3xl border border-rose-500/20">
              <span className="text-6xl font-black text-slate-800 mb-6 block">02</span>
              <h3 className="text-3xl font-bold text-white mb-4">Xung đột Đẫm Máu</h3>
              <p className="text-xl text-slate-400 leading-relaxed">Sống bằng Phí giao dịch nảy sinh động cơ ép khách lướt sóng liên tục (Overtrading). Khách hàng sẽ hình thành cơ chế phòng vệ.</p>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-3xl border border-rose-500/20">
              <span className="text-6xl font-black text-slate-800 mb-6 block">03</span>
              <h3 className="text-3xl font-bold text-white mb-4">Mất Tích Lúc Giông Bão</h3>
              <p className="text-xl text-slate-400 leading-relaxed">Khi thị trường sập, Broker lặn mất tăm vì không có Kịch Bản Rủi Ro (Stress Test). Khách hàng bị bỏ rơi lúc cần điểm tựa nhất.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 3: WEALTH ADVISOR */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-gradient-to-br from-[#020617] to-slate-900">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-emerald-400 mb-8 flex items-center gap-6">
            <TreePine className="w-16 h-16" /> Kỷ Nguyên Chăm Cây Sinh Mệnh
          </h2>
          <blockquote className="text-3xl text-slate-300 italic mb-16 border-l-4 border-emerald-500 pl-8 font-light">
            "Khách hàng không mua mũi khoan, họ mua cái lỗ trên tường. Trên TTCK, khách hàng không mua cổ phiếu, họ mua <strong>Sự An Tâm</strong> và <strong>Sự Thịnh Vượng dài hạn</strong>."
          </blockquote>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <Brain className="w-12 h-12 text-sky-400 shrink-0 mt-2" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Quản Trị Hành Vi</h3>
                  <p className="text-xl text-slate-400">Trói tay khách FOMO đu đỉnh. Ép khách dứt khoát cắt lỗ khi vi phạm kỷ luật của Trading Plan.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <ShieldCheck className="w-12 h-12 text-amber-400 shrink-0 mt-2" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Kê Toa Rủi Ro</h3>
                  <p className="text-xl text-slate-400">Không ảo tưởng lợi nhuận, phải kéo khách về mặt đất bằng các kịch bản Mỏ Neo Khủng Hoảng (Stress Test).</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-10 rounded-3xl border border-slate-700 flex flex-col justify-center">
               <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center">UX Trình Bày Mới: The Scrollytelling</h3>
               <ul className="space-y-6 text-xl text-slate-300">
                 <li className="flex items-center gap-4"><CheckCircle size={28} className="text-emerald-400"/> Không Bảng Giá loạn xạ chớp nháy.</li>
                 <li className="flex items-center gap-4"><CheckCircle size={28} className="text-emerald-400"/> Bật iPad, Kéo Slide What-if định đoạt tương lai.</li>
                 <li className="flex items-center gap-4"><CheckCircle size={28} className="text-emerald-400"/> Lấy NAV Tăng Trưởng làm thành tích.</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 4: INBOUND VS OUTBOUND */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[#020617]">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-12 flex items-center gap-6">
            <Users className="w-16 h-16 text-sky-400" /> Triết Lý Inbound: Thu Hút vs Ép Buộc
          </h2>
          
          <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/50 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="p-8 text-2xl font-bold text-slate-400 border-b border-slate-700 w-1/4">Tiêu Chí</th>
                  <th className="p-8 text-3xl font-bold text-rose-400 border-b border-r border-slate-700 w-[37.5%] bg-rose-500/5">Outbound (Broker Cũ)</th>
                  <th className="p-8 text-3xl font-bold text-emerald-400 border-b border-slate-700 w-[37.5%] bg-emerald-500/5">Inbound (FinPeace)</th>
                </tr>
              </thead>
              <tbody className="text-xl">
                <tr>
                  <td className="p-8 font-semibold text-slate-300 border-b border-slate-700">Mục tiêu</td>
                  <td className="p-8 text-slate-400 border-b border-r border-slate-700">Bắn SMS hàng loạt, Cold Call quấy rối mọi data trôi nổi.</td>
                  <td className="p-8 text-slate-300 border-b border-slate-700">Thu hút NĐT CÓ NHU CẦU thật bằng Content Trí Tuệ (VVIA).</td>
                </tr>
                <tr>
                  <td className="p-8 font-semibold text-slate-300 border-b border-slate-700">Giao tiếp</td>
                  <td className="p-8 text-slate-400 border-b border-r border-slate-700">Một chiều. dồn khách vào góc tường.</td>
                  <td className="p-8 text-slate-300 border-b border-slate-700">Hai chiều. Khách hàng chủ động tự đọc LP và nộp Form hỏi han.</td>
                </tr>
                <tr>
                  <td className="p-8 font-semibold text-slate-300">Tỷ lệ Chuyển đổi</td>
                  <td className="p-8 text-slate-400 border-r border-slate-700">Rất thấp. Nhanh nản, mất động lực nghề.</td>
                  <td className="p-8 text-slate-300 font-bold text-emerald-400">Siêu cao. Xây Trust đậm đặc từ điểm chạm đầu.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SLIDE 5: BUYER JOURNEY */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-slate-900">
         <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16 flex items-center gap-6">
            <Target className="w-16 h-16 text-amber-500" /> Giải Phẫu 3 Tầng Tâm Lý Mua Hàng
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            {/* Step 1 */}
            <div className="flex-1 bg-[#020617] p-10 rounded-3xl border-t-8 border-rose-500 shadow-xl relative mt-0">
               <span className="absolute -top-6 left-10 bg-rose-500 text-white font-black text-xl px-6 py-2 rounded-full">Giai Đoạn 1</span>
               <h3 className="text-4xl font-black text-white mt-4 mb-6">NHẬN THỨC</h3>
               <p className="text-xl text-slate-400 mb-6 font-light">Khách hàng mới phát hiện ra đống đổ nát (Gồng lỗ, F0 hoang mang).</p>
               <div className="bg-rose-500/10 p-5 rounded-xl border border-rose-500/20">
                 <p className="text-lg text-rose-300 font-medium italic">"Làm sao để gọi tên Nỗi Đau của họ bằng ngôn từ sắc lẹm nhất?"</p>
               </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex-1 bg-[#020617] p-10 rounded-3xl border-t-8 border-amber-400 shadow-xl relative mt-8 md:mt-0">
               <span className="absolute -top-6 left-10 bg-amber-400 text-slate-900 font-black text-xl px-6 py-2 rounded-full">Giai Đoạn 2</span>
               <h3 className="text-4xl font-black text-white mt-4 mb-6">CÂN NHẮC</h3>
               <p className="text-xl text-slate-400 mb-6 font-light">Đi tìm thuốc chữa. Khách dò hỏi vô số Môi giới và Khóa học khác nhau.</p>
               <div className="bg-amber-500/10 p-5 rounded-xl border border-amber-500/20">
                 <p className="text-lg text-amber-300 font-medium italic">"FinPeace Blueprint khác biệt gì so với Room Phím Hàng Telegram?"</p>
               </div>
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-[#020617] p-10 rounded-3xl border-t-8 border-emerald-500 shadow-xl relative mt-8 md:mt-0">
               <span className="absolute -top-6 left-10 bg-emerald-500 text-white font-black text-xl px-6 py-2 rounded-full">Giai Đoạn 3</span>
               <h3 className="text-4xl font-black text-white mt-4 mb-6">QUYẾT ĐỊNH</h3>
               <p className="text-xl text-slate-400 mb-6 font-light">Lập danh sách chung kết. Chọn Ký Uỷ quyền và Xuống Tiền.</p>
               <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/20">
                 <p className="text-lg text-emerald-300 font-medium italic">"Tại sao họ phải Uỷ Quyền cho BẠN NGAY HÔM NAY thay vì ngày mai?"</p>
               </div>
            </div>
          </div>
         </div>
      </section>

      {/* SLIDE 6: THỰC CHIẾN - DỌN RÁC */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[#020617]">
         <div className="max-w-6xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold tracking-widest uppercase text-sm mb-12 animate-fade-in">
            <Flame className="w-5 h-5" /> THỰC CHIẾN TẠI LỚP
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-white mb-12">
            Đứng lên và Trả Lời!
          </h2>
          <p className="text-3xl text-slate-400 font-light mb-16 max-w-4xl mx-auto leading-relaxed">
            Ngừng viện cớ. Nghĩ ngay đến 1 khách hàng Tồi Tệ Nhất hoặc Đáng Thương Nhất trong danh bạ của bạn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <span className="text-5xl font-black text-emerald-400 mb-6 block">01</span>
              <p className="text-2xl text-white font-bold leading-snug">Anh/Chị ấy đang CẦN GIÚP điều gì Nhất vào lúc này?</p>
            </div>
            <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 transition-delay-100">
              <span className="text-5xl font-black text-emerald-400 mb-6 block">02</span>
              <p className="text-2xl text-white font-bold leading-snug">Tài chính có đang là vấn đề LỚN NHẤT tàn phá họ không?</p>
            </div>
            <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 transition-delay-200">
              <span className="text-5xl font-black text-emerald-400 mb-6 block">03</span>
              <p className="text-2xl text-white font-bold leading-snug">Nếu tài chính vững, ĐỜI SỐNG của họ sẽ tốt hơn thế nào?</p>
            </div>
          </div>
         </div>
      </section>

      {/* SLIDE 7: KPI */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900 via-[#020617] to-[#020617]">
         <div className="max-w-5xl mx-auto w-full text-center">
          <Zap className="w-24 h-24 text-amber-400 mx-auto mb-10" />
          <h2 className="text-6xl md:text-8xl font-black text-white mb-16 uppercase tracking-tight">
            QUY TẮC <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">3 x 10</span>
          </h2>
          <p className="text-3xl text-slate-300 font-light mb-16 leading-relaxed">
            Bạn không được phép đứng lên khỏi bàn trong tuần này nếu chưa hoàn thành:
          </p>
          
          <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-center gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl text-emerald-400 border border-emerald-500/50 shrink-0">1</div>
              <p className="text-3xl text-white font-medium">Viết rõ Bệnh án (Nhu cầu cốt lõi) của <strong className="text-emerald-400">10 Khách cũ</strong>.</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl text-sky-400 border border-sky-500/50 shrink-0">2</div>
              <p className="text-3xl text-white font-medium">Viết tay <strong className="text-sky-400">10 Lời Đề Nghị (Offer)</strong> đâm trúng tim đen đó.</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl text-rose-400 border border-rose-500/50 shrink-0">3</div>
              <p className="text-3xl text-white font-medium">Thiết kế <strong className="text-rose-400">10 MVP Dịch Vụ Siêu Nhỏ</strong> để giải cứu họ NGAY HÔM NAY.</p>
            </div>
          </div>
         </div>
      </section>

      {/* CheckCircle Helper Component */}
    </div>
  )
}

function CheckCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}
