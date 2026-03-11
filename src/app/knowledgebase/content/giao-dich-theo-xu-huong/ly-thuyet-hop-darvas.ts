// Article content: giao-dich-theo-xu-huong / ly-thuyet-hop-darvas
// "Lý Thuyết Hộp Darvas — Hệ Thống Giao Dịch Tự Động Hóa Cảm Xúc"
// Ref: How I Made $2,000,000 in the Stock Market — Nicolas Darvas

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Sau nhiều lần mất tiền vì nghe phím hàng và dự đoán vô căn cứ, Nicolas Darvas nhận ra một chân lý: Cổ phiếu không bao giờ dao động hỗn loạn như những con dơi bay đâm lung tung trong tháp chuông. Chúng luôn tuân theo một xu hướng có trật tự.

Ông hình dung sự biến động của cổ phiếu đang trong xu hướng tăng giống như **một quả bóng cao su nảy trong một chiếc hộp thủy tinh** — chạm trần rồi chạm đáy, liên tục như vậy, cho đến khi tích đủ động năng để xuyên thủng trần cũ và bay lên một chiếc hộp mới cao hơn.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Hiểu Bản Chất Của "Chiếc Hộp Thủy Tinh"',
        content: `**Cách xác định giới hạn của một Hộp Darvas:**

**Trần hộp (Kháng cự):** Khi giá tăng đến một mức nào đó, nhưng trong **3 ngày liên tiếp không thể vượt qua** được mức giá đó — đó là trần hộp.

**Đáy hộp (Hỗ trợ):** Từ trần hộp, giá điều chỉnh giảm. Nếu chạm một mức thấp nhất và **không bị xuyên thủng trong 3 ngày liên tiếp** — đó là đáy hộp.

*Ví dụ thực tế:* Cổ phiếu dao động liên tục, không phá vỡ mốc 36.5 phía dưới và 41 phía trên → Ta có một **Hộp Darvas 36.5/41**.

Quá trình này lặp đi lặp lại: hộp mới cao hơn hộp cũ, từng bước một, tạo nên một xu hướng tăng bậc thang có trật tự.`,
    },
    {
        type: 'steps',
        title: '⚙️ Phần 2: Chiến Lược Bứt Phá & Lệnh Tự Động Hóa',
        content: 'Thay vì dán mắt vào bảng điện mỗi ngày, Darvas xây dựng hệ thống giao dịch hoàn toàn tự động để loại bỏ cảm xúc:',
        items: [
            {
                icon: '🚀',
                title: 'Bước 1: Chỉ mua khi Breakout (Buy On-Stop)',
                highlight: 'Không bao giờ bắt đáy',
                body: 'Darvas không bao giờ mua cổ phiếu đang lình xình ở đáy. Nguyên tắc tối thượng: CHỈ mua khi giá phá vỡ trần của chiếc hộp cao nhất trong lịch sử. Nếu trần hộp là 41, ông đặt lệnh mua tự động (Buy On-Stop) ở giá 41¼. Khi giá chạm mốc này, lệnh tự kích hoạt — không cần đắn đo.',
            },
            {
                icon: '🛡️',
                title: 'Bước 2: Đặt Stop-Loss ngay dưới trần hộp cũ',
                highlight: 'Chiếc lưới an toàn',
                body: 'Ngay khi lệnh mua ở 41¼ được khớp, đặt ngay stop-loss ở 39⅞ (ngay dưới trần hộp cũ). Nếu sai, cổ phiếu rơi về hộp cũ, lệnh tự động bán. Darvas giải thích: "Khi đáy đã rơi ra khỏi hộp, tôi không có cách nào biết giá rớt bao nhiêu. Việc trợ giá không còn nữa — tôi bán ngay."',
            },
            {
                icon: '📈',
                title: 'Bước 3: Trailing Stop — Khóa lợi nhuận khi giá leo dốc',
                highlight: 'Để lãi tự chạy',
                body: 'Khi cổ phiếu bước lên hộp mới cao hơn (ví dụ 45/50), kéo stop-loss từ 39⅞ lên ngay dưới 45. Cứ thế, mỗi lần lên hộp mới, trailing stop được nâng theo — khóa chặt lợi nhuận cho đến khi xu hướng thực sự gãy.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Điều Kiện Đủ — Volume và "Tính Cách" Trader',
        content: `Hệ thống hộp sẽ thành thảm họa nếu áp dụng sai cổ phiếu. Darvas kết hợp với 2 bộ lọc quan trọng:

**Bộ lọc 1 — Volume là điệp viên chỉ điểm:**
Darvas tìm những cổ phiếu vốn "kín tiếng" (giao dịch ảm đạm) đột nhiên có khối lượng tăng vọt. Bùng nổ volume ≡ Smart Money đang bí mật thu gom vì họ biết thông tin nội bộ mà công chúng chưa hay. Volume bùng nổ chính là năng lượng chuẩn bị đẩy quả bóng ra khỏi hộp.

**Bộ lọc 2 — Trở thành cỗ máy vô cảm (Robotic Trader):**
Mark Crisp đúc kết về Darvas: *"Lý do thực sự ông kiếm được nhiều tiền là vì ông không đếm tiền theo nghĩa thông thường. Ông có bộ quy tắc. Khi nó báo tín hiệu mua, ông đặt vào đó một tỷ lệ vốn. Bất kể 5,000 hay 500,000 đô-la, với ông đều như nhau. Ông thực thi quy tắc một cách hoàn hảo không tì vết."*

Darvas tuyệt đối không có "cổ phiếu thú cưng". Chạm stop-loss → bán ngay, không biện bạch.`,
    },
    {
        type: 'key-insight',
        title: '💡 Sức Mạnh Thực Sự: Hệ Thống Chữa Bệnh Tâm Lý',
        content: 'Darvas không bao giờ cố đoán đỉnh hay đoán đáy. Hệ thống Hộp giải quyết triệt để 3 bệnh tâm lý: ① Chống FOMO — không mua vội giữa hộp, chỉ mua khi Breakout chính thức. ② Chống Gồng Lỗ — thủng đáy hộp là stop-loss tự động kích hoạt, không thương lượng. ③ Chống Chốt Non — trailing stop cứ nhích lên theo từng hộp mới, để lợi nhuận tự chạy đến khi xu hướng gãy thật sự.',
    },
    {
        type: 'quote',
        content: '"Tôi chỉ mua sức mạnh và bán sự yếu đuối. Khi một cổ phiếu mạnh đủ để phá vỡ ra khỏi chiếc hộp của nó, đó là lúc tôi mua. Và tôi tiếp tục nắm giữ cho đến khi nó không còn đủ mạnh để làm điều đó nữa."',
        author: 'Nicolas Darvas',
        source: 'How I Made $2,000,000 in the Stock Market',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Hộp Darvas = vùng tích lũy giá có trần (3 ngày không vượt) và đáy (3 ngày không thủng)',
            'Chỉ mua khi Breakout vượt trần hộp + Volume tăng vọt xác nhận = "Smart Money đã vào"',
            'Stop-loss đặt ngay dưới trần hộp cũ → rủi ro xác định được trước khi vào lệnh',
            'Trailing Stop theo từng hộp mới → khóa lợi nhuận, để lãi tự chạy không bị chốt non',
            'Bộ lọc Volume: tìm cổ phiếu kín tiếng đột ngột có volume bùng nổ = tín hiệu sớm nhất',
            'Robotic Trader: không có "cổ phiếu thú cưng", thực thi quy tắc tuyệt đối — chạm stop là bán',
        ],
    },
]
