'use client'

import { useEffect, useState } from 'react'

type PerfData = {
  summary: {
    agent_leads_total: number
    kb_leads_total: number
    content_views_total: number
    reactions_total: number
    lp_count: number
    lp_views_total: number
    raw_news_total: number
    news_approved: number
  }
  crm_funnel: Record<string, number>
  weekly_trend: { label: string; agent: number; kb: number }[]
  kb_by_pillar: { pillar: string; count: number }[]
  views_by_pillar: { pillar: string; count: number }[]
  news_pipeline: { pending: number; approved: number; ignored: number }
  lp_by_status: Record<string, number>
  budget: { allocated: number }
}

const PILLAR_LABELS: Record<string, string> = {
  'phan-tich-co-ban': 'PTCB',
  'phan-tich-ky-thuat': 'PTKT',
  'phan-tich-doanh-nghiep': 'DN',
  'dau-tu-tang-truong': 'Tăng Trưởng',
  'quan-tri-rui-ro': 'Rủi Ro',
  'giao-dich-theo-xu-huong': 'Xu Hướng',
  'dau-tu-gia-tri': 'Giá Trị',
  'quan-ly-danh-muc': 'QLDM',
  'trading-plan': 'Trading Plan',
}

const CRM_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: '#60a5fa' },
  contacted: { label: 'Đã liên hệ', color: '#34d399' },
  qualified: { label: 'Đủ điều kiện', color: '#fbbf24' },
  opened: { label: 'Đã mở', color: '#a78bfa' },
}

const LP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'Đang chạy', color: '#34d399' },
  draft: { label: 'Nháp', color: '#9ca3af' },
  pending_review: { label: 'Chờ duyệt', color: '#fbbf24' },
  paused: { label: 'Tạm dừng', color: '#f87171' },
  generating: { label: 'Đang tạo', color: '#818cf8' },
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden flex-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function SparkBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{
            height: `${Math.max(4, (val / max) * 100)}%`,
            background: val === 0 ? 'rgba(255,255,255,0.1)' : color,
            opacity: 0.5 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  )
}

