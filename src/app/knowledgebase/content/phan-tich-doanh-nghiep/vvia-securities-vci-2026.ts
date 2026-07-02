import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `**Lợi nhuận Quý mới nhất:** 341 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Công ty chứng khoán VCI đang cho thấy sự tăng trưởng ấn tượng với lợi nhuận sau thuế tăng 15.6% và doanh thu tăng 65.3%.`
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) hiện tại là 1.73, so với trung bình ngành. Điều này cho thấy VCI đang được định giá cao so với giá trị sổ sách.'
    },
    {
        type: 'key-insight',
        title: '🌟 Tầng 2 (Warren Buffett - Con Hào Kinh Tế): Cơ cấu doanh thu',
        content: 'Phân tích cơ cấu doanh thu của VCI, chúng ta thấy rằng công ty này mạnh nhất ở trụ cột Tự doanh (Proprietary Trading) và Ngân hàng đầu tư (IB). Điều này cho thấy VCI có khả năng tạo ra lợi nhuận từ hoạt động kinh doanh của mình, bên cạnh việc cung cấp dịch vụ môi giới và cho vay margin.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Greenblatt - Magic Formula): Chỉ số Magic',
        content: 'Áp dụng công thức Magic của Joel Greenblatt, chúng ta tính toán chỉ số Magic cho VCI. Chỉ số này cho thấy khả năng tạo ra lợi nhuận của công ty so với giá trị thị trường.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 4 (Piotroski - Điểm số tài chính): Đánh giá tài chính',
        content: 'Sử dụng mô hình Piotroski, chúng ta đánh giá điểm số tài chính của VCI dựa trên các chỉ số như lợi nhuận, dòng tiền, và hiệu quả hoạt động. Điều này giúp chúng ta hiểu rõ hơn về tình hình tài chính của công ty.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích VCI?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, VCI có cơ cấu doanh thu đa dạng, nhưng mạnh nhất ở tự doanh và ngân hàng đầu tư. Điều này cho thấy họ có khả năng tạo ra lợi nhuận từ hoạt động kinh doanh của mình."',
                highlight: 'Bài học rút ra: Cơ cấu doanh thu đa dạng và mạnh nhất ở tự doanh và ngân hàng đầu tư là một điểm mạnh của VCI.'
            }
        ]
    }
];