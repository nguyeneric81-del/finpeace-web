import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os, shutil
import numpy as np

DIRS = ['finpeace-web/public/canvas-lv3/images', 'tai lieu FinPeace/images']
for d in DIRS:
    os.makedirs(d, exist_ok=True)

# Set global matplotlib parameters to ensure NO black text ever leaks
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['text.color'] = '#ffffff'
plt.rcParams['axes.labelcolor'] = '#cbd5e1'
plt.rcParams['xtick.color'] = '#ffffff'
plt.rcParams['ytick.color'] = '#cbd5e1'
plt.rcParams['axes.edgecolor'] = '#334155'
plt.rcParams['axes.linewidth'] = 0.8

def setup_ax(fig, ax, title, ylabel, ylim=None):
    fig.patch.set_facecolor('#070a12')
    ax.set_facecolor('#0a0f1d')
    ax.set_title(title, fontsize=12, fontweight='bold', color='#ffffff', pad=18)
    ax.set_ylabel(ylabel, fontsize=11, fontweight='bold', color='#cbd5e1')
    ax.grid(axis='y', linestyle=':', alpha=0.18, color='#475569')
    if ylim:
        ax.set_ylim(ylim)
    ax.tick_params(axis='x', colors='#ffffff', labelsize=10, pad=8)
    ax.tick_params(axis='y', colors='#cbd5e1', labelsize=9.5)
    for s in ax.spines.values():
        s.set_color('#334155')

def save_chart(fig, filename):
    for d in DIRS:
        dest = os.path.join(d, filename)
        fig.savefig(dest, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"✓ Saved {filename}")

# ==============================================================================
# 1. VCB CHARTS
# ==============================================================================
# 1A. VCB LLR & Credit Scale (Slide 4) - FIX LABELS TO BRIGHT WHITE
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'BẢN ĐỒ AN TOÀN TÍN DỤNG: VCB SỞ HỮU KHO DỰ PHÒNG THẶNG DƯ >25.000 TỶ', 
         'Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', ylim=(0, 310))
banks_vcb_llr = ['Toàn Ngành\n(Bình quân)', 'Khối TMCP\n(Bình quân)', 'BIDV\n(BID)', 'VietinBank\n(CTG)', 'Vietcombank\n(VCB)']
llr_vals = [95.0, 82.0, 165.0, 170.0, 256.0]
colors_vcb_llr = ['#64748b', '#475569', '#38bdf8', '#0ea5e9', '#10b981']
bars = ax.bar(range(len(banks_vcb_llr)), llr_vals, color=colors_vcb_llr, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, llr_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, f"{val:.0f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.axhline(100, color='#f59e0b', linestyle='--', alpha=0.7, label='Ngưỡng an toàn tối thiểu 100%')
ax.set_xticks(range(len(banks_vcb_llr)))
ax.set_xticklabels(banks_vcb_llr, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.text(0.03, 0.88, '★ VCB Kho Dự Phòng >25.000 Tỷ: Đệm An Toàn Số 1 Toàn Hệ Thống', 
        transform=ax.transAxes, fontsize=10, fontweight='bold', color='#10b981',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))
save_chart(fig, 'vcb_llr_credit_scale.png')

# 1B. VCB 10-Year Profit & ROE Growth (Slide 6 Tab 1)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_vcb = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E\n(Forward)', '2027E\n(Kỳ Vọng)']
lnst_vcb = [14.6, 18.5, 18.4, 21.9, 29.9, 33.1, 34.8, 38.5, 42.0, 48.3]
roe_vcb = [24.1, 25.5, 21.0, 21.8, 24.2, 21.7, 20.8, 21.2, 21.5, 21.8]
x_vcb = np.arange(len(years_vcb))
bar_colors_vcb = ['#334155', '#475569', '#3b82f6', '#0284c7', '#0ea5e9', '#38bdf8', '#06b6d4', '#10b981', '#f59e0b', '#fbbf24']
bars = ax1.bar(x_vcb, lnst_vcb, color=bar_colors_vcb, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lnst_vcb):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.9, f"{val:.1f}k tỷ", 
             ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_vcb, roe_vcb, color='#fbbf24', marker='o', linewidth=3, markersize=8)
