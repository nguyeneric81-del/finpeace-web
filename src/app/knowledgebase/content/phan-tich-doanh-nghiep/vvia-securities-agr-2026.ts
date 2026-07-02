import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 43 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — AGR đang thể hiện sự tăng trưởng ấn tượng trong lĩnh vực chứng khoán với lợi nhuận sau thuế tăng 33.8% và doanh thu tăng 40.1%.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) để đánh giá mức độ an toàn của đầu tư. P/B hiện tại là 1.27, cho thấy AGR đang giao dịch ở mức giá gần với giá trị sổ sách của mình, điều này có thể được xem là một tín hiệu tích cực về mặt an toàn.'
    },
    {
        type: 'key-insight',
        title: '💡 Tầng 2 (Warren Buffett - Con Hào Kinh Tế): Cơ cấu doanh thu',
        content: 'Warren Buffett luôn tìm kiếm những công ty có lợi thế cạnh tranh bền vững. Đối với AGR, phân tích cơ cấu doanh thu cho thấy họ có sự tập trung mạnh vào phí môi giới giao dịch (Brokerage) và cho vay Margin, với tỷ trọng doanh thu từ các hoạt động này chiếm ưu thế. Điều này cho thấy AGR có lợi thế cạnh tranh trong lĩnh vực môi giới và cho vay, tạo nền tảng cho sự tăng trưởng bền vững.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Greenblatt - Magic Formula): Tỷ suất lợi nhuận và tăng trưởng',
        content: 'Joel Greenblatt đề xuất sử dụng công thức "Magic Formula" để tìm kiếm những công ty có tỷ suất lợi nhuận cao và giá rẻ. AGR với tỷ suất lợi nhuận sau thuế trên doanh thu là 29.9% và P/E TTM là 21.73, cho thấy công ty này có khả năng sinh lời tốt và đang được định giá hợp lý so với tăng trưởng của mình.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 4 (Piotroski - F-Score): Đánh giá sức khỏe tài chính',
        content: 'Joseph Piotroski đã phát triển F-Score để đánh giá sức khỏe tài chính của một công ty. Dựa trên các tiêu chí như lợi nhuận, dòng tiền, tỷ lệ nợ và hiệu suất hoạt động, AGR cho thấy sự cải thiện trong sức khỏe tài chính qua các năm, với F-Score tăng lên, chỉ ra rằng công ty đang quản lý tài chính một cách hiệu quả.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích AGR?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, AGR đang tận dụng lợi thế của mình trong lĩnh vực môi giới và cho vay Margin để tạo ra lợi nhuận ấn tượng."',
                highlight: 'Bài học rút ra: Tìm kiếm những công ty có lợi thế cạnh tranh bền vững và cơ cấu doanh thu đa dạng.'
            },
            {
                icon: '📈',
                title: 'Tăng trưởng Bền vững',
                body: '"AGR không chỉ dừng lại ở lợi nhuận hiện tại, mà còn có tiềm năng tăng trưởng trong tương lai nhờ vào sự phát triển của thị trường chứng khoán."',
                highlight: 'Quan trọng là phải đánh giá cả hiện tại và tương lai khi đầu tư.'
            }
        ]
    }
];