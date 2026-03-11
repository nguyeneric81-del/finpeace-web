// Article content: dau-tu-gia-tri / loi-the-canh-tranh
// "Lợi Thế Cạnh Tranh: 5 Loại Hào Kinh Tế Bảo Vệ Doanh Nghiệp"
// Ref: Buffett, Pat Dorsey "The Little Book That Builds Wealth", Philip Fisher

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Buffett từng nói ông thích mua những doanh nghiệp mà ngay cả một thằng ngốc cũng có thể điều hành — vì sớm muộn, một thằng ngốc sẽ điều hành nó. Đây là triết lý "hào kinh tế" (Economic Moat): lợi thế cạnh tranh cấu trúc bảo vệ doanh nghiệp khỏi kẻ thù lớn nhất của nó — các đối thủ cạnh tranh và thời gian.

Nhưng không phải mọi "lợi thế" đều tạo thành moat bền vững. Pat Dorsey — người xây dựng hệ thống định giá moat cho Morningstar — chỉ ra 5 mô hình cụ thể.`,
    },
    {
        type: 'key-insight',
        title: '💡 Test Quan Trọng Nhất',
        content: '"Nếu tôi có 1 tỷ đồng, tôi có thể tạo ra một đối thủ đáng gờm cho công ty này không?" Nếu CÓ dễ — moat yếu hoặc không tồn tại. Nếu KHÔNG thể — đây là dấu hiệu moat thực sự. Tốc độ tăng ROE liên tục cao qua 5-10 năm mà không cần đòn bẩy nợ là bằng chứng tài chính của hào kinh tế.',
    },
    {
        type: 'steps',
        title: '🏰 5 Loại Hào Kinh Tế Theo Buffett & Dorsey',
        content: '',
        items: [
            {
                icon: '💎',
                title: 'Tài Sản Vô Hình — Thương Hiệu & Bằng Sáng Chế',
                highlight: 'Pricing power — bán giá cao mà không mất khách',
                body: 'Thương hiệu mạnh chiếm "một phần tâm trí người tiêu dùng" — Coca-Cola, Wrigley, McDonald\'s. Tuy nhiên, Buffett cảnh báo: bằng sáng chế của công ty dược có thể biến mất khi hết hạn, trừ khi công ty liên tục tạo ra sản phẩm mới. Thương hiệu ghi nhận trên BCTC thường thấp hơn giá trị thực vì kế toán không ghi nhận đầy đủ.',
            },
            {
                icon: '🔒',
                title: 'Chi Phí Chuyển Đổi Cao — Switching Costs',
                highlight: 'Khách hàng thà trả tiếp còn hơn đổi sang đối thủ',
                body: 'Sản phẩm trở thành thiết yếu nhưng chỉ chiếm tỷ trọng nhỏ trong chi phí tổng của khách. Ví dụ: phần mềm kế toán (MISA), ERP, hệ thống core banking. Khách không đổi vì chi phí chuyển đổi (học lại, rủi ro dữ liệu, gián đoạn) lớn hơn nhiều so với tiết kiệm từ đối thủ rẻ hơn.',
            },
            {
                icon: '🚧',
                title: 'Nhượng Quyền Kinh Doanh — The Toll Bridge',
                highlight: 'Độc quyền cung cấp dịch vụ không thể thay thế',
                body: 'Buffett gọi đây là "trạm thu phí": dịch vụ mà (1) khách hàng cần; (2) không có thay thế tương tự; (3) không bị kiểm soát giá. Moody\'s đánh giá tín nhiệm, H&R Block làm thuế. Trên TTCK VN: sàn giao dịch chứng khoán, một số đơn vị kiểm định độc quyền theo quy định.',
            },
            {
                icon: '🏭',
                title: 'Lợi Thế Chi Phí Thấp — Low-Cost Advantage',
                highlight: 'Sống sót và giành thị phần khi đối thủ sụp đổ',
                body: 'Trong ngành commodity (thép, xi măng, hàng không) — nơi sản phẩm không có sự khác biệt — cách duy nhất tạo moat là chi phí vận hành thấp nhất ngành. Khi chiến tranh giá nổ ra, công ty chi phí thấp vẫn sống sót và GIÀNH THỊ PHẦN khi đối thủ phá sản.',
            },
            {
                icon: '📐',
                title: 'Lợi Thế Quy Mô — Economies of Scale',
                highlight: 'Càng lớn, chi phí mỗi đơn vị càng giảm',
                body: 'Công ty sản xuất 1 triệu sản phẩm có giá thành thấp hơn công ty sản xuất 100,000. Mạng lưới phân phối khổng lồ tạo rào cản ngăn đối thủ mới xâm nhập. Tại VN: FPT về phần mềm, Thế Giới Di Động về bán lẻ, Hòa Phát về thép — quy mô tạo ra lợi thế không thể copy nhanh.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📊 Phần 2: Nhận Diện Moat Qua BCTC — "Trò Chơi Nhất Quán"',
        content: `Buffett coi BCTC là nơi truy tìm dấu vết của hào kinh tế. Trò chơi này mang tên "Sự nhất quán" (Consistency) trong 5 đến 10 năm.