for i, val in enumerate(roe_vcb):
    y_offset = 0.8 if i not in [2, 6] else -1.2
    va = 'bottom' if y_offset > 0 else 'top'
    ax2.text(i, val + y_offset, f"{val:.1f}%", ha='center', va=va, fontsize=9.5, fontweight='bold', color='#fbbf24',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#0a0f1d', edgecolor='none', alpha=0.85))
ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=11, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=11, fontweight='bold', color='#fbbf24')
ax1.set_xticks(x_vcb)
ax1.set_xticklabels(years_vcb, fontsize=10, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='x', colors='#ffffff', pad=6)
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#fbbf24')
ax1.set_title('TĂNG TRƯỞNG LỢI NHUẬN & ROE VCB (2018 - 2027E): CỖ MÁY 42.000 TỶ LNST KỶ LỤC', fontsize=12.5, fontweight='bold', color='#ffffff', pad=18)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 58)
ax2.set_ylim(16, 30)
ax1.text(0.03, 0.90, '★ CAGR LNST 10 Năm: +16.2%/năm · ROE Bền Bỉ >20% Vượt Trội Mọi Chu Kỳ', 
         transform=ax1.transAxes, fontsize=10, fontweight='bold', color='#10b981',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vcb_profit_roe_growth.png')

# 1C. VCB COF Peer Comparison (Slide 6 Tab 2)
fig, ax = plt.subplots(figsize=(11, 5.5), dpi=200)
setup_ax(fig, ax, 'SO SÁNH CHI PHÍ VỐN (COF) CÁC NGÂN HÀNG: VCB THẤP NHẤT HỆ THỐNG NHỜ CASA & TÍN NHIỆM',
         'Chi Phí Huy Động Vốn COF (%) [Càng thấp càng tối ưu]', ylim=(0, 7.2))
banks_cof = ['VCB\n(Vietcombank)', 'MBB\n(MBBank)', 'TCB\n(Techcombank)', 'ACB\n(ACB)', 'BID\n(BIDV)', 'CTG\n(VietinBank)', 'VPB\n(VPBank)']
cof_vals = [2.8, 3.6, 3.8, 4.1, 4.3, 4.4, 5.8]
colors_cof = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#64748b', '#ef4444']
bars = ax.bar(range(len(banks_cof)), cof_vals, color=colors_cof, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cof_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.12, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11.5, fontweight='bold', color='#ffffff')
bank_types = ['Top 1 Quốc Doanh', 'Top 1 TMCP Số', 'Top 1 Bất Động Sản', 'Top 1 Bán Lẻ Tư Nhân', 'Big 4 Quốc Doanh', 'Big 4 Quốc Doanh', 'TMCP Đa Năng']
for bar, btype in zip(bars, bank_types):
    y_pos = bar.get_height() / 2
    ax.text(bar.get_x() + bar.get_width()/2, y_pos, btype, 
            ha='center', va='center', rotation=90, fontsize=9, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_cof)))
ax.set_xticklabels(banks_cof, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.text(0.03, 0.90, '★ Con Hào Chi Phí Vốn: VCB (2.8%) Tiết Kiệm Hàng Nghìn Tỷ Chi Phí Lãi So Với TMCP', 
        transform=ax.transAxes, fontsize=10, fontweight='bold', color='#10b981',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))
save_chart(fig, 'vcb_nim_cof_profit.png')

# ==============================================================================
# 2. MBB CHARTS (Slide 4 & Slide 6)
# ==============================================================================
# 2A. MBB Digital Users Growth (2017 - 2026E)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'BÙNG NỔ NGƯỜI DÙNG SỐ MBB (2017 - 2026E): NỀN TẢNG THU HÚT CASA 39.2% ĐẦU NGÀNH', 
         'Khách Hàng Số (Triệu Người Dùng)', ylim=(0, 35))
