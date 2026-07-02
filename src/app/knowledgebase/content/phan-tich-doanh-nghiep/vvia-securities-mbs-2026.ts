import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `**Lợi nhuận Quý mới nhất:** 292 tỷ VND (Cập nhật Q1/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Công ty chứng khoán MBS đang thể hiện sự tăng trưởng ấn tượng với lợi nhuận sau thuế tăng 8.4% và doanh thu tăng 52.4%.`
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta xem xét chỉ số P/B (Price-to-Book) và định giá của MBS. P/B hiện tại là 2.32, so với trung bình ngành, đây là một mức định giá hợp lý.'
    },
    {
        type: 'key-insight',
        title: '💡 Tầng 2 (Con Hào Kinh Tế - Buffett): Cơ cấu doanh thu',
        content: 'Mô hình kinh doanh của MBS có 3 luồng doanh thu chính: Phí môi giới giao dịch, Cho vay Margin, và Tự doanh/Ngân hàng đầu tư. Phân tích cơ cấu doanh thu của MBS cho thấy họ có sự cân bằng giữa các mảng, nhưng đặc biệt mạnh ở mảng Phí môi giới giao dịch, chiếm tỷ trọng lớn trong tổng doanh thu.'
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 3 (Tăng trưởng - Greenblatt): Tăng trưởng doanh thu và lợi nhuận',
        content: 'Với tăng trưởng doanh thu 52.4% và lợi nhuận sau thuế tăng 8.4%, MBS đang thể hiện khả năng tăng trưởng mạnh mẽ. Chỉ số P/E TTM là 16.83, cho thấy thị trường đang kỳ vọng vào sự tăng trưởng tiếp tục của công ty.'
    },
    {
        type: 'key-insight',
        title: '📈 Tầng 4 (Sức khỏe tài chính - Piotroski): Đánh giá sức khỏe tài chính',
        content: 'Áp dụng tiêu chí đánh giá sức khỏe tài chính của Piotroski, MBS đạt được số điểm cao, thể hiện tình hình tài chính ổn định và khả năng quản lý tài chính hiệu quả.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích MBS?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: '"Charlie coi kìa, MBS có một cơ cấu doanh thu đa dạng nhưng mạnh nhất ở mảng Phí môi giới giao dịch. Điều này cho thấy họ có khả năng tận dụng lợi thế của mình trong thị trường chứng khoán."',
                highlight: 'Bài học rút ra: Sự đa dạng hóa trong doanh thu và tập trung vào điểm mạnh là chìa khóa cho sự thành công của một công ty chứng khoán.'
            }
        ]
    }
];