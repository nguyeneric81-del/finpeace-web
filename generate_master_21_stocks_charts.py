import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import numpy as np

DIRS = [
    'finpeace-web/public/canvas-lv3/images',
    'tai lieu FinPeace/images'
]
for d in DIRS:
    os.makedirs(d, exist_ok=True)

# 100% WHITE & HIGH-CONTRAST MATPLOTLIB CONFIGURATION
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['text.color'] = '#ffffff'
plt.rcParams['axes.labelcolor'] = '#f8fafc'
plt.rcParams['xtick.color'] = '#ffffff'
plt.rcParams['ytick.color'] = '#f8fafc'
plt.rcParams['axes.edgecolor'] = '#334155'
plt.rcParams['axes.linewidth'] = 0.9

def setup_ax(fig, ax, title, ylabel, ylim=None):
    fig.patch.set_facecolor('#070a12')
    ax.set_facecolor('#0a0f1d')
    ax.set_title(title, fontsize=12, fontweight='bold', color='#ffffff', pad=18)
    ax.set_ylabel(ylabel, fontsize=10.5, fontweight='bold', color='#cbd5e1')
    ax.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
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
    print(f"✓ Created {filename}")

# ==============================================================================
# 1. VCB
# ==============================================================================
# 1A. VCB LLR (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'BẢN ĐỒ AN TOÀN TÍN DỤNG: VCB SỞ HỮU KHO DỰ PHÒNG THẶNG DƯ >25.000 TỶ', 
         'Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', ylim=(0, 310))
