'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, ShoppingCart, TrendingDown, AlertTriangle, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'

const fmtM = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

// ──────────────────────────────────────────────
// WHAT-IF SIMULATOR
// ──────────────────────────────────────────────

const PRESET_SCENARIOS = [
    {
        id: 'job_loss',
        icon: '💼',
        label: 'Mất Việc Làm',
        color: 'rose',
        description: 'Thất nghiệp đột ngột, thu nhập = 0',
        incomeShock: -100,    // % drop in income
        expenseShock: 0,
        months: 6,
        recoveryMonths: 4,
    },
    {
        id: 'income_cut',
        icon: '📉',
        label: 'Giảm Thu Nhập 40%',
        color: 'amber',
        description: 'Thu nhập bị cắt giảm (chuyển việc, kinh doanh lỗ)',
        incomeShock: -40,
        expenseShock: 0,
        months: 12,
        recoveryMonths: 6,
    },
    {
        id: 'medical',
        icon: '🏥',
        label: 'Chi Phí Y Tế Lớn',
        color: 'orange',
        description: 'Tai nạn / bệnh nghiêm trọng — one-time cost',
        incomeShock: 0,
        expenseShock: 100,   // +100M one time extra expense
        months: 1,
        recoveryMonths: 3,
        oneTimeExtra: 100_000_000,
    },
    {
        id: 'market_crash',
        icon: '📊',
        label: 'Thị Trường Giảm 40%',
        color: 'violet',
        description: 'Danh mục đầu tư mất giá trị 40%',
        incomeShock: 0,
        expenseShock: 0,
        months: 0,
        recoveryMonths: 24,
        portfolioShock: -40,
    },
]

