import type { ContentBlock } from '../../data'

export const vviaBankTpb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'LiveBank, Gen Z Và Bước Đi Công Nghệ Hóa',
        content: 'TPBank (Ngân hàng Tiên Phong) mang đúng DNA của một ngân hàng thời đại số 4.0. Tiên phong áp dụng mô hình LiveBank không người trực cùng với giao diện hiện đại hút hồn giới trẻ GenZ, TPBank là biểu tượng của tinh thần "Ngân hàng cho người trẻ".'
    },
    {
        type: 'key-insight',
        title: '🤖 Tầng 1 (Chuyển Đổi Số - CIR Thấp Kỷ Lục)',
        content: '- Nếu các ngân hàng Big4 phải nuôi hệ thống hàng chục nghìn nhân viên và chi nhánh vật lý đồ sộ, TPBank dùng Công nghệ để thay thế. Chỉ số CIR (Chi phí trên Thu nhập) của TPBank luôn xoay quanh mức rất thấp vì máy móc không phàn nàn và đòi tăng lương.\n- Tập khách hàng trẻ mang lại tốc độ gia tăng tài khoản cá nhân cực nhanh.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 2 (Những Chiếc Bẫy Trái Phiếu Đứng Sau)',
        content: '- Khác với lớp vỏ bọc Bán lẻ xịn xò, TPBank lại ôm tương đối nhiều Trái Phiếu Doanh Nghiệp (Bất động sản) so với quy mô bé nhỏ của mình. Ngân hàng tiên phong luôn đi cùng với các Group BĐS liên quan, đẩy nợ xấu chực chờ trở thành áp lực nặng nề trong bóng râm.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'TPB',
            coreProfit: 8000,
            totalLoan: 210000,
            baseCASA: 20.0,
            baseNPL: 1.6,
            baseLLR: 65.0,
            costOfFundsGap: 100,
            currentEquity: 32000,
            sharesOutstanding: 2201,
            currentPrice: 19000
        }
    },
    {
        type: 'summary',
        content: [
            'TPBank là lựa chọn linh hoạt dành cho những nhà đầu tư tin vào câu chuyện hệ sinh thái mạng và giao dịch công nghệ.',
            'Với mức định giá P/B hiện thời khá quanh quẩn mức 1.0x, nó đã phản ánh rủi ro kẹt dòng tiền trái phiếu. Sự hồi sinh của giới đất đai là tín hiệu Buy lý tưởng!'
        ]
    }
]
