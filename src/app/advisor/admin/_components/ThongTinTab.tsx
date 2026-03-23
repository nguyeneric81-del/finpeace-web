'use client'
import { useState, useCallback, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Save, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'

type BehindStory = { point: string; quote: string; source: string }
type KeyStat = { label: string; value: string; positive?: boolean }
type Company = { ticker: string; name: string; plan?: string }
type ChartPoint = { name: string; value: number }
type Insight = { id?: string; title: string; category: string; date_label: string; accent_color: string; data_point: string; narrow_industry: string; impact_value: string; impact_positive: boolean; analyst_view: string; analyst_sources: string[]; behind_story: BehindStory[]; key_stats: KeyStat[]; companies: Company[]; chart_data: ChartPoint[]; chart_label: string; chart_color: string; cycle_lagging: string; cycle_leading: string; published: boolean }

const EMPTY_INSIGHT: Insight = { title:'', category:'Chính sách Tiền tệ', date_label:'Tháng 3, 2026', accent_color:'#10b981', data_point:'', narrow_industry:'', impact_value:'', impact_positive:true, analyst_view:'', analyst_sources:[], behind_story:[{point:'',quote:'',source:''}], key_stats:[{label:'',value:'',positive:true}], companies:[{ticker:'',name:''}], chart_data:[], chart_label:'', chart_color:'#34d399', cycle_lagging:'', cycle_leading:'', published:false }

const CATEGORIES = ['Chuỗi Cung Ứng','Chính sách Tiền tệ','Đầu tư Nước ngoài','Hạ tầng & Tăng trưởng','Ngành Tiêu dùng','Bất động sản','Năng lượng','Tài chính - Ngân hàng','Công nghệ & Bán dẫn']

const inp = 'w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400'
const ta  = inp + ' resize-none'
const lbl = 'text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide'

function Sec({title,children,color='emerald'}:{title:string;children:React.ReactNode;color?:string}) {
  const [open,setOpen]=useState(true)
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{title}</span>
        {open?<ChevronUp className="w-4 h-4 text-slate-400"/>:<ChevronDown className="w-4 h-4 text-slate-400"/>}
      </button>
      {open&&<div className="p-5 space-y-4">{children}</div>}
    </div>
  )
}