banks = ['Toàn Ngành\n(Bình quân)', 'Khối TMCP\n(Bình quân)', 'BIDV\n(BID)', 'VietinBank\n(CTG)', 'Vietcombank\n(VCB)']
vals = [95.0, 82.0, 165.0, 170.0, 256.0]
colors = ['#64748b', '#475569', '#38bdf8', '#0ea5e9', '#10b981']
bars = ax.bar(range(len(banks)), vals, color=colors, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, f"{val:.0f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.axhline(100, color='#f59e0b', linestyle='--', linewidth=1.2, label='Ngưỡng an toàn tuyệt đối (100%)')
ax.set_xticks(range(len(banks)))
ax.set_xticklabels(banks, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.legend(facecolor='#0f172a', edgecolor='#334155', fontsize=9.5, labelcolor='#ffffff', loc='upper left')
save_chart(fig, 'vcb_llr_credit_scale.png')

# 1B. VCB Profit & ROE 10 Years (2018-2027E)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E', '2027E']
lnst = [14.6, 18.5, 18.4, 21.9, 29.9, 33.0, 34.2, 37.5, 42.0, 48.3]
roe = [22.8, 22.5, 18.2, 19.5, 23.4, 21.8, 20.8, 21.5, 22.0, 22.5]
x = np.arange(len(years))
bars = ax1.bar(x, lnst, color=['#0284c7' if i < 8 else '#10b981' for i in range(len(years))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lnst):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
line = ax2.plot(x, roe, color='#f59e0b', marker='o', linewidth=2.4, markersize=6, label='Tỷ suất ROE (%)')
for i, txt in enumerate(roe):
    ax2.annotate(f"{txt:.1f}%", (x[i], roe[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('QUỸ ĐẠO LỢI NHUẬN RÒNG & TỶ SUẤT ROE VCB (2018 - 2027E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=10.5, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất ROE (%)', fontsize=10.5, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 56)
ax2.set_ylim(14, 28)
ax1.set_xticks(x)
ax1.set_xticklabels(years, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vcb_profit_roe_growth.png')

# 1C. VCB Peer COF (Slide 6 Tab 2)
fig, ax = plt.subplots(figsize=(11, 5.5), dpi=200)
setup_ax(fig, ax, 'SO SÁNH CHI PHÍ VỐN (COF) CÁC NGÂN HÀNG: VCB THẤP NHẤT HỆ THỐNG',
         'Chi Phí Huy Động Vốn COF (%) [Thấp nhất = Lợi thế nhất]', ylim=(0, 7.2))
banks_cof = ['VCB\n(Vietcombank)', 'MBB\n(MBBank)', 'TCB\n(Techcombank)', 'ACB\n(ACB)', 'BID\n(BIDV)', 'CTG\n(VietinBank)', 'VPB\n(VPBank)']
cof_vals = [2.8, 3.6, 3.8, 4.1, 4.3, 4.4, 5.8]
colors_cof = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#64748b', '#ef4444']
bars = ax.bar(range(len(banks_cof)), cof_vals, color=colors_cof, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cof_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.12, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
btypes = ['Top 1 Quốc Doanh', 'Top 1 TMCP Số', 'Top 1 Bất Động Sản', 'Top 1 Bán Lẻ Tư Nhân', 'Big 4 Quốc Doanh', 'Big 4 Quốc Doanh', 'TMCP Đa Năng']
for bar, btype in zip(bars, btypes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() / 2, btype, 
            ha='center', va='center', rotation=90, fontsize=8.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_cof)))
ax.set_xticklabels(banks_cof, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'vcb_nim_cof_profit.png')

# ==============================================================================
# 2. MBB
# ==============================================================================
# 2A. MBB Digital Growth (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'BÙNG NỔ NGƯỜI DÙNG SỐ MBB (2017 - 2026E): NỀN TẢNG CASA 39.2% ĐẦU NGÀNH', 
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
save_chart(fig, 'mbb_digital_casa_growth.png')

# 2B. MBB CIR & ROE (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_mbb_cir = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
cir_mbb = [44.8, 39.5, 38.5, 33.2, 31.8, 29.5, 28.8, 28.2, 27.5]
roe_mbb = [19.5, 21.2, 19.2, 23.4, 25.6, 24.5, 23.8, 23.2, 23.5]
x_mbb = np.arange(len(years_mbb_cir))
bars = ax1.bar(x_mbb, cir_mbb, color=['#38bdf8' if i < 6 else '#10b981' for i in range(len(years_mbb_cir))], width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, cir_mbb):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_mbb, roe_mbb, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(roe_mbb):
    ax2.annotate(f"{txt:.1f}%", (x_mbb[i], roe_mbb[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('HIỆU QUẢ HOẠT ĐỘNG MBB: CIR GIẢM KỶ LỤC & ROE DUY TRÌ TRÊN 23% (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Tỷ Lệ Chi Phí / Thu Nhập CIR (%) [Càng giảm càng tốt]', fontsize=10, fontweight='bold', color='#38bdf8')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 52)
ax2.set_ylim(15, 30)
ax1.set_xticks(x_mbb)
ax1.set_xticklabels(years_mbb_cir, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#38bdf8')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'mbb_cir_roe_efficiency.png')

# ==============================================================================
# 3. ACB
# ==============================================================================
# 3A. ACB Retail Safety (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CƠ CẤU TÍN DỤNG BÁN LẺ & SME: ACB PHÒNG THỦ CAO NHẤT HỆ THỐNG', 
         'Tỷ Trọng Cho Vay Bán Lẻ & SME Cá Nhân (%)', ylim=(0, 110))
banks_acb = ['ACB\n(Bán lẻ)', 'VIB\n(Bán lẻ)', 'VPBank\n(Tiêu dùng)', 'Toàn Ngành\n(Bình quân)', 'Vietcombank\n(Bán buôn)', 'BIDV\n(Bán buôn)']
retail_ratio = [93.5, 87.0, 68.0, 42.0, 48.0, 39.0]
colors_acb = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#475569', '#334155']
bars = ax.bar(range(len(banks_acb)), retail_ratio, color=colors_acb, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, retail_ratio):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_acb)))
ax.set_xticklabels(banks_acb, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'acb_retail_safety.png')

# 3B. ACB Profit & ROE Growth 10 Years (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_acb = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_acb = [6.4, 7.5, 9.6, 12.0, 17.1, 20.1, 21.5, 23.8, 26.5]
roe_acb = [27.7, 24.6, 24.3, 25.2, 26.5, 24.8, 23.5, 24.0, 24.5]
x_acb = np.arange(len(years_acb))
bars = ax1.bar(x_acb, lntt_acb, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_acb))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_acb):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_acb, roe_acb, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(roe_acb):
    ax2.annotate(f"{txt:.1f}%", (x_acb[i], roe_acb[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('TĂNG TRƯỞNG LỢI NHUẬN TRƯỚC THUẾ & ROE ỔN ĐỊNH ACB (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất ROE (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 32)
ax2.set_ylim(18, 32)
ax1.set_xticks(x_acb)
ax1.set_xticklabels(years_acb, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'acb_npl_roe_quality.png')

# ==============================================================================
# 4. BID
# ==============================================================================
# 4A. BID Total Assets (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'QUY MÔ TỔNG TÀI SẢN HỆ THỐNG NGÂN HÀNG: BIDV GIỮ VỊ THẾ SỐ 1', 
         'Tổng Tài Sản (Triệu Tỷ VNĐ)', ylim=(0, 3.2))
banks_bid = ['BIDV\n(BID)', 'Agribank\n(VBA)', 'VietinBank\n(CTG)', 'Vietcombank\n(VCB)', 'MBBank\n(MBB)', 'Techcombank\n(TCB)']
assets = [2.42, 2.10, 2.15, 1.95, 1.05, 0.92]
colors_bid = ['#10b981', '#64748b', '#0ea5e9', '#38bdf8', '#a855f7', '#f59e0b']
bars = ax.bar(range(len(banks_bid)), assets, color=colors_bid, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, assets):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, f"{val:.2f} Tr.Tỷ", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_bid)))
ax.set_xticklabels(banks_bid, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'bid_assets_scale.png')

# 4B. BID LNTT & CIR (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_bid = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_bid = [9.5, 10.8, 9.0, 13.5, 23.1, 27.7, 31.0, 35.2, 39.8]
cir_bid = [52.4, 48.5, 46.2, 38.5, 33.2, 31.5, 30.5, 29.8, 29.0]
x_bid = np.arange(len(years_bid))
bars = ax1.bar(x_bid, lntt_bid, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_bid))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_bid):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_bid, cir_bid, color='#f59e0b', marker='d', linewidth=2.4, markersize=6)
for i, txt in enumerate(cir_bid):
    ax2.annotate(f"{txt:.1f}%", (x_bid[i], cir_bid[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('ĐIỂM NỔ LỢI NHUẬN BIDV: LNTT TĂNG GẤP 4 LẦN KHI HẾT TRÍCH LẬP DỰ PHÒNG (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Lệ Chi Phí CIR (%) [Càng thấp càng tối ưu]', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 48)
ax2.set_ylim(20, 60)
ax1.set_xticks(x_bid)
ax1.set_xticklabels(years_bid, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'bid_cir_profit_growth.png')

# ==============================================================================
# 5. CTG
# ==============================================================================
# 5A. CTG Credit & FDI (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN TÍN DỤNG DOANH NGHIỆP LỚN & KHỐI FDI: VIETINBANK VƯỢT TRỘI', 
         'Dư Nợ Khối Doanh Nghiệp & FDI (Triệu Tỷ VNĐ)', ylim=(0, 2.2))
banks_ctg = ['VietinBank\n(CTG)', 'BIDV\n(BID)', 'Agribank\n(VBA)', 'Vietcombank\n(VCB)', 'Techcombank\n(TCB)']
fdi_credit = [1.75, 1.68, 1.55, 1.35, 0.58]
colors_ctg = ['#10b981', '#0ea5e9', '#64748b', '#38bdf8', '#a855f7']
bars = ax.bar(range(len(banks_ctg)), fdi_credit, color=colors_ctg, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, fdi_credit):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.03, f"{val:.2f} Tr.Tỷ", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_ctg)))
ax.set_xticklabels(banks_ctg, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'ctg_credit_fdi.png')