years_mbb = ['2017', '2019', '2021', '2023', '2024', '2025', '2026E']
users_mbb = [3.5, 6.2, 12.0, 21.5, 25.5, 28.5, 31.0]
colors_mbb = ['#334155', '#475569', '#0284c7', '#0284c7', '#38bdf8', '#10b981', '#f59e0b']
bars = ax.bar(range(len(years_mbb)), users_mbb, color=colors_mbb, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, users_mbb):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f} Tr", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_mbb)))
ax.set_xticklabels(years_mbb, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.text(0.03, 0.88, '★ MBB: Chi Phí Thu Hút Khách Hàng (CAC) Gần Bằng 0 Nhờ Số Hóa 99.5% Giao Dịch', 
        transform=ax.transAxes, fontsize=10, fontweight='bold', color='#38bdf8',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#38bdf8', alpha=0.9))
save_chart(fig, 'mbb_digital_casa_growth.png')

# 2B. MBB Multi-Year CIR & ROE (2018 - 2026E)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_mbb_cir = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
cir_mbb = [44.8, 39.5, 38.5, 33.2, 31.8, 29.5, 28.8, 28.2, 27.5] # CIR %
roe_mbb = [19.5, 21.2, 19.2, 23.4, 25.6, 24.5, 23.8, 23.2, 23.5] # ROE %
x_mbb = np.arange(len(years_mbb_cir))
bars = ax1.bar(x_mbb, cir_mbb, color=['#38bdf8' if i < 6 else '#10b981' for i in range(len(years_mbb_cir))], width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, cir_mbb):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", 
             ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_mbb, roe_mbb, color='#f59e0b', marker='s', linewidth=3, markersize=8)
for i, val in enumerate(roe_mbb):
    ax2.text(i, val + 0.7, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#f59e0b',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#0a0f1d', edgecolor='none', alpha=0.85))
ax1.set_ylabel('Tỷ Lệ Chi Phí / Thu Nhập CIR (%) [Thấp càng tốt]', fontsize=11, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=11, fontweight='bold', color='#f59e0b')
ax1.set_xticks(x_mbb)
ax1.set_xticklabels(years_mbb_cir, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='x', colors='#ffffff', pad=6)
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.set_title('ĐÒN BẨY SỐ HÓA MBB (2018 - 2026E): CIR GIẢM TỪ 44.8% VỀ 27.5% & ROE DUY TRÌ 23-25%', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 52)
ax2.set_ylim(15, 30)
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'mbb_cir_roe_efficiency.png')

# ==============================================================================
# 3. ACB CHARTS
# ==============================================================================
# 3A. ACB Retail Safety (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CƠ CẤU TÍN DỤNG BÁN LẺ AN TOÀN: ACB ĐẠT 94% DƯ NỢ CÁ NHÂN & 0% TPDN RỦI RO', 
         'Tỷ Trọng Dư Nợ Bán Lẻ (%)', ylim=(0, 115))
banks_acb_retail = ['ACB\n(Bán Lẻ)', 'Commonwealth\nBank (Úc)', 'Khối TMCP\n(Bình quân)', 'Toàn Ngành\n(Bình quân)']
retail_vals = [94.0, 72.0, 52.0, 46.0]
colors_acb_retail = ['#10b981', '#38bdf8', '#64748b', '#475569']
bars = ax.bar(range(len(banks_acb_retail)), retail_vals, color=colors_acb_retail, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, retail_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, f"{val:.0f}%", 
            ha='center', va='bottom', fontsize=11.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_acb_retail)))
ax.set_xticklabels(banks_acb_retail, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.text(0.03, 0.88, '★ 94% Dư Nợ Có Tài Sản Đảm Bảo Chuẩn Mực: Không Thâm Dụng Trái Phiếu Doanh Nghiệp', 
        transform=ax.transAxes, fontsize=10, fontweight='bold', color='#10b981',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))
save_chart(fig, 'acb_retail_safety.png')

# ==============================================================================
# 4. BID & CTG CHARTS
# ==============================================================================
# 4A. BID Asset Scale (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'QUY MÔ TỔNG TÀI SẢN 2.52 TRIỆU TỶ: BIDV DẪN ĐẦU HỆ THỐNG TÀI CHÍNH VIỆT NAM', 
         'Tổng Tài Sản (Triệu Tỷ VNĐ)', ylim=(0, 3.0))
