'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ─── Clarity Metrics Types ────────────────────────────────────────────────────
type ClarityMetrics = {
  kpis: {
    views_7d: number
    leads_7d: number
    cr_pct: number
    valid_phone_rate: number
    cac: number | null
    total_leads_all_time: number
  }
  funnel: {
    views: number
    new: number
    contacted: number
    qualified: number
    opened: number
  }
  by_campaign: Array<{
    id: string
    slug: string | null
    campaign_name: string | null
    status: string | null
    agent_code: string | null
    agent_name: string | null
    views_7d: number | null
    leads_7d: number | null
    budget_allocated: number | null
  }>
  by_agent: Array<{
    agent_code: string
    agent_name: string
    views: number
    leads: number
    campaigns: number
    cr: number
  }>
  content: {
    top_by_views: Array<{ slug: string; content_type: string; pillar: string | null; views: number }>
    top_by_reactions: Array<{ slug: string; content_type: string; pillar: string | null; likes: number; loves: number; total: number }>
  }
  kb_requests: {
    counts: { pending: number; completed: number; expired: number }
    pending: Array<{
      id: string; user_email: string; user_name: string | null; user_phone: string | null
      content_type: string; content_slug: string; content_title: string | null
      status: string; requested_at: string; expires_at: string
    }>
  }
}

type Campaign = {
  id: string
  slug: string
  campaign_name: string | null
  content_type: 'macro_insight' | 'knowledgebase'
  status: 'generating' | 'draft' | 'pending_review' | 'active' | 'paused'
  budget_allocated: number
  budget_spent: number
  utm_source: string | null
  utm_campaign: string | null
  approved_at: string | null
  agent_code: string
  agent_name: string
  brand_color_accent: string
  views_7d: number
  leads_7d: number
  leads_total: number
  cpa?: number
  generated_hook?: string
}

const STATUS_CONFIG = {
  active:          { label: 'Active',          bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: '●' },
  draft:           { label: 'Draft',           bg: 'bg-blue-500/20',    text: 'text-blue-400',    dot: '◉' },
  pending_review:  { label: 'Needs Edit',      bg: 'bg-amber-500/20',   text: 'text-amber-400',   dot: '◎' },
  generating:      { label: 'Generating...',   bg: 'bg-purple-500/20',  text: 'text-purple-400',  dot: '○' },
  paused:          { label: 'Paused',          bg: 'bg-slate-500/20',   text: 'text-slate-400',   dot: '◌' },
}

const CONTENT_TYPE_LABEL = { macro_insight: '📊 Macro', knowledgebase: '📚 KB Article' }

function fmtVND(n: number) {
  if (!n) return '—'
  return (n / 1_000_000).toFixed(1) + 'M'
}
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) }

type RawNewsArticle = {
  id: number; crawl_date: string; title: string; link: string | null
  description: string | null; source: string | null; published_at: string | null
  tags: string[]; category: string | null; tickers: string[]; relevance: 1|2|3
  status: 'pending' | 'approved' | 'ignored'
}
type ContentItem = { slug: string; title: string; pillar: string }
type Lead = {
  id: string; full_name: string | null; email: string | null; phone: string | null
  ref_code: string; utm_source: string | null; status: string; crm_stage: string
  notes: string | null; registered_at: string
  agent_landing_pages: { slug: string; campaign_name: string | null } | null
  sales_agents: { code: string; full_name: string } | null
}
const CRM_STAGES = [
  { id:'new', label:'Mới', badge:'bg-blue-500/20 text-blue-400' },
  { id:'contacted', label:'Đã liên hệ', badge:'bg-amber-500/20 text-amber-400' },
  { id:'qualified', label:'Qualified', badge:'bg-purple-500/20 text-purple-400' },
  { id:'opened', label:'Mở TK KBSV', badge:'bg-emerald-500/20 text-emerald-400' },
]

