'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Calendar, Shield, LogOut,
  ChevronRight, Star, Flame, Award, Lock, Eye, EyeOff, RefreshCw, BookOpen, ChevronDown, CheckCircle
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

interface Valuation {
  id: string; stock_code: string; quarter_update: string; max_buy_price: number;
  expected_growth: string; cta: string; business_outlook: string; sip_outlook: string;
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
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'status' | 'assets'>('status')
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null)
  const [showChangePw, setShowChangePw] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/sip/deals?customerId=${customer.id}`)
    const data = await res.json()
    const userDeals = data.deals || []
    setDeals(userDeals)

    // Extract unique tickers and fetch valuations
    const map: any = {}
    userDeals.forEach((d: Deal) => { map[d.ticker] = true })
    const userTickers = Object.keys(map)
    
    if (userTickers.length > 0) {
      const vRes = await fetch(`/api/sip/valuations?tickers=${userTickers.join(',')}`)
      const vData = await vRes.json()
      setValuations(vData.valuations || [])
    }
    
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
            { key: 'status', label: 'Trạng Thái Tích Sản' },
            { key: 'assets', label: 'Tài Sản Tích Sản' }
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.key ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              style={tab === t.key ? { background: 'linear-gradient(135deg, #10B981, #059669)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Status tab */}
        <AnimatePresence mode="wait">
          {tab === 'status' && (
            <motion.div key="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              {/* Ticker portfolio summary */}
              {tickers.length > 0 && (
                <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Danh Mục Nắm Giữ Cốt Lõi</p>
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
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Goal Progress if present */}
              {customer.target1_name && (
                <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black uppercase tracking-wider text-indigo-300">Tiến Độ Mục Tiêu</p>
                    <Target className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-xl font-black text-white mb-1">{customer.target1_name}</p>
                  <p className="text-2xl font-black text-indigo-300 mb-3">{fmtBig(customer.target1_value)}</p>
                  
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Đã tích: {fmtBig(totalSpent)}</span>
                    <span className="font-bold text-white">{Math.min(Math.round((totalSpent / customer.target1_value) * 100), 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalSpent / customer.target1_value) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                  </div>
                </div>
              )}

              {/* History block */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Quá trình giải ngân</p>
                  <button onClick={fetchDeals} className="text-slate-500 hover:text-emerald-400 transition">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                {loading && <p className="text-center text-sm text-slate-500 py-4">Đang tải...</p>}
                {[...deals].reverse().map((d, i) => (
                  <div key={d.id} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {d.ticker}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-white uppercase">{d.action}</p>
                        <p className="text-xs font-semibold text-emerald-400">{fmtBig(d.actual_amount || d.target_amount || 0)}</p>
                      </div>
                      <div className="flex gap-3 mt-0.5">
                        <p className="text-[10px] text-slate-500">{new Date(d.order_date).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Assets tab (NEW!) */}
          {tab === 'assets' && (
            <motion.div key="assets" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-sm font-bold text-emerald-300 mb-1">🏦 Báo Cáo Định Giá Cập Nhật</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  FinPeace cung cấp phân tích định kỳ và Cảnh báo Max Buy Price đối với các Cổ phiếu bạn đang Tích sản. Hãy đọc kỹ trước mỗi lệnh mua hàng tháng.
                </p>
              </div>

              {tickers.map(tk => {
                const valuation = valuations.find(v => v.stock_code === tk);
                const isExpanded = expandedAsset === tk;
                
                return (
                  <div key={tk} className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    
                    {/* Accordion Header */}
                    <button onClick={() => setExpandedAsset(isExpanded ? null : tk)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-emerald-400 shadow-lg"
                          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))', border: '1px solid rgba(16,185,129,0.3)' }}>
                          {tk}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-white">{tk}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{valuation ? `Cập nhật ${valuation.quarter_update}` : 'Đang xử lý dữ liệu...'}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} />
                    </button>

                    {/* Accordion Body */}
                    <AnimatePresence>
                      {isExpanded && valuation && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden">
                          <div className="p-4 border-t border-white/10 space-y-4">
                            
                            {/* Max Buy Price Alert */}
                            {valuation.max_buy_price && (
                              <div className="rounded-xl p-3 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <Shield className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-red-400 mb-0.5">Kỷ Luật Chặn Mua (Max Buy Price)</p>
                                  <p className="text-sm font-black text-white">{fmt(valuation.max_buy_price)} VNĐ</p>
                                  <p className="text-xs text-slate-400 mt-1 leading-snug">Tuyệt đối không mua mới nều thi giá vượt mốc này. (Áp dụng tiêu chuẩn MA200 + Kỳ vọng EPS {valuation.expected_growth}).</p>
                                </div>
                              </div>
                            )}

                            {/* CTA / Quick Outlook */}
                            <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                              <p className="text-xs font-black text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5"/> Khuyến Nghị Giao Dịch</p>
                              <p className="text-sm text-slate-200 leading-relaxed"><span className="text-white font-bold">{valuation.cta}</span></p>
                            </div>

                            {/* Deep Markdown Analysis */}
                            {valuation.business_outlook && (
                              <div className="mt-4">
                                <div className="prose prose-invert prose-emerald max-w-none text-sm
                                  prose-headings:font-black prose-headings:mb-2 prose-headings:mt-4 
                                  prose-h1:text-base prose-h2:text-[15px] prose-h3:text-sm prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {valuation.business_outlook.replace(/\`💡.*?\}\`/g, '')}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            )}
                            
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

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
