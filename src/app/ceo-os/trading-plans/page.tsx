'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, TrendingUp, Package, SplitSquareHorizontal,
  CheckCircle2, RefreshCw, ChevronDown, X, AlertCircle
} from 'lucide-react'

type ExecStatus = 'waiting_buy' | 'bought' | 'holding' | 'partial_sold' | 'closed'

type TradingPlanExec = {
  id: string
  ticker: string
  company_name: string | null
  sector: string | null
  status: string
  exec_status: ExecStatus
  entry_zone: string | null
  stop_loss: string | null
  take_profit: string | null
  risk_reward: string | null
  conviction_level: string | null
  bought_price: number | null
  bought_at: string | null
  holding_since: string | null
  sold_half_price: number | null
  sold_half_at: string | null
  sold_all_price: number | null
  sold_all_at: string | null
  exec_note: string | null
  created_at: string
  is_confirmed: boolean
}

const EXEC_STATUS_CONFIG: Record<ExecStatus, {
  label: string; color: string; bg: string; border: string; icon: React.ElementType
}> = {
  waiting_buy:  { label: '⏳ Chờ mua',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: ShoppingCart },
  bought:       { label: '🔵 Đã mua',     color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)',  icon: TrendingUp },
  holding:      { label: '📦 Chờ bán',    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', icon: Package },
  partial_sold: { label: '📤 Đã bán 1/2', color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  icon: SplitSquareHorizontal },
  closed:       { label: '✅ Đóng lệnh',  color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)',  icon: CheckCircle2 },
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'all',          label: 'Tất cả' },
  { key: 'waiting_buy',  label: 'Chờ mua' },
  { key: 'bought',       label: 'Đã mua' },
  { key: 'holding',      label: 'Chờ bán' },
  { key: 'partial_sold', label: 'Bán 1/2' },
  { key: 'closed',       label: 'Đóng lệnh' },
]

function calcPnL(entry: number, exit: number) {
  const pct = ((exit - entry) / entry) * 100
  return pct.toFixed(2)
}

