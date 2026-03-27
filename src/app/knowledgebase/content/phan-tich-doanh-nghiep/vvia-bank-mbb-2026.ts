import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Giá hiện tại:** 25,800 VND (Cập nhật T03/2026)\n\n**Đánh giá tổng quan:** 🟢 **Tích cực (Có rủi ro kèm theo)** — "Vua CASA" của hệ thống ngân hàng Việt Nam, cỗ máy in tiền chi phí thấp với biên lợi nhuận khổng lồ, nhưng cần theo dõi sát chất lượng tài sản.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): P/B & Chất Lượng Tài Sản ⚠️',
        content: 'Dưới lăng kính phòng ngự của Benjamin Graham, MBB đang ở trạng thái Cảnh Giác.\n\n- **Định giá (P/B):** Hiện giao dịch quanh mức 1.7x. Không còn là vùng định giá rẻ mạt như đáy 2022-2023 (P/B < 1.0x), nhưng hoàn toàn hợp lý với một ngân hàng có tỷ suất sinh lời cực cao.\n- **Nợ xấu (NPL):** Tăng nhẹ lên mức ~2.2% - 2.49% (Quý gần nhất). Sự suy giảm chất lượng bán lẻ và các khoản vay doanh nghiệp BĐS là nguyên nhân.\n- **Bao phủ nợ xấu (LLR):** Gần đây tụt xuống mức 93.7% (dưới ngưỡng 100% thần thánh). Thực tế này có nghĩa MBB không xây "Tảng Băng Trôi" dự phòng khổng lồ bằng tiền tươi như VCB. Cần theo dõi chặt chỉ số này.'
    },
    {
        type: 'key-insight',
        title: '🏆 Tầng 2 (Con Hào - Buffett): Quyền Lực CASA',
        content: 'Đây là điểm sáng rực rỡ nhất của MBB — Vô địch hệ thống:\n\n- **CASA (Tiền gửi không kỳ hạn):** Đạt ~38.1%, dẫn đầu tuyệt đối. App MBBank và hệ sinh thái Viettel mang về nguồn vốn gần như miễn phí.\n- **Biên lãi thuần (NIM):** Rất dày (> 5%). MBB chính là cỗ máy ăn chênh lệch vĩ đại bất chấp lãi suất liên ngân hàng có biến động.'
    },
    {
        type: 'key-insight',
        title: '🟢 Tầng 3 (Hiệu Quả - Greenblatt): Cỗ Máy Tốc Độ Cao',
        content: '- **ROE (Tỷ suất sinh lời):** Luôn duy trì > 20%, lọt top cao nhất Châu Á.\n- **Tỷ lệ chi phí (CIR):** Rất tối ưu ở mức 31.5% đến 33.0%. Hệ thống Digital Banking làm việc thay cho hàng vạn nhân viên vật lý.'
    },
    {
        type: 'warning',
        title: '🛑 Tầng 4 (Stress Test): Cục Nghẹn Trái Phiếu',
        content: 'MBB từng là một trong những ngân hàng chi lớn để nắm giữ Trái phiếu Doanh nghiệp (đặc biệt là Novaland/Trung Nam). Mặc dù đã xử lý dần dần, rủi ro đáo hạn và phụ thuộc vào phục hồi BĐS vẫn là áp lực ngắn hạn kìm hãm cổ phiếu bứt phá mạnh.'
    },
    {
        type: 'steps',
        title: '🎭 Storytelling: Nếu Cụ Warren Buffett Đang Phân Tích MBB?',
        content: 'Hãy tưởng tượng Cụ Warren đang uống Cherry Coke, lật BCTC của MBB và quay sang nói với Charlie Munger:',
        items: [
            {
                icon: '💸',
                title: 'Chiếc Bơm Nước Không Động Cơ',
                body: '"Charlie coi kìa, tụi nó giữ mức CASA 38%, đồng nghĩa với hơn 1/3 tiền mang đi cho vay là tiền miễn phí của khách hàng để quên trong thẻ ATM. Đây chẳng khác gì khoản Float (chiếm dụng vốn) khổng lồ của bảo hiểm GEICO nhà mình!"',
                highlight: 'Nguồn tiền rẻ vĩnh cửu là con hào kinh tế khó đánh sập nhất.'
            },
            {
                icon: '💊',
                title: 'Cẩn Thận Hội Chứng "Say Đòn Bẩy"',
                body: '"Nhưng khoan đã... Tôi thấy tỷ lệ bao phủ nợ xấu dưới 100%, cộng thêm đống trái phiếu doanh nghiệp. Dù lời nhiều, tôi vẫn sợ kiểu cho vay mạo hiểm. Nguyên tắc số 1: Không để mất tiền!"',
                highlight: 'Chỉ mua để tắt app đi ngủ 10 năm nếu P/B rớt xuống dưới 1.2x. Còn ở 1.7x hiện tại, chỉ phù hợp mua trading ngắn hạn.'
            }
        ]
    }
]
