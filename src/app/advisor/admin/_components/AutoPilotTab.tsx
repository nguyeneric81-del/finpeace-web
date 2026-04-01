'use client'
import { useState, useCallback, useEffect } from 'react'
import { Loader2, ArrowRight, CheckCircle2, Clock, AlertTriangle, RefreshCw, DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react'

type Plan = { id: string; ticker: string; company_name: string; strategy_name: string; entry_zone: string; stop_loss: string; take_profit: string; risk_reward: string; is_confirmed?: boolean; status: string; stockspick_trading_plan_id?: string; }
type Pending = { id: string; ticker: string; requested_count: number; status: string; created_at: string }

export default function AutoPilotTab() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pr, pe] = await Promise.all([
        fetch('/api/advisor/admin?type=plans'),
        fetch('/api/advisor/admin?type=pending')
      ])
      const [pd, ped] = await Promise.all([pr.json(), pe.json()])
      if (Array.isArray(pd)) setPlans(pd)
      if (Array.isArray(ped)) setPending(ped)
    } catch (err) {
      console.error('Failed to load AutoPilot data:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function toggleConfirm(plan: Plan, is_confirmed: boolean) {
    if (!confirm(is_confirmed ? `Xác nhận mã ${plan.ticker} đủ tiêu chuẩn trade?` : `Huỷ trạng thái Đủ tiêu chuẩn của ${plan.ticker}?`)) return
    
    // Nộp lại toàn bộ plan với status is_confirmed mới
    await fetch('/api/advisor/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert_plan', ...plan, is_confirmed })
    })
    loadData()
  }

  // --- 2-Phase Execution Logic ---
  async function handleSyncStockspick(plan: Plan) {
    if (!confirm(`Đẩy bản kế hoạch ${plan.ticker} qua Stockspick Backoffice?\n(Sẽ tự động chạy 3 bước PTCB -> PTKT -> Trading Plan)`)) return
    setActionLoading(prev => ({ ...prev, [plan.id]: true }))
    try {
      const res = await fetch('/api/admin/stockspick/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_trading_plan', plan_id: plan.id, ticker: plan.ticker })
      })
      const data = await res.json()
      if (data.success) {
        alert(`🎉 Đồng bộ ${plan.ticker} lên Stockspick thành công!\nID: ${data.stockspickIds?.tradingPlanId}`)
      } else {
        alert(`❌ Lỗi đồng bộ: ${data.error}`)
      }
    } catch (err: any) {
      alert(`❌ Lỗi kết nối: ${err.message}`)
    }
    setActionLoading(prev => ({ ...prev, [plan.id]: false }))
    loadData()
  }

  async function handleRecommendation(plan: Plan, recAction: 'BUY'|'SELL'|'HOLD'|'CUT_LOSS') {
    if (!confirm(`XÁC NHẬN PHÁT LỆNH [${recAction}] CHO MÃ ${plan.ticker}?\nCảnh báo: Lệnh sẽ bắn Stockspick Notification tới tất cả Khách hàng ngay lập tức!`)) return
    setActionLoading(prev => ({ ...prev, [`rec_${plan.id}`]: true }))
    try {
      const res = await fetch('/api/admin/stockspick/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'recommend', 
          recommendation_action: recAction, 
          stockspick_trading_plan_id: plan.stockspick_trading_plan_id 
        })
      })
      const data = await res.json()
      if (data.success) {
        alert(`🚀 Phím lệnh ${recAction} thành công!\nRecommendation ID: ${data.recommendationId}`)
      } else {
        alert(`❌ Lỗi phím hàng: ${data.error || JSON.stringify(data)}`)
      }
    } catch (err: any) {
      alert(`❌ Lỗi kết nối: ${err.message}`)
    }
    setActionLoading(prev => ({ ...prev, [`rec_${plan.id}`]: false }))
  }

  if (loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-6 h-6"/></div>

  // Lọc dữ liệu cho 3 cột
  const colPending = pending.filter(p => ['pending', 'in_progress'].includes(p.status))
  const colDrafts = plans.filter(p => !p.is_confirmed && p.status !== 'archived')
  const colReady = plans.filter(p => p.status === 'active' && p.is_confirmed)

  return (
    <div className="space-y-6 text-foreground">
      <div className="glass-card flex items-center justify-between p-4 flex-col sm:flex-row gap-4">
        <div>
          <h3 className="text-slate-900 font-bold flex items-center gap-2 text-lg"><DollarSign className="w-5 h-5 text-emerald-600" /> Bảng Mạch Điều Phối Lệnh (Auto Execution)</h3>
          <p className="text-slate-600 text-xs mt-1 leading-snug">Giám sát và Phát tín hiệu Điểm mua/Bán tới Ứng dụng Khách Hàng.</p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-white/60 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 text-sm font-semibold transition-all shadow-sm">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Mã chưa có Trading Plan */}
        <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-white/70 backdrop-blur-md rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /> Khách Hành Hóng Mã</h4>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full">{colPending.length} yêu cầu</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3 relative z-0">
            {colPending.map(p => (
              <div key={p.id} className="glass-card p-4 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-700 text-lg">{p.ticker}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg border border-slate-200">{p.requested_count} người hóng</span>
                </div>
                <div className="mt-3 text-[11px] font-medium text-slate-500 flex items-center gap-1.5 p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Chờ Advisor lập Plan
                </div>
              </div>
            ))}
            {colPending.length === 0 && <p className="text-center text-slate-400 text-sm mt-10 font-medium">Không có mã nào nợ khách.</p>}
          </div>
        </div>

        {/* Cột 2: Đã có Trading Plan (Chờ xác nhận) */}
        <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Loader2 className="w-4 h-4 text-blue-600" /> Bản Nháp Chờ Duyệt</h4>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">{colDrafts.length} mã</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {colDrafts.map(p => (
              <div key={p.id} className="glass-card p-4 hover:border-blue-300 transition-all group duration-300 ease-out hover:shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-blue-700 text-xl tracking-tight">{p.ticker}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold mb-3 leading-tight truncate" title={p.strategy_name}>{p.strategy_name}</p>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-600 font-medium mb-4">
                  <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 text-center flex flex-col">
                    <span className="text-slate-400 mb-0.5">Vùng Mua</span>
                    <span className="text-slate-800 font-bold">{p.entry_zone || '-'}</span>
                  </div>
                  <div className="bg-rose-50/50 p-2 rounded-lg border border-rose-100/50 text-center flex flex-col">
                    <span className="text-slate-400 mb-0.5">Cắt lỗ</span>
                    <span className="text-rose-600 font-bold">{p.stop_loss || '-'}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 text-center flex flex-col">
                    <span className="text-slate-400 mb-0.5">Chốt lời</span>
                    <span className="text-emerald-600 font-bold">{p.take_profit || '-'}</span>
                  </div>
                </div>
                <button onClick={() => toggleConfirm(p, true)} className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5">
                  Phê Duyệt Kế Hoạch <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
            {colDrafts.length === 0 && <p className="text-center text-slate-400 text-sm mt-10 font-medium">Chưa có kế hoạch nháp.</p>}
          </div>
        </div>

        {/* Cột 3: Đủ Tiêu Chuẩn Trade */}
        <div className="bg-emerald-50/30 backdrop-blur-sm border-2 border-emerald-100 rounded-2xl flex flex-col h-[650px] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/40 blur-[50px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/30 blur-[40px] pointer-events-none rounded-full"></div>
          
          <div className="p-4 border-b border-emerald-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <h4 className="font-bold text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Hệ Thống Xuất Kích</h4>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">LIVE: {colReady.length}</span>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 space-y-4 z-10">
            {colReady.map(p => {
              const hasBO = !!p.stockspick_trading_plan_id
              const isSyncing = actionLoading[p.id]
              const isRecommending = actionLoading[`rec_${p.id}`]
              
              return (
              <div key={p.id} className={`glass-card p-4 relative overflow-hidden transition-all duration-300 ${!hasBO ? 'border-amber-200 bg-white/90' : 'border-emerald-200 bg-white/95 shadow-md hover:shadow-xl hover:-translate-y-1'}`}>
                {hasBO && <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent blur-md rounded-full pointer-events-none"></div>}
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="font-black text-slate-900 text-3xl tracking-tighter drop-shadow-sm">{p.ticker}</span>
                  <div className="flex flex-col items-end gap-1">
                    {hasBO ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Đồng Bộ SP.</span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200 font-bold flex items-center gap-1">Chờ Giai Đoạn 1</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 relative z-10">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-400 font-medium mb-0.5 truncate text-[10px] uppercase tracking-wider">Vùng Giải Ngân</span>
                    <span className="text-slate-800 font-black text-sm">{p.entry_zone || '-'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-400 font-medium mb-0.5 truncate text-[10px] uppercase tracking-wider">Kỳ vọng / Rủi ro</span>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-emerald-600 font-black">{p.take_profit || '-'}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-rose-500 font-bold">{p.stop_loss || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 2-Phase Execution Actions */}
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mt-2 mb-3 relative z-10">
                  {!hasBO ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleSyncStockspick(p)} 
                        disabled={isSyncing}
                        className="w-full py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                        {isSyncing ? 'Đang tải lên Stockspick...' : 'GĐ1: Đồng bộ Stockspick API'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">Bắn tín hiệu (GĐ2)</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'BUY')} className="py-2.5 bg-emerald-500 text-white text-[11px] font-black tracking-wider rounded-xl shadow-md hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"><TrendingUp className="w-4 h-4"/> MUA</button>
                        <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'SELL')} className="py-2.5 bg-amber-500 text-white text-[11px] font-black tracking-wider rounded-xl shadow-md hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"><Target className="w-4 h-4"/> CHỐT LỜI</button>
                      </div>
                      <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'CUT_LOSS')} className="w-full py-2 mt-1 bg-rose-50 text-rose-600 text-[10px] font-bold tracking-wide rounded-xl border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 flex items-center justify-center gap-1.5"><TrendingDown className="w-3.5 h-3.5"/> CẮT LỖ KHẨN CẤP</button>
                    </div>
                  )}
                </div>

                <div className="pt-1 relative z-10 text-center">
                  <button onClick={() => toggleConfirm(p, false)} className="px-4 py-1.5 text-slate-400 text-[10px] font-semibold rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors uppercase tracking-wider">
                    Thu hồi về Draft
                  </button>
                </div>
              </div>
              )
            })}
            {colReady.length === 0 && <p className="text-center text-slate-400 text-sm mt-10 font-medium">Bạn có thể Phê duyệt Kế hoạch từ cột Draft để chuyển sang trạng thái LIVE.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