export default function PerformancePage() {
  const [data, setData] = useState<PerfData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/performance')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
        setLastUpdated(new Date().toLocaleTimeString('vi-VN'))
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000) // auto-refresh every 60s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-orange-400/40 border-t-orange-400 rounded-full animate-spin mx-auto" />
          <p className="text-white/30 text-sm">Đang tải dữ liệu hiệu suất...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { summary, crm_funnel, weekly_trend, kb_by_pillar, views_by_pillar, news_pipeline, lp_by_status } = data
  const totalLeads = summary.agent_leads_total + summary.kb_leads_total

  // Weekly spark data
  const agentWeekly = weekly_trend.map(w => w.agent)
  const kbWeekly = weekly_trend.map(w => w.kb)
  const maxWeekly = Math.max(...weekly_trend.map(w => w.agent + w.kb), 1)

  return (
    <div className="p-8 space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-400/70 mb-1">Module 4</p>
          <h1 className="text-3xl font-black text-white">📊 Hiệu Suất Agents</h1>
          <p className="text-white/40 mt-1 text-sm">Real-time analytics từ toàn bộ hệ thống FinPeace</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Auto-refresh · Cập nhật lúc {lastUpdated}</span>
          <button onClick={loadData} className="ml-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white/50 hover:text-white/70">
            ↻
          </button>
        </div>
      </div>

      {/* KPI Row 1 — Top metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Tổng Lead',
            value: totalLeads,
            sub: `${summary.agent_leads_total} Agent · ${summary.kb_leads_total} KB`,
            icon: '🎯',
            color: '#f59e0b',
            sparkData: [...agentWeekly.map((v, i) => v + kbWeekly[i])],
            sparkColor: '#f59e0b',
          },
          {
            label: 'Lượt xem nội dung',
            value: summary.content_views_total.toLocaleString(),
            sub: `${summary.reactions_total} reactions`,
            icon: '👁️',
            color: '#60a5fa',
            sparkData: views_by_pillar.slice(0, 8).map(v => v.count),
            sparkColor: '#60a5fa',
          },
          {
            label: 'Landing Pages',
            value: summary.lp_count,
            sub: `${lp_by_status['active'] || 0} đang chạy · ${summary.lp_views_total} views`,
            icon: '📄',
            color: '#a78bfa',
            sparkData: Object.values(lp_by_status),
            sparkColor: '#a78bfa',
          },
          {
            label: 'Tín hiệu đã duyệt',
            value: summary.news_approved,
            sub: `${news_pipeline.pending} chờ · ${summary.raw_news_total} tổng`,
            icon: '📡',
            color: '#34d399',
            sparkData: [news_pipeline.pending, news_pipeline.approved, news_pipeline.ignored],
            sparkColor: '#34d399',
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/8 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xl">{kpi.icon}</span>
              <SparkBar data={kpi.sparkData} color={kpi.sparkColor} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{kpi.value}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: kpi.color }}>{kpi.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — Trend + CRM funnel */}
      <div className="grid grid-cols-3 gap-5">
        {/* Weekly leads trend */}
        <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-black text-white">📈 Xu hướng Lead theo tuần</p>
              <p className="text-[11px] text-white/30 mt-0.5">8 tuần gần nhất</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />Agent LP</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />KB</span>
            </div>
          </div>
          {/* Chart */}
          <div className="flex items-end gap-2 h-32">
            {weekly_trend.map((week, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex flex-col items-center gap-0.5 w-full" style={{ height: '100px' }}>
                  {/* Stacked bars */}
                  <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '100px' }}>
                    <div
                      className="w-full rounded-t-sm bg-amber-400/70 transition-all duration-700"
                      style={{ height: `${Math.max(2, (week.agent / maxWeekly) * 90)}px` }}
                      title={`Agent: ${week.agent}`}
                    />
                    <div
                      className="w-full rounded-b-sm bg-blue-400/50 transition-all duration-700"
                      style={{ height: `${Math.max(2, (week.kb / maxWeekly) * 90)}px` }}
                      title={`KB: ${week.kb}`}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-white/30 text-center">{week.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Funnel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-sm font-black text-white mb-1">🏆 CRM Funnel</p>
          <p className="text-[11px] text-white/30 mb-5">Agent leads theo giai đoạn</p>
          <div className="space-y-3">
            {Object.entries(crm_funnel)
              .sort((a, b) => b[1] - a[1])
              .map(([stage, count]) => {
                const cfg = CRM_LABELS[stage] || { label: stage, color: '#9ca3af' }
                const total = Object.values(crm_funnel).reduce((a, b) => a + b, 0)
                return (
                  <div key={stage} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="text-xs text-white/50 font-mono">{count} ({Math.round((count / total) * 100)}%)</span>
                    </div>
                    <MiniBar value={count} max={total} color={cfg.color} />
                  </div>
                )
              })}
          </div>
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-xs text-white/30">Tổng Agent Leads</p>
            <p className="text-2xl font-black text-white mt-0.5">{summary.agent_leads_total}</p>
          </div>
        </div>
      </div>

      {/* Row 3 — KB by pillar + News pipeline + LP status */}
      <div className="grid grid-cols-3 gap-5">
        {/* KB leads by pillar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-sm font-black text-white mb-1">📚 KB Leads theo Pillar</p>
          <p className="text-[11px] text-white/30 mb-5">Top pillars thu hút lead nhất</p>
          <div className="space-y-3">
            {kb_by_pillar.map((item, i) => (
              <div key={item.pillar} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/70">
                    {PILLAR_LABELS[item.pillar] || item.pillar}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{item.count}</span>
                </div>
                <MiniBar
                  value={item.count}
                  max={kb_by_pillar[0]?.count || 1}
                  color={`hsl(${200 + i * 22}, 70%, 60%)`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content views by pillar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-sm font-black text-white mb-1">👁️ Views theo Pillar</p>
          <p className="text-[11px] text-white/30 mb-5">Lượt xem KB content</p>
          <div className="space-y-3">
            {views_by_pillar.map((item, i) => (
              <div key={item.pillar} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/70">
                    {PILLAR_LABELS[item.pillar] || item.pillar}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{item.count}</span>
                </div>
                <MiniBar
                  value={item.count}
                  max={views_by_pillar[0]?.count || 1}
                  color={`hsl(${140 + i * 18}, 65%, 55%)`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* News pipeline + LP Status */}
        <div className="space-y-4">
          {/* News pipeline */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-sm font-black text-white mb-4">📡 Tín hiệu thị trường</p>
            <div className="space-y-2">
              {[
                { label: 'Chờ duyệt', value: news_pipeline.pending, color: '#fbbf24' },
                { label: 'Đã duyệt', value: news_pipeline.approved, color: '#34d399' },
                { label: 'Bỏ qua', value: news_pipeline.ignored, color: '#6b7280' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-white/50 flex-1">{item.label}</span>
                  <span className="text-sm font-black" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LP by status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-sm font-black text-white mb-4">📄 Landing Pages</p>
            <div className="space-y-2">
              {Object.entries(lp_by_status)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const cfg = LP_STATUS_LABELS[status] || { label: status, color: '#9ca3af' }
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      <span className="text-xs text-white/50 flex-1">{cfg.label}</span>
                      <span className="text-sm font-black" style={{ color: cfg.color }}>{count}</span>
                    </div>
                  )
                })}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/30">Tổng views LP</span>
                <span className="text-sm font-black text-white">{summary.lp_views_total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Quick insights */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: '🎯',
            title: 'Conversion rate',
            value: summary.agent_leads_total > 0
              ? `${Math.round(((crm_funnel['qualified'] || 0) / summary.agent_leads_total) * 100)}%`
              : 'N/A',
            sub: 'Lead → Qualified (Agent funnel)',
            color: 'text-amber-300',
            bgColor: 'bg-amber-500/10 border-amber-500/20',
          },
          {
            icon: '📬',
            title: 'Lead quality (KB)',
            value: summary.kb_leads_total > 0
              ? `${Math.round((summary.kb_leads_total / summary.content_views_total) * 100 * 10) / 10}%`
              : 'N/A',
            sub: 'Views → KB Lead capture',
            color: 'text-blue-300',
            bgColor: 'bg-blue-500/10 border-blue-500/20',
          },
          {
            icon: '💥',
            title: 'Engagement rate',
            value: summary.content_views_total > 0
              ? `${Math.round((summary.reactions_total / summary.content_views_total) * 100 * 10) / 10}%`
              : 'N/A',
            sub: 'Views → Reactions (like/love)',
            color: 'text-purple-300',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
          },
        ].map(item => (
          <div key={item.title} className={`border rounded-2xl p-5 ${item.bgColor}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-xs font-black text-white/50 uppercase tracking-widest">{item.title}</p>
            </div>
            <p className={`text-4xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-white/30 mt-2">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
