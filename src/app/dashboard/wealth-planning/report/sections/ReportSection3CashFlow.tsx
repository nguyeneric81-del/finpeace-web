'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const fmtVND = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const Row = ({ label, value, highlight = false, sub }: any) => (
    <div className={`flex justify-between items-center py-2.5 border-b border-white/5 last:border-0 ${highlight ? 'font-bold' : ''}`}>
        <span className={`text-sm ${highlight ? 'text-white' : 'text-white/60'}`}>{label}</span>
        <div className="text-right">
            <span className={`text-sm font-semibold ${highlight ? 'text-emerald-400' : 'text-white/80'}`}>{value}</span>
            {sub && <p className="text-[10px] text-white/30">{sub}</p>}
        </div>
    </div>
)

export function ReportSection3CashFlow({ cashflow, snapshots }: any) {
    if (!cashflow) return (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-white/40">Chưa có dữ liệu dòng tiền.</div>
    )
    const { annual_income = 0, annual_expense = 0, annual_saving = 0,
        fixed_expense = 0, variable_expense = 0, discretionary_expense = 0,
        passive_income = 0, monthly_debt_payment = 0 } = cashflow

    const totalIncome = annual_income + passive_income
    const savingRate = totalIncome > 0 ? ((annual_saving / totalIncome) * 100).toFixed(1) : '0'
    const dsr = annual_income > 0 && monthly_debt_payment ? (((monthly_debt_payment * 12) / annual_income) * 100).toFixed(1) : '0'

    // Forecast: next 12 months projected balance
    const monthlyNetSaving = annual_saving / 12
    const forecastData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${new Date().getMonth() + i + 1 > 12 ? new Date().getMonth() + i - 11 : new Date().getMonth() + i + 1}`,
        projected: Math.round(monthlyNetSaving * (i + 1)),
    }))

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 3 — CFP: Cash Flow Statement</p>
                    <h2 className="text-xl font-black text-white">Báo Cáo Dòng Tiền</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* Income */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-3">Thu Nhập / Năm</p>
                    <Row label="Thu nhập chính (Lương/KD)" value={fmtVND(annual_income)} />
                    <Row label="Thu nhập thụ động" value={fmtVND(passive_income)} />
                    <Row label="Tổng Thu Nhập" value={fmtVND(totalIncome)} highlight />
                </div>

                {/* Expenses */}
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5">
                    <p className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-3">Chi Tiêu / Năm</p>
                    <Row label="Chi Cố Định (EMI, thuê nhà)" value={fmtVND(fixed_expense)} />
                    <Row label="Chi Biến Đổi (ăn, đi lại)" value={fmtVND(variable_expense)} />
                    <Row label="Chi Tùy Ý (giải trí)" value={fmtVND(discretionary_expense)} />
                    <Row label="Tổng Chi Tiêu" value={fmtVND(annual_expense)} highlight />
                </div>
            </div>

            {/* KPI bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`rounded-2xl border p-5 text-center ${Number(savingRate) >= 20 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Tiết Kiệm / Năm</p>
                    <p className="text-2xl font-black text-white">{fmtVND(annual_saving)}</p>
                    <p className="text-xs text-white/40 mt-1">≈ {fmtVND(annual_saving / 12)}/tháng</p>
                </div>
                <div className={`rounded-2xl border p-5 text-center ${Number(savingRate) >= 20 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Tỷ Lệ PYF</p>
                    <p className={`text-3xl font-black ${Number(savingRate) >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>{savingRate}%</p>
                    <p className="text-[10px] text-white/30 mt-1">Chuẩn CFP: ≥ 20%</p>
                </div>
                <div className={`rounded-2xl border p-5 text-center ${Number(dsr) <= 35 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Debt Service Ratio</p>
                    <p className={`text-3xl font-black ${Number(dsr) <= 35 ? 'text-emerald-400' : 'text-rose-400'}`}>{dsr}%</p>
                    <p className="text-[10px] text-white/30 mt-1">Chuẩn CFP: ≤ 35%</p>
                </div>
            </div>

            {/* Temporal Forecast (FLP idea #1) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="mb-4">
                    <p className="text-sm font-bold text-white">📅 Dự Báo Tích Lũy 12 Tháng Tới</p>
                    <p className="text-xs text-white/40 mt-0.5">Dựa trên thặng dư hàng tháng hiện tại. Không tính lãi kép đầu tư.</p>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                            <defs>
                                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => fmtVND(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(v: number) => [fmtVND(v), 'Tích lũy dự kiến']}
                                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                            />
                            <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} fill="url(#cashGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
