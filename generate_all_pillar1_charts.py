import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os, shutil

# Target directories
DIRS = ['finpeace-web/public/canvas-lv3/images', 'tai lieu FinPeace/images']
for d in DIRS:
    os.makedirs(d, exist_ok=True)

def save_fig(fig, filename):
    for d in DIRS:
        p = os.path.join(d, filename)
        fig.savefig(p, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close(fig)
    print(f"Generated and saved: {filename}")

# 1. VCB: LLR & Credit Scale
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks = ['Toàn Ngành\n(Bình quân)', 'Khối TMCP\n(Bình quân)', 'BIDV\n(BID)', 'VietinBank\n(CTG)', 'Vietcombank\n(VCB)']
llr = [95.0, 82.0, 165.0, 170.0, 256.0]
colors = ['#64748b', '#475569', '#38bdf8', '#0ea5e9', '#10b981']
bars = ax.bar(banks, llr, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, llr):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 4, f"{val:.0f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.axhline(100, color='#f59e0b', linestyle='--', alpha=0.6, label='Ngưỡng an toàn 100%')
ax.set_ylabel('Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('BẢN ĐỒ AN TOÀN TÍN DỤNG: VCB SỞ HỮU KHO DỰ PHÒNG THẶNG DƯ >25.000 TỶ', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 290)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'vcb_llr_credit_scale.png')

# 2. MBB: 28M Digital Users & CASA Growth
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2017', '2019', '2021', '2023', '2024', '2026E']
users = [3.5, 6.2, 12.0, 21.5, 25.5, 28.5]
colors = ['#334155', '#475569', '#0284c7', '#0284c7', '#38bdf8', '#f59e0b']
bars = ax.bar(years, users, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, users):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f"{val:.1f} Tr", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Khách Hàng Số (Triệu Người Dùng)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('BÙNG NỔ NGƯỜI DÙNG SỐ: NỀN TẢNG THU HÚT TIỀN GỬI CASA 39.2% DẪN ĐẦU KHỐI TMCP', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 33)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mbb_digital_casa_growth.png')

# 3. ACB: Retail Loan & Risk Safety
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
categories = ['ACB (Bán Lẻ)', 'Khối TMCP\n(Bình quân)', 'Toàn Ngành\n(Bình quân)', 'Commonwealth\nBank (Úc)']
retail_pct = [94.0, 52.0, 46.0, 72.0]
colors = ['#10b981', '#64748b', '#475569', '#38bdf8']
bars = ax.bar(categories, retail_pct, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, retail_pct):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f"{val:.0f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Tỷ Trọng Cho Vay Bán Lẻ & SME (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('CON HÀO BÁN LẺ THUẦN TÚY: ACB NÓI KHÔNG VỚI TRÁI PHIẾU DOANH NGHIỆP RỦI RO', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 108)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'acb_retail_safety.png')

# 4. BID: Assets Scale Top 1
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks = ['Vietcombank', 'Agribank', 'VietinBank', 'BIDV (BID)', 'CIMB\n(Malaysia)', 'Maybank\n(Malaysia)']
assets = [1.89, 2.05, 2.12, 2.52, 2.45, 2.75]
colors = ['#0284c7', '#64748b', '#0ea5e9', '#f59e0b', '#475569', '#334155']
bars = ax.bar(banks, assets, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, assets):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.04, f"{val:.2f}T", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Tổng Tài Sản (Triệu Tỷ VNĐ / Tỷ USD)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('TỔNG TÀI SẢN 2.52 TRIỆU TỶ: BIDV DẪN ĐẦU HỆ THỐNG TÀI CHÍNH VIỆT NAM', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 3.1)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'bid_assets_scale.png')

# 5. CTG: FDI & Large Infra Credit
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2016', '2018', '2020', '2022', '2024', '2026E']
credit = [720, 910, 1020, 1280, 1550, 1750]
colors = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, credit, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, credit):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 25, f"{val:,}k", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Dư Nợ Cho Vay (Nghìn Tỷ VNĐ)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('DƯ NỢ 1.75 TRIỆU TỶ: VIETINBANK LÀ ĐỐI TÁC SỐ 1 CỦA KHỐI TẬP ĐOÀN FDI & DỰ ÁN QUỐC GIA', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 2050)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'ctg_credit_fdi.png')

