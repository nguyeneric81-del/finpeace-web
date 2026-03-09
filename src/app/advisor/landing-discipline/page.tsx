'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, Target, BarChart3, Play } from 'lucide-react'
import { useRef, useState } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay }
})

const EMOTION_VS_DISCIPLINE = [
    { emotion: 'Thấy mã tăng mạnh → mua vì sợ bỏ lỡ', discipline: 'Chỉ mua khi giá vào đúng vùng Entry trong plan' },
    { emotion: 'Giảm 5% → hoảng loạn bán ra', discipline: 'Giữ đến điểm SL đã định — không sớm hơn, không muộn hơn' },
    { emotion: 'Lãi 8% rồi, tham thêm...', discipline: 'Chốt lời đúng TP. Lần sau lại có cơ hội mới.' },
    { emotion: 'Nghe tin tiêu cực → bán tháo toàn bộ', discipline: 'Market noise không thay đổi kế hoạch đã vạch sẵn' },
]

const BOOK_CITATIONS = [
    { quote: '"Trong 25 năm nghiên cứu, điều khác biệt giữa trader thành công và thất bại không phải phương pháp phân tích — mà là khả năng thực thi kế hoạch không bị cảm xúc chi phối."', book: 'Mark Douglas', title: 'Trading in the Zone (2000)', icon: '📘' },
    { quote: '"Các nhà đầu tư thành công nhất không nhất thiết thông minh nhất. Họ là những người biết kiểm soát bản năng của mình tốt nhất."', book: 'Daniel Kahneman', title: 'Thinking, Fast and Slow — Giải Nobel Kinh tế học 2002', icon: '📙' },
    { quote: '"Tôi đã thấy nhiều trader giỏi phá sản không phải vì phán đoán sai — mà vì không tuân thủ quy tắc stop-loss của chính mình."', book: 'Paul Tudor Jones', title: 'Market Wizards — Jack Schwager (1989)', icon: '📗' },
]

const VIDEO_CLIPS = [
    { src: '/videos/clip-discipline.mp4', title: 'Kỷ luật giữa cuồng phong', desc: 'Trong khi đám đông bán tháo, nhà giao dịch có kỷ luật ngồi bình tĩnh — vì kế hoạch đã nói rõ phải làm gì.', tag: '🎯 Kỷ Luật' },
    { src: '/videos/clip-stoploss.mp4', title: 'Stop Loss — Lá chắn bảo vệ vốn', desc: 'Điểm cắt lỗ không phải thất bại. Đó là vũ khí chiến lược giúp bảo toàn vốn để chiến đấu ở trận tiếp theo.', tag: '🛡️ Quản Trị Rủi Ro' },
    { src: '/videos/clip-greed.mp4', title: 'Lòng tham — Kẻ thù im lặng', desc: 'Mục tiêu +8% rõ ràng luôn tốt hơn tham vọng mơ hồ "+50%". Chốt lời đúng TP — rồi bước ra khỏi màn hình.', tag: '🧠 Kiểm Soát Tâm Lý' },
]

