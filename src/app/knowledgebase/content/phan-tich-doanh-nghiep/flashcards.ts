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
  ],
  'vvia-tech-fpt-2026': [
    {
      front: 'Tại sao FPT được xem là cổ phiếu "Chống đạn" (Bullet-proof) trong môi trường lạm phát tỷ giá?',
      back: 'Nhờ mảng Xuất Khẩu Phần Mềm. FPT thu ngoại tệ (USD, JPY) nhưng chi tiêu phần lớn bằng nội tệ (VND) cho lương kỹ sư. Tỷ giá tăng, lợi nhuận biên của FPT lại càng hưởng lợi.',
    },
    {
      front: 'Theo góc nhìn Đầu tư giá trị, "Con Hào Kinh Tế" lớn nhất của FPT nằm ở đâu mà đối thủ khó sao chép?',
      back: 'Hệ sinh thái Giáo dục (FPT Education). Đây là một "nhà máy nguyên liệu", vừa mang lại lợi nhuận biên cao vừa giải quyết triệt để rủi ro thiếu hụt kỹ sư IT khát nhân lực trên toàn cầu.',
    },
    {
      front: 'Yếu tố nào giúp Biên lợi nhuận (Margin) của FPT liên tục đi lên thay vì bị cạnh tranh hạ giá?',
      back: 'Sự chuyển dịch lên chuỗi giá trị. FPT dịch chuyển từ việc gia công code "cửu vạn" thô sơ sang mảng tư vấn lộ trình Chuyển đổi số (Digital Transformation, AI, Cloud, Automotive) có hàm lượng chất sám cao.',
    },
    {
      front: 'Rủi ro lớn nhất (Risk) khi định giá cổ phiếu FPT hiện tại theo nguyên tắc an toàn của Graham?',
      back: 'Chỉ số P/E đã neo ở mức rất cao (>20x). Sự kỳ vọng của thị trường đang phản ánh trước vào giá. Nếu tốc độ tăng trưởng EPS rớt xuống dưới 20%/năm, giá sẽ chiết khấu cực kỳ mạnh.',
    }
  ],
  'vvia-steel-hpg-2026': [
    {
      front: 'Vì sao Hòa Phát (HPG) có thể nghiền nát các đối thủ trong ngành Thép xuyên suốt chu kỳ kinh tế?',
      back: 'Quy trình sản xuất khép kín (Lò cao Blast Furnace). Họ chủ động từ quặng sắt, than cốc tự tạo điện năng, gọt giũa chi phí vốn rẻ nhất (Cost Leadership) mà các Lò điện (EAF) không thể chống đỡ.',
    },
    {
      front: 'Theo triết lý VVIA, khi nào là thời điểm tuyệt vời nhất để "gom" cổ phiếu HPG?',
      back: 'Những năm "Thép rơi rụng". Khi P/E hoặc P/B chạm mức đáy lịch sử, biên lợi nhuận bị âm do giá HRC lao dốc. Đó là lúc Hào kinh tế chi phí thấp của HPG bóp nghẹt các đối thủ để chờ ngày giành lại thị phần.',
    },
    {
      front: 'Dự án "Quả đấm thép" Khu liên hợp Dung Quất 2 sẽ thay đổi định giá tài sản của Hòa Phát ra sao?',
      back: 'Tăng 50% tổng công suất (thêm 5.6 triệu tấn). Trọng tâm đánh vào mảng HRC cao cấp (đóng tàu, thép ô tô), đưa HPG từ nhà sản xuất vật tư xây thô thăng hạng sang mảng công nghiệp biên lợi nhuận dồi dào.',
    },
    {
      front: 'Rủi ro rình rập lớn nhất đe doạ trực tiếp tới biên lợi nhuận của HPG?',
      back: 'Sự lao dốc của giá Thép toàn cầu do dư cung từ Trung Quốc hoặc giá Quặng sắt nguyên liệu phi mã, kết hợp với áp lực tỷ giá vì HPG phải nhập khẩu lượng lớn than/quặng bằng USD.',
    }
  ],
  'vvia-bank-mbb-2026': [
    {
      front: 'Đứng sau con đập chắn dòng tiền CASA siêu rẻ của Ngân hàng Quân đội (MBB) là tệp khách hàng đặc thù nào?',
      back: 'Hệ sinh thái Quân sự (Viettel, Tân Cảng) và 26 triệu người dùng App MBBank. Cấu trúc cổ đông đặc biệt tạo ra nguồn vốn huy động khổng lồ, ổn định kéo dài suốt chu kỳ kinh tế.',
    },
    {
      front: 'Theo lăng kính Quản trị Rủi ro, điểm yếu lớn nhất (Achilles Heel) trong bức tranh lợi nhuận của MBB?',
      back: 'Sự phụ thuộc vào danh mục Trái phiếu Doanh nghiệp (Corporate Bonds) và các khoản cho vay Năng lượng/Bất động sản quy mô khủng. Nó vô tình kích hoạt rủi ro nợ xấu tiềm ẩn lơ lửng.',
    },
    {
      front: '"Cỗ máy in tiền" đa kênh (Fee Income) của Quân đội MBB mạnh mẽ từ những mảng nào?',
      back: 'Hệ sinh thái tài chính đóng gói hoàn thiện: Kênh Bảo hiểm (MIC/MB Ageas), Công ty Chứng khoán (MBS), Tài chính tiêu dùng (Mcredit). Giúp xoá nhoà rủi ro phụ thuộc vào lãi suất tín dụng.',
    },
    {
      front: 'Triết lý cầm cổ phiếu MBB theo hệ quy chiếu phòng thủ giá trị?',
      back: 'Nắm giữ một cỗ máy biên CASA hiệu quả (NIM cực cao), ROE trên 20%, nhưng phải liên tục kiểm tra định kỳ "Kháng thể LLR" (Bao phủ nợ xấu) để yên tâm về bệ đỡ phòng thủ bùng vỡ nợ.',
    }
  ],
  'vvia-securities-ssi-2026': [
    {
      front: 'Chữ C trong lăng kính Lợi thế cạnh tranh (Moat) của công ty chứng khoán SSI là gì?',
      back: 'Khách hàng Định chế Tài chính (Institutional Clients). Khác với cuộc chiến thiêu thân Zero-fee bán lẻ, SSI sở hữu kho phòng thủ từ khối ngoại, bảo chứng nhờ năng lực phân tích (Research) và năng lực IB (Ngân hàng Đầu tư).',
    },
    {
      front: 'Trong giai đoạn Gấu (Downtrend / Khô máu thanh khoản), SSI bảo vệ lợi nhuận tồn tại bằng phòng tuyến nào?',
      back: 'Bảng cân đối kế toán "Sạch" và Lượng tiền mặt/Trái phiếu đồ sộ. Lãi từ các khoản tự doanh tài sản an toàn này tạo nên bộ đệm lợi nhuận dày, bù đắp sự sập gãy của nguồn thu Phí môi giới.',
    },
    {
      front: 'Rủi ro lớn nhất làm suy thoái ma trận Tỷ suất lợi nhuận ròng của Chứng khoán SSI?',
      back: 'Cối xay thịt mang tên "Zero-Fee" (Miễn phí giao dịch) của các startup Pinetree, TCBS, DNSE. Nếu lực đẩy Margin hay các Deals IB bị đình trệ, lợi nhuận gộp từ sàn giao dịch sẽ đi vào ngõ cụt.',
    },
    {
      front: 'Nhiên liệu thượng tầng kích hoạt chu kỳ siêu tăng hoa định giá cho SSI?',
      back: 'Biến cố Nâng hạng Thị trường (Emerging Market Upgrade), dồn nén thanh khoản bùng nổ vượt 1.5 tỷ USD/phiên. Với Room Margin dồi dào số 1 thị trường, doanh số sẽ nhảy vọt tuyến tính.',
    }
  ],
  'vvia-bank-tcb-2026': [
    {
      front: 'Lợi thế huy động vốn cực êm của TCB giúp họ miễn nhiễm một phần chênh lệch Lãi suất đầu vào?',
      back: 'Thống trị tỷ lệ CASA. Lõi động cơ đến từ sự chiều chuộng tệp khách hàng thu nhập cao (Affluent) và doanh nghiệp lớn dùng hệ thống phần mềm TCB làm Hub Trung tâm thanh toán nhanh mượt.',
    },
    {
      front: 'Techcombank dồn toàn bộ sức mạnh cho vay vào chuỗi giá trị ngách nào, và tại sao nó tạo ra ROA vô địch?',
      back: 'Hành trình Bất động sản (Real Estate Life-cycle). Vòng quay dòng tiền trói chặt từ Developer (Masterise, Vingroup) đến Nhà thầu (Coteccons) rồi ra Người dùng vay mua nhà. Rủi ro được nhốt trong một cái lồng lớn.',
    },
    {
      front: 'Theo góc nhìn Quản trị VVIA, quả bom kích nổ lớn nhất đối với bức tường phòng thủ TCB?',
      back: 'Tính "Cô đặc" rủi ro. Việc ném hơn 70% danh mục tín dụng & TPDN vào một giỏ duy nhất Bất động sản Cao cấp khiến TCB bị ngộp thở nếu thị trường địa ốc đóng băng thanh khoản kéo dài.',
    },
    {
      front: 'Cấu trúc tài chính "Phi tín dụng" nào bảo vệ TCB khỏi giới hạn hạn mức tín dụng (Room) của NHNN?',
      back: 'Doanh thu Dịch vụ siêu khổng lồ: Môi giới phí Trái phiếu (TCBS), phí Bảo Hiểm, và Quản lý tài sản ròng đỉnh cao. TCB là ngân hàng kiếm tiền hoa hồng bảo lộc mượt bậc nhất trên vốn.',
    }
  ]
}
