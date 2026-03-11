// Article content: giao-dich-theo-xu-huong / turtle-traders
// "Turtle Traders — Hệ Thống Biến Người Thường Thành Trader Triệu Đô"
// Ref: Way of the Turtle (Curtis Faith), The Complete TurtleTrader (Michael Covel)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Năm 1983, nhà giao dịch huyền thoại Richard Dennis đặt cược với bạn thân rằng ông có thể đào tạo bất kỳ ai — từ người chưa biết gì về thị trường — trở thành Trader thành công trong vài tuần.

Kết quả: 13 "chú Rùa" được chọn (không cần bằng cấp, không cần kinh nghiệm) đã kiếm về tổng cộng hơn **150 triệu đô-la** trong 5 năm tiếp theo. Điều này chứng minh một điều sâu sắc: giao dịch thành công là một **kỹ năng có thể học được** — nhưng 90% người biết luật vẫn không làm theo được, vì kẻ thù lớn nhất là chính bản thân mình.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Triết Lý Giao Dịch Theo Xu Hướng (Trend Following)',
        content: `Nhóm Rùa không đọc báo cáo tài chính, không quan tâm tin tức vĩ mô, không nghe chuyên gia TV. Triết lý của họ cực đoan và đơn giản:

**Không dự đoán, chỉ phản ứng:** Không cố đoán đỉnh hay bắt đáy. Không ai có thể dự đoán tương lai nhất quán. Nếu thị trường tăng → mua. Nếu giảm → bán khống.

**Giá là chỉ báo duy nhất:** Bài học đầu tiên Dennis dạy: *"Giá cả là mối quan tâm duy nhất."* Nếu cổ phiếu rớt từ 60 → 58 → 57 → 53, bất chấp mọi chỉ báo kỹ thuật hay tin tức tốt đẹp nào — nếu giá giảm, bạn phải bán.

**Giao dịch vạn vật:** Vì chỉ quan tâm giá, hệ thống Rùa áp dụng được cho mọi thị trường — Đậu tương, Dầu mỏ, Tiền tệ, Cổ phiếu. Biểu đồ của IBM hay Hợp đồng tương lai Ngô không có gì khác biệt.`,
    },
    {
        type: 'steps',
        title: '⚙️ Phần 2: Hệ Thống Giao Dịch Của "Rùa"',
        content: 'Nhiều người lầm tưởng bí mật nằm ở tín hiệu vào lệnh. Sự thật: tín hiệu chỉ đóng góp 10% thành công — 90% còn lại là **Quản trị vốn (Money Management)**.',
        items: [
            {
                icon: '📡',
                title: 'Tín hiệu vào lệnh: 20-Day Breakout (Donchian Channel)',
                highlight: 'Không bao giờ bỏ lỡ siêu xu hướng',
                body: 'Mua khi giá vượt đỉnh cao nhất 20 ngày. Bán khống khi giá thủng đáy thấp nhất 20 ngày. Bất kỳ xu hướng lớn nào cũng bắt đầu bằng một breakout ngắn hạn — bằng cách luôn theo breakout, Rùa đảm bảo không bao giờ bỏ lỡ một super-trend.',
            },
            {
                icon: '⚖️',
                title: 'Position Sizing bằng ATR — Chìa khóa sinh tử',
                highlight: 'Rủi ro bằng nhau ở mọi lệnh',
                body: 'Dùng ATR (Average True Range) để tính số lượng mua: thị trường biến động mạnh → mua ít; thị trường êm đềm → mua nhiều. Kết quả: mọi lệnh giao dịch (dù Dầu thô hay Trái phiếu) đều mang cùng một mức rủi ro tính bằng tiền — thường là 1-2% tài khoản.',
            },
            {
                icon: '🔺',
                title: 'Pyramiding — Nhồi lệnh khi xu hướng đúng',
                highlight: 'Biến lãi nhỏ thành lãi khổng lồ',
                body: 'Win rate của Rùa chỉ 35-40% — sai nhiều hơn đúng. Bí quyết: khi sai, stop-loss tự động chém lỗ ở mức tối đa 1-2%. Khi đúng và bắt trúng xu hướng lớn, họ mua thêm (averaging up) theo từng bước giá — biến 20% lãi thành 200-300%, đủ bù cho hàng tá lệnh lỗ nhỏ.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Tại Sao 90% Nhà Đầu Tư Biết Luật Nhưng Không Làm Theo?',
        content: `Richard Dennis đã nói: *"Tôi có thể đăng các quy tắc giao dịch lên mặt báo và sẽ chẳng có ai làm theo. Chìa khóa là sự nhất quán và kỷ luật."*

**Sợ chuỗi thua lỗ liên tiếp (Drawdowns):** Với win rate 40%, Rùa có thể chịu đựng 6, 7, thậm chí 10 lệnh cắt lỗ liên tiếp trước khi bắt được sóng lớn. Hầu hết nhà đầu tư nghiệp dư không chịu nổi nỗi đau tâm lý này. Họ vứt bỏ hệ thống và từ chối vào lệnh lần thứ 11 — và trớ trêu thay, lần 11 thường chính là cú breakout tạo lợi nhuận 100%.

**Bản năng chốt non:** Khi cổ phiếu tăng 30%, bản năng mách bảo phải bán ngay. Rùa thì ngược lại — họ sẵn sàng để lợi nhuận trên giấy sụt giảm, đổi lấy cơ hội ăn trọn xu hướng 200-300%. Để lãi tự chạy là điều cực kỳ khó chịu về mặt tâm lý.

**Lòng kiêu hãnh (Ego):** Hầu hết tham gia thị trường không phải để kiếm tiền, mà để thỏa mãn cái tôi — muốn chứng tỏ thông minh, muốn dự đoán đúng. Giao dịch theo Rùa cực kỳ "nhàm chán": không dự đoán, không cảm xúc, chỉ là cỗ máy tuân thủ luật lệ.`,
    },
    {
        type: 'key-insight',
        title: '💡 Câu Hỏi Của Richard Dennis',
        content: '"Bạn muốn trở nên TỐT (đoán đúng) hay bạn muốn MAY MẮN (kiếm được tiền) trong giao dịch?" — Hệ thống Rùa chứng minh: Bằng cấp Tiến sĩ của Harvard không quan trọng bằng khả năng cắt lỗ tự động và gồng lãi đến cùng. Lợi thế thực sự không nằm ở thuật toán phức tạp, mà ở khả năng kiểm soát cái tôi và tuân thủ tuyệt đối Position Sizing.',
    },
    {
        type: 'quote',
        content: '"Giao dịch không đòi hỏi trí tuệ. Nó đòi hỏi kỷ luật. Và kỷ luật có nghĩa là: làm đúng những gì hệ thống bảo, ngay cả khi cảm xúc của bạn đang thét lên điều ngược lại."',
        author: 'Curtis Faith',
        source: 'Way of the Turtle',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Trend Following: không dự đoán, chỉ phản ứng với giá — nếu giá tăng mua, nếu giảm bán',
            '20-Day Breakout (Donchian): mua khi vượt đỉnh 20 ngày, không bao giờ bỏ lỡ super-trend',
            'Position Sizing bằng ATR: mọi lệnh đều mang rủi ro bằng nhau (1-2% tài khoản)',
            'Win rate 35-40% nhưng vẫn kiếm triệu đô vì: cắt lỗ nhỏ + gồng lãi lớn + pyramiding',
            'Kẻ thù lớn nhất: Sợ drawdown → bỏ hệ thống đúng lúc cần nhất; Ego → muốn đoán đúng hơn muốn kiếm tiền',
            'Lợi thế thực sự = kiểm soát cái tôi + tuân thủ Position Sizing tuyệt đối — không phải thuật toán phức tạp',
        ],
    },
]
