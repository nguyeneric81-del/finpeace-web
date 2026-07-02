import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 160 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — FTS đang thể hiện sự tăng trưởng ổn định trong ngành chứng khoán với lợi nhuận sau thuế tăng 4.5% và doanh thu tăng 21.3%.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) và định giá của FTS. P/B hiện tại là 2, cho thấy giá trị sổ sách của công ty đang được định giá cao so với giá thị trường.'
    },
    {
        type: 'key-insight',
        title: '🌟 Tầng 2 (Con Hào Kinh Tế - Buffett): Cơ cấu doanh thu',
        content: 'Phân tích cơ cấu doanh thu của FTS, chúng ta thấy rằng công ty này có sự tập trung mạnh vào phí môi giới giao dịch (Brokerage) và cho vay Margin. Tuy nhiên, mảng tự doanh (Proprietary Trading) và ngân hàng đầu tư (IB) cũng đóng vai trò quan trọng trong tổng doanh thu của công ty. Điều này cho thấy FTS đang đa dạng hóa nguồn thu nhập và giảm sự phụ thuộc vào một nguồn thu duy nhất.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Tốc độ tăng trưởng - Greenblatt): Tăng trưởng doanh thu và lợi nhuận',
        content: 'Với tốc độ tăng trưởng doanh thu là 21.3% và lợi nhuận sau thuế tăng 4.5%, FTS đang thể hiện sự tăng trưởng ổn định và bền vững. Điều này cho thấy công ty đang có những chiến lược kinh doanh hiệu quả và có khả năng duy trì tăng trưởng trong dài hạn.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 4 (Sức khỏe tài chính - Piotroski): Chỉ số F-Score',
        content: 'Áp dụng chỉ số F-Score của Piotroski, chúng ta có thể đánh giá sức khỏe tài chính của FTS. Với các chỉ số như lợi nhuận, dòng tiền, và tỷ lệ nợ, FTS đang thể hiện sự ổn định và sức khỏe tài chính tốt.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích FTS?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, FTS đang có một cơ cấu doanh thu đa dạng với phí môi giới giao dịch, cho vay Margin, và tự doanh. Điều này giúp họ giảm sự phụ thuộc vào một nguồn thu duy nhất."',
                highlight: 'Bài học rút ra: Đa dạng hóa nguồn thu nhập là chìa khóa để duy trì tăng trưởng và ổn định trong ngành chứng khoán.'
            },
            {
                icon: '📊',
                title: 'Tốc độ tăng trưởng',
                body: '"Và Charlie, tốc độ tăng trưởng doanh thu và lợi nhuận của FTS là rất ấn tượng. Điều này cho thấy họ đang có những chiến lược kinh doanh hiệu quả."',
                highlight: 'Bài học rút ra: Tốc độ tăng trưởng là một yếu tố quan trọng trong việc đánh giá khả năng tăng trưởng của một công ty.'
            }
        ]
    }
];