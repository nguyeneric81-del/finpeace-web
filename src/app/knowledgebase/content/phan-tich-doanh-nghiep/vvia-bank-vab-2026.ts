import type { ContentBlock } from '../../data'

export const vviaBankVab2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Việt Á Bank - Dóng Dáng Tĩnh Lặng Nhóm Cuối',
        content: 'Việt Á (VAB) là hệ thống ngân hàng do nhóm đại gia Phương Hữu Việt lèo lái. Nằm ngụp lặn ở top cuối thị phần, VAB ít khi xuất hiện trên mặt báo trừ những scandal trái phiếu kín.'
    },
    {
        type: 'key-insight',
        title: '🕰️ Tầng 1 (Duy Trì Sự Tồn Tại)',
        content: '- Không có hệ sinh thái rõ nét, đa phần phục vụ dư nợ liên quan đến mảng hạ tầng xây dựng và buôn bán kim loại/BĐS nội bộ.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Sức Cạnh Tranh Là Yếu Huyệt)',
        content: '- CASA < 5%, huy động đầu dào siêu đắt, thanh khoản mỏng, lợi nhuận vài trăm tỷ không đủ đóng góp đột phá. Rủi ro về dư nợ mất vốn luôn rình rập ở tỷ lệ LLR 50%.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'VAB',
            coreProfit: 800,
            totalLoan: 68000,
            baseCASA: 4.0,
            baseNPL: 1.9,
            baseLLR: 50.0,
            costOfFundsGap: 140,
            currentEquity: 7500,
            sharesOutstanding: 539,
            currentPrice: 9000
        }
    },
    {
        type: 'summary',
        content: [
            'Cổ phiếu nằm lỳ nhóm Pennies ngành Ngân hàng.',
            'Stress Test sẽ cho thấy Bank sẽ lao đao cỡ nào nếu chi phí huy động bị ngân hàng Nhà nước xiết.'
        ]
    }
]
