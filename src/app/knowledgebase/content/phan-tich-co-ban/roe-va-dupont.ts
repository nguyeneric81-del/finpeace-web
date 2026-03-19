// Article content for: phan-tich-co-ban / roe-va-dupont
// ROE & Phân Tích DuPont — Bóc Trần Chất Lượng Lợi Nhuận

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `ROE (Return on Equity — Tỷ suất sinh lời trên vốn chủ sở hữu) là một trong những chỉ số Warren Buffett yêu thích nhất. Và có lý do chính đáng: ROE cao bền vững thường là dấu hiệu của một doanh nghiệp tuyệt vời.

Nhưng có một vấn đề: ROE cao không phải lúc nào cũng tốt.

Một doanh nghiệp có thể "giả tạo" ROE cao bằng cách vay nợ nhiều, mua lại cổ phiếu quỹ làm giảm vốn chủ, hoặc cắt giảm đầu tư dài hạn. Mô hình phân tích DuPont — được phát triển bởi tập đoàn DuPont từ những năm 1920 — là công cụ để "bóc trần" xem ROE cao đến từ đâu.`,
    },
    {
        type: 'key-insight',
        title: '💡 ROE = Net Income / Vốn Chủ Sở Hữu',
        content: 'ROE trả lời câu hỏi: "Cứ 1 đồng vốn cổ đông bỏ vào, doanh nghiệp kiếm được bao nhiêu đồng lợi nhuận?" ROE > 15% liên tục thường là ngưỡng Buffett tìm kiếm. Nhưng quan trọng hơn là TẠI SAO ROE cao — và đây là lúc phân tích DuPont phát huy tác dụng.',
    },
    {
        type: 'concept',
        title: '📖 Mô Hình DuPont 3 Nhân Tố',
        content: `DuPont tách ROE thành 3 thành phần:

**ROE = Biên lợi nhuận ròng × Vòng quay tài sản × Đòn bẩy tài chính**

Hay viết đầy đủ:
**ROE = (Net Income/Revenue) × (Revenue/Total Assets) × (Total Assets/Equity)**

**Thành phần 1 — Biên lợi nhuận ròng (Net Profit Margin):**
Doanh nghiệp kiếm được bao nhiêu % lợi nhuận từ mỗi đồng doanh thu. Cao = có pricing power hoặc kiểm soát chi phí tốt.

**Thành phần 2 — Vòng quay tài sản (Asset Turnover):**
Doanh nghiệp dùng tài sản hiệu quả đến đâu để tạo doanh thu. Cao = mô hình kinh doanh "nhẹ vốn" (bán lẻ, phần mềm). Thấp = ngành thâm dụng vốn (thép, xi măng).

**Thành phần 3 — Đòn bẩy tài chính (Financial Leverage):**
Vốn vay "khuếch đại" ROE như thế nào. Đây là nguồn ROE cao nguy hiểm nhất — vì nó không đến từ hiệu quả kinh doanh mà từ rủi ro.`,
    },
    {
        type: 'steps',
        title: '🔬 Cách Đọc DuPont Để Phân Loại Chất Lượng ROE',
        content: 'Phân tích 3 pattern ROE cao phổ biến:',
        items: [
            {
                icon: '🟢',
                title: 'ROE Cao Từ Biên Lợi Nhuận Cao — TỐT NHẤT',
                body: 'Ví dụ: phần mềm, thương hiệu mạnh, dược phẩm. Net margin cao → doanh nghiệp có pricing power hoặc cost advantage thực sự. Đây là loại ROE bền vững và khó copy.',
                highlight: 'VN ví dụ: VNM (Vinamilk) — Net margin ~15-18%, ROE ~30%',
            },
            {
                icon: '🟡',
                title: 'ROE Cao Từ Vòng Quay Tài Sản — TRUNG BÌNH',
                body: 'Ví dụ: bán lẻ lớn (Walmart, MWG). Margin thấp nhưng quay vòng rất nhanh. ROE tốt nhưng nhạy cảm với gián đoạn chuỗi cung ứng và cạnh tranh giá.',
                highlight: 'VN ví dụ: MWG — margin ~3-4% nhưng asset turnover cao',
            },
            {
                icon: '🔴',
                title: 'ROE Cao Từ Đòn Bẩy Tài Chính — NGUY HIỂM',
                body: 'Doanh nghiệp có ROE 25% nhưng nếu bỏ đòn bẩy, ROE chỉ là 8%. Rủi ro cao: trong suy thoái, lãi suất tăng hoặc doanh thu giảm, đòn bẩy biến ROE thành ROE âm rất nhanh.',
                highlight: 'Dấu hiệu: Debt/Equity > 2x + ROE cao → đặt câu hỏi',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Tôi tìm kiếm những doanh nghiệp có ROE cao mà không cần đến nhiều vốn vay — đây là dấu hiệu của một franchise thực sự."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình Phân Tích DuPont Cho Cổ Phiếu VN',
        content: [
            'Tính ROE 5 năm liên tiếp — tìm trend, không chỉ nhìn năm gần nhất',
            'Tách thành 3 thành phần: (1) Net margin, (2) Asset turnover, (3) Equity multiplier',
            'Nếu ROE cao chủ yếu từ đòn bẩy → xem xét Debt/Equity và Interest Coverage Ratio',
            'So sánh với đối thủ cùng ngành: ROE cao hơn từ component nào?',
            'ROE > 15% liên tục 5 năm + chủ yếu từ margin/efficiency = đánh dấu xem xét kỹ',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Cạm Bẫy ROE Với Ngành Ngân Hàng',
        content: 'Ngân hàng về cơ bản là doanh nghiệp "siêu đòn bẩy" — vốn chủ chỉ chiếm 8-12% tổng tài sản, 88-92% còn lại là tiền gửi khách hàng (nợ). Do đó, đòn bẩy tài chính của ngân hàng luôn rất cao (~10x), làm ROE tự nhiên cao hơn. Khi phân tích ngân hàng VN, thay thế ROE bằng các chỉ số chuyên biệt: ROA (Return on Assets), NIM (Net Interest Margin), và Tỷ lệ nợ xấu (NPL Ratio).',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'ROE = Biên lợi nhuận × Vòng quay tài sản × Đòn bẩy — mỗi nguồn có chất lượng khác nhau',
            'ROE cao từ margin = tốt nhất (pricing power). Từ đòn bẩy = rủi ro nhất',
            'Buffett target: ROE > 15% liên tục 5 năm, chủ yếu không phải từ nợ vay',
            'Ngân hàng: dùng ROA + NIM thay vì ROE vì cơ cấu đòn bẩy đặc thù',
            'Bước tiếp theo: Kết hợp FCF và ROE để đánh giá toàn diện chất lượng lợi nhuận',
        ],
    },
]
