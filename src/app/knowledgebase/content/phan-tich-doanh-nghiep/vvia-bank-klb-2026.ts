import type { ContentBlock } from '../../data'

export const vviaBankKlb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Kiên Long Bank - Khát Khao Vương Lên Từ Khối Nhà Băng Địa Phương',
        content: 'KLB từng nằm thu mình êm đềm ở khu vực Đồng bằng Sông Cửu Long, nhưng câu chuyện đấu đá và rò rỉ hình bóng của Sunshine Group đã đẩy KLB lên một diễn đàn nóng bỏng hơn.'
    },
    {
        type: 'key-insight',
        title: '🌾 Tầng 1 (Nông nghiệp Tỉnh lẻ & Câu Chuyện BĐS)',
        content: '- **Tệp khách cổ điển:** Đa phần tập trung vào tín dụng nông nghiệp, đặc biệt các khoản vay nhỏ tại Kiên Giang và các tỉnh miền Tây.\n- Trong quá khứ, vướng lùm xùm dự án BĐS tài sản đảm bảo của ông Trầm Bê khiến KLB mất thời gian khá lớn để dọn dẹp sạch sổ sách.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Thiếu Hệ Sinh Thái Đa Dạng)',
        content: '- Thiếu những sản phẩm Fintech nổi trội, thiếu CASA. Mọi hoạt động của KLB phụ thuộc vào tín dụng lãi suất cao.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'KLB',
            coreProfit: 700,
            totalLoan: 45000,
            baseCASA: 4.5,
            baseNPL: 2.5,
            baseLLR: 40.0,
            costOfFundsGap: 160,
            currentEquity: 6000,
            sharesOutstanding: 360,
            currentPrice: 14000
        }
    },
    {
        type: 'summary',
        content: [
            'Cổ phiếu thanh khoản khiêm tốn. Chủ yếu dành cho các nhóm mua bán sang tay.',
            'LLR 40% là chỉ báo báo động cho một ngân hàng địa phương trước rủi ro El Nino và thời tiết (ảnh hưởng người vay nông nghiệp).'
        ]
    }
]
