import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FinPeace — Bình An Tài Chính Cá Nhân',
    description: 'Hiểu rõ bức tranh tài chính của mình. Lập kế hoạch cho tương lai. Sống bình an với tiền bạc — không lo âu, không mơ hồ.',
}

// ── SVG Icons ──────────────────────────────────────────────────
type IconProps = { className?: string; style?: React.CSSProperties }

const IconTrendingUp = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
)
const IconShield = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)
const IconMap = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
)
const IconActivity = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
)
const IconAlertCircle = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)
const IconEye = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)
const IconTarget = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
)
const IconChevronRight = ({ className = 'w-4 h-4', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)
const IconCheck = ({ className = 'w-4 h-4', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const IconStar = ({ className = 'w-4 h-4', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)
const IconLightbulb = ({ className = 'w-5 h-5', style }: IconProps) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
)

// ── Data ──────────────────────────────────────────────────────
const GREEN = '#38C68B'
const NAVY = '#131946'
const DARK = '#0D1117'
const ORANGE = '#ff7d50'
const MINT = '#38C68B1A'

const PAIN_POINTS = [
    {
        Icon: IconAlertCircle,
        title: 'Tháng nào cũng lo tiền',
        desc: 'Thu nhập không ít, nhưng cuối tháng tài khoản vẫn về 0. Không hiểu tiền đi đâu hết.',
        color: ORANGE,
        bg: '#fff6f3',
    },
    {
        Icon: IconEye,
        title: 'Không có bức tranh tổng thể',
        desc: 'Tài sản nằm rải rác — sổ tiết kiệm, cổ phiếu, bất động sản — nhưng không biết mình đang ở đâu.',
        color: '#3B82F6',
        bg: '#EFF6FF',
    },
    {
        Icon: IconTarget,
        title: 'Tương lai mơ hồ',
        desc: 'Muốn nghỉ hưu sớm, mua nhà, cho con học tốt — nhưng không biết bắt đầu từ đâu và cần bao nhiêu.',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
]

const FEATURES = [
    {
        Icon: IconActivity,
        title: '4 Chỉ Số Sinh Tồn',
        desc: 'Net Worth, Tỷ lệ nợ, Quỹ khẩn cấp, Tỷ lệ tiết kiệm — bộ tứ chỉ số quyết định sức khỏe tài chính thực sự.',
        tag: 'Vital Signs',
    },
    {
        Icon: IconTrendingUp,
        title: 'Khu Vườn Đầu Tư',
        desc: '1 tháng tiết kiệm 3 triệu sẽ trở thành bao nhiêu sau 20 năm — lãi kép được trực quan hóa theo thời gian thực.',
        tag: 'Investment Garden',
    },
    {
        Icon: IconShield,
        title: 'Stress Test Tài Chính',
        desc: 'Nếu bạn mất việc 6 tháng, thị trường giảm 40%, lãi suất tăng gấp đôi — tài chính của bạn có trụ được không?',
        tag: 'Stress Test',
    },
    {
        Icon: IconMap,
        title: 'Kế Hoạch Tài Chính',
        desc: 'Từ mục tiêu (nghỉ hưu, mua nhà, học bổng con) đến kế hoạch hành động cụ thể với con số thực tế.',
        tag: 'Wealth Planning',
    },
]

const STEPS = [
    {
        step: 'Bước 1',
        zone: 'Vùng Đất Hoang',
        title: 'Dọn dẹp rào cản tâm lý',
        desc: 'Quản lý tiền bạc là 80% Tâm lý và chỉ 20% Toán học. Trước khi lập bảng Excel, hãy dọn sạch "bãi rác tâm lý" đang kìm hãm bạn.',
        count: '4 bài học',
        accent: ORANGE,
        bg: '#fff6f3',
        hoverBg: 'rgba(255,125,80,0.05)',
        lessons: [
            { num: '01', title: 'Lời nói dối của chiếc máy tính', hook: 'Tại sao bạn cộng trừ rất giỏi, nhưng tài khoản thì luôn bằng 0?', core: 'Quản lý tiền bạc là 80% Tâm lý và chỉ có 20% là Toán học.', quote: 'Tôi từng tin rằng nếu học thêm một khóa Excel, dùng thêm một app quản lý chi tiêu, mọi thứ sẽ thay đổi. Mãi đến khi tôi nhận ra mình đang né tránh một câu hỏi thực sự khó hơn nhiều: Tôi đang sợ điều gì?', content: 'Công thức ai cũng biết: Thu nhập - Chi tiêu = Tiết kiệm (phép tính lớp 3). Giống như giảm cân là Ăn ít - Tập nhiều. Tại sao biết mà không làm được? Vì khi đứng trước áo Sale 50% hay lúc buồn chán, não bộ không dùng toán học — mà dùng cảm xúc.', cta: 'Nhớ lại lần gần nhất bạn mua đồ đắt rồi hối hận — bạn tính sai giá, hay cảm xúc mách "chốt đơn đi"?' },
            { num: '02', title: '"Thuốc giảm đau" mang tên Mua sắm', hook: 'Bạn đang mua món đồ đó, hay đang mua "thuốc giảm đau" cho cảm xúc?', core: 'Dùng tiền để xoa dịu cảm xúc sẽ tạo ra vòng lặp nghèo khó.', quote: 'Lần đó tôi vừa bị sếp chỉ trích trước cả phòng. Trên đường về, tôi đặt một đơn hàng 800 nghìn đồng. Khi hàng về, tôi chẳng còn nhớ mình đã đặt gì.', content: 'Vòng lặp ác tính: Ngày làm việc mệt, sếp mắng → Lướt Shopee chốt đơn để "chữa lành" → Tài khoản cạn → Cảm giác tội lỗi, stress → Lại tiêu để xoa dịu.', cta: 'Thử thách "Đóng băng 48h": Khi định mua thứ không thiết yếu, bỏ vào giỏ hàng và đợi 48 tiếng. Nếu cơn bốc đồng qua đi — đó chính xác là chi tiêu cảm xúc cần cắt.' },
            { num: '03', title: 'Bạn đang trả tiền cho "vở kịch" của ai?', hook: 'Bạn đang trả góp cho cuộc đời bạn, hay trả góp cho "ước mơ của người khác"?', core: 'Ngừng dùng tiền xương máu của mình để mua ánh nhìn của người khác.', quote: 'Tôi có một người bạn luôn đăng ảnh du lịch đẹp. Vậy mà mỗi khi thấy story của anh ấy, tôi lại thấy tài khoản của mình bị co rút lại.', content: 'Nhiều người vay trả góp đổi iPhone mới nhất, mua xe xịn, du lịch sang chảnh — chỉ để "bằng bạn bằng bè", dù ví đang "khóc thét".', cta: 'Hãy nhìn món đồ đắt nhất bạn định mua. Nếu ngày mai ra đảo hoang — không ai nhìn thấy để khen hay chê — bạn có còn muốn mua không?' },
            { num: '04', title: '"Ngọn hải đăng" bảo vệ tài khoản', hook: 'Bí quyết để việc "Tiết kiệm" trở nên kiêu hãnh thay vì khổ sở.', core: 'Kỷ luật thép rồi cũng sẽ nản — chỉ có "Ước mơ chân thật" mới neo giữ được tiền của bạn.', quote: 'Ước mơ chân thật thường nhỏ hơn, yên tĩnh hơn — và chính xác vì vậy, nó mới đủ mạnh để thay đổi hành vi của bạn.', content: 'Não bộ ghét việc "thắt lưng buộc bụng" vì coi đó là sự tước đoạt niềm vui. Giải pháp: gắn tiền với GIÁ TRỊ CỐT LÕI của BẠN.', cta: 'Nhắm mắt và viết ra 1 điều khiến bạn hạnh phúc nhất mà không cần chứng minh với ai. Đó chính là "Ước mơ chân thật".' },
        ],
    },
    {
        step: 'Bước 2',
        zone: 'Vùng Đất Kiểm Soát',
        title: 'Xây dựng Cỗ máy tài chính',
        desc: 'Thu nhập là nhiên liệu, nhưng 5 trụ cột này mới là cỗ máy — FinPeace giúp bạn theo dõi và tối ưu từng trụ cột một.',
        count: '5 bài học',
        accent: GREEN,
        bg: MINT,
        hoverBg: 'rgba(56,198,139,0.05)',
        lessons: [
            { num: '01', title: 'CÁNH ĐỒNG — Thu nhập', hook: 'Kỹ năng mới là cỗ máy in tiền thực sự — không phải tờ lương bạn nhận mỗi tháng.', core: 'Thu nhập đến từ Vốn con người (kỹ năng, thời gian) và Vốn tài chính (tài sản sinh lời).', quote: 'Thu nhập là nhiên liệu khởi đầu để cỗ máy chạy, nhưng kỹ năng mới là cỗ máy in tiền thực sự.', content: 'Khi còn trẻ, bạn dùng Vốn con người — đi làm đổi thời gian lấy tiền. Nhưng sức người và thời gian là hữu hạn.', cta: 'Giai đoạn 1: Đầu tư vào kỹ năng để tăng giá trị sức lao động. Giai đoạn 2: Dùng một phần thu nhập mua tài sản sinh lời.' },
            { num: '02', title: 'DÒNG SÔNG — Chi tiêu & Tiết kiệm', hook: 'Người ta không giàu lên nhờ số tiền kiếm được — mà nhờ số tiền giữ lại được.', core: 'Tiết kiệm không phải "sự hy sinh" hay "kìm nén", mà là hành động yêu thương bản thân trong tương lai.', quote: 'Người ta không giàu lên nhờ số tiền kiếm được, mà giàu lên nhờ số tiền giữ lại được.', content: 'Tiền bạc giống một dòng sông: thu nhập là nước chảy vào, chi tiêu là nước tràn ra, tiết kiệm là hồ chứa bạn xây.', cta: 'Ngay khi nhận lương, áp dụng PYF (Pay Yourself First): tự động trích tối thiểu 20% vào tài khoản tiết kiệm trước.' },
            { num: '03', title: 'ĐẦM LẦY — Nợ nần', hook: 'Nợ là xiềng xích nếu dùng sai — nhưng là đòn bẩy nếu dùng đúng.', core: 'Nợ xấu mua tiêu sản kéo bạn xuống vũng lầy. Nợ tốt mua tài sản sinh lời là con đường tắt đến giàu có.', quote: 'Nợ là xiềng xích nếu dùng sai, nhưng là đòn bẩy nếu dùng đúng.', content: 'Warren Buffett từng nói: "Nợ tốt là nợ giúp bạn giàu lên, nợ xấu là nợ làm bạn nghèo đi."', cta: 'Tuyệt đối tránh xa nợ xấu. Nguyên tắc sống còn: khoản trả nợ hàng tháng KHÔNG BAO GIỜ vượt quá 30–40% thu nhập.' },
            { num: '04', title: 'KHU VƯỜN — Đầu tư', hook: 'Đầu tư không phải sòng bạc để lướt sóng — mà là khu vườn cần sự kiên nhẫn.', core: 'Thách thức lớn nhất không phải đánh bại thị trường — mà là ngăn bản thân trở thành kẻ thù của chính mình.', quote: 'Đầu tư không phải là sòng bạc để lướt sóng, mà là một khu vườn cần sự kiên nhẫn.', content: 'Tiền để trong két sắt hay ngân hàng sẽ bị lạm phát gặm nhấm — đầu tư là việc gieo hạt giống tiền bạc để nó nảy mầm.', cta: 'Trở thành người làm vườn kiên nhẫn bằng DCA: trích một số tiền cố định mỗi tháng mua tài sản tự động, bất chấp thị trường lên hay xuống.' },
            { num: '05', title: 'HẦM TRÚ ẨN — Rủi ro', hook: 'Bạn không thể ngăn cơn bão ập đến — nhưng bạn có thể xây một hầm trú ẩn vững chắc.', core: 'Đầu tư mà không có hầm trú ẩn thì giống như xây lâu đài trên cát.', quote: 'Bạn không thể ngăn cơn bão ập đến, nhưng bạn có thể xây một hầm trú ẩn vững chắc.', content: 'Rủi ro (mất việc, ốm đau, thị trường sụp đổ) là điều tất yếu của cuộc sống.', cta: 'Xây hầm trú ẩn 2 lớp: (1) Quỹ khẩn cấp: 6–12 tháng chi phí sinh hoạt. (2) Bảo hiểm y tế/sức khỏe và nhân thọ nếu là trụ cột.' },
        ],
    },
    {
        step: 'Bước 3',
        zone: 'Vùng Đất Bình An',
        title: 'Sống tự do và hạnh phúc',
        desc: 'Khi tiền không còn là nguồn lo âu — bạn có không gian để yêu thương tốt hơn, dạy con khôn ngoan hơn và báo hiếu từ trái tim.',
        count: '3 bài học',
        accent: '#3B82F6',
        bg: '#EFF6FF',
        hoverBg: 'rgba(59,130,246,0.05)',
        lessons: [
            { num: '01', title: 'Vợ chồng minh bạch', hook: 'Tiền bạc là cầu nối, không phải bức tường — nhưng chỉ khi hai người dám nói thật với nhau.', core: 'Sắp xếp tài chính minh bạch, chân thành không làm mất đi sự lãng mạn.', quote: 'Hôn nhân là một sự hợp tác, và sự hợp tác này khó có thể đi đến thành công nếu không lên kế hoạch như một đội.', content: 'Ở Việt Nam, ly hôn do yếu tố kinh tế chiếm đến 13%. Nhiều cặp vợ chồng coi tiền bạc là chủ đề "cấm kỵ".', cta: 'Tạo không gian an toàn để nói chuyện về tiền — không phán xét, mở lòng thấu hiểu thói quen chi tiêu của nhau.' },
            { num: '02', title: 'Dạy con về tiền', hook: 'Hãy dạy con về tiền bạc trước khi cuộc sống làm điều đó một cách khắc nghiệt.', core: 'Dạy con về tiền không phải là gieo áp lực, mà là tiêm một "liều vắc-xin" để con tự lập và vững vàng.', quote: 'Hãy dạy con bạn về tiền bạc trước khi cuộc sống làm điều đó một cách khắc nghiệt.', content: 'Nghiên cứu chỉ ra trẻ bắt đầu hình thành thói quen tài chính từ năm 7 tuổi — đây chính là cửa sổ vàng.', cta: 'Quy tắc 3 lọ từ tiền tiêu vặt: Tiết kiệm (mục tiêu lớn) + Chi tiêu (nhu cầu cá nhân) + Cho đi (từ thiện).' },
            { num: '03', title: 'Báo hiếu đúng cách', hook: 'Cách báo hiếu ý nghĩa nhất là sống sao cho cha mẹ tự hào — không phải oằn mình gửi tiền về.', core: 'Một người con độc lập, hạnh phúc, không nợ nần mang lại sự an tâm cho cha mẹ lớn hơn rất nhiều.', quote: 'Cách báo hiếu ý nghĩa nhất là sống sao cho cha mẹ tự hào. Sự phát triển và hiện diện của bạn còn quý hơn những món quà đắt tiền.', content: 'Rất nhiều người trẻ mang áp lực nặng nề phải cắt 20% thu nhập gửi về cho bố mẹ dù bản thân đang chật vật.', cta: 'Đưa "quỹ báo hiếu" vào ngân sách (5–10% thu nhập): trích ra một tỷ lệ vừa sức để sẵn sàng khi cha mẹ cần.' },
        ],
    },
]

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>

            {/* ── NAV ── */}
            <nav style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="FinPeace" width={130} height={22} priority className="brightness-0 invert" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-semibold transition-all duration-200 hover:text-white"
                            style={{ color: 'rgba(255,255,255,0.65)' }}
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
                            style={{ background: GREEN, color: '#fff' }}
                        >
                            Bắt đầu miễn phí
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section
                style={{
                    background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 60%, #1a2e5c 100%)`,
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="py-28"
            >
                {/* Background glow blobs */}
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56,198,139,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div className="max-w-6xl mx-auto px-6 relative">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left */}
                        <div>
                            <div
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8"
                                style={{ background: 'rgba(56,198,139,0.15)', color: GREEN, border: '1px solid rgba(56,198,139,0.3)' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
                                Tài chính cá nhân · Kế hoạch hóa · Bình an
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 text-white">
                                Bạn kiếm đủ tiền.<br />
                                <span style={{ color: GREEN }}>Tại sao vẫn lo?</span>
                            </h1>

                            <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                FinPeace giúp bạn nhìn rõ bức tranh tài chính của mình — không phán xét, không phức tạp. Chỉ là sự rõ ràng bạn cần để sống bình an với tiền bạc.
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 shadow-lg text-white"
                                    style={{ background: GREEN, boxShadow: `0 0 30px rgba(56,198,139,0.35)` }}
                                >
                                    Bắt đầu miễn phí
                                    <IconChevronRight className="w-4 h-4" />
                                </Link>
                                <span className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    <IconCheck className="w-3.5 h-3.5" style={{ color: GREEN }} />
                                    Không cần thẻ tín dụng
                                </span>
                            </div>

                            {/* Trust signals */}
                            <div className="flex items-center gap-1 mt-8">
                                {[...Array(5)].map((_, i) => (
                                    <IconStar key={i} className="w-3.5 h-3.5" style={{ color: '#FBBF24' }} />
                                ))}
                                <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    Trusted bởi hàng nghìn người dùng
                                </span>
                            </div>
                        </div>

                        {/* Right — Glass stat cards */}
                        <div className="flex flex-col gap-4">
                            {[
                                { label: 'Net Worth', value: '+₫2.4 tỷ', color: GREEN, sub: 'Tài sản ròng', icon: IconTrendingUp },
                                { label: 'Quỹ khẩn cấp', value: '8.2 tháng', color: '#3B82F6', sub: 'Chi phí sinh hoạt', icon: IconShield },
                                { label: 'Tỷ lệ tiết kiệm', value: '34%', color: '#8B5CF6', sub: 'Thu nhập hàng tháng', icon: IconActivity },
                            ].map((s, i) => {
                                const SIcon = s.icon
                                return (
                                    <div
                                        key={i}
                                        className="rounded-2xl px-6 py-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(12px)',
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                                                <SIcon className="w-5 h-5" style={{ color: s.color }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
                                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-2xl" style={{ color: s.color }}>
                                            {s.value}
                                        </p>
                                    </div>
                                )
                            })}

                            {/* Mini chart preview */}
                            <div
                                className="rounded-2xl p-5 mt-1"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-white">Lộ trình tài sản</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(56,198,139,0.15)', color: GREEN }}>+18% YoY</span>
                                </div>
                                <svg viewBox="0 0 200 50" className="w-full" style={{ height: '40px' }}>
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={GREEN} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0 45 C20 40 40 35 60 30 S100 20 120 18 S160 12 200 5" fill="none" stroke={GREEN} strokeWidth="2" />
                                    <path d="M0 45 C20 40 40 35 60 30 S100 20 120 18 S160 12 200 5 L200 50 L0 50 Z" fill="url(#chartGrad)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PAIN POINTS ── */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Bạn có nhận ra mình không?</p>
                        <h2 className="text-4xl font-black mb-3" style={{ color: NAVY }}>
                            Thu nhập tốt nhưng tài chính vẫn <span style={{ color: ORANGE }}>không ổn</span>
                        </h2>
                        <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>Đây không phải lỗi của bạn — mà là thiếu công cụ đúng.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {PAIN_POINTS.map((p, i) => {
                            const PIcon = p.Icon
                            return (
                                <div
                                    key={i}
                                    className="rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
                                    style={{ background: p.bg, border: `1px solid ${p.color}20` }}
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${p.color}15` }}>
                                        <PIcon className="w-5 h-5" style={{ color: p.color } as React.CSSProperties} />
                                    </div>
                                    <h3 className="font-bold text-base mb-2" style={{ color: NAVY }}>{p.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{p.desc}</p>
                                </div>
                            )
                        })}
                    </div>

                    {/* Insight box */}
                    <div
                        className="rounded-2xl p-6 flex items-start gap-4"
                        style={{ background: MINT, border: `1px solid rgba(56,198,139,0.2)` }}
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(56,198,139,0.2)' }}>
                            <IconLightbulb className="w-5 h-5" style={{ color: GREEN } as React.CSSProperties} />
                        </div>
                        <div>
                            <p className="font-bold mb-1" style={{ color: NAVY }}>Vấn đề không phải là thu nhập của bạn.</p>
                            <p className="text-sm leading-relaxed" style={{ color: '#4F4F4F' }}>
                                Hầu hết người có tài chính lộn xộn không phải vì kiếm ít — mà vì <em style={{ color: NAVY, fontStyle: 'normal', fontWeight: 700 }}>không có bức tranh rõ ràng</em>. Khi bạn nhìn thấy số liệu thực tế, mọi thứ sẽ thay đổi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-24" style={{ background: '#F8FAFB' }}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>FinPeace cung cấp</p>
                        <h2 className="text-4xl font-black mb-3" style={{ color: NAVY }}>Bức tranh tài chính đầy đủ</h2>
                        <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>Không chỉ là số dư ngân hàng. Đây là toàn cảnh sức khỏe tài chính của bạn.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {FEATURES.map((f, i) => {
                            const FIcon = f.Icon
                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default"
                                    style={{ border: '1px solid rgba(19,25,70,0.07)' }}
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: MINT }}>
                                            <FIcon className="w-6 h-6" style={{ color: GREEN }} />
                                        </div>
                                        <span
                                            className="text-xs font-bold px-3 py-1 rounded-full"
                                            style={{ background: MINT, color: GREEN }}
                                        >
                                            {f.tag}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2" style={{ color: NAVY }}>{f.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── BẢN ĐỒ 3 BƯỚC ── */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Từ sách &ldquo;Bình An Tài Chính&rdquo;</p>
                        <h2 className="text-4xl font-black mb-3" style={{ color: NAVY }}>Bản Đồ 3 Bước Đến Bình An</h2>
                        <p className="text-base max-w-xl mx-auto" style={{ color: '#6B7280' }}>Không phải về việc kiếm được bao nhiêu — đây là hành trình từ lo âu đến tự do.</p>
                    </div>

                    <div className="space-y-5">
                        {STEPS.map((step, si) => (
                            <div
                                key={si}
                                className="rounded-3xl overflow-hidden"
                                style={{ border: `1px solid ${step.accent}25`, boxShadow: `0 0 0 1px ${step.accent}10` }}
                            >
                                {/* Step header */}
                                <div className="p-8" style={{ background: step.bg, borderBottom: `1px solid ${step.accent}15` }}>
                                    <div className="flex items-start gap-5">
                                        <div
                                            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg"
                                            style={{ background: `${step.accent}20`, color: step.accent, border: `2px solid ${step.accent}40` }}
                                        >
                                            {si + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="text-xs font-black uppercase tracking-widest" style={{ color: step.accent }}>{step.step}</span>
                                                <span className="text-xs" style={{ color: '#9CA3AF' }}>· {step.zone}</span>
                                                <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-bold" style={{ background: `${step.accent}15`, color: step.accent }}>
                                                    {step.count}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-xl mb-2" style={{ color: NAVY }}>{step.title}</h3>
                                            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{step.desc}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lessons accordion */}
                                <div className="bg-white divide-y" style={{ borderColor: `${step.accent}10` }}>
                                    {step.lessons.map((lesson, li) => (
                                        <details key={li} className="group">
                                            <summary
                                                className="flex items-center gap-4 px-8 py-5 cursor-pointer list-none transition-all duration-200 hover:bg-gray-50"
                                                style={{ outline: 'none' }}
                                            >
                                                <div
                                                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                                                    style={{ background: `${step.accent}15`, color: step.accent }}
                                                >
                                                    {lesson.num}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm leading-snug" style={{ color: NAVY }}>{lesson.hook}</p>
                                                </div>
                                                <span
                                                    className="shrink-0 transition-transform duration-200 group-open:rotate-90"
                                                    style={{ color: step.accent }}
                                                >
                                                    <IconChevronRight className="w-4 h-4" />
                                                </span>
                                            </summary>
                                            <div className="px-8 pb-7 pt-3 bg-white">
                                                <div className="ml-12 space-y-4">
                                                    <div className="rounded-xl px-4 py-3 inline-block" style={{ background: `${step.accent}10` }}>
                                                        <p className="text-xs font-bold mb-0.5" style={{ color: step.accent }}>Thông điệp cốt lõi</p>
                                                        <p className="text-sm font-semibold" style={{ color: NAVY }}>{lesson.core}</p>
                                                    </div>
                                                    <div className="rounded-xl p-4" style={{ background: 'rgba(19,25,70,0.03)', borderLeft: `3px solid ${NAVY}30` }}>
                                                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Trích sách &ldquo;Bình An Tài Chính&rdquo;</p>
                                                        <p className="text-sm italic leading-relaxed" style={{ color: '#4B5563' }}>&ldquo;{lesson.quote}&rdquo;</p>
                                                    </div>
                                                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{lesson.content}</p>
                                                    <div className="rounded-xl p-4" style={{ background: `${step.accent}08`, border: `1px solid ${step.accent}20` }}>
                                                        <p className="text-sm leading-relaxed font-medium" style={{ color: NAVY }}>{lesson.cta}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUOTE ── */}
            <section className="py-24" style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 100%)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(56,198,139,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div className="max-w-3xl mx-auto px-6 text-center relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(56,198,139,0.15)', border: '1px solid rgba(56,198,139,0.3)' }}>
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2">
                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                        </svg>
                    </div>
                    <blockquote className="text-2xl lg:text-3xl font-black leading-tight mb-6 text-white">
                        &ldquo;Bình an tài chính không có nghĩa là bạn giàu có. Nó có nghĩa là bạn biết mình đang ở đâu, đang đi về đâu, và tự tin vào con đường đó.&rdquo;
                    </blockquote>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>— Triết lý của FinPeace</p>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div
                        className="rounded-3xl p-12"
                        style={{
                            background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 100%)`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at top, rgba(56,198,139,0.15) 0%, transparent 60%)`, pointerEvents: 'none' }} />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(56,198,139,0.15)', color: GREEN, border: '1px solid rgba(56,198,139,0.3)' }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
                                Miễn phí · Không cần thẻ tín dụng
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">
                                Bắt đầu với bức tranh tài chính của bạn
                            </h2>
                            <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                Mất 10 phút để có toàn cảnh. Miễn phí mãi mãi.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 font-black px-10 py-4 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 text-white"
                                    style={{ background: GREEN, boxShadow: `0 0 30px rgba(56,198,139,0.4)` }}
                                >
                                    Tạo tài khoản miễn phí →
                                </Link>
                            </div>
                            <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Đã có tài khoản?{' '}
                                <Link href="/login" className="underline transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>Đăng nhập tại đây</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: DARK, borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Image src="/logo.png" alt="FinPeace" width={110} height={19} className="brightness-0 invert opacity-70" />
                        <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            <Link href="/knowledgebase" className="hover:text-white transition-colors duration-200 cursor-pointer" style={{ color: 'rgba(255,255,255,0.35)' }}>Thư Viện Kiến Thức</Link>
                            <Link href="/login" className="hover:text-white transition-colors duration-200 cursor-pointer" style={{ color: 'rgba(255,255,255,0.35)' }}>Đăng nhập</Link>
                            <span>© 2025 FinPeace · Bình An Tài Chính</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
