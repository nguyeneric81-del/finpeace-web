'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Shield, Clock,
  ChevronDown, ChevronUp, Bell, CheckCircle, AlertCircle, Timer
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
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: plan.is_confirmed ? '0 0 24px rgba(245,158,11,0.06)' : 'none',
        cursor: onTap ? 'pointer' : 'default',
      }}
    >
      {/* Confirmed ribbon */}
      {plan.is_confirmed && (
        <div className="px-4 py-1.5 flex items-center gap-1.5 text-xs font-semibold"
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.04))',
            borderBottom: '1px solid rgba(245,158,11,0.15)',
            color: '#f59e0b',
          }}
        >
          <CheckCircle className="w-3 h-3" />
          FinPeace đã xác nhận deal này
        </div>
      )}

      {/* Main card content */}
      <div className="p-4">
        {/* Top row: Ticker + Signal */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black text-white tracking-tight">{plan.ticker}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {plan.sector?.split(' ')[0] || 'Cổ phiếu'}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {plan.company_name}
            </p>
          </div>

          {/* Current signal badge */}
          {signal && sigConfig && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ml-2 shrink-0"
              style={{ background: sigConfig.bg, border: `1px solid ${sigConfig.color}30`, color: sigConfig.color }}>
              <SigIcon className="w-3 h-3" />
              <span>{signal.current_price}</span>
            </div>
          )}
        </div>

        {/* Signal label */}
        {signal && (
          <div className="mb-3 text-xs font-medium" style={{ color: sigConfig?.color || '#94a3b8' }}>
            {signal.signal_label}
          </div>
        )}

        {/* Key metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Vùng mua', value: plan.entry_zone?.split(' ')[0] || '—', color: '#34d399', icon: TrendingUp },
            { label: 'Cắt lỗ', value: plan.stop_loss?.split(' ')[0] || '—', color: '#f87171', icon: TrendingDown },
            { label: 'Chốt lời', value: plan.take_profit?.split(' ')[0] || '—', color: '#818cf8', icon: Target },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon className="w-3 h-3 mx-auto mb-1" style={{ color }} />
              <p className="text-[10px] mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              <p className="text-xs font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* R:R + Timeframe row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{
              background: rrNum >= 2 ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.08)',
              color: rrNum >= 2 ? '#34d399' : '#f59e0b',
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

        {/* Catalyst note */}
        {plan.catalyst_note && (
          <div className="rounded-xl px-3 py-2.5 mb-3 text-xs leading-relaxed"
            style={{
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.12)',
              color: 'rgba(255,255,255,0.55)',
            }}>
            <span className="text-amber-400/60 font-semibold">💡 Catalyst: </span>
            {plan.catalyst_note}
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
                    <p className="text-white/40 font-semibold mb-1.5 text-[10px] uppercase tracking-widest">Phân tích AI</p>
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
              {!isBronze && <><Shield className="w-3 h-3" /><span>Tap để xem chi tiết deal</span></>}
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}>
              Xem chi tiết →
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
