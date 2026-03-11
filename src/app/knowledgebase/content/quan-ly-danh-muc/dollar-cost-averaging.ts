// Article content: quan-ly-danh-muc / dollar-cost-averaging
// "Dollar-Cost Averaging — Chiến Lược Đầu Tư Mà Ngay Cả Buffett Khuyên Dùng"
// Ref: Warren Buffett letters, Jack Bogle, DCA research

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Warren Buffett — người nổi tiếng với việc "bắt đáy" chính xác — đã viết trong thư gửi cổ đông: *"Hầu hết các nhà đầu tư, cả nhỏ lẻ lẫn tổ chức, sẽ đạt được kết quả tốt hơn nếu họ mua một quỹ chỉ số với chi phí thấp bằng cách đầu tư đều đặn hàng tháng."*

Chiến lược đó có tên là **Dollar-Cost Averaging (DCA)** — mua một lượng cố định mỗi tháng, bất kể thị trường đang ở đâu.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: DCA Hoạt Động Như Thế Nào?',
        content: `**Nguyên lý đơn giản:** Thay vì cố gắng đoán thị trường đang ở đỉnh hay đáy (điều không ai làm được nhất quán), bạn chỉ cần đầu tư một số tiền cố định (ví dụ: 3 triệu/tháng) vào cùng một tài sản, đều đặn, bất kể giá đang cao hay thấp.

**Tại sao DCA thắng về mặt toán học:**
Khi giá thấp → bạn mua được nhiều đơn vị hơn.
Khi giá cao → bạn mua được ít đơn vị hơn.
Kết quả: **giá vốn trung bình của bạn luôn thấp hơn giá trung bình của tài sản** theo thời gian.

**Ví dụ thực tế:** Mua 3 triệu/tháng trong 3 tháng, giá: 30k → 20k → 40k:
- Tháng 1: mua được 100 CP
- Tháng 2: mua được 150 CP  
- Tháng 3: mua được 75 CP
- Tổng: 325 CP với 9 triệu → Giá vốn TB: 27,692đ/CP
- Giá trung bình 3 tháng: (30+20+40)/3 = 30,000đ/CP
→ DCA cho bạn giá vốn thấp hơn 8% so với mua đều về số lượng.`,
    },
    {
        type: 'key-insight',
        title: '💡 Thị Trường Giảm Là "Tin Tốt" Cho Nhà Đầu Tư DCA',
        content: 'Đây là sự đảo ngược tâm lý quan trọng nhất: người đang trong giai đoạn tích lũy (chưa đến lúc rút tiền) nên MUỐN thị trường giảm, không phải sợ nó. Khi thị trường giảm 30%, tiền hàng tháng của bạn mua được nhiều hơn 43% số cổ phiếu. Những người đã DCA đều qua khủng hoảng 2008, 2020 đều thu lợi khổng lồ khi thị trường hồi phục vì giá vốn trung bình của họ rất thấp.',
    },
    {
        type: 'steps',
        title: '📅 Thiết Lập Hệ Thống DCA Tự Động — 3 Bước',
        content: '',
        items: [
            {
                icon: '🎯',
                title: 'Bước 1: Chọn tài sản và tỷ lệ',
                highlight: 'ETF Index + cổ phiếu cốt lõi',
                body: 'DCA hiệu quả nhất với tài sản có xu hướng tăng dài hạn: ETF VN30/VNINDEX, ETF S&P500 (nếu có), hoặc các blue-chip stable. Không DCA vào cổ phiếu penny hay speculative stocks — chúng có thể không bao giờ hồi phục.',
            },
            {
                icon: '📆',
                title: 'Bước 2: Đặt ngày cố định hàng tháng',
                highlight: 'Tự động hóa, loại bỏ cảm xúc',
                body: 'Chọn ngày cố định (ví dụ: ngày 5 hàng tháng, sau khi nhận lương). Đặt lệnh tự động nếu có thể. Mục tiêu là biến đây thành thói quen cơ học — không cần kiểm tra bảng điện, không cần "chờ giá tốt hơn".',
            },
            {
                icon: '📈',
                title: 'Bước 3: Tăng dần số tiền DCA theo thu nhập',
                highlight: 'Step-up DCA',
                body: 'Mỗi năm khi lương tăng hoặc thu nhập tăng, tăng tỷ lệ DCA thêm 10-20%. Ví dụ: năm 1 DCA 2 triệu/tháng → năm 3 DCA 3 triệu → năm 5 DCA 5 triệu. Tác động lãi kép sẽ đáng kể sau 10-15 năm.',
            },
        ],
    },
    {
        type: 'warning',
        title: '⚠️ DCA Không Phải Thuốc Chữa Bách Bệnh',
        content: 'DCA không bảo vệ bạn khỏi thua lỗ nếu tài sản bạn chọn có xu hướng giảm dài hạn (ví dụ: DCA vào cổ phiếu một công ty đang thua lỗ liên tục). DCA cũng không tối ưu hoàn toàn về mặt toán học khi có một khoản tiền lớn — lý thuyết thống kê cho thấy đầu tư một lần (lump sum) thắng DCA trong 2/3 trường hợp trong lịch sử. Tuy nhiên, DCA thắng về mặt tâm lý học: hầu hết mọi người không thể "đầu tư một lần" mà không run tay.',
    },
    {
        type: 'quote',
        content: '"Tôi không biết thị trường sẽ đi đâu vào tuần tới, tháng tới, hay năm sau. Nhưng tôi chắc chắn rằng nó sẽ cao hơn nhiều trong 5, 10, 20 năm tới. Và đó là điều duy nhất quan trọng."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'DCA = mua cố định theo thời gian → giá vốn TB luôn thấp hơn giá trung bình tài sản',
            'Thị trường giảm = TIN TỐT cho người DCA đang tích lũy — mua được nhiều hơn',
            'Điều kiện: DCA vào tài sản có xu hướng tăng dài hạn (ETF, blue chip) — không phải penny stocks',
            'Tự động hóa vào ngày cố định → loại bỏ hoàn toàn cảm xúc ra quyết định',
            'Step-up DCA: tăng 10-20%/năm theo thu nhập → lãi kép tối đa sau 10-15 năm',
            'Lump sum thắng DCA 2/3 lần về lý thuyết — nhưng DCA thắng về tâm lý học (không ai đủ can đảm all-in đúng lúc)',
        ],
    },
]
