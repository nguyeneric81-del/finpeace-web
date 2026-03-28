import type { ContentBlock } from '../../data'

export const vviaBankHdb2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Đảo Hàng Tỷ Tín Dụng Nông Thôn Qua Tập Đoàn Dịch Vụ',
        content: 'HDBank (HDB) là thực thể tài chính kỳ quặc nhưng sinh lời thần sầu, được hậu thuẫn bởi hệ sinh thái nữ tỷ phú rực rỡ Vietjet. Họ là đối trọng thực thụ của VPBank nhờ cỗ máy tiêu dùng HD Saison chuyên khai thác tệp khách hàng nông thôn và công nhân siêu béo bở.'
    },
    {
        type: 'key-insight',
        title: '✈️ Tầng 1 (Cánh Tay Trái Và Ngách Nông Thôn)',
        content: '- **Biên lãi phi thường (NIM):** Không cạnh tranh khốc liệt dòng chảy Big4 ở thành thị, HDBank về quê. Chi nhánh phủ rộng và vay vi mô giúp HDB duy trì NIM cao ngất ngưỡng mà ít ai soi xét.\n- **Đồng tiền xoay vòng:** Chuỗi Vietjet tài trợ HDBank một dòng vận động thương mại ngoại hối và tín dụng vô cùng nhịp nhàng.'
    },
    {
        type: 'warning',
        title: '⚠️ Tầng 2 (Điều Bí Ẩn Chất Lượng Sổ Sách)',
        content: '- Tương tự VPBank, tệp khách vay "tiền nóng" mua xe máy, trả góp nông thôn thường vỡ trận kinh hoàng khi lạm phát rọi bóng. Tuy nhiên, tỷ lệ nợ xấu NPL của HDB luôn hiển thị ở mức ảo diệu thấp, khiến đa phần quỹ ngoại e ngại tính minh bạch thật sự của "chiếc sổ tay phù thủy".'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'HDB',
            coreProfit: 14000,
            totalLoan: 330000,
            baseCASA: 14.0,
            baseNPL: 1.8,
            baseLLR: 75.0,
            costOfFundsGap: 150,
            currentEquity: 48000,
            sharesOutstanding: 2892,
            currentPrice: 25000
        }
    },
    {
        type: 'summary',
        content: [
            'HDBank là cỗ máy in tiền bí ẩn. Tốc độ tăng trưởng luôn > 20% đều đặn như vắt chanh (vượt mọi giông bão hệ thống chung).',
            'Nhiều chuyên gia cho rằng, HDBank là cổ phiếu dành cho những cái tay to ưa khẩu vị lạ. Nếu tin vào thuyền trưởng Madam Thảo, HDB luôn cung cấp điểm mua bất chấp sự tàn khốc của thị trường.'
        ]
    }
]