# 5B. CTG LLR & Profit (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_ctg = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_ctg = [6.8, 11.8, 17.1, 17.6, 20.9, 25.1, 28.5, 32.5, 36.8]
llr_ctg = [115, 120, 132, 180, 188, 168, 172, 175, 180]
x_ctg = np.arange(len(years_ctg))
bars = ax1.bar(x_ctg, lntt_ctg, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_ctg))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_ctg):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_ctg, llr_ctg, color='#f59e0b', marker='^', linewidth=2.4, markersize=6)
for i, txt in enumerate(llr_ctg):
    ax2.annotate(f"{txt}%", (x_ctg[i], llr_ctg[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('BỘ ĐỆM DỰ PHÒNG LLR VỮNG CHẮC & LNTT TĂNG TRƯỞNG LIÊN TỤC CTG (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 44)
ax2.set_ylim(80, 220)
ax1.set_xticks(x_ctg)
ax1.set_xticklabels(years_ctg, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'ctg_llr_profit_scale.png')

# ==============================================================================
# 6. VPB
# ==============================================================================
# 6A. VPB CAR (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'HỆ SỐ AN TOÀN VỐN CAR CÁC NGÂN HÀNG: VPBANK SỐ 1 TOÀN NGÀNH', 
         'Hệ Số CAR Basel II/III (%)', ylim=(0, 20))
banks_car = ['VPBank\n(VPB)', 'Techcombank\n(TCB)', 'ACB\n(ACB)', 'MBBank\n(MBB)', 'Vietcombank\n(VCB)', 'BIDV\n(BID)', 'Chuẩn Basel II\n(Tối thiểu)']
car_vals = [15.5, 14.8, 12.2, 11.5, 11.8, 9.2, 8.0]
colors_car = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#475569', '#ef4444']
bars = ax.bar(range(len(banks_car)), car_vals, color=colors_car, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, car_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(banks_car)))
ax.set_xticklabels(banks_car, fontsize=9.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vpb_car_capital_moat.png')

# 6B. VPB Equity & Profit (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_vpb = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
equity_vpb = [34.7, 42.1, 52.8, 86.5, 103.5, 139.8, 145.0, 155.0, 168.0] # Vốn CSH Nghìn Tỷ
lntt_vpb = [9.2, 10.3, 13.0, 14.6, 21.2, 11.0, 18.5, 23.5, 28.0]
x_vpb = np.arange(len(years_vpb))
bars = ax1.bar(x_vpb, equity_vpb, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_vpb))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, equity_vpb):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, f"{val:.0f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_vpb, lntt_vpb, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(lntt_vpb):
    ax2.annotate(f"{txt:.1f}k", (x_vpb[i], lntt_vpb[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('BÙNG NỔ VỐN CHỦ SỞ HỮU & QUỸ ĐẠO PHỤC HỒI LNTT VPBANK (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Vốn Chủ Sở Hữu (Nghìn Tỷ VNĐ) [SMBC tham gia]', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('LNTT Hợp Nhất (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 200)
ax2.set_ylim(0, 35)
ax1.set_xticks(x_vpb)
ax1.set_xticklabels(years_vpb, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vpb_profit_credit_growth.png')

# ==============================================================================
# 7. FPT
# ==============================================================================
# 7A. FPT Global IT (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'DOANH THU XUẤT KHẨU PHẦN MỀM FPT GLOBAL (2018 - 2026E)', 
         'Doanh Thu Global IT (Triệu USD)', ylim=(0, 2100))
years_fpt = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_fpt = [380, 460, 520, 630, 801, 1020, 1220, 1480, 1780]
colors_fpt = ['#334155', '#475569', '#0284c7', '#0284c7', '#38bdf8', '#10b981', '#10b981', '#f59e0b', '#f59e0b']
bars = ax.bar(range(len(years_fpt)), rev_fpt, color=colors_fpt, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_fpt):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30, f"${val}M", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_fpt)))
ax.set_xticklabels(years_fpt, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'fpt_global_it_scale.png')

# 7B. FPT EPS & LNST (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_fpt_fin = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lnst_fpt = [3.2, 3.9, 4.4, 5.3, 6.5, 7.8, 9.4, 11.2, 13.5]
eps_fpt = [2850, 3420, 3950, 4680, 5620, 6850, 8150, 9700, 11500]
x_fpt = np.arange(len(years_fpt_fin))
bars = ax1.bar(x_fpt, lnst_fpt, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_fpt_fin))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lnst_fpt):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_fpt, eps_fpt, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(eps_fpt):
    ax2.annotate(f"{txt:,}", (x_fpt[i], eps_fpt[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=8.5, fontweight='bold', color='#fde68a')
ax1.set_title('TĂNG TRƯỞNG LỢI NHUẬN RÒNG & EPS ĐỀU ĐẶN >20%/NĂM FPT (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Thu Nhập Trên Mỗi Cổ Phiếu EPS (VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 16)
ax2.set_ylim(2000, 13500)
ax1.set_xticks(x_fpt)
ax1.set_xticklabels(years_fpt_fin, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'fpt_eps_cashflow_growth.png')

# ==============================================================================
# 8. FRT (Long Châu)
# ==============================================================================
# 8A. FRT Store Expansion (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'MẠNG LƯỚI NHÀ THUỐC LONG CHÂU VƯỢT TRỘI ĐỐI THỦ (2019 - 2026E)', 
         'Số Lượng Cửa Hàng (Điểm Bán)', ylim=(0, 2800))
years_frt = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lc_stores = [70, 200, 400, 1000, 1600, 2050, 2500, 2800]
bars = ax.bar(range(len(years_frt)), lc_stores, color=['#38bdf8' if i < 5 else '#10b981' for i in range(len(years_frt))], width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lc_stores):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 40, f"{val:,}", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_frt)))
ax.set_xticklabels(years_frt, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'frt_store_expansion.png')

