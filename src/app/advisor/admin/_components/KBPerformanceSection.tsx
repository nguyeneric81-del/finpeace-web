'use client'
import { useState, useEffect, useCallback } from 'react'
import { Loader2, TrendingUp, Users, BookOpen, Target, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

// ── Pillar display names ──
const PILLAR_NAMES: Record<string, string> = {
  'phan-tich-co-ban': 'Phân tích Cơ bản',
  'phan-tich-ky-thuat': 'Phân tích Kỹ thuật',
  'quan-ly-danh-muc': 'Quản lý Danh mục',
  'quan-tri-rui-ro': 'Quản trị Rủi ro',
  'dau-tu-tang-truong': 'Đầu tư Tăng trưởng',
  'dau-tu-gia-tri': 'Đầu tư Giá trị',
  'giao-dich-theo-xu-huong': 'Giao dịch theo Xu hướng',
  'trading-plan': 'Trading Plan',
  'phan-tich-doanh-nghiep': 'Phân tích Doanh nghiệp',
}

const TRACK_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  investor: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Investor' },
  trader: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Trader' },
  mastery: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Mastery' },
  unknown: { bg: 'bg-slate-500/15', text: 'text-slate-400', label: 'Unknown' },
}

type KBData = {
  total: number
  byTrack: Record<string, number>
  pillarRanking: { pillar: string; count: number }[]
  topArticles: { slug: string; pillar: string; count: number }[]
  trend: { date: string; count: number }[]
  recentLeads: {
    id: string; name: string|null; email: string|null; phone: string|null
    pillar: string|null; article_slug: string|null; track: string|null
    source: string|null; sales_code: string|null; created_at: string
  }[]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function fmtShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}
