import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Target, Activity } from 'lucide-react';

const mockDetails: Record<string, any> = {
  "1": {
    title: "Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị",
    industry: "Vận tải biển Quốc tế & Cho thuê tàu bãi",
    impact: "Dự phóng biên lợi nhuận ròng ngành tăng +8% - 12% trong Q2/2026 nhờ chu kỳ tái ký hợp đồng cước giá cao.",
    behindStory: "Khởi nguồn từ cuộc biểu tình và đình công của công nhân cảng bờ Đông nước Mỹ, cộng hưởng với căng thẳng địa chính trị eo biển Đỏ kéo dài, các hãng tàu buộc phải đi vòng qua Mũi Hảo Vọng. Điều này làm vòng quay tàu kéo dài thêm 14-21 ngày, tạo ra sự khan hiếm container rỗng cục bộ tại Châu Á.",
    analystView: "Đa số các CTCK (VCBS, KIS) đều chung nhận định rủi ro đứt gãy chuỗi cung ứng là động lực ngắn hạn đẩy giá cước Spot (giao ngay) lên cao. Tuy nhiên, thị trường phái sinh cước tàu đang định giá đợt tăng này khó kéo dài qua Quý 4/2026 khi 2 triệu TEU tàu mới được hạ thủy.",
    cycle: {
      lagging: "Chi phí cước SCFI tăng đột biến (Lagging từ đứt gãy cung ứng 6 tháng trước).",
      leading: "Tác động (Leading) sang tăng trưởng Lợi nhuận của các doanh nghiệp vận tải có tàu đáo hạn hợp đồng cho thuê định hạn (Time-charter) trong giai đoạn Q2-Q3/2026."
    }
  },
  "2": {
    title: "FED chần chừ hạ lãi suất - Đồng USD tiếp tục duy trì sức mạnh",
    industry: "Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ",
    impact: "Các DN vay nợ USD cao chịu lỗ tỷ giá ước tính -3% LNST. Ngược lại, xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%.",
    behindStory: "Lạm phát lõi (Core PCE) của Mỹ bất ngờ dâng cao trở lại ở mức 2.8%, kết hợp với báo cáo việc làm Non-Farm vượt dự báo khiến FED không có cớ để hạ lãi suất. DXY mạnh lên gây sức ép trực tiếp lên tỷ giá điều hành của NHNN, buộc NHNN phải phát hành tín phiếu hút tiền VNĐ.",
    analystView: "Thị trường dự báo FED chỉ có thể hạ lãi suất muộn nhất vào tháng 9/2026 (trước bầu cử Mỹ). Giới phân tích trong nước (MBS, VNDS) khuyến nghị thận trọng với các DN có nợ vay USD lớn, nhưng đánh giá cao mặt bằng xuất khẩu khi kinh tế Mỹ vẫn hạ cánh mềm.",
    cycle: {
      lagging: "Lạm phát Mỹ dai dẳng (Lagging từ chi tiêu tiêu dùng mạnh).",
      leading: "Tác động (Leading) làm dòng tiền khối ngoại rút ròng khỏi TTCK Việt Nam ngắn hạn; đồng thời giúp nhóm Xuất khẩu bùng nổ lợi nhuận khi đơn hàng trở lại."
    }
  },
  "3": {
    title: "Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn",
    industry: "BĐS Khu Công Nghiệp ven đô (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu",
    impact: "Giá thuê đất công nghiệp dự kiến tăng +6-8% / năm. Tỷ lệ lấp đầy KCN phía Bắc chạm sát 90%.",
    behindStory: "Đạo luật Chips Act của Mỹ và chính sách dịch chuyển chuỗi cung ứng 'China + 1' đang bước vào giai đoạn giải ngân thực tế. Các tập đoàn công nghệ lớn (Amkor, Hana Micron) liên tục mở rộng nhà máy đóng gói vi mạch tại Bắc Ninh và Bắc Giang.",
    analystView: "KBSV và Vietcap nhấn mạnh đây không phải sóng đầu cơ mà là xu hướng lõi (Secular Trend) thập kỷ. Nhu cầu vật liệu hóa chất (như Phốt pho vàng) và hạ tầng điện/nước tại KCN là nút thắt cổ chai, khiến những ai có quỹ đất sạch sẵn sàng bàn giao sẽ độc quyền áp đặt giá thuê.",
    cycle: {
      lagging: "Cam kết MOU đầu tư FDI từ năm 2024-2025 (Lagging).",
      leading: "Tác động (Leading) chuyển hóa thành Dòng tiền thực (Cashflow) từ cho thuê đất KCN trong 2026-2027 và kéo theo sự bùng nổ của nhóm Cảng Biển & Logistics kho bãi."
    }
  }
};

export default async function MacroDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = mockDetails[resolvedParams.id];
  
  if (!data) return <div className="p-10 text-white">Không tìm thấy báo cáo.</div>;

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/advisor/macro-insights" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Góc Nhìn Vĩ Mô
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {data.title}
        </h1>
        
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 mb-10">
           <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Nhóm Ngành: <span className="text-white">{data.industry}</span></h3>
           <p className="text-emerald-400 text-lg">
             <span className="font-bold uppercase">Impact: </span> {data.impact}
           </p>
        </div>

        <div className="space-y-8">
          {/* Câu chuyện đằng sau */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> Tại sao? Câu chuyện đằng sau sự kiện
            </h2>
            <div className="bg-[#12161E] border border-slate-800 p-6 rounded-2xl">
              <p className="text-slate-300 leading-relaxed text-lg">{data.behindStory}</p>
            </div>
          </section>

          {/* Thị trường & Phân tích */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Giới phân tích & Thị trường nói gì?
            </h2>
            <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
              <p className="text-amber-100/80 leading-relaxed italic text-lg">"{data.analystView}"</p>
            </div>
          </section>

          {/* Lagging & Leading Cycle */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Chu kỳ Tác động (Lagging ➔ Leading)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-slate-800/40 border-l-4 border-slate-500 p-6 rounded-2xl">
                 <p className="text-xs font-bold uppercase text-slate-400 mb-2">Lagging (Độ trễ từ Vĩ mô)</p>
                 <p className="text-slate-200 font-medium leading-relaxed">{data.cycle.lagging}</p>
               </div>
               <div className="bg-emerald-900/10 border-l-4 border-emerald-500 p-6 rounded-2xl">
                 <p className="text-xs font-bold uppercase text-emerald-500 mb-2">Leading (Dẫn dắt tới Tương lai)</p>
                 <p className="text-emerald-100 font-medium leading-relaxed">{data.cycle.leading}</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
