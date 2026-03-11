// Article content: phan-tich-ky-thuat / nen-nhat
// "Nến Nhật: Ngôn Ngữ Cảm Xúc Của Thị Trường"
// Ref: Japanese Candlestick Charting Techniques (Steve Nison, 1991)
// CandleShape: { color, bodyY (top), bodyH, shadowTop (length), shadowBot (length) }
// SVG H=90: shadowTop starts at y=4, body starts at bodyY, shadow continues below body

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Năm 1750, thương nhân Munehisa Homma phát hiện giá gạo không chỉ phụ thuộc vào cung cầu — mà còn bị chi phối bởi CẢM XÚC của người mua bán. Ông bắt đầu vẽ các cây nến để "trực quan hóa" tâm lý thị trường.

240 năm sau, Steve Nison mang phương pháp này sang phương Tây và thay đổi cả thế giới giao dịch. Mỗi cây nến là một câu chuyện — ta chỉ cần học đọc.`,
    },
    {
        type: 'key-insight',
        title: '💡 Nguyên Tắc Quan Trọng Nhất',
        content: 'Không có mô hình nến nào thắng 100%. Nến Nhật chỉ có ý nghĩa khi đặt trong ngữ cảnh: (1) xu hướng lớn, (2) vùng Hỗ trợ/Kháng cự, (3) Volume xác nhận. Thiếu 1 trong 3 = tín hiệu yếu.',
    },
    {
        type: 'concept',
        title: '📖 Cấu Phẫu Một Cây Nến — Tâm Lý Đằng Sau Mức Giá',
        content: `Mỗi cây nến chứa 4 thông tin: Mở cửa (O), Đóng cửa (C), Cao nhất (H), Thấp nhất (L) trong một phiên.

Thân nến (Real Body): khoảng cách O-C — "kết quả" cuộc chiến của phiên. Thân xanh (C > O): phe MUA thắng. Thân đỏ (C < O): phe BÁN thắng. Thân càng dài, lực càng mạnh.

Bóng nến (Shadow/Wick): những đường mảnh trên/dưới thân — phần bị kéo lại bởi phe đối lập. Bóng dưới dài = phe bán đẩy xuống nhưng phe mua kéo ngược lại. Bóng trên dài = phe mua đẩy lên nhưng phe bán kéo ngược lại.

