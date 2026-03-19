// Article content for: phan-tich-co-ban / dong-tien-tu-do
// FCF — Tiền Thật Quan Trọng Hơn Lợi Nhuận Kế Toán

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Năm 2001, Enron — một trong những công ty lớn nhất nước Mỹ — sụp đổ trong vụ bê bối kế toán chấn động lịch sử. Điều đáng sợ: lợi nhuận báo cáo của Enron tăng trưởng liên tục nhiều năm trước đó. Nhà phân tích nào nhìn vào lợi nhuận đều thấy một công ty tuyệt vời.

Nhưng ai nhìn vào Dòng Tiền Tự Do (Free Cash Flow — FCF) sẽ thấy ngay vấn đề: Enron không bao giờ tạo ra tiền mặt thực sự từ hoạt động kinh doanh.

Warren Buffett nói: "Lợi nhuận kế toán là ý kiến. Tiền mặt là sự thật."`,
    },
    {
        type: 'key-insight',
        title: '💡 Khái Niệm Cốt Lõi',
        content: 'Free Cash Flow (FCF) = Tiền từ hoạt động kinh doanh (Operating Cash Flow) − Chi tiêu vốn (CapEx). Đây là lượng tiền MẶT THỰC SỰ mà doanh nghiệp tạo ra sau khi đã chi trả để duy trì và mở rộng hoạt động. Không phụ thuộc vào các thủ thuật kế toán.',
    },
    {
        type: 'concept',
        title: '📖 Tại Sao Lợi Nhuận Kế Toán Có Thể Bị "Tô Vẽ"?',
        content: `Lợi nhuận kế toán (Net Income) bị ảnh hưởng bởi rất nhiều lựa chọn của ban quản lý:

**Khấu hao**: Một tài sản có thể khấu hao 5 năm hoặc 20 năm — cùng một tài sản nhưng lợi nhuận khác nhau hoàn toàn.

**Ghi nhận doanh thu**: Doanh nghiệp có thể ghi nhận doanh thu sớm hoặc muộn tùy phương pháp kế toán.

**Phân loại chi phí**: Chi phí vận hành hay chi phí vốn? Cùng khoản tiền chi ra nhưng ảnh hưởng đến lợi nhuận rất khác nhau.

Trong khi đó, tiền mặt vào ra tài khoản ngân hàng không thể "tô vẽ". Đây là lý do các nhà đầu tư chuyên nghiệp luôn đọc Báo Cáo Lưu Chuyển Tiền Tệ trước BCTC.`,
    },
    {
        type: 'steps',
        title: '🔢 Cách Đọc FCF Từ Báo Cáo Tài Chính VN',
        content: 'Quy trình tính FCF từ BCTC theo VAS:',
        items: [
            {
                icon: '1️⃣',
                title: 'Tìm "Lưu Chuyển Tiền Thuần Từ Hoạt Động Kinh Doanh"',
                body: 'Trong Báo Cáo Lưu Chuyển Tiền Tệ (Cash Flow Statement) — đây là Operating Cash Flow. Số này phải DƯƠNG và ổn định.',
                highlight: 'Chỉ tiêu: >0 liên tục ít nhất 3-5 năm',
            },
            {
                icon: '2️⃣',
                title: 'Tìm "Chi Mua Sắm Tài Sản Cố Định" (CapEx)',
                body: 'Trong phần Hoạt Động Đầu Tư — thường là số âm vì là tiền chi ra. Đây là chi phí để duy trì và mở rộng năng lực sản xuất.',
                highlight: 'CapEx thấp = business model nhẹ vốn = tuyệt vời (VD: phần mềm, thương hiệu)',
            },
            {
                icon: '3️⃣',
                title: 'Tính FCF = Operating CF − CapEx',
                body: 'Ví dụ: VNM có Operating CF = 5,000 tỷ, CapEx = 800 tỷ → FCF = 4,200 tỷ. FCF dương và lớn = doanh nghiệp tạo tiền thực.',
                highlight: 'So sánh FCF với Net Income: FCF/Net Income > 80% là lý tưởng',
            },
            {
                icon: '4️⃣',
                title: 'Tính FCF Yield = FCF / Vốn Hóa Thị Trường',
                body: 'FCF Yield cho biết mỗi đồng bạn bỏ ra mua cổ phiếu, công ty tạo ra bao nhiêu tiền thực mỗi năm. FCF Yield > 5% thường được coi là hấp dẫn.',
                highlight: 'FCF Yield 7-10% = định giá rất rẻ nếu business tốt',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Chúng tôi coi lợi nhuận trên cổ phần gần như vô nghĩa. Điều duy nhất quan trọng — theo đúng nghĩa đen — là Free Cash Flow trên mỗi cổ phần."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter, 1992',
    },
    {
        type: 'concept',
        title: '🚨 Dấu Hiệu Cảnh Báo Từ FCF',
        content: `**Nguy hiểm mức 1 — FCF âm liên tục**: Công ty đang đốt tiền nhiều hơn kiếm được. Chấp nhận được với startup, nhưng đáng lo ngại với doanh nghiệp đã trưởng thành.

**Nguy hiểm mức 2 — FCF thấp hơn Net Income nhất quán**: Ban quản lý có thể đang sử dụng các thủ thuật kế toán để tô vẽ lợi nhuận. Khoảng cách lớn giữa Net Income và FCF cần phải giải thích được.

**Nguy hiểm mức 3 — FCF không đủ trả cổ tức**: Nhiều công ty VN trả cổ tức từ tiền vay hoặc thoái vốn, không phải từ dòng tiền kinh doanh → cổ tức không bền vững.`,
    },
    {
        type: 'checklist',
        title: '✅ Checklist FCF Khi Phân Tích Cổ Phiếu VN',
        content: [
            'FCF dương liên tục ít nhất 3 năm gần nhất (tìm trên Vietstock, CafeF)',
            'FCF / Net Income > 70% (cho thấy lợi nhuận "chất lượng cao")',
            'FCF đủ để trả cổ tức (FCF ≥ Tổng cổ tức chi trả)',
            'CapEx không tăng đột biến bất thường (có thể là dấu hiệu mở rộng thiếu kiểm soát)',
            'So sánh FCF Yield với lãi suất ngân hàng 12 tháng — nếu FCF Yield thấp hơn thì định giá đắt',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Ngoại Lệ Quan Trọng',
        content: 'Ngân hàng và công ty bảo hiểm có cấu trúc dòng tiền đặc biệt — không thể áp dụng FCF trực tiếp. Với nhóm này, dùng chỉ số thay thế: ROE, NIM (Net Interest Margin), Tỷ lệ nợ xấu, và Solvency Ratio. Cũng lưu ý: công ty đang trong giai đoạn đầu tư mạnh (CapEx cao) có thể có FCF thấp tạm thời — cần đánh giá trong bối cảnh chu kỳ kinh doanh.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'FCF = Operating Cash Flow − CapEx. Đây là "tiền thật" doanh nghiệp tạo ra',
            'Lợi nhuận kế toán có thể bị tô vẽ; FCF rất khó gian lận vì tiền thực ra/vào tài khoản',
            '3 cờ đỏ FCF: âm liên tục, thấp hơn Net Income nhiều, không đủ trả cổ tức',
            'FCF Yield > 5-7% thường là định giá hấp dẫn nếu doanh nghiệp chất lượng',
            'Bước tiếp theo: Xem bài "Biên Lợi Nhuận" để học tiếp về chất lượng lợi nhuận',
        ],
    },
]
