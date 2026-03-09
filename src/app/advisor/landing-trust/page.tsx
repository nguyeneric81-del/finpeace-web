'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldAlert, Eye, Users, CheckCircle2 } from 'lucide-react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay }
})

const PUMP_SIGNS = [
    "Cổ phiếu X sắp tăng 30% – mua ngay!",
    "Insider cho biết mã Y sẽ chạy mạnh tuần này",
    "Đừng bỏ lỡ – cơ hội vàng chỉ còn 24h",
    "Fanpage hàng trăm nghìn follow đồng loạt đăng \"strong buy\"",
]

const FINPEACE_DIFF = [
    { icon: Eye, title: 'Phân tích kỹ thuật độc lập', desc: 'Đội ngũ FinPeace phân tích chart, volume, momentum — không có lợi ích từ việc bạn mua hay bán bất kỳ mã nào.' },
    { icon: ShieldAlert, title: 'Không có lợi ích xung đột', desc: 'FinPeace không sở hữu cổ phiếu, không nhận hoa hồng từ CTCK. Doanh thu duy nhất: phí dịch vụ từ khách hàng.' },
    { icon: Users, title: 'Trách nhiệm giải trình', desc: 'Mỗi trading plan có tên phân tích viên chịu trách nhiệm. Kết quả được tracking và công bố định kỳ.' },
]

const BOOK_CITATIONS = [
    {
        quote: '"Trên thị trường tài chính, xung đột lợi ích là vũ khí nguy hiểm nhất mà nhà đầu tư cá nhân phải đối mặt — nguy hiểm hơn cả biến động thị trường."',
        book: 'John C. Bogle', title: 'The Little Book of Common Sense Investing (2007)', icon: '📘'
    },
    {
        quote: '"Đừng bao giờ hỏi thợ cạo xem bạn có cần cắt tóc không. Và đừng bao giờ hỏi người hưởng lợi từ việc bạn mua cổ phiếu xem đó có phải cổ phiếu tốt không."',
        book: 'Warren Buffett', title: 'Berkshire Hathaway Annual Letter (1996)', icon: '📙'
    },
    {
        quote: '"Nghiên cứu 17 năm: Các nhà phân tích độc lập dự báo chính xác hơn 40% so với nhà phân tích ngân hàng đầu tư."',
        book: 'Baruch Lev & Feng Gu', title: 'The End of Accounting (Princeton University Press, 2016)', icon: '📗'
    },
]

const PUMP_STEPS = [
    { step: 1, text: 'Admin mua trước ở vùng 14–15 từ tuần trước', neutral: true },
    { step: 2, text: 'Tin đăng lên group — 50K người đồng loạt mua, giá tăng mạnh', neutral: true },
    { step: 3, text: 'Admin chốt lời toàn bộ khi nhà đầu tư mới đang hold', neutral: false },
    { step: 4, text: 'Mã đảo chiều sắc — nhà đầu tư mới ôm lỗ, không có đợt xả lần 2', neutral: false },
]

export default function LandingTrustPage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50">
                <div className="pointer-events-none absolute -top-32 right-0 w-[480px] h-[480px] rounded-full bg-sky-100/60 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-100/40 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-sky-100/80 backdrop-blur-sm text-sky-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-sky-200/60">
                            Minh Bạch & Độc Lập
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
                        FinPeace không{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-amber-500">bơm cổ phiếu.</span>
                            <span className="absolute bottom-1 left-0 right-0 h-3 bg-amber-100 rounded-full -z-0" />
                        </span>
                        <br />
                        Chúng tôi{' '}
                        <span className="text-teal-600">lập kế hoạch giao dịch.</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-500 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Thị trường có hàng nghìn group "phân tích". Làm sao bạn biết ai thực sự đứng về phía bạn?
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-teal-200">
                                Đăng ký nhận Plan độc lập <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <a href="#how-pump-works"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl transition-all">
                            Bơm xả hoạt động thế nào?
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── RED FLAGS ── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShieldAlert className="w-7 h-7 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Nhận ra ngay dấu hiệu bơm xả</h2>
                        <p className="text-slate-400 text-sm">Nếu bạn từng thấy những tin nhắn kiểu này trong group chat:</p>
                    </motion.div>
                    <div className="space-y-3 mb-8">
                        {PUMP_SIGNS.map((sign, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.08)}
                                className="flex items-center gap-4 bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
                                <span className="shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">🚩</span>
                                <p className="text-slate-600 italic text-sm">"{sign}"</p>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div {...fadeUp(0.4)}
                        className="bg-amber-50/80 backdrop-blur-sm border border-amber-100 rounded-2xl p-5 text-center">
                        <p className="text-amber-700 font-semibold text-sm">→ Đây là những câu bạn thường nghe TRƯỚC khi bị xả hàng.</p>
                    </motion.div>
                </div>
            </section>

            {/* ── ANATOMY ── */}
            <section id="how-pump-works" className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Giải phẫu một vụ bơm xả điển hình</h2>
                        <p className="text-slate-400 text-sm italic">"Nhóm Telegram 50K thành viên: mua VND vào 17.5, mục tiêu 22"</p>
                    </motion.div>
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 rounded-full" />
                        <div className="space-y-5">
                            {PUMP_STEPS.map((item, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.12)} className="relative flex items-start gap-6 pl-14">
                                    <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                                        ${item.neutral
                                            ? 'bg-slate-100 text-slate-600 border-2 border-slate-200'
                                            : 'bg-amber-100 text-amber-700 border-2 border-amber-200'}`}>
                                        {item.step}
                                    </div>
                                    <div className={`flex-1 rounded-2xl p-4 ${item.neutral
                                        ? 'bg-white border border-slate-100'
                                        : 'bg-amber-50/80 border border-amber-100'}`}>
                                        <p className={`text-sm font-medium ${item.neutral ? 'text-slate-600' : 'text-amber-700'}`}>{item.text}</p>
                                        {i === 3 && <p className="text-xs text-amber-400 mt-1 italic">← Nhà đầu tư bình thường chỉ biết đến đây</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FINPEACE DIFF ── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">FinPeace khác ở điểm nào?</h2>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto">Chúng tôi không có lý do gì để bơm cổ phiếu — mô hình kinh doanh của chúng tôi không phụ thuộc vào điều đó.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {FINPEACE_DIFF.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100/80 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                                        <Icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2 text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── BOOK CITATIONS ── */}
            <section className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <BookOpen className="w-7 h-7 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Khoa học về xung đột lợi ích</h2>
                        <p className="text-slate-400 text-sm">Các chuyên gia hàng đầu đã cảnh báo điều này từ lâu.</p>
                    </motion.div>
                    <div className="space-y-4">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-5 shadow-sm">
                                <span className="text-3xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-700 italic leading-relaxed mb-2 text-sm">{c.quote}</p>
                                    <p className="text-teal-700 font-bold text-sm">— {c.book}</p>
                                    <p className="text-slate-400 text-xs">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-gradient-to-br from-teal-600 to-sky-600 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <CheckCircle2 className="w-14 h-14 text-teal-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">Giao dịch với người bạn có thể tin tưởng</h2>
                        <p className="text-teal-100 mb-8 text-base">Trading Plan của FinPeace được xây dựng vì lợi ích của bạn — không có gì khác.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-10 py-4 rounded-2xl hover:bg-teal-50 transition-colors text-lg shadow-xl shadow-teal-800/20">
                                Đăng ký nhận Plan độc lập <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-teal-200/70 text-sm mt-4">Miễn phí · Không cam kết dài hạn</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