KQKD (Income Statement): Gross Margin > 40% nhất quán = quyền lực định giá. Net Margin > 20% = "mỏ vàng". SG&A < 30% lợi nhuận gộp. Chi phí R&D thấp hoặc bằng 0 (Buffett ghét phải chạy đua R&D để tồn tại). Chi phí lãi vay < 15% lợi nhuận hoạt động.

Bảng CĐKT (Balance Sheet): Nợ dài hạn rất ít hoặc bằng 0 — công ty tự tài trợ từ lợi nhuận. Lợi nhuận giữ lại (Retained Earnings) tăng đều đặn qua các năm. Cổ phiếu quỹ (Treasury Stock) xuất hiện = công ty tạo ra quá nhiều tiền, dùng tiền thừa mua lại cổ phiếu.

Dòng tiền (Cash Flow): CapEx < 50% lợi nhuận thuần (lý tưởng < 25%). Công ty có moat không phải liên tục đốt tiền nâng cấp để cạnh tranh — tiền mặt tích lũy và tự do chảy vào túi chủ sở hữu.`,
    },
    {
        type: 'quote',
        content: '"Chìa khóa để đầu tư không phải là xem ngành đó ảnh hưởng xã hội thế nào, mà là xác định lợi thế cạnh tranh của bất kỳ công ty nào — và quan trọng hơn — độ BỀN của lợi thế đó."',
        author: 'Warren Buffett',
        source: 'Fortune Magazine, 1999',
    },
    {
        type: 'checklist',
        title: '✅ Bộ Test Moat Thực Chiến Tại TTCK Việt Nam',
        content: [
            'Test 1 — Gross Margin: > 40% ổn định 5 năm (CafeF → tab Tỷ số tài chính → chuỗi 5-10 năm). Cao nhất ngành liên tục = pricing power',
            'Test 2 — ROE không dùng đòn bẩy: ROE > 15% đều đặn, D/E < 1.0. ROIC > WACC qua nhiều năm = moat thực sự, không phải đòn bẩy tài chính',
            'Test 3 — CapEx/Lợi nhuận thuần: < 50% ổn định. Nếu phải chi > 50% lợi nhuận để duy trì cạnh tranh → không có moat',
            'Test 4 — Câu hỏi đối thủ: "Tôi có 1 tỷ đồng, tôi có thể cạnh tranh với họ không?" Ví dụ VN có moat: FPT (switching cost IT), Vinamilk (brand + quy mô), Hòa Phát (cost advantage)',
            'Test 5 — Kiểm tra 10 năm: Gross Margin và Net Margin có nhất quán qua 10 năm bao gồm cả các giai đoạn khó khăn (COVID 2020, khủng hoảng lãi suất 2022)?',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Moat Không Phải Vĩnh Cửu — Disruption Phá Hủy Mọi Thứ',
        content: 'Kodak có moat mạnh trong phim ảnh — rồi camera số xuất hiện. Nokia thống trị điện thoại — rồi smartphone bước ra. Moat phải được kiểm tra lại định kỳ. Câu hỏi quan trọng: "5-10 năm tới, điều gì có thể phá hủy moat này?" Tại VN: ngân hàng truyền thống đang bị Fintech cạnh tranh, bán lẻ truyền thống bị e-commerce ăn mòn. Moat rộng nhưng không phải vô hạn. Dù tìm được moat tuyệt vời — vẫn phải mua với Biên độ An toàn, không mua tại đỉnh thị trường.',
    },
    {
        type: 'summary',
        title: '📋 Bảng Nhận Diện Moat Nhanh',
        content: [
            '5 loại moat: Thương hiệu/Bằng sáng chế → Switching Cost → Toll Bridge → Chi phí thấp → Quy mô',
            'KQKD: Gross Margin > 40% | Net Margin > 20% | SG&A < 30% Gross Profit | CapEx < 50% LNST',
            'CĐKT: Nợ dài hạn thấp | Retained Earnings tăng đều | Có Treasury Stock = tiền mặt dư thừa',
            'Test cuối: moat có còn nguyên vẹn qua khủng hoảng không? Kiểm tra năm 2020, 2022',
            'Kết hợp bắt buộc: Moat tốt + Định giá hợp lý (MoS) = công thức Buffett hoàn chỉnh',
        ],
    },
]
