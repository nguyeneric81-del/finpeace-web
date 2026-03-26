import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Quản lý dòng tiền (Cash Flow Management) là kỹ năng sơ đẳng nhưng quyết định sinh tử của Tài chính cá nhân. Nếu bạn không biết dòng tiền của mình đang rỉ ra từ đâu, thì dù bạn kiếm được 20 triệu hay 200 triệu một tháng, chặng cuối của bạn vẫn là nhẵn túi. Lập ngân sách không phải là "thắt lưng buộc bụng", lập ngân sách là tự động hóa quyết định tài chính để bạn có thể tiêu tiền trong hạnh phúc mà không cảm thấy tội lỗi.`,
    },
    {
        type: 'concept',
        title: '📖 Quy tắc 50/30/20 (Phù hợp người mới)',
        content: `Được Thượng nghị sĩ Elizabeth Warren giới thiệu, đây là tỷ lệ vàng dễ nhớ nhất:
- **50% Nhu cầu thiết yếu (NEEDS):** Tiền thuê nhà, ăn uống cơ bản, xăng xe, điện nước.
- **30% Chi tiêu cá nhân (WANTS):** Cà phê bạn bè, du lịch, xem phim. (Đây là túi tiền mang lại thanh xuân cho bạn).
- **20% Tích lũy & Đầu tư (SAVINGS/INVESTING):** Trả nợ, gửi tiết kiệm, rót vào tài khoản chứng khoán.

Tuy nhiên, với tình hình bất động sản đắt đỏ ở thành phố, tỷ lệ NEEDS của người trẻ Việt Nam thường bị phình to lên mức 60-70%. Khi đó, bạn buộc phải cắt phần WANTS xuống để bảo vệ phần SAVINGS.`,
    },
    {
        type: 'concept',
        title: '📖 Phương pháp JARS - Hệ thống 6 chiếc lọ (Trình độ cao hợn)',
        content: `Do T. Harv Eker đề xuất, JARS chia tiền chi tiết hơn giúp triệt tiêu sự mập mờ:
1. **Lọ Thiết yếu (55%):** Nhu cầu sống còn.
2. **Lọ Tự do Tài chính (10%):** Bỏ vào chứng khoán, đầu tư sinh lời. KHÔNG BAO GIỜ rút ra tiêu.
3. **Lọ Tiết kiệm dài hạn (10%):** Mua xe, mua nhà, quỹ khẩn cấp.
4. **Lọ Giáo dục (10%):** Mua sách, học khóa học khóa kỹ năng.
5. **Lọ Hưởng thụ (10%):** Đi spa, ăn nhà hàng xịn. Phải tiêu hết lọ này mỗi tháng để tạo động lực.
6. **Lọ Cho đi (5%):** Từ thiện, biếu nội ngoại.`,
    },
    {
        type: 'warning',
        title: '⚠️ Bẫy vô hình: The Latte Factor',
        content: `Ly cà phê 50,000đ mỗi buổi chiều trông có vẻ vô hại. Nhưng 50k x 25 ngày x 12 tháng = 15 triệu đồng/năm. Nếu mang 15 triệu này đầu tư vào VNINDEX với lãi kép 12%/năm, sau 20 năm nó biến thành hàng trăm triệu đồng. 

"Latte Factor" (Tác nhân Latte) ám chỉ những khoản chi lặt vặt ăn mòn túi tiền của bạn mà bạn không hề hay biết. Hệ thống ngân sách sinh ra để bạn chặn đứng các Tác nhân Latte này.`,
    },
    {
        type: 'checklist',
        title: '✅ Cách tự động hóa dòng tiền',
        content: [
            'Nhận lương: Tự động trích ngay 20% chuyển vào tài khoản Đầu Tư (Pay yourself first).',
            'Dùng App để theo dõi: Sử dụng MoneyLover, Sổ Thu Chi MISA để log ngay khoản chi tiêu trong 3 giây.',
            'Review Tối Chủ Nhật: Dành 10 phút kiểm tra xem tuần qua phần WANTS dùng hết giới hạn chưa.',
        ],
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Budgeting (Lập ngân sách) không phải để gò bó bạn, mà để cho bạn Quyền được tự do chi tiêu trong tầm kiểm soát.',
            'Phương pháp 50/30/20 hay 6 Lọ không quan trọng bằng Kỷ Luật duy trì nó.',
            'Hãy áp dụng nguyên tắc Pay Yourself First — Trả lương cho túi tiền đầu tư của mình trước khi chi tiêu.',
        ],
    },
]
