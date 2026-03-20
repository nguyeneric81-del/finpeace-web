'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { PILLARS, type Pillar } from '../data'
import { useState, useEffect, useCallback } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
})

const DIFFICULTY_STYLE: Record<string, { bg: string; text: string; border: string }> = {
    'Cơ bản':   { bg: 'rgba(34,197,94,0.12)',  text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
    'Trung cấp':{ bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
    'Nâng cao': { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
}

const PILLAR_COLORS: Record<string, { from: string; to: string; glow: string }> = {
    'tam-ly-thi-truong':       { from: '#7C3AED', to: '#9F67FA', glow: 'rgba(124,58,237,0.25)' },
    'co-che-thi-truong':       { from: '#475569', to: '#64748B', glow: 'rgba(71,85,105,0.25)' },
    'phan-tich-co-ban':        { from: '#059669', to: '#10B981', glow: 'rgba(5,150,105,0.25)' },
    'dau-tu-gia-tri':          { from: '#0D9488', to: '#14B8A6', glow: 'rgba(13,148,136,0.25)' },
    'dau-tu-tang-truong':      { from: '#16A34A', to: '#22C55E', glow: 'rgba(22,163,74,0.25)' },
    'phan-tich-ky-thuat':      { from: '#2563EB', to: '#3B82F6', glow: 'rgba(37,99,235,0.25)' },
    'giao-dich-theo-xu-huong': { from: '#D97706', to: '#F59E0B', glow: 'rgba(217,119,6,0.25)' },
    'quan-ly-danh-muc':        { from: '#4F46E5', to: '#6366F1', glow: 'rgba(79,70,229,0.25)' },
    'quan-tri-rui-ro':         { from: '#E11D48', to: '#F43F5E', glow: 'rgba(225,29,72,0.25)' },
    'ke-hoach-thuc-chien':     { from: '#EA580C', to: '#F97316', glow: 'rgba(234,88,12,0.25)' },
}

function RelatedPillars({ currentSlug }: { currentSlug: string }) {
    const related = PILLARS.filter(p => p.slug !== currentSlug).slice(0, 3)
    return (
        <div className="grid md:grid-cols-3 gap-4">
            {related.map((p, i) => {
                const clr = PILLAR_COLORS[p.slug] ?? { from: '#4F46E5', to: '#6366F1', glow: 'rgba(79,70,229,0.2)' }
                return (
                    <motion.div key={p.id} {...fadeUp(i * 0.08)} whileHover={{ y: -3 }}>
                        <Link href={`/knowledgebase/${p.slug}`} className="block h-full cursor-pointer">
                            <div
                                className="h-full rounded-2xl p-5 transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: `1.5px solid ${clr.from}35`,
                                    boxShadow: `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{p.icon}</span>
                                    <span className="text-sm font-bold text-white/80">{p.title}</span>
                                </div>
                                <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                                <p className="text-xs font-semibold flex items-center gap-1" style={{ color: clr.to }}>
                                    {p.articleCount} bài <ArrowRight className="w-3 h-3" />
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                )
            })}
        </div>
    )
}

// ── Content Engagement Bar (Like/Love + KB CTA) ──────────────────────────────
function ContentEngagementBar({ slug, pillar }: { slug: string; pillar: string }) {
    const [liked, setLiked] = useState(false)
    const [loved, setLoved] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', phone: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const react = useCallback(async (reaction: 'like' | 'love') => {
        if (reaction === 'like' && liked) return
        if (reaction === 'love' && loved) return
        if (reaction === 'like') setLiked(true)
        if (reaction === 'love') setLoved(true)
        await fetch('/api/content/react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content_type: 'knowledgebase', slug, pillar, reaction }),
        })
    }, [liked, loved, slug, pillar])

    const submitKbRequest = async () => {
        if (!form.phone) return
        setSubmitting(true)
        await fetch('/api/kb-account/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: form.name || null,
                user_phone: form.phone,
                user_email: `${form.phone}@temp.finpeace.vn`,
                content_type: 'knowledgebase',
                content_slug: slug,
                content_title: pillar,
            }),
        })
        setSubmitting(false)
        setSubmitted(true)
        setShowModal(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center justify-between gap-4 py-6 px-6 rounded-2xl mt-8"
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div>
                    <p className="text-white/70 text-sm font-medium mb-2">Bài viết này có hữu ích không?</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => react('like')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                liked
                                    ? 'bg-blue-500/30 text-blue-300 border-blue-500/40'
                                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            👍 {liked ? 'Đã thích' : 'Hữu ích'}
                        </button>
                        <button
                            onClick={() => react('love')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                loved
                                    ? 'bg-rose-500/30 text-rose-300 border-rose-500/40'
                                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            ❤️ {loved ? 'Yêu thích' : 'Yêu thích'}
                        </button>
                    </div>
                </div>

                {submitted ? (
                    <div className="text-emerald-400 text-sm font-semibold">
                        ✓ Đã gửi yêu cầu — Agent sẽ liên hệ sớm
                    </div>
                ) : (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #c4a67a, #d4b68a)', color: '#0d1119' }}
                    >
                        🔓 Mở tài khoản KB để xem toàn bộ
                    </button>
                )}
            </motion.div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold text-white mb-1">🔓 Mở tài khoản KB</h2>
                        <p className="text-slate-400 text-sm mb-5">
                            Agent sẽ liên hệ hỗ trợ bạn trong 24h. Sau khi mở tài khoản, bạn được xem toàn bộ
                            Knowledgebase &amp; Macro Insights không giới hạn.
                        </p>
                        <div className="space-y-3">
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Họ tên (tuỳ chọn)"
                                className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                            />
                            <input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="Số điện thoại *"
                                className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600"
                            />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={submitKbRequest}
                                disabled={submitting || !form.phone}
                                className="flex-1 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-bold disabled:opacity-50"
                            >
                                {submitting ? '⏳...' : 'Gửi yêu cầu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PillarPageClient({ pillar }: { pillar: Pillar }) {
    const clr = PILLAR_COLORS[pillar.slug] ?? { from: '#4F46E5', to: '#6366F1', glow: 'rgba(79,70,229,0.25)' }

    // Track view on mount
    useEffect(() => {
        fetch('/api/content/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content_type: 'knowledgebase', slug: pillar.slug, pillar: pillar.slug }),
        }).catch(() => {})
    }, [pillar.slug])

    return (
        <div className="min-h-screen" style={{ background: '#0D0D18' }}>

            {/* ── HERO ── */}
            <section className="relative overflow-hidden">
                {/* Aurora blob */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: `radial-gradient(circle, ${clr.from} 0%, transparent 70%)` }}
                    />
                    <div
                        className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-10"
                        style={{ background: `radial-gradient(circle, ${clr.to} 0%, transparent 70%)` }}
                    />
                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-16">
                    {/* Breadcrumb */}
                    <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-xs text-white/30 mb-8">
                        <Link href="/knowledgebase" className="hover:text-white/70 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Thư Viện
                        </Link>
                        <span>/</span>
                        <span style={{ color: clr.to }}>{pillar.title}</span>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.div {...fadeUp(0.05)} className="flex items-center gap-3 mb-5">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${clr.from}30, ${clr.to}20)`,
                                        border: `1.5px solid ${clr.from}40`,
                                        boxShadow: `0 4px 16px ${clr.glow}`,
                                    }}
                                >
                                    {pillar.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: clr.to }}>
                                        Level {pillar.level}
                                    </p>
                                    <p className="text-white/35 text-xs">{pillar.subtitle}</p>
                                </div>
                            </motion.div>

                            <motion.h1
                                {...fadeUp(0.1)}
                                className="text-4xl lg:text-5xl font-black leading-tight mb-4 text-white"
                                style={{ fontFamily: "'Baloo 2', cursive" }}
                            >
                                {pillar.title}
                            </motion.h1>

                            <motion.p {...fadeUp(0.15)} className="text-white/50 leading-relaxed mb-6">
                                {pillar.description}
                            </motion.p>

                            <motion.div {...fadeUp(0.2)} className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5" style={{ color: clr.to }}>
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{pillar.articleCount} bài học</span>
                                </div>
                                <div className="w-px h-4 bg-white/10" />
                                <span className="text-white/30 text-sm">Đọc từ đầu đến cuối</span>
                            </motion.div>
                        </div>

                        {/* Preview panel */}
                        <motion.div {...fadeUp(0.2)}>
                            <div
                                className="rounded-3xl p-6"
                                style={{
                                    background: `linear-gradient(145deg, ${clr.from}15, ${clr.to}08)`,
                                    border: `1.5px solid ${clr.from}30`,
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
                                }}
                            >
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: clr.to }}>
                                    Bạn sẽ học được
                                </p>
                                <div className="space-y-3">
                                    {pillar.articles.slice(0, 3).map((article, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div
                                                className="w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5"
                                                style={{
                                                    background: `${clr.from}25`,
                                                    color: clr.to,
                                                    border: `1px solid ${clr.from}40`,
                                                }}
                                            >
                                                {i + 1}
                                            </div>
                                            <p className="text-white/65 text-sm leading-snug">{article.title}</p>
                                        </div>
                                    ))}
                                    {pillar.articles.length > 3 && (
                                        <p className="text-xs ml-9" style={{ color: `${clr.to}80` }}>
                                            +{pillar.articles.length - 3} bài học nữa...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── ARTICLE LIST ── */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <motion.h2
                    {...fadeUp()}
                    className="text-2xl font-black text-white mb-8"
                    style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                    Danh Sách Bài Học
                </motion.h2>

                <div className="space-y-3">
                    {pillar.articles.map((article, i) => {
                        const diff = DIFFICULTY_STYLE[article.difficulty] ?? DIFFICULTY_STYLE['Cơ bản']
                        return (
                            <motion.div
                                key={article.slug}
                                {...fadeUp(i * 0.04)}
                                whileHover={{ x: 4 }}
                            >
                                <Link href={`/knowledgebase/${pillar.slug}/${article.slug}`} className="block cursor-pointer">
                                    <div
                                        className="rounded-2xl p-5 transition-all duration-200 group"
                                        style={{
                                            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                                                style={{
                                                    background: `${clr.from}20`,
                                                    color: clr.to,
                                                    border: `1.5px solid ${clr.from}35`,
                                                }}
                                            >
                                                {String(i + 1).padStart(2, '0')}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white/85 text-sm leading-snug mb-2 group-hover:text-white transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-white/40 text-xs leading-relaxed mb-3">
                                                    {article.summary}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                                                        style={{ background: diff.bg, color: diff.text, borderColor: diff.border }}
                                                    >
                                                        {article.difficulty}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-white/30">
                                                        <Clock className="w-3 h-3" /> {article.readTime} phút
                                                    </span>
                                                    {article.tags.slice(0, 2).map((tag: string) => (
                                                        <span key={tag} className="text-xs text-white/20 px-2 py-0.5 rounded-full"
                                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <ChevronRight
                                                className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ color: clr.to }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                {/* ── ENGAGEMENT BAR ── */}
                <ContentEngagementBar slug={pillar.slug} pillar={pillar.title} />
            </section>

            {/* ── RELATED ── */}
            <section
                className="py-16"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-5xl mx-auto px-6">
                    <motion.h2
                        {...fadeUp()}
                        className="text-xl font-black text-white mb-6"
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                    >
                        Chủ Đề Liên Quan
                    </motion.h2>
                    <RelatedPillars currentSlug={pillar.slug} />
                </div>
            </section>
        </div>
    )
}
