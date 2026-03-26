import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Nợ xấu là những sợi xích buộc chặt đôi chân bạn tại vạch xuất phát của đường đua Tự do tài chính. Một khoản vay thẻ tín dụng 40 triệu đồng với lãi suất 30%/năm sẽ ăn đứt mọi siêu cổ phiếu bạn có thể tìm thấy. Việc xóa sổ những khoản nợ lãi suất cao là đòn bẩy tỷ suất lợi nhuận (ROI) an toàn và chắc chắn nhất trên đời. Dưới đây là 2 phương pháp kinh điển giúp bạn "bẻ xích" trốn thoát.`,
    },
    {
        type: 'concept',
        title: '📖 Phương pháp 1: Debt Snowball (Quả Cầu Tuyết) — Đánh vào tâm lý',
        content: `Được tỷ phú Dave Ramsey giới thiệu, phương pháp Debt Snowball cực kỳ hiệu quả những người dễ nản chí. Nó tập trung vào chiến thắng nhỏ để tạo động lực.
        
**Cách làm:**
1. Liệt kê TẤT CẢ các khoản nợ từ **số tiền Nhỏ Nhất** đến Lớn Nhất (bỏ qua lãi suất).
2. Tối đa hóa nguồn tiền (bằng cách cắt bớt chi tiêu) để trả dứt điểm Khoản Nợ Nhỏ Nhất trước. Các khoản lớn hơn chỉ trả mức tối thiểu.
3. Khi khoản số 1 bay màu, lấy số tiền bạn từng dùng để trả nó cộng dồn vào khoản nhỏ Thứ Hai. Cứ thế quả cầu tuyết lăn tới khoản to nhất.
**Hạn chế:** Không tối ưu hóa học thuật vì bạn vẫn gánh lãi suất cao ở những khoản bự, nhưng tỷ lệ thành công của phương pháp này lại cao nhất nhờ "Chiến thắng tâm lý".`,
    },
    {
        type: 'concept',
        title: '📖 Phương pháp 2: Debt Avalanche (Trận Tuyết Lở) — Tối ưu lãi suất',
        content: `Dành cho những cái đầu lạnh lùng, thuần Toán học và giỏi chịu đựng áp lực.
        
**Cách làm:**
1. Liệt kê TẤT CẢ các khoản nợ từ **Lãi suất Cao Nhất** đến Thấp Nhất (như Thẻ tín dụng, Vay FE Credit...).
2. Dồn toàn lực đập chết khoản có Lãi Suất Cao Nhất trước. Các khoản kia trả mức tối thiểu.
3. Chặn đứng thiệt hại tài chính từ gốc.
**Hạn chế:** Nếu khoản nợ lãi cao nhất lại tốn rất nhiều thời gian để dứt điểm, bạn sẽ không nếm được mùi "vừa xóa 1 khoản nợ", dẫn đến não bộ kiệt sức và dễ bỏ cuộc giữa chừng.`,
    },
    {
        type: 'quote',
        content: 'Chúng ta mua những món đồ chúng ta không cần, bằng những đồng tiền chúng ta không có, để lòe những người chúng ta còn chả thèm thích.',
        author: 'Dave Ramsey',
        source: 'The Total Money Makeover',
    },
    {
        type: 'warning',
        title: '⚠️ Bẻ gãy vòng lặp Nợ - Vay mới',
        content: `Cắt vụn thẻ tín dụng! Khi bạn đang trong chu trình trả nợ, hành động nguy hiểm nhất là quẹt thẻ thêm một lần nữa. Cảm giác "tạm ứng tương lai" gây nghiện tương đương với dopamine của việc đánh bạc. Một khi đã quyết tâm xóa nợ, hãy thanh toán hoàn toàn bằng tiền trong thẻ ATM hoặc tiền mặt.`,
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Nợ tiêu dùng lãi suất cao là kẻ thù số 1. Không có kênh đầu tư nào an toàn sinh lời 30-40%/năm để đắp vào lỗ hổng này.',
            'Nếu bạn cần sự tự động viên tâm lý $\\rightarrow$ Dùng Quả Cầu Tuyết (Trả cục nợ nhỏ nhất trước).',
            'Nếu bạn muốn bảo vệ dòng tiền bằng con số logic $\\rightarrow$ Dùng Trận Tuyết Lở (Giết khoản lãi suất cao trước).',
            'Tuyệt đối không sử dụng Margin chứng khoán khi bản thân đang mắc nợ rủi ro ngoài đời.',
        ],
    },
]
