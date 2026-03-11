// Article content: phan-tich-ky-thuat / macd-rsi
// "MACD & RSI — Bộ Đôi Chỉ Báo Momentum Cổ Điển"
// Ref: Technical Analysis of the Financial Markets (Murphy), Wilder's New Concepts

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `RSI và MACD là hai chỉ báo kỹ thuật được sử dụng nhiều nhất thế giới. Chúng trả lời hai câu hỏi cốt lõi:

**RSI hỏi:** "Thị trường đang mua quá nhiều hay bán quá nhiều — và momentum có đang phân kỳ với giá không?"
**MACD hỏi:** "Xu hướng đang tăng tốc hay giảm tốc — và đường nhanh đang vượt đường chậm chưa?"

Dùng riêng lẻ, chúng thường cho tín hiệu nhiễu. Kết hợp đúng cách trong bộ lọc 3 tầng, chúng trở thành công cụ xác nhận đáng tin cậy nhất trong phân tích kỹ thuật.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: RSI — Bộ Đo Sức Nóng Thị Trường',
        content: `**RSI (Relative Strength Index)** do J. Welles Wilder phát triển, dao động từ 0 đến 100, khung 14 ngày hoạt động tốt nhất.

**Cách đọc cơ bản theo 3 vùng:**
• **RSI > 70 — Overbought (Quá mua):** Thị trường có thể bị kéo ngược hoặc bước vào giai đoạn củng cố đi ngang.
• **RSI < 30 — Oversold (Quá bán):** Phản ánh tiềm năng phục hồi giá lên.
• **RSI 30–70 — Vùng trung tính:** Không có tín hiệu cực đoan.

**⚠️ Bẫy trong xu hướng mạnh — Dịch chuyển ngưỡng:**
Sai lầm chết người là bán khống ngay khi RSI chạm 70. Trong bull market mạnh, RSI có thể nằm lỳ ở vùng overbought rất lâu. Khi đó phải điều chỉnh:
- **Bull market:** ngưỡng overbought = **80**, ngưỡng oversold thực sự = **40**
- **Bear market:** ngưỡng oversold = **20**, ngưỡng kháng cự (overbought) = **60**`,
    },
    {
        type: 'key-insight',
        title: '💡 Bí Mật RSI: Phân Kỳ (Divergence) — Tín Hiệu Mạnh Nhất',
        content: 'Phân kỳ tăng (Bullish): giá tạo đáy thấp hơn nhưng RSI (dưới 30) tạo đáy cao hơn → RSI cắt lên khỏi đỉnh trước = tín hiệu mua ngắn hạn đáng tin. Phân kỳ giảm (Bearish): giá tạo đỉnh cao hơn nhưng RSI (trên 70) tạo đỉnh thấp hơn = cảnh báo đảo chiều giảm. Đây là tín hiệu đáng tin nhất vì nó đo lường sự suy yếu momentum trước khi giá xác nhận.',
    },
    {
        type: 'concept',
        title: '📖 Phần 2: MACD — Bộ Đo Động Lực và Xu Hướng',
        content: `**MACD (Moving Average Convergence Divergence)** do Gerald Appel phát triển — kết hợp hệ thống giao cắt MA với đánh giá momentum.

**3 thành phần:**
• **MACD Line** = EMA(12) – EMA(26)
• **Signal Line** = EMA(9) của MACD Line
• **Histogram** = MACD Line – Signal Line (khoảng cách hai đường)

**Tín hiệu Crossover:**
• **Mua:** Đường nhanh cắt lên đường chậm — đặc biệt mạnh khi cả hai đang nằm dưới 0.
• **Bán:** Đường nhanh cắt xuống đường chậm từ phía trên đường 0.

**Histogram — Vũ khí cảnh báo SỚM hơn crossover:**
MACD-Histogram cho tín hiệu thay đổi xu hướng sớm hơn cả hai đường MACD. Dấu hiệu: Histogram đang thu hẹp dần (dù giá còn tăng) = momentum đang yếu đi. Phân kỳ Histogram (giá đỉnh cao hơn nhưng Histogram đỉnh thấp hơn) = cảnh báo đảo chiều cực kỳ mạnh.

