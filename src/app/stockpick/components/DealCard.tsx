'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Shield, Clock,
  ChevronDown, ChevronUp, Bell, CheckCircle, AlertCircle, Timer, Lock,
  Radar, KeyRound, Activity
} from 'lucide-react'

export interface TradingPlan {
  id: string
  ticker: string
  company_name: string
  strategy_name: string
  timeframe: string
  entry_zone: string
  stop_loss: string
  take_profit: string
  risk_reward: string
  sector: string
  risk_level: string
  conviction_level: string
  analyst_note: string
  catalyst_note: string
  is_confirmed: boolean
  expected_holding_days: number
  capital_allocation_pct: number
  chart_image_url: string
  signal?: {
    current_price: string
    signal_type: string
    signal_label: string
    signal_detail: string
  } | null
  is_locked?: boolean
  is_unlocked_by_credit?: boolean
  // Execution lifecycle
  exec_status?: 'waiting_buy' | 'bought' | 'holding' | 'partial_sold' | 'closed'
  bought_price?: number | null
  holding_since?: string | null
  sold_half_price?: number | null
  sold_all_price?: number | null
}

interface DealCardProps {
  plan: TradingPlan
  isBronze: boolean
  index: number
  onTap?: (plan: TradingPlan) => void
}

const SIGNAL_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  entry_now:      { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  icon: CheckCircle },
  wait_pullback:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Timer },
  above_entry:    { color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: AlertCircle },
  take_profit:    { color: '#818cf8', bg: 'rgba(129,140,248,0.1)', icon: Target },
}

// Convert raw price string → thousands-VND display (e.g. "12,200" → "12.2", "35.60" → "35.6")
function normalizePrice(raw: string | null | undefined): string {
  if (!raw) return '—'
  const cleaned = raw.replace(/,/g, '').replace(/[–—]/g, '-')
  const match = cleaned.match(/\d+(\.\d+)?/)
  if (!match) return '—'
  let num = parseFloat(match[0])
  if (num > 500) num = num / 1000   // full VND → thousands VND
  return String(parseFloat(num.toFixed(2)))
}

function extractRRNumber(rr: string): number {
  const match = rr.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}


