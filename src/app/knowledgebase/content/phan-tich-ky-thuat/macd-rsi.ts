// Article content: phan-tich-ky-thuat / macd-rsi
// "MACD & RSI — Bộ Đôi Chỉ Báo Momentum Cổ Điển"
// Ref: Technical Analysis of the Financial Markets (Murphy), Wilder's New Concepts

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `MACD và RSI là hai chỉ báo kỹ thuật được sử dụng nhiều nhất thế giới — không phải vì chúng thần kỳ, mà vì chúng giải quyết được hai câu hỏi cốt lõi mà mọi trader đều cần trả lời:

**RSI hỏi:** "Thị trường đang mua quá nhiều hay bán quá nhiều?"
**MACD hỏi:** "Đà (Momentum) của xu hướng đang tăng hay đang yếu dần?"

Hiểu đúng hai chỉ báo này — và quan trọng hơn, hiểu đúng **giới hạn** của chúng — chính là nền tảng để không bị chúng lừa.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: RSI — "Nhiệt Kế" Đo Sức Nóng Của Thị Trường',
        content: `**RSI (Relative Strength Index)** do J. Welles Wilder phát triển năm 1978. Nó đo tốc độ và biên độ của các biến động giá, dao động trong khoảng 0 đến 100.

**Đọc RSI theo 3 vùng:**

• **Vùng Overbought (Mua quá mức) — RSI > 70:** Giá đã tăng nhanh và mạnh, áp lực chốt lời có thể xuất hiện. Không có nghĩa là bán ngay — cổ phiếu trong uptrend mạnh có thể duy trì RSI > 70 trong nhiều tuần.

• **Vùng Oversold (Bán quá mức) — RSI < 30:** Giá đã giảm nhanh và mạnh, khả năng bật phục xuất hiện. Không có nghĩa là mua ngay — downtrend mạnh có thể giữ RSI < 30 kéo dài.

• **Vùng Trung tính (30–70):** Xu hướng bình thường, RSI không đưa ra tín hiệu rõ ràng.

**Sai lầm phổ biến nhất:** Bán ngay khi RSI > 70 hoặc mua ngay khi RSI < 30. Đây là cách mất tiền nhanh nhất với RSI. Cổ phiếu "Overbought" có thể tiếp tục tăng thêm 50% trong một xu hướng thực sự mạnh.`,
    },
    {
        type: 'key-insight',
        title: '💡 RSI Divergence — Tín Hiệu Đảo Chiều Mạnh Nhất',
        content: 'Khi giá lập đỉnh mới cao hơn (Higher High) nhưng RSI lại tạo đỉnh thấp hơn (Lower High) → Bearish Divergence: momentum đang suy yếu dù giá còn tăng. Ngược lại: giá lập đáy mới thấp hơn nhưng RSI tạo đáy cao hơn → Bullish Divergence: lực bán đang cạn. Divergence không phải tín hiệu vào lệnh — đó là cảnh báo "hãy chú ý".',
    },
    {
        type: 'concept',
        title: '📖 Phần 2: MACD — "Địa Chấn Kế" Đo Động Lực Xu Hướng',
        content: `**MACD (Moving Average Convergence Divergence)** do Gerald Appel phát triển, gồm 3 thành phần:

• **MACD Line** = EMA(12) – EMA(26): khoảng cách giữa hai đường trung bình nhanh và chậm.
• **Signal Line** = EMA(9) của MACD Line: đường tín hiệu làm mượt MACD.
• **Histogram** = MACD Line – Signal Line: thanh cột biểu thị khoảng cách giữa hai đường.

**3 cách đọc MACD:**

**① Crossover (Giao cắt):** MACD cắt lên trên Signal Line → tín hiệu mua. MACD cắt xuống dưới Signal Line → tín hiệu bán. *Nhược điểm: crossover thường đến muộn, sau khi giá đã di chuyển đáng kể.*

**② Zero Line Cross:** MACD cắt lên trên đường 0 → xu hướng tăng xác nhận. Cắt xuống 0 → xu hướng giảm. Đây là tín hiệu xu hướng dài hạn hơn crossover.

**③ Histogram Divergence:** Histogram đang thu hẹp dù xu hướng vẫn tiếp tục → momentum đang yếu dần, cảnh báo sớm trước khi crossover xảy ra.`,
    },
    {
        type: 'steps',
        title: '🎯 Kết Hợp MACD + RSI + S/R: Bộ Lọc 3 Tầng',
        content: 'Dùng từng chỉ báo riêng lẻ thường sinh ra nhiều tín hiệu nhiễu. Kết hợp 3 tầng lọc sẽ tăng độ chính xác đáng kể:',
        items: [
            {
                icon: '🗺️',
                title: 'Tầng 1: Xác định xu hướng bằng S/R & Price Action',
                highlight: 'Context trước, indicator sau',
                body: 'Xác định xu hướng lớn (uptrend/downtrend/sideway) trước. Chỉ tìm tín hiệu MUA trong uptrend, tín hiệu BÁN trong downtrend. MACD và RSI không nên dùng để "chống lại" xu hướng chính.',
            },
            {
                icon: '📊',
                title: 'Tầng 2: MACD xác nhận momentum',
                highlight: 'Momentum đúng chiều',
                body: 'Trong uptrend: chờ MACD Histogram đang mở rộng (tăng) = momentum đang tăng. Crossover MACD cắt lên Signal Line từ vùng âm là tín hiệu chất lượng nhất.',
            },
            {
                icon: '🌡️',
                title: 'Tầng 3: RSI xác nhận không trong vùng cực đoan',
                highlight: 'Tránh mua đỉnh, bán đáy',
                body: 'Trong uptrend: lý tưởng là mua khi RSI kéo về vùng 40-50 (điều chỉnh), không mua khi RSI > 70 (đã overbought). Kết hợp RSI Bullish Divergence tại vùng hỗ trợ = setup chất lượng cao nhất.',
            },
            {
                icon: '✅',
                title: 'Entry: Khi cả 3 tầng cùng chiều',
                highlight: 'High probability setup',
                body: 'Upstream xác nhận (S/R) + MACD momentum thuận chiều + RSI không cực đoan → đây là điểm vào lệnh có xác suất cao nhất. Stop-loss đặt dưới S/R gần nhất.',
            },
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Bẫy Phổ Biến: Over-reliance on Indicators',
        content: 'MACD và RSI là các chỉ báo trễ (lagging indicators) — chúng tính toán dựa trên dữ liệu giá đã qua. Trong thị trường sideway (đi ngang), chúng sinh ra vô số tín hiệu giả. Không bao giờ dùng MACD hoặc RSI làm tín hiệu duy nhất để vào lệnh. Luôn kết hợp với Price Action, S/R và Volume để lọc nhiễu.',
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
            'RSI (0-100): >70 = overbought, <30 = oversold — nhưng không phải tín hiệu mua/bán ngay lập tức',
            'RSI Divergence (giá tăng/RSI giảm) = cảnh báo momentum suy yếu, tín hiệu đảo chiều sớm nhất',
            'MACD = EMA12 – EMA26 | Signal = EMA9 của MACD | Histogram = khoảng cách hai đường',
            'MACD Crossover (muộn nhưng an toàn) | Histogram thu hẹp (sớm hơn, nhưng nhiều nhiễu hơn)',
            'Bộ lọc 3 tầng: S/R xác định context → MACD xác nhận momentum → RSI tránh vùng cực đoan',
            'MACD & RSI là lagging indicators — luôn kết hợp với Price Action và Volume, không dùng riêng lẻ',
        ],
    },
]
