'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Flame, Target, BarChart3, Brain, Play } from 'lucide-react'
import { useRef, useState } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay }
})

const EMOTION_VS_DISCIPLINE = [
    { emotion: 'Thấy mã tăng mạnh → mua ngay vì sợ bỏ lỡ', discipline: 'Chỉ mua khi giá vào đúng vùng Entry trong plan' },
    { emotion: 'Giảm 5% → hoảng loạn bán ra', discipline: 'Giữ đến điểm SL đã định — không sớm hơn, không muộn hơn' },
    { emotion: 'Lãi 8% rồi, tham thêm một chút...', discipline: 'Chốt lời đúng TP. Lần sau lại có cơ hội mới.' },
    { emotion: 'Nghe tin tức tiêu cực → bán tháo toàn bộ', discipline: 'Market noise không thay đổi kế hoạch đã vạch sẵn' },
]

const BOOK_CITATIONS = [
    {
        quote: '"Trong 25 năm nghiên cứu, tôi nhận ra: Điều khác biệt giữa nhà giao dịch thành công và thất bại không phải là phương pháp phân tích — mà là khả năng thực thi kế hoạch mà không bị cảm xúc chi phối."',
        book: 'Mark Douglas',
        title: 'Trading in the Zone (2000)',
        icon: '📘'
    },
    {
        quote: '"Các nhà đầu tư thành công nhất không nhất thiết thông minh nhất. Họ là những người biết kiểm soát bản năng của mình tốt nhất."',
        book: 'Daniel Kahneman',
        title: 'Thinking, Fast and Slow — Giải Nobel Kinh tế học 2002',
        icon: '📙'
    },
    {
        quote: '"Tôi đã thấy nhiều trader giỏi phá sản không phải vì phán đoán thị trường sai — mà vì họ không tuân thủ quy tắc stop-loss của chính mình."',
        book: 'Paul Tudor Jones',
        title: 'Market Wizards — Jack Schwager (1989)',
        icon: '📗'
    },
    {
        quote: '"Kỷ luật không phải là khả năng thiên bẩm. Đó là một cơ chế có thể được thiết kế vào hệ thống để loại bỏ nhu cầu phải phụ thuộc vào ý chí con người."',
        book: 'Van K. Tharp',
        title: 'Trade Your Way to Financial Freedom (1999)',
        icon: '📕'
    },
]

const STATS = [
    { value: '70%', label: 'quyết định giao dịch của nhà đầu tư cá nhân bị ảnh hưởng bởi cảm xúc ngắn hạn', source: 'Barber & Odean, Journal of Finance (2000)' },
    { value: '2.7x', label: 'lần cảm giác đau khi thua lỗ mạnh hơn cảm giác vui khi thắng cùng số tiền', source: 'Prospect Theory — Kahneman & Tversky (1979)' },
    { value: '40%', label: 'tỷ lệ thắng tối thiểu để có lãi — nếu tỷ lệ R:R luôn đạt 1:2', source: 'Van Tharp — Position Sizing Theory' },
]

const VIDEO_CLIPS = [
    {
        src: '/videos/clip-discipline.mp4',
        title: 'Kỷ luật giữa cuồng phong thị trường',
        desc: 'Nhà giao dịch có kỷ luật không bị cuốn vào cơn hoảng loạn tập thể. Trong khi đám đông bán tháo, họ ngồi bình tĩnh — vì kế hoạch của họ đã nói rõ phải làm gì.',
        tag: '🎯 Kỷ Luật',
        tagColor: 'violet',
    },
    {
        src: '/videos/clip-stoploss.mp4',
        title: 'Stop Loss — Lá chắn bảo vệ vốn',
        desc: 'Điểm cắt lỗ không phải là thất bại. Đó là vũ khí chiến lược giúp bạn bảo toàn vốn để chiến đấu ở trận tiếp theo. Không có Stop Loss = không có kỷ luật.',
        tag: '🛡️ Quản Trị Rủi Ro',
        tagColor: 'emerald',
    },
    {
        src: '/videos/clip-greed.mp4',
        title: 'Lòng tham — Kẻ thù im lặng',
        desc: 'Mục tiêu +8% rõ ràng luôn tốt hơn tham vọng mơ hồ "+50%". Nhà giao dịch kỷ luật chốt lời đúng TP — rồi bước ra khỏi màn hình.',
        tag: '🧠 Kiểm Soát Tâm Lý',
        tagColor: 'blue',
    },
]

