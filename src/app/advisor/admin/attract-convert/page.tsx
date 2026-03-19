'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type NewsArticle = {
  id: string
  topic_slug: string
  title: string
  category: string
  date_label: string
  analyst_view: string | null
  impact_value: string | null
  companies: { ticker: string; name: string; plan: string }[]
  key_stats: { label: string; value: string; positive: boolean }[]
  kb_article: string | null
  kb_article_slug: string | null
  impact_score: 1 | 2 | 3
}

type ContentItem = {
  slug: string
  title: string
  pillar: string
  date_label?: string
}

type Campaign = {
  id: string
  slug: string
  campaign_name: string | null
  content_type: 'macro_insight' | 'knowledgebase'
  status: string
  agent_code: string
  agent_name: string
  views_7d: number
  leads_7d: number
  leads_total: number
  budget_allocated: number
}

type Lead = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  ref_code: string
  utm_source: string | null
  status: string
  crm_stage: string
  notes: string | null
  registered_at: string
  agent_landing_pages: { slug: string; campaign_name: string | null } | null
  sales_agents: { code: string; full_name: string } | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'news',     label: '📡 News Intelligence',  desc: 'Tin tức crawl hôm nay' },
  { id: 'campaign', label: '🚀 Campaign Workshop',   desc: 'Tạo LP từ tin tức' },
  { id: 'crm',      label: '🎯 Lead CRM Pipeline',   desc: 'Quản lý leads theo stage' },
  { id: 'perf',     label: '📊 Agent Performance',   desc: 'KPI từng Sales Agent' },
]

