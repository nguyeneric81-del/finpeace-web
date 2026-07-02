'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, TrendingUp, TrendingDown, Target, Shield,
  CheckCircle, AlertTriangle, Zap, BarChart2, Lock,
  ChevronRight, Lightbulb, Activity, Waves, ArrowUpRight
} from 'lucide-react'
import { TradingPlan, normalizePrice } from './DealCard'
import KbsvExecutionPanel from './KbsvExecutionPanel'


interface DealDetailModalProps {
  plan: TradingPlan | null
  isBronze: boolean
  user?: any
  credits?: number
  onUnlockSuccess?: (dealId: string, newCredits: number) => void
  onClose: () => void
}

// ── Signal Badge ──
const SIGNAL_CONFIG: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = {
  entry_now:     { color: '#00D16E', bg: 'rgba(0,209,110,0.12)',  label: '✅ Có thể cân nhắc mua', icon: CheckCircle },
  wait_pullback: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⏳ Chờ pullback về vùng entry', icon: AlertTriangle },
  above_entry:   { color: '#f87171', bg: 'rgba(248,113,113,0.12)', label: '⚠️ Giá trên vùng mua — Không đuổi', icon: TrendingDown },
  take_profit:   { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '🎯 Đang ở vùng chốt lời', icon: Target },
}

