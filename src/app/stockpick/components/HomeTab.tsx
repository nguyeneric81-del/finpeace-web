'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, BookOpen, Zap, ArrowRight,
  ChevronLeft, ChevronRight, Newspaper, BarChart2, Clock,
  Target, Activity, Shield, Brain, DollarSign, Flame
} from 'lucide-react'

type MacroInsight = {
  id: string
  title: string
  category: string
  data_point: string
  analyst_view: string
  accent_color: string
  impact_positive: boolean
  date_label: string
  narrow_industry: string
  companies?: Array<{ ticker: string; note?: string }>
  key_stats?: Array<{ label: string; value: string; change?: string }>
}

type KBArticle = {
  id: string
  slug: string
  pillar: string
  title: string
  summary: string
}

type TradeStats = {
  total: number
  waiting: number
  bought: number
  holding: number
  partial: number
}

type NewsItem = {
  id: number
  title: string
  source: string
  published_at: string
  category: string
  tickers: string[]
}

type HomeData = {
  macroInsights: MacroInsight[]
  kbArticles: KBArticle[]
  stats: TradeStats
  recentNews: NewsItem[]
}

const PILLAR_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  'co-che-thi-truong': { label: 'Cơ chế TT', icon: BarChart2, color: '#3b82f6' },
  'phan-tich-co-ban': { label: 'Phân tích CB', icon: DollarSign, color: '#10b981' },
  'phan-tich-doanh-nghiep': { label: 'Doanh nghiệp', icon: Target, color: '#f59e0b' },
  'dau-tu-gia-tri': { label: 'Đầu tư GT', icon: Shield, color: '#8b5cf6' },
  'tam-ly-thi-truong': { label: 'Tâm lý TT', icon: Brain, color: '#ec4899' },
  'huyen-thoai-dau-tu': { label: 'Huyền thoại', icon: Flame, color: '#f97316' },
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}p trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`
  return `${Math.floor(diff / 86400)}d trước`
}

function formatPillar(pillar: string): string {
  return PILLAR_META[pillar]?.label || pillar
}

// ===== MACRO INSIGHT CARD =====
function MacroCard({ insight, isActive }: { insight: MacroInsight; isActive: boolean }) {
  const color = insight.accent_color || '#10b981'
  const companies = Array.isArray(insight.companies) ? insight.companies : []
  const keyStats = Array.isArray(insight.key_stats) ? insight.key_stats.slice(0, 2) : []

  return (
    <motion.div
      animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.96 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: '100%',
        background: 'rgba(15,20,35,0.95)',
        border: `1px solid ${color}25`,
        boxShadow: isActive ? `0 0 30px ${color}15, inset 0 0 0 0.5px ${color}20` : 'none',
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{insight.category}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Clock className="w-3 h-3" />
          {insight.date_label}
        </div>
      </div>

      {/* Impact badge */}
      <div className="px-4 pb-2">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: insight.impact_positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: insight.impact_positive ? '#10b981' : '#ef4444',
            border: `1px solid ${insight.impact_positive ? '#10b981' : '#ef4444'}25`
          }}>
          {insight.impact_positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {insight.impact_positive ? 'Tích cực' : 'Cẩn trọng'}
        </span>
      </div>

      {/* Title */}
      <div className="px-4 pb-3">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{insight.title}</h3>
        <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {insight.narrow_industry}
        </p>
      </div>

      {/* Data point */}
      <div className="mx-4 mb-3 rounded-xl px-3 py-2.5"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <p className="text-[11px] font-semibold leading-relaxed" style={{ color }}>{insight.data_point}</p>
      </div>

      {/* Key Stats */}
      {keyStats.length > 0 && (
        <div className="px-4 pb-3 flex gap-2">
          {keyStats.map((stat, i) => (
            <div key={i} className="flex-1 rounded-xl px-2.5 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-[9px] text-white/30 uppercase tracking-wide">{stat.label}</p>
              <p className="text-sm font-bold text-white mt-0.5">{stat.value}</p>
              {stat.change && (
                <p className="text-[9px] mt-0.5" style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>{stat.change}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analyst view */}
      <div className="px-4 pb-4">
        <p className="text-[10px] leading-relaxed line-clamp-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="font-semibold text-white/60">Analyst: </span>{insight.analyst_view}
        </p>
      </div>

      {/* Companies */}
      {companies.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-1.5">
          {companies.slice(0, 4).map((c: { ticker: string }, i: number) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md font-bold"
              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
              {c.ticker}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ===== KB ARTICLE CARD =====
function KBCard({ article, onTap }: { article: KBArticle; onTap?: () => void }) {
  const meta = PILLAR_META[article.pillar] || { label: article.pillar, icon: BookOpen, color: '#6b7280' }
  const Icon = meta.icon

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      className="rounded-xl px-3 py-3 cursor-pointer transition-all"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${meta.color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
              style={{ background: `${meta.color}12`, color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <h4 className="text-[11px] font-semibold text-white leading-snug line-clamp-2">{article.title}</h4>
          <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{article.summary}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mt-1" />
      </div>
    </motion.div>
  )
}

// ===== NEWS TICKER =====
function NewsTicker({ items }: { items: NewsItem[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (items.length === 0) return
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])

  if (items.length === 0) return null
  const current = items[idx]

  return (
    <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Newspaper className="w-3 h-3 text-amber-400" />
        <span className="text-[9px] font-bold text-amber-400 uppercase">Tin mới</span>
      </div>
      <div className="w-px h-3 bg-white/10 flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] text-white/60 line-clamp-1 flex-1"
        >
          {current.title}
        </motion.p>
      </AnimatePresence>
      <span className="text-[9px] text-white/25 flex-shrink-0">{timeAgo(current.published_at)}</span>
    </div>
  )
}

// ===== STATS BAR =====
function StatsBar({ stats }: { stats: TradeStats }) {
  const items = [
    { label: 'Tổng deals', value: stats.total, color: '#f59e0b' },
    { label: 'Chờ mua', value: stats.waiting, color: '#64748b' },
    { label: 'Đã mua', value: stats.bought, color: '#10b981' },
    { label: 'Đang giữ', value: stats.holding, color: '#818cf8' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl p-2.5 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
          <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

// ===== MAIN HOME TAB =====
type Props = {
  tier: 'FREE' | 'BRONZE'
  onNavigateToTab?: (tab: string) => void
}

export default function HomeTab({ tier, onNavigateToTab }: Props) {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [macroIdx, setMacroIdx] = useState(0)
  const [kbPillar, setKbPillar] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/stockpick/home')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const insights = data?.macroInsights || []
  const kbAll = data?.kbArticles || []
  const kbFiltered = kbPillar ? kbAll.filter(a => a.pillar === kbPillar) : kbAll
  const pillars = Array.from(new Set(kbAll.map(a => a.pillar)))

  const prevInsight = () => setMacroIdx(i => Math.max(0, i - 1))
  const nextInsight = () => setMacroIdx(i => Math.min(insights.length - 1, i + 1))

  if (loading) {
    return (
      <div className="space-y-4 pt-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 pt-2 pb-4"
    >
      {/* === HERO GREETING === */}
      <div className="rounded-2xl px-4 py-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(15,20,35,0.95) 60%)',
          border: '1px solid rgba(245,158,11,0.12)',
        }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">STOCKPICK 2.0</p>
            <h2 className="text-base font-bold text-white mt-0.5">Chào buổi sáng 👋</h2>
            <p className="text-[11px] text-white/40 mt-1">Thị trường có thể biến động. Kế hoạch của bạn thì không.</p>
          </div>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* === NEWS TICKER === */}
      {data?.recentNews && data.recentNews.length > 0 && (
        <NewsTicker items={data.recentNews} />
      )}

      {/* === TRADING STATS === */}
      {data?.stats && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">Tổng quan Deals</h3>
            <button
              onClick={() => onNavigateToTab?.('deals')}
              className="text-[10px] text-amber-400 flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <StatsBar stats={data.stats} />
        </div>
      )}

      {/* === MACRO INSIGHTS CAROUSEL === */}
      {insights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Macro Insights</h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Dot indicators */}
              <div className="flex gap-1">
                {insights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMacroIdx(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === macroIdx ? 14 : 5,
                      height: 5,
                      background: i === macroIdx
                        ? insights[i].accent_color || '#f59e0b'
                        : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
              <button onClick={prevInsight} disabled={macroIdx === 0}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', opacity: macroIdx === 0 ? 0.3 : 1 }}>
                <ChevronLeft className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={nextInsight} disabled={macroIdx === insights.length - 1}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', opacity: macroIdx === insights.length - 1 ? 0.3 : 1 }}>
                <ChevronRight className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden" ref={carouselRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={macroIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MacroCard insight={insights[macroIdx]} isActive={true} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination text */}
          <p className="text-center text-[10px] text-white/20 mt-2">
            {macroIdx + 1} / {insights.length} insights
          </p>
        </div>
      )}

      {/* === KB ARTICLES === */}
      {kbAll.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bài học đầu tư</h3>
            </div>
            <button
              onClick={() => onNavigateToTab?.('learn')}
              className="text-[10px] text-blue-400 flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pillar filter pills */}
          {pillars.length > 1 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 hide-scrollbar">
              <button
                onClick={() => setKbPillar(null)}
                className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-medium transition-all"
                style={{
                  background: !kbPillar ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  border: !kbPillar ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  color: !kbPillar ? '#60a5fa' : 'rgba(255,255,255,0.35)',
                }}
              >
                Tất cả
              </button>
              {pillars.map(p => {
                const meta = PILLAR_META[p]
                const isActive = kbPillar === p
                return (
                  <button
                    key={p}
                    onClick={() => setKbPillar(isActive ? null : p)}
                    className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-medium transition-all"
                    style={{
                      background: isActive ? `${meta?.color || '#3b82f6'}15` : 'rgba(255,255,255,0.04)',
                      border: isActive ? `1px solid ${meta?.color || '#3b82f6'}30` : '1px solid rgba(255,255,255,0.06)',
                      color: isActive ? meta?.color || '#60a5fa' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {meta?.label || p}
                  </button>
                )
              })}
            </div>
          )}

          {/* Article list */}
          <div className="space-y-2">
            <AnimatePresence>
              {kbFiltered.slice(0, 5).map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <KBCard
                    article={article}
                    onTap={() => onNavigateToTab?.('learn')}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {kbFiltered.length > 5 && (
            <button
              onClick={() => onNavigateToTab?.('learn')}
              className="w-full mt-2 py-2.5 rounded-xl text-[11px] font-medium transition-all"
              style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.12)',
                color: '#60a5fa',
              }}
            >
              Xem thêm {kbFiltered.length - 5} bài học →
            </button>
          )}
        </div>
      )}

      {/* === UPGRADE CTA for FREE === */}
      {tier === 'FREE' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl px-4 py-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.05) 100%)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #f59e0b, transparent 60%)' }} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Nâng cấp lên Bronze</p>
              <p className="text-[10px] text-white/40 mt-0.5">Mở khóa Macro Insights cao cấp & Market Pulse</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab?.('deals')}
            className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              boxShadow: '0 4px 15px rgba(245,158,11,0.25)',
            }}
          >
            Nâng cấp ngay — 299K/tháng
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
