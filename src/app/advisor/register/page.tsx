'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, User, Brain, ShieldCheck, Rocket, TrendingUp, Scale, Search } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
    { label: 'Thông tin', icon: User },
    { label: 'Phong cách', icon: Brain },
    { label: 'Hoàn thành', icon: ShieldCheck },
]

const INVESTOR_TYPES = [
    { id: 'aggressive', Icon: Rocket, title: 'Tích cực', desc: 'Chủ động, hướng tới lợi nhuận cao, chấp nhận rủi ro, quyết đoán', accent: '#10B981', accentBg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    { id: 'growth', Icon: TrendingUp, title: 'Tăng trưởng', desc: 'Nhiệt tình, lạc quan, thích cơ hội mới, sáng tạo trong đầu tư', accent: '#38BDF8', accentBg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)' },
    { id: 'balanced', Icon: Scale, title: 'Cân bằng', desc: 'Bình tĩnh, kiên nhẫn, kiên định, có trách nhiệm, ổn định dài hạn', accent: '#F59E0B', accentBg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    { id: 'conservative', Icon: Search, title: 'Thận trọng', desc: 'Phân tích sâu, kỷ luật, chính xác, thận trọng, tư duy hệ thống', accent: '#A78BFA', accentBg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
]

const INPUT_CLASS = `
    w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200
`
const INPUT_STYLE = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }

export default function AdvisorRegisterPage() {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
    const [investorType, setInvestorType] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function setField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

    async function handleStep2Submit() {
        if (!investorType) { setError('Vui lòng chọn nhóm phong cách đầu tư'); return }
        setLoading(true); setError('')

        const res = await fetch('/api/advisor/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, investor_type: investorType })
        })
        const data = await res.json()
        setLoading(false)

        if (!res.ok) { setError(data.error); return }
        setStep(2)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#020617', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-8 blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.1), transparent 70%)' }} />
            </div>

            <div className="w-full max-w-3xl relative z-10">

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => {
                        const active = i === step
                        const done = i < step
                        return (
                            <div key={i} className="flex items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                                        style={{
                                            background: done ? '#10B981' : active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                                            color: done ? 'white' : active ? '#10B981' : 'rgba(255,255,255,0.3)',
                                            border: active ? '2px solid rgba(16,185,129,0.5)' : done ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: active ? '0 0 12px rgba(16,185,129,0.3)' : 'none'
                                        }}
                                    >
                                        {done ? '✓' : i + 1}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: active ? '#10B981' : done ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.25)' }}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="w-16 md:w-24 h-px mb-4 mx-2 transition-all duration-300" style={{ background: i < step ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)' }} />
                                )}
                            </div>
                        )
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── BƯỚC 1 ── */}
                    {step === 0 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                            className="rounded-3xl p-8" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#10B981' }}>Bước 01</p>
                                <h2 className="text-2xl font-bold text-white">Bạn là ai?</h2>
                                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>FinPeace sẽ gửi mật khẩu đăng nhập về email của bạn.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'full_name', label: 'Họ và tên *', ph: 'VD: Nguyễn Văn An' },
                                    { key: 'email', label: 'Email *', ph: 'VD: nguyenvanan@gmail.com' },
                                    { key: 'phone', label: 'Số điện thoại *', ph: 'VD: 0987 654 321' },
                                ].map(f => (
                                    <div key={f.key} className={f.key === 'email' ? 'md:col-span-2' : ''}>
                                        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.label}</label>
                                        <input
                                            value={form[f.key as keyof typeof form]}
                                            onChange={e => setField(f.key, e.target.value)}
                                            placeholder={f.ph}
                                            className={INPUT_CLASS}
                                            style={INPUT_STYLE}
                                        />
                                    </div>
                                ))}
                            </div>
                            {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
                            <div className="flex justify-between items-center mt-8">
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>FinPeace cam kết bảo mật thông tin</p>
                                <button
                                    onClick={() => {
                                        if (!form.email || !form.phone || !form.full_name) { setError('Vui lòng điền đầy đủ thông tin'); return }
                                        setError(''); setStep(1)
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-125"
                                    style={{ background: '#10B981', color: 'white' }}
                                >
                                    Tiếp theo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── BƯỚC 2 ── */}
                    {step === 1 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                            className="rounded-3xl p-8" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#10B981' }}>Bước 02</p>
                                <h2 className="text-2xl font-bold text-white">Bạn thuộc nhóm nào?</h2>
                                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Chọn nhóm phong cách đầu tư phù hợp nhất với bạn.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {INVESTOR_TYPES.map(t => {
                                    const selected = investorType === t.id
                                    return (
                                        <button key={t.id} onClick={() => setInvestorType(t.id)}
                                            className="text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                                            style={{
                                                background: selected ? t.accentBg : 'rgba(255,255,255,0.03)',
                                                borderColor: selected ? t.border : 'rgba(255,255,255,0.07)',
                                                boxShadow: selected ? `0 0 16px ${t.accentBg}` : 'none'
                                            }}>
                                            <t.Icon className="w-5 h-5 mb-3" style={{ color: selected ? t.accent : 'rgba(255,255,255,0.3)' }} />
                                            <p className="font-bold mb-1 text-sm" style={{ color: selected ? t.accent : 'rgba(255,255,255,0.8)' }}>{t.title}</p>
                                            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.desc}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            {error && <p className="text-rose-400 text-sm mt-3 text-center">{error}</p>}
                            <div className="flex justify-between mt-8">
                                <button onClick={() => { setStep(0); setError('') }} className="flex items-center gap-2 text-sm cursor-pointer transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    <ArrowLeft className="w-4 h-4" /> Quay lại
                                </button>
                                <button onClick={handleStep2Submit} disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-125 disabled:opacity-50"
                                    style={{ background: '#10B981', color: 'white' }}>
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang tạo...</> : <>Hoàn thành <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── BƯỚC 3 ── */}
                    {step === 2 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl p-10 text-center" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', boxShadow: '0 0 32px rgba(16,185,129,0.2)' }}>
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#10B981' }}>Bước 03</p>
                            <h2 className="text-2xl font-bold text-white mb-2">Tài khoản đã sẵn sàng!</h2>
                            <p className="text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                FinPeace đã gửi <span className="text-white font-semibold">mật khẩu đăng nhập</span> vào email <span className="text-emerald-400 font-semibold">{form.email}</span>. Kiểm tra hộp thư (kể cả Spam).
                            </p>
                            <Link href="/advisor/login"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm w-full justify-center transition-all duration-200 hover:brightness-125"
                                style={{ background: '#10B981', color: 'white' }}>
                                Đăng Nhập Ngay <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Đã có tài khoản?{' '}
                    <Link href="/advisor/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}
