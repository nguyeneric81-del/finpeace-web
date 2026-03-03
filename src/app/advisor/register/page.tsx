'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Phone, User, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdvisorRegisterPage() {
    const [form, setForm] = useState({ email: '', phone: '', full_name: '' })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [tempPassword, setTempPassword] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/advisor/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        const data = await res.json()
        setLoading(false)

        if (!res.ok) {
            setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại.')
        } else {
            setTempPassword(data.temp_password || '')
            setDone(true)
        }
    }

    async function copyPassword() {
        await navigator.clipboard.writeText(tempPassword)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                    <p className="text-slate-500 text-sm mt-1">Tư vấn chứng khoán cá nhân hóa</p>
                </div>

                {done ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center"
                    >
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">Tài khoản đã sẵn sàng!</h2>
                        <p className="text-slate-500 text-sm mb-5">
                            Đây là mật khẩu tạm thời của bạn. Hãy ghi lại trước khi thoát trang.
                        </p>

                        {/* Hiện mật khẩu nổi bật */}
                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 mb-4">
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-2">🔑 Mật khẩu tạm thời</p>
                            <p className="text-3xl font-bold tracking-[0.3em] text-emerald-700 font-mono mb-3">
                                {tempPassword}
                            </p>
                            <button
                                onClick={copyPassword}
                                className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                {copied ? '✓ Đã Copy!' : '📋 Copy mật khẩu'}
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 mb-5">
                            Email xác nhận cũng đã được gửi tới <strong>{form.email}</strong>
                            <br />(Kiểm tra cả thư mục Spam nếu không thấy)
                        </p>

                        <Link href="/advisor/login"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors w-full justify-center">
                            Đăng Nhập Ngay <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6">Tạo tài khoản miễn phí</h2>

                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                    <User className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                                    placeholder="Nguyễn Văn An"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent hover:border-slate-300 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                                    <Mail className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />Email <span className="text-rose-500">*</span>
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
                                    <Phone className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    placeholder="0901 234 567"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent hover:border-slate-300 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Đã có tài khoản?{' '}
                            <Link href="/advisor/login" className="text-emerald-600 font-medium hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
