import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

// ── Brand Colors (từ finpeace.vn) ──────────────────────────────
// Primary green: #38C68B
// Dark navy:     #131946
// Mint bg:       #38C68B1A  (20% opacity)
// Body text:     #1a1a1a
// Secondary txt: #4F4F4F
// Accent orange: #ff7d50

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

export default function HomePage() {
    const green = '#38C68B'
    const navy = '#131946'
    const mint = '#38C68B1A'

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* ── NAV ── */}
            <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/"><Image src="/logo.png" alt="FinPeace" width={144} height={24} priority /></Link>
                    <Link
                        href="/login"
                        className="text-sm font-semibold transition-colors"
                        style={{ color: green }}
                    >
                        Đăng nhập →
                    </Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                                style={{ background: mint, color: green }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: green }}></span>
                                Tài chính cá nhân · Kế hoạch hóa · Bình an
                            </span>
                            <h1 className="text-5xl font-black leading-tight mb-4" style={{ color: navy }}>
                                Bạn kiếm đủ tiền.<br />
                                <span style={{ color: green }}>Tại sao vẫn lo?</span>
                            </h1>
                            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#4F4F4F' }}>
                                FinPeace giúp bạn nhìn rõ bức tranh tài chính của mình — không phán xét, không phức tạp. Chỉ là sự rõ ràng bạn cần để sống bình an với tiền bạc.
                            </p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-lg transition-all hover:opacity-90 active:scale-95"
                                    style={{ background: green }}
                                >
                                    Bắt đầu miễn phí →
                                </Link>
                                <span className="text-sm" style={{ color: '#4F4F4F' }}>Không cần thẻ tín dụng</span>
                            </div>
                        </div>
                        {/* Floating stats */}
                        <div className="flex flex-col gap-4">
                            {[
                                { label: 'Net Worth', value: '+₫2.4 tỷ', color: green },
                                { label: 'Quỹ khẩn cấp', value: '8.2 tháng', color: '#3B82F6' },
                                { label: 'Tỷ lệ tiết kiệm', value: '34%', color: '#8B5CF6' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between">
                                    <p className="text-sm font-medium" style={{ color: '#4F4F4F' }}>{s.label}</p>
                                    <p className="font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PAIN POINTS ── */}
            <section className="py-20" style={{ background: mint }}>
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: green }}>Bạn có nhận ra mình không?</p>
                    <h2 className="text-3xl font-black mb-2" style={{ color: navy }}>
                        Thu nhập tốt nhưng tài chính vẫn <span style={{ color: '#ff7d50' }}>không ổn</span>
                    </h2>
                    <p className="mb-10" style={{ color: '#4F4F4F' }}>Đây không phải lỗi của bạn — mà là thiếu công cụ đúng.</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {PAIN_POINTS.map((p, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                <span className="text-3xl mb-4 block">{p.icon}</span>
                                <h3 className="font-bold text-base mb-2" style={{ color: navy }}>{p.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#4F4F4F' }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <span className="text-2xl">💡</span>
                        <div>
                            <p className="font-bold mb-1" style={{ color: navy }}>Vấn đề không phải là thu nhập của bạn.</p>
                            <p className="text-sm leading-relaxed" style={{ color: '#4F4F4F' }}>
                                Hầu hết người có tài chính lộn xộn không phải vì kiếm ít — mà vì <em style={{ color: navy }}>không có bức tranh rõ ràng</em>. Khi bạn nhìn thấy số liệu thực tế, mọi thứ sẽ thay đổi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: green }}>FinPeace cung cấp</p>
                    <h2 className="text-3xl font-black mb-2" style={{ color: navy }}>Bức tranh tài chính đầy đủ</h2>
                    <p className="mb-10 max-w-xl" style={{ color: '#4F4F4F' }}>Không chỉ là số dư ngân hàng. Đây là toàn cảnh sức khỏe tài chính của bạn.</p>
                    <div className="grid md:grid-cols-2 gap-5">
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                className="border rounded-2xl p-6 transition-all hover:shadow-md group"
                                style={{ borderColor: 'rgba(56,198,139,0.2)' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = green)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(56,198,139,0.2)')}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{f.icon}</span>
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                                        style={{ background: mint, color: green }}
                                    >
                                        {f.tag}
                                    </span>
                                </div>
                                <h3 className="font-bold text-base mb-2" style={{ color: navy }}>{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#4F4F4F' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BẢN ĐỒ 3 BƯỚC ── */}
            <section className="py-20" style={{ background: mint }}>
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: green }}>Từ sách &ldquo;Bình An Tài Chính&rdquo;</p>
                    <h2 className="text-3xl font-black mb-2" style={{ color: navy }}>Bản Đồ 3 Bước Đến Bình An</h2>
                    <p className="mb-12 max-w-xl" style={{ color: '#4F4F4F' }}>Không phải về việc kiếm được bao nhiêu — đây là hành trình từ lo âu đến tự do.</p>
                    <div className="space-y-5">

                        {/* BƯỚC 1 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border-l-4" style={{ borderLeftColor: '#ff7d50' }}>
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#fff6f3', border: '2px solid #ff7d50' }}>🛑</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#ff7d50' }}>Bước 1</span>
                                        <span className="text-xs" style={{ color: '#4F4F4F' }}>· Vùng Đất Hoang</span>
                                    </div>
                                    <h3 className="font-black text-xl mb-3" style={{ color: navy }}>Dọn dẹp rào cản tâm lý</h3>
                                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#4F4F4F' }}>
                                        Nhiều người nghèo đi không vì dốt tính toán — mà do bị kẹt bởi <span style={{ color: '#ff7d50' }}>nỗi sợ vô hình</span> và <span style={{ color: '#ff7d50' }}>niềm tin sai lệch</span>. Bẫy &ldquo;trì hoãn&rdquo; và chi tiêu cảm xúc khiến tài khoản về 0 rồi lại hối hận, lặp đi lặp lại.
                                    </p>
                                    <div className="rounded-xl px-4 py-3 inline-block" style={{ background: mint }}>
                                        <p className="text-xs font-bold" style={{ color: green }}>Giải pháp: Tìm &ldquo;ước mơ chân thật&rdquo;</p>
                                        <p className="text-xs mt-1" style={{ color: '#4F4F4F' }}>Gắn tiền với giá trị cốt lõi của bạn, không phải áp lực xã hội</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BƯỚC 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border-l-4" style={{ borderLeftColor: green }}>
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: mint, border: `2px solid ${green}` }}>🏗️</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: green }}>Bước 2</span>
                                        <span className="text-xs" style={{ color: '#4F4F4F' }}>· Vùng Đất Kiểm Soát</span>
                                    </div>
                                    <h3 className="font-black text-xl mb-3" style={{ color: navy }}>Xây dựng Cỗ máy tài chính</h3>
                                    <p className="text-sm leading-relaxed mb-5" style={{ color: '#4F4F4F' }}>5 trụ cột thực chiến — FinPeace giúp bạn theo dõi và tối ưu cả 5.</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {[
                                            { icon: '🌾', name: 'Thu nhập', label: 'Cánh đồng', desc: 'Tăng kỹ năng + tạo thu nhập thụ động' },
                                            { icon: '🌊', name: 'Chi tiêu & Tiết kiệm', label: 'Dòng sông', desc: 'PYF: cất 20% ngay khi nhận lương' },
                                            { icon: '🌿', name: 'Nợ nần', label: 'Đầm lầy', desc: 'Tránh nợ xấu, dùng nợ tốt đúng cách' },
                                            { icon: '🪴', name: 'Đầu tư', label: 'Khu vườn', desc: 'Kỷ luật đều đặn — không lướt sóng' },
                                            { icon: '🏰', name: 'Rủi ro', label: 'Hầm trú ẩn', desc: 'Quỹ khẩn cấp + bảo hiểm trước tiên' },
                                        ].map((t, i) => (
                                            <div key={i} className="rounded-xl p-3 text-center" style={{ background: mint }}>
                                                <span className="text-xl block mb-1">{t.icon}</span>
                                                <p className="text-[9px] font-bold uppercase tracking-wide mb-0.5" style={{ color: green }}>{t.label}</p>
                                                <p className="text-xs font-bold mb-1 leading-tight" style={{ color: navy }}>{t.name}</p>
                                                <p className="text-[10px] leading-snug" style={{ color: '#4F4F4F' }}>{t.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BƯỚC 3 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#EFF6FF', border: '2px solid #3B82F6' }}>🕊️</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">Bước 3</span>
                                        <span className="text-xs" style={{ color: '#4F4F4F' }}>· Vùng Đất Bình An</span>
                                    </div>
                                    <h3 className="font-black text-xl mb-3" style={{ color: navy }}>Sống tự do và hạnh phúc</h3>
                                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#4F4F4F' }}>Khi tiền không còn là nguồn lo âu — bạn có không gian để yêu thương tốt hơn.</p>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {[
                                            { icon: '💑', title: 'Vợ chồng minh bạch', desc: 'Không giấu giếm. Cùng lập kế hoạch. Không ngại nói chuyện về tiền.' },
                                            { icon: '👨‍👧', title: 'Dạy con về tiền', desc: 'Chia 3 phần: Tiết kiệm – Chi tiêu – Cho đi. Học từ sớm.' },
                                            { icon: '🙏', title: 'Báo hiếu đúng cách', desc: 'Làm trong khả năng. Đừng kiệt quệ vì áp lực — ba mẹ không muốn vậy.' },
                                        ].map((r, i) => (
                                            <div key={i} className="rounded-xl p-3" style={{ background: '#EFF6FF' }}>
                                                <span className="text-xl block mb-1.5">{r.icon}</span>
                                                <p className="text-xs font-bold mb-1" style={{ color: navy }}>{r.title}</p>
                                                <p className="text-[11px] leading-relaxed" style={{ color: '#4F4F4F' }}>{r.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── QUOTE / PHILOSOPHY ── */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <span className="text-5xl mb-6 block">🌿</span>
                    <blockquote className="text-2xl lg:text-3xl font-black leading-tight mb-6" style={{ color: navy }}>
                        &ldquo;Bình an tài chính không có nghĩa là bạn giàu có.
                        Nó có nghĩa là bạn biết mình đang ở đâu,
                        đang đi về đâu, và tự tin vào con đường đó.&rdquo;
                    </blockquote>
                    <p className="text-sm" style={{ color: '#4F4F4F' }}>— Triết lý của FinPeace</p>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20" style={{ background: green }}>
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">
                        Bắt đầu với bức tranh tài chính của bạn
                    </h2>
                    <p className="text-white/90 mb-8 text-lg">
                        Miễn phí. Không cần thẻ tín dụng. Mất 10 phút để có toàn cảnh.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 font-black px-10 py-4 rounded-lg transition-all hover:opacity-90 text-lg shadow-xl"
                        style={{ background: '#131946', color: 'white' }}
                    >
                        Tạo tài khoản miễn phí →
                    </Link>
                    <p className="text-white/70 text-xs mt-4">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="underline hover:text-white transition-colors">Đăng nhập tại đây</Link>
                    </p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-8" style={{ background: navy }}>
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <Image src="/logo.png" alt="FinPeace" width={100} height={18} />
                    <span>© 2025 FinPeace · Bình An Tài Chính</span>
                    <Link href="/knowledgebase" className="hover:text-white transition-colors">Thư Viện Kiến Thức →</Link>
                </div>
            </footer>
        </div>
    )
}
