import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os, shutil
import numpy as np

DIRS = ['finpeace-web/public/canvas-lv3/images', 'tai lieu FinPeace/images']
for d in DIRS:
    os.makedirs(d, exist_ok=True)

def save_fig(fig, filename):
    for d in DIRS:
        dest = os.path.join(d, filename)
        fig.savefig(dest, dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"✓ Saved {filename}")

# ==============================================================================
# 1. VCB: TĂNG TRƯỞNG LỢI NHUẬN & ROE QUA CÁC NĂM (2018 - 2027E)
# ==============================================================================
fig, ax1 = plt.subplots(figsize=(11, 5.5), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')

years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E\n(Forward)', '2027E\n(Kỳ Vọng)']
lnst = [14.6, 18.5, 18.4, 21.9, 29.9, 33.1, 34.8, 38.5, 42.0, 48.3] # Nghìn tỷ VNĐ
roe = [24.1, 25.5, 21.0, 21.8, 24.2, 21.7, 20.8, 21.2, 21.5, 21.8] # ROE %

x = np.arange(len(years))
bar_colors = [
    '#334155', '#475569', '#3b82f6', '#0284c7', 
    '#0ea5e9', '#38bdf8', '#06b6d4', '#10b981', 
    '#f59e0b', '#fbbf24' # 2026E & 2027E in Gold
]

bars = ax1.bar(x, lnst, color=bar_colors, width=0.52, edgecolor=(1,1,1,0.2), label='LNST (Nghìn Tỷ VNĐ)')
for bar, val in zip(bars, lnst):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.9, f"{val:.1f}k", 
             ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')

ax2 = ax1.twinx()
ax2.plot(x, roe, color='#f59e0b', marker='o', linewidth=3, markersize=8, label='Tỷ Suất Sinh Lời ROE (%)')
for i, val in enumerate(roe):
    ax2.text(i, val + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#f59e0b')

ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=11, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=11, fontweight='bold', color='#f59e0b')
ax1.set_xticks(x)
ax1.set_xticklabels(years, fontsize=10, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='x', colors='#ffffff', pad=6)
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#f59e0b')

ax1.set_title('TĂNG TRƯỞNG LỢI NHUẬN & ROE VCB (2018 - 2027E): CỖ MÁY 42.000 TỶ LNST KỶ LỤC', 
              fontsize=12.5, fontweight='bold', color='#ffffff', pad=18)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 58)
ax2.set_ylim(15, 30)

# Annotation callout box
ax1.text(0.03, 0.90, '★ CAGR LNST 10 Năm: +16.2%/năm · ROE Bền Bỉ >20% Vượt Trội Mọi Chu Kỳ', 
         transform=ax1.transAxes, fontsize=10, fontweight='bold', color='#10b981',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))

for s in ax1.spines.values(): s.set_color((1,1,1,0.15))
for s in ax2.spines.values(): s.set_color((1,1,1,0.15))
save_fig(fig, 'vcb_profit_roe_growth.png')

# ==============================================================================
# 2. VCB: SO SÁNH CHI PHÍ VỐN COF VỚI CÁC NGÂN HÀNG KHÁC (FIX TÊN CỘT RÕ RÀNG)
# ==============================================================================
fig, ax = plt.subplots(figsize=(11, 5.5), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')

banks = [
    'VCB\n(Vietcombank)', 
    'MBB\n(MBBank)', 
    'TCB\n(Techcombank)', 
    'ACB\n(ACB)', 
    'BID\n(BIDV)', 
    'CTG\n(VietinBank)', 
    'VPB\n(VPBank)'
]
cof = [2.8, 3.6, 3.8, 4.1, 4.3, 4.4, 5.8]
colors = ['#10b981', '#38bdf8', '#0ea5e9', '#a855f7', '#64748b', '#64748b', '#ef4444']

bars = ax.bar(banks, cof, color=colors, width=0.52, edgecolor=(1,1,1,0.2))
for bar, val in zip(bars, cof):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.12, f"{val:.1f}%", 
            ha='center', va='bottom', fontsize=11.5, fontweight='bold', color='#ffffff')

