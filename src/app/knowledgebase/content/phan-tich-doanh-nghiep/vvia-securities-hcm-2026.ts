import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 291 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Công ty chứng khoán HCM đang thể hiện sự tăng trưởng ấn tượng với lợi nhuận sau thuế tăng 28.2% và doanh thu tăng 46.7%.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta nhìn vào chỉ số P/B (Price-to-Book) hiện tại là 1.98, cho thấy công ty đang được định giá ở mức hợp lý so với giá trị sổ sách.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 2 (Con Hào Kinh Tế - Buffett): Cơ cấu doanh thu',
        content: 'Phân tích cơ cấu doanh thu của HCM, chúng ta thấy rằng công ty có sự cân bằng giữa các luồng doanh thu chính: Phí môi giới giao dịch, Cho vay Margin và Tự doanh/Ngân hàng đầu tư. Tuy nhiên, với tỷ trọng doanh thu từ Phí môi giới giao dịch và Tự doanh cao, HCM thể hiện sự đa dạng hóa trong nguồn thu, giảm thiểu rủi ro phụ thuộc vào một nguồn thu duy nhất.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Tăng trưởng - Greenblatt): Tăng trưởng doanh thu và lợi nhuận',
        content: 'Với tăng trưởng doanh thu 46.7% và lợi nhuận sau thuế tăng 28.2%, HCM đang thể hiện sự tăng trưởng ấn tượng. Điều này cho thấy công ty đang có những chiến lược kinh doanh hiệu quả và có khả năng tận dụng cơ hội thị trường.'
    },
    {
        type: 'key-insight',
        title: '📝 Tầng 4 (Sức khỏe tài chính - Piotroski): Đánh giá sức khỏe tài chính',
        content: 'Đánh giá sức khỏe tài chính của HCM thông qua các chỉ số như ROA, ROE, Debt-to-Equity, chúng ta thấy rằng công ty có tình hình tài chính ổn định và có khả năng quản lý nợ hiệu quả.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích HCM?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, HCM có một cơ cấu doanh thu đa dạng, không phụ thuộc quá nhiều vào một nguồn thu duy nhất. Điều này giúp giảm thiểu rủi ro và tăng cường sự ổn định cho công ty."',
                highlight: 'Bài học rút ra: Đa dạng hóa nguồn thu là chìa khóa để giảm thiểu rủi ro và tăng cường sự ổn định cho công ty.'
            },
            {
                icon: '📈',
                title: 'Tăng trưởng ấn tượng',
                body: '"Charlie, nhìn vào tăng trưởng doanh thu và lợi nhuận của HCM, chúng ta có thể thấy rằng công ty đang có những chiến lược kinh doanh hiệu quả và có khả năng tận dụng cơ hội thị trường."',
                highlight: 'Bài học rút ra: Tăng trưởng doanh thu và lợi nhuận là những chỉ số quan trọng để đánh giá hiệu quả kinh doanh của một công ty.'
            }
        ]
    }
];