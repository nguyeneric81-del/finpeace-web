import type { ContentBlock } from '../../data'

export const vviaBankAcb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Trường Thành Phòng Thủ Tối Thượng Của Ngành Ngân Hàng',
        content: 'Nếu VCB là anh lớn siêu quốc doanh an toàn, thì ở khối tư nhân, ACB là "Nhà tu hành" khắc kỷ. Nói không với trái phiếu doanh nghiệp rủi ro, không dính líu đến các dự án tay sau BĐS, chiến lược của ACB là bám rễ vào cho vay khách hàng cá nhân và SME truyền thống.'
    },
    {
        type: 'key-insight',
        title: '🛡️ Tầng 1 (Chất Lượng Tài Sản Tinh Khiết)',
        content: '- **Tín Dụng Pha Lê:** Gần như toàn bộ sổ sách ACB trống trơn trái phiếu doanh nghiệp (chứ không ôm bom nghẽn chìm như một vài cái tên khác). Dư nợ được xé nhỏ chia đều, hạn chế sự tập trung rủi ro vào một vài đại gia.\n- **Quản trị Rủi Ro (NPL thấp):** Tỷ lệ nợ xấu quản lý siêu ngặt nghèo (< 1%). Đây là di sản của sự thận trọng sau các bài học đắt giá trong quá khứ.'
    },
    {
        type: 'key-insight',
        title: '🟢 Tầng 2 (Bài Toán Hiệu Quả Không Cần Bơm Thổi)',
        content: '- Dù cực kỳ cẩn thận, tỷ suất sinh lời (ROE) của ACB vẫn thường trực ở mức trên 20%+, sánh ngang các ngân hàng năng động nhất. \n- Khả năng quản trị chi phí chéo và tận tâm với khách hàng cá nhân khiến vòng quay vốn của ACB rất hiệu quả. ACB giống như một cỗ xe ô tô đi vận tốc đều đặn 60km/h trên đường băng dài vô tận, không đua top nhưng không bao giờ trượt bánh.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'ACB',
            coreProfit: 20000,
            totalLoan: 480000,
            baseCASA: 22.0,
            baseNPL: 1.0,
            baseLLR: 90.0,
            costOfFundsGap: 180,
            currentEquity: 70000,
            sharesOutstanding: 3884,
            currentPrice: 28000
        }
    },
    {
        type: 'summary',
        content: [
            'ACB không bay bổng theo những game phát hành khủng hay game BĐS. Đây là khoản đầu tư cho những cái đầu lạnh lùng đòi hỏi ăn ngon, ngủ kỹ.',
            'Kéo nhẹ thanh trượt Định giá P/B, chỉ cần thị trường trả một P/B hợp lý khoảng 1.5x - 1.8x cho một viên ngọc thuần khiết, đó đã là mức định giá đủ để nhà đầu tư ung dung.'
        ]
    }
]
