'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, User, Brain, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
    { label: 'Thông tin', icon: User },
    { label: 'Phong cách', icon: Brain },
    { label: 'Hoàn thành', icon: ShieldCheck },
]

const INVESTOR_TYPES = [
    { id: 'aggressive', emoji: '🚀', title: 'Tích cực', desc: 'Chủ động, hướng tới lợi nhuận cao, chấp nhận rủi ro, quyết đoán' },
    { id: 'growth', emoji: '📈', title: 'Tăng trưởng', desc: 'Nhiệt tình, lạc quan, thích cơ hội mới, sáng tạo trong đầu tư' },
    { id: 'balanced', emoji: '⚖️', title: 'Cân bằng', desc: 'Bình tĩnh, kiên nhẫn, kiên định, có trách nhiệm, ổn định dài hạn' },
    { id: 'conservative', emoji: '🔍', title: 'Thận trọng', desc: 'Phân tích sâu, kỷ luật, chính xác, thận trọng, tư duy hệ thống' },
]

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon
                        const active = i === step
                        const done = i < step
                        return (
                            <div key={i} className="flex items-center">
                                <div className={`flex flex-col items-center gap-1.5 transition-all`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-400'}`}>
                                        {done ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-xs font-medium ${active ? 'text-emerald-700' : done ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`w-16 md:w-24 h-0.5 mb-4 mx-2 transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        )
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── BƯỚC 1: Thông tin cơ bản ── */}
                    {step === 0 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">Bước 01</p>
                                <h2 className="text-2xl font-bold text-slate-800">Bạn là ai?</h2>
                                <p className="text-slate-500 mt-1">FinPeace sẽ gửi mật khẩu đăng nhập về email của bạn.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'full_name', label: 'Họ và tên *', ph: 'VD: Nguyễn Văn An' },
                                    { key: 'email', label: 'Email *', ph: 'VD: nguyenvanan@gmail.com' },
                                    { key: 'phone', label: 'Số điện thoại *', ph: 'VD: 0987 654 321' },
                                ].map(f => (
                                    <div key={f.key} className={f.key === 'email' ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-medium text-slate-600 mb-1.5">{f.label}</label>
                                        <input
                                            value={form[f.key as keyof typeof form]}
                                            onChange={e => setField(f.key, e.target.value)}
                                            placeholder={f.ph}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                            {error && <p className="text-rose-500 text-sm mt-3">{error}</p>}
                            <div className="flex justify-between items-center mt-8">
                                <p className="text-xs text-slate-400">FinPeace cam kết bảo mật thông tin &amp; không chia sẻ cho bên thứ 3</p>
                                <button
                                    onClick={() => {
                                        if (!form.email || !form.phone || !form.full_name) { setError('Vui lòng điền đầy đủ thông tin'); return }
                                        setError(''); setStep(1)
                                    }}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                                    Tiếp theo <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── BƯỚC 2: Phong cách đầu tư ── */}
                    {step === 1 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">Bước 02</p>
                                <h2 className="text-2xl font-bold text-slate-800">Bạn thuộc nhóm nào?</h2>
                                <p className="text-slate-500 mt-1">Chọn nhóm phong cách đầu tư phù hợp nhất với bạn.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {INVESTOR_TYPES.map(t => (
                                    <button key={t.id} onClick={() => setInvestorType(t.id)}
                                        className={`text-left p-5 rounded-2xl border-2 transition-all ${investorType === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}>
                                        <span className="text-2xl mb-2 block">{t.emoji}</span>
                                        <p className={`font-bold mb-1 ${investorType === t.id ? 'text-emerald-700' : 'text-slate-800'}`}>{t.title}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                            {error && <p className="text-rose-500 text-sm mt-3 text-center">{error}</p>}
                            <div className="flex justify-between mt-8">
                                <button onClick={() => { setStep(0); setError('') }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Quay lại
                                </button>
                                <button onClick={handleStep2Submit} disabled={loading}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors">
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang tạo tài khoản...</> : <>Hoàn thành <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── BƯỚC 3: Hoàn thành ── */}
                    {step === 2 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">Bước 03</p>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tài khoản đã sẵn sàng!</h2>
                            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                                FinPeace đã gửi <strong>mật khẩu đăng nhập</strong> vào email <strong className="text-slate-700">{form.email}</strong>. Kiểm tra hộp thư (kể cả Spam) và đăng nhập ngay.
                            </p>

                            <Link href="/advisor/login"
                                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors w-full justify-center">
                                Đăng Nhập Ngay <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Đã có tài khoản?{' '}
                    <Link href="/advisor/login" className="text-emerald-600 hover:underline font-medium">Đăng nhập</Link>
                </p>
            </div>
        </div>
    )
}
