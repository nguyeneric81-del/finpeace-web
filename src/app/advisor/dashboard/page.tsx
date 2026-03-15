'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    LogOut, ChevronDown, ChevronUp, Loader2, Upload,
    Camera, Clock, CheckCircle2, X, RefreshCw, KeyRound,
    AlertTriangle, TrendingUp, Sparkles, Brain, BarChart2,
    ArrowUp, ArrowDown, Target, Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Constants ─────────────────────────────────────────────────────────────────
const DARK = {
    bg: '#020617',
    card: '#0F172A',
    cardDeep: '#080F1E',
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(255,255,255,0.13)',
    textPrimary: '#F8FAFC',
    textMuted: 'rgba(255,255,255,0.45)',
    textFaint: 'rgba(255,255,255,0.2)',
    green: '#10B981',
    greenBg: 'rgba(16,185,129,0.1)',
    greenBorder: 'rgba(16,185,129,0.25)',
    amber: '#F59E0B',
    amberBg: 'rgba(245,158,11,0.1)',
    rose: '#F43F5E',
    roseBg: 'rgba(244,63,94,0.1)',
    sky: '#38BDF8',
    skyBg: 'rgba(56,189,248,0.1)',
    purple: '#A78BFA',
    purpleBg: 'rgba(167,139,250,0.1)',
}

// ── Types ─────────────────────────────────────────────────────────────────────
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
        balance_assessment?: { trending_count: number; sideway_count: number; note: string };
        optimal_allocation?: { tickers: string[]; weights: number[]; error?: string } | null;
    };
}

function shuffleAndTake<T>(arr: T[], n: number): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a.slice(0, n)
}

// ── Signal color map ──────────────────────────────────────────────────────────
const SIGNAL_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    reduce: { bg: DARK.roseBg, color: DARK.rose, border: 'rgba(244,63,94,0.25)' },
    consider_buy: { bg: DARK.greenBg, color: DARK.green, border: DARK.greenBorder },
    wait_pullback: { bg: DARK.amberBg, color: DARK.amber, border: 'rgba(245,158,11,0.25)' },
    sell: { bg: 'rgba(249,115,22,0.1)', color: '#F97316', border: 'rgba(249,115,22,0.25)' },
    take_profit: { bg: DARK.purpleBg, color: DARK.purple, border: 'rgba(167,139,250,0.25)' },
}

