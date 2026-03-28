import type { ContentBlock } from '../../data'

export const vviaSteelHpg2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'Bí ẩn đằng sau "Cỗ máy in tiền" HPG',
        content: 'Hoà Phát (HPG) luôn được mệnh danh là "Cổ phiếu quốc dân" nhờ năng lực quản trị xuất sắc của Chủ tịch Trần Đình Long. Tuy nhiên, trước bối cảnh ngành thép toàn cầu đang dư thừa công suất và Trung Quốc xả hàng giá rẻ, "Vua Thép" liệu có giữ được ngai vàng?'
    },
    {
        type: 'key-insight',
        title: '🛡️ Tầng 1 (An Toàn Lớp Đáy)',
        content: '- **Pháo đài tiền mặt vô song:** HPG luôn duy trì lượng tiền mặt khổng lồ, sẵn sàng "múc" tài sản giá rẻ khi các đối thủ cạnh tranh ngắc ngoải vì nợ vay.\n- **Lợi thế quy mô (Economies of Scale):** Dung Quất 2 đi vào hoạt động sẽ nâng công suất lên tầm cỡ khu vực, đưa giá vốn (COGS) xuống mức cực thấp.'
    },
    {
        type: 'key-insight',
        title: '🏰 Tầng 2 (Con Hào Kinh Tế)',
        content: '- **Biên lợi nhuận gộp vững chãi:** Dù thị trường thép có biến động, HPG vẫn giữ được biên lợi nhuận cao hơn hẳn các đối thủ cùng ngành (HSG, NKG) nhờ sở hữu chuỗi giá trị khép kín từ quặng sắt đến thép thành phẩm.\n- **Rủi ro Dòng tiền Tự do (FCF):** Dung Quất 2 ngốn một lượng CAPEX khổng lồ, làm dòng tiền tự do tạm thời âm nặng. Đây là thời kỳ "đốt tiền" để gieo hạt.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'ValuationSlider',
        widgetProps: {
            ticker: 'HPG',
            basePrice: 28000,
            baseGrowth: 7,
            multiplier: 500,
            currentPrice: 30000
        }
    },
    {
        type: 'warning',
        title: '🔥 Tầng 4 (Hiệu Ứng Bầy Đàn & Kỷ Luật Thép)',
        content: '- Đừng mua HPG vì báo chí tung hô Dung Quất 2. Hãy mua khi giá quặng sắt rơi tự do và chu kỳ khủng hoảng ngành thép chạm đáy.\n- Kẻ chiến thắng là kẻ kiên nhẫn. Sự nhàm chán của cổ phiếu Vua Thép chính là lớp gai bảo vệ nhà đầu tư giá trị khỏi đám đông F0.'
    },
    {
        type: 'summary',
        content: ['Hoà Phát là cỗ xe lu lầm lỳ tiến về phía trước. Bạn chỉ việc lên xe khi giá thị trường rẻ hơn mức giá trị thực tế do chính bạn tự tin định lượng.']
    }
]
