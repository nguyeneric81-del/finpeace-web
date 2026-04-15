'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, TrendingUp, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StockPickLoginPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'enable-push'>('login')
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Handle Forgot Password
    if (mode === 'forgot') {
      const res = await fetch('/api/stockpick/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      setLoading(false)
      
      if (!res.ok) {
        setError(data.error || 'Lỗi khi gửi yêu cầu')
      } else {
        alert(data.message || 'Đã gửi mật khẩu mới vào Email của bạn!')
        setMode('login')
      }
      return
    }

    // Handle Login or Register
    const apiEndpoint = mode === 'login' ? '/api/stockpick/login' : '/api/stockpick/register'
    const bodyPayload = mode === 'login' 
      ? { email: form.email, password: form.password }
      : { email: form.email, password: form.password, full_name: form.fullName }

    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || (mode === 'login' ? 'Đăng nhập thất bại' : 'Đăng ký thất bại'))
    } else {
      sessionStorage.setItem('stockpick_user', JSON.stringify(data.user))
      
      if (mode === 'register') {
        // Nếu vừa đăng ký xong -> Bước 2: xin quyền Push
        setMode('enable-push')
      } else {
        router.push('/stockpick/dashboard')
      }
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  async function handleEnablePush() {
    try {
      setLoading(true);
      setError('');
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        // Khách không cho phép -> Đẩy vào web luôn
        router.push('/stockpick/dashboard');
        return;
      }

      await navigator.serviceWorker.register('/sw.js');
      const reg = await navigator.serviceWorker.ready;
      
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error('Missing VAPID');

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const user = JSON.parse(sessionStorage.getItem('stockpick_user') || '{}');

      // Bắn lên server để Lưu DB + Gửi push notification chứa link đổi pass
      await fetch('/api/stockpick/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: sub,
          userId: user?.id,
          userName: user?.full_name,
          type: 'welcome'
        }),
      });

      // Mở xong rồi thì cho phép vào web
      router.push('/stockpick/dashboard');
    } catch (e: any) {
      console.error(e);
      // Nếu lỗi Noti, cứ cho vào app bình thường tránh kẹt khách
      router.push('/stockpick/dashboard');
    } finally {
      setLoading(false);
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
          <h2 className="text-base font-semibold text-white">
            {mode === 'login' && 'Đăng nhập'}
            {mode === 'register' && 'Tạo tài khoản mới'}
            {mode === 'forgot' && 'Khôi phục mật khẩu'}
            {mode === 'enable-push' && 'Thiết lập Thông báo!'}
          </h2>

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

            {mode === 'enable-push' ? (
              <div className="space-y-4">
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <p className="mb-2">Tài khoản của bạn đã được đăng ký thành công!</p>
                  <p>Hãy bật thông báo để FinPeace gửi ngay Kế hoạch đầu tư và link hướng dẫn bảo mật nhé.</p>
                </div>
                
                <motion.button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
                  }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Đang kích hoạt...' : 'Cho phép nhận thông báo'}
                </motion.button>
                
                <div className="text-center">
                  <button type="button" onClick={() => router.push('/stockpick/dashboard')} className="text-xs text-gray-400 hover:text-white underline">
                    Bỏ qua (không nhận cảnh báo từ AI)
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2 mt-1"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required={mode === 'register'}
                      value={form.fullName}
                      onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      placeholder="Tên của bạn"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </motion.div>
                )}

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

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                        <Lock className="w-3 h-3" /> Mật khẩu
                      </label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => { setMode('forgot'); setError(''); }} className="text-[10px] text-emerald-400 hover:underline">
                          Quên mật khẩu?
                        </button>
                      )}
                    </div>
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
                )}

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
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                  
                  {loading && (mode === 'login' ? 'Đang đăng nhập...' : mode === 'register' ? 'Đang đăng ký...' : 'Đang gửi...')}
                  {!loading && (mode === 'login' ? 'Vào StockPicks' : mode === 'register' ? 'Tạo tài khoản' : 'Nhận pass mới')}
                </motion.button>
              </form>
            )}

          {mode !== 'enable-push' && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  if (mode === 'forgot') setMode('login')
                  else setMode(mode === 'login' ? 'register' : 'login')
                  setError('')
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {mode === 'forgot' ? 'Quay lại đăng nhập' : mode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          )}
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
