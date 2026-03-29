import type { ContentBlock } from '../../data'

export const vviaReDig2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'DIG (DIC Corp) - Vàng Trong Đất Hay Giấc Mơ Của Lái?',
        content: 'DIG luôn là một cổ phiếu làm mưa làm gió có tính đầu cơ bầy đàn cao nhất sòng HoSE. Cứ nhắc tới BĐS, dòng tiền đầu cơ sẽ luôn rẽ sóng vào DIG với câu chuyện "Quỹ đất khổng lồ, giá siêu rẻ".'
    },
    {
        type: 'key-insight',
        title: '🗺️ Tầng 1 (Ảo Ảnh Đếm Cua Trong Lỗ)',
        content: '- **Phép tính tỷ phú:** Câu chuyện muôn thuở của DIG là lấy tổng số hecta quỹ đất x Giá bán = Vốn hóa tỷ đô. \n- Nhưng thực tế, quá trình "đền bù giải tỏa", quy hoạch và đóng tiền sử dụng đất là một rào cản khiến DIG giậm chân tại chỗ nhiều năm trời.'
    },
    {
        type: 'warning',
        title: '🧩 Tầng 2 (Dòng Tiền Mỏng Manh)',
        content: '- Trái ngược với truyền thuyết quỹ đất, dòng tiền thực chất của DIG chảy về qua việc bán nhà rất khiêm tốn. Chủ yếu lợi nhuận nhiều năm nay đến từ nhào lộn tài chính và đánh giá lại một số khu vực nhỏ.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'RealEstateStressTest',
        widgetProps: {
            ticker: 'DIG',
            inventoryValue: 7000,
            cashAndEquiv: 2500,
            shortTermDebt: 1500,
            totalDebt: 3000,
            totalEquity: 8000,
            sharesOutstanding: 609,
            currentPrice: 28000
        }
    },
    {
        type: 'quote',
        content: 'Nếu công ty chỉ đáng giá trên tờ trình dự án mà chưa cắm nổi một cây cọc xuống đất, nó không phải là tài sản. Nó là niềm hy vọng.',
        author: 'SAM ZELL',
        source: '"Vũ Công Trên Nấm Mồ" (The Gravedancer) - Vua sắn bắn BĐS Mỹ'
    },
    {
        type: 'summary',
        content: [
            'Lời bình của Sam Zell về DIG:',
            '"Tôi thích quỹ đất rộng, nhưng tôi ghét những công ty ngâm đất ròng rã vì không có tiền phát triển.',
            'Khi thanh trượt Đóng băng pháp lý nhích lên, các giá trị trên sổ của DIG trở nên vô nghĩa. Bạn đang mua DIG vì kỳ vọng sự fomo của đám đông hơn là giá trị ròng thực tế."'
        ]
    }
]
