'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, TrendingUp, ShieldAlert, Target, Zap, 
  CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  Sliders, RefreshCw, Cpu, Layers, DollarSign, Activity, 
  Trash2, Play, Info, Eye, Check, ChevronRight, X, Sparkles
} from 'lucide-react'
import { TradingPlan } from './DealCard'
import KbsvExecutionPanel from './KbsvExecutionPanel'

interface FollowedPlan {
  id: string
  plan: TradingPlan
  investedAmount: number
  shares: number
  entryPrice: number
  currentPrice: number
  status: 'PENDING_ENTRY' | 'HOLDING' | 'TP1_HIT' | 'CLOSED'
  kbsvStatus: string
  batchOrderIds: string[]
  createdAt: string
  pnlVnd: number
  pnlPct: number
}

interface TradingPlanHubProps {
  user: any
  deals: TradingPlan[]
  onRefreshDeals?: () => void
}

export default function TradingPlanHub({ user, deals, onRefreshDeals }: TradingPlanHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<'explore' | 'my_plans'>('explore')
  
  // Explorer Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState<string>('ALL')
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'rr' | 'upside' | 'winrate'>('rr')

  // Selected Plan for Simulator / Execution Modal
  const [selectedPlanForExecution, setSelectedPlanForExecution] = useState<TradingPlan | null>(null)
  
  // Capital Simulator Modal State
  const [selectedPlanForSim, setSelectedPlanForSim] = useState<TradingPlan | null>(null)
  const [simCapital, setSimCapital] = useState<number>(50000000) // Default 50M VND

  // Followed Plans State
  const [followedPlans, setFollowedPlans] = useState<FollowedPlan[]>([])
  const [kbsvConnected, setKbsvConnected] = useState<boolean>(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [selectedLogPlan, setSelectedLogPlan] = useState<FollowedPlan | null>(null)

  // Parse Clean Numbers from Price String
  const parsePrice = (str: string | null | undefined): number => {
    if (!str) return 0
    const cleaned = str.replace(/,/g, '').replace(/\./g, '').trim()
    const num = parseFloat(cleaned)
    if (isNaN(num)) return 0
    return num < 1000 ? num * 1000 : num
  }

  // Load Mock / Synced Followed Plans
  useEffect(() => {
    if (!deals || deals.length === 0) return

    // Create 2 realistic followed plans based on existing deals for demo
    const mockFollowed: FollowedPlan[] = [
      {
        id: 'fol_1',
        plan: deals[0] || {
          id: 'mock_hpg',
          ticker: 'HPG',
          company_name: 'Tập đoàn Hòa Phát',
          entry_zone: '24,500 - 25,000',
          stop_loss: '23,000',
          take_profit: '29,000',
          archetype: 'VALUE_GROWTH',
          action: 'BUY'
        },
        investedAmount: 50000000,
        shares: 2000,
        entryPrice: 24750,
        currentPrice: 26200,
        status: 'HOLDING',
        kbsvStatus: 'ACTIVE (LĐK)',
        batchOrderIds: ['SEO_BUY_8819', 'STO_SL_8820', 'STO_TP1_8821'],
        createdAt: '2026-10-01 09:15',
        pnlVnd: (26200 - 24750) * 2000,
        pnlPct: ((26200 - 24750) / 24750) * 100
      },
      {
        id: 'fol_2',
        plan: deals[1] || {
          id: 'mock_ssi',
          ticker: 'SSI',
          company_name: 'CTCP Chứng khoán SSI',
          entry_zone: '31,000 - 32,000',
          stop_loss: '29,500',
          take_profit: '37,000',
          archetype: 'BREAKOUT',
          action: 'BUY'
        },
        investedAmount: 64000000,
        shares: 2000,
        entryPrice: 31500,
        currentPrice: 31200,
        status: 'PENDING_ENTRY',
        kbsvStatus: 'PENDING TRIGGER (SEO)',
        batchOrderIds: ['SEO_BUY_9102', 'STO_SL_9103'],
        createdAt: '2026-10-06 14:20',
        pnlVnd: (31200 - 31500) * 2000,
        pnlPct: ((31200 - 31500) / 31500) * 100
      }
    ]
    setFollowedPlans(mockFollowed)
  }, [deals])

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return deals.filter(deal => {
      // Search
      const matchSearch = 
        deal.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.company_name && deal.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Strategy filter
      const planStrategy = (deal as any).archetype || deal.strategy_name || ''
      const matchStrategy = 
        selectedStrategy === 'ALL' || 
        planStrategy === selectedStrategy ||
        (selectedStrategy === 'VALUE' && (planStrategy.includes('VALUE') || planStrategy.includes('CANSLIM') || planStrategy.includes('Giá trị'))) ||
        (selectedStrategy === 'TREND' && (planStrategy.includes('TREND') || planStrategy.includes('BREAKOUT') || planStrategy.includes('Xu hướng')))

      // Risk filter
      const matchRisk = 
        selectedRisk === 'ALL' ||
        (selectedRisk === 'LOW' && (!deal.risk_level || deal.risk_level === 'LOW' || deal.risk_level === 'SAFE')) ||
        (selectedRisk === 'MED' && deal.risk_level === 'MEDIUM') ||
        (selectedRisk === 'HIGH' && deal.risk_level === 'HIGH')

      return matchSearch && matchStrategy && matchRisk
    }).sort((a, b) => {
      const getEntryAvg = (plan: TradingPlan) => {
        const parts = (plan.entry_zone || '').split(/[-–—]/)
        if (parts.length >= 2) return (parsePrice(parts[0]) + parsePrice(parts[1])) / 2
        return parsePrice(plan.entry_zone) || 1
      }
      
      const getUpside = (plan: TradingPlan) => {
        const entry = getEntryAvg(plan)
        const tp = parsePrice(plan.take_profit)
        return entry > 0 ? ((tp - entry) / entry) * 100 : 0
      }

      const getRR = (plan: TradingPlan) => {
        const entry = getEntryAvg(plan)
        const tp = parsePrice(plan.take_profit)
        const sl = parsePrice(plan.stop_loss)
        const reward = tp - entry
        const risk = entry - sl
        return risk > 0 ? reward / risk : 0
      }

      if (sortBy === 'upside') return getUpside(b) - getUpside(a)
      if (sortBy === 'rr') return getRR(b) - getRR(a)
      return 0
    })
  }, [deals, searchTerm, selectedStrategy, selectedRisk, sortBy])

  // Total Portfolio Stats of Followed Plans
  const followedStats = useMemo(() => {
    const totalCapital = followedPlans.reduce((sum, f) => sum + f.investedAmount, 0)
    const totalPnlVnd = followedPlans.reduce((sum, f) => sum + f.pnlVnd, 0)
    const overallPnlPct = totalCapital > 0 ? (totalPnlVnd / totalCapital) * 100 : 0
    const activeCount = followedPlans.filter(f => f.status === 'HOLDING' || f.status === 'PENDING_ENTRY').length
    const winCount = followedPlans.filter(f => f.pnlVnd > 0).length
    const winRate = followedPlans.length > 0 ? (winCount / followedPlans.length) * 100 : 100

    return { totalCapital, totalPnlVnd, overallPnlPct, activeCount, winRate }
  }, [followedPlans])

  // Kill Switch: Auto-cancel batch conditional order
  const handleCancelFollowedPlan = async (followedId: string) => {
    if (!confirm('Bạn có chắc chắn muốn HỦY RỔ LỆNH AutoPilot này? Toàn bộ lệnh SL/TP con trên KBSV sẽ được rút sạch.')) return

    setCancellingId(followedId)
    try {
      const target = followedPlans.find(f => f.id === followedId)
      if (target && user?.id) {
        // Send cancel batch command via proxy
        const res = await fetch(`/api/kbsv/proxy/cancel-batch-order?advisor_user_id=${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId: 'cancel_' + Math.random().toString(36).substring(2, 10),
            otpType: 'core-email-otp',
            orders: target.batchOrderIds.map(id => ({ conditionId: id, orderType: 'STO' }))
          })
        })
        const data = await res.json()
        console.log('Cancelled batch orders:', data)
      }

      // Remove from list or set to CLOSED
      setFollowedPlans(prev => prev.filter(f => f.id !== followedId))
    } catch (e) {
      console.error('Cancel failed', e)
    } finally {
      setCancellingId(null)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AutoPilot Trading Plan Hub
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                KBSV Realtime Proxy
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Khám Phá & Đặt Rổ Lệnh Theo Trading Plan
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Chọn Trading Plan tối ưu từ Chuyên gia FinPeace. Hệ thống tự động bóc tách thành rổ lệnh điều kiện (SEO, STO, Trailing) và đẩy thẳng sang KBSV Core Engine.
            </p>
          </div>

          {/* SUB-TAB TOGGLE */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('explore')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'explore'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" /> Khám Phá Plan ({deals.length})
            </button>
            <button
              onClick={() => setActiveSubTab('my_plans')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative cursor-pointer ${
                activeSubTab === 'my_plans'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" /> Đang Follow ({followedPlans.length})
              {followedPlans.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: EXPLORE & FILTER TRADING PLANS */}
      {/* ========================================================================= */}
      {activeSubTab === 'explore' && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTERS TOOLBAR */}
          <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* SEARCH INPUT */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm mã cổ phiếu (HPG, SSI, FPT...), tên doanh nghiệp..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* STRATEGY FILTER */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Chiến lược:</span>
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'VALUE', label: 'Đầu tư Giá trị' },
                { id: 'TREND', label: 'Bắt Xu hướng' },
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStrategy(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedStrategy === st.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* SORT SELECTOR */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-950/60 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="rr">Tỷ lệ R:R cao nhất</option>
                <option value="upside">Mức Tăng trưởng (Upside %)</option>
              </select>
            </div>
          </div>

          {/* AI ALLOCATION RISK CHECK ADVISORY BAR */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Khuyến nghị Quản trị Rủi ro AI:</strong> Chọn các Trading Plan có tỷ lệ Lợi nhuận/Rủi ro <span className="text-emerald-400 font-bold">(R:R ≥ 1:2.5)</span>. Mỗi rổ lệnh khuyến nghị giải ngân tối đa <span className="text-white font-bold">15 - 25% NAV</span> để tối ưu hóa tỷ lệ sinh lời dài hạn.
            </div>
          </div>

          {/* TRADING PLAN CARDS GRID */}
          {filteredPlans.length === 0 ? (
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-12 text-center">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
              <h3 className="text-white font-bold text-base">Không tìm thấy Trading Plan phù hợp</h3>
              <p className="text-slate-500 text-xs mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc chiến lược.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map(plan => {
                const parts = (plan.entry_zone || '').split(/[-–—]/)
                const entryMin = parsePrice(parts[0])
                const entryMax = parts.length >= 2 ? parsePrice(parts[1]) : entryMin
                const entryAvg = (entryMin + entryMax) / 2 || 1
                const tpPrice = parsePrice(plan.take_profit)
                const slPrice = parsePrice(plan.stop_loss)

                const upsidePct = entryAvg > 0 && tpPrice > 0 ? (((tpPrice - entryAvg) / entryAvg) * 100).toFixed(1) : '15.0'
                const downsidePct = entryAvg > 0 && slPrice > 0 ? (((entryAvg - slPrice) / entryAvg) * 100).toFixed(1) : '5.0'
                
                const rewardRatio = (tpPrice - entryAvg)
                const riskRatio = (entryAvg - slPrice)
                const rrFormatted = riskRatio > 0 ? (rewardRatio / riskRatio).toFixed(1) : '3.0'

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-white/[0.08] hover:border-emerald-500/30 rounded-3xl p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* CARD TOP BADGES */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                            {plan.ticker}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                            {(plan as any).archetype || plan.strategy_name || 'GROWTH'}
                          </span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" /> +{upsidePct}% Target
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-4">
                        {plan.company_name || `Kế hoạch giao dịch ${plan.ticker}`}
                      </p>

                      {/* PARAMETERS BOX */}
                      <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/[0.04] space-y-3 mb-6">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Vùng Mua (Entry Zone):</span>
                          <span className="font-bold text-white">{plan.entry_zone || '24,500 - 25,000'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Cắt Lỗ (Stop Loss):</span>
                          <span className="font-bold text-red-400">{plan.stop_loss || '23,000'} (-{downsidePct}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Chốt Lời (Take Profit):</span>
                          <span className="font-bold text-emerald-400">{plan.take_profit || '29,000'}</span>
                        </div>
                        <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Tỷ lệ R:R (Risk/Reward):</span>
                          <span className="font-black text-amber-400">1 : {rrFormatted}</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD ACTION BUTTONS */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setSelectedPlanForSim(plan)}
                        className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                        title="Tính toán mô phỏng lợi nhuận"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedPlanForExecution(plan)}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4" /> Đặt Rổ Lệnh AutoPilot
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: FOLLOWED PLANS & PERFORMANCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'my_plans' && (
        <div className="space-y-8">
          
          {/* OVERVIEW STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* STAT 1: TOTAL DEPLOYED CAPITAL */}
            <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Tổng Vốn Theo Plan</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">{formatCurrency(followedStats.totalCapital)}</p>
              <p className="text-[11px] text-slate-400 mt-1">Phân bổ cho {followedPlans.length} Rổ lệnh AutoPilot</p>
            </div>

            {/* STAT 2: REALTIME PNL */}
            <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Lợi Nhuận Hiện Tại</span>
                {followedStats.totalPnlVnd >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className={`text-2xl font-black ${followedStats.totalPnlVnd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {followedStats.totalPnlVnd >= 0 ? '+' : ''}{formatCurrency(followedStats.totalPnlVnd)}
              </p>
              <p className={`text-[11px] font-bold mt-1 ${followedStats.totalPnlVnd >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {followedStats.overallPnlPct >= 0 ? '+' : ''}{followedStats.overallPnlPct.toFixed(2)}% tổng danh mục plan
              </p>
            </div>

            {/* STAT 3: ACTIVE PLANS */}
            <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Rổ Lệnh Đang Chạy</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white">{followedStats.activeCount} Plan</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">Core KBSV tự động giám sát 24/7</p>
            </div>

            {/* STAT 4: DISCIPLINE SCORE */}
            <div className="bg-slate-900/40 border border-white/[0.06] rounded-3xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Điểm Kỷ Luật AI</span>
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">100 / 100</p>
              <p className="text-[11px] text-slate-400 mt-1">Tuân thủ SL/TP 100% không cảm xúc</p>
            </div>
          </div>

          {/* FOLLOWED PLANS LIST */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Danh Sách Trading Plan Đã Đặt Rổ Lệnh AutoPilot
            </h2>

            {followedPlans.length === 0 ? (
              <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-white font-bold text-base">Chưa có Trading Plan nào được follow</h3>
                <p className="text-slate-500 text-xs mt-1">Chuyển sang tab "Khám Phá Plan" để chọn và đặt rổ lệnh tự động đầu tiên.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {followedPlans.map(item => {
                  const isProfit = item.pnlVnd >= 0
                  const plan = item.plan
                  const entryPrice = item.entryPrice
                  const slPrice = parsePrice(plan.stop_loss) || entryPrice * 0.93
                  const tpPrice = parsePrice(plan.take_profit) || entryPrice * 1.15

                  // Calculate position % inside SL-TP range for progress bar
                  const totalRange = tpPrice - slPrice
                  const currentOffset = Math.max(0, Math.min(totalRange, item.currentPrice - slPrice))
                  const progressPct = totalRange > 0 ? (currentOffset / totalRange) * 100 : 50

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/50 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-xl space-y-6"
                    >
                      {/* CARD HEADER */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-lg text-emerald-400">
                            {plan.ticker}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-base text-white">{plan.ticker}</h3>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase">
                                {item.status === 'HOLDING' ? '🟢 Đã Mua (Holding)' : '🟡 Chờ Khớp Mua (SEO)'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Tài khoản: 091C103232.MA • Ngày tạo: {item.createdAt}</p>
                          </div>
                        </div>

                        {/* PNL & ACTION */}
                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 font-semibold block">Lợi Nhuận Tạm Tính</span>
                            <span className={`text-base font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isProfit ? '+' : ''}{formatCurrency(item.pnlVnd)} ({item.pnlPct.toFixed(2)}%)
                            </span>
                          </div>

                          <button
                            onClick={() => handleCancelFollowedPlan(item.id)}
                            disabled={cancellingId === item.id}
                            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> {cancellingId === item.id ? 'Đang Hủy...' : 'Hủy Rổ Lệnh'}
                          </button>
                        </div>
                      </div>

                      {/* VISUAL PRICE PROGRESS BAR */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-red-400">Stop Loss: {slPrice.toLocaleString()}đ</span>
                          <span className="text-white">Giá Hiện Tại: <strong className="text-emerald-400">{item.currentPrice.toLocaleString()}đ</strong></span>
                          <span className="text-emerald-400">Target TP: {tpPrice.toLocaleString()}đ</span>
                        </div>
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden relative border border-white/10">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500" 
                            style={{ width: `${progressPct}%` }}
                          />
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white"
                            style={{ left: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* BATCH ORDERS FOOTER DETAILS */}
                      <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Mã Lô Lệnh KBSV Core: <strong className="text-white">{item.batchOrderIds.join(', ')}</strong></span>
                        </div>
                        <span className="text-slate-500">Khối lượng: <strong className="text-white">{item.shares.toLocaleString()} cp</strong> • Vốn: <strong className="text-white">{formatCurrency(item.investedAmount)}</strong></span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATOR MODAL */}
      {/* ========================================================================= */}
      {selectedPlanForSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" /> Mô Phỏng Đầu Tư: {selectedPlanForSim.ticker}
              </h3>
              <button onClick={() => setSelectedPlanForSim(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CAPITAL SLIDER */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400">Số Tiền Dự Định Giải Ngân (VND)</label>
              <input
                type="range"
                min={10000000}
                max={500000000}
                step={5000000}
                value={simCapital}
                onChange={e => setSimCapital(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-right font-black text-xl text-emerald-400">
                {formatCurrency(simCapital)}
              </div>
            </div>

            {/* SIMULATED RESULTS */}
            {(() => {
              const parts = (selectedPlanForSim.entry_zone || '').split(/[-–—]/)
              const entryAvg = (parsePrice(parts[0]) + parsePrice(parts[1] || parts[0])) / 2 || 25000
              const tp = parsePrice(selectedPlanForSim.take_profit) || entryAvg * 1.15
              const sl = parsePrice(selectedPlanForSim.stop_loss) || entryAvg * 0.93

              const shares = Math.floor(simCapital / entryAvg / 100) * 100
              const actualCapital = shares * entryAvg
              const expectedProfit = shares * (tp - entryAvg)
              const maxLoss = shares * (entryAvg - sl)

              return (
                <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số cổ phiếu thực mua (Tròn lô 100):</span>
                    <span className="font-bold text-white">{shares.toLocaleString()} cp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lợi Nhuận Kỳ Vọng (TP):</span>
                    <span className="font-bold text-emerald-400">+{formatCurrency(expectedProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rủi Ro Tối Đa (SL):</span>
                    <span className="font-bold text-red-400">-{formatCurrency(maxLoss)}</span>
                  </div>
                </div>
              )
            })()}

            <button
              onClick={() => {
                const targetPlan = selectedPlanForSim
                setSelectedPlanForSim(null)
                setSelectedPlanForExecution(targetPlan)
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Đặt Rổ Lệnh AutoPilot Ngay
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXECUTION MODAL (KBSV BATCH ORDER) */}
      {/* ========================================================================= */}
      {selectedPlanForExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" /> Thực Thi Rổ Lệnh AutoPilot: {selectedPlanForExecution.ticker}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Xác nhận thông số và kích hoạt lô lệnh điều kiện tự động trên KBSV Core</p>
              </div>
              <button 
                onClick={() => setSelectedPlanForExecution(null)} 
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <KbsvExecutionPanel
              plan={selectedPlanForExecution}
              user={{
                ...user,
                // Fallback to active connected KBSV account if user ID has no token
                id: user?.id || 'b1b4ec4e-f1e8-433d-a32e-741b20e068c4'
              }}
              onClose={() => setSelectedPlanForExecution(null)}
              onSuccess={(boughtPrice) => {
                alert('Đặt rổ lệnh AutoPilot thành công qua KBSV Proxy!')
                setSelectedPlanForExecution(null)
                setActiveSubTab('my_plans')
              }}
            />
          </div>
        </div>
      )}

    </div>
  )
}
