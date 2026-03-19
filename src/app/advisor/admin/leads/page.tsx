'use client'

import { useState, useEffect, useCallback } from 'react'

type Lead = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  ref_code: string
  utm_source: string | null
  status: 'new' | 'contacted' | 'converted'
  registered_at: string
  converted_at: string | null
  agent_landing_pages: {
    slug: string
    campaign_name: string | null
    content_type: 'macro_insight' | 'knowledgebase'
  } | null
  sales_agents: {
    code: string
    full_name: string
    brand_color_accent: string
  } | null
}

const STATUS_CONFIG = {
  new:       { label: 'Mới',      bg: 'bg-blue-500/20',    text: 'text-blue-400' },
  contacted: { label: 'Đã liên hệ', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  converted: { label: 'Đã chuyển đổi', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
}

const AGENT_CODES = ['mq01', 'aduc02', 'thuy03', 'huyen04', 'mduc05']
const AGENT_NAMES: Record<string, string> = {
  mq01: 'Minh Quang', aduc02: 'Anh Đức', thuy03: 'Lê Thuỷ', huyen04: '🇰🇷 Minaviko', mduc05: 'Minh Đức'
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function fmtPhone(phone: string | null) {
  if (!phone) return '—'
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

export default function LeadsReportPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterAgent !== 'all') params.set('agent_code', filterAgent)
    if (filterStatus !== 'all') params.set('status', filterStatus)
    const res = await fetch(`/api/admin/leads?${params}`)
    const { leads: data } = await res.json()
    setLeads(data ?? [])
    setLoading(false)
  }, [filterAgent, filterStatus])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setUpdatingId(null)
    fetchLeads()
  }

  // Client-side search filter
  const filtered = leads.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.full_name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.phone?.includes(q)
    )
  })

  // Group by agent
  const grouped: Record<string, Lead[]> = {}
  for (const l of filtered) {
    const code = l.ref_code || 'unknown'
    if (!grouped[code]) grouped[code] = []
    grouped[code].push(l)
  }

  // Summary stats
  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.status === 'new').length
  const converted = leads.filter(l => l.status === 'converted').length
  const crPct = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : '—'

  return (
    <div className="min-h-screen bg-[#0d1119] text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#c4a67a] text-xs uppercase tracking-widest mb-1">FinPeace Admin</p>
          <h1 className="text-2xl font-bold text-white">📋 Leads Report</h1>
          <p className="text-slate-400 text-sm mt-1">Danh sách leads theo từng Sales Agent</p>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng Leads', value: totalLeads, color: 'text-white' },
            { label: 'Mới chưa liên hệ', value: newLeads, color: 'text-blue-400' },
            { label: 'Đã chuyển đổi', value: converted, color: 'text-emerald-400' },
            { label: 'Tỷ lệ chuyển đổi', value: `${crPct}%`, color: 'text-[#c4a67a]' },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-[#1e2535] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Tìm tên, email, SĐT..."
            className="flex-1 min-w-[220px] bg-[#111827] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#c4a67a]"
          />
          <select
            value={filterAgent}
            onChange={e => setFilterAgent(e.target.value)}
            className="bg-[#111827] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">Tất cả Agents</option>
            {AGENT_CODES.map(c => (
              <option key={c} value={c}>{AGENT_NAMES[c] ?? c}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#111827] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="converted">Đã chuyển đổi</option>
          </select>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-[#1e2535] text-slate-300 rounded-lg text-sm hover:bg-[#2a3548] transition-colors"
          >
            🔄 Làm mới
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Đang tải dữ liệu...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500">
            Chưa có leads nào {filterAgent !== 'all' ? `cho ${AGENT_NAMES[filterAgent] ?? filterAgent}` : ''}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Render per agent group */}
            {(filterAgent !== 'all' ? [filterAgent] : AGENT_CODES).map(agentCode => {
              const agentLeads = grouped[agentCode] ?? []
              if (agentLeads.length === 0 && filterAgent === 'all') return null

              const agentName = AGENT_NAMES[agentCode] ?? agentCode
              const agentNew = agentLeads.filter(l => l.status === 'new').length
              const agentConverted = agentLeads.filter(l => l.status === 'converted').length

              return (
                <div key={agentCode} className="bg-[#111827] rounded-xl border border-[#1e2535] overflow-hidden">
                  {/* Agent header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2535]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#c4a67a]" />
                      <span className="font-semibold text-white">{agentName}</span>
                      <span className="text-slate-500 text-sm">({agentCode})</span>
                      <span className="text-xs bg-[#1e2535] text-slate-400 px-2 py-0.5 rounded-full">
                        {agentLeads.length} leads
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-blue-400">{agentNew} mới</span>
                      <span className="text-emerald-400">{agentConverted} chuyển đổi</span>
                    </div>
                  </div>

                  {agentLeads.length === 0 ? (
                    <div className="px-6 py-6 text-center text-slate-500 text-sm">Chưa có leads</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#1e2535]">
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Họ tên</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Email</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">SĐT</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Campaign</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Nguồn</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-slate-500 font-medium">Ngày đăng ký</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e2535]">
                          {agentLeads.map(lead => {
                            const sc = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new
                            const campaign = lead.agent_landing_pages
                            return (
                              <tr key={lead.id} className="hover:bg-[#0f172a] transition-colors">
                                <td className="px-4 py-3 text-white font-medium">
                                  {lead.full_name || '—'}
                                </td>
                                <td className="px-4 py-3 text-slate-300">
                                  {lead.email ? (
                                    <a href={`mailto:${lead.email}`} className="hover:text-[#c4a67a] transition-colors">
                                      {lead.email}
                                    </a>
                                  ) : '—'}
                                </td>
                                <td className="px-4 py-3 text-slate-300">
                                  {lead.phone ? (
                                    <a href={`tel:${lead.phone}`} className="hover:text-[#c4a67a] transition-colors">
                                      {fmtPhone(lead.phone)}
                                    </a>
                                  ) : '—'}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">
                                  {campaign?.campaign_name || campaign?.slug || '—'}
                                </td>
                                <td className="px-4 py-3">
                                  {lead.utm_source ? (
                                    <span className="text-xs bg-[#1e2535] text-slate-400 px-2 py-0.5 rounded-full">
                                      {lead.utm_source}
                                    </span>
                                  ) : '—'}
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={lead.status}
                                    onChange={e => updateStatus(lead.id, e.target.value)}
                                    disabled={updatingId === lead.id}
                                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${sc.bg} ${sc.text} disabled:opacity-50`}
                                  >
                                    <option value="new">🔵 Mới</option>
                                    <option value="contacted">🟡 Đã liên hệ</option>
                                    <option value="converted">🟢 Đã chuyển đổi</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                  {fmtDate(lead.registered_at)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
