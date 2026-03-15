'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronRight, Zap, TrendingUp, Shield, Target, Brain, BarChart3, Layers } from 'lucide-react'
import { PILLARS, TRACKS, getPillarsByTrack, type Track } from './data'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
})

const LEVEL_LABELS: Record<number, string> = { 1: 'Nền Tảng', 2: 'Chuyên Sâu', 3: 'Thực Chiến' }

const STATS = [
    { val: '10', label: 'Chủ đề', sub: 'kiến thức' },
    { val: '60+', label: 'Bài học', sub: 'chuyên sâu' },
    { val: '6', label: 'Tác giả', sub: 'kinh điển' },
    { val: '3', label: 'Cấp độ', sub: 'học tập' },
]

const TRACK_CONFIG: Record<Track, {
    gradient: string
    glow: string
    badge: string
    badgeText: string
    border: string
    icon: React.ReactNode
}> = {
    foundation: {
        gradient: 'from-violet-500/20 to-purple-600/10',
        glow: 'shadow-violet-500/20',
        badge: 'bg-violet-500/15 border-violet-400/30 text-violet-300',
        badgeText: 'LEVEL 1',
        border: 'border-violet-500/30',
        icon: <Layers className="w-4 h-4" />,
    },
    investor: {
        gradient: 'from-emerald-500/20 to-teal-600/10',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
        badgeText: 'LEVEL 2A',
        border: 'border-emerald-500/30',
        icon: <TrendingUp className="w-4 h-4" />,
    },
    trader: {
        gradient: 'from-blue-500/20 to-indigo-600/10',
        glow: 'shadow-blue-500/20',
        badge: 'bg-blue-500/15 border-blue-400/30 text-blue-300',
        badgeText: 'LEVEL 2B',
        border: 'border-blue-500/30',
        icon: <Zap className="w-4 h-4" />,
    },
    mastery: {
        gradient: 'from-amber-500/20 to-orange-600/10',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
        badgeText: 'LEVEL 3',
        border: 'border-amber-500/30',
        icon: <Target className="w-4 h-4" />,
    },
}

