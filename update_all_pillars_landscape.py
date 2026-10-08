import os, glob, re

# S4 DATA (Trụ Cột 1) for 15 tickers
S4_DATA = {
    "acb": {
        "badge": "TRỤ CỘT 1 · THỊ PHẦN BÁN LẺ & CON HÀO PHÒNG THỦ",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ 540k tỷ (+16.5%)", "Năm 2016: Chỉ 150k tỷ (Tăng trưởng 3.6x)", "badge-green", "Tăng trưởng tự nhiên bền vững"),
            ("2. Peer Benchmark", "Bán lẻ chiếm 94% dư nợ", "Ngành: Khách hàng lớn & BĐS chiếm 45-60%", "badge-amber", "Rủi ro tập trung thấp nhất"),
            ("3. Chuẩn Quốc Tế", "0% Trái phiếu DN rủi ro", "Commonwealth Bank (Úc): Bán lẻ >70%", "badge-cyan", "Chuẩn mực an toàn Basel III"),
            ("4. Unit Economics", "Chi phí rủi ro tín dụng <0.3%", "Toàn ngành ngân hàng: 1.2% - 1.8%", "badge-green", "Bảo toàn nguyên vẹn lợi nhuận")
        ]
    },
    "bid": {
        "badge": "TRỤ CỘT 1 · QUY MÔ DẪN ĐẦU & MẠNG LƯỚI QUỐC GIA",
        "rows": [
            ("1. Delta Quá Khứ", "Tổng tài sản 2.52 triệu tỷ", "Năm 2016: 1.0 triệu tỷ (Tăng gấp 2.5 lần)", "badge-green", "Quy mô số 1 hệ thống ngân hàng"),
            ("2. Peer Benchmark", "Dư nợ cho vay 1.95 triệu tỷ", "Vượt Agribank & VietinBank giữ ngôi đầu", "badge-amber", "Thị phần tín dụng >13.5%"),
            ("3. Chuẩn Quốc Tế", "Quy mô tài sản đạt $100B", "Tiệm cận Maybank / CIMB Malaysia", "badge-cyan", "Sức mạnh định chế tài chính lớn"),
            ("4. Unit Economics", "Tăng trưởng tín dụng 14-15%", "Hana Bank bảo chứng năng lực vốn tự có", "badge-green", "Lợi nhuận trước thuế >30k tỷ")
        ]
    },
    "ctg": {
        "badge": "TRỤ CỘT 1 · HUYẾT MẠCH KINH TẾ & ĐỐI TÁC CHIẾN LƯỢC FDI",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ đạt 1.75 triệu tỷ (+15%)", "Năm 2016: 720k tỷ (Tăng trưởng 2.4 lần)", "badge-green", "Mở rộng quy mô chất lượng cao"),
            ("2. Peer Benchmark", "Chiếm 30% dư nợ FDI Big 4", "Hợp tác độc quyền hàng nghìn tập đoàn FDI", "badge-amber", "Top 1 đối tác vốn FDI"),
            ("3. Chuẩn Quốc Tế", "Cổ đông lớn MUFG (Nhật Bản)", "Kết nối chuỗi cung ứng Nhật - Hàn - Mỹ", "badge-cyan", "Chuẩn quản trị rủi ro quốc tế"),
            ("4. Unit Economics", "Thu phí dịch vụ tăng 22%/năm", "Không thâm dụng vốn tự có CAR", "badge-green", "Cải thiện tỷ suất ROE bền vững")
        ]
    },
    "fpt": {
        "badge": "TRỤ CỘT 1 · NĂNG LỰC TOÀN CẦU & CON HÀO CÔNG NGHỆ",
        "rows": [
            ("1. Delta Quá Khứ", "Doanh thu IT ngoại $1.2B (+28%)", "Năm 2015: Chỉ $200M (Tăng gấp 6 lần)", "badge-green", "Hợp đồng quy mô >$50M tăng 60%"),
            ("2. Peer Benchmark", "Thị phần IT ngoại >75% tại VN", "Bỏ xa tất cả các công ty phần mềm nội địa", "badge-amber", "Vị thế độc tôn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Chi phí $25/h vs Ấn Độ $38/h", "Rẻ hơn 35% với chất lượng kỹ sư tương đương", "badge-cyan", "Lợi thế chi phí nhân tài công nghệ"),
            ("4. Unit Economics", "Biên EBIT IT ngoại đạt 17.2%", "Dòng ngoại tệ USD, JPY dồi dào", "badge-green", "Lợi nhuận ròng tăng trưởng >20%/năm")
        ]
    },
    "frt": {
        "badge": "TRỤ CỘT 1 · HIỆU ỨNG MẠNG LƯỚI & NĂNG LỰC CÔNG NGHỆ",
        "rows": [
            ("1. Delta Quá Khứ", "2.600 Nhà thuốc (+550%)", "Năm 2021: 400 Shop (Tăng trưởng 6.5 lần)", "badge-green", "Tốc độ mở shop kỷ lục ngành"),
            ("2. Peer Benchmark", "Doanh thu 1.2 Tỷ/shop/tháng", "Pharmacity: 450tr · An Khang: 380tr", "badge-amber", "Hiệu quả gấp 2.7x - 3.1x đối thủ"),
            ("3. Chuẩn Quốc Tế", "Mô hình tích hợp Boots/CVS", "Thuốc kê đơn + Dược mỹ phẩm + Tiêm chủng", "badge-cyan", "Xu hướng bán lẻ sức khỏe toàn cầu"),
            ("4. Unit Economics", "Hòa vốn sau 6 tháng/shop", "Thu hồi vốn đầu tư nhanh kỷ lục", "badge-green", "Biên gộp toàn chuỗi tăng lên 23.5%")
        ]
    },
    "imp": {
        "badge": "TRỤ CỘT 1 · CHẤT LƯỢNG CHUẨN CHÂU ÂU & THỊ PHẦN BỆNH VIỆN",
        "rows": [
            ("1. Delta Quá Khứ", "11 Dây chuyền EU-GMP", "Năm 2018: Chỉ 2 dây chuyền (Tăng 5.5 lần)", "badge-green", "Công suất đạt 2 tỷ đơn vị"),
            ("2. Peer Benchmark", "Thị phần ETC Nhóm 1-2 đạt 45%", "Dược Hậu Giang & Dược Hà Tây chủ yếu OTC", "badge-amber", "Bỏ xa đối thủ tại kênh bệnh viện"),
            ("3. Chuẩn Quốc Tế", "Chuẩn dược điển EU (Châu Âu)", "SK Group (Hàn Quốc) chuyển giao công nghệ", "badge-cyan", "Chất lượng ngang thuốc nhập ngoại"),
            ("4. Unit Economics", "Biên lãi gộp ETC đạt 41.5%", "Cao hơn kênh bán lẻ OTC truyền thống 15%", "badge-green", "Tỷ lệ trúng thầu thầu công trên 80%")
        ]
    },
    "mbb": {
        "badge": "TRỤ CỘT 1 · HIỆU ỨNG SỐ HÓA & NỀN TẢNG TIỀN GỬI RẺ",
        "rows": [
            ("1. Delta Quá Khứ", "28 Triệu người dùng số", "Năm 2017: 3.5M khách hàng (Tăng trưởng 8x)", "badge-green", "Hơn 35% dân số trưởng thành sử dụng"),
            ("2. Peer Benchmark", "CASA đạt 39.2% (Top 1 TMCP)", "Vượt trội Techcombank (37.5%) & VPBank (18%)", "badge-amber", "Lợi thế chi phí vốn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Tỷ lệ số hóa đạt 97%", "Ngang ngửa KakaoBank (Hàn Quốc) & WeBank", "badge-cyan", "Mô hình Digital First chuẩn mực"),
            ("4. Unit Economics", "Tiết kiệm 7.500 tỷ chi phí vốn", "Chi phí vốn (COF) rẻ hơn toàn ngành 150 bps", "badge-green", "Duy trì NIM cao 4.2 - 4.5%")
        ]
    },
    "mch": {
        "badge": "TRỤ CỘT 1 · MẠNG LƯỚI PHÂN PHỐI & THƯƠNG HIỆU QUỐC DÂN",
        "rows": [
            ("1. Delta Quá Khứ", "350.000 Điểm bán lẻ FMCG", "Năm 2015: 180.000 điểm (Tăng gần gấp đôi)", "badge-green", "Phủ kín từ thành thị đến nông thôn"),
            ("2. Peer Benchmark", "Nước mắm 67% · Tương ớt 71.5%", "Bỏ xa hoàn toàn Ajinomoto, Unilever, Cholimex", "badge-amber", "Vị thế độc tôn trong gian bếp"),
            ("3. Chuẩn Quốc Tế", "Xuất khẩu Costco, Walmart", "Chinh phục thị trường Mỹ, Nhật Bản, Hàn Quốc", "badge-cyan", "Sản phẩm toàn cầu hóa (Go Global)"),
            ("4. Unit Economics", "Biên lãi gộp tăng vọt lên 44.6%", "Tăng +610 bps trong 4 năm qua", "badge-green", "Chuyển giao lạm phát sang giá bán")
        ]
    },
    "mig": {
        "badge": "TRỤ CỘT 1 · KÊNH PHÂN PHỐI ĐỘC QUYỀN & HỆ SINH THÁI QUÂN ĐỘI",
        "rows": [
            ("1. Delta Quá Khứ", "Thị phần tăng lên 6.8% (Top 5)", "Năm 2018: Chỉ 3.5% (Tăng gần gấp đôi)", "badge-green", "Tốc độ thăng hạng nhanh nhất ngành"),
            ("2. Peer Benchmark", "Tăng trưởng phí 18%/năm", "Toàn ngành bảo hiểm phi nhân thọ: 8 - 10%", "badge-amber", "Tăng trưởng gấp 2 lần bình quân ngành"),
            ("3. Chuẩn Quốc Tế", "Mô hình Bancassurance quân đội", "Tỷ lệ thâm nhập bảo hiểm VN mới 1.6% vs ASEAN 3.8%", "badge-cyan", "Dư địa mở rộng thị trường còn 2.5x"),
            ("4. Unit Economics", "Chi phí bán hàng (CAC) tiệm cận 0", "Bán chéo tự động qua ứng dụng MBBank", "badge-green", "Biên lợi nhuận thuần bảo hiểm nở rộng")
        ]
    },
    "ssi": {
        "badge": "TRỤ CỘT 1 · QUY MÔ VỐN HÀNG ĐẦU & CỬA NGÕ VỐN TỔ CHỨC",
        "rows": [
            ("1. Delta Quá Khứ", "Vốn chủ sở hữu >25.000 tỷ", "Năm 2015: 5.000 tỷ (Tăng gấp 5 lần)", "badge-green", "Sức chịu đựng tài chính vượt trội"),
            ("2. Peer Benchmark", "Thị phần khách ngoại đạt >35%", "Top 1 môi giới nhà đầu tư nước ngoài tại VN", "badge-amber", "Vị thế không thể thay thế"),
            ("3. Chuẩn Quốc Tế", "Đối tác chiến lược BlackRock, Vanguard", "Kết nối hệ sinh thái thanh toán Non-prefunding", "badge-cyan", "Chuẩn mực thể chế toàn cầu"),
            ("4. Unit Economics", "Dư nợ Margin tối đa 50.000 tỷ", "Dư địa cấp vốn vay còn gấp đôi hiện tại", "badge-green", "Lợi nhuận mảng margin tăng tốc")
        ]
    },
    "tcx": {
        "badge": "TRỤ CỘT 1 · WEALTHTECH ĐỘT PHÁ & THỐNG TRỊ THỊ TRƯỜNG TRÁI PHIẾU",
        "rows": [
            ("1. Delta Quá Khứ", "Thị phần môi giới 8.2% (Top 3 HOSE)", "Năm 2018: Chỉ 1.5% (Tăng trưởng hơn 5 lần)", "badge-green", "Tăng trưởng thị phần nhanh nhất lịch sử"),
            ("2. Peer Benchmark", "Thị phần Trái phiếu DN >65%", "Thống trị tuyệt đối thị trường trái phiếu chất lượng", "badge-amber", "Con hào bảo trợ Techcombank"),
            ("3. Chuẩn Quốc Tế", "Mô hình Zero-fee Robinhood", "100% giao dịch trực tuyến qua TCInvest", "badge-cyan", "Chuẩn WealthTech tiên tiến nhất VN"),
            ("4. Unit Economics", "CIR siêu tối ưu chỉ 16.5%", "Ngành CTCK truyền thống: 35% - 45%", "badge-green", "Biên lợi nhuận ròng đạt đỉnh 62%")
        ]
    },
    "vcb": {
        "badge": "TRỤ CỘT 1 · ĐỊNH CHẾ TÀI CHÍNH QUỐC GIA & THƯƠNG HIỆU SỐ 1",
        "rows": [
            ("1. Delta Quá Khứ", "Dư nợ tín dụng 1.73 triệu tỷ", "Năm 2016: 500k tỷ (Tăng trưởng 3.5 lần)", "badge-green", "Tăng trưởng an toàn, không nợ xấu"),
            ("2. Peer Benchmark", "Xử lý >20% kim ngạch XNK toàn quốc", "Thị phần thẻ tín dụng cao cấp & FX số 1", "badge-amber", "Vị thế độc tôn thanh toán quốc tế"),
            ("3. Chuẩn Quốc Tế", "Xếp hạng Fitch BB+ (Trần quốc gia)", "Định giá thương hiệu ngân hàng lớn nhất VN", "badge-cyan", "Định chế tài chính chuẩn thể chế"),
            ("4. Unit Economics", "TOI Q2/2026 đạt 26.372 tỷ (+47.6%)", "Thu nhập ngoài lãi chiếm 22-24%", "badge-green", "Lợi nhuận ròng >35.000 tỷ/năm")
        ]
    },
    "vci": {
        "badge": "TRỤ CỘT 1 · ĐỈNH CAO TƯ VẤN M&A & CỬA NGÕ TƯ BẢN QUỐC TẾ",
        "rows": [
            ("1. Delta Quá Khứ", "Tổng deal M&A tư vấn >$5 Tỷ", "Năm 2016: <$1 Tỷ (Tăng trưởng hơn 5 lần)", "badge-green", "Bảo chứng các deal lớn nhất VN"),
            ("2. Peer Benchmark", "Thị phần tư vấn IB đạt >40%", "Bỏ xa các công ty chứng khoán ngân hàng", "badge-amber", "Thương hiệu số 1 trong giới chủ DN"),
            ("3. Chuẩn Quốc Tế", "Mô hình Goldman Sachs Việt Nam", "Mạng lưới quỹ đầu tư mạo hiểm & PE toàn cầu", "badge-cyan", "Chuẩn mực ngân hàng đầu tư phố Wall"),
            ("4. Unit Economics", "Biên lợi nhuận mảng IB >65%", "Phí tư vấn thành công đem lại lợi nhuận đột biến", "badge-green", "Tỷ suất ROE bùng nổ trong pha Uptrend")
        ]
    },
    "vnm": {
        "badge": "TRỤ CỘT 1 · MẠNG LƯỚI PHỦ KÍN 63 TỈNH & CHUỖI CUNG ỨNG KHÉP KÍN",
        "rows": [
            ("1. Delta Quá Khứ", "Tự chủ nguồn sữa tươi >65%", "Năm 2015: Chỉ đạt dưới 30% (Tăng gấp đôi)", "badge-green", "Giảm phụ thuộc bột sữa nhập khẩu"),
            ("2. Peer Benchmark", "Thị phần sữa nước >55% · Sữa đặc >80%", "Bỏ xa TH True Milk, Dutch Lady, Nutifood", "badge-amber", "Thương hiệu quốc dân gắn liền nhiều thế hệ"),
            ("3. Chuẩn Quốc Tế", "Top 36 công ty sữa lớn nhất thế giới", "Hệ thống trang trại Green Farm trung hòa carbon", "badge-cyan", "Chứng chỉ phát triển bền vững ESG"),
            ("4. Unit Economics", "Biên EBITDA dẫn đầu đạt 24.2%", "Vượt trội Danone (16%) và Nestlé (18.5%)", "badge-green", "Cổ tức tiền mặt 6.000 - 8.000 tỷ/năm")
        ]
    },
    "vpb": {
        "badge": "TRỤ CỘT 1 · QUY MÔ VỐN TỰ CÓ & ĐỘNG CƠ NIM DẪN ĐẦU TOÀN NGÀNH",
        "rows": [
            ("1. Delta Quá Khứ", "Vốn chủ sở hữu đạt 140.000 tỷ", "Năm 2018: 35.000 tỷ (Tăng trưởng 4 lần)", "badge-green", "Quy mô vốn Top 2 toàn ngành ngân hàng"),
            ("2. Peer Benchmark", "Hệ số CAR đạt 17.2% (Top 1 VN)", "Gấp đôi quy định tối thiểu 8% của NHNN", "badge-amber", "Bộ đệm chống sốc an toàn tuyệt đối"),
            ("3. Chuẩn Quốc Tế", "Đối tác chiến lược SMBC (Nhật Bản)", "Tập đoàn tài chính lớn thứ 2 Nhật Bản hậu thuẫn", "badge-cyan", "Chuẩn quản trị Basel III tiên tiến"),
            ("4. Unit Economics", "NIM đạt 5.6% (Cao nhất hệ thống)", "Vượt trội hoàn toàn Big 4 ở mức 3.0 - 3.3%", "badge-green", "Lợi nhuận trước thuế kế hoạch 23k tỷ")
        ]
    }
}

