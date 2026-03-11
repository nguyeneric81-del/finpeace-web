// Article content: quan-ly-danh-muc / da-dang-hoa
// "Đa Dạng Hóa Danh Mục — Bao Nhiêu Cổ Phiếu Là Đủ?"
// Ref: Malkiel, Peter Lynch, Graham, Fisher, Buffett, Greenblatt

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Peter Lynch nói 10-15 cổ phiếu là đủ. Benjamin Graham khuyên 10-30. Warren Buffett tập trung vào 5-8. John Bogle nói hãy mua cả thị trường qua ETF. Vậy ai đúng?

Câu trả lời không nằm ở con số — mà nằm ở **loại nhà đầu tư bạn là**. Khoa học đã xác định điểm tới hạn của đa dạng hóa. Sau đó, 3 trường phái lớn đưa ra 3 chiến lược tương ứng với 3 cấp độ kiến thức và thời gian khác nhau.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Khoa Học Về Điểm Tới Hạn Của Đa Dạng Hóa',
        content: `**Thuyết Danh Mục Hiện Đại (MPT)** đã chứng minh bằng toán học:

Đa dạng hóa giúp giảm **rủi ro phi hệ thống** (rủi ro riêng của từng công ty), nhưng có một điểm tới hạn sau đó lợi ích biên gần như bằng 0.

**Con số 15 thần kỳ:** Chỉ cần ~15 cổ phiếu ở các ngành khác nhau đã đạt mức đa dạng hóa **85%** — loại bỏ 85% rủi ro phi hệ thống.

**Con số 50-60 tối đa (Giáo sư Burton Malkiel):** Khi đạt 30 cổ phiếu, rủi ro phi hệ thống đã bị loại trừ phần lớn. Ở 50-60 cổ phiếu có giá trị bằng nhau, rủi ro phi hệ thống gần như bị triệt tiêu hoàn toàn — danh mục bắt đầu chuyển động đồng điệu với thị trường chung.

**Kết luận:** Mua 200 cổ phiếu không an toàn gấp 10 lần mua 20 cổ phiếu. Sau 50-60 cổ phiếu, bạn chỉ đang tái tạo lại Index — nhưng với chi phí giao dịch và effort cao hơn Index Fund rất nhiều.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 2: 3 Trường Phái — Ai Phù Hợp Với Ai?',
        content: `**Trường phái 1 — Mua "Cả Thị Trường" qua ETF (Bogle, Malkiel, Buffett)**

Dành cho: Người bận rộn, chưa có kiến thức chuyên sâu, không muốn rủi ro chọn sai cổ phiếu.

Triết lý: Hơn 2/3 nhà quản lý quỹ chuyên nghiệp thất bại trong việc đánh bại S&P 500 trong dài hạn. Thay vì mò kim đáy bể, hãy "mua luôn cả đống cỏ khô" — ETF Index Fund với chi phí cực thấp, thu về mức lợi nhuận trung bình thị trường (~10%/năm trong lịch sử).

Buffett: *"Khi đầu tư theo từng giai đoạn trong một quỹ chỉ số, nhà đầu tư không biết gì cũng có thể đầu tư như chuyên gia."*

---

**Trường phái 2 — Đa dạng hóa vừa đủ: 10-30 cổ phiếu (Lynch, Graham, Greenblatt)**

Dành cho: Nhà đầu tư có kiến thức, có thời gian nghiên cứu, muốn vượt trội thị trường nhưng vẫn cần màng lưới an toàn.

Graham khuyên nhà đầu tư phòng vệ: 10-30 cổ phiếu của các công ty lớn, ổn định, tài chính vững mạnh. Greenblatt (công thức magic formula): 20-30 cổ phiếu để đạt kết quả trung bình theo xác suất toán học. 10-30 cổ phiếu đảm bảo: nếu 1-2 công ty phá sản, danh mục không bị ảnh hưởng quá nặng — nhưng vẫn đủ tập trung để theo dõi được.

---

**Trường phái 3 — Đầu tư Tập trung: 5-10 cổ phiếu (Buffett, Fisher, Munger)**

Dành cho: "Know-something investor" — người có khả năng phân tích kinh doanh sâu và kiểm soát tâm lý xuất sắc.