# 8B. FRT Financial Turnaround (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_frt_fin = ['2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_lc = [1.2, 4.0, 9.6, 15.9, 23.5, 31.0, 39.5] # Doanh thu LC nghìn tỷ
lntt_frt = [28, 554, 486, -329, 550, 1100, 1650] # LNTT tỷ
x_frt = np.arange(len(years_frt_fin))
bars = ax1.bar(x_frt, rev_lc, color=['#0284c7' if i < 4 else '#10b981' for i in range(len(years_frt_fin))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_lc):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_frt, lntt_frt, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(lntt_frt):
    ax2.annotate(f"{txt:+d}", (x_frt[i], lntt_frt[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('ĐIỂM UỐN LỢI NHUẬN LONG CHÂU BÙNG NỔ SAU ĐẠT ĐIỂM HÒA VỐN (2020 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Long Châu (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Lợi Nhuận Trước Thuế FRT (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 48)
ax2.set_ylim(-600, 2200)
ax1.set_xticks(x_frt)
ax1.set_xticklabels(years_frt_fin, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'frt_financial_turnaround.png')

# ==============================================================================
# 9. HPG
# ==============================================================================
# 9A. HPG Scale Peers (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CÔNG SUẤT THÉP THÔ KHU VỰC: HÒA PHÁT VƯỢT LÊN TOP ĐẦU ĐÔNG NAM Á', 
         'Công Suất Thép Thô (Triệu Tấn / Năm)', ylim=(0, 18))
mills = ['HPG (Hiện tại)\n(Hòa Phát)', 'HPG (Dung Quất 2)\n(Hòa Phát)', 'Formosa\n(Hà Tĩnh)', 'Pomina\n(POM)', 'Hoa Sen\n(HSG)', 'Nam Kim\n(NKG)']
cap = [8.5, 14.5, 7.5, 1.5, 1.8, 1.2]
colors_hpg = ['#0284c7', '#10b981', '#64748b', '#475569', '#38bdf8', '#a855f7']
bars = ax.bar(range(len(mills)), cap, color=colors_hpg, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cap):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}M Tấn", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(mills)))
ax.set_xticklabels(mills, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'hpg_steel_scale_peers.png')

# 9B. HPG FCF Inflection (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_hpg = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E', '2027E']
capex_hpg = [14.5, 23.0, 11.2, 8.5, 21.0, 26.5, 32.0, 12.0, 6.0, 5.0] # Capex nghìn tỷ
fcf_hpg = [4.2, -8.5, 12.8, 28.5, -12.0, -14.5, -9.0, 18.5, 24.5, 28.0] # FCF nghìn tỷ
x_hpg = np.arange(len(years_hpg))
bars = ax1.bar(x_hpg, capex_hpg, color=['#ef4444' if c > 15 else '#64748b' for c in capex_hpg], width=0.45, alpha=0.85, label='Capex Đầu Tư DQ2')
for bar, val in zip(bars, capex_hpg):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f"{val:.0f}k", 
             ha='center', va='bottom', fontsize=9, fontweight='bold', color='#cbd5e1')
ax2 = ax1.twinx()
ax2.plot(x_hpg, fcf_hpg, color='#10b981', marker='o', linewidth=2.8, markersize=7, label='Dòng Tiền Tự Do FCF')
for i, txt in enumerate(fcf_hpg):
    ax2.annotate(f"{txt:+.0f}k", (x_hpg[i], fcf_hpg[i]), textcoords="offset points", xytext=(0,8 if txt>=0 else -14), ha='center', fontsize=9, fontweight='bold', color='#86efac' if txt>=0 else '#fca5a5')
ax1.set_title('ĐIỂM UỐN DÒNG TIỀN TỰ DO FCF HÒA PHÁT KHI DUNG QUẤT 2 VẬN HÀNH (2018 - 2027E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Capex Đầu Tư (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Dòng Tiền Tự Do FCF (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#10b981')
ax1.set_ylim(0, 42)
ax2.set_ylim(-20, 36)
ax1.set_xticks(x_hpg)
ax1.set_xticklabels(years_hpg, fontsize=10, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#10b981')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'hpg_fcf_inflection.png')

# ==============================================================================
# 10. MWG
# ==============================================================================
# 10A. MWG Grocery Shift (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CHUYỂN DỊCH DOANH THU BÁCH HÓA XANH (2019 - 2026E)', 
         'Doanh Thu BHX (Nghìn Tỷ VNĐ)', ylim=(0, 70))
years_mwg = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_bhx = [10.7, 21.2, 28.2, 31.6, 41.5, 49.0, 58.0, 66.5]
bars = ax.bar(range(len(years_mwg)), rev_bhx, color=['#38bdf8' if i < 5 else '#10b981' for i in range(len(years_mwg))], width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_bhx):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f"{val:.1f}k", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_mwg)))
ax.set_xticklabels(years_mwg, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'mwg_grocery_shift.png')

