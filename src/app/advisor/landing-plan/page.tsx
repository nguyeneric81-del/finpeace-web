'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay }
})

// ── Thin horizontal rule — adapts to section bg
const HR = ({ dark = false }: { dark?: boolean }) => <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

const DISASTERS = [
    { icon: '😰', scenario: 'Mua xong thấy giảm 5% → hoảng loạn cắt lỗ', consequence: 'Bán đúng đáy, mã tăng tiếp' },
    { icon: '🤑', scenario: 'Lãi 10% rồi tham, không chốt lời', consequence: 'Mã đảo chiều, lãi thành lỗ' },
    { icon: '😤', scenario: 'Giữ mã lỗ vì "lỡ mua rồi"', consequence: 'Lỗ 30–50%, mất cơ hội mã khác' },
    { icon: '📱', scenario: 'Đọc group Telegram thấy hot → mua ngay', consequence: 'Mua đỉnh, bị bơm xả' },
]

// ── PATTERN A: 3-column cards (like slides 2, 4, 6)
const PLAN_CARDS = [
    { icon: ShieldCheck, tag: '01', title: 'Điểm Cắt Lỗ (SL)', desc: 'Bạn biết trước mức thua tối đa. Không hoảng loạn, không do dự — hành động theo kế hoạch đã lập sẵn.' },
    { icon: Target, tag: '02', title: 'Vùng Chốt Lời (TP)', desc: 'Mục tiêu giá rõ ràng. Không tham, không tiếc — lấy lợi nhuận đúng lúc khi thị trường đến đúng vùng.' },
    { icon: TrendingUp, tag: '03', title: 'Tỷ lệ R:R ≥ 1:2', desc: 'Chỉ cần thắng 40% lệnh là vẫn có lãi. Toán học và xác suất bảo vệ tài khoản của bạn dài hạn.' },
]

// ── PATTERN B: 2x2 numbered list (like slides 3, 5, 7)
const HOW_IT_WORKS = [
    { n: '01', title: 'Gửi danh mục cổ phiếu', desc: 'Upload danh sách mã bạn đang quan tâm hoặc đang hold. Không giới hạn số lượng.' },
    { n: '02', title: 'AI phân tích kỹ thuật', desc: 'Hệ thống phân tích chart, volume, momentum và rủi ro tổng thể danh mục.' },
    { n: '03', title: 'Nhận Trading Plan', desc: 'Plan chi tiết với Entry zone, Stop Loss, Take Profit và Risk:Reward ratio cho từng mã.' },
    { n: '04', title: 'Giao dịch theo kế hoạch', desc: 'Thực thi từng bước — biết chính xác làm gì dù thị trường tăng hay giảm.' },
]

const BOOK_CITATIONS = [
    { quote: '"Kẻ thù lớn nhất của nhà đầu tư không phải thị trường — mà là chính họ."', author: 'Benjamin Graham', book: 'The Intelligent Investor (1949)', icon: '📘' },
    { quote: '"80% nhà đầu tư cá nhân thua lỗ chủ yếu do không có điểm cắt lỗ rõ ràng."', author: 'Mark Douglas', book: 'Trading in the Zone (2000)', icon: '📗' },
    { quote: '"Bạn không cần nghĩ đúng nhiều lần. Bạn chỉ cần tránh những sai lầm nghiêm trọng."', author: 'Charlie Munger', book: "Poor Charlie's Almanack", icon: '📙' },
]

