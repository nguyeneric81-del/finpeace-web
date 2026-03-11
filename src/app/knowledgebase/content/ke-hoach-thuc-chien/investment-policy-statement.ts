// Article content: ke-hoach-thuc-chien / investment-policy-statement
// "Viết IPS — Hiến Pháp Đầu Tư Của Bạn"
// Ref: Benjamin Graham "Investor's Contract", Buffett

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Thách thức lớn nhất của nhà đầu tư không phải là tìm cổ phiếu tăng mạnh nhất — mà là ngăn bản thân trở thành kẻ thù của chính mình: mua giá cao vì đám đông hét "Mua đi!" và bán giá thấp vì ai cũng gào "Bán đi!".

Investment Policy Statement (IPS) là "hiến pháp" giải quyết triệt để vấn đề này. Không phức tạp — chỉ là một tờ giấy bạn đã ký với chính mình khi còn bình tĩnh, để đọc lại khi hoảng loạn.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao Bạn CẦN Một "Hiến Pháp Đầu Tư"?',
        content: `Buffett: "Thành công trong đầu tư không tương quan với chỉ số IQ nếu IQ của bạn đã trên 125. Cái bạn cần là khả năng kiểm soát những ham muốn cảm xúc." IPS giúp bạn xác định trước: "Tôi sẽ phản ứng thế nào nếu thị trường giảm 50%?"

Dự đoán thị trường là vô nghĩa. IPS đưa các quyết định vào "chế độ tự động" — loại bỏ ảo tưởng bạn có thể đoán tương lai, và ngăn bạn để một đám người lạ trên thị trường ra quyết định tài chính thay cho mình.`,
    },
    {
        type: 'steps',
        title: '📝 Phần 2: Cấu Trúc Cốt Lõi Của Một IPS Hiệu Quả',
        content: '',
        items: [
            {
                icon: '🎯',
                title: 'Triết lý & Mục tiêu dài hạn',
                highlight: 'Số tiền + thời hạn cụ thể',
                body: 'Ghi rõ: "Tích lũy 2 tỷ đồng trong 10 năm" hoặc "Thu nhập thụ động 20 triệu/tháng khi nghỉ hưu tuổi 55". Không được mơ hồ như "kiếm nhiều tiền".',
            },
            {
                icon: '⚖️',
                title: 'Phân bổ tài sản (Asset Allocation)',
                highlight: 'X% cổ phiếu + Y% an toàn',
                body: '"Tấm đệm" tiền an toàn (trái phiếu/tiền mặt) giúp bạn đủ can đảm bám trụ khi cổ phiếu lao dốc thay vì bán tháo. Quyết định tỷ lệ này dựa trên thời gian bạn KHÔNG cần dùng tiền và mức giảm tối đa bạn chịu được.',
            },
            {
                icon: '📅',
                title: 'Kỷ luật DCA tự động',
                highlight: 'Cố định, đều đặn, không phán đoán',
                body: 'X triệu mỗi tháng, vào ngày cố định, bất kể thị trường lên hay xuống. Tự động hóa bằng lệnh ngân hàng định kỳ — không cần quyết định mỗi tháng.',
            },
            {
                icon: '🔄',
                title: 'Tái cân bằng định kỳ',
                highlight: '1 năm/lần — không theo tin tức',
                body: 'Khi tỷ lệ lệch khỏi target (cổ phiếu tăng lên 80% thay vì 70%): bán bớt phần tăng, mua thêm phần giảm. Cơ học hóa hoàn toàn.',
            },
        ],
    },
    {
        type: 'contract',
        title: 'BẢN TUYÊN BỐ PHƯƠNG CHÂM ĐẦU TƯ (IPS)',
        content: 'Điều chỉnh từ "Hợp đồng của Nhà Đầu Tư" do Benjamin Graham thiết kế. Hãy in ra, điền vào, ký tên và dán ở nơi bạn hay nhìn thấy nhất trước khi đặt lệnh.',
        clauses: [
            {
                number: 'Mở đầu',
                label: 'Cam kết của Nhà Đầu Tư',
                content: 'Tôi, ................................, ghi nhận rằng tôi là nhà đầu tư có mục tiêu tích lũy sự giàu có và bình an tài chính cho nhiều năm trong tương lai.',
            },
            {
                number: 'Điều 1',
                label: 'Nhận thức về Cảm xúc',
                content: 'Tôi biết chắc sẽ có lúc bị cám dỗ mua vào vì giá đã/sắp tăng mạnh, và có lúc hoảng loạn muốn bán tháo vì giá đang lao dốc. Tôi thừa nhận đây là bản năng sinh học và cam kết không hành động theo nó.',
            },
            {
                number: 'Điều 2',
                label: 'Lời Thề Độc Lập',
                content: 'Tôi từ chối để đám đông người lạ trên thị trường ra quyết định tài chính thay mình. Cam kết sắt đá: KHÔNG BAO GIỜ mua chỉ vì thị trường đang tăng. KHÔNG BAO GIỜ bán chỉ vì thị trường đang giảm.',
            },
            {
                number: 'Điều 3',
                label: 'Kỷ Luật DCA',
                content: 'Tôi sẽ đầu tư một khoản cố định mỗi tháng, một cách tự động và không phụ thuộc vào diễn biến thị trường.',
                fillable: true,
            },
            {
                number: 'Điều 4',
                label: 'Phân Bổ & Tái Cân Bằng',
                content: 'Danh mục luôn giữ: [X]% Tăng trưởng (cổ phiếu/quỹ) + [Y]% An toàn (trái phiếu/tiền mặt). Tái cân bằng 1 năm/lần — tuyệt đối không hành động theo tin tức thời sự.',
                fillable: true,
            },
            {
                number: 'Điều 5',
                label: 'Cam Kết Dài Hạn',
                content: 'Tôi coi đầu tư là công việc nhàm chán nhưng kỷ luật. Tôi giữ các khoản đầu tư này liên tục ít nhất cho tới ngày [DD/MM/YYYY — ít nhất 10 đến 20 năm sau], trừ khi nền tảng cốt lõi của tài sản bị phá vỡ hoàn toàn.',
                fillable: true,
            },
        ],
        signatureFields: [
            'Ký tên (Nhà đầu tư)',
            'Ngày ký',
            'Người làm chứng (Vợ/Chồng/Bạn đồng hành)',
        ],
    },
    {
        type: 'key-insight',
        title: '💡 Cách Dùng IPS Hiệu Quả Nhất',
        content: 'Lần tới khi thị trường sụp đổ, bảng điện đỏ rực và bạn muốn ấn "Bán bằng mọi giá" — hãy lấy tờ IPS ra đọc lại. Nó nhắc: "Chặng đường gập ghềnh này đã được bạn dự liệu từ trước. Nhiệm vụ của bạn lúc này chỉ đơn giản là làm đúng theo kế hoạch." Đây chính là khoảnh khắc IPS có giá trị nhất.',
    },
    {
        type: 'quote',
        content: '"Thành công trong đầu tư không tương quan với chỉ số IQ nếu IQ của bạn đã trên 125. Cái bạn cần là khả năng kiểm soát những ham muốn khiến người khác gặp rắc rối trong đầu tư."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway Annual Meeting',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'IPS = "hiến pháp" chống lại kẻ thù lớn nhất: cảm xúc của chính bạn — không phải thị trường',
            'EQ > IQ: IQ trên 125 không còn tương quan với kết quả đầu tư — kỷ luật cảm xúc mới quyết định',
            '"Tấm đệm" tiền an toàn (Y% trái phiếu/tiền mặt) cho bạn can đảm bám trụ khi cổ phiếu lao dốc',
            'In ra, ký tên, có người làm chứng — biến IPS từ ý định tốt đẹp thành cam kết có trách nhiệm',
            'Điều 2 quan trọng nhất: từ chối để đám đông ra quyết định tài chính thay cho mình',
            'Đọc lại IPS TRƯỚC KHI bán trong hoảng loạn — đây là thời điểm nó cứu bạn nhiều nhất',
        ],
    },
]