Giá ĐÓNG CỬA là quan trọng nhất — kết quả cuối cùng của toàn bộ cuộc chiến trong ngày.`,
    },
    {
        type: 'candle-patterns',
        title: '🕯️ Nhóm 1: Nến Đơn (Single Candlestick Patterns)',
        content: '',
        patterns: [
            {
                name: 'Hammer\n(Cây Búa)',
                signal: 'bullish',
                desc: 'Sau đà giảm → tạo đáy. Bóng dưới ≥ 2x thân',
                candles: [{ color: 'green', bodyY: 18, bodyH: 14, shadowTop: 0, shadowBot: 64 }],
            },
            {
                name: 'Hanging Man\n(Người Treo Cổ)',
                signal: 'bearish',
                desc: 'Sau đà tăng → cảnh báo đỉnh. Hình y hệt Hammer',
                candles: [{ color: 'red', bodyY: 18, bodyH: 14, shadowTop: 0, shadowBot: 64 }],
            },
            {
                name: 'Shooting Star\n(Sao Băng)',
                signal: 'bearish',
                desc: 'Sau đà tăng → đảo chiều. Bóng trên rất dài',
                candles: [{ color: 'red', bodyY: 58, bodyH: 14, shadowTop: 54, shadowBot: 0 }],
            },
            {
                name: 'Inverted Hammer\n(Búa Ngược)',
                signal: 'bullish',
                desc: 'Sau đà giảm → manh nha phục hồi. Bóng trên dài',
                candles: [{ color: 'green', bodyY: 58, bodyH: 14, shadowTop: 54, shadowBot: 0 }],
            },
            {
                name: 'Doji\n(Dấu Thập)',
                signal: 'neutral',
                desc: 'Open ≈ Close → lưỡng lự, bế tắc. Cực quan trọng tại đỉnh',
                candles: [{ color: 'gray', bodyY: 40, bodyH: 3, shadowTop: 36, shadowBot: 46 }],
            },
            {
                name: 'Dragonfly Doji\n(Doji Chuồn Chuồn)',
                signal: 'bullish',
                desc: 'Tại đáy → tín hiệu đảo chiều mạnh. Toàn bộ là bóng dưới',
                candles: [{ color: 'gray', bodyY: 12, bodyH: 3, shadowTop: 0, shadowBot: 72 }],
            },
            {
                name: 'Gravestone Doji\n(Doji Bia Mộ)',
                signal: 'bearish',
                desc: 'Tại đỉnh → đảo chiều giảm. Toàn bộ là bóng trên',
                candles: [{ color: 'gray', bodyY: 78, bodyH: 3, shadowTop: 74, shadowBot: 0 }],
            },
            {
                name: 'Marubozu Xanh\n(Thân Trụ Tăng)',
                signal: 'bullish',
                desc: 'Không bóng nến → phe mua áp đảo hoàn toàn cả phiên',
                candles: [{ color: 'green', bodyY: 10, bodyH: 72, shadowTop: 0, shadowBot: 0 }],
            },
            {
                name: 'Marubozu Đỏ\n(Thân Trụ Giảm)',
                signal: 'bearish',
                desc: 'Không bóng nến → phe bán áp đảo hoàn toàn cả phiên',
                candles: [{ color: 'red', bodyY: 10, bodyH: 72, shadowTop: 0, shadowBot: 0 }],
            },
        ],
    },
    {
        type: 'candle-patterns',
        title: '🕯️🕯️ Nhóm 2: Mô Hình 2 Nến (Two-Candle Patterns)',
        content: '',
        patterns: [
            {
                name: 'Bullish Engulfing\n(Nhấn Chìm Tăng)',
                signal: 'bullish',
                desc: 'Tại đáy → Nến xanh lớn nuốt trọn nến đỏ nhỏ',
                candles: [
                    { color: 'red', bodyY: 30, bodyH: 25, shadowTop: 6, shadowBot: 8 },
                    { color: 'green', bodyY: 15, bodyH: 55, shadowTop: 6, shadowBot: 6 },
                ],
            },
            {
                name: 'Bearish Engulfing\n(Nhấn Chìm Giảm)',
                signal: 'bearish',
                desc: 'Tại đỉnh → Nến đỏ lớn nuốt trọn nến xanh nhỏ',
                candles: [
                    { color: 'green', bodyY: 30, bodyH: 25, shadowTop: 6, shadowBot: 8 },
                    { color: 'red', bodyY: 15, bodyH: 55, shadowTop: 6, shadowBot: 6 },
                ],
            },
            {
                name: 'Dark Cloud Cover\n(Mây Đen Bao Phủ)',
                signal: 'bearish',
                desc: 'Tại đỉnh → Gap lên rồi đóng cửa vào nửa dưới nến xanh',
                candles: [
                    { color: 'green', bodyY: 20, bodyH: 50, shadowTop: 5, shadowBot: 10 },
                    { color: 'red', bodyY: 10, bodyH: 45, shadowTop: 4, shadowBot: 12 },
                ],
            },
            {
                name: 'Piercing Line\n(Đường Xuyên Thấu)',
                signal: 'bullish',
                desc: 'Tại đáy → Gap xuống rồi đóng cửa trên 50% nến đỏ',
                candles: [
                    { color: 'red', bodyY: 10, bodyH: 50, shadowTop: 5, shadowBot: 12 },
                    { color: 'green', bodyY: 20, bodyH: 45, shadowTop: 10, shadowBot: 5 },
                ],
            },
            {
                name: 'Bullish Harami\n(Mẹ Bồng Con ↑)',
                signal: 'bullish',
                desc: 'Nến xanh nhỏ lọt thỏm trong thân nến đỏ lớn → mất đà giảm',
                candles: [
                    { color: 'red', bodyY: 10, bodyH: 60, shadowTop: 5, shadowBot: 8 },
                    { color: 'green', bodyY: 28, bodyH: 22, shadowTop: 4, shadowBot: 4 },
                ],
            },
            {
                name: 'Bearish Harami\n(Mẹ Bồng Con ↓)',
                signal: 'bearish',
                desc: 'Nến đỏ nhỏ lọt thỏm trong thân nến xanh lớn → mất đà tăng',
                candles: [
                    { color: 'green', bodyY: 10, bodyH: 60, shadowTop: 5, shadowBot: 8 },
                    { color: 'red', bodyY: 28, bodyH: 22, shadowTop: 4, shadowBot: 4 },
                ],
            },
            {
                name: 'Tweezer Bottom\n(Đáy Nhíp)',
                signal: 'bullish',
                desc: '2 nến chạm cùng mức thấp nhất → hỗ trợ cứng',
                candles: [
                    { color: 'red', bodyY: 15, bodyH: 35, shadowTop: 5, shadowBot: 32 },
                    { color: 'green', bodyY: 20, bodyH: 28, shadowTop: 8, shadowBot: 32 },
                ],
            },
            {
                name: 'Tweezer Top\n(Đỉnh Nhíp)',
                signal: 'bearish',
                desc: '2 nến chạm cùng mức cao nhất → kháng cự cứng',
                candles: [
                    { color: 'green', bodyY: 40, bodyH: 35, shadowTop: 36, shadowBot: 5 },
                    { color: 'red', bodyY: 45, bodyH: 28, shadowTop: 36, shadowBot: 8 },
                ],
            },
        ],
    },
    {
        type: 'candle-patterns',
        title: '🕯️🌟🕯️ Nhóm 3: Mô Hình 3 Nến (Three-Candle Patterns)',
        content: '',
        patterns: [
            {
                name: 'Morning Star\n(Sao Mai)',
                signal: 'bullish',
                desc: 'Tại đáy → Đỏ dài + Sao nhỏ + Xanh dài ≥50%',
                candles: [
                    { color: 'red', bodyY: 10, bodyH: 50, shadowTop: 5, shadowBot: 8 },
                    { color: 'gray', bodyY: 55, bodyH: 8, shadowTop: 6, shadowBot: 6 },
                    { color: 'green', bodyY: 15, bodyH: 48, shadowTop: 6, shadowBot: 6 },
                ],
            },
            {
                name: 'Evening Star\n(Sao Hôm)',
                signal: 'bearish',
                desc: 'Tại đỉnh → Xanh dài + Sao nhỏ + Đỏ dài ≥50%',
                candles: [
                    { color: 'green', bodyY: 15, bodyH: 50, shadowTop: 5, shadowBot: 8 },
                    { color: 'gray', bodyY: 8, bodyH: 8, shadowTop: 4, shadowBot: 6 },
                    { color: 'red', bodyY: 20, bodyH: 48, shadowTop: 6, shadowBot: 6 },
                ],
            },
            {
                name: 'Three White Soldiers\n(Ba Lính Trắng)',
                signal: 'bullish',
                desc: '3 nến xanh liên tiếp, mỗi cây đóng cao hơn cây trước',
                candles: [
                    { color: 'green', bodyY: 45, bodyH: 35, shadowTop: 4, shadowBot: 4 },
                    { color: 'green', bodyY: 25, bodyH: 40, shadowTop: 4, shadowBot: 4 },
                    { color: 'green', bodyY: 8, bodyH: 48, shadowTop: 4, shadowBot: 4 },
                ],
            },
            {
                name: 'Three Black Crows\n(Ba Con Quạ Đen)',
                signal: 'bearish',
                desc: '3 nến đỏ liên tiếp, mỗi cây đóng thấp hơn cây trước',
                candles: [
                    { color: 'red', bodyY: 8, bodyH: 35, shadowTop: 4, shadowBot: 4 },
                    { color: 'red', bodyY: 22, bodyH: 40, shadowTop: 4, shadowBot: 4 },
                    { color: 'red', bodyY: 40, bodyH: 40, shadowTop: 4, shadowBot: 4 },
                ],
            },
        ],
    },
    {
        type: 'concept',
        title: '📊 Xác Nhận Bằng Volume — Chìa Khóa Tránh Bẫy',
        content: `Nến Nhật cho biết AI đang thắng. Volume cho biết họ có thực sự "xuống tiền" không.

