'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, TrendingDown, PiggyBank, Building, CreditCard,
    BarChart3, ArrowRight, CheckCircle2, Sparkles, User, ShieldCheck,
    Briefcase, Heart, Plus, Trash2
} from 'lucide-react'

const fmtVND = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const ASSET_GROUPS = [
    { value: 'Thanh Khoản', label: 'Thanh Khoản', sub: 'Tiền mặt, TK ngân hàng, tiết kiệm ngắn hạn', icon: '💵' },
    { value: 'Bảo Vệ', label: 'Bảo Vệ', sub: 'Bảo hiểm nhân thọ, sức khoẻ', icon: '🛡️' },
    { value: 'Đầu Tư', label: 'Đầu Tư', sub: 'Cổ phiếu, quỹ, BĐS đầu tư, vàng', icon: '📈' },
    { value: 'Nợ', label: 'Nợ', sub: 'Vay ngân hàng, thẻ tín dụng, nợ khác', icon: '🏦' },
]

const INSURANCE_TYPES = [
    { value: 'life_term', label: 'Bảo hiểm Tử kỳ', icon: '💼' },
    { value: 'life_whole', label: 'Bảo hiểm Hỗn hợp / Nhân thọ', icon: '🌟' },
    { value: 'health', label: 'Bảo hiểm Sức khoẻ', icon: '❤️' },
    { value: 'accident', label: 'Bảo hiểm Tai nạn', icon: '⚡' },
    { value: 'bhxh', label: 'BHXH (Nhà nước)', icon: '🏛️' },
]

const EMPLOYMENT_TYPES = [
    { value: 'salaried', label: 'Nhân viên / Công chức' },
    { value: 'self_employed', label: 'Tự do / Freelancer' },
    { value: 'business', label: 'Chủ doanh nghiệp' },
    { value: 'retired', label: 'Đã nghỉ hưu' },
]

type AssetEntry = { name: string; group: string; amount: number; monthly_payment?: number }
type InsuranceEntry = { type: string; insurer: string; coverage: number; premium: number; years_paid: number }

interface KYCGateProps {
    userId: string
    onComplete: () => void
}

const STEPS = [
    { id: 1, label: 'Hồ Sơ', icon: User },
    { id: 2, label: 'Thu Chi', icon: BarChart3 },
    { id: 3, label: 'Tài Sản', icon: Building },
    { id: 4, label: 'Bảo Hiểm', icon: ShieldCheck },
]

