'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay }
})

const DISASTERS = [
    { icon: '😰', scenario: 'Mua xong thấy giảm 5% → hoảng loạn cắt lỗ', consequence: 'Bán đúng đáy, mã tăng tiếp' },
    { icon: '🤑', scenario: 'Lãi 10% rồi tham, không chốt lời', consequence: 'Mã đảo chiều, lãi thành lỗ' },
    { icon: '😤', scenario: 'Giữ mã lỗ vì "lỡ mua rồi"', consequence: 'Lỗ 30–50%, mất cơ hội mã khác' },
    { icon: '📱', scenario: 'Đọc group Telegram thấy hot → mua ngay', consequence: 'Mua đỉnh, bị bơm xả' },
]

const PLAN_PARTS = [
    { icon: ShieldCheck, title: 'Điểm Cắt Lỗ (SL)', desc: 'Bạn biết trước mức thua tối đa. Không hoảng loạn, không do dự.', color: 'teal' },
    { icon: Target, title: 'Vùng Chốt Lời (TP)', desc: 'Mục tiêu giá rõ ràng. Không tham, không tiếc — lấy lợi nhuận đúng lúc.', color: 'emerald' },
    { icon: TrendingUp, title: 'Tỷ lệ R:R ≥ 1:2', desc: 'Chỉ cần thắng 40% lệnh là vẫn có lãi — toán học bảo vệ bạn.', color: 'cyan' },
]

const BOOK_CITATIONS = [
    { quote: '"Kẻ thù lớn nhất của nhà đầu tư không phải thị trường — mà là chính họ."', book: 'Benjamin Graham', title: 'The Intelligent Investor (1949)', icon: '📘' },
    { quote: '"Bạn không cần nghĩ đúng nhiều lần. Bạn chỉ cần tránh những sai lầm nghiêm trọng."', book: 'Charlie Munger', title: "Poor Charlie's Almanack", icon: '📙' },
    { quote: '"80% nhà đầu tư cá nhân thua lỗ chủ yếu do không có điểm cắt lỗ rõ ràng."', book: 'Mark Douglas', title: 'Trading in the Zone (2000)', icon: '📗' },
]

const [ACTIVE_DISASTER, SET_ACTIVE_DISASTER] = [0, () => { }] // stub for static

export default function LandingPlanPage() {
    const [activeDisaster, setActiveDisaster] = useState(0)

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
                {/* decorative blobs */}
                <div className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-teal-100/60 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full bg-emerald-100/50 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-teal-100/80 backdrop-blur-sm text-teal-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-teal-200/60">
                            FinPeace Advisor Trading
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
                        Mỗi lệnh đều có{' '}
                        <span className="text-teal-600">kế hoạch.</span>
                        <br />
                        Không bao giờ bị {' '}
                        <span className="text-amber-500">bất ngờ.</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-500 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Bạn đang giao dịch mà không biết mình sẽ làm gì khi mã giảm 7%?
                        Đó là lý do 85% nhà đầu tư cá nhân thua lỗ.
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-teal-200">
                                Nhận Trading Plan miễn phí <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <a href="#proof"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl transition-all">
                            Xem dẫn chứng khoa học
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── STAT BANNER ── */}
            <section className="bg-teal-600 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="flex flex-wrap justify-center gap-12 text-white text-center">
                        {[
                            { value: '85%', label: 'nhà đầu tư cá nhân thua lỗ', src: 'DALBAR 2023' },
                            { value: '3×', label: 'cảm giác đau của thua so với lời', src: 'Kahneman & Tversky' },
                            { value: '40%', label: 'thắng tối thiểu với R:R = 1:2', src: 'Van K. Tharp' },
                        ].map((s, i) => (
                            <div key={i}>
                                <p className="text-4xl font-black text-teal-100">{s.value}</p>
                                <p className="text-teal-200 text-sm mt-1">{s.label}</p>
                                <p className="text-teal-300/70 text-xs italic mt-0.5">{s.src}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── PROBLEMS (interactive tabs) ── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kịch bản nào quen với bạn?</h2>
                        <p className="text-slate-400 text-sm">Chọn một kịch bản để xem điều gì thường xảy ra sau đó</p>
                    </motion.div>

                    {/* Tab buttons */}
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        {DISASTERS.map((d, i) => (
                            <motion.button key={i} onClick={() => setActiveDisaster(i)}
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${activeDisaster === i
                                    ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-200'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'}`}>
                                {d.icon} Kịch bản {i + 1}
                            </motion.button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                        <motion.div key={activeDisaster}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35 }}
                            className="bg-amber-50/80 backdrop-blur-sm border border-amber-100 rounded-3xl p-8 max-w-xl mx-auto text-center">
                            <div className="text-5xl mb-4">{DISASTERS[activeDisaster].icon}</div>
                            <p className="text-slate-700 font-semibold text-lg mb-3">{DISASTERS[activeDisaster].scenario}</p>
                            <div className="bg-white/80 border border-amber-200 rounded-2xl px-5 py-3">
                                <p className="text-amber-700 font-bold">→ {DISASTERS[activeDisaster].consequence}</p>
                            </div>
                            <p className="text-slate-400 text-xs mt-4 italic">Nguyên nhân: không có kế hoạch trước khi vào lệnh.</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* ── SOLUTION ── */}
            <section className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Trading Plan của FinPeace làm gì?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-sm">Mỗi plan là hợp đồng bạn ký với chính mình — TRƯỚC khi tiền của bạn vào thị trường.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {PLAN_PARTS.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                    className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-5">
                                        <Icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── BOOK CITATIONS ── */}
            <section id="proof" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <BookOpen className="w-7 h-7 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Khoa học đứng sau Trading Plan</h2>
                        <p className="text-slate-400 text-sm">Không phải lý thuyết — đây là những gì các huyền thoại đầu tư đã chứng minh.</p>
                    </motion.div>
                    <div className="space-y-4">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 flex gap-5">
                                <span className="text-3xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-700 text-base italic leading-relaxed mb-2">{c.quote}</p>
                                    <p className="text-teal-700 font-bold text-sm">— {c.book}</p>
                                    <p className="text-slate-400 text-xs">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div {...fadeUp(0.4)}
                        className="mt-8 bg-teal-50/80 backdrop-blur-sm border border-teal-100 rounded-3xl p-8 text-center">
                        <p className="text-5xl font-black text-teal-600 mb-2">85%</p>
                        <p className="text-slate-600 font-medium">nhà đầu tư cá nhân thua lỗ liên tục</p>
                        <p className="text-slate-400 text-xs mt-2 italic">DALBAR Inc. — Quantitative Analysis of Investor Behavior (2023)</p>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <CheckCircle2 className="w-14 h-14 text-teal-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">Sẵn sàng giao dịch có kế hoạch?</h2>
                        <p className="text-teal-100 mb-8 text-base">Upload danh mục — AI phân tích — FinPeace gửi Trading Plan riêng cho bạn.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-10 py-4 rounded-2xl hover:bg-teal-50 transition-colors text-lg shadow-xl shadow-teal-800/20">
                                Nhận Trading Plan của tôi <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-teal-200/70 text-sm mt-4">Miễn phí · Không cần thẻ tín dụng</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
