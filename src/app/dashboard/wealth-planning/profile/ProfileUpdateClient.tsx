'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, TrendingUp, Shield, CheckCircle2, ChevronRight, Plus, Trash2, Save, Building } from 'lucide-react'
import Link from 'next/link'

const fmtVND = (v: number) => {
    if (!v) return ''
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const INSURANCE_TYPES = [
    { value: 'life_term', label: 'Bảo hiểm Tử kỳ', icon: '💼' },
    { value: 'life_whole', label: 'Nhân thọ Hỗn hợp', icon: '🌟' },
    { value: 'health', label: 'Sức khoẻ', icon: '❤️' },
    { value: 'accident', label: 'Tai nạn', icon: '⚡' },
    { value: 'bhxh', label: 'BHXH Nhà nước', icon: '🏛️' },
]

const EMPLOYMENT_TYPES = [
    { value: 'salaried', label: 'Nhân viên / Công chức' },
    { value: 'self_employed', label: 'Tự do / Freelancer' },
    { value: 'business', label: 'Chủ doanh nghiệp' },
    { value: 'retired', label: 'Đã nghỉ hưu' },
]

// 5-question Risk Quiz
const RISK_QUESTIONS = [
    {
        q: 'Nếu danh mục đầu tư giảm 20% trong 1 tháng, bạn sẽ làm gì?',
        options: ['Bán ngay để cắt lỗ (0đ)', 'Giữ nguyên và chờ đợi (2đ)', 'Mua thêm vì giá rẻ (4đ)'],
    },
    {
        q: 'Mục tiêu đầu tư chính của bạn là gì?',
        options: ['Bảo toàn vốn, không chấp nhận mất mát (0đ)', 'Tăng trưởng ổn định 8-12%/năm (2đ)', 'Tối đa hoá lợi nhuận dài hạn (4đ)'],
    },
    {
        q: 'Kinh nghiệm đầu tư của bạn?',
        options: ['Chưa bao giờ đầu tư (0đ)', 'Đã đầu tư tiết kiệm, quỹ mở (2đ)', 'Đã giao dịch cổ phiếu, crypto (4đ)'],
    },
    {
        q: 'Thời gian bạn có thể để tiền đầu tư mà không cần rút?',
        options: ['Dưới 2 năm (0đ)', '2–7 năm (2đ)', 'Trên 7 năm (4đ)'],
    },
    {
        q: 'Thu nhập của bạn so với chi tiêu?',
        options: ['Vừa đủ hoặc thường thiếu (0đ)', 'Dư sau khi chi hết (2đ)', 'Dư nhiều, ổn định (4đ)'],
    },
]

const ASSET_GROUPS = [
    { value: 'Thanh Khoản', label: 'Thanh Khoản', icon: '💵' },
    { value: 'Bảo Vệ', label: 'Bảo Vệ', icon: '🛡️' },
    { value: 'Đầu Tư', label: 'Đầu Tư', icon: '📈' },
    { value: 'Nợ', label: 'Nợ', icon: '🏦' },
]

const TABS = [
    { id: 'profile', label: 'Cá Nhân', icon: User, color: 'sky' },
    { id: 'cashflow', label: 'Dòng Tiền', icon: TrendingUp, color: 'emerald' },
    { id: 'assets', label: 'Tài Sản & Nợ', icon: Building, color: 'amber' },
    { id: 'insurance', label: 'Bảo Hiểm', icon: Shield, color: 'violet' },
]

export function ProfileUpdateClient({ user, profile, cashflow, insurance }: any) {
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState('profile')
    const [saving, setSaving] = useState(false)
    const [savedTab, setSavedTab] = useState<string | null>(null)

    // Tab 1: Personal
    const [dob, setDob] = useState(profile?.date_of_birth || '')
    const [dependents, setDependents] = useState(String(profile?.dependents ?? 0))
    const [occupation, setOccupation] = useState(profile?.occupation || '')
    const [employmentType, setEmploymentType] = useState(profile?.employment_type || 'salaried')

    // Tab 2: Cashflow Breakdown
    const [annualIncome, setAnnualIncome] = useState(String(cashflow?.annual_income || ''))
    const [passiveIncome, setPassiveIncome] = useState(String(cashflow?.passive_income || ''))
    const [fixedExp, setFixedExp] = useState(String(cashflow?.fixed_expense || ''))
    const [variableExp, setVariableExp] = useState(String(cashflow?.variable_expense || ''))
    const [discExp, setDiscExp] = useState(String(cashflow?.discretionary_expense || ''))
    const [monthlyDebt, setMonthlyDebt] = useState(String(cashflow?.monthly_debt_payment || ''))

    const totalExpense = (Number(fixedExp) || 0) + (Number(variableExp) || 0) + (Number(discExp) || 0)
    const totalIncome = (Number(annualIncome) || 0) + (Number(passiveIncome) || 0)
    const saving_ = Math.max(0, totalIncome - totalExpense)
    const pyf = totalIncome > 0 ? (saving_ / totalIncome * 100).toFixed(0) : '0'
    const dsr = annualIncome && monthlyDebt ? (Number(monthlyDebt) * 12 / Number(annualIncome) * 100).toFixed(0) : null

    // Tab 3: Assets
    const [assetList, setAssetList] = useState<any[]>([])
    const [assetsLoaded, setAssetsLoaded] = useState(false)

    async function loadAssets() {
        if (assetsLoaded) return
        const supabaseInst = createClient()
        const { data } = await supabaseInst.from('client_assets').select('*').eq('user_id', user.id).order('created_at')
        setAssetList(data?.map(a => ({ id: a.id, name: a.asset_name, group: a.asset_group, amount: String(a.amount || '') })) || [])
        setAssetsLoaded(true)
    }

    // Tab 4: Insurance
    const [insurances, setInsurances] = useState<any[]>(
        insurance.length > 0 ? insurance.map((i: any) => ({
            id: i.id, type: i.insurance_type, insurer: i.insurer || '',
            coverage: String(i.coverage_amount || ''), premium: String(i.annual_premium || ''), years_paid: String(i.years_paid || ''),
        })) : [{ type: 'health', insurer: '', coverage: '', premium: '', years_paid: '' }]
    )
    const [hasNoInsurance, setHasNoInsurance] = useState(false)

    // Risk quiz
    const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null])
    const [quizDone, setQuizDone] = useState(profile?.risk_score != null)
    const [riskResult, setRiskResult] = useState<{ score: number; profile: string; label: string } | null>(
        profile?.risk_score != null ? {
            score: profile.risk_score,
            profile: profile.risk_profile,
            label: profile.risk_profile === 'conservative' ? 'Thận Trọng' : profile.risk_profile === 'moderate' ? 'Cân Bằng' : 'Tăng Trưởng'
        } : null
    )

    function calcRisk() {
        const score = (answers as number[]).reduce((s, a) => s + a, 0) * (100 / 20)
        const riskProfile = score < 40 ? 'conservative' : score < 70 ? 'moderate' : 'aggressive'
        const label = riskProfile === 'conservative' ? 'Thận Trọng' : riskProfile === 'moderate' ? 'Cân Bằng' : 'Tăng Trưởng'
        setRiskResult({ score: Math.round(score), profile: riskProfile, label })
        setQuizDone(true)
    }

    // ── SAVE ──

    async function saveProfile() {
        setSaving(true)
        await supabase.from('profiles').update({
            date_of_birth: dob || null,
            dependents: Number(dependents),
            occupation: occupation || null,
            employment_type: employmentType,
            ...(riskResult ? { risk_score: riskResult.score, risk_profile: riskResult.profile } : {})
        }).eq('id', user.id)
        setSaving(false)
        setSavedTab('profile')
    }

    async function saveCashflow() {
        setSaving(true)
        const income = Number(annualIncome) || 0
        const expense = totalExpense
        const savingCalc = Math.max(0, income + (Number(passiveIncome) || 0) - expense)
        await supabase.from('client_cashflow').upsert({
            user_id: user.id,
            annual_income: income,
            annual_expense: expense,
            annual_saving: savingCalc,
            fixed_expense: Number(fixedExp) || 0,
            variable_expense: Number(variableExp) || 0,
            discretionary_expense: Number(discExp) || 0,
            passive_income: Number(passiveIncome) || 0,
            monthly_debt_payment: Number(monthlyDebt) || 0,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        setSaving(false)
        setSavedTab('cashflow')
    }

    async function saveAssets() {
        setSaving(true)
        const valid = assetList.filter(a => a.name && Number(a.amount) > 0)
        const supabaseInst = createClient()
        await supabaseInst.from('client_assets').delete().eq('user_id', user.id)
        for (const a of valid) {
            await supabaseInst.from('client_assets').insert({
                user_id: user.id,
                asset_name: a.name,
                asset_group: a.group,
                amount: Number(a.amount),
                risk_level: a.group === 'Nợ' ? 5 : a.group === 'Đầu Tư' ? 3 : 1,
                is_liquid: a.group === 'Thanh Khoản',
            })
        }
        setSaving(false)
        setSavedTab('assets')
    }

    async function saveInsurance() {
        setSaving(true)
        if (riskResult) {
            await supabase.from('profiles').update({ risk_score: riskResult.score, risk_profile: riskResult.profile }).eq('id', user.id)
        }
        if (!hasNoInsurance) {
            await supabase.from('client_insurance').delete().eq('user_id', user.id)
            const valid = insurances.filter(i => i.type)
            for (const ins of valid) {
                await supabase.from('client_insurance').insert({
                    user_id: user.id, insurance_type: ins.type,
                    insurer: ins.insurer || null,
                    coverage_amount: Number(ins.coverage) || 0,
                    annual_premium: Number(ins.premium) || 0,
                    years_paid: Number(ins.years_paid) || 0,
                })
            }
        }
        setSaving(false)
        setSavedTab('insurance')
    }

    const updateIns = (i: number, field: string, value: string) =>
        setInsurances(prev => prev.map((ins, idx) => idx === i ? { ...ins, [field]: value } : ins))

    const TAB_COLORS: Record<string, string> = {
        sky: 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm',
        amber: 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm',
        violet: 'bg-violet-50 border-violet-200 text-violet-700 shadow-sm',
    }

    const inputCls = 'w-full bg-white border border-slate-200 text-slate-800 font-medium rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:shadow-sm placeholder:text-slate-400 transition-all'
    const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2'

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
                    <Link href="/dashboard/wealth-planning" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kế hoạch tài chính
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-bold text-sm">Cập Nhật Hồ Sơ CFP</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Info banner */}
                <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm">
                    <span className="text-amber-500 text-lg shrink-0">💡</span>
                    <div>
                        <p className="text-amber-800 font-bold text-sm">Tại sao cần cập nhật?</p>
                        <p className="text-amber-700/80 font-medium text-xs mt-0.5">Báo cáo CFP cần các thông tin này để tính chính xác Risk Management, IPS, và Debt Service Ratio. Chỉ cần làm 1 lần, hệ thống sẽ tự động dùng lại.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {TABS.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        const isDone = savedTab === tab.id || (
                            tab.id === 'profile' && profile?.date_of_birth ||
                            tab.id === 'cashflow' && cashflow?.fixed_expense ||
                            tab.id === 'assets' && assetsLoaded ||
                            tab.id === 'insurance' && insurance.length > 0
                        )
                        return (
                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'assets') loadAssets() }}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive ? TAB_COLORS[tab.color] : 'glass-card border-slate-200/50 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                                {isDone && !isActive ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Icon className="w-4 h-4" />}
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── TAB 1: PERSONAL PROFILE ── */}
                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                            className="glass-card border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-5">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Thông Tin Cá Nhân</h3>
                                <p className="text-slate-500 text-sm mt-1">Dùng để tính horizon đầu tư, mức bảo hiểm khuyến nghị, và phân tích hưu trí.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Ngày Sinh</label>
                                    <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className={inputCls} />
                                    {dob && <p className="text-xs text-sky-600 font-bold mt-1.5">
                                        {new Date().getFullYear() - new Date(dob).getFullYear()} tuổi · còn ~{65 - (new Date().getFullYear() - new Date(dob).getFullYear())} năm tích lũy
                                    </p>}
                                </div>
                                <div>
                                    <label className={labelCls}>Số Người Phụ Thuộc</label>
                                    <select value={dependents} onChange={e => setDependents(e.target.value)} className={inputCls}>
                                        {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-white text-slate-800">{n} người</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Nghề Nghiệp</label>
                                <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)}
                                    placeholder="VD: Kỹ sư phần mềm, Kinh doanh bất động sản..."
                                    className={inputCls} />
                            </div>

                            <div>
                                <label className={labelCls}>Hình Thức Thu Nhập</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EMPLOYMENT_TYPES.map(t => (
                                        <button key={t.value} type="button" onClick={() => setEmploymentType(t.value)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${employmentType === t.value ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={saveProfile} disabled={saving}
                                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                {saving ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu Thông Tin Cá Nhân</>}
                            </button>

                            {savedTab === 'profile' && (
                                <div className="flex items-center gap-2 justify-center text-emerald-400 text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> Đã lưu! Tiếp theo:
                                    <button onClick={() => setActiveTab('cashflow')} className="underline">Dòng Tiền →</button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB 2: CASHFLOW BREAKDOWN ── */}
                    {activeTab === 'cashflow' && (
                        <motion.div key="cashflow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                            className="glass-card border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-5">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Chi Tiết Dòng Tiền</h3>
                                <p className="text-slate-500 text-sm mt-1">Phân tách chi tiêu giúp báo cáo xác định khoản nào có thể cắt giảm để tăng tiết kiệm.</p>
                            </div>

                            {/* Income */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
                                <p className="text-xs font-black text-blue-700 uppercase tracking-widest">📥 Thu Nhập / Năm</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Thu nhập chính (lương, KD)</label>
                                        <input type="number" min={0} step={1000000} value={annualIncome}
                                            onChange={e => setAnnualIncome(e.target.value)}
                                            placeholder="600,000,000" className={inputCls} />
                                        {annualIncome && <p className="text-xs text-blue-600 font-bold mt-1">≈ {fmtVND(Number(annualIncome) / 12)}/tháng</p>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>Thu nhập thụ động / năm</label>
                                        <input type="number" min={0} step={1000000} value={passiveIncome}
                                            onChange={e => setPassiveIncome(e.target.value)}
                                            placeholder="Cổ tức, cho thuê..." className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            {/* Expenses */}
                            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-3">
                                <p className="text-xs font-black text-rose-700 uppercase tracking-widest">📤 Chi Tiêu / Năm — Phân Tách 3 Loại</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelCls}>🔒 Chi Cố Định (thuê nhà, vay, bảo hiểm)</label>
                                        <input type="number" min={0} step={1000000} value={fixedExp}
                                            onChange={e => setFixedExp(e.target.value)}
                                            placeholder="VD: 120,000,000" className={inputCls} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelCls}>🔄 Chi Biến Đổi (ăn, điện nước)</label>
                                            <input type="number" min={0} step={500000} value={variableExp}
                                                onChange={e => setVariableExp(e.target.value)}
                                                placeholder="VD: 96,000,000" className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>🎯 Chi Tùy Ý (giải trí, du lịch)</label>
                                            <input type="number" min={0} step={500000} value={discExp}
                                                onChange={e => setDiscExp(e.target.value)}
                                                placeholder="VD: 24,000,000" className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>💳 Tổng Trả Nợ / Tháng (EMI)</label>
                                        <input type="number" min={0} step={500000} value={monthlyDebt}
                                            onChange={e => setMonthlyDebt(e.target.value)}
                                            placeholder="VD: 8,000,000" className={inputCls} />
                                        {dsr && <p className={`text-xs mt-1.5 font-bold ${Number(dsr) <= 35 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            DSR: {dsr}% thu nhập dùng trả nợ {Number(dsr) <= 35 ? '✓ An toàn' : '⚠ Vượt ngưỡng 35%'}
                                        </p>}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            {totalIncome > 0 && (
                                <div className={`glass-card rounded-2xl border p-4 flex justify-between items-center shadow-sm ${Number(pyf) >= 20 ? 'bg-emerald-50/80 border-emerald-200/60' : 'bg-amber-50/80 border-amber-200/60'}`}>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Tiết Kiệm / Năm</p>
                                        <p className="text-xl font-black text-slate-800 mt-0.5">{fmtVND(saving_)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Tỷ Lệ PYF</p>
                                        <p className={`text-3xl font-black mt-0.5 ${Number(pyf) >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>{pyf}%</p>
                                        <p className="text-[10px] text-slate-400 font-bold">CFP: ≥ 20%</p>
                                    </div>
                                </div>
                            )}

                            <button onClick={saveCashflow} disabled={saving}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                {saving ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu Chi Tiết Dòng Tiền</>}
                            </button>

                            {savedTab === 'cashflow' && (
                                <div className="flex items-center gap-2 justify-center text-emerald-400 text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> Đã lưu! Tiếp theo:
                                    <button onClick={() => setActiveTab('insurance')} className="underline">Bảo Hiểm & Rủi Ro →</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {/* ── TAB 3: ASSETS & DEBT ── */}
                    {activeTab === 'assets' && (
                        <motion.div key="assets" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                            className="glass-card border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-5">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Tài Sản & Nợ</h3>
                                <p className="text-slate-500 text-sm mt-1">Cập nhật danh mục tài sản và nợ. Thay đổi sẽ cập nhật ngay vào dashboard.</p>
                            </div>

                            <div className="space-y-3">
                                {assetList.map((a, i) => (
                                    <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {ASSET_GROUPS.map(g => (
                                                <button key={g.value} type="button"
                                                    onClick={() => setAssetList(prev => prev.map((x, idx) => idx === i ? { ...x, group: g.value } : x))}
                                                    className={`text-xs px-3 py-1.5 font-bold rounded-full border transition-all ${a.group === g.value ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                                                    {g.icon} {g.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input placeholder="Tên tài sản / khoản nợ" value={a.name}
                                                onChange={e => setAssetList(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                                                className={inputCls} />
                                            <input type="number" placeholder="Số tiền (VNĐ)" value={a.amount}
                                                onChange={e => setAssetList(prev => prev.map((x, idx) => idx === i ? { ...x, amount: e.target.value } : x))}
                                                className={inputCls} />
                                        </div>
                                        {assetList.length > 1 && (
                                            <button onClick={() => setAssetList(prev => prev.filter((_, idx) => idx !== i))}
                                                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300">
                                                <Trash2 className="w-3 h-3" /> Xóa
                                            </button>
                                        )}
                                    </div>
                                ))}
                                 <button onClick={() => setAssetList(prev => [...prev, { name: '', group: 'Thanh Khoản', amount: '' }])}
                                    className="w-full border border-dashed border-slate-300 text-slate-500 font-medium hover:text-slate-800 hover:border-slate-400 rounded-2xl py-2.5 text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Plus className="w-4 h-4" /> Thêm tài sản / khoản nợ
                                </button>
                            </div>

                            <button onClick={saveAssets} disabled={saving}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                {saving ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu Tài Sản & Nợ</>}
                            </button>
                            {savedTab === 'assets' && (
                                <div className="flex items-center gap-2 justify-center text-emerald-400 text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> Đã lưu! Dashboard sẽ cập nhật ngay.
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB 4: INSURANCE + RISK QUIZ ── */}
                    {activeTab === 'insurance' && (
                        <motion.div key="insurance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                            className="space-y-5">

                            {/* Insurance block */}
                            <div className="glass-card border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-5">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Bảo Hiểm Hiện Có</h3>
                                    <p className="text-slate-500 text-sm mt-1">Giúp đánh giá khoảng trống rủi ro và tính Human Capital theo chuẩn CFP.</p>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" checked={hasNoInsurance} onChange={e => setHasNoInsurance(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                                    <span className="text-sm font-bold text-slate-700">Tôi chưa có bảo hiểm nào</span>
                                </label>

                                {!hasNoInsurance && (
                                    <div className="space-y-3">
                                        {insurances.map((ins, i) => (
                                            <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
                                                {/* Type selector */}
                                                <div className="flex flex-wrap gap-2">
                                                    {INSURANCE_TYPES.map(t => (
                                                        <button key={t.value} type="button"
                                                            onClick={() => updateIns(i, 'type', t.value)}
                                                            className={`text-xs px-3 py-1.5 font-bold rounded-full border transition-all ${ins.type === t.value ? 'bg-violet-50 border-violet-200 text-violet-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                                                            {t.icon} {t.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input placeholder="Công ty BH" value={ins.insurer}
                                                        onChange={e => updateIns(i, 'insurer', e.target.value)}
                                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 focus:bg-white placeholder:text-slate-400" />
                                                    <input type="number" placeholder="Mệnh giá (VNĐ)" value={ins.coverage}
                                                        onChange={e => updateIns(i, 'coverage', e.target.value)}
                                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 focus:bg-white placeholder:text-slate-400" />
                                                    <input type="number" placeholder="Phí/năm (VNĐ)" value={ins.premium}
                                                        onChange={e => updateIns(i, 'premium', e.target.value)}
                                                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 focus:bg-white placeholder:text-slate-400" />
                                                    {ins.type === 'bhxh' && (
                                                        <input type="number" placeholder="Số năm đã đóng BHXH" value={ins.years_paid}
                                                            onChange={e => updateIns(i, 'years_paid', e.target.value)}
                                                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 focus:bg-white placeholder:text-slate-400" />
                                                    )}
                                                </div>
                                                {insurances.length > 1 && (
                                                    <button onClick={() => setInsurances(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300">
                                                        <Trash2 className="w-3 h-3" /> Xóa
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={() => setInsurances(prev => [...prev, { type: 'health', insurer: '', coverage: '', premium: '', years_paid: '' }])}
                                            className="w-full border border-dashed border-slate-300 text-slate-500 font-bold hover:text-slate-800 hover:border-slate-400 rounded-2xl py-3 text-sm flex items-center justify-center gap-2 transition-colors">
                                            <Plus className="w-4 h-4" /> Thêm bảo hiểm
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Risk Quiz */}
                            <div className="glass-card border border-slate-200/60 shadow-sm rounded-3xl p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800">Đánh Giá Khẩu Vị Rủi Ro</h3>
                                        <p className="text-slate-500 text-sm mt-1">5 câu hỏi · dùng để tạo Investment Policy Statement (IPS).</p>
                                    </div>
                                    {riskResult && (
                                        <div className={`text-center px-5 py-2.5 rounded-2xl shadow-sm border ${riskResult.profile === 'conservative' ? 'bg-emerald-50 border-emerald-200' : riskResult.profile === 'moderate' ? 'bg-sky-50 border-sky-200' : 'bg-amber-50 border-amber-200'}`}>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Kết Quả</p>
                                            <p className={`text-lg font-black ${riskResult.profile === 'conservative' ? 'text-emerald-700' : riskResult.profile === 'moderate' ? 'text-sky-700' : 'text-amber-700'}`}>{riskResult.label}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-0.5">{riskResult.score}/100 điểm</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {RISK_QUESTIONS.map((q, qi) => (
                                        <div key={qi} className="space-y-3">
                                            <p className="text-sm text-slate-800 font-bold">{qi + 1}. {q.q}</p>
                                            <div className="space-y-2">
                                                {q.options.map((opt, oi) => {
                                                    const point = oi * 2
                                                    return (
                                                        <button key={oi} type="button"
                                                            onClick={() => setAnswers(prev => prev.map((a, idx) => idx === qi ? point : a))}
                                                            className={`w-full text-left px-5 py-3 rounded-xl text-sm border transition-all ${answers[qi] === point ? 'bg-violet-50 border-violet-200 text-violet-800 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50'}`}>
                                                            {opt.replace(/ \(\d+đ\)/, '')}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {answers.every(a => a !== null) && !quizDone && (
                                    <button onClick={calcRisk}
                                        className="w-full border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <ChevronRight className="w-4 h-4" /> Xem Kết Quả Risk Profile
                                    </button>
                                )}
                            </div>

                            <button onClick={saveInsurance} disabled={saving}
                                className="w-full bg-violet-500 hover:bg-violet-400 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                {saving ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu Bảo Hiểm & Risk Profile</>}
                            </button>

                            {savedTab === 'insurance' && (
                                <div className="table mx-auto">
                                    <Link href="/dashboard/wealth-planning/report"
                                        className="flex items-center gap-2 text-emerald-400 font-semibold text-sm hover:text-emerald-300 transition-colors">
                                        <CheckCircle2 className="w-4 h-4" /> Đã lưu! Xem Báo Cáo CFP đầy đủ →
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick nav to report */}
                <Link href="/dashboard/wealth-planning/report"
                    className="flex items-center justify-center gap-2 w-full py-4 glass-card border-slate-200/60 shadow-sm text-slate-500 font-bold hover:text-slate-800 hover:border-slate-300 rounded-2xl text-sm transition-all focus:outline-none">
                    Xem Báo Cáo CFP ngay <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    )
}
