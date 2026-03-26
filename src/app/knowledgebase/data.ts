// FinPeace Knowledge Base — Content Data Structure
// T-Shaped Learning Architecture: Foundation → Specialization → Mastery

export type Track = 'foundation' | 'investor' | 'trader' | 'mastery' | 'legend'
export type Level = 1 | 2 | 3

export interface ContentBlockItem {
    icon: string
    title: string
    body: string
    highlight?: string   // optional: con số / metric nổi bật
}

export interface ContractClause {
    number: string      // e.g. "Điều 1"
    label: string       // e.g. "Nhận thức về Cảm xúc"
    content: string     // nội dung điều khoản
    fillable?: boolean  // có ô điền không?
}

export interface CandlePatternItem {
    name: string        // tên mô hình (tiếng Việt)
    signal: 'bullish' | 'bearish' | 'neutral'  // tín hiệu
    candles: CandleShape[]  // mảng 1-3 hình nến
    desc: string        // mô tả ngắn
}

export interface CandleShape {
    color: 'green' | 'red' | 'gray'  // màu thân nến
    bodyH: number       // chiều cao thân (0-60)
    bodyY: number       // vị trí top của thân (0-80)
    shadowTop: number   // chiều dài bóng trên (0-40)
    shadowBot: number   // chiều dài bóng dưới (0-40)
}

export interface ContentBlock {
    type: 'intro' | 'key-insight' | 'concept' | 'quote' | 'checklist' | 'warning' | 'summary' | 'steps' | 'candle-patterns' | 'contract'
    title?: string
    content: string | string[]
    author?: string
    source?: string
    items?: ContentBlockItem[]       // dùng cho type: 'steps'
    patterns?: CandlePatternItem[]   // dùng cho type: 'candle-patterns'
    clauses?: ContractClause[]       // dùng cho type: 'contract'
    signatureFields?: string[]       // dùng cho type: 'contract' — các dòng ký tên
}

export interface Article {
    slug: string
    title: string
    summary: string
    readTime: number // minutes
    difficulty: 'Cơ bản' | 'Trung cấp' | 'Nâng cao'
    tags: string[]
    references?: string[] // Sách/tác giả tham khảo
}

export interface Pillar {
    id: string
    slug: string
    title: string
    subtitle: string
    description: string
    track: Track
    level: Level
    icon: string
    color: string           // Tailwind bg color class
    accentColor: string     // Tailwind text color class
    borderColor: string
    articleCount: number
    articles: Article[]
}

// ─── DATA ───────────────────────────────────────────────────────────────────

