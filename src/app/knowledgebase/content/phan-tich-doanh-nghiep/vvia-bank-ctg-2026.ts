import type { ContentBlock } from '../../data'

export const vviaBankCtg2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Gã Khổng Lồ Đang Thức Giấc (Big 4)',
        content: 'VietinBank (CTG) từng chìm trong cái bóng của VCB, nhưng những năm gần đây đã thể hiện một sự lột xác đáng gờm. Với lợi thế của một Big4 và những nỗ lực làm sạch bảng cân đối, CTG hiện đang sở hữu một quỹ dự phòng cực kỳ đồ sộ chuẩn bị cho bệ phóng tương lai.'
    },
    {
        type: 'key-insight',
        title: '🛡️ Tầng 1 (Chất Lượng Tài Sản): Khối Tàn Sản Phòng Thủ',
        content: '- **Bao phủ nợ xấu (LLR):** Gần đây CTG đã vươn lên mốc LLR > 160% (cực kỳ an toàn), sánh vai cùng BID, VCB. Đây chính là tấm khiên vững chắc giúp CTG có thể chống chịu mọi cuộc khủng hoảng cục bộ.\n- **Sạch bóng VAMC:** Đã trích lập xong rác quá khứ, giờ lợi nhuận làm ra sẽ trực tiếp chảy vào túi cổ đông thay vì phải nuôi cục máu đông cũ.'
    },
    {
        type: 'key-insight',
        title: '💰 Tầng 2 (Lợi Thế Cạnh Tranh): Tệp Khách Hàng FDI',
        content: 'Giống VCB, CTG sở hữu tệp khách hàng B2B, vốn đầu tư FDI và các dự án trọng điểm quốc gia. Vượt trội hơn các ngân hàng tư nhân, CTG ít bị cuốn vào vòng xoáy cạnh tranh CASA bán lẻ khốc liệt nhờ tệp khách hàng tổ chức khổng lồ này.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'BankingStressTest',
        widgetProps: {
            ticker: 'CTG',
            coreProfit: 30000,
            totalLoan: 1400000,
            baseCASA: 22.0,
            baseNPL: 1.1,
            baseLLR: 160.0,
            costOfFundsGap: 550,
            currentEquity: 125000,
            sharesOutstanding: 5370,
            currentPrice: 35000
        }
    },
    {
        type: 'summary',
        content: [
            'Nắm giữ CTG cũng an toàn như VCB, nhưng định giá P/B của CTG chỉ lọt thỏm ở mức 1.2x - 1.4x (trong khi VCB là 2.5x - 3.0x).',
            'Với bộ đệm dự phòng khủng, CTG là case "Đầu tư giá trị" kinh điển: Mua khi thị trường bi quan và chờ lợi nhuận bung lụa khi không cần trích lập thêm.'
        ]
    }
]
