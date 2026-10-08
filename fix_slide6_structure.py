import os, re, glob
from update_slide6_visualized import PILLAR3_MAP

TARGET_DIRS = [
    'finpeace-web/public/canvas-lv3',
    'tai lieu FinPeace'
]

def fix_file(filepath):
    filename = os.path.basename(filepath)
    m = re.match(r'^([a-z0-9]+)', filename.lower())
    if not m: return
    ticker = m.group(1)
    if ticker not in PILLAR3_MAP: return
    cfg = PILLAR3_MAP[ticker]

    content = open(filepath, 'r', encoding='utf-8').read()

    # First, make sure before <section class="slide" id="slide-6"> there is a proper </section>
    # If there is no </section> right before slide-6, fix it
    content = re.sub(r'(</div>\s*</div>)\s*<section class="slide" id="slide-6">', r'\1\n    </section>\n\n    <section class="slide" id="slide-6">', content)

    # Now find slide-6
    s6_match = re.search(r'(<section class="slide" id="slide-6">)(.*?)(</section>)', content, re.DOTALL)
    if not s6_match:
        print(f"Skipping {filename}: Slide 6 not found")
        return

    s6_body = s6_match.group(2)

    # Extract comp-table
    tbl_match = re.search(r'<table class="comp-table"[^>]*>.*?</table>', s6_body, re.DOTALL)
    if not tbl_match:
        print(f"Warning {filename}: No comp-table")
        return
    comp_table_html = tbl_match.group(0)

    # Clean standardized slide-header
    header_html = f"""      <div class="slide-header">
        <div class="tagline">TRỤ CỘT 3 — BẢO CHỨNG THỰC TIỄN & SỨC KHỎE TÀI CHÍNH</div>
        <h2 class="slide-title">{cfg['title']}</h2>
        <p class="slide-takeaway">
          {cfg['cap']}
        </p>
      </div>"""

    # Build clean slide-6 body
    new_s6_body = f"""
{header_html}

      <div class="content-area">
        <div class="grid-2">
          <!-- Cột 1: Bảng Đối Chiếu 4D Sức Khỏe Tài Chính & Đòn Bẩy Vận Hành -->
          <div class="card card-cyan" style="padding: 16px; display: flex; flex-direction: column; gap: 6px;">
            <div class="card-badge badge-cyan" style="margin-bottom: 4px;">BẢNG ĐỐI CHIẾU 4D SỨC KHỎE TÀI CHÍNH & ĐÒN BẨY VẬN HÀNH</div>
            <p class="card-desc" style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Định vị cấu trúc sinh lời và bộ đệm an toàn vốn so với toàn ngành và chuẩn mực quốc tế:</p>
            {comp_table_html}
          </div>

          <!-- Cột 2: Visual Chart Trực Quan Hóa Đối Chiếu Trụ Cột 3 -->
          <div class="card card-emerald chart-wrapper-with-tabs" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div class="card-badge badge-emerald" style="margin-bottom: 0;">{cfg['badge']}</div>
              <div class="chart-tabs">
                <button class="chart-tab-btn active" data-target-src="{cfg['img']}" data-target-title="{cfg['title']}">{cfg['tab']}</button>
              </div>
            </div>

            <div class="chart-container" data-zoom-src="{cfg['img']}" data-zoom-title="{cfg['title']}" style="flex: 1; min-height: 220px;">
              <div class="chart-img-wrap" style="min-height: 200px;">
                <img src="{cfg['img']}" alt="{cfg['title']}">
              </div>
              <div class="chart-caption">
                <span class="chart-caption-text">{cfg['cap']}</span>
                <span class="chart-zoom-hint">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg>
                  Click xem lớn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    """

    new_content = content[:s6_match.start(2)] + new_s6_body + content[s6_match.end(2):]
    open(filepath, 'w', encoding='utf-8').write(new_content)
    print(f"Fixed {filename}")

for target_dir in TARGET_DIRS:
    for f in sorted(glob.glob(f"{target_dir}/*.html")):
        if '_canvas_lv3_presentation.html' in f or target_dir == 'finpeace-web/public/canvas-lv3':
            fix_file(f)

print("All files fixed!")
