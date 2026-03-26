import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Sự khác biệt lớn nhất giữa một người có "Lương cao" và người "Giàu có" là gì? Là ở cuối tháng, người lương cao có thể vung tiền mua một chiếc iPhone đời mới nhất không chớp mắt, nhưng khi có sự cố, họ vẫn phải quẹt thẻ tín dụng. Người giàu có có thể đi xe cũ, nhưng tài khoản chứng khoán của họ đang sinh lời bằng lương một năm làm việc của người khác.

Thu nhập (Income) chỉ là một dòng nước chảy qua nhà. Tài sản ròng (Net Worth) mới là hồ chứa nước đọng lại sau cùng. Thống kê cho thấy: Rất ít người trẻ dưới 30 tuổi biết chính xác Net Worth của mình bằng bao nhiêu. Vậy làm sao bạn biết mình đi đúng đường để vươn tới Tự do Tài chính?`,
    },
    {
        type: 'quote',
        content: 'Sự giàu có thực sự là những gì bạn KHÔNG nhìn thấy. Những chiếc xe chưa được mua, kim cương chưa được sắm... Sự giàu có chính là những dòng tài sản kinh tế chưa bị chuyển hóa thành những thứ vật chất đắp lên người.',
        author: 'Morgan Housel',
        source: 'The Psychology of Money',
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Giá Trị Tài Sản Ròng (Net Worth) là gì?',
        content: `Về mặt định nghĩa, Giá trị Tài sản ròng (Net Worth) là thước đo tài chính trung thực nhất về hiện trạng tiền bạc của bạn.
Công thức vô cùng đơn giản:
NET WORTH = TỔNG TÀI SẢN (Assets) - TỔNG NỢ (Liabilities)

Ví dụ: Bạn có 500 triệu đồng trong ngân hàng, nhưng lại đang gánh một khoản vay mua nhà 1.5 tỷ đồng và một khoản vay mua ô tô 300 triệu đồng. Net Worth của bạn không phải là 500 triệu. Net Worth của bạn là Âm (-) 1.3 tỷ đồng.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Bảng Cân Đối Kế Toán Cá Nhân',
        content: `Để tính Net Worth, bạn cần lập Bảng cân đối kế toán cá nhân — tài liệu mà mọi doanh nghiệp tỷ bạc đều phải báo cáo hàng quý, nhưng lại vắng bóng trong sổ tay cá nhân của mỗi người. Bảng này gồm 2 phần cốt lõi:

**A. TÀI SẢN (Những thứ nhét tiền VÀO túi bạn)**
- Tài sản thanh khoản: Tiền trong ATM, quỹ khẩn cấp. Rút được ngay.
- Tài sản đầu tư: Cổ phiếu, quỹ mở, tiền số. Chúng sinh ra tiền (Lãi kép).
- Tài sản cố định: Nhà đang ở (đã trả đứt), đất đai.

**B. TIÊU SẢN & NỢ (Những thứ móc tiền KHỎI túi bạn)**
- Nợ rủi ro cao: Thẻ tín dụng, tiêu dùng. Lãi suất 25-40%. Hố Đen Vũ Trụ nuốt chửng Net Worth.
- Nợ trả góp mất giá: Xe ô tô, điện thoại đắt tiền.
- Nợ vay dài hạn: Vay mua nhà (Nếu tài sản này sinh lời vượt lãi suất, có thể gọi là "Nợ Tốt").`,
    },
    {
        type: 'quote',
        content: 'Bình an tài chính không đến từ việc dòng tiền chảy vào túi bạn khủng khiếp tới cỡ nào, mà đến từ việc bạn giữ lại được bao nhiêu và biết cách để chúng tự làm việc cho mình. Net Worth chính là trọng lượng của sự Bình An đó.',
        author: 'Nguyễn Tuấn Anh',
        source: 'Bình An Tài Chính',
    },
    {
        type: 'checklist',
        title: '✅ Bài Tập Thực Chiến Trong 5 Phút',
        content: [
            'Mở ghi chú trên điện thoại và kẻ 2 cột: TÀI SẢN (Trái) và NỢ (Phải).',
            'Sắp xếp thời gian điền trung thực TẤT CẢ các con số bạn nhớ được.',
            'Lấy Tổng Trái trừ đi Tổng Phải để ra Net Worth.',
            'Đối diện với con số dư cuối cùng. Đừng trốn tránh nếu nó âm.',
            'Nếu bạn sốc — đó là tín hiệu vũ trụ cho thấy hành trình Tự Do Tài Chính của bạn thực sự bắt đầu.',
        ],
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Lương cao không đồng nghĩa với Giàu có, thứ bạn phải nhìn vào là Net Worth.',
            'Tài sản sinh ra dòng tiền, Tiêu sản tước đoạt dòng tiền.',
            'Bước tiếp theo: Học phân bổ ngân sách để bắt đầu kéo Net Worth dương trở lại.',
        ],
    },
]
