'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdvisorLoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/advisor/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        const data = await res.json()
        setLoading(false)

        if (!res.ok) {
            setError(data.error || 'Đăng nhập thất bại')
        } else {
            // Lưu thông tin user vào sessionStorage
            sessionStorage.setItem('advisor_user', JSON.stringify(data.user))
            // Redirect theo role
            if (data.user.role === 'admin') {
                router.push('/advisor/admin')
            } else {
                router.push('/advisor/dashboard')
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">FinPeace Advisor</h1>
                    <p className="text-slate-500 text-sm mt-1">Đăng nhập để xem Trading Plan của bạn</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Đăng nhập</h2>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                <Mail className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />Email
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="email@gmail.com"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent hover:border-slate-300 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                <Lock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />Mật khẩu
                            </label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="Mật khẩu từ email"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent hover:border-slate-300 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Chưa có tài khoản?{' '}
                        <Link href="/advisor/register" className="text-emerald-600 font-medium hover:underline">
                            Đăng ký miễn phí
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
