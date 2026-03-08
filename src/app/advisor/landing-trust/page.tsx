'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldAlert, Users, BarChart3, CheckCircle2 } from 'lucide-react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay }
})

const PUMP_SIGNS = [
    "Cổ phiếu X sắp tăng 30% – mua ngay!",
    "Insider cho biết mã Y sẽ chạy mạnh tuần này",
    "Đừng bỏ lỡ – cơ hội vàng chỉ còn 24h",
    "Fanpage hàng trăm nghìn follow đồng loạt đăng \"strong buy\"",
]

const FINPEACE_DIFF = [
    {
        icon: BarChart3,
        title: 'Phân tích kỹ thuật độc lập',
        desc: 'Đội ngũ FinPeace phân tích chart, volume, momentum — không có lợi ích từ việc bạn mua hay bán bất kỳ mã nào.',
        color: 'emerald'
    },
    {
        icon: ShieldAlert,
        title: 'Không có lợi ích xung đột',
        desc: 'FinPeace không sở hữu cổ phiếu, không nhận hoa hồng từ CTCK, không bán tín hiệu. Doanh thu duy nhất: phí dịch vụ từ khách hàng.',
        color: 'blue'
    },
    {
        icon: Users,
        title: 'Trách nhiệm giải trình',
        desc: 'Mỗi trading plan đều có tên phân tích viên chịu trách nhiệm. Kết quả thực tế được tracking và công bố định kỳ.',
        color: 'violet'
    },
]

const BOOK_CITATIONS = [
    {
        quote: '"Trên thị trường tài chính, xung đột lợi ích là vũ khí nguy hiểm nhất mà nhà đầu tư cá nhân phải đối mặt — nguy hiểm hơn cả biến động thị trường."',
        book: 'John C. Bogle',
        title: 'The Little Book of Common Sense Investing (2007)',
        icon: '📘'
    },
    {
        quote: '"Đừng bao giờ hỏi thợ cạo xem bạn có cần cắt tóc không. Và đừng bao giờ hỏi người hưởng lợi từ việc bạn mua cổ phiếu xem đó có phải cổ phiếu tốt không."',
        book: 'Warren Buffett',
        title: 'Berkshire Hathaway Annual Letter (1996)',
        icon: '📙'
    },
    {
        quote: '"Nghiên cứu 17 năm cho thấy: Các nhà phân tích độc lập có khả năng dự báo chính xác cao hơn 40% so với các nhà phân tích làm việc cho ngân hàng đầu tư."',
        book: 'Baruch Lev & Feng Gu',
        title: 'The End of Accounting (Princeton University Press, 2016)',
        icon: '📗'
    },
]

const CASE_EXAMPLE = {
    scenario: 'Nhóm Telegram 50,000 thành viên đăng "mua VND vào 17.5, mục tiêu 22"',
    reality: [
        { step: 1, text: 'Admin và đội bơm đã mua trước ở vùng 14-15 từ tuần trước' },
        { step: 2, text: 'Khi tin lan ra, giá tăng mạnh nhờ 50K người đồng loạt mua' },
        { step: 3, text: 'Admin chốt lời hoàn toàn trong khi nhà đầu tư mới vẫn đang hold' },
        { step: 4, text: 'Mã đảo chiều sắc, không có đợt xả lần 2 — nhà đầu tư mới ôm lỗ' },
    ]
}

export default function LandingTrustPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            Minh Bạch & Độc Lập
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black leading-tight mb-6">
                        FinPeace không{' '}
                        <span className="text-amber-400">bơm cổ phiếu.</span>
                        <br />
                        Chúng tôi{' '}
                        <span className="text-blue-400">lập kế hoạch giao dịch.</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Thị trường chứng khoán Việt Nam có hàng nghìn group "phân tích". Làm sao bạn biết
                        ai thực sự đứng về phía bạn?
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105">
                            Đăng ký nhận Plan độc lập <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#how-pump-works" className="inline-flex items-center gap-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-2xl transition-all">
                            Bơm xả vận hành thế nào?
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Red flags: Dấu hiệu bơm xả */}
            <section className="py-20 bg-amber-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">
                            Nhận ra ngay các dấu hiệu bơm xả
                        </h2>
                        <p className="text-slate-500">Nếu bạn đã từng thấy những tin nhắn kiểu này trong group chat:</p>
                    </motion.div>
                    <div className="space-y-3 mb-8">
                        {PUMP_SIGNS.map((sign, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="flex items-center gap-4 bg-white border border-amber-200 rounded-xl p-4">
                                <span className="text-red-500 text-xl shrink-0">🚩</span>
                                <p className="text-slate-700 font-medium italic">"{sign}"</p>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div {...fadeUp(0.5)} className="bg-amber-100 border border-amber-300 rounded-2xl p-5 text-center">
                        <p className="text-amber-800 font-semibold">→ Đây là những câu bạn nghe TRƯỚC khi bị xả hàng.</p>
                    </motion.div>
                </div>
            </section>

            {/* Anatomy of a pump & dump */}
            <section id="how-pump-works" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Giải phẫu một vụ bơm xả điển hình</h2>
                        <p className="text-slate-500 italic">"{CASE_EXAMPLE.scenario}"</p>
                    </motion.div>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                        <div className="space-y-6">
                            {CASE_EXAMPLE.reality.map((item, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.15)}
                                    className="relative flex items-start gap-6 pl-14">
                                    <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm
                                        ${i < 2 ? 'bg-slate-700' : i === 2 ? 'bg-rose-500' : 'bg-rose-700'}`}>
                                        {item.step}
                                    </div>
                                    <div className={`flex-1 rounded-2xl p-4 ${i === 3 ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`font-medium ${i === 3 ? 'text-rose-700' : 'text-slate-700'}`}>{item.text}</p>
                                        {i === 3 && <p className="text-xs text-rose-500 mt-1">← Nhà đầu tư bình thường thường chỉ biết đến đây</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FinPeace difference */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">FinPeace khác ở điểm nào?</h2>
                        <p className="text-slate-500">Chúng tôi không có lý do gì để bơm cổ phiếu — vì mô hình kinh doanh của chúng tôi không phụ thuộc vào điều đó.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FINPEACE_DIFF.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)}
                                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 text-${item.color}-600`} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Book Citations */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <BookOpen className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-3">Khoa học về xung đột lợi ích trong tài chính</h2>
                        <p className="text-slate-400">Các nghiên cứu và chuyên gia hàng đầu đã cảnh báo điều này từ lâu.</p>
                    </motion.div>
                    <div className="space-y-6">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.15)}
                                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex gap-5">
                                <span className="text-4xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-200 text-lg italic leading-relaxed mb-3">{c.quote}</p>
                                    <p className="text-blue-400 font-bold">— {c.book}</p>
                                    <p className="text-slate-500 text-sm">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <CheckCircle2 className="w-16 h-16 text-blue-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Giao dịch với người bạn có thể tin tưởng</h2>
                        <p className="text-blue-100 mb-8">Trading Plan của FinPeace được xây dựng vì lợi ích của bạn — không có gì khác.</p>
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-white text-blue-800 font-bold px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all hover:scale-105 text-lg">
                            Đăng ký nhận Plan độc lập <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-blue-200 text-sm mt-4">Miễn phí • Không cam kết dài hạn</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
