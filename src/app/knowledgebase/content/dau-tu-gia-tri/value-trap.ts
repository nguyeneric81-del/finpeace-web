// Article content for: dau-tu-gia-tri / value-trap
// Bẫy Giá Trị (Value Trap): Rẻ Không Có Nghĩa Là Tốt

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Bạn tìm thấy một cổ phiếu P/E chỉ 5x trong khi ngành trung bình 15x. Bảng cân đối kế toán sạch. Cổ tức đều đặn. Mọi thứ trông rất hấp dẫn.

Bạn mua vào. Và chờ đợi.

Một năm sau, P/E vẫn là 5x — nhưng earnings đã giảm 30%. Giờ P/E thực là 7x, và cổ phiếu đã giảm thêm 40%.

Bạn vừa rơi vào "Value Trap" — bẫy giá trị. Một trong những cái bẫy xảo quyệt nhất trên thị trường chứng khoán, bởi vì bề ngoài nó trông giống hệt như một cơ hội đầu tư giá trị thực sự.`,
    },
    {
        type: 'key-insight',
        title: '💡 Value Trap vs Value Opportunity',
        content: 'Value Trap: cổ phiếu rẻ vì doanh nghiệp đang xấu đi thực sự, và sẽ tiếp tục xấu. Value Opportunity: cổ phiếu rẻ vì thị trường phản ứng quá mức với tin xấu tạm thời, trong khi nền tảng doanh nghiệp vẫn tốt. Nhìn bề ngoài, hai trường hợp này có thể giống hệt nhau về con số.',
    },
    {
        type: 'steps',
        title: '🚨 8 Dấu Hiệu Nhận Biết Value Trap',
        content: 'Kiểm tra trước khi mua bất kỳ cổ phiếu "rẻ" nào:',
        items: [
            {
                icon: '1️⃣',
                title: 'Ngành đang bị Disruption Cấu Trúc',
                body: 'Cổ phiếu báo in khi internet xuất hiện, cổ phiếu taxi khi Grab ra mắt — rẻ vì thế giới đang thay đổi. Không có "phục hồi" vì mô hình kinh doanh cơ bản không còn viable.',
                highlight: 'Hỏi: "Ngành này đang bị AI, internet, hoặc regulator thay thế?"',
            },
            {
                icon: '2️⃣',
                title: 'Doanh Thu Giảm Liên Tục Nhiều Năm',
                body: 'Lợi nhuận tạm thời có thể thấp vì chu kỳ kinh tế. Nhưng doanh thu liên tục giảm nhiều năm thường là dấu hiệu loss of market share hoặc shrinking market.',
                highlight: 'Check: Revenue trend 5 năm liên tiếp, không chỉ năm gần nhất',
            },
            {
                icon: '3️⃣',
                title: 'Không Có Moat (Lợi Thế Cạnh Tranh)',
                body: 'Sản phẩm giống hệt đối thủ, không có switching cost, không có brand, không có network effect → cạnh tranh bằng giá → margin sẽ tiếp tục bị nén.',
                highlight: 'Hỏi: "Tại sao khách hàng sẽ KHÔNG chuyển sang đối thủ rẻ hơn?"',
            },
            {
                icon: '4️⃣',
                title: 'FCF Âm Trong Khi Net Income Dương',
                body: 'Lợi nhuận báo cáo tốt nhưng không có tiền mặt thực → có thể là kế toán window dressing, hoặc vốn lưu động đang bị nuốt dần (hàng tồn kho tăng, phải thu tăng).',
                highlight: 'Rule: FCF/Net Income < 50% liên tục → cờ đỏ, cần điều tra thêm',
            },
            {
                icon: '5️⃣',
                title: 'Nợ Vay Cao + Lãi Suất Tăng',
                body: 'Doanh nghiệp có thể tồn tại trong môi trường lãi suất thấp nhờ đòn bẩy. Nhưng khi lãi suất tăng, chi phí tài chính bóp chết lợi nhuận. "Ai đang bơi không mặc quần bơi sẽ lộ khi thủy triều rút" (Buffett).',
                highlight: 'Check: Nợ/EBITDA > 4x + môi trường lãi suất cao = nguy hiểm',
            },
            {
                icon: '6️⃣',
                title: 'Ban Quản Lý Bán Ròng Cổ Phiếu',
                body: 'Insider selling không luôn xấu (có thể cần tiền cá nhân). Nhưng CEO + CFO + Board cùng bán ròng liên tục 6-12 tháng là dấu hiệu họ không tin vào tương lai công ty.',
                highlight: 'Tra cứu: Giao dịch nội bộ trên HOSE/HNX — bên mua hay bên bán nhiều hơn?',
            },
            {
                icon: '7️⃣',
                title: 'Cổ Tức Từ Tiền Vay, Không Phải FCF',
                body: 'Cổ tức cao hấp dẫn nhà đầu tư, nhưng nếu FCF không đủ trả cổ tức → công ty đang vay tiền để trả cổ tức → không bền vững. Cắt cổ tức sẽ là cú sốc kép: mất thu nhập + giá giảm mạnh.',
                highlight: 'Check: Cổ tức/FCF > 100% = dấu hiệu đáng lo',
            },
            {
                icon: '8️⃣',
                title: '"Rẻ" Nhưng Đã Rẻ Từ Lâu',
                body: 'Nếu cổ phiếu trade ở P/E thấp liên tục 3-5 năm, có thể thị trường hiểu vấn đề hơn bạn. "The market can stay irrational longer than you can stay solvent" — nhưng đôi khi thị trường đúng.',
                highlight: 'Hỏi: "Tại sao không ai trong số các nhà đầu tư thông minh mua cổ phiếu này?"',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Mua một công ty tuyệt vời với giá hợp lý tốt hơn nhiều so với mua một công ty bình thường với giá tuyệt vời."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Letter',
    },
    {
        type: 'concept',
        title: '🔍 Phân Biệt: Bẫy Giá Trị vs Cơ Hội Thực Sự',
        content: `**Cơ hội giá trị thực:**
