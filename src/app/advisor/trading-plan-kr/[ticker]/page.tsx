import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Target, AlertTriangle, TrendingUp, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60;

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
                        <p className="text-slate-500 font-medium">{plan.company_name} · {plan.sector}</p>
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
                                <p className="text-xl font-bold text-slate-800">{plan.strategy_name}</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-700">{plan.timeframe}</span>
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
                            {plan.entry_criteria && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">진입 조건</h3>
                                        <p className="text-slate-600 leading-relaxed">{plan.entry_criteria}</p>
                                    </div>
                                </div>
                            )}

                            {plan.exit_criteria && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-1">
                                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">청산 계획</h3>
                                        <p className="text-slate-600 leading-relaxed">{plan.exit_criteria}</p>
                                    </div>
                                </div>
                            )}

                            {plan.analyst_note && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-1">
                                        <CheckCircle2 className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-2">전문가 의견</h3>
                                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                                            <p className="text-slate-700 leading-relaxed italic">{plan.analyst_note}</p>
                                            {plan.catalyst_note && (
                                                <p className="mt-4 pt-4 border-t border-amber-200/50 text-sm text-amber-800">
                                                    <strong>💡 촉매 요인:</strong> {plan.catalyst_note}
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
