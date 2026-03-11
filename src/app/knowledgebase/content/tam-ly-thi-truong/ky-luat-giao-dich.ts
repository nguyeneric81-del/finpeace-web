// Article content: tam-ly-thi-truong / ky-luat-giao-dich
// "Kỷ Luật Giao Dịch: Tách cảm xúc ra khỏi quyết định"

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Nhiều người lầm tưởng trading giống như đánh bạc. Mark Douglas — tác giả "Trading in the Zone" — đã chỉ ra sự khác biệt sống còn: trong đánh bạc, kết quả là ngẫu nhiên và bạn không phải chịu trách nhiệm. Trong trading, tương lai được tạo ra bởi hành động của các trader khác — điều đó làm cho cái tôi và lòng tự trọng của bạn bị đe dọa trực tiếp.

Khi thua lỗ, bạn tự dằn vặt vì những điều "lẽ ra mình nên làm". Áp lực này chính là kẻ thù đầu tiên cần phải hạ gục — trước khi nghĩ đến bất kỳ chiến lược nào.`,
    },
    {
        type: 'key-insight',
        title: '💡 Insight Cốt Lõi',
        content: 'Để thành công trong trading, bạn không cần phải luôn đúng — bạn chỉ cần luôn khách quan. Kỷ luật thực thi quan trọng hơn khả năng dự đoán. Một hệ thống tệ được thực thi có kỷ luật vẫn tốt hơn một hệ thống tuyệt vời bị phá vỡ bởi cảm xúc.',
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Lý Luận Của Mark Douglas',
        content: `Cái bẫy của việc "Phải luôn đúng": Douglas lập luận rằng ý kiến của bạn về thị trường có thể sai cũng dễ dàng như khi nó đúng. Nhu cầu "phải đúng" chính là kẻ thù giết chết trader. Nếu bạn cứ khăng khăng mình phải đúng, bạn đang chọn nhầm nghề.

Kỷ luật giúp loại bỏ sự đắn đo: "Hãy thực thi các giao dịch thua lỗ ngay khi bạn nhận thức được chúng tồn tại." Khi một khoản lỗ đã được định trước và bạn cắt lỗ không do dự, bạn không còn gì để cân nhắc, đong đếm hay phán xét nữa. Nếu bạn chần chừ, bạn sẽ rơi vào một "vòng lặp đau đớn tiêu cực" rất khó dừng lại.`,
    },
    {
        type: 'concept',
        title: '🧠 Phần 2: Bằng Chứng Từ Khoa Học Tâm Lý',
        content: `Khoa học tài chính hành vi chứng minh con người sinh ra không được trang bị tâm lý phù hợp để giao dịch có lãi. Khi giao dịch trong sợ hãi, não tự động "chặn" thông tin chứng minh bạn sai và chỉ bám víu vào những thông tin củng cố rằng bạn đang đúng. Đây là hội chứng chối bỏ thông tin — cực kỳ nguy hiểm cho đến khi áp lực quá lớn khiến bạn buộc phải bỏ cuộc tại vùng đáy.

Căn bệnh "Cắt lỗ chậm, Chốt lời sớm": Con người có xu hướng giữ lại các khoản lỗ quá lâu (không muốn thừa nhận sai lầm) và chốt lời quá sớm (sợ mất phần lãi đang có). Prospect Theory của Kahneman chứng minh: nỗi đau khi mất 1 đồng lớn gấp 2.5 lần niềm vui khi kiếm được 1 đồng — dẫn đến những quyết định thảm hại có hệ thống.`,
    },
    {
        type: 'quote',
        content: '"Hệ thống giao dịch do cái tôi dẫn dắt tập trung vào tỷ lệ % số lệnh thắng. Hệ thống sinh lời thực sự dựa trên toán học: tập trung vào quy mô của các lệnh thắng — kiếm được bao nhiêu khi đúng và mất bao nhiêu khi sai."',
        author: 'Mark Douglas',
        source: 'Trading in the Zone',
    },
    {
        type: 'checklist',
        title: '✅ 7 Đặc Điểm Của Trader Khách Quan (Theo Mark Douglas)',
        content: [
            'Không cảm thấy áp lực phải làm gì cả — thị trường không nợ bạn điều gì',
            'Không có cảm giác sợ hãi — sợ hãi là tín hiệu bạn đang giao dịch quá lớn so với khả năng chịu đựng',
            'Luôn sử dụng Stop-loss tự động ngay khi vào lệnh — như Nicolas Darvas đặt "cầu dao điện tự động"',
            'Tập trung vào NGUYÊN TẮC, không phải TIỀN — tiền sẽ tự đến nếu bạn tuân thủ tốt quy tắc',
            'Quan sát thị trường từ góc độ người đứng ngoài: "Thị trường đang nói điều X, và đây là những gì tôi sẽ làm"',
            'Không chơi trò đua tốc độ với HFT — chọn khung thời gian dài hơn, quyết định dựa trên giá đóng cửa',
            'Backtest hệ thống trước — kiến thức và kỷ luật quan trọng hơn vốn',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Trading Thời HFT — Con Người Có Còn Cửa Sống?',
        content: 'Giao dịch Cao tần (HFT) phản ứng trong vài phần triệu giây. Đừng cố đua tốc độ — bạn sẽ thua chắc. Nhưng HFT không thể thay đổi bức tranh xu hướng vĩ mô do quy luật Cung-Cầu tạo ra. Các phương pháp Trend Following (Turtle Traders, Darvas) không bị ảnh hưởng bởi HFT. Các sàn kiểu mới như IEX còn tạo "gờ giảm tốc" 350 micro-giây để vô hiệu hoá hoàn toàn lợi thế tốc độ của máy. Sân chơi hiện tại được định đoạt bởi trí tuệ và kỷ luật — không phải tốc độ.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Trading ≠ Đánh bạc: cái tôi bị đe dọa → cảm xúc lấn át → thực thi kém → thua lỗ có hệ thống',
            '"Phải luôn đúng" là kẻ thù số 1 — trader giỏi cần khách quan, không cần đúng mọi lúc',
            'Stop-loss tự động = vũ khí cơ học duy nhất loại bỏ cảm xúc khỏi quyết định thua lỗ',
            'HFT không thay đổi được xu hướng vĩ mô — Trend Following vẫn hiệu quả với khung thời gian dài',
            'Bước tiếp theo: Xem bài "Stop Loss & Position Sizing" để học cách đặt stop-loss theo ATR',
        ],
    },
]
