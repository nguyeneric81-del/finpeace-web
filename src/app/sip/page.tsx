'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Calendar, Shield, LogOut,
  ChevronRight, Star, Flame, Award, Lock, Eye, EyeOff, RefreshCw
} from 'lucide-react'

interface Customer {
  id: string; email: string; full_name: string;
  start_date: string; end_date: string; monthly_target: number;
  target1_name: string; target1_value: number; target1_months: number;
  broker_company: string; broker_account: string; dealer_name: string;
}

interface Deal {
  id: string; order_date: string; ticker: string;
  action: string; target_amount: number; actual_quantity: number; actual_amount: number; note: string;
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n)
const fmtBig = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' triệu'
  return fmt(n)
}

function getDisciplineStreak(deals: Deal[], monthlyTarget: number): { streak: number, total: number } {
  const monthMap: Record<string, number> = {}
  deals.forEach(d => {
    const m = d.order_date.slice(0, 7)
    monthMap[m] = (monthMap[m] || 0) + (d.target_amount || 0)
  })
  const months = Object.keys(monthMap).sort()
  let streak = 0, total = months.length
  for (let i = months.length - 1; i >= 0; i--) {
    if ((monthMap[months[i]] || 0) >= monthlyTarget * 0.5) streak++
    else break
  }
  return { streak, total }
}

function getUniqueTickerSummary(deals: Deal[]): Record<string, { qty: number; spent: number }> {
  const map: Record<string, { qty: number; spent: number }> = {}
  deals.forEach(d => {
    if (!map[d.ticker]) map[d.ticker] = { qty: 0, spent: 0 }
    map[d.ticker].qty += d.actual_quantity || 0
    map[d.ticker].spent += d.actual_amount || d.target_amount || 0
  })
  return map
}

function milestoneLabel(idx: number) {
  const labels = ['🌱 Hạt Giống', '🪴 Mầm Xanh', '🌳 Cây Trưởng Thành', '🏆 Đỉnh Cao', '🚀 Tự Do']
  return labels[Math.min(idx, labels.length - 1)]
}

