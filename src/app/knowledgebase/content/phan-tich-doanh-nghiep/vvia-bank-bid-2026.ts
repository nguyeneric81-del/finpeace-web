import type { ContentBlock } from '../../data'

export const vviaBankBid2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Quái Vật Về Quy Mô Tổng Tài Sản',
        content: 'BIDV (BID) là ngân hàng sở hữu Tổng Tài Sản lớn nhất Việt Nam. Sau giai đoạn miệt mài tái cơ cấu theo chỉ đạo của cổ đông ngoại KEB Hana Bank (Hàn Quốc), BIDV đã thay da đổi thịt vươn lên top đầu về khả năng tạo lợi nhuận thuần.'
    },
    {
        type: 'key-insight',
        title: '🏛️ Tầng 1 (Chất Lượng Tài Sản): Sự Trổi Dậy Của Quỷ',
        content: '- **LLR bùng nổ:** Từng là ngân hàng bị nghi ngờ về nợ xấu, BID đã xử lý triệt để và đẩy tỷ lệ bao phủ nợ xấu lên gần 200%. Nghĩa là lợi nhuận làm ra giờ đây hoàn toàn sạch sẽ, không lo bào mòn.\n- **Bơm tiền Khủng Long:** Với tổng dư nợ lên tới 1.7 triệu tỷ, mỗi nhịp giảm lãi suất tiết kiệm đều biến BIDV thành cỗ máy in tiền chênh lệch lãi suất vĩ đại.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Yếu Điểm Bán Lẻ)',
        content: 'Dù là "Anh cả", BIDV gặp nhiều khó khăn trong cuộc chiến giành giật CASA từ tay các ngân hàng năng động (MBB, TCB). CASA bị chững lại (chỉ quanh 19%) làm chi phí vốn của BIDV không có lợi thế tuyệt đối khi thanh khoản hệ thống khan hiếm.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'BID',
            coreProfit: 32000,
            totalLoan: 1700000,
            baseCASA: 19.0,
            baseNPL: 1.2,
            baseLLR: 190.0,
            costOfFundsGap: 600,
            currentEquity: 135000,
            sharesOutstanding: 5700,
            currentPrice: 53000
        }
    },
    {
        type: 'summary',
        content: [
            'Đấu lại BIDV về vốn là chuyện không tưởng. Tệp khách hàng Nhà nước bảo kê mọi bão tố thanh khoản.',
            'Kéo slider Nợ Xấu, bạn sẽ hiểu vì sao "Too Big To Fail" (Quá lớn để sụp đổ) áp dụng chính xác cho BIDV và VCB.'
        ]
    }
]
