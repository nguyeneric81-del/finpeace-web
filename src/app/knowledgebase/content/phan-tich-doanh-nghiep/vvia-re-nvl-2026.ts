import type { ContentBlock } from '../../data'

export const vviaReNvl2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'NVL (Novaland) - Cú Sập Khung Của Mô Hình Đòn Bẩy',
        content: 'Từng là thế lực đối trọng với Vinhomes ở phía Nam, NVL lớn nhanh như thổi bằng kỹ năng dùng đòn bẩy tài chính (Trái phiếu) và những dự án nghỉ dưỡng siêu đô thị ở Phan Thiết, Hồ Tràm.'
    },
    {
        type: 'key-insight',
        title: '🕸️ Tầng 1 (Cơn Mộng Du Trái Phiếu)',
        content: '- **Phép màu gãy vụn:** NVL vấp phải bẫy thanh khoản kinh điển khi dùng vốn vay ngắn hạn (Trái phiếu) để tài trợ cho các dự án dở dang quy mô khổng lồ chưa xong pháp lý.\n- Hàng tồn kho của NVL lên tới đỉnh điểm ~140,000 tỷ nhưng phân nửa không thể ra hàng vì vướng thủ tục.'
    },
    {
        type: 'warning',
        title: '🧨 Tầng 2 (Ghế Nóng Mất Thanh Khoản)',
        content: '- Mọi nỗ lực của NVL hiện nay xoay quanh việc xin tái cơ cấu nợ, hoán đổi trái phiếu thành BĐS. Một mồi lửa lãi suất nhỏ cũng đủ thiêu rụi toàn bộ vốn chủ sổ sách.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'RealEstateStressTest',
        widgetProps: {
            ticker: 'NVL',
            inventoryValue: 140000,
            cashAndEquiv: 4000,
            shortTermDebt: 30000,
            totalDebt: 58000,
            totalEquity: 43000,
            sharesOutstanding: 1950,
            currentPrice: 15000
        }
    },
    {
        type: 'quote',
        content: 'Điều quan trọng không phải là bạn nhào lộn đẹp thế nào, mà là việc bạn có đập đầu xuống đất lúc tiếp đất hay không.',
        author: 'HOWARD MARKS',
        source: 'Ông vua Chu Kỳ (Market Cycles) & Trái Phiếu Nợ Rác'
    },
    {
        type: 'summary',
        content: [
            'Lời bình của Howard Marks về NVL:',
            '"Novaland là ví dụ kinh điển của việc sử dụng nợ ngắn hạn tài trợ cho tài sản dài hạn đóng băng.',
            'Nếu kéo thanh trượt Kẹt Pháp Lý lên 50%, Vốn chủ sở hữu của NVL gần như bay hơi. Tôi thích mua tài sản nợ xấu (distressed assets), nhưng chỉ khi nó thực sự vỡ trận và giá rẻ mạt như cho không."'
        ]
    }
]