const PILLAR_ACCENTS: Record<string, { from: string; to: string; text: string; dot: string }> = {
    'tam-ly-thi-truong':     { from: '#7C3AED', to: '#9F67FA', text: 'text-violet-300', dot: 'bg-violet-400' },
    'co-che-thi-truong':     { from: '#475569', to: '#64748B', text: 'text-slate-300', dot: 'bg-slate-400' },
    'phan-tich-co-ban':      { from: '#059669', to: '#10B981', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    'dau-tu-gia-tri':        { from: '#0D9488', to: '#14B8A6', text: 'text-teal-300', dot: 'bg-teal-400' },
    'dau-tu-tang-truong':    { from: '#16A34A', to: '#22C55E', text: 'text-green-300', dot: 'bg-green-400' },
    'phan-tich-ky-thuat':    { from: '#2563EB', to: '#3B82F6', text: 'text-blue-300', dot: 'bg-blue-400' },
    'giao-dich-theo-xu-huong': { from: '#D97706', to: '#F59E0B', text: 'text-amber-300', dot: 'bg-amber-400' },
    'quan-ly-danh-muc':      { from: '#4F46E5', to: '#6366F1', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    'quan-tri-rui-ro':       { from: '#E11D48', to: '#F43F5E', text: 'text-rose-300', dot: 'bg-rose-400' },
    'ke-hoach-thuc-chien':   { from: '#EA580C', to: '#F97316', text: 'text-orange-300', dot: 'bg-orange-400' },
}

function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
    const accent = PILLAR_ACCENTS[pillar.slug] ?? { from: '#4F46E5', to: '#6366F1', text: 'text-indigo-300', dot: 'bg-indigo-400' }

    return (
        <motion.div
            {...fadeUp(index * 0.06)}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group cursor-pointer h-full"
        >
            <Link href={`/knowledgebase/${pillar.slug}`} className="block h-full">
                <div
                    className="relative h-full rounded-3xl overflow-hidden border border-white/8 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
                    }}
                >
                    {/* Header gradient stripe */}
                    <div
                        className="h-1.5 w-full"
                        style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
                    />

                    {/* Icon + level */}
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                            style={{
                                background: `linear-gradient(135deg, ${accent.from}30, ${accent.to}20)`,
                                boxShadow: `0 4px 12px ${accent.from}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
                                border: `1.5px solid ${accent.from}40`,
                            }}
                        >
                            {pillar.icon}
                        </div>
                        <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                            style={{
                                color: accent.to,
                                background: `${accent.from}15`,
                                borderColor: `${accent.from}35`,
                            }}
                        >
                            Lv.{pillar.level} {LEVEL_LABELS[pillar.level]}
                        </span>
                    </div>

                    <div className="px-5 pb-5">
                        <h3 className="font-bold text-white text-base leading-snug mb-1" style={{ fontFamily: "'Baloo 2', cursive" }}>
                            {pillar.title}
                        </h3>
                        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">{pillar.subtitle}</p>
                        <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-3">{pillar.description}</p>

                        {/* Article previews */}
                        <div className="space-y-1.5 mb-4">
                            {pillar.articles.slice(0, 2).map((article) => (
                                <div key={article.slug} className="flex items-start gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${accent.dot}`} />
                                    <p className="text-white/50 text-xs leading-relaxed">{article.title}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/8">
                            <span className="text-white/30 text-xs">{pillar.articleCount} bài học</span>
                            <span
                                className={`text-xs font-semibold flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity ${accent.text}`}
                            >
                                Xem tất cả <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function TrackSection({ track }: { track: Track }) {
    const pillars = getPillarsByTrack(track)
    const meta = TRACKS[track]
    const cfg = TRACK_CONFIG[track]

    return (
        <div className="mb-20">
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-8">
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold"
                    style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                    <span className={cfg.badge + ' flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold'}>
                        {cfg.icon}
                        {cfg.badgeText} — {meta.label}
                    </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <p className="text-white/30 text-xs shrink-0">{meta.sublabel}</p>
            </motion.div>

            <div className={`grid gap-5 ${
                pillars.length === 1 ? 'md:grid-cols-1 max-w-md' :
                pillars.length === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-2 lg:grid-cols-3'
            }`}>
                {pillars.map((pillar, i) => (
                    <PillarCard key={pillar.id} pillar={pillar} index={i} />
                ))}
            </div>
        </div>
    )
}

export default function KnowledgebasePage() {
    return (
        <div className="min-h-screen" style={{ background: '#0D0D18' }}>

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
                {/* Animated aurora blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25"
                        style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute -top-16 right-0 w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, 25, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                        className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle, #0EA5E9 0%, transparent 70%)' }}
                    />
                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left */}
                        <div>
                            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8">
                                <div
                                    className="flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-widest"
                                    style={{
                                        background: 'rgba(79,70,229,0.15)',
                                        borderColor: 'rgba(79,70,229,0.4)',
                                        color: '#A5B4FC',
                                        boxShadow: '0 0 20px rgba(79,70,229,0.2)',
                                    }}
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Thư Viện Kiến Thức FinPeace
                                </div>
                            </motion.div>

                            <motion.h1
                                {...fadeUp(0.08)}
                                className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6"
                                style={{ fontFamily: "'Baloo 2', cursive" }}
                            >
                                <span className="text-white">Từ </span>
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 50%, #4F46E5 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    nền tảng
                                </span>
                                <br />
                                <span className="text-white">đến </span>
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    thực chiến.
                                </span>
                            </motion.h1>

                            <motion.p {...fadeUp(0.16)} className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg">
                                Kho tàng kiến thức từ Graham, Buffett, Fisher, Lynch, Darvas đến Turtle Traders —
                                được tổ chức theo lộ trình{' '}
                                <span className="text-indigo-400 font-semibold">T-Shaped</span>{' '}
                                dành riêng cho nhà đầu tư Việt Nam.
                            </motion.p>

                            <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-3">
                                <Link
                                    href="#investor"
                                    className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all duration-200 hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                                        color: '#fff',
                                        boxShadow: '0 8px 24px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    }}
                                >
                                    Lộ trình Nhà Đầu Tư <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="#trader"
                                    className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all duration-200 hover:scale-105"
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        color: 'rgba(255,255,255,0.8)',
                                        border: '1.5px solid rgba(255,255,255,0.12)',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                                    }}
                                >
                                    Lộ trình Nhà Giao Dịch
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Stats bento */}
                        <motion.div {...fadeUp(0.12)} className="grid grid-cols-2 gap-4">
                            {STATS.map((s, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    className="rounded-3xl p-6 cursor-default"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <p className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Baloo 2', cursive" }}>{s.val}</p>
                                    <p className="text-white/70 text-sm font-semibold">{s.label}</p>
                                    <p className="text-white/30 text-xs">{s.sub}</p>
                                </motion.div>
                            ))}

                            {/* Quote card — spans full width */}
                            <motion.div
                                className="col-span-2 rounded-3xl p-5"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                                    border: '1px solid rgba(79,70,229,0.3)',
                                    boxShadow: '0 8px 32px rgba(79,70,229,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <p className="text-white/80 text-sm italic leading-relaxed mb-2">
                                    "Biết nhiều không quan trọng bằng biết đúng. Thị trường thưởng cho người có <strong className="text-white">hệ thống</strong>, không phải người có <strong className="text-white">thông tin</strong>."
                                </p>
                                <p className="text-indigo-400 text-xs font-semibold">— Warren Buffett</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ T-SHAPE DIAGRAM ══ */}
            <section className="relative py-20" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <motion.span
                            {...fadeUp()}
                            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            Lộ Trình Học T-Shaped
                        </motion.span>
                        <motion.h2
                            {...fadeUp(0.08)}
                            className="text-4xl font-black text-white mb-3"
                            style={{ fontFamily: "'Baloo 2', cursive" }}
                        >
                            Nền rộng → Chuyên sâu → Thực chiến
                        </motion.h2>
                        <motion.p {...fadeUp(0.14)} className="text-white/40 text-sm max-w-xl mx-auto">
                            Học nền tảng chung trước — rồi chọn nhánh phù hợp với phong cách của bạn.
                        </motion.p>
                    </div>

                    {/* T diagram */}
                    <motion.div {...fadeUp(0.18)} className="max-w-2xl mx-auto space-y-3">
                        {/* Foundation */}
                        <div
                            className="rounded-2xl p-4 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(159,103,250,0.1))',
                                border: '1.5px solid rgba(124,58,237,0.3)',
                                boxShadow: '0 4px 20px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Layers className="w-4 h-4 text-violet-400" />
                                <p className="text-violet-300 font-bold text-sm">Level 1 — Nền Tảng (Bắt buộc)</p>
                            </div>
                            <p className="text-white/40 text-xs">Tâm lý thị trường · Cơ chế hoạt động · Tư duy đúng về tiền</p>
                        </div>

                        {/* Two tracks */}
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(5,150,105,0.2), rgba(16,185,129,0.1))',
                                    border: '1.5px solid rgba(5,150,105,0.3)',
                                    boxShadow: '0 4px 20px rgba(5,150,105,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    <p className="text-emerald-300 font-bold text-xs">Level 2A — Nhà Đầu Tư</p>
                                </div>
                                <p className="text-white/40 text-xs">Phân tích cơ bản · Giá trị · Tăng trưởng</p>
                            </div>
                            <div
                                className="rounded-2xl p-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(59,130,246,0.1))',
                                    border: '1.5px solid rgba(37,99,235,0.3)',
                                    boxShadow: '0 4px 20px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                                    <p className="text-blue-300 font-bold text-xs">Level 2B — Nhà Giao Dịch</p>
                                </div>
                                <p className="text-white/40 text-xs">Phân tích kỹ thuật · Xu hướng · Momentum</p>
                            </div>
                        </div>

                        {/* Mastery */}
                        <div
                            className="rounded-2xl p-4 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(245,158,11,0.1))',
                                border: '1.5px solid rgba(217,119,6,0.35)',
                                boxShadow: '0 4px 20px rgba(217,119,6,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Shield className="w-4 h-4 text-amber-400" />
                                <p className="text-amber-300 font-bold text-sm">Level 3 — Thực Chiến & Quản Trị Rủi Ro</p>
                            </div>
                            <p className="text-white/40 text-xs">Portfolio · Risk Management · Kế hoạch cá nhân</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ ALL PILLARS ══ */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div id="foundation" className="mb-4">
                    <TrackSection track="foundation" />
                </div>
                <div id="investor">
                    <TrackSection track="investor" />
                </div>
                <div id="trader">
                    <TrackSection track="trader" />
                </div>
                <div id="mastery">
                    <TrackSection track="mastery" />
                </div>
            </section>

            {/* ══ REFERENCE BOOKS ══ */}
            <section
                className="py-24"
                style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <motion.h2
                        {...fadeUp()}
                        className="text-4xl font-black text-white mb-3"
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                    >
                        Kiến Thức Được Chắt Lọc Từ Kinh Điển
                    </motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-white/40 text-sm mb-14 max-w-lg mx-auto">
                        Không phát minh lại bánh xe — chúng tôi tổ chức lại kiến thức đã được kiểm chứng từ những nhà đầu tư vĩ đại nhất.
                    </motion.p>

                    <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { title: 'The Intelligent Investor', author: 'Benjamin Graham', color: '#4F46E5' },
                            { title: 'Common Stocks & Uncommon Profits', author: 'Philip Fisher', color: '#059669' },
                            { title: 'One Up On Wall Street', author: 'Peter Lynch', color: '#D97706' },
                            { title: 'How I Made $2M in Stock Market', author: 'Nicolas Darvas', color: '#DC2626' },
                            { title: 'Way of the Turtle', author: 'Curtis Faith', color: '#0891B2' },
                            { title: 'Trading in the Zone', author: 'Mark Douglas', color: '#7C3AED' },
                        ].map((book, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, y: -4 }}
                                className="rounded-2xl p-4 text-center cursor-default"
                                style={{
                                    background: `linear-gradient(145deg, ${book.color}18, ${book.color}08)`,
                                    border: `1.5px solid ${book.color}35`,
                                    boxShadow: `0 6px 20px ${book.color}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                                    style={{ background: `${book.color}25`, border: `1px solid ${book.color}40` }}
                                >
                                    <BarChart3 className="w-5 h-5" style={{ color: book.color }} />
                                </div>
                                <p className="text-white/85 font-semibold text-xs leading-snug mb-1">{book.title}</p>
                                <p className="text-white/35 text-xs">{book.author}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="relative overflow-hidden py-24">
                {/* BG */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #0F0F1A 50%, #064E3B 100%)' }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)' }}
                    />
                </div>

                <div className="relative max-w-2xl mx-auto px-6 text-center">
                    <motion.div {...fadeUp()}>
                        <div
                            className="w-16 h-16 rounded-3xl mx-auto mb-8 flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(99,102,241,0.2))',
                                border: '1.5px solid rgba(79,70,229,0.4)',
                                boxShadow: '0 8px 32px rgba(79,70,229,0.3)',
                            }}
                        >
                            <Brain className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2
                            className="text-5xl font-black text-white mb-4"
                            style={{ fontFamily: "'Baloo 2', cursive" }}
                        >
                            Bắt đầu từ nền tảng.
                        </h2>
                        <p className="text-white/50 mb-10 leading-relaxed">
                            Dù bạn muốn đầu tư dài hạn hay giao dịch ngắn hạn —
                            hành trình đúng đắn đều bắt đầu từ tâm lý và tư duy đúng.
                        </p>
                        <motion.div whileHover={{ scale: 1.03 }} className="inline-block">
                            <Link
                                href="/knowledgebase/tam-ly-thi-truong"
                                className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                                    color: '#fff',
                                    boxShadow: '0 12px 40px rgba(79,70,229,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    fontFamily: "'Baloo 2', cursive",
                                }}
                            >
                                Bắt đầu từ Tâm Lý Thị Trường <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-white/25 text-sm mt-4">Miễn phí · Không cần đăng ký</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
