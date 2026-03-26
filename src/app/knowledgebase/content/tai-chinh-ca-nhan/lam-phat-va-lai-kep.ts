import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Lạm phát và Lãi kép là 2 thế lực đối nghịch mạnh mẽ nhất trong vũ trụ tài chính. Một bên là Kẻ Thù Vô Hình âm thầm móc túi bạn ngay cả khi bạn đang ngủ. Một bên là Kỳ Quan Thứ 8 có khả năng biến 1 đồng nhỏ bé thành núi vàng khổng lồ. Hiểu được cơ chế hoạt động của 2 sức mạnh này, bạn mới có thể lướt theo con sóng thay vì bị nó nhấn chìm.`,
    },
    {
        type: 'concept',
        title: '📖 Lạm Phát (Inflation) — Kẻ cắp thầm lặng',
        content: `Lạm phát không làm giảm số lượng tờ tiền trong ví bạn, nó làm giảm KHẢ NĂNG MUA SẮM (Purchasing Power) của những tờ tiền đó. 
Ví dụ: Bát phở năm 2010 giá 25,000đ. Năm nay bát phở y hệt giá 50,000đ. Giá trị của bát phở không tăng, mà là tiền mặt của bạn đã mất đi 50% sức mua.

Nếu bạn ôm 1 Tỷ cất trong két sắt, với mức lạm phát trung bình 4%/năm, sau 10 năm sức mua của 1 Tỷ đó chỉ còn tương đương 675 triệu hiện tại. Việc cất tiền mặt tưởng là an toàn nhất, nhưng thực chất lại là hành động Rủi ro nhất và Mất tiền chắc chắn nhất.`,
    },
    {
        type: 'concept',
        title: '📖 Lãi Kép (Compound Interest) — Kỳ Quan Thứ 8',
        content: `Lãi kép là lãi mẹ đẻ lãi con. Không chỉ tiền gốc ban đầu sinh lời, mà phần tiền lời đó lại tiếp tục cộng gộp vào gốc để sinh lời ở chu kỳ tiếp theo.
Thuộc tính làm nên sức mạnh hủy diệt của Lãi Kép là THỜI GIAN, không phải tỷ suất sinh lời cực cao.

**Sức mạnh của việc Bắt Đầu Sớm:**
Nhà đầu tư A (25 tuổi): Đầu tư 5 triệu/tháng trong chỉ 10 năm rồi DỪNG LẠI (Tổng vốn bỏ ra 600 tr). Để đó đến năm 65 tuổi.
Nhà đầu tư B (35 tuổi): Đầu tư 5 triệu/tháng liên tục 30 năm (Tổng vốn bỏ ra 1.8 Tỷ). Để đến 65 tuổi.
(Giả định lãi suất 10%/năm).

**Kết quả:**
A năm 65 tuổi có 18 Tỷ.
B năm 65 tuổi có 11.3 Tỷ.
B bỏ ra số vốn gấp 3 lần A, nhưng vì bắt đầu trễ 10 năm, B mãi mãi không thể đuổi kịp A.`,
    },
    {
        type: 'quote',
        content: 'Lãi kép là kỳ quan thứ tám của thế giới. Ai hiểu được nó, sẽ kiếm được nó. Ai không hiểu nó, sẽ phải trả tiền cho nó.',
        author: 'Albert Einstein',
        source: 'Khoa học thuật toán',
    },
    {
        type: 'warning',
        title: '⚠️ Bẫy Quy Tắc 72',
        content: `Quy tắc 72 giúp bạn tính nhẩm số năm để nhân đôi tài khoản: Lấy 72 chia cho lãi suất hàng năm. 
- Gửi ngân hàng 6%/năm: Cần 72/6 = 12 năm để nhân đôi số tiền.
- Đầu tư chứng khoán 12%/năm: Cần 72/12 = 6 năm để nhân đôi.
Tuy nhiên, nợ tín dụng 24%/năm: Cần 72/24 = 3 năm để khoản nợ tăng gấp ĐÔI. Đó là mũi tên đâm ngược từ sức mạnh lãi kép.`,
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Nhiệm vụ đầu tiên của Đầu tư không phải là làm giàu, mà là CHỐNG LẠI SỰ BÀO MÒN của Lạm Phát.',
            'Lãi kép không cần chỉ số IQ cao hay dòng vốn lớn, nó chỉ cần sự Kỷ luật và Tuổi trẻ.',
            'Mỗi ngày bạn chần chừ không đầu tư, bạn đang trả một cái chi phí cơ hội đắt đỏ nhất: THỜI GIAN.',
        ],
    },
]
