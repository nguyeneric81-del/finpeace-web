import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FinPeace — Bình An Tài Chính Cá Nhân',
    description: 'Hiểu rõ bức tranh tài chính của mình. Lập kế hoạch cho tương lai. Sống bình an với tiền bạc — không lo âu, không mơ hồ.',
}

const PAIN_POINTS = [
    {
        icon: '😰',
        title: 'Tháng nào cũng lo tiền',
        desc: 'Thu nhập không ít, nhưng cuối tháng tài khoản vẫn về 0. Không hiểu tiền đi đâu hết.',
    },
    {
        icon: '🌫️',
        title: 'Không có bức tranh tổng thể',
        desc: 'Tài sản nằm rải rác — sổ tiết kiệm, cổ phiếu, bất động sản — nhưng không biết mình đang ở đâu thực sự.',
    },
    {
        icon: '📅',
        title: 'Tương lai mơ hồ',
        desc: 'Muốn nghỉ hưu sớm, mua nhà, cho con học tốt — nhưng không biết bắt đầu từ đâu và cần bao nhiêu.',
    },
]

const FEATURES = [
    {
        icon: '💚',
        title: '4 Chỉ Số Sinh Tồn',
        desc: 'Net Worth, Tỷ lệ nợ, Quỹ khẩn cấp, Tỷ lệ tiết kiệm — bộ tứ chỉ số quyết định sức khỏe tài chính thực sự của bạn.',
        tag: 'Vital Signs',
    },
    {
        icon: '🌱',
        title: 'Khu Vườn Đầu Tư',
        desc: 'Cho bạn thấy 1 tháng tiết kiệm 3 triệu sẽ trở thành bao nhiêu sau 20 năm — lãi kép được trực quan hóa theo thời gian thực.',
        tag: 'Investment Garden',
    },
    {
        icon: '🛡️',
        title: 'Stress Test Tài Chính',
        desc: 'Nếu bạn mất việc 6 tháng, thị trường giảm 40%, lãi suất tăng gấp đôi — tài chính của bạn có trụ được không?',
        tag: 'Stress Test',
    },
    {
        icon: '🗺️',
        title: 'Kế Hoạch Tài Chính',
        desc: 'Từ mục tiêu (nghỉ hưu, mua nhà, học bổng con) đến kế hoạch hành động cụ thể với con số thực tế.',
        tag: 'Wealth Planning',
    },
]