# 6. VPB: Capital Adequacy Ratio (CAR) & NIM
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks = ['NHNN Quy định\n(Tối thiểu)', 'Big 4\n(Bình quân)', 'Khối TMCP\n(Bình quân)', 'Chuẩn Basel III\n(Quốc tế)', 'VPBank (VPB)']
car = [8.0, 10.2, 11.8, 10.5, 17.2]
colors = ['#ef4444', '#64748b', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(banks, car, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, car):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Hệ Số An Toàn Vốn CAR (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('BỘ ĐỆM VỐN CAR 17.2% TOP 1 HỆ THỐNG: VPBANK MIỄN NHIỄM TRƯỚC MỌI RỦI RO THANH KHOẢN', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 20.5)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'vpb_car_capital_moat.png')

# 7. FPT: Global IT Revenue & Hourly Cost Advantage
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5.0), dpi=200, gridspec_kw={'width_ratios': [1.3, 1]})
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
ax2.set_facecolor('#0a0f1d')

# Panel 1: IT Export Revenue
years = ['2015', '2018', '2021', '2023', '2024', '2026E']
rev = [200, 380, 630, 1020, 1200, 1450]
b1 = ax1.bar(years, rev, color=['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#f59e0b'], width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(b1, rev):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20, f"${val}M", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#fff')
ax1.set_ylabel('Doanh Thu Xuất Khẩu IT (Triệu USD)', fontsize=9.5, fontweight='bold', color='#cbd5e1')
ax1.set_title('Xuất Khẩu IT Vượt $1.2B: Tăng Gấp 6 Lần Sau 10 Năm', fontsize=10.5, fontweight='bold', color='#fff', pad=10)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 1650)
for s in ax1.spines.values(): s.set_color((1,1,1,0.1))

# Panel 2: Hourly Rate Cost Advantage
peers = ['FPT\n(Việt Nam)', 'Infosys/TCS\n(Ấn Độ)', 'Đông Âu\n(Ba Lan/Romania)', 'Mỹ\n(Onsite)']
rates = [25, 38, 48, 95]
b2 = ax2.bar(peers, rates, color=['#10b981', '#f59e0b', '#64748b', '#475569'], width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(b2, rates):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f"${val}/h", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#fff')
ax2.set_ylabel('Chi Phí Kỹ Sư Trung Bình ($ / Giờ)', fontsize=9.5, fontweight='bold', color='#cbd5e1')
ax2.set_title('Lợi Thế Chi Phí Kỹ Sư Rẻ Hơn Ấn Độ 35%', fontsize=10.5, fontweight='bold', color='#fff', pad=10)
ax2.grid(axis='y', linestyle=':', alpha=0.15)
ax2.set_ylim(0, 115)
for s in ax2.spines.values(): s.set_color((1,1,1,0.1))

save_fig(fig, 'fpt_global_it_scale.png')

# 8. MWG: Restructuring Margin Expansion (+400 bps)
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
stages = ['Trước Tái Cấu Trúc\n(2023)', 'Sau Tái Cấu Trúc\n(2024)', 'Hiện Tại\n(2025)', 'Mục Tiêu 2026E\n(BHX Có Lãi)', 'Best Buy (Mỹ)\nBenchmark']
gross = [18.2, 20.4, 21.6, 22.5, 22.0]
colors = ['#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#475569']
bars = ax.bar(stages, gross, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, gross):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.35, f"{val:.1f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Biên Lợi Nhuận Gộp Toàn Tập Đoàn (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('ĐÒN BẨY VẬN HÀNH MWG: BIÊN GỘP TĂNG +400 BPS TIỆM CẬN BEST BUY SAU TINH GỌN', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 26)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mwg_cost_restructure.png')

# 9. TCX: WealthTech CIR vs Traditional Securities
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
companies = ['TCBS (TCX)\nWealthTech', 'Robinhood (Mỹ)\nBenchmark', 'SSI\n(Đầu Ngành)', 'VNDirect\n(Truyền Thống)', 'Toàn Ngành CTCK\n(Bình Quân)']
cir = [16.5, 18.2, 28.5, 36.0, 42.0]
colors = ['#10b981', '#38bdf8', '#f59e0b', '#64748b', '#475569']
bars = ax.bar(companies, cir, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, cir):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Tỷ Lệ Chi Phí / Thu Nhập CIR (%) [Càng Thấp Càng Hiệu Quả]', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('MÔ HÌNH WEALTHTECH SIÊU TỐI ƯU: CIR TCBS CHỈ 16.5% BỎ XA MÔ HÌNH MÔI GIỚI TRUYỀN THỐNG', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 48)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'tcx_wealthtech_efficiency.png')

# 10. SSI: Equity Growth & Margin Capacity
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2015', '2018', '2021', '2023', '2024', '2026E']
equity = [5000, 8500, 14000, 18500, 22500, 26000]
colors = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, equity, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, equity):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 350, f"{val:,} tỷ", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Vốn Chủ Sở Hữu (Tỷ VNĐ)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('VỐN CHỦ SỞ HỮU >25.000 TỶ: SSI DẪN ĐẦU QUY MÔ CẤP MARGIN & HẤP THỤ VỐN NGOẠI NÂNG HẠNG', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 30500)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'ssi_equity_foreign_share.png')

