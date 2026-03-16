'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Phone, MessageCircle, CheckCircle2, Send, BarChart2 } from 'lucide-react'

interface Agent {
  id: string; code: string; full_name: string; brand_name: string
  brand_tagline: string; brand_color_primary: string; brand_color_accent: string
  avatar_url: string | null; title: string | null
  contact_phone: string | null; contact_zalo: string | null
}
interface Story {
  title: string; category: string; date: string; dataPoint: string
  narrowIndustry: string; quantifiedImpact: { positive: boolean; value: string }
  accent: string; behindStory: { point: string; quote: string; source: string }[]
  analystView: string; keyStats: { label: string; value: string; positive?: boolean }[]
}

interface Props {
  agent: Agent; story: Story; lpConfig: any; agentCode: string
  topicSlug: string; lpId: string | null
}

export default function SalesLandingPageClient({ agent, story, lpConfig, agentCode, topicSlug, lpId }: Props) {
  const primary = agent.brand_color_primary
  const accent = agent.brand_color_accent
  const hook = lpConfig?.custom_hook || story.title
  const cta = lpConfig?.custom_cta || 'Đăng ký tư vấn miễn phí'

  // Lead capture form
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Track view on mount
  useEffect(() => {
    fetch('/api/lp/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lpId, agentCode, topicSlug }),
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email && !form.phone) { setError('Vui lòng nhập Email hoặc SĐT.'); return }
    setSubmitting(true); setError('')
    const res = await fetch('/api/lp/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, agentCode, topicSlug, lpId, agentId: agent.id }),
    })
    if (res.ok) { setSubmitted(true) }
    else { setError('Có lỗi xảy ra. Vui lòng thử lại.') }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen text-slate-100" style={{ background: primary, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

      {/* ── AGENT HEADER ── */}
      <header className="px-6 py-5 flex items-center gap-4 border-b border-white/10">
        {agent.avatar_url ? (
          <img src={agent.avatar_url} alt={agent.full_name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: accent }} />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-2" style={{ background: accent + '30', borderColor: accent, color: accent }}>
            {agent.full_name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">{agent.brand_name}</p>
          <p className="font-bold text-white">{agent.full_name}</p>
          {agent.title && <p className="text-xs opacity-50">{agent.title}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {agent.contact_phone && (
            <a href={`tel:${agent.contact_phone}`} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-all" style={{ background: accent + '20', color: accent }}>
              <Phone className="w-3.5 h-3.5" />{agent.contact_phone}
            </a>
          )}
          {agent.contact_zalo && (
            <a href={`https://zalo.me/${agent.contact_zalo}`} target="_blank" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full" style={{ background: '#0068FF30', color: '#60A5FA' }}>
              <MessageCircle className="w-3.5 h-3.5" /> Zalo
            </a>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* ── HERO ── */}
        <section>
          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: accent + '20', color: accent, border: `1px solid ${accent}40` }}>
            {story.category} · {story.date}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{hook}</h1>
          <div className="flex items-start gap-3 rounded-2xl p-5" style={{
            background: story.quantifiedImpact.positive ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
            border: `1px solid ${story.quantifiedImpact.positive ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
          }}>
            {story.quantifiedImpact.positive ? <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            <p className="text-sm font-semibold leading-relaxed" style={{ color: story.quantifiedImpact.positive ? '#34d399' : '#fb7185' }}>
              {story.quantifiedImpact.value}
            </p>
          </div>
        </section>

        {/* ── KEY STATS ── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-5 flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5" /> Số liệu cốt lõi</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {story.keyStats.map((s, i) => (
              <div key={i} className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-2xl font-black" style={{ color: s.positive === true ? '#34d399' : s.positive === false ? '#fb7185' : accent, fontFamily: 'monospace' }}>{s.value}</p>
                <p className="text-xs font-medium opacity-60 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DATA POINT ── */}
        <section className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Dữ liệu thực tế</p>
          <p className="text-base font-semibold" style={{ color: accent }}>{story.dataPoint}</p>
        </section>

        {/* ── BEHIND STORY ── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-8">Câu chuyện đằng sau sự kiện</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {story.behindStory.map((item, i) => (
                <div key={i} className="relative pl-14">
                  <div className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border" style={{ background: primary, borderColor: accent + '50', color: accent }}>{i + 1}</div>
                  <p className="text-base font-semibold text-white mb-3">{item.point}</p>
                  <div className="rounded-xl p-4 text-sm italic text-white/60" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${accent}50` }}>
                    &ldquo;{item.quote}&rdquo;
                    <p className="text-xs font-bold mt-2 not-italic" style={{ color: accent }}>{item.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANALYST VIEW ── */}
        <section className="rounded-2xl p-7" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Góc nhìn phân tích</p>
          <p className="text-amber-100/80 font-medium leading-relaxed">&ldquo;{story.analystView}&rdquo;</p>
        </section>

        {/* ── LEAD CAPTURE FORM ── */}
        <section className="rounded-3xl p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}40` }}>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: accent }} />
              <h3 className="text-2xl font-black text-white mb-2">Đã nhận thông tin!</h3>
              <p className="text-white/60">{agent.full_name} sẽ liên hệ với bạn trong vòng 24 giờ.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-white mb-2">{cta}</h3>
              <p className="text-white/50 text-sm mb-8">{agent.brand_tagline}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" placeholder="Họ và tên *" required value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-opacity-80"
                  style={{ '--tw-border-opacity': '1' } as any}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="email" placeholder="Email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none"
                  />
                  <input
                    type="tel" placeholder="Số điện thoại" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
                {error && <p className="text-rose-400 text-sm">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{ background: accent, color: '#fff', opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? 'Đang gửi...' : <><Send className="w-4 h-4" /> {cta}</>}
                </button>
              </form>
            </>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center text-xs text-white/20 pb-8">
          <p>© {agent.brand_name} · Powered by FinPeace Research Platform</p>
        </footer>
      </div>
    </div>
  )
}
