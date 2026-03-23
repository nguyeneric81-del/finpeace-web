'use client'
import { useState, useCallback, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Save, Upload, Image as ImageIcon, TrendingUp, TrendingDown, Clock, DollarSign, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react'

type Plan = { id: string; ticker: string; company_name: string; strategy_name: string; timeframe: string; entry_zone: string; stop_loss: string; take_profit: string; risk_reward: string; max_position_pct: number; indicators: string[]; entry_criteria: string; exit_criteria: string; analyst_note: string; status: string; chart_image_url?: string; wave_index?: string; area_symmetry_note?: string; is_confirmed?: boolean; price_series?: number[] }
type Pending = { id: string; ticker: string; requested_count: number; status: string; created_at: string }
type Signal = { id: string; ticker: string; current_price: number; signal_type: 'reduce'|'consider_buy'|'wait_pullback'|'sell'|'take_profit'|'unknown'; signal_label: string; signal_detail: string; plan_entry_low: number|null; plan_entry_high: number|null; plan_sl: number|null; plan_tp: number|null; date: string; generated_at: string }

const EMPTY_PLAN = { ticker:'', company_name:'', strategy_name:'', timeframe:'Trung hạn (4-8 tuần)', entry_zone:'', stop_loss:'', take_profit:'', risk_reward:'', max_position_pct:10, indicators:[], entry_criteria:'', exit_criteria:'', analyst_note:'', chart_image_url:'', wave_index:'', area_symmetry_note:'', is_confirmed:false, price_series:[] }

const BLUEPRINT_SECTIONS = [
  {id:'plans', label:'📊 Trading Plans'},
  {id:'pending', label:'⏳ Pending'},
  {id:'signals', label:'📡 Tín Hiệu'},
]

function PlanForm({initial, onSave, onCancel}: {initial: Partial<Plan>; onSave:(p:any)=>void; onCancel:()=>void}) {
  const [form, setForm] = useState<any>({...EMPTY_PLAN, ...initial})
  const [saving, setSaving] = useState(false)
  const [chartUploading, setChartUploading] = useState(false)
  const [chartPreview, setChartPreview] = useState<string>(initial.chart_image_url||'')
  const set = (k:string,v:any) => setForm((f:any)=>({...f,[k]:v}))

  async function handleChartUpload(file: File) {
    if (!form.id) { alert('Lưu plan trước khi upload ảnh'); return }
    setChartUploading(true)
    const fd = new FormData(); fd.append('file',file); fd.append('plan_id',form.id)
    const res = await fetch('/api/advisor/admin',{method:'PUT',body:fd})
    const data = await res.json()
    setChartUploading(false)
    if (data.chart_image_url) { setChartPreview(data.chart_image_url); set('chart_image_url',data.chart_image_url) }
    if (data.draft_plan) Object.entries(data.draft_plan).forEach(([k,v]) => { if (!form[k] || (Array.isArray(form[k])&&form[k].length===0)) set(k,v) })
  }

  async function handleSave() {
    if (!form.ticker||!form.strategy_name) return alert('Cần ticker và tên chiến lược')
    setSaving(true); await onSave({...form,ticker:form.ticker.toUpperCase().trim()}); setSaving(false)
  }

  const inp = 'w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400'
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{initial.id?`Chỉnh sửa — ${initial.ticker}`:'Thêm Trading Plan'}</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-slate-400"/></button>
        </div>
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {[{key:'ticker',label:'Mã CK *',ph:'VNM'},{key:'company_name',label:'Tên công ty',ph:'Vinamilk'},{key:'wave_index',label:'Hệ thống sóng',ph:'Trending 3'},{key:'area_symmetry_note',label:'Tương xứng DT',ph:'Cần tích lũy thêm'}].map(f=>(
              <div key={f.key}><label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{f.label}</label>
              <input value={form[f.key]||''} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph} className={inp}/></div>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-xl">
            <input type="checkbox" id="conf" checked={form.is_confirmed||false} onChange={e=>set('is_confirmed',e.target.checked)} className="w-4 h-4 text-emerald-600 rounded"/>
            <label htmlFor="conf" className="text-sm font-bold text-emerald-900">Xác nhận thoát Sideway (Publish)</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{key:'strategy_name',label:'Tên chiến lược *',ph:'Mua tích lũy vùng đáy'},{key:'timeframe',label:'Khung TG',ph:'4-8 tuần'},{key:'entry_zone',label:'Vùng mua',ph:'55,000–57,000'},{key:'stop_loss',label:'Cắt lỗ',ph:'52,500'},{key:'take_profit',label:'Chốt lời',ph:'65,000'},{key:'risk_reward',label:'R:R',ph:'1:2.5'}].map(f=>(
              <div key={f.key}><label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{f.label}</label>
              <input value={form[f.key]||''} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph} className={inp}/></div>
            ))}
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">% Tối đa danh mục</label>
            <input type="number" min="1" max="100" value={form.max_position_pct} onChange={e=>set('max_position_pct',Number(e.target.value))} className={inp+' w-32'}/>
          </div>
          <div><label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Nhận xét phân tích</label>
            <textarea rows={2} value={form.analyst_note||''} onChange={e=>set('analyst_note',e.target.value)} placeholder="Luận điểm macro, FA..." className={inp+' resize-none'}/>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2 flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5"/>Ảnh Chart Phân Tích</label>
            {chartPreview ? (
              <div className="relative">
                <img src={chartPreview} alt="Chart" className="w-full max-h-48 object-contain rounded-xl border border-slate-200"/>
                <button onClick={()=>{setChartPreview('');set('chart_image_url','')}} className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                <label className="mt-1 flex items-center gap-1 text-xs text-emerald-600 cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleChartUpload(f)}}/><Upload className="w-3 h-3"/>Thay ảnh
                </label>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-emerald-400 transition-all ${!form.id?'opacity-50 cursor-not-allowed':''}`}>
                <input type="file" accept="image/*" className="hidden" disabled={!form.id} onChange={e=>{const f=e.target.files?.[0];if(f)handleChartUpload(f)}}/>
                {chartUploading?<><Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2"/><p className="text-sm text-slate-500">Đang upload...</p></>
                :<><Upload className="w-8 h-8 text-slate-300 mb-2"/><p className="text-sm text-slate-500">{form.id?'Upload chart':'Lưu plan trước'}</p></>}
              </label>
            )}
          </div>
        </div>
        <div className="p-5 border-t flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
            {saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Save className="w-3.5 h-3.5"/>}Lưu Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BlueprintTab() {
  const [section, setSection] = useState('plans')
  const [plans, setPlans] = useState<Plan[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [signalsDate, setSignalsDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [editPlan, setEditPlan] = useState<Partial<Plan>|null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [pr, pe, si] = await Promise.all([fetch('/api/advisor/admin?type=plans'),fetch('/api/advisor/admin?type=pending'),fetch('/api/advisor/update-prices')])
    const [pd, ped, sid] = await Promise.all([pr.json(),pe.json(),si.json()])
    if (Array.isArray(pd)) setPlans(pd)
    if (Array.isArray(ped)) setPending(ped)
    if (sid?.signals) { setSignals(sid.signals); setSignalsDate(sid.date||'') }
    setLoading(false)
  }, [])

  useEffect(()=>{loadData()},[loadData])

  async function handleSave(form: any) {
    await fetch('/api/advisor/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'upsert_plan',...form})})
    setEditPlan(null); loadData()
  }
  async function handleDelete(id:string,ticker:string) {
    if(!confirm(`Xoá plan ${ticker}?`)) return
    await fetch('/api/advisor/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete_plan',id})})
    loadData()
  }
  async function handlePending(id:string,status:string) {
    await fetch('/api/advisor/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update_pending_status',id,status})})
    loadData()
  }

  const fmt=(n:number|null)=>n?n.toLocaleString('vi-VN')+' ₫':'—'

  if(loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-6 h-6"/></div>

  const signalCfg: Record<string,{bg:string;border:string;icon:React.ReactNode}> = {
    reduce:{bg:'bg-rose-50',border:'border-rose-200',icon:<TrendingDown className="w-5 h-5 text-rose-500"/>},
    consider_buy:{bg:'bg-emerald-50',border:'border-emerald-200',icon:<TrendingUp className="w-5 h-5 text-emerald-600"/>},
    wait_pullback:{bg:'bg-slate-50',border:'border-slate-200',icon:<Clock className="w-5 h-5 text-slate-400"/>},
    sell:{bg:'bg-amber-50',border:'border-amber-200',icon:<DollarSign className="w-5 h-5 text-amber-500"/>},
    take_profit:{bg:'bg-orange-50',border:'border-orange-200',icon:<DollarSign className="w-5 h-5 text-orange-500"/>},
    unknown:{bg:'bg-slate-50',border:'border-slate-100',icon:<AlertTriangle className="w-5 h-5 text-slate-300"/>},
  }

  return (
    <div>
      {editPlan!==null && <PlanForm initial={editPlan} onSave={handleSave} onCancel={()=>setEditPlan(null)}/>}
      <div className="flex gap-1 bg-[#111827] border border-[#1e2535] rounded-xl p-1 mb-5 w-fit">
        {BLUEPRINT_SECTIONS.map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${section===s.id?'bg-emerald-600 text-white':'text-slate-400 hover:text-white'}`}>
            {s.label}
            {s.id==='pending'&&pending.filter(p=>p.status==='pending').length>0&&(
              <span className="ml-1.5 bg-rose-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">{pending.filter(p=>p.status==='pending').length}</span>
            )}
          </button>
        ))}
        <button onClick={loadData} className="py-2 px-3 text-slate-500 hover:text-white"><RefreshCw className="w-3.5 h-3.5"/></button>
      </div>

      {/* Trading Plans */}
      {section==='plans' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm">{plans.length} mã đang quản lý</p>
            <button onClick={()=>setEditPlan({})} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4"/>Thêm mã
            </button>
          </div>
          <div className="space-y-2">
            {plans.map(plan=>(
              <div key={plan.id} className="bg-[#111827] border border-[#1e2535] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${plan.status==='active'?'bg-emerald-900/60 text-emerald-400':'bg-slate-800 text-slate-500'}`}>{plan.ticker}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{plan.ticker} — {plan.company_name||'—'}</p>
                      {plan.chart_image_url&&<span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1"><ImageIcon className="w-3 h-3"/>Chart</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.strategy_name} · {plan.timeframe}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.status==='active'?'bg-emerald-900/60 text-emerald-400':'bg-slate-800 text-slate-500'}`}>
                    {plan.status==='active'?'Active':'Archived'}
                  </span>
                  <button onClick={()=>setEditPlan(plan)} className="p-2 hover:bg-[#1e2535] rounded-lg text-slate-500 hover:text-white transition-colors"><Pencil className="w-4 h-4"/></button>
                  <button onClick={()=>handleDelete(plan.id,plan.ticker)} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
            {plans.length===0&&<div className="text-center py-12 text-slate-500">Chưa có Trading Plan nào</div>}
          </div>
        </div>
      )}

      {/* Pending */}
      {section==='pending' && (
        <div>
          <p className="text-slate-400 text-sm mb-3"><span className="font-semibold text-rose-400">{pending.filter(p=>p.status==='pending').length}</span> chờ · tổng {pending.length}</p>
          <div className="space-y-2">
            {pending.map(p=>{
              const sColor={pending:'bg-amber-500/20 text-amber-400',in_progress:'bg-blue-500/20 text-blue-400',done:'bg-emerald-500/20 text-emerald-400'}[p.status]
              const sLabel={pending:'Chờ phân tích',in_progress:'Đang phân tích',done:'Hoàn thành'}[p.status as string]||p.status
              return (
                <div key={p.id} className="bg-[#111827] border border-[#1e2535] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xs font-bold text-amber-400">{p.ticker}</div>
                    <div><p className="font-semibold text-white">{p.ticker}</p>
                      <p className="text-xs text-slate-500">{p.requested_count} KH yêu cầu · {new Date(p.created_at).toLocaleDateString('vi-VN')}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sColor}`}>{sLabel}</span>
                    {p.status==='pending'&&<button onClick={()=>handlePending(p.id,'in_progress')} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Bắt đầu</button>}
                    {p.status==='in_progress'&&<button onClick={()=>setEditPlan({ticker:p.ticker})} className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Nhập Plan</button>}
                  </div>
                </div>
              )
            })}
            {pending.length===0&&<div className="text-center py-12"><CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/30"/><p className="text-slate-500">Không có mã chờ phân tích</p></div>}
          </div>
        </div>
      )}

      {/* Signals */}
      {section==='signals' && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            {signals.length>0?<><span className="font-semibold text-emerald-400">{signals.length} tín hiệu</span> · {signalsDate||'Hôm nay'}</>:'Chưa có tín hiệu hôm nay'}
          </p>
          {signals.length===0 ? (
            <div className="text-center py-16 bg-[#111827] rounded-2xl border border-[#1e2535]">
              <p className="text-4xl mb-3">📡</p>
              <p className="font-semibold text-slate-400">Script Python chạy lúc 3h chiều T2–T6</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signals.map(sig=>{
                const c=signalCfg[sig.signal_type]||signalCfg.unknown
                return (
                  <div key={sig.id} className={`rounded-2xl border p-4 ${c.bg} ${c.border}`}>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">{c.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-bold text-slate-800 text-base">{sig.ticker}</span>
                          <span className="text-sm font-semibold text-slate-700">{sig.signal_label}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">{sig.signal_detail}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span>💰 {sig.current_price.toLocaleString('vi-VN')} ₫</span>
                          <span>📥 {sig.plan_entry_low?`${fmt(sig.plan_entry_low)}–${fmt(sig.plan_entry_high)}`:'—'}</span>
                          <span>🛑 {fmt(sig.plan_sl)}</span>
                          <span>🎯 {fmt(sig.plan_tp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
