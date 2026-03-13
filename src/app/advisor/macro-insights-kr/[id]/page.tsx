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
    title: "지정학적 긴장 속 글로벌 물류비용 급등",
    industry: "국제 해운 & 선박 임대업",
    impact: "고운임 계약 재체결 사이클에 힘입어 2026년 Q2 업종 순이익률 +8%~12% 상승 전망.",
    stats: [
      { value: "2,800", label: "SCFI 지수 (포인트)", sub: "18개월 최고치", positive: true },
      { value: "-42%", label: "Q1/2026 수에즈 통과 선박", sub: "전년 동기 대비", positive: false },
      { value: "+18%", label: "HAH 2026 매출 성장", sub: "아시아 내 신규 선박 3척 투입", positive: true },
      { value: "+45%", label: "HAH Q2/2026 순이익 YoY", sub: "전망치", positive: true },
    ],
    chartData: [
      { name: "25/08", value: 1200 }, { name: "25/09", value: 1450 }, { name: "25/10", value: 1800 },
      { name: "25/11", value: 2100 }, { name: "25/12", value: 2350 }, { name: "26/01", value: 2600 },
      { name: "26/02", value: 2750 }, { name: "26/03", value: 2800 },
    ],
    chartLabel: "SCFI 컨테이너 운임 지수 — 최근 8개월",
    chartColor: "#34d399",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title 해상 운임 & HAH 영향
  desc SCFI Q1/2026 변동 → HAH 매출에 직접 영향
  lists
    - label SCFI 지수
      value 2,800
      desc 18개월 최고 (포인트)
    - label 수에즈 통과
      value -42%
      desc 전년 대비
    - label HAH 매출
      value +18%
      desc 신규 선박 3척 효과
    - label HAH Q2 순익
      value +45%
      desc YoY (전망)
