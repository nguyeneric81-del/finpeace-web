import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Target, TrendingUp, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60;

// Korean translation lookup for known content from Supabase
const KR_TRANSLATIONS: Record<string, {
  company_name?: string;
  sector?: string;
  strategy_name?: string;
  timeframe?: string;
  entry_criteria?: string;
  exit_criteria?: string;
  analyst_note?: string;
  catalyst_note?: string;
}> = {
  HAH: {
    company_name: "하이안 해운 & 항만 물류 주식회사",
    sector: "항만 - 물류",
    strategy_name: "대형 기반 돌파 — 상승 추세 지속",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "58.0원 부근 매수 포지션 진입. 갭 상승 돌파 시 추가 매수. 거래량은 20일 평균 대비 130% 이상 동반 필수.",
    exit_criteria: "53.87원 이하 일봉 종가 시 전량 손절. 익절은 분할 청산: 63원에서 50%, 70.68원에서 나머지 50%.",
    analyst_note: "HAH는 3척의 신규 선박 투입과 고운임 계약 재체결로 2026년 매출 +18% 성장이 확실시된다. 아시아 내 운임 상승이 핵심 촉매.",
    catalyst_note: "2026년 Q2 SCFI 지수 2,800포인트 유지 시 순이익률 추가 +5~8% 개선 가능."
  },
  VOS: {
    company_name: "베트남 해양 운송 주식회사 (VOSCO)",
    sector: "항만 - 물류",
    strategy_name: "대형 기반 하단 매수 — 반등 포착",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "13.80~14.40원 구간 분할 매수. 하단 지지 확인 후 진입. 거래량 동반 필수.",
    exit_criteria: "11.63원 이하 일봉 종가 시 전량 손절. 익절 목표 20.24원.",
    analyst_note: "VOSCO의 벌크 선단은 운임 상승 사이클의 단기 수혜가 기대된다. 다만 노후 선박 비율이 높아 장기 리스크 관리 필요.",
    catalyst_note: "드라이 벌크 운임 BDI 지수 회복 시 단기 트레이딩 기회 유효."
  },
  VHC: {
    company_name: "빙호안 주식회사",
    sector: "수산 - 식품",
    strategy_name: "달러 강세 수혜 — 수출 마진 확대",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "수출 실적 발표 전 저점 분할 매수. 52주 지지선 확인 후 진입.",
    exit_criteria: "손절선 이탈 시 즉시 청산. 목표가 도달 시 분할 익절.",
    analyst_note: "VHC는 달러 강세 이중 수혜 구조: 수출 단가 상승 + 달러 수취. 환차익이 총매출의 +4.5% 추가 기여 예상.",
    catalyst_note: "USD/VND 25,500동 유지 시 2026년 매출총이익률 18% 달성 가능."
  },
  MWG: {
    company_name: "모바일월드 투자 주식회사",
    sector: "소매 - 소비재",
    strategy_name: "저점 반등 — 소비 회복 베팅",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "지지구간에서 거래량 증가 확인 후 매수. 반등 신호 포착 필수.",
    exit_criteria: "지지선 이탈 시 손절. 저항선 도달 시 분할 익절.",
    analyst_note: "MWG는 Apple 부품 환율 부담이 단기 리스크요인. 그러나 ICT 수요 회복 시 매출 반등 여력 충분.",
    catalyst_note: "베트남 소비 심리 회복 및 iPhone 신모델 출시 시즌이 핵심 촉매."
  },
  KBC: {
    company_name: "킨박 도시개발 주식회사",
    sector: "부동산 - 산업단지",
    strategy_name: "FDI 수혜 — 산업단지 실적 급등",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "Trang Due 3 산단 인도 계약 공시 확인 후 매수. 조정 시 분할 매수.",
    exit_criteria: "산단 계획 변경 이슈 발생 시 즉시 손절. 목표가에서 분할 익절.",
    analyst_note: "KBC의 Trang Due 3 산단 100ha LG이노텍 인도는 2026년 순이익 +120% YoY 급등의 핵심 동력. 토지 가용성 희소로 가격 결정권 보유.",
    catalyst_note: "2026년 Q3 인도 공식 완료 후 일회성 대규모 이익 인식 예정."
  },
  DGC: {
    company_name: "득장 화학 주식회사",
    sector: "화학 - 소재",
    strategy_name: "반도체 화학 수요 급증 — 글로벌 테마 수혜",
    timeframe: "중기 (Mid-term)",
    entry_criteria: "글로벌 인 가격 상승 확인 후 분할 매수. 기술적 지지선 이탈 없을 시 유지.",
    exit_criteria: "글로벌 화학 수요 둔화 신호 시 익절. 손절선 이탈 시 즉시 청산.",
    analyst_note: "DGC는 반도체 제조용 인(Phosphorus) 글로벌 수요 급증의 직접 수혜주. 베트남 내 유일한 대규모 생산 업체로 공급 독점력 보유.",
    catalyst_note: "반도체 FDI 베트남 집중 투자 지속 시 중기 판가 지지 확실."
  }
};

