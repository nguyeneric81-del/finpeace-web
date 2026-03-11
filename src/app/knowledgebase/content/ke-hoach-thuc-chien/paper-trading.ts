// Article content: ke-hoach-thuc-chien / paper-trading
// "Paper Trading 90 Ngày — Giao Dịch Thật, Tiền Giả, Bài Học Thật"
// Ref: Jens Clever, Benjamin Graham, Market Wizards

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Bạn có thể đọc 10 cuốn sách về bơi lội và vẫn sẽ chìm khi nhảy xuống nước. Trading cũng vậy.

Paper Trading (giao dịch mô phỏng) không phải để "thắng ảo" cho vui — mà để thu thập dữ liệu về chính mình: tâm lý của bạn phản ứng thế nào với rủi ro, trước khi tiền thật vào cuộc.`,
    },
    {
        type: 'steps',
        title: '🗺️ 4 Bước Paper Trading Đúng Cách Trong 90 Ngày',
        content: '',
        items: [
            {
                icon: '🖥️',
                title: 'Bước 1: Chọn công cụ mô phỏng',
                highlight: 'Không cần phần mềm đắt tiền',
                body: '• Portfolio Tracker miễn phí: Morningstar, Yahoo Finance, tài khoản demo của CTCK\n• Đơn giản nhất: bảng tính Excel — ghi lệnh mua/bán tại mức giá và thời gian cụ thể\n• Mục tiêu cốt lõi không phải phần mềm — mà là kiểm tra tính kỷ luật của bạn',
            },
            {
                icon: '🎭',
                title: 'Bước 2: Nguyên tắc "Giao dịch thật, tiền giả"',
                highlight: 'Đánh lừa bộ não — loại bỏ lỗ hổng cảm xúc',
                body: '• Trung thực tuyệt đối: không đặt lệnh mô phỏng nếu biết chắc sẽ không dám bấm khi dùng tiền thật\n• Trừ phí môi giới và trượt giá (slippage) — đây là sai lầm phổ biến khiến kết quả giả luôn đẹp hơn thực tế\n• Khi giá chạm stop-loss trên biểu đồ → bắt buộc ghi nhận lệnh thua lỗ ngay lập tức, không chờ đợi',
            },
            {
                icon: '📔',
                title: 'Bước 3: Ghi Nhật Ký Giao Dịch (Trade Log)',
                highlight: 'Bạn đang thu thập dữ liệu về chính mình',
                body: '• Ghi đầy đủ: tín hiệu vào lệnh, tín hiệu thoát, lý do — và đặc biệt là CẢM XÚC lúc đó\n• Mổ xẻ mọi lệnh thua lỗ: "điều gì đã xảy ra và tại sao tôi lỗ?" — đây là bài học thật sự\n• Theo dõi chuỗi thắng/thua liên tiếp (streaks) và tác động lên tâm lý để nhận ra mình behave ra sao',
            },
            {
                icon: '📊',
                title: 'Bước 4: Đánh Giá Sau 90 Ngày',
                highlight: 'Ngưỡng tối thiểu để chuyển tiền thật: Win Rate ≥ 75%',
                body: '• Chuyên gia Jens Clever: chỉ chuyển sang trade live khi Win Rate trên giấy ≥ 75% — vì con số này chắc chắn giảm mạnh khi trade thật\n• So sánh với thị trường chung: nếu tốn hàng giờ/ngày mà lợi nhuận vẫn thấp hơn mua ETF rồi đi ngủ → tự chọn cổ phiếu không dành cho bạn\n• Kết quả giả luôn tốt hơn thực tế vì không có áp lực tâm lý — hãy tự cộng thêm một "discount" tâm lý 20-30%',
            },
        ],
    },
    {
        type: 'concept',
        title: '💡 Kết Luận: Sau 90 Ngày, Bạn Thuộc Nhóm Nào?',
        content: `Nhóm 1 — Nên từ bỏ tự chọn cổ phiếu: Thiếu kỷ luật, không bám sát chiến lược, kết quả thua thị trường chung. Không có gì đáng xấu hổ — Graham khuyên: đặt toàn bộ tiền vào quỹ chỉ số thụ động và dành thời gian cho cuộc sống.

Nhóm 2 — Sẵn sàng "Ra chiến trường": Duy trì được kỷ luật, ghi chép nghiêm túc, Win Rate ≥ 75%, và đã nhận ra được các lỗi tâm lý của mình. Bạn đã sẵn sàng mở tài khoản tiền thật.

Nhưng dù thuộc nhóm nào: Đừng paper trade quá lâu. Bắt đầu với số vốn nhỏ nhất có thể để nếm trải cảm giác thực tế — khi đồng tiền thật đầu tiên bị đe dọa, cảm xúc mới thực sự ập đến, và không có bài tập nào chuẩn bị cho bạn hoàn toàn điều đó.`,
    },
    {
        type: 'checklist',
        title: '✅ Điều Kiện "Tốt Nghiệp" — Sẵn Sàng Trade Tiền Thật',
        content: [
            'Đã giao dịch ít nhất 30 lệnh theo cùng một hệ thống, nhất quán trong 90 ngày',
            'Win Rate trên giấy ≥ 75% (Jens Clever) — biết rằng con số này sẽ giảm khi trade thật',
            'Profit Factor > 1.5 (tổng lãi / tổng lỗ) sau toàn bộ giai đoạn',
            'Đã ghi Trade Log đầy đủ và mổ xẻ ít nhất 3 lệnh thua lỗ lớn nhất',
            'Đã nhận ra ít nhất 1 pattern lỗi tâm lý (overconfidence, revenge trading, hesitation...)',
            'Bắt đầu với vốn thật ≤ 10% tổng vốn dự định — để nếm trải cảm xúc trước khi all-in',
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
            '4 bước 90 ngày: chọn công cụ → nguyên tắc tiền giả-thực tế → Trade Log → đánh giá số liệu',
            'Nguyên tắc quan trọng nhất: trừ phí + slippage, thực thi stop-loss nghiêm túc dù là tiền giả',
            'Trade Log không phải ghi số liệu — mà ghi CẢM XÚC để nhận ra pattern tâm lý của mình',
            'Win Rate ≥ 75% trên giấy mới đủ điều kiện trade thật (vì sẽ giảm mạnh với áp lực tâm lý)',
            'So sánh với ETF: nếu tốn hàng giờ mà vẫn thua ETF → tự chọn cổ phiếu không dành cho bạn',
            'Đừng paper trade mãi — bắt đầu vốn thật nhỏ để nếm trải cảm xúc thực sự, không có gì thay thế được',
        ],
    },
]
