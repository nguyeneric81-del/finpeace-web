// Article content for: tam-ly-thi-truong / cognitive-biases
// 10 Cognitive Biases — Thiên Kiến Nhận Thức Giết Chết Tài Khoản

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Năm 2002, nhà tâm lý học Daniel Kahneman nhận giải Nobel Kinh tế — không phải vì ông làm kinh tế học, mà vì ông đã chứng minh rằng con người không hề ra quyết định lý trí như các mô hình kinh tế cổ điển giả định.

Theo nghiên cứu của ông, hàng trăm nghìn nhà đầu tư mỗi ngày đều phạm những sai lầm có thể dự đoán được — không phải vì họ ngu ngốc, mà vì não bộ của họ hoạt động đúng theo cách nó được lập trình từ hàng triệu năm tiến hóa. Vấn đề là môi trường tiến hóa đó không phải là sàn chứng khoán.

Bài học này sẽ giúp bạn nhận diện 10 "thiên kiến nhận thức" nguy hiểm nhất — những bẫy tâm lý mà ngay cả những nhà đầu tư chuyên nghiệp cũng mắc phải hàng ngày.`,
    },
    {
        type: 'key-insight',
        title: '💡 Sự Thật Đau Lòng',
        content: 'Nghiên cứu của Brad Barber & Terrance Odean (2000) trên 66,000 tài khoản môi giới Mỹ: nhà đầu tư cá nhân giao dịch nhiều nhất thua thị trường trung bình 6.5%/năm. Lý do không phải thông tin kém — mà là cognitive biases.',
    },
    {
        type: 'steps',
        title: '🧠 10 Thiên Kiến Nguy Hiểm Nhất',
        content: '10 thiên kiến nhận thức phổ biến nhất trên thị trường chứng khoán:',
        items: [
            {
                icon: '1️⃣',
                title: 'Confirmation Bias — Thiên Kiến Xác Nhận',
                body: 'Bạn chỉ tìm kiếm thông tin ủng hộ quyết định đã làm. Đã mua VIC rồi → chỉ đọc báo tốt về VIC, bỏ qua mọi cảnh báo xấu.',
                highlight: 'Fix: Chủ động tìm luận điểm PHẢN BÁC trước khi mua',
            },
            {
                icon: '2️⃣',
                title: 'Overconfidence Bias — Quá Tự Tin',
                body: '74% tài xế nghĩ mình lái xe giỏi hơn trung bình, 80% nhà đầu tư nghĩ mình sẽ đánh bại thị trường. Cả hai con số đều bất khả thi.',
                highlight: 'Fix: Ghi lại dự đoán, kiểm tra lại sau 3 tháng',
            },
            {
                icon: '3️⃣',
                title: 'Anchoring Bias — Neo Giá',
                body: 'Nếu bạn mua HPG ở 25k, bạn sẽ nghĩ 20k là "rẻ" và 30k là "đắt" — bất kể fundamental thay đổi như thế nào. Giá mua ban đầu trở thành neo tham chiếu vô lý.',
                highlight: 'Fix: Định giá từ dữ liệu cơ bản, không từ giá mua',
            },
            {
                icon: '4️⃣',
                title: 'Availability Heuristic — Sai Lầm Sẵn Có',
                body: 'Bạn đánh giá xác suất dựa trên ví dụ dễ nhớ nhất. Sau vụ Trịnh Văn Quyết, mọi người thấy rủi ro FLC cao — nhưng bỏ qua hàng trăm vụ lừa đảo ngầm khác đang diễn ra.',
                highlight: 'Fix: Dùng số liệu thống kê, không dùng câu chuyện cá biệt',
            },
            {
                icon: '5️⃣',
                title: 'Herding Bias — Bầy Đàn',
                body: 'Khi 90% hội nhóm Zalo nói mua, não bộ tiết ra dopamine thúc đẩy bạn theo. Đây là lý do đỉnh thị trường luôn có volume cao nhất — và là thời điểm tệ nhất để mua.',
                highlight: 'Fix: Nghịch chiều signal: volume cao bất thường = cẩn thận',
            },
            {
                icon: '6️⃣',
                title: 'Recency Bias — Thiên Kiến Gần Đây',
                body: 'Sau 6 tháng thị trường tăng, bạn nghĩ nó sẽ tiếp tục tăng. Sau crash, bạn nghĩ nó sẽ tiếp tục giảm. Không ai nhớ rằng chu kỳ luôn đảo chiều.',
                highlight: 'Fix: Đọc 5-10 năm lịch sử thị trường trước khi ra quyết định lớn',
            },
            {
                icon: '7️⃣',
                title: 'Disposition Effect — Hiệu Ứng Định Vị',
                body: 'Bán sớm cổ phiếu đang lãi để "cất lợi nhuận", nhưng giữ mãi cổ phiếu đang lỗ hy vọng phục hồi. Hành vi ngược với tối ưu: cắt lỗ, để lời chạy.',
                highlight: 'Fix: Stop loss cứng + trailing profit thay vì phán đoán cảm tính',
            },
            {
                icon: '8️⃣',
                title: 'Status Quo Bias — Thiên Kiến Hiện Trạng',
                body: 'Không hành động cũng là hành động. Giữ tiền mặt khi lạm phát 4%/năm là chấp nhận lỗ thực. Sợ thay đổi danh mục dù đã biết nó không còn phù hợp.',
                highlight: 'Fix: Review danh mục định kỳ 3 tháng/lần, có quy trình rõ ràng',
            },
            {
                icon: '9️⃣',
                title: 'Hindsight Bias — Thiên Kiến Nhìn Lại',
                body: '"Tôi biết mà, crypto sẽ sập!" — Sau khi sập. Thiên kiến này nguy hiểm vì nó khiến bạn nghĩ mình giỏi dự đoán hơn thực tế, dẫn đến overconfidence.',
                highlight: 'Fix: Ghi nhật ký quyết định với lý do CỤ THỂ tại thời điểm quyết định',
            },
            {
                icon: '🔟',
                title: 'Authority Bias — Thiên Kiến Quyền Lực',
                body: 'Một diễn giả nổi tiếng khuyên mua, một "chuyên gia" trên TV khuyên bán — và bạn làm theo không suy nghĩ. Warren Buffett bị ghét cay ghét đắng năm 1999 vì không mua tech stocks.',
                highlight: 'Fix: Đánh giá luận điểm, không đánh giá người nói',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Kẻ thù lớn nhất của nhà đầu tư — có thể là chính nhà đầu tư đó."',
        author: 'Benjamin Graham',
        source: 'The Intelligent Investor',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình Chống Bias Trước Khi Mua',
        content: [
            'Viết ra 3 lý do ĐỂ MUA — rõ ràng, có số liệu',
            'Viết ra 3 lý do ĐỂ KHÔNG MUA — phần này quan trọng hơn',
            'Hỏi: "Nếu bạn không sở hữu cổ phiếu này, bạn có mua bây giờ không?"',
            'Check xem mình có đang bị neo vào giá cũ, tin tức gần đây, hay quyết định của người nổi tiếng không',
            'Chờ 24 giờ trước khi thực hiện mọi giao dịch ngoài kế hoạch',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Biết Là Chưa Đủ',
        content: 'Đọc bài này xong không ngăn bạn mắc cognitive biases — vì chúng hoạt động ở tầng sâu hơn nhận thức. Cơ chế bảo vệ duy nhất là HỆ THỐNG CỨNg: quy trình đặt lệnh có checklist, stop loss tự động, journal giao dịch bắt buộc. Kahneman bản thân ông vẫn mắc các thiên kiến này — ông chỉ dùng hệ thống để hạn chế tác hại.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Não bộ được lập trình cho rừng rậm, không phải sàn chứng khoán — biết điều này là lợi thế',
            '10 bias nguy hiểm nhất: Confirmation, Overconfidence, Anchoring, Availability, Herding, Recency, Disposition, Status Quo, Hindsight, Authority',
            'Không thể xóa bias — chỉ có thể tạo HỆ THỐNG để bias không ảnh hưởng quyết định',
            'Bước tiếp theo: Xem bài "Sunk Cost Fallacy" và "Loss Aversion" để hiểu thêm 2 bias đặc biệt nguy hiểm',
        ],
    },
]
