// Article content: quan-tri-rui-ro / cat-lo
// "Cắt Lỗ — Kỹ Năng Quan Trọng Nhất Mà Ít Người Học"
// Ref: Trading in the Zone (Mark Douglas), Elder's Trading for a Living

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Hỏi bất kỳ trader thành công nào: "Kỹ năng quan trọng nhất bạn học được là gì?" — Câu trả lời gần như đồng nhất: **Cắt lỗ kịp thời**.

Nhưng điều nghịch lý là: đây cũng là kỹ năng mà não người có bản năng chống lại mạnh mẽ nhất. Bài học này giải thích tại sao, và quan trọng hơn — làm thế nào để vượt qua bản năng đó.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Não Người Ghét Cắt Lỗ (Về Mặt Sinh Học)',
        content: `**Loss Aversion (Kahneman):** Não người cảm nhận nỗi đau mất 1 đồng mạnh gấp 2.5 lần niềm vui kiếm được 1 đồng. Điều này có nghĩa: khi cổ phiếu đang lỗ, não bộ sẽ kích hoạt cơ chế "fight or flight" — và "fight" trong ngữ cảnh này là giữ lại cổ phiếu, hy vọng nó hồi.

**"Lỗ trên giấy không phải lỗ thật":** Đây là sự tự lừa dối phổ biến nhất. Sự thật: lỗ trên giấy là **lỗ thật 100%** — nó đang chiếm đóng vốn của bạn, ngăn bạn tái đầu tư vào cơ hội tốt hơn.

**Toán học của việc gồng lỗ:**
- Lỗ 10% → cần lãi 11.1% để hòa vốn
- Lỗ 25% → cần lãi 33% để hòa vốn
- Lỗ 50% → cần lãi 100% để hòa vốn
- Lỗ 75% → cần lãi 300% để hòa vốn

Càng để lỗ chạy dài, bài toán hồi phục càng bất khả thi.`,
    },
    {
        type: 'steps',
        title: '⚙️ 3 Kỹ Thuật Đặt Stop-Loss Khoa Học',
        content: '',
        items: [
            {
                icon: '📏',
                title: 'Phương pháp 1: % Cố Định',
                highlight: 'Đơn giản nhất, dễ thực thi nhất',
                body: 'Đặt stop-loss ở -7% đến -8% từ giá mua (theo nghiên cứu của William O\'Neil về CANSLIM). Ưu điểm: đơn giản, nhất quán. Nhược điểm: không tính đến biến động của từng cổ phiếu riêng lẻ (cổ phiếu cao beta sẽ bị stop thường xuyên hơn).',
            },
            {
                icon: '📊',
                title: 'Phương pháp 2: ATR-Based (Volatility Stop)',
                highlight: 'Khoa học và thích nghi nhất',
                body: 'Stop-loss = Giá mua - (ATR × 2 hoặc 3). ATR (Average True Range) đo biến động thực tế của cổ phiếu. Cổ phiếu biến động cao → stop xa hơn tự động. Cổ phiếu ổn định → stop gần hơn. Đây là cách Turtle Traders dùng.',
            },
            {
                icon: '🗺️',
                title: 'Phương pháp 3: S/R Based (Price Action Stop)',
                highlight: 'Stop tại điểm "vô hiệu hóa thesis"',
                body: 'Đặt stop ngay dưới vùng hỗ trợ gần nhất. Logic: nếu giá phá vỡ hỗ trợ đó, luận điểm mua ban đầu của bạn đã sai. Đây là cách stop-loss "có ý nghĩa" nhất về mặt kỹ thuật. Kết hợp tốt với phân tích S/R từ bài trước.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Quy Trình Tâm Lý Để Cắt Lỗ "Không Run Tay"',
        content: `**Bước 1 — Đặt stop-loss TRƯỚC khi vào lệnh:**
Quyết định mức cắt lỗ khi bạn còn bình tĩnh và chưa bị cảm xúc chi phối, không phải sau khi cổ phiếu đã giảm và bạn đang hoảng loạn.

**Bước 2 — Đặt lệnh stop-loss ngay khi mua:**
Nhiều người "tự nhắc nhở" mình cắt lỗ nhưng khi đến lúc thì không làm được. Giải pháp: dùng lệnh stop tự động (GTC Stop Order nếu sàn hỗ trợ).

**Bước 3 — Câu hỏi "Nếu tôi đang có tiền mặt":**
Khi đang gồng lỗ, hãy hỏi: *"Nếu hôm nay tôi đang có tiền mặt, tôi có mua cổ phiếu này ở mức giá HIỆN TẠI không?"* Nếu câu trả lời là Không → bán ngay.

**Bước 4 — Không bao giờ di chuyển stop-loss ra xa hơn:**
Đây là lỗi tử thần. Khi giá đang tiếp cận stop-loss, bản năng mách "dãn stop ra một chút". Đừng làm vậy — đó là bản năng, không phải kỷ luật.`,
    },
    {
        type: 'key-insight',
        title: '💡 Thiên Tài Của Cắt Lỗ Nhỏ: Toán Học Kỳ Vọng',
        content: 'Giả sử bạn cắt lỗ mỗi lệnh ở -5%, và để lãi chạy trung bình +15% khi đúng. Win rate chỉ cần 25% là bạn đã hòa vốn. Win rate 35% là bạn đã có lợi nhuận. Đây chính xác là mô hình của Turtle Traders (40% win rate) và hầu hết các systematic traders thành công: không phải nhờ đoán đúng nhiều, mà nhờ THUA NHỎ và THẮNG LỚN.',
    },
    {
        type: 'quote',
        content: '"Điều đầu tiên chúng tôi học là: không bao giờ để một lệnh thua lỗ nhỏ trở thành lệnh thua lỗ lớn. Điều đó là chết người."',
        author: 'Jesse Livermore',
        source: 'Reminiscences of a Stock Operator',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Loss Aversion: não ghét cắt lỗ vì nỗi đau mất tiền gấp 2.5x niềm vui lời — cần hệ thống cơ học để vượt qua',
            'Toán học của gồng lỗ: lỗ 50% cần lãi 100% để hòa vốn — càng để dài, càng không thể hồi phục',
            '3 phương pháp: % cố định (đơn giản) | ATR-based (khoa học) | S/R-based (có ý nghĩa nhất)',
            'Quy trình quan trọng nhất: đặt stop TRƯỚC khi vào lệnh, khi còn bình tĩnh',
            '"Nếu có tiền mặt, tôi có mua ở giá này không?" → Không → Bán ngay, không cần biện bạch',
            'Không di chuyển stop ra xa hơn — đó là bản năng phá hủy tài khoản, không phải trí tuệ',
        ],
    },
]
