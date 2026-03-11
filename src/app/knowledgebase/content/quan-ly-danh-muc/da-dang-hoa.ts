// Article content: quan-ly-danh-muc / da-dang-hoa
// "Đa Dạng Hóa Danh Mục — Bao Nhiêu Cổ Phiếu Là Đủ?"
// Ref: Peter Lynch, Warren Buffett, Index Fund Research

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Peter Lynch nói 8-12 cổ phiếu là đủ. Warren Buffett tập trung vào chỉ 5-6 cổ phiếu lớn nhất. John Bogle nói hãy mua cả thị trường qua Index Fund. Vậy ai đúng?

Câu trả lời là: **tất cả đều đúng** — nhưng dành cho những người khác nhau, với mục tiêu khác nhau và kỹ năng khác nhau. Hiểu được tại sao lại như vậy chính là bước đầu để bạn xây dựng danh mục phù hợp với chính mình.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Đa Dạng Hóa? (Và Giới Hạn Của Nó)',
        content: `**Rủi ro trong đầu tư gồm 2 loại:**

**Rủi ro hệ thống (Systematic Risk):** Rủi ro của toàn thị trường — khủng hoảng kinh tế, chiến tranh, đại dịch. Không thể loại bỏ bằng đa dạng hóa.

**Rủi ro phi hệ thống (Unsystematic Risk):** Rủi ro riêng của từng công ty — CEO từ chức, sản phẩm thất bại, scandal kế toán. **Có thể loại bỏ hoàn toàn** bằng đa dạng hóa.

**Kết quả nghiên cứu:** Chỉ cần 15-20 cổ phiếu không tương quan nhau là đã loại bỏ được ~90% rủi ro phi hệ thống. Từ 20 cổ phiếu trở lên, lợi ích biên của đa dạng hóa giảm dần rất mạnh.

**Điểm mấu chốt:** Nếu bạn có hơn 30 cổ phiếu, bạn đang gần như tái tạo lại index — nhưng với chi phí cao hơn và effort nhiều hơn.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Ba Trường Phái — Ai Phù Hợp Với Ai?',
        content: `**Trường phái 1 — Index Fund (Bogle):** Mua ETF theo dõi toàn thị trường (VN-Index, S&P 500). Không cần phân tích, chi phí thấp, đánh bại 90% quỹ chủ động trong dài hạn. Phù hợp: nhà đầu tư dài hạn không có thời gian nghiên cứu.

**Trường phái 2 — Tập trung (Buffett):** "Đa dạng hóa là sự bảo vệ chống lại sự thiếu hiểu biết. Nó không hợp lý với người biết họ đang làm gì." 5-10 cổ phiếu chất lượng cao, nghiên cứu kỹ. Phù hợp: nhà đầu tư giá trị có thời gian nghiên cứu sâu từng công ty.

**Trường phái 3 — Đa dạng có chọn lọc (Lynch):** 8-15 cổ phiếu thuộc nhiều ngành khác nhau, cập nhật thường xuyên. "Mua những gì bạn hiểu." Phù hợp: nhà đầu tư bán thời gian có khả năng theo dõi định kỳ.`,
    },
    {
        type: 'key-insight',
        title: '💡 "Diworsification" — Khi Đa Dạng Hóa Trở Thành Tự Phá Mình',
        content: 'Peter Lynch đặt ra thuật ngữ "diworsification" (đa dạng hóa thành tồi hơn): khi các công ty mua lại những mảng kinh doanh không liên quan chỉ vì có tiền — và thường thua lỗ. Với cá nhân: mua quá nhiều cổ phiếu chỉ để "không bỏ trứng vào một giỏ" mà không hiểu công ty nào, thực ra là giảm kỳ vọng lợi nhuận của mình xuống mức trung bình thị trường — nhưng với effort và chi phí giao dịch cao hơn index fund.',
    },
    {
        type: 'steps',
        title: '🗺️ Nguyên Tắc Xây Dựng Danh Mục Phân Bổ Thực Chiến',
        content: '',
        items: [
            {
                icon: '🎯',
                title: 'Phân bổ theo mục tiêu thời gian',
                highlight: 'Ngắn hạn vs Dài hạn',
                body: 'Tiền cần trong 1-3 năm: giữ tiền mặt hoặc trái phiếu ngắn hạn. Tiền 3-7 năm: cổ phiếu phòng thủ + ETF. Tiền 7+ năm: cổ phiếu tăng trưởng, có thể concentrated hơn. Không dùng tiền ngắn hạn đầu tư cổ phiếu.',
            },
            {
                icon: '🏭',
                title: 'Phân bổ theo ngành — tránh tương quan cao',
                highlight: 'Không bỏ 80% vào ngân hàng',
                body: 'Chọn các cổ phiếu thuộc các ngành khác nhau (tài chính, tiêu dùng, công nghệ, bất động sản, năng lượng). Tránh mua nhiều cổ phiếu trong cùng ngành — khi ngành đó gặp khó, cả danh mục cùng đau.',
            },
            {
                icon: '⚖️',
                title: 'Tái cân bằng định kỳ (Rebalancing)',
                highlight: '6 tháng hoặc khi lệch >20%',
                body: 'Nếu cổ phiếu A tăng từ 10% lên 25% danh mục, cần bán bớt để đưa về target ban đầu. Tái cân bằng ép bạn "bán khi giá cao, mua khi giá thấp" — từ động tác cơ học thay vì cảm tính.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Đa dạng hóa là sự bảo vệ duy nhất bạn có chống lại sự thiếu hiểu biết của chính mình."',
        author: 'Peter Lynch',
        source: 'One Up On Wall Street',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Đa dạng hóa loại bỏ rủi ro phi hệ thống (rủi ro công ty) — không loại bỏ được rủi ro thị trường',
            '15-20 cổ phiếu không tương quan = đã loại bỏ ~90% rủi ro phi hệ thống; trên 30 cổ phiếu = gần như tái tạo Index',
            '"Diworsification": mua quá nhiều cổ phiếu mù quáng = giảm kỳ vọng lợi nhuận về mức trung bình với cost cao hơn Index',
            'Nếu không có thời gian nghiên cứu → Index ETF là lựa chọn tốt hơn mua 30+ cổ phiếu ngẫu nhiên',
            'Tái cân bằng 6 tháng/lần hoặc khi lệch >20% target — ép bạn mua thấp bán cao một cách cơ học',
        ],
    },
]
