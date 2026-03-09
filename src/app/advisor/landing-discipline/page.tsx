'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, BarChart3, Play } from 'lucide-react'
import { useRef, useState } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay }
})

const HR = ({ dark = false }: { dark?: boolean }) => <div className={`w-full h-px ${dark ? 'bg-white/10' : 'bg-slate-200/60'}`} />

// Pattern A: 3-column cards
const DISCIPLINE_CARDS = [
    { tag: '01', title: 'Kiểm soát cảm xúc', desc: 'Kế hoạch được xây dựng khi đầu óc tỉnh táo — không phải khi thị trường đang biến động.' },
    { tag: '02', title: 'Thực thi nhất quán', desc: 'Làm theo đúng quy trình mỗi lệnh — không thay đổi theo tin tức hay dư luận.' },
    { tag: '03', title: 'Lợi thế toán học', desc: 'Chỉ cần 40% thắng với R:R=1:2 là đủ có lãi. Không cần "đoán đúng" thị trường.' },
]

// Pattern B: Emotion vs Discipline 2x2
const COMPARISON = [
    { emotion: '😰 Thấy mã tăng → FOMO mua vội', discipline: '✓ Chỉ mua khi giá vào đúng Entry zone' },
    { emotion: '😤 Giảm 5% → bán tháo', discipline: '✓ Giữ đến điểm SL đã định sẵn' },
    { emotion: '🤑 Lãi 8%, tham giữ thêm', discipline: '✓ Chốt đúng TP, cơ hội tiếp theo sẽ đến' },
    { emotion: '📰 Nghe tin xấu → bán tất', discipline: '✓ Market noise không thay đổi kế hoạch' },
]

