// Article content for: co-che-thi-truong / margin-trading
// Margin Lending: Đòn Bẩy Tài Chính — Con Dao Hai Lưỡi

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Năm 2021-2022, thị trường chứng khoán Việt Nam trải qua một trong những giai đoạn điên rồ nhất lịch sử. VN-Index tăng từ 660 điểm (đáy COVID) lên 1,500 điểm chỉ trong 18 tháng. Rồi sụp đổ về 900 điểm trong vòng 6 tháng.

Trong chu kỳ đó, hàng chục nghìn nhà đầu tư cá nhân sử dụng margin (vay tiền của công ty chứng khoán để đầu tư) để "đạp ga tối đa" khi thị trường lên. Một số kiếm tiền rất nhanh. Phần lớn mất sạch vốn rất nhanh hơn.

Margin là công cụ mạnh nhất trên thị trường chứng khoán — và cũng là nguyên nhân số 1 của những thảm họa tài chính cá nhân quy mô lớn.`,
    },
    {
        type: 'key-insight',
        title: '💡 Margin Là Gì?',
        content: 'Margin (vay ký quỹ) là khoản vay từ công ty chứng khoán để mua thêm cổ phiếu, sử dụng danh mục hiện có làm tài sản thế chấp. Tỷ lệ margin tại TTCK Việt Nam thường là 1:1 (vay 50% giá trị danh mục) đến 2:1 (vay 67%). Công ty CK hưởng lãi suất 12-16%/năm cho khoản vay này.',
    },
    {
        type: 'concept',
        title: '📖 Margin Hoạt Động Như Thế Nào?',
        content: `**Ví dụ cụ thể:**

Bạn có 100 triệu, vay margin thêm 100 triệu → tổng đầu tư 200 triệu vào cổ phiếu X.

**Kịch bản 1 — Thị trường tăng 30%:**
- Danh mục 200 triệu → 260 triệu
- Trả nợ margin: 100 triệu + lãi ~8 triệu (nếu giữ 6 tháng, lãi 16%/năm)
- Lợi nhuận thực: 260 - 100 - 108 = 52 triệu → Lãi 52% trên vốn gốc

**Kịch bản 2 — Thị trường giảm 30%:**
- Danh mục 200 triệu → 140 triệu
- Nợ margin vẫn là 108 triệu (gốc + lãi)
- Vốn thực còn: 140 - 108 = 32 triệu → Lỗ 68% trên vốn gốc

Tốc độ khuếch đại cả lời lẫn lỗ gần như tương đương — nhưng rủi ro phía dưới có thể vô hạn (mất trắng và còn nợ).`,
    },
    {
        type: 'warning',
        title: '⚠️ Margin Call — Cú Đòn Không Thể Cưỡng Lại',
        content: 'Khi giá trị danh mục giảm xuống ngưỡng nhất định, công ty chứng khoán sẽ phát ra "Margin Call" — yêu cầu bạn nộp thêm tiền hoặc bán bớt cổ phiếu ngay lập tức. Nếu không, họ TỰ ĐỘNG BÁN cổ phiếu của bạn ở BẤT KỲ giá nào để thu hồi nợ. Điều này xảy ra vào đúng thời điểm thị trường hoảng loạn nhất — khi giá đang ở đáy, khi bán ra là tệ nhất. Đây là lý do margin có thể chuyển một khoản lỗ tạm thời thành thảm họa.',
    },
    {
        type: 'steps',
        title: '📐 Các Ngưỡng Quan Trọng Của Margin TTCK Việt Nam',
        content: 'Hiểu đúng cơ chế margin call và force sell:',
        items: [
            {
                icon: '✅',
                title: 'Tỷ Lệ Ký Quỹ Ban Đầu (Initial Margin)',
                body: 'Thông thường 50% — bạn có 100tr thì được vay tối đa 100tr. Một số CTCK cho tỷ lệ cao hơn với cổ phiếu thanh khoản tốt.',
                highlight: 'Không bao giờ dùng tối đa tỷ lệ margin được phép',
            },
            {
                icon: '⚠️',
                title: 'Ngưỡng Cảnh Báo (Warning Level)',
                body: 'Thường 70-75% — khi tỷ lệ nợ/danh mục chạm ngưỡng này, CTCK gửi cảnh báo và có thể hạn chế mua thêm.',
                highlight: 'Nhận cảnh báo = cần nộp thêm tiền hoặc bán bớt ngay',
            },
            {
                icon: '🔴',
                title: 'Ngưỡng Giải Chấp (Force Sell Level)',
                body: 'Thường 80-85% — CTCK tự động bán cổ phiếu của bạn để thu hồi nợ. Bạn không có quyền can thiệp.',
                highlight: 'Avoid at all costs — đây là điểm không thể cứu vãn',
            },
            {
                icon: '💰',
                title: 'Lãi Suất Margin Tại Việt Nam',
                body: 'Hiện tại: 12-16%/năm tùy CTCK. Con số này chạy hàng ngày, ngay cả khi thị trường đi ngang bạn vẫn đang trả lãi.',
                highlight: 'Margin chỉ hiệu quả khi tốc độ tăng giá cổ phiếu > lãi suất vay',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Margin đã giết chết nhiều trader tốt hơn bất kỳ thứ gì khác. Bạn có thể đúng về hướng và vẫn bị margin call vì timing sai."',
        author: 'Jesse Livermore',
        source: 'Reminiscences of a Stock Operator',
    },
    {
        type: 'checklist',
        title: '✅ Nếu Bạn Dùng Margin — Quy Tắc Tối Thiểu',
        content: [
            'Giới hạn margin tối đa 30-40% danh mục thực (không phải tối đa CTCK cho phép)',
            'Chỉ margin vào cổ phiếu large-cap, thanh khoản cao — không bao giờ margin vào penny stock',
            'Luôn có kế hoạch "nếu giảm thêm 15%, tôi sẽ làm gì?" TRƯỚC khi mở vị thế',
            'Không để margin "lăn lãi" qua đêm khi thị trường không ổn định',
            'Nếu nhận Warning Level → bán ngay để về an toàn, không "chờ hồi" bằng margin',
        ],
    },
    {
        type: 'concept',
        title: '👤 Ai NÊN Và Ai KHÔNG NÊN Dùng Margin?',
        content: `**NÊN dùng margin (rất thận trọng):**
- Trader có ít nhất 2-3 năm kinh nghiệm giao dịch thực tế
- Đã có hệ thống stop loss được kiểm chứng
- Chỉ dùng cho giao dịch ngắn hạn (ngày/tuần), không phải nắm giữ dài hạn

**KHÔNG nên dùng margin:**
- Nhà đầu tư mới (dưới 2 năm kinh nghiệm)
- Người đang dùng tiền không thể mất (tiền sinh hoạt, tiền học con, v.v.)
- Người chưa có hệ thống cắt lỗ kỷ luật
- Thị trường đang ở vùng định giá cao (P/E > 18-20x)`,
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Margin khuếch đại lãi VÀ lỗ theo cùng bội số — nhưng rủi ro phía dưới không giới hạn',
            'Margin Call → Force Sell xảy ra vào lúc tệ nhất, biến lỗ tạm thời thành thảm họa',
            'Lãi suất margin 12-16%/năm: cổ phiếu phải tăng nhanh hơn mức này mới có lãi',
            'Quy tắc vàng: nếu cần phải hỏi "tôi có nên dùng margin không?", câu trả lời thường là KHÔNG',
            'Bước tiếp theo: Xem bài "Position Sizing" và "Cắt Lỗ" để học quản lý rủi ro cơ bản trước',
        ],
    },
]
