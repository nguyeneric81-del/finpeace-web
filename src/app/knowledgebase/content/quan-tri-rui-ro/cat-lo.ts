// Article content: quan-tri-rui-ro / cat-lo
// "Cắt Lỗ — Kỹ Năng Quan Trọng Nhất Mà Ít Người Học"
// Ref: Kahneman Prospect Theory, Darvas, Turtle Traders, Elder

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Không chịu cắt lỗ không phải do bạn kém thông minh — mà do bộ não được **lập trình sinh học để chống lại nó**.

Hiểu được tại sao não phản ứng như vậy là bước đầu tiên. Xây dựng một quy trình cơ học để vượt qua bản năng đó là bước quyết định tài khoản của bạn còn hay mất.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Não Bộ Căm Ghét Việc Cắt Lỗ?',
        content: `**Ác cảm thua lỗ (Loss Aversion — Kahneman & Tversky):**
Thuyết triển vọng chứng minh: nỗi đau mất 1 đồng lớn gấp **2.5 lần** niềm vui kiếm được 1 đồng. Vì đau đớn quá lớn, nhà đầu tư sẵn sàng chấp nhận thêm rủi ro (gồng lỗ) chỉ để tránh phải chính thức ghi nhận khoản lỗ.

**Né tránh sự hối tiếc & cú sốc cái tôi:**
Ấn nút "Bán" để chốt lỗ = thừa nhận công khai mình đã sai. Đặc biệt khó khi phải thừa nhận với vợ/chồng hoặc cơ quan thuế. Cái tôi và nỗi sợ bị phán xét khiến con người né tránh hành động đúng đắn.

**Ảo giác "Lỗ trên giấy":**
Não tự lừa dối: *"Chưa bán = chưa lỗ thật."* Nhà đầu tư bám víu hy vọng giá sẽ hồi phục, và từng bước biến một giao dịch tồi ngắn hạn thành "đầu tư dài hạn bất đắc dĩ" — giam vốn không có điểm thoát.

**Toán học khắc nghiệt của gồng lỗ:**
- Lỗ 10% → cần lãi 11.1% để hòa
- Lỗ 25% → cần lãi 33% để hòa
- Lỗ 50% → cần lãi **100%** để hòa
- Lỗ 75% → cần lãi **300%** để hòa`,
    },
    {
        type: 'steps',
        title: '⚙️ Phần 2: 3 Kỹ Thuật Đặt Stop-Loss Khoa Học',
        content: '',
        items: [
            {
                icon: '📏',
                title: 'Kỹ thuật 1: % Cố Định',
                highlight: 'Đơn giản nhất — phù hợp người mới bắt đầu',
                body: '• Xác định trước mức sụt giảm tối đa (ví dụ: 7-8%) so với giá mua\n• William O\'Neil (CANSLIM): cắt lỗ ở -7% đến -8% là ngưỡng tối ưu\n• Ưu điểm: đơn giản, nhất quán, dễ thực thi\n• Nhược điểm: không tính đến biến động riêng của từng cổ phiếu — cổ phiếu beta cao bị stop thường xuyên hơn cần thiết',
            },
            {
                icon: '🗺️',
                title: 'Kỹ thuật 2: S/R & Darvas Box (Price Action Stop)',
                highlight: 'Stop tại điểm "vô hiệu hóa luận điểm mua"',
                body: '• Darvas Box: đặt stop ngay dưới đáy hộp (vùng hỗ trợ gần nhất)\n• Khi giá xuyên thủng đáy hộp → lực cầu trợ giá biến mất → không ai biết giá rơi đến đâu\n• Bollinger Bands: thoát lệnh khi cấu trúc giá bị phá vỡ ngoài dải\n• Đây là stop-loss "có ý nghĩa" nhất: nó xác nhận luận điểm mua của bạn đã sai',
            },
            {
                icon: '📊',
                title: 'Kỹ thuật 3: ATR-Based (Volatility Stop)',
                highlight: 'Khoa học nhất — Turtle Traders dùng',
                body: '• Stop = Giá mua − (ATR × 2 hoặc 3)\n• ATR đo biên độ dao động thực tế: cổ phiếu biến động cao → stop xa tự động | ổn định → stop gần\n• Tránh bị "whipsawed" (stop bị quét oan bởi nhiễu bình thường của thị trường)\n• Phù hợp nhất khi kết hợp với position sizing theo ATR (xem bài Position Sizing)',
            },
        ],
    },
    {
        type: 'steps',
        title: '🧠 Phần 3: Quy Trình Tâm Lý Để Cắt Lỗ "Không Run Tay"',
        content: 'Biến việc cắt lỗ từ quyết định cảm xúc thành phản xạ cơ học:',
        items: [
            {
                icon: '⏰',
                title: 'Bước 1: Ra quyết định TRƯỚC khi thị trường mở cửa',
                highlight: 'Lúc bình tĩnh nhất = lúc quyết định tốt nhất',
                body: 'Xác định chính xác điểm cắt lỗ ngay tại thời điểm mua cổ phiếu — khi đầu óc còn khách quan. Không được để "thị trường quyết định" khi bạn đang hoảng loạn nhìn giá rơi.',
            },
            {
                icon: '🤖',
                title: 'Bước 2: Đặt lệnh stop tự động — Cơ học hóa kỷ luật',
                highlight: 'Đừng tin vào sức mạnh ý chí',
                body: 'Giống Nicolas Darvas: đặt "Stop-loss order" qua môi giới ngay sau khi mua. Lệnh hoạt động như "cầu dao điện tự động" — chém đứt thua lỗ ở đúng điểm đã định, loại bỏ sự chần chừ. Bạn ngủ ngon bất kể thị trường xảy ra chuyện gì.',
            },
            {
                icon: '🔄',
                title: 'Bước 3: Tái định khung — Cắt lỗ là "Học phí", không phải Thất bại',
                highlight: 'Thay đổi ý nghĩa = thay đổi hành vi',
                body: 'Coi số tiền mất đi là học phí bắt buộc để mua kinh nghiệm. Cắt lỗ sớm = giải phóng vốn và tâm trí khỏi căng thẳng, sẵn sàng đón cơ hội tốt hơn. Mỗi lệnh cắt lỗ nhỏ đang bảo vệ bạn khỏi thảm họa lớn.',
            },
            {
                icon: '⚔️',
                title: 'Bước 4: Tuân thủ quy tắc "Mù quáng"',
                highlight: '"Thiếu kiên nhẫn với vị thế thua lỗ"',
                body: 'Quy tắc thép của các triệu phú giao dịch: không bao giờ giữ vị thế đang lỗ quá vài ngày. Tuân thủ điều này một cách mù quáng và vô điều kiện. Chính sự tuân thủ máy móc này sẽ cứu bạn khỏi thảm họa phá hủy toàn bộ tài khoản.',
            },
        ],
    },
    {
        type: 'key-insight',
        title: '💡 Thiên Tài Của Cắt Lỗ Nhỏ: Toán Học Kỳ Vọng',
        content: 'Giả sử cắt lỗ mỗi lệnh ở -5%, để lãi chạy trung bình +15% khi đúng. Win rate chỉ cần 25% là bạn đã hòa vốn. Win rate 35% là có lợi nhuận. Đây chính xác là mô hình Turtle Traders (40% win rate): không nhờ đoán đúng nhiều, mà nhờ THUA NHỎ và THẮNG LỚN.',
    },
    {
        type: 'quote',
        content: '"Điều đầu tiên chúng tôi học là: không bao giờ để một lệnh thua lỗ nhỏ trở thành lệnh thua lỗ lớn. Điều đó là chết người."',
        author: 'Jesse Livermore',
        source: 'Reminiscences of a Stock Operator',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Loss Aversion (Kahneman): đau mất 1 đồng = 2.5x vui kiếm 1 đồng → não lập trình để gồng lỗ, không phải cắt lỗ',
            '"Lỗ trên giấy" là ảo giác: vốn bị giam = cơ hội mất = lỗ thật 100%; lỗ 50% cần lãi 100% để hòa',
            '3 kỹ thuật stop: % cố định (đơn giản) | S/R & Darvas Box (có ý nghĩa) | ATR-based (khoa học nhất)',
            'Quy trình 4 bước: quyết định trước khi mở cửa → đặt lệnh tự động → tái khung nhận thức → tuân thủ mù quáng',
            '"Mù quáng" ở đây là đức hạnh, không phải sự ngu ngốc — nó bảo vệ bạn khỏi thảm họa do cảm xúc gây ra',
            'Kỳ vọng toán học: cắt lỗ nhỏ ở -5% + để lãi chạy +15% → với win rate 35% vẫn có lợi nhuận dài hạn',
        ],
    },
]
