'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Shield, Rocket, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StockPick2LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const endpoint = tab === 'login' ? '/api/stockpick2/login' : '/api/stockpick2/register'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setLoading(false)

      if (!res.ok || !data.user) {
        setError(data.error || 'Thao tác không thành công. Vui lòng thử lại.')
        return
      }

      // Store in dedicated stockpick2_user session
      sessionStorage.setItem('stockpick2_user', JSON.stringify(data.user))
      router.push('/stockpick2/dashboard')
    } catch (err) {
      setLoading(false)
      setError('Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.')
    }
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> StockPicks 2.0 AutoPilot
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Tài Khoản StockPicks 2.0
          </h1>
          <p className="text-xs text-slate-400">
            Hệ thống tài khoản độc lập tích hợp rổ lệnh tự động KBSV Core
          </p>
        </div>

        {/* LOGIN / REGISTER CARD */}
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* TAB SWITCHER */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-white/10">
            <button
              onClick={() => { setTab('login'); setError('') }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'login' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng Nhập 2.0
            </button>
            <button
              onClick={() => { setTab('register'); setError('') }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'register' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-semibold text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Họ và Tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="nguyeneric81@gmail.com"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>
                  {tab === 'login' ? 'Truy Cập Dashboard StockPicks 2.0' : 'Tạo Tài Khoản & Nhận 500 Credits'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* DEMO FAST LOGIN LINK */}
          <div className="pt-2 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setForm({ email: 'nguyeneric81@gmail.com', password: '123456', fullName: 'Eric Nguyen' })
                setTab('login')
              }}
              className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              🔑 Dùng tài khoản Demo mặc định: <strong className="text-white">nguyeneric81@gmail.com</strong>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