const CRM_STAGES = [
  { id: 'new',       label: 'Mới',              color: 'border-blue-500/40',    badge: 'bg-blue-500/20 text-blue-400' },
  { id: 'contacted', label: 'Đã liên hệ',       color: 'border-amber-500/40',   badge: 'bg-amber-500/20 text-amber-400' },
  { id: 'qualified', label: 'Qualified',         color: 'border-purple-500/40',  badge: 'bg-purple-500/20 text-purple-400' },
  { id: 'opened',    label: 'Mở TK KBSV',       color: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400' },
]

const AGENT_CODES = ['mq01', 'aduc02', 'thuy03', 'huyen04', 'mduc05']
const AGENT_NAMES: Record<string, string> = {
  mq01: 'Minh Quang', aduc02: 'Anh Đức', thuy03: 'Lê Thuỷ', huyen04: '🇰🇷 Minaviko', mduc05: 'Minh Đức'
}

// KPI targets from strategy
const TARGETS = { views_week: 200, cr_pct: 5, valid_phone_pct: 80 }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AttractConvertPage() {
  const [activeTab, setActiveTab] = useState('news')

  // Data states
  const [newsData, setNewsData] = useState<{ articles: NewsArticle[]; date: string | null; is_today: boolean } | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loadingNews, setLoadingNews] = useState(false)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)

  // Campaign form state
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null)
  const [createForm, setCreateForm] = useState({
    agent_code: 'mq01',
    content_type: 'macro_insight' as 'macro_insight' | 'knowledgebase',
    content_slug: '',
    campaign_name: '',
    target_audience_hint: '',
    budget_allocated: 0,
    utm_source: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<{
    preview_url: string
    campaign_id: string
    campaign_name: string
  } | null>(null)
  const [approving, setApproving] = useState(false)
  const [contentList, setContentList] = useState<ContentItem[]>([])
  const [loadingContent, setLoadingContent] = useState(false)
  const [selectedNewsForMix, setSelectedNewsForMix] = useState<NewsArticle | null>(null)

  // CRM states
  const [noteModal, setNoteModal] = useState<Lead | null>(null)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // ─── Fetchers ─────────────────────────────────────────────────────────────

  const fetchNews = useCallback(async () => {
    setLoadingNews(true)
    const res = await fetch('/api/admin/news-today')
    const data = await res.json()
    setNewsData(data)
    setLoadingNews(false)
  }, [])

  const fetchCampaigns = useCallback(async () => {
    setLoadingCampaigns(true)
    const res = await fetch('/api/admin/lp-campaigns')
    const { campaigns: data } = await res.json()
    setCampaigns(data ?? [])
    setLoadingCampaigns(false)
  }, [])

  const fetchLeads = useCallback(async () => {
    setLoadingLeads(true)
    const res = await fetch('/api/admin/leads?limit=300')
    const { leads: data } = await res.json()
    setLeads(data ?? [])
    setLoadingLeads(false)
  }, [])

  const fetchContentList = useCallback(async (type: string) => {
    setLoadingContent(true)
    setCreateForm(f => ({ ...f, content_slug: '' }))
    const res = await fetch(`/api/admin/content-list?type=${type}`)
    const { items } = await res.json()
    setContentList(items ?? [])
    setLoadingContent(false)
  }, [])

  useEffect(() => {
    fetchNews()
    fetchCampaigns()
    fetchLeads()
    fetchContentList('macro_insight')
  }, [fetchNews, fetchCampaigns, fetchLeads, fetchContentList])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectNews = (article: NewsArticle) => {
    setSelectedNews(article)
    setCreateForm(f => ({
      ...f,
      content_slug: article.topic_slug,
      campaign_name: article.title,
      target_audience_hint: article.category,
    }))
    setActiveTab('campaign')
  }

  const generateCampaign = async () => {
    if (!createForm.content_slug || !createForm.campaign_name) return
    setGenerating(true)
    setGeneratedResult(null)
    const res = await fetch('/api/admin/lp-campaigns/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...createForm,
        news_context: selectedNewsForMix ? {
          title: selectedNewsForMix.title,
          category: selectedNewsForMix.category,
          analyst_view: selectedNewsForMix.analyst_view,
          data_point: null,
        } : undefined,
      }),
    })
    const data = await res.json()
    setGenerating(false)
    if (data.preview_url) {
      setGeneratedResult({
        preview_url: `https://finpeace.cloud${data.preview_url}`,
        campaign_id: data.campaign_id,
        campaign_name: createForm.campaign_name,
      })
    }
    fetchCampaigns()
  }

  const approveCampaign = async (campaignId: string) => {
    setApproving(true)
    await fetch(`/api/admin/lp-campaigns/${campaignId}/approve`, { method: 'POST' })
    setApproving(false)
    setGeneratedResult(prev => prev ? { ...prev, campaign_id: '' } : null)
    fetchCampaigns()
  }

  const updateCrmStage = async (lead: Lead, crm_stage: string) => {
    await fetch(`/api/admin/leads/${lead.id}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crm_stage }),
    })
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, crm_stage } : l))
  }

  const saveNote = async () => {
    if (!noteModal) return
    setSavingNote(true)
    await fetch(`/api/admin/leads/${noteModal.id}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: noteText }),
    })
    setSavingNote(false)
    setLeads(prev => prev.map(l => l.id === noteModal.id ? { ...l, notes: noteText } : l))
    setNoteModal(null)
  }

  // ─── Computed ─────────────────────────────────────────────────────────────

  // Campaign stats
  const totalViews7d = campaigns.reduce((s, c) => s + (c.views_7d || 0), 0)
  const totalLeads7d = campaigns.reduce((s, c) => s + (c.leads_7d || 0), 0)
  const overallCR = totalViews7d > 0 ? ((totalLeads7d / totalViews7d) * 100).toFixed(1) : '—'

  // CRM pipeline counts
  const crmCounts = CRM_STAGES.reduce((acc, s) => {
    acc[s.id] = leads.filter(l => (l.crm_stage || 'new') === s.id).length
    return acc
  }, {} as Record<string, number>)

  // Agent performance
  const agentPerf = AGENT_CODES.map(code => {
    const agentCampaigns = campaigns.filter(c => c.agent_code === code)
    const views = agentCampaigns.reduce((s, c) => s + (c.views_7d || 0), 0)
    const leadsCount = agentCampaigns.reduce((s, c) => s + (c.leads_7d || 0), 0)
    const cr = views > 0 ? (leadsCount / views) * 100 : 0
    const agentLeads = leads.filter(l => l.ref_code === code)
    const crmBreakdown = CRM_STAGES.reduce((acc, s) => {
      acc[s.id] = agentLeads.filter(l => (l.crm_stage || 'new') === s.id).length
      return acc
    }, {} as Record<string, number>)
    return {
      code, name: AGENT_NAMES[code] ?? code,
      campaigns: agentCampaigns.length,
      views, leadsCount, cr,
      crmBreakdown,
      viewsOk: views >= TARGETS.views_week,
      crOk: cr >= TARGETS.cr_pct,
    }
  })

  const crm_groups = CRM_STAGES.reduce((acc, s) => {
    acc[s.id] = leads.filter(l => (l.crm_stage || 'new') === s.id)
    return acc
  }, {} as Record<string, Lead[]>)

  // ─── Render Helpers ────────────────────────────────────────────────────────

  const impactDot = (score: number) => {
    const colors = ['', 'bg-emerald-400', 'bg-amber-400', 'bg-red-400']
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[score] || 'bg-slate-400'}`} />
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0d1119] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <a href="/advisor/admin/lp-manager" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">← LP Manager</a>
            <span className="text-slate-700">/</span>
            <span className="text-[#c4a67a] text-xs uppercase tracking-widest">Attract & Convert Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white">⚡ Attract & Convert Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý Stage Attract (ToFU) + Convert (MoFU) theo chiến lược FPxKBSV</p>
        </div>

        {/* Global Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'LP Views/7d', value: totalViews7d, target: `Target: ${TARGETS.views_week}`, ok: totalViews7d >= TARGETS.views_week },
            { label: 'Leads/7d', value: totalLeads7d, target: 'Tổng', ok: null },
            { label: 'CR% (7d)', value: `${overallCR}%`, target: `Target: ${TARGETS.cr_pct}%`, ok: parseFloat(overallCR) >= TARGETS.cr_pct },
            { label: 'Pipeline: Mới', value: crmCounts['new'] || 0, target: 'Cần liên hệ', ok: null },
            { label: 'Mở TK KBSV', value: crmCounts['opened'] || 0, target: 'Chuyển đổi', ok: true },
          ].map(s => (
            <div key={s.label} className={`bg-[#111827] border rounded-xl p-3 text-center ${s.ok === true ? 'border-emerald-500/30' : s.ok === false ? 'border-red-500/30' : 'border-[#1e2535]'}`}>
              <p className={`text-xl font-bold ${s.ok === true ? 'text-emerald-400' : s.ok === false ? 'text-red-400' : 'text-white'}`}>{s.value}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
              {s.target && <p className="text-slate-600 text-xs mt-0.5">{s.target}</p>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#111827] rounded-xl p-1 border border-[#1e2535]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#c4a67a] text-[#0d1119]'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e2535]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: News Intelligence ── */}
        {activeTab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">📡 Tin Tức Hôm Nay</h2>
                {newsData?.date && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    Dữ liệu ngày {newsData.date} {newsData.is_today ? '✅ Hôm nay' : '⚠️ Dữ liệu cũ nhất có thể'}
                  </p>
                )}
              </div>
              <button onClick={fetchNews} className="px-3 py-1.5 bg-[#1e2535] text-slate-400 rounded-lg text-xs hover:bg-[#2a3548] transition-colors">
                🔄 Làm mới
              </button>
            </div>

            {loadingNews ? (
              <div className="flex items-center justify-center h-40 text-slate-500">Đang tải tin tức...</div>
            ) : !newsData?.articles.length ? (
              <div className="flex items-center justify-center h-40 text-slate-500">Không có dữ liệu tin tức hôm nay</div>
            ) : (
              <div className="space-y-3">
                {newsData.articles.map(article => (
                  <div key={article.id} className="bg-[#111827] border border-[#1e2535] rounded-xl p-5 hover:border-[#c4a67a]/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {impactDot(article.impact_score)}
                          <span className="text-xs text-slate-500 bg-[#1e2535] px-2 py-0.5 rounded-full">{article.category}</span>
                          {article.kb_article && (
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                              📚 {article.kb_article}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-white text-base mb-2">{article.title}</h3>
                        {article.analyst_view && (
                          <p className="text-slate-400 text-sm line-clamp-2">{article.analyst_view}</p>
                        )}
                        {article.companies.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {article.companies.map(c => (
                              <span key={c.ticker} className="text-xs bg-[#1e2535] text-slate-400 px-2 py-0.5 rounded">
                                {c.ticker}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col gap-2 items-end">
                        <button
                          onClick={() => handleSelectNews(article)}
                          className="px-3 py-1.5 bg-[#c4a67a] text-[#0d1119] rounded-lg text-xs font-semibold hover:bg-[#d4b68a] transition-colors whitespace-nowrap"
                        >
                          🚀 Tạo Campaign
                        </button>
                        {article.kb_article_slug && (
                          <a
                            href={`https://finpeace.cloud/knowledgebase/${article.kb_article_slug}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition-colors whitespace-nowrap"
                          >
                            📚 Xem KB
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Campaign Workshop ── */}
        {activeTab === 'campaign' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: News list */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">📰 Chọn tin tức</h2>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {!newsData?.articles.length ? (
                  <div className="text-slate-500 text-sm py-8 text-center">Không có tin tức — vào tab News Intelligence trước</div>
                ) : newsData.articles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => handleSelectNews(article)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedNews?.id === article.id
                        ? 'border-[#c4a67a] bg-[#c4a67a]/10'
                        : 'border-[#1e2535] bg-[#111827] hover:border-[#2a3548]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {impactDot(article.impact_score)}
                      <span className="text-xs text-slate-500">{article.category}</span>
                    </div>
                    <p className="text-sm font-medium text-white line-clamp-2">{article.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Create form */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">
                {selectedNews ? `🚀 Tạo Campaign: "${selectedNews.title}"` : '🚀 Tạo Campaign Mới'}
              </h2>
              <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-5 space-y-4">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Sales Agent</label>
                  <select
                    value={createForm.agent_code}
                    onChange={e => setCreateForm(f => ({ ...f, agent_code: e.target.value }))}
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {AGENT_CODES.map(c => <option key={c} value={c}>{AGENT_NAMES[c]} ({c})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Loại nội dung</label>
                  <select
                    value={createForm.content_type}
                    onChange={e => {
                      const t = e.target.value as 'macro_insight' | 'knowledgebase'
                      setCreateForm(f => ({ ...f, content_type: t, content_slug: '' }))
                      fetchContentList(t)
                    }}
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="macro_insight">📊 Macro Insight</option>
                    <option value="knowledgebase">📚 Knowledgebase Article</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">
                    {createForm.content_type === 'macro_insight' ? '📊 Chọn Macro Insight' : '📚 Chọn bài KB'}
                    {loadingContent && <span className="ml-2 text-slate-600 text-xs">Đang tải...</span>}
                  </label>
                  <select
                    value={createForm.content_slug}
                    onChange={e => {
                      const slug = e.target.value
                      const item = contentList.find(c => c.slug === slug)
                      setCreateForm(f => ({
                        ...f,
                        content_slug: slug,
                        campaign_name: f.campaign_name || (item?.title ?? ''),
                        target_audience_hint: f.target_audience_hint || (item?.pillar ?? ''),
                      }))
                    }}
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                    disabled={loadingContent || contentList.length === 0}
                  >
                    <option value="">— Chọn nội dung —</option>
                    {contentList.map(item => (
                      <option key={item.slug} value={item.slug}>
                        [{item.pillar}] {item.title}{item.date_label ? ` (${item.date_label})` : ''}
                      </option>
                    ))}
                  </select>
                  {createForm.content_slug && (
                    <p className="text-slate-600 text-xs mt-1 truncate">slug: <span className="text-slate-400">{createForm.content_slug}</span></p>
                  )}
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Tên Campaign</label>
                  <input
                    value={createForm.campaign_name}
                    onChange={e => setCreateForm(f => ({ ...f, campaign_name: e.target.value }))}
                    placeholder="vd: KBSV Korean March 2026"
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Target Audience (cho AI)</label>
                  <input
                    value={createForm.target_audience_hint}
                    onChange={e => setCreateForm(f => ({ ...f, target_audience_hint: e.target.value }))}
                    placeholder="vd: Korean expats lo lắng về lãi suất Fed"
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">
                    📰 Mix tin tức hôm nay (tùy chọn)
                  </label>
                  <select
                    value={selectedNewsForMix?.id ?? ''}
                    onChange={e => {
                      const found = newsData?.articles.find(a => a.id === e.target.value) ?? null
                      setSelectedNewsForMix(found)
                    }}
                    className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">— Không mix tin tức —</option>
                    {(newsData?.articles ?? []).map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.category}] {a.title}
                      </option>
                    ))}
                  </select>
                  {selectedNewsForMix && (
                    <p className="text-amber-400/70 text-xs mt-1">
                      ⚡ AI sẽ liên kết Kiến Thức + Tin Tức này trong hook & nội dung LP
                    </p>
                  )}
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

                {generatedResult && (
                  <div className="bg-[#0d1119] border border-[#c4a67a]/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-lg">✅</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{generatedResult.campaign_name}</p>
                        <p className="text-slate-500 text-xs">Đã tạo — đang chờ duyệt (draft)</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        href={generatedResult.preview_url}
                        target="_blank"
                        className="w-full py-2 bg-[#1e2535] text-slate-300 rounded-lg text-sm text-center hover:bg-[#2a3548] transition-colors"
                      >
                        👁️ Preview Landing Page
                      </a>
                      {generatedResult.campaign_id && (
                        <button
                          onClick={() => approveCampaign(generatedResult.campaign_id)}
                          disabled={approving}
                          className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50"
                        >
                          {approving ? '⏳ Đang duyệt...' : '✅ Duyệt & Publish ngay'}
                        </button>
                      )}
                      {!generatedResult.campaign_id && (
                        <p className="text-emerald-400 text-xs text-center">🎉 Đã publish thành công!</p>
                      )}
                      <a
                        href="/advisor/admin/lp-manager"
                        className="w-full py-2 border border-[#1e2535] text-slate-500 rounded-lg text-xs text-center hover:text-slate-400 transition-colors"
                      >
                        → Quản lý tất cả campaigns tại LP Manager
                      </a>
                    </div>
                  </div>
                )}


                <button
                  onClick={generateCampaign}
                  disabled={generating || !createForm.content_slug || !createForm.campaign_name}
                  className="w-full py-2.5 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold hover:bg-[#d4b68a] transition-colors disabled:opacity-50"
                >
                  {generating ? '⏳ AI đang generate...' : '✨ Generate Campaign với AI'}
                </button>
              </div>

              {/* Active campaigns mini list */}
              <div className="mt-4">
                <p className="text-slate-500 text-xs mb-2">{loadingCampaigns ? 'Đang tải...' : `${campaigns.filter(c => c.status === 'active').length} campaigns đang active`}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Lead CRM Pipeline ── */}
        {activeTab === 'crm' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">🎯 Lead CRM Pipeline</h2>
              <button onClick={fetchLeads} className="px-3 py-1.5 bg-[#1e2535] text-slate-400 rounded-lg text-xs hover:bg-[#2a3548] transition-colors">🔄 Làm mới</button>
            </div>

            {loadingLeads ? (
              <div className="flex items-center justify-center h-40 text-slate-500">Đang tải leads...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {CRM_STAGES.map(stage => {
                  const stageLeads = crm_groups[stage.id] ?? []
                  return (
                    <div key={stage.id} className={`bg-[#111827] rounded-xl border-t-2 ${stage.color} border-x border-b border-[#1e2535] p-4`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white text-sm">{stage.label}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stage.badge}`}>{stageLeads.length}</span>
                      </div>
                      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                        {stageLeads.length === 0 ? (
                          <p className="text-slate-600 text-xs text-center py-4">Chưa có leads</p>
                        ) : stageLeads.map(lead => (
                          <div key={lead.id} className="bg-[#0d1119] rounded-lg p-3 border border-[#1e2535]">
                            <p className="text-white text-sm font-medium truncate">{lead.full_name || '—'}</p>
                            <p className="text-slate-500 text-xs truncate mt-0.5">{lead.phone || lead.email || '—'}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="text-xs text-slate-600">{fmtDate(lead.registered_at)}</span>
                              {lead.utm_source && (
                                <span className="text-xs bg-[#1e2535] text-slate-500 px-1.5 py-0.5 rounded ml-auto">{lead.utm_source}</span>
                              )}
                            </div>
                            {lead.notes && (
                              <p className="text-slate-500 text-xs mt-1.5 italic line-clamp-1">📝 {lead.notes}</p>
                            )}
                            <div className="flex gap-1 mt-2">
                              <select
                                value={lead.crm_stage || 'new'}
                                onChange={e => updateCrmStage(lead, e.target.value)}
                                className="flex-1 text-xs bg-[#111827] border border-[#1e2535] rounded px-1 py-1 text-slate-400"
                              >
                                {CRM_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                              </select>
                              <button
                                onClick={() => { setNoteModal(lead); setNoteText(lead.notes || '') }}
                                className="px-2 py-1 bg-[#1e2535] text-slate-400 rounded text-xs hover:bg-[#2a3548] transition-colors"
                                title="Ghi chú"
                              >
                                📝
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: Agent Performance ── */}
        {activeTab === 'perf' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">📊 Agent Performance</h2>
            <div className="bg-[#111827] border border-[#1e2535] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2535]">
                    <th className="text-left px-5 py-3 text-slate-500 font-medium">Agent</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Campaigns</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">
                      Views/7d
                      <span className="block text-xs text-slate-600 font-normal">Target: {TARGETS.views_week}</span>
                    </th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">
                      Leads/7d
                    </th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">
                      CR%
                      <span className="block text-xs text-slate-600 font-normal">Target: {TARGETS.cr_pct}%</span>
                    </th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2535]">
                  {agentPerf.map(agent => (
                    <tr key={agent.code} className="hover:bg-[#0f172a] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="text-slate-500 text-xs">{agent.code}</p>
                      </td>
                      <td className="px-4 py-4 text-center text-slate-300">{agent.campaigns}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-semibold ${agent.viewsOk ? 'text-emerald-400' : agent.views > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {agent.views}
                        </span>
                        {agent.viewsOk && <span className="ml-1 text-xs text-emerald-600">✓</span>}
                      </td>
                      <td className="px-4 py-4 text-center text-[#c4a67a] font-semibold">{agent.leadsCount}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-semibold ${agent.crOk ? 'text-emerald-400' : agent.cr > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {agent.cr > 0 ? agent.cr.toFixed(1) : '—'}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {CRM_STAGES.map(s => (
                            <span key={s.id} className={`text-xs px-1.5 py-0.5 rounded ${s.badge}`}>
                              {s.label.split(' ')[0]}: {agent.crmBreakdown[s.id] || 0}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-slate-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" /> Đạt target</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" /> Có tín hiệu nhưng chưa đủ</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-600 rounded-full" /> Chưa có dữ liệu</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Note Modal ── */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold mb-1">📝 Ghi chú — {noteModal.full_name || 'Lead'}</h3>
            <p className="text-slate-500 text-xs mb-4">{noteModal.phone || noteModal.email}</p>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={4}
              placeholder="Ghi chú tình trạng liên hệ, mối quan tâm, bước tiếp theo..."
              className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:border-[#c4a67a]"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm hover:bg-[#1e2535] transition-colors">Huỷ</button>
              <button onClick={saveNote} disabled={savingNote} className="flex-1 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold disabled:opacity-50">
                {savingNote ? 'Đang lưu...' : 'Lưu ghi chú'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