banks_assets = ['BIDV\n(BID)', 'VietinBank\n(CTG)', 'Vietcombank\n(VCB)', 'Agribank', 'DBS Bank\n(Singapore Ref)']
assets_vals = [2.52, 2.15, 1.88, 1.95, 2.85]
colors_assets = ['#38bdf8', '#0ea5e9', '#10b981', '#475569', '#a855f7']
bars = ax.bar(range(len(banks_assets)), assets_vals, color=colors_assets, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, assets_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.04, f"{val:.2f}M tỷ", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_assets)))
ax.set_xticklabels(banks_assets, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'bid_assets_scale.png')

# 4B. BID Multi-Year Profit Growth (Slide 6)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'ĐIỂM NỔ LỢI NHUẬN BIDV (2018 - 2026E): LNTT TĂNG GẤP 4 LẦN HẬU XỬ LÝ VAMC', 
         'Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', ylim=(0, 44))
years_bid = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
profit_bid = [9.5, 10.9, 9.0, 13.5, 23.0, 27.6, 31.8, 35.5, 39.2]
colors_bid = ['#334155', '#475569', '#3b82f6', '#0284c7', '#0ea5e9', '#38bdf8', '#06b6d4', '#10b981', '#f59e0b']
bars = ax.bar(range(len(years_bid)), profit_bid, color=colors_bid, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, profit_bid):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_bid)))
ax.set_xticklabels(years_bid, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'bid_cir_profit_growth.png')

# 4C. CTG Credit FDI (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'TÍN DỤNG DOANH NGHIỆP FDI & HẠ TẦNG: CTG DẪN ĐẦU THỊ PHẦN VỐN ĐẦU TƯ NƯỚC NGOÀI', 
         'Dư Nợ FDI & Công Nghiệp (Nghìn Tỷ VNĐ)', ylim=(0, 600))
banks_ctg_fdi = ['VietinBank\n(CTG)', 'BIDV\n(BID)', 'Vietcombank\n(VCB)', 'Khối TMCP\n(Bình quân)']
fdi_vals = [480.0, 390.0, 360.0, 180.0]
colors_ctg_fdi = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b']
bars = ax.bar(range(len(banks_ctg_fdi)), fdi_vals, color=colors_ctg_fdi, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, fdi_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 8, f"{val:.0f}k tỷ", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_ctg_fdi)))
ax.set_xticklabels(banks_ctg_fdi, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'ctg_credit_fdi.png')

# 4D. CTG Multi-Year LLR & Profit (Slide 6)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'BỘ ĐỆM DỰ PHÒNG CTG (2018 - 2026E): LLR >175% BẢO VỆ CHẤT LƯỢNG TÀI SẢN', 
         'Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', ylim=(0, 230))
years_ctg = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
llr_ctg = [118, 122, 132, 180, 188, 172, 175, 182, 190]
colors_ctg = ['#334155', '#475569', '#3b82f6', '#0284c7', '#10b981', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b']
bars = ax.bar(range(len(years_ctg)), llr_ctg, color=colors_ctg, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, llr_ctg):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3, f"{val}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_ctg)))
ax.set_xticklabels(years_ctg, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'ctg_llr_profit_scale.png')

# ==============================================================================
# 5. VPB CAR CAPITAL MOAT (Slide 4 & Slide 6)
# ==============================================================================
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'ĐỆM AN TOÀN VỐN HÀNG ĐẦU: HỆ SỐ CAR 17.2% CỦA VPB VƯỢT XA CHUẨN BASEL II & III', 
         'Hệ Số An Toàn Vốn CAR (%)', ylim=(0, 22))
