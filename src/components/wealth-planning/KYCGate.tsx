'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, PiggyBank, Building, CreditCard, BarChart3, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const fmtVND = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const ASSET_GROUPS = [
    { value: 'Thanh Khoản', label: 'Thanh Khoản', sub: 'Tiền mặt, TK ngân hàng, tiết kiệm ngắn hạn', icon: '💵', color: 'emerald' },
    { value: 'Bảo Vệ', label: 'Bảo Vệ', sub: 'Bảo hiểm nhân thọ, sức khoẻ', icon: '🛡️', color: 'blue' },
    { value: 'Đầu Tư', label: 'Đầu Tư', sub: 'Cổ phiếu, quỹ, BĐS đầu tư, vàng', icon: '📈', color: 'violet' },
    { value: 'Nợ', label: 'Nợ', sub: 'Vay ngân hàng, thẻ tín dụng, nợ khác', icon: '🏦', color: 'rose' },
]

type AssetEntry = { name: string; group: string; amount: number; rate: number }

interface KYCGateProps {
    userId: string
    onComplete: () => void
}

export function KYCGate({ userId, onComplete }: KYCGateProps) {
    const supabase = createClient()
    const [step, setStep] = useState<1 | 2>(1)
    const [saving, setSaving] = useState(false)

    // Step 1: Cashflow
    const [income, setIncome] = useState('')
    const [expense, setExpense] = useState('')
    const incomeNum = Number(income) || 0
    const expenseNum = Number(expense) || 0
    const savingNum = Math.max(0, incomeNum - expenseNum)
    const savingRate = incomeNum > 0 ? ((savingNum / incomeNum) * 100).toFixed(0) : '0'

    // Step 2: Assets
    const [assets, setAssets] = useState<AssetEntry[]>([
        { name: '', group: 'Thanh Khoản', amount: 0, rate: 0 }
    ])

    const addAsset = () => setAssets(prev => [...prev, { name: '', group: 'Thanh Khoản', amount: 0, rate: 0 }])
    const removeAsset = (i: number) => setAssets(prev => prev.filter((_, idx) => idx !== i))
    const updateAsset = (i: number, field: keyof AssetEntry, value: string | number) =>
        setAssets(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))

    const netWorth = assets.reduce((sum, a) => a.group === 'Nợ' ? sum - a.amount : sum + a.amount, 0)

    async function handleSaveStep1(e: React.FormEvent) {
        e.preventDefault()
        if (incomeNum <= 0) return alert('Vui lòng nhập Thu nhập hàng năm.')
        setSaving(true)
        await supabase.from('client_cashflow').upsert({
            user_id: userId,
            annual_income: incomeNum,
            annual_expense: expenseNum,
            annual_saving: savingNum,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        setSaving(false)
        setStep(2)
    }

    async function handleSaveStep2(e: React.FormEvent) {
        e.preventDefault()
        const validAssets = assets.filter(a => a.name && a.amount > 0)
        if (validAssets.length === 0) return alert('Vui lòng thêm ít nhất 1 tài sản.')
        setSaving(true)

        // Xóa tài sản cũ và insert mới
        await supabase.from('client_assets').delete().eq('user_id', userId)
        for (const a of validAssets) {
            await supabase.from('client_assets').insert({
                user_id: userId,
                asset_name: a.name,
                asset_group: a.group,
                amount: a.amount,
                expected_return: a.rate,
                risk_level: a.group === 'Nợ' ? 5 : a.group === 'Đầu Tư' ? 3 : 1,
                is_liquid: a.group === 'Thanh Khoản'
            })
        }

        // Đánh dấu KYC completed trên Supabase
        await supabase.from('advisor_users').update({
            kyc_completed: true,
            kyc_completed_at: new Date().toISOString()
        }).eq('id', userId)

        // Lưu snapshot đầu tiên
        await fetch('/api/wealth/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                period_label: `KYC Ban Đầu - T${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                cashflow: { income: incomeNum, expense: expenseNum, saving: savingNum },
                assets: validAssets,
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
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 text-sm font-medium">Bước đầu tiên</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Khai Báo Tài Chính Cá Nhân</h1>
                    <p className="text-slate-400">Chỉ mất 3 phút · Dữ liệu được bảo mật hoàn toàn</p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        {[1, 2].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s ? 'bg-emerald-500 text-white' : step > s ? 'bg-emerald-700 text-emerald-300' : 'bg-white/10 text-white/40'}`}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                </div>
                                <span className={`text-sm ${step === s ? 'text-white' : 'text-white/40'}`}>
                                    {s === 1 ? 'Thu Chi' : 'Tài Sản'}
                                </span>
                                {s < 2 && <div className="w-8 h-px bg-white/20" />}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <form onSubmit={handleSaveStep1} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                                    Dòng Tiền Hàng Năm
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300 flex items-center gap-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Thu nhập / năm (VNĐ)
                                        </label>
                                        <input
                                            type="number" required min={1000000} step={1000000}
                                            value={income} onChange={e => setIncome(e.target.value)}
                                            placeholder="VD: 600000000"
                                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 placeholder:text-white/30"
                                        />
                                        {incomeNum > 0 && <p className="text-xs text-blue-300">≈ {fmtVND(incomeNum / 12)} / tháng</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-300 flex items-center gap-1">
                                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Chi phí / năm (VNĐ)
                                        </label>
                                        <input
                                            type="number" min={0} step={1000000}
                                            value={expense} onChange={e => setExpense(e.target.value)}
                                            placeholder="VD: 240000000"
                                            className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 placeholder:text-white/30"
                                        />
                                        {expenseNum > 0 && <p className="text-xs text-rose-300">≈ {fmtVND(expenseNum / 12)} / tháng</p>}
                                    </div>
                                </div>

                                {incomeNum > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Tiết kiệm ước tính</p>
                                            <p className="text-2xl font-bold text-white mt-0.5">{fmtVND(savingNum)} <span className="text-sm text-emerald-400">/năm</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Tỷ lệ PYF</p>
                                            <p className={`text-3xl font-black ${Number(savingRate) >= 20 ? 'text-emerald-400' : Number(savingRate) >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>{savingRate}%</p>
                                        </div>
                                    </motion.div>
                                )}

                                <button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                    {saving ? 'Đang lưu...' : <><span>Tiếp Theo: Khai Báo Tài Sản</span><ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                            <form onSubmit={handleSaveStep2} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Building className="w-5 h-5 text-violet-400" />
                                    Danh Mục Tài Sản & Nợ
                                </h2>

                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {assets.map((a, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    placeholder="Tên tài sản (VD: Tiết kiệm TPB)"
                                                    value={a.name} onChange={e => updateAsset(i, 'name', e.target.value)}
                                                    className="col-span-2 bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                                                />
                                                <select
                                                    value={a.group} onChange={e => updateAsset(i, 'group', e.target.value)}
                                                    className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                                                >
                                                    {ASSET_GROUPS.map(g => <option key={g.value} value={g.value} className="bg-slate-800">{g.icon} {g.label}</option>)}
                                                </select>
                                                <input
                                                    type="number" min={0} step={1000000} placeholder="Giá trị (VNĐ)"
                                                    value={a.amount || ''} onChange={e => updateAsset(i, 'amount', Number(e.target.value))}
                                                    className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                            {assets.length > 1 && (
                                                <button type="button" onClick={() => removeAsset(i)} className="text-xs text-rose-400 hover:text-rose-300">Xóa</button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <button type="button" onClick={addAsset} className="w-full border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 rounded-xl py-2 text-sm transition-colors">
                                    + Thêm tài sản / khoản nợ
                                </button>

                                {/* Net Worth Preview */}
                                <div className={`rounded-xl p-4 flex justify-between items-center ${netWorth >= 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Tài sản ròng (Net Worth)</p>
                                        <p className={`text-2xl font-bold mt-0.5 ${netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmtVND(Math.abs(netWorth))} {netWorth < 0 ? '(Âm)' : ''}</p>
                                    </div>
                                    <PiggyBank className={`w-8 h-8 ${netWorth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white/60 hover:text-white rounded-xl py-3 text-sm transition-colors">
                                        ← Quay lại
                                    </button>
                                    <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                        {saving ? 'Đang lưu...' : <><CreditCard className="w-4 h-4" /><span>Hoàn Thành — Xem Dashboard</span></>}
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
