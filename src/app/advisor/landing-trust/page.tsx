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

const DARK = {
    bg: '#020617',
    card: '#0F172A',
    border: 'rgba(255,255,255,0.07)',
    green: '#10B981',
    greenBg: 'rgba(16,185,129,0.1)',
    greenBorder: 'rgba(16,185,129,0.25)',
    amber: '#F59E0B',
    amberBg: 'rgba(245,158,11,0.1)',
    rose: '#F43F5E',
    textMuted: 'rgba(255,255,255,0.45)',
    textFaint: 'rgba(255,255,255,0.2)',
}

const TRUST_CARDS = [
    { tag: '01', icon: Eye, title: 'Phân tích độc lập', desc: 'FinPeace phân tích chart, volume, momentum thuần túy kỹ thuật — không có lợi ích từ việc bạn mua hay bán.' },
    { tag: '02', icon: ShieldAlert, title: 'Không xung đột lợi ích', desc: 'Không sở hữu cổ phiếu, không nhận hoa hồng CTCK. Doanh thu duy nhất: phí dịch vụ từ khách hàng.' },
    { tag: '03', icon: Users, title: 'Trách nhiệm giải trình', desc: 'Mỗi plan có tên phân tích viên chịu trách nhiệm. Kết quả được tracking và công bố công khai.' },
]

