// Article content: ke-hoach-thuc-chien / paper-trading
// "Paper Trading 90 Ngày — Giao Dịch Thật, Tiền Giả, Bài Học Thật"

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Bạn có thể đọc 10 cuốn sách về bơi lội và vẫn sẽ chìm nghỉm khi nhảy xuống nước. Trading cũng vậy.

Paper Trading (giao dịch mô phỏng bằng tiền giả) là bước bắt buộc giữa lý thuyết và thực tế. Không phải để "thắng ảo" cho vui — mà để hiểu tâm lý của bạn phản ứng thế nào với rủi ro, trước khi tiền thật vào cuộc.`,
    },
    {
        type: 'concept',
        title: '📖 Paper Trading Dùng Đúng Cách vs Sai Cách',
        content: `**Sai cách (phổ biến):** Mở tài khoản ảo 1 tỷ đồng, giao dịch vô tội vạ không có kế hoạch, thắng nhiều vì "không sợ mất", rồi tự tin nhảy vào tiền thật và thua vì cảm xúc hoàn toàn khác.

**Đúng cách:** Paper trade với MỤC TIÊU HỌC CỤ THỂ — kiểm tra một hệ thống giao dịch định trước, ghi nhật ký mọi lệnh, đánh giá kết quả bằng metrics thực sự (win rate, R:R, max drawdown) sau 90 ngày.

Sự khác biệt nằm ở **structure và kỷ luật**, không phải công cụ.`,
    },
    {
        type: 'steps',
        title: '📋 Chương Trình Paper Trading 90 Ngày Có Cấu Trúc',
        content: '',
        items: [
            {
                icon: '📌',
                title: 'Tháng 1 (30 ngày đầu): Thiết lập hệ thống',
                highlight: 'Chọn một hệ thống duy nhất và tuân thủ tuyệt đối',
                body: 'Chọn ONE hệ thống (ví dụ: chỉ giao dịch theo S/R breakout với volume xác nhận). Viết ra các quy tắc RÕ RÀNG: điều kiện vào lệnh, cách tính stop-loss, cách tính position size. Không được thay đổi hệ thống trong 30 ngày, dù kết quả xấu.',
            },
            {
                icon: '📔',
                title: 'Tháng 2 (30 ngày tiếp): Nhật ký giao dịch nghiêm túc',
                highlight: 'Ghi lại mọi thứ — kể cả cảm xúc',
                body: 'Mỗi lệnh ghi: Ngày, Cổ phiếu, Lý do vào lệnh (phân tích gì?), Điểm vào, Stop-loss, Target, Kết quả, và quan trọng nhất — CẢM XÚC của bạn khi vào/trong/sau lệnh. Sau 30 ngày, đọc lại nhật ký để tìm patterns trong sai lầm.',
            },
            {
                icon: '📊',
                title: 'Tháng 3 (30 ngày cuối): Đánh giá và quyết định',
                highlight: 'Phân tích metrics thực sự',
                body: 'Tính: Win Rate (%), Average Win / Average Loss (R:R ratio), Profit Factor (tổng lãi / tổng lỗ), Max Drawdown (giảm tối đa từ đỉnh). Nếu Profit Factor > 1.5 và bạn tuân thủ rules nhất quán → sẵn sàng trade thật với vốn nhỏ. Nếu không → identify vấn đề và lặp lại.',
            },
        ],
    },
    {
        type: 'key-insight',
        title: '💡 Bài Học Không Thể Học Từ Sách: Tâm Lý Khi Thắng và Thua Liên Tiếp',
        content: 'Khi paper trade nghiêm túc, bạn sẽ phát hiện: sau 3-4 lệnh thắng liên tiếp, bạn có xu hướng tăng size quá mức (overconfidence). Sau 3-4 lệnh thua liên tiếp, bạn muốn bỏ qua một lệnh "để dừng chuỗi xui" (thiếu nhất quán). Cả hai cảm xúc này đều sẽ phá hủy lợi nhuận kỳ vọng của hệ thống. Nhận ra chúng khi còn tiền giả — trước khi tiền thật vào cuộc.',
    },
    {
        type: 'checklist',
        title: '✅ Điều Kiện "Tốt Nghiệp" Paper Trading — Sẵn Sàng Trade Thật',
        content: [
            'Đã giao dịch ít nhất 30 lệnh theo cùng một hệ thống nhất quán',
            'Profit Factor > 1.5 trong 90 ngày (tổng lãi / tổng lỗ)',
            'Max Drawdown < 20% tài khoản ảo (nếu hơn, position sizing cần xem lại)',
            'Win Rate đã biết cụ thể (không phải cảm giác) và phù hợp với R:R của hệ thống',
            'Đã phát hiện ít nhất 1 pattern sai lầm tâm lý trong nhật ký và có kế hoạch khắc phục',
            'Cam kết bắt đầu trade thật với vốn ≤ 10% số tiền dự định đầu tư trong năm đầu tiên',
        ],
    },
    {
        type: 'quote',
        content: '"Trong trading, bạn không thể học từ sách. Bạn học từ thị trường — nhưng học phí có thể rất đắt nếu bạn không chuẩn bị."',
        author: 'Ed Seykota',
        source: 'Market Wizards — Jack Schwager',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Paper trade ĐÚNG CÁCH = kiểm tra một hệ thống cụ thể với kỷ luật — không phải giao dịch vô tội vạ',
            '90 ngày: 30 ngày thiết lập → 30 ngày nhật ký → 30 ngày đánh giá metrics',
            'Metrics cần đo: Win Rate, R:R, Profit Factor (>1.5), Max Drawdown (<20%)',
            'Mục tiêu chính: học TÂMLÝ của bạn — overconfidence sau thắng, hesitation sau thua',
            '"Tốt nghiệp" khi: 30+ lệnh nhất quán + Profit Factor > 1.5 + đã nhận ra và có plan cho các lỗi tâm lý',
            'Trade thật đầu tiên với vốn ≤ 10% tổng vốn đầu tư — cảm xúc tiền thật KHÁC hoàn toàn tiền ảo',
        ],
    },
]
