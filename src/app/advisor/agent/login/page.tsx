'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const INPUT_CLASS = `
  w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500
  focus:outline-none focus:ring-2 focus:ring-emerald-500/50
  transition-all duration-200
`

export default function AgentLoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    // Nếu đã đăng nhập và là agent → redirect thẳng về dashboard
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            const role = user?.app_metadata?.role
            if (user && (role === 'agent' || role === 'admin')) {
                router.replace('/advisor/agent/dashboard')
            }
        })
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        setLoading(false)

        if (authError) {
            setError('Email hoặc mật khẩu không đúng')
            return
        }

        const role = data.user?.app_metadata?.role
        if (role !== 'agent' && role !== 'admin') {
            await supabase.auth.signOut()
            setError('Tài khoản này không có quyền truy cập Agent Portal')
            return
        }

        router.push('/advisor/agent/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#020617' }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 24px rgba(16,185,129,0.2)' }}>
                        <Users className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Agent Portal</h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        FinPeace — Quản lý leads & hiệu quả cá nhân
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl p-8"
                    style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
                    <h2 className="text-base font-semibold text-white mb-6">Đăng nhập Agent</h2>

                    {error && (
                        <div className="rounded-xl px-4 py-3 mb-4 text-sm text-rose-300"
                            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest block mb-2 flex items-center gap-1.5"
                                style={{ color: 'rgba(255,255,255,0.4)' }}>
                                <Mail className="w-3 h-3" /> Email
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="email@finpeace.vn"
                                className={INPUT_CLASS}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-widest block mb-2 flex items-center gap-1.5"
                                style={{ color: 'rgba(255,255,255,0.4)' }}>
                                <Lock className="w-3 h-3" /> Mật khẩu
                            </label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="Mật khẩu"
                                className={INPUT_CLASS}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-2 cursor-pointer"
                            style={{ background: loading ? 'rgba(16,185,129,0.5)' : '#10B981', color: 'white', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
