import type { ContentBlock } from '../../data'

export const vviaBankBab2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Bắc Á Bank - Tĩnh Lặng Phục Vụ Ước Mơ Sữa Việt',
        content: 'Nhắc đến Bac A Bank (BAB), thị trường nghĩ ngay đến tập đoàn TH True Milk. BAB không đua quy mô rầm rộ, không phủ sóng quảng cáo ảo diệu, sự tồn tại của họ tập trung chủ yếu vào cung ứng tín dụng cho nông nghiệp công nghệ cao.'
    },
    {
        type: 'key-insight',
        title: '🐄 Tầng 1 (Chất Lượng Tín Dụng Quý Sứ)',
        content: '- **NPL Thấp Kỷ Lục:** Vì tập trung nội bộ hệ sinh thái của nữ tướng Thái Hương, tỷ lệ nợ xấu của BAB loanh quanh 1.0% - Sạch bong kinh ngạc!\n- Sự tăng trưởng của BAB là hàm trực tiếp của quá trình mở rộng nông trại TH và các dự án phụ trợ.'
    },
    {
        type: 'warning',
        title: '📉 Tầng 2 (Lối Rẽ Nhanh Chứa Lỗ Hổng Kém Hút Vốn Cầu)',
        content: '- CASA siêu hẻo (loanh quanh 3%), nghĩa là BAB phải trả lãi đắt đỏ cho hầu hết các cuốn sổ tiết kiệm trong dân. \n- Thanh khoản cổ phiếu BAB đếm trên đầu ngón tay, một trò chơi nội bộ không dành cho nhà đầu tư đại chúng.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'BAB',
            coreProfit: 900,
            totalLoan: 98000,
            baseCASA: 3.0,
            baseNPL: 1.0,
            baseLLR: 85.0,
            costOfFundsGap: 180,
            currentEquity: 12500,
            sharesOutstanding: 895,
            currentPrice: 12000
        }
    },
    {
        type: 'summary',
        content: [
            'Nếu bạn muốn "Giữ tiền" không mất một đồng, mua BAB và chờ nhận cổ tức tàng tàng.',
            'Cổ phiếu không có tính thị trường. Margin of Safety bằng 0 vì chẳng ai mua bán trên sàn.'
        ]
    }
]
