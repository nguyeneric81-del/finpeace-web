import type { ContentBlock } from '../../data'

export const vviaBankOcb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Viên Ngọc Miền Nam - Quả Táo Thừa Kế Từ Trái Phiếu BĐS',
        content: 'Ngân hàng Phương Đông (OCB) được đánh giá là Ngân hàng có sức bức tốc cực ấn tượng và có chỉ số ROE thuộc Top đắt giá ở Miền Nam. Sự trẻ trung, định hướng mở rộng khách hàng đa dạng, OCB là đứa con cưng của các định chế P/E.'
    },
    {
        type: 'key-insight',
        title: '🌴 Tầng 1 (Chỉ số đẹp như tranh)',
        content: '- **Tỷ suất sinh lời cao:** Khả năng bắt trend NIM bằng dư nợ khách hàng BĐS (Đặc biệt khối Khang Điền, và hồi xưa là FLC) giúp OCB tăng tỷ suất sinh lời vô cùng nhanh.\n- **Ngân hàng gọn nhẹ:** Cấu trúc nhân sự tinh gọn, văn hóa đổi mới, OCB bứt top Tier 2 nhịp nhàng.'
    },
    {
        type: 'warning',
        title: '💣 Tầng 2 (Sức Ì Của Bất Động Sản Dở Dang)',
        content: '- Nơi đâu OCB đi tìm lợi nhuận siêu vượt trội, nơi đó OCB đối mặt hệ quả nợ Tái cấu trúc. Cuộc ra quân xử lý trái phiếu, tín dụng dính líu với FLC trước đây hay sự chững lại khối vay BDS hiện tại luôn phủ bóng mây đen nợ xấu (NPL > 2%) nhưng chỉ có LLR bộ đệm khoảng 50%.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'OCB',
            coreProfit: 4500,
            totalLoan: 140000,
            baseCASA: 12.0,
            baseNPL: 2.4,
            baseLLR: 50.0,
            costOfFundsGap: 85,
            currentEquity: 26000,
            sharesOutstanding: 2056,
            currentPrice: 14000
        }
    },
    {
        type: 'summary',
        content: [
            'OCB mua giá trị (Value Trap) thì rất ngon vì P/B thấp kỉ lục (0.X lần). Tuy nhiên giá cổ phiếu vẫn lay lắt do sự sợ hãi nợ tái cơ cấu.',
            'Kéo nhẹ sốc Nợ xấu để kiểm chứng tại sao giới tinh anh rụt rè: Bộ đệm LLR quá mỏng dễ dàng xóa sổ lợi nhuận năm!'
        ]
    }
]
