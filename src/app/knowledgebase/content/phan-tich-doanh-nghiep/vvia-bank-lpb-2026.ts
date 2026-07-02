import type { ContentBlock } from '../../data'

export const vviaBankLpb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Mãnh Hổ Lột Xác Sau Cuộc Chiến Lãnh Đạo',
        content: 'Từ LienVietPostBank trở thành LPBank, sự thay đổi toàn diện dưới bàn tay của Tập đoàn tư nhân hàng đầu đã đẩy LPB thành một "Hiện tượng" tăng giá rầm rộ nhất năm. Câu chuyện của LPB là câu chuyện về định hình lại tham vọng quyền lực và M&A.'
    },
    {
        type: 'key-insight',
        title: '📮 Tầng 1 (Tham Vọng Top Đầu Lợi Nhuận)',
        content: '- **Bộ máy quyết liệt:** LPBank đặt mục tiêu đột phá về lợi nhuận vào thẳng "Câu lạc bộ 10 tỷ", tốc độ tăng trưởng điên rồ nhờ việc quyết liệt xử lý vấn đề nhân sự và dọn dẹp các khoản vay cũ.\n- **Mạng lưới Bưu Điện (Bất khả chiến bại):** Kế thừa mạng lưới phòng giao dịch bưu điện sâu rộng xuống tới từng xã/thôn, khả năng huy động vốn của giới Nông thôn là mỏ vàng chưa được khai thác hết.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Lối Rẽ Nhanh Chứa Lỗ Hổng Nợ Xấu)',
        content: '- Tiết diện tăng trưởng quá nhanh luôn đối mặt với vấn đề Chất Lượng Tín Dụng bị loãng. Mặc dù LLR của LPB đang ở mức trung bình khá (~85%), nhưng nếu kinh tế bất ổn, tệp khách vay vi mô mảng nông nghiệp/bán lẻ rất dễ bung nợ sấu diện rộng.\n- CASA của LPB khá thấp (~10%), phần lớn dòng vốn của họ vẫn đi từ sổ tiết kiệm với giá đắt đỏ, nên NIM sẽ gãy mạnh nếu chi phí huy động đầu vào vọt lên.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'LPB',
            coreProfit: 6000,
            totalLoan: 250000,
            baseCASA: 10.0,
            baseNPL: 1.5,
            baseLLR: 85.0,
            costOfFundsGap: 110,
            currentEquity: 30000,
            sharesOutstanding: 2557,
            currentPrice: 17000
        }
    },
    {
        type: 'summary',
        content: [
            'Cổ phiếu LPB mang nặng tính chất "Đánh nhịp" và game chủ sở hữu. Nếu bạn yêu thích sóng cờ bạc quyền lực, LPB là lựa chọn tuyệt vời.',
            'Tuy nhiên, định giá P/B hiện tại đã phình to do dòng tiền FOMO M&A. Kéo thử mức P/B về "Giá trị tự nhiên" (khoảng 1.2x) bạn sẽ biết hiện tượng rủi ro là như thế nào.'
        ]
    }
]