export default async function TradingPlanKrPage({ params }: { params: Promise<{ ticker: string }> }) {
    const resolvedParams = await params;
    const ticker = resolvedParams.ticker.toUpperCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: plan } = await supabase
        .from('trading_plans')
        .select('*')
        .eq('ticker', ticker)
        .single();

    if (!plan) {
        notFound();
    }

    // Merge Korean translations over raw DB data
    const kr = KR_TRANSLATIONS[ticker] || {};
    const company_name = kr.company_name || plan.company_name;
    const sector = kr.sector || plan.sector;
    const strategy_name = kr.strategy_name || plan.strategy_name;
    const timeframe = kr.timeframe || plan.timeframe;
    const entry_criteria = kr.entry_criteria || plan.entry_criteria;
    const exit_criteria = kr.exit_criteria || plan.exit_criteria;
    const analyst_note = kr.analyst_note || plan.analyst_note;
    const catalyst_note = kr.catalyst_note || plan.catalyst_note;

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/advisor/macro-insights-kr" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-800">{plan.ticker}</h1>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                {plan.status === 'active' ? '활성화 중' : '보관됨'}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">{company_name} · {sector}</p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Target className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-1">전략</p>
                                <p className="text-xl font-bold text-slate-800">{strategy_name}</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-700">{timeframe}</span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                <p className="text-xs font-bold text-blue-600/80 uppercase tracking-wider mb-2">📥 매수 구간</p>
                                <p className="text-lg font-bold text-blue-900">{plan.entry_zone}</p>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                                <p className="text-xs font-bold text-rose-600/80 uppercase tracking-wider mb-2">🛑 손절</p>
                                <p className="text-lg font-bold text-rose-900">{plan.stop_loss}</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-wider mb-2">🎯 익절</p>
                                <p className="text-lg font-bold text-emerald-900">{plan.take_profit}</p>
                            </div>
                            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4">
                                <p className="text-xs font-bold text-slate-600/80 uppercase tracking-wider mb-2">⚡ R:R 비율</p>
                                <p className="text-lg font-bold text-slate-800">{plan.risk_reward}</p>
                            </div>
                        </div>

                        {/* Chart Image */}
                        {plan.chart_image_url && (
                            <div className="mb-8">
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
                                    📊 기술적 분석 차트
                                </p>
                                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                                    <img src={plan.chart_image_url} alt={`${plan.ticker} 차트`} className="w-full object-contain max-h-[600px]" />
                                </div>
                            </div>
                        )}

                        {/* Notes Sections */}
                        <div className="space-y-6">
                            {entry_criteria && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">진입 조건</h3>
                                        <p className="text-slate-600 leading-relaxed">{entry_criteria}</p>
                                    </div>
                                </div>
                            )}

                            {exit_criteria && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-1">
                                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">청산 계획</h3>
                                        <p className="text-slate-600 leading-relaxed">{exit_criteria}</p>
                                    </div>
                                </div>
                            )}

                            {analyst_note && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">전문가 의견</h3>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                                            <p className="text-slate-700 leading-relaxed italic">{analyst_note}</p>
                                            {catalyst_note && (
                                                <p className="mt-4 pt-4 border-t border-amber-200/50 text-sm text-amber-800">
                                                    <strong>💡 촉매 요인:</strong> {catalyst_note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer tags */}
                        {plan.indicators && plan.indicators.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">사용된 기술적 신호</p>
                                <div className="flex flex-wrap gap-2">
                                    {plan.indicators.map((ind: string, idx: number) => (
                                        <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{ind}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400">
                    본 트레이딩 플랜은 FinPeace Advisor 팀이 작성했습니다. 포지션 진입 시 리스크 관리 원칙을 반드시 준수하시기 바랍니다.
                </p>
            </div>
        </div>
    )
}
