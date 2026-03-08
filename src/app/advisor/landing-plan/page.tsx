'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, TrendingDown, Shield, CheckCircle2 } from 'lucide-react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay }
})

const BOOK_CITATIONS = [
    {
        quote: '"Kẻ thù lớn nhất của nhà đầu tư không phải thị trường — mà là chính họ."',
        book: 'Benjamin Graham',
        title: 'The Intelligent Investor (1949)',
        icon: '📘'
    },
    {
        quote: '"Bạn không cần nghĩ đúng nhiều lần. Bạn chỉ cần tránh những sai lầm nghiêm trọng."',
        book: 'Charlie Munger',
        title: 'Poor Charlie\'s Almanack',
        icon: '📙'
    },
    {
        quote: '"Nghiên cứu cho thấy 80% nhà đầu tư cá nhân thua lỗ chủ yếu do không có điểm cắt lỗ rõ ràng."',
        book: 'Mark Douglas',
        title: 'Trading in the Zone (2000)',
        icon: '📗'
    },
]

const DISASTERS = [
    { icon: '😰', scenario: 'Mua xong thấy giảm 5% → hoảng loạn cắt lỗ', consequence: 'Bán đúng đáy, mã tăng tiếp' },
    { icon: '🤑', scenario: 'Lãi 10% rồi tham, không chốt lời', consequence: 'Mã đảo chiều, lãi thành lỗ' },
    { icon: '😤', scenario: 'Giữ mã lỗ vì "lỡ mua rồi"', consequence: 'Lỗ 30-50%, mất cơ hội mã khác' },
    { icon: '📱', scenario: 'Đọc group Telegram thấy hot → mua ngay', consequence: 'Mua đỉnh, bị bơm xả' },
]

export default function LandingPlanPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            FinPeace Advisor Trading
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black leading-tight mb-6">
                        Mỗi lệnh đều có{' '}
                        <span className="text-emerald-400">kế hoạch.</span>
                        <br />
                        Không bao giờ bị{' '}
                        <span className="text-rose-400">bất ngờ.</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Bạn đang giao dịch mà không biết mình sẽ làm gì khi mã giảm 7%?
                        Đó là lý do 85% nhà đầu tư cá nhân thua lỗ.
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105">
                            Nhận Trading Plan miễn phí <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#proof" className="inline-flex items-center gap-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-2xl transition-all">
                            Xem dẫn chứng khoa học
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Problem: Các thảm kịch */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Chuyện gì xảy ra khi không có kế hoạch?</h2>
                        <p className="text-slate-500">Những kịch bản này có quen không?</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {DISASTERS.map((d, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{d.icon}</span>
                                    <div>
                                        <p className="font-semibold text-slate-800 mb-1">{d.scenario}</p>
                                        <p className="text-sm text-rose-600 font-medium">→ {d.consequence}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div {...fadeUp(0.4)} className="mt-8 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
                        <TrendingDown className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                        <p className="text-rose-800 font-semibold">Tất cả đều có cùng một nguyên nhân:</p>
                        <p className="text-rose-600 text-lg font-bold mt-1">Không có kế hoạch trước khi vào lệnh.</p>
                    </motion.div>
                </div>
            </section>

            {/* Solution */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Trading Plan của FinPeace làm gì?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Mỗi plan là một hợp đồng bạn ký với chính mình — TRƯỚC khi tiền của bạn vào thị trường.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: 'Điểm Cắt Lỗ (SL)', desc: 'Chính xác đến từng đồng. Bạn biết trước mức thua tối đa chấp nhận được — không hoảng loạn, không do dự.', color: 'rose' },
                            { icon: CheckCircle2, title: 'Vùng Chốt Lời (TP)', desc: 'Mục tiêu giá rõ ràng. Không tham, không tiếc. Lấy lợi nhuận đúng lúc thay vì ngóng chờ đến khi mã đảo chiều.', color: 'emerald' },
                            { icon: Brain, title: 'Tỷ lệ R:R ≥ 1:2', desc: 'Thua 1 đồng, thắng tối thiểu 2 đồng. Chỉ cần thắng 40% lệnh là vẫn có lãi — toán học bảo vệ bạn.', color: 'blue' },
                        ].map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)}
                                    className={`bg-${item.color}-50 border border-${item.color}-100 rounded-2xl p-6`}>
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
            <section id="proof" className="py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <BookOpen className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-3">Khoa học đứng sau Trading Plan</h2>
                        <p className="text-slate-400">Không phải lý thuyết. Đây là những gì các huyền thoại đầu tư đã chứng minh.</p>
                    </motion.div>
                    <div className="space-y-6">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.15)}
                                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex gap-5">
                                <span className="text-4xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-200 text-lg italic leading-relaxed mb-3">
                                        {c.quote}
                                    </p>
                                    <p className="text-emerald-400 font-bold">— {c.book}</p>
                                    <p className="text-slate-500 text-sm">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Research stat */}
                    <motion.div {...fadeUp(0.4)} className="mt-8 bg-emerald-900/50 border border-emerald-700 rounded-2xl p-8 text-center">
                        <p className="text-5xl font-black text-emerald-400 mb-2">85%</p>
                        <p className="text-slate-300 text-lg font-medium">nhà đầu tư cá nhân thua lỗ liên tục</p>
                        <p className="text-slate-500 text-sm mt-2">Nguồn: DALBAR Inc. Annual Report — Quantitative Analysis of Investor Behavior (2023)</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <h2 className="text-3xl font-bold mb-4">Sẵn sàng giao dịch có kế hoạch?</h2>
                        <p className="text-emerald-100 mb-8">Đăng ký ngay — Upload danh mục, AI phân tích và FinPeace gửi Trading Plan riêng cho bạn.</p>
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all hover:scale-105 text-lg">
                            Nhận Trading Plan của tôi <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-emerald-200 text-sm mt-4">Miễn phí • Không cần thẻ tín dụng</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
