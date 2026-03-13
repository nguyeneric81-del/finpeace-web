import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Target } from 'lucide-react'
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

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/advisor/macro-insights" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-800">{plan.ticker}</h1>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                {plan.status === 'active' ? 'Đang kích hoạt' : 'Lưu trữ'}
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
                        <TradingPlanGate plan={plan} lang="vi" />
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400">
                    Kế hoạch được lập bởi đội ngũ FinPeace Advisor. Vui lòng tuân thủ kỷ luật quản lý rủi ro khi vào lệnh.
                </p>
            </div>
        </div>
    )
}