// ── Action Modal ──
function ActionModal({
  plan,
  action,
  onClose,
  onSuccess,
}: {
  plan: TradingPlanExec
  action: 'buy' | 'sell_half' | 'sell_all'
  onClose: () => void
  onSuccess: () => void
}) {
  const [price, setPrice] = useState('')
  const [note, setNote]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const LABELS = {
    buy:       { title: 'Phê duyệt Mua', btn: 'Xác nhận Mua', color: '#00D16E' },
    sell_half: { title: 'Bán 1/2 Vị thế', btn: 'Xác nhận Bán 1/2', color: '#34d399' },
    sell_all:  { title: 'Bán All Vị thế', btn: 'Xác nhận Bán All', color: '#f87171' },
  }
  const cfg = LABELS[action]

  const handleSubmit = async () => {
    if (!price || isNaN(Number(price))) { setError('Vui lòng nhập giá hợp lệ'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/admin/trading-plans/${plan.id}/action`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, price: Number(price), note }),
      })
      const data = await res.json()
      if (res.ok && data.success) { onSuccess() }
      else setError(data.error || 'Có lỗi xảy ra')
    } catch { setError('Lỗi kết nối') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#0f1929', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">{plan.ticker}</p>
            <h2 className="text-lg font-bold text-white">{cfg.title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
              {action === 'buy' ? 'Giá mua thực khớp' : 'Giá bán thực khớp'}
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder={action === 'buy' ? plan.entry_zone?.split(' ')[0] || 'Nhập giá...' : 'Nhập giá...'}
              className="w-full rounded-xl px-4 py-3 text-white font-mono text-lg font-bold outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Ghi chú (tuỳ chọn)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="VD: Khớp tốt, volume xác nhận..."
              className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs px-3 py-2 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
          style={{ background: cfg.color, color: action === 'sell_all' ? 'white' : '#060b14' }}
        >
          {loading ? 'Đang xử lý...' : cfg.btn}
        </button>
      </motion.div>
    </div>
  )
}

// ── Plan Card ──
function PlanCard({
  plan,
  onAction,
}: {
  plan: TradingPlanExec
  onAction: (plan: TradingPlanExec, action: 'buy' | 'sell_half' | 'sell_all') => void
}) {
  const statusCfg = EXEC_STATUS_CONFIG[plan.exec_status]
  const StatusIcon = statusCfg.icon

  const entryNum = parseFloat(plan.entry_zone?.split(' ')[0] || '0')
  const tpNum    = parseFloat(plan.take_profit?.split(' ')[0] || '0')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl font-bold font-mono" style={{ color: '#00D16E' }}>{plan.ticker}</span>
            {plan.is_confirmed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                style={{ background: 'rgba(0,209,110,0.1)', color: '#00D16E', border: '1px solid rgba(0,209,110,0.2)' }}>
                ✓ FP
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{plan.company_name}</p>
        </div>

        {/* Status badge */}
        <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl"
          style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
          <StatusIcon className="w-3 h-3" />
          {statusCfg.label}
        </span>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'ENTRY', value: plan.entry_zone?.split(' ')[0], color: '#00D16E' },
          { label: 'STOP LOSS', value: plan.stop_loss?.split(' ')[0], color: '#f87171' },
          { label: 'TAKE PROFIT', value: plan.take_profit?.split(' ')[0], color: '#818cf8' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
            <p className="text-sm font-bold font-mono" style={{ color }}>{value || '—'}</p>
          </div>
        ))}
      </div>

      {/* Execution info (if any action taken) */}
      {plan.bought_price && (
        <div className="rounded-xl px-3 py-2.5 mb-3 text-xs"
          style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-white/30 mb-0.5">Giá mua</p>
              <p className="font-bold font-mono text-blue-300">{plan.bought_price}</p>
            </div>
            <div>
              <p className="text-white/30 mb-0.5">T+2 về TK</p>
              <p className="font-bold text-white/60">
                {plan.holding_since
                  ? new Date(plan.holding_since).toLocaleDateString('vi-VN')
                  : '—'}
              </p>
            </div>
            {plan.sold_half_price && (
              <div>
                <p className="text-white/30 mb-0.5">Bán 1/2</p>
                <p className="font-bold font-mono text-teal-300">
                  {plan.sold_half_price}
                  {' '}
                  <span className="text-[10px] text-white/30">
                    ({calcPnL(plan.bought_price, plan.sold_half_price)}%)
                  </span>
                </p>
              </div>
            )}
            {plan.sold_all_price && (
              <div>
                <p className="text-white/30 mb-0.5">Bán all</p>
                <p className="font-bold font-mono text-rose-300">
                  {plan.sold_all_price}
                  {' '}
                  <span className="text-[10px] text-white/30">
                    ({calcPnL(plan.bought_price, plan.sold_all_price)}%)
                  </span>
                </p>
              </div>
            )}
          </div>
          {plan.exec_note && (
            <p className="text-white/30 text-[10px] mt-2 leading-relaxed">{plan.exec_note}</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {plan.exec_status === 'waiting_buy' && (
          <button
            onClick={() => onAction(plan, 'buy')}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(0,209,110,0.15)', color: '#00D16E', border: '1px solid rgba(0,209,110,0.25)' }}
          >
            ✅ Phê duyệt Mua
          </button>
        )}
        {(['bought', 'holding'] as ExecStatus[]).includes(plan.exec_status) && (
          <>
            <button
              onClick={() => onAction(plan, 'sell_half')}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              📤 Bán 1/2
            </button>
            <button
              onClick={() => onAction(plan, 'sell_all')}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              📤 Bán All
            </button>
          </>
        )}
        {plan.exec_status === 'partial_sold' && (
          <button
            onClick={() => onAction(plan, 'sell_all')}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            📤 Bán All (còn lại)
          </button>
        )}
        {plan.exec_status === 'closed' && plan.bought_price && plan.sold_all_price && (
          <div className="flex-1 text-center py-2 text-xs font-bold rounded-xl"
            style={{
              background: parseFloat(calcPnL(plan.bought_price, plan.sold_all_price)) >= 0
                ? 'rgba(0,209,110,0.06)' : 'rgba(248,113,113,0.06)',
              color: parseFloat(calcPnL(plan.bought_price, plan.sold_all_price)) >= 0 ? '#00D16E' : '#f87171',
            }}>
            P&L: {calcPnL(plan.bought_price, plan.sold_all_price)}%
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Page ──
export default function TradingPlansPage() {
  const [plans, setPlans] = useState<TradingPlanExec[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [modalState, setModalState] = useState<{ plan: TradingPlanExec; action: 'buy' | 'sell_half' | 'sell_all' } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/trading-plans?exec_status=${filter}`)
      const data = await res.json()
      setPlans(data.plans || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const handleAction = (plan: TradingPlanExec, action: 'buy' | 'sell_half' | 'sell_all') => {
    setModalState({ plan, action })
  }

  const handleActionSuccess = () => {
    setModalState(null)
    showToast('✅ Cập nhật trạng thái thành công!')
    fetchPlans()
  }

  const runT2Cron = async () => {
    const res = await fetch('/api/cron/t2-promote')
    const data = await res.json()
    showToast(data.promoted > 0
      ? `📦 Promote ${data.promoted} plan → Chờ bán: ${data.tickers?.join(', ')}`
      : '✓ Không có plan nào cần promote T+2')
    fetchPlans()
  }

  const countsByStatus = plans.reduce((acc, p) => {
    acc[p.exec_status] = (acc[p.exec_status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 space-y-5 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-xl"
            style={{ background: '#00D16E' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#00D16E' }}>Quản lý Lệnh</p>
          <h1 className="text-3xl font-black text-white">📊 TrendTrading</h1>
          <p className="text-white/40 mt-1 text-sm">Vòng đời giao dịch: Chờ mua → Đã mua → Chờ bán → Đóng lệnh</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runT2Cron}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}
          >
            📦 Check T+2
          </button>
          <button
            onClick={fetchPlans}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tải lại
          </button>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(EXEC_STATUS_CONFIG) as [ExecStatus, any][]).map(([key, cfg]) => {
          const count = countsByStatus[key] || 0
          if (count === 0) return null
          return (
            <span key={key} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {cfg.label} <span className="opacity-60">({count})</span>
            </span>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === f.key ? 'rgba(0,209,110,0.12)' : 'rgba(255,255,255,0.03)',
              color: filter === f.key ? '#00D16E' : 'rgba(255,255,255,0.35)',
              border: filter === f.key ? '1px solid rgba(0,209,110,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Plans list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl h-36 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <span className="text-4xl opacity-20">📭</span>
          <p className="text-white/30 text-sm">Không có plan nào trong mục này</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} onAction={handleAction} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Action Modal */}
      <AnimatePresence>
        {modalState && (
          <ActionModal
            plan={modalState.plan}
            action={modalState.action}
            onClose={() => setModalState(null)}
            onSuccess={handleActionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
