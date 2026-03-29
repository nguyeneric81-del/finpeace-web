import type { ContentBlock } from '../../data'

export const vviaBankPgb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'PGBank - Chủ Mới Thành Công Group Tiếp Quản',
        content: 'Từng là của hồi môn không mong muốn của Petrolimex, sau đó rơi vào lưới sáp nhập hụt của HDBank/MSB. Nay PGBank đã yên ấm dưới vòng tay của đại gia ô tô/bất động sản Thành Công Group (TC Group).'
    },
    {
        type: 'key-insight',
        title: '🚗 Tầng 1 (Đổi Tên, Đổi Vận)',
        content: '- TC Group có mạng lưới showroom ô tô Hyundai khổng lồ và các dự án BĐS công nghiệp. Tương lai PGBank sẽ trở thành công cụ tài trợ độc quyền cho khách hàng mua xe Hyundai.'
    },
    {
        type: 'warning',
        title: '🏁 Tầng 2 (Bước Đầu Gây Dựng Vỡ Lòng)',
        content: '- PGBank gần như bị dậm chân tại chỗ 10 năm qua dưới thời Petrolimex cầm quyền buông lỏng. Tỷ lệ sinh lời cực thấp. Nền móng công nghệ và khách hàng cũ phải đập đi xây lại 100%.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'PGB',
            coreProfit: 650,
            totalLoan: 35000,
            baseCASA: 12.0,
            baseNPL: 2.8,
            baseLLR: 60.0,
            costOfFundsGap: 95,
            currentEquity: 5200,
            sharesOutstanding: 420,
            currentPrice: 18000
        }
    },
    {
        type: 'summary',
        content: [
            'Siêu bo cung, có trận tăng giá x10 do sang tay đổi chủ.',
            'Chưa thích hợp cho định giá trị FA vì dòng tiền cốt lõi từ TC Group chưa kịp hạch toán dồi dào.'
        ]
    }
]
