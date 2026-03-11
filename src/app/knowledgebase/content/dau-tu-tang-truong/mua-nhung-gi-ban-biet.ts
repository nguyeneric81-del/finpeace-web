// Article content: dau-tu-tang-truong / mua-nhung-gi-ban-biet
// "Triết Lý Peter Lynch: Đầu Tư Vào Những Gì Bạn Đã Biết"
// Ref: One Up on Wall Street, Beating the Street (Peter Lynch)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Peter Lynch quản lý quỹ Magellan tại Fidelity từ 1977 đến 1990. Trong 13 năm đó, ông biến 18 triệu đô thành 14 tỷ đô — mức tăng trưởng trung bình 29.2%/năm, đánh bại S&P 500 trong 11 trong 13 năm.

Bí mật? Ông mua cổ phiếu của những công ty mà vợ ông kể về một sản phẩm mới khi đi mua sắm. Ông mua Dunkin' Donuts vì thấy khách hàng xếp hàng dài mua cà phê. Bạn cũng có thể làm điều đó.`,
    },
    {
        type: 'key-insight',
        title: '💡 Lợi Thế Khổng Lồ Bạn Đang Lãng Quên',
        content: 'Nhà đầu tư cá nhân sở hữu một lợi thế mà quỹ chuyên nghiệp đã đánh mất: "sức mạnh của tri thức thông thường." Bạn biết sản phẩm nào đang bán chạy, cửa hàng nào đông khách, dịch vụ nào khiến bạn nói với bạn bè — trước cả khi analyst Phố Wall nhận ra. Đó là "thông tin nội bộ" hợp pháp duy nhất.',
    },
    {
        type: 'concept',
        title: '⚠️ Sự Hiểu Lầm Chết Người Về "Mua Những Gì Bạn Biết"',
        content: `Hàng ngàn nhà đầu tư đã hiểu sai và bóp méo quy tắc này dẫn đến thua lỗ nặng nề.

"Mua những gì bạn biết" KHÔNG có nghĩa là: Mua cổ phiếu của cửa hàng vì bạn thích mua sắm ở đó. Mua cổ phiếu vì bạn thích sản phẩm của họ. Mua mà không cần đọc báo cáo tài chính.

Quy tắc đúng là 2 bước: Bước 1 — tìm thấy công ty đầy hứa hẹn từ cuộc sống hàng ngày (bãi đỗ xe đông, sản phẩm gây nghiện, bạn bè hỏi tên thương hiệu). Bước 2 BẮT BUỘC — làm bài tập về nhà: đọc BCTC, đánh giá giá trị kinh doanh, kiểm tra điều kiện tài chính, triển vọng thu nhập và vị thế cạnh tranh.

Lynch nói thẳng: "Người ta dành nhiều thời gian chọn tivi hơn chọn cổ phiếu."`,
    },
    {
        type: 'steps',
        title: '📊 6 Loại Cổ Phiếu Theo Lynch — Biết Loại Để Biết Kỳ Vọng',
        content: '',
        items: [
            {
                icon: '🐢',
                title: 'Slow Growers — Tăng Trưởng Chậm',
                highlight: 'Tăng ngang GDP, sống bằng cổ tức',
                body: 'Công ty lớn, lâu đời, đã bão hòa — điện, nước, viễn thông. Tăng trưởng lợi nhuận ngang GDP quốc gia. Lynch thường tránh, trừ khi định giá cực rẻ. Mục đích đầu tư chính: cổ tức đều đặn và cao, không phải tăng giá.',
            },
            {
                icon: '🗿',
                title: 'Stalwarts — Cổ Phiếu Trụ Cột',
                highlight: '10-12%/năm, tấm đệm bảo vệ danh mục',
                body: 'Công ty khổng lồ, vững chắc: Coca-Cola, P&G, Vinamilk. Vẫn tăng 10-12%/năm. Vai trò quan trọng: "tấm đệm" bảo vệ danh mục trong suy thoái vì giá rất khó giảm sâu. Không kỳ vọng tenbagger nhưng ngủ ngon.',
            },
            {
                icon: '🚀',
                title: 'Fast Growers — Nhóm Yêu Thích Nhất Của Lynch',
                highlight: '20-25%+/năm — nơi sinh ra Tenbaggers',
                body: 'Doanh nghiệp nhỏ, năng động, tăng trưởng 20-25%/năm. Đây là nơi tạo ra 10-bagger (tăng 10 lần). Lynch tìm fast growers chưa bị Wall Street chú ý — còn nhiều "runway" để mở rộng (số cửa hàng, số thị trường). Cảnh báo: nếu đà tăng trưởng dừng lại, giá sụp đổ nhanh.',
            },
            {
                icon: '🔄',
                title: 'Cyclicals — Cổ Phiếu Chu Kỳ',
                highlight: 'Timing là tất cả — sai thời điểm = thảm họa',
                body: 'Lợi nhuận tăng giảm nhịp nhàng theo chu kỳ kinh tế: ô tô, thép, hàng không, hóa chất. Cực kỳ nguy hiểm nếu chọn sai thời điểm. Nghịch lý: mua khi P/E cao (đáy chu kỳ/doanh nghiệp lỗ), bán khi P/E thấp (đỉnh chu kỳ/doanh nghiệp lãi đỉnh). Hoàn toàn ngược với Stalwarts.',
            },
            {
                icon: '🔃',
                title: 'Turnarounds — Cổ Phiếu Đảo Chiều',
                highlight: 'Phục hồi phi thường nếu tái cơ cấu thành công',
                body: 'Công ty đang trên bờ vực phá sản, khủng hoảng tồi tệ nhưng có kế hoạch tái cơ cấu. Nếu thành công, giá phục hồi với tốc độ phi thường và ĐỘC LẬP với thị trường chung. Lynch tìm turnaround khi nợ giảm + tiền mặt tăng + lãnh đạo mới rõ ràng. Tại VN: DNNN đang thoái vốn hoặc tái cơ cấu.',
            },
            {
                icon: '💰',
                title: 'Asset Plays — Tài Sản Ngầm Chưa Được Nhận Ra',
                highlight: 'Local Knowledge phát huy tốt nhất ở đây',
                body: 'Công ty đang ngồi trên đống tài sản quý (bất động sản, tiền mặt, mỏ quặng, bản quyền) nhưng Phố Wall chưa nhận ra — vốn hóa thị trường thấp hơn nhiều so với giá trị tài sản thực. "Local knowledge" phát huy tốt nhất ở đây: bạn biết mảnh đất đó ở đâu, giá trị thực là bao nhiêu, trước cả analyst xa lạ.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Người ta dành nhiều thời gian chọn tủ lạnh hơn chọn cổ phiếu. Đây là điều kỳ lạ nhất tôi biết về thị trường chứng khoán."',
        author: 'Peter Lynch',
        source: 'One Up on Wall Street',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình Lynch Tại TTCK Việt Nam',
        content: [
            'Bước 1 — Quan sát hàng ngày: Sản phẩm nào bạn hoặc người xung quanh mua lại liên tục? Cửa hàng/nhà hàng nào luôn đông đúc vào giờ cao điểm? Dịch vụ nào bạn kể cho bạn bè nghe?',
            'Bước 2 — Xác định công ty niêm yết: Tìm trên HNX/HOSE/UPCOM công ty sở hữu thương hiệu/sản phẩm bạn phát hiện. Nhiều thương hiệu VN quen thuộc có công ty mẹ niêm yết',
            'Bước 3 — Phân loại 6 nhóm: Fast Grower hay Stalwart? Đang ở chu kỳ nào? Có tài sản ẩn không? Kỳ vọng lợi nhuận và chiến lược thoát phải khác nhau cho mỗi nhóm',
            'Bước 4 — Làm bài tập bắt buộc: Đọc BCTC 3-5 năm gần nhất. Gross Margin > 40%? EPS tăng đều? Nợ tăng hay tiền mặt tăng? PEG < 1.0 cho Fast Growers',
            'Bước 5 — Câu chuyện đầu tư (The Story): Lynch yêu cầu mỗi cổ phiếu phải có một "the story" rõ ràng trong vòng 2 phút: "Tôi mua vì..., tôi sẽ bán khi..." — nếu không giải thích được, đừng mua',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ "Mua Những Gì Bạn Biết" Là Điểm KHỞI ĐẦU, Không Phải Điểm KẾT THÚC',
        content: 'Lynch từng thấy mọi người mua cổ phiếu dầu mỏ vì họ thích lái xe, mua cổ phiếu hãng bay vì thích đi du lịch, mua cổ phiếu casino vì thích đánh bạc. Đây là cách hiểu SAI HOÀN TOÀN. Tri thức thông thường chỉ giúp bạn tìm ra ứng viên tiềm năng — sau đó phải là phân tích tài chính nghiêm túc. Một sản phẩm tuyệt vời không đồng nghĩa với một cổ phiếu tốt. Starbucks có cà phê ngon nhất nhưng không phải lúc nào cũng là cổ phiếu tốt nhất để mua.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ',
        content: [
            'Local Knowledge = lợi thế thực của nhà đầu tư cá nhân — dùng trải nghiệm hàng ngày để phát hiện ứng viên',
            '"Mua những gì bạn biết" = Bước 1 (quan sát) + Bước 2 (phân tích BCTC). Thiếu Bước 2 = cờ bạc',
            '6 loại: Slow Grower (cổ tức) → Stalwart (phòng thủ) → Fast Grower (tenbagger) → Cyclical (timing) → Turnaround (tái cơ cấu) → Asset Play (tài sản ẩn)',
            'Fast Growers: kỳ vọng cao nhất, rủi ro cao nhất. Cyclicals: ngược với P/E thông thường',
            'The Story: mỗi cổ phiếu phải có câu chuyện 2 phút rõ ràng — không giải thích được, không mua',
        ],
    },
]
