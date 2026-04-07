'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Crown, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import DealCard, { TradingPlan } from './DealCard'

interface DealListSectionProps {
  deals: TradingPlan[]
  totalDeals: number
  lockedCount: number
  tier: 'FREE' | 'BRONZE'
}

function LockedDealCard({ index }: { index: number }) {
  const tickers = ['VCB', 'FPT', 'MWG', 'SSI', 'HPG', 'MSN', 'VHM', 'ACB', 'STB', 'VNM']
  const fakeTicker = tickers[index % tickers.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[2px]" style={{ background: 'rgba(6,11,20,0.5)' }} />

      {/* Fake content (blurred) */}
      <div className="opacity-20 pointer-events-none select-none">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-black text-white">{fakeTicker}</span>
          <div className="h-5 w-16 rounded-full bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl p-2.5 h-14" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
        <div className="h-4 w-3/4 rounded bg-white/10 mb-2" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.1))',
            border: '1px solid rgba(245,158,11,0.25)',
          }}>
          <Lock className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-xs font-semibold text-amber-400/70">BRONZE để mở</p>
      </div>
    </motion.div>
  )
}

export default function DealListSection({ deals, totalDeals, lockedCount, tier }: DealListSectionProps) {
  const isBronze = tier === 'BRONZE'

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Trading Plans
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {isBronze
              ? `${deals.length} deals đang hoạt động`
              : `${deals.length} deals — còn ${lockedCount} deals bị khoá`}
          </p>
        </div>

        {/* Total deals counter */}
        <div className="text-right">
          <p className="text-xl font-black text-white">{totalDeals}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>deals active</p>
        </div>
      </div>

      {/* Deal cards */}
      <div className="space-y-3">
        {deals.map((plan, i) => (
          <DealCard key={plan.id} plan={plan} isBronze={isBronze} index={i} />
        ))}

        {/* Locked cards for FREE */}
        {!isBronze && lockedCount > 0 && (
          <>
            {Array.from({ length: Math.min(lockedCount, 3) }).map((_, i) => (
              <LockedDealCard key={`locked-${i}`} index={deals.length + i} />
            ))}

            {lockedCount > 3 && (
              <div className="rounded-2xl p-4 text-center"
                style={{
                  background: 'rgba(245,158,11,0.05)',
                  border: '1px dashed rgba(245,158,11,0.2)',
                }}>
                <p className="text-sm font-semibold text-amber-400/70">
                  +{lockedCount - 3} deals khác đang chờ bạn
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
