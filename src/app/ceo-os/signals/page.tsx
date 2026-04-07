'use client'

import { useEffect, useState, useCallback } from 'react'

type NewsItem = {
  id: number
  title: string
  description: string
  source: string
  link: string
  published_at: string | null
  status: 'pending' | 'analyzed' | 'approved' | 'rejected'
  relevance: number | null
  tags: string[] | null
  tickers: string[] | null
  category: 'positive' | 'negative' | 'neutral' | null
  crawl_date: string
}

const STATUS_TABS = [
  { key: 'analyzed', label: 'Chờ duyệt', icon: '🔍' },
  { key: 'pending', label: 'Chưa phân tích', icon: '🕐' },
  { key: 'approved', label: 'Đã duyệt', icon: '✅' },
  { key: 'rejected', label: 'Đã từ chối', icon: '🚫' },
]

const IMPACT_CONFIG = {
  positive: { label: 'Tích cực', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  negative: { label: 'Tiêu cực', color: 'bg-red-500/20 text-red-300 border-red-500/30', dot: 'bg-red-400' },
  neutral: { label: 'Trung lập', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', dot: 'bg-slate-400' },
}

export default function SignalsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [activeTab, setActiveTab] = useState('analyzed')
  const [loading, setLoading] = useState(false)
  const [crawling, setCrawling] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadNews = useCallback(async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/signals/news?status=${status}&limit=50`)
      const data = await res.json()
      if (data.success) setNews(data.news)
    } catch (e) {
      showToast('Lỗi tải danh sách tin!', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNews(activeTab)
  }, [activeTab, loadNews])

  const handleCrawl = async () => {
    setCrawling(true)
    try {
      const res = await fetch('/api/admin/signals/crawl', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showToast(`✅ Crawled ${data.count} tin mới!`)
        if (activeTab === 'pending') loadNews('pending')
      } else {
        showToast(`❌ Lỗi: ${data.error}`, 'error')
      }
    } catch (e) {
      showToast('Lỗi kết nối!', 'error')
    } finally {
      setCrawling(false)
    }
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/admin/signals/analyze', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showToast(`🤖 AI phân tích xong ${data.analyzed} tin!`)
        loadNews(activeTab)
      } else {
        showToast(`❌ Groq Error: ${data.error}`, 'error')
      }
    } catch (e) {
      showToast('Lỗi kết nối Groq!', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApprove = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/signals/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(status === 'approved' ? '✅ Đã duyệt tin!' : '🚫 Đã từ chối tin!')
        setNews(prev => prev.filter(n => n.id !== id))
      }
    } catch (e) {
      showToast('Lỗi cập nhật!', 'error')
    }
  }

  return (
    <div className="p-8 space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl transition-all
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-400/70 mb-1">Module 1</p>
          <h1 className="text-3xl font-black text-white">📡 Tín Hiệu Thị Trường</h1>
          <p className="text-white/40 mt-1 text-sm">Crawl RSS → Groq AI phân tích → CEO duyệt → Agents nhận tín hiệu</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCrawl}
            disabled={crawling}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold hover:bg-blue-500/30 transition-all disabled:opacity-50"
          >
            {crawling ? (
              <span className="animate-spin">⚙️</span>
            ) : '📡'}
            {crawling ? 'Đang crawl...' : 'Crawl tin mới'}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-bold hover:bg-purple-500/30 transition-all disabled:opacity-50"
          >
            {analyzing ? (
              <span className="animate-pulse">⏳</span>
            ) : '🤖'}
            {analyzing ? 'Groq đang phân tích...' : 'Tiến hành phân tích'}
          </button>
        </div>
      </div>

      {/* Pipeline visual */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-white/30">
        <span className="bg-white/10 px-3 py-1 rounded-full">📡 Crawl RSS</span>
        <span>→</span>
        <span className="bg-white/10 px-3 py-1 rounded-full">🤖 Groq AI</span>
        <span>→</span>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">👑 CEO Duyệt</span>
        <span>→</span>
        <span className="bg-white/10 px-3 py-1 rounded-full">🤖 Agents nhận</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-xl transition-all border-b-2
              ${activeTab === tab.key
                ? 'text-amber-300 border-amber-400 bg-amber-500/10'
                : 'text-white/40 border-transparent hover:text-white/60'
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* News list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-white/30 text-sm animate-pulse">Đang tải dữ liệu...</div>
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <span className="text-4xl opacity-30">🫙</span>
          <p className="text-white/30 text-sm">Không có tin trong mục này</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item) => {
            const impact = item.category ? IMPACT_CONFIG[item.category] : null
            return (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold text-white/40 bg-white/10 px-2 py-0.5 rounded">
                        {item.source}
                      </span>
                      {impact && (
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${impact.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${impact.dot}`}></span>
                          {impact.label}
                        </span>
                      )}
                      {item.relevance && (
                        <span className="text-[11px] font-black text-amber-400">
                          ⚡ {item.relevance}/10
                        </span>
                      )}
                      {item.tickers && item.tickers.length > 0 && item.tickers.map(t => (
                        <span key={t} className="text-[10px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-amber-300 transition-colors leading-snug block mb-2">
                      {item.title}
                    </a>
                    {item.description && (
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                        {item.description.substring(0, 200)}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">
                            {tag.substring(0, 60)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons — chỉ hiện khi analyzed */}
                  {activeTab === 'analyzed' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(item.id, 'approved')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all"
                      >
                        ✅ Duyệt
                      </button>
                      <button
                        onClick={() => handleApprove(item.id, 'rejected')}
                        className="px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
                      >
                        🚫 Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
