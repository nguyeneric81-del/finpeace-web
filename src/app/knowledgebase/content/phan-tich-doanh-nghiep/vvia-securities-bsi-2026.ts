import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 89 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Công ty chứng khoán BSI đang thể hiện sự tăng trưởng mạnh mẽ trong lĩnh vực chứng khoán với lợi nhuận sau thuế tăng 9.5% và doanh thu tăng 106.8%.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) để đánh giá mức độ an toàn của đầu tư. P/B hiện tại là 1.53, cho thấy công ty đang giao dịch ở mức giá cao hơn so với giá trị sổ sách. Điều này có thể chỉ ra rằng nhà đầu tư đang kỳ vọng vào tăng trưởng tương lai của công ty.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 2 (Warren Buffett - Con Hào Kinh Tế): Cơ cấu doanh thu',
        content: 'Warren Buffett luôn tìm kiếm các công ty có lợi thế cạnh tranh bền vững. Trong trường hợp của BSI, cơ cấu doanh thu cho thấy sự tập trung vào phí môi giới giao dịch (Brokerage) và cho vay Margin, với tỷ trọng lớn hơn trong tổng doanh thu. Điều này cho thấy BSI có lợi thế cạnh tranh trong lĩnh vực môi giới và cho vay, giúp công ty duy trì tăng trưởng trong ngành chứng khoán.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Greenblatt - Magic Formula): Tỷ suất lợi nhuận và tăng trưởng',
        content: 'Joel Greenblatt đề xuất sử dụng công thức "Magic Formula" để tìm kiếm các công ty có tỷ suất lợi nhuận cao và tăng trưởng mạnh. Với tỷ suất lợi nhuận sau thuế trên doanh thu là 12.73% và tăng trưởng doanh thu 106.8%, BSI đang thể hiện khả năng sinh lời và tăng trưởng ấn tượng, phù hợp với tiêu chí của Greenblatt.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 4 (Piotroski - F-Score): Đánh giá sức khỏe tài chính',
        content: 'Joseph Piotroski giới thiệu F-Score để đánh giá sức khỏe tài chính của các công ty. Dựa trên các chỉ số như lợi nhuận, dòng tiền, và tỷ lệ nợ, BSI có F-Score cao, cho thấy công ty có sức khỏe tài chính tốt và khả năng trả nợ ổn định.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích BSI?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, BSI đang tận dụng lợi thế trong lĩnh vực môi giới và cho vay Margin. Đây có thể là điểm tựa cho tăng trưởng tương lai."',
                highlight: 'Bài học rút ra: Tìm kiếm các công ty có lợi thế cạnh tranh bền vững trong ngành.'
            }
        ]
    }
];