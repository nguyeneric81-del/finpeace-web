export interface FlashcardData {
  front: string
  back: string
}

export const flashcardsRegistry: Record<string, FlashcardData[]> = {
  'vvia-bank-vcb-2026': [
    {
      front: 'Tại sao VCB luôn có P/B (2.5x - 3.0x) vượt trội toàn ngành mà không phải vì tốc độ tăng trưởng?',
      back: 'Sự an toàn tuyệt đối. VCB sở hữu "Tảng băng trôi" LLR khổng lồ chặn trước rủi ro và tập khách hàng FDI/Nhà nước chất lượng, giữ dòng tiền bền vững bất chấp suy thoái.',
    },
    {
      front: 'Theo Graham, "Kháng thể bất diệt" giúp VCB miễn nhiễm nợ xấu là gì?',
      back: 'Bao phủ Nợ Xấu (LLR) duy trì ở mức 200%-300%. Tức là cứ 1 đồng nợ xấu thì VCB khóa ngay 2-3 đồng tiền mặt dự phòng. Nợ xấu vọt lên 5%, lợi nhuận vẫn không thủng.',
    },
    {
      front: 'Theo Buffett, "Con Hào Kinh Tế" mang lại dòng vốn giá siêu rẻ của VCB là gì?',
      back: 'Dòng tiền CASA vĩ đại. VCB là kho bạc mặc định để giao dịch của Ngân sách Nhà nước và các Tập đoàn mẹ, tạo ra nguồn vốn gần như miễn phí khổng lồ.',
    },
    {
      front: 'Triết lý cầm cổ phiếu Ngân hàng Vietcombank là gì?',
      back: 'Mua "Hầm trú ẩn hạt nhân". Đừng mong X2, X3 nhanh chóng, VCB là chiếc gối cao để ngủ ngon khi thị trường biến động. Lợi suất ổn định, rủi ro cực thấp.',
    }
  ]
}
