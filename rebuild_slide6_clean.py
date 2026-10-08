import os, glob, re
from update_all_pillars_landscape import S6_DATA

BANKING = ['acb', 'bid', 'ctg', 'mbb', 'vcb', 'vpb']
FINANCE = ['ssi', 'tcx', 'vci', 'mig']
CORP = ['ctr', 'fpt', 'frt', 'gmd', 'hpg', 'imp', 'mch', 'mwg', 'pow', 'vnm', 'vtp']

def get_slide6_header(ticker):
    names = {
        'acb': ('ACB', 'Đòn Bẩy Vận Hành & Hiệu Quả Chi Phí (CIR Tối Ưu)'),
        'bid': ('BIDV', 'Tối Ưu Hóa Năng Suất Mạng Lưới & Dự Phòng Nợ Xấu'),
        'ctg': ('VietinBank', 'Hiệu Quả Sử Dụng Vốn & Điểm Uốn Chi Phí Dự Phòng'),
        'mbb': ('MBBank', 'Đòn Bẩy Số Hóa KakaoBank & Tối Ưu Chi Phí Vốn COF'),
        'vcb': ('Vietcombank', 'Đòn Bẩy Vận Hành & Hiệu Quả Chi Phí (CIR Tối Ưu)'),
        'vpb': ('VPBank', 'Bộ Đệm Vốn Tự Có CAR 17.2% & Động Cơ NIM Dẫn Đầu'),
        'ssi': ('SSI', 'Hiệu Quả Vốn Chủ & Quản Trị Danh Mục Margin Real-Time'),
        'tcx': ('TCBS', 'Mô Hình WealthTech Không Chi Nhánh: CIR 16.5% & Biên Ròng 62%'),
        'vci': ('Vietcap', 'Hiệu Suất Tư Vấn IB Tinh Hoa & Cấu Trúc Sinh Lời Đột Phá'),
        'mig': ('MIC', 'Dòng Tiền Float Bảo Hiểm 4.500 Tỷ & Tỷ Lệ Kết Hợp <95%'),
        'ctr': ('Viettel Construction', 'Cấu Trúc Sinh Lời Bền Vững & Dòng Tiền Niên Kim TowerCo'),
        'fpt': ('FPT', 'Cỗ Máy In Tiền ROE 26%: Tiền Mặt Ròng >28.000 Tỷ Tự Tài Trợ AI'),
        'frt': ('FPT Retail', 'Điểm Uốn Tài Chính Long Châu: Biên Gộp 23.5% & Dòng Tiền Dương'),
        'gmd': ('Gemadept', 'Kết Thúc Chu Kỳ Capex Lớn: Biên Gộp Cảng 49.4% & FCF >2.000 Tỷ'),
        'hpg': ('Hòa Phát', 'Bước Ngoặt Thu Hoạch FCF: Dung Quất 2 Kết Chuyển & FCF >15.000 Tỷ'),
        'imp': ('Imexpharm', 'Bảng Cân Đối Không Nợ Vay: Biên Gộp ETC 41.5% & Quản Trị SK Group'),
        'mch': ('Masan Consumer', 'Cỗ Máy In Tiền FMCG: Biên Gộp 44.6% & ROIC >35% Chuẩn Unilever'),
        'mwg': ('Thế Giới Di Động', 'Bước Ngoặt Tái Cấu Trúc: Biên Gộp 22.2% & Tiền Mặt Ròng >25.000 Tỷ'),
        'pow': ('PV Power', 'Dòng Tiền Kinh Doanh >6.000 Tỷ/Năm & Hết Khấu Hao Nhà Máy Lõi'),
        'vnm': ('Vinamilk', 'Cỗ Máy In Tiền Cổ Tức: Biên EBITDA 24.2% & Tiền Mặt Ròng >15.000 Tỷ'),
        'vtp': ('Viettel Post', 'Con Hào Chi Phí Robot 4.0: Biên EBITDA Cải Thiện & Vòng Quay Vốn 2.2x')
    }
    return names.get(ticker, (ticker.upper(), 'Cấu Trúc Sinh Lời Bền Vững Qua Các Chu Kỳ'))

