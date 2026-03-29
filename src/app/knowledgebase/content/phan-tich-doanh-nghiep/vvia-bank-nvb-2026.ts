import type { ContentBlock } from '../../data'

export const vviaBankNvb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Quốc Dân (NCB) - Game "Hấp Hối" Cấp Cứu Bởi Đế Chế Sun Group',
        content: 'NCB (NVB) thực sự gặp khủng hoảng lõi và gồng gánh cục nợ xấu khổng lồ từ quá khứ (Thời FLC và các sai lầm tín dụng). Câu chuyện duy nhất kéo NVB khỏi vũng bùn là quyền kiểm soát chuyển lấp lửng qua Sun Group.'
    },
    {
        type: 'key-insight',
        title: '🚑 Tầng 1 (Game Phát Hành Và Tái Cơ Cấu Tột Cùng)',
        content: '- Kẻ khốn cùng đứng trước cửa tử. Mọi hoạt động nghiệp vụ NH cốt lõi đang ghi nhận **LỖ**. Động lực sống còn nằm ở các game phát hành thêm khủng khiếp nhằm tăng vốn và bơm máu thanh khoản.'
    },
    {
        type: 'warning',
        title: '💣 Tầng 2 (Báo Cáo Thực Hư, LLR Khóc Thét)',
        content: '- Tỉ lệ nợ xấu (NPL) trên sổ sách cao ngất ngưởng, LLR bao phủ chưa nổi 15% (Chỉ cần 1 cơn gió nhẹ, Vốn chủ của NVB sẽ trượt dốc không phanh).\n- Cổ phiếu NVB hoàn toàn là Công Cụ Tài Chính (Tạo ra bằng game sang tay, deal khối lượng nợ xấu, hoán đổi tài sản).'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'NVB',
            coreProfit: -500,
            totalLoan: 55000,
            baseCASA: 6.5,
            baseNPL: 12.0,
            baseLLR: 15.0,
            costOfFundsGap: 150,
            currentEquity: 6000,
            sharesOutstanding: 1180,
            currentPrice: 10000
        }
    },
    {
        type: 'summary',
        content: [
            'Đầu tư vào NVB không phải là Đầu tư giá trị, mà là "Đặt cược vào năng lực dọn dẹp" của Chủ mới.',
            'Thử thay đổi thanh trượt Nợ Xấu NVB, bạn sẽ thấy nó đang ở mức Tê liệt Tài chính hoàn toàn. Chống chỉ định cho Trái tim yếu!'
        ]
    }
]
