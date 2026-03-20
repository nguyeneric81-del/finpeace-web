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

export default function LpManagerPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'clarity'>('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [clarityMetrics, setClarityMetrics] = useState<ClarityMetrics | null>(null)
  const [clarityLoading, setClarityLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editNotes, setEditNotes] = useState<{ id: string; notes: string } | null>(null)
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
    } catch (e) {
      console.error('Failed to fetch clarity metrics', e)
    } finally {
      setClarityLoading(false)
    }
  }, [])

  useEffect(() => { fetchCampaigns() }, [fetchCampaigns])
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

  const AGENTS = ['mq01', 'aduc02', 'thuy03', 'huyen04', 'mduc05']
  const AGENT_NAMES: Record<string, string> = {
    mq01: 'Minh Quang', aduc02: 'Anh Đức', thuy03: 'Lê Thuỷ', huyen04: '🇰🇷 Minaviko', mduc05: 'Minh Đức'
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
        ) : loading ? (
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
        )}
      </div>

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
          <div className="text-2xl mb-2">⏳</div>
          <p>Đang tải Clarity metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <button onClick={onRefresh} className="px-4 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-semibold">
          🔄 Tải dữ liệu
        </button>
      </div>
    )
  }

  const { kpis, funnel, by_campaign, by_agent } = metrics

  // KPI card helper
  const crColor = kpis.cr_pct >= 5 ? 'text-emerald-400' : kpis.cr_pct >= 3 ? 'text-amber-400' : 'text-red-400'
  const phoneColor = kpis.valid_phone_rate >= 80 ? 'text-emerald-400' : 'text-amber-400'
  const cacColor = !kpis.cac ? 'text-slate-400' : kpis.cac <= 1_000_000 ? 'text-emerald-400' : 'text-amber-400'

  // Funnel steps
  const funnelSteps = [
    { label: 'LP Views', value: funnel.views, target: '200+/tuần', color: 'bg-blue-500' },
    { label: 'Leads', value: funnel.new + funnel.contacted + funnel.qualified + funnel.opened, target: 'CR > 5%', color: 'bg-[#c4a67a]' },
    { label: 'Contacted', value: funnel.contacted + funnel.qualified + funnel.opened, target: '', color: 'bg-amber-500' },
    { label: 'Qualified', value: funnel.qualified + funnel.opened, target: '', color: 'bg-orange-500' },
    { label: 'Blueprint CTA', value: funnel.opened, target: '> 20%', color: 'bg-emerald-500' },
  ]

  const totalLeads = funnel.new + funnel.contacted + funnel.qualified + funnel.opened

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">📈 Clarity Performance</h2>
          <p className="text-slate-400 text-xs mt-0.5">Full-funnel: LP → Leads → Clarity → Blueprint</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-3 py-1.5 text-xs bg-[#1e2535] text-slate-300 rounded-lg hover:bg-[#2a3548] transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
          <p className="text-slate-400 text-xs mb-1">LP Views (7d)</p>
          <p className="text-2xl font-bold text-white">{kpis.views_7d}</p>
          <p className="text-slate-600 text-xs mt-1">target: 200+/tuần</p>
          {kpis.views_7d >= 200
            ? <span className="text-xs text-emerald-400">✓ On target</span>
            : <span className="text-xs text-amber-400">↑ Cần tăng thêm</span>}
        </div>
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
          <p className="text-slate-400 text-xs mb-1">Leads (7d)</p>
          <p className="text-2xl font-bold text-[#c4a67a]">{kpis.leads_7d}</p>
          <p className="text-slate-600 text-xs mt-1">total: {kpis.total_leads_all_time}</p>
        </div>
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
          <p className="text-slate-400 text-xs mb-1">CR% (7d)</p>
          <p className={`text-2xl font-bold ${crColor}`}>{kpis.cr_pct}%</p>
          <p className="text-slate-600 text-xs mt-1">target: {'>'} 5%</p>
          {kpis.cr_pct >= 5
            ? <span className="text-xs text-emerald-400">✓ On target</span>
            : <span className="text-xs text-red-400">✗ Dưới target</span>}
        </div>
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
          <p className="text-slate-400 text-xs mb-1">SĐT Valid</p>
          <p className={`text-2xl font-bold ${phoneColor}`}>{kpis.valid_phone_rate}%</p>
          <p className="text-slate-600 text-xs mt-1">target: {'>'} 80%</p>
          {kpis.valid_phone_rate >= 80
            ? <span className="text-xs text-emerald-400">✓ On target</span>
            : <span className="text-xs text-amber-400">↑ Cần cải thiện</span>}
        </div>
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-4">
          <p className="text-slate-400 text-xs mb-1">CAC</p>
          <p className={`text-2xl font-bold ${cacColor}`}>
            {kpis.cac ? (kpis.cac / 1_000_000).toFixed(1) + 'M' : '—'}
          </p>
          <p className="text-slate-600 text-xs mt-1">target: {'<'} 1M VND</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-6">
        <h3 className="text-white font-semibold mb-4">🔽 Clarity Funnel</h3>
        <div className="flex items-stretch gap-2">
          {funnelSteps.map((step, i) => {
            const pct = funnelSteps[0].value > 0
              ? Math.round((step.value / funnelSteps[0].value) * 100)
              : 0
            return (
              <div key={step.label} className="flex-1 text-center">
                <div className="relative mb-2">
                  <div className="bg-[#0d1119] rounded-lg p-3 border border-[#1e2535]">
                    <p className="text-xl font-bold text-white">{step.value}</p>
                    <p className="text-slate-400 text-xs">{step.label}</p>
                    {i > 0 && (
                      <p className="text-xs mt-1 font-medium" style={{ color: pct >= 20 ? '#34d399' : '#f59e0b' }}>
                        {pct}%
                      </p>
                    )}
                    {step.target && (
                      <p className="text-slate-600 text-xs mt-0.5">{step.target}</p>
                    )}
                  </div>
                  {/* Bar height indicator */}
                  <div className="mt-2 mx-auto w-full bg-[#1e2535] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${step.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className="absolute top-1/2 right-0 text-slate-600 text-lg hidden" />
                )}
              </div>
            )
          })}
        </div>

        {/* Stage breakdown bar */}
        {totalLeads > 0 && (
          <div className="mt-4">
            <p className="text-slate-500 text-xs mb-2">Stage breakdown (all time)</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div className="bg-blue-500/80" style={{ width: `${Math.round(funnel.new / totalLeads * 100)}%` }} title={`New: ${funnel.new}`} />
              <div className="bg-amber-500/80" style={{ width: `${Math.round(funnel.contacted / totalLeads * 100)}%` }} title={`Contacted: ${funnel.contacted}`} />
              <div className="bg-orange-500/80" style={{ width: `${Math.round(funnel.qualified / totalLeads * 100)}%` }} title={`Qualified: ${funnel.qualified}`} />
              <div className="bg-emerald-500/80" style={{ width: `${Math.round(funnel.opened / totalLeads * 100)}%` }} title={`Blueprint: ${funnel.opened}`} />
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

      {/* By Agent */}
      {by_agent.length > 0 && (
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] p-6">
          <h3 className="text-white font-semibold mb-4">👤 Breakdown by Agent</h3>
          <div className="space-y-3">
            {by_agent.map(a => (
              <div key={a.agent_code} className="flex items-center gap-4 py-2 border-b border-[#1e2535] last:border-0">
                <div className="w-32 shrink-0">
                  <p className="text-white text-sm font-medium">{a.agent_name}</p>
                  <p className="text-slate-500 text-xs">{a.agent_code}</p>
                </div>
                <div className="flex gap-6 text-center text-sm">
                  <div>
                    <p className="text-white font-medium">{a.views}</p>
                    <p className="text-slate-500 text-xs">views</p>
                  </div>
                  <div>
                    <p className="text-[#c4a67a] font-medium">{a.leads}</p>
                    <p className="text-slate-500 text-xs">leads</p>
                  </div>
                  <div>
                    <p className={`font-medium ${a.cr >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>{a.cr}%</p>
                    <p className="text-slate-500 text-xs">CR</p>
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">{a.campaigns}</p>
                    <p className="text-slate-500 text-xs">campaigns</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Campaign Table */}
      {by_campaign.length > 0 && (
        <div className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e2535]">
            <h3 className="text-white font-semibold">📋 Performance by Campaign</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-[#1e2535]">
                  <th className="text-left px-6 py-3">Campaign</th>
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
                      <td className="px-6 py-3 text-white font-medium truncate max-w-[200px]">
                        {c.campaign_name || c.slug || '—'}
                      </td>
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
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
