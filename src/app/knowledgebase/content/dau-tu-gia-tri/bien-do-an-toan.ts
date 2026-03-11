// Article content: dau-tu-gia-tri / bien-do-an-toan
// "Biên Độ An Toàn: Ba Từ Quan Trọng Nhất Trong Đầu Tư"
// Ref: The Intelligent Investor, Security Analysis (Benjamin Graham)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Benjamin Graham từng mất gần như tất cả trong cuộc đại khủng hoảng 1929. Từ đống tro tàn đó, ông xây dựng lại toàn bộ triết lý đầu tư xoay quanh hai quy tắc tối thượng: "Quy tắc thứ nhất — đừng để thua lỗ. Quy tắc thứ hai — đừng quên quy tắc thứ nhất."

Biên độ an toàn (Margin of Safety) chính là công cụ duy nhất để thực thi hai quy tắc đó. Và Warren Buffett đã gọi nó là "ba từ quan trọng nhất trong đầu tư."`,
    },
    {
        type: 'key-insight',
        title: '💡 Bạn Không Cần Định Giá Chính Xác',
        content: 'Graham nhấn mạnh điều quan trọng nhất: bạn không cần (và không thể) xác định chính xác giá trị thực của một công ty. Bạn chỉ cần một khoảng giá trị xấp xỉ là đủ để đánh giá biên độ an toàn. Khoảng chênh lệch giữa giá mua và giá trị ước tính chính là "tấm đệm" hấp thụ mọi sai số.',
    },
    {
        type: 'concept',
        title: '📖 Tại Sao Luôn Phải Mua Thấp Hơn Giá Trị Thực?',
        content: `Lợi thế 1 — Bảo vệ khỏi sai lầm và xui xẻo: Bản chất định giá là dựa trên ước tính, và con người luôn có thể tính toán sai. Nếu bạn mua doanh nghiệp trị giá 100 đồng với giá chỉ 60 đồng, khoảng chênh lệch 40 đồng này hấp thụ mọi rủi ro khi công ty làm ăn sa sút, nền kinh tế đi xuống, hoặc đơn giản là bạn đã tính toán sai.

Lợi thế 2 — Hạn chế rủi ro giảm giá tàn khốc (Downside Risk): Graham giải thích: nếu bạn mua công ty ở mức 75% giá trị thực (chiết khấu 25%), và sau đó giá trị thực giảm 10%, mức giá bạn mua vẫn đủ an toàn để mang lại lợi nhuận thỏa đáng. Ngược lại, nếu trả giá quá cao — dù công ty tuyệt vời đến đâu — bạn đang tự triệt tiêu khả năng bảo toàn vốn của mình.`,
    },
    {
        type: 'steps',
        title: '🔢 2 Phương Pháp Tính Giá Trị Nội Tại Của Graham',
        content: '',
        items: [
            {
                icon: '🧮',
                title: 'Phương Pháp Net-Net — Mua Dưới Giá Thanh Lý',
                highlight: 'Mua < 2/3 tài sản lưu động ròng',
                body: 'Net-Net = Tài sản ngắn hạn (tiền mặt + hàng tồn kho + khoản phải thu) − Toàn bộ tổng nợ. Nếu vốn hóa thị trường thấp hơn con số này, bạn đang mua công ty rẻ hơn cả giá thanh lý tài sản. Graham dùng công thức này thành công hơn 30 năm.',
            },
            {
                icon: '✖️',
                title: 'Hệ Số Nhân Pha Trộn — P/E × P/B ≤ 22.5',
                highlight: 'P/E < 15 | P/B < 1.5 | P/E × P/B ≤ 22.5',
                body: 'Graham khuyên dùng P/E trung bình 3 năm gần nhất (tránh bị lừa bởi lợi nhuận đột biến một năm). P/B không quá 1.5. Công thức kết hợp: P/E × P/B ≤ 22.5. Linh hoạt: nếu P/E thấp (ví dụ 9), có thể chấp nhận P/B cao hơn (2.5) vì 9 × 2.5 = 22.5 vẫn đạt chuẩn.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Biên độ an toàn là ba từ quan trọng nhất trong đầu tư."',
        author: 'Warren Buffett',
        source: 'Lời tựa tái bản The Intelligent Investor',
    },
    {
        type: 'checklist',
        title: '✅ Ứng Dụng Tại TTCK Việt Nam',
        content: [
            'Tận dụng "Ngài Thị Trường" bi quan: Các nhịp đạp trụ (bán tháo vốn hóa lớn do tin đồn vĩ mô) thường ép giá doanh nghiệp đầu ngành xuống mức cực rẻ → cơ hội mua với MoS lớn',
            'Dùng Stock Screener (FiinTrade, TCBS, WiChart): Lọc P/E trung bình 3 năm < 15 VÀ P/B < 1.5 (hoặc P/E × P/B < 22.5). Loại bỏ công ty có tài sản ngắn hạn < 2× nợ ngắn hạn',
            'Ưu tiên công ty trả cổ tức tiền mặt đều đặn: Đây là bằng chứng lợi nhuận thật — khó xào nấu BCTC khi phải thực sự chi tiền ra',
            'Đa dạng hóa song song với MoS: Ngay cả khi mua với MoS tốt, một cổ phiếu gian lận vẫn có thể đánh bại bạn. Nắm 10-20 cổ phiếu đạt chuẩn Graham để luật số lớn bảo vệ bạn',
            'Kiên nhẫn chờ đợi: Cơ hội MoS lớn không đến mỗi ngày — thường xuất hiện trong correction 15-20% hoặc khủng hoảng ngành cụ thể. Tiền mặt là vũ khí khi chờ đợi',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ MoS Không Bảo Vệ Bạn Khỏi Doanh Nghiệp Gian Lận',
        content: 'Biên độ an toàn chỉ đảm bảo bạn có CƠ HỘI thắng cao hơn thua, không đảm bảo thua lỗ là không thể xảy ra. Tại Việt Nam, rủi ro thao túng BCTC và lãnh đạo gian lận là rất thực tế. Cổ phiếu có P/E × P/B thấp nhưng BCTC bị kiểm toán ngoại trừ hoặc đổi kiểm toán liên tục là red flag cần loại ngay. Graham giải pháp: đa dạng hóa danh mục 10-20 cổ phiếu để một trường hợp gian lận không thể phá hủy toàn bộ tài sản.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ',
        content: [
            'MoS = khoảng chênh giữa giá trị thực và giá mua — đệm giảm sốc cho mọi sai số ước tính',
            'Net-Net: mua khi vốn hóa < tài sản lưu động − tổng nợ → rẻ hơn giá thanh lý',
            'P/E × P/B ≤ 22.5 (P/E < 15 | P/B < 1.5 | dùng P/E trung bình 3 năm)',
            'TTCK VN: tận dụng bi quan đám đông + cổ tức tiền mặt đều + đa dạng hóa 10-20 cổ phiếu',
            'MoS không phải vũ khí tuyệt đối — phải kết hợp với quality check doanh nghiệp',
        ],
    },
]