function InsightForm({initial,onSave,onCancel}:{initial:Partial<Insight>;onSave:(d:Insight)=>void;onCancel:()=>void}) {
  const [f,setF]=useState<Insight>({...EMPTY_INSIGHT,...initial})
  const [saving,setSaving]=useState(false)
  const set=(k:keyof Insight,v:any)=>setF(p=>({...p,[k]:v}))

  const addBehind=()=>set('behind_story',[...f.behind_story,{point:'',quote:'',source:''}])
  const removeBehind=(i:number)=>set('behind_story',f.behind_story.filter((_,j)=>j!==i))
  const setBehind=(i:number,k:keyof BehindStory,v:string)=>set('behind_story',f.behind_story.map((r,j)=>j===i?{...r,[k]:v}:r))
  const addStat=()=>set('key_stats',[...f.key_stats,{label:'',value:'',positive:true}])
  const removeStat=(i:number)=>set('key_stats',f.key_stats.filter((_,j)=>j!==i))
  const setStat=(i:number,k:keyof KeyStat,v:any)=>set('key_stats',f.key_stats.map((r,j)=>j===i?{...r,[k]:v}:r))
  const addCompany=()=>set('companies',[...f.companies,{ticker:'',name:''}])
  const removeCompany=(i:number)=>set('companies',f.companies.filter((_,j)=>j!==i))
  const setCompany=(i:number,k:keyof Company,v:string)=>set('companies',f.companies.map((r,j)=>j===i?{...r,[k]:v}:r))

  async function handleSave() {
    if(!f.title) return alert('Cần tiêu đề')
    setSaving(true); await onSave(f); setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-slate-800">{initial.id?'Chỉnh sửa Insight':'Thêm Macro Insight'}</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-slate-400"/></button>
        </div>
        <div className="p-6 space-y-4 max-h-[76vh] overflow-y-auto">
          <Sec title="Thông tin cơ bản">
            <div><label className={lbl}>Tiêu đề *</label><input value={f.title} onChange={e=>set('title',e.target.value)} placeholder="VD: Chi phí logistics toàn cầu leo thang..." className={inp}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Danh mục</label><select value={f.category} onChange={e=>set('category',e.target.value)} className={inp}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className={lbl}>Tháng hiển thị</label><input value={f.date_label} onChange={e=>set('date_label',e.target.value)} placeholder="Tháng 3, 2026" className={inp}/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Màu accent</label>
                <div className="flex items-center gap-2"><input type="color" value={f.accent_color} onChange={e=>set('accent_color',e.target.value)} className="w-10 h-9 rounded-lg border cursor-pointer p-1"/><input value={f.accent_color} onChange={e=>set('accent_color',e.target.value)} className={inp}/></div>
              </div>
              <div><label className={lbl}>Tác động</label>
                <div className="flex gap-2 mt-2">
                  <button onClick={()=>set('impact_positive',true)} className={`flex-1 py-2 rounded-xl text-sm font-bold ${f.impact_positive?'bg-emerald-600 text-white':'bg-slate-100 text-slate-500'}`}>↑ Tích cực</button>
                  <button onClick={()=>set('impact_positive',false)} className={`flex-1 py-2 rounded-xl text-sm font-bold ${!f.impact_positive?'bg-rose-500 text-white':'bg-slate-100 text-slate-500'}`}>↓ Tiêu cực</button>
                </div>
              </div>
            </div>
            <div><label className={lbl}>Mô tả tác động</label><textarea value={f.impact_value} onChange={e=>set('impact_value',e.target.value)} rows={2} placeholder="Biên lợi nhuận tăng +8–12%..." className={ta}/></div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <input type="checkbox" id="pub" checked={f.published} onChange={e=>set('published',e.target.checked)} className="w-4 h-4 text-emerald-600 rounded"/>
              <label htmlFor="pub" className="text-sm font-bold text-emerald-900 cursor-pointer">Publish (hiện trên Macro Insights)</label>
            </div>
          </Sec>

          <Sec title="Dữ liệu & Phân tích" color="sky">
            <div><label className={lbl}>Data Point</label><textarea value={f.data_point} onChange={e=>set('data_point',e.target.value)} rows={2} placeholder="SCFI tăng +35% YTD..." className={ta}/></div>
            <div><label className={lbl}>Ngành hẹp</label><input value={f.narrow_industry} onChange={e=>set('narrow_industry',e.target.value)} placeholder="Vận tải biển Quốc tế" className={inp}/></div>
            <div><label className={lbl}>Analyst View</label><textarea value={f.analyst_view} onChange={e=>set('analyst_view',e.target.value)} rows={3} placeholder="Nhận định tổng quan..." className={ta}/></div>
            <div><label className={lbl}>Nguồn (phân cách bằng dấu phẩy)</label><input value={(f.analyst_sources||[]).join(', ')} onChange={e=>set('analyst_sources',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} placeholder="VCBS, SSI Research" className={inp}/></div>
          </Sec>

          <Sec title="Key Stats" color="amber">
            {f.key_stats.map((s,i)=>(
              <div key={i} className="flex gap-2 items-start border border-slate-100 rounded-xl p-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div><label className={lbl}>Giá trị</label><input value={s.value} onChange={e=>setStat(i,'value',e.target.value)} placeholder="+28%" className={inp}/></div>
                  <div><label className={lbl}>Nhãn</label><input value={s.label} onChange={e=>setStat(i,'label',e.target.value)} placeholder="Tăng trưởng" className={inp}/></div>
                  <div className="col-span-2 flex gap-2">
                    <button onClick={()=>setStat(i,'positive',true)} className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive!==false?'bg-emerald-600 text-white':'bg-slate-100 text-slate-500'}`}>↑ Xanh</button>
                    <button onClick={()=>setStat(i,'positive',false)} className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive===false?'bg-rose-500 text-white':'bg-slate-100 text-slate-500'}`}>↓ Đỏ</button>
                    <button onClick={()=>setStat(i,'positive',undefined)} className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive===undefined?'bg-slate-600 text-white':'bg-slate-100 text-slate-500'}`}>Trung tính</button>
                  </div>
                </div>
                <button onClick={()=>removeStat(i)} className="text-rose-400"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            <button onClick={addStat} className="flex items-center gap-2 text-sm text-amber-600 font-bold"><Plus className="w-4 h-4"/>Thêm số liệu</button>
          </Sec>

          <Sec title="Cổ phiếu trọng điểm" color="rose">
            {f.companies.map((c,i)=>(
              <div key={i} className="flex gap-2 items-end">
                <div className="w-28"><label className={lbl}>Ticker</label><input value={c.ticker} onChange={e=>setCompany(i,'ticker',e.target.value.toUpperCase())} placeholder="HPG" className={inp}/></div>
                <div className="flex-1"><label className={lbl}>Tên công ty</label><input value={c.name} onChange={e=>setCompany(i,'name',e.target.value)} placeholder="Hòa Phát" className={inp}/></div>
                <button onClick={()=>removeCompany(i)} className="pb-2 text-rose-400"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            <button onClick={addCompany} className="flex items-center gap-2 text-sm text-rose-600 font-bold"><Plus className="w-4 h-4"/>Thêm cổ phiếu</button>
          </Sec>

          <Sec title="Behind Story" color="violet">
            {f.behind_story.map((b,i)=>(
              <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between"><span className="text-xs font-black text-violet-600 uppercase">Sự kiện {i+1}</span><button onClick={()=>removeBehind(i)}><Trash2 className="w-4 h-4 text-rose-400"/></button></div>
                <div><label className={lbl}>Nội dung</label><textarea value={b.point} onChange={e=>setBehind(i,'point',e.target.value)} rows={2} placeholder="Điều gì xảy ra?" className={ta}/></div>
                <div><label className={lbl}>Quote</label><textarea value={b.quote} onChange={e=>setBehind(i,'quote',e.target.value)} rows={2} placeholder="Trích dẫn..." className={ta}/></div>
                <div><label className={lbl}>Nguồn</label><input value={b.source} onChange={e=>setBehind(i,'source',e.target.value)} placeholder="Bộ GTVT · Q1/2026" className={inp}/></div>
              </div>
            ))}
            <button onClick={addBehind} className="flex items-center gap-2 text-sm text-violet-600 font-bold"><Plus className="w-4 h-4"/>Thêm sự kiện</button>
          </Sec>
        </div>
        <div className="p-6 border-t flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Huỷ</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
            {saving?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<Save className="w-3.5 h-3.5"/>}{f.published?'Lưu & Publish':'Lưu nháp'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ThongTinTab() {
  const [section, setSection] = useState('macro')
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Insight>|null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/advisor/macro-insights')
    const data = await res.json()
    if (Array.isArray(data)) setInsights(data)
    setLoading(false)
  }, [])

  useEffect(()=>{load()},[load])

  async function handleSave(form: Insight) {
    await fetch('/api/advisor/macro-insights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    setEditing(null); load()
  }
  async function handleDelete(ins: Insight) {
    if(!confirm(`Xoá "${ins.title}"?`)) return
    await fetch('/api/advisor/macro-insights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',id:ins.id})})
    load()
  }
  async function togglePublish(ins: Insight) {
    await fetch('/api/advisor/macro-insights',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...ins,published:!ins.published})})
    load()
  }

  return (
    <div>
      {editing !== null && <InsightForm initial={editing} onSave={handleSave} onCancel={()=>setEditing(null)}/>}

      <div className="flex gap-1 bg-[#111827] border border-[#1e2535] rounded-xl p-1 mb-5 w-fit">
        {[{id:'macro',label:'📈 Macro Insights'},{id:'kb',label:'📚 KB Requests'}].map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${section===s.id?'bg-[#c4a67a] text-[#0d1119]':'text-slate-400 hover:text-white'}`}>{s.label}</button>
        ))}
      </div>

      {section === 'macro' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm">{insights.filter(i=>i.published).length}/{insights.length} đang publish</p>
            <button onClick={()=>setEditing({})} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4"/>Thêm Insight
            </button>
          </div>
          {loading ? <div className="h-24 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-6 h-6"/></div> : (
            <div className="space-y-3">
              {insights.map(ins=>(
                <div key={ins.id} className="bg-[#111827] border border-[#1e2535] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{background:ins.accent_color}}/>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white truncate">{ins.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${ins.published?'bg-emerald-500/20 text-emerald-400':'bg-slate-500/20 text-slate-400'}`}>{ins.published?'✓ Live':'Nháp'}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ins.category} · {ins.date_label} · {(ins.companies||[]).map(c=>c.ticker).join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={()=>togglePublish(ins)} className="p-2 hover:bg-[#1e2535] rounded-lg text-slate-500 hover:text-emerald-400" title={ins.published?'Unpublish':'Publish'}>
                      {ins.published?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                    </button>
                    <button onClick={()=>setEditing(ins)} className="p-2 hover:bg-[#1e2535] rounded-lg text-slate-500 hover:text-white"><Pencil className="w-4 h-4"/></button>
                    <button onClick={()=>handleDelete(ins)} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-400"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
              {insights.length===0&&<div className="text-center py-12 text-slate-500">Chưa có insight nào</div>}
            </div>
          )}
        </div>
      )}

      {section === 'kb' && (
        <div className="text-center py-16 bg-[#111827] border border-[#1e2535] rounded-2xl">
          <p className="text-3xl mb-3">📚</p>
          <p className="text-white font-semibold">KB Requests</p>
          <p className="text-slate-500 text-sm mt-1">Yêu cầu phân tích từ khách hàng</p>
          <p className="text-slate-600 text-xs mt-2">Coming soon — đang migrate từ hệ thống cũ</p>
        </div>
      )}
    </div>
  )
}