const VIDEO_CLIPS = [
    { src: '/videos/clip-discipline.mp4', tag: '🎯 Kỷ Luật', title: 'Kỷ luật giữa cuồng phong', desc: 'Trong khi đám đông bán tháo, nhà giao dịch có kỷ luật ngồi bình tĩnh và chờ đúng điểm.' },
    { src: '/videos/clip-stoploss.mp4', tag: '🛡️ Rủi Ro', title: 'Stop Loss — Lá chắn bảo vệ vốn', desc: 'Cắt lỗ không phải thất bại. Đó là vũ khí bảo toàn vốn để chiến thắng ở trận tiếp theo.' },
    { src: '/videos/clip-greed.mp4', tag: '🧠 Tâm Lý', title: 'Lòng tham — Kẻ thù im lặng', desc: '+8% rõ ràng luôn tốt hơn hy vọng vô căn cứ "+50%". Chốt lời đúng TP rồi bước ra.' },
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
        <motion.div {...fadeUp(index * 0.1)} whileHover={{ scale: 1.01 }}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Card header like slide pattern */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700">{clip.tag}</span>
            </div>
            <div className="relative aspect-video cursor-pointer group bg-slate-100" onClick={toggle}>
                <video ref={videoRef} src={clip.src} className="w-full h-full object-cover"
                    onEnded={() => setPlaying(false)} playsInline preload="metadata" />
                <AnimatePresence>
                    {!playing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/25 group-hover:bg-slate-900/10 transition-colors">
                            <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 text-slate-700 ml-0.5" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="px-5 py-4">
                <h3 className="font-bold text-slate-800 text-sm mb-1">{clip.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{clip.desc}</p>
            </div>
        </motion.div>
    )
}

export default function LandingDisciplinePage() {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">

            {/* ══ HERO: split layout ══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/80">
                <HR />
                <div className="max-w-6xl mx-auto px-8 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <motion.span {...fadeUp(0)}
                                className="inline-block bg-emerald-100/80 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-emerald-200/60">
                                Tâm Lý & Kỷ Luật Giao Dịch
                            </motion.span>
                            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-6xl font-black text-slate-800 leading-tight mb-6">
                                <span className="text-emerald-600">Kỷ luật</span><br />
                                quan trọng hơn<br />
                                phán đoán.
                            </motion.h1>
                            <motion.p {...fadeUp(0.2)} className="text-slate-500 text-lg leading-relaxed mb-8">
                                Bạn không cần đoán đúng thị trường mỗi ngày.
                                Bạn chỉ cần <strong className="text-emerald-700">thực thi đúng kế hoạch</strong> đủ lần.
                            </motion.p>
                            <motion.div {...fadeUp(0.3)} className="flex gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/advisor/register"
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-colors shadow-lg shadow-emerald-200">
                                        Bắt đầu giao dịch có kỷ luật <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                                <a href="#math" className="inline-flex items-center text-slate-500 hover:text-slate-700 border border-slate-200 bg-white/70 px-7 py-3.5 rounded-2xl transition-all text-sm font-medium">
                                    Xem toán học chứng minh
                                </a>
                            </motion.div>
                        </div>
                        {/* Right: stat panel */}
                        <motion.div {...fadeUp(0.2)}>
                            <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-7 shadow-sm">
                                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-5">Nghiên cứu hành vi nhà đầu tư</p>
                                <div className="space-y-5">
                                    {[
                                        { val: '70%', label: 'quyết định bị chi phối bởi cảm xúc', src: 'Barber & Odean, 2000' },
                                        { val: '2.7×', label: 'nỗi đau thua lỗ so với niềm vui thắng', src: 'Kahneman & Tversky' },
                                        { val: '40%', label: 'tỷ lệ thắng tối thiểu với R:R = 1:2', src: 'Van K. Tharp' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <p className="text-3xl font-black text-emerald-600 w-20 shrink-0">{s.val}</p>
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

            {/* ══ PATTERN A: 3 video cards — DARK ══ */}
            <section className="bg-slate-800">
                <HR dark />
                <div className="max-w-6xl mx-auto px-8 py-20 text-center">
                    <motion.span {...fadeUp()}
                        className="inline-block bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-white/20">
                        🎥 Cuộc chiến hai thái cực
                    </motion.span>
                    <motion.h2 {...fadeUp(0.1)} className="text-4xl font-black text-white mb-2">Kẻ Mù Quáng vs. Sát Thủ Kỷ Luật</motion.h2>
                    <motion.p {...fadeUp(0.15)} className="text-slate-400 text-sm mb-12">
                        Hai nhà giao dịch, cùng một thị trường — nhưng kết quả hoàn toàn khác nhau.
                    </motion.p>
                    <div className="grid md:grid-cols-3 gap-5 text-left">
                        {VIDEO_CLIPS.map((clip, i) => <VideoClip key={i} clip={clip} index={i} />)}
                    </div>
                </div>
                <HR dark />
            </section>

            {/* ══ PATTERN B: Comparison 2x2 + right panel — LIGHT ══ */}
            <section className="bg-white">
                <HR />
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: big title + comparison rows */}
                        <div>
                            <motion.h2 {...fadeUp()} className="text-4xl font-black text-slate-800 mb-2 leading-tight">
                                Cảm xúc vs.<br />Kế hoạch
                            </motion.h2>
                            <motion.p {...fadeUp(0.1)} className="text-slate-400 text-sm mb-8">
                                Cùng một tình huống — hành động hoàn toàn khác nhau.
                            </motion.p>
                            {/* Header row */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 text-center">
                                    <span className="text-amber-700 font-bold text-xs uppercase tracking-wide">😣 Cảm xúc</span>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-wide">✅ Kỷ luật</span>
                                </div>
                            </div>
                            {COMPARISON.map((row, i) => (
                                <motion.div key={i} {...fadeUp(i * 0.08)} className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-white border border-amber-100 rounded-2xl p-3.5">
                                        <p className="text-amber-700 text-xs leading-relaxed">{row.emotion}</p>
                                    </div>
                                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5">
                                        <p className="text-emerald-700 text-xs leading-relaxed">{row.discipline}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Right: math proof + citations */}
                        <div>
                            <motion.p {...fadeUp()} className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-5">Toán học chứng minh</motion.p>
                            <div id="math" className="grid gap-4 mb-6">
                                <motion.div {...fadeUp(0.1)} className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5">
                                    <p className="font-bold text-slate-700 text-sm mb-3">😤 Không có kế hoạch (thắng 55%)</p>
                                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                                        <p>• Thắng +8% (chốt sớm vì tham) · Thua −15% (giữ lâu vì tiếc)</p>
                                    </div>
                                    <div className="bg-white border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                                        <span className="text-slate-500 text-xs">Kết quả kỳ vọng:</span>
                                        <span className="text-2xl font-black text-amber-600">−2.35%</span>
                                    </div>
                                </motion.div>
                                <motion.div {...fadeUp(0.15)} className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
                                    <p className="font-bold text-slate-700 text-sm mb-3">✅ Trading Plan R:R = 1:2 (thắng CHỈ 40%)</p>
                                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                                        <p>• Thắng +10% (đúng TP) · Thua −5% (đúng SL)</p>
                                    </div>
                                    <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                                        <span className="text-slate-500 text-xs">Kết quả kỳ vọng:</span>
                                        <span className="text-2xl font-black text-emerald-600">+1.0%</span>
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div {...fadeUp(0.2)} className="bg-emerald-600 rounded-2xl p-5 text-white text-center">
                                <Brain className="w-8 h-8 text-emerald-200 mx-auto mb-2 opacity-80" />
                                <p className="font-bold text-sm">Kỷ luật tạo ra lợi thế toán học.</p>
                                <p className="text-emerald-200 text-xs mt-1">Không cần đoán đúng — chỉ cần thực thi đúng.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <HR />
            </section>

            {/* ══ PATTERN A: 3 nhà khoa học cards — DARK ══ */}
            <section className="bg-slate-800">
                <HR dark />
                <div className="max-w-6xl mx-auto px-8 py-20 text-center">
                    <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-2">Khoa học về tâm lý giao dịch</motion.h2>
                    <motion.p {...fadeUp(0.1)} className="text-emerald-200/70 text-sm mb-12">Từ Nobel Prize đến huyền thoại phố Wall — tất cả đồng ý một điều.</motion.p>
                    <div className="grid md:grid-cols-3 gap-5 text-left">
                        {[
                            { tag: '01', title: 'Mark Douglas', sub: 'Trading in the Zone (2000)', desc: '"25 năm nghiên cứu: điều duy nhất phân biệt trader thành công là khả năng thực thi kế hoạch không bị cảm xúc chi phối."', icon: '📘' },
                            { tag: '02', title: 'Daniel Kahneman', sub: 'Nobel Kinh tế học 2002', desc: '"Nhà đầu tư thành công không nhất thiết thông minh nhất — họ là người biết kiểm soát bản năng tốt nhất."', icon: '📙' },
                            { tag: '03', title: 'Paul Tudor Jones', sub: 'Market Wizards (1989)', desc: '"Nhiều trader giỏi phá sản không vì phán đoán sai — mà vì không tuân thủ stop-loss của chính mình."', icon: '📗' },
                        ].map((card, i) =>
                            <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-emerald-400/20 border-b border-emerald-400/20 px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                                        <span className="text-emerald-300 font-black text-xs">{card.tag}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{card.title}</p>
                                        <p className="text-emerald-300/70 text-xs">{card.sub}</p>
                                    </div>
                                </div>
                                <div className="px-6 py-5">
                                    <span className="text-2xl">{card.icon}</span>
                                    <p className="text-slate-300 text-sm italic leading-relaxed mt-3">{card.desc}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <motion.div {...fadeUp(0.4)} className="mt-6 grid grid-cols-3 gap-3">
                        {['Trading in the Zone', 'Thinking, Fast &amp; Slow', 'Trade Your Way to Financial Freedom'].map((b, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                                <p className="text-emerald-200/80 font-medium text-xs">{b}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
                <HR />
            </section>

            {/* ══ CTA ══ */}
            <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
                <HR />
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <motion.div {...fadeUp()}>
                        <BarChart3 className="w-12 h-12 text-emerald-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-4xl font-black mb-4">Ngừng đoán. Bắt đầu theo kế hoạch.</h2>
                        <p className="text-emerald-100 mb-8">FinPeace cung cấp Trading Plan với Entry, SL và TP rõ ràng — bạn chỉ cần thực thi.</p>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                            <Link href="/advisor/register"
                                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-colors text-lg shadow-xl shadow-emerald-800/20">
                                Nhận kế hoạch giao dịch <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <p className="text-emerald-200/70 text-sm mt-4">Miễn phí · Phân tích theo danh mục thực của bạn</p>
                    </motion.div>
                </div>
                <HR />
            </section>
        </div>
    )
}