function VideoClip({ clip, index }: { clip: typeof VIDEO_CLIPS[0], index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)

    const togglePlay = () => {
        if (!videoRef.current) return
        if (playing) {
            videoRef.current.pause()
            setPlaying(false)
        } else {
            videoRef.current.play()
            setPlaying(true)
        }
    }

    return (
        <motion.div {...fadeUp(index * 0.15)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Video */}
            <div className="relative bg-slate-900 aspect-video cursor-pointer group" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={clip.src}
                    className="w-full h-full object-cover"
                    onEnded={() => setPlaying(false)}
                    playsInline
                    preload="metadata"
                />
                {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                            <Play className="w-7 h-7 text-slate-800 ml-1" />
                        </div>
                    </div>
                )}
            </div>
            {/* Caption */}
            <div className="p-5">
                <span className={`inline-block text-xs font-bold bg-${clip.tagColor}-100 text-${clip.tagColor}-700 px-3 py-1 rounded-full mb-3`}>
                    {clip.tag}
                </span>
                <h3 className="font-bold text-slate-800 mb-2 text-lg">{clip.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{clip.desc}</p>
            </div>
        </motion.div>
    )
}

export default function LandingDisciplinePage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            Tâm Lý & Kỷ Luật Giao Dịch
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black leading-tight mb-6">
                        <span className="text-violet-400">Kỷ luật giao dịch</span>
                        <br />
                        &gt; Phán đoán thị trường.
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-slate-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Bạn không cần đoán đúng thị trường mỗi ngày.
                        Bạn chỉ cần <strong className="text-violet-300">thực thi đúng kế hoạch</strong> đủ lần.
                    </motion.p>
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105">
                            Bắt đầu giao dịch có kỷ luật <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#proof" className="inline-flex items-center gap-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-8 py-4 rounded-2xl transition-all">
                            Xem nghiên cứu tâm lý học
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-violet-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        {STATS.map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center">
                                <p className="text-5xl font-black text-violet-300 mb-2">{s.value}</p>
                                <p className="text-slate-300 text-sm leading-relaxed mb-2">{s.label}</p>
                                <p className="text-slate-500 text-xs italic">{s.source}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIDEO CLIPS ── */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                            🎬 Cuộc chiến hai thái cực
                        </span>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Kẻ Mù Quáng vs. Sát Thủ Kỷ Luật</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Hai nhà giao dịch, cùng một thị trường — nhưng kết quả hoàn toàn khác nhau. Xem và tự nhận ra bạn đang ở phía nào.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {VIDEO_CLIPS.map((clip, i) => (
                            <VideoClip key={i} clip={clip} index={i} />
                        ))}
                    </div>
                    <motion.p {...fadeUp(0.5)} className="text-center text-xs text-slate-400 mt-6 italic">
                        Trích từ series "Cuộc Chiến Hai Thái Cực" — tài liệu nội bộ FinPeace
                    </motion.p>
                </div>
            </section>

            {/* Emotion vs Discipline */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Cảm xúc vs. Kế hoạch</h2>
                        <p className="text-slate-500">Bạn đang phản ứng theo cảm xúc hay theo kỷ luật?</p>
                    </motion.div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50 rounded-xl px-4 py-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Flame className="w-4 h-4 text-rose-500" />
                                    <span className="font-bold text-rose-700 text-sm uppercase tracking-wide">Phản ứng cảm xúc</span>
                                </div>
                            </div>
                            <div className="bg-emerald-50 rounded-xl px-4 py-2 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                    <span className="font-bold text-emerald-700 text-sm uppercase tracking-wide">Theo Trading Plan</span>
                                </div>
                            </div>
                        </div>
                        {EMOTION_VS_DISCIPLINE.map((row, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)} className="grid grid-cols-2 gap-4">
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                                    <p className="text-rose-700 text-sm leading-relaxed">😣 {row.emotion}</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                    <p className="text-emerald-700 text-sm leading-relaxed">✅ {row.discipline}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Math proof */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-10">
                        <BarChart3 className="w-10 h-10 text-violet-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Toán học của kỷ luật</h2>
                        <p className="text-slate-500">Bạn không cần thắng mọi lệnh. Bạn chỉ cần chiến lược đúng.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div {...fadeUp(0.1)} className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                            <p className="font-bold text-rose-700 mb-4 text-lg">😤 Không có kế hoạch</p>
                            <div className="space-y-2 text-sm text-slate-700">
                                <p>• Thắng: Trung bình +8% (chốt sớm vì tham)</p>
                                <p>• Thua: Trung bình -15% (giữ quá lâu vì tiếc)</p>
                                <p>• Tỷ lệ thắng: 55%</p>
                            </div>
                            <div className="mt-4 bg-rose-100 rounded-xl p-4">
                                <p className="text-rose-800 font-bold">Kết quả: 55% × 8% - 45% × 15% = <span className="text-2xl">-2.35%</span>/kỳ</p>
                                <p className="text-rose-600 text-xs mt-1">→ Thua dần dù thắng nhiều hơn thua</p>
                            </div>
                        </motion.div>
                        <motion.div {...fadeUp(0.2)} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                            <p className="font-bold text-emerald-700 mb-4 text-lg">✅ Theo Trading Plan (R:R 1:2)</p>
                            <div className="space-y-2 text-sm text-slate-700">
                                <p>• Thắng: Đúng TP = +10%</p>
                                <p>• Thua: Đúng SL = -5%</p>
                                <p>• Tỷ lệ thắng: CHỈ 40%</p>
                            </div>
                            <div className="mt-4 bg-emerald-100 rounded-xl p-4">
                                <p className="text-emerald-800 font-bold">Kết quả: 40% × 10% - 60% × 5% = <span className="text-2xl">+1%</span>/kỳ</p>
                                <p className="text-emerald-600 text-xs mt-1">→ Lãi đều dù thua nhiều hơn thắng</p>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div {...fadeUp(0.3)} className="mt-6 bg-violet-50 border border-violet-200 rounded-2xl p-5 text-center">
                        <p className="text-violet-800 font-bold text-lg">Kỷ luật tạo ra lợi thế toán học — không cần đoán đúng thị trường.</p>
                    </motion.div>
                </div>
            </section>

            {/* Book Citations */}
            <section id="proof" className="py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div {...fadeUp()} className="text-center mb-12">
                        <BookOpen className="w-10 h-10 text-violet-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-3">Những gì khoa học nói về tâm lý giao dịch</h2>
                        <p className="text-slate-400">Từ Nobel Prize đến những huyền thoại phố Wall — tất cả đồng ý một điều.</p>
                    </motion.div>
                    <div className="space-y-6">
                        {BOOK_CITATIONS.map((c, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.15)}
                                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex gap-5">
                                <span className="text-4xl shrink-0">{c.icon}</span>
                                <div>
                                    <p className="text-slate-200 text-lg italic leading-relaxed mb-3">{c.quote}</p>
                                    <p className="text-violet-400 font-bold">— {c.book}</p>
                                    <p className="text-slate-500 text-sm">{c.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div {...fadeUp(0.5)} className="mt-10 grid md:grid-cols-4 gap-4">
                        {[
                            { label: 'Trading in the Zone', author: 'Mark Douglas', tag: 'Tâm lý giao dịch' },
                            { label: 'Thinking, Fast & Slow', author: 'Daniel Kahneman', tag: 'Nobel Kinh tế học' },
                            { label: 'Market Wizards', author: 'Jack Schwager', tag: 'Huyền thoại phố Wall' },
                            { label: 'Trade Your Way to Financial Freedom', author: 'Van K. Tharp', tag: 'Hệ thống giao dịch' },
                        ].map((book, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                                <p className="text-xs text-violet-400 font-bold uppercase tracking-wide mb-2">{book.tag}</p>
                                <p className="text-white font-semibold text-sm mb-1">{book.label}</p>
                                <p className="text-slate-500 text-xs">{book.author}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-violet-700 to-violet-900 text-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div {...fadeUp()}>
                        <Brain className="w-16 h-16 text-violet-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Ngừng đoán thị trường. Bắt đầu theo kế hoạch.</h2>
                        <p className="text-violet-100 mb-8">FinPeace cung cấp Trading Plan với Entry, SL và TP rõ ràng — để bạn chỉ cần thực thi, không cần phán đoán.</p>
                        <Link href="/advisor/register"
                            className="inline-flex items-center gap-2 bg-white text-violet-800 font-bold px-10 py-4 rounded-2xl hover:bg-violet-50 transition-all hover:scale-105 text-lg">
                            Nhận kế hoạch giao dịch của tôi <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="text-violet-200 text-sm mt-4">Miễn phí • Phân tích theo danh mục thực của bạn</p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