export default function LpManagerPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'clarity'>('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [clarityMetrics, setClarityMetrics] = useState<ClarityMetrics | null>(null)
  const [clarityLoading, setClarityLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editNotes, setEditNotes] = useState<{ id: string; notes: string } | null>(null)
  const [campaignSubTab, setCampaignSubTab] = useState<'list'|'news'|'workshop'|'crm'|'perf'>('list')
  const [rawNews, setRawNews] = useState<RawNewsArticle[]>([])
  const [rawNewsDates, setRawNewsDates] = useState<string[]>([])
  const [rawNewsDate, setRawNewsDate] = useState('')
  const [rawNewsFilter, setRawNewsFilter] = useState<'all'|'pending'|'approved'|'ignored'>('all')
  const [loadingRawNews, setLoadingRawNews] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [contentList, setContentList] = useState<ContentItem[]>([])
  const [wsNewsMix, setWsNewsMix] = useState<RawNewsArticle|null>(null)
  const [wsGenerating, setWsGenerating] = useState(false)
  const [wsResult, setWsResult] = useState<{preview_url:string;campaign_id:string;campaign_name:string}|null>(null)
  const [wsApproving, setWsApproving] = useState(false)
  const [wsForm, setWsForm] = useState({ agent_code:'mq01', content_type:'macro_insight' as 'macro_insight'|'knowledgebase', content_slug:'', campaign_name:'', target_audience_hint:'', utm_source:'' })
  const [noteModal, setNoteModal] = useState<Lead|null>(null)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [utmModal, setUtmModal] = useState<Campaign | null>(null)
  const [generating, setGenerating] = useState(false)
  const [createForm, setCreateForm] = useState({
    agent_code: 'huyen04',
    content_type: 'macro_insight' as 'macro_insight' | 'knowledgebase',
    content_slug: '',
    campaign_name: '',
    target_audience_hint: '',
    budget_allocated: 0,
    utm_source: '',
    utm_campaign: '',
  })

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/lp-campaigns')
    const { campaigns: data } = await res.json()
    setCampaigns(data ?? [])
    setLoading(false)
  }, [])

  const fetchClarityMetrics = useCallback(async () => {
    setClarityLoading(true)
    try {
      const res = await fetch('/api/admin/clarity-metrics')
      const data = await res.json()
      setClarityMetrics(data)
    } catch (e) { console.error('Failed to fetch clarity metrics', e) }
    finally { setClarityLoading(false) }
  }, [])

  const fetchRawNews = useCallback(async (date?: string, status?: string) => {
    setLoadingRawNews(true)
    const p = new URLSearchParams()
    if (date) p.set('date', date)
    if (status && status !== 'all') p.set('status', status)
    const res = await fetch(`/api/admin/raw-news?${p}`)
    const data = await res.json()
    setRawNews(data.articles ?? [])
    if (data.available_dates?.length) {
      setRawNewsDates(data.available_dates)
      if (!date && data.available_dates[0]) setRawNewsDate(data.available_dates[0])
    }
    setLoadingRawNews(false)
  }, [])

  const actionRawNews = async (id: number, action: 'approve'|'ignore'|'pending') => {
    await fetch(`/api/admin/raw-news/${id}/action`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ action }) })
    setRawNews(prev => prev.map(a => a.id === id ? { ...a, status: action==='approve'?'approved':action==='ignore'?'ignored':'pending' } : a))
  }

  const fetchLeads = useCallback(async () => {
    setLoadingLeads(true)
    const res = await fetch('/api/admin/leads?limit=300')
    const { leads: data } = await res.json()
    setLeads(data ?? [])
    setLoadingLeads(false)
  }, [])

  const fetchContentList = useCallback(async (type: string) => {
    const res = await fetch(`/api/admin/content-list?type=${type}`)
    const { items } = await res.json()
    setContentList(items ?? [])
  }, [])

  const wsGenerate = async () => {
    if (!wsForm.content_slug || !wsForm.campaign_name) return
    setWsGenerating(true); setWsResult(null)
    const res = await fetch('/api/admin/lp-campaigns/generate', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...wsForm, news_context: wsNewsMix ? { title:wsNewsMix.title, category:wsNewsMix.category, analyst_view:wsNewsMix.description, data_point:null } : undefined }),
    })
    const data = await res.json(); setWsGenerating(false)
    if (data.preview_url) setWsResult({ preview_url:`https://finpeace.cloud${data.preview_url}`, campaign_id:data.campaign_id, campaign_name:wsForm.campaign_name })
    fetchCampaigns()
  }
  const wsApprove = async (id: string) => {
    setWsApproving(true)
    await fetch(`/api/admin/lp-campaigns/${id}/approve`, { method:'POST' })
    setWsApproving(false); setWsResult(prev => prev ? { ...prev, campaign_id:'' } : null); fetchCampaigns()
  }
  const updateCrmStage = async (lead: Lead, crm_stage: string) => {
    await fetch(`/api/admin/leads/${lead.id}/note`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ crm_stage }) })
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, crm_stage } : l))
  }
  const saveNote = async () => {
    if (!noteModal) return; setSavingNote(true)
    await fetch(`/api/admin/leads/${noteModal.id}/note`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ notes:noteText }) })
    setSavingNote(false); setLeads(prev => prev.map(l => l.id === noteModal.id ? { ...l, notes:noteText } : l)); setNoteModal(null)
  }

  useEffect(() => { fetchCampaigns() }, [fetchCampaigns])
  useEffect(() => {
    if (campaignSubTab === 'news') fetchRawNews()
    if (campaignSubTab === 'workshop') { fetchRawNews(); fetchContentList(wsForm.content_type) }
    if (campaignSubTab === 'crm') fetchLeads()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignSubTab])
  useEffect(() => {
    if (activeTab === 'clarity' && !clarityMetrics) fetchClarityMetrics()
  }, [activeTab, clarityMetrics, fetchClarityMetrics])

  const approve = async (id: string) => {
    if (!confirm('Xác nhận approve và publish campaign này cho Sales Agent?')) return
    await fetch(`/api/admin/lp-campaigns/${id}/approve`, { method: 'POST' })
    fetchCampaigns()
  }

  const requestEdit = async () => {
    if (!editNotes) return
    await fetch(`/api/admin/lp-campaigns/${editNotes.id}/request-edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: editNotes.notes }),
    })
    setEditNotes(null)
    fetchCampaigns()
  }

  const togglePause = async (c: Campaign) => {
    const isPausing = c.status !== 'paused'
    if (isPausing && !confirm(`Dừng campaign "${c.campaign_name || c.slug}"? Sales Agent sẽ không dùng được link này.`)) return
    await fetch(`/api/admin/lp-campaigns/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: isPausing ? 'paused' : 'active' }),
    })
    fetchCampaigns()
  }

  const generateCampaign = async () => {
    setGenerating(true)
    const res = await fetch('/api/admin/lp-campaigns/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    })
    const data = await res.json()
    setGenerating(false)
    setShowCreate(false)
    if (data.preview_url) {
      window.open(`https://finpeace.cloud${data.preview_url}`, '_blank')
    }
    fetchCampaigns()
  }

  const buildUTMLink = (c: Campaign) => {
    const base = `https://finpeace.cloud/lp/${c.agent_code}/${c.slug}`
    const params = new URLSearchParams()
    if (c.utm_source) params.set('utm_source', c.utm_source)
    if (c.utm_campaign) params.set('utm_campaign', c.utm_campaign)
    params.set('utm_medium', 'social')
    return `${base}?${params.toString()}`
  }

  // Group by agent
  const grouped: Record<string, Campaign[]> = {}
  for (const c of campaigns) {
    if (!grouped[c.agent_code]) grouped[c.agent_code] = []
    grouped[c.agent_code].push(c)
  }

  const AGENTS = ['mq01', 'aduc02', 'thuy03', 'huyen04', 'mduc05', 'dmd01']
  const AGENT_NAMES: Record<string, string> = {
    mq01: 'Minh Quang', aduc02: 'Anh Đức', thuy03: 'Lê Thuỷ', huyen04: '🇰🇷 Minaviko', mduc05: 'Minh Đức', dmd01: '📈 Đặng Minh Đức'
  }

  return (
    <div className="min-h-screen bg-[#0d1119] text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#c4a67a] text-xs uppercase tracking-widest mb-1">FinPeace Admin</p>
            <h1 className="text-2xl font-bold text-white">📊 LP Campaign Manager</h1>
            <p className="text-slate-400 text-sm mt-1">Quản trị đa tuyến nội dung cho các Sales Agent</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/advisor/admin/leads"
              className="px-4 py-2 bg-[#1e2535] text-slate-300 rounded-lg font-medium text-sm hover:bg-[#2a3548] transition-colors"
            >
              📋 Xem Leads
            </a>
            {activeTab === 'campaigns' && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg font-semibold text-sm hover:bg-[#d4b68a] transition-colors"
              >
                + New Campaign
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-6 bg-[#111827] rounded-xl p-1 border border-[#1e2535] w-fit">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'campaigns'
                ? 'bg-[#c4a67a] text-[#0d1119]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🗂 Campaigns
          </button>
          <button
            onClick={() => setActiveTab('clarity')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'clarity'
                ? 'bg-[#c4a67a] text-[#0d1119]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Clarity Performance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'clarity' ? (
          <ClarityMonitorTab metrics={clarityMetrics} loading={clarityLoading} onRefresh={fetchClarityMetrics} />
        ) : (
          <div className="space-y-4">
            {/* Campaign Sub-Tabs */}
            <div className="flex gap-1 bg-[#111827] rounded-xl p-1 border border-[#1e2535] w-fit">
              {([
                { id:'list', label:'📋 Campaigns' },
                { id:'news', label:'📡 News Intelligence' },
                { id:'workshop', label:'🚀 Workshop' },
                { id:'crm', label:'🎯 Lead CRM' },
                { id:'perf', label:'📊 Agent Perf' },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setCampaignSubTab(t.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${campaignSubTab===t.id ? 'bg-[#c4a67a] text-[#0d1119]' : 'text-slate-400 hover:text-white hover:bg-[#1e2535]'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Sub-tab: Campaigns List ── */}
            {campaignSubTab === 'list' && (loading ? (
              <div className="flex items-center justify-center h-48 text-slate-400">Loading campaigns...</div>
            ) : (
              <div className="space-y-6">
                {AGENTS.map(agentCode => {
              const agentCampaigns = grouped[agentCode] ?? []
              const agentName = AGENT_NAMES[agentCode] ?? agentCode
              return (
                <div key={agentCode} className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
                  {/* Agent header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2535]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#c4a67a]" />
                      <span className="font-semibold text-white">{agentName}</span>
                      <span className="text-slate-500 text-sm">({agentCode})</span>
                      {agentCampaigns.length > 0 && (
                        <span className="text-xs bg-[#1e2535] text-slate-400 px-2 py-0.5 rounded-full">
                          {agentCampaigns.length} campaigns
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => { setShowCreate(true); setCreateForm(f => ({ ...f, agent_code: agentCode })) }}
                      className="text-xs text-[#c4a67a] hover:text-white transition-colors"
                    >
                      + Tạo campaign
                    </button>
                  </div>

                  {agentCampaigns.length === 0 ? (
                    <div className="px-6 py-8 text-center text-slate-500 text-sm">
                      Chưa có campaign nào — <button onClick={() => { setShowCreate(true); setCreateForm(f => ({ ...f, agent_code: agentCode })) }} className="text-[#c4a67a] hover:underline">Tạo ngay</button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1e2535]">
                      {agentCampaigns.map(c => {
                        const statusCfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.draft
                        const cr = c.views_7d > 0 ? ((c.leads_7d / c.views_7d) * 100).toFixed(1) : '—'
                        const budgetPct = c.budget_allocated > 0
                          ? Math.min(100, Math.round((c.budget_spent / c.budget_allocated) * 100))
                          : 0
                        return (
                          <div key={c.id} className="px-6 py-4 hover:bg-[#0f172a] transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                                    {statusCfg.dot} {statusCfg.label}
                                  </span>
                                  <span className="text-xs text-slate-500">{CONTENT_TYPE_LABEL[c.content_type]}</span>
                                </div>
                                <p className="font-medium text-white truncate">{c.campaign_name || c.slug}</p>
                                {c.generated_hook && (
                                  <p className="text-slate-400 text-xs mt-1 truncate italic">"{c.generated_hook}"</p>
                                )}
                                <p className="text-slate-600 text-xs mt-1">
                                  /lp/{c.agent_code}/{c.slug}
                                </p>
                              </div>

                              {/* Metrics */}
                              <div className="flex items-center gap-6 shrink-0 text-center">
                                <div>
                                  <p className="text-white font-semibold">{c.views_7d}</p>
                                  <p className="text-slate-500 text-xs">views 7d</p>
                                </div>
                                <div>
                                  <p className="text-[#c4a67a] font-semibold">{c.leads_7d}</p>
                                  <p className="text-slate-500 text-xs">leads 7d</p>
                                </div>
                                <div>
                                  <p className="text-white font-semibold">{cr}%</p>
                                  <p className="text-slate-500 text-xs">CR</p>
                                </div>
                                <div>
                                  <div className="text-sm text-slate-300">{fmtVND(c.budget_spent)}/{fmtVND(c.budget_allocated)}</div>
                                  {c.budget_allocated > 0 && (
                                    <div className="h-1 w-20 bg-[#1e2535] rounded-full mt-1">
                                      <div
                                        className="h-1 bg-[#c4a67a] rounded-full"
                                        style={{ width: `${budgetPct}%` }}
                                      />
                                    </div>
                                  )}
                                  <p className="text-slate-500 text-xs mt-0.5">budget</p>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                {c.status === 'pending_review' && (
                                  <>
                                    <button
                                      onClick={() => approve(c.id)}
                                      className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                                    >
                                      ✓ Approve
                                    </button>
                                    <button
                                      onClick={() => setEditNotes({ id: c.id, notes: '' })}
                                      className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                                    >
                                      ✎ Re-edit
                                    </button>
                                  </>
                                )}
                                {c.status === 'draft' && (
                                  <>
                                    <a
                                      href={`https://finpeace.cloud/lp/${c.agent_code}/${c.slug}`}
                                      target="_blank"
                                      className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                                    >
                                      👁 Preview
                                    </a>
                                    <button
                                      onClick={() => approve(c.id)}
                                      className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                                    >
                                      ✓ Approve
                                    </button>
                                    <button
                                      onClick={() => setEditNotes({ id: c.id, notes: '' })}
                                      className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                                    >
                                      ✎ Edit
                                    </button>
                                  </>
                                )}
                                {c.status === 'active' && (
                                  <>
                                    <button
                                      onClick={() => setUtmModal(c)}
                                      className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors"
                                    >
                                      🔗 UTM
                                    </button>
                                    <button
                                      onClick={() => togglePause(c)}
                                      className="px-2 py-1 text-xs bg-slate-500/20 text-slate-400 rounded hover:bg-slate-500/30 transition-colors"
                                    >
                                      ⏸ Pause
                                    </button>
                                  </>
                                )}
                                {c.status === 'paused' && (
                                  <button
                                    onClick={() => togglePause(c)}
                                    className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                                  >
                                    ▶ Resume
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}

            {/* ── Sub-tab: News Intelligence ── */}
            {campaignSubTab === 'news' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {rawNewsDates.slice(0,5).map(d => (
                      <button key={d} onClick={() => { setRawNewsDate(d); fetchRawNews(d, rawNewsFilter) }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${rawNewsDate===d ? 'bg-[#c4a67a] text-[#0d1119]' : 'bg-[#1e2535] text-slate-400 hover:text-white'}`}>
                        {fmtDate(d)}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {(['all','pending','approved','ignored'] as const).map(s => (
                      <button key={s} onClick={() => { setRawNewsFilter(s); fetchRawNews(rawNewsDate||undefined, s) }}
                        className={`px-2 py-1 rounded text-xs ${rawNewsFilter===s ? 'bg-[#c4a67a] text-[#0d1119]' : 'text-slate-500 hover:text-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {loadingRawNews ? (
                  <div className="text-center py-8 text-slate-500 text-sm">Loading tin tức...</div>
                ) : rawNews.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-sm">Chưa có tin nào ngày này. Chạy pipeline crawl để feed dữ liệu.</div>
                ) : (
                  <div className="space-y-2">
                    {rawNews.map(a => (
                      <div key={a.id} className={`bg-[#111827] border rounded-xl p-4 transition-all ${ a.status==='approved' ? 'border-emerald-500/30' : a.status==='ignored' ? 'border-slate-500/20 opacity-50' : 'border-[#1e2535]' }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${ a.relevance===3?'bg-red-500/20 text-red-400':a.relevance===2?'bg-amber-500/20 text-amber-400':'bg-slate-500/20 text-slate-400' }`}>
                                {a.relevance===3?'🔥 Hot':a.relevance===2?'⚡ Mid':'○ Low'}
                              </span>
                              <span className="text-slate-600 text-xs">{a.source} · {a.published_at ? fmtDate(a.published_at) : '—'}</span>
                              {a.category && <span className="text-xs bg-[#1e2535] text-slate-400 px-1.5 py-0.5 rounded">{a.category}</span>}
                            </div>
                            <p className="text-white text-sm font-medium leading-snug mb-1">{a.title}</p>
                            {a.description && <p className="text-slate-500 text-xs line-clamp-2">{a.description}</p>}
                            {a.tickers.length > 0 && <div className="flex gap-1 mt-1">{a.tickers.map(t=><span key={t} className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">{t}</span>)}</div>}
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            {a.status !== 'approved' && <button onClick={()=>actionRawNews(a.id,'approve')} className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30">✓ Dùng</button>}
                            {a.status !== 'ignored' && <button onClick={()=>actionRawNews(a.id,'ignore')} className="px-2 py-1 text-xs bg-slate-500/20 text-slate-400 rounded hover:bg-slate-500/30">✕</button>}
                            {a.link && <a href={a.link} target="_blank" className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">↗ Link</a>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Sub-tab: Campaign Workshop ── */}
            {campaignSubTab === 'workshop' && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left: config */}
                <div className="space-y-4">
                  <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-5 space-y-4">
                    <h3 className="text-white font-semibold text-sm">🚀 Tạo Campaign từ Tin Tức</h3>
                    <div>
                      <label className="text-slate-400 text-xs block mb-1">Sales Agent</label>
                      <select value={wsForm.agent_code} onChange={e=>setWsForm(f=>({...f,agent_code:e.target.value}))}
                        className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm">
                        {Object.entries(AGENT_NAMES).map(([c,n])=><option key={c} value={c}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs block mb-1">Loại nội dung</label>
                      <select value={wsForm.content_type} onChange={e=>{const v=e.target.value as 'macro_insight'|'knowledgebase';setWsForm(f=>({...f,content_type:v,content_slug:''}));fetchContentList(v)}}
                        className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm">
                        <option value="macro_insight">📊 Macro Insight</option>
                        <option value="knowledgebase">📚 Knowledgebase</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs block mb-1">Bài content</label>
                      <select value={wsForm.content_slug} onChange={e=>setWsForm(f=>({...f,content_slug:e.target.value}))}
                        className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm">
                        <option value="">-- Chọn bài --</option>
                        {contentList.map(ci=><option key={ci.slug} value={ci.slug}>{ci.title||ci.slug}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs block mb-1">Tên Campaign</label>
                      <input value={wsForm.campaign_name} onChange={e=>setWsForm(f=>({...f,campaign_name:e.target.value}))}
                        placeholder="vd: KBSV Korean March 2026"
                        className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"/>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs block mb-1">Target audience hint</label>
                      <input value={wsForm.target_audience_hint} onChange={e=>setWsForm(f=>({...f,target_audience_hint:e.target.value}))}
                        placeholder="vd: Korean expats lo lắng về tỷ giá"
                        className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"/>
                    </div>
                    <button onClick={wsGenerate} disabled={wsGenerating||!wsForm.content_slug||!wsForm.campaign_name}
                      className="w-full py-2.5 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold hover:bg-[#d4b68a] disabled:opacity-50">
                      {wsGenerating ? '⏳ AI đang generate...' : '✨ Generate LP với AI'}
                    </button>
                    {wsResult && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-2">
                        <p className="text-emerald-400 text-sm font-medium">✅ {wsResult.campaign_name}</p>
                        <div className="flex gap-2">
                          <a href={wsResult.preview_url} target="_blank" className="flex-1 text-center py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30">👁 Preview</a>
                          {wsResult.campaign_id && <button onClick={()=>wsApprove(wsResult!.campaign_id)} disabled={wsApproving} className="flex-1 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs rounded hover:bg-emerald-500/30 disabled:opacity-50">
                            {wsApproving?'⏳':'✓ Approve & Publish'}
                          </button>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Right: pick news */}
                <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3">📡 Mix tin tức vào LP</h3>
                  {wsNewsMix ? (
                    <div className="bg-[#0d1119] rounded-lg p-3 mb-3">
                      <p className="text-white text-xs font-medium mb-1">{wsNewsMix.title}</p>
                      <button onClick={()=>setWsNewsMix(null)} className="text-slate-500 text-xs hover:text-red-400">✕ Bỏ mix</button>
                    </div>
                  ) : <p className="text-slate-600 text-xs mb-3">Chọn tin để AI context tự động</p>}
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {rawNews.filter(a=>a.status==='approved'||a.status==='pending').slice(0,20).map(a=>(
                      <button key={a.id} onClick={()=>setWsNewsMix(a)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${wsNewsMix?.id===a.id?'bg-[#c4a67a]/20 border border-[#c4a67a]/30':'bg-[#0d1119] hover:bg-[#1e2535]'}`}>
                        <span className={`mr-1 ${a.relevance===3?'text-red-400':a.relevance===2?'text-amber-400':'text-slate-600'}`}>{'●'}</span>
                        <span className="text-slate-200">{a.title.slice(0,70)}…</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Sub-tab: Lead CRM ── */}
            {campaignSubTab === 'crm' && (
              <div>
                {loadingLeads ? (
                  <div className="text-center py-8 text-slate-500 text-sm">Loading leads...</div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {CRM_STAGES.map(stage => {
                      const stageLeads = leads.filter(l=>l.crm_stage===stage.id)
                      return (
                        <div key={stage.id} className="bg-[#111827] border border-[#1e2535] rounded-xl overflow-hidden">
                          <div className="px-4 py-3 border-b border-[#1e2535] flex items-center justify-between">
                            <span className="text-white text-xs font-semibold">{stage.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${stage.badge}`}>{stageLeads.length}</span>
                          </div>
                          <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                            {stageLeads.map(l=>(
                              <div key={l.id} className="bg-[#0d1119] rounded-lg p-3 text-xs">
                                <p className="text-white font-medium mb-1">{l.full_name || l.email || l.ref_code}</p>
                                {l.phone && <p className="text-slate-500">{l.phone}</p>}
                                <p className="text-slate-600 truncate">{l.sales_agents?.full_name} · {fmtDate(l.registered_at)}</p>
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {CRM_STAGES.filter(s=>s.id!==stage.id).map(s=>(
                                    <button key={s.id} onClick={()=>updateCrmStage(l,s.id)} className={`px-1.5 py-0.5 rounded text-[10px] ${s.badge} hover:opacity-80`}>→{s.label}</button>
                                  ))}
                                  <button onClick={()=>{setNoteModal(l);setNoteText(l.notes||'')}} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-500/20 text-slate-400 hover:opacity-80">📝</button>
                                </div>
                                {l.notes && <p className="text-slate-500 text-[10px] mt-1 italic">{l.notes.slice(0,60)}</p>}
                              </div>
                            ))}
                            {stageLeads.length===0 && <p className="text-slate-700 text-xs text-center py-2">Trống</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Sub-tab: Agent Performance ── */}
            {campaignSubTab === 'perf' && (
              <div className="bg-[#111827] border border-[#1e2535] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1e2535]">
                  <h3 className="text-white font-semibold text-sm">📊 Agent Performance</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Tổng hợp performance từ campaigns của từng agent</p>
                </div>
                <div className="divide-y divide-[#1e2535]">
                  {AGENTS.map(code => {
                    const agCampaigns = campaigns.filter(c=>c.agent_code===code)
                    const active = agCampaigns.filter(c=>c.status==='active').length
                    const agLeads = leads.filter(l=>l.sales_agents?.code===code)
                    const converted = agLeads.filter(l=>l.crm_stage==='opened').length
                    const cr = agLeads.length>0 ? (converted/agLeads.length*100).toFixed(1) : '—'
                    return (
                      <div key={code} className="px-5 py-4 flex items-center gap-4">
                        <div className="w-32 shrink-0">
                          <p className="text-white text-sm font-medium">{AGENT_NAMES[code]||code}</p>
                          <p className="text-slate-600 text-xs">{code}</p>
                        </div>
                        <div className="flex gap-6 text-center text-xs flex-1">
                          <div><p className="text-white font-bold">{agCampaigns.length}</p><p className="text-slate-500">campaigns</p></div>
                          <div><p className="text-emerald-400 font-bold">{active}</p><p className="text-slate-500">active</p></div>
                          <div><p className="text-[#c4a67a] font-bold">{agLeads.length}</p><p className="text-slate-500">leads</p></div>
                          <div><p className="text-purple-400 font-bold">{converted}</p><p className="text-slate-500">opened KB</p></div>
                          <div><p className={`font-bold ${parseFloat(cr)>=5?'text-emerald-400':'text-amber-400'}`}>{cr}{cr!=='—'?'%':''}</p><p className="text-slate-500">CR</p></div>
                        </div>
                        <div className="w-24 hidden md:block">
                          <div className="h-1.5 bg-[#1e2535] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${parseFloat(cr)>=5?'bg-emerald-500':'bg-amber-500'}`} style={{width:`${Math.min(100,(parseFloat(cr)||0)*10)}%`}}/>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note Modal (CRM) */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-1">📝 Ghi chú Lead</h2>
            <p className="text-slate-500 text-xs mb-4">{noteModal.full_name || noteModal.email}</p>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Ghi chú về tình trạng, mong muốn, hẹn gặp..."
              rows={4} className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 resize-none"/>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setNoteModal(null)} className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm hover:bg-[#1e2535]">Huỷ</button>
              <button onClick={saveNote} disabled={savingNote} className="flex-1 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold disabled:opacity-50">
                {savingNote ? '⏳ Lưu...' : '💾 Lưu ghi chú'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">🚀 Tạo Campaign Mới</h2>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1">Sales Agent</label>
                <select
                  value={createForm.agent_code}
                  onChange={e => setCreateForm(f => ({ ...f, agent_code: e.target.value }))}
                  className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                >
                  {Object.entries(AGENT_NAMES).map(([code, name]) => (
                    <option key={code} value={code}>{name} ({code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Loại nội dung</label>
                <select
                  value={createForm.content_type}
                  onChange={e => setCreateForm(f => ({ ...f, content_type: e.target.value as any }))}
                  className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="macro_insight">📊 Macro Insight</option>
                  <option value="knowledgebase">📚 Knowledgebase Article</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Content Slug</label>
                <input
                  value={createForm.content_slug}
                  onChange={e => setCreateForm(f => ({ ...f, content_slug: e.target.value }))}
                  placeholder="vd: gdp-10-sieu-du-an hoặc cac-loai-lenh"
                  className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Tên Campaign (nội bộ)</label>
                <input
                  value={createForm.campaign_name}
                  onChange={e => setCreateForm(f => ({ ...f, campaign_name: e.target.value }))}
                  placeholder="vd: KBSV Korean March 2026"
                  className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Target audience hint (cho AI)</label>
                <input
                  value={createForm.target_audience_hint}
                  onChange={e => setCreateForm(f => ({ ...f, target_audience_hint: e.target.value }))}
                  placeholder="vd: Korean expats lo lắng về rủi ro tỷ giá"
                  className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">UTM Source</label>
                  <input
                    value={createForm.utm_source}
                    onChange={e => setCreateForm(f => ({ ...f, utm_source: e.target.value }))}
                    placeholder="kakao / zalo / fb"
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Budget (VND)</label>
                  <input
                    type="number"
                    value={createForm.budget_allocated}
                    onChange={e => setCreateForm(f => ({ ...f, budget_allocated: Number(e.target.value) }))}
                    placeholder="5000000"
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm hover:bg-[#1e2535] transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={generateCampaign}
                disabled={generating || !createForm.content_slug}
                className="flex-1 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold hover:bg-[#d4b68a] transition-colors disabled:opacity-50"
              >
                {generating ? '⏳ AI đang generate...' : '✨ Generate với AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Edit Modal */}
      {editNotes && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">✎ Yêu cầu chỉnh sửa</h2>
            <textarea
              value={editNotes.notes}
              onChange={e => setEditNotes(n => n ? { ...n, notes: e.target.value } : null)}
              placeholder="Hook chưa đủ hấp dẫn, cần nhấn mạnh lợi ích cụ thể... AI sẽ re-generate dựa trên ghi chú này."
              rows={4}
              className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditNotes(null)} className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm">Huỷ</button>
              <button onClick={requestEdit} className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-sm font-semibold">Gửi yêu cầu</button>
            </div>
          </div>
        </div>
      )}

      {/* UTM Link Modal */}
      {utmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-white mb-4">🔗 UTM Link — {utmModal.campaign_name || utmModal.slug}</h2>
            <div className="bg-[#0d1119] rounded-lg p-4 mb-4">
              <p className="text-[#c4a67a] text-xs mb-2 font-mono break-all">{buildUTMLink(utmModal)}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(buildUTMLink(utmModal)); setUtmModal(null) }}
              className="w-full py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold"
            >
              📋 Copy Link
            </button>
            <button onClick={() => setUtmModal(null)} className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-white">Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Clarity Monitor Tab ──────────────────────────────────────────────────────

function ClarityMonitorTab({
  metrics,
  loading,
  onRefresh,
}: {
  metrics: ClarityMetrics | null
  loading: boolean
  onRefresh: () => void
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-spin">⏳</div>
          <p>Đang tải Clarity metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <button onClick={onRefresh} className="px-5 py-2.5 bg-[#c4a67a] text-[#0d1119] rounded-xl text-sm font-bold hover:opacity-90">
          🔄 Tải dữ liệu
        </button>
      </div>
    )
  }

  const { kpis, funnel, by_campaign, by_agent, content, kb_requests } = metrics

  const crColor = kpis.cr_pct >= 5 ? 'text-emerald-400' : kpis.cr_pct >= 3 ? 'text-amber-400' : 'text-red-400'
  const phoneColor = kpis.valid_phone_rate >= 80 ? 'text-emerald-400' : 'text-amber-400'
  const cacColor = !kpis.cac ? 'text-slate-400' : kpis.cac <= 1_000_000 ? 'text-emerald-400' : 'text-amber-400'

  const totalLeads = funnel.new + funnel.contacted + funnel.qualified + funnel.opened
  const funnelSteps = [
    { label: 'LP Views', value: funnel.views, color: '#3b82f6', icon: '👁' },
    { label: 'Leads', value: totalLeads, color: '#c4a67a', icon: '🎯' },
    { label: 'Contacted', value: funnel.contacted + funnel.qualified + funnel.opened, color: '#f59e0b', icon: '📞' },
    { label: 'Qualified', value: funnel.qualified + funnel.opened, color: '#f97316', icon: '✅' },
    { label: 'Blueprint CTA', value: funnel.opened, color: '#34d399', icon: '🚀' },
  ]

  const kbCounts = kb_requests?.counts ?? { pending: 0, completed: 0, expired: 0 }
  const kbPending = kb_requests?.pending ?? []
  const contentViews = content?.top_by_views ?? []
  const contentReactions = content?.top_by_reactions ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">📈 Clarity Performance</h2>
          <p className="text-slate-500 text-xs mt-0.5">Full-funnel: LP → Leads → Clarity → Blueprint</p>
        </div>
        <div className="flex items-center gap-3">
          {kbCounts.pending > 0 && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full animate-pulse">
              🔔 {kbCounts.pending} KB request chờ xử lý
            </span>
          )}
          <button onClick={onRefresh} className="px-3 py-1.5 text-xs bg-[#1e2535] text-slate-300 rounded-lg hover:bg-[#2a3548]">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards — 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'LP Views (7d)', value: kpis.views_7d, color: 'text-blue-400', target: '≥ 200/tuần', ok: kpis.views_7d >= 200, suffix: '' },
          { label: 'Leads (7d)', value: kpis.leads_7d, color: 'text-[#c4a67a]', target: `Tổng: ${kpis.total_leads_all_time}`, ok: null, suffix: '' },
          { label: 'CR% (7d)', value: kpis.cr_pct, color: crColor, target: '≥ 5%', ok: kpis.cr_pct >= 5, suffix: '%' },
          { label: 'SĐT Valid', value: kpis.valid_phone_rate, color: phoneColor, target: '≥ 80%', ok: kpis.valid_phone_rate >= 80, suffix: '%' },
          { label: 'CAC', value: kpis.cac ? +(kpis.cac / 1_000_000).toFixed(1) : null, color: cacColor, target: '< 1M VND', ok: kpis.cac ? kpis.cac <= 1_000_000 : null, suffix: kpis.cac ? 'M' : '' },
          { label: 'KB Requests', value: kbCounts.pending, color: kbCounts.pending > 0 ? 'text-amber-400' : 'text-slate-500', target: `${kbCounts.completed} done`, ok: kbCounts.pending === 0, suffix: ' pending' },
        ].map(card => (
          <div key={card.label} className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
            <p className="text-slate-500 text-xs mb-1 truncate">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.value === null ? '—' : card.value}{card.value !== null ? card.suffix : ''}
            </p>
            <p className="text-slate-600 text-xs mt-1">{card.target}</p>
            {card.ok !== null && (
              <span className={`text-xs ${card.ok ? 'text-emerald-400' : 'text-amber-400'}`}>
                {card.ok ? '✓ OK' : '↑ Cần cải thiện'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Funnel + Stage Breakdown */}
      <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-6">
        <h3 className="text-white font-semibold mb-5">🔽 Clarity Funnel</h3>
        <div className="flex items-end gap-3">
          {funnelSteps.map((step, i) => {
            const pct = funnelSteps[0].value > 0
              ? Math.round((step.value / funnelSteps[0].value) * 100) : 0
            const barH = Math.max(pct, 4)
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1">
                {i > 0 && (
                  <span className={`text-xs font-bold mb-1 ${pct >= 20 ? 'text-emerald-400' : pct >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {pct}%
                  </span>
                )}
                <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{ height: `${barH}%`, background: step.color, opacity: 0.85, minHeight: 4 }}
                  />
                </div>
                <p className="text-white font-bold text-sm">{step.value}</p>
                <p className="text-slate-500 text-xs text-center leading-tight">{step.icon} {step.label}</p>
              </div>
            )
          })}
        </div>

        {totalLeads > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-xs">Stage breakdown (all time)</p>
              <p className="text-slate-400 text-xs">{totalLeads} leads total</p>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden gap-px">
              <div className="bg-blue-500" style={{ width: `${Math.round(funnel.new / totalLeads * 100)}%` }} title={`New: ${funnel.new}`} />
              <div className="bg-amber-500" style={{ width: `${Math.round(funnel.contacted / totalLeads * 100)}%` }} title={`Contacted: ${funnel.contacted}`} />
              <div className="bg-orange-500" style={{ width: `${Math.round(funnel.qualified / totalLeads * 100)}%` }} title={`Qualified: ${funnel.qualified}`} />
              <div className="bg-emerald-500" style={{ width: `${Math.round(funnel.opened / totalLeads * 100)}%` }} title={`Blueprint: ${funnel.opened}`} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span><span className="text-blue-400">●</span> New {funnel.new}</span>
              <span><span className="text-amber-400">●</span> Contacted {funnel.contacted}</span>
              <span><span className="text-orange-400">●</span> Qualified {funnel.qualified}</span>
              <span><span className="text-emerald-400">●</span> Blueprint {funnel.opened}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Analytics — 2 columns */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Hot by Reactions */}
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2535]">
            <h3 className="text-white font-semibold text-sm">🔥 Hot Content — Reactions</h3>
            <p className="text-slate-500 text-xs mt-0.5">Bài được Like + Love nhiều nhất</p>
          </div>
          {contentReactions.length === 0 ? (
            <div className="px-5 py-6 text-slate-600 text-xs text-center">Chưa có reaction nào</div>
          ) : (
            <div className="divide-y divide-[#1e2535]">
              {contentReactions.slice(0, 8).map((item, i) => (
                <div key={item.slug} className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#0f172a]">
                  <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.slug}</p>
                    <p className="text-slate-600 text-[10px]">{item.content_type}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <span className="text-blue-400">👍{item.likes}</span>
                    <span className="text-rose-400">❤️{item.loves}</span>
                    <span className="bg-[#1e2535] text-slate-300 px-1.5 py-0.5 rounded font-bold">{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top by Views */}
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2535]">
            <h3 className="text-white font-semibold text-sm">👁 Traffic — Top Views (7d)</h3>
            <p className="text-slate-500 text-xs mt-0.5">Bài được xem nhiều nhất trong 7 ngày</p>
          </div>
          {contentViews.length === 0 ? (
            <div className="px-5 py-6 text-slate-600 text-xs text-center">Chưa có lượt xem nào</div>
          ) : (
            <div className="divide-y divide-[#1e2535]">
              {contentViews.slice(0, 8).map((item, i) => (
                <div key={item.slug} className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#0f172a]">
                  <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{item.slug}</p>
                    <p className="text-slate-600 text-[10px]">{item.content_type}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div
                      className="h-1.5 rounded-full bg-blue-500 opacity-70"
                      style={{ width: Math.max(4, Math.min(80, item.views * 4)) }}
                    />
                    <span className="text-slate-300 text-xs font-bold ml-1">{item.views}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* By Agent */}
      {by_agent.length > 0 && (
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-5">
          <h3 className="text-white font-semibold text-sm mb-4">👤 Breakdown by Agent</h3>
          <div className="space-y-2">
            {by_agent.map(a => (
              <div key={a.agent_code} className="flex items-center gap-4 py-2 border-b border-[#1e2535] last:border-0">
                <div className="w-28 shrink-0">
                  <p className="text-white text-sm font-medium">{a.agent_name}</p>
                  <p className="text-slate-600 text-xs">{a.agent_code}</p>
                </div>
                <div className="flex gap-5 text-center text-xs flex-1">
                  <div><p className="text-white font-bold">{a.views}</p><p className="text-slate-600">views</p></div>
                  <div><p className="text-[#c4a67a] font-bold">{a.leads}</p><p className="text-slate-600">leads</p></div>
                  <div><p className={`font-bold ${a.cr >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>{a.cr}%</p><p className="text-slate-600">CR</p></div>
                  <div><p className="text-slate-300 font-bold">{a.campaigns}</p><p className="text-slate-600">campaigns</p></div>
                </div>
                {/* Mini CR bar */}
                <div className="w-20 hidden md:block">
                  <div className="h-1 bg-[#1e2535] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${a.cr >= 5 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, a.cr * 10)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Table */}
      {by_campaign.length > 0 && (
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2535]">
            <h3 className="text-white font-semibold text-sm">📋 Performance by Campaign</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-[#1e2535]">
                  <th className="text-left px-5 py-3">Campaign</th>
                  <th className="text-left px-4 py-3">Agent</th>
                  <th className="text-right px-4 py-3">Views</th>
                  <th className="text-right px-4 py-3">Leads</th>
                  <th className="text-right px-4 py-3">CR%</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2535]">
                {by_campaign.map(c => {
                  const views = c.views_7d ?? 0
                  const leads = c.leads_7d ?? 0
                  const cr = views > 0 ? (leads / views * 100).toFixed(1) : '—'
                  return (
                    <tr key={c.id} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-5 py-3 text-white font-medium truncate max-w-[180px]">{c.campaign_name || c.slug || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{c.agent_name || c.agent_code || '—'}</td>
                      <td className="px-4 py-3 text-right text-white">{views}</td>
                      <td className="px-4 py-3 text-right text-[#c4a67a] font-medium">{leads}</td>
                      <td className={`px-4 py-3 text-right font-medium ${parseFloat(cr as string) >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {cr}{cr !== '—' ? '%' : ''}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          c.status === 'draft' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>{c.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KB Account Requests */}
      <KbRequestsSection kbCounts={kbCounts} kbPending={kbPending} onRefresh={onRefresh} />
    </div>
  )
}

// ── KB Requests Section ───────────────────────────────────────────────────────
function KbRequestsSection({
  kbCounts,
  kbPending,
  onRefresh,
}: {
  kbCounts: { pending: number; completed: number; expired: number }
  kbPending: ClarityMetrics['kb_requests']['pending']
  onRefresh: () => void
}) {
  const [completing, setCompleting] = useState<string | null>(null)

  const complete = async (id: string) => {
    setCompleting(id)
    await fetch(`/api/admin/kb-requests/${id}/complete`, { method: 'POST' })
    setCompleting(null)
    onRefresh()
  }

  return (
    <div className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e2535] flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">🔓 KB Account Requests</h3>
          <p className="text-slate-500 text-xs mt-0.5">Yêu cầu mở tài khoản KB — hạn xử lý 3 ngày</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full font-semibold">{kbCounts.pending} pending</span>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">{kbCounts.completed} done</span>
          <span className="px-2.5 py-1 bg-slate-500/15 text-slate-500 rounded-full">{kbCounts.expired} expired</span>
        </div>
      </div>

      {kbPending.length === 0 ? (
        <div className="px-5 py-8 text-center text-slate-600 text-sm">
          ✓ Không có request nào đang chờ
        </div>
      ) : (
        <div className="divide-y divide-[#1e2535]">
          {kbPending.map(r => {
            const daysLeft = Math.max(0, Math.ceil((new Date(r.expires_at).getTime() - Date.now()) / 86400000))
            return (
              <div key={r.id} className="px-5 py-3.5 hover:bg-[#0f172a] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{r.user_name ?? r.user_email}</p>
                      {r.user_phone && <span className="text-slate-500 text-xs">{r.user_phone}</span>}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      📄 {r.content_title ?? r.content_slug}
                      <span className="ml-2 text-slate-600">({r.content_type})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      daysLeft <= 1 ? 'bg-red-500/20 text-red-400' : daysLeft <= 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      ⏰ {daysLeft}d
                    </span>
                    <button
                      onClick={() => complete(r.id)}
                      disabled={completing === r.id}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 font-medium"
                    >
                      {completing === r.id ? '⏳' : '✓ Đã mở'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

