'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, RefreshCw, LayoutGrid, BookOpen, Zap } from 'lucide-react'
import StockPickHeader from '../components/StockPickHeader'
import DealListSection from '../components/DealListSection'
import MarketPulse from '../components/MarketPulse'
import OnboardingBanner from '../components/OnboardingBanner'
import UpgradeCTA from '../components/UpgradeCTA'
import { TradingPlan } from '../components/DealCard'

type StockPickUser = {
  id: string
  name: string
  email: string
  tier: 'FREE' | 'BRONZE'
  role: string
}

type Tab = 'deals' | 'learn' | 'pulse'

export default function StockPickDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<StockPickUser | null>(null)
  const [deals, setDeals] = useState<TradingPlan[]>([])
  const [totalDeals, setTotalDeals] = useState(0)
  const [lockedCount, setLockedCount] = useState(0)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('deals')

  // Auth guard
  useEffect(() => {
    const stored = sessionStorage.getItem('stockpick_user')
    if (!stored) {
      router.replace('/stockpick/login')
      return
    }
    try {
      setUser(JSON.parse(stored))
    } catch {
      router.replace('/stockpick/login')
    }
  }, [router])

  // Fetch deals
  const fetchDeals = useCallback(async (tier: 'FREE' | 'BRONZE') => {
    try {
      const res = await fetch(`/api/stockpick/deals?tier=${tier}&userId=${user?.id || ''}`)
      if (res.ok) {
        const data = await res.json()
        setDeals(data.deals || [])
        setTotalDeals(data.totalDeals || 0)
        setLockedCount(data.lockedCount || 0)
        if (data.credits !== undefined) setCredits(data.credits)
      }
    } catch (e) {
      console.error('Failed to fetch deals', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchDeals(user.tier)
    }
  }, [user, fetchDeals])

  const handleRefresh = () => {
    if (!user || refreshing) return
    setRefreshing(true)
    fetchDeals(user.tier)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('stockpick_user')
    router.push('/stockpick/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'deals', label: 'Deals', icon: LayoutGrid },
    { id: 'learn', label: 'Học', icon: BookOpen },
    { id: 'pulse', label: 'Pulse', icon: Zap },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: '#060b14' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full opacity-[0.06] blur-[80px]"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full opacity-[0.04] blur-[60px]"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
      </div>

      {/* Header */}
      <StockPickHeader
        user={user}
        totalDeals={totalDeals}
        lockedCount={lockedCount}
        credits={credits}
      />

      {/* Tab bar */}
      <div className="sticky top-[72px] z-30 px-4"
        style={{
          background: 'rgba(6,11,20,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
        <div className="max-w-lg mx-auto flex gap-1 py-2">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            // Lock pulse tab for FREE
            const isLocked = tab.id === 'pulse' && user.tier === 'FREE'
            return (
              <button
                key={tab.id}
                id={`stockpick-tab-${tab.id}`}
                onClick={() => !isLocked && setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                  color: isActive ? '#f59e0b' : isLocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)',
                  border: isActive ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {isLocked && <span className="text-[8px] opacity-50">🔒</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 pt-5 relative z-10">

        {/* Refresh button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Cập nhật'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* DEALS TAB */}
          {activeTab === 'deals' && (
            <motion.div
              key="deals"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Upgrade CTA for FREE */}
              {user.tier === 'FREE' && lockedCount > 0 && (
                <UpgradeCTA currentTier={user.tier} lockedCount={lockedCount} />
              )}

              {/* Deal list */}
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="rounded-2xl h-40 animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.03)' }} />
                  ))}
                </div>
              ) : (
                <DealListSection
                  deals={deals}
                  totalDeals={totalDeals}
                  lockedCount={lockedCount}
                  tier={user.tier}
                  user={user}
                  credits={credits}
                  onUnlockSuccess={(dealId, newCredits) => {
                    setCredits(newCredits);
                    fetchDeals(user.tier);
                  }}
                />
              )}

              {/* Bronze upgrade CTA shown below for FREE (if many locked) */}
              {user.tier === 'FREE' && (
                <UpgradeCTA currentTier={user.tier} lockedCount={lockedCount} />
              )}
            </motion.div>
          )}

          {/* LEARN TAB */}
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              <OnboardingBanner completedCount={0} />
            </motion.div>
          )}

          {/* PULSE TAB (BRONZE only) */}
          {activeTab === 'pulse' && (
            <motion.div
              key="pulse"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              <MarketPulse tier={user.tier} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-bottom">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl px-6 py-4 flex items-center justify-between"
            style={{
              background: 'rgba(10,15,30,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
              marginBottom: '8px',
            }}>
            {/* User info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{
                  background: user.tier === 'BRONZE'
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'rgba(255,255,255,0.1)',
                }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {user.tier} Member
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              id="stockpick-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
