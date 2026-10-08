import re, os, glob

# Slide 4 4D Landscape data for 15 tickers (Trụ Cột 1)
S4_DATA = {
    "acb": {
        "title": "BẢN ĐỒ THỊ PHẦN BÁN LẺ & AN TOÀN TÍN DỤNG TUYỆT ĐỐI",
        "badge": "TRỤ CỘT 1 · THỊ PHẦN BÁN LẺ & CON HÀO PHÒNG THỦ",
        "summary": "ACB kiên định chiến lược bán lẻ thuần túy, chiếm trọn niềm tin của nhóm khách hàng cá nhân và SME có dòng tiền vững mạnh nhất cả nước, miễn nhiễm hoàn toàn với rủi ro trái phiếu doanh nghiệp.",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ 540k tỷ (+16.5%)", "Năm 2016: Chỉ 150k tỷ (Tăng trưởng 3.6x)", "badge-green", "Tăng trưởng tự nhiên bền vững"),
            ("2. Peer Benchmark", "Bán lẻ chiếm 94% dư nợ", "Ngành: Khách hàng lớn & BĐS chiếm 45-60%", "badge-amber", "Rủi ro tập trung thấp nhất"),
            ("3. Chuẩn Quốc Tế", "0% Trái phiếu DN rủi ro", "Commonwealth Bank (Úc): Bán lẻ >70%", "badge-cyan", "Chuẩn mực an toàn Basel III"),
            ("4. Unit Economics", "Chi phí rủi ro tín dụng <0.3%", "Toàn ngành ngân hàng: 1.2% - 1.8%", "badge-green", "Bảo toàn nguyên vẹn lợi nhuận")
        ]
    },
    "bid": {
        "title": "TỔNG TÀI SẢN 2.52 TRIỆU TỶ: VỊ THẾ DẪN ĐẦU HỆ THỐNG TÀI CHÍNH VIỆT NAM",
        "badge": "TRỤ CỘT 1 · QUY MÔ DẪN ĐẦU & MẠNG LƯỚI QUỐC GIA",
        "summary": "Sở hữu tổng tài sản lớn nhất hệ thống và mạng lưới 1.100 phòng giao dịch phủ khắp 63 tỉnh thành, BIDV là xương sống huyết mạch dẫn vốn cho nền kinh tế Việt Nam.",
        "rows": [
            ("1. Delta Quá Khứ", "Tổng tài sản 2.52 triệu tỷ", "Năm 2016: 1.0 triệu tỷ (Tăng gấp 2.5 lần)", "badge-green", "Quy mô số 1 hệ thống ngân hàng"),
            ("2. Peer Benchmark", "Dư nợ cho vay 1.95 triệu tỷ", "Vượt Agribank & VietinBank giữ ngôi đầu", "badge-amber", "Thị phần tín dụng >13.5%"),
            ("3. Chuẩn Quốc Tế", "Quy mô tài sản đạt $100B", "Tiệm cận Maybank / CIMB Malaysia", "badge-cyan", "Sức mạnh định chế tài chính lớn"),
            ("4. Unit Economics", "Tăng trưởng tín dụng 14-15%", "Hana Bank bảo chứng năng lực vốn tự có", "badge-green", "Lợi nhuận trước thuế >30k tỷ")
        ]
    },
    "ctg": {
        "title": "BÁNH ĐÀ DẪN VỐN FDI & ĐẦU TƯ CÔNG: DƯ NỢ 1.75 TRIỆU TỶ",
        "badge": "TRỤ CỘT 1 · HUYẾT MẠCH KINH TẾ & ĐỐI TÁC CHIẾN LƯỢC FDI",
        "summary": "VietinBank đóng vai trò đối tác tài chính số 1 cho các tập đoàn đa quốc gia (FDI) và siêu dự án hạ tầng trọng điểm quốc gia, hưởng lợi trực tiếp từ làn sóng dịch chuyển chuỗi cung ứng toàn cầu.",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ đạt 1.75 triệu tỷ (+15%)", "Năm 2016: 720k tỷ (Tăng trưởng 2.4 lần)", "badge-green", "Mở rộng quy mô chất lượng cao"),
            ("2. Peer Benchmark", "Chiếm 30% dư nợ FDI Big 4", "Hợp tác độc quyền hàng nghìn tập đoàn FDI", "badge-amber", "Top 1 đối tác vốn FDI"),
            ("3. Chuẩn Quốc Tế", "Cổ đông lớn MUFG (Nhật Bản)", "Kết nối chuỗi cung ứng Nhật - Hàn - Mỹ", "badge-cyan", "Chuẩn quản trị rủi ro quốc tế"),
            ("4. Unit Economics", "Thu phí dịch vụ tăng 22%/năm", "Không thâm dụng vốn tự có CAR", "badge-green", "Cải thiện tỷ suất ROE bền vững")
        ]
    },
    "fpt": {
        "title": "XUẤT KHẨU PHẦN MỀM $1.2B & BƯỚC NGOẶT AI FACTORY TOÀN CẦU",
        "badge": "TRỤ CỘT 1 · NĂNG LỰC TOÀN CẦU & CON HÀO CÔNG NGHỆ",
        "summary": "35.000 kỹ sư phần mềm, đối tác chiến lược cấp cao của NVIDIA tại Đông Nam Á, FPT đã vượt ra khỏi biên giới quốc gia để trở thành nhà cung cấp giải pháp chuyển đổi số và AI đẳng cấp thế giới.",
        "rows": [
            ("1. Delta Quá Khứ", "Doanh thu IT ngoại $1.2B (+28%)", "Năm 2015: Chỉ $200M (Tăng gấp 6 lần)", "badge-green", "Hợp đồng quy mô >$50M tăng 60%"),
            ("2. Peer Benchmark", "Thị phần IT ngoại >75% tại VN", "Bỏ xa tất cả các công ty phần mềm nội địa", "badge-amber", "Vị thế độc tôn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Chi phí $25/h vs Ấn Độ $38/h", "Rẻ hơn 35% với chất lượng kỹ sư tương đương", "badge-cyan", "Lợi thế chi phí nhân tài công nghệ"),
            ("4. Unit Economics", "Biên EBIT IT ngoại đạt 17.2%", "Dòng ngoại tệ USD, JPY dồi dào", "badge-green", "Lợi nhuận ròng tăng trưởng >20%/năm")
        ]
    },
    "frt": {
        "title": "BÁNH ĐÀ MẬT ĐỘ ĐIỂM BÁN: DOANH THU 1.2 TỶ/THÁNG/SHOP VƯỢT XA ĐỐI THỦ",
        "badge": "TRỤ CỘT 1 · HIỆU ỨNG MẠNG LƯỚI & NĂNG LỰC CÔNG NGHỆ",
        "summary": "Long Châu đã vượt mốc 2.600 nhà thuốc, thiết lập khoảng cách thị phần không thể san lấp với đối thủ nhờ công nghệ AI FPT tối ưu danh mục SKU và logistics thông minh.",
        "rows": [
            ("1. Delta Quá Khứ", "2.600 Nhà thuốc (+550%)", "Năm 2021: 400 Shop (Tăng trưởng 6.5 lần)", "badge-green", "Tốc độ mở shop kỷ lục ngành"),
            ("2. Peer Benchmark", "Doanh thu 1.2 Tỷ/shop/tháng", "Pharmacity: 450tr · An Khang: 380tr", "badge-amber", "Hiệu quả gấp 2.7x - 3.1x đối thủ"),
            ("3. Chuẩn Quốc Tế", "Mô hình tích hợp Boots/CVS", "Thuốc kê đơn + Dược mỹ phẩm + Tiêm chủng", "badge-cyan", "Xu hướng bán lẻ sức khỏe toàn cầu"),
            ("4. Unit Economics", "Hòa vốn sau 6 tháng/shop", "Thu hồi vốn đầu tư nhanh kỷ lục", "badge-green", "Biên gộp toàn chuỗi tăng lên 23.5%")
        ]
    },
    "imp": {
        "title": "CON HÀO KỸ THUẬT ĐỘC TÔN: 11 DÂY CHUYỀN ĐẠT CHUẨN EU-GMP",
        "badge": "TRỤ CỘT 1 · CHẤT LƯỢNG CHUẨN CHÂU ÂU & THỊ PHẦN BỆNH VIỆN",
        "summary": "Sở hữu 35% tổng số dây chuyền EU-GMP tại Việt Nam, Imexpharm có vị thế độc tôn trong đấu thầu thuốc bệnh viện Nhóm 1-2, sẵn sàng đón đầu làn sóng thay thế 4 tỷ USD thuốc nhập khẩu.",
        "rows": [
            ("1. Delta Quá Khứ", "11 Dây chuyền EU-GMP", "Năm 2018: Chỉ 2 dây chuyền (Tăng 5.5 lần)", "badge-green", "Công suất đạt 2 tỷ đơn vị"),
            ("2. Peer Benchmark", "Thị phần ETC Nhóm 1-2 đạt 45%", "Dược Hậu Giang & Dược Hà Tây chủ yếu OTC", "badge-amber", "Bỏ xa đối thủ tại kênh bệnh viện"),
            ("3. Chuẩn Quốc Tế", "Chuẩn dược điển EU (Châu Âu)", "SK Group (Hàn Quốc) chuyển giao công nghệ", "badge-cyan", "Chất lượng ngang thuốc nhập ngoại"),
            ("4. Unit Economics", "Biên lãi gộp ETC đạt 41.5%", "Cao hơn kênh bán lẻ OTC truyền thống 15%", "badge-green", "Tỷ lệ trúng thầu thầu công trên 80%")
        ]
    },
    "mbb": {
        "title": "28 TRIỆU KHÁCH HÀNG & CASA 39.2%: ĐỘNG CƠ HUY ĐỘNG VỐN RẺ NHẤT TMCP",
        "badge": "TRỤ CỘT 1 · HIỆU ỨNG SỐ HÓA & NỀN TẢNG TIỀN GỬI RẺ",
        "summary": "Hệ sinh thái số phục vụ 28 triệu người dùng cá nhân mang lại tỷ lệ CASA 39.2% dẫn đầu toàn khối NHTMCP, tạo ra con hào chi phí vốn thấp bền vững qua mọi chu kỳ lãi suất.",
        "rows": [
            ("1. Delta Quá Khứ", "28 Triệu người dùng số", "Năm 2017: 3.5M khách hàng (Tăng trưởng 8x)", "badge-green", "Hơn 35% dân số trưởng thành sử dụng"),
            ("2. Peer Benchmark", "CASA đạt 39.2% (Top 1 TMCP)", "Vượt trội Techcombank (37.5%) & VPBank (18%)", "badge-amber", "Lợi thế chi phí vốn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Tỷ lệ số hóa đạt 97%", "Ngang ngửa KakaoBank (Hàn Quốc) & WeBank", "badge-cyan", "Mô hình Digital First chuẩn mực"),
            ("4. Unit Economics", "Tiết kiệm 7.500 tỷ chi phí vốn", "Chi phí vốn (COF) rẻ hơn toàn ngành 150 bps", "badge-green", "Duy trì NIM cao 4.2 - 4.5%")
        ]
    },
    "mch": {
        "title": "THỊ PHẦN ÁP ĐẢO GIA VỊ THIẾT YẾU: 350.000 ĐIỂM BÁN LẺ TOÀN QUỐC",
        "badge": "TRỤ CỘT 1 · MẠNG LƯỚI PHÂN PHỐI & THƯƠNG HIỆU QUỐC DÂN",
        "summary": "98% hộ gia đình Việt Nam sử dụng ít nhất một sản phẩm của Masan Consumer. Vị thế độc quyền trong ngành gia vị thiết yếu mang lại sức mạnh định giá tuyệt đối và biên lợi nhuận gộp bùng nổ.",
        "rows": [
            ("1. Delta Quá Khứ", "350.000 Điểm bán lẻ FMCG", "Năm 2015: 180.000 điểm (Tăng gần gấp đôi)", "badge-green", "Phủ kín từ thành thị đến nông thôn"),
            ("2. Peer Benchmark", "Nước mắm 67% · Tương ớt 71.5%", "Bỏ xa hoàn toàn Ajinomoto, Unilever, Cholimex", "badge-amber", "Vị thế độc tôn trong gian bếp"),
            ("3. Chuẩn Quốc Tế", "Xuất khẩu Costco, Walmart", "Chinh phục thị trường Mỹ, Nhật Bản, Hàn Quốc", "badge-cyan", "Sản phẩm toàn cầu hóa (Go Global)"),
            ("4. Unit Economics", "Biên lãi gộp tăng vọt lên 44.6%", "Tăng +610 bps trong 4 năm qua", "badge-green", "Chuyển giao lạm phát sang giá bán")
        ]
    },
    "mig": {
        "title": "ĐỘC QUYỀN BANCASSURANCE QUA MBBANK: TĂNG TRƯỞNG PHÍ BẢO HIỂM 18%/NĂM",
        "badge": "TRỤ CỘT 1 · KÊNH PHÂN PHỐI ĐỘC QUYỀN & HỆ SINH THÁI QUÂN ĐỘI",
        "summary": "Hưởng lợi độc quyền từ hệ sinh thái 28 triệu khách hàng MBBank, MIC đạt tốc độ tăng trưởng phí bảo hiểm cao gấp đôi toàn ngành với chi phí sở hữu khách hàng cực thấp.",
        "rows": [
            ("1. Delta Quá Khứ", "Thị phần tăng lên 6.8% (Top 5)", "Năm 2018: Chỉ 3.5% (Tăng gần gấp đôi)", "badge-green", "Tốc độ thăng hạng nhanh nhất ngành"),
            ("2. Peer Benchmark", "Tăng trưởng phí 18%/năm", "Toàn ngành bảo hiểm phi nhân thọ: 8 - 10%", "badge-amber", "Tăng trưởng gấp 2 lần bình quân ngành"),
            ("3. Chuẩn Quốc Tế", "Mô hình Bancassurance quân đội", "Tỷ lệ thâm nhập bảo hiểm VN mới 1.6% vs ASEAN 3.8%", "badge-cyan", "Dư địa mở rộng thị trường còn 2.5x"),
            ("4. Unit Economics", "Chi phí bán hàng (CAC) tiệm cận 0", "Bán chéo tự động qua ứng dụng MBBank", "badge-green", "Biên lợi nhuận thuần bảo hiểm nở rộng")
        ]
    },
    "ssi": {
        "title": "VỐN CHỦ 25.000+ TỶ: THỊ PHẦN KHÁCH NGOẠI >35% ĐÓN SÓNG NÂNG HẠNG",
        "badge": "TRỤ CỘT 1 · QUY MÔ VỐN HÀNG ĐẦU & CỬA NGÕ VỐN TỔ CHỨC",
        "summary": "Với quy mô vốn chủ sở hữu vượt 25.000 tỷ đồng và mạng lưới quan hệ quốc tế sâu rộng, SSI là điểm dừng chân đầu tiên của dòng vốn hàng tỷ USD từ các quỹ ngoại khi thị trường nâng hạng FTSE.",
        "rows": [
            ("1. Delta Quá Khứ", "Vốn chủ sở hữu >25.000 tỷ", "Năm 2015: 5.000 tỷ (Tăng gấp 5 lần)", "badge-green", "Sức chịu đựng tài chính vượt trội"),
            ("2. Peer Benchmark", "Thị phần khách ngoại đạt >35%", "Top 1 môi giới nhà đầu tư nước ngoài tại VN", "badge-amber", "Vị thế không thể thay thế"),
            ("3. Chuẩn Quốc Tế", "Đối tác chiến lược BlackRock, Vanguard", "Kết nối hệ sinh thái thanh toán Non-prefunding", "badge-cyan", "Chuẩn mực thể chế toàn cầu"),
            ("4. Unit Economics", "Dư nợ Margin tối đa 50.000 tỷ", "Dư địa cấp vốn vay còn gấp đôi hiện tại", "badge-green", "Lợi nhuận mảng margin tăng tốc")
        ]
    },
    "tcx": {
        "title": "NỀN TẢNG WEALTHTECH 100% SỐ HÓA: THỊ PHẦN TRÁI PHIẾU DOANH NGHIỆP >65%",
        "badge": "TRỤ CỘT 1 · WEALTHTECH ĐỘT PHÁ & THỐNG TRỊ THỊ TRƯỜNG TRÁI PHIẾU",
        "summary": "TCBS phá vỡ mô hình môi giới truyền thống bằng nền tảng WealthTech thuần số hóa không chi nhánh, thống trị thị trường tư vấn trái phiếu và dẫn đầu tỷ suất sinh lời toàn ngành chứng khoán.",
        "rows": [
            ("1. Delta Quá Khứ", "Thị phần môi giới 8.2% (Top 3 HOSE)", "Năm 2018: Chỉ 1.5% (Tăng trưởng hơn 5 lần)", "badge-green", "Tăng trưởng thị phần nhanh nhất lịch sử"),
            ("2. Peer Benchmark", "Thị phần Trái phiếu DN >65%", "Thống trị tuyệt đối thị trường trái phiếu chất lượng", "badge-amber", "Con hào bảo trợ Techcombank"),
            ("3. Chuẩn Quốc Tế", "Mô hình Zero-fee Robinhood", "100% giao dịch trực tuyến qua TCInvest", "badge-cyan", "Chuẩn WealthTech tiên tiến nhất VN"),
            ("4. Unit Economics", "CIR siêu tối ưu chỉ 16.5%", "Ngành CTCK truyền thống: 35% - 45%", "badge-green", "Biên lợi nhuận ròng đạt đỉnh 62%")
        ]
    },
    "vcb": {
        "title": "DƯ NỢ 1.73 TRIỆU TỶ: THỐNG TRỊ THỊ TRƯỜNG NGOẠI TỆ & KHÁCH HÀNG TOP 1",
        "badge": "TRỤ CỘT 1 · ĐỊNH CHẾ TÀI CHÍNH QUỐC GIA & THƯƠNG HIỆU SỐ 1",
        "summary": "Vietcombank là định chế tài chính uy tín nhất Việt Nam, xử lý hơn 20% kim ngạch xuất nhập khẩu toàn quốc và là lựa chọn số 1 của các tập đoàn đa quốc gia và tầng lớp thượng lưu.",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ tín dụng 1.73 triệu tỷ", "Năm 2016: 500k tỷ (Tăng trưởng 3.5 lần)", "badge-green", "Tăng trưởng an toàn, không nợ xấu"),
            ("2. Peer Benchmark", "Xử lý >20% kim ngạch XNK toàn quốc", "Thị phần thẻ tín dụng cao cấp & FX số 1", "badge-amber", "Vị thế độc tôn thanh toán quốc tế"),
            ("3. Chuẩn Quốc Tế", "Xếp hạng Fitch BB+ (Trần quốc gia)", "Định giá thương hiệu ngân hàng lớn nhất VN", "badge-cyan", "Định chế tài chính chuẩn thể chế"),
            ("4. Unit Economics", "TOI Q2/2026 đạt 26.372 tỷ (+47.6%)", "Thu nhập ngoài lãi chiếm 22-24%", "badge-green", "Lợi nhuận ròng >35.000 tỷ/năm")
        ]
    },
    "vci": {
        "title": "VỊ THẾ ĐỘC TÔN NGÂN HÀNG ĐẦU TƯ (IB): THƯƠNG VỤ TƯ VẤN M&A >$5 TỶ",
        "badge": "TRỤ CỘT 1 · ĐỈNH CAO TƯ VẤN M&A & CỬA NGÕ TƯ BẢN QUỐC TẾ",
        "summary": "Vietcap là ngân hàng đầu tư (IB) tinh hoa nhất Việt Nam, độc quyền tư vấn các thương vụ M&A và phát hành cổ phiếu quy mô hàng tỷ USD cho các tập đoàn tư nhân hàng đầu đất nước.",
        "rows": [
            ("1. Delta Quá Khứ", "Tổng deal M&A tư vấn >$5 Tỷ", "Năm 2016: <$1 Tỷ (Tăng trưởng hơn 5 lần)", "badge-green", "Bảo chứng các deal lớn nhất VN"),
            ("2. Peer Benchmark", "Thị phần tư vấn IB đạt >40%", "Bỏ xa các công ty chứng khoán ngân hàng", "badge-amber", "Thương hiệu số 1 trong giới chủ DN"),
            ("3. Chuẩn Quốc Tế", "Mô hình Goldman Sachs Việt Nam", "Mạng lưới quỹ đầu tư mạo hiểm & PE toàn cầu", "badge-cyan", "Chuẩn mực ngân hàng đầu tư phố Wall"),
            ("4. Unit Economics", "Biên lợi nhuận mảng IB >65%", "Phí tư vấn thành công đem lại lợi nhuận đột biến", "badge-green", "Tỷ suất ROE bùng nổ trong pha Uptrend")
        ]
    },
    "vnm": {
        "title": "250.000 ĐIỂM BÁN & TỰ CHỦ ĐÀN BÒ: THỊ PHẦN SỮA NƯỚC >55%",
        "badge": "TRỤ CỘT 1 · MẠNG LƯỚI PHỦ KÍN 63 TỈNH & CHUỖI CUNG ỨNG KHÉP KÍN",
        "summary": "Vinamilk làm chủ hoàn toàn chuỗi giá trị từ 150.000 con bò sữa chuẩn quốc tế đến mạng lưới 250.000 điểm bán lẻ phủ khắp 98% xã phường cả nước, tạo nên con hào phòng thủ kiên cố nhất ngành hàng tiêu dùng.",
        "rows": [
            ("1. Delta Quá Khứ", "Tự chủ nguồn sữa tươi >65%", "Năm 2015: Chỉ đạt dưới 30% (Tăng gấp đôi)", "badge-green", "Giảm phụ thuộc bột sữa nhập khẩu"),
            ("2. Peer Benchmark", "Thị phần sữa nước >55% · Sữa đặc >80%", "Bỏ xa TH True Milk, Dutch Lady, Nutifood", "badge-amber", "Thương hiệu quốc dân gắn liền nhiều thế hệ"),
            ("3. Chuẩn Quốc Tế", "Top 36 công ty sữa lớn nhất thế giới", "Hệ thống trang trại Green Farm trung hòa carbon", "badge-cyan", "Chứng chỉ phát triển bền vững ESG"),
            ("4. Unit Economics", "Biên EBITDA dẫn đầu đạt 24.2%", "Vượt trội Danone (16%) và Nestlé (18.5%)", "badge-green", "Cổ tức tiền mặt 6.000 - 8.000 tỷ/năm")
        ]
    },
    "vpb": {
        "title": "VỐN CHỦ 140.000 TỶ & CAR 17.2%: BỘ ĐỆM AN TOÀN CAO NHẤT HỆ THỐNG",
        "badge": "TRỤ CỘT 1 · QUY MÔ VỐN TỰ CÓ & ĐỘNG CƠ NIM DẪN ĐẦU TOÀN NGÀNH",
        "summary": "Sau thương vụ bán vốn 1.5 tỷ USD cho tập đoàn SMBC Nhật Bản, VPBank sở hữu quy mô vốn chủ sở hữu 140.000 tỷ và tỷ lệ an toàn vốn CAR 17.2% dẫn đầu toàn ngành, sẵn sàng bứt phá tăng trưởng.",
        "rows": [
            ("1. Delta Quá Khứ", "Vốn chủ sở hữu đạt 140.000 tỷ", "Năm 2018: 35.000 tỷ (Tăng trưởng 4 lần)", "badge-green", "Quy mô vốn Top 2 toàn ngành ngân hàng"),
            ("2. Peer Benchmark", "Hệ số CAR đạt 17.2% (Top 1 VN)", "Gấp đôi quy định tối thiểu 8% của NHNN", "badge-amber", "Bộ đệm chống sốc an toàn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Đối tác chiến lược SMBC (Nhật Bản)", "Tập đoàn tài chính lớn thứ 2 Nhật Bản hậu thuẫn", "badge-cyan", "Chuẩn quản trị Basel III tiên tiến"),
            ("4. Unit Economics", "NIM đạt 5.6% (Cao nhất hệ thống)", "Vượt trội hoàn toàn Big 4 ở mức 3.0 - 3.3%", "badge-green", "Lợi nhuận trước thuế kế hoạch 23k tỷ")
        ]
    }
}