banks_car = ['VPBank\n(VPB) [SMBC]', 'Techcombank\n(TCB)', 'ACB\n(ACB)', 'MBBank\n(MBB)', 'Vietcombank\n(VCB)', 'Quy Định Tối Thiểu\n(Basel II)']
car_vals = [17.2, 15.1, 12.8, 11.5, 11.8, 8.0]
colors_car = ['#10b981', '#38bdf8', '#a855f7', '#0ea5e9', '#38bdf8', '#ef4444']
bars = ax.bar(range(len(banks_car)), car_vals, color=colors_car, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, car_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.axhline(8.0, color='#ef4444', linestyle='--', alpha=0.7)
ax.set_xticks(range(len(banks_car)))
ax.set_xticklabels(banks_car, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vpb_car_capital_moat.png')

# ==============================================================================
# 6. FPT MULTI-YEAR GLOBAL IT & EPS (Slide 4 & Slide 6)
# ==============================================================================
# 6A. FPT Global IT Scale (Slide 4)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.2), dpi=200, gridspec_kw={'width_ratios': [1.8, 1.2]})
setup_ax(fig, ax1, 'DOANH THU IT TOÀN CẦU FPT (2018 - 2026E)', 'Doanh Thu (Triệu USD)', ylim=(0, 1800))
setup_ax(fig, ax2, 'CHI PHÍ KỸ SƯ / GIỜ', 'USD / Giờ', ylim=(0, 50))
years_fpt = ['2018', '2020', '2022', '2023', '2024', '2025', '2026E']
rev_fpt = [380, 520, 800, 1020, 1250, 1480, 1720]
colors_fpt = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b']
bars = ax1.bar(range(len(years_fpt)), rev_fpt, color=colors_fpt, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_fpt):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 25, f"${val}M", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax1.set_xticks(range(len(years_fpt)))
ax1.set_xticklabels(years_fpt, fontsize=10, fontweight='bold', color='#ffffff')

peers_cost = ['Việt Nam\n(FPT)', 'Ấn Độ\n(TCS/Infosys)', 'Đông Âu\n(Ba Lan/Romania)']
cost_vals = [24.5, 38.0, 44.0]
colors_cost = ['#10b981', '#f59e0b', '#ef4444']
bars2 = ax2.bar(range(len(peers_cost)), cost_vals, color=colors_cost, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars2, cost_vals):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.8, f"${val:.1f}/h", 
             ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax2.set_xticks(range(len(peers_cost)))
ax2.set_xticklabels(peers_cost, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'fpt_global_it_scale.png')

# 6B. FPT Multi-Year EPS Growth (Slide 6)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'TĂNG TRƯỞNG KÉP EPS FPT (2018 - 2026E): +22%/NĂM LIÊN TỤC 10 NĂM', 
         'Thu Nhập Trên Mỗi Cổ Phiếu EPS (VNĐ)', ylim=(0, 11000))
years_eps = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
eps_vals = [2450, 2980, 3520, 4350, 5320, 6480, 7850, 8800, 9850]
colors_eps = ['#334155', '#475569', '#3b82f6', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981', '#10b981', '#f59e0b']
bars = ax.bar(range(len(years_eps)), eps_vals, color=colors_eps, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, eps_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 150, f"{val:,} đ", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_eps)))
ax.set_xticklabels(years_eps, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'fpt_eps_cashflow_growth.png')

# ==============================================================================
# 7. SECURITIES & FINTECH (TCX, SSI, VCI)
# ==============================================================================
# 7A. TCX WealthTech Efficiency
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'HIỆU QUẢ HOẠT ĐỘNG WEALTHTECH TCX: CIR 16.5% THẤP KỶ LỤC TOÀN NGÀNH', 
         'Tỷ Lệ Chi Phí / Thu Nhập CIR (%) [Càng thấp càng tối ưu]', ylim=(0, 55))
brokers_cir = ['TCX\n(Techcom Sec)', 'VNDirect\n(VND)', 'SSI\n(SSI)', 'Vietcap\n(VCI)', 'Bình Quân\nNgành CK']
cir_brokers = [16.5, 26.2, 28.5, 32.0, 42.5]
colors_cir = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#ef4444']
bars = ax.bar(range(len(brokers_cir)), cir_brokers, color=colors_cir, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cir_brokers):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.8, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(brokers_cir)))
ax.set_xticklabels(brokers_cir, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'tcx_wealthtech_efficiency.png')