# S6 DATA (Trụ Cột 3: Sức Khỏe Tài Chính & Đòn Bẩy Vận Hành) for ALL 21 tickers
S6_DATA = {
    "acb": [
        ("1. ROE Bền Vững", "23.5% (6 năm liên tục)", "Ngành ngân hàng: 16% - 18% · DBS 18%", "badge-green", "Lợi nhuận tích lũy tái đầu tư bền vững"),
        ("2. Tối Ưu CIR", "32.5% (Top tiết kiệm)", "Quá khứ 48% · Toàn ngành 38-42% · ASEAN 35%", "badge-cyan", "Tiết kiệm hàng nghìn tỷ chi phí vận hành"),
        ("3. Quản Trị Rủi Ro", "NPL 1.15% · 0% TPDN rủi ro", "Toàn ngành NPL 2.2% · Chuẩn Basel II/III", "badge-amber", "Chi phí trích lập dự phòng cực thấp"),
        ("4. Cổ Tức Cổ Đông", "25% (15% CP + 10% Tiền)", "Chi trả đều 6 năm · Tỷ suất kép >20%/năm", "badge-green", "Cổ phiếu tích sản chuẩn mực cho SIP")
    ],
    "bid": [
        ("1. Tỷ Suất ROE", "19.8% (Đỉnh cao mới)", "Quá khứ 12-14% · Ngành 16.5% · Big 4 Á 16%", "badge-green", "Lợi nhuận giữ lại bổ sung vốn tự có"),
        ("2. Tối Ưu CIR", "31.2% (Cải thiện rõ nét)", "Quá khứ 42% · Ngành 38-40% · Số hóa 1.100 PGD", "badge-cyan", "Tối ưu hóa năng suất mạng lưới toàn quốc"),
        ("3. Bao Phủ Nợ LLR", "LLR 165% · NPL 1.25%", "Quá khứ LLR 80% · Xóa sạch nợ xấu VAMC", "badge-amber", "Bộ đệm dự phòng vững chắc"),
        ("4. Dòng Tiền & Cổ Tức", "LNST kế hoạch 30.000 tỷ", "Cổ tức tiền mặt + CP tăng vốn · Hana Bank", "badge-green", "Gia tăng giá trị nội tại dài hạn cho SIP")
    ],
    "ctg": [
        ("1. Tỷ Suất ROE", "18.5% (Phục hồi mạnh)", "Quá khứ 11-13% · Ngành 16.5% · Big 4 Á 16%", "badge-green", "Hiệu quả sử dụng vốn cổ đông tăng tốc"),
        ("2. Tối Ưu CIR", "28.8% (Top 2 Big 4)", "Quá khứ 38% · Toàn ngành 38-40%", "badge-cyan", "Số hóa luồng thanh toán doanh nghiệp"),
        ("3. Bao Phủ Nợ LLR", "LLR 170% · NPL 1.3%", "Quá khứ LLR 110% · Trích lập sạch sẽ", "badge-amber", "Tiết giảm chi phí dự phòng tương lai"),
        ("4. Biên An Toàn SIP", "P/E 6.2x (Rẻ nhất Big 4)", "VCB 12.5x · BID 10.2x · Biên chiết khấu 35%", "badge-green", "Vùng định giá tích sản siêu hấp dẫn")
    ],
    "ctr": [
        ("1. Tỷ Suất ROE", "20.8% (Tăng trưởng đều)", "Quá khứ 16.5% · Ngành xây lắp 10-12%", "badge-green", "Hiệu quả khai thác tài sản hạ tầng cao"),
        ("2. Biên EBITDA", "68% (Mảng TowerCo)", "Toàn công ty 11.5% · Chuẩn AMT Mỹ 65%", "badge-cyan", "Biên lợi nhuận nở rộng theo Tenancy"),
        ("3. Đòn Bẩy Nợ Vay", "Net Debt/EBITDA chỉ 0.8x", "Dưới ngưỡng an toàn 3.5x · Chuẩn QT 4-5x", "badge-amber", "Rủi ro tài chính gần như bằng 0"),
        ("4. Cổ Tức Tiền Mặt", "20 - 30% tiền mặt/năm", "Tăng trưởng đều 15%/năm · Hậu thuẫn Viettel", "badge-green", "Dòng tiền niên kim phòng thủ hoàn hảo")
    ],
    "fpt": [
        ("1. Tỷ Suất ROE", "26.5% (Bền vững 10 năm)", "VN-Index 12-14% · Infosys 28% · TCS 30%", "badge-green", "Cỗ máy tái sinh lợi nhuận kép kỳ quan"),
        ("2. Biên EBIT IT Ngoại", "17.2% (Tăng liên tục)", "Quá khứ 14.5% · Ngành IT nội 8-10%", "badge-cyan", "Nâng cấp từ gia công lên AI toàn cầu"),
        ("3. Tiền Mặt Ròng", "Net Cash >28.000 tỷ", "Quá khứ 12.000 tỷ · Không nợ vay ròng", "badge-amber", "Tự tài trợ 100% Capex AI Factory"),
        ("4. Cổ Tức & Lợi Tức", "20% tiền + 15% cổ phiếu", "Duy trì kỷ luật chi trả hơn 15 năm liên tục", "badge-green", "Tích sản tăng trưởng bền vững số 1 VN")
    ],
    "frt": [
        ("1. Điểm Uốn ROE", "24.5% (Phục hồi thần tốc)", "Năm 2023 lỗ FPT Shop · Chuỗi CVS Mỹ 22%", "badge-green", "Điểm uốn bùng nổ lợi nhuận sau đầu tư"),
        ("2. Biên Lãi Gộp", "23.5% (Toàn tập đoàn)", "Quá khứ 14% · Chuỗi dược phẩm quốc tế 25%", "badge-cyan", "Long Châu kéo tăng toàn bộ biên lãi"),
        ("3. Chu Kỳ Tiền Mặt", "CCC rút ngắn 38 ngày", "Quá khứ 65 ngày · Ngành bán lẻ 55 ngày", "badge-amber", "Thu hồi tiền mặt trực tiếp từ khách lẻ"),
        ("4. Dòng Tiền CFO", "CFO >2.500 tỷ/năm", "Quá khứ âm dòng tiền do mở mới ồ ạt", "badge-green", "Tự tài trợ mở rộng không cần nợ vay")
    ],
    "gmd": [
        ("1. Biên Gộp Cảng Biển", "49.4% (Đỉnh cao ngành cảng)", "Quá khứ 38% · Ngành cảng VN 35-40%", "badge-green", "Ngang ngửa cảng Singapore (PSA)"),
        ("2. Tỷ Suất ROE", "18.2% (Tăng trưởng thực)", "Quá khứ 11-13% · Chuẩn logistics QT 15%", "badge-cyan", "Tối ưu hóa công suất đón siêu tàu"),
        ("3. Rủi Ro Nợ Vay", "Net Debt/VCSH chỉ 0.25x", "Quá khứ 0.85x · Đã trả sạch nợ vay USD", "badge-amber", "Triệt tiêu hoàn toàn rủi ro tỷ giá"),
        ("4. FCF & Cổ Tức", "FCF thặng dư >2.000 tỷ/năm", "Thu hoạch dòng tiền · Cổ tức tiền mặt 15-20%", "badge-green", "Dòng tiền mặt thật chia cổ tức cho SIP")
    ],
    "hpg": [
        ("1. Biên EBITDA", "18.5% (Đầu ngành luyện thép)", "Đáy 6.5% · Baosteel 12% · POSCO 10.5%", "badge-green", "Chi phí sản xuất HRC thấp nhất thế giới"),
        ("2. Điểm Uốn FCF", "FCF dự phóng >15.000 tỷ", "2022-2024 âm dòng tiền do Capex 85k tỷ", "badge-cyan", "Dung Quất 2 kết chuyển tài sản"),
        ("3. Cấu Trúc Nợ Vay", "Net Debt/VCSH giảm về 0.35x", "Quá khứ 0.72x · Chuẩn thép an toàn QT 0.4x", "badge-amber", "Tiết giảm hàng nghìn tỷ chi phí lãi vay"),
        ("4. Tỷ Suất ROE", "Kỳ vọng 22 - 24% khi full", "Đáy chu kỳ 7.5% · Bình quân 10 năm 19.5%", "badge-green", "Đòn bẩy EPS tăng tốc ngoạn mục")
    ],
    "imp": [
        ("1. Biên Lãi Gộp ETC", "41.5% (Dược kỹ thuật cao)", "Quá khứ 34% · Ngành 28-32% · EU 45%", "badge-green", "Hàng rào kỹ thuật EU-GMP bảo vệ biên lãi"),
        ("2. Tỷ Suất ROE", "22.5% (Tăng trưởng bền)", "Quá khứ 14.5% trước khi SK Group tiếp quản", "badge-cyan", "Nâng cấp tiêu chuẩn quản trị toàn cầu"),
        ("3. An Toàn Nợ Vay", "Nợ vay/VCSH <0.05x (Zero Debt)", "Không chịu áp lực lãi vay · Phòng thủ tuyệt đối", "badge-amber", "An toàn tối đa trước mọi biến động vĩ mô"),
        ("4. Cổ Tức Tiền Mặt", "15 - 20% tiền mặt/CP", "Duy trì đều đặn 10 năm · SK cam kết dài hạn", "badge-green", "Cổ phiếu tích sản chuẩn Benjamin Graham")
    ],
    "mbb": [
        ("1. Chi Phí Vốn (COF)", "3.2% (Nhờ CASA 39.2%)", "Toàn ngành 4.8-5.2% · CASA Top 1 TMCP", "badge-green", "Tiết kiệm 7.500 tỷ chi phí trả lãi/năm"),
        ("2. Tối Ưu Hóa CIR", "28.2% (Thấp nhất TMCP)", "Quá khứ 39% · Toàn ngành 38-42%", "badge-cyan", "Số hóa 97% triệt tiêu chi phí quầy"),
        ("3. Tỷ Suất ROE", "23.5% (Bền bỉ suốt 7 năm)", "Hệ thống ngân hàng VN: 16-18%", "badge-amber", "Top 3 ngân hàng sinh lời cao nhất VN"),
        ("4. Bộ Đệm Nợ Xấu", "LLR 140% · NPL 1.4%", "Đã chủ động trích lập phòng ngừa rủi ro", "badge-green", "Sẵn sàng hoàn nhập dự phòng đẩy LN")
    ],
    "mch": [
        ("1. Biên Lợi Nhuận Gộp", "44.6% (+610 bps 4 năm)", "FMCG VN: 28-30% · Unilever 42% · Nestlé 46%", "badge-green", "Sức mạnh định giá bảo vệ trọn vẹn biên lãi"),
        ("2. Tỷ Suất ROIC", "ROIC >35% (Top 5% thị trường)", "Quá khứ 25% · Ngành tiêu dùng 18%", "badge-cyan", "Cỗ máy in tiền mặt hoàn hảo của Masan"),
        ("3. Dòng Tiền FCF", "FCF >6.500 tỷ/năm", "Tỷ lệ FCF/EBITDA >85% · Nợ ròng giảm về 0", "badge-amber", "Dòng tiền mặt dồi dào, thanh khoản tuyệt hảo"),
        ("4. Động Lực Cổ Đông", "Cổ tức tiền mặt 50-70% LNST", "Kế hoạch niêm yết HOSE · Tái định giá P/E 20x", "badge-green", "Cổ phiếu tích sản tăng trưởng dòng tiền #1")
    ],
    "mig": [
        ("1. Tỷ Lệ Kết Hợp", "93.5% (Có lãi bảo hiểm)", "Quá khứ 98% · Ngành 97-102% · Chuẩn QT <95%", "badge-green", "Không cần bù lỗ bảo hiểm bằng lãi đầu tư"),
        ("2. Quy Mô Float", ">4.500 tỷ tiền gửi ngân hàng", "Tăng trưởng 18%/năm · 100% gửi Big4 & MB", "badge-cyan", "Thu về 320-350 tỷ lãi tiền gửi ròng/năm"),
        ("3. Tỷ Suất ROE", "18.5% (Tăng trưởng liên tục)", "Quá khứ 11-13% · Toàn ngành 12-14%", "badge-amber", "Tận dụng kênh số hóa MBBank tối ưu chi phí"),
        ("4. Kiểm Soát Bồi Thường", "Tỷ lệ bồi thường chỉ 31.5%", "Ứng dụng AI phân loại rủi ro · Ngành 38%", "badge-green", "Bảo toàn dòng lợi tức tiền mặt cho SIP")
    ],
    "mwg": [
        ("1. Biên Lãi Gộp", "22.2% (+400 bps sau tái cấu trúc)", "Quá khứ 18.2% · Chuỗi Best Buy Mỹ 22%", "badge-green", "Tối ưu hóa giá vốn & giảm chiết khấu"),
        ("2. Tỷ Lệ SG&A", "14.2% (Tối ưu ngoạn mục)", "Quá khứ 18.5% (Đóng 200 shop kém hiệu quả)", "badge-cyan", "Đòn bẩy vận hành bùng nổ khi doanh thu tăng"),
        ("3. Tiền Mặt Ròng", "Net Cash >25.000 tỷ VNĐ", "Lãi tiền gửi >1.500 tỷ/năm · Bảng cân đối kỷ lục", "badge-amber", "Sẵn sàng chia cổ tức tiền mặt & mua CP quỹ"),
        ("4. Dòng Tiền CFO", "CFO >12.000 tỷ/năm", "Chuyển sang thu hoạch · FCF Yield >8%", "badge-green", "Trụ cột tích sản tiêu dùng - bán lẻ #1")
    ],
    "pow": [
        ("1. Dòng Tiền CFO", ">6.000 tỷ/năm (Rất dồi dào)", "Khấu hao lớn chuyển thành tiền mặt", "badge-green", "Đảm bảo nguồn trả nợ vay Nhơn Trạch 3-4"),
        ("2. Hết Khấu Hao Lõi", "Cà Mau 1-2 & Vũng Áng 1", "Giảm chi phí khấu hao hàng nghìn tỷ/năm", "badge-cyan", "Lợi nhuận gộp bùng nổ tự nhiên sau khấu hao"),
        ("3. Tỷ Lệ Nợ Vay", "Nợ vay/VCSH 0.65x (An toàn)", "Fitch BB+ · Lãi vay ưu đãi ODA/ECA <4%/năm", "badge-amber", "Chi phí vốn đầu tư cực kỳ cạnh tranh"),
        ("4. Cổ Tức Tiền Mặt", "3-5% ➔ Tăng lên 8-10%", "PVN hỗ trợ toàn diện · Cổ tức tăng sau 2026", "badge-green", "Tài sản tích sản phòng thủ dòng tiền dài hạn")
    ],
    "ssi": [
        ("1. Đòn Bẩy Margin", "25.000 tỷ (Margin/VCSH 1.0x)", "Trần UBCK 2.0x · Dư địa mở rộng margin >25k tỷ", "badge-green", "Hệ thống quản trị rủi ro danh mục real-time"),
        ("2. Biên Ròng Margin", ">55% (Đóng góp LN ổn định)", "Chênh lệch lãi suất cho vay 11% vs vốn 5.5%", "badge-cyan", "Dòng tiền lợi nhuận định kỳ vững chắc"),
        ("3. Tỷ Suất ROE", "18.5% (Tăng theo sóng)", "Quá khứ đáy 11% · Đỉnh 22% · Cao hơn ngành 500 bps", "badge-amber", "Cỗ máy tích lũy vốn tự có số 1 thị trường"),
        ("4. Cổ Tức & Thưởng", "10% tiền mặt + Cổ phiếu", "Duy trì kỷ luật chi trả hơn 15 năm liên tục", "badge-green", "Hưởng lợi trực tiếp từ thanh khoản TTCK")
    ],
    "tcx": [
        ("1. Tỷ Lệ CIR", "16.5% (Thấp nhất toàn ngành)", "CTCK truyền thống: 35% - 45% · Robinhood 18%", "badge-green", "Mô hình số hóa triệt tiêu chi phí mặt bằng"),
        ("2. Biên Lợi Nhuận Ròng", "62% (Kỷ lục thị trường vốn)", "Ngành CTCK truyền thống chỉ 25 - 35%", "badge-cyan", "Hiệu quả chuyển hóa doanh thu sang LN ròng"),
        ("3. Tỷ Suất ROE", "25.5% (Dẫn đầu toàn ngành)", "Bình quân các CTCK lớn tại VN: 14 - 17%", "badge-amber", "Vốn chủ sở hữu tăng trưởng phi mã hàng năm"),
        ("4. Động Lực IPO", "Định giá dự kiến 2-3 tỷ USD", "Techcombank chi phối · Thặng dư lớn cho cổ đông", "badge-green", "Cổ phiếu WealthTech tiềm năng bùng nổ nhất")
    ],
    "vcb": [
        ("1. Tỷ Lệ Bao Phủ LLR", ">250% (Đỉnh cao lịch sử VN)", "Toàn ngành ngân hàng: 95% · Quá khứ 120%", "badge-green", "Kho dự phòng 25.000 tỷ sẵn sàng hoàn nhập"),
        ("2. Tối Ưu Hóa CIR", "29.5% (Chi phí biên cực thấp)", "Quá khứ 38% · Toàn ngành 38-45% · DBS 39%", "badge-cyan", "Chi phí phục vụ người dùng số tiệm cận 0"),
        ("3. Tỷ Suất ROE", "21.5% (8 năm liền >20%)", "Ngân hàng sinh lời bền vững nhất Việt Nam", "badge-amber", "Tái tạo vốn tự có cổ đông bền bỉ"),
        ("4. An Toàn Vốn CAR", ">12.5% (Đạt chuẩn Basel III)", "Quy định tối thiểu 8.0% · Fitch BB+ trần QG", "badge-green", "Cổ phiếu tích sản chuẩn thể chế (Sovereign)")
    ],
    "vci": [
        ("1. Biên Lợi Nhuận IB", ">65% (Dịch vụ tư vấn cấp cao)", "Môi giới thuần túy: 20% · Goldman Sachs VN", "badge-green", "Phí tư vấn deal lớn đem lại LN đột biến"),
        ("2. Tỷ Suất ROE", "20.5% (Top đầu khối CTCK)", "Cao hơn bình quân ngành CTCK 500-600 bps", "badge-cyan", "Đòn bẩy lợi nhuận bùng nổ khi thị trường tăng"),
        ("3. Quản Trị Đòn Bẩy", "Nợ vay ròng/VCSH chỉ 0.8x", "Không đầu tư trái phiếu rủi ro · Tự doanh chọn lọc", "badge-amber", "Bảo toàn an toàn vốn cho nhà đầu tư SIP"),
        ("4. Lợi Tức Cổ Đông", "10-15% tiền mặt + Cổ phiếu", "Đồng hành cùng ban lãnh đạo sở hữu tỷ lệ lớn", "badge-green", "Tích sản cùng giới tinh hoa tài chính VN")
    ],
    "vnm": [
        ("1. Biên EBITDA", "24.2% (Vượt chuẩn quốc tế)", "Ngành sữa VN 14-16% · Danone 16% · Nestlé 18.5%", "badge-green", "Tự chủ nguyên liệu & quy mô số 1"),
        ("2. ROIC & ROE", "ROIC >28% · ROE >25%", "Duy trì bền bỉ qua hơn 2 thập kỷ · Top 10 vốn", "badge-cyan", "Cỗ máy sinh lời tiền mặt bền bỉ huyền thoại"),
        ("3. Tiền Mặt Ròng", "Net Cash >15.000 tỷ VNĐ", "Sạch bóng nợ vay tài chính · CFO >9.000 tỷ/năm", "badge-amber", "Miễn nhiễm hoàn toàn với rủi ro lãi suất"),
        ("4. Cổ Tức Tiền Mặt", "6.000 - 8.000 tỷ/năm (Yield 6%)", "Tỷ lệ chi trả 80-90% LNST · Trả đều 20 năm", "badge-green", "Trụ cột tích sản phòng thủ cổ tức số 1")
    ],
    "vpb": [
        ("1. Hệ Số CAR", "17.2% (Cao nhất hệ thống VN)", "Quy định tối thiểu 8.0% · Basel III QT 10.5%", "badge-green", "Bộ đệm vốn an toàn tuyệt đối chống mọi sốc"),
        ("2. Động Cơ NIM", "5.6% (Top 1 toàn hệ thống)", "Big 4 ở mức 3.0-3.3% · Động cơ sinh lời mạnh", "badge-cyan", "Chênh lệch lãi suất cao bù đắp rủi ro"),
        ("3. Tối Ưu CIR", "26.5% (Top tiết kiệm chi phí)", "Quá khứ 34% · Số hóa luồng phê duyệt tín dụng", "badge-amber", "Chi phí vận hành giảm sâu sau tái cơ cấu"),
        ("4. Điểm Uốn FE Credit", "Lãi trở lại >2.000 tỷ/năm", "Chu kỳ trước lỗ lớn · Chuẩn phục hồi tài chính", "badge-green", "Động lực đẩy lợi nhuận hợp nhất tăng vọt")
    ],
    "vtp": [
        ("1. Chi Phí Xử Lý/Kiện", "Giảm 25% (Nhờ robot AI)", "Tốc độ xử lý 0.3s/kiện · Chi phí nhân công ngành tăng", "badge-green", "Lợi thế chi phí biên đè bẹp đối thủ"),
        ("2. Biên EBITDA", "Cải thiện lên 9.2%", "Quá khứ 5.2% · Chuẩn châu Á: SF Express 11%", "badge-cyan", "Quy mô 4 triệu kiện/ngày phát huy hiệu quả"),
        ("3. Vòng Quay Vốn", "Tăng 2.2 lần (Thu tiền nhanh)", "Chu kỳ tiền mặt ngắn nhờ hệ sinh thái Viettel", "badge-amber", "Dòng tiền hoạt động kinh doanh dương lớn"),
        ("4. Tỷ Suất ROE", "19.5% (Tăng trưởng ấn tượng)", "Quá khứ 14.2% · Tăng trưởng LN 25-30%/năm", "badge-green", "Đón đầu làn sóng TMĐT xuyên biên giới")
    ]
}

