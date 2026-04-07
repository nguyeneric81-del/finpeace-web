'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, TrendingUp } from 'lucide-react'
import DealCard, { TradingPlan } from './DealCard'
import DealDetailModal from './DealDetailModal'

interface DealListSectionProps {
  deals: TradingPlan[]
  totalDeals: number
  lockedCount: number
  tier: 'FREE' | 'BRONZE'
  user: any
  credits: number
  onUnlockSuccess: (dealId: string, newCredits: number) => void
}

export default function DealListSection({ deals, totalDeals, lockedCount, tier, user, credits, onUnlockSuccess }: DealListSectionProps) {
  const isBronze = tier === 'BRONZE'
  const [selectedPlan, setSelectedPlan] = useState<TradingPlan | null>(null)

  useEffect(() => {
    if (selectedPlan) {
      const updatedPlan = deals.find(d => d.id === selectedPlan.id)
      if (updatedPlan && updatedPlan !== selectedPlan) {
        setSelectedPlan(updatedPlan)
      }
    }
  }, [deals, selectedPlan])

  return (
    <>
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
          <div className="text-right">
            <p className="text-xl font-black text-white">{totalDeals}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>deals active</p>
          </div>
        </div>

        {/* Deal cards */}
        <div className="space-y-3">
          {deals.map((plan, i) => (
            <DealCard
              key={plan.id}
              plan={plan}
              isBronze={isBronze}
              index={i}
              onTap={setSelectedPlan}
            />
          ))}

          {/* Additional text for large locked counts */}
          {!isBronze && lockedCount > 5 && (
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px dashed rgba(245,158,11,0.2)' }}>
              <p className="text-sm font-semibold text-amber-400/70">
                +{lockedCount - 5} deals khác đang chờ bạn
              </p>
            </div>
          )}
        </div>

      </section>

      {/* Deal Detail Modal */}
      <DealDetailModal
        plan={selectedPlan}
        isBronze={true} 
        user={user}
        credits={credits}
        onUnlockSuccess={onUnlockSuccess}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  )
}
