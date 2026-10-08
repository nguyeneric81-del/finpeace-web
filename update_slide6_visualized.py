import os, re, glob

# Pillar 3 Mapping for all 21 stocks
PILLAR3_MAP = {
    'frt': {
        'img': 'images/frt_financial_turnaround.png',
        'badge': 'Điểm Uốn Tài Chính & Biên Gộp',
        'tab': 'Biên Gộp & CFO',
        'title': 'Điểm Uốn Tài Chính Long Châu: Biên Gộp Đạt 23.5% & Dòng Tiền CFO Dương >2.500 Tỷ',
        'cap': 'Tăng trưởng quy mô đưa Long Châu qua điểm hòa vốn, biên gộp toàn tập đoàn nhảy vọt lên 23.5% và CFO thặng dư bền vững'
    },
    'vcb': {
        'img': 'images/vcb_nim_cof_profit.png',
        'badge': 'Con Hào Chi Phí Vốn & NIM',
        'tab': 'Chi Phí Vốn COF',
        'title': 'Chi Phí Vốn COF 2.8% Thấp Nhất Hệ Thống: VCB Thiết Lập Con Hào Lợi Nhuận Bất Khả Xâm Phạm',
        'cap': 'Lợi thế CASA 38% và uy tín Big4 giúp VCB duy trì COF 2.8%, NIM 3.2% vững bền bảo toàn ROE >21% xuyên chu kỳ'
    },
    'mbb': {
        'img': 'images/mbb_cir_roe_efficiency.png',
        'badge': 'Hiệu Quả Vận Hành Số & ROE',
        'tab': 'CIR & ROE Đỉnh Cao',
        'title': 'Đòn Bẩy Số Hóa MBB: CIR Giảm Về 28.2% & ROE Duy Trì 23-25% Cao Nhất Khối TMCP',
        'cap': '99.5% giao dịch thực hiện trên App MBBank giúp tỷ lệ chi phí CIR giảm kỷ lục về 28.2%, ROE duy trì đỉnh cao liên tục 5 năm'
    },
    'acb': {
        'img': 'images/acb_npl_roe_quality.png',
        'badge': 'An Toàn Tín Dụng & Chất Lượng Tài Sản',
        'tab': 'Nợ Xấu NPL 1.18%',
        'title': 'Quản Trị Tín Dụng Chuẩn Mực: ACB Duy Trì Nợ Xấu 1.18% Thấp Nhất Toàn Ngành',
        'cap': '94% dư nợ bán lẻ có TSBĐ và 0% TPDN rủi ro giúp ACB giữ vững tỷ lệ nợ xấu 1.18%, ROE 24% ổn định'
    },
    'bid': {
        'img': 'images/bid_cir_profit_growth.png',
        'badge': 'Đòn Bẩy Lợi Nhuận & CIR',
        'tab': 'CIR & LNTT >$1.3B',
        'title': 'Điểm Nổ Lợi Nhuận BIDV: LNTT Tăng Gấp 4 Lần Nhờ Hoàn Tất Xử Lý Nợ Xấu VAMC',
        'cap': 'Hoàn thành trích lập VAMC mở khóa toàn bộ lợi nhuận cốt lõi, CIR giảm từ 42% về 31% đưa LNTT vượt $1.3B'
    },
    'ctg': {
        'img': 'images/ctg_llr_profit_scale.png',
        'badge': 'Đệm Dự Phòng & Thu Ngoài Lãi',
        'tab': 'LLR Dự Phòng >175%',
        'title': 'Bộ Đệm Phòng Thủ Dự Phòng CTG: LLR >175% Bảo Vệ Chất Lượng Tài Sản Trước Biến Động',
        'cap': 'Trích lập dự phòng quy mô lớn tạo kho của để dành khổng lồ, thu ngoài lãi tăng tốc bảo vệ dòng cổ tức SIP'
    },
    'vpb': {
        'img': 'images/vpb_car_capital_moat.png',
        'badge': 'Đệm Vốn & Tỷ Lệ CAR',
        'tab': 'Hệ Số CAR 17.2%',
        'title': 'Vị Thế Vốn Chủ Hàng Đầu: Hệ Số CAR 17.2% Dẫn Đầu Toàn Ngành & NIM 5.6%',
        'cap': 'Đệm vốn dồi dào từ thương vụ SMBC giúp VPB sở hữu CAR 17.2%, sẵn sàng bứt phá tăng trưởng tín dụng 25%/năm'
    },
    'hpg': {
        'img': 'images/hpg_fcf_inflection.png',
        'badge': 'Điểm Rơi Dòng Tiền Tự Do',
        'tab': 'FCF Dung Quất 2',
        'title': 'Điểm Rơi FCF Hòa Phát: >15.000 Tỷ/Năm Khi Dung Quất 2 Kết Chuyển Hoàn Tất Đầu Tư',
        'cap': 'Kết thúc chu kỳ Capex lớn 85k tỷ, Dung Quất 2 vận hành thương mại giúp dòng tiền tự do FCF bùng nổ >15.000 tỷ'
    },
    'fpt': {
        'img': 'images/fpt_eps_cashflow_growth.png',
        'badge': 'Tăng Trưởng Kép EPS & FCF',
        'tab': 'EPS 22%/Năm',
        'title': 'Tăng Trưởng Kép EPS FPT: 22%/Năm Liên Tục 10 Năm Nhờ Đòn Bẩy Xuất Khẩu Phần Mềm',
        'cap': 'Đòn bẩy operating leverage từ mảng Global IT đưa EPS tăng trưởng kép 22%/năm, cổ tức tiền mặt đều đặn'
    },
    'mwg': {
        'img': 'images/mwg_cost_restructure.png',
        'badge': 'Điểm Uốn Tái Cấu Trúc Biên Gộp',
        'tab': 'Biên Gộp & SG&A',
        'title': 'Tái Cấu Trúc Toàn Diện: Biên Gộp Tăng +400 Bps Lên 22.2% & Tối Ưu Chi Phí SG&A 14.2%',
        'cap': 'Bách Hóa Xanh hòa vốn ròng và bắt đầu đóng góp lợi nhuận, đưa biên EBITDA toàn chuỗi phục hồi mạnh mẽ'
    },
    'vnm': {
        'img': 'images/vnm_ebitda_peers.png',
        'badge': 'Biên Sinh Lời & Cổ Tức Tiền Mặt',
        'tab': 'EBITDA vs Toàn Cầu',
        'title': 'Biên Lợi Nhuận EBITDA Vinamilk Vượt Trội Các Tập Đoàn Sữa Toàn Cầu',
        'cap': 'Biên EBITDA 21% vượt xa Danone (12%) và Mengniu (8%), tạo dòng tiền cổ tức 8.000 tỷ/năm cho cổ đông'
    },
    'gmd': {
        'img': 'images/gmd_ebitda_fcf_moat.png',
        'badge': 'Biên EBITDA Cụm Cảng Gemalink',
        'tab': 'EBITDA Gemalink >55%',
        'title': 'Hiệu Quả Vận Hành Cảng Sâu Gemalink: Biên EBITDA Gần 60% Đứng Đầu Việt Nam',
        'cap': 'Công suất cảng nước sâu đón tàu mẹ quốc tế giúp Gemalink đạt biên EBITDA >55%, dòng tiền FCF dồi dào'
    },
    'ctr': {
        'img': 'images/ctr_tenancy_ratio.png',
        'badge': 'Dòng Tiền Hạ Tầng Định Kỳ',
        'tab': 'Tenancy Ratio 1.35x',
        'title': 'Dư Địa Cho Thuê Hạ Tầng TowerCo: Tỷ Lệ Tenancy Ratio Tăng Trưởng Dài Hạn',
        'cap': 'Mô hình TowerCo cho thuê trạm phát sóng mang về doanh thu định kỳ biên lợi nhuận cao tăng 35%/năm'
    },
    'vtp': {
        'img': 'images/vtp_efficiency_robot.png',
        'badge': 'Tối Ưu Chi Phí & EBITDA',
        'tab': 'Chi Phí / Kiện Giảm 25%',
        'title': 'Con Hào Tự Động Hóa VTP: Chi Phí Xử Lý / Kiện Giảm 25% Đưa Biên EBITDA Lên 9.2%',
        'cap': 'Tổ hợp chia chọn tự động AI giúp tối ưu 25% chi phí xử lý trên mỗi bưu kiện, tạo đòn bẩy hoạt động mạnh mẽ'
    },
    'mig': {
        'img': 'images/mig_float_combined.png',
        'badge': 'Dòng Tiền Float & Lãi Tiền Gửi',
        'tab': 'Float >4.500 Tỷ',
        'title': 'Dòng Tiền Float Bảo Hiểm >4.500 Tỷ: MIC Hưởng Lãi Suất Tiền Gửi Ổn Định Từ MB',
        'cap': 'Tỷ lệ kết hợp <95% đảm bảo lãi thuần bảo hiểm, float 4.500 tỷ mang về 320-350 tỷ lãi tiền gửi ròng hàng năm'
    },
    'tcx': {
        'img': 'images/tcx_wealthtech_efficiency.png',
        'badge': 'Chi Phí Vận Hành Kỷ Lục CIR',
        'tab': 'CIR 16.5% Thấp Nhất',
        'title': 'Hiệu Quả Hoạt Động Techcom Securities: CIR 16.5% Thấp Nhất Khối Chứng Khoán',
        'cap': 'Nền tảng số hóa tự động hoàn toàn giúp TCX vận hành với chi phí cực thấp, biên lợi nhuận trước thuế >70%'
    },
    'ssi': {
        'img': 'images/ssi_equity_foreign_share.png',
        'badge': 'Quy Mô Vốn & Margin Thuần',
        'tab': 'Vốn Chủ 25.000 Tỷ',
        'title': 'Quy Mô Vốn Chủ Sở Hữu 25.000 Tỷ & Thị Phần Giao Dịch Nhà Đầu Tư Nước Ngoài >35%',
        'cap': 'Nền tảng vốn vững mạnh giúp SSI chiếm lĩnh mảng cho vay Margin và hưởng lợi tối đa khi thị trường nâng hạng'
    },
    'vci': {
        'img': 'images/vci_ib_deals_margin.png',
        'badge': 'Biên Lợi Nhuận IB & Tự Doanh',
        'tab': 'Biên Ròng IB >65%',
        'title': 'Đỉnh Cao Ngân Hàng Đầu Tư: Mảng IB Của Vietcap Đạt Biên Ròng >65% Vượt Trội Phố Wall',
        'cap': 'Thương hiệu số 1 về tư vấn M&A và IPO giúp VCI duy trì biên ròng mảng IB vượt trội so với toàn ngành'
    },
    'imp': {
        'img': 'images/imp_gross_margin_eu_gmp.png',
        'badge': 'Biên Lãi Gộp Dược Chuẩn EU-GMP',
        'tab': 'Biên Gộp 42.5%',
        'title': 'Vị Thế Dược EU-GMP: Biên Gộp IMP Đạt 42.5% Nhờ Thay Thế Thuốc Ngoại Tại Bệnh Viện',
        'cap': 'Hệ thống nhà máy EU-GMP lớn nhất Việt Nam giúp IMP thâm nhập sâu vào kênh ETC bệnh viện với biên lãi gộp cao'
    },
    'mch': {
        'img': 'images/mch_ebitda_dividend_payout.png',
        'badge': 'Biên EBITDA FMCG Đầu Ngành',
        'tab': 'Biên EBITDA 26.8%',
        'title': 'Máy In Tiền Tiêu Dùng: Biên EBITDA Của MCH Đạt 26.8% Vượt Trội Các Tập Đoàn Đa Quốc Gia',
        'cap': 'Quyền lực định giá và mạng lưới phân phối 300k điểm bán mang lại biên EBITDA vượt bậc và dòng cổ tức tiền mặt dồi dào'
    },
    'pow': {
        'img': 'images/pow_fcf_inflection.png',
        'badge': 'Điểm Uốn Dòng Tiền Điện Khí',
        'tab': 'FCF NT3&4 Dương',
        'title': 'Điểm Uốn FCF Điện Lực POW: Chuyển Dương >5.000 Tỷ Khi Nhơn Trạch 3&4 Phát Điện',
        'cap': 'Kết thúc chu kỳ đầu tư 1.4 tỷ USD, Nhơn Trạch 3&4 thương mại hóa giải phóng dòng tiền tự do khổng lồ'
    }
}