- Ngành vẫn có tương lai (không bị disrupt cấu trúc)
- Vấn đề là tạm thời: lợi nhuận thấp vì chi phí one-time, chu kỳ ngành xuống
- FCF vẫn dương, ban quản lý đang mua ròng cổ phiếu
- Có catalyst rõ ràng để giá phục hồi trong 1-2 năm

**Bẫy giá trị:**
- Ngành đang thu hẹp hoặc bị disrupt
- Doanh thu giảm liên tục, market share mất dần
- FCF âm, nợ cao, ban quản lý bán ròng
- "Rẻ" từ năm này sang năm khác mà không có catalyst`,
    },
    {
        type: 'checklist',
        title: '✅ 3 Câu Hỏi Kiểm Tra Trước Khi Mua "Cổ Phiếu Rẻ"',
        content: [
            '"Tại sao cổ phiếu này rẻ?" — Phân tích kỹ lý do, không tự thuyết phục mình bằng confirmation bias',
            '"Ngành này có tương lai 5-10 năm nữa không?" — Nếu đang bị disrupt → không thể là value opportunity',
            '"FCF đang tốt không? Ban quản lý đang mua hay bán ròng?" — Đây là hai chỉ báo thực tế nhất',
        ],
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Value Trap: rẻ vì doanh nghiệp sẽ tiếp tục xấu đi. Value Opportunity: rẻ vì vấn đề tạm thời',
            '8 dấu hiệu nhận biết: ngành bị disrupt, doanh thu giảm liên tục, không có moat, FCF âm, nợ cao, insider bán ròng, cổ tức từ tiền vay, rẻ từ lâu',
            'Buffett: "Doanh nghiệp tuyệt vời giá hợp lý > doanh nghiệp bình thường giá siêu rẻ"',
            'Bước tiếp theo: Kết hợp với bài "Moat" để biết cách nhận diện doanh nghiệp tốt thực sự',
        ],
    },
]