function WhatIfSimulator({ cashflow, assets }: any) {
    const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_SCENARIOS[0] | null>(null)
    const [customMode, setCustomMode] = useState(false)
    const [customIncome, setCustomIncome] = useState('-50')
    const [customExpense, setCustomExpense] = useState('0')
    const [customMonths, setCustomMonths] = useState('6')
    const [oneTimeExtra, setOneTimeExtra] = useState('')

    const monthlyIncome = (cashflow?.annual_income || 0) / 12
    const monthlyExpense = (cashflow?.annual_expense || 0) / 12
    const monthlyNet = monthlyIncome - monthlyExpense
    const liquid = (assets || []).filter((a: any) => a.asset_group === 'Thanh Khoản').reduce((s: number, a: any) => s + a.amount, 0)
    const invested = (assets || []).filter((a: any) => a.asset_group === 'Đầu Tư').reduce((s: number, a: any) => s + a.amount, 0)

    const scenario = customMode ? null : selectedPreset
    const incomeShockPct = customMode ? Number(customIncome) : (scenario?.incomeShock || 0)
    const extraExpense = customMode
        ? Number(oneTimeExtra.replace(/[^0-9]/g, '')) || 0
        : (scenario?.oneTimeExtra || 0)
    const portfolioShock = scenario?.portfolioShock || 0
    const shockedMonthlyIncome = monthlyIncome * (1 + incomeShockPct / 100)
    const shockedNet = shockedMonthlyIncome - monthlyExpense
    const simMonths = customMode ? Number(customMonths) : (scenario?.months || 6)

    // Build 24-month chart data
    const chartData = Array.from({ length: 24 }, (_, i) => {
        const inShock = i < simMonths
        const mi = inShock ? shockedMonthlyIncome : monthlyIncome
        const me = monthlyExpense + (i === 0 ? extraExpense : 0)
        const net = mi - me
        // Running cash balance starting from liquid
        let balance = liquid
        for (let j = 0; j <= i; j++) {
            const iShock = j < simMonths
            const mmi = iShock ? shockedMonthlyIncome : monthlyIncome
            const mme = monthlyExpense + (j === 0 ? extraExpense : 0)
            balance += mmi - mme
        }
        return {
            month: `T${i + 1}`,
            balance: Math.max(0, Math.round(balance)),
            income: Math.round(mi),
            expense: Math.round(me),
            isShock: inShock,
        }
    })

    // Find when balance hits 0 (financially stressed)
    let burnoutMonth: number | null = null
    let running = liquid
    for (let i = 0; i < 24; i++) {
        const iShock = i < simMonths
        const mi = iShock ? shockedMonthlyIncome : monthlyIncome
        const me = monthlyExpense + (i === 0 ? extraExpense : 0)
        running += mi - me
        if (running <= 0 && burnoutMonth === null) {
            burnoutMonth = i + 1
            break
        }
    }

    const survivalMonths = burnoutMonth !== null ? burnoutMonth - 1 : null
    const isSafe = burnoutMonth === null
    const portfolioLoss = invested * Math.abs(portfolioShock) / 100

    const COLORS: Record<string, string> = {
        rose: 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm border-2',
        amber: 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm border-2',
        orange: 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm border-2',
        violet: 'bg-violet-50 border-violet-200 text-violet-700 shadow-sm border-2',
    }

    const hasScenario = scenario !== null || customMode

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Phase 3 — FLP Contingency Meta-Planning</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">What-if Simulator</h2>
                <p className="text-slate-500 text-sm mt-1">Mô phỏng tác động tài chính khi xảy ra cú sốc bất ngờ. Giúp bạn chuẩn bị trước thay vì xử lý sau.</p>
            </div>

            {/* Current baseline */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Thu nhập / tháng', value: fmtM(monthlyIncome), color: 'text-sky-600' },
                    { label: 'Chi tiêu / tháng', value: fmtM(monthlyExpense), color: 'text-amber-600' },
                    { label: 'Thanh khoản hiện có', value: fmtM(liquid), color: 'text-emerald-600' },
                ].map(item => (
                    <div key={item.label} className="glass-card shadow-sm border border-slate-200/60 rounded-2xl p-4 text-center">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">{item.label}</p>
                        <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Preset buttons */}
            <div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Chọn kịch bản cú sốc</p>
                <div className="grid grid-cols-2 gap-3">
                    {PRESET_SCENARIOS.map(s => (
                        <button key={s.id} onClick={() => { setSelectedPreset(s); setCustomMode(false) }}
                            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${selectedPreset?.id === s.id && !customMode ? COLORS[s.color] : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <p className="font-bold text-sm">{s.label}</p>
                                <p className="text-xs opacity-70 mt-0.5 text-slate-500">{s.description}</p>
                            </div>
                        </button>
                    ))}
                    <button onClick={() => { setCustomMode(true); setSelectedPreset(null) }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all col-span-2 ${customMode ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-sm border-2' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>
                        <span className="text-2xl">✏️</span>
                        <div>
                            <p className="font-bold text-sm">Tùy Chỉnh</p>
                            <p className="text-xs opacity-70 text-slate-500">Nhập % thay đổi thu nhập + chi tiêu bất thường</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Custom inputs */}
            {customMode && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
                    <p className="text-xs font-black text-sky-600 uppercase tracking-wider">Tùy Chỉnh Kịch Bản</p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Thay Đổi Thu Nhập (%)</label>
                            <input type="number" value={customIncome} onChange={e => setCustomIncome(e.target.value)}
                                placeholder="-50 = giảm 50%"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-sky-400 placeholder:text-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chi Bất Thường (VNĐ)</label>
                            <input type="number" value={oneTimeExtra} onChange={e => setOneTimeExtra(e.target.value)}
                                placeholder="VD: 50000000"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-sky-400 placeholder:text-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kéo Dài (tháng)</label>
                            <input type="number" min={1} max={24} value={customMonths} onChange={e => setCustomMonths(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-sky-400" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
                {hasScenario && (
                    <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                        {/* Risk verdict */}
                        <div className={`rounded-2xl border p-6 flex items-center gap-5 shadow-sm ${isSafe ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                            {isSafe ? <CheckCircle2 className="w-10 h-10 text-emerald-500 shrink-0" /> : <XCircle className="w-10 h-10 text-rose-500 shrink-0" />}
                            <div>
                                <p className="text-lg font-black text-slate-800">
                                    {isSafe ? '✅ Tài chính vẫn ổn định trong 24 tháng' : `⚠️ Quỹ có thể cạn kiệt sau ${survivalMonths} tháng`}
                                </p>
                                <p className="text-slate-600 text-sm mt-1">
                                    {isSafe
                                        ? `Thu nhập mới: ${fmtM(shockedMonthlyIncome)}/tháng. Thanh khoản ${fmtM(liquid)} đủ bù đắp.`
                                        : `Sau tháng ${survivalMonths}, bạn sẽ phải bán tài sản hoặc vay nợ để trang trải chi phí.`}
                                </p>
                                {portfolioShock !== 0 && (
                                    <p className="text-violet-700 text-sm mt-1">
                                        📉 Danh mục đầu tư giảm ~<strong>{fmtM(portfolioLoss)}</strong> (${Math.abs(portfolioShock)}% của {fmtM(invested)})
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 24-month balance chart */}
                        <div className="glass-card shadow-sm border border-slate-200/60 rounded-2xl p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-black text-slate-800">Biến Động Thanh Khoản 24 Tháng</p>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>🔴 Thời gian cú sốc</span>
                                    <span>🟢 Phục hồi</span>
                                </div>
                            </div>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                        <defs>
                                            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isSafe ? '#10b981' : '#f43f5e'} stopOpacity={0.25} />
                                                <stop offset="95%" stopColor={isSafe ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} interval={3} />
                                        <YAxis tickFormatter={v => fmtM(v)} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            formatter={(v: number, n: string) => [fmtM(v), n === 'balance' ? 'Số Dư' : n]}
                                            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#0f172a' }}
                                        />
                                        <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="4 4" />
                                        {burnoutMonth && <ReferenceLine x={`T${burnoutMonth}`} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: '💀 Cạn', fill: '#f43f5e', fontSize: 10, fontWeight: 700 }} />}
                                        <Area type="monotone" dataKey="balance" name="balance" stroke={isSafe ? '#10b981' : '#f43f5e'} strokeWidth={3} fill="url(#balanceGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recovery recommendations */}
                        <div className="glass-card shadow-sm border border-slate-200/60 rounded-2xl p-5 space-y-3">
                            <p className="text-sm font-black text-slate-800 mb-4">🛡️ Kế Hoạch Phòng Vệ & Phục Hồi</p>
                            {[
                                !isSafe && liquid < monthlyExpense * 6 && {
                                    priority: 'Ngay Bây Giờ',
                                    color: 'rose',
                                    action: `Tăng quỹ khẩn cấp lên ${fmtM(monthlyExpense * 6)} (6 tháng chi tiêu). Hiện chỉ có ${fmtM(liquid)}.`,
                                },
                                !isSafe && {
                                    priority: 'Ngắn Hạn',
                                    color: 'amber',
                                    action: `Xác định ${fmtM(monthlyExpense * 0.2)}/tháng chi tùy ý có thể cắt giảm ngay. Giúp kéo dài ${Math.round(extraExpense > 0 ? 1 : (monthlyExpense * 0.2) / Math.abs(shockedNet || 1))} tháng thêm.`,
                                },
                                {
                                    priority: 'Nên Làm',
                                    color: 'sky',
                                    action: `Mua bảo hiểm tử kỳ để bảo vệ Human Capital (${fmtM((cashflow?.annual_income || 0) * 10)} mệnh giá cần có).`,
                                },
                                portfolioShock !== 0 && {
                                    priority: 'Đầu Tư',
                                    color: 'violet',
                                    action: `Thị trường giảm 40% → Cổ phiếu chất lượng có thể phục hồi trong 18–24 tháng. Đừng bán tháo. Xem xét mua thêm định kỳ (DCA).`,
                                },
                            ].filter(Boolean).map((item: any) => item && (
                                <div key={item.priority} className={`flex items-start gap-4 px-5 py-4 rounded-xl border shadow-sm ${
                                    item.color === 'rose' ? 'bg-rose-50 border-rose-200' :
                                    item.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                                    item.color === 'sky' ? 'bg-sky-50 border-sky-200' :
                                    'bg-violet-50 border-violet-200'
                                }`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 mt-0.5 ${
                                        item.color === 'rose' ? 'text-rose-600' :
                                        item.color === 'amber' ? 'text-amber-600' :
                                        item.color === 'sky' ? 'text-sky-600' :
                                        'text-violet-600'
                                    }`}>{item.priority}</span>
                                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{item.action}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ──────────────────────────────────────────────
// PDSS — Purchase Decision Support System
// ──────────────────────────────────────────────

type PDSSResult = {
    verdict: 'BUY' | 'WAIT' | 'NO'
    score: number
    reasons: { type: 'pro' | 'con'; text: string }[]
    suggestion: string
}

function calcPDSS(price: number, necessity: number, urgency: number, cashflow: any, assets: any[]): PDSSResult {
    const liquid = assets.filter((a: any) => a.asset_group === 'Thanh Khoản').reduce((s: number, a: any) => s + a.amount, 0)
    const monthlyIncome = (cashflow?.annual_income || 0) / 12
    const monthlyExpense = (cashflow?.annual_expense || 0) / 12
    const monthlyNet = Math.max(0, monthlyIncome - monthlyExpense)
    const emergencyFund = monthlyExpense * 6
    const reasons: PDSSResult['reasons'] = []
    let score = 0

    // Necessity (0-40pts)
    score += necessity * 4
    if (necessity >= 8) reasons.push({ type: 'pro', text: `Nhu cầu thiết yếu cao (${necessity}/10).` })
    else if (necessity < 5) reasons.push({ type: 'con', text: `Nhu cầu thấp (${necessity}/10) — có thể trì hoãn.` })

    // Urgency (0-20pts)
    score += urgency * 2
    if (urgency >= 8) reasons.push({ type: 'pro', text: `Cấp thiết cao — không thể trì hoãn.` })

    // Can afford from cash flow (0-20pts)
    const monthsToSave = monthlyNet > 0 ? price / monthlyNet : Infinity
    if (price < monthlyNet) { score += 20; reasons.push({ type: 'pro', text: `Giá dưới 1 tháng dư thừa — không ảnh hưởng tài chính.` }) }
    else if (monthsToSave <= 3) { score += 12; reasons.push({ type: 'pro', text: `Tiết kiệm được trong ${monthsToSave.toFixed(1)} tháng.` }) }
    else if (monthsToSave <= 12) { score += 5; reasons.push({ type: 'con', text: `Cần ${monthsToSave.toFixed(0)} tháng tiết kiệm — cân nhắc kỹ.` }) }
    else reasons.push({ type: 'con', text: `Cần ${monthsToSave.toFixed(0)} tháng tiết kiệm — quá lớn so với dòng tiền.` })

    // Emergency fund check (-20 if dips below 3 months)
    const liquidAfter = liquid - price
    const monthsAfter = monthlyExpense > 0 ? liquidAfter / monthlyExpense : 0
    if (liquidAfter < emergencyFund * 0.5) { score -= 20; reasons.push({ type: 'con', text: `Quỹ khẩn cấp sẽ xuống dưới 3 tháng — nguy hiểm.` }) }
    else if (liquidAfter < emergencyFund) { score -= 10; reasons.push({ type: 'con', text: `Quỹ khẩn cấp sẽ dưới 6 tháng sau mua.` }) }
    else reasons.push({ type: 'pro', text: `Quỹ khẩn cấp vẫn >= 6 tháng sau mua (${monthsAfter.toFixed(1)} tháng).` })

    // Price vs income ratio
    const pctOfAnnualIncome = cashflow?.annual_income ? (price / cashflow.annual_income * 100) : 0
    if (pctOfAnnualIncome > 50) reasons.push({ type: 'con', text: `Chiếm >50% thu nhập năm — đây là quyết định lớn.` })
    else if (pctOfAnnualIncome < 5) reasons.push({ type: 'pro', text: `Chỉ ${pctOfAnnualIncome.toFixed(1)}% thu nhập năm — ảnh hưởng nhỏ.` })

    score = Math.min(100, Math.max(0, score))
    const verdict: PDSSResult['verdict'] = score >= 65 ? 'BUY' : score >= 40 ? 'WAIT' : 'NO'
    const suggestion = verdict === 'BUY'
        ? `Tài chính có thể đáp ứng. Nên mua từ tiền dư / quỹ tiêu dùng, không dùng tín dụng.`
        : verdict === 'WAIT'
        ? `Tiết kiệm thêm ${fmtM(Math.max(0, price - (liquid - emergencyFund)))} trước khi mua. Nhắm mục tiêu trong ${Math.ceil(monthsToSave)} tháng.`
        : `Không phù hợp tài chính hiện tại. Hãy ưu tiên quỹ khẩn cấp và trả nợ trước.`

    return { verdict, score, reasons, suggestion }
}

function PDSSTab({ cashflow, assets }: any) {
    const [itemName, setItemName] = useState('')
    const [price, setPrice] = useState('')
    const [necessity, setNecessity] = useState(5)
    const [urgency, setUrgency] = useState(5)
    const [result, setResult] = useState<PDSSResult | null>(null)

    function analyze() {
        const p = Number(price.replace(/[^0-9]/g, ''))
        if (!p) return setResult(null)
        setResult(calcPDSS(p, necessity, urgency, cashflow, assets))
    }

    const VERDICT_CONFIG = {
        BUY: { label: '✅ NÊN MUA', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', bar: 'bg-emerald-500' },
        WAIT: { label: '⏳ CHỜ THÊM', color: 'bg-amber-50 border-amber-200 text-amber-700', bar: 'bg-amber-500' },
        NO: { label: '❌ KHÔNG NÊN', color: 'bg-rose-50 border-rose-200 text-rose-700', bar: 'bg-rose-500' },
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Phase 3 — FLP Argumentation-Based PDSS</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">Hỗ Trợ Quyết Định Mua Sắm</h2>
                <p className="text-slate-500 text-sm mt-1">Nhập món hàng muốn mua, AI sẽ phân tích dựa trên tình trạng tài chính thực tế của bạn.</p>
            </div>

            <div className="glass-card shadow-sm border border-slate-200/60 rounded-3xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên Món Hàng / Quyết Định</label>
                        <input value={itemName} onChange={e => setItemName(e.target.value)}
                            placeholder="VD: MacBook Pro M4, Xe máy điện, Khoá học MBA..."
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:outline-none focus:border-emerald-400 placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Giá Tiền (VNĐ)</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                            placeholder="VD: 45,000,000"
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:outline-none focus:border-emerald-400 placeholder:text-slate-400" />
                    </div>
                    <div className="text-center">
                        {price && Number(price) > 0 && cashflow?.annual_income && (
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded-xl p-3 h-full flex flex-col items-center justify-center">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">% Thu Nhập Năm</p>
                                <p className="text-2xl font-black text-slate-800">{(Number(price) / cashflow.annual_income * 100).toFixed(1)}%</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mức Độ Cần Thiết</label>
                            <span className="text-sm font-black text-emerald-600">{necessity}/10</span>
                        </div>
                        <input type="range" min={1} max={10} value={necessity} onChange={e => setNecessity(Number(e.target.value))}
                            className="w-full accent-emerald-500" />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Muốn thôi</span><span>Cần thiết cao</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mức Độ Cấp Thiết</label>
                            <span className="text-sm font-black text-sky-600">{urgency}/10</span>
                        </div>
                        <input type="range" min={1} max={10} value={urgency} onChange={e => setUrgency(Number(e.target.value))}
                            className="w-full accent-sky-500" />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Có thể chờ</span><span>Cần ngay</span>
                        </div>
                    </div>
                </div>

                <button onClick={analyze} disabled={!price}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40">
                    <Zap className="w-4 h-4" />
                    Phân Tích Bằng AI
                </button>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div key="pdss-result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* Verdict */}
                        <div className={`rounded-3xl shadow-sm border p-6 flex items-center gap-6 ${VERDICT_CONFIG[result.verdict].color}`}>
                            <div className="text-center shrink-0 w-24">
                                <p className={`text-5xl font-black ${result.verdict === 'BUY' ? 'text-emerald-600' : result.verdict === 'WAIT' ? 'text-amber-600' : 'text-rose-600'}`}>{result.score}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Điểm / 100</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xl font-black mb-1">
                                    {VERDICT_CONFIG[result.verdict].label}{itemName ? ` — ${itemName}` : ''}
                                </p>
                                <p className="text-slate-600 text-sm font-semibold">{result.suggestion}</p>
                                {/* Score bar */}
                                <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div className={`h-full rounded-full ${VERDICT_CONFIG[result.verdict].bar}`}
                                        initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                                </div>
                            </div>
                        </div>

                        {/* Reasoning */}
                        <div className="glass-card shadow-sm border border-slate-200/60 rounded-2xl p-5 space-y-2.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Lập Luận Chi Tiết</p>
                            {result.reasons.map((r, i) => (
                                <div key={i} className={`flex items-start gap-3 text-sm px-4 py-3 rounded-xl border shadow-sm font-medium ${r.type === 'pro' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                                    {r.type === 'pro' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />}
                                    {r.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ──────────────────────────────────────────────
// MAIN CLIENT
// ──────────────────────────────────────────────

const TABS = [
    { id: 'whatif', label: '⚡ What-if Simulator', desc: 'Mô phỏng cú sốc tài chính' },
    { id: 'pdss', label: '🛒 Hỗ Trợ Mua Sắm', desc: 'AI phân tích quyết định mua' },
]

export function SimulatorClient({ user, cashflow, assets, profile }: any) {
    const [activeTab, setActiveTab] = useState('whatif')

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
                    <Link href="/dashboard/wealth-planning" className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kế hoạch tài chính
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-bold text-sm">AI Simulator</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Tab selector */}
                <div className="grid grid-cols-2 gap-3">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`p-4 rounded-2xl shadow-sm text-left transition-all ${activeTab === tab.id ? 'bg-white border hover:bg-slate-50 border-emerald-500 text-slate-800' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'}`}>
                            <p className="font-bold text-sm">{tab.label}</p>
                            <p className="text-xs opacity-60 mt-0.5">{tab.desc}</p>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'whatif' && (
                        <motion.div key="whatif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <WhatIfSimulator cashflow={cashflow} assets={assets} />
                        </motion.div>
                    )}
                    {activeTab === 'pdss' && (
                        <motion.div key="pdss" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PDSSTab cashflow={cashflow} assets={assets} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
