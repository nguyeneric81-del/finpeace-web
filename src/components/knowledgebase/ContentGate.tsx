'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Lock, Mail, Phone, User, CheckCircle, ArrowRight } from 'lucide-react'
import { getSalesCode } from '@/components/SalesRefCapture'

interface ContentGateProps {
    pillarTitle: string
    pillarSlug: string
    articleSlug: string
    track: string
    onUnlock: () => void
}

const STORAGE_KEY = 'fp_kb_unlocked'

// Check if user already unlocked (localStorage)
export function isKbUnlocked(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(STORAGE_KEY)
}

// Mark as unlocked
function setKbUnlocked(email: string) {
    localStorage.setItem(STORAGE_KEY, email)
}

const TRACK_LABELS: Record<string, string> = {
    investor: 'Nhà Đầu Tư',
    trader: 'Nhà Giao Dịch',
    mastery: 'Mastery',
}

export default function ContentGate({ pillarTitle, pillarSlug, articleSlug, track, onUnlock }: ContentGateProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    // Auto unlock if already registered
    useEffect(() => {
        if (isKbUnlocked()) onUnlock()
    }, [onUnlock])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            setError('Vui lòng nhập email hợp lệ')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/knowledgebase/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, pillar: pillarSlug, article_slug: articleSlug, track, sales_code: getSalesCode(), source: 'knowledgebase' }),
            })
            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại')
                return
            }
            setKbUnlocked(email)
            setSuccess(true)
            setTimeout(() => onUnlock(), 1200)
        } catch {
            setError('Không thể kết nối máy chủ, vui lòng thử lại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            {/* Blurred content preview */}
            <div className="pointer-events-none select-none" aria-hidden>
                <div className="space-y-4 opacity-40 blur-[3px]">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded-full" style={{ width: `${85 - i * 8}%` }} />
                            <div className="h-4 bg-slate-200 rounded-full" style={{ width: `${90 - i * 6}%` }} />
                            <div className="h-4 bg-slate-200 rounded-full" style={{ width: `${70 - i * 5}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gate overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-b from-white/0 via-white to-white absolute inset-x-0 inset-y-0" />
                <div className="relative z-10 w-full max-w-sm mx-auto px-4">
                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center shadow-xl">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-emerald-800 font-bold text-lg">Mở khóa thành công!</p>
                            <p className="text-emerald-600 text-sm mt-1">Đang tải nội dung...</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-200/60">
                            {/* Header */}
                            <div className="text-center mb-5">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-2xl mb-3">
                                    <Lock className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                                    <BookOpen className="w-3 h-3" />
                                    {TRACK_LABELS[track] ?? 'Nâng Cao'}
                                </div>
                                <h3 className="text-slate-800 font-black text-lg leading-tight">
                                    Mở khóa toàn bộ <span className="text-emerald-600">{pillarTitle}</span>
                                </h3>
                                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                                    Đăng ký miễn phí để đọc đầy đủ và nhận bản tin đầu tư hàng tuần
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Họ và tên"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="Email của bạn *"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại (không bắt buộc)"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                {error && (
                                    <p className="text-rose-600 text-xs text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Đang xử lý...</span>
                                    ) : (
                                        <>
                                            Mở Khóa Miễn Phí
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-slate-400 text-[10px] text-center mt-3 leading-relaxed">
                                Bằng cách đăng ký, bạn đồng ý nhận bản tin và thông tin từ FinPeace.
                                Không spam. Hủy đăng ký bất kỳ lúc nào.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
