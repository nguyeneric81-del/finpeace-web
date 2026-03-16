'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Flame, CalendarDays,
  ArrowRight, Globe, DollarSign, Factory,
  ChevronRight, BarChart2, Building2, Minus, Hammer
} from 'lucide-react'

type Company = { ticker: string; name: string; impact?: string; matchScore?: number; positive?: boolean }
type Story = {
  id: string; title: string; date: string; category: string
  dataPoint: string; narrowIndustry: string
  quantifiedImpact: { positive: boolean; value: string }
  companies: Company[]; accent: string; accentBg: string
}

const CategoryIcon = ({ category }: { category: string }) => {
  const map: Record<string, React.ReactNode> = {
    'Chuỗi Cung Ứng': <Globe className="w-3.5 h-3.5" />,
    'Chính sách Tiền tệ': <DollarSign className="w-3.5 h-3.5" />,
    'Đầu tư Nước ngoài': <Factory className="w-3.5 h-3.5" />,
    'Hạ tầng & Tăng trưởng': <Hammer className="w-3.5 h-3.5" />,
  }
  return <>{map[category] ?? <BarChart2 className="w-3.5 h-3.5" />}</>
}

const MatchRing = ({ score, accent }: { score: number; accent: string }) => {
  const r = 18; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="absolute w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={accent} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${accent}80)` }}
        />
      </svg>
      <span className="text-xs font-bold text-white">{score}%</span>
    </div>
  )
}

export default function MacroInsightsListClient({ stories }: { stories: Story[] }) {
  const availableMonths = Array.from(new Set(stories.map(s => s.date))).sort((a, b) => b.localeCompare(a))
  const [activeMonth, setActiveMonth] = useState(availableMonths[0] ?? '')
  const filteredStories = stories.filter(s => s.date === activeMonth)

  return (
    <div className="min-h-screen text-slate-200 overflow-x-hidden" style={{ background: '#020617', fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }} className="sticky top-0 z-20 px-6 md:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">FinPeace Research Desk</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-500">
            <span><span className="text-slate-300 font-semibold">{stories.length}</span> Báo cáo</span>
            <span className="text-emerald-400 font-semibold">Cập nhật: {availableMonths[0]}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* ── HEADER ── */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Flame className="w-3.5 h-3.5" /> Câu chuyện Vĩ mô Mỗi tháng
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
            Góc Nhìn <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #38bdf8, #34d399)' }}>Thực Chiến</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Định lượng tác động Vĩ mô xuống tận Nhóm ngành hẹp — soi chiếu trực tiếp vào Kế hoạch giao dịch.
          </p>
        </div>

        {/* ── MONTH TABS ── */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-slate-500 mr-2 shrink-0">
            <CalendarDays className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Kỳ</span>
          </div>
          {availableMonths.map(month => (
            <button key={month} onClick={() => setActiveMonth(month)}
              className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={activeMonth === month
                ? { background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)', boxShadow: '0 0 16px rgba(56,189,248,0.15)' }
                : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >{month}</button>
          ))}
        </div>

        {/* ── STORY CARDS ── */}
        <div className="space-y-8">
          {filteredStories.map(story => (
            <article key={story.id} className="rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.003]"
              style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 0 1px rgba(255,255,255,0.03)' }}>
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${story.accent}, transparent)` }} />
              <div className="p-6 md:p-8 grid xl:grid-cols-[2fr_1fr_2fr] gap-8 items-start">

                {/* COL 1: Macro Signal */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: story.accentBg, color: story.accent, border: `1px solid ${story.accent}30` }}>
                      <CategoryIcon category={story.category} />{story.category}
                    </span>
                    <span className="text-xs text-slate-500">{story.date}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">{story.title}</h2>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                      <BarChart2 className="w-3 h-3" /> Dữ liệu thực tế
                    </p>
                    <p className="text-sm font-semibold" style={{ color: story.accent }}>{story.dataPoint}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Nhóm ngành hẹp</p>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm font-semibold text-slate-200">{story.narrowIndustry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                    style={{
                      background: story.quantifiedImpact.positive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                      border: `1px solid ${story.quantifiedImpact.positive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                    }}>
                    {story.quantifiedImpact.positive
                      ? <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      : <TrendingDown className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    }
                    <p className="text-xs leading-relaxed" style={{ color: story.quantifiedImpact.positive ? '#34d399' : '#fb7185' }}>
                      {story.quantifiedImpact.value}
                    </p>
                  </div>
                </div>

                {/* COL 2: Match Score + Detail Link */}
                <div className="flex flex-col items-center justify-start gap-5 pt-2">
                  <div className="text-center">
                    <MatchRing score={story.companies[0]?.matchScore ?? 85} accent={story.accent} />
                    <p className="text-xs text-slate-500 mt-2">Fit Score</p>
                    <p className="text-xs font-semibold text-slate-300">{story.companies[0]?.ticker}</p>
                  </div>
                  <Link href={`/advisor/macro-insights/${story.id}`}>
                    <div className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-200 hover:brightness-125"
                      style={{ background: story.accentBg, color: story.accent, border: `1px solid ${story.accent}30` }}>
                      <ChevronRight className="w-4 h-4" /> Chi tiết
                    </div>
                  </Link>
                </div>

                {/* COL 3: Company Cards */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-black" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {story.companies.length}
                    </span>
                    Doanh Nghiệp Trọng Điểm
                  </p>
                  {story.companies.map(company => (
                    <div key={company.ticker} className="group flex items-start justify-between rounded-2xl p-4 transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-sm font-black px-2.5 py-0.5 rounded-lg"
                            style={{ background: story.accentBg, color: story.accent, fontFamily: 'monospace' }}>
                            {company.ticker}
                          </span>
                          <span className="text-xs text-slate-400">{company.name}</span>
                          {company.positive !== undefined && (
                            company.positive
                              ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                              : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          )}
                        </div>
                        {company.impact && <p className="text-xs text-slate-400 leading-relaxed">{company.impact}</p>}
                      </div>
                      <Link href={`/advisor/trading-plan/${company.ticker.toLowerCase()}`}>
                        <button className="ml-3 shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 cursor-pointer"
                          style={{ background: story.accentBg, color: story.accent }}>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {filteredStories.length === 0 && (
            <div className="py-20 text-center">
              <Minus className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">Chưa có báo cáo Vĩ mô cho tháng này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