# 7B. SSI Equity & Foreign Market Share
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.2), dpi=200, gridspec_kw={'width_ratios': [1.3, 1.3]})
setup_ax(fig, ax1, 'VỐN CHỦ SỞ HỮU TOP CÔNG TY CHỨNG KHOÁN', 'Nghìn Tỷ VNĐ', ylim=(0, 32))
setup_ax(fig, ax2, 'THỊ PHẦN GIAO DỊCH KHÁCH NGOẠI', 'Tỷ Trọng (%)', ylim=(0, 45))
brokers_equity = ['SSI', 'TCX', 'VND', 'VCI', 'HSC']
equity_vals = [25.5, 26.2, 18.5, 10.8, 9.5]
bars1 = ax1.bar(range(len(brokers_equity)), equity_vals, color=['#10b981', '#38bdf8', '#64748b', '#0ea5e9', '#475569'], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars1, equity_vals):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f"{val:.1f}k", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.set_xticks(range(len(brokers_equity)))
ax1.set_xticklabels(brokers_equity, fontsize=10.5, fontweight='bold', color='#ffffff')

foreign_share = [36.5, 8.5, 12.0, 24.5, 14.0]
bars2 = ax2.bar(range(len(brokers_equity)), foreign_share, color=['#10b981', '#64748b', '#64748b', '#38bdf8', '#475569'], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars2, foreign_share):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax2.set_xticks(range(len(brokers_equity)))
ax2.set_xticklabels(brokers_equity, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'ssi_equity_foreign_share.png')

# 7C. VCI IB Margin
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'ĐỈNH CAO NGÂN HÀNG ĐẦU TƯ: MẢNG IB CỦA VIETCAP ĐẠT BIÊN RÒNG >65%', 
         'Biên Lợi Nhuận Ròng Mảng Nghiệp Vụ (%)', ylim=(0, 80))
segments = ['Vietcap (VCI)\n[Mảng IB Deal]', 'Vietcap (VCI)\n[Mảng Tự Doanh]', 'Khối CTCK\n[Bình Quân IB]', 'Ngân Hàng Phố Wall\n(Morgan Stanley IB)']
margin_ib = [68.0, 55.0, 32.0, 42.0]
colors_ib = ['#10b981', '#38bdf8', '#64748b', '#a855f7']
bars = ax.bar(range(len(segments)), margin_ib, color=colors_ib, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, margin_ib):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.0f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(segments)))
ax.set_xticklabels(segments, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vci_ib_deals_margin.png')

# ==============================================================================
# 8. RETAIL & CONSUMER (MWG, VNM, MCH, IMP)
# ==============================================================================
# 8A. MWG Cost Restructure
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'TÁI CẤU TRÚC MWG (2022 - 2026E): BIÊN GỘP TĂNG +400 BPS & TỐI ƯU CHI PHÍ SG&A', 
         'Tỷ Lệ (%) Trên Tổng Doanh Thu', ylim=(0, 30))
years_mwg = ['2022 (Đáy)', '2023 (Tái cấu trúc)', '2024 (Phục hồi)', '2025E (Điểm gặt)', '2026E (Tăng tốc)']
gross_mwg = [18.2, 19.5, 21.4, 22.2, 23.0]
sga_mwg = [16.8, 17.5, 15.2, 14.2, 13.8]
x_mwg = np.arange(len(years_mwg))
width = 0.35
rects1 = ax.bar(x_mwg - width/2, gross_mwg, width, label='Biên Lợi Nhuận Gộp', color='#10b981', edgecolor=(1,1,1,0.2))
rects2 = ax.bar(x_mwg + width/2, sga_mwg, width, label='Chi Phí SG&A / Doanh Thu', color='#ef4444', edgecolor=(1,1,1,0.2))
for bar, val in zip(rects1, gross_mwg):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
for bar, val in zip(rects2, sga_mwg):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(x_mwg)
ax.set_xticklabels(years_mwg, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.legend(loc='upper right', frameon=False)
save_chart(fig, 'mwg_cost_restructure.png')

# 8B. VNM EBITDA vs Global Peers
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'HIỆU QUẢ SINH LỜI VINAMILK VƯỢT TRỘI CÁC TẬP ĐOÀN SỮA ĐA QUỐC GIA', 
         'Biên Lợi Nhuận EBITDA (%)', ylim=(0, 28))