def build_s4_card(ticker):
    data = S4_DATA.get(ticker)
    if not data:
        return None
    rows_html = ""
    for r in data["rows"]:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-cyan); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><span class="badge {r[3]}">{r[4]}</span></td>
                </tr>\n"""
    return f"""          <!-- Cột 2: Bảng Đối Chiếu 4D Landscape Trụ Cột 1 -->
          <div class="card card-emerald" style="padding: 16px;">
            <div class="card-badge badge-emerald" style="margin-bottom: 6px;">{data['badge']} (4D LANDSCAPE)</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">Đối chiếu đa chiều: Quá khứ · Đối thủ toàn ngành · Chuẩn quốc tế · Giá trị dòng tiền:</p>
            <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
              <thead>
                <tr>
                  <th>Hệ Quy Chiếu</th>
                  <th>Chỉ Số Cốt Lõi</th>
                  <th>Đối Chiếu Ngành / Quốc Tế</th>
                  <th>Ý Nghĩa Tăng Trưởng</th>
                </tr>
              </thead>
              <tbody>
{rows_html}              </tbody>
            </table>
          </div>"""

def build_s6_card(ticker):
    rows = S6_DATA.get(ticker, [])
    rows_html = ""
    for r in rows:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-emerald); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><span class="badge {r[3]}">{r[4]}</span></td>
                </tr>\n"""
    return f"""          <!-- Cột 2: Bảng Đối Chiếu 4D Landscape Trụ Cột 3 -->
          <div class="card card-cyan" style="padding: 16px;">
            <div class="card-badge badge-cyan" style="margin-bottom: 6px;">BẢNG ĐỐI CHIẾU 4D SỨC KHỎE TÀI CHÍNH & ĐÒN BẨY VẬN HÀNH</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">Định vị cấu trúc sinh lời và bộ đệm an toàn vốn so với toàn ngành và chuẩn mực quốc tế:</p>
            <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
              <thead>
                <tr>
                  <th>Chỉ Số Tài Chính</th>
                  <th>Chỉ Số Hiện Tại</th>
                  <th>Quá Khứ & Toàn Ngành / Quốc Tế</th>
                  <th>Ý Nghĩa Bảo Vệ Cổ Đông</th>
                </tr>
              </thead>
              <tbody>
{rows_html}              </tbody>
            </table>
          </div>"""

