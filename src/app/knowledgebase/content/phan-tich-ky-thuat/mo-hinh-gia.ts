// Article content for: phan-tich-ky-thuat / mo-hinh-gia
// Tam Giác, Cờ, Đầu Vai: 8 Mô Hình Giá Tạo Nền Quan Trọng Nhất

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Richard Schabacker — "cha đẻ" của phân tích kỹ thuật hiện đại — đã dành nhiều thập kỷ nghiên cứu hàng ngàn biểu đồ cổ phiếu và nhận ra một điều: giá không di chuyển ngẫu nhiên. Giá di chuyển theo những mô hình lặp đi lặp lại, phản ánh tâm lý lặp đi lặp lại của nhà đầu tư — lòng tham, nỗi sợ, sự do dự.

Những mô hình này được Edwards và Magee hệ thống hóa trong cuốn "Technical Analysis of Stock Trends" (1948) — cuốn sách đã bán hơn 1 triệu bản và được coi là "Kinh Thánh" của phân tích kỹ thuật.

Lưu ý quan trọng: mô hình giá CHỈ CÓ GIÁ TRỊ khi xác nhận bằng volume. Không có volume → tín hiệu yếu, rủi ro cao.`,
    },
    {
        type: 'key-insight',
        title: '💡 2 Nhóm Mô Hình Giá Cơ Bản',
        content: 'Mô hình đảo chiều (Reversal patterns): báo hiệu xu hướng hiện tại sắp kết thúc và đảo chiều — ví dụ Đầu & Vai, Đỉnh Đôi/Đáy Đôi. Mô hình tiếp diễn (Continuation patterns): giá đang "nghỉ ngơi" giữa chặng tăng/giảm dài — ví dụ Cờ, Tam Giác, Hình Chữ Nhật. Phân biệt đúng hai nhóm này ảnh hưởng trực tiếp đến hướng vào lệnh.',
    },
    {
        type: 'steps',
        title: '📐 8 Mô Hình Giá Quan Trọng Nhất',
        content: 'Các mô hình phổ biến và cách giao dịch:',
        items: [
            {
                icon: '1️⃣',
                title: 'Đầu & Vai (Head & Shoulders) — Đảo Chiều Giảm',
                body: 'Gồm 3 đỉnh: vai trái, đầu (cao nhất), vai phải (thấp hơn đầu). Breakout qua "đường cổ" (neckline) với volume tăng → tín hiệu giảm. Mục tiêu giá = khoảng cách từ đầu đến neckline.',
                highlight: 'Độ tin cậy cao nhất khi vai phải thấp hơn vai trái + volume vai phải thấp',
            },
            {
                icon: '2️⃣',
                title: 'Đầu & Vai Ngược (Inverse H&S) — Đảo Chiều Tăng',
                body: 'Hình ngược của H&S thông thường, xuất hiện ở cuối downtrend. Breakout vượt neckline với volume tăng đột biến = tín hiệu mua mạnh. Một trong những setup đáng tin cậy nhất.',
                highlight: 'Volume bùng nổ tại breakout = xác nhận quan trọng nhất',
            },
            {
                icon: '3️⃣',
                title: 'Đỉnh Đôi (Double Top) — Đảo Chiều Giảm',
                body: 'Giá tạo 2 đỉnh gần bằng nhau, trở về cùng một vùng support ở giữa (valley). Breakdown qua valley với volume tăng → target = khoảng cách từ đỉnh xuống valley.',
                highlight: 'Thường gặp: 2 đỉnh cách nhau 2-8 tuần, valley rõ ràng',
            },
            {
                icon: '4️⃣',
                title: 'Đáy Đôi (Double Bottom) — Đảo Chiều Tăng',
                body: 'Ngược lại Double Top — 2 đáy gần bằng nhau tại vùng support mạnh, tạo peak ở giữa. Breakout vượt peak = tín hiệu mua. Cực kỳ phổ biến ở TTCK VN sau đợt điều chỉnh.',
                highlight: 'Volume đáy 2 thấp hơn đáy 1 = xác nhận mua tốt hơn',
            },
            {
                icon: '5️⃣',
                title: 'Tam Giác Đối Xứng (Symmetrical Triangle) — Tiếp Diễn',
                body: 'Giá đang thu hẹp biên độ — hai đường hội tụ. Thường báo hiệu tích lũy trước breakout. Hướng breakout thường theo xu hướng trước đó, nhưng cần volume xác nhận.',
                highlight: 'Breakout trong 2/3 đầu của tam giác (từ apex) là đáng tin cậy nhất',
            },
            {
                icon: '6️⃣',
                title: 'Tam Giác Tăng (Ascending Triangle) — Tiếp Diễn Tăng',
                body: 'Cạnh trên nằm ngang (resistance) + cạnh dưới dốc lên (higher lows). Phe mua đang mạnh dần. Breakout vượt resistance = mua. Phổ biến trong xu hướng tăng.',
                highlight: 'Volume giảm dần trong mô hình, bùng nổ lúc breakout = pattern chuẩn',
            },
            {
                icon: '7️⃣',
                title: 'Cờ (Flag & Pennant) — Tiếp Diễn Sau Cột Cờ',
                body: 'Sau một cú tăng/giảm mạnh (cột cờ), giá đi ngang/điều chỉnh nhẹ trong kênh hẹp (lá cờ). Breakout theo hướng cột cờ. Mục tiêu giá = độ dài cột cờ tính từ điểm breakout.',
                highlight: 'Cột cờ phải có volume lớn. Lá cờ volume giảm dần = pattern tốt',
            },
            {
                icon: '8️⃣',
                title: 'Hình Chữ Nhật (Rectangle) — Tiếp Diễn Hoặc Đảo Chiều',
                body: 'Giá dao động trong kênh nằm ngang giữa support và resistance rõ ràng. Có thể là "tích lũy" (nếu trước đó là downtrend) hoặc "phân phối" (nếu trước đó là uptrend). Volume quyết định hướng breakout.',
                highlight: 'Volume tăng dần tại lần test resistance → khả năng breakout tăng cao',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Biểu đồ là gương phản chiếu tâm lý của đám đông. Nếu bạn hiểu tâm lý, bạn hiểu biểu đồ."',
        author: 'Robert D. Edwards & John Magee',
        source: 'Technical Analysis of Stock Trends (1948)',
    },
    {
        type: 'checklist',
        title: '✅ Quy Trình 5 Bước Giao Dịch Theo Mô Hình Giá',
        content: [
            'Xác định xu hướng hiện tại (uptrend/downtrend/sideway) trên khung thời gian cao hơn',
            'Nhận diện mô hình giá đang hình thành — vẽ các đường giới hạn rõ ràng',
            'CHỜ breakout xác nhận — không vào trước khi giá phá vỡ (anticipate breakout = sai lầm phổ biến)',
            'Xác nhận bằng volume: volume tăng mạnh tại breakout = tín hiệu đáng tin. Volume yếu = có thể là false breakout',
            'Đặt stop loss ngay sau điểm breakout (hoặc sau mô hình) và xác định target theo quy tắc đo mô hình',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ False Breakout — Bẫy Phổ Biến Nhất',
        content: 'Giá thường "thăm dò" vượt qua đường giới hạn rồi quay lại — gọi là false breakout hay fakeout. Đây là cái bẫy phổ biến nhất với trader mới, khiến họ mua ở đỉnh local rồi bị stop loss ngay. Cách tránh: (1) chờ đóng cửa vượt qua level, không chỉ intraday; (2) volume phải cao hơn trung bình 20 phiên; (3) không vào lệnh trong 30 phút cuối phiên ATC.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Hai nhóm: Đảo chiều (H&S, Double Top/Bottom) và Tiếp diễn (Cờ, Tam Giác, Rectangle)',
            'Volume là yếu tố xác nhận bắt buộc — mô hình không có volume = tín hiệu yếu',
            'Không "anticipate" breakout — chờ giá phá vỡ thực sự với volume xác nhận',
            'False breakout rất phổ biến — stop loss chặt và chờ đóng cửa xác nhận là bảo vệ tốt nhất',
            'Bước tiếp theo: Kết hợp với bài "Fibonacci" để tìm target và entry tối ưu hơn',
        ],
    },
]
