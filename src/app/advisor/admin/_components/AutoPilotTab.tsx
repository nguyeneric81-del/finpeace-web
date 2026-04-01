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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111827] border border-[#1e2535] rounded-2xl p-4">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Bảng Theo Dõi Khớp Lệnh (Auto Execution)</h3>
          <p className="text-slate-400 text-xs mt-1">Quản lý luồng tín hiệu từ lúc Khách Hàng yêu cầu đến lúc Phát tín hiệu Trade.</p>
        </div>
        <button onClick={loadData} className="px-3 py-2 bg-[#1e2535] text-slate-300 rounded-lg hover:text-white flex items-center gap-2 text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột 1: Mã chưa có Trading Plan */}
        <div className="bg-[#111827]/50 border border-[#1e2535] rounded-xl flex flex-col h-[650px]">
          <div className="p-4 border-b border-[#1e2535] bg-[#111827] rounded-t-xl flex items-center justify-between sticky top-0">
            <h4 className="font-bold text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Khách Hành Hóng Mã</h4>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{colPending.length} yêu cầu</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {colPending.map(p => (
              <div key={p.id} className="bg-[#111827] border border-amber-900/30 rounded-xl p-3 hover:border-amber-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-lg">{p.ticker}</span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md">{p.requested_count} người hóng</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Chờ Admin qua tab Blueprint lên Plan
                </div>
              </div>
            ))}
            {colPending.length === 0 && <p className="text-center text-slate-500 text-sm mt-10">Không có mã nào đang nợ khách.</p>}
          </div>
        </div>

        {/* Cột 2: Đã có Trading Plan (Chờ xác nhận) */}
        <div className="bg-[#111827]/50 border border-[#1e2535] rounded-xl flex flex-col h-[650px]">
          <div className="p-4 border-b border-[#1e2535] bg-[#111827] rounded-t-xl flex items-center justify-between sticky top-0">
            <h4 className="font-bold text-slate-200 flex items-center gap-2"><Loader2 className="w-4 h-4 text-blue-400" /> Plan Đang Ủ (Draft)</h4>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{colDrafts.length} mã</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {colDrafts.map(p => (
              <div key={p.id} className="bg-[#111827] border border-blue-900/30 rounded-xl p-3 hover:border-blue-700/50 transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-400 text-lg">{p.ticker}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mb-2 truncate" title={p.strategy_name}>{p.strategy_name}</p>
                <div className="space-y-1 text-[11px] text-slate-400 mb-3 bg-[#0d1119] p-2 rounded-lg">
                  <p>📥 Vùng Mua: <span className="text-white">{p.entry_zone || '-'}</span></p>
                  <p>🛑 Cắt lỗ: <span className="text-rose-400">{p.stop_loss || '-'}</span></p>
                  <p>🚀 Chốt lời: <span className="text-emerald-400">{p.take_profit || '-'}</span></p>
                </div>
                <button onClick={() => toggleConfirm(p, true)} className="w-full py-1.5 bg-emerald-600/20 text-emerald-500 text-xs font-bold rounded-lg border border-emerald-600/30 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1">
                  Đánh Rơi Tín Hiệu (Duyệt) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {colDrafts.length === 0 && <p className="text-center text-slate-500 text-sm mt-10">Chưa có Plan nào đang ủ.</p>}
          </div>
        </div>

        {/* Cột 3: Đủ Tiêu Chuẩn Trade */}
        <div className="bg-[#111827]/50 border border-emerald-900/40 rounded-xl flex flex-col h-[650px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="p-4 border-b border-[#1e2535] bg-[#111827] rounded-t-xl flex items-center justify-between sticky top-0 z-10">
            <h4 className="font-bold text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Đủ Tiêu Chuẩn Trade</h4>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{colReady.length} mã LIVE</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3 z-10">
            {colReady.map(p => {
              const hasBO = !!p.stockspick_trading_plan_id
              const isSyncing = actionLoading[p.id]
              const isRecommending = actionLoading[`rec_${p.id}`]
              
              return (
              <div key={p.id} className={`bg-[#0a0f1c] border ${hasBO ? 'border-sky-500/40 shadow-sky-500/10' : 'border-[#1e2535]'} rounded-xl p-3 relative overflow-hidden transition-all shadow-[0_0_15px_rgba(16,185,129,0.05)]`}>
                {hasBO && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl"></div>}
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-white text-2xl tracking-tight">{p.ticker}</span>
                  <div className="flex flex-col items-end gap-1">
                    {hasBO ? (
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đã Đồng Bộ SP</span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 font-bold">Chờ Đồng bộ (GĐ1)</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Vùng Mua</span>
                    <span className="text-white font-medium">{p.entry_zone || '-'}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Chốt / Cắt</span>
                    <span className="text-emerald-400 font-bold">{p.take_profit || '-'}</span> <span className="text-slate-600 mx-0.5">/</span> <span className="text-rose-400">{p.stop_loss || '-'}</span>
                  </div>
                </div>

                {/* 2-Phase Execution Actions */}
                <div className="p-2.5 bg-[#111827] rounded-xl border border-[#1e2535] mt-2 mb-3">
                  {!hasBO ? (
                    <div className="space-y-1.5">
                      <button 
                        onClick={() => handleSyncStockspick(p)} 
                        disabled={isSyncing}
                        className="w-full py-2 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                        {isSyncing ? 'Đang đẩy lên CSDL...' : 'GĐ1: Đồng bộ Stockspick'}
                      </button>
                      <p className="text-[9px] text-slate-500 text-center leading-tight">Hoàn thành GĐ1 (Trình duyệt) trước khi Phím Hàng ở GĐ2.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-wider">GĐ2: LỆNH PHÍM HÀNG (LIVE)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'BUY')} className="py-2 bg-emerald-600/20 text-emerald-400 text-xs font-black tracking-wide rounded-lg border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5"><TrendingUp className="w-4 h-4"/> MUA</button>
                        <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'SELL')} className="py-2 bg-amber-600/20 text-amber-500 text-xs font-black tracking-wide rounded-lg border border-amber-500/30 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-1.5"><Target className="w-4 h-4"/> CHỐT LỜI</button>
                      </div>
                      <button disabled={isRecommending} onClick={() => handleRecommendation(p, 'CUT_LOSS')} className="w-full py-1.5 bg-rose-600/10 text-rose-500 text-[11px] font-bold rounded-lg border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-1"><TrendingDown className="w-3.5 h-3.5"/> CẮT LỖ KHẨN CẤP</button>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#1e2535] pt-2 mt-2">
                  <button onClick={() => toggleConfirm(p, false)} className="w-full py-1 text-slate-500 text-[10px] font-medium rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-colors uppercase">
                    Huỷ quay lại Draft
                  </button>
                </div>
              </div>
              )
            })}
            {colReady.length === 0 && <p className="text-center text-slate-500 text-sm mt-10">Chưa có mã nào đủ chỉ tiêu xuất kích.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
