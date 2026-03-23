'use client'
import { useState, useCallback, useEffect } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────
type RawNews = { id: number; crawl_date: string; title: string; link: string | null; description: string | null; source: string | null; published_at: string | null; tags: string[]; category: string | null; tickers: string[]; relevance: 1|2|3; status: 'pending'|'approved'|'ignored' }
type ContentItem = { slug: string; title: string; pillar: string; date_label?: string }
type Campaign = { id: string; slug: string; campaign_name: string|null; content_type: string; status: string; agent_code: string; agent_name: string; views_7d: number; leads_7d: number; leads_total: number }
type Lead = { id: string; full_name: string|null; email: string|null; phone: string|null; ref_code: string; utm_source: string|null; status: string; crm_stage: string; notes: string|null; registered_at: string; agent_landing_pages: {slug: string; campaign_name: string|null}|null; sales_agents: {code: string; full_name: string}|null }
type Agent = { id: string; code: string; full_name: string; title: string|null; avatar_url: string|null; brand_color_accent: string|null; total_leads?: number; active_campaigns?: number }

const CRM_STAGES = [
  { id: 'new',       label: 'Mới',         badge: 'bg-blue-500/20 text-blue-400',    border: 'border-blue-500/30' },
  { id: 'contacted', label: 'Đã liên hệ',  badge: 'bg-amber-500/20 text-amber-400',  border: 'border-amber-500/30' },
  { id: 'qualified', label: 'Qualified',    badge: 'bg-purple-500/20 text-purple-400',border: 'border-purple-500/30' },
  { id: 'opened',    label: 'Mở TK KBSV',  badge: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30' },
]

const CLARITY_SECTIONS = [
  { id: 'news', label: '📡 News' },
  { id: 'lp',   label: '🚀 LP Workshop' },
  { id: 'campaigns', label: '📄 Campaigns' },
  { id: 'crm',  label: '🎯 Lead CRM' },
  { id: 'agents', label: '👥 Agents' },
]

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ClarityTab() {
  const [section, setSection] = useState('news')

  // News state
  const [rawNews, setRawNews] = useState<RawNews[]>([])
  const [rawDates, setRawDates] = useState<string[]>([])
  const [rawDate, setRawDate] = useState('')
  const [rawFilter, setRawFilter] = useState<'all'|'pending'|'approved'|'ignored'>('all')
  const [newsLoading, setNewsLoading] = useState(false)

  // LP Workshop state
  const [contentList, setContentList] = useState<ContentItem[]>([])
  const [contentType, setContentType] = useState<'macro_insight'|'knowledgebase'>('macro_insight')
  const [contentSlug, setContentSlug] = useState('')
  const [campaignName, setCampaignName] = useState('')
  const [agentCode, setAgentCode] = useState('mq01')
  const [targetHint, setTargetHint] = useState('')
  const [mixNews, setMixNews] = useState<RawNews|null>(null)
  const [generating, setGenerating] = useState(false)
  const [genResult, setGenResult] = useState<{preview_url:string;campaign_id:string}|null>(null)
  const [approving, setApproving] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])

  // Campaigns state
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(false)

  // CRM state
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [noteModal, setNoteModal] = useState<Lead|null>(null)
  const [noteText, setNoteText] = useState('')

  // ── Fetchers ──
  const fetchRawNews = useCallback(async (date?: string, status?: string) => {
    setNewsLoading(true)
    const p = new URLSearchParams()
    if (date) p.set('date', date)
    if (status && status !== 'all') p.set('status', status)
    const res = await fetch(`/api/admin/raw-news?${p}`)
    const data = await res.json()
    setRawNews(data.articles ?? [])
    if (data.available_dates?.length) {
      setRawDates(data.available_dates)
      if (!date) setRawDate(data.available_dates[0] ?? '')
    }
    setNewsLoading(false)
  }, [])

  const fetchContentList = useCallback(async (type: string) => {
    const res = await fetch(`/api/admin/content-list?type=${type}`)
    const { items } = await res.json()
    setContentList(items ?? [])
  }, [])

  const fetchCampaigns = useCallback(async () => {
    setCampaignsLoading(true)
    const res = await fetch('/api/admin/lp-campaigns')
    const { campaigns: data } = await res.json()
    setCampaigns(data ?? [])
    setCampaignsLoading(false)
  }, [])

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true)
    const res = await fetch('/api/admin/leads?limit=300')
    const { leads: data } = await res.json()
    setLeads(data ?? [])
    setLeadsLoading(false)
  }, [])

  const fetchAgents = useCallback(async () => {
    const res = await fetch('/api/admin/agents')
    const data = await res.json()
    setAgents(data.agents ?? [])
  }, [])

  useEffect(() => {
    fetchRawNews(); fetchContentList('macro_insight'); fetchCampaigns(); fetchLeads(); fetchAgents()
  }, [fetchRawNews, fetchContentList, fetchCampaigns, fetchLeads, fetchAgents])

  // ── Actions ──
  const actionNews = async (id: number, action: 'approve'|'ignore'|'pending') => {
    await fetch(`/api/admin/raw-news/${id}/action`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({action}) })
    setRawNews(prev => prev.map(a => a.id === id ? {...a, status: action === 'approve' ? 'approved' : action === 'ignore' ? 'ignored' : 'pending'} : a))
  }

  const generateLP = async () => {
    if (!contentSlug || !campaignName) return
    setGenerating(true); setGenResult(null)
    const res = await fetch('/api/admin/lp-campaigns/generate', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ agent_code: agentCode, content_type: contentType, content_slug: contentSlug, campaign_name: campaignName, target_audience_hint: targetHint,
        news_context: mixNews ? {title: mixNews.title, category: mixNews.category, analyst_view: mixNews.description, data_point: null} : undefined })
    })
    const data = await res.json()
    setGenerating(false)
    if (data.preview_url) { setGenResult({preview_url: `https://finpeace.cloud${data.preview_url}`, campaign_id: data.campaign_id}); fetchCampaigns() }
  }

  const approveLP = async (id: string) => {
    setApproving(true)
    await fetch(`/api/admin/lp-campaigns/${id}/approve`, {method:'POST'})
    setApproving(false); fetchCampaigns()
    setGenResult(prev => prev ? {...prev, campaign_id: ''} : null)
  }

  const updateCrmStage = async (lead: Lead, crm_stage: string) => {
    await fetch(`/api/admin/leads/${lead.id}/note`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({crm_stage})})
    setLeads(prev => prev.map(l => l.id === lead.id ? {...l, crm_stage} : l))
  }

  const saveNote = async () => {
    if (!noteModal) return
    await fetch(`/api/admin/leads/${noteModal.id}/note`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({notes: noteText})})
    setLeads(prev => prev.map(l => l.id === noteModal.id ? {...l, notes: noteText} : l))
    setNoteModal(null)
  }

  // ── Computed ──
  const crmGroups = CRM_STAGES.reduce((acc,s) => { acc[s.id] = leads.filter(l => (l.crm_stage||'new') === s.id); return acc }, {} as Record<string,Lead[]>)
  const totalViews = campaigns.reduce((s,c) => s+(c.views_7d||0),0)
  const totalLeadsC = campaigns.reduce((s,c) => s+(c.leads_7d||0),0)
  const cr = totalViews > 0 ? ((totalLeadsC/totalViews)*100).toFixed(1) : '—'

  const C = 'bg-[#111827] border-[#1e2535]'
  const inp = 'w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-[#c4a67a]/50'

  // ── RENDER ──
  return (
    <div>
      {/* Note modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl border ${C} p-5 w-full max-w-md`}>
            <p className="text-white font-semibold mb-3">Note: {noteModal.full_name}</p>
            <textarea rows={4} value={noteText} onChange={e=>setNoteText(e.target.value)} className={inp+' resize-none'} placeholder="Ghi chú..." />
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setNoteModal(null)} className="flex-1 py-2 text-sm text-slate-400 border border-[#1e2535] rounded-lg">Huỷ</button>
              <button onClick={saveNote} className="flex-1 py-2 text-sm bg-[#c4a67a] text-[#0d1119] rounded-lg font-semibold">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Bar */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-5">
        {[
          {l:'Views/7d', v:totalViews, ok: totalViews>=200},
          {l:'Leads/7d', v:totalLeadsC, ok: null},
          {l:'CR%', v:`${cr}%`, ok: parseFloat(cr)>=5},
          {l:'Mới', v:crmGroups['new']?.length||0, ok: null},
          {l:'Mở TK KBSV', v:crmGroups['opened']?.length||0, ok: true},
        ].map(s=>(
          <div key={s.l} className={`${C} border rounded-xl p-3 text-center ${s.ok===true?'border-emerald-500/30':s.ok===false?'border-red-500/30':''}`}>
            <p className={`text-xl font-bold ${s.ok===true?'text-emerald-400':s.ok===false?'text-red-400':'text-white'}`}>{s.v}</p>
            <p className="text-slate-500 text-xs">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className={`flex gap-1 bg-[#111827] border ${C} rounded-xl p-1 mb-5`}>
        {CLARITY_SECTIONS.map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${section===s.id?'bg-[#c4a67a] text-[#0d1119]':'text-slate-400 hover:text-white'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── News Intelligence ── */}
      {section === 'news' && (
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="text-white font-semibold">📡 Tin Tức Crawl</p>
              <p className="text-slate-500 text-xs">{rawNews.filter(a=>a.status==='pending').length} chưa duyệt / {rawNews.length} tổng</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={rawDate} onChange={e=>{setRawDate(e.target.value);fetchRawNews(e.target.value,rawFilter)}}
                className="bg-[#1e2535] text-slate-300 text-xs rounded-lg px-2 py-1.5 border border-[#2a3548]">
                {rawDates.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
              {(['all','pending','approved','ignored'] as const).map(s=>(
                <button key={s} onClick={()=>{setRawFilter(s);fetchRawNews(rawDate||undefined,s)}}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${rawFilter===s?'bg-[#c4a67a] text-[#0d1119] font-semibold':'bg-[#1e2535] text-slate-400 hover:bg-[#2a3548]'}`}>
                  {s==='all'?'Tất cả':s==='pending'?'Chưa duyệt':s==='approved'?'Đã duyệt':'Bỏ qua'}
                </button>
              ))}
              <button onClick={()=>fetchRawNews(rawDate||undefined,rawFilter)} className="px-2.5 py-1.5 bg-[#1e2535] text-slate-400 rounded-lg text-xs">🔄</button>
            </div>
          </div>
          {newsLoading ? <div className="h-40 flex items-center justify-center text-slate-500">Đang tải...</div> : (
            <div className="space-y-2">
              {rawNews.map(a=>(
                <div key={a.id} className={`bg-[#111827] border border-[#1e2535] rounded-xl p-4 ${a.status==='ignored'?'opacity-40':''}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-0.5 mt-1 shrink-0">
                      {[3,2,1].map(r=><span key={r} className={`w-1.5 h-1.5 rounded-full ${a.relevance>=r?(r===3?'bg-red-500':r===2?'bg-amber-500':'bg-slate-500'):'bg-[#1e2535]'}`}/>)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs bg-[#1e2535] text-slate-500 px-1.5 py-0.5 rounded">{a.source}</span>
                        {a.category && <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{a.category}</span>}
                        <span className={`text-xs px-1.5 py-0.5 rounded ${a.status==='approved'?'bg-emerald-500/20 text-emerald-400':a.status==='ignored'?'bg-red-500/10 text-red-500/60':'bg-slate-500/20 text-slate-400'}`}>
                          {a.status==='approved'?'✓ Đã duyệt':a.status==='ignored'?'✕ Bỏ qua':'Chờ duyệt'}
                        </span>
                        {a.published_at && <span className="text-xs text-slate-600 ml-auto">{fmtDate(a.published_at)}</span>}
                      </div>
                      <a href={a.link??'#'} target="_blank" rel="noreferrer" className="font-medium text-white text-sm hover:text-[#c4a67a] line-clamp-2">{a.title}</a>
                      {a.description && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{a.description}</p>}
                    </div>
                    <div className="shrink-0 flex flex-col gap-1.5">
                      {a.status !== 'approved' && <button onClick={()=>actionNews(a.id,'approve')} className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-600/40">✅ Duyệt</button>}
                      <button onClick={()=>{setMixNews(a);setSection('lp')}} className="px-2.5 py-1 bg-[#c4a67a]/20 text-[#c4a67a] rounded-lg text-xs hover:bg-[#c4a67a]/40">🚀 LP</button>
                      {a.status !== 'ignored' && <button onClick={()=>actionNews(a.id,'ignore')} className="px-2.5 py-1 bg-red-500/10 text-red-400/70 rounded-lg text-xs hover:bg-red-500/20">✕</button>}
                    </div>
                  </div>
                </div>
              ))}
              {rawNews.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">Chưa có tin — chạy crawl_raw_news.py</div>}
            </div>
          )}
        </div>
      )}

      {/* ── LP Workshop ── */}
      {section === 'lp' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className={`bg-[#111827] border ${C} rounded-2xl p-5 space-y-4`}>
            <p className="text-white font-semibold">🚀 Tạo Landing Page với AI</p>
            <div>
              <label className="text-slate-500 text-xs block mb-1">Sales Agent</label>
              <select value={agentCode} onChange={e=>setAgentCode(e.target.value)} className={inp}>
                {agents.map(a=><option key={a.code} value={a.code}>{a.full_name} ({a.code})</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs block mb-1">Loại nội dung</label>
              <select value={contentType} onChange={e=>{const t=e.target.value as any;setContentType(t);setContentSlug('');fetchContentList(t)}} className={inp}>
                <option value="macro_insight">📊 Macro Insight</option>
                <option value="knowledgebase">📚 KB Article</option>
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs block mb-1">Nội dung</label>
              <select value={contentSlug} onChange={e=>setContentSlug(e.target.value)} className={inp}>
                <option value="">— Chọn —</option>
                {contentList.map(c=><option key={c.slug} value={c.slug}>[{c.pillar}] {c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs block mb-1">Tên Campaign</label>
              <input value={campaignName} onChange={e=>setCampaignName(e.target.value)} placeholder="KBSV March 2026" className={inp}/>
            </div>
            <div>
              <label className="text-slate-500 text-xs block mb-1">Target Audience</label>
              <input value={targetHint} onChange={e=>setTargetHint(e.target.value)} placeholder="Korean expats lo lắng về lãi suất" className={inp}/>
            </div>
            {mixNews && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-400 text-xs mt-0.5">📰</span>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-400 text-xs font-medium">Mix tin tức:</p>
                  <p className="text-white text-xs truncate">{mixNews.title}</p>
                </div>
                <button onClick={()=>setMixNews(null)} className="text-amber-400 text-xs">✕</button>
              </div>
            )}
            {genResult && (
              <div className="bg-[#0d1119] border border-[#c4a67a]/40 rounded-xl p-4 space-y-2">
                <p className="text-emerald-400 text-sm font-semibold">✅ LP đã tạo thành công</p>
                <a href={genResult.preview_url} target="_blank" className="block w-full py-2 bg-[#1e2535] text-slate-300 rounded-lg text-sm text-center">👁️ Preview</a>
                {genResult.campaign_id && <button onClick={()=>approveLP(genResult.campaign_id)} disabled={approving}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {approving?'⏳ Đang duyệt...':'✅ Publish ngay'}
                </button>}
              </div>
            )}
            <button onClick={generateLP} disabled={generating||!contentSlug||!campaignName}
              className="w-full py-2.5 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold disabled:opacity-50">
              {generating?'⏳ AI đang generate...':'✨ Generate Campaign'}
            </button>
          </div>
          {/* Raw news picker */}
          <div className={`bg-[#111827] border ${C} rounded-2xl p-5`}>
            <p className="text-white font-semibold mb-2 text-sm">Mix Tin Tức (tùy chọn)</p>
            <p className="text-slate-500 text-xs mb-3">Chọn 1 tin → AI inject vào hook + nội dung</p>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {rawNews.filter(a=>a.status!=='ignored').map(a=>(
                <button key={a.id} onClick={()=>setMixNews(n=>n?.id===a.id?null:a)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${mixNews?.id===a.id?'border-[#c4a67a] bg-[#c4a67a]/10':'border-[#1e2535] bg-[#0d1119] hover:border-[#2a3548]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#1e2535] text-slate-500 px-1.5 py-0.5 rounded">{a.source}</span>
                    {a.status==='approved'&&<span className="text-emerald-400">✓</span>}
                  </div>
                  <p className="text-white line-clamp-2">{a.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Campaigns ── */}
      {section === 'campaigns' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold">📄 LP Campaigns ({campaigns.length})</p>
            <button onClick={fetchCampaigns} className="text-xs text-slate-400 bg-[#1e2535] px-3 py-1.5 rounded-lg">🔄</button>
          </div>
          {campaignsLoading ? <div className="h-24 flex items-center justify-center text-slate-500 text-sm">Đang tải...</div> : (
            <div className="space-y-2">
              {campaigns.map(c=>(
                <div key={c.id} className={`bg-[#111827] border ${C} rounded-xl p-4 flex items-center justify-between gap-3`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status==='active'?'bg-emerald-500/20 text-emerald-400':c.status==='pending_review'?'bg-amber-500/20 text-amber-400':'bg-slate-500/20 text-slate-400'}`}>
                        {c.status==='active'?'Live':c.status==='pending_review'?'Review':'Draft'}
                      </span>
                      <span className="text-[#c4a67a] text-xs font-mono">{c.agent_name||c.agent_code}</span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{c.campaign_name||c.slug}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      <span>👁️ {c.views_7d} views/7d</span>
                      <span>👤 {c.leads_7d} leads/7d</span>
                      <span>📊 {c.leads_total} total</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`https://finpeace.cloud/lp/${c.slug}`} target="_blank" className="text-xs px-2.5 py-1 bg-[#1e2535] text-slate-400 rounded-lg hover:bg-[#2a3548]">👁️</a>
                    {c.status==='pending_review' && (
                      <button onClick={async()=>{await fetch(`/api/admin/lp-campaigns/${c.id}/approve`,{method:'POST'});fetchCampaigns()}}
                        className="text-xs px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/40">✅ Publish</button>
                    )}
                  </div>
                </div>
              ))}
              {campaigns.length===0 && <div className="text-center py-12 text-slate-500 text-sm">Chưa có campaign</div>}
            </div>
          )}
        </div>
      )}

      {/* ── Lead CRM ── */}
      {section === 'crm' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold">🎯 Lead CRM — {leads.length} leads</p>
            <button onClick={fetchLeads} className="text-xs text-slate-400 bg-[#1e2535] px-3 py-1.5 rounded-lg">🔄</button>
          </div>
          {leadsLoading ? <div className="h-24 flex items-center justify-center text-slate-500">Đang tải...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {CRM_STAGES.map(stage=>(
                <div key={stage.id} className={`bg-[#111827] border ${stage.border} rounded-2xl overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-[#1e2535] flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>{stage.label}</span>
                    <span className="text-slate-500 text-xs">{crmGroups[stage.id]?.length||0}</span>
                  </div>
                  <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                    {(crmGroups[stage.id]||[]).map(lead=>(
                      <div key={lead.id} className="bg-[#0d1119] border border-[#1e2535] rounded-xl p-3">
                        <p className="text-white text-sm font-medium">{lead.full_name||'—'}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{lead.phone||lead.email||'—'}</p>
                        <p className="text-[#c4a67a] text-xs mt-1">{lead.sales_agents?.full_name||lead.ref_code}</p>
                        {lead.notes && <p className="text-slate-500 text-xs mt-1 line-clamp-1 italic">{lead.notes}</p>}
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {CRM_STAGES.filter(s=>s.id!==stage.id).map(s=>(
                            <button key={s.id} onClick={()=>updateCrmStage(lead,s.id)}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${s.badge} hover:opacity-80 transition-opacity`}>
                              →{s.label}
                            </button>
                          ))}
                          <button onClick={()=>{setNoteModal(lead);setNoteText(lead.notes||'')}}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400 ml-auto">📝</button>
                        </div>
                      </div>
                    ))}
                    {(crmGroups[stage.id]||[]).length===0 && <p className="text-center text-slate-600 text-xs py-4">Trống</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Agents ── */}
      {section === 'agents' && (
        <div>
          <p className="text-white font-semibold mb-3">👥 Sales Agents ({agents.length})</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(a=>(
              <div key={a.id} className={`bg-[#111827] border ${C} rounded-2xl p-4 flex items-center gap-4`}>
                {a.avatar_url
                  ? <img src={a.avatar_url} alt={a.full_name} className="w-12 h-12 rounded-xl object-cover shrink-0" style={{border:`2px solid ${a.brand_color_accent||'#c4a67a'}40`}}/>
                  : <div className="w-12 h-12 rounded-xl bg-[#1e2535] flex items-center justify-center text-lg font-bold text-white shrink-0">{a.full_name.charAt(0)}</div>
                }
                <div className="min-w-0">
                  <p className="text-white font-semibold">{a.full_name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{a.title||'Agent'} · <span style={{color:a.brand_color_accent||'#c4a67a'}}>#{a.code}</span></p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-slate-500">👤 {leads.filter(l=>l.ref_code===a.code).length} leads</span>
                    <span className="text-xs text-slate-500">📄 {campaigns.filter(c=>c.agent_code===a.code&&c.status==='active').length} LPs</span>
                  </div>
                </div>
              </div>
            ))}
            {agents.length===0 && <div className="text-center py-12 text-slate-500 col-span-3">Chưa có agents</div>}
          </div>
        </div>
      )}
    </div>
  )
}