# 11. VCI: Investment Banking (IB) Deal Volume & Net Margin
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
segments = ['Môi Giới\nBán Lẻ', 'Cho Vay\nMargin', 'Tự Doanh\nTrái Phiếu', 'M&A & Tư Vấn IB\n(Vietcap VCI)', 'Goldman Sachs\n(Mỹ) IB Margin']
margin = [18.5, 48.0, 32.0, 68.0, 62.0]
colors = ['#64748b', '#0ea5e9', '#475569', '#10b981', '#f59e0b']
bars = ax.bar(segments, margin, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, margin):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.0f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Biên Lợi Nhuận Ròng Từng Mảng Nghiệp Vụ (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('ĐỈNH CAO NGÂN HÀNG ĐẦU TƯ: MẢNG IB CỦA VIETCAP ĐẠT BIÊN RÒNG >65% VƯỢT TRỘI PHỐ WALL', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 78)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'vci_ib_deals_margin.png')

# 12. MIG: Bancassurance Growth & Investment Float
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2018', '2020', '2022', '2024', '2025', '2026E']
float_cash = [1500, 2200, 3100, 3900, 4400, 4850]
colors = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, float_cash, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, float_cash):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 70, f"{val:,} tỷ", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Quy Mô Float Tiền Gửi Sinh Lãi (Tỷ VNĐ)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('DÒNG TIỀN FLOAT BẢO HIỂM >4.500 TỶ: MIC HƯỞNG LÃI SUẤT TIỀN GỬI ỔN ĐỊNH TỪ HỆ SINH THÁI MB', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 5600)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mig_float_combined.png')

# 13. MCH: FMCG Moat Market Share
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
products = ['Nước Mắm\n(Nam Ngư/Chin-su)', 'Tương Ớt\n(Chin-su)', 'Nước Tương\n(Tam Thái Tử)', 'Mì Ăn Liền\n(Omachi/Kokomi)', 'Cà Phê Hòa Tan\n(Vinacafé)']
shares = [67.0, 71.5, 70.0, 30.5, 26.0]
colors = ['#10b981', '#f59e0b', '#0ea5e9', '#38bdf8', '#a855f7']
bars = ax.bar(products, shares, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, shares):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.1f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Thị Phần Số 1 Tại Việt Nam (%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('CON HÀO GIA VỊ THIẾT YẾU: 98% GIA ĐÌNH VIỆT SỞ HỮU ÍT NHẤT 1 SẢN PHẨM MASAN CONSUMER', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 82)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mch_fmcg_moat.png')

# 14. VTP: Robotics Sorting Efficiency
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
stages = ['Trước Tự Động Hóa\n(Chia chọn thủ công)', 'Giai Đoạn Robot 1.0\n(Bán tự động)', 'Tổ Hợp Smart Logistics\n(Công nghệ 4.0)', 'Mục Tiêu 2026E\n(Full AI Robotics)', 'SF Express (TQ)\nBenchmark']
costs = [100.0, 88.0, 75.0, 70.0, 65.0]
colors = ['#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#475569']
bars = ax.bar(stages, costs, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, costs):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.0f}%", ha='center', va='bottom', fontsize=11, fontweight='bold', color='#fff')
ax.set_ylabel('Chỉ Số Chi Phí Xử Lý / Bưu Kiện (Base 100%)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax.set_title('CON HÀO TỰ ĐỘNG HÓA VTP: CHI PHÍ XỬ LÝ / KIỆN GIẢM 25% ĐƯA BIÊN EBITDA LÊN 9.2%', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 115)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'vtp_efficiency_robot.png')

print("All 14 specialized comparison charts generated successfully!")