export default function LandingPlanPage() {
    const [activeDisaster, setActiveDisaster] = useState(0)

    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50/80">
                <HR />
                <div className="relative max-w-6xl mx-auto px-8 py-24">
                    {/* Split layout: text left + visual right */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left text */}
                        <div>
                            <motion.span {...fadeUp(0)}
                                className="inline-block bg-teal-100/80 text-teal-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-teal-200/60">
                                FinPeace Advisor Trading
                            </motion.span>
                            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6">
                                Mỗi lệnh đều có{' '}
                                <span className="text-teal-600">kế hoạch.</span>
                                <br />
                                <span className="text-amber-500">Không bao giờ</span>
                                <br />
                                bị bất ngờ.
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed mb-8">
                                85% nhà đầu tư thua lỗ vì không có kế hoạch trước khi vào lệnh.
                                FinPeace giải quyết đúng vấn đề đó.
                            </motion.p>
                            <motion.div {...fadeUp(0.3)} className="flex gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/advisor/register"
                                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg shadow-teal-200">
                                        Nhận Plan miễn phí <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                                <a href="#how"
                                    className="inline-flex items-center text-slate-500 hover:text-slate-700 border border-slate-200 bg-white/70 px-7 py-3.5 rounded-2xl transition-all text-sm font-medium">
                                    Xem cách hoạt động
                                </a>
                            </motion.div>
                        </div>
                        {/* Right: stat panel */}
                        <motion.div {...fadeUp(0.2)} className="relative">
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 shadow-sm">
                                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-5">Dữ liệu từ nghiên cứu</p>
                                <div className="space-y-5">
                                    {[
                                        { val: '85%', label: 'nhà đầu tư cá nhân thua lỗ', src: 'DALBAR Inc. 2023' },
                                        { val: '3×', label: 'nỗi đau thua lỗ so với niềm vui thắng', src: 'Kahneman & Tversky' },
                                        { val: '40%', label: 'tỷ lệ thắng tối thiểu với R:R = 1:2', src: 'Van K. Tharp' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <p className="text-3xl font-black text-teal-600 w-20 shrink-0">{s.val}</p>
                                            <div>
                                                <p className="text-slate-700 text-sm font-medium">{s.label}</p>
                                                <p className="text-slate-400 text-xs italic mt-0.5">{s.src}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ PATTERN B: 2x2 grid (Bẫy không có kế hoạch) — DARK ══ */}
            <section className="bg-slate-800">
                <HR dark />
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: big title + 2x2 items */}
                        <div>
                            <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-3 leading-tight">
                                Kịch bản nào<br />quen với bạn?
                            </motion.h2>
                            <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm mb-10">
                                Chọn một kịch bản để xem điều gì thường xảy ra sau đó
                            </motion.p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {DISASTERS.map((d, i) => (
                                    <motion.button key={i} onClick={() => setActiveDisaster(i)}
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeDisaster === i
                                            ? 'bg-amber-500 text-white border-amber-400'
                                            : 'bg-white/10 text-slate-300 border-white/20 hover:border-amber-400'}`}>
                                        {d.icon} Kịch bản {i + 1}
                                    </motion.button>
                                ))}
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={activeDisaster}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-amber-500/10 border border-amber-400/30 rounded-3xl p-6">
                                    <p className="text-slate-200 font-medium mb-3">{DISASTERS[activeDisaster].scenario}</p>
                                    <div className="bg-white/10 border border-amber-300/40 rounded-2xl px-4 py-2.5">
                                        <p className="text-amber-400 font-bold text-sm">→ {DISASTERS[activeDisaster].consequence}</p>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-3 italic">Nguyên nhân: không có kế hoạch trước khi vào lệnh.</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        {/* Right: numbered list (01→04) */}
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { n: '01', title: 'Mua không có Entry plan', desc: 'Không biết đúng điểm vào, thường mua theo cảm xúc hoặc nghe tin.' },
                                { n: '02', title: 'Không có Stop Loss', desc: 'Không biết khi nào cần thoát — giữ mãi chờ hòa vốn dù mã tiếp tục giảm.' },
                                { n: '03', title: 'Không có Take Profit', desc: 'Không chốt lời đúng lúc, tham vọng "hold đến ngàn" khiến lãi thành lỗ.' },
                                { n: '04', title: 'Hành động theo cảm xúc', desc: 'FOMO, hoảng loạn, tham lam thay thế tư duy logic — kết quả không thể đoán trước.' },
                            ].map((item, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.08)}
                                    className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <div className="w-10 h-10 bg-teal-400/20 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="text-teal-300 font-black text-sm">{item.n}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                                        <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <HR dark />
            </section>

            {/* ══ PATTERN A: 3-column cards — LIGHT ══ */}
            <section className="bg-white">
                <HR />
                <div className="max-w-6xl mx-auto px-8 py-20 text-center">
                    <motion.h2 {...fadeUp()} className="text-4xl font-black text-slate-800 mb-3">Trading Plan của FinPeace làm gì?</motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm mb-12 max-w-lg mx-auto">
                        Mỗi plan là hợp đồng bạn ký với chính mình — trước khi tiền vào thị trường.
                    </motion.p>
                    <div className="grid md:grid-cols-3 gap-5 text-left">
                        {PLAN_CARDS.map((card, i) => {
                            const Icon = card.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Card header (white elevated, like slide title pill) */}
                                    <div className="bg-teal-50 border-b border-teal-100 px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <span className="text-teal-600 font-black text-xs">{card.tag}</span>
                                        </div>
                                        <h3 className="font-bold text-teal-700 text-sm">{card.title}</h3>
                                    </div>
                                    {/* Card body */}
                                    <div className="px-6 py-5">
                                        <Icon className="w-8 h-8 text-teal-400 mb-3 opacity-60" />
                                        <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ PATTERN B: 2x2 numbered + right panel — DARK ══ */}
            <section id="how" className="bg-teal-900">
                <HR dark />
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-2 leading-tight">
                                Quy trình<br />4 bước đơn giản
                            </motion.h2>
                            <motion.p {...fadeUp(0.1)} className="text-teal-300/70 text-sm mb-10">
                                Từ danh mục của bạn đến Trading Plan chi tiết — nhanh chóng và rõ ràng.
                            </motion.p>
                            <div className="grid grid-cols-1 gap-4">
                                {HOW_IT_WORKS.map((item, i) => (
                                    <motion.div key={i} {...fadeUp(i * 0.08)}
                                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="text-teal-900 font-black text-xs">{item.n}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                                            <p className="text-teal-300/70 text-xs leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        {/* Right: citations panel */}
                        <div className="space-y-4">
                            <motion.p {...fadeUp()} className="text-teal-400/60 text-xs uppercase tracking-widest font-bold mb-4">Khoa học đứng sau</motion.p>
                            {BOOK_CITATIONS.map((c, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.1)}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
                                    <span className="text-2xl shrink-0">{c.icon}</span>
                                    <div>
                                        <p className="text-teal-100/80 italic text-sm leading-relaxed mb-2">{c.quote}</p>
                                        <p className="text-teal-400 font-bold text-xs">— {c.author}</p>
                                        <p className="text-teal-500/60 text-xs">{c.book}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div {...fadeUp(0.3)} className="bg-teal-400/20 border border-teal-400/30 rounded-2xl p-5 text-center">
                                <p className="text-4xl font-black text-teal-300 mb-1">85%</p>
                                <p className="text-white/80 text-sm">nhà đầu tư cá nhân thua lỗ liên tục</p>
                                <p className="text-teal-400/60 text-xs italic mt-1">DALBAR Inc. 2023</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <HR dark />
            </section>

            {/* ══ CTA ══ */}
            <section className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-center">
                <HR />
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <motion.div {...fadeUp()}>
                        <h2 className="text-4xl font-black mb-4">Sẵn sàng giao dịch có kế hoạch?</h2>
                        <p className="text-teal-100 mb-8">Upload danh mục — AI phân tích — nhận Trading Plan riêng cho bạn.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-10 py-4 rounded-2xl hover:bg-teal-50 transition-colors text-lg shadow-xl shadow-teal-800/20">
                                Nhận Trading Plan miễn phí <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-teal-200/70 text-sm mt-4">Miễn phí · Không cần thẻ tín dụng</p>
                    </motion.div>
                </div>
                <HR />
            </section>
        </div>
    )
}