# 10B. MWG Cost Restructure (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_mwg_fin = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
gross_margin = [17.8, 19.1, 22.1, 22.5, 23.1, 18.7, 21.4, 22.5, 23.2]
lnst_mwg = [2.9, 3.8, 3.9, 4.9, 4.1, 0.17, 3.8, 5.1, 6.5] # LNST nghìn tỷ
x_mwg = np.arange(len(years_mwg_fin))
bars = ax1.bar(x_mwg, lnst_mwg, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_mwg_fin))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lnst_mwg):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_mwg, gross_margin, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(gross_margin):
    ax2.annotate(f"{txt:.1f}%", (x_mwg[i], gross_margin[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('TÁI CẤU TRÚC: BIÊN GỘP PHỤC HỒI & LỢI NHUẬN BẬT TĂNG MẠNH MWG (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Biên Lợi Nhuận Gộp (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 8.5)
ax2.set_ylim(14, 28)
ax1.set_xticks(x_mwg)
ax1.set_xticklabels(years_mwg_fin, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'mwg_cost_restructure.png')

# ==============================================================================
# 11. VNM
# ==============================================================================
# 11A. VNM Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN NGÀNH SỮA VIỆT NAM: VINAMILK ÁP ĐẢO TUYỆT ĐỐI', 
         'Thị Phần Toàn Ngành Sữa (%)', ylim=(0, 70))
peers_dairy = ['Vinamilk\n(VNM)', 'TH True Milk\n(TH)', 'Friesland\n(Cô Gái HL)', 'Nutifood\n(Nutifood)', 'Nestlé VN\n(Nestlé)', 'Mộc Châu Milk\n(MCM)']
share_dairy = [55.4, 15.2, 12.5, 9.1, 4.5, 3.3]
colors_dairy = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#475569']
bars = ax.bar(range(len(peers_dairy)), share_dairy, color=colors_dairy, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, share_dairy):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(peers_dairy)))
ax.set_xticklabels(peers_dairy, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'vnm_market_share_peers.png')

# 11B. VNM Cashflow & Dividend (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_vnm = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_vnm = [52.6, 56.3, 59.6, 60.9, 59.9, 60.4, 62.8, 65.5, 68.2] # Doanh thu nghìn tỷ
div_cash = [4500, 4500, 4000, 3850, 3850, 4000, 4200, 4500, 4800] # Cổ tức tiền mặt VNĐ/cp
x_vnm = np.arange(len(years_vnm))
bars = ax1.bar(x_vnm, rev_vnm, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_vnm))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_vnm):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.8, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_vnm, div_cash, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(div_cash):
    ax2.annotate(f"{txt:,}", (x_vnm[i], div_cash[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('VINAMILK - CỖ MÁY DÒNG TIỀN VÀ CỔ TỨC TIỀN MẶT ĐỀU ĐẶN (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Hợp Nhất (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Cổ Tức Tiền Mặt (VNĐ / Cổ Phiếu)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 80)
ax2.set_ylim(2500, 5500)
ax1.set_xticks(x_vnm)
ax1.set_xticklabels(years_vnm, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vnm_ebitda_peers.png')

# ==============================================================================
# 12. MCH
# ==============================================================================
# 12A. MCH Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN THỐNG TRỊ CÁC NGÀNH HÀNG FMCG: MASAN CONSUMER', 
         'Thị Phần Số 1 Toàn Quốc (%)', ylim=(0, 90))
categories = ['Nước Mắm\n(Chinsu/NamNgư)', 'Tương Ớt\n(Chinsu)', 'Nước Tương\n(Chinsu/TamTháiTử)', 'Cà Phê Hòa Tan\n(Vinacafé)', 'Mì Ăn Liền\n(Omachi/Kokomi)']
shares_mch = [68.0, 71.0, 70.0, 35.0, 28.5]
colors_mch = ['#10b981', '#38bdf8', '#0ea5e9', '#f59e0b', '#a855f7']
bars = ax.bar(range(len(categories)), shares_mch, color=colors_mch, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, shares_mch):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(categories)))
ax.set_xticklabels(categories, fontsize=9.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'mch_fmcg_moat.png')

# 12B. MCH EBITDA & Profit (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_mch = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_mch = [3.8, 4.5, 5.5, 6.2, 6.5, 7.8, 8.9, 10.2, 11.8] # Nghìn tỷ
ebitda_margin_mch = [22.5, 23.1, 24.5, 25.2, 24.8, 26.2, 26.8, 27.2, 27.5] # %
x_mch = np.arange(len(years_mch))
bars = ax1.bar(x_mch, lntt_mch, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_mch))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_mch):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_mch, ebitda_margin_mch, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(ebitda_margin_mch):
    ax2.annotate(f"{txt:.1f}%", (x_mch[i], ebitda_margin_mch[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('MÁY IN TIỀN TIÊU DÙNG: BIÊN EBITDA >25% VÀ LNTT MCH (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Biên Lợi Nhuận EBITDA (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 15)
ax2.set_ylim(18, 32)
ax1.set_xticks(x_mch)
ax1.set_xticklabels(years_mch, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'mch_ebitda_dividend_payout.png')

# ==============================================================================
# 13. IMP
# ==============================================================================
# 13A. IMP EU-GMP Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN KHÁNG SINH ĐẤU THẦU BỆNH VIỆN NHÓM 1 & 2 (EU-GMP)', 
         'Thị Phần Đấu Thầu ETC Nhóm 1-2 (%)', ylim=(0, 20))
pharma = ['Imexpharm\n(IMP - VN)', 'Sanofi\n(Pháp)', 'AstraZeneca\n(Anh)', 'Pymepharco\n(Stada)', 'Dược Hậu Giang\n(DHG - VN)', 'Dược Domesco\n(DMC - VN)']
share_pharma = [12.5, 11.0, 9.8, 8.5, 7.2, 5.5]
colors_pharma = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#475569']
bars = ax.bar(range(len(pharma)), share_pharma, color=colors_pharma, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, share_pharma):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(pharma)))
ax.set_xticklabels(pharma, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'imp_etc_market_share.png')

# 13B. IMP Margin & Revenue (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_imp = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_imp = [1.18, 1.40, 1.37, 1.27, 1.64, 1.99, 2.40, 2.85, 3.40] # Nghìn tỷ
gross_imp = [36.2, 38.5, 39.2, 38.8, 41.2, 41.5, 42.5, 43.2, 44.0] # %
x_imp = np.arange(len(years_imp))
bars = ax1.bar(x_imp, rev_imp, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_imp))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_imp):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, f"{val:.2f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_imp, gross_imp, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(gross_imp):
    ax2.annotate(f"{txt:.1f}%", (x_imp[i], gross_imp[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('DOANH THU & BIÊN LÃI GỘP CHUẨN EU-GMP IMEXPHARM (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Thuần (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Biên Lợi Nhuận Gộp (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 4.2)
ax2.set_ylim(30, 48)
ax1.set_xticks(x_imp)
ax1.set_xticklabels(years_imp, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'imp_gross_margin_eu_gmp.png')

# ==============================================================================
# 14. GMD
# ==============================================================================
# 14A. GMD Port Throughput (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'SẢN LƯỢNG CONTAINER QUA CỤM CẢNG GEMADEPT (2018 - 2026E)', 
         'Sản Lượng Hàng Hóa (Triệu TEUs)', ylim=(0, 6.8))
years_gmd = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
teus_gmd = [1.6, 1.9, 2.1, 2.8, 3.2, 3.4, 3.9, 4.6, 5.5]
bars = ax.bar(range(len(years_gmd)), teus_gmd, color=['#38bdf8' if i < 6 else '#10b981' for i in range(len(years_gmd))], width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, teus_gmd):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f"{val:.1f}M", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_gmd)))
ax.set_xticklabels(years_gmd, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'gmd_port_throughput.png')

