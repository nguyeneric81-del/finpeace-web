'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Zap, Target, HelpCircle, KeyRound, 
  CheckCircle, AlertTriangle, RefreshCw, ChevronRight, 
  ArrowRight, Users, TrendingUp, Info
} from 'lucide-react'
import { TradingPlan } from './DealCard'

interface KbsvExecutionPanelProps {
  plan: TradingPlan
  user: any
  onClose: () => void
  onSuccess: (boughtPrice: number) => void
}

export default function KbsvExecutionPanel({ plan, user, onClose, onSuccess }: KbsvExecutionPanelProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // KBSV Account and balance states
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [cashBalance, setCashBalance] = useState<number>(0)
  const [purchasingPower, setPurchasingPower] = useState<number>(0)
  
  // Trade Form states
  const [quantity, setQuantity] = useState<number>(100)
  const [useConditional, setUseConditional] = useState<boolean>(true)
  
  // OTP and Order Execution states
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<string>('')
  const [transactionId, setTransactionId] = useState<number | null>(null)
  const [otpTimer, setOtpTimer] = useState<number>(60)
  const [orderProgress, setOrderProgress] = useState<'idle' | 'otp_sent' | 'submitting' | 'success'>('idle')

  // Parse prices from TradingPlan
  const parsedPrices = React.useMemo(() => {
    const cleanPrice = (str: string | null | undefined): number => {
      if (!str) return 0
      const cleaned = str.replace(/,/g, '').replace(/\./g, '').trim()
      const num = parseFloat(cleaned)
      if (isNaN(num)) return 0
      // Vietnamese stock price in thousands (e.g. 75 -> 75000)
      return num < 1000 ? num * 1000 : num
    }

    let entryMin = 0
    let entryMax = 0
    let entryAvg = 0
    let stopLoss = 0
    let takeProfit = 0

    if (plan.entry_zone) {
      const parts = plan.entry_zone.split(/[-–—]/)
      if (parts.length >= 2) {
        entryMin = cleanPrice(parts[0])
        entryMax = cleanPrice(parts[1])
      } else {
        entryMax = cleanPrice(plan.entry_zone)
        entryMin = entryMax
      }
      entryAvg = (entryMin + entryMax) / 2
    }

    if (plan.stop_loss) {
      stopLoss = cleanPrice(plan.stop_loss)
    }
    
    if (plan.take_profit) {
      takeProfit = cleanPrice(plan.take_profit)
    }

    return { entryMin, entryMax, entryAvg, stopLoss, takeProfit }
  }, [plan])

  // Check connection and fetch assets on load
  const checkConnection = async () => {
    setConnectionStatus('checking')
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/kbsv/proxy/accounts?advisor_user_id=${user.id}`)
      const data = await res.json()

      if (!res.ok || !data.ok) {
        setConnectionStatus('disconnected')
        return
      }

      const accountList = data.data || data.d || []
      setAccounts(accountList)
      
      if (accountList.length > 0) {
        const primaryAcc = accountList[0].id || accountList[0].accountId
        setSelectedAccountId(primaryAcc)
        
        // Fetch Balance
        const assetRes = await fetch(`/api/kbsv/proxy/account-assets?advisor_user_id=${user.id}&accountId=${primaryAcc}`)
        const assetData = await assetRes.json()
        
        if (assetData.ok) {
          const innerData = assetData.data || assetData.d || {}
          setCashBalance(innerData.cashBalance ?? innerData.cash ?? 150000000)
          setPurchasingPower(innerData.purchasingPower ?? innerData.PP ?? 150000000)
        }
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('disconnected')
      }
    } catch (err) {
      console.error(err)
      setConnectionStatus('disconnected')
    }
  }

  useEffect(() => {
    if (user?.id) {
      checkConnection()
    }
  }, [user?.id])

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [showOtpModal, otpTimer])

  const handleAccountChange = async (accId: string) => {
    setSelectedAccountId(accId)
    setLoading(true)
    try {
      const assetRes = await fetch(`/api/kbsv/proxy/account-assets?advisor_user_id=${user.id}&accountId=${accId}`)
      const assetData = await assetRes.json()
      if (assetData.ok) {
        const innerData = assetData.data || assetData.d || {}
        setCashBalance(innerData.cashBalance ?? innerData.cash ?? 150000000)
        setPurchasingPower(innerData.purchasingPower ?? innerData.PP ?? 150000000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Pre-calculate lot sizes
  const roundToLot = (qty: number): number => {
    return Math.max(100, Math.round(qty / 100) * 100)
  }

  const buyQty = quantity
  const slQty = quantity
  
  // Split orders for Take Profit
  const tp1Qty = roundToLot(quantity / 2)
  const tp2Qty = Math.max(0, quantity - tp1Qty)

  const estimatedValue = buyQty * parsedPrices.entryAvg
  const isBalanceSufficient = purchasingPower >= estimatedValue

  // OTP Request
  const requestOtp = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const otpBody = {
        requestId: Math.random().toString(36).substring(2, 15),
        otpType: 'core-email-otp',
        accountId: selectedAccountId
      }
      
      const res = await fetch(`/api/kbsv/proxy/otp-send?advisor_user_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpBody)
      })
      
      const data = await res.json()
      if (res.ok && data.ok) {
        const txId = data.data?.transactionId || data.d?.transactionId
        setTransactionId(txId)
        setOtpTimer(60)
        setShowOtpModal(true)
        setOrderProgress('otp_sent')
      } else {
        throw new Error(data.kbsv_em || data.error || 'Không thể gửi OTP. Vui lòng thử lại.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi gửi OTP.')
    } finally {
      setLoading(false)
    }
  }

  // Submit Order Batch
  const submitOrderBatch = async () => {
    if (!otpCode || otpCode.length < 4) {
      alert('Vui lòng nhập mã OTP hợp lệ')
      return
    }

    setLoading(true)
    setErrorMsg(null)
    setOrderProgress('submitting')

    try {
      const selectedAccount = accounts.find(acc => (acc.id || acc.accountId) === selectedAccountId)
      const accountNumber = selectedAccount?.accountdesc || selectedAccount?.id || selectedAccountId

      if (useConditional) {
        // Build the conditional orders array
        const orders: any[] = [
          // 1. Buy Stop Entry Order (SEO)
          {
            refId: "buy_" + Math.random().toString(36).substring(2, 9),
            condOrderType: "SEO",
            accountId: selectedAccountId,
            accountNumber: accountNumber,
            symbol: plan.ticker,
            execType: "B",
            volume: buyQty,
            orderPrice: parsedPrices.entryAvg,
            activeType: "ONE",
            priceMarketCond: "MATCHING_PRICE",
            orderSubType: "LO",
            expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          // 2. Stop Loss Order (STO)
          {
            refId: "sl_" + Math.random().toString(36).substring(2, 9),
            condOrderType: "STO",
            accountId: selectedAccountId,
            accountNumber: accountNumber,
            symbol: plan.ticker,
            execType: "S",
            volume: slQty,
            orderPrice: parsedPrices.stopLoss,
            activePrice: parsedPrices.stopLoss,
            activeType: "ONE",
            activeCond: "LTE",
            orderSubType: "LO",
            expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          // 3. Take Profit 1 Order (STO)
          {
            refId: "tp1_" + Math.random().toString(36).substring(2, 9),
            condOrderType: "STO",
            accountId: selectedAccountId,
            accountNumber: accountNumber,
            symbol: plan.ticker,
            execType: "S",
            volume: tp1Qty,
            orderPrice: parsedPrices.takeProfit,
            activePrice: parsedPrices.takeProfit,
            activeType: "ONE",
            activeCond: "GTE",
            orderSubType: "LO",
            expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]

        // 4. Take Profit 2 Trailing Order
        if (tp2Qty > 0) {
          orders.push({
            refId: "tp2_" + Math.random().toString(36).substring(2, 9),
            condOrderType: "TRAILING",
            accountId: selectedAccountId,
            accountNumber: accountNumber,
            symbol: plan.ticker,
            execType: "S",
            volume: tp2Qty,
            trailingAmount: 1500, // 1500 VND trailing gap
            priceStep: 1000,      // 1000 VND price step
            activePrice: parsedPrices.takeProfit,
            activeType: "ONE",
            orderSubType: "LO",
            expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }

        const reqId = Math.random().toString(36).substring(2, 15)
        const batchBody = {
          requestId: reqId,
          otpType: 'core-email-otp',
          transactionId: transactionId,
          otp: otpCode,
          orders: orders
        }

        console.log('[KbsvExecution] Placing batch conditional orders:', batchBody)
        const batchRes = await fetch(`/api/kbsv/proxy/place-batch-order?advisor_user_id=${user.id}&requestId=${reqId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batchBody)
        })
        const batchData = await batchRes.json()

        if (!batchRes.ok || !batchData.ok) {
          throw new Error(batchData.kbsv_em || batchData.error || 'Lỗi đặt lô lệnh điều kiện. Vui lòng kiểm tra lại OTP.')
        }

      } else {
        // Place standard Buy Limit Order only
        const buyOrderBody = {
          otpType: 'core-email-otp',
          transactionId: transactionId,
          otp: otpCode,
          requestId: Math.random().toString(36).substring(2, 15),
          symbol: plan.ticker,
          qty: buyQty,
          side: 'buy',
          accountId: selectedAccountId,
          type: 'limit',
          limitPrice: parsedPrices.entryAvg
        }

        console.log('[KbsvExecution] Placing single buy order:', buyOrderBody)
        const buyRes = await fetch(`/api/kbsv/proxy/place-order?advisor_user_id=${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buyOrderBody)
        })
        const buyData = await buyRes.json()

        if (!buyRes.ok || !buyData.ok) {
          throw new Error(buyData.kbsv_em || buyData.error || 'Lỗi đặt lệnh Mua. Vui lòng kiểm tra lại OTP.')
        }
      }

      // Update database status of the plan using `/api/admin/trading-plans/[id]/action`
      const dbRes = await fetch(`/api/admin/trading-plans/${plan.id}/action`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy',
          price: parsedPrices.entryAvg,
          note: useConditional 
            ? 'Đặt bộ 4 lệnh điều kiện thành công qua kết nối KBSV UAT'
            : 'Đặt lệnh Mua thường thành công qua kết nối KBSV UAT'
        })
      })

      if (dbRes.ok) {
        setOrderProgress('success')
        setTimeout(() => {
          setShowOtpModal(false)
          onSuccess(parsedPrices.entryAvg)
        }, 2000)
      } else {
        throw new Error('Lệnh đã đặt tại KBSV nhưng không thể đồng bộ trạng thái Deal.')
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi thực thi lệnh.')
      setOrderProgress('otp_sent')
    } finally {
      setLoading(false)
    }
  }

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
  }

  const connectToKbsv = () => {
    window.location.href = `/api/kbsv/auth?advisor_user_id=${user.id}`
  }

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: 'rgba(6,11,20,0.45)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)'
      }}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            Thực thi Lệnh qua KBSV
          </h3>
          <p className="text-white/40 text-xs mt-0.5 font-medium">AutoPilot v2 — Bracket Conditional Orders</p>
        </div>
        
        {/* Connection status badge */}
        <div>
          {connectionStatus === 'checking' && (
            <span className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
              Checking...
            </span>
          )}
          {connectionStatus === 'connected' && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold tracking-wide relative">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute left-2.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
              ● LIVE
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* DISCONNECTED OR CHECKING INTERFACE */}
      {connectionStatus === 'checking' && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-white/60 text-sm font-medium">Đang kiểm tra kết nối tài khoản chứng khoán...</p>
        </div>
      )}

      {connectionStatus === 'disconnected' && (
        <div className="py-8 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm mb-2">Chưa kết nối tài khoản KBSV</h4>
          <p className="text-white/50 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Bạn cần kết nối tài khoản chứng khoán KBSV UAT để kích hoạt tính năng thực thi lệnh điều kiện tự động của AutoPilot.
          </p>
          <button
            onClick={connectToKbsv}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-[0_4px_12px_rgba(245,158,11,0.2)] text-xs uppercase tracking-wider"
          >
            Kết nối KBSV ngay
          </button>
        </div>
      )}

      {/* CONNECTED INTERFACE */}
      {connectionStatus === 'connected' && (
        <div className="space-y-5">
          {/* Account Selector and Sức Mua Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account dropdown */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center">
              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1.5 ml-0.5">Tiểu khoản KBSV</label>
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.08] text-white font-mono font-bold text-sm rounded-xl px-3 py-2.5 outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                {accounts.map((acc, i) => (
                  <option key={i} value={acc.id || acc.accountId}>
                    {acc.accountdesc || acc.id || acc.accountId}
                  </option>
                ))}
              </select>
            </div>

            {/* Sức mua PP */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Users className="w-16 h-16 text-emerald-400" />
              </div>
              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 ml-0.5">Sức mua khả dụng (PP)</label>
              {loading ? (
                <div className="h-6 w-24 bg-white/5 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-xl font-black text-emerald-400 font-mono tracking-tight">{formatMoney(purchasingPower)}</p>
              )}
            </div>
          </div>

          {/* Quantity Form */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-0.5">Số lượng cổ phiếu mua</label>
              <span className="text-white/60 font-mono text-xs font-bold bg-white/5 px-2 py-0.5 rounded">
                Mã: {plan.ticker}
              </span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="number"
                min={100}
                step={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-900 border border-white/[0.08] text-white font-mono font-black text-base rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              
              {/* Quick Select buttons */}
              <div className="flex gap-1">
                {[500, 1000, 2000].map(val => (
                  <button
                    key={val}
                    onClick={() => setQuantity(val)}
                    className="px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] text-xs font-bold text-white/80 rounded-xl transition-all"
                  >
                    +{val.toLocaleString()}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const maxQty = Math.floor(purchasingPower / parsedPrices.entryAvg)
                    const maxLot = Math.max(100, Math.floor(maxQty / 100) * 100)
                    setQuantity(maxLot)
                  }}
                  className="px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-black text-emerald-400 rounded-xl transition-all"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Estimated Value */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.04] text-xs">
              <span className="text-white/40 font-medium">Giá mua trung bình:</span>
              <span className="text-white/80 font-bold font-mono">{formatMoney(parsedPrices.entryAvg)}</span>
            </div>
            <div className="flex justify-between items-center mt-1.5 text-xs">
              <span className="text-white/40 font-medium">Tổng giá trị ước tính:</span>
              <span className="text-white/80 font-black font-mono">{formatMoney(estimatedValue)}</span>
            </div>

            {/* Insufficient Funds Alert */}
            {!isBalanceSufficient && (
              <div className="mt-3 flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">
                  Tài khoản không đủ sức mua! Cần nạp thêm {formatMoney(estimatedValue - purchasingPower)}.
                </span>
              </div>
            )}
          </div>

          {/* Toggle placement */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-white/70 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Đặt bộ 4 lệnh điều kiện bảo vệ AutoPilot
            </span>
            <input
              type="checkbox"
              checked={useConditional}
              onChange={(e) => setUseConditional(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* CONDITIONAL ORDERS PREVIEW TIMELINE */}
          {useConditional && (
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 space-y-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black flex items-center gap-1 mb-1">
                <Info className="w-3 h-3 text-white/40" />
                Bản xem trước bộ lệnh sẽ đặt
              </p>

              {/* Timeline list */}
              <div className="space-y-4 relative pl-3 border-l border-white/[0.07] ml-2.5">
                
                {/* 1. Buy Order */}
                <div className="relative">
                  <span className="absolute -left-[19.5px] top-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1">
                        1. Mua {plan.ticker} (Stop Entry - SEO)
                      </h5>
                      <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
                        Trigger: Giá ≤ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.entryMax)}</span>. Khớp lệnh giới hạn LO @ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.entryAvg)}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs font-bold font-mono text-emerald-400">+{buyQty.toLocaleString()} CP</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">GTD: 30 ngày</p>
                    </div>
                  </div>
                </div>

                {/* 2. Stop Loss Order */}
                <div className="relative">
                  <span className="absolute -left-[19.5px] top-0.5 w-3 h-3 rounded-full bg-rose-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1">
                        2. Cắt lỗ Stop Loss (SEO)
                      </h5>
                      <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
                        Trigger: Giá ≤ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.stopLoss)}</span>. Bán dứt khoát giá thị trường MP
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs font-bold font-mono text-rose-400">-{slQty.toLocaleString()} CP</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">GTD: 30 ngày</p>
                    </div>
                  </div>
                </div>

                {/* 3. Take Profit 1 */}
                <div className="relative">
                  <span className="absolute -left-[19.5px] top-0.5 w-3 h-3 rounded-full bg-blue-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        3. Chốt lời TP 1 (SEO 50%)
                      </h5>
                      <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
                        Trigger: Giá ≥ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.takeProfit)}</span>. Đặt bán chốt LO @ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.takeProfit)}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs font-bold font-mono text-blue-400">-{tp1Qty.toLocaleString()} CP</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">GTD: 30 ngày</p>
                    </div>
                  </div>
                </div>

                {/* 4. Take Profit 2 (Trailing) */}
                {tp2Qty > 0 && (
                  <div className="relative">
                    <span className="absolute -left-[19.5px] top-0.5 w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1">
                          4. Chốt lời TP 2 (Trailing Sell 50%)
                        </h5>
                        <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
                          Kích hoạt từ giá ≥ <span className="text-white/60 font-semibold">{formatMoney(parsedPrices.takeProfit)}</span>. Trailing Gap biên độ <span className="text-purple-400 font-bold">1,500đ</span> tối ưu lợi nhuận
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs font-bold font-mono text-purple-400">-{tp2Qty.toLocaleString()} CP</p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">GTD: 30 ngày</p>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider disabled:opacity-50"
            >
              Quay lại
            </button>
            <button
              onClick={requestOtp}
              disabled={loading || !isBalanceSufficient}
              className="flex-[2] py-3.5 bg-gradient-to-r from-[#00D16E] to-[#048c4d] hover:from-[#05df77] hover:to-[#049d56] text-white font-extrabold rounded-xl transition-all shadow-[0_4px_20px_rgba(0,209,110,0.25)] hover:scale-[1.01] text-xs uppercase tracking-wider disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <KeyRound className="w-4 h-4 text-white" />
              )}
              Đặt lệnh & Xác thực OTP
            </button>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* OTP MODAL OVERLAY */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative"
              style={{
                background: 'linear-gradient(to bottom, #111827, #030712)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              {orderProgress !== 'success' && (
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full cursor-pointer hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              )}

              {/* SUCCESS ANIMATION */}
              {orderProgress === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(0,209,110,0.3)]"
                  >
                    <CheckCircle className="w-9 h-9 text-emerald-400 fill-emerald-400/10" />
                  </motion.div>
                  <h4 className="text-white font-extrabold text-lg mb-1">Giao Dịch Thành Công! 🎉</h4>
                  <p className="text-white/50 text-xs px-2 leading-relaxed">
                    Bộ 4 lệnh điều kiện đã gửi thành công lên hệ thống KBSV. Deal {plan.ticker} đã chuyển sang trạng thái Live.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Xác thực giao dịch</h3>
                      <p className="text-xs text-gray-400">Email OTP của tài khoản test 091C006669</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl font-medium">
                    Để thuận tiện cho việc thử nghiệm sandbox, vui lòng kiểm tra email liên kết hoặc nhập trực tiếp mã OTP UAT để thực thi cả bộ lệnh.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 ml-1">Nhập mã OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Mã OTP 6 chữ số"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-widest font-mono text-lg rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-black"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    />
                  </div>

                  {/* OTP countdown */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-medium">Mã giao dịch: <span className="font-mono text-white/60 font-bold">#{transactionId}</span></span>
                    {otpTimer > 0 ? (
                      <span className="text-amber-500/80 font-bold font-mono">Gửi lại sau {otpTimer}s</span>
                    ) : (
                      <button
                        onClick={requestOtp}
                        disabled={loading}
                        className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                      >
                        Gửi lại mã OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={submitOrderBatch}
                    disabled={loading || otpCode.length < 4}
                    className="w-full py-4 rounded-xl font-extrabold text-sm text-white transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    {orderProgress === 'submitting' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang đặt bộ lệnh điều kiện...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Xác Nhận Thực Thi
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
