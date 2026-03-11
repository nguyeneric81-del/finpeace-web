'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPillarBySlug, getArticleBySlug, type ContentBlock, type ContentBlockItem, type CandlePatternItem, type CandleShape } from '../../data'
import { getArticleContent } from '../../content'
import { notFound } from 'next/navigation'
import { use } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45, delay },
})

const HR = ({ dark = false }: { dark?: boolean }) =>
    <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

const DIFFICULTY_COLOR: Record<string, string> = {
    'Cơ bản': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Trung cấp': 'bg-amber-100 text-amber-700 border-amber-200',
    'Nâng cao': 'bg-rose-100 text-rose-700 border-rose-200',
}

// ── ARTICLE TEMPLATE CONTENT BLOCKS ────────────────────────────────────────
// These blocks form the standard layout/template for EVERY article
// Content writers fill in the placeholder sections



// Sample content for the template demonstration
const TEMPLATE_BLOCKS: ContentBlock[] = [
    {
        type: 'intro',
        content: 'Phần mở đầu: Đặt vấn đề bằng một câu chuyện thực tế hoặc tình huống quen thuộc với nhà đầu tư Việt Nam. Không bắt đầu bằng định nghĩa khô khan — hãy tạo sự đồng cảm trước.',
    },
    {
        type: 'key-insight',
        title: '💡 Insight Cốt Lõi',
        content: 'Bài học quan trọng nhất trong bài — có thể là một con số, một nghịch lý, hoặc một sự thật ngược trực giác. Viết trong 1-2 câu, in đậm.',
    },
    {
        type: 'concept',
        title: '📖 Khái Niệm & Lý Thuyết',
        content: 'Giải thích khái niệm chính một cách đơn giản, ví dụ như giải thích cho một người không có background tài chính. Dùng ví dụ cụ thể và phép so sánh gần gũi (mua căn nhà, mở tiệm phở...).',
    },
    {
        type: 'quote',
        content: '"Trích dẫn quan trọng từ tác giả gốc, được dịch sang tiếng Việt một cách mượt mà và chính xác."',
        author: 'Tên Tác Giả',
        source: 'Tên Cuốn Sách',
    },
    {
        type: 'checklist',
        title: '✅ Áp Dụng Vào Thực Tế (Dành Cho TTCK Việt Nam)',
        content: [
            'Bước 1: Hành động cụ thể với công cụ có sẵn tại Việt Nam',
            'Bước 2: Cách lọc/tra cứu thông tin trên VCSC, SSI, Fireant...',
            'Bước 3: Ví dụ với cổ phiếu thực tế trên HOSE/HNX',
            'Bước 4: Những lỗi phổ biến cần tránh',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Cạm Bẫy & Hiểu Lầm Thường Gặp',
        content: 'Phần này quan trọng như phần nội dung chính: chỉ rõ những gì người học hay áp dụng sai, những trường hợp ngoại lệ mà lý thuyết không áp dụng được.',
    },
    {
        type: 'summary',
        title: '📋 Tóm Tắt Bài Học',
        content: [
            'Điểm quan trọng #1 — viết ngắn gọn, để người đọc nhớ được sau 1 tuần',
            'Điểm quan trọng #2',
            'Điểm quan trọng #3',
            'Bước tiếp theo: Bài học nào nên đọc tiếp theo và tại sao',
        ],
    },
]


// ── SVG CANDLESTICK CHART COMPONENT ────────────────────────────────────────
const W = 20   // width per candle
const H = 90   // total svg height

function SingleCandle({ c, x = 0 }: { c: CandleShape; x?: number }) {
    const fill = c.color === 'green' ? '#22c55e' : c.color === 'red' ? '#ef4444' : '#94a3b8'
    const stroke = c.color === 'green' ? '#16a34a' : c.color === 'red' ? '#dc2626' : '#64748b'
    const centerX = x + W / 2
    // shadow top line: from top of svg down to body top
    const shadowTopY1 = 4
    const shadowTopY2 = c.bodyY
    // body rect
    const bodyTop = c.bodyY
    const bodyH = Math.max(c.bodyH, 3)
    // shadow bottom line: from body bottom down
    const shadowBotY1 = c.bodyY + bodyH
    const shadowBotY2 = c.bodyY + bodyH + c.shadowBot
    return (
        <g>
            {c.shadowTop > 0 && <line x1={centerX} y1={shadowTopY1} x2={centerX} y2={shadowTopY2} stroke={stroke} strokeWidth={1.5} />}
            <rect x={x + 3} y={bodyTop} width={W - 6} height={bodyH} fill={fill} rx={1} />
            {c.shadowBot > 0 && <line x1={centerX} y1={shadowBotY1} x2={centerX} y2={shadowBotY2} stroke={stroke} strokeWidth={1.5} />}
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

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case 'intro':
            return (
                <div className="space-y-4">
                    {(block.content as string).split('\n\n').map((para, i) => para.trim() && (
                        <p key={i} className="text-slate-600 text-base leading-relaxed">{para.trim()}</p>
                    ))}
                </div>
            )

        case 'key-insight':
            return (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <p className="text-emerald-700 font-bold text-sm mb-2">{block.title}</p>
                    <p className="text-emerald-900 font-semibold leading-relaxed">{block.content as string}</p>
                </div>
            )

        case 'concept':
            return (
                <div>
                    <h3 className="text-slate-800 font-bold text-lg mb-3">{block.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-justify">{block.content as string}</p>
                </div>
            )

        case 'quote':
            return (
                <div className="bg-slate-800 rounded-2xl p-6 my-2">
                    <Quote className="w-6 h-6 text-emerald-400 mb-3" />
                    <p className="text-white text-lg font-medium italic leading-relaxed mb-4">
                        {block.content as string}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-px h-8 bg-emerald-400" />
                        <div>
                            <p className="text-emerald-400 font-bold text-sm">{block.author}</p>
                            <p className="text-slate-400 text-xs">{block.source}</p>
                        </div>
                    </div>
                </div>
            )

        case 'checklist':
            return (
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-slate-800 font-bold text-sm mb-4">{block.title}</h3>
                    <div className="space-y-2.5">
                        {(block.content as string[]).map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0 mt-0.5">
                                    {i + 1}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'warning':
            return (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h3 className="text-amber-700 font-bold text-sm mb-2">{block.title}</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">{block.content as string}</p>
                </div>
            )

        case 'summary':
            return (
                <div className="bg-teal-900 rounded-2xl p-6 text-white">
                    <h3 className="font-bold text-teal-300 text-sm mb-4">{block.title}</h3>
                    <div className="space-y-2">
                        {(block.content as string[]).map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                <p className="text-teal-100 text-sm leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'steps':
            return (
                <div>
                    {block.title && (
                        <h3 className="text-slate-800 font-bold text-lg mb-5">{block.title}</h3>
                    )}
                    <div className="space-y-4">
                        {(block.items ?? []).map((item: ContentBlockItem, i: number) => (
                            <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow">
                                {/* Number badge */}
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
                                        {i + 1}
                                    </div>
                                    <span className="text-lg">{item.icon}</span>
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-bold text-slate-800 text-sm">{item.title}</span>
                                        {item.highlight && (
                                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                {item.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed italic">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'candle-patterns':
            return (
                <div>
                    {block.title && <h3 className="text-slate-800 font-bold text-lg mb-4">{block.title}</h3>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(block.patterns ?? []).map((p: CandlePatternItem, i: number) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:shadow-sm transition-shadow">
                                {/* SVG candle chart */}
                                <div className="flex items-end justify-center h-[90px] gap-1">
                                    <CandleChart candles={p.candles} />
                                </div>
                                {/* Name */}
                                <p className="text-slate-800 font-bold text-xs text-center leading-tight">{p.name}</p>
                                {/* Signal badge */}
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${p.signal === 'bullish'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : p.signal === 'bearish'
                                            ? 'bg-red-50 text-red-700 border-red-200'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                    {p.signal === 'bullish' ? '↑ Tăng' : p.signal === 'bearish' ? '↓ Giảm' : '⇌ Lưỡng lự'}
                                </span>
                                {/* Short desc */}
                                <p className="text-slate-400 text-[10px] text-center leading-snug">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )

        default:
            return null
    }
}

export default function ArticlePage({ params }: { params: Promise<{ pillar: string; article: string }> }) {
    const { pillar: pillarSlug, article: articleSlug } = use(params)
    const pillar = getPillarBySlug(pillarSlug)
    const article = pillar ? getArticleBySlug(pillarSlug, articleSlug) : undefined

    if (!pillar || !article) notFound()

    // Prev/Next navigation
    const articleIndex = pillar.articles.findIndex(a => a.slug === articleSlug)
    const prevArticle = articleIndex > 0 ? pillar.articles[articleIndex - 1] : null
    const nextArticle = articleIndex < pillar.articles.length - 1 ? pillar.articles[articleIndex + 1] : null

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ── TOP BAR ── */}
            <div className={`${pillar.color} border-b ${pillar.borderColor}`}>
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-slate-400">
                    <Link href="/knowledgebase" className="hover:text-slate-600 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Thư Viện
                    </Link>
                    <span>/</span>
                    <Link href={`/knowledgebase/${pillar.slug}`} className={`hover:${pillar.accentColor} transition-colors`}>
                        {pillar.title}
                    </Link>
                    <span>/</span>
                    <span className="text-slate-600 line-clamp-1 max-w-xs">{article.title}</span>
                </div>
            </div>

            {/* ── ARTICLE HEADER ── */}
            <section className={`${pillar.color}`}>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${DIFFICULTY_COLOR[article.difficulty]}`}>
                            {article.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" /> {article.readTime} phút đọc
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="text-base">{pillar.icon}</span>
                            <span className={pillar.accentColor + ' font-semibold'}>{pillar.title}</span>
                        </span>
                    </motion.div>

                    <motion.h1 {...fadeUp(0.08)} className="text-3xl lg:text-4xl font-black text-slate-800 leading-tight mb-4">
                        {article.title}
                    </motion.h1>

                    <motion.p {...fadeUp(0.12)} className="text-slate-500 text-base leading-relaxed mb-6 max-w-2xl">
                        {article.summary}
                    </motion.p>

                    {/* Tags */}
                    <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 text-xs text-slate-400 bg-white/70 border border-slate-200 px-2.5 py-1 rounded-full">
                                <Tag className="w-2.5 h-2.5" /> {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* References */}
                    {article.references && (
                        <motion.div {...fadeUp(0.18)} className="mt-4 flex flex-wrap gap-2">
                            {article.references.map(ref => (
                                <span key={ref} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${pillar.color} ${pillar.accentColor} border ${pillar.borderColor}`}>
                                    <BookOpen className="w-3 h-3" /> {ref}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ── ARTICLE BODY ── */}
            <section className="bg-white">
                <HR />
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            {(getArticleContent(pillarSlug, articleSlug) ?? TEMPLATE_BLOCKS).map((block, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.06)}>
                                    <ContentBlockRenderer block={block} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">
                            {/* Progress in pillar */}
                            <motion.div {...fadeUp(0.1)} className={`${pillar.color} border ${pillar.borderColor} rounded-2xl p-5`}>
                                <p className={`text-xs font-bold uppercase tracking-widest ${pillar.accentColor} mb-3`}>
                                    Tiến Độ Trong Chủ Đề
                                </p>
                                <div className="space-y-2">
                                    {pillar.articles.map((a, i) => (
                                        <Link key={a.slug} href={`/knowledgebase/${pillar.slug}/${a.slug}`}
                                            className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 transition-colors ${a.slug === articleSlug
                                                ? `bg-white ${pillar.accentColor} font-bold shadow-sm`
                                                : 'text-slate-500 hover:bg-white/60'
                                                }`}>
                                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${a.slug === articleSlug ? pillar.color + ' ' + pillar.accentColor : 'bg-slate-100 text-slate-400'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="line-clamp-1">{a.title.split('—')[0].split(':')[0].trim()}</span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Reading time estimate */}
                            <motion.div {...fadeUp(0.15)} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Thống Kê Bài</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Thời gian đọc</span>
                                        <span className="font-semibold text-slate-700">{article.readTime} phút</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Độ khó</span>
                                        <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[article.difficulty]}`}>
                                            {article.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Chủ đề</span>
                                        <span className="font-semibold text-slate-700">{pillar.title}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ── PREV / NEXT NAV ── */}
            <section className="bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 gap-4">
                        {prevArticle ? (
                            <motion.div {...fadeUp()}>
                                <Link href={`/knowledgebase/${pillar.slug}/${prevArticle.slug}`}
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow group block">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                        <ChevronLeft className="w-3 h-3" /> Bài trước
                                    </div>
                                    <p className="text-slate-700 font-semibold text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                                        {prevArticle.title}
                                    </p>
                                </Link>
                            </motion.div>
                        ) : <div />}

                        {nextArticle ? (
                            <motion.div {...fadeUp(0.05)}>
                                <Link href={`/knowledgebase/${pillar.slug}/${nextArticle.slug}`}
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow group text-right block">
                                    <div className="flex items-center justify-end gap-2 text-slate-400 text-xs mb-1">
                                        Bài tiếp <ChevronRight className="w-3 h-3" />
                                    </div>
                                    <p className="text-slate-700 font-semibold text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                                        {nextArticle.title}
                                    </p>
                                </Link>
                            </motion.div>
                        ) : <div />}
                    </div>

                    {/* Back to pillar */}
                    <motion.div {...fadeUp(0.1)} className="mt-4 text-center">
                        <Link href={`/knowledgebase/${pillar.slug}`}
                            className={`inline-flex items-center gap-2 text-sm font-semibold ${pillar.accentColor} hover:underline`}>
                            <ArrowLeft className="w-3 h-3" /> Quay lại {pillar.title}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
