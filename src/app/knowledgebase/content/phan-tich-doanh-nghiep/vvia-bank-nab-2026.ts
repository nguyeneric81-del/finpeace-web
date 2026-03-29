import type { ContentBlock } from '../../data'

export const vviaBankNab2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Nam A Bank - Hành Trình Lột Xác Và Niêm Yết',
        content: 'Nam A Bank (NAB) là một trong những đại diện miền Nam vươn lên mạnh mẽ nhất. Được hậu thuẫn bởi hệ sinh thái vững chắc, NAB liên tục cải thiện vị thế từ một ngân hàng nhỏ trở thành ngân hàng hạng trung đầy năng lượng.'
    },
    {
        type: 'key-insight',
        title: '🌟 Tầng 1 (Động Lực Số Hóa Và Hệ Sinh Thái)',
        content: '- **ONEBANK tự động:** Tự hào vươn lên số hoá, mô hình chi nhánh tự động ONEBANK 365+ gánh một phần lớn khối lượng hoạt động, giúp NAB thu hút lượng khách bán lẻ trẻ tuổi.\n- Biến độ lợi nhuận giữ nhịp ổn định dù áp lực kinh tế miền Nam thời gian qua khá khắc nghiệt.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Bẫy Nợ Chờ Đợi)',
        content: '- Đặc thù Khách hàng SME/Cá nhân nên khi "gió đông" lạm phát ập tới, tỷ lệ NPL có dấu hiệu chực chờ. Hơn nữa, mức LLR (Bao phủ nợ xấu) ~55% là một bộ đệm khá mỏng để NAB chống chọi rủi ro sâu.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'NAB',
            coreProfit: 2800,
            totalLoan: 90000,
            baseCASA: 7.0,
            baseNPL: 2.2,
            baseLLR: 55.0,
            costOfFundsGap: 110,
            currentEquity: 15000,
            sharesOutstanding: 1058,
            currentPrice: 16000
        }
    },
    {
        type: 'summary',
        content: [
            'Cổ phiếu NAB phù hợp cho kỳ vọng tăng quy mô thị phần (Growth) hơn là phòng thủ Giá Trị.',
            'Nếu kéo Nợ Xấu lên mức 3-4%, bộ đệm LLR của NAB sẽ cạn kiệt nhanh chóng.'
        ]
    }
]