Philip Fisher: Sở hữu hơn 20 cổ phiếu là "dấu hiệu không khôn ngoan về tài chính". Con số tốt hơn là 10-12. "Mua cổ phiếu một công ty mà bạn không có hiểu biết còn nguy hiểm hơn không đa dạng hóa."

Buffett gọi sở hữu 50-70 cổ phiếu là "đầu tư kiểu thuyền Nô-ê" — sẽ khiến bạn trắng tay. Câu hỏi của Buffett: *"Nếu doanh nghiệp tốt nhất bạn có triển vọng sáng sủa nhất, tại sao bạn đổ tiền vào công ty yêu thích thứ 20 thay vì dồn thêm cho lựa chọn số 1?"*

**Cảnh báo:** Chiến lược tập trung đi kèm biến động ngắn hạn cực cao. Chỉ được phép khi bạn đặt cược lớn cho những sự kiện có khả năng xảy ra nhất — và khi bạn đủ tâm lý để chịu đựng danh mục giảm 30-40% tạm thời mà không bán.`,
    },
    {
        type: 'key-insight',
        title: '💡 "Diworsification" — Khi Đa Dạng Hóa Trở Thành Tự Phá Mình',
        content: 'Peter Lynch đặt ra thuật ngữ "diworsification": mua quá nhiều cổ phiếu mà không hiểu công ty nào = chủ động hạ kỳ vọng lợi nhuận về mức trung bình thị trường, nhưng với effort và phí giao dịch cao hơn Index Fund. Nếu bạn đang sở hữu 50 cổ phiếu, tự hỏi: "Tôi có hiểu được business model của 50 công ty này không?" Nếu không — hãy mua ETF thay vì tự lừa mình là đang "đầu tư".',
    },
    {
        type: 'steps',
        title: '🎯 Tổng Kết: Chiến Lược Nào Phù Hợp Với Bạn?',
        content: '',
        items: [
            {
                icon: '📦',
                title: 'Không đọc được báo cáo tài chính, không có thời gian',
                highlight: '→ 1-2 quỹ ETF Index Fund',
                body: 'Mua ETF VN30, VNINDEX, hoặc S&P 500. Chi phí thấp nhất, effort thấp nhất, và lịch sử cho thấy đánh bại 2/3 quỹ chủ động. Tái cân bằng 1 lần/năm là đủ.',
            },
            {
                icon: '🔍',
                title: 'Thích nghiên cứu nhưng chưa tự tin tuyệt đối vào định giá',
                highlight: '→ 10-20 cổ phiếu, đa ngành',
                body: 'Chọn cổ phiếu từ ít nhất 5-6 ngành khác nhau. Đủ để bảo vệ khỏi rủi ro tập trung ngành, nhưng vẫn theo dõi được. Tái cân bằng mỗi quý khi một ngành lệch quá 20% target.',
            },
            {
                icon: '🎯',
                title: 'Thấu hiểu ngành và doanh nghiệp đến từng chi tiết',
                highlight: '→ 5-8 cổ phiếu xuất sắc nhất',
                body: 'Dồn vốn lớn vào ý tưởng tự tin nhất. Chấp nhận biến động ngắn hạn cực cao. Chỉ phù hợp khi bạn đã paper trade ít nhất 1-2 năm và có track record thực sự, không phải cảm giác.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Đa dạng hóa là sự bảo vệ duy nhất bạn có chống lại sự thiếu hiểu biết của chính mình. Với người biết mình đang làm gì, đa dạng hóa không có nhiều ý nghĩa."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'MPT: 15 cổ phiếu = 85% đa dạng hóa | 50-60 cổ phiếu = gần 100% — sau đó không thêm được gì',
            'Trường phái ETF: dành cho "Know-nothing investor" — đơn giản, chi phí thấp, đánh bại 2/3 quỹ chủ động',
            'Trường phái 10-30: Graham/Lynch — màng lưới an toàn cho nhà đầu tư bán thời gian',
            'Trường phái 5-8: Buffett/Fisher — chỉ khi bạn thực sự hiểu sâu từng doanh nghiệp',
            '"Diworsification": >30 cổ phiếu mà không hiểu = tái tạo Index với chi phí cao hơn Index Fund',
            'Câu hỏi Buffett: "Tại sao bỏ tiền vào công ty thứ 20 khi không dồn thêm cho deal số 1?"',
        ],
    },
]
