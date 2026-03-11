// Article content: phan-tich-ky-thuat / ho-tro-khang-cu
// "Hỗ Trợ & Kháng Cự — Bản Đồ Chiến Trường Của Trader"
// Ref: Technical Analysis of the Financial Markets (Murphy)

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Mọi biến động giá trên biểu đồ đều tuân theo quy luật cung và cầu. Hỗ trợ và kháng cự không phải là những đường kẻ vô tri — chúng được tạo ra bởi trí nhớ và cảm xúc của hàng ngàn nhà giao dịch đang cùng lúc nhìn vào một mức giá.

Hiểu được bản chất này là nền tảng để bạn giao dịch với xác suất thắng cao hơn, không phải dựa trên may rủi.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Giá Thường Dừng Lại Ở Cùng Một Mức?',
        content: `Câu trả lời nằm ở tâm lý học tập thể, không phải toán học.

**Hỗ trợ (Support — "Sàn nhà"):** Là mức giá mà tại đó, lực cầu (người muốn mua) áp đảo lực cung (người muốn bán), ngăn không cho giá giảm sâu hơn. Tại đây, các nhà giao dịch tin rằng thị trường đang bị "bán quá mức" (oversold) và giá đang ở mức hời.

**Kháng cự (Resistance — "Trần nhà"):** Là mức giá mà tại đó, áp lực bán (lực cung) vượt quá áp lực mua (lực cầu), chặn đà tăng của giá lại. Tại đây, nhà giao dịch tin rằng thị trường đã bị "mua quá mức" (overbought) và bắt đầu chốt lời.

**Bí mật tâm lý học:** Mức giá quan trọng nhất trên bất kỳ biểu đồ nào chính là mức giá mà nhà đầu tư đã vung tiền mua hoặc bán — vì con người có sự gắn kết cảm xúc mạnh mẽ với điểm hòa vốn của họ. Ngoài ra, các "con số tròn" (10, 50, 100, 200 nghìn đồng...) cũng tạo ra vùng S/R tâm lý mạnh, vì mọi người có xu hướng đặt lệnh chốt lời ở những con số chẵn này.`,
    },
    {
        type: 'key-insight',
        title: '💡 S/R là một "Vùng", không phải một đường thẳng',
        content: 'Đừng cố kẻ một đường thẳng và mong giá dừng lại chính xác tại từng tick. Hỗ trợ và kháng cự là những VÙNG TRANH CHẤP, nơi các giao dịch mua/bán diễn ra dày đặc trong quá khứ. Hành động trong vùng này luôn có tỷ lệ Rủi ro/Lợi nhuận tốt nhất.',
    },
    {
        type: 'concept',
        title: '📖 Phần 2: Phân Biệt S/R "Mỏng" (Minor) và "Dày" (Major)',
        content: `Không phải mọi mức S/R đều có giá trị như nhau. Đánh giá độ vững chắc dựa trên 2 yếu tố:

**Thời gian tích lũy (Độ dày):** Một vùng tích lũy ngắn chỉ tạo ra hỗ trợ/kháng cự thứ yếu (yếu). Ngược lại, vùng tích lũy kéo dài nhiều tuần — nơi giá đi ngang lâu — tạo ra mức S/R cực kỳ vững chắc. Dòng tiền lớn đã "xây" vị thế của họ tại đó.

**Số lần chạm (Độ nén):** Giá chạm vào một mức hỗ trợ càng nhiều lần mà không xuyên thủng được, mức đó càng mạnh. Giống như phe Bò đang xây một bức tường thành kiên cố — mỗi lần test thất bại là một viên gạch được đặt thêm vào.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Hiện Tượng "Đổi Vai Trò" — Mảnh Ghép Quan Trọng Nhất',
        content: `Đây là quy tắc then chốt nhất trong phân tích S/R: **Khi một mức S/R bị phá vỡ dứt khoát, chúng sẽ đảo ngược vai trò cho nhau.**

• Kháng cự bị phá vỡ → trở thành hỗ trợ mới cho các đợt kéo ngược (pullback).
• Hỗ trợ bị xuyên thủng → trở thành kháng cự chặn đà tăng trong tương lai.

**Tại sao?** Hãy tưởng tượng giá phá hỗ trợ và lao dốc. Những người mua tại vùng hỗ trợ đó đang bị thua lỗ và mắc kẹt. Khao khát đầu tiên của họ là "hòa vốn". Khi giá phục hồi trở lại đúng mức hỗ trợ cũ, những người mắc kẹt này sẽ nhẹ nhõm bán tháo để thoát hàng. Chính áp lực bán khổng lồ từ hàng nghìn người muốn hòa vốn đây đã biến "hỗ trợ cũ" thành "kháng cự mới".`,
    },
    {
        type: 'steps',
        title: '🗺️ Thực Chiến: Cách Sử Dụng S/R Như Trader Chuyên Nghiệp',
        content: '',
        items: [
            {
                icon: '📐',
                title: 'Vẽ vùng, không vẽ đường',
                highlight: 'Zone, not line',
                body: 'Hãy tạo ra một vùng tô màu (shaded zone) thay vì một đường kẻ chính xác. Giá thường có hành vi "fake-out" (giả vờ phá vỡ) trước khi quay đầu bên trong vùng này.',
            },
            {
                icon: '📅',
                title: 'Dùng đỉnh và đáy lịch sử',
                highlight: 'Historical peaks & troughs',
                body: 'Các mức giá cao nhất, thấp nhất của ngày, tuần, tháng trước đó luôn là những điểm S/R then chốt mà dòng tiền lớn quan tâm. Đây là nơi các "smart money" đặt lệnh.',
            },
            {
                icon: '🎯',
                title: 'Đặt stop-loss ở mức S/R',
                highlight: 'Risk management tối ưu',
                body: 'Khi mua (Long): đặt stop-loss ngay dưới vùng hỗ trợ gần nhất. Khi bán khống (Short): đặt stop-loss ngay trên vùng kháng cự. Đây là nền tảng quản trị rủi ro chính xác.',
            },
            {
                icon: '⏳',
                title: 'Chờ xác nhận tại vùng S/R',
                highlight: 'Confirmation pattern',
                body: 'Khi giá tiến vào vùng S/R, đừng vào lệnh ngay. Hãy chờ mẫu nến xác nhận (như nến Engulfing, Pin Bar, hoặc kết hợp với volume tăng vọt) để xác nhận phản ứng thực sự đang diễn ra.',
            },
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Bẫy Phổ Biến: Bắt Đáy & Đoán Đỉnh',
        content: 'Cố gắng bắt đáy hay đoán đỉnh ở giữa hư không — không dựa vào bất kỳ vùng S/R nào — là một canh bạc thuần túy, không phải giao dịch. Tỷ lệ Risk/Reward tệ nhất luôn xuất hiện khi bạn vào lệnh ở giữa một chuyển động. Tỷ lệ tốt nhất luôn đến khi bạn kiên nhẫn chờ giá tiến vào vùng S/R đã được thiết lập rõ ràng.',
    },
    {
        type: 'quote',
        content: '"Thị trường không thưởng cho người dự đoán giỏi. Nó thưởng cho người kiên nhẫn chờ đợi giá đến đúng điểm mà xác suất nghiêng hẳn về phía họ."',
        author: 'John Murphy',
        source: 'Technical Analysis of the Financial Markets',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Hỗ trợ = lực cầu áp đảo lực cung → giá bật lên. Kháng cự = lực cung áp đảo lực cầu → giá bị chặn lại',
            'S/R được tạo ra bởi TÂM LÝ tập thể: điểm hòa vốn, con số tròn, và trí nhớ giá của thị trường',
            'S/R "dày" = tích lũy lâu + nhiều lần test → quan trọng hơn S/R "mỏng" rất nhiều',
            'Đổi vai trò (Role Reversal): kháng cự phá vỡ → thành hỗ trợ mới | hỗ trợ thủng → thành kháng cự mới',
            'Thực chiến: vẽ VÙNG (zone), dùng đỉnh/đáy lịch sử, stop-loss đặt tại S/R, luôn chờ xác nhận',
            'Bước tiếp theo: Kết hợp S/R với Volume (Khối Lượng Giao Dịch) để lọc tín hiệu giả và tăng độ chính xác',
        ],
    },
]
