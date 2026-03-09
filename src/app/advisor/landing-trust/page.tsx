'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Eye, ShieldAlert, Users } from 'lucide-react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay }
})

const HR = ({ dark = false }: { dark?: boolean }) => <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

// Pattern A: 3-column cards
const TRUST_CARDS = [
    { tag: '01', icon: Eye, title: 'Phân tích độc lập', desc: 'FinPeace phân tích chart, volume, momentum thuần túy kỹ thuật — không có lợi ích từ việc bạn mua hay bán.' },
    { tag: '02', icon: ShieldAlert, title: 'Không xung đột lợi ích', desc: 'Không sở hữu cổ phiếu, không nhận hoa hồng CTCK. Doanh thu duy nhất: phí dịch vụ từ khách hàng.' },
    { tag: '03', icon: Users, title: 'Trách nhiệm giải trình', desc: 'Mỗi plan có tên phân tích viên chịu trách nhiệm. Kết quả được tracking và công bố công khai.' },
]

// Pattern B: 2x2 numbered (anatomy of pump)
const PUMP_ANATOMY = [
    { n: '01', title: 'Admin mua trước', desc: 'Tích lũy cổ phiếu ở vùng thấp 14-15, trước khi đăng thông tin lên nhóm.', neutral: true },
    { n: '02', title: 'Đăng tin lên nhóm', desc: '50K thành viên đồng loạt mua, giá tăng mạnh — admin đang chờ đợt này.', neutral: true },
    { n: '03', title: 'Admin chốt lời', desc: 'Xả toàn bộ vị thế khi ra đám đông mới đang hold — giá bắt đầu đảo chiều.', neutral: false },
    { n: '04', title: 'Nhà đầu tư ôm lỗ', desc: 'Mã đảo chiều sắc không có đợt xả tiếp — người mua theo bị kẹt không lối thoát.', neutral: false },
]

const BOOK_CITATIONS = [
    { quote: '"Đừng bao giờ hỏi thợ cạo xem bạn có cần cắt tóc không. Đừng hỏi người hưởng lợi từ việc bạn mua cổ phiếu xem đó có phải cổ phiếu tốt không."', author: 'Warren Buffett', book: 'Berkshire Hathaway Annual Letter (1996)', icon: '📙' },
    { quote: '"Trên thị trường tài chính, xung đột lợi ích nguy hiểm hơn biến động thị trường — nhưng ít ai nhận ra."', author: 'John C. Bogle', book: 'The Little Book of Common Sense Investing (2007)', icon: '📘' },
    { quote: '"Nhà phân tích độc lập dự báo chính xác hơn 40% so với nhà phân tích ngân hàng đầu tư."', author: 'Baruch Lev & Feng Gu', book: 'The End of Accounting (Princeton University Press)', icon: '📗' },
]

const RED_FLAGS = [
    '"Cổ phiếu X sắp tăng 30% — mua ngay!"',
    '"Insider cho biết mã Y sẽ chạy mạnh tuần này"',
    '"Đừng bỏ lỡ — cơ hội vàng chỉ còn 24h"',
    '"Fanpage 100K follow đồng loạt đăng strong buy"',
]

