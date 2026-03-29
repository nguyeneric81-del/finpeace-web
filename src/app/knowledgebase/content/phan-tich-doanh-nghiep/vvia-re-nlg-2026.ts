import type { ContentBlock } from '../../data'

export const vviaReNlg2026: ContentBlock[] = [
    {
        type: 'intro',
        title: 'NLG (Nam Long) - Thành Trì Của Bất Động Sản "Vừa Túi Tiền"',
        content: 'Giữa những đợt sóng BĐS nghỉ dưỡng ảo mộng hay đại đô thị nghìn đô/m2, Nam Long chọn đi theo dòng ngầm an toàn nhất: Nhà ở cho người có nhu cầu thực (Affordable Housing).'
    },
    {
        type: 'key-insight',
        title: '🛡️ Tầng 1 (Chất Lượng Đối Tác Tối Đa)',
        content: '- NLG liên tục hợp tác với các tập đoàn Nhật Bản khắt khe (Hankyu Hanshin, Nishi Nippon). Nhờ vậy, cấu trúc vốn của họ nhẹ tựa lông hồng.\n- Sản phẩm tập trung phân khúc thật, mở bán là hấp thụ ngay, tạo chuỗi "Float" (Tiền khách trả trước) liên tục.'
    },
    {
        type: 'warning',
        title: '⏳ Tầng 2 (Thiếu Đột Biến Khủng)',
        content: '- Đổi lấy sự an toàn tuyệt đối là biên lợi nhuận bị chia sẻ nhiều cho đối tác hùn vốn từ Nhật Bản. Không có những cú "nhân 5 nhân 10" thần hậu như các mã đầu cơ BĐS khác.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'RealEstateStressTest',
        widgetProps: {
            ticker: 'NLG',
            inventoryValue: 17000,
            cashAndEquiv: 3500,
            shortTermDebt: 2500,
            totalDebt: 6000,
            totalEquity: 13000,
            sharesOutstanding: 384,
            currentPrice: 40000
        }
    },
    {
        type: 'quote',
        content: 'Chỉ khi thủy triều rút đi, bạn mới biết ai đang bơi truồng.',
        author: 'WARREN BUFFETT',
        source: 'Huyền thoại đầu tư Giá Trị (Value Investing)'
    },
    {
        type: 'summary',
        content: [
            'Lời bình của Warren Buffett về NLG:',
            '"Nam Long là một trong số ít doanh nghiệp VN hiểu sâu sắc về Con Hào Kinh Tế - đó chính là sản phẩm phục vụ nhu cầu thật.',
            'Kéo thử thanh trượt rủi ro xuống, sức khỏe của sổ sách NLG vẫn sống tốt. NLG sử dụng dòng tiền khách hàng trả trước (Float) xuất sắc để vận hành, không cần vay nợ đầm đìa."'
        ]
    }
]