# Slide 6 4D Landscape data for ALL 21 tickers (Trụ Cột 3: Sức Khỏe Tài Chính & Đòn Bẩy Vận Hành)
S6_DATA = {
    "acb": {
        "title": "HIỆU QUẢ VỐN BỀN VỮNG & CHẤT LƯỢNG TÀI SẢN PHÒNG THỦ SỐ 1",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & QUẢN TRỊ RỦI RO",
        "summary": "ACB sở hữu cấu trúc tài chính lành mạnh nhất hệ thống: ROE trên 23% suốt 6 năm liên tiếp, nợ xấu cực thấp và nói không với trái phiếu doanh nghiệp rủi ro cao.",
        "rows": [
            ("1. ROE Bền Vững", "23.5% (6 năm liên tục)", "Ngành ngân hàng: 16% - 18%", "Chuẩn khu vực: DBS 18% · BCA 22%", "Lợi nhuận tích lũy tái đầu tư bền vững"),
            ("2. Tối Ưu CIR", "32.5% (Top tiết kiệm)", "Quá khứ 48% · Toàn ngành 38 - 42%", "Chuẩn ngân hàng số ASEAN 35%", "Tiết kiệm hàng nghìn tỷ chi phí vận hành"),
            ("3. Quản Trị Rủi Ro", "NPL 1.15% · 0% TPDN rủi ro", "Toàn ngành NPL 2.2% · Rủi ro BĐS cao", "Chuẩn an toàn Basel II/III", "Chi phí trích lập dự phòng cực thấp"),
            ("4. Cổ Tức Cổ Đông", "25% (15% CP + 10% Tiền)", "Chi trả đều đặn suốt 6 năm liên tiếp", "Tỷ suất sinh lời cổ đông kép >20%/năm", "Cổ phiếu tích sản chuẩn mực cho NĐT SIP")
        ]
    },
    "bid": {
        "title": "BẢNG CÂN ĐỐI TÀI SẢN VỮNG CHẮC: DỰ PHÒNG RỦI RO SẠCH SẼ HOÀN TOÀN",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & NĂNG LỰC SINH LỜI",
        "summary": "Sau giai đoạn tái cơ cấu quyết liệt, BIDV đã trích lập sạch sẽ nợ VAMC, nâng tỷ lệ bao phủ nợ xấu lên 165% và đưa ROE tiệm cận mức 20%.",
        "rows": [
            ("1. Tỷ Suất ROE", "19.8% (Đỉnh cao mới)", "Quá khứ 12-14% · Ngành 16.5%", "Chuẩn Big 4 châu Á: 15 - 17%", "Tăng trưởng lợi nhuận giữ lại bổ sung vốn"),
            ("2. Tối Ưu CIR", "31.2% (Cải thiện rõ nét)", "Quá khứ 42% · Toàn ngành 38 - 40%", "Chuẩn ngân hàng số khu vực 32%", "Tối ưu hóa năng suất 1.100 PGD toàn quốc"),
            ("3. Bao Phủ Nợ LLR", "LLR 165% · NPL 1.25%", "Quá khứ LLR 80% · Ngành LLR 90-100%", "Bộ đệm dự phòng vững chắc", "Đã xóa sạch nợ xấu tồn đọng từ quá khứ"),
            ("4. Dòng Tiền & Cổ Tức", "LNST kế hoạch 30.000 tỷ", "Cổ tức tiền mặt + Cổ phiếu tăng vốn", "Hậu thuẫn Nhà nước & Hana Bank", "Gia tăng giá trị nội tại dài hạn cho SIP")
        ]
    },
    "ctg": {
        "title": "XỬ LÝ DỨT ĐIỂM NỢ XẤU: P/E 6.2X RẺ NHẤT TOÀN BỘ KHỐI BIG 4",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & BIÊN AN TOÀN ĐỊNH GIÁ",
        "summary": "VietinBank đã bước qua thời kỳ nặng gánh dự phòng, đưa tỷ lệ LLR lên 170% trong khi định giá P/E chỉ 6.2x, mở ra biên an toàn chiết khấu hơn 35% cho nhà đầu tư giá trị.",
        "rows": [
            ("1. Tỷ Suất ROE", "18.5% (Phục hồi mạnh mẽ)", "Quá khứ 11-13% · Ngành 16.5%", "Chuẩn Big 4 khu vực: 15 - 18%", "Hiệu quả sử dụng vốn cổ đông tăng tốc"),
            ("2. Tối Ưu CIR", "28.8% (Top 2 Big 4)", "Quá khứ 38% · Toàn ngành 38 - 40%", "Số hóa luồng thanh toán doanh nghiệp", "Giải phóng năng suất chuyên viên tín dụng"),
            ("3. Bao Phủ Nợ LLR", "LLR 170% · NPL 1.3%", "Quá khứ LLR 110% (Trích lập sạch sẽ)", "Bộ đệm rủi ro vững vàng", "Tiết giảm chi phí dự phòng trong tương lai"),
            ("4. Biên An Toàn SIP", "P/E 6.2x (Rẻ nhất Big 4)", "VCB 12.5x · BID 10.2x · Ngành 8.5x", "Biên an toàn định giá đạt 35%", "Cơ hội gom tích sản ở vùng định giá hấp dẫn")
        ]
    },
    "ctr": {
        "title": "DÒNG TIỀN NIÊN KIM TOWERCO: BIÊN EBITDA 68% & KHÔNG NỢ VAY RỦI RO",
        "badge": "TRỤ CỘT 3 · CẤU TRÚC SINH LỜI & DÒNG TIỀN NIÊN KIM",
        "summary": "Mô hình cho thuê hạ tầng viễn thông (TowerCo) mang lại biên EBITDA lên tới 68% cùng dòng tiền hợp đồng dài hạn 10-15 năm, đưa tỷ lệ trả cổ tức tiền mặt lên mức 20-30%.",
        "rows": [
            ("1. Tỷ Suất ROE", "20.8% (Tăng trưởng đều)", "Quá khứ 16.5% · Ngành xây lắp 10-12%", "Chuẩn TowerCo: AMT 18% · Cellnex 15%", "Hiệu quả khai thác tài sản hạ tầng vượt trội"),
            ("2. Biên EBITDA", "68% (Mảng TowerCo)", "Toàn công ty 11.5% · Quá khứ 8.5%", "Chuẩn American Tower 65%", "Biên lợi nhuận nở rộng khi Tenancy tăng"),
            ("3. Đòn Bẩy Nợ Vay", "Net Debt/EBITDA chỉ 0.8x", "Dưới ngưỡng an toàn quốc tế 3.5x", "Chuẩn TowerCo toàn cầu 4.0 - 5.0x", "Rủi ro tài chính gần như bằng 0"),
            ("4. Cổ Tức Tiền Mặt", "20 - 30% tiền mặt/năm", "Tăng trưởng đều đặn 15%/năm", "Hậu thuẫn dòng tiền Tập đoàn Viettel", "Dòng tiền niên kim phòng thủ hoàn hảo cho SIP")
        ]
    },
    "fpt": {
        "title": "CỖ MÁY IN TIỀN VỚI ROE 26%: TIỀN MẶT RÒNG >28.000 TỶ TỰ TÀI TRỢ CAPEX",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & TỶ SUẤT SINH LỜI THẦN TỐC",
        "summary": "10 năm liên tiếp duy trì ROE trên 25%, FPT sở hữu lượng tiền mặt ròng khổng lồ hơn 28.000 tỷ đồng, đủ sức tự tài trợ toàn bộ chuỗi AI Factory mà không chịu áp lực lãi vay.",
        "rows": [
            ("1. Tỷ Suất ROE", "26.5% (Bền vững 10 năm)", "VN-Index bình quân: 12% - 14%", "Chuẩn Big Tech: Infosys 28% · TCS 30%", "Cỗ máy tái sinh lợi nhuận kép kỳ quan"),
            ("2. Biên EBIT IT Ngoại", "17.2% (Tăng liên tục)", "Quá khứ 14.5% · Ngành IT nội 8-10%", "Chuẩn Tier-1 IT Services quốc tế", "Nâng cấp từ gia công lên chuyển đổi số & AI"),
            ("3. Tiền Mặt Ròng", "Net Cash >28.000 tỷ", "Quá khứ 12.000 tỷ (Không nợ vay ròng)", "Tự tài trợ 100% Capex trung tâm dữ liệu", "Miễn nhiễm hoàn toàn với rủi ro lãi suất"),
            ("4. Cổ Tức & Lợi Tức", "20% tiền + 15% cổ phiếu", "Duy trì kỷ luật chi trả hơn 15 năm", "Tổng tỷ suất sinh lời vượt xa thị trường", "Tích sản tăng trưởng bền vững số 1 Việt Nam")
        ]
    },
    "frt": {
        "title": "ĐIỂM UỐN TÀI CHÍNH TỪ LONG CHÂU: BIÊN LÃI GỘP TĂNG TỪ 14% LÊN 23.5%",
        "badge": "TRỤ CỘT 3 · ĐIỂM UỐN SINH LỜI & CẤU TRÚC VỐN LƯU ĐỘNG",
        "summary": "Long Châu giúp FRT bứt phá ngoạn mục: biên lãi gộp tăng mạnh lên 23.5%, chu kỳ tiền mặt rút ngắn xuống 38 ngày và dòng tiền hoạt động kinh doanh dương lớn trên 2.500 tỷ/năm.",
        "rows": [
            ("1. Tỷ Suất ROE", "24.5% (Phục hồi thần tốc)", "Năm 2023 lỗ do FPT Shop tái cơ cấu", "Chuẩn chuỗi bán lẻ CVS Mỹ: 22 - 25%", "Điểm uốn bùng nổ lợi nhuận sau đầu tư"),
            ("2. Biên Lợi Nhuận Gộp", "23.5% (Toàn tập đoàn)", "Quá khứ 14% (thời điểm phụ thuộc điện máy)", "Chuẩn chuỗi dược phẩm quốc tế 25%", "Long Châu kéo tăng toàn bộ biên lãi tập đoàn"),
            ("3. Chu Kỳ Tiền Mặt", "CCC rút ngắn còn 38 ngày", "Quá khứ 65 ngày · Ngành bán lẻ 50-60 ngày", "Tốc độ luân chuyển tồn kho kỷ lục", "Thu hồi tiền mặt trực tiếp từ khách lẻ"),
            ("4. Dòng Tiền CFO", "CFO >2.500 tỷ/năm", "Quá khứ âm dòng tiền do mở mới ồ ạt", "Tự tài trợ mở rộng không cần vay nợ", "Bảo toàn an toàn thanh khoản cho cổ đông SIP")
        ]
    },
    "gmd": {
        "title": "KẾT THÚC CHU KỲ CAPEX LỚN: BIÊN GỘP CẢNG BIỂN 49.4% & FCF >2.000 TỶ",
        "badge": "TRỤ CỘT 3 · ĐIỂM UỐN DÒNG TIỀN TỰ DO & THU HOẠCH LỢI NHUẬN",
        "summary": "Sau khi hoàn thành các cụm cảng Gemalink và Nam Đình Vũ, Gemadept đã xóa sạch nợ ngoại tệ USD, đưa biên gộp cảng biển lên 49.4% và bước vào kỷ nguyên thu hoạch dòng tiền tự do khổng lồ.",
        "rows": [
            ("1. Biên Gộp Cảng Biển", "49.4% (Đỉnh cao ngành cảng)", "Quá khứ 38% · Ngành cảng VN 35 - 40%", "Ngang ngửa cảng Singapore (PSA)", "Vị thế cụm cảng nước sâu đón tàu lớn nhất"),
            ("2. Tỷ Suất ROE", "18.2% (Tăng trưởng thực chất)", "Quá khứ 11-13% giai đoạn đầu tư", "Chuẩn ngành logistics quốc tế 14-16%", "Tối ưu hóa công suất khai thác tàu biển"),
            ("3. Rủi Ro Nợ Vay", "Net Debt/VCSH chỉ 0.25x", "Quá khứ 0.85x (Đã trả sạch nợ vay USD)", "Triệt tiêu hoàn toàn rủi ro tỷ giá", "Bảng cân đối kế toán phòng thủ vững chắc"),
            ("4. FCF & Cổ Tức", "FCF thặng dư >2.000 tỷ/năm", "Giai đoạn thu hoạch dòng tiền tự do", "Cổ tức tiền mặt 15 - 20% đều đặn", "Dòng tiền mặt thật chia cổ tức cho NĐT SIP")
        ]
    },
    "hpg": {
        "title": "BƯỚC NGOẶT THU HOẠCH FCF: BIÊN EBITDA 18.5% & FCF >15.000 TỶ/NĂM",
        "badge": "TRỤ CỘT 3 · ĐIỂM UỐN DÒNG TIỀN TỰ DO & ĐÒN BẨY HOÀN VỐN",
        "summary": "Dung Quất 2 kết chuyển tài sản chấm dứt giai đoạn đốt Capex 85.000 tỷ. HPG bước vào thời kỳ bùng nổ dòng tiền tự do (FCF >15.000 tỷ/năm) và giảm nợ vay nhanh kỷ lục.",
        "rows": [
            ("1. Biên EBITDA", "18.5% (Đầu ngành luyện thép)", "Đáy chu kỳ 6.5% · Ngành thép VN 9-11%", "Vượt Baosteel (12%) & POSCO (10.5%)", "Chi phí sản xuất HRC thấp nhất thế giới"),
            ("2. Điểm Uốn FCF", "FCF dự phóng >15.000 tỷ/năm", "Giai đoạn 2022-2024 dòng tiền âm do Capex", "Hoàn thành 85.000 tỷ Capex Dung Quất 2", "Dòng tiền thặng dư lớn để giảm nợ và cổ tức"),
            ("3. Cấu Trúc Nợ Vay", "Net Debt/VCSH giảm về 0.35x", "Quá khứ đỉnh điểm 0.72x (Giảm một nửa)", "Chuẩn an toàn tập đoàn sản xuất toàn cầu", "Tiết giảm hàng nghìn tỷ chi phí lãi vay"),
            ("4. Tỷ Suất ROE", "Kỳ vọng 22 - 24% khi chạy full", "Đáy chu kỳ 7.5% · Bình quân 10 năm 19.5%", "Đòn bẩy EPS tăng tốc ngoạn mục", "Cổ phiếu SIP công nghiệp chu kỳ vàng")
        ]
    },
    "imp": {
        "title": "BẢNG CÂN ĐỐI KHÔNG NỢ VAY: BIÊN GỘP ETC 41.5% & ROE 22.5%",
        "badge": "TRỤ CỘT 3 · PHÒNG THỦ TUYỆT ĐỐI & QUẢN TRỊ CHUẨN MỰC SK GROUP",
        "summary": "Imexpharm duy trì bảng cân đối tài chính sạch bóng nợ vay, biên lợi nhuận gộp kênh ETC đạt 41.5% và tỷ suất ROE 22.5%, đáp ứng trọn vẹn tiêu chuẩn đầu tư giá trị khắt khe nhất của Benjamin Graham.",
        "rows": [
            ("1. Biên Lãi Gộp ETC", "41.5% (Dược kỹ thuật cao)", "Quá khứ 34% · Ngành dược VN 28 - 32%", "Chuẩn các hãng dược EU (Novartis 45%)", "Hàng rào kỹ thuật EU-GMP bảo vệ biên lãi"),
            ("2. Tỷ Suất ROE", "22.5% (Tăng trưởng ổn định)", "Quá khứ 14.5% trước khi SK Group tiếp quản", "Top đầu hiệu quả vốn ngành dược châu Á", "Nâng cấp tiêu chuẩn quản trị toàn cầu"),
            ("3. An Toàn Nợ Vay", "Nợ vay/VCSH <0.05x (Zero Debt)", "Không chịu bất kỳ áp lực chi phí lãi vay nào", "Chuẩn phòng thủ tài chính tuyệt đối", "An toàn tối đa trước mọi biến động vĩ mô"),
            ("4. Cổ Tức Tiền Mặt", "15 - 20% tiền mặt/cổ phiếu", "Duy trì đều đặn suốt hơn 10 năm qua", "SK Group cam kết đồng hành dài hạn", "Cổ phiếu tích sản phòng thủ mẫu mực")
        ]
    },
    "mbb": {
        "title": "CASA 39.2% & CIR 28.2%: CỖ MÁY TỐI ƯU HÓA CHI PHÍ VỐN SỐ 1 VIỆT NAM",
        "badge": "TRỤ CỘT 3 · HIỆU QUẢ VẬN HÀNH & NĂNG LỰC TỰ BẢO VỆ",
        "summary": "Lợi thế chi phí vốn thấp từ CASA giúp MBBank tiết kiệm 7.500 tỷ đồng/năm, kết hợp với CIR thấp nhất khối TMCP (28.2%) tạo nên tỷ suất sinh lời ROE trên 23% suốt 7 năm liền.",
        "rows": [
            ("1. Chi Phí Vốn (COF)", "3.2% (Nhờ CASA 39.2%)", "Toàn ngành ngân hàng: 4.8% - 5.2%", "CASA Top 1 TMCP ngang KakaoBank", "Tiết kiệm 7.500 tỷ chi phí trả lãi/năm"),
            ("2. Tối Ưu Hóa CIR", "28.2% (Thấp nhất khối TMCP)", "Quá khứ 39% · Toàn ngành 38 - 42%", "Số hóa 97% triệt tiêu chi phí quầy", "Biên lợi nhuận ròng hoạt động ngân hàng cao"),
            ("3. Tỷ Suất ROE", "23.5% (Bền bỉ suốt 7 năm)", "Toàn hệ thống ngân hàng VN: 16 - 18%", "Top 3 ngân hàng sinh lời cao nhất VN", "Lợi nhuận tăng trưởng kép 18-20%/năm"),
            ("4. Bộ Đệm Nợ Xấu", "LLR 140% · NPL 1.4%", "Đã chủ động trích lập phòng ngừa rủi ro", "Bộ đệm an toàn cao hơn trung bình ngành", "Sẵn sàng hoàn nhập dự phòng thúc đẩy LN")
        ]
    },
    "mch": {
        "title": "CỖ MÁY IN TIỀN FMCG: BIÊN GỘP 44.6% & ROIC >35% CHUẨN UNILEVER",
        "badge": "TRỤ CỘT 3 · HIỆU QUẢ SINH LỜI KỶ LỤC & DÒNG TIỀN TỰ DO",
        "summary": "Masan Consumer đạt biên lợi nhuận gộp 44.6% và ROIC trên 35% nhờ sức mạnh định giá độc quyền gia vị, sinh ra dòng tiền tự do hơn 6.500 tỷ/năm sẵn sàng chi trả cổ tức tiền mặt khủng.",
        "rows": [
            ("1. Biên Lợi Nhuận Gộp", "44.6% (+610 bps 4 năm)", "Ngành hàng FMCG Việt Nam: 28 - 30%", "Chuẩn Unilever (42%) · Nestlé (46%)", "Sức mạnh định giá bảo vệ trọn vẹn biên lãi"),
            ("2. Tỷ Suất ROIC", "ROIC >35% (Top 5% toàn thị trường)", "Quá khứ 25% · Ngành tiêu dùng 18%", "Hiệu quả sử dụng vốn đạt chuẩn thế giới", "Cỗ máy in tiền mặt hoàn hảo của Masan Group"),
            ("3. Dòng Tiền FCF", "FCF >6.500 tỷ/năm", "Tỷ lệ chuyển đổi FCF/EBITDA đạt >85%", "Nợ vay ròng giảm nhanh về 0", "Dòng tiền mặt dồi dào, thanh khoản tuyệt hảo"),
            ("4. Động Lực Cổ Đông", "Cổ tức tiền mặt 50-70% LNST", "Kế hoạch chuyển sàn niêm yết HOSE", "Động lực tái định giá P/E từ 13x lên 20x", "Cổ phiếu tích sản tăng trưởng dòng tiền số 1")
        ]
    },
    "mig": {
        "title": "FLOAT ĐẦU TƯ 4.500 TỶ: COMBINED RATIO <95% & LÃI TIỀN GỬI ỔN ĐỊNH",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & HIỆU QUẢ DÒNG TIỀN FLOAT",
        "summary": "Tỷ lệ kết hợp dưới 95% bảo chứng MIC có lãi thuần từ kinh doanh bảo hiểm, đồng thời sở hữu hơn 4.500 tỷ dòng tiền Float gửi tại Big4 và MBBank thu về lãi suất 7-8%/năm an toàn tuyệt đối.",
        "rows": [
            ("1. Tỷ Lệ Kết Hợp", "93.5% (Có lãi kinh doanh thuần)", "Quá khứ 98% · Ngành bảo hiểm 97-102%", "Chuẩn bảo hiểm quốc tế <95%", "Không cần bù lỗ bảo hiểm bằng lãi đầu tư"),
            ("2. Quy Mô Float", ">4.500 tỷ tiền gửi ngân hàng", "Tăng trưởng 18%/năm cùng mạng lưới MB", "100% gửi tại Big4 và MBBank", "Thu về 320 - 350 tỷ lãi tiền gửi ròng/năm"),
            ("3. Tỷ Suất ROE", "18.5% (Tăng trưởng liên tục)", "Quá khứ 11-13% · Toàn ngành 12-14%", "Chuẩn công ty bảo hiểm hiệu quả châu Á", "Tận dụng kênh số hóa MBBank tối ưu chi phí"),
            ("4. Kiểm Soát Bồi Thường", "Tỷ lệ bồi thường chỉ 31.5%", "Ứng dụng AI phân loại và thẩm định rủi ro", "Thấp hơn bình quân ngành (36 - 40%)", "Bảo toàn dòng lợi tức tiền mặt cho NĐT SIP")
        ]
    },
    "mwg": {
        "title": "BƯỚC NGOẶT TÁI CẤU TRÚC: BIÊN GỘP 22.2% & TIỀN MẶT RÒNG >25.000 TỶ",
        "badge": "TRỤ CỘT 3 · ĐÒN BẨY VẬN HÀNH & KỶ NGUYÊN THU HOẠCH DÒNG TIỀN",
        "summary": "Sau khi tinh gọn đóng 200 shop kém hiệu quả và đưa Bách Hóa Xanh vào điểm sinh lời, MWG nâng biên gộp lên 22.2%, sở hữu lượng tiền mặt ròng kỷ lục hơn 25.000 tỷ đồng.",
        "rows": [
            ("1. Biên Lợi Nhuận Gộp", "22.2% (+400 bps sau tái cấu trúc)", "Quá khứ 18.2% · Chuỗi bán lẻ khác 16-18%", "Chuẩn Best Buy (Mỹ): 22%", "Tối ưu hóa giá vốn nhập và giảm khuyến mại"),
            ("2. Tỷ Lệ SG&A", "14.2% (Tối ưu ngoạn mục)", "Quá khứ 18.5% (Đóng 200 shop không hiệu quả)", "Chuẩn quốc tế bán lẻ hiện đại 14-15%", "Đòn bẩy vận hành bùng nổ khi doanh thu tăng"),
            ("3. Tiền Mặt Ròng", "Net Cash >25.000 tỷ VNĐ", "Lãi tiền gửi đóng góp >1.500 tỷ LNST/năm", "Bảng cân đối tiền mặt ròng kỷ lục", "Sẵn sàng chia cổ tức tiền mặt & mua CP quỹ"),
            ("4. Dòng Tiền CFO", "CFO >12.000 tỷ/năm", "Chuyển từ giai đoạn mở rộng sang thu hoạch", "FCF Yield đạt mức hấp dẫn >8%", "Trụ cột tích sản bán lẻ số 1 Việt Nam")
        ]
    },
    "pow": {
        "title": "DÒNG TIỀN KINH DOANH >6.000 TỶ/NĂM: HẾT KHẤU HAO NHÀ MÁY ĐIỆN LÕI",
        "badge": "TRỤ CỘT 3 · SỨC KHỎE TÀI CHÍNH & VÒNG ĐỜI DÒNG TIỀN ĐIỆN NỀN",
        "summary": "Dòng tiền CFO đều đặn trên 6.000 tỷ/năm, các nhà máy điện khí Cà Mau 1-2 và than Vũng Áng 1 dần hết khấu hao, mở ra chu kỳ bùng nổ lợi nhuận tiền mặt và tăng cổ tức.",
        "rows": [
            ("1. Dòng Tiền CFO", ">6.000 tỷ/năm (Rất dồi dào)", "Khấu hao tài sản lớn chuyển thành tiền mặt", "Đảm bảo nguồn trả nợ vay Nhơn Trạch 3-4", "Rủi ro thiếu hụt dòng tiền thanh toán bằng 0"),
            ("2. Hết Khấu Hao Lõi", "Cà Mau 1-2 & Vũng Áng 1", "Giảm chi phí khấu hao hàng nghìn tỷ/năm", "Chuẩn vòng đời nhà máy điện quốc tế", "Lợi nhuận gộp bùng nổ tự nhiên sau khấu hao"),
            ("3. Tỷ Lệ Nợ Vay", "Nợ vay/VCSH 0.65x (Rất an toàn)", "Định mức tín nhiệm Fitch BB+ quốc tế", "Lãi suất vay ưu đãi ODA và ECA <4%/năm", "Chi phí vốn đầu tư cực kỳ cạnh tranh"),
            ("4. Cổ Tức Tiền Mặt", "3-5% (Giai đoạn Capex) ➔ 8-10%", "Tập đoàn Dầu khí PVN hỗ trợ toàn diện", "Cổ tức tiền mặt tăng tốc sau năm 2026", "Tài sản tích sản phòng thủ dòng tiền dài hạn")
        ]
    },
    "ssi": {
        "title": "QUẢN TRỊ MARGIN REAL-TIME: BIÊN RÒNG MARGIN >55% & AN TOÀN VỐN",
        "badge": "TRỤ CỘT 3 · HIỆU QUẢ SỬ DỤNG VỐN & NĂNG LỰC QUẢN TRỊ RỦI RO",
        "summary": "SSI duy trì tỷ lệ đòn bẩy chỉ 1.0x (rất xa trần quy định 2.0x), biên lợi nhuận ròng mảng Margin trên 55% và hệ thống quản trị rủi ro tự động hóa bảo vệ an toàn vốn tuyệt đối.",
        "rows": [
            ("1. Đòn Bẩy Margin", "25.000 tỷ (Margin/VCSH 1.0x)", "Trần tối đa của UBCK quy định là 2.0x", "Dư địa mở rộng margin còn hơn 25.000 tỷ", "Hệ thống quản trị rủi ro danh mục real-time"),
            ("2. Biên Ròng Margin", ">55% (Đóng góp LN ổn định)", "Chênh lệch lãi suất cho vay 11% vs vốn 5.5%", "Lợi nhuận cốt lõi không chịu biến động giá CP", "Dòng tiền lợi nhuận định kỳ vững chắc"),
            ("3. Tỷ Suất ROE", "18.5% (Tăng trưởng theo sóng)", "Quá khứ đáy sóng 11% · Đỉnh sóng 22%", "Cao hơn bình quân ngành CTCK 500 bps", "Cỗ máy tích lũy vốn tự có số 1 thị trường"),
            ("4. Cổ Tức & Thưởng", "10% tiền mặt + Cổ phiếu", "Duy trì kỷ luật chi trả hơn 15 năm liên tục", "Hưởng lợi trực tiếp từ thanh khoản TTCK", "Cổ phiếu tích sản dẫn dắt thị trường vốn VN")
        ]
    },
    "tcx": {
        "title": "MÔ HÌNH WEALTHTECH SIÊU TỐI ƯU: CIR 16.5% & BIÊN LÃI RÒNG 62%",
        "badge": "TRỤ CỘT 3 · ĐÒN BẨY SỐ HÓA & BIÊN LỢI NHUẬN ĐỈNH CAO",
        "summary": "Mô hình số hóa không chi nhánh giúp TCBS đạt tỷ lệ CIR 16.5% thấp nhất toàn ngành, biên ròng 62% và ROE 25.5%, định hình chuẩn mực Fintech sinh lời cao nhất Việt Nam.",
        "rows": [
            ("1. Tỷ Lệ CIR", "16.5% (Thấp nhất toàn ngành)", "CTCK truyền thống: 35% - 45%", "Chuẩn Robinhood Mỹ (15 - 20%)", "Mô hình số hóa triệt tiêu chi phí mặt bằng"),
            ("2. Biên Lợi Nhuận Ròng", "62% (Kỷ lục thị trường vốn)", "Ngành CTCK truyền thống chỉ 25 - 35%", "Thu nhập từ tư vấn trái phiếu & WealthTech", "Hiệu quả chuyển hóa doanh thu sang LN ròng"),
            ("3. Tỷ Suất ROE", "25.5% (Dẫn đầu toàn ngành)", "Bình quân các CTCK lớn tại VN: 14 - 17%", "Chuẩn các Fintech sinh lời cao toàn cầu", "Vốn chủ sở hữu tăng trưởng phi mã hàng năm"),
            ("4. Động Lực IPO", "Định giá dự kiến 2-3 tỷ USD", "Techcombank nắm giữ cổ phần chi phối", "Tạo giá trị thặng dư cực lớn cho cổ đông", "Cổ phiếu WealthTech tiềm năng bùng nổ nhất")
        ]
    },
    "vcb": {
        "title": "KHO DỰ PHÒNG THẶNG DƯ >25.000 TỶ: LLR >250% & ROE >21% BỀN VỮNG",
        "badge": "TRỤ CỘT 3 · AN TOÀN TỐI THƯỢNG & NĂNG LỰC DỰ PHÒNG SỐ 1",
        "summary": "Tỷ lệ bao phủ nợ xấu trên 250% tạo ra kho dự phòng thặng dư hơn 25.000 tỷ đồng, kết hợp CIR 29.5% và CAR 12.5% giúp VCB giữ vững vị thế cổ phiếu ngân hàng phòng thủ chuẩn thể chế.",
        "rows": [
            ("1. Tỷ Lệ Bao Phủ LLR", ">250% (Đỉnh cao lịch sử VN)", "Toàn ngành ngân hàng: 90% - 100%", "Chuẩn an toàn định chế ngân hàng quốc tế", "Kho dự phòng 25.000 tỷ sẵn sàng hoàn nhập"),
            ("2. Tối Ưu Hóa CIR", "29.5% (Chi phí biên cực thấp)", "Quá khứ 38% · Toàn ngành 38 - 45%", "Chuẩn ngân hàng số dẫn đầu ASEAN: DBS 39%", "Chi phí phục vụ người dùng số tiệm cận 0"),
            ("3. An Toàn Vốn CAR", ">12.5% (Đạt chuẩn Basel III)", "Quy định tối thiểu của NHNN là 8.0%", "Fitch xếp hạng tín nhiệm BB+ (Trần quốc gia)", "Bộ đệm vốn cho phép tăng trưởng tín dụng tối đa"),
            ("4. Tỷ Suất ROE", "21.5% (8 năm liền duy trì >20%)", "Ngân hàng sinh lời bền vững nhất Việt Nam", "Chất lượng tài sản không có đối thủ", "Cổ phiếu tích sản chuẩn thể chế (Sovereign Quality)")
        ]
    },
    "vci": {
        "title": "ĐỈNH CAO HIỆU QUẢ VỐN: BIÊN RÒNG MẢNG IB >65% & ROE >20%",
        "badge": "TRỤ CỘT 3 · HIỆU SUẤT TƯ VẤN TINH HOA & DANH MỤC PHÒNG THỦ",
        "summary": "Vietcap tạo ra biên lợi nhuận mảng IB trên 65%, ROE duy trì trên 20% trong chu kỳ tăng giá, trong khi kiểm soát đòn bẩy tài chính ở mức cực kỳ thận trọng dưới 0.8x.",
        "rows": [
            ("1. Biên Lợi Nhuận IB", ">65% (Dịch vụ tư vấn cấp cao)", "Mảng môi giới chứng khoán thuần túy: 20%", "Chuẩn phố Wall: Goldman Sachs · Morgan Stanley", "Phí tư vấn thương vụ lớn đem lại LN đột biến"),
            ("2. Tỷ Suất ROE", "20.5% (Top đầu khối CTCK)", "Cao hơn bình quân ngành CTCK 500-600 bps", "Đòn bẩy lợi nhuận bùng nổ khi thị trường tăng", "Đội ngũ nhân sự IB tinh hoa hàng đầu VN"),
            ("3. Quản Trị Đòn Bẩy", "Nợ vay ròng/VCSH chỉ 0.8x", "Không đầu tư trái phiếu doanh nghiệp rủi ro", "Danh mục tự doanh chọn lọc khắt khe", "Bảo toàn an toàn vốn cho nhà đầu tư SIP"),
            ("4. Lợi Tức Cổ Đông", "10-15% tiền mặt + Cổ phiếu", "Đồng hành cùng ban lãnh đạo sở hữu tỷ lệ lớn", "Minh bạch thông tin và liên kết lợi ích", "Tích sản cùng giới tinh hoa tài chính VN")
        ]
    },
    "vnm": {
        "title": "CỖ MÁY IN TIỀN CỔ TỨC: BIÊN EBITDA 24.2% & TIỀN MẶT RÒNG >15.000 TỶ",
        "badge": "TRỤ CỘT 3 · HIỆU QUẢ VỐN HUYỀN THOẠI & DÒNG TIỀN CỔ TỨC BỀN BỈ",
        "summary": "Vinamilk duy trì biên EBITDA 24.2% vượt trội các tập đoàn sữa toàn cầu, sở hữu lượng tiền mặt ròng hơn 15.000 tỷ và chi trả cổ tức tiền mặt 6.000 - 8.000 tỷ/năm đều đặn suốt 2 thập kỷ.",
        "rows": [
            ("1. Biên EBITDA", "24.2% (Vượt chuẩn quốc tế)", "Ngành sữa Việt Nam: 14% - 16%", "Vượt Danone Pháp (16%) & Nestlé (18.5%)", "Lợi thế tự chủ nguyên liệu và quy mô số 1"),
            ("2. Tỷ Suất ROIC / ROE", "ROIC >28% · ROE >25%", "Duy trì bền bỉ qua hơn 2 thập kỷ", "Thuộc Top 10 doanh nghiệp vốn hiệu quả nhất", "Cỗ máy sinh lời tiền mặt bền bỉ huyền thoại"),
            ("3. Tiền Mặt Ròng", "Net Cash >15.000 tỷ VNĐ", "Bảng cân đối sạch bóng nợ vay tài chính ròng", "Dòng tiền CFO dồi dào >9.000 tỷ/năm", "Miễn nhiễm hoàn toàn với rủi ro lãi suất"),
            ("4. Cổ Tức Tiền Mặt", "6.000 - 8.000 tỷ/năm (Yield 6%)", "Tỷ lệ chi trả cổ tức 80-90% lợi nhuận", "Trả cổ tức tiền mặt đều đặn suốt 20 năm", "Trụ cột tích sản phòng thủ cổ tức số 1")
        ]
    },
    "vpb": {
        "title": "BỘ ĐỆM VỐN CAR 17.2% & ĐỘNG CƠ NIM 5.6%: ĐIỂM UỐN FE CREDIT",
        "badge": "TRỤ CỘT 3 · BỘ ĐỆM VỐN SỐ 1 & ĐIỂM UỐN LỢI NHUẬN HỢP NHẤT",
        "summary": "Với quy mô vốn chủ sở hữu 140.000 tỷ và hệ số CAR 17.2% cao nhất hệ thống, VPBank kết hợp động cơ NIM 5.6% cùng sự phục hồi ngoạn mục của FE Credit mở ra chu kỳ bùng nổ lợi nhuận.",
        "rows": [
            ("1. Hệ Số CAR", "17.2% (Cao nhất hệ thống VN)", "Quy định tối thiểu của NHNN: 8.0%", "Chuẩn Basel III quốc tế (ngưỡng 10.5%)", "Bộ đệm vốn an toàn tuyệt đối chống mọi sốc"),
            ("2. Động Cơ NIM", "5.6% (Top 1 toàn hệ thống)", "Big 4 ở mức 3.0% - 3.3% · Toàn ngành 3.5%", "Động cơ sinh lời mạnh từ bán lẻ & SME", "Chênh lệch lãi suất cao bù đắp chi phí rủi ro"),
            ("3. Tối Ưu CIR", "26.5% (Top tiết kiệm chi phí)", "Quá khứ 34% · Toàn ngành 38 - 42%", "Số hóa tự động hóa luồng phê duyệt tín dụng", "Chi phí vận hành giảm sâu sau tái cơ cấu"),
            ("4. Điểm Uốn FE Credit", "Lãi trở lại >2.000 tỷ/năm", "Chu kỳ trước lỗ lớn do dịch Covid", "Chuẩn chu kỳ phục hồi tài chính tiêu dùng", "Động lực đẩy lợi nhuận hợp nhất tăng vọt")
        ]
    },
    "vtp": {
        "title": "CHI PHÍ/KIỆN GIẢM 25%: BIÊN EBITDA LOGISTICS CẢI THIỆN LÊN 9.2%",
        "badge": "TRỤ CỘT 3 · CON HÀO HIỆU QUẢ CHI PHÍ & DÒNG TIỀN VẬN HÀNH DƯƠNG",
        "summary": "Tổ hợp chia chọn công nghệ cao giúp giảm chi phí xử lý mỗi kiện hàng 25%, đưa biên EBITDA logistics lên 9.2% và vòng quay vốn lưu động tăng 2.2 lần, củng cố năng lực sinh lời bền vững.",
        "rows": [
            ("1. Chi Phí Xử Lý/Kiện", "Giảm 25% (Nhờ robot AI)", "Chi phí nhân công toàn ngành logistics tăng 10%", "Tốc độ xử lý bưu kiện 0.3s/kiện", "Lợi thế chi phí biên đè bẹp đối thủ nhỏ"),
            ("2. Biên EBITDA", "Cải thiện lên 9.2%", "Quá khứ 5.2% · Chuỗi chuyển phát VN 4-6%", "Chuẩn các tập đoàn châu Á: SF Express 11%", "Quy mô 4 triệu kiện/ngày phát huy hiệu quả"),
            ("3. Vòng Quay Vốn", "Tăng 2.2 lần (Thu tiền nhanh)", "Chu kỳ tiền mặt ngắn nhờ hệ sinh thái Viettel", "Rủi ro nợ xấu đối tác gần như bằng 0", "Dòng tiền hoạt động kinh doanh dương lớn"),
            ("4. Tỷ Suất ROE", "19.5% (Tăng trưởng ấn tượng)", "Quá khứ 14.2% trước khi chuyển đổi công nghệ", "Tăng trưởng lợi nhuận 25-30%/năm", "Đón đầu làn sóng TMĐT xuyên biên giới TQ - VN")
        ]
    }
}

