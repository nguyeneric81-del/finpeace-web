import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 232 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — SHS đang thể hiện sự ổn định trong ngành chứng khoán với lợi nhuận sau thuế đạt 232 tỷ VND, mặc dù có giảm 11.8% so với cùng kỳ năm trước.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) để đánh giá mức độ an toàn của đầu tư. P/B hiện tại là 1.19, cho thấy SHS đang được định giá ở mức hợp lý so với giá trị sổ sách.'
    },
    {
        type: 'key-insight',
        title: '🌆 Tầng 2 (Con Hào Kinh Tế - Buffett): Cơ Cấu Doanh Thu',
        content: 'Chúng ta phân tích cơ cấu doanh thu của SHS để tìm ra tính đặc thù của công ty. Với 3 luồng doanh thu chính là Phí môi giới giao dịch, Cho vay Margin và Tự doanh, SHS có vẻ như đang tập trung vào tự doanh với tỷ trọng lớn trong cơ cấu doanh thu. Điều này cho thấy SHS có khả năng tận dụng được lợi thế của mình trong việc đầu tư và quản lý tài sản.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 3 (Định giá - Greenblatt): P/E và Tăng Trưởng',
        content: 'Sử dụng phương pháp của Joel Greenblatt, chúng ta xem xét chỉ số P/E (Price-to-Earnings) và tốc độ tăng trưởng của lợi nhuận. P/E hiện tại là 11.58, cho thấy SHS đang được định giá ở mức hợp lý so với lợi nhuận. Tuy nhiên, tốc độ tăng trưởng của lợi nhuận sau thuế là -11.8%, cho thấy công ty đang gặp khó khăn trong việc tăng trưởng lợi nhuận.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 4 (Sức Mạnh Tài Chính - Piotroski): Chỉ Số Tài Chính',
        content: 'Chúng ta sử dụng chỉ số Piotroski để đánh giá sức mạnh tài chính của SHS. Chỉ số này bao gồm 9 tiêu chí về lợi nhuận, tài sản và dòng tiền. SHS có điểm số Piotroski là 6/9, cho thấy công ty có sức mạnh tài chính tương đối tốt, nhưng vẫn cần cải thiện ở một số tiêu chí.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích SHS?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, SHS có cơ cấu doanh thu khá đặc thù với tự doanh là trụ cột chính. Điều này cho thấy họ có khả năng tận dụng được lợi thế của mình trong việc đầu tư và quản lý tài sản."',
                highlight: 'Bài học rút ra: Cần phải hiểu rõ cơ cấu doanh thu và tính đặc thù của công ty trước khi đầu tư.'
            },
            {
                icon: '📈',
                title: 'Tăng Trưởng Lợi Nhuận',
                body: '"Tuy nhiên, Charlie, tốc độ tăng trưởng của lợi nhuận sau thuế là -11.8%, cho thấy công ty đang gặp khó khăn trong việc tăng trưởng lợi nhuận. Chúng ta cần phải xem xét kỹ lưỡng nguyên nhân và triển vọng của công ty."',
                highlight: 'Bài học rút ra: Cần phải xem xét kỹ lưỡng tốc độ tăng trưởng của lợi nhuận và triển vọng của công ty trước khi đầu tư.'
            }
        ]
    }
];