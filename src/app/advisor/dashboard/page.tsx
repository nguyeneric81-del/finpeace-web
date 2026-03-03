'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, RefreshCw, Loader2, TrendingUp, AlertCircle, CheckCircle2,
    Clock, LogOut, Leaf, ChevronDown, ChevronUp, BarChart3, Target, ShieldAlert
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type TradingPlan = {
    id: string; ticker: string; company_name: string; strategy_name: string;
    timeframe: string; entry_zone: string; stop_loss: string; take_profit: string;
    risk_reward: string; max_position_pct: number; indicators: string[];
    entry_criteria: string; exit_criteria: string; analyst_note: string;
}

type AnalysisResult = {
    extracted_tickers: string[];
    matched_plans: TradingPlan[];
    pending_tickers: string[];
}

function TradingPlanCard({ plan }: { plan: TradingPlan }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 font-bold text-sm">{plan.ticker}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{plan.ticker} — {plan.company_name || 'N/A'}</p>
                        <p className="text-sm text-emerald-600 font-medium mt-0.5">{plan.strategy_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium hidden md:block">{plan.timeframe}</span>
                    {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-100 p-5 space-y-4">
                    {/* Thông số chính */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: '🎯 Vùng mua', value: plan.entry_zone, color: 'bg-blue-50 text-blue-800' },
                            { label: '🛑 Cắt lỗ', value: plan.stop_loss, color: 'bg-rose-50 text-rose-800' },
                            { label: '✅ Chốt lời', value: plan.take_profit, color: 'bg-emerald-50 text-emerald-800' },
                            { label: '⚖️ R:R', value: plan.risk_reward, color: 'bg-purple-50 text-purple-800' },
                        ].map((item, i) => (
                            <div key={i} className={`${item.color} rounded-xl p-3 text-center`}>
                                <p className="text-xs opacity-70 mb-1">{item.label}</p>
                                <p className="font-bold text-sm">{item.value || '—'}</p>
                            </div>
                        ))}
                    </div>

                    {/* Rules */}
                    <div className="grid md:grid-cols-2 gap-3">
                        {plan.entry_criteria && (
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Điều kiện vào lệnh</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{plan.entry_criteria}</p>
                            </div>
                        )}
                        {plan.exit_criteria && (
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Điều kiện thoát lệnh</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{plan.exit_criteria}</p>
                            </div>
                        )}
                    </div>

                    {/* Indicators */}
                    {plan.indicators?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Chỉ báo kỹ thuật</p>
                            <div className="flex flex-wrap gap-2">
                                {plan.indicators.map((ind, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">{ind}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analyst Note */}
                    {plan.analyst_note && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">📋 Nhận xét của đội phân tích</p>
                            <p className="text-sm text-amber-900 leading-relaxed">{plan.analyst_note}</p>
                        </div>
                    )}

                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3 h-3" />
                        Tối đa <strong>{plan.max_position_pct}%</strong> tổng danh mục cho mã này
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default function AdvisorDashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [dragOver, setDragOver] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const stored = sessionStorage.getItem('advisor_user')
        if (!stored) { router.push('/advisor/login'); return }
        setUser(JSON.parse(stored))
    }, [router])

    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) { setError('Chỉ hỗ trợ file ảnh (JPG, PNG, WebP)'); return }
        setError(''); setResult(null)
        setPreview(URL.createObjectURL(file))
        setUploading(true)

        const formData = new FormData()
        formData.append('image', file)
        if (user?.id) formData.append('user_id', user.id)

        const res = await fetch('/api/advisor/analyze-portfolio', { method: 'POST', body: formData })
        const data = await res.json()
        setUploading(false)

        if (!res.ok) { setError(data.error || 'Phân tích thất bại'); return }
        setResult(data)
    }, [user])

    function handleDrop(e: React.DragEvent) {
        e.preventDefault(); setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    async function handleLogout() {
        sessionStorage.removeItem('advisor_user')
        await fetch('/api/advisor/logout', { method: 'POST' })
        router.push('/advisor/login')
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-slate-800">FinPeace Advisor</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">{user.name || user.email}</span>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Upload Zone */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">📸 Tải danh mục của bạn lên</h2>
                    <p className="text-slate-500 text-sm mb-4">Chụp màn hình danh mục chứng khoán từ ứng dụng MBS, VPS, SSI, TCBS... và upload lên đây.</p>

                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                            ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'}`}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                        />

                        {uploading ? (
                            <div className="space-y-3">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                                <p className="text-slate-600 font-medium">AI đang đọc danh mục...</p>
                                <p className="text-slate-400 text-sm">Đang nhận diện mã chứng khoán</p>
                            </div>
                        ) : preview ? (
                            <div className="space-y-3">
                                <img src={preview} alt="Portfolio preview" className="max-h-40 mx-auto rounded-xl object-contain" />
                                <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
                                    <RefreshCw className="w-3.5 h-3.5" />Click để thay ảnh khác
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Upload className="w-10 h-10 text-slate-300 mx-auto" />
                                <p className="text-slate-600 font-medium">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                <p className="text-slate-400 text-sm">Hỗ trợ JPG, PNG, WebP</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />{error}
                        </div>
                    )}
                </div>

                {/* Kết quả phân tích */}
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            {/* Summary */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-5">
                                <p className="text-sm text-slate-500 mb-3">Đã nhận diện <strong>{result.extracted_tickers.length}</strong> mã chứng khoán trong ảnh:</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.extracted_tickers.map(t => (
                                        <span key={t} className={`px-3 py-1 rounded-full text-sm font-semibold
                                            ${result.matched_plans.find(p => p.ticker === t) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Trading Plans có sẵn */}
                            {result.matched_plans.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        Trading Plans ({result.matched_plans.length} mã)
                                    </h3>
                                    <div className="space-y-3">
                                        {result.matched_plans.map(plan => <TradingPlanCard key={plan.id} plan={plan} />)}
                                    </div>
                                </div>
                            )}

                            {/* Pending tickers */}
                            {result.pending_tickers.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        Đang phân tích ({result.pending_tickers.length} mã)
                                    </h3>
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {result.pending_tickers.map(t => (
                                                <span key={t} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">{t}</span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-amber-700">
                                            Đội ngũ phân tích FinPeace đã ghi nhận các mã trên và sẽ cập nhật Trading Plan sớm nhất có thể. F5 lại trang để kiểm tra.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