def render_table_s4(data):
    rows_html = ""
    for r in data["rows"]:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-cyan); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><span class="badge {r[3]}">{r[4]}</span></td>
                </tr>\n"""
    return f"""            <div class="card-badge badge-emerald" style="margin-bottom: 8px;">BỐI CẢNH HÓA VỊ THẾ & CHỈ SỐ CỐT LÕI (4D LANDSCAPE)</div>
            <p class="card-desc" style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 8px;">Đối chiếu đa chiều: Quá khứ · Đối thủ toàn ngành · Chuẩn quốc tế · Giá trị cổ đông:</p>
            <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
              <thead>
                <tr>
                  <th>Hệ Quy Chiếu</th>
                  <th>Chỉ Số Doanh Nghiệp</th>
                  <th>Đối Chiếu Ngành / Quốc Tế</th>
                  <th>Ý Nghĩa Tăng Trưởng</th>
                </tr>
              </thead>
              <tbody>
{rows_html}              </tbody>
            </table>"""

def render_table_s6(data):
    rows_html = ""
    for r in data["rows"]:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-emerald); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td style="color: var(--accent-cyan); font-weight: 600;">{r[4]}</td>
                </tr>\n"""
    return f"""            <div class="card-badge badge-cyan" style="margin-bottom: 8px;">BẢNG ĐỐI CHIẾU 4D SỨC KHỎE TÀI CHÍNH & ĐÒN BẨY VẬN HÀNH</div>
            <p class="card-desc" style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 8px;">Định vị cấu trúc sinh lời và bộ đệm an toàn vốn so với toàn ngành và chuẩn mực quốc tế:</p>
            <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
              <thead>
                <tr>
                  <th>Chỉ Số Tài Chính</th>
                  <th>Chỉ Số Hiện Tại</th>
                  <th>Quá Khứ & Toàn Ngành</th>
                  <th>Chuẩn Mực Quốc Tế</th>
                  <th>Ý Nghĩa Bảo Vệ Cổ Đông</th>
                </tr>
              </thead>
              <tbody>
{rows_html}              </tbody>
            </table>"""

print("Setup completed. Ready to process files.")
