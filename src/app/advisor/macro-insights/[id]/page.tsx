import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MessageSquare, Target, Activity,
  TrendingUp, TrendingDown, ArrowRight, Quote,
  BarChart2, Clock, ChevronRight
} from 'lucide-react';
import { StatCard, MiniTrendChart } from '@/components/macro/InfographicWidgets';
import AntVInfographic from '@/components/macro/AntVInfographic';
import { createClient } from '@/utils/supabase/server';

// ── Types ────────────────────────────────────────────────────
type StoryPoint = { point: string; quote: string; source: string };
type StatCardData = { value: string; label: string; sub?: string; positive?: boolean; unit?: string };
type ChartData = { name: string; value: number };

// ── Mock Data ────────────────────────────────────────────────
const mockDetails: Record<string, {
  title: string;
  category: string;
  date: string;
  industry: string;
  impact: string;
  impactPositive: boolean;
  accent: string;
  accentBg: string;
  stats: StatCardData[];
  chartData: ChartData[];
  chartLabel: string;
  chartColor: string;
  infographicSyntax: string;
  behindStory: StoryPoint[];
  analystView: string;
  analystSources: string[];
  cycle: { lagging: string; leading: string };
  companies: { ticker: string; name: string; plan: string }[];
}> = {
  "1": {
    title: "Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị",
    category: "Chuỗi Cung Ứng",
    date: "Tháng 3, 2026",
    accent: '#10B981',
    accentBg: 'rgba(16,185,129,0.1)',
    industry: "Vận tải biển Quốc tế & Cho thuê tàu bãi",
    impact: "Biên lợi nhuận ròng ngành tăng +8% – 12% trong Q2/2026 nhờ chu kỳ tái ký cước giá cao.",
    impactPositive: true,
    stats: [
      { value: "2,800", label: "SCFI Index (điểm)", sub: "Cao nhất 18 tháng", positive: true },
      { value: "-42%", label: "Tàu qua kênh Suez Q1/2026", sub: "So với cùng kỳ năm trước", positive: false },
      { value: "+18%", label: "Tăng trưởng Doanh thu HAH", sub: "Từ 3 tàu mới tuyến Nội Á", positive: true },
      { value: "+45%", label: "LNST HAH Q2/2026 YoY", sub: "Dự phóng", positive: true },
    ],
    chartData: [
      { name: "T8/25", value: 1200 }, { name: "T9/25", value: 1450 }, { name: "T10/25", value: 1800 },
      { name: "T11/25", value: 2100 }, { name: "T12/25", value: 2350 }, { name: "T1/26", value: 2600 },
      { name: "T2/26", value: 2750 }, { name: "T3/26", value: 2800 },
    ],
    chartLabel: "Chỉ số SCFI (Container Freight Index) — 8 tháng gần nhất",
    chartColor: "#34d399",
    infographicSyntax: `infographic list-col-simple-horizontal-number\ndata\n  title Cước Vận Tải Biển & Impact HAH\n  desc Biến động SCFI Q1/2026 → Tác động trực tiếp đến doanh thu HAH\n  lists\n    - label SCFI Index\n      value 2,800\n      desc Cao nhất 18 tháng (điểm)\n    - label Tàu qua Suez\n      value -42%\n      desc So cùng kỳ năm trước\n    - label Doanh thu HAH\n      value +18%\n      desc Từ 3 tàu mới tuyến Nội Á\n    - label LNST HAH Q2\n      value +45%\n      desc YoY (Dự phóng)`,
    behindStory: [
      { point: "Căng thẳng khu vực Biển Đỏ kéo dài làm thay đổi toàn bộ cấu trúc tuyến vận tải Á – Âu, ép các hãng tàu đi vòng qua Mũi Hảo Vọng.", quote: "Khối lượng tàu hàng đi qua kênh đào Suez trong Q1/2026 đã sụt giảm 42% so với cùng kỳ, làm tăng thời gian hành trình thêm 14–21 ngày.", source: "Báo cáo Vĩ mô SSI Research — Tháng 2/2026" },
      { point: "Sự tắc nghẽn vòng quay tàu kéo theo ách tắc container rỗng tại các cảng trung chuyển lớn ở Châu Á (Singapore, Thượng Hải).", quote: "Chỉ số SCFI đã chính thức xuyên thủng mốc 2,800 điểm — cao nhất trong 18 tháng qua.", source: "Drewry Shipping Report — Tuần 1 Tháng 3/2026" },
      { point: "Rủi ro đình công của công nhân bến cảng Duyên hải miền Đông Hoa Kỳ càng làm nguồn cung bị thắt chặt.", quote: "Hơn 45,000 công nhân cảng Mỹ đe dọa đình công vào Hè 2026, làm dấy lên đợt panic-booking sớm từ các nhà bán lẻ.", source: "Reuters / Supply Chain Dive" },
    ],
    analystView: "Đa số CTCK (VCBS, KIS) nhấn mạnh dư địa tăng giá cước Spot vẫn còn do các hiệp hội bán lẻ Mỹ đang đẩy nhanh tích trữ. Tuy vậy, thị trường phái sinh định giá đà tăng này sẽ hạ nhiệt vào Q4/2026 khi lượng tàu đóng mới (2 triệu TEU) chính thức hạ thủy.",
    analystSources: ["VCBS Research", "KIS Vietnam"],
    cycle: {
      lagging: "Chi phí cước SCFI đi Châu Âu giao dịch quanh mức 3,200 USD/TEU, tăng +125% so với trung bình 5 năm (1,420 USD) do độ trễ từ đứt gãy chuỗi cung ứng 6 tháng trước.",
      leading: "Lợi nhuận trực tiếp cho DN có đội tàu tái ký vào đợt cước cao. HAH với 3 tàu mới tuyến Nội Á ước tính đóng góp +18% Tổng doanh thu 2026.",
    },
    companies: [
      { ticker: "HAH", name: "Hải An", plan: "/advisor/trading-plan/hah" },
      { ticker: "VOS", name: "VOSCO", plan: "/advisor/trading-plan/vos" },
    ],
  },
  "2": {
    title: "FED chần chừ hạ lãi suất — Đồng USD tiếp tục duy trì sức mạnh",
    category: "Chính sách Tiền tệ",
    date: "Tháng 3, 2026",
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.1)',
    industry: "Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ",
    impact: "DN vay nợ USD cao chịu lỗ tỷ giá -3% LNST. Xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%.",
    impactPositive: false,
    stats: [
      { value: "104.5", label: "DXY Index", sub: "Neo vững, áp lực tỷ giá", positive: false },
      { value: "25,500", label: "USD/VND chợ đen", sub: "+3.8% so với đầu năm", positive: false },
      { value: "+4.5%", label: "Buff Doanh thu VHC từ tỷ giá", sub: "Trên tổng doanh thu xuất khẩu", positive: true },
      { value: "18%", label: "Biên lợi nhuận gộp VHC", sub: "Tăng từ 14% đầu 2025", positive: true },
    ],
    chartData: [
      { name: "T9/25", value: 101.2 }, { name: "T10/25", value: 102.5 }, { name: "T11/25", value: 103.1 },
      { name: "T12/25", value: 103.8 }, { name: "T1/26", value: 104.0 }, { name: "T2/26", value: 104.3 }, { name: "T3/26", value: 104.5 },
    ],
    chartLabel: "Chỉ số DXY (USD Index) — 7 tháng gần nhất",
    chartColor: "#f59e0b",
    infographicSyntax: `infographic list-col-simple-horizontal-number\ndata\n  title USD mạnh: Ai thắng, ai thua?\n  desc Tác động tỷ giá USD/VND lên doanh nghiệp niêm yết\n  lists\n    - label DXY Index\n      value 104.5\n      desc Neo vững (điểm)\n    - label USD/VND tự do\n      value 25,500\n      desc Tăng +3.8% YTD\n    - label Buff DThu VHC\n      value +4.5%\n      desc Từ chênh lệch tỷ giá\n    - label Biên gộp VHC\n      value 18%\n      desc Tăng từ 14% đầu 2025`,
    behindStory: [
      { point: "Lạm phát lõi (Core PCE) của Mỹ bất ngờ dâng cao trở lại, triệt tiêu kỳ vọng hạ lãi suất sớm.", quote: "Core PCE tháng 1/2026 tăng 2.8% YoY, báo cáo Non-Farm tạo 275,000 việc làm — vượt xa mọi dự báo phố Wall.", source: "Bloomberg / Cục Thống Kê Lao Động Mỹ (BLS)" },
      { point: "Chênh lệch lãi suất cực lớn giữa USD và VNĐ kích hoạt dòng vốn đầu cơ ngoại tệ (Carry Trade).", quote: "DXY neo vững trên 104.5 điểm, tạo sức ép khiến tỷ giá USD/VND thị trường tự do bật tăng vượt mốc 25,500.", source: "Báo cáo Thị trường Tiền tệ MBS — Tháng 3/2026" },
      { point: "NHNN buộc phải can thiệp hút thanh khoản dư thừa trên thị trường liên ngân hàng để kìm cương tỷ giá.", quote: "NHNN phát hành tín phiếu kỳ hạn 28 ngày liên tục đạt 15,000 tỷ đồng/phiên nhằm nâng mặt bằng lãi suất OMO.", source: "Báo Tin Nhanh CK / SSI Research" },
    ],
    analystView: "Thị trường định giá FED chỉ có thể hạ lãi suất sớm nhất tháng 9/2026. Giới phân tích phân hóa: cảnh báo rủi ro lỗ tỷ giá với tập đoàn dùng đòn bẩy ngoại, đồng thời nâng định giá nhóm Xuất khẩu Gỗ, Thủy sản hưởng lợi từ đơn rủng rỉnh và chênh lệch tỷ giá.",
    analystSources: ["SSI Research", "MBS Securities"],
    cycle: {
      lagging: "Lạm phát dịch vụ và giá nhà ở Mỹ dai dẳng duy trì mặt bằng Lãi suất liên ngân hàng VNĐ ở vùng thấp giả tạo so với FED Funds Rate xuyên suốt 6 tháng qua.",
      leading: "Tỷ giá neo cao 25,500 VNĐ/USD trực tiếp buff lợi nhuận VHC (Vĩnh Hoàn). Phần chênh lệch đóng góp +4.5% tổng doanh thu xuất khẩu, cải thiện biên gộp lên 18% từ 14% đầu 2025.",
    },
    companies: [
      { ticker: "VHC", name: "Vĩnh Hoàn", plan: "/advisor/trading-plan/vhc" },
      { ticker: "MWG", name: "Thế Giới Di Động", plan: "/advisor/trading-plan/mwg" },
    ],
  },
  "3": {
    title: "Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn",
    category: "Đầu tư Nước ngoài",
    date: "Tháng 3, 2026",
    accent: '#818CF8',
    accentBg: 'rgba(129,140,248,0.1)',
    industry: "BĐS Khu Công Nghiệp (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu",
    impact: "Giá thuê đất CN tăng +6-8%/năm. Tỷ lệ lấp đầy KCN phía Bắc chạm 90%.",
    impactPositive: true,
    stats: [
      { value: "$4.29B", label: "FDI đăng ký 2T/2026", sub: "+38.6% YoY vào Việt Nam", positive: true },
      { value: "90%", label: "Tỷ lệ lấp đầy KCN phía Bắc", sub: "Nguồn cung đất sạch khan hiếm", positive: true },
      { value: "$140", label: "Giá thuê đất KCN (USD/m²)", sub: "+8% so với cuối 2024", positive: true },
      { value: "+120%", label: "LNST KBC dự báo 2026 YoY", sub: "Nhờ bàn giao 100ha Tràng Duệ 3", positive: true },
    ],
    chartData: [
      { name: "T4/25", value: 2.1 }, { name: "T6/25", value: 2.4 }, { name: "T8/25", value: 2.8 },
      { name: "T10/25", value: 3.1 }, { name: "T12/25", value: 3.5 }, { name: "T1/26", value: 3.9 }, { name: "T2/26", value: 4.29 },
    ],
    chartLabel: "FDI Lũy kế đăng ký mới vào Việt Nam (tỷ USD)",
    chartColor: "#a78bfa",
    infographicSyntax: `infographic list-col-simple-horizontal-number\ndata\n  title Làn Sóng FDI Bán Dẫn vào Việt Nam\n  desc Dòng vốn FDI thế hệ mới → Bùng nổ lợi nhuận KBC\n  lists\n    - label FDI 2T/2026\n      value $4.29B\n      desc +38.6% YoY\n    - label Lấp đầy KCN Bắc\n      value 90%\n      desc Nguồn cung khan hiếm\n    - label Giá thuê KCN\n      value $140\n      desc USD/m² (+8% vs 2024)\n    - label LNST KBC 2026\n      value +120%\n      desc YoY (Dự phóng)`,
    behindStory: [
      { point: "Các đạo luật hỗ trợ sản xuất chip kết hợp rủi ro Mỹ – Trung ép FDI công nghệ cao đa dạng hóa chuỗi lắp ráp (China + 1).", quote: "FDI đăng ký mới lũy kế 2 tháng 2026 đổ vào Việt Nam đạt 4.29B USD (+38.6% YoY), gần 60% rót vào chế tạo, đóng gói bán dẫn.", source: "Bộ Kế hoạch & Đầu tư / GSO" },
      { point: "Các 'Đại bàng' công nghệ chính thức bấm nút giải ngân và mở rộng nhà máy vệ tinh tại hành lang kinh tế phía Bắc.", quote: "Amkor Technology và Hana Micron công bố gói giải ngân giai đoạn 2 trị giá hơn 1.5B USD tại Bắc Ninh và Bắc Giang.", source: "Nikkei Asia / Cổng TTĐT Chính Phủ" },
      { point: "Nút thắt cổ chai về nguồn cung đất sạch kích hoạt làn sóng tăng giá thuê KCN bất chấp bối cảnh vĩ mô.", quote: "Tỷ lệ lấp đầy KCN ven Hà Nội vượt ngưỡng 90%, đẩy giá thuê đất chạm 140 USD/m²/chu kỳ (+8% vs cuối 2024).", source: "CBRE Vietnam Market Report Q1/2026" },
    ],
    analystView: "KBSV và Vietcap đồng thuận đánh giá đây là xu hướng lõi (Secular Trend) thập kỷ của Việt Nam. Trữ lượng đất sạch đã đền bù xong là vua. Bất kỳ DN nào có quỹ đất thương phẩm bàn giao trong 2026–2027 sẽ nắm độc quyền định giá, bỏ qua rủi ro suy thoái tiêu dùng.",
    analystSources: ["KBSV Research", "Vietcap Securities"],
    cycle: {
      lagging: "Cam kết MOU đầu tư FDI tỷ đô được ký kết trong chuỗi ngoại giao con thoi của chính phủ giai đoạn 2024–2025 (Lagging indicators).",
      leading: "Chuyển hóa dòng tiền thực cho KBC. Bàn giao 100ha KCN Tràng Duệ 3 cho LG Innotek đóng góp 65% Tổng doanh thu 2026. LNST KBC dự kiến +120% YoY lên 3,500 tỷ đồng.",
    },
    companies: [
      { ticker: "KBC", name: "Kinh Bắc", plan: "/advisor/trading-plan/kbc" },
      { ticker: "DGC", name: "Hóa chất Đức Giang", plan: "/advisor/trading-plan/dgc" },
    ],
  },
};

