import type { ContentBlock } from '../../data'

export const vviaBankSsb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Sân Chơi Bo Cung - Chỗ Đứng Nội Bộ Gia Tộc',
        content: 'SeABank (SSB) hoạt động như một cỗ xe tăng im lặng ở thị trường chứng khoán. Không có những pha Fomo đám đông, bởi vì đa phần lượng cổ phiếu lưu hành nằm gọn trong lòng bàn tay Tập đoàn BRG uy quyền.'
    },
    {
        type: 'key-insight',
        title: '⛳ Tầng 1 (Lợi Thế Độc Tôn Từ Gia Tộc)',
        content: '- **Hệ sinh thái:** SSB nằm trong "vòng tay" BRG với muôn vạn Sân Golf, Dự án BĐS đỉnh cao và khu vui chơi sầm uất. Thanh khoản tiền gửi chéo khổng lồ giữ cho hoạt động SSB luôn ổn định.\n- Nợ xấu (NPL) được kiểm soát cứng ngắc ~1.9%, ít khi mở room liều lĩnh cho các thị trường ngoài lề.'
    },
    {
        type: 'warning',
        title: '🔒 Tầng 2 (Cổ Phiếu Hiếm Không Dành Cho Dòng Tiền Lớn)',
        content: '- Giao dịch SSB phần lớn là giao dịch thuật toán giữ nhịp giá (Bo cung). Điều này nghĩa là bạn phân tích FA (Cơ bản) của SSB rất rời rạc với động lực làm giá của SSB trên bảng điện.\n- CASA thấp ~10%, chi phí huy động thực sự của SSB khá truyền thống (dựa vào huy động chứng chỉ tiền gửi/tiết kiệm nhân lưu).'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'SSB',
            coreProfit: 4200,
            totalLoan: 175000,
            baseCASA: 10.5,
            baseNPL: 1.9,
            baseLLR: 55.0,
            costOfFundsGap: 100,
            currentEquity: 29000,
            sharesOutstanding: 2453,
            currentPrice: 22000
        }
    },
    {
        type: 'summary',
        content: [
            'SSB phù hợp với ai tìm kiếm bến đỗ an toàn phi lý thuyết dòng tiền đám đông, không sập sâu, chia cổ tức đều đặn.',
            'Bạn nên tránh chơi phái sinh T+ trên nền SSB vì khả năng vỡ tín hiệu Tech-chart cực cao. Đẳng cấp P/B SSB luôn giữ mức kĩ thuật cố định được chỉ định riêng.'
        ]
    }
]
