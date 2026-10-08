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

fig, ax1 = plt.subplots(figsize=(11.5, 5.6), dpi=200)
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
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.9, f"{val:.1f}k tỷ", 
             ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#ffffff')

ax2 = ax1.twinx()
ax2.plot(x, roe, color='#fbbf24', marker='o', linewidth=3, markersize=8, label='Tỷ Suất Sinh Lời ROE (%)')

# Text positions for ROE with contrast background
for i, val in enumerate(roe):
    y_offset = 0.8 if i not in [2, 6] else -1.2
    va = 'bottom' if y_offset > 0 else 'top'
    ax2.text(i, val + y_offset, f"{val:.1f}%", ha='center', va=va, fontsize=9.5, fontweight='bold', color='#fbbf24',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#0a0f1d', edgecolor='none', alpha=0.85))

ax1.set_ylabel('Lợi Nhuận Sau Thuế (Nghìn Tỷ VNĐ)', fontsize=11, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=11, fontweight='bold', color='#fbbf24')
ax1.set_xticks(x)
ax1.set_xticklabels(years, fontsize=10, fontweight='bold', color='#ffffff')
ax1.tick_params(axis='x', colors='#ffffff', pad=6)
ax1.tick_params(axis='y', colors='#cbd5e1')
ax2.tick_params(axis='y', colors='#fbbf24')

ax1.set_title('TĂNG TRƯỞNG LỢI NHUẬN & ROE VCB (2018 - 2027E): CỖ MÁY 42.000 TỶ LNST KỶ LỤC', 
              fontsize=12.5, fontweight='bold', color='#ffffff', pad=18)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 58)
ax2.set_ylim(16, 30)

# Annotation callout box
ax1.text(0.03, 0.90, '★ CAGR LNST 10 Năm: +16.2%/năm · ROE Bền Bỉ >20% Vượt Trội Mọi Chu Kỳ', 
         transform=ax1.transAxes, fontsize=10, fontweight='bold', color='#10b981',
         bbox=dict(boxstyle='round,pad=0.5', facecolor='#0f172a', edgecolor='#10b981', alpha=0.9))

for s in ax1.spines.values(): s.set_color((1,1,1,0.15))
for s in ax2.spines.values(): s.set_color((1,1,1,0.15))
save_fig(fig, 'vcb_profit_roe_growth.png')
