// Article content: phan-tich-co-ban / dinh-gia-co-phieu
// "Định Giá Cổ Phiếu: 5 Công Cụ Bóc Trần Giá Trị Thực"
// Ref: The Little Book That Beats the Market (Greenblatt), The Intelligent Investor (Graham), Buffett

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `P/E = 15 — đắt hay rẻ? Câu hỏi này không có câu trả lời nếu không có ngữ cảnh. P/E 15 của một công ty tăng trưởng 30%/năm là rẻ kinh khủng. P/E 15 của một công ty đang suy thoái là đắt kinh khủng.

Và đây là điều nguy hiểm hơn: P/E thấp đôi khi không phải cơ hội — mà là cái bẫy. Thị trường định giá thấp một công ty vì lý do — và lý do đó thường là thật. Bài học này trang bị cho bạn 5 công cụ để đọc đúng tín hiệu.`,
    },
    {
        type: 'key-insight',
        title: '💡 Dùng Ít Nhất 2 Phương Pháp Cross-Check',
        content: 'Không bao giờ ra quyết định từ 1 chỉ số đơn lẻ. Mỗi công cụ định giá có điểm mù riêng. Khi 2-3 phương pháp cùng chỉ về một hướng — đó mới là tín hiệu đáng tin cậy.',
    },
    {
        type: 'steps',
        title: '📊 5 Công Cụ Bóc Trần Giá Trị Thực',
        content: '',
        items: [
            {
                icon: '📈',
                title: 'P/E và PEG — Công Cụ Phổ Biến Nhất',
                highlight: 'PEG < 0.5: rất rẻ | > 1: đắt',
                body: 'P/E đứng một mình không nói lên nhiều. Giải pháp: chia P/E cho tốc độ tăng trưởng kỳ vọng → PEG. PEG < 0.5 = bị định giá thấp hấp dẫn; 0.5–1.0 = hợp lý; > 1 (đặc biệt > 2) = đắt. Khi P/E thấp + tăng trưởng cao → "lợi nhuận kép": giá tăng nhờ EPS tăng VÀ thị trường nâng hệ số P/E.',
            },
            {
                icon: '📚',
                title: 'P/B — Giá So Với Sổ Sách',
                highlight: 'Graham: P/E × P/B ≤ 22.5',
                body: 'P/B thấp <1.5 có thể là cơ hội — hoặc là cạm bẫy nếu tài sản trên sổ sách là hàng tồn kho không bán được, khoản phải thu khó đòi. Quy tắc pha trộn của Graham: P/E × P/B không vượt quá 22.5 (P/E tối đa 15 × P/B tối đa 1.5). Phù hợp nhất: ngân hàng, bảo hiểm, bất động sản.',
            },
            {
                icon: '⚖️',
                title: 'EBIT/EV — Công Thức Kỳ Diệu Greenblatt',
                highlight: 'Tốt hơn P/E vì tính cả nợ',
                body: 'EV = Vốn hóa thị trường + Nợ ròng. Đặt các công ty có cấu trúc nợ khác nhau lên cùng một bàn cân. Greenblatt ưa EBIT/EV hơn P/E vì tính đến khoản nợ và thuế. Buffett cảnh báo: EBITDA "thật ngớ ngẩn" vì bỏ qua khấu hao — máy móc rồi sẽ hao mòn và phải thay. Dùng EBIT, không dùng EBITDA.',
            },
            {
                icon: '💹',
                title: 'P/S — Cứu Tinh Khi Công Ty Chưa Có Lợi Nhuận',
                highlight: 'P/S > 5: cần thận trọng cao',
                body: 'Khi công ty lỗ hoặc lợi nhuận bị bóp méo kế toán, P/E vô dụng. Doanh thu (Sales) rất khó bị thao túng. Cảnh báo: Enron trước khi sụp đổ có P/S hơn 200 — nhà đầu tư trả 200 đô-la cho mỗi 1 đô-la doanh thu. Thông thường P/S > 5 đã là rất cao.',
            },
            {
                icon: '🔭',
                title: 'DCF — Định Giá Tuyệt Đối (Buffett)',
                highlight: 'Giá trị thực = PV của tất cả dòng tiền tương lai',
                body: 'Khác với 4 phương pháp "tương đối" (so sánh), DCF là định giá "tuyệt đối" dựa lý thuyết John Burr Williams. Giá trị thực = tổng dòng tiền tương lai chiết khấu về hiện tại. Buffett chỉ dùng DCF cho doanh nghiệp đơn giản, dễ hiểu — dòng tiền dễ dự đoán. Sau đó áp thêm Margin of Safety: chỉ mua khi giá thị trường thấp hơn đáng kể so với giá trị DCF.',
            },
        ],
    },
    {
        type: 'concept',
        title: '⚠️ Khi Nào P/E Thấp Là BẪY?',
        content: `P/E thấp có thể là tín hiệu cảnh báo thảm họa, không phải cơ hội. Một công ty đang nằm trên bờ vực khó khăn tài chính — hoặc có chất lượng lợi nhuận kém — sẽ luôn bị thị trường bán với P/E thấp bất thường.

Trong trường hợp này, P/E thấp không phản ánh giá trị — nó phản ánh mối lo ngại sâu sắc của thị trường về khả năng sinh tồn. Nếu lợi nhuận tiếp tục giảm, bạn chịu "thiệt hại kép": EPS giảm + P/E bị nén thêm → giá cổ phiếu giảm mạnh hơn bạn tưởng.

Nguyên tắc nhận diện value trap: dùng PEG (P/E < 1.0 + tăng trưởng dương = cơ hội thực). Nếu P/E thấp VÀ EPS đang giảm liên tiếp → bẫy.`,
    },
    {
        type: 'quote',
        content: '"Bất kỳ khi nào bạn nghe cấp quản lý đề cập EBITDA thì có nghĩa là họ không có một lợi thế cạnh tranh bền vững."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Meeting',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình Định Giá Thực Chiến Trên TTCK Việt Nam',
        content: [
            'Bước 1: Xác định loại doanh nghiệp trước — có lợi nhuận dương không? Nếu không → dùng P/S. Ngân hàng → P/B. Tăng trưởng cao → PEG',
            'Bước 2: Lấy P/E, P/B, EV/EBITDA trên CafeF, VCSC, HSC Research → so với median 5 năm của chính doanh nghiệp',
            'Bước 3: So sánh với peer group trong ngành (3-5 công ty tương đương) — đang premium hay discount?',
            'Bước 4: Kiểm tra PEG = P/E / tốc độ tăng trưởng EPS kỳ vọng. PEG < 1.0 = hấp dẫn',
            'Bước 5: Với doanh nghiệp ổn định dễ dự đoán — tự tính giá trị DCF đơn giản, áp MoS 30%, đặt lệnh LO',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Đừng Bao Giờ Dùng 1 Chỉ Số Duy Nhất',
        content: 'Mỗi chỉ số có điểm mù: P/E bị bóp méo bởi kế toán. P/B không tính tài sản vô hình. EV/EBITDA bỏ qua capex. P/S không phân biệt biên lợi nhuận. DCF phụ thuộc vào giả định tương lai. Nguyên tắc vàng: so sánh ít nhất 2-3 phương pháp. Nếu P/E nói "rẻ" nhưng EBIT/EV nói "đắt" — hãy điều tra thêm trước khi ra quyết định.',
    },
    {
        type: 'summary',
        title: '📋 Bảng Tóm Tắt 5 Công Cụ',
        content: [
            'P/E + PEG: phổ biến nhất | PEG < 0.5 rất hấp dẫn | P/E thấp đơn lẻ có thể là bẫy',
            'P/B: cho ngân hàng/BĐS | Graham rule: P/E × P/B ≤ 22.5',
            'EBIT/EV (Greenblatt): tốt hơn P/E vì tính cả nợ | Tránh EBITDA vì bỏ qua khấu hao (Buffett)',
            'P/S: cứu tinh khi công ty chưa có lợi nhuận | P/S > 5 cần thận trọng cao',
            'DCF: định giá tuyệt đối — chỉ dùng cho doanh nghiệp đơn giản, dễ đoán + áp MoS 30%',
        ],
    },
]
