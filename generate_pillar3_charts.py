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

# 1. FRT Pillar 3: Điểm uốn tài chính Long Châu & Biên gộp
fig, ax1 = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years = ['2021', '2022', '2023', '2024', '2025', '2026E']
gross_margin = [14.2, 15.6, 16.8, 19.5, 22.1, 23.5]
cfo = [-450, 120, -890, 1450, 2100, 2650] # CFO tỷ VND
x = np.arange(len(years))
bars = ax1.bar(x, cfo, color=['#ef4444' if v < 0 else '#10b981' for v in cfo], width=0.45, label='Dòng tiền hoạt động CFO (Tỷ VNĐ)')
for bar, val in zip(bars, cfo):
    va = 'bottom' if val >= 0 else 'top'
    y = bar.get_height() + (70 if val >= 0 else -120)
    ax1.text(bar.get_x() + bar.get_width()/2, y, f"{val:,} tỷ", ha='center', va=va, fontsize=9.5, fontweight='bold', color='#fff')
ax2 = ax1.twinx()
line = ax2.plot(x, gross_margin, color='#f59e0b', marker='o', linewidth=2.8, markersize=7, label='Biên Lãi Gộp Tập Đoàn (%)')
for i, val in enumerate(gross_margin):
    ax2.text(i, val + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylabel('Dòng Tiền CFO (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Biên Lãi Gộp (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_xticks(x)
ax1.set_xticklabels(years, fontsize=10, fontweight='bold', color='#cbd5e1')
ax1.set_title('ĐIỂM UỐN TÀI CHÍNH LONG CHÂU: BIÊN GỘP ĐẠT 23.5% & DÒNG TIỀN CFO DƯƠNG >2.500 TỶ', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(-1200, 3400)
ax2.set_ylim(10, 28)
for s in ax1.spines.values(): s.set_color((1,1,1,0.1))
for s in ax2.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'frt_financial_turnaround.png')

# 2. VCB Pillar 3: Chi phí vốn thấp nhất ngành & NIM & ROE
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks = ['VCB\n(Vietcombank)', 'MBB\n(MBBank)', 'TCB\n(Techcombank)', 'ACB\n(ACB)', 'BID\n(BIDV)', 'CTG\n(VietinBank)', 'VPB\n(VPBank)']
cof = [2.8, 3.6, 3.8, 4.1, 4.3, 4.4, 5.8]
colors = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#64748b', '#64748b', '#ef4444']
bars = ax.bar(banks, cof, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, cof):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.12, f"{val:.1f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Chi Phí Vốn Bình Quân COF (%) - Càng thấp càng tốt', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('CHI PHÍ VỐN COF 2.8% THẤP NHẤT HỆ THỐNG: VCB THIẾT LẬP CON HÀO LỢI NHUẬN BẤT KHẢ XÂM PHẠM', fontsize=11, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 7.2)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'vcb_nim_cof_profit.png')

# 3. MBB Pillar 3: CIR giảm & ROE 23%
fig, ax1 = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax1.set_facecolor('#0a0f1d')
years = ['2020', '2021', '2022', '2023', '2024', '2025E']
cir = [38.5, 33.2, 31.8, 29.5, 28.8, 28.2] # CIR %
roe = [19.2, 23.4, 25.6, 24.5, 23.8, 23.2] # ROE %
x = np.arange(len(years))
bars = ax1.bar(x, cir, color=['#38bdf8' if i < 4 else '#10b981' for i in range(len(years))], width=0.45)
for bar, val in zip(bars, cir):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax2 = ax1.twinx()
ax2.plot(x, roe, color='#f59e0b', marker='s', linewidth=2.8, markersize=7)
for i, val in enumerate(roe):
    ax2.text(i, val + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_ylabel('Tỷ Lệ Chi Phí / Thu Nhập CIR (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax2.set_ylabel('Tỷ Suất Sinh Lời ROE (%)', fontsize=10, fontweight='bold', color='#f59e0b')
ax1.set_xticks(x)
ax1.set_xticklabels(years, fontsize=10, fontweight='bold', color='#cbd5e1')
ax1.set_title('ĐÒN BẨY SỐ HÓA MBB: CIR GIẢM VỀ 28.2% & ROE DUY TRÌ 23-25% CAO NHẤT KHỐI TMCP', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax1.grid(axis='y', linestyle=':', alpha=0.15)
ax1.set_ylim(0, 48)
ax2.set_ylim(15, 30)
for s in ax1.spines.values(): s.set_color((1,1,1,0.1))
for s in ax2.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mbb_cir_roe_efficiency.png')

# 4. ACB Pillar 3: NPL <1.2% & ROE 24%
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
banks = ['ACB', 'VCB', 'TCB', 'MBB', 'BID', 'CTG', 'VPB', 'Trung Bình Ngành']
npl = [1.18, 1.22, 1.45, 1.62, 1.58, 1.42, 2.95, 2.15]
colors = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#64748b', '#64748b', '#ef4444', '#f59e0b']
bars = ax.bar(banks, npl, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, npl):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.06, f"{val:.2f}%", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Tỷ Lệ Nợ Xấu NPL (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('QUẢN TRỊ TÍN DỤNG CHUẨN MỰC: ACB DUY TRÌ NỢ XẤU 1.18% THẤP NHẤT TOÀN NGÀNH', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 3.6)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'acb_npl_roe_quality.png')

# 5. BID Pillar 3: CIR giảm & LNTT >$1.3B
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2020', '2021', '2022', '2023', '2024', '2025E']
profit = [9.0, 13.5, 23.0, 27.6, 31.8, 35.5] # Nghìn tỷ VND
colors = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, profit, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, profit):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}k tỷ", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Lợi Nhuận Trước Thuế (Nghìn Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('ĐIỂM NỔ LỢI NHUẬN BIDV: LNTT TĂNG GẤP 4 LẦN NHỜ HOÀN TẤT XỬ LÝ NỢ XẤU VAMC', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 42)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'bid_cir_profit_growth.png')

# 6. CTG Pillar 3: LLR >170% & Thu ngoài lãi
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2020', '2021', '2022', '2023', '2024', '2025E']
llr = [132, 180, 188, 172, 175, 182]
colors = ['#334155', '#0284c7', '#10b981', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, llr, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, llr):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3, f"{val}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Tỷ Lệ Bao Phủ Nợ Xấu LLR (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('BỘ ĐỆM PHÒNG THỦ DỰ PHÒNG CTG: LLR >175% BẢO VỆ CHẤT LƯỢNG TÀI SẢN TRƯỚC BIẾN ĐỘNG', fontsize=11, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 220)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'ctg_llr_profit_scale.png')

# 7. FPT Pillar 3: EPS & Dòng tiền tự do FCF
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
years = ['2020', '2021', '2022', '2023', '2024', '2025E']
eps = [3520, 4350, 5320, 6480, 7850, 9500] # EPS VND
colors = ['#334155', '#475569', '#0284c7', '#0ea5e9', '#38bdf8', '#10b981']
bars = ax.bar(years, eps, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, eps):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 150, f"{val:,} đ", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Thu Nhập Trên Mỗi Cổ Phiếu EPS (VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('TĂNG TRƯỞNG KÉP EPS FPT: 22%/NĂM LIÊN TỤC 10 NĂM NHỜ ĐÒN BẨY XUẤT KHẨU PHẦN MỀM', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 11000)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'fpt_eps_cashflow_growth.png')

# 8. HPG Pillar 3: FCF bùng nổ khi Dung Quất 2 kết chuyển
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
stages = ['2021\n(Đỉnh Chu Kỳ)', '2022-2023\n(Capex DQ2)', '2024\n(Chạy Thử)', '2025E\n(Vận Hành 50%)', '2026E\n(Full Công Suất)']
fcf = [18500, -8200, 4500, 12800, 19200]
colors = ['#10b981', '#ef4444', '#f59e0b', '#38bdf8', '#10b981']
bars = ax.bar(stages, fcf, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, fcf):
    va = 'bottom' if val >= 0 else 'top'
    y = bar.get_height() + (400 if val >= 0 else -900)
    ax.text(bar.get_x() + bar.get_width()/2, y, f"{val:,} tỷ", ha='center', va=va, fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Dòng Tiền Tự Do FCF (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('ĐIỂM RƠI FCF HÒA PHÁT: >15.000 TỶ/NĂM KHI DUNG QUẤT 2 KẾT CHUYỂN HOÀN TẤT ĐẦU TƯ', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(-12000, 24000)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'hpg_fcf_inflection.png')

# 9. GMD Pillar 3: Biên EBITDA Gemalink >55% & FCF
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
ports = ['Gemalink (Cái Mép)', 'Nam Đình Vũ (Hải Phòng)', 'Cảng Đình Vũ (DVP)', 'Cảng Đà Nẵng (CDN)', 'Cảng Hải Phòng (PHP)']
ebitda = [58.5, 48.2, 42.5, 38.0, 32.5]
colors = ['#10b981', '#38bdf8', '#0ea5e9', '#64748b', '#475569']
bars = ax.bar(ports, ebitda, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, ebitda):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.2, f"{val:.1f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Biên Lợi Nhuận EBITDA Cảng Biển (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('HIỆU QUẢ VẬN HÀNH CẢNG SÂU GEMALINK: BIÊN EBITDA GẦN 60% ĐỨNG ĐẦU VIỆT NAM', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 72)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'gmd_ebitda_fcf_moat.png')

# 10. IMP Pillar 3: Biên gộp EU-GMP & ETC growth
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
companies = ['Imexpharm (IMP)\n[Chuẩn EU-GMP]', 'Dược Hậu Giang (DHG)\n[Chuẩn Japan-GMP]', 'Domesco (DMC)\n[CFR International]', 'Pymepharco (PME)\n[Chuẩn Stada Đức]', 'Bình Quân Ngành Dược']
margin = [42.5, 43.8, 34.2, 38.5, 29.5]
colors = ['#10b981', '#38bdf8', '#64748b', '#0ea5e9', '#f59e0b']
bars = ax.bar(companies, margin, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, margin):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.8, f"{val:.1f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Biên Lãi Gộp Sản Phẩm (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('VỊ THẾ DƯỢC EU-GMP: BIÊN GỘP IMP ĐẠT 42.5% NHỜ THAY THẾ THUỐC NGOẠI TẠI BỆNH VIỆN', fontsize=11, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 54)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'imp_gross_margin_eu_gmp.png')

# 11. MCH Pillar 3: Biên EBITDA 26% & Cổ tức tiền mặt
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
peers = ['Masan Consumer\n(MCH)', 'Vinamilk\n(VNM)', 'Unilever\n(Toàn cầu)', 'Nestlé\n(Thụy Sĩ)', 'Ajinomoto\n(Nhật Bản)', 'Bình Quân FMCG VN']
ebitda = [26.8, 22.5, 19.2, 17.5, 14.8, 15.2]
colors = ['#10b981', '#38bdf8', '#64748b', '#0ea5e9', '#475569', '#f59e0b']
bars = ax.bar(peers, ebitda, color=colors, width=0.5, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, ebitda):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.6, f"{val:.1f}%", ha='center', va='bottom', fontsize=10.5, fontweight='bold', color='#fff')
ax.set_ylabel('Biên Lợi Nhuận Hoạt Động EBITDA (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('MÁY IN TIỀN TIÊU DÙNG: BIÊN EBITDA CỦA MCH ĐẠT 26.8% VƯỢT TRỘI CÁC TẬP ĐOÀN ĐA QUỐC GIA', fontsize=11, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 34)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mch_ebitda_dividend_payout.png')

# 12. POW Pillar 3: Điểm uốn dòng tiền FCF Nhơn Trạch 3&4
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
periods = ['2022 (Capex)', '2023 (Capex NT3&4)', '2024 (Lắp đặt)', '2025E (Chạy thử)', '2026E (Thương mại)', '2027E (Ổn định)']
fcf = [-3200, -5800, -2100, 1800, 5600, 7200]
colors = ['#ef4444', '#ef4444', '#f59e0b', '#38bdf8', '#10b981', '#10b981']
bars = ax.bar(periods, fcf, color=colors, width=0.48, edgecolor=(1,1,1,0.15))
for bar, val in zip(bars, fcf):
    va = 'bottom' if val >= 0 else 'top'
    y = bar.get_height() + (150 if val >= 0 else -350)
    ax.text(bar.get_x() + bar.get_width()/2, y, f"{val:,} tỷ", ha='center', va=va, fontsize=10, fontweight='bold', color='#fff')
ax.set_ylabel('Dòng Tiền Tự Do FCF Dự Phóng (Tỷ VNĐ)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_title('ĐIỂM UỐN FCF ĐIỆN LỰC POW: CHUYỂN DƯƠNG >5.000 TỶ KHI NHƠN TRẠCH 3&4 PHÁT ĐIỆN', fontsize=11.5, fontweight='bold', color='#fff', pad=15)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(-8000, 9500)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'pow_fcf_inflection.png')

# 13. MIG Pillar 1 (thay thế để float_combined đưa vào Pillar 3): Thị phần bảo hiểm MIC tăng tốc
fig, ax = plt.subplots(figsize=(10, 5.2), dpi=200)
fig.patch.set_facecolor('#070a12')
ax.set_facecolor('#0a0f1d')
insurers = ['Bảo Việt (BVH)', 'PVI (PVI)', 'Bảo Minh (BMI)', 'PTI (PTI)', 'MIC (MIG) [Quân Đội]', 'PJICO (PGI)']
share_2018 = [20.5, 15.2, 8.5, 8.2, 3.5, 6.5]
share_2025 = [14.8, 16.5, 7.8, 6.2, 6.8, 5.5]
x = np.arange(len(insurers))
width = 0.35
rects1 = ax.bar(x - width/2, share_2018, width, label='Thị Phần 2018', color='#475569')
rects2 = ax.bar(x + width/2, share_2025, width, label='Thị Phần 2025E', color=['#38bdf8', '#38bdf8', '#38bdf8', '#38bdf8', '#10b981', '#38bdf8'])
for bar, val in zip(rects2, share_2025):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f"{val:.1f}%", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#fff')
ax.set_ylabel('Thị Phần Phí Bảo Hiểm Gốc (%)', fontsize=10, fontweight='bold', color='#cbd5e1')
ax.set_xticks(x)
ax.set_xticklabels(insurers, fontsize=9.5, fontweight='bold', color='#cbd5e1')
ax.set_title('TỐC ĐỘ THĂNG HẠNG TOP 5 NGÀNH BẢO HIỂM: THỊ PHẦN MIG TĂNG GẤP ĐÔI NHỜ HỆ SINH THÁI MB', fontsize=11, fontweight='bold', color='#fff', pad=15)
ax.legend(loc='upper right', frameon=False)
ax.grid(axis='y', linestyle=':', alpha=0.15)
ax.set_ylim(0, 24)
for s in ax.spines.values(): s.set_color((1,1,1,0.1))
save_fig(fig, 'mig_market_share_growth.png')

print("All Pillar 3 charts generated successfully!")
