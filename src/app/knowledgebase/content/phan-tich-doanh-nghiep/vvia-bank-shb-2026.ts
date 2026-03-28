import type { ContentBlock } from '../../data'

export const vviaBankShb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Kho Tự Chứa Khủng Của Bầu Hiển - Big Đánh Game Biên Độ Dữ Dội',
        content: 'SHB là Ngân hàng Thương mại tư nhân thuộc Top 5 quy mô lớn nhất (Tổng tài sản > 500 nghìn tỷ VNĐ), nhưng luôn sống chung với danh hiệu "Cổ phiếu nặng mông" do khối lượng trôi nổi khổng lồ. SHB cũng là bầu sữa tài chính cho các đại đô thị BĐS tập đoàn tư nhân dưới trướng T&T Group.'
    },
    {
        type: 'key-insight',
        title: '🌊 Tầng 1 (Scale Siêu Khủng - Tính Sát Phạt Lớn)',
        content: '- **Sóng thần Game Sáp Nhập:** SHB luôn tạo sóng bằng game phát hành thêm chia giấy, M&A (Sáp nhập Habubank trước đây) và lợi nhuận đột biến từ chi phí ghi nhận một lần.\n- Về mặt báo cáo, SHB kiếm tiền khủng (lợi nhuận hơn 9k tỷ), nhưng thường bị NĐT lo ngại do tỷ lệ cấp tín dụng cho các dự án nội bộ nhạy cảm.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Bẫy Nợ Xấu Vô Hình)',
        content: '- SHB là một trong những ngân hàng có Tỷ lệ bao phủ nợ xấu (LLR) rất mỏng (chỉ quanh 60%) so với quy mô cho vay của mình. \n- CASA của SHB cũng chưa bao giờ vượt mốc 10% (do ko có lượng tiền thặng dư cá nhân đổ vào nhiều). Chênh lệch lãi suất của SHB luôn bị bóp nghẹt mỗi đợt "chiến tranh hút tiền tiết kiệm".'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'SHB',
            coreProfit: 9500,
            totalLoan: 450000,
            baseCASA: 8.5,
            baseNPL: 2.7,
            baseLLR: 60.0,
            costOfFundsGap: 190,
            currentEquity: 45000,
            sharesOutstanding: 3619,
            currentPrice: 12000
        }
    },
    {
        type: 'summary',
        content: [
            'SHB dành cho những dòng tiền "Canh bắt đáy và Đợi gió đông". Không thích hợp để mua tích sản vì biên độ ăn dầy/cháy rụi siêu cao.',
            'Thử kéo nhẹ Nợ Xấu lên. Vì LLR = 60%, vốn chủ sở hữu của SHB sẽ bị thiêu rụi siêu nhanh trước sức ép dự phòng của "Trái phiếu Bất động sản".'
        ]
    }
]
