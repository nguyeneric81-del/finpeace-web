import React from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Search, Flame } from 'lucide-react';

const mockStories = [
  {
    id: 1,
    title: "Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị",
    date: "Tháng 3, 2026",
    category: "Chuỗi Cung Ứng",
    dataPoint: "Chỉ số cước vận tải biển container (SCFI) tăng +35% YTD, chạm mức 2,800 điểm.",
    narrowIndustry: "Vận tải biển Quốc tế & Cho thuê tàu bãi",
    quantifiedImpact: {
      positive: true,
      value: "Dự phóng biên lợi nhuận ròng ngành tăng +8% - 12% trong Q2/2026 nhờ chu kỳ tái ký hợp đồng cước giá cao."
    },
    companies: [
      { ticker: "HAH", name: "Hải An", impact: "Hưởng lợi trực tiếp nhờ 3 tàu mới đưa vào khai thác tuyến Nội Á.", matchScore: 92 },
      { ticker: "VOS", name: "VOSCO", impact: "Đội tàu hàng rời hưởng lợi ngắn hạn từ giá cước.", matchScore: 78 }
    ]
  },
  {
    id: 2,
    title: "FED chần chừ hạ lãi suất - Đồng USD tiếp tục duy trì sức mạnh",
    date: "Tháng 3, 2026",
    category: "Chính sách Tiền tệ",
    dataPoint: "DXY neo vững vùng 104.5, Tỷ giá USD/VND chợ đen vượt mốc 25,500. Lợi suất TPCP Mỹ 10 năm phục hồi về 4.3%.",
    narrowIndustry: "Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ",
    quantifiedImpact: {
      positive: false,
      value: "Các DN vay nợ USD cao chịu lỗ tỷ giá ước tính -3% LNST. Ngược lại, xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%."
    },
    companies: [
      { ticker: "VHC", name: "Vĩnh Hoàn", impact: "Hưởng lợi tỷ giá kép (giá xuất khẩu tăng, thu USD).", matchScore: 88, positive: true },
      { ticker: "MWG", name: "Thế Giới Di Động", impact: "Áp lực tỷ giá lên linh kiện đầu vào Apple, ảnh hưởng nhẹ biên ròng mảng ICT.", matchScore: 65, positive: false }
    ]
  },
  {
    id: 3,
    title: "Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn",
    date: "Tháng 3, 2026",
    category: "Đầu tư Nước ngoài",
    dataPoint: "Vốn FDI đăng ký mới lũy kế 2 tháng 2026 đạt 4.29 tỷ USD (+38% YoY). 60% rót vào chế biến chế tạo hạ tầng cao.",
    narrowIndustry: "BĐS Khu Công Nghiệp ven đô (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu",
    quantifiedImpact: {
      positive: true,
      value: "Giá thuê đất công nghiệp dự kiến tăng +6-8% / năm. Tỷ lệ lấp đầy KCN phía Bắc chạm sát 90%."
    },
    companies: [
      { ticker: "KBC", name: "Kinh Bắc", impact: "Bàn giao 100ha đất tại KCN Tràng Duệ 3, hạch toán lợi nhuận đột biến Q3/2026.", matchScore: 95, positive: true },
      { ticker: "DGC", name: "Hóa chất Đức Giang", impact: "Nhu cầu hóa chất bán dẫn (Phosphorus) bùng nổ toàn cầu hỗ trợ giá bán trung hạn.", matchScore: 89, positive: true }
    ]
  }
];

export default function MacroInsightsPage() {
  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-200 overflow-x-hidden p-6 md:p-12 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
          <Flame className="w-4 h-4" />
          <span>Câu chuyện Vĩ mô Mỗi tháng</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Góc Nhìn Thực Chiến <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            Research Insights
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          Chúng tôi định lượng tác động Vĩ mô xuống tận từng ngóc ngách Nhóm ngành hẹp và soi chiếu trực tiếp vào Kế hoạch giao dịch của doanh nghiệp.
        </p>
      </div>

      {/* 3 Hot Stories Grid */}
      <div className="max-w-7xl mx-auto space-y-12">
        {mockStories.map((story) => (
          <div key={story.id} className="relative p-1 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 hover:from-blue-500/20 hover:to-teal-500/10 transition-colors duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-[#12161E] rounded-[22px] p-6 md:p-10 flex flex-col xl:flex-row gap-10">
              
              {/* Left Column: Macro & Philosophy */}
              <div className="xl:w-5/12 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400 bg-slate-800/80 px-4 py-1.5 rounded-full">
                    {story.date}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {story.category}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {story.title}
                </h2>

                <div>
                   <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                     <BarChart3 className="w-4 h-4" /> Áp dụng Dữ liệu thực tế
                   </p>
                   <p className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 inline-block px-4 py-2 rounded-xl">
                     {story.dataPoint}
                   </p>
                </div>
              </div>

              {/* Right Column: 2-Layer Translation */}
              <div className="xl:w-7/12 flex flex-col space-y-6"
                   style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(30,58,138,0.1), transparent 50%)' }}>
                
                {/* Layer 1: Narrow Industry */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white">1</span>
                    Nhóm Ngành Hẹp (Sector Layer)
                  </h3>
                  <p className="text-xl font-semibold text-white mb-3">{story.narrowIndustry}</p>
                  <p className={`text-sm ${story.quantifiedImpact.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className="font-bold uppercase">Impact: </span> {story.quantifiedImpact.value}
                  </p>
                  
                  {/* Nút Xem chi tiết */}
                  <div className="mt-5">
                    <Link href={`/advisor/macro-insights/${story.id}`}>
                      <button className="px-4 py-2 bg-slate-700/40 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30 transition-colors flex items-center gap-2">
                        <Search className="w-4 h-4" /> Xem Chi Tiết Insight
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Layer 2: Specific Companies */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex-grow">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white">2</span>
                    Doanh Nghiệp Trọng Điểm (Company Layer)
                  </h3>
                  
                  <div className="space-y-4">
                    {story.companies.map(company => (
                      <div key={company.ticker} className="group flex items-start justify-between bg-slate-900/50 hover:bg-slate-800 transition-colors p-4 rounded-xl border border-slate-700/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-white">{company.ticker}</span>
                            <span className="text-sm text-slate-400">{company.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 ml-2">
                              Fit: {company.matchScore}%
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">
                            {company.impact}
                          </p>
                        </div>
                        
                        {/* CTA Linked directly to trading plan */}
                        <Link href={`/advisor/trading-plan/${company.ticker.toLowerCase()}`}>
                          <button className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all group-hover:scale-110">
                            <ArrowRight className="w-5 h-4" />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
