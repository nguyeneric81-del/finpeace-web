import type { ContentBlock } from '../../data'

export const vviaBankVib2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Ngôi Vương Bán Lẻ (Bơm OTO & Vay Mua Nhà)',
        content: 'VIB (Ngân hàng Quốc Tế) là chiến thần mảng Bán Lẻ vô đối. VIB luôn tự hào với tỷ trọng cho vay khách hàng cá nhân lên đến gần 90%, đặc biệt là Mua Ô Tô và Nhà Đất. Cơ cấu này giúp VIB tẩu thoát khỏi mọi cuộc bạo loạn Trái phiếu doanh nghiệp.'
    },
    {
        type: 'key-insight',
        title: '🚗 Tầng 1 (Cho Vay Tiêu Dùng): Lãi Lỗ Mong Manh',
        content: '- **Vua Cổ Tức:** Không phải bàn cãi, VIB là ngân hàng chi trả cổ tức tiền mặt hào phóng hiếm hoi, do lợi nhuận từ mảng thẻ tín dụng và vay mua xe/nhà biên chế cực kỳ cao.\n- **NIM Mở Rộng:** Tận dụng được các nguồn vốn ngoại rẻ từ CBA (Khối ngoại) để cho tầng lớp trung lưu vay lại với lãi cao, VIB vắt kiệt công suất lợi nhuận trên mỗi đồng vốn.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Sức Bền Trước Cú Sốc Lãi Suất)',
        content: '- Nợ xấu của khách hàng cá nhân (vay mua xe, mua ngân hàng) cực kỳ nhạy cảm với Lãi Suất và Thị trường việc làm. Chỉ cần sa thải quy mô lớn, nợ xấu VIB có thể bung bét kịch trần nhanh hơn ngân hàng nào hết.\n- LLR của VIB dao động 50% là một bộ đệm siêu mỏng (tương tự như VPBank). Lợi nhuận của VIB sẽ chảy máu dồn dập vào lập dự phòng nếu nền kinh tế bước vào đình trệ thực thụ.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'VIB',
            coreProfit: 11000,
            totalLoan: 250000,
            baseCASA: 12.0,
            baseNPL: 2.5,
            baseLLR: 50.0,
            costOfFundsGap: 120,
            currentEquity: 35000,
            sharesOutstanding: 2536,
            currentPrice: 22000
        }
    },
    {
        type: 'summary',
        content: [
            'Bảng điện VIB là phong vũ biểu của "Sức mua ô tô và nhà đất" của tầng lớp trung lưu Việt Nam.',
            'Kéo NPL (sốc nợ xấu) trong bảng đằng trên, bạn sẽ thấy cỗ máy ăn khách này tổn thương nhanh nhạy ra sao trước sự đi xuống của người dân tiêu dùng!'
        ]
    }
]