def build_card1_banking(ticker):
    chips = {
        'acb': ('> 12.8%', 'Hệ số An toàn vốn (CAR)', '23.5%', 'Tỷ suất sinh lời ROE'),
        'bid': ('> 10.5%', 'Hệ số An toàn vốn (CAR)', '19.8%', 'Tỷ suất sinh lời ROE'),
        'ctg': ('> 11.0%', 'Hệ số An toàn vốn (CAR)', '18.5%', 'Tỷ suất sinh lời ROE'),
        'mbb': ('> 11.5%', 'Hệ số An toàn vốn (CAR)', '23.5%', 'Tỷ suất sinh lời ROE'),
        'vcb': ('> 12.5%', 'Hệ số An toàn vốn (CAR)', '21.5%', 'Tỷ suất sinh lời ROE'),
        'vpb': ('17.2%', 'Hệ số An toàn vốn (CAR Top 1)', '5.6%', 'Biên lãi thuần NIM Top 1')
    }
    c = chips.get(ticker, ('> 12.0%', 'Hệ số CAR', '20.0%', 'Tỷ suất ROE'))
    return f"""          <!-- Cột 1: Luận điểm Đòn bẩy vận hành -->
          <div class="card" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
            <div class="card-title" style="color: var(--accent-cyan); font-size: 14px;">Hiệu Ứng Quy Mô Số Hóa & Chi Phí Vốn Thấp</div>
            <div class="card-desc" style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.45;">
              Tỷ lệ giao dịch trực tuyến qua ứng dụng số đạt trên 95%. Chi phí biên cho mỗi giao dịch số chỉ bằng 1/10 so với giao dịch tại quầy, giúp giải phóng năng suất lao động cho đội ngũ chuyên viên bán hàng trực tiếp.
            </div>

            <div style="padding: 10px; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; font-size: 11px; line-height: 1.45; color: var(--text-muted);">
              <strong style="color: var(--accent-cyan);">Vòng lặp bánh đà (Flywheel):</strong> Uy tín thương hiệu số 1 ➔ Thu hút tệp tiền gửi CASA dồi dào ➔ Hạ thấp chi phí vốn COF ➔ Cho vay khách hàng tốt nhất với rủi ro thấp ➔ Tối ưu chi phí dự phòng ➔ Tăng trưởng lợi nhuận giữ lại mở rộng vốn tự có.
            </div>

            <div style="margin-top: auto; padding-top: 8px; display: flex; gap: 16px;">
              <div>
                <div class="metric-chip" style="color: var(--accent-purple); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[0]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[1]}</div>
              </div>
              <div>
                <div class="metric-chip" style="color: var(--accent-ember); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[2]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[3]}</div>
              </div>
            </div>
          </div>"""

def build_card1_corp(ticker):
    chips = {
        'ctr': ('68%', 'Biên EBITDA TowerCo', '20.8%', 'Tỷ suất sinh lời ROE'),
        'fpt': ('> 28.000 Tỷ', 'Tiền mặt ròng (Net Cash)', '26.5%', 'ROE bền vững 10 năm'),
        'frt': ('23.5%', 'Biên lợi nhuận gộp toàn chuỗi', '24.5%', 'Điểm uốn phục hồi ROE'),
        'gmd': ('49.4%', 'Biên gộp mảng cảng biển', '> 2.000 Tỷ', 'Dòng tiền tự do FCF/năm'),
        'hpg': ('18.5%', 'Biên EBITDA đầu ngành', '> 15.000 Tỷ', 'FCF dự phóng Dung Quất 2'),
        'imp': ('41.5%', 'Biên lãi gộp thuốc ETC', '0% Nợ', 'Bảng cân đối Zero Debt'),
        'mch': ('44.6%', 'Biên lãi gộp độc quyền FMCG', '> 35%', 'Tỷ suất sinh lời ROIC'),
        'mwg': ('> 25.000 Tỷ', 'Tiền mặt ròng khổng lồ', '22.2%', 'Biên gộp sau tái cấu trúc'),
        'pow': ('> 6.000 Tỷ', 'Dòng tiền hoạt động CFO/năm', '0.65x', 'Nợ vay/VCSH an toàn'),
        'vnm': ('> 15.000 Tỷ', 'Tiền mặt ròng an toàn tuyệt đối', '24.2%', 'Biên EBITDA dẫn đầu toàn cầu'),
        'vtp': ('9.2%', 'Biên EBITDA Logistics', '2.2x', 'Vòng quay vốn lưu động')
    }
    c = chips.get(ticker, ('> 20%', 'Biên lợi nhuận', '> 20%', 'Tỷ suất ROE'))
    return f"""          <!-- Cột 1: Luận điểm Đòn bẩy vận hành -->
          <div class="card card-emerald" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
            <div class="card-title" style="color: var(--accent-emerald); font-size: 14px;">Cấu Trúc Sinh Lời Bền Vững & Dòng Tiền Thặng Dư</div>
            <div class="card-desc" style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.45;">
              Lợi thế quy mô vượt bậc và chuỗi cung ứng tích hợp bảo vệ biên lợi nhuận hoạt động qua mọi chu kỳ kinh tế, chuyển hóa trọn vẹn doanh thu thành dòng tiền tự do dồi dào.
            </div>

            <div style="padding: 10px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; font-size: 11px; line-height: 1.45; color: var(--text-muted);">
              <strong style="color: var(--accent-emerald);">Bảo chứng cho nhà đầu tư SIP:</strong> Không chịu rủi ro thâm dụng nợ vay, tỷ lệ chuyển đổi tiền mặt (Cash Conversion) cao kỷ lục, đảm bảo nguồn chi trả cổ tức tiền mặt đều đặn và tự tài trợ tăng trưởng hữu cơ.
            </div>

            <div style="margin-top: auto; padding-top: 8px; display: flex; gap: 16px;">
              <div>
                <div class="metric-chip" style="color: var(--accent-emerald); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[0]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[1]}</div>
              </div>
              <div>
                <div class="metric-chip" style="color: var(--accent-ember); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[2]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[3]}</div>
              </div>
            </div>
          </div>"""

