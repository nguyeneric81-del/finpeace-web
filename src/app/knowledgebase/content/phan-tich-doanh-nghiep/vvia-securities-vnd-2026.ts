import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `**Lợi nhuận Quý mới nhất:** 545 tỷ VND (Tăng trưởng: 42.6%)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực** — Với tăng trưởng lợi nhuận sau thuế lên đến 42.6% và doanh thu tăng 43.6%, mã chứng khoán VND đang thể hiện sự tăng trưởng mạnh mẽ trong ngành chứng khoán.`
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Định giá',
        content: `Dưới lăng kính phòng ngự của Benjamin Graham, chúng ta nhìn vào chỉ số P/B (Price-to-Book) để đánh giá sự an toàn của đầu tư. P/B hiện tại là 1.15, cho thấy giá trị sổ sách của VND đang được định giá hợp lý so với giá thị trường.`
    },
    {
        type: 'key-insight',
        title: '🌟 Tầng 2 (Con Hào Kinh Tế - Buffett): Cơ cấu doanh thu',
        content: `Mô hình kinh doanh của công ty chứng khoán VND có thể được phân tích thông qua cơ cấu doanh thu của họ. Với 3 luồng doanh thu chính là Phí môi giới giao dịch (Brokerage), Cho vay Margin, và Tự doanh (Proprietary Trading) / Ngân hàng đầu tư (IB), VND dường như đang tập trung mạnh vào mảng môi giới bán lẻ và tự doanh. Điều này cho thấy sự đa dạng hóa trong nguồn thu và khả năng chống chọi với biến động thị trường.`
    },
    {
        type: 'key-insight',
        title: '🚀 Tầng 3 (Tăng trưởng - Greenblatt): Tăng trưởng doanh thu và lợi nhuận',
        content: `Theo quan điểm của Joel Greenblatt, tăng trưởng doanh thu và lợi nhuận là những yếu tố quan trọng trong việc đánh giá một công ty. Với tăng trưởng doanh thu lên đến 43.6% và lợi nhuận sau thuế tăng 42.6%, VND đang thể hiện một bức tranh tăng trưởng rất tích cực.`
    },
    {
        type: 'key-insight',
        title: '📊 Tầng 4 (Sức khỏe tài chính - Piotroski): Chỉ số F-Score',
        content: `Chỉ số F-Score của Piotroski giúp đánh giá sức khỏe tài chính của một công ty. Dựa trên các tiêu chí như lợi nhuận, dòng tiền, và các chỉ số khác, F-Score có thể giúp nhà đầu tư đánh giá khả năng tồn tại và phát triển của VND trong dài hạn.`
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích VND?',
        content: `Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC và quay sang nói với Charlie Munger:`,
        items: [
            {
                icon: '💸',
                title: 'Con Hào Môi Giới',
                body: `"Charlie coi kìa, VND đang làm rất tốt trong mảng môi giới bán lẻ và tự doanh. Đây có thể là điểm mạnh của họ trong việc đối phó với biến động thị trường."`,
                highlight: 'Bài học rút ra: Sự đa dạng hóa trong nguồn thu và khả năng chống chọi với biến động thị trường là chìa khóa cho sự thành công của một công ty chứng khoán.'
            }
        ]
    }
];