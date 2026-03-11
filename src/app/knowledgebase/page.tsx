'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronRight, Search, Star } from 'lucide-react'
import { PILLARS, TRACKS, getPillarsByTrack, type Track } from './data'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay },
})

const HR = ({ dark = false }: { dark?: boolean }) =>
    <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

const LEVEL_LABELS: Record<number, string> = { 1: 'Nền Tảng', 2: 'Chuyên Sâu', 3: 'Thực Chiến' }

// Stat mini cards for hero
const STATS = [
    { val: '10', label: 'Chủ đề kiến thức', icon: '📚' },
    { val: '60+', label: 'Bài học chuyên sâu', icon: '✍️' },
    { val: '6', label: 'Tác giả kinh điển', icon: '🏆' },
    { val: '3', label: 'Cấp độ học tập', icon: '🎯' },
]

function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
    return (
        <motion.div
            {...fadeUp(index * 0.07)}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
        >
            <Link href={`/knowledgebase/${pillar.slug}`}>
                <div className={`h-full bg-white border ${pillar.borderColor} rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}>
                    {/* Card header */}
                    <div className={`${pillar.color} border-b ${pillar.borderColor} px-6 py-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                                {pillar.icon}
                            </div>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-widest ${pillar.accentColor} opacity-70`}>
                                    Level {pillar.level} · {LEVEL_LABELS[pillar.level]}
                                </p>
                                <h3 className={`font-bold ${pillar.accentColor} text-sm`}>{pillar.title}</h3>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${pillar.accentColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">{pillar.description}</p>

                        {/* Article previews */}
                        <div className="space-y-2 mb-4">
                            {pillar.articles.slice(0, 2).map((article) => (
                                <div key={article.slug} className="flex items-start gap-2">
                                    <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${pillar.accentColor.replace('text-', 'bg-')}`} />
                                    <p className="text-slate-600 text-xs leading-relaxed">{article.title}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-400">{pillar.articleCount} bài học</span>
                            <span className={`text-xs font-semibold ${pillar.accentColor} flex items-center gap-1`}>
                                Xem tất cả <ArrowRight className="w-3 h-3" />
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

    return (
        <div className="mb-16">
            <motion.div {...fadeUp()} className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-white rounded-2xl shadow-sm flex items-center justify-center text-base">
                    {meta.icon}
                </div>
                <div>
                    <h2 className={`font-black text-xl ${meta.color}`}>{meta.label}</h2>
                    <p className="text-slate-400 text-xs">{meta.sublabel}</p>
                </div>
                <div className={`ml-2 h-px flex-1 bg-slate-200`} />
            </motion.div>
            <div className={`grid gap-5 ${pillars.length === 1 ? 'md:grid-cols-1 max-w-md' : pillars.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {pillars.map((pillar, i) => (
                    <PillarCard key={pillar.id} pillar={pillar} index={i} />
                ))}
            </div>
        </div>
    )
}

export default function KnowledgebasePage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50/70">
                <HR />
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <motion.span {...fadeUp(0)}
                                className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-emerald-200/60">
                                <BookOpen className="w-3.5 h-3.5" />
                                Thư Viện Kiến Thức FinPeace
                            </motion.span>

                            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-5">
                                Từ <span className="text-emerald-600">nền tảng</span><br />
                                đến <span className="text-teal-600">thực chiến.</span>
                            </motion.h1>

                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed mb-8">
                                Kho tàng kiến thức từ Graham, Buffett, Fisher, Lynch, Darvas đến Turtle Traders —
                                được tổ chức theo lộ trình <strong className="text-slate-700">T-Shaped</strong> dành riêng cho nhà đầu tư Việt Nam.
                            </motion.p>

                            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
                                <Link href="#investor"
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-lg shadow-emerald-200 text-sm">
                                    Lộ trình Nhà Đầu Tư <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="#trader"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-6 py-3 rounded-2xl transition-colors text-sm">
                                    Lộ trình Nhà Giao Dịch
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Stats */}
                        <motion.div {...fadeUp(0.15)}>
                            <div className="grid grid-cols-2 gap-4">
                                {STATS.map((s, i) => (
                                    <motion.div key={i} whileHover={{ scale: 1.03 }}
                                        className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-sm">
                                        <p className="text-2xl mb-1">{s.icon}</p>
                                        <p className="text-3xl font-black text-slate-800">{s.val}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Teaser quote */}
                            <div className="mt-4 bg-emerald-600 rounded-2xl p-4 text-white">
                                <p className="text-sm italic leading-relaxed opacity-90">
                                    "Biết nhiều không quan trọng bằng biết đúng. Thị trường thưởng cho người có <strong>hệ thống</strong>, không phải người có <strong>thông tin</strong>."
                                </p>
                                <p className="text-emerald-200 text-xs mt-2">— Warren Buffett</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ T-SHAPE DIAGRAM ══ */}
            <section className="bg-slate-800">
                <HR dark />
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <motion.span {...fadeUp()}
                        className="inline-block bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-white/20">
                        Lộ Trình Học T-Shaped
                    </motion.span>
                    <motion.h2 {...fadeUp(0.1)} className="text-4xl font-black text-white mb-3">
                        Nền rộng → Chuyên sâu → Thực chiến
                    </motion.h2>
                    <motion.p {...fadeUp(0.15)} className="text-slate-400 text-sm mb-12 max-w-2xl mx-auto">
                        Học nền tảng chung trước — rồi chọn nhánh phù hợp với phong cách của bạn.
                        Không học nhảy cấp, không bị "tẩu hỏa nhập ma" giữa Đầu Tư và Giao Dịch.
                    </motion.p>

                    {/* T diagram */}
                    <motion.div {...fadeUp(0.2)} className="max-w-2xl mx-auto">
                        {/* Top bar (Foundation) */}
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-2 text-center">
                            <p className="text-emerald-300 font-bold text-sm">🏗️ Level 1 — Nền Tảng (Bắt buộc)</p>
                            <p className="text-white/70 text-xs mt-1">Tâm lý thị trường · Cơ chế hoạt động · Tư duy đúng về tiền</p>
                        </div>
                        {/* Stem */}
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1 bg-emerald-900/50 border border-emerald-700/50 rounded-2xl p-4 text-left">
                                <p className="text-emerald-300 font-bold text-xs">💼 Level 2A — Nhà Đầu Tư</p>
                                <p className="text-slate-400 text-xs mt-1">Phân tích cơ bản · Giá trị · Tăng trưởng</p>
                            </div>
                            <div className="flex-1 bg-blue-900/50 border border-blue-700/50 rounded-2xl p-4 text-left">
                                <p className="text-blue-300 font-bold text-xs">⚡ Level 2B — Nhà Giao Dịch</p>
                                <p className="text-slate-400 text-xs mt-1">Phân tích kỹ thuật · Xu hướng · Momentum</p>
                            </div>
                        </div>
                        {/* Mastery */}
                        <div className="bg-amber-900/40 border border-amber-700/40 rounded-2xl p-4 text-center">
                            <p className="text-amber-300 font-bold text-sm">🏆 Level 3 — Thực Chiến & Quản Trị Rủi Ro</p>
                            <p className="text-slate-400 text-xs mt-1">Portfolio · Risk Management · Kế hoạch cá nhân</p>
                        </div>
                    </motion.div>
                </div>
                <HR dark />
            </section>

            {/* ══ ALL PILLARS ══ */}
            <section className="bg-white">
                <HR />
                <div className="max-w-6xl mx-auto px-6 py-20">

                    {/* Foundation */}
                    <div id="foundation" className="mb-16">
                        <TrackSection track="foundation" />
                    </div>

                    {/* Investor */}
                    <div id="investor">
                        <TrackSection track="investor" />
                    </div>

                    {/* Trader */}
                    <div id="trader">
                        <TrackSection track="trader" />
                    </div>

                    {/* Mastery */}
                    <div id="mastery">
                        <TrackSection track="mastery" />
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ REFERENCE BOOKS DARK ══ */}
            <section className="bg-slate-900">
                <HR dark />
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-3">
                        Kiến Thức Được Chắt Lọc Từ Kinh Điển
                    </motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm mb-12">
                        Không phát minh lại bánh xe — chúng tôi tổ chức lại kiến thức đã được kiểm chứng từ những nhà đầu tư vĩ đại nhất.
                    </motion.p>
                    <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { title: 'The Intelligent Investor', author: 'Benjamin Graham', icon: '📘' },
                            { title: 'Common Stocks & Uncommon Profits', author: 'Philip Fisher', icon: '📗' },
                            { title: 'One Up On Wall Street', author: 'Peter Lynch', icon: '📙' },
                            { title: 'How I Made $2M in Stock Market', author: 'Nicolas Darvas', icon: '📕' },
                            { title: 'Way of the Turtle', author: 'Curtis Faith', icon: '📒' },
                            { title: 'Trading in the Zone', author: 'Mark Douglas', icon: '📓' },
                        ].map((book, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.04 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-3xl mb-2">{book.icon}</p>
                                <p className="text-white font-semibold text-xs leading-snug mb-1">{book.title}</p>
                                <p className="text-slate-400 text-xs">{book.author}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
                <HR dark />
            </section>

            {/* ══ CTA ══ */}
            <section className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-center">
                <HR />
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <motion.div {...fadeUp()}>
                        <Star className="w-10 h-10 text-emerald-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-4xl font-black mb-4">Bắt đầu từ nền tảng.</h2>
                        <p className="text-emerald-100 mb-8 leading-relaxed">
                            Dù bạn muốn đầu tư dài hạn hay giao dịch ngắn hạn —
                            hành trình đúng đắn đều bắt đầu từ tâm lý và tư duy đúng.
                        </p>
                        <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
                            <Link href="/knowledgebase/tam-ly-thi-truong"
                                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-colors text-lg shadow-xl shadow-emerald-800/20">
                                Bắt đầu từ Tâm Lý Thị Trường <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-emerald-200/70 text-sm mt-4">Miễn phí · Không cần đăng ký</p>
                    </motion.div>
                </div>
                <HR />
            </section>
        </div>
    )
}
