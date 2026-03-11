// Article content: quan-tri-rui-ro / position-sizing
// "Position Sizing — Bí Quyết Không Ai Dạy Bạn Nhưng Quyết Định Mọi Thứ"
// Ref: Jack Schwager Market Wizards, Kelly Criterion, Van Tharp

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Hai nhà đầu tư cùng sử dụng một hệ thống giao dịch hoàn toàn giống nhau — cùng tín hiệu mua bán, cùng win rate, cùng thị trường. Người thứ nhất phá sản sau 6 tháng. Người thứ hai kiếm được lợi nhuận ổn định.

**Sự khác biệt duy nhất:** cách họ quyết định bỏ bao nhiêu tiền vào mỗi lệnh — hay còn gọi là **Position Sizing**.

Đây là kỹ năng mà các Market Wizards đồng ý là quan trọng hơn bất kỳ tín hiệu mua bán nào.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Rủi Ro Phá Sản Không Thể Phục Hồi (Risk of Ruin)',
        content: `Hãy tưởng tượng một hệ thống giao dịch có win rate 50%, lãi/lỗ mỗi lệnh bằng nhau. Hoàn toàn hòa vốn về mặt kỳ vọng, đúng không?

Sai. Nếu bạn đặt **50% tài khoản** vào mỗi lệnh:
- Sau 2 lệnh thua liên tiếp (xác suất 25%) → chỉ còn 25% tài khoản
- Sau 3 lệnh thua liên tiếp (xác suất 12.5%) → chỉ còn 12.5%
- Sau 4 lệnh thua liên tiếp (xác suất 6.25%) → chỉ còn 6.25%

Với hệ thống tốt, chuỗi 4-6 lệnh thua liên tiếp là hoàn toàn bình thường. Nếu mỗi lệnh mạo hiểm 25-50%, bạn sẽ phá sản **trước khi hệ thống có cơ hội chứng minh mình**.`,
    },
    {
        type: 'steps',
        title: '🎯 3 Hệ Thống Position Sizing Phổ Biến Nhất',
        content: '',
        items: [
            {
                icon: '🛡️',
                title: '1% Rule — Quy Tắc Của Các Pro',
                highlight: 'Rủi ro tối đa 1% tài khoản/lệnh',
                body: 'Mỗi lệnh chỉ được mạo hiểm tối đa 1% tổng tài khoản. Ví dụ: Tài khoản 100 triệu, stop-loss -5% → mỗi lệnh tối đa mua 20 triệu (5% của 20 triệu = 1 triệu = 1% tài khoản). Ngay cả 10 lệnh thua liên tiếp cũng chỉ mất 10% tài khoản — hoàn toàn có thể phục hồi.',
            },
            {
                icon: '⚡',
                title: '2% Rule — Cho Trader Chấp Nhận Rủi Ro Cao Hơn',
                highlight: 'Trade-off: lãi nhanh hơn, drawdown lớn hơn',
                body: 'Tương tự 1% Rule nhưng giới hạn 2%/lệnh. Với 10 lệnh thua liên tiếp sẽ mất ~20% tài khoản. Phù hợp hơn với trader có win rate cao và hệ thống đã được backtested kỹ. Jack Schwager ghi nhận hầu hết Market Wizards không vượt quá 2%/lệnh.',
            },
            {
                icon: '📐',
                title: 'Kelly Criterion — Tối ưu Hóa Toán Học',
                highlight: 'Tối đa hóa tăng trưởng dài hạn',
                body: 'Kelly % = Win Rate - (Loss Rate / Reward:Risk Ratio). Ví dụ: Win rate 40%, R:R = 1:2 → Kelly = 40% - (60%/2) = 10%. Tuy nhiên: Full Kelly rất hung hăng và drawdown lớn. Hầu hết traders dùng Half-Kelly (5% trong ví dụ này) để an toàn hơn.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Correlation Risk — Kẻ Thù Ẩn Của Position Sizing',
        content: `Giả sử bạn đang nắm giữ 5 cổ phiếu, mỗi cổ phiếu chiếm 10% tài khoản với stop-loss -10% → rủi ro mỗi vị thế = 1% tài khoản. Nghe có vẻ an toàn.

**Nhưng:** Nếu tất cả 5 cổ phiếu đều là **ngân hàng**, và thị trường có tin tức xấu về lĩnh vực ngân hàng → cả 5 cùng giảm đồng loạt → bạn thực sự đang mạo hiểm 5% tài khoản cùng lúc, không phải 1%.

**Giải pháp — Correlation Position Sizing:**
- Xác định tổng rủi ro tối đa cho một **nhóm tài sản tương quan** (ví dụ: tất cả ngân hàng = tối đa 3% rủi ro)
- Không bao giờ để tổng rủi ro của tài sản tương quan vượt quá 3-5% tài khoản
- Đa dạng hóa thực sự = đa dạng hóa về RỦI RO, không chỉ về số lượng cổ phiếu`,
    },
    {
        type: 'key-insight',
        title: '💡 Công Thức Tính Position Size Thực Chiến',
        content: 'Số lượng cổ phiếu = (Tài khoản × % Rủi ro/lệnh) ÷ (Giá mua × % Stop-loss). Ví dụ: Tài khoản 100 triệu, rủi ro 1%/lệnh, mua cổ phiếu 50,000đ với stop -8%. Số lượng = (100,000,000 × 1%) ÷ (50,000 × 8%) = 1,000,000 ÷ 4,000 = 250 cổ phiếu. Tức là mua 250 cổ phiếu × 50,000đ = 12.5 triệu tiền vốn, rủi ro tối đa = 1 triệu = 1% tài khoản.',
    },
    {
        type: 'quote',
        content: '"Điều không ai nói với bạn khi bắt đầu đầu tư là: chẳng phải bạn đúng hay sai mới quan trọng. Điều quan trọng là bạn kiếm được bao nhiêu khi đúng và mất bao nhiêu khi sai."',
        author: 'George Soros',
        source: 'The Alchemy of Finance',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Risk of Ruin: hệ thống tốt + position sizing sai = phá sản trước khi hệ thống chứng minh được mình',
            '1% Rule: mỗi lệnh tối đa 1% tài khoản → 10 lệnh thua liên tiếp chỉ mất 10%, hoàn toàn phục hồi được',
            'Kelly Criterion: tối ưu toán học — nhưng dùng Half-Kelly trong thực tế để kiểm soát drawdown',
            'Công thức: Số CP = (Tài khoản × %Risk) ÷ (Giá × %Stop) — tính TRƯỚC khi đặt lệnh',
            'Correlation Risk: 5 cổ phiếu ngân hàng ≠ đa dạng hóa thực sự → tổng rủi ro nhóm tương quan ≤ 3-5%',
            'Hầu hết Market Wizards không vượt quá 2%/lệnh — quyết định này quan trọng hơn tín hiệu mua bán',
        ],
    },
]
