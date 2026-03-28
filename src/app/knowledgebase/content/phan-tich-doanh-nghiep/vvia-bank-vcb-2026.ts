import type { ContentBlock } from '../../data'

export const vviaBankVcb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Bức Tường Thành Của Hệ Thống Dưới Lăng Kính An Toàn',
        content: 'Vietcombank luôn được định giá ở ngưỡng P/B cao ngất ngưởng so với toàn ngành. Lý do không phải vì VCB tăng trưởng nóng nhất, mà vì họ sỡ hữu "Tảng băng trôi" dự phòng (LLR) khổng lồ và tập Khách hàng Doanh nghiệp FDI / Nhà nước chất lượng nhất hệ thống, mang lại dòng tiền bấp chấp chu kỳ suy thoái.'
    },
    {
        type: 'key-insight',
        title: '🛡️ Tầng 1 (An Toàn - Graham): Kháng Thể Bất Diệt',
        content: '- **Bao phủ Nợ Xấu (LLR):** Thường xuyên duy trì quanh ngưỡng 200% - 300%. Nghĩa là cứ 1 đồng nợ xấu, VCB đã trích sẵn 2-3 đồng dự phòng trong két. Nếu nợ xấu có tăng vọt, lợi nhuận của VCB gần như miễn nhiễm.\n- **Chất lượng tài sản:** Thuộc hàng "Tier 1" vì bộ lọc tín dụng cực kỳ khắt khe, Nợ xấu (NPL) luẩn quẩn dưới 1%.'
    },
    {
        type: 'key-insight',
        title: '🏆 Tầng 2 (Con Hào - Buffett): Dòng Vốn Không Đồng',
        content: 'Không cần app màu mè hay khuyến mãi rầm rộ, VCB luôn là lựa chọn thanh toán mặc định của Ngân sách Nhà nước, các Tập đoàn mẹ và khối FDI. Khối lượng tiền kho bạc khổng lồ nằm im bất động trong VCB tạo ra dòng sông CASA rẻ mạt không ai sánh kịp.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'VCB',
            coreProfit: 40000,
            totalLoan: 1200000,
            baseCASA: 30.0,
            baseNPL: 1.0,
            baseLLR: 200.0,
            costOfFundsGap: 500,
            currentEquity: 160000,
            sharesOutstanding: 5589,
            currentPrice: 90000
        }
    },
    {
        type: 'summary',
        content: [
            'Vietcombank không dành cho những tay lướt sóng kỳ vọng X2, X3 tài khoản. Đây là hầm trú ẩn hạt nhân.',
            'Kể cả khi bạn kéo Nợ xấu lên ngưỡng khủng hoảng 5%, bạn sẽ thấy lợi nhuận của VCB vẫn sừng sững không gục ngã vì LLR quá dày. Định giá P/B của VCB luôn xứng đáng nằm ở mức Premium (2.5x - 3.0x).'
        ]
    }
]
