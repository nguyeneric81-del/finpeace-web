'use client'
import { useState, useCallback, useEffect } from 'react'
import { Loader2, ArrowRight, CheckCircle2, Clock, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react'

type Plan = { id: string; ticker: string; company_name: string; strategy_name: string; entry_zone: string; stop_loss: string; take_profit: string; risk_reward: string; is_confirmed?: boolean; status: string }
type Pending = { id: string; ticker: string; requested_count: number; status: string; created_at: string }

export default function AutoPilotTab() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [loading, setLoading] = useState(true)

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
            {colReady.map(p => (
              <div key={p.id} className="bg-emerald-900/10 border border-emerald-500/30 rounded-xl p-3 hover:border-emerald-500/60 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-emerald-400 text-2xl tracking-tight">{p.ticker}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">Auto Ready</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mb-3 truncate" title={p.strategy_name}>{p.strategy_name}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="bg-[#0d1119]/50 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Entry</span>
                    <span className="text-white font-medium">{p.entry_zone || '-'}</span>
                  </div>
                  <div className="bg-[#0d1119]/50 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Target</span>
                    <span className="text-emerald-400 font-bold">{p.take_profit || '-'}</span>
                  </div>
                </div>
                <button onClick={() => toggleConfirm(p, false)} className="w-full py-1 text-slate-500 text-xs font-medium rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
                  Huỷ duyệt lệnh
                </button>
              </div>
            ))}
            {colReady.length === 0 && <p className="text-center text-slate-500 text-sm mt-10">Chưa có mã nào đủ chỉ tiêu xuất kích.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
