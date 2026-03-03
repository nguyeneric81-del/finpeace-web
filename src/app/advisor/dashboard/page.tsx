'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    Leaf, LogOut, ChevronDown, ChevronUp, Loader2, Upload,
    Camera, Clock, CheckCircle2, X, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type TradingPlan = {
    id: string; ticker: string; company_name: string; strategy_name: string;
    timeframe: string; entry_zone: string; stop_loss: string; take_profit: string;
    risk_reward: string; max_position_pct: number; indicators: string[];
    entry_criteria: string; exit_criteria: string; analyst_note: string;
    chart_image_url?: string;
}

type AnalysisResult = {
    extracted_tickers: string[];
    matched_plans: TradingPlan[];
    pending_tickers: string[];
}

// ── Shuffle helper ──
function shuffleAndTake<T>(arr: T[], n: number): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a.slice(0, n)
}

function TradingPlanCard({ plan }: { plan: TradingPlan }) {
    const [open, setOpen] = useState(false)
    const [imgExpanded, setImgExpanded] = useState(false)
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 font-bold text-sm">{plan.ticker}</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{plan.ticker} {plan.company_name ? `— ${plan.company_name}` : ''}</p>
                        <p className="text-sm text-emerald-600 font-medium mt-0.5">{plan.strategy_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {plan.chart_image_url && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full hidden md:block">📊 Chart</span>
                    )}
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full hidden md:block">{plan.timeframe}</span>
                    {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-slate-100 p-5 space-y-4">
                    {/* Chart ảnh phân tích */}
                    {plan.chart_image_url && (
                        <div>
                            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">📊 Biểu đồ phân tích kỹ thuật</p>
                            <div
                                className={`relative cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-slate-900 transition-all ${imgExpanded ? 'max-h-[600px]' : 'max-h-48'}`}
                                onClick={() => setImgExpanded(e => !e)}
                            >
                                <img src={plan.chart_image_url} alt={`Chart ${plan.ticker}`} className="w-full object-contain" />
                                {!imgExpanded && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end justify-center pb-3">
                                        <span className="text-white text-xs bg-slate-800/70 px-3 py-1 rounded-full">🔍 Click để xem đầy đủ</span>
                                    </div>
                                )}
                                {imgExpanded && (
                                    <div className="absolute top-2 right-2">
                                        <span className="text-white text-xs bg-slate-800/70 px-3 py-1 rounded-full">↑ Thu gọn</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Thông số chính */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: '📥 Vùng mua', value: plan.entry_zone },
                            { label: '🛑 Cắt lỗ', value: plan.stop_loss },
                            { label: '🎯 Chốt lời', value: plan.take_profit },
                            { label: '⚡ R:R', value: plan.risk_reward },
                        ].map(item => item.value ? (
                            <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                                <p className="font-semibold text-slate-800 text-sm">{item.value}</p>
                            </div>
                        ) : null)}
                    </div>

                    {plan.entry_criteria && (
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-blue-600 mb-1">Điều kiện vào lệnh</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{plan.entry_criteria}</p>
                        </div>
                    )}
                    {plan.analyst_note && (
                        <div className="bg-amber-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-amber-600 mb-1">Nhận xét phân tích</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{plan.analyst_note}</p>
                        </div>
                    )}
                    {plan.indicators?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {plan.indicators.map((ind, i) => (
                                <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">{ind}</span>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default function AdvisorDashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [displayedPlans, setDisplayedPlans] = useState<TradingPlan[]>([])
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = sessionStorage.getItem('advisor_user')
        if (!stored) { router.push('/advisor/login'); return }
        const u = JSON.parse(stored)
        if (u.role === 'admin') { router.push('/advisor/admin'); return }
        setUser(u)
        loadLatestPortfolio(u.id)
    }, [])

    // Tải kết quả phân tích gần nhất từ customer_portfolios
    async function loadLatestPortfolio(userId: string) {
        try {
            const res = await fetch(`/api/advisor/portfolio?user_id=${userId}`)
            const data = await res.json()
            if (data && data.result) {
                applyResult(data.result)
            }
        } catch { /* không có dữ liệu cũ — hiện form upload */ }
    }

    function applyResult(r: AnalysisResult) {
        setResult(r)
        // 3 mã RANDOM có trading plan
        const random3 = shuffleAndTake(r.matched_plans, 3)
        setDisplayedPlans(random3)
    }

    async function handleUpload(file: File) {
        setUploading(true)
        const fd = new FormData()
        fd.append('image', file)
        fd.append('user_id', user?.id || '')
        const res = await fetch('/api/advisor/analyze-portfolio', { method: 'POST', body: fd })
        const data = await res.json()
        setUploading(false)
        if (data.success) {
            setSelectedFile(null)
            setImagePreview('')
            applyResult(data)
        }
    }

    async function handleLogout() {
        sessionStorage.removeItem('advisor_user')
        await fetch('/api/advisor/logout', { method: 'POST' })
        router.push('/advisor/login')
    }

    function handleFileSelect(f: File) {
        setSelectedFile(f)
        setImagePreview(URL.createObjectURL(f))
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-slate-800">FinPeace Advisor</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden md:block">
                            Xin chào, <strong className="text-slate-700">{user.full_name || user.email}</strong>
                        </span>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* ──────────── KẾT QUẢ PHÂN TÍCH ──────────── */}
                {result ? (
                    <>
                        {/* Header kết quả */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h2 className="font-bold text-slate-800 text-lg">📊 Kế hoạch giao dịch của bạn</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        Phân tích {result.extracted_tickers.length} mã · <span className="text-emerald-600 font-medium">{result.matched_plans.length} mã có Trading Plan</span>
                                        {result.pending_tickers.length > 0 && ` · ${result.pending_tickers.length} mã đang phân tích`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setResult(null); setDisplayedPlans([]) }}
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg">
                                    <RefreshCw className="w-3.5 h-3.5" /> Cập nhật danh mục
                                </button>
                            </div>
                        </div>

                        {/* 3 Trading Plans (random) */}
                        {displayedPlans.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                                        🎯 Trading Plans ({displayedPlans.length} mã được chọn)
                                    </h3>
                                </div>
                                {displayedPlans.map(plan => (
                                    <TradingPlanCard key={plan.id} plan={plan} />
                                ))}
                                {result.matched_plans.length > 3 && (
                                    <p className="text-xs text-center text-slate-400 pt-1">
                                        Còn {result.matched_plans.length - 3} mã khác có trading plan · Cập nhật danh mục để xem ngẫu nhiên
                                    </p>
                                )}
                            </div>
                        ) : result.extracted_tickers.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                                <p className="text-2xl mb-3">📷</p>
                                <p className="font-semibold text-amber-800 mb-1">Không đọc được mã CK từ ảnh</p>
                                <p className="text-sm text-amber-700 mb-4">AI chưa nhận diện được mã chứng khoán trong ảnh bạn đã upload. Hãy thử lại với ảnh rõ hơn.</p>
                                <button
                                    onClick={() => { setResult(null); setDisplayedPlans([]) }}
                                    className="text-sm bg-amber-600 text-white px-5 py-2 rounded-xl hover:bg-amber-700 transition-colors"
                                >
                                    📤 Upload ảnh mới
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                                <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500">Chưa có mã nào trong danh mục có Trading Plan sẵn.</p>
                            </div>
                        )}

                        {/* Pending tickers */}
                        {result.pending_tickers.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Đang trong hàng chờ phân tích
                                </h3>
                                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {result.pending_tickers.map(t => (
                                            <span key={t} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-3 py-1.5 rounded-xl font-medium">
                                                <Clock className="w-3 h-3" /> {t}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3">
                                        Team phân tích FinPeace đang nghiên cứu các mã này. Bạn sẽ nhận được kế hoạch giao dịch sớm nhất có thể.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* ──────────── UPLOAD FORM (nếu chưa có kết quả) ──────────── */
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <h2 className="font-bold text-slate-800 text-lg mb-1">📷 Tải danh mục của bạn lên</h2>
                        <p className="text-sm text-slate-500 mb-5">Chụp màn hình danh mục chứng khoán từ ứng dụng MBS, VPS, SSI, TCBS... và upload lên đây.</p>

                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />

                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-dashed border-slate-200 bg-slate-900 mb-4">
                                <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain" />
                                <button onClick={() => { setSelectedFile(null); setImagePreview('') }}
                                    className="absolute top-3 right-3 w-8 h-8 bg-slate-700/80 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                                <button onClick={() => fileRef.current?.click()}
                                    className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs bg-slate-700/70 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                    🔄 Click để thay ảnh khác
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f) }}
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center cursor-pointer transition-all mb-4
                                    ${dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'}`}
                            >
                                <Camera className="w-10 h-10 text-slate-300 mb-3" />
                                <p className="font-medium text-slate-600">Kéo thả ảnh hoặc click để chọn</p>
                                <p className="text-sm text-slate-400 mt-1">JPG, PNG, WebP</p>
                            </div>
                        )}

                        <button
                            onClick={() => selectedFile && handleUpload(selectedFile)}
                            disabled={!selectedFile || uploading}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang phân tích với AI...</> : <><Upload className="w-4 h-4" />Phân Tích Danh Mục</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