`,
    behindStory: [
      {
        point: "홍해 지역 긴장 장기화로 아시아-유럽 항로 구조가 전면 재편되어, 선사들이 희망봉 우회 항로로 전환됨.",
        quote: "2026년 1분기 수에즈 운하를 통과한 화물선은 전년 동기 대비 42% 급감했으며, 평균 항해 시간이 14~21일 증가했다.",
        source: "SSI 리서치 거시경제 보고서 — 2026년 2월"
      },
      {
        point: "선박 회전율 저하로 아시아 주요 환적항(싱가포르, 상하이)에서 공 컨테이너 부족 현상 발생.",
        quote: "컨테이너 해상 운임 지수(SCFI)가 공식적으로 2,800포인트를 돌파하며 18개월 만에 최고치를 경신했다.",
        source: "드류리 해운 보고서 — 2026년 3월 1주차"
      },
      {
        point: "미국 동부 항만 하역 노동자 파업 위협이 공급망 추가 압박 요인으로 작용.",
        quote: "4만5천 명 이상의 미국 항만 노동자들이 임금 협상 결렬 시 2026년 여름 파업을 예고, 소매업체들의 조기 패닉 바잉 발주가 급증했다.",
        source: "Reuters / Supply Chain Dive"
      }
    ],
    analystView: "대부분의 증권사(VCBS, KIS)는 미국 소매업체들의 재고 확보 수요가 지속되어 스팟 운임 추가 상승 여력이 있다고 강조했다. 다만, 운임 선물 시장에서는 2026년 4분기에 신규 선박 약 200만 TEU가 시장에 투입되면서 이번 상승세가 진정될 것으로 가격을 책정하고 있다.",
    cycle: {
      lagging: "유럽행 SCFI 운임은 현재 TEU당 3,200달러 수준으로, 지난 6개월간 공급망 붕괴의 시차 효과로 인해 5년 평균(약 1,420달러) 대비 125% 급등했다.",
      leading: "이번 사건은 정기 용선 계약을 갱신하는 선사들의 수익에 직접적으로 반영된다. HAH의 경우, 국내 운임 상승과 신규 선박 3척의 아시아 내 항로 투입이 2026년 총매출에 +18%를 추가 기여할 것으로 추정된다."
    }
  },
  "2": {
    title: "Fed 금리 인하 지연 — 달러 강세 지속",
    industry: "수출 제조업 (섬유·수산) & 테크 리테일",
    impact: "달러 부채 비중 높은 기업 환손실 순이익 –3% 예상. 반면 달러 수출 기업은 순이익률 +1.5~2.5% 개선.",
    stats: [
      { value: "104.5", label: "DXY 지수", sub: "지지 유지, 환율 압박", positive: false },
      { value: "25,500", label: "USD/VND (병행시장)", sub: "연초 대비 +3.8%", positive: false },
      { value: "+4.5%", label: "VHC 환율 수혜 매출 버프", sub: "수출 총매출 대비", positive: true },
      { value: "18%", label: "VHC 매출총이익률", sub: "2025년 초 14%에서 상승", positive: true },
    ],
    chartData: [
      { name: "25/09", value: 101.2 }, { name: "25/10", value: 102.5 }, { name: "25/11", value: 103.1 },
      { name: "25/12", value: 103.8 }, { name: "26/01", value: 104.0 }, { name: "26/02", value: 104.3 },
      { name: "26/03", value: 104.5 },
    ],
    chartLabel: "DXY (달러 인덱스) — 최근 7개월",
    chartColor: "#f59e0b",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title 강달러: 수혜자와 피해자
  desc USD/VND 환율 변동이 베트남 상장기업에 미치는 영향 분석
  lists
    - label DXY 지수
      value 104.5
      desc 지지 유지 (포인트)
    - label USD/VND 자유시장
      value 25,500
      desc YTD +3.8%
    - label VHC 매출 버프
      value +4.5%
      desc 환차익 효과
    - label VHC 매출총이익률
      value 18%
      desc 2025년 초 14%→18%
`,
    behindStory: [
      {
        point: "예상을 뛰어넘는 미국 근원 PCE 물가지수 상승으로 시장의 조기 금리 인하 기대가 완전히 소멸됨.",
        quote: "2026년 1월 근원 PCE는 전년 대비 2.8% 상승했으며, 비농업 고용 지표는 27만5천 건의 신규 일자리를 창출해 월가 모든 예측치를 상회했다.",
        source: "Bloomberg / 미국 노동통계국 (BLS)"
      },
      {
        point: "USD와 VND 간의 극심한 금리 차이가 통화 투기(캐리 트레이드) 자금 유입을 촉발함.",
        quote: "DXY 지수가 104.5포인트 위에서 강하게 지지되며 USD/VND 자유시장 환율이 달러당 25,500동을 돌파하는 압박으로 이어졌다.",
        source: "MBS 통화시장 보고서 — 2026년 3월"
      },
      {
        point: "베트남 국가은행(NHNN)은 콜금리 관리를 위해 단기 통화시장에서 유동성 흡수 개입에 나섬.",
        quote: "베트남 국가은행은 28일 만기 어음을 세션당 15조 동 규모로 연속 발행하며 OMO 금리 수준을 끌어올렸다.",
        source: "Tin Nhanh Chung Khoan / SSI 리서치"
      }
    ],
    analystView: "시장은 Fed의 첫 금리 인하 시점을 빨라야 2026년 9월로 반영하고 있다. 분석가들의 의견은 크게 엇갈린다. 한편에서는 해외 부채 레버리지가 높은 기업에 환손실 위험을 경고하는 반면, 다른 한편에서는 환율 수혜와 견조한 수주 잔고를 바탕으로 목재·수산 수출 기업의 목표 주가를 상향 조정하고 있다.",
    cycle: {
      lagging: "미국 서비스·주거비 물가의 끈질긴 상승세(후행 지표)가 지난 6개월간 VND 은행 간 익일물 금리를 Fed 기금금리 대비 인위적으로 낮은 수준에 묶어 두었다.",
      leading: "25,500 VND/USD 수준의 고환율이 VHC(빙호안)의 순수익에 직접 기여하고 있다. 환차익이 VHC 총수출 매출의 약 +4.5%를 차지하며, 매출총이익률을 2025년 초 14%에서 18%로 끌어올린 것으로 추정된다."
    }
  },
  "3": {
    title: "차세대 FDI 물결 & 반도체 산업 자금 유입",
    industry: "도심 외곽 산업단지 부동산 (박닌·붕따우) & 화학·소재",
    impact: "산업용지 임대료 연 +6~8% 상승 예상. 북부 산업단지 입주율 90% 육박.",
    stats: [
      { value: "$4.29B", label: "2026년 2개월 FDI 등록", sub: "베트남 유입 YoY +38.6%", positive: true },
      { value: "90%", label: "북부 산업단지 입주율", sub: "가용 토지 공급 희소", positive: true },
      { value: "$140", label: "산업단지 토지 임대료 (USD/㎡)", sub: "2024년 말 대비 +8%", positive: true },
      { value: "+120%", label: "KBC 2026 순이익 전망 YoY", sub: "Trang Due 3 100ha 인도 효과", positive: true },
    ],
    chartData: [
      { name: "25/04", value: 2.1 }, { name: "25/06", value: 2.4 }, { name: "25/08", value: 2.8 },
      { name: "25/10", value: 3.1 }, { name: "25/12", value: 3.5 }, { name: "26/01", value: 3.9 },
      { name: "26/02", value: 4.29 },
    ],
    chartLabel: "베트남 FDI 신규 등록 누적액 (십억 달러)",
    chartColor: "#a78bfa",
    infographicSyntax: `infographic list-col-simple-horizontal-number
data
  title 베트남 반도체 FDI 물결
  desc 차세대 FDI 유입 → KBC & IDC 실적 급등
  lists
    - label FDI 2개월 누적
      value $4.29B
      desc +38.6% YoY
    - label 북부 산단 입주율
      value 90%
      desc 토지 공급 희소
    - label 산단 임대료
      value $140
      desc USD/㎡ (vs 2024 +8%)
    - label KBC 순이익 2026
      value +120%
      desc YoY (전망)
`,
    behindStory: [
      {
        point: "서방의 반도체 제조 지원법과 미중 갈등 리스크가 글로벌 조립 공급망 다변화(China+1)를 가속화하며 베트남으로 하이테크 FDI를 집중시킴.",
        quote: "2026년 1~2월 베트남 신규 FDI 등록액은 42억9천만 달러(+38.6% YoY)를 기록했으며, 이 중 약 60%가 반도체 제조·패키징 공정 관련 업종에 집중됐다.",
        source: "베트남 기획투자부 / 통계청(GSO)"
      },
      {
        point: "글로벌 테크 '앵커 기업'들이 북부 경제 회랑에 위성 공장 투자를 공식화하며 자금 집행에 돌입함.",
        quote: "Amkor Technology와 Hana Micron은 박닌·박장 반도체 패키징 거점 완공을 위해 15억 달러 이상의 2단계 투자를 발표했다.",
        source: "Nikkei Asia / 베트남 정부 포털"
      },
      {
        point: "가용 산업단지 부지 공급 병목이 외부 환경과 무관한 임대료 상승을 촉발함.",
        quote: "서울 인근 하노이 산업단지 주요 지역의 입주율이 안전 임계점인 90%를 넘어서며 평균 임대료가 ㎡당 140달러/임대주기에 달했다. 이는 2024년 말 대비 +8%이다.",
        source: "CBRE 베트남 시장 보고서 Q1/2026"
      }
    ],
    analystView: "KBSV와 Vietcap은 이번 흐름을 베트남의 10년 핵심 트렌드(Secular Trend)로 평가하는 데 의견이 일치한다. '이미 보상이 완료된 가용 토지(Clean Landbank)를 보유한 기업이 왕'이라는 원칙 하에, 2026~2027년 내 분양 가능한 토지가 있는 기업은 내수 소비 침체 리스크와 무관하게 독점적 가격 결정권을 갖는다고 강조했다.",
    cycle: {
      lagging: "2024~2025년 정부의 연쇄 외교 활동 기간에 집중 체결된 수십억 달러 규모의 FDI MOU가 후행 지표로서 쌓여 있다.",
      leading: "이는 IDC, KBC로 대규모 실물 현금 흐름 전환으로 이어진다. KBC의 경우, LG이노텍에 대한 Trang Due 3 산단 100ha 인도는 2026년 총매출의 65%를 차지할 전망이다. 임대료 +5% 개선(135달러/㎡)으로 KBC 순이익은 2025년 저점 대비 +120% YoY 성장하며 3조5천억 동에 달할 것으로 추정된다."
    }
  }
};

