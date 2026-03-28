import type { ContentBlock } from '../../data'

export const vviaBankTcb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Kẻ Săn Đuổi CASA Và Vua Chuỗi Giá Trị Bất Động Sản',
        content: 'Techcombank luôn là ngân hàng tư nhân năng động bậc nhất, bám đuổi quyết liệt danh hiệu "Vua CASA" với MBB. TCB sở hữu hệ sinh thái khách hàng VIP đông đảo, nhưng lại gắn chặt sinh mệnh vào chuỗi giá trị Bất động sản (Vingroup, Masterise) và kênh phân phối Trái phiếu doanh nghiệp.'
    },
    {
        type: 'key-insight',
        title: '💵 Tầng 1 (Năng Lực Kiếm Tiền): Phí Dịch Vụ Khủng',
        content: '- **Lợi Nhuận Gộp từ Phí:** TCB là bá chủ trong cuộc chơi tư vấn phát hành Trái phiếu, Phân phối bảo hiểm (Bancassurance) và Phí dịch vụ thẻ thanh toán quốc tế.\n- **CASA (Tiền gửi không kỳ hạn):** Cạnh tranh gắt gao với MBB (quanh ngưỡng 35-40%), giúp NIM mở rộng cực kỳ bất chấp thị trường huy động căng thẳng.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Gót Chân Achilles): Tập Trung Rủi Ro Nồng Độ Cao',
        content: '- Một tỷ lệ khổng lồ dư nợ (bao gồm cả trái phiếu) của TCB nằm ở lĩnh vực Bờ-Đê-Sờ (Bất động sản) và Xây dựng. Khi thị trường BĐS đảo chiều, hoặc nghẽn dòng tiền Trái Phiếu, TCB sẽ hứng chịu toàn bộ tác động lan truyền đầu tiên.\n- LLR của TCB đã sụt giảm để cứu vãn biên lợi nhuận, hiện xoay quanh ngưỡng xấp xỉ 100%, không còn tấm nệm cao su dày như ngày xưa.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'TCB',
            coreProfit: 26000,
            totalLoan: 500000,
            baseCASA: 36.0,
            baseNPL: 1.2,
            baseLLR: 105.0,
            costOfFundsGap: 210,
            currentEquity: 130000,
            sharesOutstanding: 3522,
            currentPrice: 42000
        }
    },
    {
        type: 'summary',
        content: [
            'Cổ phiếu TCB chạy cực bốc trong Uptrend Bất động sản và luôn chiết khấu sốc mỗi khi có tin đồn thanh tra trái phiếu.',
            'Nếu bạn tin rằng thị trường BĐS sắp phục hồi, TCB chính là mũi giáo sắc bén nhất để tối đa hóa tỷ suất sinh lời.'
        ]
    }
]
