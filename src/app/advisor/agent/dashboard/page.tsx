'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    LogOut, Users, TrendingUp, UserCheck, Copy,
    Check, ExternalLink, Clock,
    Loader2, RefreshCw, KeyRound, X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// ── Design tokens ──────────────────────────────────────────────────────────────
const D = {
    bg: '#020617',
    card: '#0F172A',
    border: 'rgba(255,255,255,0.07)',
    textMuted: 'rgba(255,255,255,0.45)',
    textFaint: 'rgba(255,255,255,0.2)',
    green: '#10B981',
    greenBg: 'rgba(16,185,129,0.1)',
    greenBorder: 'rgba(16,185,129,0.25)',
    amber: '#F59E0B',
    amberBg: 'rgba(245,158,11,0.1)',
    sky: '#38BDF8',
    skyBg: 'rgba(56,189,248,0.1)',
    rose: '#F43F5E',
    roseBg: 'rgba(244,63,94,0.1)',
}

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: 'Mới', color: D.sky, bg: D.skyBg },
    contacted: { label: 'Đã liên hệ', color: D.amber, bg: D.amberBg },
    converted: { label: 'Đã chuyển đổi', color: D.green, bg: D.greenBg },
}

type Agent = {
    id: string; code: string; full_name: string; brand_name: string;
    brand_tagline?: string; avatar_url?: string; title?: string;
    brand_color_primary: string; brand_color_accent: string; agent_type: string;
}

type Lead = {
    id: string; full_name?: string; phone?: string; email?: string;
    status: string; registered_at: string; converted_at?: string; utm_source?: string;
}

type Stats = { total: number; today: number; converted: number }

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }: {
    icon: React.ElementType; label: string; value: number; color: string; bg: string;
}) {
    return (
        <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: D.card, border: `1px solid ${D.border}` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg, border: `1px solid ${color}40` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: D.textMuted }}>{label}</p>
            </div>
        </div>
    )
}

