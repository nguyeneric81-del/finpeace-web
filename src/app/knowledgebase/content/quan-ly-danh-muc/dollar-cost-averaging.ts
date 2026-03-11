// Article content: quan-ly-danh-muc / dollar-cost-averaging
// "Dollar-Cost Averaging — Chiến Lược Đầu Tư Mà Ngay Cả Buffett Khuyên Dùng"
// Ref: Malkiel, Buffett, Graham, Vanguard research

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Nhiều nhà đầu tư luôn cố gắng "mua đáy, bán đỉnh" — nhưng lịch sử chứng minh đây là ảo tưởng. Ngay cả các nhà quản lý quỹ chuyên nghiệp thường ôm nhiều tiền mặt nhất ở vùng đáy và giải ngân mạnh nhất ở vùng đỉnh.

**Dollar-Cost Averaging (DCA)** — đầu tư một khoản cố định định kỳ, bất kể giá cả — không đòi hỏi bạn phải là thiên tài dự đoán. Chỉ cần kỷ luật sắt đá.`,
    },
    {
        type: 'concept',
        title: '📖 Phần 1: Tại Sao DCA Tốt Hơn "Bắt Đáy"?',
        content: `**Không ai có thể dự đoán chính xác thị trường:**
Giá cả dao động như một bước đi ngẫu nhiên. Các nhà quản lý quỹ chuyên nghiệp thường ôm nhiều tiền mặt nhất ở vùng đáy và giải ngân nhiều nhất ở vùng đỉnh — nghịch lý hoàn toàn với những gì họ cần làm.

**Chi phí của sự chờ đợi:**
Luôn trì hoãn để chờ "giá tốt hơn" khiến bạn mất cổ tức và bỏ lỡ các đợt phục hồi bất ngờ. Thị trường không báo trước khi nó tăng.

**Cơ chế toán học của DCA:**
Đầu tư khoản cố định (ví dụ: 5 triệu/tháng) → tự động mua được **nhiều cổ phần hơn khi giá thấp**, ít hơn khi giá cao → chi phí bình quân/cổ phần luôn thấp hơn giá trung bình thị trường trong cùng giai đoạn.

**Loại bỏ hoàn toàn cảm xúc:**
DCA đưa đầu tư vào chế độ "lái tự động" — triệt tiêu lòng tham khi thị trường đang nguy hiểm nhất (nhưng trông hấp dẫn), và triệt tiêu nỗi sợ khi thị trường sụp đổ (đúng lúc cần mua mạnh nhất).`,
    },
    {
        type: 'steps',
        title: '📊 Phần 2: Bằng Chứng Lịch Sử — DCA Qua Các Khủng Hoảng',
        content: 'Thay vì cố đoán đáy, DCA biến sự sụt giảm thành lợi thế tích lũy. 3 cuộc kiểm định lịch sử:',
        items: [
            {
                icon: '🏛️',
                title: 'Đại Suy Thoái 1929 — Kịch bản tồi tệ nhất',
                highlight: 'Đầu tư 1 cục lỗ vs DCA lãi',
                body: 'Đầu tư 1 lần $12,000 ở đỉnh tháng 9/1929 → sau 10 năm chỉ còn $7,223 (lỗ 40%). Nhưng DCA $100/tháng bắt đầu cùng thời điểm → đến tháng 8/1939 tài khoản đạt $15,571 (lãi), dù trải qua cuộc khủng hoảng tồi tệ nhất lịch sử.',
            },
            {
                icon: '💻',
                title: 'Bong Bóng Dot-com 1999-2002 — S&P 500 mất 41.3%',
                highlight: 'DCA giảm thiệt hại và tạo nền tảng phục hồi',
                body: 'Tài khoản $3,000 + DCA $100/tháng → tổng vốn bỏ ra $6,600 chỉ lỗ 30.2% (thấp hơn nhiều so với mức -41.3% của thị trường). Việc mua đều đặn ở vùng giá thấp tạo nền tảng vững chắc để bùng nổ khi thị trường phục hồi.',
            },
            {
                icon: '📈',
                title: 'Vanguard 500 Index 1978-2006 — 28 năm kiên trì',
                highlight: 'Vốn x8 lần',
                body: '$500 ban đầu + DCA $100/tháng vào Vanguard 500 Index (cổ tức tái đầu tư) → đến 2006 tài sản đạt $277,315 — gấp 8 lần tổng số tiền vốn bỏ ra. Đây là sức mạnh của lãi kép kết hợp DCA trong dài hạn.',
            },
        ],
    },
    {
        type: 'concept',
        title: '📖 Phần 3: Bí Quyết Áp Dụng DCA Thành Công',
        content: `**Nên DCA vào ETF/Index Fund, không phải cổ phiếu lẻ:**
