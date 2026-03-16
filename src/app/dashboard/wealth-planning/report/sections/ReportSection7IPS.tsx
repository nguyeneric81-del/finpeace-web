'use client'

export function ReportSection7IPS({ scenario, profile }: any) {
    const rate = scenario?.expected_return || 10
    const years = scenario?.target_years || 10
    const riskProfile = profile?.risk_profile ||
        (rate < 8 ? 'conservative' : rate <= 12 ? 'moderate' : 'aggressive')

    const allocs: Record<string, { bonds: number; equity: number; alt: number; cash: number; label: string; color: string }> = {
        conservative: { bonds: 55, equity: 25, alt: 10, cash: 10, label: 'Thận Trọng (Conservative)', color: 'emerald' },
        moderate: { bonds: 35, equity: 45, alt: 10, cash: 10, label: 'Cân Bằng (Moderate)', color: 'sky' },
        aggressive: { bonds: 15, equity: 65, alt: 15, cash: 5, label: 'Tăng Trưởng (Aggressive)', color: 'amber' },
    }
    const alloc = allocs[riskProfile] || allocs['moderate']

    const barColors: Record<string, string> = {
        conservative: 'bg-emerald-500',
        moderate: 'bg-sky-500',
        aggressive: 'bg-amber-500',
    }

    const allocItems = [
        { label: 'Thu Nhập Cố Định (Trái phiếu, Tiết kiệm)', value: alloc.bonds, color: 'bg-emerald-500' },
        { label: 'Cổ Phiếu Trong Nước (VN30, Midcap)', value: alloc.equity, color: 'bg-sky-500' },
        { label: 'Tài Sản Thay Thế (Vàng, REIT, Crypto)', value: alloc.alt, color: 'bg-violet-500' },
        { label: 'Tiền Mặt & Tương Đương', value: alloc.cash, color: 'bg-slate-400' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-sky-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 7 — CFP: Investment Policy Statement</p>
                    <h2 className="text-xl font-black text-white">Tuyên Bố Chính Sách Đầu Tư (IPS)</h2>
                </div>
            </div>

            {/* Profile & Objectives */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Khẩu Vị Rủi Ro', value: alloc.label },
                    { label: 'Horizon Đầu Tư', value: `${years} Năm` },
                    { label: 'Lợi Suất Kỳ Vọng (Danh Nghĩa)', value: `${rate}% / năm` },
                    { label: 'Lợi Suất Thực (sau lạm phát ~3.5%)', value: `~${(rate - 3.5).toFixed(1)}% / năm` },
                    { label: 'Drawdown Chấp Nhận Tối Đa', value: riskProfile === 'conservative' ? '10%' : riskProfile === 'moderate' ? '25%' : '40%' },
                    { label: 'Tần Suất Review (Tái Cân Bằng)', value: 'Hàng Quý (Q1–Q4)' },
                ].map(item => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-semibold">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Asset Allocation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-bold text-white">Phân Bổ Tài Sản Mục Tiêu</p>
                {/* Visual bar */}
                <div className="flex h-8 rounded-xl overflow-hidden gap-0.5">
                    {allocItems.map(a => (
                        a.value > 0 && <div key={a.label} className={`${a.color} flex items-center justify-center text-xs font-bold text-white/90 transition-all`}
                            style={{ width: `${a.value}%` }}>
                            {a.value >= 10 ? `${a.value}%` : ''}
                        </div>
                    ))}
                </div>
                {/* Legend */}
                <div className="space-y-2.5">
                    {allocItems.map(a => (
                        <div key={a.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded ${a.color}`} />
                                <span className="text-sm text-white/60">{a.label}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{a.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rules */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <p className="text-sm font-bold text-white mb-4">Nguyên Tắc Vận Hành Danh Mục</p>
                {[
                    { label: 'Kích Hoạt Tái Cân Bằng', value: `Khi allocation lệch > 5% khỏi target` },
                    { label: 'Cắt Lỗ (Stop-Loss)', value: riskProfile === 'aggressive' ? 'Drawdown > 15% trong 1 tháng — xem xét tái cân bằng' : 'Drawdown > 10% — bắt buộc xem xét' },
                    { label: 'Chốt Lời', value: 'Khi vượt target 20%+ — chuyển bớt về Fixed Income' },
                    { label: 'Cấm (Prohibited)', value: 'Cổ phiếu penny volume < 500K/ngày · Đòn bẩy > 2x · IPO không có track record' },
                ].map(item => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs text-white/40 font-bold uppercase tracking-wider sm:w-44 shrink-0">{item.label}</span>
                        <span className="text-sm text-white/70">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
