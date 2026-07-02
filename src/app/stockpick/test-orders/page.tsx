'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, RefreshCw, KeyRound, Play, Trash2, Plus, 
  CheckCircle, AlertTriangle, Eye, EyeOff, Clipboard, Code, Info
} from 'lucide-react'
import Link from 'next/link'

type StockPickUser = {
  id: string
  name: string
  email: string
  tier: 'FREE' | 'BRONZE' | 'SILVER'
  role: string
}

type Account = {
  id: string
  custodycd: string
  customerid: string
  name: string
  accountdesc: string
  accountId?: string
}

type BasketItem = {
  id: string
  condOrderType: 'SEO' | 'STO' | 'TRAILING'
  symbol: string
  execType: 'B' | 'S'
  volume: number
  orderPrice?: number
  activePrice?: number
  activeCond?: 'GTE' | 'LTE'
  priceMarketCond?: 'MATCHING_PRICE' | 'BEST_BUY_PRICE' | 'BEST_SELL_PRICE'
  trailingAmount?: number
  priceStep?: number
  orderSubType: string
  expireDate: string
  activeType?: 'ONE' | 'ALL'
}

export default function TestOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<StockPickUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  // KBSV Connection Status
  const [kbsvConnected, setKbsvConnected] = useState<boolean | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  
  // OTP Management
  const [transactionId, setTransactionId] = useState<string>('')
  const [otpCode, setOtpCode] = useState<string>('')
  const [otpTimer, setOtpTimer] = useState<number>(0)
  const [otpLoading, setOtpLoading] = useState<boolean>(false)
  
  // Order Basket
  const [basket, setBasket] = useState<BasketItem[]>([])
  
  // New Order Form State
  const [formType, setFormType] = useState<'SEO' | 'STO' | 'TRAILING'>('SEO')
  const [formSymbol, setFormSymbol] = useState('HPG')
  const [formSide, setFormSide] = useState<'B' | 'S'>('B')
  const [formVolume, setFormVolume] = useState<number>(100)
  const [formOrderPrice, setFormOrderPrice] = useState<number>(25000)
  const [formActivePrice, setFormActivePrice] = useState<number>(25000)
  const [formActiveCond, setFormActiveCond] = useState<'GTE' | 'LTE'>('GTE')
  const [formPriceMarketCond, setFormPriceMarketCond] = useState<'MATCHING_PRICE' | 'BEST_BUY_PRICE' | 'BEST_SELL_PRICE'>('MATCHING_PRICE')
  const [formTrailingAmount, setFormTrailingAmount] = useState<number>(1000)
  const [formPriceStep, setFormPriceStep] = useState<number>(500)
  const [formSubType, setFormSubType] = useState('LO')
  
  // Active Conditional Orders (Fetched from UAT)
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [fetchingActive, setFetchingActive] = useState(false)
  const [selectedActiveIds, setSelectedActiveIds] = useState<string[]>([])
  
  // Execution Inspector State
  const [actionProgress, setActionProgress] = useState<'idle' | 'executing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [plaintextRequest, setPlaintextRequest] = useState<any>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)

  // Live Payload Editor State
  const [customPayload, setCustomPayload] = useState<string>('')
  const [isEditingPayload, setIsEditingPayload] = useState<boolean>(false)

  // Auth guard & init
  useEffect(() => {
    const stored = sessionStorage.getItem('stockpick_user')
    if (!stored) {
      router.replace('/stockpick/login')
    } else {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      checkKbsvConnection(parsed.id)
    }
  }, [router])

  // OTP Countdown Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [otpTimer])

  // Check connection & fetch accounts
  const checkKbsvConnection = async (userId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/kbsv/proxy/accounts?advisor_user_id=${userId}`)
      const json = await res.json()
      
      if (res.ok && json.ok && Array.isArray(json.data) && json.data.length > 0) {
        setKbsvConnected(true)
        setAccounts(json.data)
        const firstAcc = json.data[0]
        setSelectedAccountId(firstAcc.id || firstAcc.accountId)
        fetchActiveOrders(userId, firstAcc.id || firstAcc.accountId)
      } else {
        setKbsvConnected(false)
      }
    } catch {
      setKbsvConnected(false)
    } finally {
      setLoading(false)
    }
  }

  // Fetch active conditional orders from KBSV
  const fetchActiveOrders = async (userId: string, accId: string) => {
    if (!userId || !accId) return
    setFetchingActive(true)
    try {
      const res = await fetch(`/api/kbsv/proxy/cond-orders?advisor_user_id=${userId}&accountId=${accId}&rows=50`)
      const json = await res.json()
      if (res.ok && json.ok && json.data) {
        setActiveOrders(json.data.items || json.data || [])
      } else {
        console.warn('Failed to fetch active conditional orders:', json)
      }
    } catch (err) {
      console.error('Error fetching active orders:', err)
    } finally {
      setFetchingActive(false)
    }
  }

  // Request Transaction OTP
  const requestOtp = async () => {
    if (!user) return
    setOtpLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/kbsv/proxy/otp-send?advisor_user_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otpType: 'core-email-otp',
          requestId: 'otp_' + Math.random().toString(36).substring(2, 12)
        })
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setTransactionId(data.data.transactionId)
        setOtpTimer(60)
        setActionProgress('idle')
      } else {
        setErrorMsg(data.error || data.kbsv_em || 'Không thể yêu cầu OTP giao dịch.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi yêu cầu OTP.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Add Item to Basket
  const addToBasket = () => {
    const expireStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const newItem: BasketItem = {
      id: Math.random().toString(36).substring(2, 9),
      condOrderType: formType,
      symbol: formSymbol.toUpperCase(),
      execType: formSide,
      volume: formVolume,
      orderSubType: formSubType,
      expireDate: expireStr
    }

    if (formType === 'SEO') {
      newItem.orderPrice = formOrderPrice
      newItem.priceMarketCond = formPriceMarketCond
      newItem.activeType = 'ONE'
    } else if (formType === 'STO') {
      newItem.orderPrice = formOrderPrice
      newItem.activePrice = formActivePrice
      newItem.activeCond = formActiveCond
      newItem.activeType = 'ONE'
    } else if (formType === 'TRAILING') {
      newItem.activePrice = formActivePrice
      newItem.trailingAmount = formTrailingAmount
      newItem.priceStep = formPriceStep
      newItem.activeType = 'ONE'
    }

    setBasket([...basket, newItem])
  }

  // Remove from Basket
  const removeFromBasket = (id: string) => {
    setBasket(basket.filter(item => item.id !== id))
  }

  // Auto-generate plaintext payload string
  useEffect(() => {
    if (isEditingPayload) return

    const selectedAccount = accounts.find(acc => (acc.id || acc.accountId) === selectedAccountId)
    const accountNumber = selectedAccount?.accountdesc || selectedAccount?.id || selectedAccountId

    const formattedOrders = basket.map(item => {
      const base: any = {
        refId: 'ref_' + item.id + '_' + Math.random().toString(36).substring(2, 6),
        condOrderType: item.condOrderType,
        accountId: selectedAccountId,
        accountNumber: accountNumber,
        symbol: item.symbol,
        execType: item.execType,
        volume: Number(item.volume),
        orderSubType: item.orderSubType,
        activeType: 'ONE',
        expireDate: item.expireDate
      }

      if (item.condOrderType === 'SEO') {
        base.orderPrice = Number(item.orderPrice)
        base.priceMarketCond = item.priceMarketCond
      } else if (item.condOrderType === 'STO') {
        base.orderPrice = Number(item.orderPrice)
        base.activePrice = Number(item.activePrice)
        base.activeCond = item.activeCond
      } else if (item.condOrderType === 'TRAILING') {
        base.activePrice = Number(item.activePrice)
        base.trailingAmount = Number(item.trailingAmount)
        base.priceStep = Number(item.priceStep)
      }

      return base
    })

    const body = {
      requestId: 'req_' + Math.random().toString(36).substring(2, 12),
      otpType: 'core-email-otp',
      transactionId: transactionId || 'kbsv_order.xxxxx',
      otp: otpCode || 'xxxxxx',
      orders: formattedOrders
    }

    setCustomPayload(JSON.stringify(body, null, 2))
  }, [basket, transactionId, otpCode, selectedAccountId, accounts, isEditingPayload])

  // Submit Batch Conditional Orders
  const executeBatch = async () => {
    if (!user || !selectedAccountId) return
    if (!otpCode || otpCode.length < 4) {
      alert('Vui lòng nhập mã OTP tối thiểu 4 chữ số')
      return
    }

    setActionProgress('executing')
    setErrorMsg(null)
    setPlaintextRequest(null)
    setRawResponse(null)

    let batchBody: any
    try {
      batchBody = JSON.parse(customPayload)
      // Override OTP and transaction ID from form inputs
      batchBody.otp = otpCode
      batchBody.transactionId = transactionId
      if (!batchBody.requestId || batchBody.requestId.includes('xxxxx')) {
        batchBody.requestId = 'req_' + Math.random().toString(36).substring(2, 12)
      }
    } catch (e: any) {
      setErrorMsg('JSON Payload không hợp lệ: ' + e.message)
      setActionProgress('error')
      return
    }

    // Set plaintext request for inspector
    setPlaintextRequest(batchBody)
    const reqId = batchBody.requestId

    try {
      const res = await fetch(`/api/kbsv/proxy/place-batch-order?advisor_user_id=${user.id}&requestId=${reqId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchBody)
      })

      const data = await res.json()
      setRawResponse(data)

      if (!res.ok || !data.ok) {
        throw new Error(data.kbsv_em || data.error || 'Lỗi đặt lô lệnh điều kiện.')
      }

      // Check for inner failures in array
      const items = data.data || []
      if (Array.isArray(items)) {
        const failedOrder = items.find((o: any) => o.s === 'error')
        if (failedOrder) {
          throw new Error(failedOrder.errmsg || failedOrder.em || `Lỗi đặt lệnh con (Mã: ${failedOrder.ec})`)
        }
      }

      setActionProgress('success')
      setBasket([])
      setOtpCode('')
      // Refresh active orders list
      fetchActiveOrders(user.id, selectedAccountId)
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi thực thi lô lệnh điều kiện.')
      setActionProgress('error')
    }
  }

  // Cancel Selected Conditional Orders
  const cancelSelectedOrders = async () => {
    if (!user || !selectedAccountId || selectedActiveIds.length === 0) return
    if (!otpCode || otpCode.length < 4) {
      alert('Vui lòng nhập OTP để xác thực yêu cầu hủy lệnh')
      return
    }

    setActionProgress('executing')
    setErrorMsg(null)
    setPlaintextRequest(null)
    setRawResponse(null)

    // Build the cancel payload
    const cancelOrders = selectedActiveIds.map(id => {
      const order = activeOrders.find(o => o.id === id)
      return {
        conditionId: id,
        orderType: order?.orderType || 'SEO'
      }
    })

    const reqId = Math.random().toString(36).substring(2, 15)
    const cancelBody = {
      requestId: reqId,
      otpType: 'core-email-otp',
      transactionId: transactionId,
      otp: otpCode,
      orders: cancelOrders
    }

    setPlaintextRequest(cancelBody)

    try {
      const res = await fetch(`/api/kbsv/proxy/cancel-batch-order?advisor_user_id=${user.id}&requestId=${reqId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelBody)
      })

      const data = await res.json()
      setRawResponse(data)

      if (!res.ok || !data.ok) {
        throw new Error(data.kbsv_em || data.error || 'Lỗi hủy lô lệnh điều kiện.')
      }

      // Check inner errors
      const items = data.data?.items || data.data || []
      if (Array.isArray(items)) {
        const failed = items.find((o: any) => o.s === 'error')
        if (failed) {
          throw new Error(failed.errmsg || failed.em || `Lỗi hủy lệnh con (Mã: ${failed.ec})`)
        }
      }

      setActionProgress('success')
      setSelectedActiveIds([])
      setOtpCode('')
      fetchActiveOrders(user.id, selectedAccountId)
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi hủy lô lệnh.')
      setActionProgress('error')
    }
  }

  const connectToKbsv = () => {
    if (!user) return
    window.location.href = `/api/kbsv/auth?advisor_user_id=${user.id}&source=stockpick`
  }

  const toggleSelectActive = (id: string) => {
    if (selectedActiveIds.includes(id)) {
      setSelectedActiveIds(selectedActiveIds.filter(x => x !== id))
    } else {
      setSelectedActiveIds([...selectedActiveIds, id])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <p className="text-sm text-slate-400 font-medium">Đang kiểm tra kết nối KBSV UAT...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-16">
      {/* HEADER NAVBAR */}
      <div className="bg-slate-900/60 border-b border-white/[0.06] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/stockpick/dashboard" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                KBSV UAT Sandbox <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">DEVELOPER COCKPIT</span>
              </h1>
              <p className="text-xs text-slate-400">Trang thử nghiệm kỹ thuật rổ lệnh và các loại Lệnh điều kiện</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {kbsvConnected ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                KBSV UAT connected
              </div>
            ) : (
              <button 
                onClick={connectToKbsv}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                Kết Nối Lại KBSV
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TOP ALERT OR ACCOUNT SELECTOR */}
        {kbsvConnected && (
          <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Tài Khoản Liên Kết Hoạt Động</h3>
                <p className="text-xs text-slate-400">Chọn tiểu khoản thực thi các rổ lệnh Sandbox</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value)
                  if (user) fetchActiveOrders(user.id, e.target.value)
                }}
                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.custodycd} - {acc.name} ({acc.accountdesc})
                  </option>
                ))}
              </select>
              <button 
                onClick={() => user && fetchActiveOrders(user.id, selectedAccountId)}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Làm mới sổ lệnh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: ORDER BUILDER & OTP */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* CARD 1: CONDITIONAL ORDER BUILDER */}
            <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <h2 className="font-black text-base text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Thiết Lập Lệnh Điều Kiện
                </h2>
                <div className="flex gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                  {(['SEO', 'STO', 'TRAILING'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFormType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                        formType === type 
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Mã cổ phiếu (Symbol)</label>
                  <input 
                    type="text" 
                    value={formSymbol} 
                    onChange={e => setFormSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Chiều lệnh (Side)</label>
                  <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/[0.06]">
                    <button 
                      onClick={() => setFormSide('B')} 
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formSide === 'B' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      MUA (BUY)
                    </button>
                    <button 
                      onClick={() => setFormSide('S')} 
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formSide === 'S' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      BÁN (SELL)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Khối lượng (Volume)</label>
                  <input 
                    type="number" 
                    step={100}
                    value={formVolume} 
                    onChange={e => setFormVolume(Number(e.target.value))}
                    className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Loại lệnh phụ (orderSubType)</label>
                  <select 
                    value={formSubType}
                    onChange={e => setFormSubType(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="LO">LO (Lệnh giới hạn)</option>
                    <option value="MP">MP (Sàn HSX)</option>
                    <option value="MTL">MTL (Sàn HNX)</option>
                    <option value="ATO">ATO</option>
                    <option value="ATC">ATC</option>
                  </select>
                </div>

                {/* Type specific inputs */}
                {formType === 'SEO' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Giá đặt mua/bán (orderPrice - VND)</label>
                      <input 
                        type="number" 
                        step={100}
                        value={formOrderPrice} 
                        onChange={e => setFormOrderPrice(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Điều kiện giá kích hoạt (priceMarketCond)</label>
                      <select
                        value={formPriceMarketCond}
                        onChange={e => setFormPriceMarketCond(e.target.value as any)}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="MATCHING_PRICE">MATCHING_PRICE (Giá khớp)</option>
                        <option value="BEST_BUY_PRICE">BEST_BUY_PRICE (Giá mua tốt nhất)</option>
                        <option value="BEST_SELL_PRICE">BEST_SELL_PRICE (Giá bán tốt nhất)</option>
                      </select>
                    </div>
                  </>
                )}

                {formType === 'STO' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Giá kích hoạt (activePrice - VND)</label>
                      <input 
                        type="number" 
                        step={100}
                        value={formActivePrice} 
                        onChange={e => setFormActivePrice(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">So sánh giá kích hoạt (activeCond)</label>
                      <select
                        value={formActiveCond}
                        onChange={e => setFormActiveCond(e.target.value as any)}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="GTE">GTE (&gt;= Giá kích hoạt)</option>
                        <option value="LTE">LTE (&lt;= Giá kích hoạt)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Giá đặt thực thi (orderPrice - VND)</label>
                      <input 
                        type="number" 
                        step={100}
                        value={formOrderPrice} 
                        onChange={e => setFormOrderPrice(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                  </>
                )}

                {formType === 'TRAILING' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Giá kích hoạt tối thiểu (activePrice - VND)</label>
                      <input 
                        type="number" 
                        step={100}
                        value={formActivePrice} 
                        onChange={e => setFormActivePrice(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Biên bám đuôi (trailingAmount - VND)</label>
                      <input 
                        type="number" 
                        step={100}
                        value={formTrailingAmount} 
                        onChange={e => setFormTrailingAmount(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1.5 font-bold">Bước giá hiệu chỉnh (priceStep - VND)</label>
                      <input 
                        type="number" 
                        step={50}
                        value={formPriceStep} 
                        onChange={e => setFormPriceStep(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={addToBasket}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-extrabold border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" /> Thêm Vào Rổ Lệnh
              </button>
            </div>

            {/* CARD 2: BÁSKET LIST & EXECUTION */}
            <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <h2 className="font-black text-base text-white flex items-center justify-between">
                <span>Rổ Lệnh Chờ Gửi ({basket.length})</span>
                {basket.length > 0 && (
                  <button 
                    onClick={() => setBasket([])}
                    className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </h2>

              {basket.length === 0 ? (
                <div className="py-8 text-center bg-slate-950/40 border border-dashed border-white/[0.06] rounded-2xl text-slate-500 text-xs font-medium">
                  Rổ lệnh đang trống. Vui lòng thêm lệnh điều kiện ở trên.
                </div>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {basket.map((item, index) => (
                    <div key={item.id} className="bg-slate-950/70 border border-white/[0.04] p-3.5 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-black uppercase">{item.condOrderType}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.execType === 'B' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {item.execType === 'B' ? 'Mua' : 'Bán'}
                          </span>
                          <span className="text-xs font-black text-white">{item.symbol}</span>
                          <span className="text-xs text-slate-400">Qty: <span className="text-white font-bold">{item.volume}</span></span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          {item.condOrderType === 'SEO' && `Giá đặt: ${item.orderPrice} đ | Cơ chế: ${item.priceMarketCond}`}
                          {item.condOrderType === 'STO' && `Giá đặt: ${item.orderPrice} đ | Kích hoạt khi: ${item.activeCond} ${item.activePrice} đ`}
                          {item.condOrderType === 'TRAILING' && `Giá KH: ${item.activePrice} đ | Gap: ${item.trailingAmount} đ | Step: ${item.priceStep} đ`}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromBasket(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* OTP AREA */}
              <div className="border-t border-white/[0.06] pt-6 space-y-4">
                <h3 className="font-bold text-xs text-slate-400">XÁC THỰC OTP GIAO DỊCH</h3>
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="Nhập 6 chữ số OTP"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-center font-bold tracking-widest font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <button 
                    onClick={requestOtp}
                    disabled={otpLoading || !kbsvConnected}
                    className="px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    {otpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {transactionId ? 'Gửi Lại OTP' : 'Lấy OTP'}
                  </button>
                </div>

                {transactionId && (
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Mã GD (transactionId): <span className="text-white font-mono font-bold">#{transactionId}</span></span>
                    {otpTimer > 0 ? (
                      <span className="text-amber-500 font-bold font-mono">Gửi lại sau {otpTimer}s</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">Sẵn sàng gửi lại</span>
                    )}
                  </div>
                )}

                {/* PLACEMENT BUTTONS */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={executeBatch}
                    disabled={(basket.length === 0 && !customPayload) || !otpCode || !transactionId || actionProgress === 'executing'}
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#00D16E] to-[#048c4d] hover:from-[#05df77] hover:to-[#049d56] text-white text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <Play className="w-4 h-4" /> Gửi Rổ Lệnh Đặt ({basket.length})
                  </button>
                  <button
                    onClick={cancelSelectedOrders}
                    disabled={selectedActiveIds.length === 0 || !otpCode || !transactionId || actionProgress === 'executing'}
                    className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Hủy Lệnh Đã Chọn ({selectedActiveIds.length})
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: INSPECTOR & ACTIVE ORDERS */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* CARD 3: RAW INSPECTOR */}
            <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-5">
              <h2 className="font-black text-base text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" /> Trình Giám Sát API (JWE & Response)
              </h2>

              {/* Status Indicator */}
              {actionProgress !== 'idle' && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 border text-xs ${
                  actionProgress === 'executing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  actionProgress === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {actionProgress === 'executing' && <RefreshCw className="w-4 h-4 animate-spin mt-0.5 shrink-0" />}
                  {actionProgress === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                  {actionProgress === 'error' && <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                  
                  <div>
                    <p className="font-extrabold uppercase mb-1">
                      {actionProgress === 'executing' && 'Đang gửi yêu cầu...'}
                      {actionProgress === 'success' && 'Hoàn thành thành công'}
                      {actionProgress === 'error' && 'Yêu cầu thất bại'}
                    </p>
                    <p className="text-[10px] leading-relaxed">
                      {actionProgress === 'executing' && 'Mã hóa JWE và gọi đầu cuối UAT KBSV...'}
                      {actionProgress === 'success' && 'Máy chủ KBSV chấp thuận và ghi nhận rổ lệnh thành công.'}
                      {actionProgress === 'error' && errorMsg}
                    </p>
                  </div>
                </div>
              )}

              {/* Plaintext Request Inspector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Plaintext Payload (Trước JWE hóa)</span>
                  <button 
                    onClick={() => setIsEditingPayload(!isEditingPayload)}
                    className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Code className="w-3.5 h-3.5" />
                    {isEditingPayload ? 'Khóa tự động sinh' : 'Chỉnh sửa tự do (Edit JSON)'}
                  </button>
                </div>
                {isEditingPayload ? (
                  <div className="space-y-2">
                    <textarea
                      value={customPayload}
                      onChange={(e) => setCustomPayload(e.target.value)}
                      className="w-full bg-slate-950/80 border border-emerald-500/30 p-3 rounded-2xl text-[10px] font-mono text-emerald-400 h-[220px] focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    />
                    <span className="text-[9px] text-slate-400 block leading-normal">
                      💡 **Tip:** Bạn có thể thêm trường `"channel": "K"` hoặc các giá trị khác trực tiếp vào từng lệnh con trong mảng `"orders"` để test phản hồi từ KBSV.
                    </span>
                  </div>
                ) : (
                  <pre className="bg-slate-950/80 border border-white/[0.04] p-3 rounded-2xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[220px] leading-relaxed">
                    {customPayload || '// Chưa có rổ lệnh'}
                  </pre>
                )}
              </div>

              {/* Raw Response Inspector */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">KBSV UAT Raw Response</span>
                <pre className="bg-slate-950/80 border border-white/[0.04] p-3 rounded-2xl text-[10px] font-mono text-blue-400 overflow-x-auto max-h-[220px] leading-relaxed">
                  {rawResponse ? JSON.stringify(rawResponse, null, 2) : '// Chưa nhận phản hồi'}
                </pre>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 4: ACTIVE ORDERS LIST */}
        <div className="bg-slate-900/40 border border-white/[0.05] rounded-3xl p-6 mt-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="font-black text-base text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" /> Sổ Lệnh Điều Kiện Đang Chờ Kích Hoạt tại KBSV
            </h2>
            <button 
              onClick={() => user && fetchActiveOrders(user.id, selectedAccountId)}
              disabled={fetchingActive}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingActive ? 'animate-spin' : ''}`} /> Làm mới danh sách
            </button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-semibold">
              {fetchingActive ? 'Đang tải danh sách...' : 'Không có lệnh điều kiện nào đang chờ kích hoạt trên tiểu khoản này.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-400">
                    <th className="p-3 w-8">Chọn</th>
                    <th className="p-3">Mã Lệnh (ID)</th>
                    <th className="p-3">Loại</th>
                    <th className="p-3">Mã CK</th>
                    <th className="p-3">Mua/Bán</th>
                    <th className="p-3 text-right">Khối Lượng</th>
                    <th className="p-3 text-right">Giá Đặt / KH</th>
                    <th className="p-3">Ngày Hết Hạn</th>
                    <th className="p-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {activeOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.01]">
                      <td className="p-3">
                        <input 
                          type="checkbox"
                          checked={selectedActiveIds.includes(order.id)}
                          onChange={() => toggleSelectActive(order.id)}
                          className="w-4 h-4 rounded bg-slate-900 border-white/10 text-emerald-500 focus:ring-0 focus:ring-offset-0" 
                        />
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{order.id}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white uppercase">{order.orderType}</span>
                      </td>
                      <td className="p-3 font-black text-white">{order.symbol}</td>
                      <td className="p-3">
                        <span className={`font-bold ${order.execType === 'B' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {order.execType === 'B' ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-white">{order.volume}</td>
                      <td className="p-3 text-right font-medium text-slate-300">
                        {order.orderType === 'SEO' && `${order.orderPrice} đ`}
                        {order.orderType === 'STO' && `${order.orderPrice} đ (Kích hoạt: ${order.activeCond} ${order.activePrice} đ)`}
                        {order.orderType === 'TRAILING' && `KH: ${order.activePrice} đ (Gap: ${order.trailingAmount} đ)`}
                      </td>
                      <td className="p-3 text-slate-400 text-[10px]">{order.expireDate ? new Date(order.expireDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          order.status === 'PENDING' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                          order.status === 'ACTIVATED' || order.status === 'SUCCESS' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
