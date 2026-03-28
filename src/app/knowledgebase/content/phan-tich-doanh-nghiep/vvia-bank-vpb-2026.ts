import type { ContentBlock } from '../../data'

export const vviaBankVpb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Cỗ Máy Đốt Cháy Giai Đoạn Bằng Tín Dụng Rủi Ro Cao',
        content: 'VPBank theo đuổi triết lý "High Risk, High Return". Đi đầu trong mảng cho vay tiêu dùng (qua FE Credit) và tài chính vi mô, VPBank tạo ra mức Biên lợi nhuận (NIM) bỏ xa hoàn toàn mảng ngân hàng truyền thống, nhưng bù lại là một áp lực Trích lập dự phòng "đáy không thấy lỗ".'
    },
    {
        type: 'key-insight',
        title: '🔥 Tầng 1 (NIM Và Khẩu Vị Rủi Ro Cực Hạn)',
        content: '- **NIM Chót Vót:** VPB thường duy trì NIM từ 7% - 9% (trong khi các Big4 chỉ lẹt đẹt 3-4%). Bằng cách cho vay tín chấp với lãi phế cao, doanh thu của VPBank phình to chớp nhoáng.\n- **Hệ lụy NPL:** Nhưng lãi cao đi kèm bùng nợ. Tỷ lệ nợ xấu (NPL) của hệ thống VPB thường neo ở mức rất cao (có lúc 5-7%) do tập khách hàng vay dưới chuẩn nhạy cảm với khó khăn kinh tế.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Bộ Đệm Mỏng Manh)',
        content: '- Để vắt kiệt công suất lợi nhuận, VPB không trích lập LLR quá cao (thường chỉ loanh quanh 50-60%). Nghĩa là nếu tệp tín chấp không trả nợ hàng loạt, lợi nhuận của VPB sẽ rơi tự do xuống thung lũng ngay lập tức.\n- Rủi ro này được SMBC (Nhật Bản) rót hơn 1.5 tỷ USD vào mua cổ phần để đắp thanh khoản, trở thành tấm khiên đỡ đạn tốt nhất cho VPBank lúc nguy nan.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'VPB',
            coreProfit: 12000,
            totalLoan: 550000,
            baseCASA: 15.0,
            baseNPL: 5.5,
            baseLLR: 50.0,
            costOfFundsGap: 220,
            currentEquity: 140000,
            sharesOutstanding: 7934,
            currentPrice: 19000
        }
    },
    {
        type: 'summary',
        content: [
            'VPBank là con ngựa non ngựa núi. Nếu chọn nắm giữ dài hạn ở đỉnh chu kỳ kinh tế thì đây là tai họa vì nợ xấu sẽ ăn rỗng lợi nhuận.',
            'Hãy thử kéo thanh trượt Nợ Xấu lên thêm 3% trong Widget, bạn sẽ thấy lợi nhuận bốc hơi nhanh đến mức nào do không có LLR đỡ đạn! Ngược lại, bắt đúng chân sóng phục hồi bơm tiền, VPB là cỗ máy hồi sinh in tiền ác liệt nhất.'
        ]
    }
]
