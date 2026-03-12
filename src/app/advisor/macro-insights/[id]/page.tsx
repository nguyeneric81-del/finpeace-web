import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Target, Activity, Quote } from 'lucide-react';
import { StatCard, MiniTrendChart } from '@/components/macro/InfographicWidgets';
import AntVInfographic from '@/components/macro/AntVInfographic';

type StoryPoint = { point: string; quote: string; source: string; };
type StatCardData = { value: string; label: string; sub?: string; positive?: boolean; unit?: string; };
type ChartData = { name: string; value: number; };

const mockDetails: Record<string, {
  title: string;
  industry: string;
  impact: string;
  stats: StatCardData[];
  chartData: ChartData[];
  chartLabel: string;
  chartColor: string;
  infographicSyntax: string;
  behindStory: StoryPoint[];
  analystView: string;
  cycle: { lagging: string; leading: string; };
}> = {
  "1": {
    title: "Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị",
    industry: "Vận tải biển Quốc tế & Cho thuê tàu bãi",
    impact: "Dự phóng biên lợi nhuận ròng ngành tăng +8% - 12% trong Q2/2026 nhờ chu kỳ tái ký hợp đồng cước giá cao.",
    stats: [
      { value: "2,800", label: "SCFI Index (điểm)", sub: "Cao nhất 18 tháng", positive: true },
      { value: "-42%", label: "Tàu qua kênh Suez Q1/2026", sub: "So với cùng kỳ năm trước", positive: false },
      { value: "+18%", label: "Tăng trưởng Doanh thu HAH 2026", sub: "Từ 3 tàu mới tuyến Nội Á", positive: true },
      { value: "+45%", label: "LNST HAH Q2/2026 YoY", sub: "Dự phóng", positive: true },
    ],
    chartData: [
      { name: "T8/25", value: 1200 }, { name: "T9/25", value: 1450 }, { name: "T10/25", value: 1800 },
      { name: "T11/25", value: 2100 }, { name: "T12/25", value: 2350 }, { name: "T1/26", value: 2600 },
      { name: "T2/26", value: 2750 }, { name: "T3/26", value: 2800 },
    ],
    chartLabel: "Chỉ số SCFI (Container Freight Index) - 8 tháng gần nhất",
    chartColor: "#34d399",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title Cước Vận Tải Biển & Impact HAH
  desc Biến động SCFI Q1/2026 → Tác động trực tiếp đến doanh thu HAH
  lists
    - label SCFI Index
      value 2,800
      desc Cao nhất 18 tháng (điểm)
    - label Tàu qua Suez
      value -42%
      desc So cùng kỳ năm trước
    - label Doanh thu HAH
      value +18%
      desc Từ 3 tàu mới tuyến Nội Á
    - label LNST HAH Q2
      value +45%
      desc YoY (Dự phóng)
`,
    behindStory: [
      {
        point: "Căng thẳng khu vực Biển Đỏ kéo dài làm thay đổi toàn bộ cấu trúc tuyến vận tải Á - Âu, ép các hãng tàu phải đi vòng qua Mũi Hảo Vọng.",
        quote: "Khối lượng tàu hàng đi qua kênh đào Suez trong Quý 1/2026 đã sụt giảm 42% so với cùng kỳ năm trước, làm tăng thời gian hành trình thêm trung bình 14-21 ngày.",
        source: "Báo cáo Vĩ mô SSI Research - Tháng 2/2026"
      },
      {
        point: "Sự tắc nghẽn vòng quay tàu kéo theo ách tắc container rỗng cục bộ tại các cảng trung chuyển lớn ở Châu Á (Singapore, Thượng Hải).",
        quote: "Chỉ số cước vận tải biển container (SCFI) đã chính thức xuyên thủng mốc 2,800 điểm, chạm ngưỡng cao nhất trong 18 tháng qua.",
        source: "Drewry Shipping Report - Tuần 1 Tháng 3/2026"
      },
      {
        point: "Rủi ro đình công của công nhân bến cảng Duyên hải miền Đông Hoa Kỳ càng làm nguồn cung vận tải bị thắt chặt.",
        quote: "Hơn 45,000 công nhân cảng biển Mỹ đe dọa đình công vào Hè 2026 nếu thỏa thuận lương không được đáp ứng, làm dấy lên đợt panic-booking sớm từ các nhà bán lẻ.",
        source: "Reuters / Supply Chain Dive News"
      }
    ],
    analystView: "Đa số các CTCK (VCBS, KIS) nhấn mạnh rằng dư địa tăng giá cước Spot vẫn còn do các hiệp hội bán lẻ Mỹ đang đẩy nhanh tích trữ hàng tồn kho. Tuy vậy, thị trường phái sinh cước định giá đà tăng này sẽ hạ nhiệt vào Quý 4/2026 khi lượng tàu đóng mới khổng lồ (tương đương 2 triệu TEU) chính thức hạ thủy.",
    cycle: {
      lagging: "Chi phí cước SCFI đi Châu Âu hiện giao dịch quanh mức 3,200 USD/TEU, tăng đột biến +125% so với mức trung bình 5 năm qua (quanh mốc 1,420 USD) do độ trễ từ đứt gãy chuỗi cung ứng 6 tháng trước.",
      leading: "Sự kiện này dẫn dắt trực tiếp lợi nhuận cho các doanh nghiệp có đội tàu cho thuê định hạn tái ký vào đợt sát giá. Cụ thể với HAH (Hải An), giá cước nội địa tăng và 3 biên chế tàu mới đưa vào khai thác tuyến Nội Á ước tính đóng góp thêm +18% vào Tổng doanh thu 2026 của HAH."
    }
  },
  "2": {
    title: "FED chần chừ hạ lãi suất - Đồng USD tiếp tục duy trì sức mạnh",
    industry: "Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ",
    impact: "Các DN vay nợ USD cao chịu lỗ tỷ giá ước tính -3% LNST. Ngược lại, xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%.",
    stats: [
      { value: "104.5", label: "DXY Index", sub: "Neo vững, áp lực tỷ giá", positive: false },
      { value: "25,500", label: "USD/VND (chợ đen)", sub: "+3.8% so với đầu năm", positive: false },
      { value: "+4.5%", label: "Buff Doanh thu VHC từ tỷ giá", sub: "Trên tổng doanh thu xuất khẩu", positive: true },
      { value: "18%", label: "Biên lợi nhuận gộp VHC", sub: "Tăng từ 14% đầu 2025", positive: true },
    ],
    chartData: [
      { name: "T9/25", value: 101.2 }, { name: "T10/25", value: 102.5 }, { name: "T11/25", value: 103.1 },
      { name: "T12/25", value: 103.8 }, { name: "T1/26", value: 104.0 }, { name: "T2/26", value: 104.3 },
      { name: "T3/26", value: 104.5 },
    ],
    chartLabel: "Chỉ số DXY (USD Index) - 7 tháng gần nhất",
    chartColor: "#f59e0b",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title USD mạnh: Ai thắng, ai thua?
  desc Phân tích tác động tỷ giá USD/VND lên doanh nghiệp niêm yết
  lists
    - label DXY Index
      value 104.5
      desc Neo vững (điểm)
    - label USD/VND tự do
      value 25,500
      desc Tăng +3.8% YTD
    - label Buff DThu VHC
      value +4.5%
      desc Từ chênh lệch tỷ giá
    - label Biên gộp VHC
      value 18%
      desc Tăng từ 14% đầu 2025
`,
    behindStory: [
      {
        point: "Lạm phát lõi (Core PCE) của Mỹ bất ngờ dâng cao trở lại, triệt tiêu kỳ vọng hạ lãi suất sớm của thị trường.",
        quote: "Chỉ số Core PCE tháng 1/2026 tăng 2.8% YoY, trong khi báo cáo việc làm Non-Farm tạo ra 275,000 việc làm mới — vượt xa mọi dự báo của phố Wall.",
        source: "Bloomberg / Cục Thống Kê Lao Động Mỹ (BLS)"
      },
      {
        point: "Sự chênh lệch lãi suất cực lớn giữa USD và VNĐ kích hoạt dòng vốn đầu cơ ngoại tệ (Carry Trade).",
        quote: "Chỉ số DXY tiếp tục neo vững trên vùng 104.5 điểm, tạo sức ép khủng khiếp khiến tỷ giá USD/VND trên thị trường tự do bật tăng vượt mốc 25,500 đồng/USD.",
        source: "Báo cáo Thị trường Tiền tệ MBS - Tháng 3/2026"
      },
      {
        point: "NHNN buộc phải can thiệp hút thanh khoản dư thừa trên thị trường liên ngân hàng để kìm cương tỷ giá.",
        quote: "Ngân hàng Nhà Nước đã phát hành tín phiếu kỳ hạn 28 ngày với khối lượng trúng thầu liên tục đạt quy mô 15,000 tỷ đồng/phiên nhằm nâng mặt bằng lãi suất OMO.",
        source: "Báo Tin Nhanh Chứng Khoán / SSI Research"
      }
    ],
    analystView: "Thị trường hiện định giá FED chỉ có thể hạ lãi suất sớm nhất vào tháng 9/2026. Giới phân tích phân hóa rõ rệt: Một mặt cảnh báo rủi ro lỗ tỷ giá đối với các Tập đoàn sử dụng đòn bẩy vốn ngoại, mặt khác lại nâng mức định giá cho các nhóm Xuất khẩu Gỗ, Thủy sản do hưởng lợi trọn vẹn từ lượng đơn rủng rỉnh và chênh lệch tỷ giá.",
    cycle: {
      lagging: "Lạm phát dịch vụ và giá nhà ở Mỹ dai dẳng (Lagging) duy trì mặt bằng Lãi suất liên ngân hàng VNĐ qua đêm ở vùng thấp giả tạo so với FED Funds Rate xuyên suốt 6 tháng qua.",
      leading: "Tỷ giá neo cao 25,500 VNĐ/USD trực tiếp buff lợi nhuận cho VHC (Vĩnh Hoàn). Ước tính phần chênh lệch tỷ giá đóng góp thẳng vào Core Revenue của VHC khoảng +4.5% tổng doanh thu xuất khẩu, cải thiện Biên lợi nhuận gộp lên mức 18% so với 14% đầu 2025."
    }
  },
  "3": {
    title: "Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn",
    industry: "BĐS Khu Công Nghiệp ven đô (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu",
    impact: "Giá thuê đất công nghiệp dự kiến tăng +6-8% / năm. Tỷ lệ lấp đầy KCN phía Bắc chạm sát 90%.",
    stats: [
      { value: "$4.29B", label: "FDI đăng ký 2T/2026", sub: "+38.6% YoY vào Việt Nam", positive: true },
      { value: "90%", label: "Tỷ lệ lấp đầy KCN phía Bắc", sub: "Nguồn cung đất sạch khan hiếm", positive: true },
      { value: "$140", label: "Giá thuê đất KCN (USD/m²)", sub: "+8% so với cuối 2024", positive: true },
      { value: "+120%", label: "LNST KBC dự báo 2026 YoY", sub: "Nhờ bàn giao 100ha Tràng Duệ 3", positive: true },
    ],
    chartData: [
      { name: "T4/25", value: 2.1 }, { name: "T6/25", value: 2.4 }, { name: "T8/25", value: 2.8 },
      { name: "T10/25", value: 3.1 }, { name: "T12/25", value: 3.5 }, { name: "T1/26", value: 3.9 },
      { name: "T2/26", value: 4.29 },
    ],
    chartLabel: "FDI Lũy kế đăng ký mới vào Việt Nam (tỷ USD)",
    chartColor: "#a78bfa",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title Làn Sóng FDI Bán Dẫn vào Việt Nam
  desc Dòng vốn FDI thế hệ mới → Bùng nổ lợi nhuận KBC & IDC
  lists
    - label FDI 2T/2026
      value $4.29B
      desc +38.6% YoY
    - label Lấp đầy KCN Bắc
      value 90%
      desc Nguồn cung khan hiếm
    - label Giá thuê KCN
      value $140
      desc USD/m² (+8% vs 2024)
    - label LNST KBC 2026
      value +120%
      desc YoY (Dự phóng)
`,
    behindStory: [
      {
        point: "Các đạo luật hỗ trợ sản xuất chip của phương Tây kết hợp rủi ro Mỹ - Trung ép dòng vốn FDI công nghệ cao phải đa dạng hóa chuỗi lắp ráp (China + 1).",
        quote: "Vốn FDI đăng ký mới lũy kế 2 tháng đầu năm 2026 đổ vào Việt Nam đạt 4.29 tỷ USD (+38.6% YoY), trong đó gần 60% rót thẳng vào ngành quy trình chế tạo, đóng gói chất bán dẫn.",
        source: "Bộ Kế hoạch & Đầu tư / GSO"
      },
      {
        point: "Các 'Đại bàng' công nghệ chính thức bấm nút giải ngân và mở rộng nhà máy vệ tinh tại hành lang kinh tế phía Bắc.",
        quote: "Tập đoàn Amkor Technology và Hana Micron công bố gói giải ngân giai đoạn 2 trị giá hơn 1.5 tỷ USD để hoàn thiện cứ điểm đóng gói vi mạch tại Bắc Ninh và Bắc Giang.",
        source: "Nikkei Asia / Cổng TTĐT Chính Phủ"
      },
      {
        point: "Nút thắt cổ chai về nguồn cung đất sạch kích hoạt làn sóng tăng giá thuê KCN bất chấp bối cảnh vĩ mô.",
        quote: "Tỷ lệ lấp đầy tại các KCN trọng điểm vùng ven Hà Nội đã vượt ngưỡng an toàn 90%, đẩy giá thuê đất trung bình chạm mốc 140 USD/m2/chu kỳ thuê (+8% so với cuối 2024).",
        source: "CBRE Vietnam Market Report Q1/2026"
      }
    ],
    analystView: "KBSV và Vietcap đồng thuận đánh giá đây là xu hướng lõi (Secular Trend) thập kỷ của Việt Nam. Trữ lượng đất sạch (Land bank) đã đền bù xong là vua. Bất kỳ doanh nghiệp nào có sẵn quỹ đất thương phẩm bàn giao trong 2026-2027 sẽ nắm độc quyền định giá, bỏ qua rủi ro suy thoái tiêu dùng nội địa.",
    cycle: {
      lagging: "Cam kết MOU đầu tư FDI tỷ đô được ký kết dày đặc trong chuỗi ngoại giao con thoi của chính phủ giai đoạn 2024-2025 (Lagging indicators).",
      leading: "Chuyển hóa dòng tiền thực khổng lồ cho IDC, KBC. Cụ thể với KBC, việc bàn giao 100ha đất tại KCN Tràng Duệ 3 cho LG Innotek dự kiến đóng góp 65% vào Tổng doanh thu năm 2026. Mức giá thuê cải thiện +5% lên 135 USD/m2 sẽ đưa LNST KBC bùng nổ chạm mốc 3,500 tỷ đồng, tăng trưởng +120% YoY so với nền thấp 2025."
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
        
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Nhóm Ngành: <span className="text-white">{data.industry}</span></h3>
          <p className="text-emerald-400 text-lg">
            <span className="font-bold uppercase">Impact: </span> {data.impact}
          </p>
        </div>

        {/* ── INFOGRAPHIC: AntV Declarative + Recharts Mini Chart ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">📊 Tóm tắt Số Liệu Cốt Lõi</p>
          <AntVInfographic syntax={data.infographicSyntax} width={800} height={220} />
        </div>
        <div className="mb-10">
          <MiniTrendChart data={data.chartData} label={data.chartLabel} color={data.chartColor} />
        </div>

        <div className="space-y-8">
          {/* Câu chuyện đằng sau */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> Tại sao? Câu chuyện đằng sau sự kiện
            </h2>
            <div className="space-y-6">
              {data.behindStory.map((item, index) => (
                <div key={index} className="bg-[#12161E] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-slate-200 text-lg font-medium leading-relaxed">{item.point}</p>
                    <div className="bg-slate-800/40 border-l-4 border-slate-500 p-4 rounded-r-xl relative">
                      <Quote className="w-4 h-4 text-slate-500 absolute top-4 left-4 opacity-50" />
                      <p className="text-slate-400 italic leading-relaxed pl-6 mb-2">"{item.quote}"</p>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-6">— Nguồn: {item.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Thị trường & Phân tích */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Giới phân tích & Thị trường nói gì?
            </h2>
            <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
              <p className="text-amber-100/90 leading-relaxed text-lg font-medium">"{data.analystView}"</p>
            </div>
          </section>

          {/* Lagging & Leading */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Chu kỳ Tác động (Định Lượng & So Sánh)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border-l-4 border-slate-500 p-6 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Lagging (Độ trễ Dữ liệu Vĩ mô)
                </p>
                <p className="text-slate-200 text-[15px] leading-relaxed">{data.cycle.lagging}</p>
              </div>
              <div className="bg-emerald-900/10 border-l-4 border-emerald-500 p-6 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Leading (Dẫn dắt Doanh thu Cốt lõi)
                </p>
                <p className="text-emerald-50 text-[15px] leading-relaxed">{data.cycle.leading}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
