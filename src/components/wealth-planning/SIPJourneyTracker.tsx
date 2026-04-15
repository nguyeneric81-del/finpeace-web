'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Flame, Calendar, Target,
  ChevronDown, ChevronUp, Award, Star, BarChart3, RefreshCw } from 'lucide-react'

interface SIPPlan {
  id: string
  stock_code: string
  start_date: string
  end_date: string
  securities_company: string
  securities_account: string
  assigned_dealer: string
  status: string
}

interface Transaction {
  id: string
  stock_code: string
  order_date: string
  unit: number
  total_value: number
  buy_price: number
}

interface PerfSnapshot {
  month: string
  stock_code: string
  cumulative_nav: number
  sip_return_pct: number
  vnindex_return_pct: number
}

interface SIPJourneyTrackerProps {
  userId: string
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n))
const fmtBig = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' triệu'
  return fmt(n)
}

function milestoneLabel(monthsElapsed: number) {
  if (monthsElapsed < 3) return { label: '🌱 Hạt Giống', color: '#86efac' }
  if (monthsElapsed < 6) return { label: '🪴 Mầm Xanh', color: '#4ade80' }
  if (monthsElapsed < 12) return { label: '🌿 Đang Lớn', color: '#22c55e' }
  if (monthsElapsed < 24) return { label: '🌳 Cây Trưởng Thành', color: '#16a34a' }
  if (monthsElapsed < 48) return { label: '💎 Nhà Đầu Tư Kỷ Luật', color: '#10b981' }
  return { label: '🏆 Bậc Thầy Tích Sản', color: '#059669' }
}

function encouragement(streak: number, totalMonths: number) {
  if (streak >= 12) return `🔥 Xuất sắc! ${streak} tháng liên tiếp không gián đoạn — bạn đang đi đúng con đường mà 95% nhà đầu tư cá nhân bỏ cuộc.`
  if (streak >= 6) return `💪 ${streak} tháng đều đặn — thói quen của bạn đang tạo nền tảng vững chắc. Thị trường lên hay xuống, tiền vẫn đổ vào đúng lịch.`
  if (streak >= 3) return `✨ ${streak} tháng liên tiếp — bạn đã qua giai đoạn khó nhất rồi. Tiếp tục kỷ luật này thêm 3 tháng nữa nhé!`
  if (totalMonths > 0) return `🌱 Hành trình vạn dặm bắt đầu từng bước. Mỗi kỳ giải ngân là bạn đang đầu tư vào tương lai của chính mình.`
  return `🚀 Chào mừng bạn đến với hành trình tích sản! Kỳ đầu tiên luôn là quan trọng nhất.`
}