// ── TradingPlanCard ───────────────────────────────────────────────────────────
function TradingPlanCard({ plan }: { plan: TradingPlan & { latest_signal?: { type: string; label: string; current_price: number; detail?: string } } }) {
    const [open, setOpen] = useState(false)
    const [imgExpanded, setImgExpanded] = useState(false)

    const sig = plan.latest_signal
    const sigStyle = sig ? (SIGNAL_STYLES[sig.type] || { bg: 'rgba(255,255,255,0.06)', color: DARK.textMuted, border: DARK.border }) : null

    return (
        <div className="rounded-2xl overflow-hidden transition-all duration-200" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-all duration-200 hover:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    {/* Ticker badge */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-black text-sm" style={{ fontFamily: 'monospace', background: DARK.greenBg, color: DARK.green, border: `1px solid ${DARK.greenBorder}` }}>
                        {plan.ticker}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-white">{plan.ticker} {plan.company_name ? `— ${plan.company_name}` : ''}</p>
                            {sigStyle && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md hidden sm:block" style={{ background: sigStyle.bg, color: sigStyle.color, border: `1px solid ${sigStyle.border}` }}>
                                    {sig!.label}
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium mt-0.5" style={{ color: DARK.green }}>{plan.strategy_name}</p>
                        {sigStyle && (
                            <div className="sm:hidden mt-1">
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md" style={{ background: sigStyle.bg, color: sigStyle.color, border: `1px solid ${sigStyle.border}` }}>
                                    {sig!.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {plan.chart_image_url && (
                        <span className="text-xs px-2 py-0.5 rounded-full hidden md:block" style={{ background: DARK.skyBg, color: DARK.sky }}>Chart</span>
                    )}
                    <span className="text-xs px-2.5 py-1 rounded-full hidden md:block" style={{ background: DARK.greenBg, color: DARK.green }}>{plan.timeframe}</span>
                    {open ? <ChevronUp className="w-4 h-4" style={{ color: DARK.textMuted }} /> : <ChevronDown className="w-4 h-4" style={{ color: DARK.textMuted }} />}
                </div>
            </button>

            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 space-y-4" style={{ borderTop: `1px solid ${DARK.border}` }}>
                    {plan.chart_image_url && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: DARK.textFaint }}>Biểu đồ phân tích kỹ thuật</p>
                            <div
                                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${imgExpanded ? 'max-h-[600px]' : 'max-h-48'}`}
                                style={{ background: '#020617', border: `1px solid ${DARK.border}` }}
                                onClick={() => setImgExpanded(e => !e)}
                            >
                                <img src={plan.chart_image_url} alt={`Chart ${plan.ticker}`} className="w-full object-contain" />
                                {!imgExpanded && (
                                    <div className="absolute inset-0 flex items-end justify-center pb-3" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.8), transparent)' }}>
                                        <span className="text-white text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}>Xem đầy đủ</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Params grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Vùng mua', value: plan.entry_zone, color: DARK.green },
                            { label: 'Cắt lỗ', value: plan.stop_loss, color: DARK.rose },
                            { label: 'Chốt lời', value: plan.take_profit, color: DARK.sky },
                            { label: 'R:R', value: plan.risk_reward, color: DARK.amber },
                        ].map(item => item.value ? (
                            <div key={item.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${DARK.border}` }}>
                                <p className="text-xs mb-1" style={{ color: DARK.textFaint }}>{item.label}</p>
                                <p className="font-bold text-sm" style={{ color: item.color, fontFamily: 'monospace' }}>{item.value}</p>
                            </div>
                        ) : null)}
                    </div>

                    {/* Signal detail */}
                    {plan.latest_signal?.detail && sigStyle && (
                        <div className="rounded-xl p-4" style={{ background: sigStyle.bg, border: `1px solid ${sigStyle.border}` }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: sigStyle.color }}>
                                <Zap className="w-3 h-3" /> Tín hiệu hệ thống
                            </p>
                            <p className="text-sm leading-relaxed font-medium" style={{ color: sigStyle.color }}>{plan.latest_signal.detail}</p>
                        </div>
                    )}

                    {plan.entry_criteria && (
                        <div className="rounded-xl p-4" style={{ background: DARK.skyBg, border: `1px solid rgba(56,189,248,0.15)` }}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: DARK.sky }}>Điều kiện vào lệnh</p>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{plan.entry_criteria}</p>
                        </div>
                    )}
                    {plan.analyst_note && (
                        <div className="rounded-xl p-4" style={{ background: DARK.amberBg, border: `1px solid rgba(245,158,11,0.15)` }}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: DARK.amber }}>Nhận xét phân tích</p>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{plan.analyst_note}</p>
                        </div>
                    )}
                    {plan.indicators?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {plan.indicators.map((ind, i) => (
                                <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: DARK.textMuted, border: `1px solid ${DARK.border}` }}>{ind}</span>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

// ── PortfolioAssessment ───────────────────────────────────────────────────────
function PortfolioAssessment({ assessment }: { assessment: NonNullable<AnalysisResult['allocation_assessment']> }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 overflow-hidden relative" style={{ background: '#0a1929', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 40px rgba(16,185,129,0.06)' }}>
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)' }} />

            <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: DARK.greenBg }}>
                        <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Đánh giá chung từ Advisor</h3>
                        <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: DARK.green }}>Portfolio Insights</p>
                    </div>
                </div>

                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${DARK.greenBorder}` }}>
                    <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.8)' }}>"{assessment.summary}"</p>
                </div>

                {((assessment.risk_alerts?.length || 0) > 0 || (assessment.profit_opportunities?.length || 0) > 0) && (
                    <div className="space-y-2">
                        {assessment.risk_alerts?.map((alert, i) => (
                            <div key={`risk-${i}`} className="rounded-xl p-3 flex gap-3 items-start" style={{ background: DARK.roseBg, border: 'rgba(244,63,94,0.2)' }}>
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: DARK.rose }} />
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{alert}</p>
                            </div>
                        ))}
                        {assessment.profit_opportunities?.map((opp, i) => (
                            <div key={`profit-${i}`} className="rounded-xl p-3 flex gap-3 items-start" style={{ background: DARK.skyBg, border: `1px solid rgba(56,189,248,0.2)` }}>
                                <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: DARK.sky }} />
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{opp}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: DARK.textFaint }}>Cơ cấu nhóm ngành</p>
                        <div className="flex flex-wrap gap-2">
                            {assessment.sectors.map((s, i) => (
                                <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: DARK.greenBg, color: '#34d399', border: `1px solid ${DARK.greenBorder}` }}>{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: DARK.textFaint }}>Cân bằng Trending & Sideway</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full transition-all duration-1000" style={{
                                    width: `${(assessment.balance_assessment?.trending_count || 0) / ((assessment.balance_assessment?.trending_count || 0) + (assessment.balance_assessment?.sideway_count || 0) || 1) * 100}%`,
                                    background: DARK.green,
                                    boxShadow: `0 0 8px ${DARK.green}80`
                                }} />
                            </div>
                            <span className="text-[10px] font-bold text-white uppercase">
                                {assessment.balance_assessment?.trending_count}T / {assessment.balance_assessment?.sideway_count}S
                            </span>
                        </div>
                        <p className="text-[10px] italic mt-1.5" style={{ color: DARK.textMuted }}>{assessment.balance_assessment?.note}</p>
                    </div>
                </div>

                {assessment.optimal_allocation && (
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.05)', border: `1px solid rgba(16,185,129,0.15)` }}>
                        {assessment.optimal_allocation.error && (
                            <div className="mb-3 rounded-xl p-3 flex gap-2 items-start" style={{ background: DARK.amberBg, border: `1px solid rgba(245,158,11,0.2)` }}>
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{assessment.optimal_allocation.error}</p>
                            </div>
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: DARK.green }}>
                            <BarChart2 className="w-3 h-3" /> Phân Bổ Tối Ưu (Minimum Variance Portfolio)
                        </p>
                        <div className="space-y-2">
                            {assessment.optimal_allocation.tickers.map((ticker, idx) => {
                                const w = (assessment.optimal_allocation!.weights[idx] * 100).toFixed(1)
                                return (
                                    <div key={ticker} className="flex items-center justify-between text-sm">
                                        <span className="text-white font-bold w-12" style={{ fontFamily: 'monospace' }}>{ticker}</span>
                                        <div className="flex-1 h-1.5 mx-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${w}%`, background: DARK.green, boxShadow: `0 0 6px ${DARK.green}60` }} />
                                        </div>
                                        <span className="text-xs w-10 text-right" style={{ color: DARK.textMuted }}>{w}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${DARK.green}` }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: DARK.green }}>Lời khuyên chiến lược</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{assessment.advice}</p>
                </div>
            </div>
        </motion.div>
    )
}

// ── Upload Steps ──────────────────────────────────────────────────────────────
const UPLOAD_STEPS = [
    { label: 'Đang tải ảnh lên...', icon: Upload },
    { label: 'AI đang đọc danh mục...', icon: BarChart2 },
    { label: 'Đang khớp Trading Plans...', icon: Target },
]

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdvisorDashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [displayedPlans, setDisplayedPlans] = useState<TradingPlan[]>([])
    const [samplePortfolio, setSamplePortfolio] = useState<{ result: TradingPlan[]; rationale: string; investor_type: string } | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadStep, setUploadStep] = useState(0)
    const [dragOver, setDragOver] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    const router = useRouter()
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
        } catch { }
    }

    async function loadLatestPortfolio(userId: string) {
        const cached = sessionStorage.getItem('advisor_pre_login_portfolio')
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                sessionStorage.removeItem('advisor_pre_login_portfolio')
                applyResult(parsed)
                return
            } catch { sessionStorage.removeItem('advisor_pre_login_portfolio') }
        }
        try {
            const res = await fetch(`/api/advisor/portfolio?user_id=${userId}`)
            const data = await res.json()
            if (data && data.result) applyResult(data.result)
        } catch { }
    }

    function applyResult(r: AnalysisResult) {
        setResult(r)
        setDisplayedPlans(shuffleAndTake(r.matched_plans, 3))
    }

    async function handleUpload(file: File) {
        setUploading(true); setUploadStep(0)
        const stepTimer1 = setTimeout(() => setUploadStep(1), 800)
        const stepTimer2 = setTimeout(() => setUploadStep(2), 3500)
        const controller = new AbortController()
        abortRef.current = controller
        const abortTimer = setTimeout(() => controller.abort(), 62_000)
        try {
            const fd = new FormData()
            fd.append('image', file)
            fd.append('user_id', user?.id || '')
            const res = await fetch('/api/advisor/analyze-portfolio', { method: 'POST', body: fd, signal: controller.signal })
            const data = await res.json()
            if (data.success) {
                setSelectedFile(null); setImagePreview('')
                applyResult(data)
            } else { alert(data.error || 'Có lỗi xảy ra.') }
        } catch (err: any) {
            if (err.name === 'AbortError') alert('Phân tích mất quá lâu. Thử lại với ảnh nhỏ hơn.')
            else alert('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            clearTimeout(stepTimer1); clearTimeout(stepTimer2); clearTimeout(abortTimer)
            setUploading(false); setUploadStep(0)
        }
    }

    async function handleLogout() {
        sessionStorage.removeItem('advisor_user')
        await fetch('/api/advisor/logout', { method: 'POST' })
        router.push('/advisor/login')
    }

    async function handleChangePw() {
        setPwError(''); setPwSuccess('')
        if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwError('Vui lòng điền đầy đủ'); return }
        if (pwForm.newPw !== pwForm.confirm) { setPwError('Mật khẩu xác nhận không khớp'); return }
        if (pwForm.newPw.length < 6) { setPwError('Mật khẩu mới phải có ít nhất 6 ký tự'); return }
        setPwLoading(true)
        const res = await fetch('/api/advisor/change-password', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
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
        setSelectedFile(f); setImagePreview(URL.createObjectURL(f))
    }

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: DARK.bg }}>
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
        </div>
    )

    const INPUT_S = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
    const INPUT_CLS = "w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"

    return (
        <div className="min-h-screen" style={{ background: DARK.bg, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

            {/* ── CHANGE PASSWORD MODAL ── */}
            {showChangePw && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm rounded-2xl" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${DARK.border}` }}>
                            <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                <h3 className="font-bold text-white">Đổi mật khẩu</h3>
                            </div>
                            <button onClick={() => { setShowChangePw(false); setPwError(''); setPwSuccess('') }} className="cursor-pointer transition-colors hover:text-white" style={{ color: DARK.textMuted }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            {[{ key: 'current', label: 'Mật khẩu hiện tại', ph: 'Mật khẩu cũ' },
                            { key: 'newPw', label: 'Mật khẩu mới', ph: 'Ít nhất 6 ký tự' },
                            { key: 'confirm', label: 'Xác nhận mật khẩu mới', ph: 'Nhập lại' }
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold uppercase tracking-widest block mb-1" style={{ color: DARK.textFaint }}>{f.label}</label>
                                    <input type="password" value={pwForm[f.key as keyof typeof pwForm]}
                                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        placeholder={f.ph} className={INPUT_CLS} style={INPUT_S} />
                                </div>
                            ))}
                            {pwError && <p className="text-rose-400 text-sm">{pwError}</p>}
                            {pwSuccess && <p className="text-emerald-400 text-sm font-medium">{pwSuccess}</p>}
                            <button onClick={handleChangePw} disabled={pwLoading}
                                className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-125 disabled:opacity-50 cursor-pointer mt-1"
                                style={{ background: DARK.green, color: 'white' }}>
                                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</> : 'Xác Nhận Đổi Mật Khẩu'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-10" style={{ background: 'rgba(2,6,23,0.85)', borderBottom: `1px solid ${DARK.border}`, backdropFilter: 'blur(12px)' }}>
                <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: DARK.greenBg, border: `1px solid ${DARK.greenBorder}` }}>
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="font-bold text-white pr-4" style={{ borderRight: `1px solid ${DARK.border}` }}>FinPeace Advisor</span>
                        </div>
                        <Link href="/advisor/macro-insights" className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:brightness-125 ml-2" style={{ background: DARK.greenBg, color: DARK.green, border: `1px solid ${DARK.greenBorder}` }}>
                            <Sparkles className="w-3.5 h-3.5" /> Góc Nhìn Vĩ Mô
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm hidden md:block" style={{ color: DARK.textMuted }}>
                            Xin chào, <strong className="text-white">{user.full_name || user.email}</strong>
                        </span>
                        <button onClick={() => { setShowChangePw(true); setPwError(''); setPwSuccess('') }}
                            title="Đổi mật khẩu" className="cursor-pointer transition-colors hover:text-emerald-400" style={{ color: DARK.textMuted }}>
                            <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={handleLogout} className="cursor-pointer transition-colors hover:text-rose-400" style={{ color: DARK.textMuted }}>
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {result ? (
                    <>
                        {/* Result header */}
                        <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                            <div>
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <BarChart2 className="w-4 h-4 text-emerald-400" /> Kết quả phân tích danh mục
                                </h2>
                                <p className="text-sm mt-0.5" style={{ color: DARK.textMuted }}>
                                    {result.extracted_tickers.length} mã · <span style={{ color: DARK.green }}>{result.matched_plans.length} mã có Trading Plan</span>
                                    {result.pending_tickers.length > 0 && ` · ${result.pending_tickers.length} mã đang phân tích`}
                                </p>
                            </div>
                            <button
                                onClick={() => { setResult(null); setDisplayedPlans([]) }}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:border-emerald-500/40 hover:text-emerald-400"
                                style={{ color: DARK.textMuted, border: `1px solid ${DARK.border}` }}>
                                <RefreshCw className="w-3.5 h-3.5" /> Cập nhật danh mục
                            </button>
                        </div>

                        {result.allocation_assessment && (
                            <PortfolioAssessment assessment={result.allocation_assessment} />
                        )}

                        {displayedPlans.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: DARK.textMuted }}>
                                    <Target className="w-3.5 h-3.5" /> Trading Plans ({displayedPlans.length} mã)
                                </h3>
                                {displayedPlans.map(plan => <TradingPlanCard key={plan.id} plan={plan} />)}
                                {result.matched_plans.length > 3 && (
                                    <p className="text-xs text-center pt-1" style={{ color: DARK.textFaint }}>
                                        Còn {result.matched_plans.length - 3} mã khác · Cập nhật để xem ngẫu nhiên
                                    </p>
                                )}
                            </div>
                        ) : result.extracted_tickers.length === 0 ? (
                            <div className="py-12 text-center rounded-2xl" style={{ background: DARK.amberBg, border: `1px solid rgba(245,158,11,0.2)` }}>
                                <Camera className="w-10 h-10 mx-auto mb-3" style={{ color: DARK.amber }} />
                                <p className="font-semibold text-white mb-1">Không đọc được mã CK từ ảnh</p>
                                <p className="text-sm mb-4" style={{ color: DARK.textMuted }}>AI chưa nhận diện được mã chứng khoán. Thử lại với ảnh rõ hơn.</p>
                                <button onClick={() => { setResult(null); setDisplayedPlans([]) }}
                                    className="text-sm px-5 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:brightness-125"
                                    style={{ background: DARK.amber, color: 'white' }}>
                                    Upload ảnh mới
                                </button>
                            </div>
                        ) : (
                            <div className="py-12 text-center rounded-2xl" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
                                <p style={{ color: DARK.textMuted }}>Chưa có mã nào có Trading Plan sẵn.</p>
                            </div>
                        )}

                        {result.pending_tickers.length > 0 && (
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: DARK.textMuted }}>
                                    <Clock className="w-3.5 h-3.5" style={{ color: DARK.amber }} /> Đang trong hàng chờ
                                </h3>
                                <div className="rounded-2xl p-4" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                                    <div className="flex flex-wrap gap-2">
                                        {result.pending_tickers.map(t => (
                                            <span key={t} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl font-bold" style={{ fontFamily: 'monospace', background: DARK.amberBg, color: DARK.amber, border: `1px solid rgba(245,158,11,0.2)` }}>
                                                <Clock className="w-3 h-3" /> {t}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs mt-3" style={{ color: DARK.textFaint }}>Team FinPeace đang nghiên cứu các mã này. Bạn sẽ nhận kế hoạch sớm nhất có thể.</p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* ── UPLOAD FORM ── */
                    <div className="rounded-2xl p-6" style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                        <h2 className="font-bold text-white mb-1 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-emerald-400" /> Tải danh mục của bạn lên
                        </h2>
                        <p className="text-sm mb-5" style={{ color: DARK.textMuted }}>Chụp màn hình danh mục từ app MBS, VPS, SSI, TCBS... và upload.</p>

                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />

                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden mb-4" style={{ background: '#020617', border: `1px dashed ${DARK.border}` }}>
                                <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain" />
                                <button onClick={() => { setSelectedFile(null); setImagePreview('') }}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-rose-500"
                                    style={{ background: 'rgba(0,0,0,0.7)' }}>
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileSelect(f) }}
                                onClick={() => fileRef.current?.click()}
                                className="rounded-2xl p-10 flex flex-col items-center cursor-pointer transition-all duration-200 mb-4"
                                style={{
                                    border: `2px dashed ${dragOver ? DARK.green : DARK.border}`,
                                    background: dragOver ? DARK.greenBg : 'rgba(255,255,255,0.02)',
                                    boxShadow: dragOver ? `0 0 20px ${DARK.greenBg}` : 'none'
                                }}
                            >
                                <Camera className="w-10 h-10 mb-3" style={{ color: dragOver ? DARK.green : 'rgba(255,255,255,0.15)' }} />
                                <p className="font-medium text-white">Kéo thả ảnh hoặc click để chọn</p>
                                <p className="text-sm mt-1" style={{ color: DARK.textFaint }}>JPG, PNG, WebP</p>
                            </div>
                        )}

                        {uploading ? (
                            <div className="w-full rounded-2xl p-5" style={{ background: DARK.greenBg, border: `1px solid ${DARK.greenBorder}` }}>
                                <div className="flex flex-col gap-3">
                                    {UPLOAD_STEPS.map((s, i) => {
                                        const isDone = i < uploadStep
                                        const isActive = i === uploadStep
                                        const StepIcon = s.icon
                                        return (
                                            <div key={i} className="flex items-center gap-3" style={{ opacity: isActive ? 1 : isDone ? 0.6 : 0.2 }}>
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: isDone ? DARK.green : isActive ? DARK.greenBg : 'rgba(255,255,255,0.06)',
                                                        border: isActive ? `2px solid rgba(16,185,129,0.5)` : 'none'
                                                    }}>
                                                    {isDone ? <span className="text-white text-xs font-bold">✓</span> :
                                                        isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> :
                                                            <StepIcon className="w-3.5 h-3.5" style={{ color: DARK.textMuted }} />}
                                                </div>
                                                <span className="text-sm font-medium" style={{ color: isActive ? DARK.green : isDone ? '#34d399' : DARK.textMuted }}>{s.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <p className="text-xs mt-4 text-center" style={{ color: DARK.textFaint }}>Thường mất 15–30 giây, đừng tắt trang</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => selectedFile && handleUpload(selectedFile)}
                                disabled={!selectedFile}
                                className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-125 disabled:opacity-40 cursor-pointer"
                                style={{ background: DARK.green, color: 'white' }}
                            >
                                <Upload className="w-4 h-4" /> Phân Tích Danh Mục
                            </button>
                        )}
                    </div>
                )}

                {/* ── SAMPLE PORTFOLIO ── */}
                {samplePortfolio && samplePortfolio.result.length > 0 && (
                    <div className="pt-6 pb-10" style={{ borderTop: `1px solid ${DARK.border}` }}>
                        <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden" style={{ background: '#080F1E', border: `1px solid rgba(16,185,129,0.1)` }}>
                            <div className="absolute -right-6 top-10 opacity-[0.03] pointer-events-none">
                                <Brain className="w-64 h-64 text-emerald-400" />
                            </div>
                            <div className="relative z-10 mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                    Danh mục mẫu cho cá tính {{ 'aggressive': 'Tích Cực', 'growth': 'Tăng Trưởng', 'balanced': 'Cân Bằng', 'conservative': 'Thận Trọng' }[samplePortfolio.investor_type] || 'Cân Bằng'} của bạn
                                </h2>
                                <p className="text-sm leading-relaxed max-w-2xl p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', border: `1px solid ${DARK.border}` }}>
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
