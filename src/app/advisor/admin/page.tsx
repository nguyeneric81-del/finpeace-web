'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    Leaf, LogOut, Plus, Pencil, Trash2, Loader2,
    X, Save, Upload, Image as ImageIcon, CheckCircle2, Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Plan = {
    id: string; ticker: string; company_name: string; strategy_name: string;
    timeframe: string; entry_zone: string; stop_loss: string; take_profit: string;
    risk_reward: string; max_position_pct: number; indicators: string[];
    entry_criteria: string; exit_criteria: string; analyst_note: string;
    status: string; chart_image_url?: string;
    wave_index?: string; area_symmetry_note?: string; is_confirmed?: boolean;
}
type Pending = { id: string; ticker: string; requested_count: number; status: string; created_at: string }

const EMPTY_PLAN: Omit<Plan, 'id' | 'status'> = {
    ticker: '', company_name: '', strategy_name: '', timeframe: 'Trung hạn (4-8 tuần)',
    entry_zone: '', stop_loss: '', take_profit: '', risk_reward: '',
    max_position_pct: 10, indicators: [], entry_criteria: '', exit_criteria: '',
    analyst_note: '', chart_image_url: '',
    wave_index: '', area_symmetry_note: '', is_confirmed: false
}

function PlanForm({ initial, onSave, onCancel }: { initial: Partial<Plan>; onSave: (p: any) => void; onCancel: () => void }) {
    const [form, setForm] = useState<any>({ ...EMPTY_PLAN, ...initial })
    const [indicatorInput, setIndicatorInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [chartUploading, setChartUploading] = useState(false)
    const [chartPreview, setChartPreview] = useState<string>(initial.chart_image_url || '')

    const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

    async function handleChartUpload(file: File) {
        if (!form.id) {
            alert('Vui lòng lưu plan trước khi upload ảnh chart')
            return
        }
        setChartUploading(true)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('plan_id', form.id)
        const res = await fetch('/api/advisor/admin', { method: 'PUT', body: fd })
        const data = await res.json()
        setChartUploading(false)
        if (data.chart_image_url) {
            setChartPreview(data.chart_image_url)
            set('chart_image_url', data.chart_image_url)
        }
        if (data.draft_plan) {
            // Tự động điền dữ liệu từ AI Draft
            Object.entries(data.draft_plan).forEach(([k, v]) => {
                if (!form[k]) set(k, v)
            })
        }
    }

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
                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Form fields */}
                    {/* Group 1: Thông tin cơ bản & Kỹ thuật */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest border-b border-emerald-50 pb-1">Phân tích Kỹ thuật</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'ticker', label: 'Mã CK *', ph: 'VNM' },
                                { key: 'company_name', label: 'Tên công ty', ph: 'Vinamilk' },
                                { key: 'wave_index', label: 'Hệ thống sóng (VD: Trending 3)', ph: 'Sideway 4' },
                                { key: 'area_symmetry_note', label: 'Tương xứng diện tích', ph: 'Cần tích lũy thêm' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-tight">{f.label}</label>
                                    <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                                        placeholder={f.ph}
                                        className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50">
                            <input type="checkbox" id="is_confirmed" checked={form.is_confirmed || false}
                                onChange={e => set('is_confirmed', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded" />
                            <label htmlFor="is_confirmed" className="text-sm font-bold text-emerald-900">Xác nhận thoát Sideway (Publish Plan)</label>
                        </div>
                    </div>

                    {/* Group 2: Chiến lược giao dịch */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-1">Chiến lược & Quản trị rủi ro</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'strategy_name', label: 'Tên chiến lược *', ph: 'Mua tích lũy vùng đáy' },
                                { key: 'timeframe', label: 'Khung thời gian', ph: '4-8 tuần' },
                                { key: 'entry_zone', label: 'Vùng mua', ph: '55.000 - 57.000' },
                                { key: 'stop_loss', label: 'Cắt lỗ', ph: '52.500' },
                                { key: 'take_profit', label: 'Chốt lời', ph: '65.000' },
                                { key: 'risk_reward', label: 'R:R', ph: '1:2.5' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-tight">{f.label}</label>
                                    <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                                        placeholder={f.ph}
                                        className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-tight">% Tối đa danh mục</label>
                            <input type="number" min="1" max="100" value={form.max_position_pct}
                                onChange={e => set('max_position_pct', Number(e.target.value))}
                                className="border border-slate-100 bg-slate-50/50 rounded-xl px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                    </div>

                    {[
                        { key: 'analyst_note', label: 'Nhận xét phân tích', ph: 'Luận điểm macro, FA...' },
                    ].map(f => (
                        <div key={f.key}>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-tight">{f.label}</label>
                            <textarea rows={2} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                                placeholder={f.ph}
                                className="w-full border border-slate-100 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all" />
                        </div>
                    ))}

                    {/* ── Chart Image Upload ── */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-2 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />Ảnh phân tích kỹ thuật (Chart)
                        </label>
                        {chartPreview ? (
                            <div className="relative">
                                <img src={chartPreview} alt="Chart" className="w-full max-h-64 object-contain rounded-xl border border-slate-200 bg-slate-50" />
                                <button
                                    onClick={() => { setChartPreview(''); set('chart_image_url', '') }}
                                    className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-rose-600"
                                >×</button>
                                <label className="mt-2 flex items-center gap-2 text-xs text-emerald-600 cursor-pointer hover:text-emerald-700">
                                    <input type="file" accept="image/*" className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) handleChartUpload(f) }} />
                                    <Upload className="w-3.5 h-3.5" />Thay ảnh khác
                                </label>
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all ${!form.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="file" accept="image/*" className="hidden" disabled={!form.id}
                                    onChange={e => { const f = e.target.files?.[0]; if (f) handleChartUpload(f) }} />
                                {chartUploading ? (
                                    <><Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" /><p className="text-sm text-slate-500">Đang upload...</p></>
                                ) : (
                                    <><Upload className="w-8 h-8 text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">{form.id ? 'Upload ảnh chart phân tích kỹ thuật' : 'Lưu plan trước, rồi upload chart'}</p>
                                        <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP</p></>
                                )}
                            </label>
                        )}
                    </div>
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

    const loadData = useCallback(async () => {
        setLoading(true)
        const [plansRes, pendingRes] = await Promise.all([
            fetch('/api/advisor/admin?type=plans'),
            fetch('/api/advisor/admin?type=pending')
        ])
        const [plansData, pendingData] = await Promise.all([plansRes.json(), pendingRes.json()])
        if (Array.isArray(plansData)) setPlans(plansData)
        if (Array.isArray(pendingData)) setPending(pendingData)
        setLoading(false)
    }, [])

    async function handleSavePlan(form: any) {
        const res = await fetch('/api/advisor/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upsert_plan', ...form })
        })
        const saved = await res.json()
        setEditPlan(null)
        loadData()
        return saved
    }

    async function handleDeletePlan(id: string, ticker: string) {
        if (!confirm(`Xoá Trading Plan của ${ticker}?`)) return
        await fetch('/api/advisor/admin', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_plan', id })
        })
        loadData()
    }

    async function handlePendingStatus(id: string, status: string) {
        await fetch('/api/advisor/admin', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_pending_status', id, status })
        })
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
            {editPlan !== null && (
                <PlanForm
                    initial={editPlan}
                    onSave={handleSavePlan}
                    onCancel={() => setEditPlan(null)}
                />
            )}

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
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
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
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-800">{plan.ticker} — {plan.company_name || '—'}</p>
                                                {plan.chart_image_url && (
                                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <ImageIcon className="w-3 h-3" />Chart
                                                    </span>
                                                )}
                                            </div>
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
                    <div>
                        <p className="text-slate-600 text-sm mb-4">
                            <span className="font-semibold text-rose-600">{pending.filter(p => p.status === 'pending').length}</span> mã đang chờ phân tích · tổng {pending.length} yêu cầu
                        </p>
                        <div className="space-y-3">
                            {pending.map(p => (
                                <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xs font-bold text-amber-700">{p.ticker}</div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{p.ticker}</p>
                                            <p className="text-xs text-slate-500">
                                                {p.requested_count} khách hàng yêu cầu · {new Date(p.created_at).toLocaleDateString('vi-VN')}
                                            </p>
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
                            {pending.length === 0 && (
                                <div className="text-center py-12 text-slate-400">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
                                    <p>Không có mã nào đang chờ phân tích</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
