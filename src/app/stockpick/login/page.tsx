'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, TrendingUp, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StockPickLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/stockpick/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Đăng nhập thất bại')
    } else {
      sessionStorage.setItem('stockpick_user', JSON.stringify(data.user))
      router.push('/stockpick/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden" style={{ background: '#060b14' }}>
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, #10B981, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, #10B981, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
              border: '1px solid rgba(16,185,129,0.3)',
              boxShadow: '0 0 40px rgba(16,185,129,0.15)',
            }}
          >
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-emerald-300" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">StockPicks 2.0</h1>
          <p className="text-sm mt-1.5 font-medium" style={{ color: 'rgba(16,185,129,0.8)' }}>
            AI-Powered Trading Tool
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            by FinPeace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          <h2 className="text-base font-semibold text-white">Đăng nhập</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl px-4 py-3 text-sm text-rose-300"
              style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                id="stockpick-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@gmail.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                <Lock className="w-3 h-3" /> Mật khẩu
              </label>
              <input
                id="stockpick-password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              id="stockpick-login-btn"
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-1 cursor-pointer"
              style={{
                background: loading
                  ? 'rgba(16,185,129,0.4)'
                  : 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(16,185,129,0.3)',
              }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Đang đăng nhập...' : 'Vào StockPicks'}
            </motion.button>
          </form>
        </div>

        {/* Info tiers */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { tier: 'FREE', desc: '3 deals/tháng', color: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' },
            { tier: 'BRONZE', desc: '10 deals + alerts', color: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: 'rgba(16,185,129,0.8)' },
          ].map(item => (
            <div key={item.tier} className="rounded-2xl p-3 text-center"
              style={{ background: item.color, border: `1px solid ${item.border}` }}>
              <p className="text-xs font-bold" style={{ color: item.text }}>{item.tier}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
