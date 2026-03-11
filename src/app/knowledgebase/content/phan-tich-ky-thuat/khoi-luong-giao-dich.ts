// Article content: phan-tich-ky-thuat / khoi-luong-giao-dich
// "Khối Lượng (Volume) — Bằng Chứng Xác Nhận Hay Phủ Nhận Tín Hiệu Giá"
// Ref: Volume Spread Analysis (VSA), Richard Wyckoff, Nicolas Darvas

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Nếu giá cả là "ngôn ngữ" của thị trường, thì khối lượng giao dịch (Volume) là "giọng nói" — nó cho bạn biết tín hiệu giá đó có đáng tin không.

Trong phân tích kỹ thuật, Volume là thước đo tốt nhất về quy luật cung - cầu và cho biết liệu có sự "bảo trợ" của dòng tiền lớn (tổ chức, quỹ đầu tư) đứng sau một cổ phiếu hay không. Khối lượng lớn phá vỡ kháng cự là thật. Khối lượng thấp thường là bẫy.`,
    },
    {
        type: 'key-insight',
        title: '💡 Insight Cốt Lõi: Volume Không Bao Giờ Nói Dối',
        content: 'Huyền thoại Nicolas Darvas coi Volume là "đầu mối" quan trọng nhất: khi một cổ phiếu vốn ít giao dịch đột nhiên tăng vọt về khối lượng, đó là tín hiệu "dòng tiền thông minh" đang bí mật gom hàng. Giá có thể bị thao túng trong ngắn hạn; Volume phản ánh nơi tiền lớn thực sự đang di chuyển.',
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Volume là "Linh Hồn" của Phân Tích Kỹ Thuật?',
        content: `Quy tắc căn bản: **Khối lượng càng lớn, lực đẩy đằng sau biến động giá càng mạnh.**

Volume không đi một mình — nó luôn phải được đọc kết hợp với hành động giá. Khi hai yếu tố này cùng chiều, tín hiệu đáng tin. Khi chúng mâu thuẫn nhau, thị trường đang gửi tín hiệu cảnh báo.

**Quy tắc vàng:** Khối lượng lớn phải luôn đi cùng chiều với xu hướng chủ đạo. Bất kỳ sự chệch hướng nào — giá tăng nhưng volume giảm, hay giá giảm nhưng volume bùng nổ — đều là tín hiệu cần đặt câu hỏi ngay lập tức.`,
    },
    {
        type: 'steps',
        title: '📊 Cách Đọc Volume Để Xác Nhận Xu Hướng',
        content: '',
        items: [
            {
                icon: '📈',
                title: 'Giá tăng + Volume tăng = Tín hiệu Mua mạnh',
                highlight: 'Uptrend được xác nhận',
                body: 'Trong xu hướng tăng lành mạnh: Volume lớn ở những nhịp tăng giá, Volume nhỏ ở những nhịp điều chỉnh. Phe mua đang kiểm soát hoàn toàn. Chừng nào Volume còn tiếp tục tăng, xu hướng sẽ còn tiếp diễn.',
            },
            {
                icon: '📉',
                title: 'Giá giảm mạnh + Volume tăng vọt = Tín hiệu Bán khẩn cấp',
                highlight: 'Phe bán áp đảo',
                body: 'Áp lực bán bao trùm kèm khối lượng lớn cho thấy phe bán đang hoàn toàn áp đảo phe mua. Đây là tín hiệu thoát hàng, không phải thời điểm "bắt đáy".',
            },
            {
                icon: '⚠️',
                title: 'Giá tăng nhưng Volume giảm dần = Cảnh báo đỉnh',
                highlight: 'Sức mua đang cạn kiệt',
                body: 'Đây là tín hiệu nguy hiểm nhất: thị trường không còn đủ người mua để tiếp tục đẩy giá lên. Sự không chấp nhận mức giá cao của dòng tiền lớn cảnh báo đảo chiều có thể xảy ra.',
            },
            {
                icon: '💤',
                title: 'Volume sụt giảm bất kể chiều giá = Đứng ngoài quan sát',
                highlight: 'Thị trường sắp đổi chiều',
                body: 'Khi volume giảm mạnh dù giá đang đi theo hướng nào, thiếu sự tham gia của dòng tiền lớn. Không nên vào lệnh trong giai đoạn này.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Breakout Thật vs. Bẫy Tăng Ảo (Bull Trap)',
        content: `Đây là kỹ năng sinh tồn của mọi Trader:

