import type { ContentBlock } from '../../data'

export const vviaBankStb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Game Tái Cơ Cấu Thế Kỷ - Phượng Hoàng Tắm Lửa',
        content: 'Sacombank (STB) không dành cho những ai thích phân tích báo cáo tài chính đi ngang. Đây là "Game Turnaround" lớn hiếm hoi còn lại của ngành ngân hàng Việt Nam, đánh cược vào cục diện đấu giá KCN Phong Phú và việc dọn sạch Trái phiếu VAMC.'
    },
    {
        type: 'key-insight',
        title: '🔥 Tầng 1 (Chất Xúc Tác Tái Cơ Cấu): Giờ G Đã Điểm?',
        content: '- Lợi nhuận hàng năm của STB thực chất rất khủng lên tới 10-15 ngàn tỷ, nhưng suốt bao năm qua đều bị đem đi "trích lập sạch bách" để dọn dẹp hậu quả sáp nhập Ngân hàng Phương Nam ngày xưa.\n- Khi STB trích lập xong 100% rác VAMC, lợi nhuận thực sẽ bùng nổ, kéo theo sự phục hồi định giá dữ dội kèm theo câu chuyện bán vốn 32% (game thâu tóm ngân hàng).'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Áp Lực Bộ Đệm Mỏng)',
        content: '- Sacombank hiện có rủi ro cao đối với nợ xấu nếu có một cú sốc kinh tế bất thình lình, do LLR của họ rất mỏng (chỉ 70-80%). Sacombank không có dư địa "Đệm" như Big4.\n- CASA của STB đang suy kiệt do thiếu các nguồn sinh thái lớn như Viettel hay Vingroup hỗ trợ.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'STB',
            coreProfit: 12000,
            totalLoan: 480000,
            baseCASA: 18.0,
            baseNPL: 2.2,
            baseLLR: 70.0,
            costOfFundsGap: 180,
            currentEquity: 45000,
            sharesOutstanding: 1885,
            currentPrice: 31000
        }
    },
    {
        type: 'summary',
        content: [
            'STB là bài toán X2 tài khoản cho kẻ liều lĩnh canh đúng điểm rơi của Đề án tái cơ cấu.',
            'Nếu việc bán vốn hoãn lại liên tục, nhà đầu tư của STB sẽ phải gồng mình trong thất vọng. Bạn có thể định giá STB ở P/B 1.8x trong viễn cảnh thâu tóm, nhưng chỉ ở mức 1.0x nếu cục máu đông chưa vỡ.'
        ]
    }
]