// ── Stat Card ────────────────────────────────────────────────
function InsightStatCard({ value, label, sub, positive, accent }: StatCardData & { accent: string }) {
  const isPos = positive === true;
  const isNeg = positive === false;
  const numColor = isPos ? '#34d399' : isNeg ? '#fb7185' : '#f8fafc';
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between">
        {isPos && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
        {isNeg && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
        {!isPos && !isNeg && <BarChart2 className="w-3.5 h-3.5 text-slate-500" />}
      </div>
      <p className="text-2xl font-black" style={{ color: numColor, fontFamily: 'monospace' }}>{value}</p>
      <div>
        <p className="text-xs font-semibold text-slate-300 leading-tight">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default async function MacroDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // ── Fetch from Supabase ──────────────────────────────────
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('macro_insights')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  // Fallback to hardcoded for backward compat if Supabase returns nothing
  const raw = row ?? (mockDetails as any)[resolvedParams.id]

  if (!raw) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
        <p className="text-slate-500">Không tìm thấy báo cáo.</p>
      </div>
    );
  }

  // ── Map Supabase snake_case → component props ──────────────
  const isFromDB = !!row
  const accent = raw.accent_color ?? raw.accent ?? '#10B981'
  const data = isFromDB ? {
    title:           raw.title,
    category:        raw.category,
    date:            raw.date_label,
    accent,
    accentBg:        accent + '1A',
    industry:        raw.narrow_industry ?? '',
    impact:          raw.impact_value ?? '',
    impactPositive:  raw.impact_positive ?? true,
    stats:           (raw.key_stats ?? []).map((s: any) => ({ value: s.value, label: s.label, positive: s.positive })),
    chartData:       raw.chart_data ?? [],
    chartLabel:      raw.chart_label ?? '',
    chartColor:      raw.chart_color ?? accent,
    infographicSyntax: raw.infographic_syntax ?? '',
    behindStory:     raw.behind_story ?? [],
    analystView:     raw.analyst_view ?? '',
    analystSources:  raw.analyst_sources ?? [],
    cycle: { lagging: raw.cycle_lagging ?? '', leading: raw.cycle_leading ?? '' },
    companies:       (raw.companies ?? []).map((c: any) => ({
      ticker: c.ticker, name: c.name,
      plan: c.plan ?? `/advisor/trading-plan/${c.ticker?.toLowerCase()}`
    })),
  } : raw

  return (
    <div className="min-h-screen text-slate-200" style={{ background: '#020617', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: 'rgba(15,23,42,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }} className="sticky top-0 z-20 px-6 md:px-12 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/advisor/macro-insights" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white" style={{ color: data.accent }}>
            <ArrowLeft className="w-4 h-4" />
            Macro Insights
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: data.accentBg, color: data.accent, border: `1px solid ${data.accent}30` }}>
              {data.category}
            </span>
            <span className="text-xs text-slate-500">{data.date}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-12">

        {/* ── HERO ── */}
        <div>
          <div className="h-0.5 rounded-full mb-8 w-24" style={{ background: `linear-gradient(90deg, ${data.accent}, transparent)` }} />
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{data.title}</h1>

          <div className="flex items-start gap-3 rounded-2xl p-5"
            style={{
              background: data.impactPositive ? 'rgba(16,185,129,0.07)' : 'rgba(244,63,94,0.07)',
              border: `1px solid ${data.impactPositive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
            }}
          >
            {data.impactPositive
              ? <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              : <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            }
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Nhóm ngành: <span className="text-slate-300">{data.industry}</span>
              </p>
              <p className="text-base font-semibold" style={{ color: data.impactPositive ? '#34d399' : '#fb7185' }}>{data.impact}</p>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" /> Số liệu cốt lõi
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.stats.map((stat: any, i: number) => (
              <InsightStatCard key={i} {...stat} accent={data.accent} />
            ))}
          </div>
        </div>

        {/* ── INFOGRAPHIC + CHART ── */}
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-6 pt-5 pb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Tóm tắt trực quan</p>
            </div>
            <AntVInfographic syntax={data.infographicSyntax} width={800} height={220} />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-6 pt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Xu hướng dữ liệu</p>
            </div>
            <MiniTrendChart data={data.chartData} label={data.chartLabel} color={data.chartColor} />
          </div>
        </div>

        {/* ── BEHIND THE STORY (Newsroom Timeline) ── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.12)' }}>
              <MessageSquare className="w-4 h-4 text-sky-400" />
            </div>
            Câu chuyện đằng sau sự kiện
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

            <div className="space-y-8">
              {data.behindStory.map((item: any, i: number) => (
                <div key={i} className="relative pl-14">
                  {/* Timeline node */}
                  <div
                    className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border"
                    style={{ background: '#0F172A', borderColor: `${data.accent}40`, color: data.accent }}
                  >
                    {i + 1}
                  </div>

                  <div className="space-y-4">
                    <p className="text-base font-semibold text-slate-100 leading-relaxed">{item.point}</p>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${data.accent}60` }}>
                      <Quote className="w-3.5 h-3.5 text-slate-600 mb-2" />
                      <p className="text-sm italic text-slate-400 leading-relaxed mb-3">&ldquo;{item.quote}&rdquo;</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: data.accent }}>
                          {item.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANALYST VIEW ── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            Góc nhìn phân tích thị trường
          </h2>
          <div className="rounded-2xl p-7" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p className="text-amber-100/85 leading-relaxed text-base font-medium mb-5">&ldquo;{data.analystView}&rdquo;</p>
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Nguồn:</span>
              {data.analystSources.map((s: string) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full font-semibold text-amber-300" style={{ background: 'rgba(245,158,11,0.12)' }}>{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CYCLE: LAGGING vs LEADING ── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            Chu kỳ Tác động (Lagging → Leading)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Lagging */}
            <div className="rounded-2xl p-6 space-y-3" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid rgba(148,163,184,0.4)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Lagging</p>
                <span className="text-xs text-slate-600 ml-1">Độ trễ Dữ liệu Vĩ mô</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{data.cycle.lagging}</p>
            </div>

            {/* Arrow connector */}
            <div className="hidden md:flex absolute items-center justify-center" style={{ display: 'none' }}>
              <ArrowRight className="w-5 h-5 text-slate-600" />
            </div>

            {/* Leading */}
            <div className="rounded-2xl p-6 space-y-3" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderLeft: '3px solid #10B981' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10B98180' }} />
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Leading</p>
                <span className="text-xs text-slate-600 ml-1">Dẫn dắt Doanh thu Cốt lõi</span>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed">{data.cycle.leading}</p>
            </div>
          </div>
        </section>

        {/* ── QUICK LINKS TO TRADING PLANS ── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: data.accentBg }}>
              <ChevronRight className="w-4 h-4" style={{ color: data.accent }} />
            </div>
            Xem Kế hoạch Giao dịch
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.companies.map((c: any) => (
              <Link key={c.ticker} href={c.plan}>
                <div
                  className="flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:brightness-125"
                  style={{ background: data.accentBg, border: `1px solid ${data.accent}30` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black" style={{ color: data.accent, fontFamily: 'monospace' }}>{c.ticker}</span>
                    <span className="text-sm text-slate-300">{c.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: data.accent }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/advisor/macro-insights" className="inline-flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white" style={{ color: data.accent }}>
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách báo cáo
          </Link>
        </div>
      </div>
    </div>
  );
}
