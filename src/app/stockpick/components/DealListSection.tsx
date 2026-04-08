'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, TrendingUp, Search, X } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (selectedPlan) {
      const updatedPlan = deals.find(d => d.id === selectedPlan.id)
      if (updatedPlan && updatedPlan !== selectedPlan) {
        setSelectedPlan(updatedPlan)
      }
    }
  }, [deals, selectedPlan])

  // Client-side filter by ticker
  const filteredDeals = searchQuery.trim()
    ? deals.filter(d => d.ticker?.toUpperCase().includes(searchQuery.trim().toUpperCase()))
    : deals

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
              {searchQuery
                ? `${filteredDeals.length} kết quả cho "${searchQuery.toUpperCase()}"`
                : isBronze
                  ? `${deals.length} deals đang hoạt động`
                  : `${deals.length} deals — còn ${lockedCount} deals bị khoá`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-white">{totalDeals}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>deals active</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: searchQuery ? '#f59e0b' : 'rgba(255,255,255,0.25)' }}
          />
          <input
            id="stockpick-search-ticker"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm mã CP... (VD: BVB, HPG)"
            maxLength={10}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
            style={{
              background: searchQuery ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.04)',
              border: searchQuery ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.8)',
              caretColor: '#f59e0b',
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <X className="w-2.5 h-2.5" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Deal cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <DealCard
                    plan={plan}
                    isBronze={isBronze}
                    index={i}
                    onTap={setSelectedPlan}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
                  <Search className="w-5 h-5" style={{ color: 'rgba(245,158,11,0.5)' }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white/60">Không tìm thấy</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Không có deal nào khớp với "{searchQuery.toUpperCase()}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Additional locked count blur card (only when not searching) */}
          {!searchQuery && !isBronze && lockedCount > 5 && (
            <div className="relative rounded-[24px] h-32 overflow-hidden flex flex-col items-center justify-center border border-white/5 bg-[#1A1A1A]/30">
               <div className="absolute inset-0 opacity-20 pointer-events-none p-4 flex flex-col gap-2" style={{ filter: 'blur(20px)' }}>
                 <div className="h-4 bg-white/20 w-1/3 rounded"></div>
                 <div className="h-10 bg-white/10 w-full rounded"></div>
                 <div className="flex gap-2"><div className="h-4 w-1/4 bg-white/10"></div><div className="h-4 w-1/4 bg-white/10"></div></div>
               </div>
               <div className="relative z-10 flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
                   style={{ backdropFilter: 'blur(20px)' }}>
                   <Lock className="w-5 h-5 text-amber-400" />
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
