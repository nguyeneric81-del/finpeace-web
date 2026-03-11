// Article content: co-che-thi-truong / cach-dat-lenh
// "Lệnh MP, LO, ATO, ATC: Bộ công cụ cơ bản trên sàn"

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Một trong những sai lầm đắt giá nhất của nhà đầu tư không phải là chọn sai cổ phiếu — mà là đặt sai loại lệnh. Bạn có thể phân tích đúng, nhưng vẫn mất tiền hoặc lỡ cơ hội chỉ vì không hiểu rõ cơ chế vận hành của hệ thống giao dịch.

Trên sàn HOSE và HNX Việt Nam, có 4 loại lệnh cơ bản mà mọi nhà đầu tư phải nắm nằm lòng: LO, MP, ATO và ATC. Mỗi loại được sinh ra để giải quyết một tình huống cụ thể — dùng nhầm là trả học phí.`,
    },
    {
        type: 'key-insight',
        title: '💡 Quy Tắc Vàng',
        content: 'Không có loại lệnh nào "tốt nhất" — chỉ có loại lệnh phù hợp nhất với từng tình huống. Thanh khoản cao + bứt phá → MP. Tích lũy đi ngang → LO. Muốn chắc chắn vào/ra cùng dòng tiền tổ chức → ATO/ATC.',
    },
    {
        type: 'steps',
        title: '📋 Giải Mã 4 Loại Lệnh',
        content: '',
        items: [
            {
                icon: '🎯',
                title: 'Lệnh LO — Limit Order (Lệnh Giới Hạn)',
                highlight: 'Kiểm soát hoàn toàn giá',
                body: 'Mua hoặc bán tại mức giá CỤ THỂ hoặc tốt hơn. Bảo vệ bạn khỏi biến động bất ngờ — bạn biết chính xác giá tệ nhất mình chấp nhận. Nhược điểm: không đảm bảo được khớp nếu thị trường không chạm giá của bạn.',
            },
            {
                icon: '⚡',
                title: 'Lệnh MP — Market Order (Lệnh Thị Trường)',
                highlight: 'Khớp ngay, không kiểm soát giá',
                body: 'Mua/bán NGAY LẬP TỨC ở mức giá tốt nhất hiện có — không quan tâm đến giá cụ thể. Trên HOSE gọi là MP; HNX có biến thể MAK, MOK, MTL. Đảm bảo khớp lệnh ngay nhưng nguy cơ trượt giá cao nếu thanh khoản thấp.',
            },
            {
                icon: '🌅',
                title: 'Lệnh ATO — At The Opening',
                highlight: 'HOSE, 9h00–9h15',
                body: 'Lệnh giao dịch tại giá XÁC ĐỊNH MỞ CỬA. Ưu tiên khớp lệnh cao nhất — đứng trước cả lệnh LO. Bạn ngầm đồng ý chấp nhận bất kỳ mức giá mở cửa nào ngày hôm đó.',
            },
            {
                icon: '🌆',
                title: 'Lệnh ATC — At The Closing',
                highlight: 'HOSE & HNX, 14h30–14h45',
                body: 'Tự động khớp tại giá ĐÓNG CỬA cuối ngày. Giá ATC đặc biệt quan trọng vì được dùng để xác định margin calls và tín hiệu kỹ thuật. Vào/ra cùng dòng tiền tổ chức mà không cần theo dõi từng bước giá trong 15 phút cuối.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Các nhà giao dịch nghiệp dư thường có thói quen xấu là liên tục đặt lệnh giới hạn (Limit Order). Cuối cùng, vì mặc cả từng phần nhỏ, họ đánh mất cơ hội bắt được một cổ phiếu chiến thắng có khả năng tăng giá gấp 3 lần."',
        author: 'William J. O\'Neil',
        source: 'How to Make Money in Stocks',
    },
    {
        type: 'checklist',
        title: '✅ 3 Case Study Thực Chiến — Khi Nào Dùng Lệnh Nào?',
        content: [
            'Case 1 — LỠ TÀU vì LO: VNM bứt phá khỏi vùng kháng cự 70.0, bạn đặt LO mua ở 69.5 vì muốn "mua rẻ hơn". Cổ phiếu tăng thẳng lên 75, lệnh không bao giờ khớp. → Bứt phá mạnh + thanh khoản cao = dùng MP hoặc LO ở giá trần',
            'Case 2 — TRƯỢT GIÁ thảm vì MP: Cổ phiếu X thanh khoản thấp, bạn hoảng loạn ném lệnh Bán MP. Lệnh quét sạch bên mua giá thấp, khớp ngay tại giá sàn 18.0 thay vì 20.0 — lỗ 10% trong 1 giây. → Thanh khoản thấp = dùng LO hoặc Stop Limit Order, tuyệt đối không dùng MP',
            'Case 3 — ATC để vào/ra cùng tổ chức: Muốn chốt lời nhưng sợ bị tổ chức "đánh" giá trong 15 phút cuối. Dùng lệnh ATC → tự động khớp tại giá cân bằng cuối ngày, không cần theo dõi từng bước giá, vào/ra cùng dòng tiền lớn',
            'Tóm gọn: LO → tích lũy/bán dần có kiểm soát | MP → bứt phá / cắt lỗ khẩn (cổ phiếu lớn) | ATO/ATC → muốn chắc chắn khớp ở phiên đấu giá đặc biệt',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Lệnh MP Là Con Dao Hai Lưỡi — Đừng Lạm Dụng',
        content: 'MP đảm bảo khớp lệnh nhưng không đảm bảo giá. Với cổ phiếu vốn hóa lớn, thanh khoản tốt (VNM, VIC, HPG, MWG...) — trượt giá nhỏ, chấp nhận được. Với cổ phiếu vốn hóa nhỏ, thanh khoản thấp (penny stocks) — một lệnh MP bán có thể đẩy giá xuống đáy phiên chỉ trong vài giây. Nguyên tắc: không bao giờ dùng MP cho cổ phiếu có khối lượng giao dịch trung bình dưới 100,000 cổ/ngày.',
    },
    {
        type: 'summary',
        title: '📋 Bảng Tóm Tắt Tình Huống',
        content: [
            'LO: Thị trường đi ngang, muốn gom/bán từ từ ở giá cố định, sẵn sàng chờ đợi',
            'MP: Cổ phiếu bứt phá mạnh + thanh khoản CAO, hoặc cắt lỗ khẩn cấp (cổ phiếu lớn)',
            'ATO (9h00–9h15, HOSE): Muốn chắc chắn mua/bán ngay khi mở cửa, không quan tâm giá',
            'ATC (14h30–14h45, HOSE & HNX): Muốn vào/ra cùng dòng tiền tổ chức ở giá đóng cửa, xác nhận tín hiệu kỹ thuật',
            'Bước tiếp theo: Học bài Hỗ Trợ & Kháng Cự để biết đặt giá LO ở đâu hợp lý nhất',
        ],
    },
]
