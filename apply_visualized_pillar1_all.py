import os, glob, re
from test_mapping import PILLAR1_MAP
from update_all_pillars_landscape import S4_DATA

# Extra S4 data for tickers that had tables earlier (ctr, gmd, hpg, mwg, pow, vtp)
EXTRA_S4 = {
    "ctr": {
        "badge": "TRỤ CỘT 1 · HẠ TẦNG CHIA SẺ & THỊ PHẦN TOWERCO >85%",
        "rows": [
            ("1. Delta Quá Khứ", "100.000 Trạm BTS hạ tầng", "Năm 2018: Chỉ 1.500 trạm (Tăng hơn 60x)", "badge-green", "Quy mô số 1 toàn quốc"),
            ("2. Peer Benchmark", "Thị phần TowerCo đạt >85%", "Bỏ xa các đơn vị tư nhân nhỏ lẻ khác", "badge-amber", "Thống trị hạ tầng cho thuê"),
            ("3. Chuẩn Quốc Tế", "Tenancy Ratio đạt 1.35x", "Chuẩn quốc tế: American Tower (AMT) 1.9x", "badge-cyan", "Dư địa tăng doanh thu/trạm"),
            ("4. Unit Economics", "Biên EBITDA mảng trạm đạt 68%", "Hợp đồng thuê 10-15 năm dòng tiền bền vững", "badge-green", "Dòng tiền niên kim tích sản")
        ]
    },
    "gmd": {
        "badge": "TRỤ CỘT 1 · CỤM CẢNG NƯỚC SÂU ĐÓN TÀU MẸ TOÀN CẦU",
        "rows": [
            ("1. Delta Quá Khứ", "Sản lượng >3.5M TEU (+130%)", "Năm 2018: 1.5M TEU trước khi có Gemalink", "badge-green", "Tăng trưởng gấp 2.3 lần"),
            ("2. Peer Benchmark", "Đón siêu tàu 24.000 TEU lớn nhất", "Cát Lái & Hải Phòng không đón được tàu lớn", "badge-amber", "Vị thế cảng nước sâu số 1"),
            ("3. Chuẩn Quốc Tế", "Tuyến đi thẳng Bờ Tây Mỹ", "Không qua cảng trung chuyển Singapore/Malaysia", "badge-cyan", "Tiết kiệm 5-7 ngày hải trình"),
            ("4. Unit Economics", "Biên gộp cảng biển đạt 49.4%", "Liên minh CMA-CGM cam kết lấp đầy công suất", "badge-green", "Dòng tiền kinh doanh thặng dư")
        ]
    },
    "hpg": {
        "badge": "TRỤ CỘT 1 · S-CURVE THÉP & CHI PHÍ SẢN XUẤT THẤP NHẤT",
        "rows": [
            ("1. Delta Quá Khứ", "Công suất 14.5M tấn (Gấp 6.5x)", "Năm 2015: Chỉ 2.2M tấn (Tăng vọt Top 30 TG)", "badge-green", "Quy mô mở rộng thần tốc"),
            ("2. Peer Benchmark", "Thị phần thép xây dựng 38.5%", "Thị phần HRC số 1, vượt Formosa Hà Tĩnh", "badge-amber", "Thống trị thị trường nội địa"),
            ("3. Chuẩn Quốc Tế", "Tiêu thụ thép VN 275 kg/người", "Dư địa tăng trưởng so với Trung Quốc 650kg", "badge-cyan", "Thời kỳ vàng phát triển hạ tầng"),
            ("4. Unit Economics", "Cảng nước sâu đón tàu 200k DWT", "Tiết kiệm $10 - $15/tấn quặng sắt nhập khẩu", "badge-green", "Chi phí sản xuất rẻ nhất TG")
        ]
    },
    "mwg": {
        "badge": "TRỤ CỘT 1 · MẠNG LƯỚI BÁN LẺ & THỊ PHẦN ICT >60%",
        "rows": [
            ("1. Delta Quá Khứ", "Hệ thống 3.100 cửa hàng ICT", "Doanh thu >130.000 tỷ/năm (Gấp 10x 10 năm)", "badge-green", "Tập đoàn bán lẻ số 1 VN"),
            ("2. Peer Benchmark", "Thị phần ICT đạt trên 60%", "Gấp 3 lần FPT Shop và Viettel Store cộng lại", "badge-amber", "Sức mạnh đàm phán giá vốn"),
            ("3. Chuẩn Quốc Tế", "SG&A tối ưu về 14.2%", "Chuẩn quốc tế Best Buy (Mỹ) 14 - 15%", "badge-cyan", "Đòn bẩy vận hành sau tinh gọn"),
            ("4. Unit Economics", "Biên lãi gộp tăng vọt 22.2%", "Bách Hóa Xanh đóng góp dòng tiền thặng dư", "badge-green", "Dòng tiền CFO >12.000 tỷ/năm")
        ]
    },
    "pow": {
        "badge": "TRỤ CỘT 1 · 5.824 MW ĐIỆN NỀN & TURBINE KỶ LỤC GE 9HA.02",
        "rows": [
            ("1. Delta Quá Khứ", "Công suất 5.824 MW (+38.7%)", "Bổ sung cụm LNG Nhơn Trạch 3&4 (1.624 MW)", "badge-green", "12% điện nền Đông Nam Bộ"),
            ("2. Peer Benchmark", "Nhà cung cấp điện khí số 1 VN", "Sở hữu danh mục nhà máy điện nền trọng yếu", "badge-amber", "Vai trò an ninh năng lượng"),
            ("3. Chuẩn Quốc Tế", "Turbine GE 9HA.02 hiệu suất >63%", "Kỷ lục thế giới về hiệu suất chuyển hóa khí", "badge-cyan", "Giảm 15% tiêu hao nhiên liệu"),
            ("4. Unit Economics", "Doanh thu tăng 14.000 tỷ/năm", "Hết khấu hao Cà Mau 1-2 & Vũng Áng 1", "badge-green", "Dòng tiền CFO >6.000 tỷ/năm")
        ]
    },
    "vtp": {
        "badge": "TRỤ CỘT 1 · TỔ HỢP LOGISTICS 4.0 & ĐỘ PHỦ 100% QUỐC GIA",
        "rows": [
            ("1. Delta Quá Khứ", "Công suất 4 triệu kiện/ngày", "Năm 2020: 800k kiện/ngày (Tăng gấp 5 lần)", "badge-green", "Tốc độ chia chọn robot 0.3s"),
            ("2. Peer Benchmark", "Độ phủ 100% 63 tỉnh thành", "Mạng lưới bưu cục tới tận biên giới hải đảo", "badge-amber", "Con hào mạng lưới độc quyền"),
            ("3. Chuẩn Quốc Tế", "Liên vận đường sắt TQ - VN 24h", "Thông quan thẳng vào sâu lục địa Trung Quốc", "badge-cyan", "Đón sóng TMĐT xuyên biên giới"),
            ("4. Unit Economics", "Chi phí xử lý/kiện giảm 25%", "Biên EBITDA logistics cải thiện lên 9.2%", "badge-green", "Lợi nhuận tăng tốc 25-30%/năm")
        ]
    }
}