export default async function MacroDetailKrPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = mockDetails[resolvedParams.id];

  if (!data) return <div className="p-10 text-white">보고서를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/advisor/macro-insights-kr" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> 거시경제 인사이트로 돌아가기
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {data.title}
        </h1>

        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">업종: <span className="text-white">{data.industry}</span></h3>
          <p className="text-emerald-400 text-lg">
            <span className="font-bold uppercase">영향: </span> {data.impact}
          </p>
        </div>

        {/* ── INFOGRAPHIC ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">📊 핵심 수치 요약</p>
          <AntVInfographic syntax={data.infographicSyntax} width={800} height={220} />
        </div>
        <div className="mb-10">
          <MiniTrendChart data={data.chartData} label={data.chartLabel} color={data.chartColor} />
        </div>

        <div className="space-y-8">
          {/* 배경 스토리 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" /> 왜 일어났나? 사건의 배경 스토리
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
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest pl-6">— 출처: {item.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 애널리스트 뷰 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> 애널리스트 & 시장의 시각
            </h2>
            <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
              <p className="text-amber-100/90 leading-relaxed text-lg font-medium">"{data.analystView}"</p>
            </div>
          </section>

          {/* Lagging & Leading */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> 영향 사이클 (정량 분석 & 비교)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border-l-4 border-slate-500 p-6 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  후행 (Lagging) — 거시 데이터 지연 효과
                </p>
                <p className="text-slate-200 text-[15px] leading-relaxed">{data.cycle.lagging}</p>
              </div>
              <div className="bg-emerald-900/10 border-l-4 border-emerald-500 p-6 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  선행 (Leading) — 핵심 매출 견인
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
