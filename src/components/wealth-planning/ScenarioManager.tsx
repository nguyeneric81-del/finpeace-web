'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { Target, TrendingUp, ShieldCheck, Map, ArrowRight, Save, Coins, Clock, Sparkles, CheckCircle2, Zap } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const DEFAULT_INFLATION = 3.5

const fmtVND = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} Tỷ`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(value)
}

const fmtVNDShort = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} Tỷ`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(value)
}

const calculateFV = (P: number, PMT: number, r: number, n: number) => {
    const rate = r / 100
    if (rate === 0) return P + PMT * 12 * n
    const compoundPrincipal = P * Math.pow(1 + rate, n)
    const compoundCashflow = (PMT * 12) * ((Math.pow(1 + rate, n) - 1) / rate)
    return compoundPrincipal + compoundCashflow
}

import type { FinancialPlan } from '@/app/dashboard/wealth-planning/WealthPlanningClient'

const SCENARIO_CONFIG = {
    safe: {
        name: 'Thận Trọng',
        gradient: 'from-emerald-600/30 via-emerald-500/10 to-transparent',
        glow: 'shadow-emerald-500/20',
        accent: 'text-emerald-400',
        accentBg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        bar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
        btn: 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25',
        chart: '#10b981',
        icon: ShieldCheck,
    },
    balanced: {
        name: 'Cân Bằng',
        gradient: 'from-sky-600/30 via-sky-500/10 to-transparent',
        glow: 'shadow-sky-500/20',
        accent: 'text-sky-400',
        accentBg: 'bg-sky-500/15',
        border: 'border-sky-500/30',
        bar: 'bg-gradient-to-r from-sky-400 to-blue-500',
        btn: 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25',
        chart: '#38bdf8',
        icon: Map,
    },
    growth: {
        name: 'Tăng Trưởng',
        gradient: 'from-amber-600/30 via-amber-500/10 to-transparent',
        glow: 'shadow-amber-500/20',
        accent: 'text-amber-400',
        accentBg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
        btn: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25',
        chart: '#f59e0b',
        icon: TrendingUp,
    },
}

