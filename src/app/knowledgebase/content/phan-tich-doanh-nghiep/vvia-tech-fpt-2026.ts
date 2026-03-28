import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: '**Định giá Fair Value (DCF):** 111,000 VNĐ\n\n**Đánh giá tổng quan:** ⚠️ **Cảnh Giác** — FPT đang đối mặt với kỷ nguyên AI bào mòn lợi thế Outsourcing nhân công giá rẻ. Đám đông đang "Say Rượu Lạc Quan", nhưng các chỉ số ROIC đang cho thấy dấu hiệu phanh gấp.'
    },
    {
        type: 'key-insight',
        title: '🏛 Tầng 1 (An Toàn - Graham): Pháo Đài Tiền Mặt Cứu Giá',
        content: '- **Tiền Mặt = 26.000 Tỷ VNĐ:** Tuy AI (Trí tuệ Nhân tạo) đang đấm mạnh vào Tương lai Outsourcing, Quá khứ đã để lại cho FPT một tấm khiên Titan đủ cho Ban lãnh đạo rẽ hướng đầu tư thay vì chỉ định vị là thợ code.\n- **Thanh khoản (Current Ratio 1.35 & D/E 0.58):** Lợi thế phòng thủ Graham bảo vệ khỏi nguy cơ vỡ nợ, nhưng không chống được sự suy giảm định giá dài hạn.'
    },
    {
        type: 'key-insight',
        title: '📉 Tầng 2 (Con Hào - Buffett & Greenblatt): Cỗ Phanh ROIC',
        content: '- **Tăng trưởng Global IT:** Bị AI như Copilot cắn trả, khiến Pricing Power (Quyền lực định giá) giảm sút. Biên lợi gộp giật lùi từ 38.5% xuống mức Báo Động 31%. Tốc độ tăng trưởng doanh thu dự phóng bị cắt máu từ 28% xuống còn **10%/năm**.\n- **ROIC Rải Đá:** Tụt thẳng từ kỷ lục 25.2% xuống **16.5%** vì rào cản nhân công giá rẻ bị phá vỡ. FPT phải đốt CAPEX khủng khiếp vào Datacenter và GPU để bắt kịp thế giới.'
    },
    {
        type: 'widget',
        content: '',
        widgetName: 'ValuationSlider',
        widgetProps: {
            ticker: 'FPT',
            basePrice: 111000,
            baseGrowth: 10,
            multiplier: 1600,
            currentPrice: 130000
        }
    },
    {
        type: 'warning',
        title: '🗣️ Tầng 4 (Stress Test): Lớp Bọc Thép Báo Chí vs Thực Tế',
        content: '- **Góc nhìn Định Chế (SSI/VNDirect):** Giới Phân Tích đang Say Rượu Lạc Quan, duy trì mốc Target Price > 135.000đ và ước tính Tăng trưởng rực rỡ > 20%.\n- **Báo chí Thực tế:** *"FPT chi hàng trăm triệu USD mua Nvidia"* — Dòng tít của Ban Lãnh đạo xác nhận chính xác nguy cơ cạn kiệt Con hào Giá rẻ. AI đang ép FPT phải ném cả Núi Tiền vào Đốt Lò CAPEX để tồn tại. Góc nhìn của Máy Tính ngược dòng đánh bại niềm kiêu hãnh của Đám đông thị trường!'
    }
]
