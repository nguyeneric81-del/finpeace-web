'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
    LogOut, Users, TrendingUp, UserCheck, Copy,
    Check, ExternalLink, Clock,
    Loader2, RefreshCw, KeyRound, X, LayoutDashboard,
    Sparkles, FilePlus, Eye, ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// ── Design tokens ─────────────────────────────────────────────────────────────
const D = {
    bg: '#020617', card: '#0F172A', border: 'rgba(255,255,255,0.07)',
    textMuted: 'rgba(255,255,255,0.45)', textFaint: 'rgba(255,255,255,0.2)',
    green: '#10B981', greenBg: 'rgba(16,185,129,0.1)', greenBorder: 'rgba(16,185,129,0.25)',
    amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.1)',
    sky: '#38BDF8', skyBg: 'rgba(56,189,248,0.1)',
    rose: '#F43F5E', roseBg: 'rgba(244,63,94,0.1)',
    purple: '#A78BFA', purpleBg: 'rgba(167,139,250,0.1)',
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    new:       { label: 'Mới',         color: D.sky,   bg: D.skyBg },
    contacted: { label: 'Đã liên hệ', color: D.amber, bg: D.amberBg },
    converted: { label: 'Đã chuyển',  color: D.green, bg: D.greenBg },
}

const CAMPAIGN_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    active:         { label: 'Active',      color: D.green,  bg: D.greenBg,  dot: '●' },
    draft:          { label: 'Draft',       color: D.sky,    bg: D.skyBg,    dot: '◉' },
    pending_review: { label: 'Chờ duyệt',  color: D.amber,  bg: D.amberBg,  dot: '◎' },
    generating:     { label: 'Generating', color: D.purple, bg: D.purpleBg, dot: '○' },
    paused:         { label: 'Paused',     color: D.textMuted, bg: 'rgba(255,255,255,0.05)', dot: '◌' },
}

type Agent = {
    id: string; code: string; full_name: string; brand_name: string;
    brand_tagline?: string; avatar_url?: string; title?: string;
    brand_color_primary: string; brand_color_accent: string; agent_type: string;
}
type Lead = {
    id: string; full_name?: string; phone?: string; email?: string;
    status: string; registered_at: string; utm_source?: string;
}
type Stats = { total: number; today: number; converted: number }
type Campaign = {
    id: string; slug: string; campaign_name: string | null; content_type: string;
    status: string; generated_hook?: string; views_7d?: number; leads_7d?: number;
    leads_total?: number; utm_source?: string; utm_campaign?: string;
}
type ContentItem = { slug: string; title: string; pillar: string }

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }: {
    icon: React.ElementType; label: string; value: number; color: string; bg: string;
}) {
    return (
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: D.card, border: `1px solid ${D.border}` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg, border: `1px solid ${color}40` }}>
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
        <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${D.border}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: D.greenBg, color: D.green }}>
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
                <span className="text-xs px-2.5 py-1 rounded-full font-medium hidden sm:block" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                <p className="text-xs whitespace-nowrap" style={{ color: D.textFaint }}>{date}</p>
            </div>
        </div>
    )
}

