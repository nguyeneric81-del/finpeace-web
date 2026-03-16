'use client'

import { useState, useEffect, useRef } from 'react'
import {
  TrendingUp, TrendingDown, Phone, MessageCircle, CheckCircle2, Send,
  BarChart2, Quote, Clock, Activity, Target, ChevronRight, ArrowRight
} from 'lucide-react'

interface Agent {
  id: string; code: string; full_name: string; brand_name: string
  brand_tagline: string | null; brand_color_primary: string; brand_color_accent: string
  avatar_url: string | null; title: string | null
  contact_phone: string | null; contact_zalo: string | null
}

interface MacroStory {
  id: string; title: string; category: string; date_label: string
  data_point: string; narrow_industry: string | null
  impact_value: string | null; impact_positive: boolean
  accent_color: string; behind_story: { point: string; quote: string; source: string }[]
  analyst_view: string | null; analyst_sources?: string[]
  key_stats: { label: string; value: string; positive?: boolean }[]
  companies?: { ticker: string; name: string; plan?: string }[]
  chart_data?: { name: string; value: number }[]
  chart_label?: string; chart_color?: string
  cycle_lagging?: string; cycle_leading?: string
}

interface Props {
  agent: Agent; story: MacroStory; lpConfig: any
  agentCode: string; topicSlug: string; lpId: string | null; contentType: string
}

// ── Mini Trend Chart (canvas-based, no dep) ──────────────────
function TrendChart({ data, color, label }: { data: { name: string; value: number }[]; color: string; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || !data.length) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth * dpr; const H = canvas.offsetHeight * dpr
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!
    const vals = data.map(d => d.value)
    const min = Math.min(...vals); const max = Math.max(...vals)
    const range = max - min || 1
    const pts = vals.map((v, i) => ({
      x: (i / (vals.length - 1 || 1)) * W * 0.95 + W * 0.025,
      y: H * 0.85 - ((v - min) / range) * H * 0.75
    }))
    ctx.clearRect(0, 0, W, H)
    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, color + '44'); grad.addColorStop(1, color + '00')
    ctx.beginPath(); ctx.moveTo(pts[0].x, H * 0.9)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length - 1].x, H * 0.9); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()
    // Line
    ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 2.5 * dpr; ctx.lineJoin = 'round'; ctx.stroke()
    // Labels
    ctx.fillStyle = 'rgba(148,163,184,0.8)'; ctx.font = `${9 * dpr}px sans-serif`; ctx.textAlign = 'center'
    data.forEach((d, i) => {
      ctx.fillText(d.name, pts[i].x, H * 0.97)
    })
    // Last value
    const last = pts[pts.length - 1]
    ctx.fillStyle = color; ctx.font = `bold ${10 * dpr}px sans-serif`; ctx.textAlign = 'right'
    ctx.fillText(String(vals[vals.length - 1]), last.x + 5, last.y - 6 * dpr)
  }, [data, color])

  return (
    <div>
      {label && <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.4 }}>{label}</p>}
      <canvas ref={canvasRef} style={{ width: '100%', height: 130, display: 'block' }} />
    </div>
  )
}