def build_card1_finance(ticker):
    chips = {
        'ssi': ('1.0x', 'Đòn bẩy Margin/VCSH (Trần 2.0x)', '18.5%', 'Tỷ suất sinh lời ROE'),
        'tcx': ('16.5%', 'Tỷ lệ CIR thấp nhất toàn ngành', '62%', 'Biên lợi nhuận ròng kỷ lục'),
        'vci': ('> 65%', 'Biên lợi nhuận mảng tư vấn IB', '20.5%', 'Tỷ suất sinh lời ROE'),
        'mig': ('93.5%', 'Combined Ratio (Có lãi thuần)', '> 4.500 Tỷ', 'Dòng tiền Float gửi ngân hàng')
    }
    c = chips.get(ticker, ('1.0x', 'Đòn bẩy an toàn', '> 20%', 'Tỷ suất ROE'))
    return f"""          <!-- Cột 1: Luận điểm Đòn bẩy vận hành -->
          <div class="card card-purple" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
            <div class="card-title" style="color: var(--accent-purple); font-size: 14px;">Quản Trị Rủi Ro Real-Time & Đòn Bẩy Vốn Chủ</div>
            <div class="card-desc" style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.45;">
              Hệ thống giám sát rủi ro tài chính đa tầng và cơ cấu thu nhập dịch vụ tư vấn / wealth management giúp gia tăng biên lợi nhuận ròng mà không cần thâm dụng vốn tự có.
            </div>

            <div style="padding: 10px; background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; font-size: 11px; line-height: 1.45; color: var(--text-muted);">
              <strong style="color: var(--accent-purple);">Bảo chứng cho nhà đầu tư SIP:</strong> Dòng thu nhập từ phí dịch vụ và tiền gửi Float an toàn tuyệt đối, tạo bộ đệm lợi nhuận ổn định không chịu rủi ro biến động ngắn hạn của thị trường chứng khoán.
            </div>

            <div style="margin-top: auto; padding-top: 8px; display: flex; gap: 16px;">
              <div>
                <div class="metric-chip" style="color: var(--accent-purple); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[0]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[1]}</div>
              </div>
              <div>
                <div class="metric-chip" style="color: var(--accent-ember); font-size: 18px; font-weight: 800; font-family: var(--font-mono);">{c[2]}</div>
                <div class="metric-label" style="font-size: 10px; color: var(--text-dim);">{c[3]}</div>
              </div>
            </div>
          </div>"""

def build_card2_table(ticker):
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
          <div class="card card-cyan" style="padding: 16px; display: flex; flex-direction: column; gap: 6px;">
            <div class="card-badge badge-cyan" style="margin-bottom: 4px;">BẢNG ĐỐI CHIẾU 4D SỨC KHỎE TÀI CHÍNH & ĐÒN BẨY VẬN HÀNH</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Định vị cấu trúc sinh lời và bộ đệm an toàn vốn so với toàn ngành và chuẩn mực quốc tế:</p>
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

def rebuild_slide6(file_path):
    ticker = os.path.basename(file_path).replace('_canvas_lv3_presentation.html', '').replace('.html', '').lower()
    content = open(file_path).read()
    
    # Generate clean Slide 6 HTML
    name, title = get_slide6_header(ticker)
    
    if ticker in BANKING:
        c1 = build_card1_banking(ticker)
    elif ticker in FINANCE:
        c1 = build_card1_finance(ticker)
    else:
        c1 = build_card1_corp(ticker)
        
    c2 = build_card2_table(ticker)
    
    # Determine header style (tagline vs slide-tag vs pillar-breadcrumb)
    header_block = f"""      <div class="slide-header">
        <div class="tagline">TRỤ CỘT 3 — BẢO CHỨNG THỰC TIỄN & SỨC KHỎE TÀI CHÍNH</div>
        <h2 class="slide-title">{title}</h2>
        <p class="slide-takeaway">
          Bảng cân đối tài chính vững vàng, đòn bẩy vận hành tối ưu và khả năng phòng thủ vượt trội qua mọi chu kỳ kinh tế
        </p>
      </div>"""
    
    clean_slide6 = f"""    <section class="slide" id="slide-6">
{header_block}

      <div class="content-area">
        <div class="grid-2">
{c1}

{c2}
        </div>
      </div>
    </section>"""
    
    # Replace entire Slide 6
    s6_pattern = re.compile(r'<section class=\"slide[^\"]*\" id=\"slide-6\".*?</section>', re.DOTALL)
    if s6_pattern.search(content):
        new_content = s6_pattern.sub(clean_slide6, content)
        if new_content != content:
            open(file_path, 'w').write(new_content)
            return True
    return False

# Execute on both directories
dirs = ['finpeace-web/public/canvas-lv3', 'tai lieu FinPeace']
for d in dirs:
    count = 0
    for f in sorted(glob.glob(f'{d}/*.html')):
        if 'Stockspick' in f or 'cv_tuan_anh' in f:
            continue
        if rebuild_slide6(f):
            count += 1
            print(f'Rebuilt Slide 6 cleanly in {f}')
    print(f'Done {d}: {count} files rebuilt.')