export function SIPJourneyTracker({ userId }: SIPJourneyTrackerProps) {
  const [plans, setPlans] = useState<SIPPlan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [snapshots, setSnapshots] = useState<PerfSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/sip/journey?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans || [])
        setTransactions(data.transactions || [])
        setSnapshots(data.snapshots || [])
      }
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) return (
    <div className="animate-pulse space-y-3">
      <div className="h-40 bg-white/5 rounded-2xl border border-white/10" />
      <div className="h-24 bg-white/5 rounded-2xl border border-white/10" />
    </div>
  )

  if (plans.length === 0) return null // No SIP plans = don't render

  // Compute aggregate stats across all plans
  const activePlans = plans.filter(p => p.status === 'Active' || !p.end_date || new Date(p.end_date) > new Date())
  const earliestStart = plans.reduce((min, p) => p.start_date < min ? p.start_date : min, plans[0]?.start_date || '')
  const latestEnd = plans.reduce((max, p) => (!p.end_date || p.end_date > max) ? (p.end_date || max) : max, '')

  const startDate = earliestStart ? new Date(earliestStart) : new Date()
  const endDate = latestEnd ? new Date(latestEnd) : new Date()
  const now = new Date()
  const monthsElapsed = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))
  const monthsTotal = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)))
  const progressPct = Math.min(100, Math.round((monthsElapsed / monthsTotal) * 100))

  // Total invested
  const totalInvested = transactions.reduce((s, t) => s + Number(t.total_value || 0), 0)

  // Discipline streak: count months with at least 1 transaction
  const txMonths = new Set(transactions.map(t => t.order_date?.slice(0, 7)))
  const sortedMonths = [...txMonths].sort()
  let streak = 0
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  let checkMonth = currentYM
  while (txMonths.has(checkMonth)) {
    streak++
    const [y, m] = checkMonth.split('-').map(Number)
    const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
    checkMonth = prev
  }

  // Latest NAV per stock from snapshots
  const latestSnapByStock: Record<string, PerfSnapshot> = {}
  snapshots.forEach(s => {
    if (!latestSnapByStock[s.stock_code] || s.month > latestSnapByStock[s.stock_code].month) {
      latestSnapByStock[s.stock_code] = s
    }
  })
  const totalCurrentNAV = Object.values(latestSnapByStock).reduce((s, snap) => s + Number(snap.cumulative_nav || 0), 0)
  const pnlPct = totalInvested > 0 ? ((totalCurrentNAV - totalInvested) / totalInvested) * 100 : 0

  // Group transactions by stock code
  const txByStock: Record<string, Transaction[]> = {}
  transactions.forEach(t => {
    if (!txByStock[t.stock_code]) txByStock[t.stock_code] = []
    txByStock[t.stock_code].push(t)
  })

  const milestone = milestoneLabel(monthsElapsed)

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <BarChart3 className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">Hành Trình Tích Sản</h3>
          <p className="text-xs text-white/40">Execution — Tháng {monthsElapsed} / {monthsTotal}</p>
        </div>
      </div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />

        <div className="relative z-10">
          {/* Milestone */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: milestone.color }}>{milestone.label}</p>
              <p className="text-2xl font-black text-white">
                {monthsElapsed} <span className="text-sm font-semibold text-white/50">tháng đồng hành</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-1">Tổng đã giải ngân</p>
              <p className="text-xl font-black text-white">{fmtBig(totalInvested)}</p>
              {totalCurrentNAV > 0 && (
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {pnlPct >= 0
                    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                    : <TrendingDown className="w-3 h-3 text-rose-400" />}
                  <p className={`text-xs font-bold ${pnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
              <span>{startDate.getFullYear()}</span>
              <span className="text-emerald-400 font-bold">{progressPct}% hành trình</span>
              <span>{endDate.getFullYear()}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10B981, #34d399)' }} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, value: `${streak}`, label: 'tháng kỷ luật', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' },
              { icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />, value: `${sortedMonths.length}`, label: 'kỳ giải ngân', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
              { icon: <Star className="w-3.5 h-3.5 text-yellow-400" />, value: `${activePlans.length}`, label: 'mã đang tích', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.2)' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-2.5 text-center"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="text-lg font-black text-white">{s.value}</p>
                <p className="text-[9px] text-white/40 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/70 leading-relaxed">{encouragement(streak, sortedMonths.length)}</p>
          </div>
        </div>
      </motion.div>

      {/* Per-stock breakdown */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Chi Tiết Từng Mã</p>
        {Object.entries(txByStock).map(([stock, txs], i) => {
          const stockInvested = txs.reduce((s, t) => s + Number(t.total_value || 0), 0)
          const stockUnits = txs.reduce((s, t) => s + Number(t.unit || 0), 0)
          const snap = latestSnapByStock[stock]
          const stockNAV = snap?.cumulative_nav || 0
          const stockReturn = snap?.sip_return_pct || 0
          const vnReturn = snap?.vnindex_return_pct || 0
          const isExpanded = expanded[stock]
          const plan = plans.find(p => p.stock_code === stock)

          return (
            <motion.div key={stock} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

              <button onClick={() => setExpanded(prev => ({ ...prev, [stock]: !prev[stock] }))}
                className="w-full p-4 flex items-center gap-3 hover:bg-white/3 transition-colors text-left">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs text-emerald-400 flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {stock}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-sm">{stock}</p>
                    <div className="flex items-center gap-2">
                      {stockReturn !== 0 && (
                        <span className={`text-xs font-bold ${stockReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stockReturn >= 0 ? '+' : ''}{stockReturn.toFixed(1)}%
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <p className="text-[10px] text-white/40">{txs.length} kỳ · {fmt(stockUnits)} CP</p>
                    <p className="text-[10px] text-white/40">Giải ngân: {fmtBig(stockInvested)}</p>
                  </div>
                  {/* NAV bar */}
                  {stockNAV > 0 && (
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (stockNAV / Math.max(stockInvested, stockNAV)) * 100)}%`,
                          background: stockReturn >= 0 ? 'linear-gradient(90deg, #10B981, #34d399)' : 'linear-gradient(90deg, #f43f5e, #fb7185)'
                        }} />
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* Performance vs VN-Index */}
                      {snap && (
                        <div className="grid grid-cols-3 gap-2 pt-3">
                          {[
                            { label: 'NAV Tích Lũy', value: fmtBig(stockNAV), color: 'text-emerald-400' },
                            { label: 'SIP Return', value: `${stockReturn >= 0 ? '+' : ''}${stockReturn.toFixed(1)}%`, color: stockReturn >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                            { label: 'VN-Index', value: `${vnReturn >= 0 ? '+' : ''}${vnReturn.toFixed(1)}%`, color: 'text-white/60' },
                          ].map(m => (
                            <div key={m.label} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                              <p className={`text-sm font-black ${m.color}`}>{m.value}</p>
                              <p className="text-[9px] text-white/30 mt-0.5">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Transaction history */}
                      <div className="space-y-1 max-h-52 overflow-y-auto">
                        {[...txs].reverse().map((tx, j) => (
                          <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <p className="text-[11px] text-white/60">{new Date(tx.order_date).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="flex items-center gap-3 text-[11px]">
                              {tx.unit && <span className="text-white/40">{fmt(tx.unit)} CP</span>}
                              <span className="text-emerald-400 font-semibold">{fmtBig(Number(tx.total_value || 0))}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Plan info */}
                      {plan && (
                        <div className="pt-2 text-[10px] text-white/25 flex gap-3 flex-wrap">
                          {plan.securities_company && <span>🏦 {plan.securities_company}</span>}
                          {plan.securities_account && <span>#{plan.securities_account}</span>}
                          {plan.assigned_dealer && <span>👤 {plan.assigned_dealer}</span>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
