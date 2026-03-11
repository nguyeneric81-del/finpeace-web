// Article content: phan-tich-co-ban / doc-bao-cao-tai-chinh
// "Đọc BCTC Trong 30 Phút: 5 Con Số Khai Mở Mọi Bí Mật"
// Ref: Buffett and the Interpreter (Mary Buffett & David Clark)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Hầu hết nhà đầu tư mới nhìn vào Báo cáo Tài chính đều cảm thấy bị choáng ngợp — hàng chục trang số liệu dày đặc, thuật ngữ chuyên ngành, bảng biểu phức tạp. Và rồi họ bỏ cuộc, chuyển sang đọc tin nhóm Zalo.

Nhưng Warren Buffett dạy chúng ta điều khác biệt: Bạn không cần đọc từng dòng của BCTC. Chỉ cần tập trung vào 5 con số cốt lõi — và bạn có thể nắm bắt 80% sức khỏe của một doanh nghiệp trong 30 phút.`,
    },
    {
        type: 'key-insight',
        title: '💡 Bí Mật Của Sự Nhất Quán',
        content: 'Không bao giờ đánh giá dựa trên con số của 1 năm duy nhất. "Trò chơi tìm kiếm các công ty có lợi thế cạnh tranh bền vững có tên là SỰ NHẤT QUÁN." Mọi con số đều phải nhìn dưới lăng kính chuỗi số liệu từ 5 đến 10 năm. Một công ty vĩ đại là công ty không bao giờ thay đổi bản chất kinh doanh của nó.',
    },
    {
        type: 'steps',
        title: '📊 5 Con Số Buffett Quét Đầu Tiên',
        content: '',
        items: [
            {
                icon: '📈',
                title: 'Tỷ Lệ Lợi Nhuận Thuần / Doanh Thu',
                highlight: 'The 20% Rule',
                body: 'Buffett không nhìn vào quy mô doanh thu — ông tìm xem công ty GIỮ LẠI được bao nhiêu sau chi phí. Net Income / Total Revenue > 20% = đang hưởng lợi thế cạnh tranh dài hạn (Moody\'s 31%, Coca-Cola 21%). Dưới 10% = ngành cạnh tranh tàn khốc (hàng không, ô tô).',
            },
            {
                icon: '💰',
                title: 'Biên Lợi Nhuận Gộp',
                highlight: 'Gross Margin ≥ 40%',
                body: 'Lợi nhuận gộp / Doanh thu — phản ánh QUYỀN LỰC ĐỊNH GIÁ. Công ty có lợi thế cạnh tranh bền vững bán được giá cao mà không bị ép. Buffett tìm mức ≥ 40% ổn định qua nhiều năm. Coca-Cola duy trì 60%+, Wrigley 51%. Ngành hàng không, ô tô chỉ ~14% = cạnh tranh tàn khốc.',
            },
            {
                icon: '🎯',
                title: 'ROE — Return on Equity',
                highlight: 'ROE > 15%, không dùng đòn bẩy',
                body: 'Buffett coi EPS là "bức màn mờ ảo". ROE = Lợi nhuận thuần / Vốn chủ sở hữu — đo lường BAN LÃNH ĐẠO đang dùng tiền cổ đông hiệu quả đến mức nào. Coca-Cola ROE 30%, Hershey\'s 33%. Nguyên tắc sống còn: ROE cao phải đạt được KHÔNG cần đòn bẩy nợ quá nhiều.',
            },
            {
                icon: '🏦',
                title: 'Tỷ Lệ Nợ / Vốn — Sức Mạnh Tài Chính',
                highlight: 'Nợ DH / Vốn < 0.8; ≤ 4 năm lợi nhuận',
                body: 'Kiểm tra: Nợ dài hạn / Vốn chủ sở hữu < 0.8 (càng thấp càng tốt). Chi phí lãi vay < 15% lợi nhuận hoạt động. Thử thách Buffett: công ty phải trả sạch toàn bộ nợ dài hạn trong 3-4 năm bằng lợi nhuận thuần. Coca-Cola trả được trong 1 năm.',
            },
            {
                icon: '💵',
                title: 'Dòng Tiền Tự Do — "Lợi Nhuận Chủ Sở Hữu"',
                highlight: 'CapEx < 50% lợi nhuận thuần',
                body: 'Owner Earnings = Lợi nhuận ròng + Khấu hao − CapEx. Số tiền THỰC SỰ bạn bỏ túi nếu sở hữu 100% doanh nghiệp. Nếu CapEx/Lợi nhuận thuần < 50% qua 10 năm = lợi thế cạnh tranh bền vững. Tuyệt vời nhất < 25%. Moody\'s chỉ tốn 5%, Coca-Cola 19% lợi nhuận cho CapEx.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Tôi không bao giờ đưa ra quyết định dựa trên con số của 1 năm. Tôi tìm kiếm sự nhất quán qua 5, 10 và thậm chí 20 năm."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình 30 Phút Quét BCTC Trên TTCK Việt Nam',
        content: [
            'Phút 1-5: Vào CafeF/Vietstock → tab "Tài chính" → bật chuỗi dữ liệu 5-10 năm. Nhìn TỔNG DOANH THU có tăng đều? Đột biến năm nào?',
            'Phút 5-10: Tính Net Margin (Lợi nhuận sau thuế / Doanh thu). Có ổn định ≥ 20%? So sánh với 2-3 công ty cùng ngành',
            'Phút 10-15: Kiểm tra Gross Margin (có trong tab tỷ số tài chính). Có ≥ 40% và ổn định? Đang tăng hay giảm?',
            'Phút 15-20: ROE (có sẵn trên CafeF) — nhìn chuỗi 5 năm. Có > 15% đều đặn không cần đòn bẩy cao?',
            'Phút 20-25: Bảng CĐKT — Nợ dài hạn / Vốn chủ sở hữu. Dưới 0.8? Nợ dài hạn chia cho lợi nhuận thuần có ≤ 4 năm không?',
            'Phút 25-30: Lưu chuyển tiền — CapEx (chi đầu tư TSCĐ) / Lợi nhuận thuần. Dưới 50%? Dưới 25% là xuất sắc. FCF có dương đều không?',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ 3 Bẫy Sổ Sách Phổ Biến Trên TTCK Việt Nam',
        content: 'Bẫy 1: Doanh thu tăng nhưng khoản phải thu tăng nhanh hơn → bán chịu, chưa thu tiền, "lợi nhuận giấy". Bẫy 2: Lợi nhuận cao bất thường 1 năm nhưng từ bán tài sản hoặc hoàn nhập dự phòng — không bền vững, nhớ đọc thuyết minh BCTC. Bẫy 3: ROE cao nhờ vay nợ nhiều (đòn bẩy tài chính) thay vì hiệu quả kinh doanh thực sự — kiểm tra song song D/E ratio. Luôn đọc ghi chú thuyết minh BCTC chứ không chỉ bảng số.',
    },
    {
        type: 'summary',
        title: '📋 Bảng Kiểm Tra Nhanh — Chuẩn Buffett',
        content: [
            'Net Margin > 20% qua 5-10 năm → có thể có lợi thế cạnh tranh',
            'Gross Margin ≥ 40% ổn định → pricing power, không bị ép giá',
            'ROE > 15% đều đặn, không dùng đòn bẩy cao → ban lãnh đạo dùng vốn hiệu quả',
            'Nợ dài hạn < 4 năm lợi nhuận thuần + Lãi vay < 15% EBIT → tài chính vững',
            'CapEx < 50% lợi nhuận thuần qua 10 năm → doanh nghiệp tạo tiền thực, không chỉ lợi nhuận kế toán',
        ],
    },
]