def get_s4_data(ticker):
    if ticker in S4_DATA:
        return S4_DATA[ticker]
    if ticker in EXTRA_S4:
        return EXTRA_S4[ticker]
    return None

def build_s4_column1(ticker):
    data = get_s4_data(ticker)
    if not data:
        return ""
    rows_html = ""
    for r in data["rows"]:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-cyan); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><span class="badge {r[3]}">{r[4]}</span></td>
                </tr>\n"""
    return f"""          <!-- Cột 1: Bảng Đối Chiếu 4D Landscape Trụ Cột 1 -->
          <div class="card" style="padding: 16px; display: flex; flex-direction: column; gap: 6px;">
            <div class="card-badge badge-emerald" style="margin-bottom: 4px;">{data['badge']} (4D LANDSCAPE)</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Đối chiếu đa chiều: Quá khứ · Đối thủ toàn ngành · Chuẩn quốc tế · Giá trị dòng tiền:</p>
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

def build_s4_column2_chart(ticker):
    m = PILLAR1_MAP.get(ticker)
    if not m:
        return ""
    return f"""          <!-- Cột 2: Visual Chart Trực Quan Hóa Đối Chiếu -->
          <div class="card card-emerald chart-wrapper-with-tabs" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div class="card-badge badge-emerald" style="margin-bottom: 0;">{m['badge']}</div>
              <div class="chart-tabs">
                <button class="chart-tab-btn active" data-target-src="{m['img']}" data-target-title="{m['title']}">{m['tab']}</button>
              </div>
            </div>

            <div class="chart-container" data-zoom-src="{m['img']}" data-zoom-title="{m['title']}" style="flex: 1; min-height: 220px;">
              <div class="chart-img-wrap" style="min-height: 200px;">
                <img src="{m['img']}" alt="{m['title']}">
              </div>
              <div class="chart-caption">
                <span class="chart-caption-text">{m['caption']}</span>
                <span class="chart-zoom-hint">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg>
                  Click xem lớn
                </span>
              </div>
            </div>
          </div>"""

def upgrade_file_s4(file_path):
    ticker = os.path.basename(file_path).replace('_canvas_lv3_presentation.html', '').replace('.html', '').lower()
    content = open(file_path).read()
    
    s4_match = re.search(r'(<section class=\"slide[^\"]*\" id=\"slide-4\".*?</section>)', content, re.DOTALL)
    if not s4_match:
        return False
    s4 = s4_match.group(1)
    
    # Extract header of slide-4
    header_match = re.search(r'(<div class=\"slide-header\">.*?</div>\s*)(<div class=\"(?:content-area|slide-content)\">)', s4, re.DOTALL)
    if not header_match:
        return False
    header_html = header_match.group(1)
    content_wrapper = header_match.group(2)
    
    col1_html = build_s4_column1(ticker)
    col2_html = build_s4_column2_chart(ticker)
    
    new_s4 = f"""    <section class="slide" id="slide-4">
{header_html}
      {content_wrapper}
        <div class="grid-2">
{col1_html}

{col2_html}
        </div>
      </div>
    </section>"""
    
    new_content = content.replace(s4, new_s4)
    if new_content != content:
        open(file_path, 'w').write(new_content)
        return True
    return False

dirs = ['finpeace-web/public/canvas-lv3', 'tai lieu FinPeace']
for d in dirs:
    count = 0
    for f in sorted(glob.glob(f'{d}/*.html')):
        if 'Stockspick' in f or 'cv_tuan_anh' in f:
            continue
        if upgrade_file_s4(f):
            count += 1
            print(f"Upgraded Slide 4 with Visualized Chart in {f}")
    print(f"Completed {d}: {count} files upgraded.")