export const PILLARS: Pillar[] = [
    // ── LEVEL 1: FOUNDATION ──────────────────────────────────────────────────
    {
        id: 'personal-finance',
        slug: 'tai-chinh-ca-nhan',
        title: 'Tài Chính Cá Nhân',
        subtitle: 'Personal Finance & Wealth Building',
        description: 'Học cách giữ tiền trước khi học cách nhân tiền. Xóa mù tài chính, thoát nợ xấu, xây dựng quỹ khẩn cấp và thiết lập hệ thống tự động hóa dòng tiền.',
        track: 'foundation',
        level: 1,
        icon: '💰',
        color: 'bg-amber-50',
        accentColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        articleCount: 7,
        articles: [
            {
                slug: 'buc-tranh-tai-chinh',
                title: 'Bức Tranh Toàn Cảnh (Net Worth) - Tại Sao Cần Lập Bảng Cân Đối Kế Toán Cá Nhân?',
                summary: 'Sự khác biệt lớn nhất giữa một người có Lương cao và người Giàu có là gì? Cách tính Giá Trị Tài Sản Ròng (Net Worth) để giật mình tỉnh giấc.',
                readTime: 7,
                difficulty: 'Cơ bản',
                tags: ['Net Worth', 'Tài sản', 'Tiêu sản'],
            },
            {
                slug: 'quan-ly-dong-tien',
                title: 'Quản Lý Dòng Tiền & Lỗ Hổng Tiêu Dùng',
                summary: 'JARS (6 cái lọ) vs 50/30/20 — Phương pháp nào mới thực sự khả thi cho người trẻ? Cách triệt tiêu Latte Factor ăn mòn tài khoản.',
                readTime: 8,
                difficulty: 'Cơ bản',
                tags: ['Budgeting', 'Dòng tiền', 'JARS'],
            },
            {
                slug: 'chien-luoc-thoat-no',
                title: 'Chiến Lược Thoát Nợ Xấu Lãi Suất Cao',
                summary: 'Phân biệt Nợ tốt và Nợ xấu. Áp dụng 2 chiến lược kinh điển: Debt Snowball (đánh tâm lý) vs Debt Avalanche (đập lãi suất).',
                readTime: 10,
                difficulty: 'Cơ bản',
                tags: ['Nợ xấu', 'Debt Snowball', 'Lãi suất'],
            },
            {
                slug: 'quy-khan-cap',
                title: 'Thành Trì Quỹ Khẩn Cấp (Emergency Fund)',
                summary: 'Tại sao 3-6 tháng sinh hoạt phí là điều kiện tiên quyết TRƯỚC KHI mua tờ cổ phiếu đầu tiên? Đừng để ốm đau bắt bạn cắt lỗ.',
                readTime: 6,
                difficulty: 'Cơ bản',
                tags: ['Quỹ khẩn cấp', 'Bảo vệ', 'Tiết kiệm'],
            },
            {
                slug: 'lam-phat-va-lai-kep',
                title: 'Lạm Phát & Lãi Kép - Kẻ cắp và Kỳ Quan',
                summary: 'Kẻ thù vô hình lạm phát và Kỳ quan thứ 8 lãi kép của Einstein. Lãi kép đòi hỏi Sự kỷ luật và Thời gian, không phải kỹ năng đặc biệt.',
                readTime: 9,
                difficulty: 'Cơ bản',
                tags: ['Lãi kép', 'Lạm phát', 'Einstein'],
            },
            {
                slug: 'dinh-gia-ban-than',
                title: 'Định Giá Bản Thân & Nâng Cấp Active Income',
                summary: 'Thu nhập đầu tư (Passive) tỷ lệ thuận với Vốn. Nâng cấp Active Income mới là cách nhanh nhất để bơm nhiên liệu cho cỗ máy Lãi kép.',
                readTime: 11,
                difficulty: 'Trung cấp',
                tags: ['Active Income', 'Phát triển bản thân', 'Sự nghiệp'],
            },
            {
                slug: 'thiet-lap-muc-tieu',
                title: 'Thiết Lập Mục Tiêu Tự Do Tài Chính',
                summary: 'Quy tắc 4% (Trinity Study) và số tiền Tự Do Tài Chính (FI Number). Lập lộ trình cụ thể thay vì chỉ hô hào khẩu hiệu.',
                readTime: 12,
                difficulty: 'Trung cấp',
                tags: ['Mục tiêu', 'Tự do tài chính', 'Quy tắc 4%'],
            },
        ],
    },
    {
        id: 'mindset',
        slug: 'tam-ly-thi-truong',
        title: 'Tâm Lý & Bản Lĩnh',
        subtitle: 'Mindset & Market Psychology',
        description: 'Hiểu sâu hành vi thị trường — lòng tham, nỗi sợ, và FOMO. Xây dựng tư duy của một nhà đầu tư bình tĩnh, không bị cơn điên của "Ngài Thị Trường" cuốn đi.',
        track: 'foundation',
        level: 1,
        icon: '🧠',
        color: 'bg-violet-50',
        accentColor: 'text-violet-700',
        borderColor: 'border-violet-200',
        articleCount: 8,
        articles: [
            {
                slug: 'nguoi-ban-co-phieu',
                title: '"Ngài Thị Trường" là ai? Hiểu để không bị điên theo',
                summary: 'Benjamin Graham dùng hình ảnh "Mr. Market" để giải thích tại sao giá cổ phiếu ngắn hạn phi lý. Học cách khai thác sự phi lý đó thay vì bị nó ám ảnh.',
                readTime: 8,
                difficulty: 'Cơ bản',
                tags: ['Tâm lý học', 'Benjamin Graham', 'Giá trị'],
                references: ['The Intelligent Investor — Benjamin Graham'],
            },
            {
                slug: 'fomo-va-bau-dan',
                title: 'FOMO & Bầy Đàn: Tại sao bạn luôn mua đỉnh, bán đáy?',
                summary: 'Khoa học thần kinh giải thích tại sao não bộ con người được lập trình để đám đông — và đây chính là bẫy chết người trên thị trường chứng khoán.',
                readTime: 10,
                difficulty: 'Cơ bản',
                tags: ['Tâm lý học', 'FOMO', 'Hành vi'],
            },
            {
                slug: 'ky-luat-giao-dich',
                title: 'Kỷ Luật Giao Dịch: Tách cảm xúc ra khỏi quyết định',
                summary: 'Mark Douglas, tác giả "Trading in the Zone", chứng minh rằng kỷ luật thực thi — không phải dự đoán đúng — mới là biến quyết định thành công.',
                readTime: 12,
                difficulty: 'Trung cấp',
                tags: ['Kỷ luật', 'Tâm lý giao dịch', 'Mark Douglas'],
                references: ['Trading in the Zone — Mark Douglas'],
            },
            {
                slug: 'lo-ngai-thua-lo',
                title: 'Nỗi đau thua lỗ gấp 2.5 lần niềm vui lợi nhuận',
                summary: 'Kahneman & Tversky đoạt Nobel Kinh tế nhờ phát hiện "Loss Aversion". Hiểu cơ chế này giúp bạn không cắt lỗ muộn và không chốt lời sớm.',
                readTime: 9,
                difficulty: 'Cơ bản',
                tags: ['Kinh tế học hành vi', 'Kahneman', 'Loss Aversion'],
                references: ['Thinking, Fast and Slow — Daniel Kahneman'],
            },
            {
                slug: 'cognitive-biases',
                title: 'Cognitive Biases — 10 Thiên Kiến Nhận Thức Giết Chết Tài Khoản',
                summary: 'Kahneman chứng minh con người không ra quyết định lý trí. 10 cognitive bias phổ biến nhất — từ Confirmation Bias đến Herding — và hệ thống cứng để chống lại chúng.',
                readTime: 15,
                difficulty: 'Trung cấp',
                tags: ['Cognitive Bias', 'Kahneman', 'Tâm lý học', 'Behavioral Finance'],
                references: ['Thinking, Fast and Slow — Daniel Kahneman', 'Misbehaving — Richard Thaler'],
            },
            {
                slug: 'sunk-cost-fallacy',
                title: 'Bẫy Chi Phí Chìm: "Tôi Không Thể Bán Vì Đã Lỗ Quá Nhiều"',
                summary: 'Sunk Cost Fallacy là lý do phổ biến nhất khiến lỗ nhỏ thành lỗ lớn. Bài kiểm tra "Giấy Trắng" của Buffett và cách ra quyết định dựa trên tương lai, không phải quá khứ.',
                readTime: 10,
                difficulty: 'Cơ bản',
                tags: ['Sunk Cost', 'Tâm lý học', 'Behavioral Finance', 'Cắt lỗ'],
                references: ['Thinking, Fast and Slow — Daniel Kahneman'],
            },
        ],
    },
    {
        id: 'market-basics',
        slug: 'co-che-thi-truong',
        title: 'Cơ Chế Thị Trường',
        subtitle: 'Market Mechanics',
        description: 'Nền tảng kỹ thuật trước khi bắt đầu đầu tư. Hiểu thị trường chứng khoán Việt Nam vận hành như thế nào — từ cấu trúc đến các bên tham gia.',
        track: 'foundation',
        level: 1,
        icon: '⚙️',
        color: 'bg-slate-50',
        accentColor: 'text-slate-700',
        borderColor: 'border-slate-200',
        articleCount: 6,
        articles: [
            {
                slug: 'co-phieu-la-gi',
                title: 'Cổ phiếu là gì? Bạn thực sự mua gì khi bấm "Đặt lệnh"?',
                summary: 'Phân biệt cổ phiếu thường, cổ phiếu ưu đãi, trái phiếu và ETF. Hiểu quyền lợi cổ đông và tại sao "mua cổ phiếu = mua phần doanh nghiệp".',
                readTime: 7,
                difficulty: 'Cơ bản',
                tags: ['Cơ bản', 'Cổ phiếu', 'HOSE', 'HNX'],
            },
            {
                slug: 'cach-dat-lenh',
                title: 'Lệnh MP, LO, ATO, ATC — Đặt lệnh đúng cách để không mua nhầm giá',
                summary: 'Giải thích tất cả loại lệnh trên sàn chứng khoán Việt Nam. Case study thực tế về tình huống nên dùng lệnh nào.',
                readTime: 8,
                difficulty: 'Cơ bản',
                tags: ['Lệnh giao dịch', 'HOSE', 'Kỹ thuật'],
            },
            {
                slug: 'margin-trading',
                title: 'Margin Lending: Đòn Bẩy Tài Chính — Con Dao Hai Lưỡi',
                summary: 'Cơ chế margin tại TTCK Việt Nam, các ngưỡng Margin Call & Force Sell, lãi suất thực tế 12-16%/năm, và quy tắc sử dụng margin an toàn. Ai nên và không nên dùng margin.',
                readTime: 13,
                difficulty: 'Trung cấp',
                tags: ['Margin', 'Đòn bẩy', 'CTCK', 'Rủi ro'],
            },
        ],
    },

    // ── LEVEL 2A: INVESTOR TRACK ─────────────────────────────────────────────
    {
        id: 'fundamental',
        slug: 'phan-tich-co-ban',
        title: 'Phân Tích Cơ Bản',
        subtitle: 'Fundamental Analysis',
        description: 'Học cách đọc báo cáo tài chính như Buffett — tìm kiếm doanh nghiệp tốt ẩn mình sau những con số khô khan. Kỹ năng bắt buộc cho mọi Nhà Đầu Tư dài hạn.',
        track: 'investor',
        level: 2,
        icon: '📊',
        color: 'bg-emerald-50',
        accentColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        articleCount: 10,
        articles: [
            {
                slug: 'doc-bao-cao-tai-chinh',
                title: 'Đọc Báo Cáo Tài Chính trong 30 phút — 5 con số quyết định tất cả',
                summary: 'Cách Buffett quét qua báo cáo tài chính để tìm "lợi thế cạnh tranh bền vững". Tập trung vào: Doanh thu, Biên lợi nhuận, ROE, Nợ/Vốn, và Dòng tiền tự do.',
                readTime: 15,
                difficulty: 'Trung cấp',
                tags: ['Báo cáo tài chính', 'Warren Buffett', 'ROE', 'FCF'],
                references: ['Warren Buffett and the Interpretation of Financial Statements'],
            },
            {
                slug: 'bien-loi-nhuan',
                title: 'Biên Lợi Nhuận — Vũ Khí Bí Mật Để Nhận Diện Doanh Nghiệp Tốt',
                summary: 'Gross Margin, Operating Margin, Net Margin — cách phân tích trend theo thời gian và so sánh ngành để tìm ra công ty đang "kiếm tiền quá dễ".',
                readTime: 12,
                difficulty: 'Trung cấp',
                tags: ['Biên lợi nhuận', 'Phân tích ngành', 'Định giá'],
            },
            {
                slug: 'dinh-gia-co-phieu',
                title: 'P/E, P/B, EV/EBITDA — Định giá cổ phiếu không còn làm bạn mù mịt',
                summary: 'Hướng dẫn sử dụng 5 phương pháp định giá phổ biến nhất. Khi nào P/E thấp là tốt? Khi nào P/B thấp lại là bẫy? Case study thực tế với cổ phiếu Việt Nam.',
                readTime: 18,
                difficulty: 'Trung cấp',
                tags: ['Định giá', 'P/E', 'P/B', 'Phân tích cơ bản'],
            },
            {
                slug: 'dong-tien-tu-do',
                title: 'FCF — Tiền Thật Quan Trọng Hơn Lợi Nhuận Kế Toán',
                summary: 'Buffett: "Lợi nhuận kế toán là ý kiến, tiền mặt là sự thật." Cách tính Free Cash Flow từ BCTC Việt Nam, FCF Yield, và 3 cờ đỏ cảnh báo doanh nghiệp đang tô vẽ lợi nhuận.',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['FCF', 'Dòng tiền', 'BCTC', 'Warren Buffett', 'Phân tích cơ bản'],
                references: ['Warren Buffett and the Interpretation of Financial Statements'],
            },
            {
                slug: 'roe-va-dupont',
                title: 'ROE & Phân Tích DuPont — Bóc Trần Chất Lượng Lợi Nhuận',
                summary: 'ROE cao không phải lúcc nào cũng tốt. Phân tích DuPont 3 nhân tố (biên lợi nhuận × vòng quay tài sản × đòn bẩy) để xác định ROE đến từ đâu và có bền vững không.',
                readTime: 13,
                difficulty: 'Trung cấp',
                tags: ['ROE', 'DuPont', 'Phân tích tài chính', 'Chất lượng lợi nhuận'],
            },
        ],
    },
    {
        id: 'value-investing',
        slug: 'dau-tu-gia-tri',
        title: 'Đầu Tư Giá Trị',
        subtitle: 'Value Investing — Graham & Buffett',
        description: 'Triết lý của Benjamin Graham và Warren Buffett: mua doanh nghiệp tuyệt vời với giá hợp lý — và chờ đợi. Hệ thống tư duy đã tạo ra nhiều tỷ phú hơn bất kỳ phương pháp nào khác.',
        track: 'investor',
        level: 2,
        icon: '💎',
        color: 'bg-teal-50',
        accentColor: 'text-teal-700',
        borderColor: 'border-teal-200',
        articleCount: 9,
        articles: [
            {
                slug: 'bien-do-an-toan',
                title: 'Biên Độ An Toàn (Margin of Safety) — Nguyên Tắc Số 1 Của Graham',
                summary: 'Tại sao luôn phải mua với giá thấp hơn đáng kể so với giá trị thực? Cách tính Intrinsic Value cơ bản theo Graham và ứng dụng vào thị trường Việt Nam.',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['Benjamin Graham', 'Margin of Safety', 'Giá trị nội tại'],
                references: ['The Intelligent Investor — Benjamin Graham', 'Security Analysis — Graham & Dodd'],
            },
            {
                slug: 'loi-the-canh-tranh',
                title: '"Moat" — Hào Kinh Bảo Vệ Doanh Nghiệp Mà Buffett Luôn Tìm Kiếm',
                summary: 'Buffett chỉ đầu tư vào doanh nghiệp có "economic moat" rộng. 5 loại moat phổ biến và cách nhận diện chúng trong báo cáo tài chính.',
                readTime: 12,
                difficulty: 'Trung cấp',
                tags: ['Warren Buffett', 'Moat', 'Lợi thế cạnh tranh'],
                references: ['The Little Book That Builds Wealth — Pat Dorsey'],
            },
            {
                slug: 'munger-mental-models',
                title: 'Charlie Munger & 7 Mô Hình Tư Duy Để Đánh Giá Doanh Nghiệp',
                summary: 'Munger dùng đa ngành tư duy (đảo ngược, vòng năng lực, lợi thế quy mô...) để đánh giá doanh nghiệp. Lollapalooza Effect và cách tránh chỉ có "một cái búa".',
                readTime: 16,
                difficulty: 'Nâng cao',
                tags: ['Charlie Munger', 'Mental Models', 'Tư duy đa ngành', 'Đầu tư giá trị'],
                references: ['Poor Charlie\'s Almanack — Charlie Munger'],
            },
            {
                slug: 'value-trap',
                title: 'Bẫy Giá Trị (Value Trap): Rẻ Không Có Nghĩa Là Tốt',
                summary: '8 dấu hiệu nhận biết Value Trap: ngành bị disrupt, doanh thu giảm liên tục, FCF âm, insider bán ròng. Phân biệt với cơ hội giá trị thực sự.',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['Value Trap', 'Howard Marks', 'Đầu tư giá trị', 'Phân tích rủi ro'],
                references: ['The Most Important Thing — Howard Marks'],
            },
        ],
    },
    {
        id: 'growth-investing',
        slug: 'dau-tu-tang-truong',
        title: 'Đầu Tư Tăng Trưởng',
        subtitle: 'Growth Investing — Fisher & Lynch',
        description: 'Phương pháp của Philip Fisher và Peter Lynch: tìm kiếm những doanh nghiệp nhỏ nhưng đang tăng trưởng cực nhanh — trước khi phố Wall phát hiện ra.',
        track: 'investor',
        level: 2,
        icon: '🌱',
        color: 'bg-green-50',
        accentColor: 'text-green-700',
        borderColor: 'border-green-200',
        articleCount: 7,
        articles: [
            {
                slug: '15-tieu-chi-fisher',
                title: '15 Tiêu Chí Của Philip Fisher Để Tìm "Cổ Phiếu Phi Thường"',
                summary: 'Fisher không đọc báo cáo tài chính — ông đi thực địa và hỏi đối thủ cạnh tranh, nhà cung cấp, khách hàng. Phương pháp "Scuttlebutt" và 15 câu hỏi cốt lõi.',
                readTime: 16,
                difficulty: 'Trung cấp',
                tags: ['Philip Fisher', 'Growth', 'Scuttlebutt', 'Nghiên cứu định tính'],
                references: ['Common Stocks and Uncommon Profits — Philip Fisher'],
            },
            {
                slug: 'mua-nhung-gi-ban-biet',
                title: 'Peter Lynch: "Mua Những Gì Bạn Biết" — Lợi Thế Của Nhà Đầu Tư Cá Nhân',
                summary: 'Nhà đầu tư cá nhân có thể đánh bại quỹ chuyên nghiệp nếu biết khai thác lợi thế "local knowledge". Cách phân loại 6 nhóm cổ phiếu của Lynch.',
                readTime: 13,
                difficulty: 'Cơ bản',
                tags: ['Peter Lynch', 'One Up On Wall Street', 'Cổ phiếu tăng trưởng'],
                references: ['One Up On Wall Street — Peter Lynch'],
            },
        ],
    },

    // ── LEVEL 2B: TRADER TRACK ───────────────────────────────────────────────
    {
        id: 'technical',
        slug: 'phan-tich-ky-thuat',
        title: 'Phân Tích Kỹ Thuật',
        subtitle: 'Technical Analysis',
        description: 'Đọc ngôn ngữ của giá và khối lượng — không phải để đoán tương lai, mà để xác định xác suất và quản lý rủi ro có hệ thống.',
        track: 'trader',
        level: 2,
        icon: '📈',
        color: 'bg-blue-50',
        accentColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        articleCount: 11,
        articles: [
            {
                slug: 'nen-nhat',
                title: 'Nến Nhật (Candlestick) — Ngôn Ngữ Cảm Xúc Của Thị Trường',
                summary: 'Mỗi cây nến là cuộc chiến giữa phe mua và phe bán. 12 mô hình nến đảo chiều quan trọng nhất và cách xác nhận tín hiệu bằng khối lượng.',
                readTime: 20,
                difficulty: 'Cơ bản',
                tags: ['Nến Nhật', 'Phân tích kỹ thuật', 'Mô hình nến'],
            },
            {
                slug: 'ho-tro-khang-cu',
                title: 'Hỗ Trợ & Kháng Cự — Bản Đồ Chiến Trường Của Trader',
                summary: 'Lý do tại sao giá thường dừng lại ở cùng một mức. Cách vẽ S/R chính xác, phân biệt hỗ trợ "mỏng" và "dày", và hiện tượng Role Reversal.',
                readTime: 15,
                difficulty: 'Cơ bản',
                tags: ['Hỗ trợ', 'Kháng cự', 'S/R', 'Price Action'],
            },
            {
                slug: 'khoi-luong-giao-dich',
                title: 'Khối Lượng (Volume) — Bằng Chứng Xác Nhận Hay Phủ Nhận Tín Hiệu Giá',
                summary: 'Volume là "linh hồn" của phân tích kỹ thuật. Cách đọc Volume để xác nhận breakout thật vs bẫy tăng ảo — kỹ năng phân biệt trader mới và trader kinh nghiệm.',
                readTime: 12,
                difficulty: 'Trung cấp',
                tags: ['Volume', 'Xác nhận tín hiệu', 'Phân tích kỹ thuật'],
            },
            {
                slug: 'macd-rsi',
                title: 'MACD & RSI — Bộ Đôi Chỉ Báo Momentum Cổ Điển',
                summary: 'RSI đo sức nóng của thị trường (overbought/oversold), MACD đo động lực xu hướng. Cách dùng đúng, cách tránh tín hiệu nhiễu, và bộ lọc 3 tầng kết hợp S/R.',
                readTime: 15,
                difficulty: 'Trung cấp',
                tags: ['MACD', 'RSI', 'Indicators', 'Momentum', 'Phân tích kỹ thuật'],
            },
            {
                slug: 'mo-hinh-gia',
                title: 'Tam Giác, Cờ, Đầu Vai: 8 Mô Hình Giá Tạo Nền Quan Trọng Nhất',
                summary: 'Nhóm đảo chiều (H&S, Double Top/Bottom) và tiếp diễn (Cờ, Tam giác, Rectangle). Cách giao dịch, xác nhận volume và tránh false breakout.',
                readTime: 18,
                difficulty: 'Trung cấp',
                tags: ['Mô hình giá', 'Chart Patterns', 'Head & Shoulders', 'Phân tích kỹ thuật'],
                references: ['Technical Analysis of Stock Trends — Edwards & Magee'],
            },
            {
                slug: 'fibonacci-retracement',
                title: 'Fibonacci Retracement — Tỷ Lệ Vàng Trong Biến Động Giá',
                summary: 'Các mức 38.2%, 50%, 61.8% — cách vẽ đúng, xác nhận bằng confluence zone, và Fibonacci Extension để xác định mục tiêu giá sau breakout.',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['Fibonacci', 'Retracement', 'Tỷ lệ vàng', 'Phân tích kỹ thuật'],
            },
        ],
    },
    {
        id: 'trend-following',
        slug: 'giao-dich-theo-xu-huong',
        title: 'Giao Dịch Theo Xu Hướng',
        subtitle: 'Trend Following — Darvas & Turtle Traders',
        description: 'Nicolas Darvas và Turtle Traders đã chứng minh: không cần đoán thị trường đi đâu. Chỉ cần hệ thống có positive expectancy và kỷ luật thực thi.',
        track: 'trader',
        level: 2,
        icon: '🐢',
        color: 'bg-amber-50',
        accentColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        articleCount: 8,
        articles: [
            {
                slug: 'ly-thuyet-hop-darvas',
                title: 'Lý Thuyết Hộp Darvas — Từ Vũ Công Đến Triệu Phú Chứng Khoán',
                summary: 'Nicolas Darvas kiếm 2 triệu đô từ 3,000 đô trong 18 tháng bằng một phương pháp đơn giản. Box Theory, stop-loss tự động, và bí quyết "chỉ mua khi giá bứt phá".',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['Nicolas Darvas', 'Box Theory', 'Breakout', 'Momentum'],
                references: ['How I Made $2,000,000 in the Stock Market — Nicolas Darvas'],
            },
            {
                slug: 'turtle-traders',
                title: 'Turtle Traders — Bí Mật Được Giải Mã Của Hệ Thống Giao Dịch Vĩ Đại Nhất',
                summary: 'Richard Dennis đặt cược rằng giao dịch có thể DẠY ĐƯỢC như nuôi rùa. Hệ thống 20-day breakout của Turtles và tại sao 90% người không thực hiện được dù biết luật.',
                readTime: 18,
                difficulty: 'Nâng cao',
                tags: ['Turtle Traders', 'Trend Following', 'ATR', 'Position Sizing'],
                references: ['Way of the Turtle — Curtis Faith', 'The Complete TurtleTrader — Michael Covel'],
            },
        ],
    },

    // ── LEVEL 3: MASTERY ─────────────────────────────────────────────────────
    {
        id: 'portfolio',
        slug: 'quan-ly-danh-muc',
        title: 'Quản Lý Danh Mục',
        subtitle: 'Portfolio Management',
        description: 'Nghệ thuật phân bổ vốn: khi nào đa dạng hóa, khi nào tập trung? Chiến lược dollar-cost averaging, tái cân bằng danh mục, và đầu tư theo vòng đời.',
        track: 'mastery',
        level: 3,
        icon: '🗂️',
        color: 'bg-indigo-50',
        accentColor: 'text-indigo-700',
        borderColor: 'border-indigo-200',
        articleCount: 7,
        articles: [
            {
                slug: 'da-dang-hoa',
                title: 'Đa Dạng Hóa Danh Mục — Bao Nhiêu Cổ Phiếu Là Đủ?',
                summary: 'Peter Lynch nói 8-12 cổ phiếu. Buffett khuyên tập trung. ETF Index Fund lại nói "cả thị trường". Phân tích khoa học về điểm tối ưu của đa dạng hóa.',
                readTime: 13,
                difficulty: 'Trung cấp',
                tags: ['Đa dạng hóa', 'ETF', 'Danh mục đầu tư', 'Phân bổ vốn'],
            },
            {
                slug: 'dollar-cost-averaging',
                title: 'Dollar-Cost Averaging — Chiến Lược Đầu Tư Mà Ngay Cả Buffett Khuyên Dùng',
                summary: 'Tại sao mua đều đặn hàng tháng — bất kể giá — lại tốt hơn cố gắng "bắt đáy"? Mô phỏng so sánh 5 chiến lược khác nhau qua chu kỳ thị trường Việt Nam 2018-2024.',
                readTime: 11,
                difficulty: 'Cơ bản',
                tags: ['DCA', 'Đầu tư dài hạn', 'Tích sản', 'Chiến lược'],
            },
        ],
    },
    {
        id: 'risk-management',
        slug: 'quan-tri-rui-ro',
        title: 'Quản Trị Rủi Ro',
        subtitle: 'Risk Management',
        description: 'Sống sót trên thị trường là điều kiện tiên quyết để làm giàu. Kỹ thuật cắt lỗ, position sizing, và xây dựng hệ thống "không bao giờ phá sản".',
        track: 'mastery',
        level: 3,
        icon: '🛡️',
        color: 'bg-rose-50',
        accentColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        articleCount: 8,
        articles: [
            {
                slug: 'cat-lo',
                title: 'Cắt Lỗ — Kỹ Năng Quan Trọng Nhất Mà Ít Người Học',
                summary: 'Tại sao não bộ ghét việc cắt lỗ về mặt sinh học? Kỹ thuật đặt stop-loss khoa học: % cố định, Bollinger Band, ATR-based. Và quy trình tâm lý để thực hiện không run tay.',
                readTime: 16,
                difficulty: 'Trung cấp',
                tags: ['Stop Loss', 'Cắt lỗ', 'ATR', 'Quản trị rủi ro'],
            },
            {
                slug: 'position-sizing',
                title: 'Position Sizing — Bí Quyết Không Ai Dạy Bạn Nhưng Quyết Định Mọi Thứ',
                summary: 'Kelly Criterion, 1% Rule, 2% Rule. Tại sao trader giỏi nhất thế giới chỉ rủi ro 1-2% mỗi lệnh? Mô phỏng 1,000 giao dịch với các mức sizing khác nhau.',
                readTime: 15,
                difficulty: 'Nâng cao',
                tags: ['Position Sizing', 'Kelly Criterion', 'Quản lý vốn'],
                references: ['The New Market Wizards — Jack Schwager'],
            },
            {
                slug: 'drawdown-recovery',
                title: 'Drawdown & Phục Hồi: Tại Sao Mất 50% Cần Lãi 100% Để Hòa Vốn',
                summary: 'Toán học bất đối xứng của thua lỗ — từ -10% đến -75% cần bao nhiêu lãi để hòa vốn. Maximum Drawdown, chi phí cơ hội, và quy tắc bảo toàn vốn thực chiến.',
                readTime: 12,
                difficulty: 'Cơ bản',
                tags: ['Drawdown', 'Bảo toàn vốn', 'Quản trị rủi ro', 'Stop Loss'],
            },
        ],
    },
    {
        id: 'action-plan',
        slug: 'ke-hoach-thuc-chien',
        title: 'Kế Hoạch Thực Chiến',
        subtitle: 'Actionable Investment Plan',
        description: 'Từ lý thuyết đến thực tế. Xây dựng IPS (Investment Policy Statement) cá nhân, lập kế hoạch tài chính theo mục tiêu, và thực hành Paper Trading có cấu trúc.',
        track: 'mastery',
        level: 3,
        icon: '🎯',
        color: 'bg-orange-50',
        accentColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        articleCount: 6,
        articles: [
            {
                slug: 'investment-policy-statement',
                title: 'Viết IPS (Investment Policy Statement) — Hiến Pháp Đầu Tư Của Bạn',
                summary: 'Quỹ đầu tư triệu đô nào cũng có IPS. Cá nhân cũng cần. Template IPS 1 trang giúp bạn không bị cảm xúc lấn át khi thị trường sụp đổ.',
                readTime: 14,
                difficulty: 'Trung cấp',
                tags: ['IPS', 'Kế hoạch đầu tư', 'Mục tiêu tài chính'],
            },
            {
                slug: 'paper-trading',
                title: 'Paper Trading 90 Ngày — Giao Dịch Thật, Tiền Giả, Bài Học Thật',
                summary: 'Hướng dẫn paper trading có cấu trúc: chọn sàn mô phỏng, ghi nhật ký giao dịch, đánh giá kết quả theo thống kê. Sau 90 ngày bạn sẽ biết mình thuộc nhóm nào.',
                readTime: 10,
                difficulty: 'Cơ bản',
                tags: ['Paper Trading', 'Thực hành', 'Nhật ký giao dịch'],
            },
        ],
    },

    // ── LEGEND: HUYỀN THOẠI ĐẦU TƯ ─────────────────────────────────────────
    {
        id: 'investment-legends',
        slug: 'huyen-thoai-dau-tu',
        title: 'Huyền Thoại Đầu Tư',
        subtitle: 'Investment Legends — Học từ những bậc thầy',
        description: 'Câu chuyện và triết lý đầu tư của những huyền thoại Phố Wall. Mỗi bài là một cuốn sách được chưng cất — giúp bạn học từ hàng thập kỷ kinh nghiệm trong 15 phút.',
        track: 'legend',
        level: 3,
        icon: '🏛️',
        color: 'bg-yellow-50',
        accentColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
        articleCount: 2,
        articles: [
            {
                slug: 'peter-lynch-one-up',
                title: 'Peter Lynch: Người Bình Thường Đánh Bại Phố Wall — "One Up On Wall Street"',
                summary: '29.2%/năm trong 13 năm. Peter Lynch chứng minh rằng lợi thế lớn nhất của nhà đầu tư cá nhân là biết quan sát cuộc sống xung quanh. Hệ thống 6 loại cổ phiếu, PEG ratio và triết lý "mua những gì bạn biết".',
                readTime: 18,
                difficulty: 'Trung cấp',
                tags: ['Peter Lynch', 'One Up On Wall Street', 'Magellan Fund', 'Growth Investing', 'PEG'],
                references: ['One Up On Wall Street — Peter Lynch', 'Beating the Street — Peter Lynch'],
            },
            {
                slug: 'jesse-livermore-stock-operator',
                title: 'Jesse Livermore: Bi Kịch Vĩ Đại Nhất Phố Wall — "How To Trade In Stocks"',
                summary: 'Kiếm 100 triệu đô từ cuú sụp đổ 1929, rồi phá sản và qua đời vì không tuân thủ được chính các quy tắc mình đặt ra. 5 nguyên tắc vàng về timing, trend và kỷ luật cảm xúc.',
                readTime: 20,
                difficulty: 'Nâng cao',
                tags: ['Jesse Livermore', 'Stock Operator', 'Speculation', 'Pivot Points', 'Trading Psychology'],
                references: ['How To Trade In Stocks — Jesse Livermore', 'Reminiscences of a Stock Operator — Edwin Lefèvre'],
            },
        ],
    },
]

