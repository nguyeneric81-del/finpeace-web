'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, RefreshCw, Zap, Shield, Sparkles, User as UserIcon } from 'lucide-react'
import TradingPlanHub from '../../stockpick/components/TradingPlanHub'
import { TradingPlan } from '../../stockpick/components/DealCard'

type StockPick2User = {
  id: string
  name: string
  email: string
  tier: 'FREE' | 'BRONZE' | 'SILVER'
  credits?: number
  role: string
}

export default function StockPick2Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<StockPick2User | null>(null)
  const [deals, setDeals] = useState<TradingPlan[]>([])
  const [loading, setLoading] = useState(true)

  // Auth Guard for StockPicks 2.0
  useEffect(() => {
    const stored = sessionStorage.getItem('stockpick2_user')
    if (!stored) {
      router.replace('/stockpick2/login')
      return
    }
    try {
      setUser(JSON.parse(stored))
    } catch {
      router.replace('/stockpick2/login')
    }
  }, [router])

  // Fetch deals for StockPicks 2.0
  const fetchDeals = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/stockpick/deals?tier=SILVER&userId=${userId}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setDeals(data.deals || [])
      }
    } catch (e) {
      console.error('Failed to fetch StockPicks 2.0 deals', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchDeals(user.id)
    }
  }, [user, fetchDeals])

  const handleLogout = () => {
    sessionStorage.removeItem('stockpick2_user')
    router.push('/stockpick2/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 font-sans pb-24 relative overflow-hidden">
      
      {/* HEADER NAVBAR FOR STOCKPICKS 2.0 */}
      <div className="bg-slate-900/80 border-b border-white/[0.08] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                StockPicks 2.0 <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">AUTOPILOT PORTAL</span>
              </h1>
              <p className="text-[11px] text-slate-400">Hệ thống Trading Plan & Đặt Rổ Lệnh KBSV Độc Lập</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{user.email}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 uppercase">
                {user.tier || 'SILVER'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Đăng xuất StockPicks 2.0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TRADING PLAN HUB CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TradingPlanHub user={user} deals={deals} onRefreshDeals={() => fetchDeals(user.id)} />
      </div>

    </div>
  )
}
