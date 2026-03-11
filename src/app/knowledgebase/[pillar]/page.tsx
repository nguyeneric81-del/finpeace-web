'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react'
import { getPillarBySlug, PILLARS, type Pillar } from '../data'
import { notFound } from 'next/navigation'
import { use } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
})

const HR = ({ dark = false }: { dark?: boolean }) =>
    <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

const DIFFICULTY_COLOR: Record<string, string> = {
    'Cơ bản': 'bg-emerald-100 text-emerald-700',
    'Trung cấp': 'bg-amber-100 text-amber-700',
    'Nâng cao': 'bg-rose-100 text-rose-700',
}

function RelatedPillars({ currentSlug }: { currentSlug: string }) {
    const related = PILLARS.filter(p => p.slug !== currentSlug).slice(0, 3)
    return (
        <div className="grid md:grid-cols-3 gap-4">
            {related.map((p, i) => (
                <motion.div key={p.id} {...fadeUp(i * 0.08)}>
                    <Link href={`/knowledgebase/${p.slug}`}
                        className={`block h-full bg-white border ${p.borderColor} rounded-2xl p-5 hover:shadow-md transition-shadow group`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{p.icon}</span>
                            <span className={`text-xs font-bold ${p.accentColor}`}>{p.title}</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{p.description}</p>
                        <p className={`text-xs font-semibold ${p.accentColor} mt-3 flex items-center gap-1`}>
                            {p.articleCount} bài <ArrowRight className="w-3 h-3" />
                        </p>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

export default function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
    const { pillar: pillarSlug } = use(params)
    const pillar = getPillarBySlug(pillarSlug)

    if (!pillar) notFound()

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ── HERO ── */}
            <section className={`relative overflow-hidden ${pillar.color}`}>
                <HR />
                <div className="max-w-5xl mx-auto px-6 py-16">
                    {/* Breadcrumb */}
                    <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                        <Link href="/knowledgebase" className="hover:text-slate-600 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Thư Viện
                        </Link>
                        <span>/</span>
                        <span className={pillar.accentColor}>{pillar.title}</span>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.div {...fadeUp(0.05)} className="flex items-center gap-3 mb-4">
                                <div className={`w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                                    {pillar.icon}
                                </div>
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${pillar.accentColor} opacity-70`}>
                                        Level {pillar.level}
                                    </p>
                                    <p className="text-slate-400 text-xs">{pillar.subtitle}</p>
                                </div>
                            </motion.div>

                            <motion.h1 {...fadeUp(0.1)} className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight mb-4">
                                {pillar.title}
                            </motion.h1>

                            <motion.p {...fadeUp(0.15)} className="text-slate-600 leading-relaxed mb-6">
                                {pillar.description}
                            </motion.p>

                            <motion.div {...fadeUp(0.2)} className="flex items-center gap-4">
                                <div className={`flex items-center gap-1.5 ${pillar.accentColor}`}>
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{pillar.articleCount} bài học</span>
                                </div>
                                <div className="w-px h-4 bg-slate-300" />
                                <span className="text-slate-400 text-sm">Đọc từ đầu đến cuối</span>
                            </motion.div>
                        </div>

                        {/* Stats panel */}
                        <motion.div {...fadeUp(0.2)}>
                            <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm">
                                <p className={`text-xs font-bold uppercase tracking-widest ${pillar.accentColor} mb-4`}>
                                    Bạn sẽ học được
                                </p>
                                <div className="space-y-3">
                                    {pillar.articles.slice(0, 3).map((article, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${pillar.color} ${pillar.accentColor}`}>
                                                {i + 1}
                                            </div>
                                            <p className="text-slate-700 text-sm leading-snug">{article.title}</p>
                                        </div>
                                    ))}
                                    {pillar.articles.length > 3 && (
                                        <p className={`text-xs ${pillar.accentColor} ml-8`}>
                                            +{pillar.articles.length - 3} bài học nữa...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ── ARTICLE LIST ── */}
            <section className="bg-white">
                <HR />
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <motion.h2 {...fadeUp()} className="text-2xl font-black text-slate-800 mb-8">
                        Danh Sách Bài Học
                    </motion.h2>

                    <div className="space-y-4">
                        {pillar.articles.map((article, i) => (
                            <motion.div key={article.slug} {...fadeUp(i * 0.05)} whileHover={{ x: 4 }}>
                                <Link href={`/knowledgebase/${pillar.slug}/${article.slug}`}>
                                    <div className={`bg-white border ${pillar.borderColor} hover:border-${pillar.accentColor.replace('text-', '')} rounded-2xl p-5 hover:shadow-md transition-all group`}>
                                        <div className="flex items-start gap-4">
                                            {/* Number */}
                                            <div className={`w-8 h-8 rounded-xl ${pillar.color} ${pillar.accentColor} flex items-center justify-center font-black text-sm shrink-0`}>
                                                {String(i + 1).padStart(2, '0')}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-3">
                                                    {article.summary}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${DIFFICULTY_COLOR[article.difficulty]}`}>
                                                        {article.difficulty}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Clock className="w-3 h-3" /> {article.readTime} phút
                                                    </span>
                                                    {article.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className="flex items-center gap-0.5 text-xs text-slate-400">
                                                            <Tag className="w-2.5 h-2.5" /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <ArrowRight className={`w-4 h-4 ${pillar.accentColor} opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1`} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <HR />
            </section>

            {/* ── RELATED ── */}
            <section className="bg-neutral-50">
                <HR />
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <motion.h2 {...fadeUp()} className="text-xl font-black text-slate-700 mb-6">
                        Chủ Đề Liên Quan
                    </motion.h2>
                    <RelatedPillars currentSlug={pillar.slug} />
                </div>
                <HR />
            </section>
        </div>
    )
}
