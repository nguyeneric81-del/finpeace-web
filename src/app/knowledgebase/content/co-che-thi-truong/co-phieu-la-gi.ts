// Article content: co-che-thi-truong / co-phieu-la-gi
// "Cổ phiếu là gì? Bạn thực sự mua gì khi bấm 'Đặt lệnh'?"

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Benjamin Graham – người thầy của Warren Buffett – đã khẳng định một nguyên lý cốt lõi: Một cổ phiếu không chỉ là ký hiệu trên bảng điện hay chấm sáng điện tử; nó là quyền lợi sở hữu trong một doanh nghiệp thực sự, có một giá trị cơ sở không phụ thuộc vào giá trên màn hình.

Hầu hết nhà đầu tư đang bỏ lỡ điều quan trọng nhất này. Họ nhìn vào bảng điện và thấy những con số nhấp nháy — nhưng quên rằng đằng sau mỗi mã cổ phiếu là một doanh nghiệp với nhà máy, nhân viên, khách hàng và dòng tiền thực sự.`,
    },
    {
        type: 'key-insight',
        title: '💡 Phép Tính Đơn Giản Nhất',
        content: 'Nếu bạn mua cổ phiếu giá 30.000 VNĐ của một công ty có 1 tỷ cổ phiếu đang lưu hành — bạn đang định giá toàn bộ doanh nghiệp đó ở mức 30 nghìn tỷ VNĐ. Mỗi lần bấm "Đặt lệnh" là một lần bạn ngầm tuyên bố: "Tôi đồng ý rằng công ty này trị giá bằng đó."',
    },
    {
        type: 'steps',
        title: '📋 Phân Biệt 4 Loại Công Cụ Đầu Tư',
        content: '',
        items: [
            {
                icon: '👑',
                title: 'Cổ Phiếu Thường — Common Stock',
                highlight: 'Sở hữu + biểu quyết + tăng trưởng vô hạn',
                body: 'Quyền sở hữu THỰC SỰ trong doanh nghiệp. Bạn có quyền bầu Hội đồng Quản trị, nhận cổ tức, và hưởng toàn bộ lợi nhuận tăng trưởng. Rủi ro cao nhất nhưng tiềm năng vô hạn. Warren Buffett trở nên giàu có chính nhờ loại cổ phiếu này.',
            },
            {
                icon: '⚖️',
                title: 'Cổ Phiếu Ưu Đãi — Preferred Stock',
                highlight: 'Cổ tức cố định, không biểu quyết',
                body: 'Lai giữa cổ phiếu và trái phiếu — cổ tức cố định được ưu tiên trả trước cổ đông thường. Khi phá sản được ưu tiên thanh lý. Graham cảnh báo: mất quyền đòi nợ như trái phiếu nhưng cũng không hưởng trọn đà tăng trưởng. "Thế giới tệ nhất của cả hai."',
            },
            {
                icon: '🏦',
                title: 'Trái Phiếu — Bonds',
                highlight: 'Chủ nợ, lãi suất cố định, an toàn hơn',
                body: 'Bạn là "CHỦ NỢ" chứ không phải "chủ sở hữu". Công ty bắt buộc trả lãi cố định và hoàn vốn gốc khi đáo hạn. Được ưu tiên trả trước cổ đông khi công ty phá sản. An toàn hơn cổ phiếu nhưng lợi nhuận bị giới hạn ở mức lãi suất đã cam kết.',
            },
            {
                icon: '🧺',
                title: 'ETF — Quỹ Hoán Đổi Danh Mục',
                highlight: 'Đa dạng hóa ngay, chi phí thấp',
                body: 'Mua 1 ETF VN30 = sở hữu 30 công ty lớn nhất Việt Nam cùng lúc. Giao dịch trên sàn như cổ phiếu thường, giá thay đổi liên tục trong ngày. Phù hợp cho nhà đầu tư mới muốn đa dạng hóa ngay lập tức mà không cần chọn từng cổ phiếu.',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Một cổ phiếu không chỉ là ký hiệu trên bảng điện. Nó là quyền lợi sở hữu trong một doanh nghiệp thực sự, có một giá trị cơ sở không phụ thuộc vào giá cổ phiếu của nó."',
        author: 'Benjamin Graham',
        source: 'The Intelligent Investor (1949)',
    },
    {
        type: 'checklist',
        title: '✅ Phân Biệt 4 Loại Công Cụ Đầu Tư',
        content: [
            'Cổ phiếu thường (Common Stock): Quyền sở hữu thực sự — có quyền biểu quyết, nhận cổ tức, hưởng toàn bộ tăng trưởng. Rủi ro cao nhất, tiềm năng vô hạn. Buffett giàu nhờ loại này',
            'Cổ phiếu ưu đãi (Preferred Stock): Lai giữa cổ phiếu và trái phiếu — cổ tức cố định, được ưu tiên khi phá sản, nhưng không có quyền biểu quyết và không hưởng trọn đà tăng trưởng. Graham cảnh báo: mất quyền chủ nợ nhưng cũng không phải đối tác thực sự',
            'Trái phiếu (Bonds): Bạn là "chủ nợ", không phải "chủ sở hữu" — công ty phải trả lãi cố định và hoàn vốn gốc khi đáo hạn. An toàn hơn nhưng lợi nhuận bị giới hạn',
            'ETF (Quỹ hoán đổi danh mục): "Rổ" nhiều cổ phiếu — mua 1 ETF VN30 = sở hữu 30 công ty lớn nhất Việt Nam cùng lúc. Đa dạng hóa ngay lập tức với chi phí thấp, giao dịch như cổ phiếu thường',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Cạm Bẫy "Cổ Phiếu Ưu Đãi" — Không Tốt Như Tên Gọi',
        content: 'Benjamin Graham cảnh báo rõ: Cổ phiếu ưu đãi là sản phẩm "thế giới tệ nhất của cả hai" — bạn mất quyền đòi nợ hợp pháp như trái phiếu, nhưng cũng không được hưởng tiềm năng tăng trưởng không giới hạn như cổ phiếu thường. Trên TTCK Việt Nam, nhiều nhà đầu tư mới bị thu hút bởi tên gọi "ưu đãi" mà không hiểu rõ bản chất. Luôn đọc kỹ bản cáo bạch trước khi mua.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Cổ phiếu = quyền sở hữu một phần doanh nghiệp — không phải tờ giấy để mua đi bán lại kiếm chênh lệch',
            'CEO và Ban lãnh đạo làm việc CHO BẠN — khi mua cổ phiếu, bạn là ông chủ',
            'Khác biệt 4 loại: Common Stock (sở hữu) → Preferred Stock (lai) → Bonds (chủ nợ) → ETF (rổ đa dạng)',
            '"Đầu cơ" = mua vì kỳ vọng người khác mua lại giá cao hơn. "Đầu tư" = mua vì tin vào giá trị doanh nghiệp',
            'Bước tiếp theo: Xem bài Cách Đặt Lệnh để hiểu cơ chế kỹ thuật khi giao dịch trên HOSE/HNX',
        ],
    },
]
