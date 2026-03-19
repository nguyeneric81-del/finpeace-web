// Article content for: quan-tri-rui-ro / drawdown-recovery
// Drawdown & Phục Hồi: Tại Sao Mất 50% Cần Lãi 100% Để Hòa Vốn

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Có một bài toán toán học đơn giản mà hầu hết nhà đầu tư không bao giờ nghĩ đến — nhưng khi hiểu ra, nó thay đổi hoàn toàn cách họ nghĩ về rủi ro.

Bạn có 100 triệu. Thị trường giảm 50%. Bạn còn 50 triệu.

Câu hỏi: Cần lãi BAO NHIÊU PHẦN TRĂM để về lại 100 triệu?

Câu trả lời không phải là 50%. Câu trả lời là 100%.

Đây không phải là mẹo chơi chữ. Đây là toán học bất đối xứng của thua lỗ — và nó là lý do vì sao "Bảo toàn vốn" là quy tắc số 1 của mọi nhà đầu tư chuyên nghiệp, trước cả "Kiếm tiền".`,
    },
    {
        type: 'key-insight',
        title: '💡 Toán Học Bất Đối Xứng',
        content: 'Lãi và lỗ KHÔNG đối xứng nhau. Mất 10% cần lãi 11.1% để hòa vốn. Mất 25% cần lãi 33%. Mất 50% cần lãi 100%. Mất 75% cần lãi 300%. Mất 90% cần lãi 900%. Đây là lý do tại sao "cắt lỗ sớm" là règle bất di bất dịch.',
    },
    {
        type: 'steps',
        title: '📊 Bảng Drawdown vs. Lãi Cần Thiết Để Hòa Vốn',
        content: 'Bảng tra cứu nhanh — hãy ghi nhớ hoặc dán lên màn hình:',
        items: [
            {
                icon: '🟢',
                title: 'Drawdown -10%',
                body: 'Vốn còn: 90 triệu. Cần lãi: 11.1% để hòa vốn. Có thể phục hồi trong 1-2 tháng thị trường bình thường.',
                highlight: 'Ngưỡng an toàn — cắt lỗ ngay nếu đây là mức stop loss đã đặt trước',
            },
            {
                icon: '🟡',
                title: 'Drawdown -25%',
                body: 'Vốn còn: 75 triệu. Cần lãi: 33.3% để hòa vốn. Phục hồi mất 1-2 năm thị trường thuận lợi.',
                highlight: 'Ngưỡng cảnh báo — review toàn bộ danh mục ngay lập tức',
            },
            {
                icon: '🟠',
                title: 'Drawdown -50%',
                body: 'Vốn còn: 50 triệu. Cần lãi: 100% để hòa vốn. Đây là mức tương đương mua đúng đáy của một chu kỳ thị trường.',
                highlight: 'Ngưỡng nguy hiểm — nhiều người mất nhiều năm hoặc không bao giờ phục hồi',
            },
            {
                icon: '🔴',
                title: 'Drawdown -75%',
                body: 'Vốn còn: 25 triệu. Cần lãi: 300% để hòa vốn. Gần như không thể phục hồi mà không thay đổi hoàn toàn chiến lược.',
                highlight: 'Ngưỡng thảm họa — thường xảy ra khi dùng margin cao hoặc all-in một mã',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Quy tắc số 1: Không bao giờ mất tiền. Quy tắc số 2: Đừng bao giờ quên quy tắc số 1."',
        author: 'Warren Buffett',
        source: 'Berkshire Hathaway',
    },
    {
        type: 'concept',
        title: '📖 Maximum Drawdown (MDD) — Thước Đo Rủi Ro Quan Trọng Nhất',
        content: `Maximum Drawdown (MDD) đo mức giảm lớn nhất từ đỉnh xuống đáy trong một giai đoạn nhất định.

**Cách tính**: MDD = (Giá trị Đỉnh − Giá trị Đáy) / Giá trị Đỉnh × 100%

**Ứng dụng**: Khi đánh giá một quỹ đầu tư hay một hệ thống giao dịch, MDD quan trọng hơn lợi nhuận trung bình. Một quỹ đạt 30%/năm nhưng có MDD 60% sẽ khiến hầu hết nhà đầu tư bỏ cuộc trước khi thấy lợi nhuận đó.

**Câu hỏi vàng**: "Trong lịch sử, đây là mức drawdown cao nhất của hệ thống/danh mục này? Bạn có thể chịu được mức đó về mặt tâm lý và tài chính không?"`,
    },
    {
        type: 'checklist',
        title: '✅ Quy Tắc Bảo Toàn Vốn Thực Chiến',
        content: [
            'Đặt mức drawdown tối đa cho phép của toàn danh mục: thường 15-20%. Nếu vượt → dừng giao dịch và review',
            'Không bao giờ để một cổ phiếu đơn lẻ chiếm >20% danh mục (để một mã -70% không phá hủy portfolio)',
            'Sử dụng stop loss cứng cho từng vị thế: thường 7-10% từ giá mua',
            'Giảm position size khi đang trong chuỗi thua lỗ — không "gỡ" bằng cách đánh to hơn',
            'Duy trì tiền mặt 10-20% danh mục để có nguồn lực khi cơ hội xuất hiện trong khủng hoảng',
        ],
    },
    {
        type: 'concept',
        title: '🔄 Thời Gian Phục Hồi — Yếu Tố Thường Bị Bỏ Qua',
        content: `Không chỉ số tiền cần để hòa vốn là vấn đề — mà còn là thời gian.

VN-Index mất 3 năm (2007-2010) để phục hồi sau khủng hoảng tài chính toàn cầu. Nhiều cổ phiếu cá lẻ không bao giờ về lại đỉnh cũ.

Trong khi đó, nhà đầu tư bảo toàn được vốn (ví dụ thoát ra -15% thay vì -70%) có thể dùng tiền đó mua đáy và tăng trưởng, còn kẻ bị mắc kẹt phải chờ "hòa vốn" trong nhiều năm.

**Chi phí cơ hội của drawdown sâu** thường lớn hơn nhiều so với bản thân khoản lỗ.`,
    },
    {
        type: 'warning',
        title: '⚠️ Tránh "Averaging Down" Mù Quáng',
        content: 'Nhiều nhà đầu tư mới dùng chiến thuật "mua thêm khi giá giảm" — averaging down. Đây là con dao hai lưỡi: tốt khi bạn đúng về fundamental, nhưng nguy hiểm khi bạn đang bắt dao rơi. Mỗi lần mua thêm vào cổ phiếu đang giảm cần phải dựa trên phân tích mới, không phải trên "giá bình quân thấp hơn thôi". Và KHÔNG BAO GIỜ averaging down bằng tiền vay (margin).',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Toán học bất đối xứng: mất 50% phải lãi 100% để hòa vốn — bảo toàn vốn quan trọng hơn tối đa lợi nhuận',
            'Maximum Drawdown (MDD) là thước đo rủi ro quan trọng hơn lợi nhuận trung bình',
            'Đặt mức MDD tối đa cho phép của danh mục: 15-20% là ngưỡng khuyến nghị',
            'Dừng giao dịch và review toàn diện khi drawdown vượt ngưỡng cho phép',
            'Bước tiếp theo: Xem bài "Position Sizing" để học cách kiểm soát rủi ro từng lệnh',
        ],
    },
]