Buffett và Graham đều khuyên nhà đầu tư không chuyên DCA vào quỹ chỉ số thị trường rộng (S&P 500, VN30). Lý do: đa dạng hóa tức thì, không cần phân tích cổ phiếu, chi phí quản lý cực thấp. DCA vào một cổ phiếu lẻ mang rủi ro doanh nghiệp — cổ phiếu đó có thể không bao giờ hồi phục.

**Kỷ luật thép — Không bao giờ ngắt quãng:**
Điểm yếu lớn nhất của DCA là người dùng từ bỏ đúng lúc thị trường "đổ máu" — tức là khi cần mua nhất. Hãy cam kết: *"Không mua thêm vì thị trường tăng mạnh. Không ngừng mua vì thị trường giảm mạnh."*

**Tầm nhìn dài hạn 20-30 năm:**
Lãi kép của DCA chỉ thực sự phát huy khi duy trì đủ dài — lý tưởng nhất là 20-30 năm cho mục tiêu nghỉ hưu. Rút tiền sớm phá vỡ toàn bộ cơ chế tích lũy.`,
    },
    {
        type: 'key-insight',
        title: '💡 DCA Biến "Tin Xấu" Thành Lợi Thế',
        content: 'Đây là sự đảo ngược tâm lý quan trọng nhất: người đang tích lũy (chưa đến lúc rút tiền) nên MUỐN thị trường giảm, không phải sợ nó. Khi thị trường giảm 30%, tiền DCA hàng tháng mua được nhiều hơn 43% số cổ phần. Những ai kiên trì DCA qua 2008 và 2020 đều thu lợi khổng lồ khi phục hồi — vì giá vốn trung bình của họ rất thấp.',
    },
    {
        type: 'quote',
        content: '"Không có công thức đầu tư nào mang lại niềm tin thành công lớn như bình quân chi phí đô-la, bất chấp mọi biến động giá cả. Phương pháp này không đòi hỏi thiên tài dự đoán — chỉ cần kỷ luật sắt đá."',
        author: 'Lucile Tomlinson',
        source: 'Practical Formulas for Successful Investing',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'DCA = mua cố định định kỳ → tự động mua nhiều khi giá thấp, ít khi giá cao → giá vốn TB luôn thấp hơn giá TB thị trường',
            'Không ai (kể cả quỹ chuyên nghiệp) dự đoán được thị trường nhất quán — chờ "giá tốt" = mất cơ hội',
            'Lịch sử: DCA vượt qua 1929 (lãi khi đầu tư 1 lần lỗ), dot-com 2001, và tạo x8 vốn qua 28 năm',
            'Chỉ DCA vào ETF/Index Fund — không vào cổ phiếu lẻ (rủi ro doanh nghiệp không phục hồi được)',
            'Kỷ luật tuyệt đối: không ngừng mua khi thị trường giảm — đó chính xác là lúc DCA hiệu quả nhất',
            'Tầm nhìn 20-30 năm: lãi kép chỉ phát huy tác dụng thực sự khi kiên trì đủ dài',
        ],
    },
]