// ── Lead Row ──────────────────────────────────────────────────────────────────
function LeadRow({ lead }: { lead: Lead }) {
    const status = STATUS_MAP[lead.status] || { label: lead.status, color: D.textMuted, bg: 'transparent' }
    const date = new Date(lead.registered_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

    return (
        <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: `1px solid ${D.border}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs"
                style={{ background: D.greenBg, color: D.green }}>
                {(lead.full_name || lead.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm">{lead.full_name || '—'}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: D.textMuted }}>
                    {lead.phone || lead.email || 'Chưa có thông tin'}
                    {lead.utm_source && <span className="ml-2 opacity-60">· {lead.utm_source}</span>}
                </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium hidden sm:block"
                    style={{ background: status.bg, color: status.color }}>
                    {status.label}
                </span>
                <p className="text-xs whitespace-nowrap" style={{ color: D.textFaint }}>{date}</p>
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AgentDashboardPage() {
    const [agent, setAgent] = useState<Agent | null>(null)
    const [leads, setLeads] = useState<Lead[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, today: 0, converted: 0 })
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [showChangePw, setShowChangePw] = useState(false)
    const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' })
    const [pwLoading, setPwLoading] = useState(false)
    const [pwMsg, setPwMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        setLoading(true)
        const res = await fetch('/api/agent/me')
        if (res.status === 401 || res.status === 403) {
            router.push('/advisor/agent/login')
            return
        }
        const data = await res.json()
        setAgent(data.agent)
        setLeads(data.leads ?? [])
        setStats(data.stats ?? { total: 0, today: 0, converted: 0 })
        setLoading(false)
    }, [router])

    useEffect(() => { fetchData() }, [fetchData])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/advisor/agent/login')
    }

    async function handleChangePw() {
        setPwMsg(null)
        if (!pwForm.newPw || !pwForm.confirm) {
            setPwMsg({ type: 'error', text: 'Vui lòng điền đủ thông tin' })
            return
        }
        if (pwForm.newPw !== pwForm.confirm) {
            setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp' })
            return
        }
        if (pwForm.newPw.length < 6) {
            setPwMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' })
            return
        }
        setPwLoading(true)
        const res = await fetch('/api/agent/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_password: pwForm.newPw }),
        })
        const data = await res.json()
        setPwLoading(false)
        if (!res.ok) {
            setPwMsg({ type: 'error', text: data.error || 'Có lỗi xảy ra' })
        } else {
            setPwMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' })
            setPwForm({ newPw: '', confirm: '' })
            setTimeout(() => { setShowChangePw(false); setPwMsg(null) }, 1800)
        }
    }

    function handleCopyLP() {
        if (!agent) return
        const url = `${window.location.origin.replace('advisor.', '')}/lp/${agent.code}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: D.bg }}>
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
        </div>
    )

    if (!agent) return null

    const lpUrl = `/lp/${agent.code}`
    const accentColor = agent.brand_color_accent || D.green

    return (
        <div className="min-h-screen" style={{ background: D.bg, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

            {/* ── CHANGE PASSWORD MODAL ── */}
            {showChangePw && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-full max-w-sm rounded-2xl" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${D.border}` }}>
                            <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                <h3 className="font-bold text-white">Đổi mật khẩu</h3>
                            </div>
                            <button onClick={() => { setShowChangePw(false); setPwMsg(null); setPwForm({ newPw: '', confirm: '' }) }}
                                className="cursor-pointer transition-colors hover:text-white" style={{ color: D.textMuted }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            {[{ key: 'newPw', label: 'Mật khẩu mới', ph: 'Ít nhất 6 ký tự' },
                              { key: 'confirm', label: 'Xác nhận mật khẩu', ph: 'Nhập lại' }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold uppercase tracking-widest block mb-1" style={{ color: D.textFaint }}>{f.label}</label>
                                    <input type="password"
                                        value={pwForm[f.key as keyof typeof pwForm]}
                                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        placeholder={f.ph}
                                        className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                </div>
                            ))}
                            {pwMsg && (
                                <p className={`text-sm ${pwMsg.type === 'error' ? 'text-rose-400' : 'text-emerald-400 font-medium'}`}>
                                    {pwMsg.text}
                                </p>
                            )}
                            <button onClick={handleChangePw} disabled={pwLoading}
                                className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:brightness-125 disabled:opacity-50 cursor-pointer mt-1"
                                style={{ background: D.green, color: 'white' }}>
                                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</> : 'Xác Nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-10"
                style={{ background: 'rgba(2,6,23,0.85)', borderBottom: `1px solid ${D.border}`, backdropFilter: 'blur(12px)' }}>
                <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {agent.avatar_url ? (
                            <img src={agent.avatar_url} alt={agent.full_name}
                                className="w-8 h-8 rounded-lg object-cover"
                                style={{ border: `1px solid ${accentColor}60` }} />
                        ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                                style={{ background: D.greenBg, color: D.green, border: `1px solid ${D.greenBorder}` }}>
                                {agent.full_name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-white text-sm leading-tight">{agent.full_name}</p>
                            <p className="text-[10px] leading-tight" style={{ color: D.textMuted }}>
                                {agent.title || agent.brand_name} · <span style={{ color: accentColor }}>#{agent.code}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setShowChangePw(true); setPwMsg(null) }}
                            className="p-2 rounded-lg transition-colors hover:text-emerald-400 cursor-pointer"
                            style={{ color: D.textMuted }} title="Đổi mật khẩu">
                            <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={fetchData}
                            className="p-2 rounded-lg transition-colors hover:text-emerald-400 cursor-pointer"
                            style={{ color: D.textMuted }} title="Làm mới">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={handleLogout}
                            className="p-2 rounded-lg transition-colors hover:text-rose-400 cursor-pointer"
                            style={{ color: D.textMuted }} title="Đăng xuất">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* ── STATS ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4">
                    <StatCard icon={Users} label="Tổng leads" value={stats.total} color={D.sky} bg={D.skyBg} />
                    <StatCard icon={Clock} label="Hôm nay" value={stats.today} color={D.amber} bg={D.amberBg} />
                    <StatCard icon={UserCheck} label="Converted" value={stats.converted} color={D.green} bg={D.greenBg} />
                </motion.div>

                {/* ── LP LINK ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                    style={{ background: D.card, border: `1px solid ${D.border}` }}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: D.greenBg, border: `1px solid ${D.greenBorder}` }}>
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: D.textFaint }}>
                                Landing Page của bạn
                            </p>
                            <p className="text-sm font-medium text-white truncate">
                                finpeace.cloud/lp/<span style={{ color: D.green }}>{agent.code}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCopyLP}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer hover:brightness-110"
                            style={{ background: D.greenBg, color: D.green, border: `1px solid ${D.greenBorder}` }}>
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Đã copy!' : 'Copy link'}
                        </button>
                        <a href={lpUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer hover:border-white/20"
                            style={{ color: D.textMuted, border: `1px solid ${D.border}` }}>
                            <ExternalLink className="w-3.5 h-3.5" /> Xem
                        </a>
                    </div>
                </motion.div>

                {/* ── LEADS TABLE ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: D.card, border: `1px solid ${D.border}` }}>
                    <div className="flex items-center justify-between px-5 py-4"
                        style={{ borderBottom: `1px solid ${D.border}` }}>
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" />
                            Leads của bạn
                        </h2>
                        <span className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: D.greenBg, color: D.green }}>
                            {leads.length} người
                        </span>
                    </div>

                    {leads.length === 0 ? (
                        <div className="py-16 text-center">
                            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
                            <p className="font-medium text-white mb-1">Chưa có leads</p>
                            <p className="text-sm" style={{ color: D.textMuted }}>
                                Chia sẻ link LP của bạn để bắt đầu thu hút leads
                            </p>
                        </div>
                    ) : (
                        <div>
                            {leads.map(lead => (
                                <LeadRow key={lead.id} lead={lead} />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