**Lưu ý chống nhiễu:** Không dùng RSI lẫn MACD lẫn Bollinger Bands cùng lúc — chúng đều đo momentum giá, gây trùng lặp. Hãy kết hợp **1 chỉ báo xu hướng (MACD)** với **1 chỉ báo dao động (RSI)**.`,
    },
    {
        type: 'steps',
        title: '🎯 Bộ Lọc 3 Tầng: Cách Tránh Tín Hiệu Nhiễu',
        content: 'Điểm yếu lớn nhất của MACD và RSI: chúng có độ trễ và cho tín hiệu sai khi dùng riêng lẻ. Bộ lọc 3 tầng này giúp bạn chỉ bóp cò khi cả 3 yếu tố hội tụ:',
        items: [
            {
                icon: '🗓️',
                title: 'Tầng 1: Lọc xu hướng lớn bằng khung thời gian Tuần',
                highlight: 'Weekly > Daily (luôn luôn)',
                body: 'Tín hiệu biểu đồ tuần luôn có giá trị cao hơn biểu đồ ngày. Dùng MACD tuần để xác định xu hướng chủ đạo: MACD tuần đang hướng lên → chỉ tìm lệnh MUA trên biểu đồ ngày. MACD tuần đang xuống → chỉ tìm lệnh BÁN. Không bao giờ dùng RSI để xác định xu hướng — đó là việc của MACD hoặc MA.',
            },
            {
                icon: '🌡️',
                title: 'Tầng 2: Tìm điểm vào bằng RSI tại vùng cực đoan',
                highlight: 'RSI xác nhận sự kiệt sức của phe đối lập',
                body: 'Sau khi đã có xu hướng lớn từ MACD tuần, dùng RSI để tìm điểm vào lệnh rủi ro thấp nhất. Trong uptrend: chờ RSI kéo về 40-50 (điều chỉnh) thay vì mua khi RSI > 70. Tín hiệu chất lượng cao nhất: RSI Bullish Divergence tại vùng oversold.',
            },
            {
                icon: '🗺️',
                title: 'Tầng 3: Hội tụ tại vùng S/R — "Điểm bóp cò"',
                highlight: 'Confluence = xác suất cao nhất',
                body: 'Chỉ báo chỉ có nghĩa khi hội tụ với vùng S/R vật lý. Case study: giá chạm kháng cự tĩnh + RSI > 70 + RSI Bearish Divergence = tín hiệu bán xác suất rất cao. Ngược lại: giá chạm hỗ trợ + RSI < 30 + MACD cắt lên = setup mua chất lượng cao.',
            },
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Đừng Giao Dịch Chỉ Vì RSI Cắt Lên 30 hay MACD Giao Cắt',
        content: 'MACD và RSI là lagging indicators. Trong sideway market, chúng sinh ra vô số tín hiệu nhiễu. Nguyên tắc: chờ giá về vùng S/R → kiểm tra MACD tuần có đồng thuận không → RSI có cho thấy kiệt sức của phe đối lập (Divergence / Oversold) không. Sự hội tụ của 3 yếu tố = điểm bóp cò chính xác. Thiếu một yếu tố → đứng ngoài chờ đợi.',
    },
    {
        type: 'quote',
        content: '"Không có chỉ báo nào là hoàn hảo. Một chỉ báo cho bạn biết điều gì đó về thị trường — nhưng không bao giờ là toàn bộ sự thật. Nhiệm vụ của bạn là ghép nhiều mảnh bằng chứng lại với nhau."',
        author: 'John Murphy',
        source: 'Technical Analysis of the Financial Markets',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'RSI (14 ngày): >70 = overbought, <30 = oversold — điều chỉnh ngưỡng theo sức mạnh xu hướng (Bull: 80/40; Bear: 60/20)',
            'RSI Divergence = tín hiệu mạnh nhất: giá tăng + RSI giảm → sắp đảo chiều giảm (và ngược lại)',
            'MACD Crossover (chậm nhưng an toàn) | MACD Histogram thu hẹp (sớm hơn, nhưng nhiều nhiễu hơn)',
            'Không dùng RSI xác định xu hướng — đó là nhiệm vụ của MACD hoặc MA; không chồng nhiều indicator cùng loại',
            'Bộ lọc 3 tầng: MACD tuần (xu hướng lớn) → RSI ngày (điểm vào) → S/R hội tụ (bóp cò)',
            'Tín hiệu xác suất cao nhất: giá tại vùng S/R + RSI cực đoan/divergence + MACD đồng chiều xu hướng tuần',
        ],
    },
]
