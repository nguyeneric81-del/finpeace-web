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
                                className="border-2 rounded-2xl p-6 transition-all hover:shadow-md hover:border-emerald-400"
                                style={{ borderColor: 'rgba(56,198,139,0.2)' }}
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
                        <div className="bg-white rounded-3xl shadow-sm border-l-4 overflow-hidden" style={{ borderLeftColor: '#ff7d50' }}>
                            {/* Step header */}
                            <div className="p-8 border-b" style={{ borderColor: 'rgba(255,125,80,0.15)' }}>
                                <div className="flex items-start gap-5">
                                    <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: '#fff6f3', border: '2px solid #ff7d50' }}>🛑</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#ff7d50' }}>Bước 1</span>
                                            <span className="text-xs" style={{ color: '#4F4F4F' }}>· Vùng Đất Hoang</span>
                                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#fff6f3', color: '#ff7d50' }}>4 bài học</span>
                                        </div>
                                        <h3 className="font-black text-xl mb-2" style={{ color: navy }}>Dọn dẹp rào cản tâm lý</h3>
                                        <p className="text-sm leading-relaxed" style={{ color: '#4F4F4F' }}>
                                            Quản lý tiền bạc là <strong>80% Tâm lý</strong> và chỉ 20% Toán học. Trước khi lập bảng Excel, hãy dọn sạch &ldquo;bãi rác tâm lý&rdquo; đang kìm hãm bạn.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 4 bài học accordion */}
                            <div className="divide-y divide-orange-100">
                                {[
                                    {
                                        num: '01',
                                        emoji: '🧮',
                                        title: 'Lời nói dối của chiếc máy tính',
                                        hook: 'Tại sao bạn cộng trừ rất giỏi, nhưng tài khoản thì luôn bằng 0?',
                                        core: 'Quản lý tiền bạc là 80% Tâm lý và chỉ có 20% là Toán học.',
                                        quote: 'Tôi từng tin rằng nếu học thêm một khóa Excel, dùng thêm một app quản lý chi tiêu, mọi thứ sẽ thay đổi. Mãi đến khi tôi nhận ra mình đang né tránh một câu hỏi thực sự khó hơn nhiều: Tôi đang sợ điều gì?',
                                        content: 'Công thức ai cũng biết: Thu nhập - Chi tiêu = Tiết kiệm (phép tính lớp 3). Giống như giảm cân là Ăn ít - Tập nhiều. Tại sao biết mà không làm được? Vì khi đứng trước áo Sale 50% hay lúc buồn chán, não bộ không dùng toán học — mà dùng cảm xúc. Đừng cố lập Excel phức tạp khi "bãi rác tâm lý" chưa được dọn dẹp.',
                                        cta: '💭 Nhớ lại lần gần nhất bạn mua đồ đắt rồi hối hận — bạn tính sai giá, hay cảm xúc mách "chốt đơn đi"?',
                                    },
                                    {
                                        num: '02',
                                        emoji: '💊',
                                        title: '"Thuốc giảm đau" mang tên Mua sắm',
                                        hook: 'Bạn đang mua món đồ đó, hay đang mua "thuốc giảm đau" cho cảm xúc?',
                                        core: 'Dùng tiền để xoa dịu cảm xúc sẽ tạo ra vòng lặp nghèo khó.',
                                        quote: 'Lần đó tôi vừa bị sếp chỉ trích trước cả phòng. Trên đường về, tôi đặt một đơn hàng 800 nghìn đồng. Khi hàng về, tôi chẳng còn nhớ mình đã đặt gì. Đó là lúc tôi hiểu ra — tôi không mua quần áo. Tôi đang mua sự bình yên tạm thời.',
                                        content: 'Vòng lặp ác tính: Ngày làm việc mệt, sếp mắng → Lướt Shopee chốt đơn để "chữa lành" → Tài khoản cạn → Cảm giác tội lỗi, stress → Lại tiêu để xoa dịu. Dopamine lúc chốt đơn chỉ kéo dài 5 phút — nhưng hóa đơn thẻ tín dụng ám ảnh cả tháng.',
                                        cta: '🧊 Thử thách "Đóng băng 48h": Khi định mua thứ không thiết yếu, bỏ vào giỏ hàng và đợi 48 tiếng. Nếu cơn bốc đồng qua đi — đó chính xác là chi tiêu cảm xúc cần cắt.',
                                    },
                                    {
                                        num: '03',
                                        emoji: '🎭',
                                        title: 'Bạn đang trả tiền cho "vở kịch" của ai?',
                                        hook: 'Bạn đang trả góp cho cuộc đời bạn, hay trả góp cho "ước mơ của người khác"?',
                                        core: 'Ngừng dùng tiền xương máu của mình để mua ánh nhìn của người khác.',
                                        quote: 'Tôi có một người bạn luôn đăng ảnh du lịch đẹp. Chúng tôi không nói chuyện nhiều. Vậy mà mỗi khi thấy story của anh ấy, tôi lại thấy tài khoản của mình bị co rút lại. Tôi đang chi tiêu cho cuộc đời của tôi, hay đang diễn một vở kịch mà tôi không nhớ là mình đã đăng ký vai?',
                                        content: 'Nhiều người vay trả góp đổi iPhone mới nhất, mua xe xịn, du lịch sang chảnh — chỉ để "bằng bạn bằng bè", dù ví đang "khóc thét". Đây là khoản đầu tư lỗ nặng nhất cuộc đời: dùng tiền mồ hôi để mua "sự công nhận" giả tạo từ những người thực sự không quan tâm đến bạn.',
                                        cta: '🏝️ Trò chơi "Hòn đảo hoang": Hãy nhìn món đồ đắt nhất bạn định mua. Nếu ngày mai ra đảo hoang — không ai nhìn thấy để khen hay chê — bạn có còn muốn mua không? Nếu không, bạn đang mua vì người khác.',
                                    },
                                    {
                                        num: '04',
                                        emoji: '🏮',
                                        title: '"Ngọn hải đăng" bảo vệ tài khoản',
                                        hook: 'Bí quyết để việc "Tiết kiệm" trở nên kiêu hãnh thay vì khổ sở.',
                                        core: 'Kỷ luật thép rồi cũng sẽ nản — chỉ có "Ước mơ chân thật" mới neo giữ được tiền của bạn.',
                                        quote: 'Khi được hỏi “Bạn muốn gì?”, hầu hết mọi người trả lời bằng những thứ người khác muốn cho họ: nhà đẹp, xe xịn, địa vị. Ước mơ chân thật thường nhỏ hơn, yên tĩnh hơn — và chính xác vì vậy, nó mới đủ mạnh để thay đổi hành vi của bạn.',
                                        content: 'Não bộ ghét việc "thắt lưng buộc bụng" vì coi đó là sự tước đoạt niềm vui. Kỷ luật bằng ý chí suông chắc chắn thất bại. Giải pháp: gắn tiền với GIÁ TRỊ CỐT LÕI của BẠN — sự an tâm khi cha mẹ ốm đau, quỹ "Tự do" để tự tin nghỉ việc nếu môi trường độc hại, nghỉ hưu sớm về quê trồng rau... Khi từ chối một cuộc nhậu hay món đồ hiệu — đó không còn là tủi thân. Đó là sự kiêu hãnh vì bạn đang bảo vệ ước mơ của chính mình.',
                                        cta: '✍️ Nhắm mắt và viết ra 1 điều khiến bạn hạnh phúc nhất mà không cần chứng minh với ai. Đó chính là "Ước mơ chân thật" — cơ sở để thiết kế Bước 2.',
                                    },
                                ].map((lesson, i) => (
                                    <details key={i} className="group">
                                        <summary className="flex items-center gap-4 px-8 py-5 cursor-pointer list-none hover:bg-orange-50/50 transition-colors">
                                            <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black" style={{ background: '#fff6f3', color: '#ff7d50' }}>
                                                {lesson.emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#ff7d50' }}>Bài học {lesson.num}</span>
                                                </div>
                                                <p className="font-bold text-sm leading-tight" style={{ color: navy }}>{lesson.hook}</p>
                                            </div>
                                            <span className="shrink-0 text-lg transition-transform group-open:rotate-90" style={{ color: '#ff7d50' }}>›</span>
                                        </summary>
                                        <div className="px-8 pb-6 pt-2">
                                            <div className="ml-13 pl-4 border-l-2" style={{ borderColor: '#ff7d5040' }}>
                                                <div className="mb-4 px-3 py-2 rounded-lg inline-block" style={{ background: '#fff6f3' }}>
                                                    <p className="text-xs font-bold" style={{ color: '#ff7d50' }}>💡 Thông điệp cốt lõi</p>
                                                    <p className="text-sm font-semibold mt-0.5" style={{ color: navy }}>{lesson.core}</p>
                                                </div>
                                                <div className="mb-4 rounded-xl p-4" style={{ background: 'rgba(19,25,70,0.04)', borderLeft: `3px solid ${navy}` }}>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: navy }}>📖 Trích sách “Bình An Tài Chính”</p>
                                                    <p className="text-sm italic leading-relaxed" style={{ color: '#131946CC' }}>“{lesson.quote}”</p>
                                                </div>
                                                <p className="text-sm leading-relaxed mb-4" style={{ color: '#4F4F4F' }}>{lesson.content}</p>
                                                <div className="rounded-xl p-4" style={{ background: mint }}>
                                                    <p className="text-sm leading-relaxed" style={{ color: navy }}>{lesson.cta}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                ))}
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