// ── Parse Trend/Sideway scores from analyst_note ──
function parseTrendScores(note: string): { trend: number | null; sideway: number | null; matrix: string | null } {
  const trendMatch = note.match(/Trục Xu hướng[^:]*:\s*\[?(\d)\/5\]?/i) || note.match(/Trend Score[^:]*:\s*\[?(\d)\/5\]?/i) || note.match(/Trend Score\s*\[?(\d)\/5\]?/i) || note.match(/Trend\s*\[?(\d)\/5\]?/i) 
  const sidewayMatch = note.match(/Trục Dao động[^:]*:\s*\[?(\d)\/5\]?/i) || note.match(/Sideway Score[^:]*:\s*\[?(\d)\/5\]?/i) || note.match(/Sideway Score\s*\[?(\d)\/5\]?/i) || note.match(/Sideway\s*\[?(\d)\/5\]?/i)
  const matrixMatch = note.match(/Matrix Evaluation[:\s]+(.+?)(?:\*\*)?(?:\n|$)/i) || note.match(/Kết luận Tọa Độ\s*:\s*(.+?)(?:\*\*)?(?:\n|$)/i) || note.match(/TỌA ĐỘ[^:]*:[^\n]+\n([^\n]+)/i)

  return {
    trend: trendMatch ? parseInt(trendMatch[1]) : null,
    sideway: sidewayMatch ? parseInt(sidewayMatch[1]) : null,
    matrix: matrixMatch ? matrixMatch[1].replace(/\*/g, '').replace(/```/g, '').trim() : null,
  }
}

// ── Score bar component ──
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        <span className="text-sm font-black" style={{ color }}>{score}/5</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 h-2 rounded-full transition-all"
            style={{
              background: i < score ? color : 'rgba(255,255,255,0.07)',
              boxShadow: i < score ? `0 0 6px ${color}60` : 'none',
            }} />
        ))}
      </div>
    </div>
  )
}

// ── Section wrapper ──
function Section({ title, icon: Icon, badge, bg, children }: {
  title: string; icon: React.ElementType; badge?: React.ReactNode; bg?: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl overflow-hidden mb-3"
      style={{ background: bg || 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {title}
          </h3>
        </div>
        {badge}
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

// ── Render analyst_note as structured sections ──
function AnalystNote({ note, isBronze }: { note: string; isBronze: boolean }) {
  // Split by section headers (## or **1. **2. etc)
  const cleaned = note.replace(/\*\*/g, '')
  const preview = cleaned.slice(0, 180)

  if (!isBronze) {
    return (
      <div className="relative">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {preview}<span style={{ color: 'rgba(255,255,255,0.15)' }}>...</span>
          </p>
        </div>
        {/* Gradient fade */}
        <div className="h-12" style={{ background: 'linear-gradient(to bottom, transparent, #0d1424)' }} />
        {/* Lock CTA */}
        <div className="px-4 pb-4 text-center">
          <div className="inline-flex flex-col items-center gap-2 py-3 px-5 rounded-2xl"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <Lock className="w-4 h-4 text-amber-400/50" />
            <p className="text-xs font-semibold" style={{ color: 'rgba(245,158,11,0.7)' }}>
              Nâng lên BRONZE để đọc toàn bộ phân tích
            </p>
            <a href="https://finpeace.cloud/stockpick-bronze" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white' }}>
              Xem gói BRONZE <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <p className="text-xs leading-[1.8] whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {cleaned}
      </p>
    </div>
  )
}

// ── Main Modal ──
export default function DealDetailModal({ plan, isBronze, user, credits = 0, onUnlockSuccess, onClose }: DealDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showExecutionPanel, setShowExecutionPanel] = useState(false)

  const handleKillSwitch = async () => {
    if (!plan || !user?.id) return
    if (!confirm('Xác nhận hủy 3 lệnh điều kiện đang pending? Bạn sẽ tự quản lý vị thế này.')) return
    
    try {
      // 1. Fetch active conditional orders to find the ones for this symbol
      const ordersRes = await fetch(`/api/kbsv/proxy/cond-orders?advisor_user_id=${user.id}&rows=50`)
      const ordersData = await ordersRes.json()
      
      let itemsToCancel = []
      if (ordersData.ok && (ordersData.data?.items || ordersData.d?.items)) {
        const items = ordersData.data?.items || ordersData.d?.items || []
        itemsToCancel = items
          .filter((item: any) => item.symbol === plan.ticker && ['PENDING', 'ACTIVATED'].includes(item.status))
          .map((item: any) => ({
            conditionId: item.id,
            orderType: item.orderType
          }))
      }

      // 2. Call cancel-batch-order with found items via proxy
      if (itemsToCancel.length > 0) {
        console.log('[KillSwitch] Cancelling conditional orders:', itemsToCancel)
        await fetch(`/api/kbsv/proxy/cancel-batch-order?advisor_user_id=${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            otpType: 'core-email-otp',
            transactionId: 999999, // mock transaction ID for UAT bypass
            otp: '123456',        // mock OTP for UAT bypass
            orders: itemsToCancel
          })
        })
      }

      // Reset the plan back to waiting_buy
      const res = await fetch(`/api/admin/trading-plans/${plan.id}/action`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })

      if (res.ok) {
        alert('Đã hủy toàn bộ lệnh tự động thành công. Vị thế do bạn tự quản lý.')
        onClose() // Close modal to refresh list
      } else {
        alert('Lỗi hủy lệnh trên hệ thống.')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi kết nối.')
    }
  }

  useEffect(() => {
    setMounted(true)
    if (plan) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [plan])

  const handleUnlock = async () => {
    if (!plan || !user?.id) return
    setUnlocking(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/stockpick/unlock-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, dealId: plan.id }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (onUnlockSuccess) {
          onUnlockSuccess(plan.id, data.newCredits)
        }
      } else {
        setErrorMsg(data.error || 'Lỗi khi mở khoá.')
      }
    } catch (e) {
      setErrorMsg('Đã có lỗi xảy ra.')
    } finally {
      setUnlocking(false)
    }
  }

  const scores = useMemo(() =>
    plan?.analyst_note ? parseTrendScores(plan.analyst_note) : { trend: null, sideway: null, matrix: null },
    [plan?.analyst_note]
  )

  if (!plan || !mounted) return null

  const signal = plan.signal
  const sigConfig = signal ? (SIGNAL_CONFIG[signal.signal_type] || SIGNAL_CONFIG['wait_pullback']) : null
  const SigIcon = sigConfig?.icon || AlertTriangle
  const rrNum = parseFloat((plan.risk_reward || '0').replace(/[^0-9.]/g, ''))

  const convictionBg =
    plan.conviction_level?.toLowerCase().includes('cao') || plan.conviction_level?.toLowerCase() === 'high'
      ? { color: '#00D16E', bg: 'rgba(0,209,110,0.12)', border: 'rgba(0,209,110,0.2)' }
      : plan.conviction_level?.toLowerCase().includes('trung bình')
        ? { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' }
        : { color: '#94a3b8', bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.12)' }

  // Matrix state color
  const matrixColor = scores.matrix?.toLowerCase().includes('pass') || scores.matrix?.toLowerCase().includes('buy')
    ? '#00D16E'
    : scores.matrix?.toLowerCase().includes('hold')
      ? '#f59e0b' : '#f87171'

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col justify-end md:justify-center items-center px-0 md:px-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />

        <motion.div
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 32, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="relative z-10 w-full md:max-w-2xl max-h-[94vh] md:max-h-[85vh] overflow-y-auto mt-auto md:mt-0 rounded-t-[24px] md:rounded-b-[24px]"
          style={{
            background: 'linear-gradient(180deg, #0f1929 0%, #0b1220 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 -24px 80px rgba(0,209,110,0.15)',
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-0.5 sticky top-0 z-10"
            style={{ background: 'linear-gradient(180deg,#0f1929,transparent)' }}>
            <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />
          </div>

          {/* ── HEADER ── */}
          <div className="px-5 pt-3 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Ticker + confirmed */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-3xl font-bold font-mono text-[#00D16E] tracking-tight">{plan.ticker}</span>
                  {plan.exchange && (
                    <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded">{plan.exchange}</span>
                  )}
                  {plan.is_confirmed && (
                    <CheckCircle className="w-5 h-5 text-[#00D16E] shrink-0 drop-shadow-[0_0_8px_rgba(0,209,110,0.5)]" />
                  )}
                </div>
                {/* Company Name + Logo */}
                <div className="flex items-center gap-2 mt-1">
                  {plan.logo_url && (
                    <img src={plan.logo_url} alt="Logo" className="w-6 h-6 rounded-full object-cover shrink-0" />
                  )}
                  {plan.company_name && (
                    <p className="text-sm truncate font-medium text-white/80">{plan.company_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {plan.sector && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                      {plan.sector}
                    </span>
                  )}
                  {plan.strategy_name && (
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {plan.strategy_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Close + price */}
              <div className="flex flex-col items-end gap-1.5 ml-3">
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mb-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
                {signal && (
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xl font-bold font-mono text-white leading-none">{normalizePrice(signal.current_price?.toString())}</p>
                    {signal.current_change !== undefined && signal.current_change !== null && (
                      <p className={`text-xs font-semibold font-mono mt-1 ${signal.current_change >= 0 ? 'text-[#00D16E]' : 'text-red-500'}`}>
                        {signal.current_change >= 0 ? '+' : ''}{signal.current_change}%
                      </p>
                    )}
                    {signal.current_volume !== undefined && signal.current_volume !== null && (
                      <p className="text-[10px] text-white/40 font-mono mt-1 whitespace-nowrap">
                        KL: {signal.current_volume.toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="px-4 pt-4 pb-14 space-y-0">
            {plan.is_locked ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(20px)' }}>
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Deal đang khoá</h3>
                <p className="text-sm px-4 mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Mở khoá để xem điểm mua/bán, báo cáo phân tích và cấu trúc sóng.
                </p>
                {user?.tier === 'BRONZE' ? (
                  <div className="w-full max-w-sm px-4">
                    <button
                      onClick={handleUnlock}
                      disabled={unlocking || credits <= 0}
                      className="w-full py-3.5 rounded-2xl font-bold flex flex-col items-center transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: 'white' }}
                    >
                      <span>{unlocking ? 'Đang mở khoá...' : 'Mở khoá deal này'}</span>
                      <span className="text-[10px] opacity-80 mt-1 font-medium">
                        (Mất 1 Credit - Bạn đang có {credits})
                      </span>
                    </button>
                    {errorMsg && <p className="text-red-400 text-xs mt-3">{errorMsg}</p>}
                    {credits <= 0 && !errorMsg && (
                      <p className="text-amber-400/80 text-xs mt-3">Bạn đã hết Credit. Vui lòng nâng cấp gói.</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-sm px-4">
                    <a href="https://finpeace.cloud/stockpick-bronze" target="_blank" rel="noopener noreferrer"
                      className="block w-full py-3.5 rounded-2xl font-bold transition-all"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: 'white' }}>
                      Nâng cấp BRONZE
                    </a>
                    <p className="text-amber-400/80 text-xs mt-3 font-medium">
                      Để xem 5 deals tiềm năng ngay hôm nay.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {showExecutionPanel ? (
                  <div className="pt-2">
                    <KbsvExecutionPanel
                      plan={plan}
                      user={user}
                      onClose={() => setShowExecutionPanel(false)}
                      onSuccess={(boughtPrice) => {
                        setShowExecutionPanel(false)
                        onClose()
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* 1. SIGNAL REALTIME */}
            {signal && sigConfig && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
                className="rounded-2xl px-4 py-3 mb-3 flex items-start gap-3"
                style={{ background: sigConfig.bg, border: `1px solid ${sigConfig.color}25` }}>
                <SigIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: sigConfig.color }} />
                <div>
                  <p className="text-sm font-bold leading-none mb-1" style={{ color: sigConfig.color }}>
                    {sigConfig.label}
                  </p>
                  {signal.signal_detail && (
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {signal.signal_detail}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. THÔNG SỐ GIAO DỊCH */}
            <Section title="Thông số giao dịch" icon={BarChart2}
              badge={
                plan.timeframe ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                    {plan.timeframe}
                  </span>
                ) : undefined
              }>
              {/* Stats grid redefined */}
              <div className="py-3">
                {(() => {
                  const entryAvg = plan.entry_zone ? parseFloat(plan.entry_zone.match(/[\d.]+/)?.[0] || '0') : 0;
                  const tpNum = plan.take_profit ? parseFloat(plan.take_profit.match(/[\d.]+/)?.[0] || '0') : 0;
                  const expectedProfitPct = (entryAvg > 0 && tpNum > 0) ? ((tpNum - entryAvg) / entryAvg * 100).toFixed(1) : '—';
                  
                  const currentPriceNum = (signal && typeof signal.current_price !== 'undefined') ? parseFloat(normalizePrice(signal.current_price.toString())) : 0;
                  const boughtPriceNum = plan.bought_price || 0;
                  
                  let actualProfitPct = '—';
                  let actualProfitColor = 'white';
                  if (plan.exec_status && ['bought', 'holding'].includes(plan.exec_status) && boughtPriceNum > 0 && currentPriceNum > 0) {
                    const pnl = ((currentPriceNum - boughtPriceNum) / boughtPriceNum * 100);
                    actualProfitPct = `${pnl >= 0 ? '+' : ''}${pnl.toFixed(1)}%`;
                    actualProfitColor = pnl >= 0 ? '#00D16E' : '#ef4444';
                  } else if (plan.exec_status === 'partial_sold' && plan.sold_half_price && boughtPriceNum > 0) {
                    const pnl = ((plan.sold_half_price - boughtPriceNum) / boughtPriceNum * 100);
                    actualProfitPct = `${pnl >= 0 ? '+' : ''}${pnl.toFixed(1)}% (1/2)`;
                    actualProfitColor = pnl >= 0 ? '#00D16E' : '#ef4444';
                  } else if (plan.exec_status === 'closed' && plan.sold_all_price && boughtPriceNum > 0) {
                    const pnl = ((plan.sold_all_price - boughtPriceNum) / boughtPriceNum * 100);
                    actualProfitPct = `${pnl >= 0 ? '+' : ''}${pnl.toFixed(1)}% (Đóng)`;
                    actualProfitColor = pnl >= 0 ? '#00D16E' : '#ef4444';
                  }

                  return (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] uppercase text-white/40 mb-1">Lãi dự kiến</p>
                        <p className="text-lg font-bold font-mono text-[#34d399]">{expectedProfitPct !== '—' ? `${expectedProfitPct}%` : '—'}</p>
                      </div>
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] uppercase text-white/40 mb-1">Lãi lỗ thực</p>
                        <p className="text-lg font-bold font-mono" style={{ color: actualProfitColor }}>{actualProfitPct}</p>
                      </div>
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] uppercase text-white/40 mb-1">Giá mục tiêu (TP)</p>
                        <p className="text-lg font-bold font-mono text-white">{plan.take_profit || '—'}</p>
                      </div>
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] uppercase text-white/40 mb-1">Thưởng / Rủi ro</p>
                        <p className="text-lg font-bold font-mono" style={{ color: rrNum >= 2 ? '#34d399' : '#f59e0b' }}>{plan.risk_reward || '—'}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>


            </Section>

            {/* 3. TRẠNG THÁI THỰC THI — shown when plan has been acted on */}
            {plan.exec_status && plan.exec_status !== 'waiting_buy' && (
              <div className="rounded-2xl overflow-hidden mb-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Trạng thái thực thi
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                    background:
                      plan.exec_status === 'bought'       ? 'rgba(96,165,250,0.15)' :
                      plan.exec_status === 'holding'      ? 'rgba(167,139,250,0.15)' :
                      plan.exec_status === 'partial_sold' ? 'rgba(52,211,153,0.15)' :
                      'rgba(107,114,128,0.15)',
                    color:
                      plan.exec_status === 'bought'       ? '#60a5fa' :
                      plan.exec_status === 'holding'      ? '#a78bfa' :
                      plan.exec_status === 'partial_sold' ? '#34d399' :
                      '#9ca3af',
                  }}>
                    {plan.exec_status === 'bought'       ? '🔵 Đã vào lệnh' :
                     plan.exec_status === 'holding'      ? '📦 Chờ bán (T+2)' :
                     plan.exec_status === 'partial_sold' ? '📤 Đã bán 1/2' :
                     '✅ Đóng lệnh'}
                  </span>
                </div>
                <div className="px-4 py-3 grid grid-cols-2 gap-3">
                  {plan.bought_price && (
                    <div className="rounded-xl p-2.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Giá mua</p>
                      <p className="text-sm font-bold font-mono text-blue-300">{plan.bought_price}</p>
                    </div>
                  )}
                  {plan.holding_since && (
                    <div className="rounded-xl p-2.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Về tài khoản (T+2)</p>
                      <p className="text-sm font-bold text-purple-300">
                        {new Date(plan.holding_since).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}
                  {plan.sold_half_price && plan.bought_price && (
                    <div className="rounded-xl p-2.5 text-center"
                      style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Bán 1/2</p>
                      <p className="text-sm font-bold font-mono text-teal-300">{plan.sold_half_price}</p>
                      <p className="text-[9px] text-teal-400/60">
                        {(((plan.sold_half_price - plan.bought_price) / plan.bought_price) * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {plan.sold_all_price && plan.bought_price && (
                    <div className="rounded-xl p-2.5 text-center"
                      style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                      <p className="text-[9px] mb-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Bán all</p>
                      <p className="text-sm font-bold font-mono text-rose-300">{plan.sold_all_price}</p>
                      <p className="text-[9px] text-rose-400/60">
                        {(((plan.sold_all_price - plan.bought_price) / plan.bought_price) * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. TREND/SIDEWAY MATRIX — Vietnam Trend Analyzer */}
            {(scores.trend !== null || scores.sideway !== null) && (
              <Section title="Trend Analyzer Matrix" icon={Waves}
                bg="rgba(245,158,11,0.04)"
                badge={
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                    VTA
                  </span>
                }>
                <div className="py-4 space-y-4">
                  {scores.trend !== null && (
                    <ScoreBar label="Trục Xu hướng (Trend Score)" score={scores.trend} color="#f59e0b" />
                  )}
                  {scores.sideway !== null && (
                    <ScoreBar label="Trục Dao động (Sideway Score)" score={scores.sideway} color="#818cf8" />
                  )}
                  {scores.matrix && (
                    <div className="rounded-xl px-3 py-2.5 mt-2"
                      style={{ background: `${matrixColor}0f`, border: `1px solid ${matrixColor}25` }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: `${matrixColor}70` }}>
                        Pipeline Validate
                      </p>
                      <p className="text-xs font-semibold leading-relaxed" style={{ color: matrixColor }}>
                        {scores.matrix}
                      </p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 4. CATALYST */}
            {plan.catalyst_note && (
              <Section title="Catalyst & Động lực tăng giá" icon={Lightbulb}>
                <p className="text-sm py-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {plan.catalyst_note}
                </p>
              </Section>
            )}

            {/* 5. CHART */}
            {plan.chart_image_url && (
              <div className="rounded-2xl overflow-hidden mb-3"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 py-2.5 flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Biểu đồ kỹ thuật
                  </h3>
                </div>
                <img src={plan.chart_image_url} alt={`Chart ${plan.ticker}`} className="w-full" />
              </div>
            )}

            {/* 6. PHÂN TÍCH CHI TIẾT (Analyst Note) — gated BRONZE */}
            {plan.analyst_note && (
              <div className="rounded-2xl overflow-hidden mb-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Phân tích Vietnam Trend Analyzer
                    </h3>
                  </div>
                  {!isBronze && (
                    <Lock className="w-3.5 h-3.5" style={{ color: 'rgba(245,158,11,0.4)' }} />
                  )}
                </div>
                <AnalystNote note={plan.analyst_note} isBronze={isBronze} />
              </div>
            )}

            {/* 7. HƯỚNG DẪN THỰC HIỆN */}
            <Section title="Kế hoạch thực thi" icon={Zap}>
              <div className="py-3 space-y-3">
                {[
                  {
                    n: '01', title: 'Chờ giá về vùng mua',
                    desc: `Đặt alert khi ${plan.ticker} giao dịch trong vùng ${plan.entry_zone || '—'}. Tuyệt đối không đuổi giá ngoài vùng entry.`,
                    color: '#00D16E',
                  },
                  {
                    n: '02', title: 'Giải ngân 10% NAV',
                    desc: `Phân bổ tối đa ${plan.capital_allocation_pct || 10}% tổng danh mục. Vào 50% khi chạm vùng, bổ sung 50% nếu volume xác nhận.`,
                    color: '#f59e0b',
                  },
                  {
                    n: '03', title: 'Đặt SL ngay khi mua',
                    desc: `Stop Loss tại ${plan.stop_loss || '—'}. Đóng cửa dưới SL → bán ngay, không giữ cảm xúc.`,
                    color: '#f87171',
                  },
                  {
                    n: '04', title: 'Chốt lời theo plan',
                    desc: `Take Profit tại ${plan.take_profit || '—'}. Chốt 50-70% vị thế, phần còn lại dùng trailing stop theo ${plan.timeframe || 'xu hướng'}.`,
                    color: '#818cf8',
                  },
                ].map(({ n, title, desc, color }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      {n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-none mb-0.5">{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Disclaimer */}
            <p className="text-center text-[10px] leading-relaxed pt-1 pb-4"
              style={{ color: 'rgba(255,255,255,0.12)' }}>
              ⚠️ Nội dung mang tính tham khảo từ hệ thống phân tích Vietnam Trend Analyzer của FinPeace.
              Không phải khuyến nghị đầu tư. Kết quả giao dịch phụ thuộc vào quyết định của nhà đầu tư.
            </p>

            {/* Khuyến nghị CTA Action */}
            {(() => {
              let khuyenNghiAction = 'Chờ tín hiệu';
              let btnColor = 'linear-gradient(135deg, #64748b, #475569)';
              
              if (plan.exec_status === 'bought' || plan.exec_status === 'holding') {
                khuyenNghiAction = 'Đang nắm giữ (Theo dõi chặt)';
                btnColor = 'linear-gradient(135deg, #3b82f6, #2563eb)';
              } else if (plan.exec_status === 'partial_sold') {
                khuyenNghiAction = 'Bán nốt 1/2';
                btnColor = 'linear-gradient(135deg, #f59e0b, #d97706)';
              } else if (plan.exec_status === 'closed') {
                khuyenNghiAction = 'Đã bán hết (Theo dõi)';
                btnColor = 'linear-gradient(135deg, #64748b, #475569)';
              } else if (signal && signal.signal_type === 'entry_now') {
                khuyenNghiAction = 'Mua';
                btnColor = 'linear-gradient(135deg, #00D16E, #048c4d)';
              } else if (signal && signal.signal_type === 'wait_pullback') {
                khuyenNghiAction = 'Chờ tín hiệu (Theo dõi)';
                btnColor = 'linear-gradient(135deg, #f59e0b, #d97706)';
              }

              const isBuyAction = signal && signal.signal_type === 'entry_now' && plan.exec_status === 'waiting_buy';
              const isLive = ['bought', 'holding', 'partial_sold'].includes(plan.exec_status || '');

              return (
                <div className="fixed bottom-0 left-0 right-0 p-4 md:px-0 md:relative z-20"
                  style={{
                    background: 'linear-gradient(to top, rgba(15,25,41,1) 50%, rgba(15,25,41,0) 100%)'
                  }}>
                  <div className="max-w-2xl mx-auto w-full space-y-2">
                    {isLive && (
                      <button
                        onClick={handleKillSwitch}
                        className="w-full py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-1.5 transition-all text-rose-400 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 active:scale-[0.98] shadow-lg text-xs uppercase tracking-wider"
                      >
                        <X className="w-4 h-4 text-rose-400 animate-pulse" />
                        Hủy toàn bộ lệnh tự động (Kill Switch)
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (isBuyAction) {
                          setShowExecutionPanel(true)
                        }
                      }}
                      className="w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:scale-[1.01] active:scale-[0.99]"
                      style={{ background: btnColor, color: 'white' }}
                    >
                      <span className="text-base tracking-wide uppercase">Hành động: {khuyenNghiAction}</span>
                    </button>
                  </div>
                </div>
              );
            })()}
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
