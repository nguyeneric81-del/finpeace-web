import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Lợi nhuận Quý mới nhất:** 66 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Công ty CTS đang đối mặt với thách thức khi lợi nhuận sau thuế giảm 37.9% và doanh thu giảm 24.3%. Tuy nhiên, với P/E TTM ở mức 10.43 và P/B TTM ở mức 1.93, công ty vẫn có tiềm năng phát triển trong ngành chứng khoán.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, P/B hiện tại là 1.93 cho thấy công ty CTS đang được định giá hợp lý so với giá trị sổ sách. Tuy nhiên, cần xem xét thêm các yếu tố khác để đánh giá chính xác giá trị của công ty.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 2 (Warren Buffett - Con Hào Kinh Tế): Cơ cấu doanh thu',
        content: 'Phân tích cơ cấu doanh thu của công ty CTS cho thấy họ có sự cân bằng giữa các luồng doanh thu chính. Tuy nhiên, với sự giảm mạnh của lợi nhuận sau thuế, công ty cần tập trung vào việc tối ưu hóa cơ cấu doanh thu và giảm thiểu rủi ro. Công ty CTS có thể tập trung vào việc phát triển mảng môi giới giao dịch (Brokerage) và cho vay Margin để tăng trưởng doanh thu.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Greenblatt - Magic Formula): Tỷ suất lợi nhuận và tăng trưởng',
        content: 'Công ty CTS đang đối mặt với thách thức khi lợi nhuận sau thuế giảm 37.9%. Tuy nhiên, với tỷ suất lợi nhuận cao và tăng trưởng doanh thu trong quá khứ, công ty có tiềm năng phục hồi và tăng trưởng trong tương lai.'
    },
    {
        type: 'key-insight',
        title: '📝 Tầng 4 (Piotroski - F-Score): Đánh giá sức khỏe tài chính',
        content: 'Công ty CTS có F-Score cao, cho thấy sức khỏe tài chính của công ty đang tốt. Tuy nhiên, cần xem xét thêm các yếu tố khác để đánh giá chính xác sức khỏe tài chính của công ty.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích CTS?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, CTS có cơ cấu doanh thu cân bằng, nhưng cần tập trung vào việc tối ưu hóa và giảm thiểu rủi ro."',
                highlight: 'Bài học rút ra: Cần tập trung vào việc tối ưu hóa cơ cấu doanh thu và giảm thiểu rủi ro để tăng trưởng doanh thu và lợi nhuận.'
            }
        ]
    }
];