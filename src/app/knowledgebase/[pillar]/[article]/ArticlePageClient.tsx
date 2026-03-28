'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    type ContentBlock, type ContentBlockItem, type CandlePatternItem,
    type CandleShape, type ContractClause, type Pillar, type Article
} from '../../data'
import { getArticleContent } from '../../content'
import { useState, useCallback, useEffect } from 'react'
import ContentGate, { isKbUnlocked } from '@/components/knowledgebase/ContentGate'
import ValuationSlider from '@/components/knowledgebase/widgets/ValuationSlider'

const GATED_TRACKS = ['investor', 'trader', 'mastery']
const FREE_BLOCKS_COUNT = 3

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45, delay },
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

const TEMPLATE_BLOCKS: ContentBlock[] = [
    { type: 'intro', content: 'Nội dung đang được cập nhật. Vui lòng quay lại sau.' },
]

// ── SVG CANDLESTICK CHART ────────────────────────────────────────
const W = 20
const H = 90

function SingleCandle({ c, x = 0 }: { c: CandleShape; x?: number }) {
    const fill = c.color === 'green' ? '#22c55e' : c.color === 'red' ? '#ef4444' : '#94a3b8'
    const stroke = c.color === 'green' ? '#16a34a' : c.color === 'red' ? '#dc2626' : '#64748b'
    const centerX = x + W / 2
    const bodyH = Math.max(c.bodyH, 3)
    return (
        <g>
            {c.shadowTop > 0 && <line x1={centerX} y1={4} x2={centerX} y2={c.bodyY} stroke={stroke} strokeWidth={1.5} />}
            <rect x={x + 3} y={c.bodyY} width={W - 6} height={bodyH} fill={fill} rx={1} />
            {c.shadowBot > 0 && <line x1={centerX} y1={c.bodyY + bodyH} x2={centerX} y2={c.bodyY + bodyH + c.shadowBot} stroke={stroke} strokeWidth={1.5} />}
        </g>
    )
}

function CandleChart({ candles }: { candles: CandleShape[] }) {
    const totalW = candles.length * W + (candles.length - 1) * 4
    return (
        <svg viewBox={`0 0 ${totalW} ${H}`} width={totalW} height={H} className="overflow-visible">
            {candles.map((c, i) => <SingleCandle key={i} c={c} x={i * (W + 4)} />)}
        </svg>
    )
}