export default function LandingTrustPage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ══ HERO: split layout ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50">
                <HR />
                <div className="max-w-6xl mx-auto px-8 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <motion.span {...fadeUp(0)}
                                className="inline-block bg-sky-100/80 text-sky-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-sky-200/60">
                                Minh Bạch & Độc Lập
                            </motion.span>
                            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6">
                                FinPeace<br />
                                <span className="text-amber-500">không bơm</span><br />
                                cổ phiếu.
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed mb-8">
                                Hàng nghìn group "phân tích" trên mạng — làm sao bạn biết ai thực sự đứng về phía bạn?
                            </motion.p>
                            <motion.div {...fadeUp(0.3)} className="flex gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/advisor/register"
                                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg shadow-teal-200">
                                        Nhận Plan độc lập <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                                <a href="#anatomy"
                                    className="inline-flex items-center text-slate-500 hover:text-slate-700 border border-slate-200 bg-white/70 px-7 py-3.5 rounded-2xl transition-all text-sm font-medium">
                                    Bơm xả hoạt động thế nào?
                                </a>
                            </motion.div>
                        </div>
                        {/* Right: red flag panel */}
                        <motion.div {...fadeUp(0.2)}>
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-7 shadow-sm">
                                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-5 flex items-center gap-2">
                                    <span className="text-red-400">🚩</span> Dấu hiệu bơm xả điển hình
                                </p>
                                <div className="space-y-3">
                                    {RED_FLAGS.map((flag, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                                            <span className="text-amber-500 shrink-0 text-sm">🚩</span>
                                            <p className="text-slate-600 text-sm italic">{flag}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-amber-600 text-xs font-semibold mt-4 text-center">
                                    → Đây là những câu bạn nghe TRƯỚC khi bị xả hàng
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ PATTERN B: Anatomy of pump — DARK ══ */}
            <section id="anatomy" className="bg-slate-900">
                <HR dark />
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: big title */}
                        <div>
                            <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-2 leading-tight">
                                Giải phẫu một vụ<br />bơm xả điển hình
                            </motion.h2>
                            <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm italic mb-10">
                                "Nhóm Telegram 50K thành viên: mua VND vào 17.5, mục tiêu 22"
                            </motion.p>
                            {/* Timeline */}
                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-white/20 rounded-full" />
                                <div className="space-y-5">
                                    {PUMP_ANATOMY.map((item, i) => (
                                        <motion.div key={i} {...fadeUp(i * 0.1)} className="flex gap-4 items-start">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs
                                                ${item.neutral ? 'bg-white/10 text-slate-300' : 'bg-amber-500/30 text-amber-400'}`}>
                                                {item.n}
                                            </div>
                                            <div className={`flex-1 rounded-2xl p-4 ${item.neutral ? 'bg-white/5 border border-white/10' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                                <p className={`font-bold text-sm mb-1 ${item.neutral ? 'text-slate-200' : 'text-amber-400'}`}>{item.title}</p>
                                                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                                                {i === 3 && <p className="text-amber-400 text-xs italic mt-2">← Nhà đầu tư bình thường chỉ biết đến đây</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right: citations + stat */}
                        <div className="space-y-4">
                            <motion.p {...fadeUp()} className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-4">Nghiên cứu &amp; chuyên gia</motion.p>
                            {BOOK_CITATIONS.map((c, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.1)}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
                                    <span className="text-2xl shrink-0">{c.icon}</span>
                                    <div>
                                        <p className="text-slate-300 italic text-sm leading-relaxed mb-2">{c.quote}</p>
                                        <p className="text-teal-400 font-bold text-xs">— {c.author}</p>
                                        <p className="text-slate-500 text-xs">{c.book}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <HR dark />
            </section>

            {/* ══ PATTERN A: 3-column cards (FinPeace khác gì) — LIGHT ══ */}
            <section className="bg-white">
                <HR />
                <div className="max-w-6xl mx-auto px-8 py-20 text-center">
                    <motion.h2 {...fadeUp()} className="text-4xl font-black text-slate-800 mb-3">FinPeace khác ở điểm nào?</motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm mb-12 max-w-lg mx-auto">
                        Mô hình kinh doanh của chúng tôi không phụ thuộc vào việc bạn mua hay bán bất kỳ mã nào.
                    </motion.p>
                    <div className="grid md:grid-cols-3 gap-5 text-left">
                        {TRUST_CARDS.map((card, i) => {
                            const Icon = card.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-teal-50 border-b border-teal-100 px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <span className="text-teal-600 font-black text-xs">{card.tag}</span>
                                        </div>
                                        <h3 className="font-bold text-teal-700 text-sm">{card.title}</h3>
                                    </div>
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

            {/* ══ CTA ══ */}
            <section className="bg-gradient-to-br from-teal-600 to-sky-600 text-white text-center">
                <HR />
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <motion.div {...fadeUp()}>
                        <h2 className="text-4xl font-black mb-4">Giao dịch với người bạn có thể tin</h2>
                        <p className="text-teal-100 mb-8">Trading Plan của FinPeace được xây dựng vì lợi ích của bạn — không có gì khác.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-10 py-4 rounded-2xl hover:bg-teal-50 transition-colors text-lg shadow-xl shadow-teal-800/20">
                                Đăng ký nhận Plan miễn phí <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-teal-200/70 text-sm mt-4">Miễn phí · Không cam kết dài hạn</p>
                    </motion.div>
                </div>
                <HR />
            </section>
        </div>
    )
}