const STEPS = [
    { n: '01', title: 'Nhập dữ liệu tài chính', desc: 'Tài sản, nợ, thu nhập, chi tiêu hàng tháng — chỉ mất 10 phút để có bức tranh hoàn chỉnh.' },
    { n: '02', title: 'Đọc 4 chỉ số sinh tồn', desc: 'FinPeace phân tích và cho bạn biết ngay bạn đang ở giai đoạn nào, điểm yếu cần ưu tiên xử lý.' },
    { n: '03', title: 'Lập kế hoạch & hành động', desc: 'Mục tiêu 5-10 năm được chia nhỏ thành việc làm cụ thể mỗi tháng — không còn mơ hồ.' },
]

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── NAV ── */}
            <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/"><Image src="/logo.svg" alt="FinPeace" width={130} height={32} priority /></Link>

                    <Link
                        href="/login"
                        className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                        Đăng nhập →
                    </Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
                <div className="max-w-5xl mx-auto px-6 py-24 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Tài chính cá nhân · Kế hoạch hóa · Bình an
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Bạn kiếm đủ tiền.
                            <br />
                            <span className="text-emerald-600">Tại sao vẫn lo?</span>
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
                            FinPeace giúp bạn nhìn rõ bức tranh tài chính của mình — không phán xét, không phức tạp.
                            Chỉ là sự rõ ràng bạn cần để sống bình an với tiền bạc.
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-colors shadow-lg shadow-emerald-200"
                            >
                                Bắt đầu miễn phí
                                <span>→</span>
                            </Link>
                            <span className="text-slate-400 text-sm">Không cần thẻ tín dụng</span>
                        </div>
                    </div>

                    {/* Floating stats */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 pr-6">
                        {[
                            { label: 'Net Worth', value: '+₫2.4 tỷ', color: 'text-emerald-600' },
                            { label: 'Quỹ khẩn cấp', value: '8.2 tháng', color: 'text-blue-600' },
                            { label: 'Tỷ lệ tiết kiệm', value: '34%', color: 'text-violet-600' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                                <p className="text-slate-400 text-xs">{s.label}</p>
                                <p className={`font-black text-xl ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PAIN POINTS ── */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Bạn có nhận ra mình không?</p>
                    <h2 className="text-3xl font-black text-white mb-10">
                        Thu nhập tốt nhưng tài chính vẫn<span className="text-rose-400"> không ổn</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {PAIN_POINTS.map((p, i) => (
                            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                <span className="text-3xl mb-4 block">{p.icon}</span>
                                <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 bg-slate-800 border border-emerald-900 rounded-2xl p-6 flex items-start gap-4">
                        <span className="text-2xl">💡</span>
                        <div>
                            <p className="text-white font-bold mb-1">Vấn đề không phải là thu nhập của bạn.</p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Hầu hết người có tài chính lộn xộn không phải vì kiếm ít — mà vì <em className="text-slate-300">không có bức tranh rõ ràng</em>.
                                Khi bạn nhìn thấy số liệu thực tế, mọi thứ sẽ thay đổi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">FinPeace cung cấp</p>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Bức tranh tài chính đầy đủ</h2>
                    <p className="text-slate-500 mb-10 max-w-xl">Không chỉ là số dư ngân hàng. Đây là toàn cảnh sức khỏe tài chính của bạn.</p>
                    <div className="grid md:grid-cols-2 gap-5">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="border border-slate-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{f.icon}</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                        {f.tag}
                                    </span>
                                </div>
                                <h3 className="text-slate-800 font-bold text-base mb-2 group-hover:text-emerald-700 transition-colors">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20 bg-emerald-50">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">Bắt đầu từ đây</p>
                    <h2 className="text-3xl font-black text-slate-900 mb-10">3 bước để có bình an tài chính</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map((s, i) => (
                            <div key={i} className="relative">
                                {i < STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-px border-t-2 border-dashed border-emerald-200 -translate-x-6" />
                                )}
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-sm mb-4">
                                    {s.n}
                                </div>
                                <h3 className="text-slate-800 font-bold mb-2">{s.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUOTE / PHILOSOPHY ── */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <span className="text-5xl mb-6 block">🌿</span>
                    <blockquote className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight mb-6">
                        "Bình an tài chính không có nghĩa là bạn giàu có.
                        Nó có nghĩa là bạn biết mình đang ở đâu,
                        đang đi về đâu, và tự tin vào con đường đó."
                    </blockquote>
                    <p className="text-slate-400 text-sm">— Triết lý của FinPeace</p>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-emerald-600">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">
                        Bắt đầu với bức tranh tài chính của bạn
                    </h2>
                    <p className="text-emerald-100 mb-8 text-lg">
                        Miễn phí. Không cần thẻ tín dụng. Mất 10 phút để có toàn cảnh.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-black px-10 py-4 rounded-2xl transition-colors text-lg shadow-xl"
                    >
                        Tạo tài khoản miễn phí →
                    </Link>
                    <p className="text-emerald-200 text-xs mt-4">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="underline hover:text-white transition-colors">Đăng nhập tại đây</Link>
                    </p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-slate-900 py-8">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-slate-500 text-xs">
                    <Image src="/logo.svg" alt="FinPeace" width={100} height={24} />

                    <span>© 2025 FinPeace · Bình An Tài Chính</span>
                    <Link href="/knowledgebase" className="hover:text-slate-300 transition-colors">Thư Viện Kiến Thức →</Link>
                </div>
            </footer>
        </div>
    )
}