peers_dairy = ['Vinamilk\n(VNM - Việt Nam)', 'Danone\n(Pháp)', 'Mengniu\n(Trung Quốc)', 'Yili\n(Trung Quốc)', 'Saputo\n(Canada)', 'Nestlé\n(Thụy Sĩ)']
ebitda_dairy = [21.5, 12.2, 8.4, 9.8, 7.5, 17.5]
colors_dairy = ['#10b981', '#38bdf8', '#64748b', '#475569', '#64748b', '#0ea5e9']
bars = ax.bar(range(len(peers_dairy)), ebitda_dairy, color=colors_dairy, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, ebitda_dairy):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(peers_dairy)))
ax.set_xticklabels(peers_dairy, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vnm_ebitda_peers.png')

# 8C. MCH FMCG Moat
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CON HÀO GIA VỊ THIẾT YẾU MCH: THỊ PHẦN ÁP ĐẢO VƯỢT CÁC TẬP ĐOÀN QUỐC TẾ', 
         'Thị Phần Tại Việt Nam (%)', ylim=(0, 85))
products_mch = ['Nước Mắm\n(Nam Ngư/Chin-su)', 'Tương Ớt\n(Chin-su)', 'Nước Tương\n(Tam Thái Tử)', 'Mì Ăn Liền\n(Omachi/Kokomi)', 'Cà Phê\n(Vinacafé)']
shares_mch = [67.0, 71.5, 70.0, 30.5, 26.0]
colors_mch = ['#10b981', '#f59e0b', '#0ea5e9', '#38bdf8', '#a855f7']
bars = ax.bar(range(len(products_mch)), shares_mch, color=colors_mch, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, shares_mch):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(products_mch)))
ax.set_xticklabels(products_mch, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'mch_fmcg_moat.png')

# 8D. IMP EU-GMP Gross Margin
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'VỊ THẾ DƯỢC EU-GMP: BIÊN GỘP IMP ĐẠT 42.5% NHỜ THAY THẾ THUỐC NGOẠI BỆNH VIỆN', 
         'Biên Lãi Gộp Sản Phẩm (%)', ylim=(0, 55))
companies_imp = ['Imexpharm (IMP)\n[Chuẩn EU-GMP]', 'Dược Hậu Giang (DHG)\n[Japan-GMP]', 'Domesco (DMC)\n[CFR Quốc Tế]', 'Pymepharco (PME)\n[Stada Đức]', 'Bình Quân\nNgành Dược']
margin_imp = [42.5, 43.8, 34.2, 38.5, 29.5]
colors_imp = ['#10b981', '#38bdf8', '#64748b', '#0ea5e9', '#f59e0b']
bars = ax.bar(range(len(companies_imp)), margin_imp, color=colors_imp, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, margin_imp):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.8, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(companies_imp)))
ax.set_xticklabels(companies_imp, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'imp_gross_margin_eu_gmp.png')

# ==============================================================================
# 9. LOGISTICS & INFRASTRUCTURE (GMD, VTP, CTR, POW)
# ==============================================================================
# 9A. GMD Gemalink EBITDA
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'HIỆU QUẢ VẬN HÀNH CẢNG SÂU GEMALINK: BIÊN EBITDA GẦN 60% ĐỨNG ĐẦU VIỆT NAM', 
         'Biên Lợi Nhuận EBITDA (%)', ylim=(0, 72))
ports_gmd = ['Gemalink\n(Cái Mép)', 'Nam Đình Vũ\n(Hải Phòng)', 'Cảng Đình Vũ\n(DVP)', 'Cảng Đà Nẵng\n(CDN)', 'Cảng Hải Phòng\n(PHP)']
ebitda_gmd = [58.5, 48.2, 42.5, 38.0, 32.5]
colors_gmd = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#475569']
bars = ax.bar(range(len(ports_gmd)), ebitda_gmd, color=colors_gmd, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, ebitda_gmd):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(ports_gmd)))
ax.set_xticklabels(ports_gmd, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'gmd_ebitda_fcf_moat.png')