# 14B. GMD EBITDA & FCF (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_gmd_fin = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_gmd = [2.7, 2.6, 2.6, 3.2, 3.9, 3.8, 4.5, 5.2, 6.1]
ebitda_gmd = [0.95, 1.05, 1.08, 1.35, 1.70, 1.65, 1.95, 2.35, 2.85]
x_gmd = np.arange(len(years_gmd_fin))
bars = ax1.bar(x_gmd, rev_gmd, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_gmd_fin))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_gmd):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_gmd, ebitda_gmd, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(ebitda_gmd):
    ax2.annotate(f"{txt:.2f}k", (x_gmd[i], ebitda_gmd[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('DOANH THU & BIÊN EBITDA VƯỢT TRỘI GEMADEPT (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Thuần (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('EBITDA Hoạt Động (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 7.5)
ax2.set_ylim(0.5, 3.5)
ax1.set_xticks(x_gmd)
ax1.set_xticklabels(years_gmd_fin, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'gmd_ebitda_fcf_moat.png')

# ==============================================================================
# 15. VTP
# ==============================================================================
# 15A. VTP Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN CHUYỂN PHÁT NHANH BƯU CHÍNH VIỆT NAM', 
         'Thị Phần Chuyển Phát Thương Mại Điện Tử (%)', ylim=(0, 32))
peers_log = ['SPX Express\n(Shopee)', 'Viettel Post\n(VTP)', 'Giao Hàng Tiết Kiệm\n(GHTK)', 'Giao Hàng Nhanh\n(GHN)', 'VNPost\n(Bưu Điện VN)', 'J&T Express\n(J&T)']
share_log = [25.0, 20.5, 18.2, 14.5, 12.0, 9.8]
colors_log = ['#334155', '#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#a855f7']
bars = ax.bar(range(len(peers_log)), share_log, color=colors_log, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, share_log):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(peers_log)))
ax.set_xticklabels(peers_log, fontsize=9.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vtp_parcels_per_capita.png')

# 15B. VTP Robot & Profit (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_vtp = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_vtp = [350, 480, 470, 370, 325, 480, 620, 810, 1050] # Tỷ VNĐ
unit_cost_vtp = [100, 98, 95, 96, 94, 88, 82, 78, 75] # Index chi phí/đơn
x_vtp = np.arange(len(years_vtp))
bars = ax1.bar(x_vtp, lntt_vtp, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_vtp))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_vtp):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 15, f"{val:,}", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_vtp, unit_cost_vtp, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(unit_cost_vtp):
    ax2.annotate(f"{txt}", (x_vtp[i], unit_cost_vtp[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('HIỆU QUẢ TỰ ĐỘNG HÓA ROBOT: CHI PHÍ GIẢM 25% & LNTT BÙNG NỔ VTP (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Chỉ Số Chi Phí / Đơn Hàng (2018=100) [Càng giảm càng tối ưu]', fontsize=9.5, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 1300)
ax2.set_ylim(60, 110)
ax1.set_xticks(x_vtp)
ax1.set_xticklabels(years_vtp, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vtp_efficiency_robot.png')

# ==============================================================================
# 16. CTR
# ==============================================================================
# 16A. CTR TowerCo Scale (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'SỐ LƯỢNG TRẠM PHÁT SÓNG BTS VIETTEL CONSTRUCTION (2019 - 2026E)', 
         'Số Lượng Trạm BTS TowerCo', ylim=(0, 19000))
years_ctr = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
bts_ctr = [1200, 2400, 4300, 6500, 9200, 12500, 15800, 18500]
bars = ax.bar(range(len(years_ctr)), bts_ctr, color=['#38bdf8' if i < 5 else '#10b981' for i in range(len(years_ctr))], width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, bts_ctr):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 300, f"{val:,}", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(years_ctr)))
ax.set_xticklabels(years_ctr, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'ctr_towerco_scale.png')

# 16B. CTR Tenancy & Revenue (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_ctr_fin = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_ctr = [4.2, 5.1, 6.4, 7.4, 9.4, 11.4, 13.2, 15.5, 18.2] # Nghìn tỷ
lnst_ctr = [147, 189, 274, 376, 443, 516, 620, 750, 910] # Tỷ
x_ctr = np.arange(len(years_ctr_fin))
bars = ax1.bar(x_ctr, rev_ctr, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_ctr_fin))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_ctr):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_ctr, lnst_ctr, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(lnst_ctr):
    ax2.annotate(f"{txt}", (x_ctr[i], lnst_ctr[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('DOANH THU & LỢI NHUẬN RÒNG TĂNG TRƯỞNG LIÊN TỤC 8 NĂM CTR (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Hợp Nhất (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Lợi Nhuận Sau Thuế (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 22)
ax2.set_ylim(100, 1100)
ax1.set_xticks(x_ctr)
ax1.set_xticklabels(years_ctr_fin, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'ctr_tenancy_ratio.png')

# ==============================================================================
# 17. POW
# ==============================================================================
# 17A. POW Capacity (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'CÔNG SUẤT PHÁT ĐIỆN VÀ VỊ THẾ SỐ 1 NHIỆT ĐIỆN KHÍ VIỆT NAM', 
         'Công Suất Nguồn Điện Lắp Đặt (MW)', ylim=(0, 7000))
power_co = ['PV Power\n(Hiện tại)', 'PV Power\n(+NT3-4 LNG)', 'GENCO 3\n(EVN)', 'GENCO 1\n(EVN)', 'GENCO 2\n(EVN)', 'Nhiệt Điện Phả Lại\n(PPC)']
cap_pow = [4205, 5825, 6500, 4500, 4400, 1040]
colors_pow = ['#0284c7', '#10b981', '#64748b', '#475569', '#38bdf8', '#a855f7']
bars = ax.bar(range(len(power_co)), cap_pow, color=colors_pow, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cap_pow):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100, f"{val:,} MW", 
            ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(power_co)))
ax.set_xticklabels(power_co, fontsize=9.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'pow_power_per_capita.png')

# 17B. POW FCF Inflection (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_pow = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E', '2027E']
rev_pow = [32.6, 35.4, 29.7, 24.5, 28.2, 28.1, 31.0, 36.5, 42.0, 46.5] # Nghìn tỷ
fcf_pow = [5.5, 4.2, 3.8, 1.2, -2.5, -4.8, -3.2, 2.5, 6.2, 7.8] # FCF nghìn tỷ
x_pow = np.arange(len(years_pow))
bars = ax1.bar(x_pow, rev_pow, color=['#0284c7' if i < 7 else '#10b981' for i in range(len(years_pow))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_pow):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_pow, fcf_pow, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(fcf_pow):
    ax2.annotate(f"{txt:+.1f}k", (x_pow[i], fcf_pow[i]), textcoords="offset points", xytext=(0,8 if txt>=0 else -14), ha='center', fontsize=9, fontweight='bold', color='#86efac' if txt>=0 else '#fca5a5')
ax1.set_title('ĐIỂM UỐN DÒNG TIỀN FCF PV POWER: BÙNG NỔ KHI NHƠN TRẠCH 3&4 VẬN HÀNH (2018 - 2027E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Doanh Thu Thuần (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Dòng Tiền Tự Do FCF (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 56)
ax2.set_ylim(-8, 11)
ax1.set_xticks(x_pow)
ax1.set_xticklabels(years_pow, fontsize=10, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'pow_fcf_inflection.png')

# ==============================================================================
# 18. MIG
# ==============================================================================
# 18A. MIG Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN BẢO HIỂM PHI NHÂN THỌ: MIC VƯƠN LÊN TOP 4', 
         'Thị Phần Doanh Thu Phí Bảo Hiểm Gốc (%)', ylim=(0, 24))
ins_peers = ['PVI\n(Top 1)', 'Bảo Việt\n(BVH)', 'Bảo Minh\n(BMI)', 'MIC\n(MIG)', 'Bảo Long\n(BLI)', 'PTI\n(PTI)']
share_ins = [18.5, 15.2, 8.8, 8.2, 6.5, 6.0]
colors_ins = ['#64748b', '#0ea5e9', '#38bdf8', '#10b981', '#475569', '#a855f7']
bars = ax.bar(range(len(ins_peers)), share_ins, color=colors_ins, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, share_ins):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(ins_peers)))
ax.set_xticklabels(ins_peers, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'mig_market_share_growth.png')