export default function SalesLandingPageClient({ agent, story, lpConfig, agentCode, topicSlug, lpId }: Props) {
  const primary = agent.brand_color_primary
  const accent = agent.brand_color_accent
  const ac = story.accent_color || accent
  const hook = lpConfig?.custom_hook || story.title
  const cta = lpConfig?.custom_cta || 'Đăng ký tư vấn miễn phí'

  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/lp/track-view', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lpId, agentCode, topicSlug }),
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name) { setError('Vui lòng nhập họ tên.'); return }
    if (!form.email && !form.phone) { setError('Vui lòng nhập Email hoặc SĐT.'); return }
    setSubmitting(true); setError('')
    const res = await fetch('/api/lp/submit-lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, agentCode, topicSlug, lpId, agentId: agent.id }),
    })
    if (res.ok) setSubmitted(true)
    else setError('Có lỗi xảy ra. Vui lòng thử lại.')
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen text-slate-100" style={{ background: primary, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

      {/* ── AGENT HEADER ── */}
      <header className="px-6 py-5 flex items-center gap-4 sticky top-0 z-20" style={{ background: primary + 'E8', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {agent.avatar_url
          ? <img src={agent.avatar_url} alt={agent.full_name} className="w-11 h-11 rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: accent }} />
          : <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black border-2 flex-shrink-0" style={{ background: accent + '30', borderColor: accent, color: accent }}>{agent.full_name.charAt(0)}</div>
        }
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest truncate" style={{ color: accent, opacity: 0.85 }}>{agent.brand_name}</p>
          <p className="font-bold text-white text-sm leading-tight">{agent.full_name}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {agent.contact_phone && (
            <a href={`tel:${agent.contact_phone}`} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: accent + '20', color: accent }}>
              <Phone className="w-3 h-3" />{agent.contact_phone}
            </a>
          )}
          {agent.contact_zalo && (
            <a href={`https://zalo.me/${agent.contact_zalo}`} target="_blank" className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#0068FF20', color: '#60A5FA' }}>
              <MessageCircle className="w-3 h-3" />Zalo
            </a>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* ── HERO ── */}
        <section>
          <div className="h-0.5 rounded-full mb-8 w-20" style={{ background: `linear-gradient(90deg, ${ac}, transparent)` }} />
          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: ac + '18', color: ac, border: `1px solid ${ac}35` }}>
            {story.category} · {story.date_label}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{hook}</h1>
          {story.impact_value && (
            <div className="flex items-start gap-3 rounded-2xl p-5" style={{
              background: story.impact_positive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
              border: `1px solid ${story.impact_positive ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
            }}>
              {story.impact_positive ? <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              <p className="text-sm font-semibold leading-relaxed" style={{ color: story.impact_positive ? '#34d399' : '#fb7185' }}>{story.impact_value}</p>
            </div>
          )}
        </section>

        {/* ── KEY STATS ── */}
        {story.key_stats?.length > 0 && (
          <section>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ opacity: 0.4 }}>
              <BarChart2 className="w-3.5 h-3.5" />Số liệu cốt lõi
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {story.key_stats.map((s, i) => (
                <div key={i} className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-2xl font-black font-mono" style={{ color: s.positive === true ? '#34d399' : s.positive === false ? '#fb7185' : ac }}>{s.value}</p>
                  <p className="text-xs font-medium leading-snug" style={{ opacity: 0.5 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TREND CHART ── */}
        {story.chart_data && story.chart_data.length > 0 && (
          <section>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-6 pt-5 pb-2">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ opacity: 0.4 }}>Xu hướng dữ liệu</p>
              </div>
              <div className="px-6 pb-5">
                <TrendChart data={story.chart_data} color={story.chart_color || ac} label={story.chart_label} />
              </div>
            </div>
          </section>
        )}

        {/* ── DATA POINT ── */}
        {story.data_point && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ opacity: 0.4 }}>
              <BarChart2 className="w-3 h-3" />Dữ liệu thực tế
            </p>
            <p className="text-sm font-semibold" style={{ color: ac }}>{story.data_point}</p>
          </div>
        )}

        {/* ── BEHIND THE STORY TIMELINE ── */}
        {story.behind_story?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.12)' }}>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              Câu chuyện đằng sau sự kiện
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <div className="space-y-8">
                {story.behind_story.map((item, i) => (
                  <div key={i} className="relative pl-14">
                    <div className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border" style={{ background: primary, borderColor: ac + '40', color: ac }}>{i + 1}</div>
                    <p className="text-base font-semibold text-white mb-3 leading-relaxed">{item.point}</p>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${ac}55` }}>
                      <Quote className="w-3.5 h-3.5 mb-2" style={{ opacity: 0.3 }} />
                      <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>&ldquo;{item.quote}&rdquo;</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" style={{ opacity: 0.3 }} />
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ac }}>{item.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── ANALYST VIEW ── */}
        {story.analyst_view && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              Góc nhìn phân tích thị trường
            </h2>
            <div className="rounded-2xl p-7" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <p className="leading-relaxed font-medium mb-5" style={{ color: 'rgba(255,235,180,0.85)' }}>&ldquo;{story.analyst_view}&rdquo;</p>
              {story.analyst_sources && story.analyst_sources.length > 0 && (
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Nguồn:</span>
                  {story.analyst_sources.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full font-semibold text-amber-300" style={{ background: 'rgba(245,158,11,0.12)' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── CYCLE: LAGGING → LEADING ── */}
        {(story.cycle_lagging || story.cycle_leading) && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              Chu kỳ Tác động (Lagging → Leading)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {story.cycle_lagging && (
                <div className="rounded-2xl p-6 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid rgba(148,163,184,0.35)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Lagging</p>
                    <span className="text-xs text-slate-600 ml-1">Độ trễ Vĩ mô</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{story.cycle_lagging}</p>
                </div>
              )}
              {story.cycle_leading && (
                <div className="rounded-2xl p-6 space-y-3" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderLeft: '3px solid #10B981' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10B98170' }} />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Leading</p>
                    <span className="text-xs text-slate-600 ml-1">Dẫn dắt Doanh thu</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,243,208,0.8)' }}>{story.cycle_leading}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── TRADING PLAN LINKS ── */}
        {story.companies && story.companies.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: ac + '15' }}>
                <ChevronRight className="w-4 h-4" style={{ color: ac }} />
              </div>
              Doanh nghiệp Trọng điểm
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {story.companies.map(c => (
                <div key={c.ticker}
                  className="flex items-center justify-between p-5 rounded-2xl"
                  style={{ background: ac + '10', border: `1px solid ${ac}25` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black font-mono" style={{ color: ac }}>{c.ticker}</span>
                    <span className="text-sm text-slate-300">{c.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: ac }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LEAD CAPTURE FORM ── */}
        <section className="rounded-3xl p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}40` }}>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: accent }} />
              <h3 className="text-2xl font-black text-white mb-2">Đã nhận thông tin!</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>{agent.full_name} sẽ liên hệ trong vòng 24 giờ.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-white mb-2">{cta}</h3>
              {agent.brand_tagline && <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>{agent.brand_tagline}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Họ và tên *" required value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="email" placeholder="Email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                  <input type="tel" placeholder="Số điện thoại" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>
                {error && <p className="text-rose-400 text-sm">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{ background: accent, color: '#fff', opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? 'Đang gửi...' : <><Send className="w-4 h-4" />{cta}</>}
                </button>
              </form>
            </>
          )}
        </section>

        <footer className="text-center text-xs pb-8" style={{ color: 'rgba(255,255,255,0.12)' }}>
          © {agent.brand_name} · Powered by FinPeace Research Platform
        </footer>
      </div>
    </div>
  )
}
