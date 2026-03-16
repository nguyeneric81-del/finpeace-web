'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { X, CalendarCheck, TrendingUp, TrendingDown, PiggyBank, CheckCircle2 } from 'lucide-react'

const fmtVND = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

interface CheckInModalProps {
    userId: string
    onClose: () => void
    onSaved: () => void
}

export function CheckInModal({ userId, onClose, onSaved }: CheckInModalProps) {
    const supabase = createClient()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Pre-fill tháng hiện tại
    const now = new Date()
    const defaultLabel = `T${now.getMonth() + 1}/${now.getFullYear()}`

    const [income, setIncome] = useState('')
    const [expense, setExpense] = useState('')
    const [netWorthChange, setNetWorthChange] = useState('')
    const [notes, setNotes] = useState('')

    const incomeNum = Number(income) || 0
    const expenseNum = Number(expense) || 0
    const savingNum = Math.max(0, incomeNum - expenseNum)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (incomeNum <= 0) return alert('Vui lòng nhập thu nhập tháng này.')
        setSaving(true)

        // Lấy tài sản hiện tại để snapshot
        const { data: currentAssets } = await supabase
            .from('client_assets')
            .select('*')
            .eq('user_id', userId)

        const currentNetWorth = (currentAssets || []).reduce((sum: number, a: any) =>
            a.asset_group === 'Nợ' ? sum - (a.amount || 0) : sum + (a.amount || 0), 0)

        const adjustedNetWorth = currentNetWorth + (Number(netWorthChange) || 0)

        const res = await fetch('/api/wealth/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                period_label: defaultLabel,
                cashflow: {
                    income: incomeNum,
                    expense: expenseNum,
                    saving: savingNum
                },
                assets: currentAssets || [],
                net_worth: adjustedNetWorth,
                notes: notes || null
            })
        })

        if (res.ok) {
            // Cập nhật cashflow hiện tại
            await supabase.from('client_cashflow').upsert({
                user_id: userId,
                annual_income: incomeNum * 12,
                annual_expense: expenseNum * 12,
                annual_saving: savingNum * 12,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

            setSaved(true)
            setTimeout(() => onSaved(), 1200)
        } else {
            alert('Lỗi lưu check-in. Thử lại sau.')
        }
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
                    <div className="flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                            <h2 className="font-semibold text-slate-800 dark:text-white">Check-in Định Kỳ</h2>
                            <p className="text-xs text-slate-400">{defaultLabel}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {saved ? (
                    <div className="p-10 flex flex-col items-center text-center">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Đã lưu!</h3>
                        <p className="text-sm text-slate-400 mt-1">Snapshot {defaultLabel} đã được ghi nhận.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Cập nhật thu chi tháng này (theo tháng). Hệ thống sẽ so sánh với kế hoạch của bạn.</p>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-blue-500" />
                                    Thu nhập tháng này
                                </label>
                                <input
                                    type="number" required min={100000} step={100000}
                                    value={income} onChange={e => setIncome(e.target.value)}
                                    placeholder="VD: 50000000"
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                                />
                                {incomeNum > 0 && <p className="text-[10px] text-slate-400">{fmtVND(incomeNum)}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3 text-rose-500" />
                                    Chi phí tháng này
                                </label>
                                <input
                                    type="number" min={0} step={100000}
                                    value={expense} onChange={e => setExpense(e.target.value)}
                                    placeholder="VD: 20000000"
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                                />
                                {expenseNum > 0 && <p className="text-[10px] text-slate-400">{fmtVND(expenseNum)}</p>}
                            </div>
                        </div>

                        {savingNum > 0 && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />
                                    Tiết kiệm tháng này
                                </span>
                                <span className="font-bold text-emerald-600">{fmtVND(savingNum)}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Thay đổi tài sản ròng (±VNĐ, nếu có)
                            </label>
                            <input
                                type="number" step={1000000}
                                value={netWorthChange} onChange={e => setNetWorthChange(e.target.value)}
                                placeholder="VD: 5000000 (tăng) hoặc -2000000 (giảm)"
                                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Ghi chú (tuỳ chọn)</label>
                            <textarea
                                value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="VD: Tháng này thưởng 2 tháng lương..."
                                rows={2}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 resize-none"
                            />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Huỷ
                            </button>
                            <button type="submit" disabled={saving} className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                                {saving ? 'Đang lưu...' : '✓ Lưu Check-in'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    )
}