export function KYCGate({ userId, onComplete }: KYCGateProps) {
    const supabase = createClient()
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [saving, setSaving] = useState(false)

    // Step 1: Personal Profile
    const [dob, setDob] = useState('')
    const [dependents, setDependents] = useState('0')
    const [occupation, setOccupation] = useState('')
    const [employmentType, setEmploymentType] = useState('salaried')

    // Step 2: Cashflow
    const [income, setIncome] = useState('')
    const [fixedExp, setFixedExp] = useState('')
    const [variableExp, setVariableExp] = useState('')
    const [discretionaryExp, setDiscretionaryExp] = useState('')
    const [passiveIncome, setPassiveIncome] = useState('')
    const [monthlyDebtPmt, setMonthlyDebtPmt] = useState('')

    const incomeNum = Number(income) || 0
    const passiveNum = Number(passiveIncome) || 0  // user enters annual amount
    const totalIncome = incomeNum + passiveNum
    const fixedNum = Number(fixedExp) || 0
    const variableNum = Number(variableExp) || 0
    const discretionaryNum = Number(discretionaryExp) || 0
    const totalExpense = fixedNum + variableNum + discretionaryNum
    const savingNum = Math.max(0, totalIncome - totalExpense)
    const savingRate = totalIncome > 0 ? ((savingNum / totalIncome) * 100).toFixed(0) : '0'
    const dsr = incomeNum > 0 && monthlyDebtPmt ? (((Number(monthlyDebtPmt) * 12) / incomeNum) * 100).toFixed(0) : '0'

    // Step 3: Assets
    const [assets, setAssets] = useState<AssetEntry[]>([
        { name: '', group: 'Thanh Khoản', amount: 0 }
    ])
    const addAsset = () => setAssets(prev => [...prev, { name: '', group: 'Thanh Khoản', amount: 0 }])
    const removeAsset = (i: number) => setAssets(prev => prev.filter((_, idx) => idx !== i))
    const updateAsset = (i: number, field: keyof AssetEntry, value: string | number) =>
        setAssets(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
    const netWorth = assets.reduce((sum, a) => a.group === 'Nợ' ? sum - a.amount : sum + a.amount, 0)

    // Step 4: Insurance
    const [insurances, setInsurances] = useState<InsuranceEntry[]>([
        { type: 'health', insurer: '', coverage: 0, premium: 0, years_paid: 0 }
    ])
    const [hasNoInsurance, setHasNoInsurance] = useState(false)
    const addInsurance = () => setInsurances(prev => [...prev, { type: 'health', insurer: '', coverage: 0, premium: 0, years_paid: 0 }])
    const removeInsurance = (i: number) => setInsurances(prev => prev.filter((_, idx) => idx !== i))
    const updateInsurance = (i: number, field: keyof InsuranceEntry, value: string | number) =>
        setInsurances(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))

    // ── SAVE HANDLERS ──

    async function handleSaveStep1(e: React.FormEvent) {
        e.preventDefault()
        if (!dob) return alert('Vui lòng nhập ngày sinh.')
        setSaving(true)
        await supabase.from('profiles').update({
            date_of_birth: dob,
            dependents: Number(dependents),
            occupation,
            employment_type: employmentType,
        }).eq('id', userId)
        setSaving(false)
        setStep(2)
    }

    async function handleSaveStep2(e: React.FormEvent) {
        e.preventDefault()
        if (incomeNum <= 0) return alert('Vui lòng nhập Thu nhập.')
        setSaving(true)
        const { error: cfError } = await supabase.from('client_cashflow').upsert({
            user_id: userId,
            annual_income: incomeNum,
            annual_expense: totalExpense,
            annual_saving: savingNum,
            fixed_expense: fixedNum,
            variable_expense: variableNum,
            discretionary_expense: discretionaryNum,
            passive_income: passiveNum,
            monthly_debt_payment: Number(monthlyDebtPmt) || 0,
            surplus_ratio: totalIncome > 0 ? savingNum / totalIncome : 0,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        if (cfError) {
            console.error('[KYCGate Step2] Cashflow upsert error:', cfError)
            alert(`Lỗi lưu thu chi: ${cfError.message}\nCode: ${cfError.code}`)
            setSaving(false)
            return
        }
        setSaving(false)
        setStep(3)
    }

    async function handleSaveStep3(e: React.FormEvent) {
        e.preventDefault()
        const validAssets = assets.filter(a => a.name && a.amount > 0)
        if (validAssets.length === 0) return alert('Vui lòng thêm ít nhất 1 tài sản.')
        setSaving(true)

        // Delete old assets
        const { error: deleteErr } = await supabase.from('client_assets').delete().eq('user_id', userId)
        if (deleteErr) {
            console.error('[KYCGate Step3] Delete error:', deleteErr)
            alert(`Lỗi xóa tài sản cũ: ${deleteErr.message}`)
            setSaving(false)
            return
        }

        // Insert new assets
        for (const a of validAssets) {
            const { error: insertErr } = await supabase.from('client_assets').insert({
                user_id: userId,
                asset_name: a.name,
                asset_group: a.group,
                amount: a.amount,
                monthly_payment: a.monthly_payment || 0,
                risk_level: a.group === 'Nợ' ? 5 : a.group === 'Đầu Tư' ? 3 : 1,
                is_liquid: a.group === 'Thanh Khoản',
            })
            if (insertErr) {
                console.error('[KYCGate Step3] Insert error:', insertErr, 'Asset:', a)
                alert(`Lỗi lưu tài sản "${a.name}": ${insertErr.message}\n\nCode: ${insertErr.code}`)
                setSaving(false)
                return
            }
        }

        setSaving(false)
        setStep(4)
    }

    async function handleSaveStep4(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        if (!hasNoInsurance) {
            const validInsurances = insurances.filter(i => i.type)
            await supabase.from('client_insurance').delete().eq('user_id', userId)
            for (const ins of validInsurances) {
                await supabase.from('client_insurance').insert({
                    user_id: userId,
                    insurance_type: ins.type,
                    insurer: ins.insurer || null,
                    coverage_amount: ins.coverage || 0,
                    annual_premium: ins.premium || 0,
                    years_paid: ins.years_paid || 0,
                })
            }
        }

        const totalInc = Number(income) || 0
        const fixedExpNum = Number(fixedExp) || 0
        const varExpNum = Number(variableExp) || 0
        const discExpNum = Number(discretionaryExp) || 0
        const totalExpenseCalculated = fixedExpNum + varExpNum + discExpNum
        const savingCalculated = Math.max(0, totalInc - totalExpenseCalculated)

        // Mark KYC completed + save initial snapshot
        await supabase.from('advisor_users').upsert({
            auth_user_id: userId,
            email: '',  // will be ignored on conflict
            password_hash: 'MANAGED_BY_SUPABASE_AUTH',
            kyc_completed: true,
            kyc_completed_at: new Date().toISOString()
        }, { onConflict: 'auth_user_id', ignoreDuplicates: false })

        await fetch('/api/wealth/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                period_label: `KYC Ban Đầu - T${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                cashflow: { income: totalInc / 12, expense: totalExpenseCalculated / 12, saving: savingCalculated / 12 },
                assets: assets.filter(a => a.name && a.amount > 0),
                net_worth: netWorth,
                notes: 'Snapshot KYC lần đầu'
            })
        })

        setSaving(false)
        onComplete()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 text-sm font-medium">Nhận Diện Tài Chính — Bước Đầu Tiên</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Khai Báo Hồ Sơ Tài Chính</h1>
                    <p className="text-slate-400">Chuẩn CFP · Bảo mật hoàn toàn · ~5 phút</p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-1.5 mt-6">
                        {STEPS.map((s, idx) => {
                            const Icon = s.icon
                            const isActive = step === s.id
                            const isDone = step > s.id
                            return (
                                <div key={s.id} className="flex items-center gap-1.5">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isActive ? 'bg-emerald-500 text-white' : isDone ? 'bg-emerald-900/50 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                                        {s.label}
                                    </div>
                                    {idx < STEPS.length - 1 && <div className={`w-5 h-px ${isDone ? 'bg-emerald-500' : 'bg-white/10'}`} />}
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">

                    {/* ── STEP 1: PERSONAL PROFILE ── */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <form onSubmit={handleSaveStep1} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-sky-400" />
                                    Thông Tin Cá Nhân
                                </h2>
                                <p className="text-slate-400 text-sm">Giúp hệ thống tính chính xác horizon đầu tư và mức bảo hiểm phù hợp.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Ngày sinh <span className="text-rose-400">*</span></label>
                                        <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400" />
                                        {dob && <p className="text-xs text-sky-300">
                                            Tuổi: {new Date().getFullYear() - new Date(dob).getFullYear()} tuổi · Còn ~{65 - (new Date().getFullYear() - new Date(dob).getFullYear())} năm tích lũy
                                        </p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300">Số người phụ thuộc</label>
                                        <select value={dependents} onChange={e => setDependents(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400">
                                            {[0, 1, 2, 3, 4, '5+'].map(n => <option key={n} value={n} className="bg-slate-800">{n} người</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Nghề nghiệp</label>
                                    <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                                        placeholder="VD: Kỹ sư phần mềm, Giáo viên, Kinh doanh online..."
                                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 placeholder:text-white/30" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-slate-300">Hình thức thu nhập</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {EMPLOYMENT_TYPES.map(t => (
                                            <button key={t.value} type="button" onClick={() => setEmploymentType(t.value)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${employmentType === t.value ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                    {saving ? 'Đang lưu...' : <><span>Tiếp: Khai Báo Thu Chi</span><ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* ── STEP 2: CASHFLOW ── */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <form onSubmit={handleSaveStep2} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                                    Dòng Tiền Hàng Năm
                                </h2>
                                <p className="text-slate-400 text-sm">Nhập theo năm (hoặc tháng × 12). Phân tách giúp tính chính xác tỷ lệ cắt giảm được.</p>

                                {/* Income */}
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">Thu Nhập / Năm</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-slate-300 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-400" /> Thu nhập chính <span className="text-rose-400">*</span></label>
                                            <input type="number" required min={1000000} step={1000000} value={income} onChange={e => setIncome(e.target.value)}
                                                placeholder="600,000,000"
                                                className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 placeholder:text-white/20" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-slate-300 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> Thu nhập thụ động / năm (cổ tức, cho thuê, lãi)</label>
                                            <input type="number" min={0} step={1000000} value={passiveIncome} onChange={e => setPassiveIncome(e.target.value)}
                                                placeholder="VD: 60,000,000 (cả năm)"
                                                className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 placeholder:text-white/20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Expenses */}
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold text-rose-300 uppercase tracking-wider">Chi Tiêu / Năm (phân tách)</p>
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-slate-300 flex items-center gap-1"><TrendingDown className="w-3 h-3 text-rose-400" />Chi Cố Định (thuê nhà, EMI vay, bảo hiểm)</label>
                                            <input type="number" min={0} step={1000000} value={fixedExp} onChange={e => setFixedExp(e.target.value)}
                                                placeholder="VD: 120,000,000"
                                                className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400 placeholder:text-white/20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs text-slate-300">Chi Biến Đổi (ăn, đi lại, điện nước)</label>
                                                <input type="number" min={0} step={500000} value={variableExp} onChange={e => setVariableExp(e.target.value)}
                                                    placeholder="VD: 96,000,000"
                                                    className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400 placeholder:text-white/20" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs text-slate-300">Chi Tùy Ý (giải trí, du lịch)</label>
                                                <input type="number" min={0} step={500000} value={discretionaryExp} onChange={e => setDiscretionaryExp(e.target.value)}
                                                    placeholder="VD: 24,000,000"
                                                    className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400 placeholder:text-white/20" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-slate-300 flex items-center gap-1"><CreditCard className="w-3 h-3 text-orange-400" /> Trả nợ / tháng (tổng EMI các khoản vay)</label>
                                            <input type="number" min={0} step={500000} value={monthlyDebtPmt} onChange={e => setMonthlyDebtPmt(e.target.value)}
                                                placeholder="VD: 8,000,000"
                                                className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 placeholder:text-white/20" />
                                            {monthlyDebtPmt && <p className="text-[10px] text-orange-300">DSR: {dsr}% thu nhập dùng trả nợ (ngưỡng an toàn ≤ 35%)</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Savings Summary */}
                                {incomeNum > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl p-4 flex justify-between items-center ${Number(savingRate) >= 20 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Tiết kiệm / năm</p>
                                            <p className="text-2xl font-bold text-white mt-0.5">{fmtVND(savingNum)}</p>
                                            <p className="text-xs text-slate-400 mt-1">≈ {fmtVND(savingNum / 12)} / tháng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Tỷ lệ PYF</p>
                                            <p className={`text-3xl font-black ${Number(savingRate) >= 20 ? 'text-emerald-400' : Number(savingRate) >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>{savingRate}%</p>
                                            <p className="text-[10px] text-slate-400">Chuẩn CFP ≥ 20%</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white/60 hover:text-white rounded-xl py-3 text-sm transition-colors">← Quay lại</button>
                                    <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                        {saving ? 'Đang lưu...' : <><span>Tiếp: Khai Báo Tài Sản</span><ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ── STEP 3: ASSETS ── */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <form onSubmit={handleSaveStep3} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Building className="w-5 h-5 text-violet-400" />
                                    Danh Mục Tài Sản & Nợ
                                </h2>

                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {assets.map((a, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    placeholder="Tên tài sản / khoản nợ"
                                                    value={a.name} onChange={e => updateAsset(i, 'name', e.target.value)}
                                                    className="col-span-2 bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400" />
                                                <select value={a.group} onChange={e => updateAsset(i, 'group', e.target.value)}
                                                    className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
                                                    {ASSET_GROUPS.map(g => <option key={g.value} value={g.value} className="bg-slate-800">{g.icon} {g.label}</option>)}
                                                </select>
                                                <input type="number" min={0} step={1000000} placeholder="Giá trị (VNĐ)"
                                                    value={a.amount || ''} onChange={e => updateAsset(i, 'amount', Number(e.target.value))}
                                                    className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-400" />
                                            </div>
                                            {a.group === 'Nợ' && (
                                                <input type="number" min={0} step={100000} placeholder="Trả góp hàng tháng (VNĐ)"
                                                    value={a.monthly_payment || ''} onChange={e => updateAsset(i, 'monthly_payment', Number(e.target.value))}
                                                    className="w-full bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400" />
                                            )}
                                            {assets.length > 1 && (
                                                <button type="button" onClick={() => removeAsset(i)}
                                                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors">
                                                    <Trash2 className="w-3 h-3" /> Xóa
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <button type="button" onClick={addAsset}
                                    className="w-full border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Plus className="w-4 h-4" /> Thêm tài sản / khoản nợ
                                </button>

                                <div className={`rounded-xl p-4 flex justify-between items-center ${netWorth >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Tài sản ròng (Net Worth)</p>
                                        <p className={`text-2xl font-bold mt-0.5 ${netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {netWorth < 0 ? '-' : ''}{fmtVND(Math.abs(netWorth))}
                                        </p>
                                    </div>
                                    <PiggyBank className={`w-8 h-8 ${netWorth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white/60 hover:text-white rounded-xl py-3 text-sm transition-colors">← Quay lại</button>
                                    <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                        {saving ? 'Đang lưu...' : <><span>Tiếp: Khai Báo Bảo Hiểm</span><ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ── STEP 4: INSURANCE ── */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <form onSubmit={handleSaveStep4} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                                    Khai Báo Bảo Hiểm & Rủi Ro
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    CFP yêu cầu đánh giá "áo giáp" trước khi thiết kế danh mục đầu tư. Bước này giúp phát hiện khoảng trống bảo vệ.
                                </p>

                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/5 border border-white/10 rounded-xl">
                                    <input type="checkbox" checked={hasNoInsurance} onChange={e => setHasNoInsurance(e.target.checked)}
                                        className="w-4 h-4 accent-emerald-500" />
                                    <span className="text-sm text-white/70">Tôi chưa có bảo hiểm nào</span>
                                </label>

                                {!hasNoInsurance && (
                                    <div className="space-y-3">
                                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                            {insurances.map((ins, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="col-span-2">
                                                            <label className="text-xs text-slate-400 mb-1 block">Loại bảo hiểm</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {INSURANCE_TYPES.map(t => (
                                                                    <button key={t.value} type="button"
                                                                        onClick={() => updateInsurance(i, 'type', t.value)}
                                                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${ins.type === t.value ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                                                                        {t.icon} {t.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <input placeholder="Công ty bảo hiểm" value={ins.insurer}
                                                            onChange={e => updateInsurance(i, 'insurer', e.target.value)}
                                                            className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400" />
                                                        <input type="number" placeholder="Mệnh giá (VNĐ)" value={ins.coverage || ''}
                                                            onChange={e => updateInsurance(i, 'coverage', Number(e.target.value))}
                                                            className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400" />
                                                        <input type="number" placeholder="Phí/năm (VNĐ)" value={ins.premium || ''}
                                                            onChange={e => updateInsurance(i, 'premium', Number(e.target.value))}
                                                            className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400" />
                                                        {ins.type === 'bhxh' && (
                                                            <input type="number" placeholder="Số năm đã đóng BHXH" value={ins.years_paid || ''}
                                                                onChange={e => updateInsurance(i, 'years_paid', Number(e.target.value))}
                                                                className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-sky-400" />
                                                        )}
                                                    </div>
                                                    {insurances.length > 1 && (
                                                        <button type="button" onClick={() => removeInsurance(i)}
                                                            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300">
                                                            <Trash2 className="w-3 h-3" /> Xóa
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={addInsurance}
                                            className="w-full border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 transition-colors">
                                            <Plus className="w-4 h-4" /> Thêm loại bảo hiểm
                                        </button>
                                    </div>
                                )}

                                {/* Protection coverage quick calc */}
                                {!hasNoInsurance && incomeNum > 0 && (
                                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sm">
                                        <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-2">Gợi Ý CFP — Mức Bảo Hiểm Tử Kỳ Cần Có</p>
                                        <p className="text-white/70">
                                            Human Capital của bạn: <strong className="text-sky-400">{fmtVND(incomeNum * (65 - (dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 35)))}</strong>
                                        </p>
                                        <p className="text-white/50 text-xs mt-1">= Thu nhập × số năm còn lại. Mức bảo hiểm lý tưởng ≥ 10× thu nhập năm.</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(3)} className="flex-1 border border-white/20 text-white/60 hover:text-white rounded-xl py-3 text-sm transition-colors">← Quay lại</button>
                                    <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                        {saving ? 'Đang hoàn tất...' : <><Heart className="w-4 h-4 fill-white" /><span>Hoàn Thành — Vào Dashboard!</span></>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
