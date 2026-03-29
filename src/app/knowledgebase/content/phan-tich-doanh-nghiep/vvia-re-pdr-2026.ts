import type { ContentBlock } from '../../data'

export const vviaRePdr2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'PDR (Phát Đạt) - Câu Chuyện Turnaround Bậc Thầy Của Sự Hồi Sinh',
        content: 'Chẳng ai có thể quên hồi chuông báo tử của PDR cuối năm 2022: Cổ phiếu rớt không phanh, lãnh đạo bị Call Margin, vòng xoáy vỡ nợ hiện hữu. Nhưng sự trở lại của Phát Đạt là một case study ngoạn mục.'
    },
    {
        type: 'key-insight',
        title: '🦅 Tầng 1 (Can Đảm Cắt Máng Trả Nợ)',
        content: '- Khác với NVL rề rà, PDR đưa ra quyết định sắc lẹm: Bán sỉ tài sản (các mảng Astral City) để tất toán **100% dư nợ trái phiếu** đầy bất ngờ.\n- Đưa doanh nghiệp từ cõi chết thanh khoản về trạng thái thảnh thơi mở bán dự án miền Trung.'
    },
    {
        type: 'warning',
        title: '📉 Tầng 2 (Sức Ép Tái Tạo Quỹ Đất Đầu Nguồn)',
        content: '- Bán máu trả nợ thành công, nhưng dự án nòng cốt ở Bình Định và Đà Nẵng lại mất nhiều thời gian để hấp thụ thực sự. Doanh thu cần cú hích.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'RealEstateStressTest',
        widgetProps: {
            ticker: 'PDR',
            inventoryValue: 12000,
            cashAndEquiv: 500,
            shortTermDebt: 1500,
            totalDebt: 3500,
            totalEquity: 9500,
            sharesOutstanding: 873,
            currentPrice: 26000
        }
    },
    {
        type: 'quote',
        content: 'Tham lam khi kẻ khác sợ hãi. Nhưng hãy chắc chắn rằng bạn bắt dao rơi khi nó đã chạm cắm xuống sàn gỗ.',
        author: 'HOWARD MARKS',
        source: 'Sói Già Nợ Rác'
    },
    {
        type: 'legend-verdict',
        author: 'Howard Marks',
        content: [
            '"Tuyệt hảo! Hành động dọn sạch trái phiếu của PDR chính xác là cách một quản trị viên thoát khỏi điểm chết chu kỳ.',
            'Kéo thanh trượt Lãi suất Lên 5%, PDR gần như không hấn gì vì họ không còn vay quá nhiều. Đây là cổ phiếu Turnaround (Đảo chiều rủi ro) hiếm có."'
        ]
    }
]