def process_file(file_path):
    ticker = os.path.basename(file_path).replace('_canvas_lv3_presentation.html', '').replace('.html', '').lower()
    content = open(file_path).read()
    orig = content
    
    # 1. Process Slide 4 (if ticker in S4_DATA and file does not have an S4 table yet or needs S4 upgrade)
    # Note: for FRT, Slide 4 already has chart on right column, so we place S4 table on column 1!
    if ticker in S4_DATA:
        s4_match = re.search(r'(<section class=\"slide[^\"]*\" id=\"slide-4\".*?</section>)', content, re.DOTALL)
        if s4_match:
            s4 = s4_match.group(1)
            # If ticker is FRT: replace column 1 text with S4 table!
            if ticker == "frt":
                c1_match = re.search(r'(<!-- Cột 1:.*?<div class=\"card\"[^>]*>).*?(<!-- Cột 2:)', s4, re.DOTALL)
                if c1_match:
                    new_c1 = f"""<!-- Cột 1: Bảng Đối Chiếu 4D Landscape Trụ Cột 1 -->
          <div class="card" style="padding: 16px; display: flex; flex-direction: column; gap: 6px;">
            <div class="card-badge badge-emerald" style="margin-bottom: 4px;">CON HÀO VẬN HÀNH & HIỆU QUẢ QUY MÔ (4D LANDSCAPE)</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Đối chiếu đa chiều: Quá khứ · Đối thủ toàn ngành · Chuẩn quốc tế · Giá trị dòng tiền:</p>
            <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
              <thead>
                <tr>
                  <th>Hệ Quy Chiếu</th>
                  <th>Chỉ Số Long Châu</th>
                  <th>Đối Chiếu Ngành / Quốc Tế</th>
                  <th>Ý Nghĩa Tăng Trưởng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. Delta Quá Khứ</strong></td>
                  <td style="color: var(--accent-cyan); font-weight: 700;">2.600 Nhà thuốc (+550%)</td>
                  <td>Năm 2021: 400 Shop (Tăng 6.5x)</td>
                  <td><span class="badge badge-green">Tốc độ mở shop kỷ lục</span></td>
                </tr>
                <tr>
                  <td><strong>2. Peer Benchmark</strong></td>
                  <td style="color: var(--accent-gold); font-weight: 700;">1.2 Tỷ/shop/tháng</td>
                  <td>Pharmacity: 450tr · An Khang: 380tr</td>
                  <td><span class="badge badge-amber">Hiệu quả gấp 2.7x - 3.1x</span></td>
                </tr>
                <tr>
                  <td><strong>3. Chuẩn Quốc Tế</strong></td>
                  <td style="color: var(--accent-rose); font-weight: 700;">Mô hình Boots / CVS</td>
                  <td>Thuốc kê đơn + Mỹ phẩm + Tiêm chủng</td>
                  <td><span class="badge badge-cyan">Xu hướng y tế toàn cầu</span></td>
                </tr>
                <tr>
                  <td><strong>4. Unit Economics</strong></td>
                  <td style="color: var(--accent-emerald); font-weight: 700;">Hòa vốn sau 6 tháng</td>
                  <td>Thu hồi vốn đầu tư nhanh kỷ lục</td>
                  <td><span class="badge badge-green">Biên gộp chuỗi tăng 23.5%</span></td>
                </tr>
              </tbody>
            </table>
          </div>\n\n          """
                    new_s4 = s4[:c1_match.start()] + new_c1 + s4[c1_match.start(2):]
                    content = content.replace(s4, new_s4)
            else:
                # For banking and other 14 tickers: check if S4 already has a table
                if '<table' not in s4:
                    # Replace column 2 card with build_s4_card
                    # In banking: column 2 is typically '<div class="card">\s*<div class="card-title">Mô Hình Dòng Tiền Hoạt Động.*?</div>\s*</div>\s*</div>\s*</section>'
                    grid_match = re.search(r'(<div class=\"grid-2\">.*?<div class=\"card\"[^>]*>.*?</div>\s*)(<div class=\"card\"[^>]*>.*?</div>)(\s*</div>\s*</div>\s*</section>)', s4, re.DOTALL)
                    if grid_match:
                        col1 = grid_match.group(1)
                        closing = grid_match.group(3)
                        new_s4 = s4[:grid_match.start()] + col1 + build_s4_card(ticker) + "\n        " + closing
                        content = content.replace(s4, new_s4)
    
    # 2. Process Slide 6 (Trụ Cột 3) for ALL 21 tickers
    s6_match = re.search(r'(<section class=\"slide[^\"]*\" id=\"slide-6\".*?</section>)', content, re.DOTALL)
    if s6_match:
        s6 = s6_match.group(1)
        if ticker == "hpg":
            # For HPG: replace bottom card with 4D table
            hpg_bottom_match = re.search(r'(<div class=\"card card-highlight\">.*?</div>)(\s*</div>\s*</section>)', s6, re.DOTALL)
            if hpg_bottom_match:
                new_hpg_table = f"""<div class="card card-cyan" style="padding: 16px; margin-top: 10px;">
          <div class="card-badge badge-cyan" style="margin-bottom: 6px;">BẢNG ĐỐI CHIẾU 4D SỨC KHỎE TÀI CHÍNH & ĐIỂM UỐN DÒNG TIỀN TỰ DO (FCF)</div>
          <table class="comp-table" style="margin-top: 4px; font-size: 11px; width: 100%;">
            <thead>
              <tr>
                <th>Chỉ Số Tài Chính</th>
                <th>Chỉ Số Hiện Tại</th>
                <th>Quá Khứ & Toàn Ngành / Quốc Tế</th>
                <th>Ý Nghĩa Bảo Vệ Cổ Đông</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Biên EBITDA</strong></td>
                <td style="color: var(--accent-emerald); font-weight: 700;">18.5% (Đầu ngành thép)</td>
                <td>Đáy 6.5% · Baosteel 12% · POSCO 10.5%</td>
                <td><span class="badge badge-green">Chi phí HRC thấp nhất thế giới</span></td>
              </tr>
              <tr>
                <td><strong>2. Điểm Uốn FCF</strong></td>
                <td style="color: var(--accent-emerald); font-weight: 700;">FCF dự phóng >15.000 tỷ</td>
                <td>2022-2024 âm dòng tiền do Capex 85k tỷ</td>
                <td><span class="badge badge-cyan">Dung Quất 2 kết chuyển tài sản</span></td>
              </tr>
              <tr>
                <td><strong>3. Cấu Trúc Nợ Vay</strong></td>
                <td style="color: var(--accent-emerald); font-weight: 700;">Net Debt/VCSH giảm 0.35x</td>
                <td>Quá khứ 0.72x · Chuẩn thép an toàn QT 0.4x</td>
                <td><span class="badge badge-amber">Tiết giảm hàng nghìn tỷ lãi vay</span></td>
              </tr>
              <tr>
                <td><strong>4. Tỷ Suất ROE</strong></td>
                <td style="color: var(--accent-emerald); font-weight: 700;">Kỳ vọng 22 - 24% khi full</td>
                <td>Đáy chu kỳ 7.5% · Bình quân 10 năm 19.5%</td>
                <td><span class="badge badge-green">Đòn bẩy EPS tăng tốc ngoạn mục</span></td>
              </tr>
            </tbody>
          </table>
        </div>"""
                new_s6 = s6[:hpg_bottom_match.start()] + new_hpg_table + hpg_bottom_match.group(2)
                content = content.replace(s6, new_s6)
        else:
            # For other 20 tickers: replace column 2 card with build_s6_card
            grid_match = re.search(r'(<div class=\"grid-2\">.*?<div class=\"card[^\"]*\"[^>]*>.*?</div>\s*)(<div class=\"card[^\"]*\"[^>]*>.*?</div>)(\s*</div>\s*(?:</div>)?\s*</section>)', s6, re.DOTALL)
            if grid_match:
                col1 = grid_match.group(1)
                closing = grid_match.group(3)
                new_s6 = s6[:grid_match.start()] + col1 + build_s6_card(ticker) + "\n        " + closing
                content = content.replace(s6, new_s6)
    
    if content != orig:
        open(file_path, 'w').write(content)
        return True
    return False

# Run on both directories
dirs = ['finpeace-web/public/canvas-lv3', 'tai lieu FinPeace']
for d in dirs:
    count = 0
    for f in sorted(glob.glob(f'{d}/*.html')):
        if process_file(f):
            count += 1
            print(f'Updated {os.path.basename(f)} in {d}')
    print(f'Total updated in {d}: {count} files')

