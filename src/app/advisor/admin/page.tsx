'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import {
    Leaf, LogOut, Plus, Pencil, Trash2, CheckCircle2, Clock,
    AlertCircle, Loader2, ChevronDown, ChevronUp, X, Save
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const supabase = createClient()

type Plan = {
    id: string; ticker: string; company_name: string; strategy_name: string;
    timeframe: string; entry_zone: string; stop_loss: string; take_profit: string;
    risk_reward: string; max_position_pct: number; indicators: string[];
    entry_criteria: string; exit_criteria: string; analyst_note: string; status: string;
}
type Pending = { id: string; ticker: string; requested_count: number; status: string; created_at: string }

const EMPTY_PLAN: Omit<Plan, 'id' | 'status'> = {
    ticker: '', company_name: '', strategy_name: '', timeframe: 'Trung hạn (4-8 tuần)',
    entry_zone: '', stop_loss: '', take_profit: '', risk_reward: '',
    max_position_pct: 10, indicators: [], entry_criteria: '', exit_criteria: '', analyst_note: ''
}

function PlanForm({ initial, onSave, onCancel }: { initial: Partial<Plan>; onSave: (p: any) => void; onCancel: () => void }) {
    const [form, setForm] = useState<any>({ ...EMPTY_PLAN, ...initial })
    const [indicatorInput, setIndicatorInput] = useState('')
    const [saving, setSaving] = useState(false)

    const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

    async function handleSave() {
        if (!form.ticker || !form.strategy_name) return alert('Cần nhập Ticker và Tên chiến lược')
        setSaving(true)
        await onSave({ ...form, ticker: form.ticker.toUpperCase().trim() })
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                <div className="p-6 border-b flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{initial.id ? `Chỉnh sửa — ${initial.ticker}` : 'Thêm Trading Plan Mới'}</h3>
                    <button onClick={onCancel}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { key: 'ticker', label: 'Mã CK *', ph: 'VNM' },
                            { key: 'company_name', label: 'Tên công ty', ph: 'Vinamilk' },
                            { key: 'strategy_name', label: 'Tên chiến lược *', ph: 'Mua tích lũy vùng đáy' },
                            { key: 'timeframe', label: 'Khung thời gian', ph: 'Trung hạn (4-8 tuần)' },
                            { key: 'entry_zone', label: 'Vùng mua', ph: '55,000 - 57,000' },
                            { key: 'stop_loss', label: 'Cắt lỗ', ph: '52,500 (-7%)' },
                            { key: 'take_profit', label: 'Chốt lời', ph: '65,000 (+15%)' },
                            { key: 'risk_reward', label: 'R:R', ph: '1:2.1' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">{f.label}</label>
                                <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                                    placeholder={f.ph}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">% Tối đa danh mục</label>
                        <input type="number" min="1" max="100" value={form.max_position_pct}
                            onChange={e => set('max_position_pct', Number(e.target.value))}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Chỉ báo kỹ thuật</label>
                        <div className="flex gap-2 mb-2">
                            <input value={indicatorInput} onChange={e => setIndicatorInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && indicatorInput.trim()) { set('indicators', [...(form.indicators || []), indicatorInput.trim()]); setIndicatorInput('') } }}
                                placeholder="VD: MA20 (Enter để thêm)"
                                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(form.indicators || []).map((ind: string, i: number) => (
                                <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                                    {ind}
                                    <button onClick={() => set('indicators', form.indicators.filter((_: string, j: number) => j !== i))} className="text-slate-400 hover:text-rose-500">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {[
                        { key: 'entry_criteria', label: 'Điều kiện vào lệnh', ph: 'RSI < 35, MACD giao cắt dương...' },
                        { key: 'exit_criteria', label: 'Điều kiện thoát lệnh', ph: 'RSI > 70 hoặc giá đạt TP...' },
                        { key: 'analyst_note', label: 'Nhận xét phân tích', ph: 'Thêm thông tin cơ bản, macro...' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">{f.label}</label>
                            <textarea rows={3} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                                placeholder={f.ph}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Huỷ</button>
                    <button onClick={handleSave} disabled={saving}
                        className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Lưu Plan
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function AdvisorAdminPage() {
    const [user, setUser] = useState<any>(null)
    const [tab, setTab] = useState<'plans' | 'pending'>('plans')
    const [plans, setPlans] = useState<Plan[]>([])
    const [pending, setPending] = useState<Pending[]>([])
    const [loading, setLoading] = useState(true)
    const [editPlan, setEditPlan] = useState<Partial<Plan> | null>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = sessionStorage.getItem('advisor_user')
        if (!stored) { router.push('/advisor/login'); return }
        const u = JSON.parse(stored)
        if (u.role !== 'admin') { router.push('/advisor/dashboard'); return }
        setUser(u)
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        const [{ data: p }, { data: pend }] = await Promise.all([
            supabase.from('trading_plans').select('*').order('created_at', { ascending: false }),
            supabase.from('pending_tickers').select('*').order('requested_count', { ascending: false })
        ])
        if (p) setPlans(p)
        if (pend) setPending(pend)
        setLoading(false)
    }

    async function handleSavePlan(form: any) {
        if (form.id) {
            await supabase.from('trading_plans').update({ ...form, updated_at: new Date().toISOString() }).eq('id', form.id)
        } else {
            await supabase.from('trading_plans').insert(form)
        }
        setEditPlan(null)
        loadData()
    }

    async function handleDeletePlan(id: string, ticker: string) {
        if (!confirm(`Xoá Trading Plan của ${ticker}?`)) return
        await supabase.from('trading_plans').delete().eq('id', id)
        loadData()
    }

    async function handlePendingStatus(id: string, status: string) {
        await supabase.from('pending_tickers').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
        loadData()
    }

    async function handleLogout() {
        sessionStorage.removeItem('advisor_user')
        await fetch('/api/advisor/logout', { method: 'POST' })
        router.push('/advisor/login')
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

    const statusColor: any = { pending: 'bg-amber-100 text-amber-700', in_progress: 'bg-blue-100 text-blue-700', done: 'bg-emerald-100 text-emerald-700' }
    const statusLabel: any = { pending: 'Chờ phân tích', in_progress: 'Đang phân tích', done: 'Hoàn thành' }

    return (
        <div className="min-h-screen bg-slate-50">
            {editPlan !== null && <PlanForm initial={editPlan} onSave={handleSavePlan} onCancel={() => setEditPlan(null)} />}

            {/* Navbar */}
            <nav className="bg-emerald-800 text-white sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5" />
                        <span className="font-bold">FinPeace Admin</span>
                        <span className="text-emerald-300 text-xs ml-2">· Team Phân Tích</span>
                    </div>
                    <button onClick={handleLogout} className="text-emerald-200 hover:text-white flex items-center gap-1.5 text-sm transition-colors">
                        <LogOut className="w-4 h-4" />Đăng xuất
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
                    <button onClick={() => setTab('plans')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'plans' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                        Trading Plans ({plans.filter(p => p.status === 'active').length})
                    </button>
                    <button onClick={() => setTab('pending')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all relative ${tab === 'pending' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                        Pending Tickers
                        {pending.filter(p => p.status === 'pending').length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                {pending.filter(p => p.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>
                ) : tab === 'plans' ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-slate-600 text-sm">{plans.length} mã đang quản lý</p>
                            <button onClick={() => setEditPlan({})}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5 transition-colors">
                                <Plus className="w-4 h-4" />Thêm mã mới
                            </button>
                        </div>
                        <div className="space-y-3">
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            {plan.ticker}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{plan.ticker} — {plan.company_name || '—'}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{plan.strategy_name} · {plan.timeframe}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {plan.status === 'active' ? 'Active' : 'Archived'}
                                        </span>
                                        <button onClick={() => setEditPlan(plan)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeletePlan(plan.id, plan.ticker)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-slate-600 text-sm mb-4">{pending.filter(p => p.status === 'pending').length} mã đang chờ phân tích, sắp xếp theo số lượt yêu cầu</p>
                        {pending.map(p => (
                            <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xs font-bold text-amber-700">{p.ticker}</div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{p.ticker}</p>
                                        <p className="text-xs text-slate-500">{p.requested_count} khách hàng yêu cầu · {new Date(p.created_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[p.status]}`}>{statusLabel[p.status]}</span>
                                    {p.status === 'pending' && (
                                        <button onClick={() => handlePendingStatus(p.id, 'in_progress')}
                                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Bắt đầu phân tích
                                        </button>
                                    )}
                                    {p.status === 'in_progress' && (
                                        <button onClick={() => setEditPlan({ ticker: p.ticker })}
                                            className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                            Nhập Trading Plan
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
