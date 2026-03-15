import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Target, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import TradingPlanGate from '@/components/TradingPlanGate'

export const revalidate = 60;

export default async function TradingPlanPage({ params }: { params: Promise<{ ticker: string }> }) {
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

    if (!plan) notFound();

    const isActive = plan.status === 'active';

    return (
        <div className="min-h-screen py-10 px-4" style={{ background: '#020617', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Back + header */}
                <div className="flex items-start gap-4">
                    <Link href="/advisor/macro-insights"
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:border-emerald-500/40"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'monospace' }}>{plan.ticker}</h1>
                            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{
                                background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.06)',
                                color: isActive ? '#10B981' : 'rgba(255,255,255,0.4)',
                                border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)'
                            }}>
                                {isActive ? '● Đang kích hoạt' : 'Lưu trữ'}
                            </span>
                        </div>
                        <p className="font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{plan.company_name} · {plan.sector}</p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.025] pointer-events-none">
                        <Target className="w-48 h-48 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                        <TradingPlanGate plan={plan} lang="vi" />
                    </div>
                </div>

                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    Kế hoạch được lập bởi đội ngũ FinPeace Advisor. Vui lòng tuân thủ kỷ luật quản lý rủi ro khi vào lệnh.
                </p>
            </div>
        </div>
    )
}