# Sub labels inside bar for clarity
bank_types = ['Top 1 Quốc Doanh', 'Top 1 TMCP Số', 'Top 1 Bất Động Sản', 'Top 1 Bán Lẻ Tư Nhân', 'Big 4 Quốc Doanh', 'Big 4 Quốc Doanh', 'TMCP Đa Năng']
for bar, btype in zip(bars, bank_types):
    y_pos = bar.get_height() / 2
    ax.text(bar.get_x() + bar.get_width()/2, y_pos, btype, 
            ha='center', va='center', rotation=90, fontsize=9, fontweight='bold', color='#ffffff')

ax.set_ylabel('Chi Phí Huy Động Vốn COF (%) [Càng thấp càng tối ưu]', fontsize=11, fontweight='bold', color='#cbd5e1')
ax.set_title('SO SÁNH CHI PHÍ VỐN (COF) CÁC NGÂN HÀNG: VCB THẤP NHẤT HỆ THỐNG NHỜ CASA & TÍN NHIỆM', 
             fontsize=11.5, fontweight='bold', color='#ffffff', pad=18)

# EXPLICIT BRIGHT WHITE X-TICK LABELS
ax.set_xticks(range(len(banks)))
ax.set_xticklabels(banks, fontsize=10.5, fontweight='bold', color='#ffffff')
ax.tick_params(axis='x', colors='#ffffff', pad=8)
ax.tick_params(axis='y', colors='#cbd5e1', labelsize=10)

ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 7.2)

# Legend callout box
ax.text(0.03, 0.90, '★ Con Hào Chi Phí Vốn: VCB (2.8%) Tiết Kiệm Hàng Nghìn Tỷ Chi Phí Lãi So Với TMCP', 
         transform=ax.transAxes, fontsize=10, fontweight='bold', color='#10b981',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))

for s in ax.spines.values(): s.set_color((1,1,1,0.15))
save_fig(fig, 'vcb_nim_cof_profit.png')

# ==============================================================================
# 3. FIX LABELS FOR ACB NPL CHART
# ==============================================================================
fig, ax = plt.subplots(figsize=(11, 5.5), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks_acb = ['ACB\n(Á Châu)', 'VCB\n(Vietcombank)', 'TCB\n(Techcombank)', 'MBB\n(MBBank)', 'BID\n(BIDV)', 'CTG\n(VietinBank)', 'VPB\n(VPBank)', 'Trung Bình\nNgành']
npl = [1.18, 1.22, 1.45, 1.62, 1.58, 1.42, 2.95, 2.15]
colors_acb = ['#10b981', '#38bdf8', '#0ea5e9', '#38bdf8', '#64748b', '#64748b', '#ef4444', '#f59e0b']
bars = ax.bar(range(len(banks_acb)), npl, color=colors_acb, width=0.52, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, npl):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.06, f"{val:.2f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Tỷ Lệ Nợ Xấu NPL (%) [Càng thấp càng an toàn]', fontsize=11, fontweight='bold', color='#cbd5e1')
ax.set_title('QUẢN TRỊ TÍN DỤNG CHUẨN MỰC: ACB DUY TRÌ NỢ XẤU 1.18% THẤP NHẤT TOÀN NGÀNH', fontsize=11.5, fontweight='bold', color='#fff', pad=18)
ax.set_xticks(range(len(banks_acb)))
ax.set_xticklabels(banks_acb, fontsize=10, fontweight='bold', color='#ffffff')
ax.tick_params(axis='x', colors='#ffffff', pad=8)
ax.tick_params(axis='y', colors='#cbd5e1', labelsize=10)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 3.6)
for s in ax.spines.values(): s.set_color((1,1,1,0.15))
save_fig(fig, 'acb_npl_roe_quality.png')

print("All updated charts saved successfully!")
