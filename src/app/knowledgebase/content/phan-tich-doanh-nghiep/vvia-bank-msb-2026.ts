import type { ContentBlock } from '../../data'

export const vviaBankMsb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Ngôi Sao "CASA Tàng Hình" Có Thực Sự Lấp Lánh?',
        content: 'Maritime Bank (MSB) là một ngân hàng tầm trung cực kỳ thú vị. Luôn bám đuôi tranh giành Top 3 CASA cùng siêu sao MBB/TCB/VCB nhờ tệp B2B ngành Vận Tải, Dịch Vụ và khối khách Cảng Biển nội bộ.'
    },
    {
        type: 'key-insight',
        title: '🌟 Tầng 1 (Chỉ Số Quý Tộc Vùng Giữa)',
        content: '- **CASA đỉnh cao (~28%):** Việc MSB, một ngân hàng Tier 2, lại duy trì CASA tỷ lệ rất cao giúp giá vốn đầu vào của họ ngang ngửa các ngân hàng hạng 1. \n- **Thu nhập ngoài lãi xuất sắc:** MSB làm rất tốt nghiệp vụ thu ngoại tệ, thư tín dụng (L/C) nhờ định danh cốt lõi Hàng Hải (Maritime).'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Bo Cung và Chướng Ngại Nợ Vay Mở Rộng)',
        content: '- LLR của MSB duy trì khá phòng thủ ở ngưỡng ~70%, chưa gọi là tốt xuất sắc nhưng đủ dùng cho thời bình. Nhưng do bản chất thị phần tín dụng kẹt ở phân khúc Khách Hàng quy mô vừa (SMEs) rất mẫn cảm chu kỳ - Nợ xấu dễ trồi sụt.\n- Cổ phiếu mang tính bo cung khá mạnh (Cầm trịch bởi TNG Holding và các gia tộc đằng sau).'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'MSB',
            coreProfit: 5500,
            totalLoan: 155000,
            baseCASA: 28.0,
            baseNPL: 1.8,
            baseLLR: 70.0,
            costOfFundsGap: 95,
            currentEquity: 28000,
            sharesOutstanding: 2000,
            currentPrice: 15000
        }
    },
    {
        type: 'summary',
        content: [
            'MSB là một ngân hàng cơ bản siêu tốt nhưng giá P/B luôn quanh quẩn vùng thấp cực đoan (<1.0x).',
            'Sân chơi của MSB rất kén nhà đầu tư do thiếu "cú hích lan man". Định giá hiện tại là quá an toàn (Mức giá đã Under-value BVPS).'
        ]
    }
]