function LoginScreen({ onLogin }: { onLogin: (c: Customer) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/sip/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Đăng nhập thất bại'); return }
      sessionStorage.setItem('sip_customer', JSON.stringify(data.customer))
      onLogin(data.customer)
    } catch { setError('Lỗi kết nối') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2a1f 50%, #0a1628 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Hành Trình Tích Sản</h1>
          <p className="text-sm text-emerald-400 mt-1 font-medium">by FinPeace</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <h2 className="text-base font-bold text-white">Đăng nhập</h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="email@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Mật khẩu</label>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'} placeholder="Mật khẩu tạm thời: 123456"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-2 rounded-xl">{error}</p>}

          <motion.button onClick={handleLogin} disabled={loading}
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            {loading ? 'Đang xác thực...' : 'Vào Hành Trình Của Tôi →'}
          </motion.button>

          <p className="text-center text-xs text-slate-500">
            Mật khẩu tạm thời: <span className="text-emerald-400 font-bold">123456</span>. Bạn có thể đổi sau khi đăng nhập.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function SIPDashboard({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'history' | 'goal'>('overview')
  const [showChangePw, setShowChangePw] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/sip/deals?customerId=${customer.id}`)
    const data = await res.json()
    setDeals(data.deals || [])
    setLoading(false)
  }, [customer.id])

  useEffect(() => { fetchDeals() }, [fetchDeals])

  const handleChangePw = async () => {
    if (newPw.length < 6) { setPwMsg('Mật khẩu phải ít nhất 6 ký tự'); return }
    const res = await fetch('/api/sip/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: customer.id, newPassword: newPw })
    })
    if (res.ok) { setPwMsg('✅ Đổi mật khẩu thành công!'); setNewPw(''); setTimeout(() => { setShowChangePw(false); setPwMsg('') }, 2000) }
    else setPwMsg('Đổi thất bại, thử lại.')
  }

  // Computed stats
  const totalSpent = deals.reduce((s, d) => s + (d.actual_amount || d.target_amount || 0), 0)
  const tickerMap = getUniqueTickerSummary(deals)
  const tickers = Object.keys(tickerMap)
  const { streak, total: totalMonths } = getDisciplineStreak(deals, customer.monthly_target)

  const startDate = new Date(customer.start_date)
  const endDate = new Date(customer.end_date)
  const now = new Date()
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  const progressPct = Math.min(Math.round((elapsed / totalDuration) * 100), 100)

  const monthsElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24 * 30))
  const monthsRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))

  // Milestones based on months invested
  const milestoneIdx = Math.floor(monthsElapsed / 6)

  // Simple projection: assume 12% CAGR
  const projectedValue = totalSpent * Math.pow(1.01, monthsElapsed)
  const simplePnl = projectedValue - totalSpent
  const simplePnlPct = totalSpent > 0 ? (simplePnl / totalSpent) * 100 : 0

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d2a1f 60%, #0a1628 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <p className="text-xs text-emerald-400 font-semibold">FinPeace · Tích Sản</p>
          <h1 className="text-base font-black text-white">{customer.full_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowChangePw(!showChangePw)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition">
            <Lock className="w-4 h-4" />
          </button>
          <button onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Change password overlay */}
      <AnimatePresence>
        {showChangePw && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-3 p-4 rounded-2xl space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-sm font-bold text-white">Đổi mật khẩu</p>
            <input value={newPw} onChange={e => setNewPw(e.target.value)} type="password"
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            {pwMsg && <p className="text-xs text-emerald-400">{pwMsg}</p>}
            <button onClick={handleChangePw}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              Xác nhận đổi mật khẩu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-24 space-y-4 mt-4">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  {milestoneLabel(milestoneIdx)}
                </p>
                <p className="text-3xl font-black text-white">{monthsElapsed} <span className="text-base font-semibold text-slate-400">tháng</span></p>
                <p className="text-sm text-slate-400 mt-0.5">Kiên trì đồng hành cùng FinPeace</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Đã đầu tư</p>
                <p className="text-lg font-black text-white">{fmtBig(totalSpent)}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>{new Date(customer.start_date).getFullYear()}</span>
                <span className="text-emerald-400 font-semibold">{progressPct}% hành trình</span>
                <span>{new Date(customer.end_date).getFullYear()}</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #10B981, #34d399)' }} />
              </div>
              <p className="text-xs text-slate-500 mt-1.5 text-right">Còn {monthsRemaining} tháng nữa</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Kỷ luật liên tiếp', value: `${streak} tháng`, icon: <Flame className="w-4 h-4 text-orange-400" />, color: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
            { label: 'Tổng kỳ đầu tư', value: `${totalMonths} kỳ`, icon: <Calendar className="w-4 h-4 text-blue-400" />, color: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
            { label: 'Cổ phiếu đang tích', value: `${tickers.length} mã`, icon: <Star className="w-4 h-4 text-yellow-400" />, color: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.2)' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-3 text-center" style={{ background: s.color, border: `1px solid ${s.border}` }}>
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-base font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'overview', label: 'Tổng quan' },
            { key: 'history', label: 'Lịch sử' },
            { key: 'goal', label: 'Mục tiêu' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.key ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              style={tab === t.key ? { background: 'linear-gradient(135deg, #10B981, #059669)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
              {/* Encouragement message */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-sm font-bold text-emerald-300 mb-1">💬 Nhắn nhủ từ FinPeace</p>
                {streak >= 6 ? (
                  <p className="text-sm text-slate-300">Bạn đang trên con đường xuất sắc! <span className="text-emerald-400 font-bold">{streak} tháng</span> không gián đoạn là minh chứng cho sức mạnh kỷ luật. Thị trường lên hay xuống — bạn vẫn kiên định. Đây chính là bí quyết của những nhà đầu tư thành công.</p>
                ) : streak >= 3 ? (
                  <p className="text-sm text-slate-300">Mỗi tháng nộp tiền đều đặn là một bước đi vững chắc. <span className="text-emerald-400 font-bold">{streak} tháng</span> liên tiếp thể hiện bạn đang xây dựng thói quen tài chính mạnh mẽ. Hãy duy trì!</p>
                ) : (
                  <p className="text-sm text-slate-300">Hành trình tích sản bắt đầu từ kỳ đầu tiên. Mỗi lần giải ngân là bạn đang đầu tư vào tương lai của chính mình. Đừng để một tháng nào trôi qua mà không để lại dấu ấn trên danh mục!</p>
                )}
              </div>

              {/* Ticker portfolio */}
              {tickers.length > 0 && (
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Danh Mục Cổ Phiếu</p>
                  {tickers.map((tk, i) => {
                    const info = tickerMap[tk]
                    const pct = totalSpent > 0 ? (info.spent / totalSpent) * 100 : 0
                    return (
                      <div key={tk} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-emerald-400"
                          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {tk}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-bold text-white">{tk}</p>
                            <p className="text-xs text-slate-400">{info.qty > 0 ? `${fmt(info.qty)} CP` : `${fmtBig(info.spent)}`}</p>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.05, duration: 0.6 }}
                              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #10B981, #34d399)' }} />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{pct.toFixed(0)}% tổng danh mục</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Monthly target info */}
              <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Cam kết giải ngân hằng tháng</p>
                  <p className="text-xl font-black text-white">{fmtBig(customer.monthly_target)}</p>
                  {customer.broker_company && <p className="text-xs text-slate-500 mt-0.5">Tài khoản: {customer.broker_company} · {customer.broker_account}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* History tab */}
          {tab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Lịch Sử Giải Ngân ({deals.length} lần)</p>
                <button onClick={fetchDeals} className="text-slate-500 hover:text-emerald-400 transition">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              {loading && <p className="text-center text-sm text-slate-500 py-8">Đang tải...</p>}
              {[...deals].reverse().map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  className="rounded-2xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-emerald-400 flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    {d.ticker}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-white">{d.ticker} · {d.action}</p>
                      <p className="text-xs font-semibold text-emerald-400">{fmtBig(d.actual_amount || d.target_amount || 0)}</p>
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <p className="text-[10px] text-slate-500">{new Date(d.order_date).toLocaleDateString('vi-VN')}</p>
                      {d.actual_quantity && <p className="text-[10px] text-slate-500">{fmt(d.actual_quantity)} CP</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Goal tab */}
          {tab === 'goal' && (
            <motion.div key="goal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
              {customer.target1_name ? (
                <>
                  <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-indigo-400" />
                      <p className="text-xs font-black uppercase tracking-wider text-indigo-300">Mục Tiêu Chính</p>
                    </div>
                    <p className="text-xl font-black text-white mb-1">{customer.target1_name}</p>
                    <p className="text-3xl font-black text-indigo-300">{fmtBig(customer.target1_value)}</p>
                    {customer.target1_months && <p className="text-xs text-slate-500 mt-1">Lộ trình dự kiến: {customer.target1_months} tháng ({Math.round(customer.target1_months / 12)} năm)</p>}
                  </div>

                  <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Tiến Độ Vốn Gốc Tích Lũy</p>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Đã tích: {fmtBig(totalSpent)}</span>
                        <span className="font-bold text-white">{Math.min(Math.round((totalSpent / customer.target1_value) * 100), 100)}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }}
                          animate={{ width: `${Math.min((totalSpent / customer.target1_value) * 100, 100)}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Còn cần: {fmtBig(Math.max(customer.target1_value - totalSpent, 0))}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <p className="text-xs text-slate-400 mb-2">📈 Ước tính với lãi suất tích lũy 12%/năm</p>
                      <p className="text-lg font-black text-emerald-300">{fmtBig(projectedValue)}</p>
                      <p className="text-xs text-slate-500">Giá trị ước tính danh mục sau {monthsElapsed} tháng tích sản</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Chưa có mục tiêu cụ thể được thiết lập.</p>
                  <p className="text-xs text-slate-600 mt-1">Liên hệ chuyên viên FinPeace để cập nhật mục tiêu của bạn.</p>
                </div>
              )}

              {/* Dealer info */}
              {customer.dealer_name && (
                <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    {customer.dealer_name[0]}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Chuyên viên phụ trách</p>
                    <p className="text-sm font-bold text-white">{customer.dealer_name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 ml-auto" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  )
}

export default function SIPPortalPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('sip_customer')
    if (stored) {
      try { setCustomer(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setChecking(false)
  }, [])

  const handleLogin = (c: Customer) => setCustomer(c)
  const handleLogout = () => {
    sessionStorage.removeItem('sip_customer')
    setCustomer(null)
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!customer) return <LoginScreen onLogin={handleLogin} />
  return <SIPDashboard customer={customer} onLogout={handleLogout} />
}