// ── Campaign Row ───────────────────────────────────────────────────────────────
function CampaignRow({ campaign, agentCode }: { campaign: Campaign; agentCode: string }) {
    const cfg = CAMPAIGN_STATUS[campaign.status] ?? CAMPAIGN_STATUS.draft
    const lpUrl = `https://finpeace.cloud/lp/${agentCode}/${campaign.slug}`
    const cr = (campaign.views_7d ?? 0) > 0
        ? (((campaign.leads_7d ?? 0) / campaign.views_7d!) * 100).toFixed(1) + '%'
        : '—'
    return (
        <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderBottom: `1px solid ${D.border}` }}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.dot} {cfg.label}</span>
                        <span className="text-xs" style={{ color: D.textMuted }}>{campaign.content_type === 'macro_insight' ? '📊' : '📚'}</span>
                    </div>
                    <p className="font-medium text-white text-sm truncate">{campaign.campaign_name || campaign.slug}</p>
                    {campaign.generated_hook && <p className="text-xs mt-1 truncate italic" style={{ color: D.textMuted }}>"{campaign.generated_hook}"</p>}
                    <p className="text-xs mt-1" style={{ color: D.textFaint }}>/lp/{agentCode}/{campaign.slug}</p>
                </div>
                <div className="flex items-center gap-5 shrink-0 text-center">
                    <div><p className="text-white font-semibold text-sm">{campaign.views_7d ?? 0}</p><p className="text-xs" style={{ color: D.textMuted }}>views</p></div>
                    <div><p className="font-semibold text-sm" style={{ color: D.amber }}>{campaign.leads_7d ?? 0}</p><p className="text-xs" style={{ color: D.textMuted }}>leads</p></div>
                    <div><p className="text-white font-semibold text-sm">{cr}</p><p className="text-xs" style={{ color: D.textMuted }}>CR</p></div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <a href={lpUrl} target="_blank" className="px-2 py-1 rounded text-xs flex items-center gap-1" style={{ background: D.skyBg, color: D.sky }}>
                        <Eye className="w-3 h-3" /> Preview
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(lpUrl) }} className="px-2 py-1 rounded text-xs flex items-center gap-1" style={{ background: D.greenBg, color: D.green }}>
                        <Copy className="w-3 h-3" /> Copy
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AgentDashboardPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'create'>('dashboard')
    const [agent, setAgent] = useState<Agent | null>(null)
    const [leads, setLeads] = useState<Lead[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, today: 0, converted: 0 })
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [campaignsLoading, setCampaignsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    // Change password
    const [showChangePw, setShowChangePw] = useState(false)
    const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' })
    const [pwLoading, setPwLoading] = useState(false)
    const [pwMsg, setPwMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

    // LP Workshop
    const [contentList, setContentList] = useState<ContentItem[]>([])
    const [wsForm, setWsForm] = useState({
        content_type: 'macro_insight' as 'macro_insight' | 'knowledgebase',
        content_slug: '',
        campaign_name: '',
        target_audience_hint: '',
    })
    const [generating, setGenerating] = useState(false)
    const [generateError, setGenerateError] = useState<string | null>(null)
    const [generateResult, setGenerateResult] = useState<{ preview_url: string; campaign_id: string; campaign_name: string } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        setLoading(true)
        const res = await fetch('/api/agent/me')
        if (res.status === 401 || res.status === 403) { router.push('/advisor/agent/login'); return }
        const data = await res.json()
        setAgent(data.agent)
        setLeads(data.leads ?? [])
        setStats(data.stats ?? { total: 0, today: 0, converted: 0 })
        setLoading(false)
    }, [router])

    const fetchCampaigns = useCallback(async () => {
        setCampaignsLoading(true)
        const res = await fetch('/api/agent/campaigns')
        const data = await res.json()
        setCampaigns(data.campaigns ?? [])
        setCampaignsLoading(false)
    }, [])

    const fetchContentList = useCallback(async (type: string) => {
        const res = await fetch(`/api/admin/content-list?type=${type}`)
        const { items } = await res.json()
        setContentList(items ?? [])
    }, [])

    useEffect(() => { fetchData() }, [fetchData])
    useEffect(() => {
        if (activeTab === 'campaigns') fetchCampaigns()
        if (activeTab === 'create') { fetchContentList(wsForm.content_type) }
    }, [activeTab, fetchCampaigns, fetchContentList, wsForm.content_type])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/advisor/agent/login')
    }

    async function handleChangePw() {
        setPwMsg(null)
        if (!pwForm.newPw || !pwForm.confirm) { setPwMsg({ type: 'error', text: 'Vui lòng điền đủ thông tin' }); return }
        if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp' }); return }
        if (pwForm.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' }); return }
        setPwLoading(true)
        const res = await fetch('/api/agent/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ new_password: pwForm.newPw }) })
        const data = await res.json()
        setPwLoading(false)
        if (!res.ok) { setPwMsg({ type: 'error', text: data.error || 'Có lỗi xảy ra' }) }
        else { setPwMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' }); setPwForm({ newPw: '', confirm: '' }); setTimeout(() => { setShowChangePw(false); setPwMsg(null) }, 1800) }
    }

    function handleCopyLP() {
        if (!agent) return
        const url = `${window.location.origin.replace('advisor.', '')}/lp/${agent.code}`
        navigator.clipboard.writeText(url)
        setCopied(true); setTimeout(() => setCopied(false), 2000)
    }

    async function handleGenerate() {
        if (!wsForm.content_slug || !wsForm.campaign_name) { setGenerateError('Vui lòng chọn nội dung và đặt tên campaign'); return }
        setGenerating(true); setGenerateError(null); setGenerateResult(null)
        const res = await fetch('/api/agent/lp/generate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wsForm),
        })
        const data = await res.json()
        setGenerating(false)
        if (data.error) { setGenerateError(data.error + (data.details ? ' — ' + data.details : '')) }
        else if (data.preview_url) {
            setGenerateResult({ preview_url: `https://finpeace.cloud${data.preview_url}`, campaign_id: data.campaign_id, campaign_name: wsForm.campaign_name })
            fetchCampaigns()
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: D.bg }}>
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
        </div>
    )

    if (!agent) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: D.bg }}>
            <div className="text-center">
                <p className="text-white font-medium mb-2">Không tìm thấy hồ sơ Agent</p>
                <p className="text-sm mb-4" style={{ color: D.textMuted }}>Tài khoản chưa được liên kết với Sales Agent.</p>
                <button onClick={handleLogout} className="text-sm text-rose-400 cursor-pointer hover:underline">Logout</button>
            </div>
        </div>
    )

    const lpUrl = `/lp/${agent.code}`
    const accentColor = agent.brand_color_accent || D.green

    const TABS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Campaigns', icon: TrendingUp },
        { id: 'create',    label: 'Tạo LP',    icon: Sparkles },
    ] as const

    return (
        <div className="min-h-screen" style={{ background: D.bg, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

            {/* ── CHANGE PASSWORD MODAL ── */}
            {showChangePw && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-full max-w-sm rounded-2xl" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${D.border}` }}>
                            <div className="flex items-center gap-2"><KeyRound className="w-4 h-4 text-emerald-400" /><h3 className="font-bold text-white">Đổi mật khẩu</h3></div>
                            <button onClick={() => { setShowChangePw(false); setPwMsg(null); setPwForm({ newPw: '', confirm: '' }) }} className="cursor-pointer" style={{ color: D.textMuted }}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-5 space-y-3">
                            {[{ key: 'newPw', label: 'Mật khẩu mới', ph: 'Ít nhất 6 ký tự' }, { key: 'confirm', label: 'Xác nhận', ph: 'Nhập lại' }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold uppercase tracking-widest block mb-1" style={{ color: D.textFaint }}>{f.label}</label>
                                    <input type="password" value={pwForm[f.key as keyof typeof pwForm]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                                        className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                                </div>
                            ))}
                            {pwMsg && <p className={`text-sm ${pwMsg.type === 'error' ? 'text-rose-400' : 'text-emerald-400 font-medium'}`}>{pwMsg.text}</p>}
                            <button onClick={handleChangePw} disabled={pwLoading}
                                className="w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                style={{ background: D.green, color: 'white' }}>
                                {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang xử lý...</> : 'Xác Nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-10" style={{ background: 'rgba(2,6,23,0.85)', borderBottom: `1px solid ${D.border}`, backdropFilter: 'blur(12px)' }}>
                <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {agent.avatar_url
                            ? <img src={agent.avatar_url} alt={agent.full_name} className="w-8 h-8 rounded-lg object-cover" style={{ border: `1px solid ${accentColor}60` }} />
                            : <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: D.greenBg, color: D.green, border: `1px solid ${D.greenBorder}` }}>{agent.full_name.charAt(0)}</div>
                        }
                        <div>
                            <p className="font-bold text-white text-sm leading-tight">{agent.full_name}</p>
                            <p className="text-[10px] leading-tight" style={{ color: D.textMuted }}>{agent.title || agent.brand_name} · <span style={{ color: accentColor }}>#{agent.code}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setShowChangePw(true); setPwMsg(null) }} className="p-2 rounded-lg transition-colors hover:text-emerald-400 cursor-pointer" style={{ color: D.textMuted }} title="Đổi mật khẩu"><KeyRound className="w-4 h-4" /></button>
                        <button onClick={fetchData} className="p-2 rounded-lg transition-colors hover:text-emerald-400 cursor-pointer" style={{ color: D.textMuted }} title="Làm mới"><RefreshCw className="w-4 h-4" /></button>
                        <button onClick={handleLogout} className="p-2 rounded-lg transition-colors hover:text-rose-400 cursor-pointer" style={{ color: D.textMuted }} title="Đăng xuất"><LogOut className="w-4 h-4" /></button>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* ── TAB NAV ── */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                            style={{
                                background: activeTab === tab.id ? D.green : 'transparent',
                                color: activeTab === tab.id ? 'white' : D.textMuted,
                            }}>
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: DASHBOARD ── */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
                            <StatCard icon={Users} label="Tổng leads" value={stats.total} color={D.sky} bg={D.skyBg} />
                            <StatCard icon={Clock} label="Hôm nay" value={stats.today} color={D.amber} bg={D.amberBg} />
                            <StatCard icon={UserCheck} label="Converted" value={stats.converted} color={D.green} bg={D.greenBg} />
                        </motion.div>

                        {/* LP Link */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                            style={{ background: D.card, border: `1px solid ${D.border}` }}>
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: D.greenBg, border: `1px solid ${D.greenBorder}` }}>
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: D.textFaint }}>Landing Page của bạn</p>
                                    <p className="text-sm font-medium text-white truncate">finpeace.cloud/lp/<span style={{ color: D.green }}>{agent.code}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleCopyLP} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium cursor-pointer" style={{ background: D.greenBg, color: D.green, border: `1px solid ${D.greenBorder}` }}>
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Đã copy!' : 'Copy link'}
                                </button>
                                <a href={lpUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium" style={{ color: D.textMuted, border: `1px solid ${D.border}` }}>
                                    <ExternalLink className="w-3.5 h-3.5" /> Xem
                                </a>
                                <button onClick={() => setActiveTab('create')} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium cursor-pointer" style={{ background: D.purpleBg, color: D.purple, border: `1px solid ${D.purple}40` }}>
                                    <Sparkles className="w-3.5 h-3.5" /> Tạo LP mới
                                </button>
                            </div>
                        </motion.div>

                        {/* Leads */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="rounded-2xl overflow-hidden" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${D.border}` }}>
                                <h2 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" />Leads của bạn</h2>
                                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: D.greenBg, color: D.green }}>{leads.length} người</span>
                            </div>
                            {leads.length === 0
                                ? <div className="py-16 text-center"><Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} /><p className="font-medium text-white mb-1">Chưa có leads</p><p className="text-sm" style={{ color: D.textMuted }}>Chia sẻ link LP để bắt đầu thu hút leads</p></div>
                                : <div>{leads.map(l => <LeadRow key={l.id} lead={l} />)}</div>
                            }
                        </motion.div>
                    </div>
                )}

                {/* ── TAB: CAMPAIGNS ── */}
                {activeTab === 'campaigns' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl overflow-hidden" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${D.border}` }}>
                            <h2 className="font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" />Campaigns của bạn</h2>
                            <button onClick={() => setActiveTab('create')}
                                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg cursor-pointer transition-all"
                                style={{ background: D.purpleBg, color: D.purple, border: `1px solid ${D.purple}40` }}>
                                <FilePlus className="w-3.5 h-3.5" /> Tạo Campaign mới
                            </button>
                        </div>
                        {campaignsLoading
                            ? <div className="py-16 flex items-center justify-center"><Loader2 className="animate-spin w-6 h-6" style={{ color: D.textMuted }} /></div>
                            : campaigns.length === 0
                                ? <div className="py-16 text-center">
                                    <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
                                    <p className="font-medium text-white mb-1">Chưa có campaign nào</p>
                                    <button onClick={() => setActiveTab('create')} className="text-sm cursor-pointer flex items-center gap-1 mx-auto mt-2" style={{ color: D.purple }}>
                                        Tạo landing page đầu tiên <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                : <div>{campaigns.map(c => <CampaignRow key={c.id} campaign={c} agentCode={agent.code} />)}</div>
                        }
                    </motion.div>
                )}

                {/* ── TAB: CREATE LP ── */}
                {activeTab === 'create' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="rounded-2xl p-6 space-y-5" style={{ background: D.card, border: `1px solid ${D.border}` }}>
                            <div>
                                <h2 className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4" style={{ color: D.purple }} />Tạo Landing Page với AI</h2>
                                <p className="text-xs mt-1" style={{ color: D.textMuted }}>AI sẽ tạo nội dung theo phong cách và đối tượng khách hàng của bạn. Admin sẽ review + publish.</p>
                            </div>

                            {generateResult ? (
                                <div className="rounded-xl p-5 space-y-3" style={{ background: D.greenBg, border: `1px solid ${D.greenBorder}` }}>
                                    <p className="text-emerald-400 font-medium flex items-center gap-2"><Check className="w-4 h-4" />✅ {generateResult.campaign_name} — đã gửi cho Admin duyệt!</p>
                                    <p className="text-xs" style={{ color: D.textMuted }}>Admin sẽ review và publish. Bạn có thể xem preview trước:</p>
                                    <div className="flex gap-3">
                                        <a href={generateResult.preview_url} target="_blank" className="flex-1 text-center py-2 rounded-lg text-xs font-medium" style={{ background: D.skyBg, color: D.sky }}>
                                            <Eye className="w-3.5 h-3.5 inline mr-1" />Preview LP
                                        </a>
                                        <button onClick={() => { setGenerateResult(null); setWsForm({ content_type: 'macro_insight', content_slug: '', campaign_name: '', target_audience_hint: '' }) }}
                                            className="flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer" style={{ background: D.purpleBg, color: D.purple }}>
                                            Tạo LP khác
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Content Type */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: D.textFaint }}>Loại nội dung</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[{ v: 'macro_insight', l: '📊 Macro Insight' }, { v: 'knowledgebase', l: '📚 Knowledgebase' }].map(opt => (
                                                <button key={opt.v}
                                                    onClick={() => { setWsForm(f => ({ ...f, content_type: opt.v as 'macro_insight' | 'knowledgebase', content_slug: '' })); fetchContentList(opt.v) }}
                                                    className="py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                                                    style={{
                                                        background: wsForm.content_type === opt.v ? D.purpleBg : 'rgba(255,255,255,0.03)',
                                                        color: wsForm.content_type === opt.v ? D.purple : D.textMuted,
                                                        border: `1px solid ${wsForm.content_type === opt.v ? D.purple + '60' : D.border}`,
                                                    }}>
                                                    {opt.l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content Slug */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: D.textFaint }}>Bài content</label>
                                        <select value={wsForm.content_slug} onChange={e => setWsForm(f => ({ ...f, content_slug: e.target.value }))}
                                            className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none cursor-pointer"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${D.border}` }}>
                                            <option value="">-- Chọn bài --</option>
                                            {contentList.map(ci => <option key={ci.slug} value={ci.slug}>{ci.title || ci.slug}</option>)}
                                        </select>
                                    </div>

                                    {/* Campaign Name */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: D.textFaint }}>Tên Campaign</label>
                                        <input value={wsForm.campaign_name} onChange={e => setWsForm(f => ({ ...f, campaign_name: e.target.value }))}
                                            placeholder="vd: Tháng 3 — Cơ hội vàng KBSV"
                                            className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${D.border}` }} />
                                    </div>

                                    {/* Target Audience */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: D.textFaint }}>Target audience (tùy chọn)</label>
                                        <input value={wsForm.target_audience_hint} onChange={e => setWsForm(f => ({ ...f, target_audience_hint: e.target.value }))}
                                            placeholder="vd: Nhà đầu tư F0 lo lắng về tỷ giá"
                                            className="w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${D.border}` }} />
                                    </div>

                                    {generateError && (
                                        <div className="rounded-xl p-3" style={{ background: D.roseBg, border: `1px solid ${D.rose}40` }}>
                                            <p className="text-rose-400 text-sm">❌ {generateError}</p>
                                        </div>
                                    )}

                                    <button onClick={handleGenerate} disabled={generating || !wsForm.content_slug || !wsForm.campaign_name}
                                        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                                        style={{ background: D.purple, color: 'white' }}>
                                        {generating ? <><Loader2 className="w-4 h-4 animate-spin" />AI đang generate...</> : <><Sparkles className="w-4 h-4" />✨ Generate LP với AI</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