**Breakout Thật — Có xác nhận của dòng tiền:**
Khi giá bứt phá khỏi vùng tích lũy hoặc kháng cự, Volume bắt buộc phải tăng mạnh đồng thời. Cầu vượt cung cộng với dòng tiền lớn đổ vào đẩy giá đi tiếp. Đây là điểm vào lệnh với xác suất thắng cao nhất.

**Bull Trap — Bẫy nhốt người mua đuổi:**
Giá lập đỉnh mới hoặc vượt kháng cự, nhưng Volume lại giảm dần. Thị trường đang thiếu "nhiên liệu" để tiếp tục. Breakout với volume thấp thường kết thúc bằng sự sụt giảm tàn khốc ngay sau đó, nhốt những ai mua đuổi theo tín hiệu giả.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Climax Volume — Kỹ Năng Chốt Lời Của Trader Kinh Nghiệm',
        content: `**Sự khác biệt giữa Trader mới và Trader kinh nghiệm:**

**Trader mới:** Thấy bảng điện xanh đỏ sôi động → bị cuốn theo → mua khi đám đông đang hoảng loạn nhảy vào.

**Trader kinh nghiệm:** Nhận ra rằng **Climax Volume** (khối lượng tăng kịch tính bất thường) thường đánh dấu sự **KẾT THÚC** của một đợt biến động, không phải sự bắt đầu. Đây là lúc "đám đông" công chúng hoảng loạn nhảy vào — chính là thời điểm dòng tiền thông minh đang âm thầm chốt lời và thoát hàng.

**Bộ lọc Volume chuyên nghiệp:** So sánh Volume ngày hôm nay với mức trung bình 30-90 ngày. Cổ phiếu có Volume đột biến (gấp 2-3 lần trung bình) ở điểm breakout hợp lệ là signal đáng quan tâm nhất.`,
    },
    {
        type: 'warning',
        title: '⚠️ Sai Lầm Phổ Biến: Bỏ Qua Volume Khi Giao Dịch',
        content: 'Một breakout đẹp về mặt price action nhưng không có Volume xác nhận là một cái bẫy đang chờ bạn. Không có quy tắc nào trong phân tích kỹ thuật "miễn dịch" với Volume — tất cả đường xu hướng, mô hình giá, S/R đều cần Volume xác nhận để có giá trị thực chiến.',
    },
    {
        type: 'quote',
        content: '"Khi tôi thấy một cổ phiếu đột ngột tăng vọt về khối lượng, tôi biết có ai đó đang làm gì đó. Và nhiệm vụ của tôi là tìm ra họ là ai và tại sao."',
        author: 'Nicolas Darvas',
        source: 'How I Made $2,000,000 in the Stock Market',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Volume = thước đo sức mạnh thực sự của mọi biến động giá — không có Volume, mọi tín hiệu đều cần nghi ngờ',
            'Xu hướng tăng lành mạnh: Volume lớn ở nhịp tăng, Volume nhỏ ở nhịp điều chỉnh',
            'Breakout thật = Giá phá kháng cự + Volume tăng mạnh | Breakout giả = Volume thấp → Bull Trap',
            'Giá tăng + Volume giảm dần = Cảnh báo đỉnh, sức mua đang cạn kiệt',
            'Climax Volume (bùng nổ kịch tính) = thời điểm đám đông hoảng loạn vào = trader kinh nghiệm chốt lời',
            'Bộ lọc thực chiến: so sánh Volume hôm nay với trung bình 30-90 ngày để phát hiện "dấu tay" dòng tiền lớn',
        ],
    },
]
