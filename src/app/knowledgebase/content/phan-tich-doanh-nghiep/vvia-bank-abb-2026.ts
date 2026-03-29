import type { ContentBlock } from '../../data'

export const vviaBankAbb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'ABBank - Trầm Lắng Trong Lớp Vỏ Đại Gia Tập Đoàn',
        content: 'Với sự gắn kết sâu sắc cùng Geleximco, An Bình (ABB) có hệ sinh thái khách hàng nội bộ đáng kể. Tuy nhiên, ABB lại là cổ phiếu "ngủ đông" dằng dai nhất nhì hệ thống ngân hàng.'
    },
    {
        type: 'key-insight',
        title: '🏦 Tầng 1 (Chuyên Gia An Toàn Cổ Điển)',
        content: '- **Thanh khoản vững vàng:** Sự thận trọng tuyệt đối đưa ABB tránh khỏi những cú sụp hầm của trái phiếu và tín dụng rác.\n- **Lợi thế mảng doanh nghiệp:** Dựa vào hệ sinh thái cổ đông lớn, ABB có lượng doanh thu ổn định từ các khoản giải ngân khối hạ tầng.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Chi Tiêu Ngốn Lợi Nhuận & Lỗ Hổng Tín Dụng Hiện Hữu)',
        content: '- Tốc độ tăng trưởng và hiệu quả hoạt động (CIR) của ABB rất kém so với bình diện chung. Lợn nhuận tạo ra luôn bị gặm nhấm bởi bộ máy cồng kềnh.\n- Và nguy hiểm nhất: Bao phủ nợ xấu LLR của ABB nằm dưới mức 50%, một ranh giới rất mỏng manh.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'ABB',
            coreProfit: 2100,
            totalLoan: 88000,
            baseCASA: 16.5,
            baseNPL: 3.1,
            baseLLR: 45.0,
            costOfFundsGap: 90,
            currentEquity: 13500,
            sharesOutstanding: 1039,
            currentPrice: 8500
        }
    },
    {
        type: 'summary',
        content: [
            'Giá cổ phiếu ABB luôn quanh quẩn dưới mệnh giá (Under 10k) vì động lực tăng trưởng cực kỳ thấp.',
            'Một cú shock nợ xấu nhỏ thôi với tấm khiên LLR hiện tại cũng sẽ gây tổn thương nặng cho vốn chủ ABB.'
        ]
    }
]
