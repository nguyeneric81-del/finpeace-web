import re, os, glob

from update_all_pillars_landscape import S4_DATA, build_s4_card

def update_imp_vnm(file_path, ticker):
    content = open(file_path).read()
    data = S4_DATA[ticker]
    rows_html = ""
    for r in data["rows"]:
        rows_html += f"""                <tr>
                  <td><strong>{r[0]}</strong></td>
                  <td style="color: var(--accent-cyan); font-weight: 700;">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td><span class="badge {r[3]}">{r[4]}</span></td>
                </tr>\n"""
    
    table_card = f"""<!-- Cột 1: Bảng Đối Chiếu 4D Landscape Trụ Cột 1 -->
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
          </div>\n\n          """
    
    s4_match = re.search(r'(<section class=\"slide[^\"]*\" id=\"slide-4\".*?</section>)', content, re.DOTALL)
    if s4_match:
        s4 = s4_match.group(1)
        c1_match = re.search(r'(<!-- Cột 1:.*?<div class=\"card\"[^>]*>).*?(<!-- Cột 2:)', s4, re.DOTALL)
        if c1_match:
            new_s4 = s4[:c1_match.start()] + table_card + s4[c1_match.start(2):]
            content = content.replace(s4, new_s4)
            open(file_path, 'w').write(content)
            print(f'Updated {ticker} in {file_path}')
            return True
        else:
            print(f'c1_match failed for {ticker} in {file_path}')
    return False

def update_others_s4(file_path, ticker):
    content = open(file_path).read()
    s4_match = re.search(r'(<section class=\"slide[^\"]*\" id=\"slide-4\".*?</section>)', content, re.DOTALL)
    if s4_match:
        s4 = s4_match.group(1)
        # Match col 2 in content-area > grid-2
        col2_match = re.search(r'(<div class=\"grid-2\">.*?<div class=\"card[^\"]*\"[^>]*>.*?</div>\s*)(<div class=\"card[^\"]*\"[^>]*>.*?</div>)(\s*</div>\s*</div>\s*</section>)', s4, re.DOTALL)
        if col2_match:
            new_s4 = s4[:col2_match.start()] + col2_match.group(1) + build_s4_card(ticker) + "\n        " + col2_match.group(3)
            content = content.replace(s4, new_s4)
            open(file_path, 'w').write(content)
            print(f'Updated {ticker} in {file_path}')
            return True
        else:
            print(f'col2_match failed for {ticker} in {file_path}')
    return False

dirs = ['finpeace-web/public/canvas-lv3', 'tai lieu FinPeace']
for d in dirs:
    for ticker in ['imp', 'vnm']:
        f = f'{d}/{ticker}.html' if 'finpeace-web' in d else f'{d}/{ticker}_canvas_lv3_presentation.html'
        update_imp_vnm(f, ticker)
    for ticker in ['mch', 'mig', 'ssi', 'tcx', 'vci']:
        f = f'{d}/{ticker}.html' if 'finpeace-web' in d else f'{d}/{ticker}_canvas_lv3_presentation.html'
        update_others_s4(f, ticker)