export default function DealCard({ plan, isBronze, index, onTap }: DealCardProps) {
  const [expanded, setExpanded] = useState(false)
  const rrNum = extractRRNumber(plan.risk_reward || '0')
  const signal = plan.signal
  const sigConfig = signal ? (SIGNAL_CONFIG[signal.signal_type] || SIGNAL_CONFIG['wait_pullback']) : null
  const SigIcon = sigConfig?.icon || Timer

  const isLive = ['bought', 'holding', 'partial_sold'].includes(plan.exec_status || '')

  // P&L calculation for live trades — both in same unit (ngàn VND)
  const currentPrice = signal ? parseFloat(signal.current_price) : null
  const boughtPrice = plan.bought_price ?? null
  const pnlPct = (isLive && currentPrice && boughtPrice)
    ? ((currentPrice - boughtPrice) / boughtPrice * 100)
    : null
  const pnlColor = pnlPct === null ? '#94a3b8' : pnlPct >= 0 ? '#34d399' : '#f87171'

  // Exec status human label (replaces signal_label)
  const EXEC_LABEL: Record<string, string> = {
    waiting_buy:  'Chờ vào lệnh',
    bought:       'Đang chạy',
    holding:      'Đang chạy',
    partial_sold: 'Đã bán 1/2',
    closed:       'Đã bán hết',
  }
  const execLabel = plan.exec_status ? EXEC_LABEL[plan.exec_status] : null

  const convictionColor =
    plan.conviction_level?.includes('Cao') ? '#34d399' :
    plan.conviction_level?.includes('Trung bình - Khá') ? '#f59e0b' :
    '#94a3b8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onTap?.(plan)}
      className="rounded-[24px] overflow-hidden"
      style={{
        background: isLive ? 'rgba(10,28,20,0.8)' : 'rgba(30,30,30,0.6)',
        backdropFilter: 'blur(16px)',
        border: isLive
          ? '1px solid rgba(52,211,153,0.45)'
          : plan.is_confirmed
            ? '1px solid rgba(0,209,110,0.2)'
            : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isLive
          ? '0 0 32px rgba(52,211,153,0.15), inset 0 1px 0 rgba(52,211,153,0.1)'
          : plan.is_confirmed
            ? '0 0 40px rgba(5,255,150,0.2)'
            : 'none',
        cursor: onTap ? 'pointer' : 'default',
      }}
    >
      {/* Top accent line */}
      {isLive ? (
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#34d399] to-transparent" />
      ) : plan.is_confirmed ? (
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00D16E] to-transparent" />
      ) : null}

      {/* Main card content */}
      <div className="p-4">
        {/* Top row: Ticker + Signal */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl font-bold font-mono tracking-tight text-[#00D16E]">
                {plan.ticker}
              </span>
              {plan.exec_status && plan.exec_status !== 'waiting_buy' && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{
                  background:
                    ['bought','holding'].includes(plan.exec_status) ? 'rgba(52,211,153,0.15)' :
                    plan.exec_status === 'partial_sold'             ? 'rgba(129,140,248,0.15)' :
                    'rgba(107,114,128,0.15)',
                  color:
                    ['bought','holding'].includes(plan.exec_status) ? '#34d399' :
                    plan.exec_status === 'partial_sold'             ? '#818cf8' :
                    '#9ca3af',
                }}>
                  {['bought','holding'].includes(plan.exec_status) ? 'Đang chạy' :
                   plan.exec_status === 'partial_sold'             ? 'Đã bán 1/2' :
                   'Đã bán hết'}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed truncate max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {plan.company_name} • {plan.sector?.split(' ')[0] || 'Cổ phiếu'}
            </p>
          </div>

          {/* Current signal badge */}
          {plan.is_locked ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ml-2 shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              <Lock className="w-3 h-3" />
              <span>LOCKED</span>
            </div>
          ) : signal && sigConfig && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ml-2 shrink-0 font-mono"
              style={{ background: sigConfig.bg, border: `1px solid ${sigConfig.color}30`, color: sigConfig.color }}>
              <SigIcon className="w-3 h-3" />
              <span>{signal.current_price}</span>
            </div>
          )}
        </div>

        {/* Exec status / signal label */}
        {!plan.is_locked && (
          <div className="mb-3 text-xs font-medium" style={{
            color: isLive ? '#34d399' : (sigConfig?.color || '#94a3b8')
          }}>
            {execLabel || signal?.signal_label}
          </div>
        )}

        {/* Unlocked by credit badge */}
        {plan.is_unlocked_by_credit && (
          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-lg w-fit"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}>
            <KeyRound className="w-3 h-3" style={{ color: '#f59e0b' }} />
            <span className="text-[10px] font-bold tracking-wider" style={{ color: '#f59e0b' }}>ĐÃ MỞ KHOÁ</span>
          </div>
        )}


        {/* Live trade P&L banner */}
        {isLive && (
          <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3" style={{ color: '#34d399' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#34d399' }}>Live</span>
              {boughtPrice && (
                <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  @ {boughtPrice.toLocaleString('vi-VN')}
                </span>
              )}
            </div>
            {pnlPct !== null && (
              <span className="text-sm font-bold font-mono" style={{ color: pnlColor }}>
                {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
              </span>
            )}
          </div>
        )}

        {/* Key metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 relative">
          {plan.is_locked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
              style={{ background: 'rgba(6,11,20,0.6)', backdropFilter: 'blur(3px)' }}>
              <p className="text-xs font-bold text-amber-400">
                {isBronze ? 'Dùng 1 Credit để xem' : 'BRONZE để xem'}
              </p>
            </div>
          )}
          {[
          { label: 'ENTRY',       value: normalizePrice(plan.entry_zone),  color: '#00D16E' },
            { label: 'STOP LOSS',   value: normalizePrice(plan.stop_loss),   color: '#ff4d4d' },
            { label: 'TAKE PROFIT', value: normalizePrice(plan.take_profit), color: '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[9px] font-semibold mb-1 uppercase tracking-widest text-white/50">{label}</p>
              <p className="text-sm font-medium font-mono" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* R:R + Timeframe row */}
        <div className={`flex items-center gap-2 mb-3 ${plan.is_locked ? 'opacity-20' : ''}`}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono"
            style={{
              background: rrNum >= 2 ? 'rgba(0,209,110,0.1)' : 'rgba(245,158,11,0.08)',
              color: rrNum >= 2 ? '#00D16E' : '#f59e0b',
            }}>
            <Shield className="w-3 h-3" />
            R:R {plan.risk_reward}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)' }}>
            <Clock className="w-3 h-3" />
            {plan.expected_holding_days}N
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: convictionColor,
            }}>
            {plan.conviction_level?.split(' - ')[0] || 'Trung bình'}
          </div>
        </div>

        {/* Catalyst Note (Insight text) */}
        {plan.catalyst_note && !plan.is_locked && (
          <div className="relative mb-3 pl-3 py-1 text-xs italic leading-relaxed"
            style={{
              color: '#00D16E', borderLeft: '2px solid rgba(0,209,110,0.5)', background: 'linear-gradient(90deg, rgba(0,209,110,0.05), transparent)'
            }}>
            "{plan.catalyst_note}"
          </div>
        )}

        {/* Expand button + BRONZE detail */}
        <div className="flex items-center gap-2">
          {isBronze && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: expanded ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${expanded ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                color: expanded ? '#f59e0b' : 'rgba(255,255,255,0.45)',
              }}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Thu gọn' : 'Xem phân tích chi tiết'}
            </button>
          )}

          {isBronze && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.15))',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b',
              }}
            >
              <Bell className="w-3.5 h-3.5" />
              Follow
            </button>
          )}
        </div>

        {/* BRONZE detail expansion */}
        <AnimatePresence>
          {expanded && isBronze && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                {/* Chart image */}
                {plan.chart_image_url && (
                  <div className="rounded-xl overflow-hidden">
                    <img src={plan.chart_image_url} alt={`Chart ${plan.ticker}`}
                      className="w-full object-cover"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}

                {/* Signal detail */}
                {signal?.signal_detail && (
                  <div className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                    style={{
                      background: sigConfig ? `${sigConfig.bg}` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${sigConfig?.color || '#ffffff'}20`,
                      color: 'rgba(255,255,255,0.6)',
                    }}>
                    {signal.signal_detail}
                  </div>
                )}

                {/* Analyst note (first 300 chars) */}
                {plan.analyst_note && (
                  <div className="rounded-xl px-3 py-3 text-xs leading-relaxed whitespace-pre-line"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                    {plan.analyst_note.replace(/\*\*/g, '').slice(0, 400)}
                    {plan.analyst_note.length > 400 && '...'}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap hint */}
        {onTap && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {!isBronze && <><Shield className="w-3 h-3" /><span>Tap để {plan.is_locked ? 'mở khoá' : 'xem chi tiết'} deal</span></>}
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}>
              {plan.is_locked ? <><Lock className="w-2.5 h-2.5"/> Mở khoá</> : 'Xem chi tiết →'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