function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Mini bar chart (pure CSS) ──
function MiniBarChart({ data, maxH = 48 }: { data: { date: string; count: number }[]; maxH?: number }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-[2px] h-12" title="Leads / ngày (30 ngày gần nhất)">
      {data.map((d, i) => (
        <div key={i} className="flex-1 min-w-[3px] group relative">
          <div
            className="w-full bg-[#c4a67a] rounded-t-sm transition-all hover:bg-[#d4b68a]"
            style={{ height: `${Math.max((d.count / max) * maxH, 2)}px` }}
          />
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-[#1e2535] text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap shadow-lg">
            {fmtShortDate(d.date)}: {d.count}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Pillar progress bar ──
function PillarBar({ name, count, max }: { name: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 text-xs text-slate-300 truncate">{name}</div>
      <div className="flex-1 bg-[#1e2535] rounded-full h-2.5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#c4a67a] to-[#d4b68a] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-8 text-right text-xs font-bold text-[#c4a67a]">{count}</div>
    </div>
  )
}

export default function KBPerformanceSection() {
  const [data, setData] = useState<KBData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllLeads, setShowAllLeads] = useState(false)
  const [expandedArticles, setExpandedArticles] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/kb-performance')
      const json = await res.json()
      setData(json)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="h-40 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#c4a67a] w-6 h-6" />
    </div>
  )

  if (!data) return (
    <div className="text-center py-12 text-slate-500">Không thể tải dữ liệu KB</div>
  )

  const maxPillar = Math.max(...data.pillarRanking.map(p => p.count), 1)
  const displayArticles = expandedArticles ? data.topArticles : data.topArticles.slice(0, 8)
  const displayLeads = showAllLeads ? data.recentLeads : data.recentLeads.slice(0, 8)

  return (
    <div className="space-y-5">

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#c4a67a]/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#c4a67a]" />
            </div>
            <span className="text-slate-500 text-xs">Tổng Leads</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.total}</p>
          <p className="text-slate-600 text-[10px] mt-0.5">từ KB articles</p>
        </div>

        {Object.entries(data.byTrack).map(([track, count]) => {
          const tc = TRACK_COLORS[track] || TRACK_COLORS.unknown
          return (
            <div key={track} className="bg-[#111827] border border-[#1e2535] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${tc.bg} flex items-center justify-center`}>
                  <Target className={`w-4 h-4 ${tc.text}`} />
                </div>
                <span className="text-slate-500 text-xs">{tc.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-slate-600 text-[10px] mt-0.5">{((count / data.total) * 100).toFixed(0)}% tổng leads</p>
            </div>
          )
        })}
      </div>

      {/* ── Trend Chart ── */}
      {data.trend.length > 0 && (
        <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c4a67a]" />
              <span className="text-white text-sm font-semibold">Leads theo ngày</span>
            </div>
            <span className="text-slate-500 text-xs">30 ngày gần nhất</span>
          </div>
          <MiniBarChart data={data.trend} />
        </div>
      )}

      {/* ── 2-column: Pillar Performance + Top Articles ── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Pillar Performance */}
        <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-sm font-semibold">Hiệu quả theo Pillar</span>
          </div>
          <div className="space-y-3">
            {data.pillarRanking.map(p => (
              <PillarBar key={p.pillar} name={PILLAR_NAMES[p.pillar] || p.pillar} count={p.count} max={maxPillar} />
            ))}
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-[#111827] border border-[#1e2535] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-semibold">Top bài viết thu Lead</span>
            </div>
            <span className="text-slate-500 text-xs">{data.topArticles.length} bài</span>
          </div>
          <div className="space-y-2">
            {displayArticles.map((a, i) => (
              <div key={a.slug} className="flex items-center gap-3 py-1.5 border-b border-[#1e2535]/60 last:border-0">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? 'bg-[#c4a67a]/20 text-[#c4a67a]' : 'bg-[#1e2535] text-slate-500'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{slugToTitle(a.slug)}</p>
                  <p className="text-slate-600 text-[10px]">{PILLAR_NAMES[a.pillar] || a.pillar}</p>
                </div>
                <span className="text-[#c4a67a] text-sm font-bold">{a.count}</span>
              </div>
            ))}
          </div>
          {data.topArticles.length > 8 && (
            <button onClick={() => setExpandedArticles(e => !e)} className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
              {expandedArticles ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expandedArticles ? 'Thu gọn' : `Xem tất cả ${data.topArticles.length} bài`}
            </button>
          )}
        </div>
      </div>

      {/* ── Recent Leads Table ── */}
      <div className="bg-[#111827] border border-[#1e2535] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e2535] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-semibold">Leads gần đây</span>
          </div>
          <button onClick={load} className="text-xs text-slate-400 bg-[#1e2535] px-3 py-1.5 rounded-lg hover:bg-[#2a3548]">🔄</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium">Tên</th>
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium">Email / SĐT</th>
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium">Bài viết</th>
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium">Track</th>
                <th className="px-4 py-2.5 text-left text-slate-500 font-medium">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {displayLeads.map(l => {
                const tc = TRACK_COLORS[l.track || 'unknown'] || TRACK_COLORS.unknown
                return (
                  <tr key={l.id} className="border-b border-[#1e2535]/40 hover:bg-[#1e2535]/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="text-white font-medium">{l.name || '—'}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-slate-300">{l.email || '—'}</p>
                      {l.phone && <p className="text-emerald-400 text-[10px] mt-0.5">{l.phone}</p>}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-slate-300 truncate max-w-[180px]">{slugToTitle(l.article_slug || 'unknown')}</p>
                      <p className="text-slate-600 text-[10px]">{PILLAR_NAMES[l.pillar || ''] || l.pillar}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tc.bg} ${tc.text}`}>{tc.label}</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                      {fmtDate(l.created_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {data.recentLeads.length > 8 && (
          <div className="px-4 py-3 border-t border-[#1e2535]">
            <button onClick={() => setShowAllLeads(s => !s)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
              {showAllLeads ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showAllLeads ? 'Thu gọn' : `Xem tất cả ${data.recentLeads.length} leads`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