export function ScenarioManager({ userId, onNavigateToActionPlan, onPlanCommit }: { userId: string, onNavigateToActionPlan?: () => void, onPlanCommit?: (plan: FinancialPlan) => void }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [realNetWorth, setRealNetWorth] = useState(0)
    const [realCashflow, setRealCashflow] = useState(0)
    const [savedScenarioId, setSavedScenarioId] = useState<string | null>(null)
    const [step, setStep] = useState<1 | 2>(1)
    const [dreamName, setDreamName] = useState('')
    const [targetAmount, setTargetAmount] = useState<number>(5000000000)
    const [targetYears, setTargetYears] = useState<number>(10)

    const [scenarios, setScenarios] = useState({
        safe: { rate: 6, pmt: 0, capital: 0 },
        balanced: { rate: 10, pmt: 0, capital: 0 },
        growth: { rate: 15, pmt: 0, capital: 0 },
    })

    useEffect(() => { fetchInitialData() }, [])

    async function fetchInitialData() {
        setLoading(true)
        const { data: assets } = await supabase.from('client_assets').select('amount, asset_group').eq('user_id', userId)
        let totalWealth = 0
        if (assets) {
            totalWealth = assets.filter(a => ['Thanh Khoản', 'Đầu Tư'].includes(a.asset_group)).reduce((sum, item) => sum + (item.amount || 0), 0)
        }
        setRealNetWorth(totalWealth)

        const { data: cashflow } = await supabase.from('client_cashflow').select('annual_saving').eq('user_id', userId).single()
        let monthly = 0
        if (cashflow && cashflow.annual_saving > 0) monthly = Math.floor(cashflow.annual_saving / 12)
        setRealCashflow(monthly)

        const { data: existingScenario } = await supabase.from('wealth_scenarios').select('*').eq('user_id', userId).eq('is_selected', true).single()
        if (existingScenario) {
            setSavedScenarioId(existingScenario.id)
            setDreamName(existingScenario.plan_name.split(' - ')[0] || 'Mục tiêu của tôi')
            setTargetAmount(existingScenario.target_amount)
            setTargetYears(existingScenario.target_years)
        }

        setScenarios(prev => ({
            safe: { ...prev.safe, capital: totalWealth, pmt: monthly },
            balanced: { ...prev.balanced, capital: totalWealth, pmt: monthly },
            growth: { ...prev.growth, capital: totalWealth, pmt: monthly },
        }))
        setLoading(false)
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!dreamName || targetAmount <= 0 || targetYears <= 0) return
        setStep(2)
    }

    const chartData = useMemo(() => {
        if (step === 1) return []
        const data = []
        for (let i = 0; i <= targetYears; i++) {
            data.push({
                year: `Năm ${i}`,
                safe: calculateFV(scenarios.safe.capital, scenarios.safe.pmt, scenarios.safe.rate, i),
                balanced: calculateFV(scenarios.balanced.capital, scenarios.balanced.pmt, scenarios.balanced.rate, i),
                growth: calculateFV(scenarios.growth.capital, scenarios.growth.pmt, scenarios.growth.rate, i),
                target: targetAmount,
            })
        }
        return data
    }, [scenarios, targetYears, targetAmount, step])

    const handleSaveScenario = async (type: 'safe' | 'balanced' | 'growth') => {
        const cfg = SCENARIO_CONFIG[type]
        const s = scenarios[type]
        const planFullName = `${dreamName} - ${cfg.name}`

        const rate = s.rate / 100
        const n = targetYears
        const fvFromCapital = s.capital * Math.pow(1 + rate, n)
        const remaining = Math.max(0, targetAmount - fvFromCapital)
        const requiredMonthly = rate > 0 && n > 0
            ? remaining / (12 * ((Math.pow(1 + rate, n) - 1) / rate))
            : remaining / (12 * n)

        await supabase.from('wealth_scenarios').update({ is_selected: false }).eq('user_id', userId)

        const { data, error } = await supabase.from('wealth_scenarios').insert({
            user_id: userId,
            plan_name: planFullName,
            initial_capital: s.capital,
            monthly_cashflow: s.pmt,
            target_amount: targetAmount,
            target_years: targetYears,
            inflation_rate: DEFAULT_INFLATION,
            is_selected: true,
        }).select().single()

        if (!error && data) {
            setSavedScenarioId(data.id)
            if (onPlanCommit) {
                onPlanCommit({
                    goalName: dreamName,
                    targetAmount,
                    timelineYears: targetYears,
                    initialCapital: s.capital,
                    expectedReturn: s.rate,
                    requiredMonthlySaving: Math.round(requiredMonthly),
                    scenarioType: type,
                })
            } else if (onNavigateToActionPlan) {
                onNavigateToActionPlan()
            }
        }
    }

    if (loading) return (
        <div className="p-8 text-center">
            <div className="inline-flex gap-2 items-center text-white/40">
                <div className="w-4 h-4 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
                Đang tải nguồn lực hiện tại...
            </div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        Thiết Kế Tương Lai
                    </h2>
                    <p className="text-white/40 mt-1 ml-12">Lập bản đồ đường đi từ Hiện tại tới Ước mơ của bạn.</p>
                </div>
                {step === 2 && (
                    <Button variant="outline" onClick={() => setStep(1)}
                        className="border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
                        Sửa Ước Mơ
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="max-w-2xl mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border border-white/10 backdrop-blur shadow-2xl">
                            {/* Accent top bar */}
                            <div className="h-1 bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500" />

                            {/* Glow orb */}
                            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-violet-500/5 blur-3xl" />

                            <div className="relative p-8">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">Bước 1: Hình Dung Ước Mơ</h3>
                                    <p className="text-white/40 text-sm">Bạn dự định dùng số tiền này để làm gì?</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-white/70">Tên Ước Mơ</label>
                                        <Input
                                            autoFocus
                                            placeholder="VD: Mua nhà Vinhome, Quỹ hưu trí Bình An, Đi du học..."
                                            value={dreamName}
                                            onChange={e => setDreamName(e.target.value)}
                                            className="text-base py-5 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-violet-500/50 focus:ring-violet-500/20"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-white/70 flex justify-between">
                                                <span>Số tiền cần (VNĐ)</span>
                                                <span className="text-violet-400 font-bold">{fmtVND(targetAmount)}</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={targetAmount}
                                                onChange={e => setTargetAmount(Number(e.target.value))}
                                                className="font-mono bg-white/5 border-white/10 text-white focus:border-violet-500/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-white/70">Thời gian (Năm)</label>
                                            <Input
                                                type="number"
                                                value={targetYears}
                                                onChange={e => setTargetYears(Number(e.target.value))}
                                                className="bg-white/5 border-white/10 text-white focus:border-violet-500/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Resources panel */}
                                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between mt-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Nguồn Lực Hiện Có</p>
                                            <p className="text-sm text-white/70">
                                                Vốn rót: <span className="font-bold text-emerald-400">{fmtVND(realNetWorth)}</span>
                                            </p>
                                            <p className="text-sm text-white/70">
                                                Dòng tiền: <span className="font-bold text-sky-400">{fmtVND(realCashflow)}/tháng</span>
                                            </p>
                                        </div>
                                        <Button type="submit" size="lg" className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25 gap-2">
                                            Lên Kịch Bản <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

                        {/* Dream Banner */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/60 via-indigo-900/40 to-slate-900/60 border border-violet-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-violet-500/10">
                            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-violet-500/10 blur-3xl" />
                            <div className="relative flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center border border-violet-500/30">
                                    <Target className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-1">Mục Tiêu Của Bạn</p>
                                    <h3 className="text-2xl font-black text-white">{dreamName}</h3>
                                </div>
                            </div>
                            <div className="relative flex gap-8 text-right bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                <div>
                                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Cần đạt được</p>
                                    <p className="text-xl font-black text-white">{fmtVND(targetAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Thời gian</p>
                                    <p className="text-xl font-black text-white">{targetYears} Năm</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur shadow-xl p-6">
                            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/5 blur-3xl" />
                            <div className="mb-4">
                                <h3 className="text-base font-bold text-white">Cỗ Máy Lãi Kép: So Sánh 3 Phương Án</h3>
                                <p className="text-white/40 text-sm">Sự thay đổi của tài sản sau {targetYears} năm theo Lãi Kép tự động.</p>
                            </div>
                            <div className="h-[340px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} dy={8} />
                                        <YAxis tickFormatter={(val) => fmtVNDShort(val)} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [fmtVND(value), name === 'target' ? 'Mục Tiêu' : name === 'safe' ? 'An Toàn' : name === 'balanced' ? 'Cân Bằng' : 'Tăng Trưởng']}
                                            contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                                            labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: 16, color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                                        <Line type="monotone" name="An Toàn" dataKey="safe" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
                                        <Line type="monotone" name="Cân Bằng" dataKey="balanced" stroke="#38bdf8" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#38bdf8' }} />
                                        <Line type="monotone" name="Tăng Trưởng" dataKey="growth" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
                                        <Line type="monotone" name="Mục Tiêu" dataKey="target" stroke="#f87171" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 3 Scenario Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {(['safe', 'balanced', 'growth'] as const).map((type) => {
                                const cfg = SCENARIO_CONFIG[type]
                                const s = scenarios[type]
                                const Icon = cfg.icon
                                const fv = calculateFV(s.capital, s.pmt, s.rate, targetYears)
                                const percent = Math.min((fv / targetAmount) * 100, 100)
                                const isSuccess = percent >= 100

                                return (
                                    <motion.div
                                        key={type}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: type === 'safe' ? 0 : type === 'balanced' ? 0.1 : 0.2 }}
                                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.gradient} border ${cfg.border} backdrop-blur shadow-xl ${cfg.glow} flex flex-col`}
                                    >
                                        {/* Glow */}
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

                                        {/* Header */}
                                        <div className="relative p-5 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl ${cfg.accentBg} flex items-center justify-center border ${cfg.border}`}>
                                                    <Icon className={`w-4.5 h-4.5 ${cfg.accent}`} />
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-white`}>{cfg.name}</h4>
                                                    <p className={`text-xs ${cfg.accent} font-semibold`}>{s.rate}%/năm kỳ vọng</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="relative p-5 flex-1 space-y-5">
                                            {/* Progress */}
                                            <div>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-xs text-white/50">Dự kiến đạt</span>
                                                    <span className={`text-lg font-black ${isSuccess ? 'text-emerald-400' : 'text-white'}`}>
                                                        {fmtVND(fv)}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full ${isSuccess ? 'bg-emerald-400' : cfg.bar}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <p className={`text-[10px] text-right mt-1 ${cfg.accent}`}>
                                                    {percent.toFixed(0)}% mục tiêu {isSuccess && " ✓"}
                                                </p>
                                            </div>

                                            {/* Sliders */}
                                            <div className="space-y-4 pt-2 border-t border-white/10">
                                                {/* PMT */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <label className={`text-xs font-semibold ${cfg.accent} flex items-center gap-1`}>
                                                            <Coins className="w-3 h-3" /> Góp Hàng Tháng
                                                        </label>
                                                        <span className="text-xs text-white/70 font-medium">{fmtVND(s.pmt)}/tháng</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.pmt]}
                                                        max={Math.max(realCashflow * 3, 50000000)}
                                                        step={1000000}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], pmt: val } }))}
                                                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&_.relative]:h-1"
                                                    />
                                                </div>

                                                {/* Capital */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <label className={`text-xs font-semibold ${cfg.accent} flex items-center gap-1`}>
                                                            <Clock className="w-3 h-3" /> Vốn Ban Đầu
                                                        </label>
                                                        <span className="text-xs text-white/70 font-medium">{fmtVND(s.capital)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.capital]}
                                                        max={Math.max(realNetWorth * 1.5, 1000000000)}
                                                        step={10000000}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], capital: val } }))}
                                                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&_.relative]:h-1"
                                                    />
                                                </div>

                                                {/* Rate */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <label className={`text-xs font-semibold ${cfg.accent} flex items-center gap-1`}>
                                                            <Zap className="w-3 h-3" /> Lợi Suất Kỳ Vọng
                                                        </label>
                                                        <span className="text-xs text-white/70 font-medium">{s.rate}%/năm</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.rate]}
                                                        max={25} min={3} step={0.5}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], rate: val } }))}
                                                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&_.relative]:h-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="relative p-4 border-t border-white/10">
                                            <Button
                                                className={`w-full text-white font-bold shadow-lg ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30' : cfg.btn} transition-all`}
                                                onClick={() => handleSaveScenario(type)}
                                            >
                                                {savedScenarioId ? (
                                                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Đã Lưu</>
                                                ) : (
                                                    <><Save className="w-4 h-4 mr-2" /> Chốt Kịch Bản Này</>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
