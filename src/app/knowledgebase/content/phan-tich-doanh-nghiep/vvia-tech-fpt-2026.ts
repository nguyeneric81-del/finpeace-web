import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Định giá Fair Value (DCF):** 111,000 VNĐ\n\n**Đánh giá tổng quan:** 🟢 **Cơ Hội Tích Sản** — Thị trường đã "trừng phạt" FPT quá tay. Từ mốc 130,000đ (khi bài viết gốc cảnh báo định giá quá cao), cổ phiếu đã rơi hơn **40%** về vùng 76,000đ — thấp hơn Fair Value tới gần **46%**. Đây chính là lúc triết lý Graham lên tiếng: khi Đám đông hoảng loạn, người kiên nhẫn bắt đầu gom.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): Pháo Đài Tiền Mặt — Bây Giờ Mới Là Lúc Phát Huy',
        content: '- **Tiền Mặt = 26.00 Tỷ VNĐ:** Khi giá cổ phiếu còn 130.00đ, tấm khiên tiền mặt này chỉ là "bảo hiểm." Nay khi giá rơi về 76.00đ, nó trở thành **vũ khí chiến lược**: FPT có đủ nguồn lực để đầu tư vào AI, Datacenter và chuyển đổi mô hình kinh doanh mà **không cần huy động vốn thêm** — điều mà nhiều công ty cùng ngành không làm được.\n- **Thanh khoản (Current Ratio 1.35 & D/E 0.58):** Nền tảng tài chính vẫn vững. Đây KHÔNG phải trường hợp "công ty gặp khó khăn tài chính" — mà là thị trường định giá lại (re-rating) toàn bộ ngành Tech.'
    },
    {
        type: 'key-insight',
        title: '📉 Tầng 2 (Con Hào - Buffett & Greenblatt): Rủi Ro Vẫn Còn, Nhưng Giá Đã Phản Ánh',
        content: '- **Tăng trưởng Global IT:** AI như Copilot vẫn đang bào mòn Pricing Power của Outsourcing truyền thống. Biên lợi gộp co hẹp từ 38.5% về 31%. Tốc độ tăng trưởng doanh thu thực tế hạ từ 28% xuống **10%/năm**. Những rủi ro này là thật.\n- **NHƯNG:** Ở mức giá 76.00đ, thị trường đang "wipe sạch" mọi kỳ vọng tăng trưởng. Đây là mức giá cho kịch bản FPT **không tăng trưởng gì cả** — tức là Downside đã được price-in gần hết. ROIC 16.5% vẫn cao hơn Cost of Capital (~10-12%), nghĩa là FPT vẫn đang tạo giá trị cho cổ đông.\n- **CAPEX vào AI/Datacenter:** Khoản đầu tư hàng trăm triệu USD vào Nvidia được thị trường coi là "đốt tiền." Nhưng nếu FPT chuyển đổi thành công từ "thợ code giá rẻ" sang "AI Solutions Provider," đây sẽ là khoản đầu tư định hình lại Con Hào trong 3-5 năm tới.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'ValuationSlider',
        widgetProps: {
            ticker: 'FPT',
            basePrice: 111000,
            baseGrowth: 10,
            multiplier: 1600,
            currentPrice: 76100
        }
    },
    {
        type: 'key-insight',
        title: '🔄 Tầng 3 (Kịch Bản): Từ "Cảnh Giác" Sang "Quan Sát Tích Cực"',
        content: '- **Kịch bản Bi quan (Growth 5%):** Fair Value ≈ 103.00đ → vẫn cao hơn giá hiện tại **35%**. Downside rất hạn chế.\n- **Kịch bản Cơ sở (Growth 10%):** Fair Value = 111.00đ → Margin of Safety **+46%**. Đây là vùng Graham gọi là "mua với giá 54 xu cho 1 đồng giá trị."\n- **Kịch bản Lạc quan (Growth 15%):** Fair Value ≈ 119.00đ → Upside tiềm năng **+56%**.\n- **Kết luận:** Cả 3 kịch bản đều cho thấy giá hiện tại **dưới Fair Value**. Rủi ro/lợi nhuận bất đối xứng rõ rệt — nghiêng về phía người mua.'
    },
    {
        type: 'warning',
        title: '🗣️ Tầng 4 (Stress Test): Bài Học Từ Cú Sập — VVIA Đã Cảnh Báo Đúng',
        content: '- **Nhìn lại:** Khi FPT ở mức 130.00đ, VVIA đã cảnh báo "Đám đông Say Rượu Lạc Quan" và Margin of Safety **-14.6%**. Thị trường sau đó giảm hơn 40%. Góc nhìn của Máy Tính đã đánh bại niềm kiêu hãnh của Đám đông.\n- **Bây giờ:** Giới phân tích đã cắt Target Price về vùng 90.00-100.00đ. Tâm lý thị trường chuyển sang bi quan cùng cực. Nhưng lịch sử cho thấy: **khi tất cả mọi người đều sợ, đó thường là đáy.**\n- **Góc nhìn VVIA:** FPT ở mức 76.00đ là cơ hội mà Value Investor chờ đợi — nhưng cần kiên nhẫn. Khuyến nghị **tích lũy từng phần**, không all-in, và đặt kỳ vọng 12-18 tháng. Kỷ luật là vũ khí duy nhất chống lại nỗi sợ.'
    }
]
