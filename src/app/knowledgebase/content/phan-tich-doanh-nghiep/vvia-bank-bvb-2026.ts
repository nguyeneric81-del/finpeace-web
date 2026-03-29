import type { ContentBlock } from '../../data'

export const vviaBankBvb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Bản Việt Bank - Ngôi Trọng Tâm Siêu Nhỏ Nhiều Ân Oán',
        content: 'Bản Việt (BVB - BVBank) trực thuộc hệ sinh thái danh giá Viet Capital (Từ công ty chứng khoán VCSC - VCI). Mặc dù là Ngân hàng Thương mại tư nhân Nhỏ Bậc Nhất, BVB có tham vọng vươn lên thành cánh tay đắc lực cho các Deal M&A thượng tầng.'
    },
    {
        type: 'key-insight',
        title: '💎 Tầng 1 (Tài Năng Từ Viet Capital)',
        content: '- Sự kết nối ngầm với Chứng khoán Vietcap giúp BVB luân chuyển vốn cho các công ty niêm yết rất mượt mà. Đội ngũ nhân tài trẻ trung, định hướng ngân hàng bán lẻ tập trung ứng dụng Digimi.'
    },
    {
        type: 'warning',
        title: '🕸️ Tầng 2 (Giới Hạn "Room" Và Vốn Chủ Siêu Mỏng)',
        content: '- Vốn điều lệ quá nhỏ bé (chỉ ~5000 tỷ), LLR yếu (35%). Có nghĩa BVB không thể cấp tín dụng theo những dự án nghìn tỷ, lợi nhuận ròng rơi vào trạng thái bấp bênh quanh mức vài trăm tỷ/năm.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'BVB',
            coreProfit: 400,
            totalLoan: 55000,
            baseCASA: 5.5,
            baseNPL: 3.2,
            baseLLR: 35.0,
            costOfFundsGap: 130,
            currentEquity: 5500,
            sharesOutstanding: 501,
            currentPrice: 11000
        }
    },
    {
        type: 'summary',
        content: [
            'Tuy là cổ phiếu sàn UPCoM nhưng hay có sóng nhỏ ăn theo các đội nhóm Vietcap.',
            'Kéo NPL lên một chút xíu, với LLR = 35%, Bản Việt sẽ đối mặt vấn đề thiếu hụt trích lập dự phòng ngay.'
        ]
    }
]