const PUMP_ANATOMY = [
    { n: '01', title: 'Admin mua trước', desc: 'Tích lũy cổ phiếu ở vùng thấp 14-15, trước khi đăng thông tin lên nhóm.', warn: false },
    { n: '02', title: 'Đăng tin lên nhóm', desc: '50K thành viên đồng loạt mua, giá tăng mạnh — admin đang chờ đợt này.', warn: false },
    { n: '03', title: 'Admin chốt lời', desc: 'Xả toàn bộ vị thế khi ra đám đông mới đang hold — giá bắt đầu đảo chiều.', warn: true },
    { n: '04', title: 'Nhà đầu tư ôm lỗ', desc: 'Mã đảo chiều sắc không có đợt xả tiếp — người mua theo bị kẹt không lối thoát.', warn: true },
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
        <div className="min-h-screen" style={{ background: DARK.bg, fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden" style={{ borderBottom: `1px solid ${DARK.border}` }}>
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(ellipse, #10B981, transparent 70%)' }} />
                </div>

                <div className="max-w-6xl mx-auto px-8 py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <motion.span {...fadeUp(0)}
                                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
                                style={{ background: DARK.greenBg, color: DARK.green, border: `1px solid ${DARK.greenBorder}` }}>
                                Minh Bạch &amp; Độc Lập
                            </motion.span>
                            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                FinPeace<br />
                                <span style={{ color: DARK.amber }}>không bơm</span><br />
                                cổ phiếu.
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-lg leading-relaxed mb-8" style={{ color: DARK.textMuted }}>
                                Hàng nghìn group &ldquo;phân tích&rdquo; trên mạng — làm sao bạn biết ai thực sự đứng về phía bạn?
                            </motion.p>
                            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/advisor/register"
                                        className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-2xl transition-all duration-200 hover:brightness-125"
                                        style={{ background: DARK.green, color: 'white' }}>
                                        Nhận Plan độc lập <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                                <a href="#anatomy"
                                    className="inline-flex items-center text-sm font-medium px-7 py-3.5 rounded-2xl transition-all duration-200 hover:border-opacity-50"
                                    style={{ color: DARK.textMuted, border: `1px solid ${DARK.border}` }}>
                                    Bơm xả hoạt động thế nào?
                                </a>
                            </motion.div>
                        </div>

                        {/* Right: Red flag panel */}
                        <motion.div {...fadeUp(0.2)}>
                            <div className="rounded-3xl p-7" style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${DARK.border}`, backdropFilter: 'blur(12px)' }}>
                                <p className="text-xs uppercase tracking-widest font-bold mb-5 flex items-center gap-2" style={{ color: DARK.textFaint }}>
                                    <span style={{ color: DARK.rose }}>🚩</span> Dấu hiệu bơm xả điển hình
                                </p>
                                <div className="space-y-3">
                                    {RED_FLAGS.map((flag, i) => (
                                        <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                                            <span className="shrink-0 text-sm" style={{ color: DARK.amber }}>🚩</span>
                                            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.6)' }}>{flag}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-semibold mt-4 text-center" style={{ color: DARK.amber }}>
                                    → Đây là những câu bạn nghe TRƯỚC khi bị xả hàng
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ ANATOMY OF PUMP ══ */}
            <section id="anatomy" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: timeline */}
                        <div>
                            <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-2 leading-tight">
                                Giải phẫu một vụ<br />bơm xả điển hình
                            </motion.h2>
                            <motion.p {...fadeUp(0.1)} className="text-sm italic mb-10" style={{ color: DARK.textMuted }}>
                                &ldquo;Nhóm Telegram 50K thành viên: mua VND vào 17.5, mục tiêu 22&rdquo;
                            </motion.p>
                            <div className="relative pl-6">
                                <div className="absolute left-0 top-2 bottom-2 w-px rounded-full" style={{ background: DARK.border }} />
                                <div className="space-y-5">
                                    {PUMP_ANATOMY.map((item, i) => (
                                        <motion.div key={i} {...fadeUp(i * 0.1)} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs"
                                                style={{
                                                    background: item.warn ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.05)',
                                                    color: item.warn ? DARK.rose : DARK.textMuted,
                                                    border: `1px solid ${item.warn ? 'rgba(244,63,94,0.25)' : DARK.border}`
                                                }}>
                                                {item.n}
                                            </div>
                                            <div className="flex-1 rounded-2xl p-4" style={{
                                                background: item.warn ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${item.warn ? 'rgba(244,63,94,0.15)' : DARK.border}`
                                            }}>
                                                <p className="font-bold text-sm mb-1" style={{ color: item.warn ? DARK.rose : 'rgba(255,255,255,0.8)' }}>{item.title}</p>
                                                <p className="text-xs leading-relaxed" style={{ color: DARK.textMuted }}>{item.desc}</p>
                                                {i === 3 && <p className="text-xs italic mt-2" style={{ color: DARK.rose }}>← Nhà đầu tư bình thường chỉ biết đến đây</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: citations */}
                        <div className="space-y-4">
                            <motion.p {...fadeUp()} className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: DARK.textFaint }}>Nghiên cứu &amp; chuyên gia</motion.p>
                            {BOOK_CITATIONS.map((c, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.1)}
                                    className="rounded-2xl p-5 flex gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${DARK.border}` }}>
                                    <span className="text-2xl shrink-0">{c.icon}</span>
                                    <div>
                                        <p className="italic text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.quote}</p>
                                        <p className="font-bold text-xs" style={{ color: DARK.green }}>— {c.author}</p>
                                        <p className="text-xs mt-0.5" style={{ color: DARK.textFaint }}>{c.book}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ TRUST CARDS ══ */}
            <section style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <div className="max-w-6xl mx-auto px-8 py-20 text-center">
                    <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-3">FinPeace khác ở điểm nào?</motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-sm mb-12 max-w-lg mx-auto" style={{ color: DARK.textMuted }}>
                        Mô hình kinh doanh của chúng tôi không phụ thuộc vào việc bạn mua hay bán bất kỳ mã nào.
                    </motion.p>
                    <div className="grid md:grid-cols-3 gap-5 text-left">
                        {TRUST_CARDS.map((card, i) => {
                            const Icon = card.icon
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                    className="rounded-3xl overflow-hidden transition-all duration-200"
                                    style={{ background: DARK.card, border: `1px solid ${DARK.border}` }}>
                                    <div className="px-6 py-4 flex items-center gap-3" style={{ background: DARK.greenBg, borderBottom: `1px solid rgba(16,185,129,0.12)` }}>
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${DARK.border}` }}>
                                            <span className="text-xs font-black" style={{ color: DARK.green }}>{card.tag}</span>
                                        </div>
                                        <h3 className="font-bold text-sm text-emerald-300">{card.title}</h3>
                                    </div>
                                    <div className="px-6 py-5">
                                        <Icon className="w-8 h-8 mb-3 opacity-40 text-emerald-400" />
                                        <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>{card.desc}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="text-center">
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <motion.div {...fadeUp()}>
                        <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mx-auto mb-6" style={{ background: DARK.greenBg, border: `1px solid ${DARK.greenBorder}`, boxShadow: '0 0 32px rgba(16,185,129,0.15)' }}>
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4">Giao dịch với người bạn có thể tin</h2>
                        <p className="mb-8" style={{ color: DARK.textMuted }}>Trading Plan của FinPeace được xây dựng vì lợi ích của bạn — không có gì khác.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-200 hover:brightness-125"
                                style={{ background: DARK.green, color: 'white', boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}>
                                Đăng ký nhận Plan miễn phí <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-sm mt-4" style={{ color: DARK.textFaint }}>Miễn phí · Không cam kết dài hạn</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