function parseFormattedText(text: string, textClass: string) {
    if (!text) return null;
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
        const isBullet = line.trim().startsWith('-');
        const cleanLine = isBullet ? line.replace(/^\s*-\s*/, '') : line;
        
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-extrabold text-current brightness-150">{part.slice(2, -2)}</strong>
            }
            return part;
        });

        if (isBullet) {
            return (
                <div key={i} className="flex items-start gap-2.5 pl-2">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                    <p className={`flex-1 ${textClass} m-0`}>{parts}</p>
                </div>
            )
        }
        return <p key={i} className={`${textClass} m-0`}>{parts}</p>
    })
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case 'intro':
            return (
                <div className="space-y-4">
                    {parseFormattedText(block.content as string, 'text-white/65 text-base leading-relaxed')}
                </div>
            )
        case 'key-insight':
            return (
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))',
                        border: '1.5px solid rgba(34,197,94,0.25)',
                        boxShadow: '0 4px 16px rgba(34,197,94,0.08)',
                    }}
                >
                    <p className="text-emerald-400 font-bold text-sm mb-3">{block.title}</p>
                    <div className="space-y-3 text-emerald-200/80">
                        {parseFormattedText(block.content as string, 'font-medium leading-relaxed')}
                    </div>
                </div>
            )
        case 'concept':
            return (
                <div>
                    <h3 className="text-white font-bold text-lg mb-3">{block.title}</h3>
                    <div className="space-y-3 text-white/55">
                        {parseFormattedText(block.content as string, 'leading-relaxed text-justify')}
                    </div>
                </div>
            )
        case 'quote':
            return (
                <div
                    className="rounded-2xl p-6 my-2"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                >
                    <Quote className="w-6 h-6 text-indigo-400 mb-3" />
                    <p className="text-white/85 text-lg font-medium italic leading-relaxed mb-4">{block.content as string}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-px h-8 bg-indigo-400" />
                        <div>
                            <p className="text-indigo-400 font-bold text-sm">{block.author}</p>
                            <p className="text-white/30 text-xs">{block.source}</p>
                        </div>
                    </div>
                </div>
            )
        case 'checklist':
            return (
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <h3 className="text-white font-bold text-sm mb-4">{block.title}</h3>
                    <div className="space-y-2.5">
                        {(block.content as string[]).map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                                    style={{
                                        background: 'rgba(34,197,94,0.15)',
                                        color: '#4ade80',
                                        border: '1px solid rgba(34,197,94,0.3)',
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'warning':
            return (
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))',
                        border: '1.5px solid rgba(251,191,36,0.25)',
                    }}
                >
                    <h3 className="text-amber-400 font-bold text-sm mb-3">{block.title}</h3>
                    <div className="space-y-3 text-amber-200/70">
                        {parseFormattedText(block.content as string, 'text-sm leading-relaxed')}
                    </div>
                </div>
            )
        case 'summary':
            return (
                <div
                    className="rounded-2xl p-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(20,184,166,0.1))',
                        border: '1.5px solid rgba(13,148,136,0.3)',
                    }}
                >
                    <h3 className="font-bold text-teal-400 text-sm mb-4">{block.title}</h3>
                    <div className="space-y-2">
                        {(block.content as string[]).map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                <p className="text-teal-200/80 text-sm leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'steps':
            return (
                <div>
                    {block.title && <h3 className="text-white font-bold text-lg mb-5">{block.title}</h3>}
                    <div className="space-y-3">
                        {(block.items ?? []).map((item: ContentBlockItem, i: number) => (
                            <div
                                key={i}
                                className="flex gap-4 p-4 rounded-2xl"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}
                            >
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                                            color: '#fff',
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <span className="text-lg">{item.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-bold text-white/85 text-sm">{item.title}</span>
                                        {item.highlight && (
                                            <span
                                                className="text-xs font-black px-2 py-0.5 rounded-full"
                                                style={{
                                                    background: 'rgba(34,197,94,0.15)',
                                                    color: '#4ade80',
                                                    border: '1px solid rgba(34,197,94,0.3)',
                                                }}
                                            >
                                                {item.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/45 text-sm leading-relaxed italic">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'candle-patterns':
            return (
                <div>
                    {block.title && <h3 className="text-white font-bold text-lg mb-4">{block.title}</h3>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(block.patterns ?? []).map((p: CandlePatternItem, i: number) => (
                            <div
                                key={i}
                                className="rounded-2xl p-3 flex flex-col items-center gap-2"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <div className="flex items-end justify-center h-[90px] gap-1">
                                    <CandleChart candles={p.candles} />
                                </div>
                                <p className="text-white/80 font-bold text-xs text-center leading-tight">{p.name}</p>
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                                    style={
                                        p.signal === 'bullish'
                                            ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }
                                            : p.signal === 'bearish'
                                            ? { background: 'rgba(248,113,113,0.12)', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }
                                            : { background: 'rgba(148,163,184,0.12)', color: '#94a3b8', borderColor: 'rgba(148,163,184,0.2)' }
                                    }
                                >
                                    {p.signal === 'bullish' ? '↑ Tăng' : p.signal === 'bearish' ? '↓ Giảm' : '⇌ Lưỡng lự'}
                                </span>
                                <p className="text-white/30 text-[10px] text-center leading-snug">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'contract':
            return (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: '1.5px solid rgba(255,255,255,0.1)' }}
                >
                    <div
                        className="px-6 py-4 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div>
                            <p className="text-white font-black text-sm tracking-wide">{block.title ?? 'BẢN TUYÊN BỐ PHƯƠNG CHÂM ĐẦU TƯ'}</p>
                            <p className="text-white/30 text-xs mt-0.5">Hợp Đồng Với Chính Mình</p>
                        </div>
                        <span className="text-2xl">📜</span>
                    </div>
                    {block.content && (
                        <div
                            className="px-6 py-3"
                            style={{ background: 'rgba(251,191,36,0.08)', borderBottom: '1px solid rgba(251,191,36,0.15)' }}
                        >
                            <p className="text-amber-300/70 text-xs italic leading-relaxed">{block.content as string}</p>
                        </div>
                    )}
                    <div style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {(block.clauses ?? []).map((clause: ContractClause, i: number) => (
                            <div
                                key={i}
                                className="px-6 py-4"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 min-w-[72px]">
                                        <span
                                            className="inline-block text-[10px] font-black px-2 py-0.5 rounded-md"
                                            style={{ background: 'rgba(79,70,229,0.3)', color: '#a5b4fc' }}
                                        >
                                            {clause.number}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white/80 font-bold text-sm mb-1">{clause.label}</p>
                                        <p className="text-white/45 text-sm leading-relaxed">{clause.content}</p>
                                        {clause.fillable && (
                                            <div className="mt-2 border-b-2 border-dashed py-1" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                                                <p className="text-white/25 text-xs italic">✍️ Điền vào đây: ................................................................</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {block.signatureFields && block.signatureFields.length > 0 && (
                        <div
                            className="px-6 py-5"
                            style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <div className="grid gap-4">
                                {block.signatureFields.map((field: string, i: number) => (
                                    <div key={i} className="flex items-end gap-3">
                                        <span className="text-white/35 text-xs font-semibold shrink-0 min-w-[140px]">{field}:</span>
                                        <div className="flex-1 border-b border-dashed pb-0.5" style={{ borderColor: 'rgba(255,255,255,0.15)' }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )
        case 'widget':
            if (block.widgetName === 'ValuationSlider') {
                return <ValuationSlider {...(block.widgetProps || {})} />
            }
            return (
                <div className="p-4 border border-dashed border-red-500/50 bg-red-500/10 rounded-xl text-red-200 text-sm">
                    Widget Error: Không tìm thấy component `{block.widgetName}`
                </div>
            )
        default:
            return null
    }
}

interface Props {
    pillar: Pillar
    article: Article
    pillarSlug: string
    articleSlug: string
    prevArticle: Article | null
    nextArticle: Article | null
}

// ── Article Engagement Bar (Like/Love + KB CTA) ───────────────────────────
function ArticleEngagementBar({
    slug, pillar, articleTitle, clr
}: {
    slug: string
    pillar: string
    articleTitle: string
    clr: { from: string; to: string; glow: string }
}) {
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
        fetch('/api/content/react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content_type: 'knowledgebase', slug, pillar, reaction }),
        }).catch(() => {})
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
                content_title: articleTitle,
            }),
        })
        setSubmitting(false)
        setSubmitted(true)
        setShowModal(false)
    }

    return (
        <>
            <div
                className="max-w-4xl mx-auto px-6 py-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5"
                    style={{
                        background: `linear-gradient(145deg, ${clr.from}10, ${clr.to}06)`,
                        border: `1px solid ${clr.from}25`,
                    }}
                >
                    <div>
                        <p className="text-white/70 text-sm font-semibold mb-2">Bài này có giúp ích cho bạn không?</p>
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
                            ✓ Đã gửi — Agent sẽ liên hệ sớm
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                            style={{ background: 'linear-gradient(135deg, #c4a67a, #d4b68a)', color: '#0d1119' }}
                        >
                            🔓 Mở tài khoản KB miễn phí
                        </button>
                    )}
                </motion.div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-1">🔓 Mở tài khoản KB</h2>
                        <p className="text-slate-400 text-sm mb-2">
                            Bạn đang đọc: <span className="text-slate-200 font-medium">{articleTitle}</span>
                        </p>
                        <p className="text-slate-500 text-xs mb-5">
                            Agent sẽ liên hệ hỗ trợ trong 24h. Sau khi mở tài khoản, bạn được xem toàn bộ nội dung không giới hạn.
                        </p>
                        <div className="space-y-3">
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Họ tên (tuỳ chọn)"
                                className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#c4a67a]"
                            />
                            <input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="Số điện thoại *"
                                className="w-full bg-[#0d1119] border border-[#1e2535] rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#c4a67a]"
                            />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 border border-[#1e2535] text-slate-400 rounded-lg text-sm hover:bg-white/5"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={submitKbRequest}
                                disabled={submitting || !form.phone}
                                className="flex-1 py-2 bg-[#c4a67a] text-[#0d1119] rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-[#d4b68a]"
                            >
                                {submitting ? '⏳ Đang gửi...' : 'Gửi yêu cầu'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    )
}

export default function ArticlePageClient({ pillar, article, pillarSlug, articleSlug, prevArticle, nextArticle }: Props) {
    const isGated = GATED_TRACKS.includes(pillar.track)
    const [unlocked, setUnlocked] = useState(false)

    useEffect(() => {
        if (isKbUnlocked()) setUnlocked(true)
    }, [])

    const handleUnlock = useCallback(() => setUnlocked(true), [])

    const allBlocks = getArticleContent(pillarSlug, articleSlug) ?? TEMPLATE_BLOCKS
    const freeBlocks = isGated && !unlocked ? allBlocks.slice(0, FREE_BLOCKS_COUNT) : allBlocks
    const hasLockedContent = isGated && !unlocked && allBlocks.length > FREE_BLOCKS_COUNT

    const clr = PILLAR_COLORS[pillarSlug] ?? { from: '#4F46E5', to: '#6366F1', glow: 'rgba(79,70,229,0.25)' }
    const diff = DIFFICULTY_STYLE[article.difficulty] ?? DIFFICULTY_STYLE['Cơ bản']

    return (
        <div className="min-h-screen" style={{ background: '#0D0D18' }}>

            {/* ── TOP BAR breadcrumb ── */}
            <div
                className="sticky top-0 z-30 backdrop-blur-md"
                style={{
                    background: 'rgba(13,13,24,0.85)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-white/30">
                    <Link href="/knowledgebase" className="hover:text-white/70 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Thư Viện
                    </Link>
                    <span>/</span>
                    <Link href={`/knowledgebase/${pillar.slug}`} className="hover:text-white/70 transition-colors">
                        {pillar.title}
                    </Link>
                    <span>/</span>
                    <span className="text-white/50 line-clamp-1 max-w-xs">{article.title}</span>
                </div>
            </div>

            {/* ── ARTICLE HEADER ── */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full opacity-15"
                        style={{ background: `radial-gradient(circle, ${clr.from} 0%, transparent 70%)` }}
                    />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 py-12">
                    {/* Meta pills */}
                    <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-5 flex-wrap">
                        <span
                            className="text-xs font-bold px-3 py-1 rounded-full border"
                            style={{ background: diff.bg, color: diff.text, borderColor: diff.border }}
                        >
                            {article.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-white/30">
                            <Clock className="w-3 h-3" /> {article.readTime} phút đọc
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                            <span className="text-base">{pillar.icon}</span>
                            <span className="font-semibold" style={{ color: clr.to }}>{pillar.title}</span>
                        </span>
                    </motion.div>

                    <motion.h1
                        {...fadeUp(0.08)}
                        className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4"
                        style={{ fontFamily: "'Baloo 2', cursive" }}
                    >
                        {article.title}
                    </motion.h1>

                    <motion.p {...fadeUp(0.12)} className="text-white/50 text-base leading-relaxed mb-6 max-w-2xl">
                        {article.summary}
                    </motion.p>

                    {/* Tags */}
                    <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 text-xs text-white/35 px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                <Tag className="w-2.5 h-2.5" /> {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* References */}
                    {article.references && (
                        <motion.div {...fadeUp(0.18)} className="mt-4 flex flex-wrap gap-2">
                            {article.references.map(ref => (
                                <span
                                    key={ref}
                                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                                    style={{
                                        background: `${clr.from}15`,
                                        color: clr.to,
                                        border: `1px solid ${clr.from}30`,
                                    }}
                                >
                                    <BookOpen className="w-3 h-3" /> {ref}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ── ARTICLE BODY ── */}
            <section
                className="max-w-4xl mx-auto px-6 py-12"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {freeBlocks.map((block, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.05)}>
                                <ContentBlockRenderer block={block} />
                            </motion.div>
                        ))}

                        {hasLockedContent && (
                            <div className="mt-2">
                                <ContentGate
                                    pillarTitle={pillar.title}
                                    pillarSlug={pillarSlug}
                                    articleSlug={articleSlug}
                                    track={pillar.track}
                                    onUnlock={handleUnlock}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Article nav */}
                        <motion.div
                            {...fadeUp(0.1)}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: `linear-gradient(145deg, ${clr.from}12, ${clr.to}08)`,
                                border: `1.5px solid ${clr.from}25`,
                            }}
                        >
                            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${clr.from}20` }}>
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: clr.to }}>
                                    Tiến Độ Trong Chủ Đề
                                </p>
                            </div>
                            <div className="p-2 space-y-1">
                                {pillar.articles.map((a, i) => {
                                    const isActive = a.slug === articleSlug
                                    return (
                                        <Link
                                            key={a.slug}
                                            href={`/knowledgebase/${pillar.slug}/${a.slug}`}
                                            className="flex items-center gap-2 text-xs rounded-xl px-3 py-2 transition-all"
                                            style={isActive
                                                ? { background: `${clr.from}20`, color: clr.to, fontWeight: 700 }
                                                : { color: 'rgba(255,255,255,0.4)' }
                                            }
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                                                style={isActive
                                                    ? { background: `${clr.from}30`, color: clr.to }
                                                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }
                                                }
                                            >
                                                {i + 1}
                                            </span>
                                            <span className="line-clamp-1">{a.title.split('—')[0].split(':')[0].trim()}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            {...fadeUp(0.15)}
                            className="rounded-2xl p-5"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-3">Thống Kê Bài</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Thời gian đọc</span>
                                    <span className="font-semibold text-white/70">{article.readTime} phút</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-white/40">Độ khó</span>
                                    <span
                                        className="font-semibold text-xs px-2 py-0.5 rounded-full border"
                                        style={{ background: diff.bg, color: diff.text, borderColor: diff.border }}
                                    >
                                        {article.difficulty}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Chủ đề</span>
                                    <span className="font-semibold text-white/70">{pillar.title}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── ENGAGEMENT BAR (Like/Love + KB CTA) ── */}
            <ArticleEngagementBar
                slug={articleSlug}
                pillar={pillarSlug}
                articleTitle={article.title}
                clr={clr}
            />

            {/* ── PREV / NEXT NAV ── */}
            <section
                className="py-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-2 gap-4">
                        {prevArticle ? (
                            <motion.div {...fadeUp()}>
                                <Link
                                    href={`/knowledgebase/${pillar.slug}/${prevArticle.slug}`}
                                    className="block rounded-2xl p-4 transition-all duration-200 group"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}
                                >
                                    <div className="flex items-center gap-2 text-white/30 text-xs mb-1">
                                        <ChevronLeft className="w-3 h-3" /> Bài trước
                                    </div>
                                    <p className="text-white/65 font-semibold text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                                        {prevArticle.title}
                                    </p>
                                </Link>
                            </motion.div>
                        ) : <div />}

                        {nextArticle ? (
                            <motion.div {...fadeUp(0.05)}>
                                <Link
                                    href={`/knowledgebase/${pillar.slug}/${nextArticle.slug}`}
                                    className="block rounded-2xl p-4 transition-all duration-200 group text-right"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}
                                >
                                    <div className="flex items-center justify-end gap-2 text-white/30 text-xs mb-1">
                                        Bài tiếp <ChevronRight className="w-3 h-3" />
                                    </div>
                                    <p className="text-white/65 font-semibold text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                                        {nextArticle.title}
                                    </p>
                                </Link>
                            </motion.div>
                        ) : <div />}
                    </div>

                    <motion.div {...fadeUp(0.1)} className="mt-4 text-center">
                        <Link
                            href={`/knowledgebase/${pillar.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline transition-colors"
                            style={{ color: clr.to }}
                        >
                            <ArrowLeft className="w-3 h-3" /> Quay lại {pillar.title}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA strip ── */}
            <section
                className="py-12 text-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-lg mx-auto px-6">
                    <p className="text-white/30 text-sm mb-4">Muốn có Trading Plan cá nhân được tư vấn bởi chuyên gia?</p>
                    <Link
                        href="/advisor/register"
                        className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-2xl text-sm transition-all duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                            color: '#fff',
                            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                        }}
                    >
                        Đăng ký tư vấn FinPeace <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