function VideoClip({ clip, index }: { clip: typeof VIDEO_CLIPS[0]; index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)

    const toggle = () => {
        if (!videoRef.current) return
        if (playing) { videoRef.current.pause(); setPlaying(false) }
        else { videoRef.current.play(); setPlaying(true) }
    }

    return (
        <motion.div {...fadeUp(index * 0.12)} whileHover={{ scale: 1.01 }}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-video cursor-pointer group bg-slate-100" onClick={toggle}>
                <video ref={videoRef} src={clip.src} className="w-full h-full object-cover"
                    onEnded={() => setPlaying(false)} playsInline preload="metadata" />
                <AnimatePresence>
                    {!playing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors">
                            <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-6 h-6 text-slate-700 ml-0.5" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="p-5">
                <span className="inline-block text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full mb-3 border border-emerald-100">
                    {clip.tag}
                </span>
                <h3 className="font-bold text-slate-800 mb-2">{clip.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{clip.desc}</p>
            </div>
        </motion.div>
    )
}

export default function LandingDisciplinePage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="pointer-events-none absolute -top-24 -left-24 w-[440px] h-[440px] rounded-full bg-emerald-100/60 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-teal-100/50 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-emerald-100/80 backdrop-blur-sm text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-emerald-200/60">
                            Tâm Lý & Kỷ Luật Giao Dịch
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black text-slate-800 leading-tight mb-6">
                        <span className="text-emerald-600">Kỷ luật giao dịch</span>
                        <br />
                        quan trọng hơn{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">phán đoán.</span>
                            <span className="absolute bottom-1 left-0 right-0 h-3 bg-emerald-100 rounded-full -z-0" />
                        </span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-500 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Bạn không cần đoán đúng thị trường mỗi ngày.
                        Bạn chỉ cần <strong className="text-emerald-700 font-semibold">thực thi đúng kế hoạch</strong> đủ lần.
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-emerald-200">
                                Bắt đầu giao dịch có kỷ luật <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <a href="#proof"
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl transition-all">
                            Xem nghiên cứu tâm lý học
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── STAT BANNER ── */}
            <section className="bg-emerald-600 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-12 text-white text-center">
                        {[
                            { value: '70%', label: 'quyết định bị ảnh hưởng bởi cảm xúc', src: 'Barber & Odean, 2000' },
                            { value: '2.7×', label: 'đau của thua lỗ so với niềm vui thắng', src: 'Kahneman & Tversky' },
                            { value: '40%', label: 'thắng tối thiểu với R:R = 1:2', src: 'Van K. Tharp' },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}>
                                <p className="text-4xl font-black text-emerald-100">{s.value}</p>
                                <p className="text-emerald-200 text-sm mt-1">{s.label}</p>
                                <p className="text-emerald-300/70 text-xs italic mt-0.5">{s.src}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIDEO CLIPS ── */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-emerald-100">
                            🎬 Cuộc chiến hai thái cực
                        </span>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kẻ Mù Quáng vs. Sát Thủ Kỷ Luật</h2>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto">Hai nhà giao dịch, cùng một thị trường — nhưng kết quả hoàn toàn khác nhau.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {VIDEO_CLIPS.map((clip, i) => <VideoClip key={i} clip={clip} index={i} />)}
                    </div>
                    <motion.p {...fadeUp(0.4)} className="text-center text-xs text-slate-300 mt-6 italic">
                        Trích từ series "Cuộc Chiến Hai Thái Cực" — tài liệu nội bộ FinPeace
                    </motion.p>
                </div>
            </section>

            {/* ── EMOTION VS DISCIPLINE ── */}
            <section className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Cảm xúc vs. Kế hoạch</h2>
                        <p className="text-slate-400 text-sm">Bạn đang phản ứng theo cảm xúc hay theo kỷ luật?</p>
                    </motion.div>
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 justify-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                                <span className="text-lg">😣</span>
                                <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">Phản ứng cảm xúc</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                                <Target className="w-4 h-4 text-emerald-600" />
                                <span className="font-bold text-emerald-700 text-xs uppercase tracking-wide">Theo Trading Plan</span>
                            </div>
                        </div>
                        {EMOTION_VS_DISCIPLINE.map((row, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.08)} className="grid grid-cols-2 gap-3">
                                <div className="bg-white border border-amber-100 rounded-2xl p-4">
                                    <p className="text-amber-700 text-sm leading-relaxed">{row.emotion}</p>
                                </div>
                                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
                                    <p className="text-emerald-700 text-sm leading-relaxed">✓ {row.discipline}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MATH PROOF ── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <BarChart3 className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Toán học của kỷ luật</h2>
                        <p className="text-slate-400 text-sm">Bạn không cần thắng mọi lệnh — chỉ cần chiến lược đúng.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-5">
                        <motion.div {...fadeUp(0.1)} className="bg-amber-50/60 border border-amber-100 rounded-3xl p-7">
                            <p className="font-bold text-slate-700 mb-5 flex items-center gap-2">
                                <span className="text-2xl">😤</span> Không có kế hoạch
                            </p>
                            <div className="space-y-2 text-sm text-slate-600 mb-5">
                                <p>• Thắng: trung bình +8% (chốt sớm vì tham)</p>
                                <p>• Thua: trung bình −15% (giữ quá lâu vì tiếc)</p>
                                <p>• Tỷ lệ thắng: 55%</p>
                            </div>
                            <div className="bg-white/80 border border-amber-200 rounded-2xl p-4">
                                <p className="text-slate-600 text-xs mb-1">Kết quả mỗi kỳ:</p>
                                <p className="text-2xl font-black text-amber-600">−2.35%</p>
                                <p className="text-slate-400 text-xs mt-1">→ Thua dần dù thắng nhiều hơn thua</p>
                            </div>
                        </motion.div>
                        <motion.div {...fadeUp(0.2)} className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-7">
                            <p className="font-bold text-slate-700 mb-5 flex items-center gap-2">
                                <span className="text-2xl">✅</span> Trading Plan R:R = 1:2
                            </p>
                            <div className="space-y-2 text-sm text-slate-600 mb-5">
                                <p>• Thắng: đúng TP = +10%</p>
                                <p>• Thua: đúng SL = −5%</p>
                                <p>• Tỷ lệ thắng: CHỈ 40%</p>
                            </div>
                            <div className="bg-white/80 border border-emerald-200 rounded-2xl p-4">
                                <p className="text-slate-600 text-xs mb-1">Kết quả mỗi kỳ:</p>
                                <p className="text-2xl font-black text-emerald-600">+1.0%</p>
                                <p className="text-slate-400 text-xs mt-1">→ Lãi đều dù thua nhiều hơn thắng</p>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div {...fadeUp(0.3)}
                        className="mt-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 text-center">
                        <p className="text-emerald-800 font-bold">Kỷ luật tạo ra lợi thế toán học — không cần đoán đúng thị trường.</p>
                    </motion.div>
                </div>
            </section>

            {/* ── BOOK CITATIONS ── */}
            <section id="proof" className="py-20 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <BookOpen className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Khoa học về tâm lý giao dịch</h2>
                        <p className="text-slate-400 text-sm">Từ Nobel Prize đến huyền thoại phố Wall — tất cả đồng ý một điều.</p>
                    </motion.div>
                    <div className="space-y-4">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-5 shadow-sm">
                                <span className="text-3xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-700 italic leading-relaxed mb-2 text-sm">{c.quote}</p>
                                    <p className="text-emerald-600 font-bold text-sm">— {c.book}</p>
                                    <p className="text-slate-400 text-xs">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Book shelf */}
                    <motion.div {...fadeUp(0.4)} className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Trading in the Zone', author: 'Mark Douglas' },
                            { label: 'Thinking, Fast & Slow', author: 'D. Kahneman' },
                            { label: 'Trade Your Way to Financial Freedom', author: 'Van K. Tharp' },
                        ].map((b, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 text-center">
                                <p className="text-slate-700 font-semibold text-xs leading-snug mb-1">{b.label}</p>
                                <p className="text-slate-400 text-xs">{b.author}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <Brain className="w-14 h-14 text-emerald-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">Ngừng đoán thị trường. Bắt đầu theo kế hoạch.</h2>
                        <p className="text-emerald-100 mb-8 text-base">FinPeace cung cấp Trading Plan với Entry, SL và TP rõ ràng — để bạn chỉ cần thực thi.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-colors text-lg shadow-xl shadow-emerald-800/20">
                                Nhận kế hoạch giao dịch của tôi <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-emerald-200/70 text-sm mt-4">Miễn phí · Phân tích theo danh mục thực của bạn</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
