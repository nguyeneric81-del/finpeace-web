'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    Leaf, LogOut, ChevronDown, ChevronUp, Loader2, Upload,
    Camera, Clock, CheckCircle2, X, RefreshCw, KeyRound, AlertTriangle, TrendingUp, Sparkles, Brain
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
    allocation_assessment?: {
        summary: string;
        sectors: string[];
        risk_level: string;
        advice: string;
        risk_alerts?: string[];
        profit_opportunities?: string[];
        balance_assessment?: {
            trending_count: number;
            sideway_count: number;
            note: string;
        };
        optimal_allocation?: {
            tickers: string[];
            weights: number[];
            error?: string;
        } | null;
    };
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

function TradingPlanCard({ plan }: { plan: TradingPlan & { latest_signal?: { type: string, label: string, current_price: number, detail?: string } } }) {
    const [open, setOpen] = useState(false)
    const [imgExpanded, setImgExpanded] = useState(false)
    
    // Map signal colors
    const signalColors: Record<string, string> = {
        'reduce': 'bg-rose-100 text-rose-700 border-rose-200',
        'consider_buy': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'wait_pullback': 'bg-amber-100 text-amber-700 border-amber-200',
        'sell': 'bg-orange-100 text-orange-700 border-orange-200',
        'take_profit': 'bg-purple-100 text-purple-700 border-purple-200'
    }
    const signalConf = plan.latest_signal ? {
        color: signalColors[plan.latest_signal.type] || 'bg-slate-100 text-slate-700 border-slate-200',
        label: plan.latest_signal.label
    } : null;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 font-bold text-sm">{plan.ticker}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800">{plan.ticker} {plan.company_name ? `— ${plan.company_name}` : ''}</p>
                            {signalConf && (
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${signalConf.color} whitespace-nowrap hidden sm:block`}>
                                    {signalConf.label}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-emerald-600 font-medium mt-0.5">{plan.strategy_name}</p>
                        {signalConf && (
                            <div className="sm:hidden mt-1">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${signalConf.color}`}>
                                    {signalConf.label}
                                </span>
                            </div>
                        )}
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

                    {plan.latest_signal?.detail && (
                        <div className={`rounded-xl p-4 border ${signalConf?.color || 'bg-slate-50 border-slate-200'}`}>
                            <p className="text-[10px] font-bold mb-1 uppercase tracking-wider opacity-80 flex items-center gap-1.5"><span className="text-sm">💡</span> Cập nhật Tín hiệu Hệ thống</p>
                            <p className="text-sm leading-relaxed font-medium">{plan.latest_signal.detail}</p>
                        </div>
                    )}

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

