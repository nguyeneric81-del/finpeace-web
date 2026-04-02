'use client'

import React, { useRef } from 'react'
import {
  Compass, ChevronDown, Users, Search, 
  RotateCcw, Activity, Briefcase, Frown, 
  Target, TargetIcon, Zap
} from 'lucide-react'

export default function TrainingDeckWeek2Client() {
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-[#020617] to-[#020617] opacity-60 pointer-events-none" />
        <div className="z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold tracking-widest uppercase text-sm mb-8 animate-fade-in">
            <Users className="w-5 h-5" /> PHASE 2: HIỂU KHÁCH HÀNG
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-8 leading-tight tracking-tight">
            Biết người, <br/>Biết ta
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            Ngừng bán một loại thuốc cho mọi loại bệnh. Nhận diện chính xác 4 chân dung khách hàng và giải quyết đúng "Nỗi đau" khuyết thiếu của họ.
          </p>
        </div>
        <button onClick={scrollDown} className="absolute bottom-12 animate-bounce p-4 rounded-full bg-white/5 hover:bg-white/10 transition">
          <ChevronDown className="w-8 h-8 text-slate-400" />
        </button>
      </section>

      {/* SLIDE 2: 4 NHÓM KHÁCH HÀNG */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[#0B1120]">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-12 flex items-center gap-6">
            <Target className="w-16 h-16 text-emerald-400" /> 4 Chân Dung Trọng Tâm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Explorer */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-sky-500/20 group hover:border-sky-500/50 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-sky-500/10 rounded-2xl"><Search className="w-8 h-8 text-sky-400" /></div>
                <h3 className="text-3xl font-bold text-white">01. Explorer</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4 font-light italic">"Tò mò nhưng hoang mang"</p>
              <ul className="space-y-3 text-slate-300">
                <li>• Khách hàng F0 mới bước chân vào thị trường.</li>
                <li>• Bị ngợp bởi ma trận thông tin, hội nhóm phím hàng.</li>
                <li>• <strong>Giải pháp:</strong> Cần kiến thức nền tảng (VVIA) và người dẫn đường đáng tin cậy.</li>
              </ul>
            </div>

            {/* Returnee */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-rose-500/20 group hover:border-rose-500/50 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-rose-500/10 rounded-2xl"><RotateCcw className="w-8 h-8 text-rose-400" /></div>
                <h3 className="text-3xl font-bold text-white">02. Returnee</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4 font-light italic">"Chim sập bẫy sợ cành cong"</p>
              <ul className="space-y-3 text-slate-300">
                <li>• Đã từng thua lỗ nặng và rời bỏ thị trường.</li>
                <li>• Quay lại cẩn trọng, mang tâm lý nghi ngờ cao (Trust Issue).</li>
                <li>• <strong>Giải pháp:</strong> Xây dựng niềm tin bằng Kịch bản Stress Test, quản trị rủi ro chặt chẽ trước khi tấn công.</li>
              </ul>
            </div>

            {/* Momentum */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-amber-500/20 group hover:border-amber-500/50 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-amber-500/10 rounded-2xl"><Activity className="w-8 h-8 text-amber-400" /></div>
                <h3 className="text-3xl font-bold text-white">03. Momentum</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4 font-light italic">"Say máu với những con sóng"</p>
              <ul className="space-y-3 text-slate-300">
                <li>• Thích lướt sóng, giao dịch liên tục (Overtrading).</li>
                <li>• Đang vướng vào vòng lặp: Kiếm được -> Thua lại -> Căng thẳng tột độ.</li>
                <li>• <strong>Giải pháp:</strong> Kỷ luật bằng Trading Plan (AutoPilot) và cơ chế cắt lỗ vô cảm.</li>
              </ul>
            </div>

            {/* Career-builder */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-emerald-500/20 group hover:border-emerald-500/50 transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-emerald-500/10 rounded-2xl"><Briefcase className="w-8 h-8 text-emerald-400" /></div>
                <h3 className="text-3xl font-bold text-white">04. Career-builder</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4 font-light italic">"Không có thời gian canh bảng"</p>
              <ul className="space-y-3 text-slate-300">
                <li>• Bận rộn phát triển chuyên môn/công ty, có thu nhập cao.</li>
                <li>• Cần nơi "gửi gắm" dòng sinh lời an toàn, tối ưu thời gian.</li>
                <li>• <strong>Giải pháp:</strong> Tư vấn Gia sản (Wealth Planning) toàn diện, báo cáo định kỳ.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* SLIDE 3: PAIN POINTS THỰC TẾ */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-slate-900">
         <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-black text-rose-400 mb-12 flex items-center gap-6">
            <Frown className="w-16 h-16" /> "Nỗi Đau Thực Tế" Của Khách
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-8 bg-[#0B1120] p-8 rounded-3xl border-l-8 border-rose-500 shadow-xl">
              <div className="text-rose-500 font-black text-5xl opacity-40">"</div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Sự cô đơn lúc "Đu đỉnh" (Returnee / Explorer)</h4>
                <p className="text-xl text-slate-400 font-light">"Khi thị trường sập sàn, broker cũ của tôi không nghe máy. Tôi tự phải đưa ra quyết định cắt lỗ với sự hoảng loạn tột cùng."</p>
              </div>
            </div>

            <div className="flex items-center gap-8 bg-[#0B1120] p-8 rounded-3xl border-l-8 border-amber-500 shadow-xl">
              <div className="text-amber-500 font-black text-5xl opacity-40">"</div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Đánh đổi sức khỏe & Công việc (Momentum)</h4>
                <p className="text-xl text-slate-400 font-light">"Tôi đang họp công ty nhưng tay lúc nào cũng chực vuốt app bảng giá. Tôi mệt mỏi vì tiền lãi chẳng bù được thời gian và áp lực tâm lý."</p>
              </div>
            </div>

            <div className="flex items-center gap-8 bg-[#0B1120] p-8 rounded-3xl border-l-8 border-emerald-500 shadow-xl">
              <div className="text-emerald-500 font-black text-5xl opacity-40">"</div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Nỗi sợ Lạm phát cắn xén (Career-builder)</h4>
                <p className="text-xl text-slate-400 font-light">"Tôi dư tiền nhưng không biết vứt vào đâu. Để ngân hàng thì xót vì trượt giá, mua đất thì chưa đủ vốn, chơi chứng khoán thì không có thời gian."</p>
              </div>
            </div>
          </div>
         </div>
      </section>

      {/* SLIDE 4: KPI */}
      <section className="h-screen snap-start flex flex-col justify-center p-12 md:p-24 relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900 via-[#020617] to-[#020617]">
         <div className="max-w-5xl mx-auto w-full text-center">
          <Zap className="w-24 h-24 text-amber-400 mx-auto mb-10" />
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tight">
            THỰC CHIẾN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">TUẦN 2</span>
          </h2>
          <p className="text-3xl text-slate-300 font-light mb-16 leading-relaxed">
            Chỉ đọc thì không giải quyết được vấn đề. Đây là nhiệm vụ sinh tử của tuần này:
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 bg-slate-800/80 p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/30 transition"></div>
              <div className="bg-sky-500/20 text-sky-400 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl mb-6">1</div>
              <h3 className="text-3xl text-white font-bold mb-4">Viết 3 Chân Dung</h3>
              <p className="text-xl text-slate-400 mb-6">Mô tả rõ 3 khách hàng mục tiêu của BẠN. Thuộc nhóm nào? Nỗi đau lớn nhất đang đốt tiền của họ là gì?</p>
            </div>

            <div className="flex-1 bg-slate-800/80 p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/30 transition"></div>
              <div className="bg-rose-500/20 text-rose-400 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl mb-6">2</div>
              <h3 className="text-3xl text-white font-bold mb-4">Validate Insight</h3>
              <p className="text-xl text-slate-400 mb-6">Liên hệ trực tiếp với <strong>3 Khách hàng thực tế</strong> (nhắn tin/gọi điện) và hỏi xem nỗi đau bạn nghĩ có ĐÚNG với họ không.</p>
            </div>
          </div>
         </div>
      </section>

    </div>
  )
}
