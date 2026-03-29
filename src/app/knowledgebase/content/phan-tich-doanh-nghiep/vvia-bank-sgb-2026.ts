import type { ContentBlock } from '../../data'

export const vviaBankSgb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Saigonbank - Hóa Thạch Ngân Hàng Thời Bao Cấp',
        content: 'Là ngân hàng thương mại Cổ phần lâu đời nhất nhưng Saigonbank (SGB) hiện lại là ngân hàng quy mô Vốn Điều Lệ Bé Nhất trong toàn bộ hệ thống ngân hàng niêm yết do cổ đông chính là Thành ủy TP.HCM không có động thái tăng vốn.'
    },
    {
        type: 'key-insight',
        title: '🏛️ Tầng 1 (Bảo Lãnh Tiền Tệ Tĩnh Lặng)',
        content: '- SGB hoạt động cực kỳ mờ nhạt, chỉ xử lý nghiệp vụ cho các công ty thuộc sở hữu nhà nước TPHCM, NPL sạch sẽ ở mức ổn, không làm liều.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Đi Thụt Lùi So Với 4.0)',
        content: '- Bị tụt hạng quá nhanh về quy mô, mất dần vị thế cạnh tranh về công nghệ so mặt bằng chung (CASA trung bình khá ~14% vì tiền uỷ thác).'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'SGB',
            coreProfit: 300,
            totalLoan: 19000,
            baseCASA: 14.0,
            baseNPL: 2.1,
            baseLLR: 85.0,
            costOfFundsGap: 80,
            currentEquity: 3500,
            sharesOutstanding: 308,
            currentPrice: 15000
        }
    },
    {
        type: 'summary',
        content: [
            'Thanh khoản mỗi phiên vài nghìn cổ. Rất khó mua bán ra vào.',
            'Bài test stress LLR của SGB là khá ổn so với anh em cùng tầng đáy.'
        ]
    }
]
