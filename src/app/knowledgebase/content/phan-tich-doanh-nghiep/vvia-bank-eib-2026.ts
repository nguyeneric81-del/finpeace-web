import type { ContentBlock } from '../../data'

export const vviaBankEib2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Đế chế lưu danh một thời kẹt trong "Chiến Tranh Vươn Quyền"',
        content: 'Eximbank (EIB) từng là ông hoàng mạnh nhất mảng Xuất nhập khẩu (vượt xa hiện tại của HDB/VPB), nhưng đã bị vắt kiệt sinh lực bởi cuộc chiến thượng tầng kéo dài hơn một thập kỷ. Các nhóm cổ đông lớn liên tục lật đổ nhau đẩy EIB vào một viễn cảnh tương lai mờ mịt.'
    },
    {
        type: 'key-insight',
        title: '⚔️ Tầng 1 (Cơn Nhức Đầu Cổ Đông Mới)',
        content: '- Lợi ích từ thương vụ thoái vốn SMBC và những biến chuyển ở HĐQT mới đem lại cho khối nội đôi chút hi vọng "tái hợp tàn binh".\n- Tuy nhiên, hệ thống quản trị rủi ro đã có những dấu hiệu buông lỏng thời gian dài, khiến những vụ "Bốc hơi tài khoản sổ tiết kiệm", tranh cãi thẻ tín dụng quẹt 8.5 triệu nợ 8.8 tỷ xảy ra thường xuyên.'
    },
    {
        type: 'warning',
        title: '📉 Tầng 2 (Sổ Gạo Khó Cứu Chữa Cục Bộ)',
        content: '- Bao phủ nợ xấu (LLR) của EIB bị để tụt dốc thê thảm, chỉ loanh quanh dưới 50%. Đây là con số Báo Động cản trở việc lợi nhuận của EIB muốn vượt mốc tỷ đô.\n- Khả năng bán chéo (Cross-selling) của EIB bị các Big4 và Techcombank nuốt chửng do đình trệ.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'EIB',
            coreProfit: 3200,
            totalLoan: 140000,
            baseCASA: 14.5,
            baseNPL: 2.6,
            baseLLR: 45.0,
            costOfFundsGap: 80,
            currentEquity: 21000,
            sharesOutstanding: 1747,
            currentPrice: 18000
        }
    },
    {
        type: 'summary',
        content: [
            'EIB là "vết thương" mang nặng nỗi đau thượng tầng. Chỉ chơi game thâu tóm lướt sóng, không nên kì vọng về việc bank này lọt Top 5 như 2011.',
            'Kéo thanh trượt Nợ Xấu lên 1 chút nữa, LLR 45% của Bank này sẽ chính thức rỉ máu, nuốt sạch thành tựu kiếm tiền ít ỏi của hàng vạn nhân viên chắt chiu.'
        ]
    }
]
