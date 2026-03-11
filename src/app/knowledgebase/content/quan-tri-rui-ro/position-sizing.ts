// Article content: quan-tri-rui-ro / position-sizing
// "Position Sizing — Bí Quyết Không Ai Dạy Bạn Nhưng Quyết Định Mọi Thứ"
// Ref: Turtle Traders, Jack Schwager Market Wizards, Kelly Criterion

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Nhiều người lầm tưởng "chén thánh" của giao dịch nằm ở điểm mua/bán chính xác. Nhóm Turtle Traders đã tiết lộ sự thật gây sốc: **Quản lý vốn chiếm tới 90% những gì họ làm.**

Họ thừa nhận hiệu suất sẽ không sụt giảm quá nghiêm trọng ngay cả khi tung đồng xu để quyết định hướng giao dịch. Lợi thế thực sự của họ nằm ở **cách xác định quy mô vị thế, cách nhồi thêm lệnh khi đúng, và cách đặt stop-loss**.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Position Sizing Quyết Định 90% Thành Bại?',
        content: `Jack Schwager (Market Wizards) sau khi phỏng vấn những trader xuất chúng nhất thế giới kết luận: *"Mặc dù công cụ và thông tin quan trọng, nhưng chiến lược quản lý vốn tốt và kỷ luật thép để tuân thủ nó mới là điều kiện tiên quyết để sống sót."*

**Toán học của drawdown — bất đối xứng khắc nghiệt:**
- Mất 10% → cần lãi 11.1% để hòa
- Mất 25% → cần lãi 33% để hòa
- Mất **50%** → cần lãi **100%** để hòa
- Mất 75% → cần lãi **300%** để hòa

J.K. Klingenstein (nhà tài chính huyền thoại), khi được hỏi bí quyết làm giàu, trả lời chỉ 3 chữ: **"Đừng thua lỗ."**`,
    },
    {
        type: 'steps',
        title: '📊 Phần 2: Mô Phỏng — Sức Mạnh Của "Chỉ Rủi Ro 1-2%"',
        content: 'Cùng một hệ thống giao dịch, cùng win rate — position sizing khác nhau tạo ra kết quả hoàn toàn trái ngược:',
        items: [
            {
                icon: '💣',
                title: 'Kịch bản Nguy Hiểm: Rủi ro 10%/lệnh',
                highlight: 'Chuỗi 5 lệnh thua = mất 50% tài khoản',
                body: '5 lệnh thua liên tiếp (hoàn toàn bình thường trong downtrend) → bốc hơi 50% vốn. Để gỡ lại cần lãi 100% — cực kỳ khó. Tâm lý sụp đổ, quyết định sai lầm liên tiếp. Đây là con đường phá sản của phần lớn tài khoản.',
            },
            {
                icon: '🛡️',
                title: 'Kịch bản An Toàn: Rủi ro 1-2%/lệnh (Quy Tắc 2%)',
                highlight: '10 lệnh thua liên tiếp = chỉ mất ~18%',
                body: '10 lệnh thua liên tiếp → tài khoản chỉ mất khoảng 18%. Vẫn còn hơn 80% vốn để tham gia tiếp. Khi bắt được một siêu xu hướng, số vốn cốt lõi này nhanh chóng bù đắp toàn bộ. Đây là sự khác biệt giữa sinh tồn và phá sản.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Quy Tắc 2% — Ranh Giới Rủi Ro Kinh Doanh',
        content: `**Bản chất Quy tắc 2%:**
Không bao giờ để mất quá 2% vốn tài khoản cho bất kỳ một giao dịch đơn lẻ nào.

**Ranh giới sinh tử:**
- Rủi ro < 2%/lệnh → "Rủi ro người làm kinh doanh" → chấp nhận được
- Rủi ro > 2%/lệnh → "Cầm chắc thua lỗ" → nguy hiểm

**Công thức Position Sizing thực chiến:**
*Số CP = (Tài khoản × 2%) ÷ (Khoảng cách Stop-loss tính bằng tiền)*

**Ví dụ:** Tài khoản 100,000 đô → rủi ro tối đa $2,000/lệnh.
- Stop-loss xa (rủi ro/CP cao) → buộc phải mua ít cổ phần hơn
- Stop-loss gần (rủi ro/CP thấp) → có thể mua nhiều hơn

Nếu vi phạm quy tắc này — mua không đặt stop và để giá rơi tự do — có thể phá hủy ngay cả những tài khoản lớn nhất.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 4: Kelly Criterion — Bằng Chứng Toán Học',
        content: `Công thức Kelly xác định quy mô giao dịch tối ưu để tối đa hóa tốc độ tăng trưởng tài khoản về mặt lý thuyết.

**Trong thực tế:** Full Kelly thường quá hung hăng và tạo ra drawdown cực kỳ khốc liệt — tâm lý con người không thể chịu đựng. Hầu hết traders dùng **Half-Kelly** hoặc **Quarter-Kelly** trong thực chiến.

**Giá trị cốt lõi của Kelly:** Đây là bằng chứng toán học chứng minh rằng **quy mô vị thế là yếu tố quyết định**, không phải tín hiệu vào lệnh. Ngay cả với một hệ thống có edge dương, position sizing sai có thể dẫn đến phá sản.

**3 biến số Kelly cần biết:** Win Rate (%), Average Win, Average Loss → từ đó tính được % vốn tối ưu mỗi lệnh.`,
    },
    {
        type: 'key-insight',
        title: '💡 Lợi Thế Thực Sự Của Trader Chuyên Nghiệp',
        content: 'Lợi thế thực sự không phải là biết trước tương lai — mà là biết chính xác mình sẽ mất bao nhiêu tiền nếu sai. Position Sizing 1-2% chính là "chiếc lưới an toàn" đảm bảo bạn luôn còn tiền để chơi tiếp vào ngày mai. Trader thua vì một lệnh lớn. Trader thắng nhờ hàng trăm lệnh nhỏ được quản lý tốt.',
    },
    {
        type: 'quote',
        content: '"Quản lý rủi ro chính là ranh giới tuyệt đối giữa thành công và thất bại trong giao dịch. Đó là những gì tạo ra sự khác biệt về lâu dài."',
        author: 'Curtis Faith',
        source: 'Way of the Turtle',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Turtle Traders: quản lý vốn chiếm 90% thành công — tín hiệu vào lệnh chỉ đóng góp 10%',
            'Toán học drawdown bất đối xứng: mất 50% cần lãi 100% để hòa — chuỗi thua nhỏ tích lũy thành thảm họa lớn',
            'Quy Tắc 2%: không rủi ro quá 2%/lệnh | 10 lệnh thua liên tiếp chỉ mất ~18% vốn → vẫn tồn tại được',
            'Công thức: Số CP = (Tài khoản × 2%) ÷ Khoảng cách Stop-loss → tính TRƯỚC khi đặt lệnh',
            'Kelly Criterion: bằng chứng toán học về tầm quan trọng của position sizing — dùng Half-Kelly trong thực chiến',
            '"Đừng thua lỗ" (Klingenstein) — không phải đừng sai, mà đừng để một lệnh sai phá hủy toàn bộ tài khoản',
        ],
    },
]
