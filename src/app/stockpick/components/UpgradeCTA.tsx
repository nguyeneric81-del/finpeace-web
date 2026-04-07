'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, ArrowRight, Zap, Bell, TrendingUp, Sparkles } from 'lucide-react'

interface UpgradeCTAProps {
  currentTier: 'FREE' | 'BRONZE'
  lockedCount: number
}

const BRONZE_FEATURES = [
  { icon: TrendingUp, text: '10 trading plans mỗi tháng' },
  { icon: Bell, text: 'Alert realtime entry/exit qua Zalo' },
  { icon: Sparkles, text: 'Phân tích AI chi tiết cho từng deal' },
  { icon: Zap, text: 'Daily Market Pulse AI hàng ngày' },
]

export default function UpgradeCTA({ currentTier, lockedCount }: UpgradeCTAProps) {
  if (currentTier === 'BRONZE') return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(180,83,9,0.08), rgba(6,11,20,0.8))',
        border: '1px solid rgba(245,158,11,0.25)',
        boxShadow: '0 8px 32px rgba(245,158,11,0.08)',
      }}
    >
      {/* Glow orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30 blur-[40px]"
        style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(180,83,9,0.15))',
              border: '1px solid rgba(245,158,11,0.3)',
            }}>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Nâng lên BRONZE</p>
            <p className="text-xs" style={{ color: 'rgba(245,158,11,0.6)' }}>295,000đ / tháng</p>
          </div>
        </div>

        {/* FOMO hook */}
        {lockedCount > 0 && (
          <div className="rounded-xl px-3 py-2.5 mb-4 text-center"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-sm font-bold text-rose-400">
              🔒 {lockedCount} deal đang bị khoá với bạn
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Members BRONZE đang xem đủ {10 + lockedCount} trading plans
            </p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-2.5 mb-5">
          {BRONZE_FEATURES.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(245,158,11,0.15)' }}>
                <Check className="w-3 h-3 text-amber-400" />
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{text}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.a
          href="https://finpeace.cloud/stockpick-bronze"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
          }}
        >
          Mở khoá BRONZE ngay
          <ArrowRight className="w-4 h-4" />
        </motion.a>

        <p className="text-center text-[10px] mt-2.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Liên hệ Agent của bạn để kích hoạt gói
        </p>
      </div>
    </motion.section>
  )
}
