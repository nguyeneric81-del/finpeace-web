// Article content: phan-tich-co-ban / bien-loi-nhuan
// "Biên Lợi Nhuận: Chìa Khóa Tìm Công Ty Kiếm Tiền Quá Dễ"
// Ref: The Warren Buffett Way, Common Stocks and Uncommon Profits (Fisher)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Khi bạn nhìn vào hai công ty cùng ngành, cùng doanh thu 1,000 tỷ đồng — một công ty lãi 300 tỷ, một công ty lãi 50 tỷ. Sự chênh lệch 250 tỷ đó đến từ đâu? Và quan trọng hơn: liệu nó có duy trì được không?

Đây là câu hỏi mà biên lợi nhuận (profit margin) đang trả lời. Không phải một con số đơn lẻ — mà là ba lớp, mỗi lớp tiết lộ một bí mật khác nhau về sức khỏe thực sự của doanh nghiệp.`,
    },
    {
        type: 'key-insight',
        title: '💡 Chìa Khóa Nhất Quán',
        content: 'Cả Buffett lẫn Fisher đều đồng ý: con số của một năm đơn lẻ không có ý nghĩa gì cả. Chỉ những công ty duy trì biên lợi nhuận cao vững chắc qua hàng thập kỷ mới thực sự "kiếm tiền quá dễ" nhờ độc quyền thương hiệu hoặc lợi thế chi phí thấp. Nhất quán mới là dấu hiệu của hào kinh tế thực sự.',
    },
    {
        type: 'steps',
        title: '📊 Ba Lớp Biên Lợi Nhuận',
        content: '',
        items: [
            {
                icon: '⚡',
                title: 'Biên Lợi Nhuận Gộp — Gross Margin',
                highlight: '≥ 40% theo Buffett',
                body: 'Lợi nhuận gộp / Doanh thu — đây là chỉ số ĐẦU TIÊN Buffett nhìn vào. Phản ánh QUYỀN LỰC ĐỊNH GIÁ: công ty có tự do bán giá cao hay bị ép giảm giá để cạnh tranh? Ngưỡng Buffett: ≥ 40% = có hào kinh tế. Coca-Cola 60%+, Moody\'s 73%, Microsoft 79%. Dưới 20% = cạnh tranh tàn khốc (United Airlines 14%, GM 21%).',
            },
            {
                icon: '🛡️',
                title: 'Biên Lợi Nhuận Hoạt Động — Operating Margin',
                highlight: 'Tấm đệm sinh tồn',
                body: 'Fisher coi đây là công cụ đo hiệu quả quản trị và khả năng sinh tồn. Khi chi phí tăng 2% trong khủng hoảng: công ty có Operating Margin 1% lập tức thua lỗ; công ty có 10% chỉ giảm 1/5 lợi nhuận, vẫn sống khỏe. Cảnh báo Buffett: R&D liên tục để theo kịp đối thủ = lợi thế mong manh. SG&A cần dưới 30% lợi nhuận gộp.',
            },
            {
                icon: '💎',
                title: 'Biên Lợi Nhuận Thuần — Net Margin',
                highlight: 'Quy tắc 20% của Buffett',
                body: 'Lợi nhuận sau khi trừ tất cả chi phí, thuế và lãi vay — đây là tiền THỰC SỰ chảy vào túi doanh nghiệp. Buffett: Net Margin > 20% = "mỏ vàng thực sự" (Moody\'s 31%, Coca-Cola 21%). Dưới 10% = ngành cạnh tranh khốc liệt (Southwest Airlines 7%, General Motors chỉ 3% ngay cả năm kinh doanh tốt).',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Biên lợi nhuận không cần phải ở mức cao không tưởng. Một công ty chỉ cần duy trì mức biên lớn hơn 2-3% so với đối thủ lớn nhất trong cùng ngành đã đủ để biến nó thành khoản đầu tư vô cùng giá trị."',
        author: 'Philip Fisher',
        source: 'Common Stocks and Uncommon Profits',
    },
    {
        type: 'checklist',
        title: '✅ 2 Kỹ Thuật Phân Tích Thực Chiến',
        content: [
            'Kỹ thuật 1 — Trend Analysis (Nhất Quán): Tải dữ liệu 5-10 năm Gross Margin và Net Margin trên CafeF/VCSC. Nếu biên lợi nhuận tăng đột ngột 1-2 năm rồi về lại mức cũ = chu kỳ kinh doanh, không phải lợi thế. Chỉ nhất quán cao qua thập kỷ mới là hào kinh tế thực sự',
            'Kỹ thuật 2 — Industry Comparison (So Sánh Ngành): KHÔNG so sánh phần mềm với bán lẻ. Chỉ so sánh trong cùng ngành với 3-5 đối thủ trực tiếp. Hơn đối thủ 2-3% margin đã là lợi thế quan trọng. Margin cao nhất ngành liên tục 5 năm = đang dẫn đầu về lợi thế cạnh tranh',
            'Áp dụng tại TTCK VN: Ngành thực phẩm (VNM, MSN, KDC) — benchmark Gross Margin 35-55%. Ngành bán lẻ (MWG, FRT, DGW) — Net Margin 2-5% là tốt. Ngành vật liệu xây dựng (HPG, HSG) — Gross Margin 15-25%, theo dõi chu kỳ thép',
            'Red flag cần tránh: SG&A chiếm > 30% Gross Profit liên tục = chi phí quản lý đang phình to. R&D chiếm phần lớn lợi nhuận nhưng sản phẩm chưa rõ ràng = uncertainty cao',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Biên Lợi Nhuận Gộp Cao Không Bảo Đảm Thành Công',
        content: 'Có thể có Gross Margin 70% nhưng vẫn thua lỗ nếu chi phí bán hàng & quản lý (SG&A) và R&D ăn hết phần lợi nhuận gộp. Các công ty công nghệ, dược phẩm thường có Gross Margin rất cao — nhưng phải liên tục đốt tiền R&D để duy trì lợi thế. Buffett cảnh báo: đây là hào kinh tế mong manh vì có thể bị phá vỡ bởi một đối thủ có công nghệ tốt hơn bất cứ lúc nào. Cần nhìn toàn bộ hành trình từ Gross → Operating → Net Margin để thấy "bao nhiêu tiền rò rỉ" ở mỗi tầng.',
    },
    {
        type: 'summary',
        title: '📋 Bảng Tóm Tắt Ngưỡng Buffett/Fisher',
        content: [
            'Gross Margin ≥ 40%: có khả năng có lợi thế cạnh tranh | < 20%: cạnh tranh tàn khốc, tránh xa',
            'Operating Margin cao: chịu được khủng hoảng và lạm phát; SG&A < 30% Gross Profit',
            'Net Margin > 20%: "mỏ vàng" theo Buffett | 10-20%: tốt | < 10%: ngành khó khăn',
            'Nhìn trend 5-10 năm + so sánh ngành: đây là công thức, không phải 1 con số đơn lẻ',
            'Bước tiếp theo: Bài "Định Giá Cổ Phiếu" — biết công ty tốt rồi, giờ học mua ở giá nào',
        ],
    },
]