function PortfolioAssessment({ assessment }: { assessment: NonNullable<AnalysisResult['allocation_assessment']> }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 overflow-hidden relative">
            {/* Background pattern */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-800/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-800 rounded-lg">
                            <Leaf className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight text-emerald-50">Đánh giá chung từ Advisor</h3>
                            <p className="text-emerald-400/80 text-xs font-medium uppercase tracking-widest mt-0.5">Premium Portfolio Insights</p>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-800/50">
                    <p className="text-emerald-100/90 text-sm leading-relaxed italic">
                        "{assessment.summary}"
                    </p>
                </div>

                {/* Risk & Profit Alerts */}
                {((assessment.risk_alerts?.length || 0) > 0 || (assessment.profit_opportunities?.length || 0) > 0) && (
                    <div className="grid grid-cols-1 gap-3">
                        {assessment.risk_alerts?.map((alert, i) => (
                            <div key={`risk-${i}`} className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-3 flex gap-3 items-start">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-rose-100 leading-relaxed">{alert}</p>
                            </div>
                        ))}
                        {assessment.profit_opportunities?.map((opp, i) => (
                            <div key={`profit-${i}`} className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 flex gap-3 items-start">
                                <TrendingUp className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-100 leading-relaxed">{opp}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest pl-1">Cơ cấu nhóm ngành</p>
                        <div className="flex flex-wrap gap-2">
                            {assessment.sectors.map((s, i) => (
                                <span key={i} className="bg-emerald-800/40 border border-emerald-700/50 text-emerald-100 text-xs px-3 py-1.5 rounded-full font-medium">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest pl-1">Cân bằng Trending & Sideway</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-emerald-950 rounded-full overflow-hidden flex">
                                <div
                                    className="h-full bg-emerald-400 transition-all duration-1000"
                                    style={{ width: `${(assessment.balance_assessment?.trending_count || 0) / ((assessment.balance_assessment?.trending_count || 0) + (assessment.balance_assessment?.sideway_count || 0) || 1) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-100 uppercase">
                                {assessment.balance_assessment?.trending_count}T / {assessment.balance_assessment?.sideway_count}S
                            </span>
                        </div>
                        <p className="text-[10px] text-emerald-300 leading-relaxed italic">{assessment.balance_assessment?.note}</p>
                    </div>
                </div>

                {assessment.optimal_allocation && (
                    <div className="bg-emerald-800/30 rounded-2xl p-4 border border-emerald-700/50">
                        {assessment.optimal_allocation.error && (
                            <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-100/90 leading-relaxed text-left">
                                    {assessment.optimal_allocation.error}
                                </p>
                            </div>
                        )}
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Leaf className="w-3 h-3" /> Phân Bổ Tối Ưu (Minimum Variance Portfolio)
                        </p>
                        <div className="flex flex-col gap-2">
                            {assessment.optimal_allocation.tickers.map((ticker, idx) => {
                                const weightScore = (assessment.optimal_allocation!.weights[idx] * 100).toFixed(1);
                                return (
                                    <div key={ticker} className="flex items-center justify-between text-sm">
                                        <span className="text-emerald-100 font-medium w-12">{ticker}</span>
                                        <div className="flex-1 h-1.5 mx-3 bg-emerald-950 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 transition-all duration-1000"
                                                style={{ width: `${weightScore}%` }}
                                            />
                                        </div>
                                        <span className="text-emerald-200 text-xs w-10 text-right">{weightScore}%</span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-emerald-400/80 mt-3 italic leading-relaxed">
                            💡 Gợi ý AI: Cấu trúc phân bổ trên (mô phỏng) giúp giảm thiểu rủi ro biến động dựa trên dữ liệu tương quan lịch sử của {assessment.optimal_allocation.tickers.length} mã này.
                        </p>
                    </div>
                )}

                <div className="pt-2">
                    <div className="bg-gradient-to-r from-emerald-800/50 to-transparent p-4 rounded-2xl border-l-4 border-emerald-400">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Lời khuyên chiến lược</p>
                        <p className="text-emerald-50 text-sm leading-relaxed font-medium">
                            {assessment.advice}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const UPLOAD_STEPS = [
    { label: 'Đang tải ảnh lên...', icon: '⏳' },
    { label: 'AI đang đọc danh mục...', icon: '🔍' },
    { label: 'Đang khớp Trading Plans...', icon: '📊' },
]

export default function AdvisorDashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [displayedPlans, setDisplayedPlans] = useState<TradingPlan[]>([])
    const [samplePortfolio, setSamplePortfolio] = useState<{result: TradingPlan[], rationale: string} | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadStep, setUploadStep] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    const router = useRouter()
    // ── Đổi mật khẩu ──
    const [showChangePw, setShowChangePw] = useState(false)
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
    const [pwLoading, setPwLoading] = useState(false)
    const [pwError, setPwError] = useState('')
    const [pwSuccess, setPwSuccess] = useState('')

    useEffect(() => {
        const stored = sessionStorage.getItem('advisor_user')
        if (!stored) { router.push('/advisor/login'); return }
        const u = JSON.parse(stored)
        if (u.role === 'admin') { router.push('/advisor/admin'); return }
        setUser(u)
        loadLatestPortfolio(u.id)
        loadSamplePortfolio(u.investor_type || 'balanced')
    }, [])

    async function loadSamplePortfolio(type: string) {
        try {
            const res = await fetch(`/api/advisor/sample-portfolio?investor_type=${type}`)
            const data = await res.json()
            if (data && data.result) setSamplePortfolio(data)
        } catch {}
    }

    // Tải kết quả phân tích: ưu tiên sessionStorage (từ luồng đăng ký) → fallback DB
    async function loadLatestPortfolio(userId: string) {
        // 1. Kiểm tra sessionStorage trước (được lưu ngay lúc đăng ký, đáng tin hơn DB)
        const cached = sessionStorage.getItem('advisor_pre_login_portfolio')
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                // Xoá sau khi đọc để tránh stale data lần sau
                sessionStorage.removeItem('advisor_pre_login_portfolio')
                applyResult(parsed)
                return
            } catch {
                sessionStorage.removeItem('advisor_pre_login_portfolio')
            }
        }

        // 2. Fallback: gọi API lấy từ DB
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
        setUploadStep(0)

        // Step 0 → 1: ảnh đã chọn xong, chuyển sang AI
        const stepTimer1 = setTimeout(() => setUploadStep(1), 800)
        // Step 1 → 2: sau ~3s Gemini vẫn đang xử lý → chuyển sang step 3
        const stepTimer2 = setTimeout(() => setUploadStep(2), 3500)

        // Client-side abort sau 62s
        const controller = new AbortController()
        abortRef.current = controller
        const abortTimer = setTimeout(() => controller.abort(), 62_000)

        try {
            const fd = new FormData()
            fd.append('image', file)
            fd.append('user_id', user?.id || '')
            const res = await fetch('/api/advisor/analyze-portfolio', {
                method: 'POST',
                body: fd,
                signal: controller.signal
            })
            const data = await res.json()
            if (data.success) {
                setSelectedFile(null)
                setImagePreview('')
                applyResult(data)
            } else {
                alert(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.')
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                alert('Phân tích mất quá lâu. Vui lòng thử lại với ảnh nhỏ hơn hoặc rõ hơn.')
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.')
            }
        } finally {
            clearTimeout(stepTimer1)
            clearTimeout(stepTimer2)
            clearTimeout(abortTimer)
            setUploading(false)
            setUploadStep(0)
        }
    }

    async function handleLogout() {
        sessionStorage.removeItem('advisor_user')
        await fetch('/api/advisor/logout', { method: 'POST' })
        router.push('/advisor/login')
    }

    async function handleChangePw() {
        setPwError(''); setPwSuccess('')
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
            setPwError('Vui lòng điền đầy đủ thông tin'); return
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwError('Mật khẩu xác nhận không khớp'); return
        }
        if (pwForm.newPw.length < 6) {
            setPwError('Mật khẩu mới phải có ít nhất 6 ký tự'); return
        }
        setPwLoading(true)
        const res = await fetch('/api/advisor/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.newPw })
        })
        const data = await res.json()
        setPwLoading(false)
        if (!res.ok) { setPwError(data.error); return }
        setPwSuccess('Đổi mật khẩu thành công!')
        setPwForm({ current: '', newPw: '', confirm: '' })
        setTimeout(() => { setShowChangePw(false); setPwSuccess('') }, 1800)
    }

    function handleFileSelect(f: File) {
        setSelectedFile(f)
        setImagePreview(URL.createObjectURL(f))
    }

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Modal đổi mật khẩu */}
            {showChangePw && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-600" />
                                <h3 className="font-bold text-slate-800">Đổi mật khẩu</h3>
                            </div>
                            <button onClick={() => { setShowChangePw(false); setPwError(''); setPwSuccess('') }}>
                                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            {[{ key: 'current', label: 'Mật khẩu hiện tại', ph: 'Mật khẩu cũ' },
                            { key: 'newPw', label: 'Mật khẩu mới', ph: 'Ít nhất 6 ký tự' },
                            { key: 'confirm', label: 'Xác nhận mật khẩu mới', ph: 'Nhập lại mật khẩu mới' }
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-medium text-slate-600 block mb-1">{f.label}</label>
                                    <input type="password" value={pwForm[f.key as keyof typeof pwForm]}
                                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        placeholder={f.ph}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                            ))}
                            {pwError && <p className="text-rose-500 text-sm">{pwError}</p>}
                            {pwSuccess && <p className="text-emerald-600 text-sm font-medium">{pwSuccess}</p>}
                            <button onClick={handleChangePw} disabled={pwLoading}
                                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors mt-1">
                                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</> : 'Xác Nhận Đổi Mật Khẩu'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

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
                        <button onClick={() => { setShowChangePw(true); setPwError(''); setPwSuccess('') }}
                            title="Đổi mật khẩu"
                            className="text-slate-400 hover:text-emerald-600 transition-colors">
                            <KeyRound className="w-4 h-4" />
                        </button>
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
                                    <h2 className="font-bold text-slate-800 text-lg">📊 Kết quả phân tích danh mục</h2>
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

                        {/* Assessment Section */}
                        {result.allocation_assessment && (
                            <PortfolioAssessment assessment={result.allocation_assessment} />
                        )}

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

                        {uploading ? (
                            <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                                <div className="flex flex-col gap-3">
                                    {UPLOAD_STEPS.map((s, i) => {
                                        const isDone = i < uploadStep
                                        const isActive = i === uploadStep
                                        return (
                                            <div key={i} className={`flex items-center gap-3 transition-all ${
                                                isActive ? 'opacity-100' : isDone ? 'opacity-60' : 'opacity-25'
                                            }`}>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm ${
                                                    isDone ? 'bg-emerald-500 text-white' :
                                                    isActive ? 'bg-emerald-100 ring-2 ring-emerald-400' :
                                                    'bg-slate-100'
                                                }`}>
                                                    {isDone ? '✓' : isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : s.icon}
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    isActive ? 'text-emerald-700' : isDone ? 'text-emerald-500' : 'text-slate-400'
                                                }`}>{s.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <p className="text-xs text-slate-400 mt-4 text-center">Thường mất 15–30 giây, vui lòng đừng tắt trang</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => selectedFile && handleUpload(selectedFile)}
                                disabled={!selectedFile}
                                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Upload className="w-4 h-4" />Phân Tích Danh Mục
                            </button>
                        )}
                    </div>
                )}

                {/* ──────────── KHU VỰC 2: DANH MỤC MẪU ──────────── */}
                {samplePortfolio && samplePortfolio.result.length > 0 && (
                    <div className="pt-6 border-t border-slate-100/50 pb-10">
                        <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-6 md:p-8 border border-emerald-100/50 shadow-sm relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -right-6 top-10 opacity-[0.03]">
                                <Brain className="w-64 h-64 text-emerald-900" />
                            </div>
                            
                            <div className="relative z-10 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Sparkles className="w-3.5 h-3.5" /> Khu Vực 02
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Danh Mục Mẫu Định Vị
                                </h2>
                                <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-2xl bg-white/60 p-4 rounded-xl border border-white">
                                    {samplePortfolio.rationale}
                                </p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {samplePortfolio.result.map(plan => (
                                    <TradingPlanCard key={`sample-${plan.id}`} plan={plan as any} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