CSS_REQUIRED = """
    .chart-wrapper-with-tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .chart-tabs {
      display: flex;
      gap: 6px;
    }
    .chart-tab-btn {
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chart-tab-btn:hover, .chart-tab-btn.active {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-emerald);
      border-color: rgba(16, 185, 129, 0.4);
    }
    .chart-img-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 160px;
      background: #050811;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 6px;
    }
    .chart-img-wrap img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
    .chart-caption {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: var(--text-dim);
    }
    .chart-caption-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 8px;
    }
    .chart-zoom-hint {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--accent-cyan);
      font-weight: 600;
      font-size: 10px;
      cursor: pointer;
      white-space: nowrap;
    }
"""

TARGET_DIRS = [
    'finpeace-web/public/canvas-lv3',
    'tai lieu FinPeace'
]

def update_file(filepath):
    filename = os.path.basename(filepath)
    # extract ticker
    m = re.match(r'^([a-z0-9]+)', filename.lower())
    if not m: return
    ticker = m.group(1)
    if ticker not in PILLAR3_MAP: return
    
    cfg = PILLAR3_MAP[ticker]
    content = open(filepath, 'r', encoding='utf-8').read()

    # 1. Ensure CSS rules exist in <style>
    if '.chart-img-wrap img' not in content:
        content = content.replace('</style>', f"{CSS_REQUIRED}\n  </style>")

    # 2. Extract 4D table from Slide 6
    s6_match = re.search(r'(<section class="slide" id="slide-6">)(.*?)(</section>)', content, re.DOTALL)
    if not s6_match:
        print(f"Skipping {filename}: Slide 6 not found")
        return

    s6_start, s6_body, s6_end = s6_match.groups()
    
    # Check if table exists in slide 6
    tbl_match = re.search(r'<table class="comp-table"[^>]*>.*?</table>', s6_body, re.DOTALL)
    if not tbl_match:
        print(f"Warning {filename}: No comp-table in Slide 6")
        return
    comp_table_html = tbl_match.group(0)

    # Clean header / title of Slide 6
    header_match = re.search(r'<div class="slide-header">.*?</div>', s6_body, re.DOTALL)
    header_html = header_match.group(0) if header_match else """
      <div class="slide-header">
        <div class="tagline">TRỤ CỘT 3 — BẢO CHỨNG THỰC TIỄN & SỨC KHỎE TÀI CHÍNH</div>
        <h2 class="slide-title">Hiệu Quả Vận Hành & Đòn Bẩy Sức Khỏe Tài Chính Vững Vàng</h2>
        <p class="slide-takeaway">
          Bảng cân đối tài chính vững vàng, đòn bẩy vận hành tối ưu và khả năng phòng thủ vượt trội qua mọi chu kỳ kinh tế
        </p>
      </div>
"""

    # Build new Slide 6 content with Column 1 = 4D Table, Column 2 = Visualized Chart Card
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

    # If this is MIG, also fix Slide 4 to use mig_market_share_growth.png
    if ticker == 'mig':
        content = content.replace('mig_float_combined.png" alt="Quy Mô Float Tiền Gửi', 'mig_market_share_growth.png" alt="Tốc Độ Thăng Hạng Top 5 Ngành Bảo Hiểm')
        content = content.replace('data-zoom-src="images/mig_float_combined.png" data-zoom-title="Quy Mô Float Tiền Gửi Sinh Lãi > 4.500 Tỷ Đóng Góp Lợi Nhuận Ổn Định"', 'data-zoom-src="images/mig_market_share_growth.png" data-zoom-title="Tốc Độ Thăng Hạng Top 5 Ngành Bảo Hiểm: Thị Phần MIG Tăng Gấp Đôi Nhờ Hệ Sinh Thái MB"')
        content = content.replace('data-target-src="images/mig_float_combined.png" data-target-title="Quy Mô Float Tiền Gửi Sinh Lãi > 4.500 Tỷ Đóng Góp Lợi Nhuận Ổn Định">Quy Mô Float</button>', 'data-target-src="images/mig_market_share_growth.png" data-target-title="Tốc Độ Thăng Hạng Top 5 Ngành Bảo Hiểm: Thị Phần MIG Tăng Gấp Đôi Nhờ Hệ Sinh Thái MB">Thị Phần & Doanh Thu</button>')
        content = content.replace('src="images/mig_float_combined.png"', 'src="images/mig_market_share_growth.png"')

    new_content = content[:s6_match.start()] + s6_start + new_s6_body + s6_end + content[s6_match.end():]
    open(filepath, 'w', encoding='utf-8').write(new_content)
    print(f"✓ Updated Slide 6 in {filename}")

for target_dir in TARGET_DIRS:
    for f in sorted(glob.glob(f"{target_dir}/*.html")):
        if '_canvas_lv3_presentation.html' in f or target_dir == 'finpeace-web/public/canvas-lv3':
            update_file(f)

print("All presentations updated with visualized Slide 6!")
