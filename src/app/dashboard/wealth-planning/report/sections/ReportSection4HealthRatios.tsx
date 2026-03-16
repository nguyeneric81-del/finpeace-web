'use client'

const fmtVND = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

function KPICard({ label, value, status, note, threshold }: any) {
    const colors = { good: 'from-emerald-600/30 border-emerald-500/30 text-emerald-400', warn: 'from-amber-600/20 border-amber-500/30 text-amber-400', bad: 'from-rose-600/20 border-rose-500/30 text-rose-400' }
    const bg = { good: 'good', warn: 'warn', bad: 'bad' }[status as string] || 'warn'
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[bg as keyof typeof colors]} via-slate-900/60 to-slate-900/60 border p-5`}>
            <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                    status === 'good' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                    status === 'warn' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                    'bg-rose-500/20 border-rose-500/30 text-rose-300'
                }`}>
                    {status === 'good' ? '✓ Tốt' : status === 'warn' ? '⚠ Chú ý' : '✗ Cần Fix'}
                </span>
            </div>
            <p className={`text-3xl font-black ${colors[bg as keyof typeof colors].split(' ')[2]}`}>{value}</p>
            {threshold && <p className="text-[10px] text-white/30 mt-1">Ngưỡng CFP: {threshold}</p>}
            {note && <p className="text-xs text-white/50 mt-2">{note}</p>}
        </div>
    )
}

export function ReportSection4HealthRatios({ assets, cashflow }: any) {
    const totalAssets = (assets || []).filter((a: any) => a.asset_group !== 'Nợ').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const totalDebt = (assets || []).filter((a: any) => a.asset_group === 'Nợ').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const liquid = (assets || []).filter((a: any) => a.asset_group === 'Thanh Khoản').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const invested = (assets || []).filter((a: any) => a.asset_group === 'Đầu Tư').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const protected_ = (assets || []).filter((a: any) => a.asset_group === 'Bảo Vệ').reduce((s: number, a: any) => s + (a.amount || 0), 0)

    const netWorth = totalAssets - totalDebt
    const debtRatio = totalAssets > 0 ? (totalDebt / totalAssets * 100) : 0
    const monthlyExp = cashflow ? cashflow.annual_expense / 12 : 0
    const liquidMonths = monthlyExp > 0 ? liquid / monthlyExp : 0
    const pyf = cashflow?.annual_income > 0 ? (cashflow.annual_saving / cashflow.annual_income * 100) : 0
    const investRatio = totalAssets > 0 ? (invested / totalAssets * 100) : 0
    const protectRatio = totalAssets > 0 ? (protected_ / totalAssets * 100) : 0
    const dsr = cashflow?.annual_income > 0 && cashflow?.monthly_debt_payment
        ? (cashflow.monthly_debt_payment * 12 / cashflow.annual_income * 100) : 0

    const kpis = [
        {
            label: 'Tỉ Lệ Nợ / Tài Sản',
            value: `${debtRatio.toFixed(1)}%`,
            status: debtRatio < 35 ? 'good' : debtRatio < 50 ? 'warn' : 'bad',
            threshold: '< 35%',
            note: `Nợ ${fmtVND(totalDebt)} / Tài sản ${fmtVND(totalAssets)}`,
        },
        {
            label: 'Quỹ Khẩn Cấp',
            value: `${liquidMonths.toFixed(1)} tháng`,
            status: liquidMonths >= 6 ? 'good' : liquidMonths >= 3 ? 'warn' : 'bad',
            threshold: '≥ 6 tháng',
            note: `Thanh khoản hiện có: ${fmtVND(liquid)}`,
        },
        {
            label: 'Tỷ Lệ PYF (Tiết Kiệm)',
            value: `${pyf.toFixed(1)}%`,
            status: pyf >= 20 ? 'good' : pyf >= 10 ? 'warn' : 'bad',
            threshold: '≥ 20% thu nhập',
            note: `${fmtVND(cashflow?.annual_saving || 0)}/năm`,
        },
        {
            label: 'Tỷ Lệ Đầu Tư',
            value: `${investRatio.toFixed(1)}%`,
            status: investRatio >= 30 ? 'good' : investRatio >= 15 ? 'warn' : 'bad',
            threshold: '≥ 30% tài sản',
            note: `Tài sản đầu tư: ${fmtVND(invested)}`,
        },
        {
            label: 'Tỷ Lệ Bảo Vệ',
            value: `${protectRatio.toFixed(1)}%`,
            status: protectRatio >= 10 ? 'good' : protectRatio >= 5 ? 'warn' : 'bad',
            threshold: '10–20% tài sản',
            note: `Tài sản bảo vệ: ${fmtVND(protected_)}`,
        },
        {
            label: 'Debt Service Ratio',
            value: `${dsr.toFixed(1)}%`,
            status: dsr <= 35 ? 'good' : dsr <= 50 ? 'warn' : 'bad',
            threshold: '≤ 35% thu nhập',
            note: cashflow?.monthly_debt_payment ? `Trả nợ ${fmtVND(cashflow.monthly_debt_payment)}/tháng` : 'Chưa có dữ liệu',
        },
    ]

    const goodCount = kpis.filter(k => k.status === 'good').length
    const score = Math.round((goodCount / kpis.length) * 100)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-emerald-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 4 — CFP: Financial Ratios</p>
                    <h2 className="text-xl font-black text-white">6 Chỉ Số Sức Khoẻ Tài Chính</h2>
                </div>
            </div>

            {/* Overall Score */}
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none"
                            stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f87171'}
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${score} 100`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-black ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>{score}</span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Điểm Sức Khoẻ Tài Chính</p>
                    <p className="text-2xl font-black text-white">{score >= 70 ? 'Lành Mạnh' : score >= 40 ? 'Cần Cải Thiện' : 'Khu Vực Rủi Ro'}</p>
                    <p className="text-white/50 text-sm">{goodCount}/{kpis.length} chỉ số đạt chuẩn CFP</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {kpis.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
            </div>
        </div>
    )
}
