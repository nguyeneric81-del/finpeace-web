'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Search, X, Flame, BarChart2 } from 'lucide-react'
import DealCard, { TradingPlan } from './DealCard'
import DealDetailModal from './DealDetailModal'

interface DealListSectionProps {
  deals: TradingPlan[]
  totalDeals: number
  lockedCount: number
  tier: 'FREE' | 'BRONZE' | 'SILVER'
  user: any
  credits: number
  onUnlockSuccess: (dealId: string, newCredits: number) => void
}

type StatusFilter = 'all' | 'waiting_buy' | 'active' | 'partial_sold' | 'closed'

const STATUS_TABS: { key: StatusFilter; label: string; statuses: string[]; color: string; dot?: boolean }[] = [
  { key: 'all',          label: 'Tất cả',       statuses: [],                                    color: '#e2e8f0' },
  { key: 'waiting_buy',  label: 'Chờ vào lệnh', statuses: ['waiting_buy'],                       color: '#f59e0b' },
  { key: 'active',       label: 'Đang chạy',     statuses: ['bought', 'holding'],                 color: '#34d399', dot: true },
  { key: 'partial_sold', label: 'Đã bán 1/2',     statuses: ['partial_sold'],                      color: '#818cf8' },
  { key: 'closed',       label: 'Đã bán hết',    statuses: ['closed'],                            color: '#94a3b8' },
]

const LIVE_STATUSES = ['bought', 'holding', 'partial_sold']

function DealGroup({ deals, isBronze, onTap }: {
  deals: TradingPlan[]
  isBronze: boolean
  onTap: (plan: TradingPlan) => void
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {deals.map((plan, i) => (
          <motion.div
            key={plan.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
          >
            <DealCard plan={plan} isBronze={isBronze} index={i} onTap={onTap} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function DealListSection({ deals, totalDeals, lockedCount, tier, user, credits, onUnlockSuccess }: DealListSectionProps) {
  const isBronze = tier === 'BRONZE'
  const [selectedPlan, setSelectedPlan] = useState<TradingPlan | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    if (selectedPlan) {
      const updatedPlan = deals.find(d => d.id === selectedPlan.id)
      if (updatedPlan && updatedPlan !== selectedPlan) setSelectedPlan(updatedPlan)
    }
  }, [deals, selectedPlan])

  // Count per status tab (on full unfiltered deals)



  // Apply status filter
  const tab = STATUS_TABS.find(t => t.key === activeFilter)!
  const statusFiltered = activeFilter === 'all'
    ? deals
    : deals.filter(d => tab.statuses.includes(d.exec_status || 'waiting_buy'))

  // Apply search filter on top
  const filteredDeals = searchQuery.trim()
    ? statusFiltered.filter(d => d.ticker?.toUpperCase().includes(searchQuery.trim().toUpperCase()))
    : statusFiltered

  // Section grouping only for "Tất cả"
  const liveDeals = filteredDeals.filter(d => LIVE_STATUSES.includes(d.exec_status || ''))
  let planDeals = filteredDeals.filter(d => !LIVE_STATUSES.includes(d.exec_status || ''))

  if (!searchQuery && activeFilter === 'all') {
    const unlockedPlans = planDeals.filter(d => !d.is_locked)
    const lockedPlans = planDeals.filter(d => d.is_locked)
    planDeals = [...unlockedPlans, ...lockedPlans.slice(0, 5)]
  }

  const isEmpty = filteredDeals.length === 0

  return (
    <>
      <section>

        {/* ── STATUS FILTER TABS ── */}
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-1">
            {STATUS_TABS.map(t => {
              const isActive = activeFilter === t.key
              // Count only unlocked deals per status
              const count = t.key === 'all'
                ? deals.filter(d => !d.is_locked).length
                : deals.filter(d => !d.is_locked && t.statuses.includes(d.exec_status || 'waiting_buy')).length
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveFilter(t.key)}
                  className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl transition-all"
                  style={{
                    background: isActive ? `${t.color}18` : 'rgba(255,255,255,0.04)',
                    border: isActive ? `1px solid ${t.color}45` : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {t.dot && isActive && (
                    <span className="relative flex h-1.5 w-1.5 mb-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: t.color }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ background: t.color }} />
                    </span>
                  )}
                  <span className="text-[11px] font-bold leading-none"
                    style={{ color: isActive ? t.color : 'rgba(255,255,255,0.35)' }}>
                    {count}
                  </span>
                  <span className="text-[9px] leading-tight text-center font-medium"
                    style={{ color: isActive ? t.color : 'rgba(255,255,255,0.25)' }}>
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>


        {/* ── SEARCH BAR ── */}
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

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <Search className="w-5 h-5" style={{ color: 'rgba(245,158,11,0.5)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/60">
                {searchQuery ? 'Không tìm thấy' : 'Chưa có deal nào'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {searchQuery
                  ? `Không có deal khớp với "${searchQuery.toUpperCase()}"`
                  : `Chưa có deal nào ở trạng thái "${tab.label}"`}
              </p>
            </div>
          </div>
        )}

        {/* ── DEAL CARDS ── */}
        {!isEmpty && (
          <>
            {activeFilter === 'all' ? (
              // Section grouping only in "Tất cả" view
              <>
                {liveDeals.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#34d399]" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34d399]" />
                      </span>
                      <Flame className="w-3 h-3 text-[#34d399]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#34d399]">Đang Chạy</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#34d39915] text-[#34d399] font-bold">{liveDeals.length}</span>
                      <div className="flex-1 h-px bg-[#34d39920]" />
                    </div>
                    <DealGroup deals={liveDeals} isBronze={isBronze} onTap={setSelectedPlan} />
                  </div>
                )}
                {planDeals.length > 0 && (
                  <div>
                    {liveDeals.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart2 className="w-3 h-3 text-[#94a3b8]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Chờ vào lệnh</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#94a3b815] text-[#94a3b8] font-bold">{planDeals.length}</span>
                        <div className="flex-1 h-px bg-[#94a3b820]" />
                      </div>
                    )}
                    <DealGroup deals={planDeals} isBronze={isBronze} onTap={setSelectedPlan} />

                    {/* Locked overflow */}
                    {!searchQuery && lockedCount > 5 && (
                      <div className="mt-3 relative rounded-[24px] h-32 overflow-hidden flex flex-col items-center justify-center border border-white/5 bg-[#1A1A1A]/30">
                        <div className="absolute inset-0 opacity-20 pointer-events-none p-4 flex flex-col gap-2" style={{ filter: 'blur(20px)' }}>
                          <div className="h-4 bg-white/20 w-1/3 rounded"></div>
                          <div className="h-10 bg-white/10 w-full rounded"></div>
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10"
                            style={{ backdropFilter: 'blur(20px)' }}>
                            <Lock className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-white">+{lockedCount - 5} DEALS ĐANG CHỜ</p>
                            <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-widest">
                              {isBronze ? 'Tìm kiếm mã để xem thêm' : 'Nâng cấp để mở khoá'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Flat list for specific filter
              <DealGroup deals={filteredDeals} isBronze={isBronze} onTap={setSelectedPlan} />
            )}
          </>
        )}

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
