'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, TrendingUp, AlertCircle, CheckCircle2, Compass, ShieldAlert, Wallet, Percent, PiggyBank, Maximize2, CircleDot, Zap, ArrowRight } from 'lucide-react'
import { SIPJourneyTracker } from '@/components/wealth-planning/SIPJourneyTracker'
import type { FinancialPlan } from '@/app/dashboard/wealth-planning/WealthPlanningClient'

type ActionPlan = { id: string; category: string; task_name: string; amount_required: number; status: string }
type Scenario = { id: string; plan_name: string; initial_capital: number; monthly_cashflow: number; target_amount: number; target_years: number; expected_return: number; is_selected: boolean }
type Asset = { id: string; asset_name: string; asset_group: string; amount: number; is_liquid: boolean; risk_level: number }
type Cashflow = { annual_income: number; annual_expense: number; annual_saving: number; surplus_ratio: number }

const fmtVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val || 0) + ' ₫'
const fmtVNDShort = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} tỷ`
    if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(0)} tr`
    return fmtVND(val)
}

export function ActionPlanManager({ userId, financialPlan }: { userId: string; financialPlan?: FinancialPlan | null }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [scenario, setScenario] = useState<Scenario | null>(null)
    const [assets, setAssets] = useState<Asset[]>([])
    const [cashflow, setCashflow] = useState<Cashflow | null>(null)
    const [plans, setPlans] = useState<ActionPlan[]>([])
    const [category, setCategory] = useState('Tái cấu trúc rủi ro')
    const [task, setTask] = useState('')
    const [amount, setAmount] = useState('')
    const [tradingPlans, setTradingPlans] = useState<any[]>([])

    useEffect(() => {
        fetch(`/api/advisor/portfolio?user_id=${userId}`).then(r => r.ok ? r.json() : null).then(data => {
            if (data?.result?.matched_plans) setTradingPlans(data.result.matched_plans)
        })
    }, [userId])

    useEffect(() => { fetchAllData() }, [userId])

    async function fetchAllData() {
        setLoading(true)
        const [scenRes, assetRes, cashRes, planRes] = await Promise.all([
            supabase.from('wealth_scenarios').select('*').eq('user_id', userId).eq('is_selected', true).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('client_assets').select('*').eq('user_id', userId),
            supabase.from('client_cashflow').select('*').eq('user_id', userId).single(),
            supabase.from('action_plans').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        ])
        if (scenRes.data) setScenario(scenRes.data)
        if (assetRes.data) setAssets(assetRes.data)
        if (cashRes.data) setCashflow(cashRes.data)
        if (planRes.data) setPlans(planRes.data)
        setLoading(false)
    }

    async function handleAddPlan(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('action_plans').insert({
            user_id: userId, category, task_name: task, amount_required: Number(amount) || 0, status: 'pending',
        })
        if (!error) { setTask(''); setAmount(''); fetchAllData() }
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        await supabase.from('action_plans').update({ status: currentStatus === 'completed' ? 'pending' : 'completed' }).eq('id', id)
        fetchAllData()
    }
    async function handleDelete(id: string) {
        await supabase.from('action_plans').delete().eq('id', id)
        fetchAllData()
    }

    if (loading) return (
        <div className="animate-pulse space-y-4">
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
            <div className="h-64 bg-white/5 rounded-2xl border border-white/10" />
        </div>
    )

    const planMonthly = financialPlan?.requiredMonthlySaving ?? (scenario?.monthly_cashflow ?? 0)
    const currentMonthlySaving = cashflow ? cashflow.annual_saving / 12 : 0
    const feasibilityPct = planMonthly > 0 ? (currentMonthlySaving / planMonthly) * 100 : 100
    const feasibilityStatus = feasibilityPct >= 95 ? 'green' : feasibilityPct >= 70 ? 'yellow' : 'red'

    if (!scenario && !financialPlan) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-dashed border-white/20 p-16 text-center">
                <Compass className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white/60 mb-2">Chưa có Kịch bản nào được chốt</h3>
                <p className="text-white/30 max-w-sm mx-auto text-sm">Hãy quay lại "Thiết Kế Tương Lai", thiết lập Ước mơ và chọn "Chốt Kịch Bản Này" để xem Kế Hoạch Hành Động.</p>
            </div>
        )
    }

    const scenarioInitialCapital = scenario?.initial_capital ?? financialPlan?.initialCapital ?? 0
    const scenarioMonthlyCashflow = scenario?.monthly_cashflow ?? financialPlan?.requiredMonthlySaving ?? 0
    const scenarioExpectedReturn = scenario?.expected_return ?? financialPlan?.expectedReturn ?? 10

    const liquidAssets = assets.filter(a => a.asset_group === 'Thanh khoản' || a.asset_group === 'Tích lũy & Đầu tư').reduce((sum, a) => sum + Number(a.amount || 0), 0)
    const capitalShortfall = scenarioInitialCapital > liquidAssets ? scenarioInitialCapital - liquidAssets : 0
    const monthlyShortfall = scenarioMonthlyCashflow > currentMonthlySaving ? scenarioMonthlyCashflow - currentMonthlySaving : 0

    let riskProfile = ''
    let recommendedAssets: string[] = []
    if (scenarioExpectedReturn < 8) {
        riskProfile = 'Thận Trọng (An Toàn Lên Ngôi)'
        recommendedAssets = ['Tiền gửi Tiết kiệm kỳ hạn dài', 'Trái phiếu Doanh nghiệp top đầu', 'Chứng chỉ quỹ Trái phiếu']
    } else if (scenarioExpectedReturn <= 12) {
        riskProfile = 'Cân Bằng (Tăng Trưởng Bền Vững)'
        recommendedAssets = ['50% Tiền gửi & Trái phiếu', '50% Chứng chỉ quỹ Cổ phiếu hoặc Cổ phiếu Bluechip (VN30)', 'Có thể tích sản Vàng']
    } else {
        riskProfile = 'Bứt Phá (Đầu Tư Mạo Hiểm)'
        recommendedAssets = ['Khởi nghiệp kinh doanh', 'Cổ phiếu Vốn hóa Vừa/Nhỏ (Midcap/Penny) tiềm năng', 'Bất động sản dòng tiền/lãi vốn vùng ven']
    }

    const feasibilityCfg = {
        green: { bar: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'On Track', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
        yellow: { bar: 'bg-amber-400', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Cần điều chỉnh', icon: <AlertCircle className="w-4 h-4 text-amber-400" /> },
        red: { bar: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: 'Cần hành động', icon: <AlertCircle className="w-4 h-4 text-rose-400" /> },
    }[feasibilityStatus]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* FEASIBILITY */}
            {(financialPlan || scenario) && (
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur shadow-xl`}>
                    <div className={`h-1 ${feasibilityCfg.bar}`} />
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <CircleDot className={`w-5 h-5 ${feasibilityCfg.text}`} />
                                <h3 className="text-base font-bold text-white">Đánh Giá Tính Khả Thi</h3>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${feasibilityCfg.badge} flex items-center gap-1.5`}>
                                {feasibilityCfg.icon} {feasibilityCfg.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Kế hoạch yêu cầu', value: fmtVND(planMonthly), sub: '/tháng', color: 'text-white/80' },
                                { label: 'Khả năng hiện tại', value: fmtVND(currentMonthlySaving), sub: '/tháng', color: feasibilityCfg.text },
                                { label: 'Tỷ lệ đáp ứng', value: `${feasibilityPct.toFixed(0)}%`, sub: '', color: feasibilityCfg.text },
                            ].map((item) => (
                                <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                    <p className="text-xs text-white/40 mb-2">{item.label}</p>
                                    <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                                    <p className="text-[10px] text-white/30">{item.sub}</p>
                                </div>
                            ))}
                        </div>

                        {feasibilityStatus !== 'green' && (
                            <div className={`mt-4 p-4 rounded-xl text-sm flex gap-2 ${feasibilityStatus === 'yellow' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : 'bg-rose-500/10 border border-rose-500/20 text-rose-200'}`}>
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    {feasibilityStatus === 'yellow' ? (
                                        <><strong>Cần tối ưu thêm {fmtVNDShort(planMonthly - currentMonthlySaving)}/tháng.</strong> Xem xét cắt giảm chi phí không thiết yếu hoặc tìm thêm nguồn thu nhập phụ.</>
                                    ) : (
                                        <><strong>Thiếu hụt {fmtVNDShort(planMonthly - currentMonthlySaving)}/tháng.</strong> Cân nhắc: (1) Kéo dài timeline, (2) Giảm target, hoặc (3) Tăng vốn ban đầu commit.</>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* LIGHTHOUSE / GOAL */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-teal-900/20 to-slate-900/60 border border-emerald-500/20 p-6 shadow-xl shadow-emerald-500/10">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ngọn Hải Đăng Của Bạn</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{scenario?.plan_name || financialPlan?.goalName || 'Mục tiêu Tài chính'}</h3>
                    <p className="text-white/50 text-sm">
                        Hành trình vạn dặm bắt đầu từ mục tiêu đạt{' '}
                        <strong className="text-emerald-400">{fmtVNDShort(scenario?.target_amount ?? financialPlan?.targetAmount ?? 0)}</strong>{' '}
                        trong vòng <strong className="text-emerald-400">{scenario?.target_years ?? financialPlan?.timelineYears ?? 0} năm</strong> tới.
                    </p>
                </div>
            </div>

            {/* SIP JOURNEY TRACKER */}
            <SIPJourneyTracker userId={userId} />

            {/* TRADING PLANS */}
            {tradingPlans.length > 0 && (
                <div className="space-y-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Kế hoạch Giao dịch Cổ phiếu</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        {tradingPlans.map((plan: any, idx) => (
                            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 shadow-xl">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 text-white font-black text-xl px-4 py-1.5 rounded-xl border border-white/30">
                                                {plan.ticker}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg">{plan.company_name || plan.ticker}</p>
                                                {plan.wave_index && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80 font-bold">
                                                        {plan.wave_index}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Chiến lược</p>
                                            <p className="text-sm font-bold bg-white/15 px-3 py-1 rounded-lg border border-white/10 text-white">{plan.strategy_name}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-5">
                                        {/* Metrics */}
                                        <div className="lg:col-span-2 p-6 border-r border-white/10 space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Vùng mua', value: plan.entry_zone, color: 'text-emerald-400' },
                                                    { label: 'Cắt lỗ (SL)', value: plan.stop_loss, color: 'text-rose-400' },
                                                    { label: 'Chốt lời (TP)', value: plan.take_profit, color: 'text-emerald-300' },
                                                    { label: 'Tỉ lệ R:R', value: plan.risk_reward, color: 'text-white/80' },
                                                ].map(m => (
                                                    <div key={m.label} className="relative">
                                                        <p className="text-[10px] text-white/40 font-bold uppercase mb-1">{m.label}</p>
                                                        <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            {plan.area_symmetry_note && (
                                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Logic Area Symmetry</span>
                                                    </div>
                                                    <p className="text-sm text-amber-200 leading-relaxed">{plan.area_symmetry_note}</p>
                                                </div>
                                            )}
                                            {plan.analyst_note && (
                                                <div>
                                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Luận điểm Advisor</p>
                                                    <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-white/20 pl-3">{plan.analyst_note}</p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Chart */}
                                        <div className="lg:col-span-3 p-6 flex flex-col justify-center">
                                            {plan.chart_image_url ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Đồ thị phân tích kỹ thuật</p>
                                                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                                            <Maximize2 className="w-3 h-3" /> Xem chi tiết
                                                        </span>
                                                    </div>
                                                    <div className="rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in">
                                                        <img src={plan.chart_image_url} alt={`Chart ${plan.ticker}`}
                                                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full min-h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                                                    <p className="text-white/30 text-sm italic">Đang cập nhật đồ thị...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* CAPITAL & CASHFLOW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Capital */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-900/40 via-slate-800/60 to-slate-900/80 border border-sky-500/20 shadow-xl p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-sky-500/10 blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center">
                                <Wallet className="w-3.5 h-3.5 text-sky-400" />
                            </div>
                            <h3 className="font-bold text-white">Chiến Lược Vốn Ban Đầu</h3>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                            <div>
                                <p className="text-xs text-white/40 mb-1">Kịch bản yêu cầu</p>
                                <p className="text-xl font-black text-sky-400">{fmtVND(scenarioInitialCapital)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/40 mb-1">Tài sản hiện có</p>
                                <p className="text-base font-bold text-white/70">{fmtVND(liquidAssets)}</p>
                            </div>
                        </div>
                        {capitalShortfall > 0 ? (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-sm text-amber-200">
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Thiếu hụt {fmtVNDShort(capitalShortfall)}</p>
                                    <p className="text-amber-300/70 text-xs">Cần bán bớt tài sản hoặc vay thêm để đủ vốn ban đầu.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3 text-sm text-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Vốn mồi đã sẵn sàng!</p>
                                    <p className="text-emerald-300/70 text-xs">Tài sản hiện hữu đủ để khởi động. Bước tiếp: dịch chuyển tiền vào đúng danh mục.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cashflow */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/40 via-slate-800/60 to-slate-900/80 border border-violet-500/20 shadow-xl p-6">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                <PiggyBank className="w-3.5 h-3.5 text-violet-400" />
                            </div>
                            <h3 className="font-bold text-white">Kỷ Luật Góp Hàng Tháng</h3>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                            <div>
                                <p className="text-xs text-white/40 mb-1">Kịch bản yêu cầu</p>
                                <p className="text-xl font-black text-violet-400">{fmtVND(scenarioMonthlyCashflow)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/40 mb-1">Thặng dư hiện tại</p>
                                <p className="text-base font-bold text-white/70">{fmtVND(currentMonthlySaving)}</p>
                            </div>
                        </div>
                        {monthlyShortfall > 0 ? (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex gap-3 text-sm text-rose-200">
                                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Cần gia tăng {fmtVNDShort(monthlyShortfall)}/tháng</p>
                                    <p className="text-rose-300/70 text-xs">Cắt giảm chi không thiết yếu, hoặc tăng thu nhập ngay.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3 text-sm text-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Kỷ luật rất tốt!</p>
                                    <p className="text-emerald-300/70 text-xs">Thặng dư hàng tháng đáp ứng đủ kịch bản mà không hy sinh chất lượng cuộc sống.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* INVESTMENT COMPASS */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-800/60 to-slate-900/80 border border-indigo-500/20 shadow-xl p-6">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Compass className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">La Bàn Đầu Tư</span>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">Khuyến nghị thiết lập Danh mục Tư Duy</h3>
                    <p className="text-white/40 text-sm mb-6">
                        Để đạt <strong className="text-indigo-400">{scenarioExpectedReturn}%/năm</strong>, khẩu vị rủi ro của bạn: <strong className="text-white/70">{riskProfile}</strong>
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                        <h4 className="text-sm font-bold text-white/70 flex items-center gap-2">
                            <Percent className="w-3.5 h-3.5 text-indigo-400" /> Các kênh tài sản phù hợp:
                        </h4>
                        <ul className="space-y-2.5">
                            {recommendedAssets.map((asset, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-white/60 text-sm">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                    {asset}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {scenarioExpectedReturn > 12 && (
                        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-sm text-amber-200">
                            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                            <p><strong>Lưu ý:</strong> Kịch bản này có biên độ dao động lớn! Đảm bảo đã có <strong>Quỹ Khẩn Cấp ≥ 6 tháng</strong> và <strong>Bảo hiểm Y tế</strong> trước khi dồn tiền vào đây.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ACTION NOTE SECTION */}
            <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Ghi chú Hành động Cụ thể</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Add task */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 shadow-xl overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4 bg-white/3">
                        <h3 className="text-sm font-bold text-white/70">Thêm Phiếu Việc Làm</h3>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleAddPlan} className="space-y-3">
                            <select
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80 focus:outline-none focus:border-indigo-500/50"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="Tái cấu trúc nợ">Cắt Nợ Tiêu Dùng / Trả Vay</option>
                                <option value="Lập quỹ">Xây Quỹ Khẩn Cấp</option>
                                <option value="Đầu tư">Đầu tư vào Danh Mục Đề Xuất</option>
                                <option value="Khác">Hành động Khác</option>
                            </select>
                            <Input required value={task} onChange={e => setTask(e.target.value)}
                                placeholder="Tên việc cần làm..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-indigo-500/50" />
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                placeholder="Số tiền tương ứng (nếu có)"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-indigo-500/50" />
                            <Button type="submit" className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/15">
                                Lưu Việc Này
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Checklist */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 shadow-xl overflow-hidden">
                    <div className="border-b border-white/10 px-6 py-4 bg-white/3">
                        <h3 className="text-sm font-bold text-white/70">Checklist Thực Thi</h3>
                    </div>
                    <div className="p-4 max-h-[280px] overflow-y-auto space-y-2">
                        {plans.length === 0 ? (
                            <p className="text-white/25 text-sm italic text-center py-10">Chưa có nhiệm vụ nào được ghi chú.</p>
                        ) : plans.map(p => (
                            <div key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border text-sm transition-all ${p.status === 'completed' ? 'bg-white/3 border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}>
                                <button onClick={() => handleToggleStatus(p.id, p.status)}
                                    className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${p.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 hover:border-white/40'}`}>
                                    {p.status === 'completed' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${p.status === 'completed' ? 'line-through text-white/30' : 'text-white/80'}`}>{p.task_name}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{p.category}</span>
                                        {p.amount_required > 0 && <span className="text-[11px] font-bold text-emerald-400">{fmtVND(p.amount_required)}</span>}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(p.id)} className="text-white/20 hover:text-rose-400 transition-colors p-1 shrink-0">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
