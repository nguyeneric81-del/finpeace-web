'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { Target, TrendingUp, ShieldCheck, Map, ArrowRight, Save, Coins, Clock, Sparkles, CheckCircle2 } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// Constants
const DEFAULT_INFLATION = 3.5

// Helper functions
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

// Future Value (FV) Lãi Kép: P*(1+r)^n + PMT*(((1+r)^n - 1)/r)
const calculateFV = (P: number, PMT: number, r: number, n: number) => {
    const rate = r / 100
    if (rate === 0) return P + PMT * 12 * n
    const compoundPrincipal = P * Math.pow(1 + rate, n)
    const compoundCashflow = (PMT * 12) * ((Math.pow(1 + rate, n) - 1) / rate)
    return compoundPrincipal + compoundCashflow
}

import type { FinancialPlan } from '@/app/dashboard/wealth-planning/WealthPlanningClient'

export function ScenarioManager({ userId, onNavigateToActionPlan, onPlanCommit }: { userId: string, onNavigateToActionPlan?: () => void, onPlanCommit?: (plan: FinancialPlan) => void }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)

    // Nguồn lực từ dữ liệu thực tế (Tab 1)
    const [realNetWorth, setRealNetWorth] = useState(0)
    const [realCashflow, setRealCashflow] = useState(0)

    // Đã lưu kịch bản nào chưa?
    const [savedScenarioId, setSavedScenarioId] = useState<string | null>(null)

    // --- STATE BƯỚC 1: ƯỚC MƠ ---
    const [step, setStep] = useState<1 | 2>(1)
    const [dreamName, setDreamName] = useState('')
    const [targetAmount, setTargetAmount] = useState<number>(5000000000) // 5 Tỷ
    const [targetYears, setTargetYears] = useState<number>(10)

    // --- STATE BƯỚC 2: 3 KỊCH BẢN ---
    // Mỗi kịch bản có thể tự adjust P (vốn), PMT (dòng tiền tháng), r (lãi suất)
    const [scenarios, setScenarios] = useState({
        safe: { name: 'Thận Trọng', rate: 6, pmt: 0, capital: 0, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        balanced: { name: 'Cân Bằng', rate: 10, pmt: 0, capital: 0, icon: Map, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        growth: { name: 'Tăng Trưởng', rate: 15, pmt: 0, capital: 0, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    })

    useEffect(() => {
        fetchInitialData()
    }, [])

    async function fetchInitialData() {
        setLoading(true)

        // 1. Fetch Tài Sản (Net Worth = Thanh khoản + Đầu tư)
        const { data: assets } = await supabase.from('client_assets').select('amount, asset_group').eq('user_id', userId)
        let totalWealth = 0
        if (assets) {
            totalWealth = assets.filter(a => ['Thanh Khoản', 'Đầu Tư'].includes(a.asset_group)).reduce((sum, item) => sum + (item.amount || 0), 0)
        }
        setRealNetWorth(totalWealth)

        // 2. Fetch Cashflow
        const { data: cashflow } = await supabase.from('client_cashflow').select('annual_saving').eq('user_id', userId).single()
        let monthly = 0
        if (cashflow && cashflow.annual_saving > 0) {
            monthly = Math.floor(cashflow.annual_saving / 12)
        }
        setRealCashflow(monthly)

        // 3. Fetch Selected Scenario (đã lưu)
        const { data: existingScenario } = await supabase.from('wealth_scenarios').select('*').eq('user_id', userId).eq('is_selected', true).single()
        if (existingScenario) {
            setSavedScenarioId(existingScenario.id)
            setDreamName(existingScenario.plan_name.split(' - ')[0] || 'Mục tiêu của tôi')
            setTargetAmount(existingScenario.target_amount)
            setTargetYears(existingScenario.target_years)
            // Cập nhật state kịch bản để khớp với DB
            // (Trong UI này ta ưu tiên luồng chọn lại từ đầu)
        }

        // Set mốc mặc định cho 3 kịch bản
        setScenarios(prev => ({
            safe: { ...prev.safe, capital: totalWealth, pmt: monthly },
            balanced: { ...prev.balanced, capital: totalWealth, pmt: monthly },
            growth: { ...prev.growth, capital: totalWealth, pmt: monthly }
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
                target: targetAmount
            })
        }
        return data
    }, [scenarios, targetYears, targetAmount, step])

    const handleSaveScenario = async (type: 'safe' | 'balanced' | 'growth') => {
        const selected = scenarios[type]
        const planFullName = `${dreamName} - ${selected.name}`

        // Tính required monthly saving (PMT cần thiết để đạt target từ vốn ban đầu)
        const rate = selected.rate / 100
        const n = targetYears
        const fvFromCapital = selected.capital * Math.pow(1 + rate, n)
        const remaining = Math.max(0, targetAmount - fvFromCapital)
        const requiredMonthly = rate > 0 && n > 0
            ? remaining / (12 * ((Math.pow(1 + rate, n) - 1) / rate))
            : remaining / (12 * n)

        // Bỏ chọn tất cả
        await supabase.from('wealth_scenarios').update({ is_selected: false }).eq('user_id', userId)

        // Lưu mới vào wealth_scenarios (legacy table)
        const { data, error } = await supabase.from('wealth_scenarios').insert({
            user_id: userId,
            plan_name: planFullName,
            initial_capital: selected.capital,
            monthly_cashflow: selected.pmt,
            target_amount: targetAmount,
            target_years: targetYears,
            inflation_rate: DEFAULT_INFLATION,
            is_selected: true
        }).select().single()

        if (!error && data) {
            setSavedScenarioId(data.id)

            // Gọi onPlanCommit với full state để truyền sang ActionPlan
            if (onPlanCommit) {
                onPlanCommit({
                    goalName: dreamName,
                    targetAmount,
                    timelineYears: targetYears,
                    initialCapital: selected.capital,
                    expectedReturn: selected.rate,
                    requiredMonthlySaving: Math.round(requiredMonthly),
                    scenarioType: type
                })
            } else if (onNavigateToActionPlan) {
                onNavigateToActionPlan()
            }
        }
    }

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Đang tải nguồn lực hiện tại...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                        Thiết Kế Tương Lai
                    </h2>
                    <p className="text-slate-500 mt-1">Lập bản đồ đường đi từ Hiện tại tới Ước mơ của bạn.</p>
                </div>
                {step === 2 && (
                    <Button variant="outline" onClick={() => setStep(1)} className="text-slate-500">
                        Sửa Ước Mơ
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="border-0 shadow-xl shadow-blue-900/5 bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Bước 1: Hình Dung Ước Mơ</CardTitle>
                                <CardDescription>Bạn dự định dùng số tiền này để làm gì?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">Tên Ước Mơ</label>
                                        <Input
                                            autoFocus
                                            placeholder="VD: Mua nhà Vinhome, Quỹ hưu trí Bình An, Đi du học..."
                                            value={dreamName}
                                            onChange={e => setDreamName(e.target.value)}
                                            className="text-lg py-6"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-700 flex justify-between">
                                                <span>Số tiền cần (VNĐ)</span>
                                                <span className="text-blue-600 font-semibold">{fmtVND(targetAmount)}</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={targetAmount}
                                                onChange={e => setTargetAmount(Number(e.target.value))}
                                                className="font-mono text-lg"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-700">Thời gian dự kiến (Năm)</label>
                                            <Input
                                                type="number"
                                                value={targetYears}
                                                onChange={e => setTargetYears(Number(e.target.value))}
                                                className="text-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Nguồn lực hiện tại Panel */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between mt-8">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Nguồn Lực Hiện Có</p>
                                            <p className="text-sm text-slate-700">
                                                Vốn rót: <span className="font-semibold">{fmtVND(realNetWorth)}</span><br />
                                                Dòng tiền: <span className="font-semibold">{fmtVND(realCashflow)}/tháng</span>
                                            </p>
                                        </div>
                                        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                                            Lên Kịch Bản <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Dream Summary Banner */}
                        <div className="bg-slate-800 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                    <Target className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Mục Tiêu Của Bạn</p>
                                    <h3 className="text-2xl font-bold">{dreamName}</h3>
                                </div>
                            </div>
                            <div className="flex gap-8 text-right bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                <div>
                                    <p className="text-white/60 text-xs">CẦN ĐẠT ĐƯỢC</p>
                                    <p className="text-xl font-mono font-semibold">{fmtVND(targetAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs">THỜI GIAN</p>
                                    <p className="text-xl font-mono font-semibold">{targetYears} Năm</p>
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ so sánh 3 kịch bản */}
                        <Card className="shadow-lg border-slate-100 overflow-hidden mt-6">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg text-slate-800">Cỗ Máy Lãi Kép: So Sánh 3 Phương Án</CardTitle>
                                <CardDescription>Sự thay đổi của tài sản sau {targetYears} năm theo Lãi Kép tự động.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                        <YAxis
                                            tickFormatter={(val) => fmtVNDShort(val)}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748B' }}
                                        />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [fmtVND(value), name === 'target' ? 'Mục Tiêu' : name === 'safe' ? 'An Toàn' : name === 'balanced' ? 'Cân Bằng' : 'Tăng Trưởng']}
                                            labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: 8 }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                                        <Line type="monotone" name="An Toàn" dataKey="safe" stroke="#059669" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Cân Bằng" dataKey="balanced" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Tăng Trưởng" dataKey="growth" stroke="#D97706" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Mục Tiêu" dataKey="target" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* 3 Scenarios Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                            {(['safe', 'balanced', 'growth'] as const).map((type) => {
                                const s = scenarios[type]
                                const Icon = s.icon
                                const fv = calculateFV(s.capital, s.pmt, s.rate, targetYears)
                                const percent = Math.min((fv / targetAmount) * 100, 100)
                                const isSuccess = percent >= 100

                                return (
                                    <Card key={type} className={`border-2 ${s.border} shadow-sm overflow-hidden flex flex-col`}>
                                        <div className={`${s.bg} p-5 border-b ${s.border} flex items-center gap-3`}>
                                            <div className={`p-2 bg-white rounded-lg shadow-sm ${s.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold text-lg ${s.color}`}>{s.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium">Kỳ vọng lợi suất: {s.rate}%/năm</p>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex-1 space-y-6">
                                            {/* Progress Meter */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-medium text-slate-700">Dự kiến đạt</span>
                                                    <span className={`text-xl font-bold font-mono ${isSuccess ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                        {fmtVND(fv)}
                                                    </span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full ${isSuccess ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percent}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <p className="text-xs text-right text-slate-500">
                                                    Đạt {percent.toFixed(0)}% mục tiêu {isSuccess && "🎉"}
                                                </p>
                                            </div>

                                            {/* Interactive Sliders */}
                                            <div className="space-y-5 pt-2 border-t border-slate-100">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                            <Coins className="w-3 h-3" /> Góp Hàng Tháng
                                                        </label>
                                                        <span className="text-sm font-medium">{fmtVND(s.pmt)}/tháng</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.pmt]}
                                                        max={Math.max(realCashflow * 3, 50000000)} // Ít nhất là 50 Tr/tháng cho slider hoạt động
                                                        step={1000000}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], pmt: val } }))}
                                                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> Vốn Ban Đầu
                                                        </label>
                                                        <span className="text-sm font-medium">{fmtVND(s.capital)}</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.capital]}
                                                        max={Math.max(realNetWorth * 1.5, 1000000000)} // Ít nhất là 1 Tỷ cho slider hoạt động
                                                        step={10000000}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], capital: val } }))}
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                            Lợi Suất Kỳ Vọng
                                                        </label>
                                                        <span className="text-sm font-medium">{s.rate}% / năm</span>
                                                    </div>
                                                    <Slider
                                                        value={[s.rate]}
                                                        max={25}
                                                        min={3}
                                                        step={0.5}
                                                        onValueChange={([val]) => setScenarios(prev => ({ ...prev, [type]: { ...prev[type], rate: val } }))}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                                            <Button
                                                className={`w-full ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                                variant={isSuccess ? 'default' : 'outline'}
                                                onClick={() => handleSaveScenario(type)}
                                            >
                                                {savedScenarioId ? (
                                                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Đã Lưu</>
                                                ) : (
                                                    <><Save className="w-4 h-4 mr-2" /> Chốt Kịch Bản Này</>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