# 9B. VTP Robotics Cost
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CON HÀO TỰ ĐỘNG HÓA VTP: CHI PHÍ XỬ LÝ / KIỆN GIẢM 25% ĐƯA BIÊN EBITDA LÊN 9.2%', 
         'Chỉ Số Chi Phí Xử Lý / Bưu Kiện (Base 100%)', ylim=(0, 118))
stages_vtp = ['Trước Tự Động Hóa\n(Chia chọn thủ công)', 'Giai Đoạn Robot 1.0\n(Bán tự động)', 'Tổ Hợp Smart Logistics\n(Công nghệ 4.0)', 'Mục Tiêu 2026E\n(Full AI Robotics)', 'SF Express (TQ)\nBenchmark Quốc Tế']
costs_vtp = [100.0, 88.0, 75.0, 70.0, 65.0]
colors_vtp = ['#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#475569']
bars = ax.bar(range(len(stages_vtp)), costs_vtp, color=colors_vtp, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, costs_vtp):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5, f"{val:.0f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(stages_vtp)))
ax.set_xticklabels(stages_vtp, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vtp_efficiency_robot.png')

# 9C. POW Multi-Year FCF Inflection
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'ĐIỂM UỐN FCF ĐIỆN LỰC POW (2022 - 2027E): DÒNG TIỀN DƯƠNG KHI NT3&4 PHÁT ĐIỆN', 
         'Dòng Tiền Tự Do FCF (Tỷ VNĐ)', ylim=(-8000, 10000))
periods_pow = ['2022\n(Capex)', '2023\n(Capex NT3&4)', '2024\n(Lắp máy)', '2025E\n(Chạy thử)', '2026E\n(Thương mại)', '2027E\n(Ổn định)']
fcf_pow = [-3200, -5800, -2100, 1800, 5600, 7200]
colors_pow = ['#ef4444', '#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#10b981']
bars = ax.bar(range(len(periods_pow)), fcf_pow, color=colors_pow, width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, fcf_pow):
    va = 'bottom' if val >= 0 else 'top'
    y = bar.get_height() + (180 if val >= 0 else -450)
    ax.text(bar.get_x() + bar.get_width()/2, y, f"{val:,} tỷ", 
            ha='center', va=va, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(periods_pow)))
ax.set_xticklabels(periods_pow, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'pow_fcf_inflection.png')

# ==============================================================================
# 10. MIG MULTI-YEAR FLOAT & MARKET SHARE
# ==============================================================================
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'TỐC ĐỘ THĂNG HẠNG TOP 5 NGÀNH BẢO HIỂM: THỊ PHẦN MIG TĂNG GẤP ĐÔI NHỜ MB', 
         'Thị Phần Phí Bảo Hiểm Gốc (%)', ylim=(0, 25))
insurers_mig = ['Bảo Việt\n(BVH)', 'PVI\n(PVI)', 'Bảo Minh\n(BMI)', 'PTI\n(PTI)', 'MIC (MIG)\n[Quân Đội]', 'PJICO\n(PGI)']
share_2018 = [20.5, 15.2, 8.5, 8.2, 3.5, 6.5]
share_2025 = [14.8, 16.5, 7.8, 6.2, 6.8, 5.5]
x_mig = np.arange(len(insurers_mig))
width = 0.35
rects1 = ax.bar(x_mig - width/2, share_2018, width, label='Thị Phần 2018', color='#475569', edgecolor=(1,1,1,0.2))
rects2 = ax.bar(x_mig + width/2, share_2025, width, label='Thị Phần 2025E', 
                color=['#38bdf8', '#38bdf8', '#38bdf8', '#38bdf8', '#10b981', '#38bdf8'], edgecolor=(1,1,1,0.2))
for bar, val in zip(rects2, share_2025):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(x_mig)
ax.set_xticklabels(insurers_mig, fontsize=10, fontweight='bold', color='#ffffff')
ax.legend(loc='upper right', frameon=False)
save_chart(fig, 'mig_market_share_growth.png')

print("ALL INSTITUTIONAL CHARTS REGENERATED WITH FLAWLESS WHITE LABELS!")