# 18B. MIG Float & Combined Ratio (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_mig = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
float_mig = [2.2, 2.6, 3.1, 3.8, 4.1, 4.3, 4.6, 5.0, 5.5] # Tiền float nghìn tỷ
combined_ratio_mig = [98.5, 97.8, 96.5, 95.8, 96.8, 95.5, 94.8, 94.2, 93.8] # %
x_mig = np.arange(len(years_mig))
bars = ax1.bar(x_mig, float_mig, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_mig))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, float_mig):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.08, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_mig, combined_ratio_mig, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(combined_ratio_mig):
    ax2.annotate(f"{txt:.1f}%", (x_mig[i], combined_ratio_mig[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('DÒNG TIỀN FLOAT ĐẦU TƯ & TỶ LỆ KẾT HỢP COMBINED RATIO MIG (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Quy Mô Tiền Gửi & Float (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Lệ Kết Hợp Combined Ratio (%) [<100% là có lãi kỹ thuật]', fontsize=9.5, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 7.0)
ax2.set_ylim(90, 102)
ax1.set_xticks(x_mig)
ax1.set_xticklabels(years_mig, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'mig_float_combined.png')

# ==============================================================================
# 19. TCX (TCBS)
# ==============================================================================
# 19A. TCX Wealthtech (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN CHO VAY KÝ QUỸ MARGIN: TECHCOM SECURITIES SỐ 1', 
         'Dư Nợ Cho Vay Ký Quỹ Margin (Nghìn Tỷ VNĐ)', ylim=(0, 32))
sec_margin = ['TCBS\n(TCX)', 'Mirae Asset\n(MAS)', 'SSI\n(SSI)', 'HSC\n(HCM)', 'VNDirect\n(VND)', 'VPS\n(VPS)']
margin_vals = [26.5, 19.5, 19.2, 16.5, 12.5, 13.0]
colors_margin = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#475569']
bars = ax.bar(range(len(sec_margin)), margin_vals, color=colors_margin, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, margin_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}k", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(sec_margin)))
ax.set_xticklabels(sec_margin, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'tcx_wealthtech_efficiency.png')

# 19B. TCX Profit & ROE (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_tcx = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_tcx = [1.5, 2.1, 2.7, 3.8, 3.0, 3.8, 5.2, 6.5, 8.0] # Nghìn tỷ
roe_tcx = [34.5, 32.8, 35.2, 38.5, 26.5, 22.8, 24.5, 26.2, 27.5] # %
x_tcx = np.arange(len(years_tcx))
bars = ax1.bar(x_tcx, lntt_tcx, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_tcx))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_tcx):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_tcx, roe_tcx, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(roe_tcx):
    ax2.annotate(f"{txt:.1f}%", (x_tcx[i], roe_tcx[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('QUỸ ĐẠO LỢI NHUẬN SỐ 1 NGÀNH CHỨNG KHOÁN & ROE VƯỢT TRỘI TCBS (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất ROE (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 10)
ax2.set_ylim(18, 45)
ax1.set_xticks(x_tcx)
ax1.set_xticklabels(years_tcx, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'tcx_profit_margin_growth.png')

# ==============================================================================
# 20. SSI
# ==============================================================================
# 20A. SSI Equity & Foreign Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'QUY MÔ VỐN CHỦ SỞ HỮU NGÀNH CHỨNG KHOÁN: SSI VỊ THẾ DẪN ĐẦU', 
         'Vốn Chủ Sở Hữu (Nghìn Tỷ VNĐ)', ylim=(0, 32))
sec_equity = ['SSI\n(SSI)', 'TCBS\n(TCX)', 'VNDirect\n(VND)', 'VPBankS\n(VPBS)', 'HSC\n(HCM)', 'Vietcap\n(VCI)']
equity_vals = [25.5, 24.8, 17.5, 16.2, 10.5, 8.8]
colors_equity = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#475569']
bars = ax.bar(range(len(sec_equity)), equity_vals, color=colors_equity, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, equity_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.4, f"{val:.1f}k", 
            ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(sec_equity)))
ax.set_xticklabels(sec_equity, fontsize=10, fontweight='bold', color='#ffffff')
save_chart(fig, 'ssi_equity_foreign_share.png')

# 20B. SSI Profit Cycle (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_ssi = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
rev_ssi = [3.8, 3.2, 4.5, 7.8, 6.5, 7.2, 8.5, 10.2, 12.5] # Nghìn tỷ
lntt_ssi = [1.6, 1.1, 1.6, 3.4, 2.1, 2.8, 3.6, 4.5, 5.6] # Nghìn tỷ
x_ssi = np.arange(len(years_ssi))
bars = ax1.bar(x_ssi, rev_ssi, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_ssi))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, rev_ssi):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_ssi, lntt_ssi, color='#f59e0b', marker='s', linewidth=2.4, markersize=6)
for i, txt in enumerate(lntt_ssi):
    ax2.annotate(f"{txt:.1f}k", (x_ssi[i], lntt_ssi[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('DOANH THU & LỢI NHUẬN THEO CHU KỲ NÂNG HẠNG THỊ TRƯỜNG SSI (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Tổng Doanh Thu Hoạt Động (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 15)
ax2.set_ylim(0.5, 6.8)
ax1.set_xticks(x_ssi)
ax1.set_xticklabels(years_ssi, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'ssi_profit_cycle_growth.png')

# ==============================================================================
# 21. VCI (Vietcap)
# ==============================================================================
# 21A. VCI IB Market Share (Slide 4)
fig, ax = plt.subplots(figsize=(10.5, 5.4), dpi=200)
setup_ax(fig, ax, 'THỊ PHẦN TƯ VẤN NGÂN HÀNG ĐẦU TƯ (IB & M&A) TẠI VIỆT NAM', 
         'Thị Phần Giá Trị Các Thương Vụ Lớn (%)', ylim=(0, 50))
ib_firms = ['Vietcap\n(VCI)', 'SSI\n(SSI)', 'HSC\n(HCM)', 'Bản Việt\n(Peers ngoại)', 'Khác\n(Ngành)']
ib_shares = [42.0, 22.5, 14.0, 12.0, 9.5]
colors_ib = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#475569']
bars = ax.bar(range(len(ib_firms)), ib_shares, color=colors_ib, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, ib_shares):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11, fontweight='bold', color='#ffffff')
ax.set_xticks(range(len(ib_firms)))
ax.set_xticklabels(ib_firms, fontsize=10.5, fontweight='bold', color='#ffffff')
save_chart(fig, 'vci_ib_deals_margin.png')

# 21B. VCI ROE & Profit (Slide 6)
fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years_vci = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E']
lntt_vci = [1011, 855, 951, 1851, 1060, 570, 960, 1550, 2200] # Tỷ VNĐ
roe_vci = [27.5, 21.2, 21.8, 32.5, 15.2, 8.5, 12.8, 18.5, 23.5] # %
x_vci = np.arange(len(years_vci))
bars = ax1.bar(x_vci, lntt_vci, color=['#0284c7' if i < 6 else '#10b981' for i in range(len(years_vci))], width=0.5, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, lntt_vci):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30, f"{val:,}", 
             ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#ffffff')
ax2 = ax1.twinx()
ax2.plot(x_vci, roe_vci, color='#f59e0b', marker='o', linewidth=2.4, markersize=6)
for i, txt in enumerate(roe_vci):
    ax2.annotate(f"{txt:.1f}%", (x_vci[i], roe_vci[i]), textcoords="offset points", xytext=(0,8), ha='center', fontsize=9, fontweight='bold', color='#fde68a')
ax1.set_title('HIỆU QUẢ DANH MỤC ĐẦU TƯ TỰ DOANH & TỶ SUẤT ROE VIETCAP (2018 - 2026E)', fontsize=12, fontweight='bold', color='#ffffff', pad=18)
ax1.set_ylabel('Lợi Nhuận Trước Thuế (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylim(0, 2600)
ax2.set_ylim(5, 40)
ax1.set_xticks(x_vci)
ax1.set_xticklabels(years_vci, fontsize=10.5, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')
ax1.grid(axis='y', linestyle=':', alpha=0.2, color='#475569')
for s in ax1.spines.values(): s.set_color('#334155')
for s in ax2.spines.values(): s.set_color('#334155')
save_chart(fig, 'vci_roe_investment_growth.png')

print("\n=======================================================")
print(" ALL 42 CANVAS CHARTS SUCCESSFULLY GENERATED & SAVED! ")
print("=======================================================")
