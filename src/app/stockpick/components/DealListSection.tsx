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
          {/* Additional text for large locked counts with heavy curiosity blur */}
          {!isBronze && lockedCount > 5 && (
            <div className="relative rounded-2xl h-32 overflow-hidden flex flex-col items-center justify-center border border-white/5 bg-[#1A1A1A]/30">
               {/* Base fake UI (blurred heavily) */}
               <div className="absolute inset-0 opacity-20 blur-md pointer-events-none p-4 flex flex-col gap-2">
                 <div className="h-4 bg-white/20 w-1/3 rounded"></div>
                 <div className="h-10 bg-white/10 w-full rounded"></div>
                 <div className="flex gap-2"><div className="h-4 w-1/4 bg-white/10"></div><div className="h-4 w-1/4 bg-white/10"></div></div>
               </div>

               {/* Lock message overlay */}
               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg">
                   <Lock className="w-5 h-5 text-white/70" />
                 </div>
                 <div className="text-center">
                   <p className="text-sm font-bold text-white tracking-wide">+{lockedCount - 5} DEALS ĐANG CHỜ</p>
                   <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">Nâng cấp để mở rộng quỹ đạo thấu thị</p>
                 </div>
               </div>
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