// Helper functions
export function getPillarBySlug(slug: string): Pillar | undefined {
    return PILLARS.find(p => p.slug === slug)
}

export function getArticleBySlug(pillarSlug: string, articleSlug: string): Article | undefined {
    const pillar = getPillarBySlug(pillarSlug)
    return pillar?.articles.find(a => a.slug === articleSlug)
}

export function getPillarsByTrack(track: Track): Pillar[] {
    return PILLARS.filter(p => p.track === track)
}

export const TRACKS = {
    foundation: { label: 'Nền Tảng', sublabel: 'Level 1 — Bắt buộc', icon: '🏗️', color: 'text-slate-700' },
    investor: { label: 'Nhà Đầu Tư', sublabel: 'Level 2A — Chuyên sâu', icon: '💼', color: 'text-emerald-700' },
    trader: { label: 'Nhà Giao Dịch', sublabel: 'Level 2B — Chuyên sâu', icon: '⚡', color: 'text-blue-700' },
    mastery: { label: 'Thực Chiến', sublabel: 'Level 3 — Nâng cao', icon: '🏆', color: 'text-amber-700' },
    legend: { label: 'Huyền Thoại', sublabel: 'Bậc thầy — Câu chuyện & Triết lý', icon: '🏛️', color: 'text-yellow-700' },
} as const