✅ Breakout + Volume đột biến = THẬT: Khi mô hình đảo chiều xuất hiện tại vùng S/R với volume vượt trung bình 20 ngày — tín hiệu đáng tin.

⚠️ Giá không tăng + Volume tăng vọt = XẢ HÀNG: Doji hoặc Shooting Star với volume lớn tại đỉnh = phe bán đang phân phối. Đây là red flag mạnh nhất.

📉 Nhịp điều chỉnh + Volume giảm dần = ĐÁY GẦN: Hammer hoặc Morning Star kèm volume giảm dần trong đợt pullback = áp lực bán cạn kiệt.

Steve Nison: "Nến Nhật nên xem trong ngữ cảnh những gì đã xảy ra trước đó và KẾT HỢP với S/R và Volume."`,
    },
    {
        type: 'checklist',
        title: '✅ Checklist Trước Khi Vào Lệnh',
        content: [
            'Xác định xu hướng lớn (H4/D): Hammer trong downtrend mới có ý nghĩa. Hammer trong uptrend = không đặc biệt',
            'Kiểm tra vị trí tại S/R: Shooting Star TẠI kháng cự = mạnh 10x. Xuất hiện giữa trời = yếu',
            'Volume xác nhận: Nến đảo chiều + volume > MA20 = đáng tin. Volume thấp = nghi ngờ',
            'Chờ nến ĐÓNG CỬA hoàn toàn: Không vào lệnh khi nến đang hình thành (nến đang chạy)',
            'Chờ nến tiếp theo xác nhận: Sau Hammer, nến xanh vượt đỉnh Hammer mới vào lệnh. Giảm 40% false signal',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Mô Hình Nến Không Hoạt Động Đơn Lẻ',
        content: 'Ngay cả Morning Star hay Bullish Engulfing cũng chỉ có xác suất 60-65%. Trader thắng không phải vì đúng nhiều hơn — mà vì khi đúng kiếm nhiều, khi sai mất ít. Đặt stop-loss ngay dưới bóng nến tín hiệu (buy) hoặc ngay trên bóng trên (sell). Không có stop-loss = rủi ro không giới hạn.',
    },
    {
        type: 'quote',
        content: '"Nến Nhật cung cấp cái nhìn vào tâm lý thị trường mà không phương pháp nào khác có thể làm được. Nhưng đó chỉ là một công cụ — không phải sự thần kỳ."',
        author: 'Steve Nison',
        source: 'Japanese Candlestick Charting Techniques',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ',
        content: [
            'Thân nến = kết quả O-C. Xanh: mua thắng. Đỏ: bán thắng. Bóng = phần bị kéo lại',
            'Nến đơn quan trọng: Hammer (đáy) | Hanging Man (đỉnh) | Shooting Star (đỉnh) | Doji (lưỡng lự)',
            'Nến đôi mạnh nhất: Bullish/Bearish Engulfing — thân lớn nuốt trọn thân nhỏ',
            'Nến ba mạnh nhất: Morning Star (đáy) và Evening Star (đỉnh) — 3 cây quyết định',
            '3 điều kiện bắt buộc: Đúng vị trí xu hướng + Tại S/R + Volume xác nhận',
        ],
    },
]
