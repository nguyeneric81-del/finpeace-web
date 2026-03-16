'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'

const fmtVND = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const calcFV = (P: number, PMT: number, r: number, n: number) => {
    const rate = r / 100
    if (rate === 0) return P + PMT * 12 * n
    return P * Math.pow(1 + rate, n) + (PMT * 12) * ((Math.pow(1 + rate, n) - 1) / rate)
}

export function ReportSection5Goals({ scenario, cashflow }: any) {
    if (!scenario) return (
        <div className="rounded-2xl bg-white/5 border border-dashed border-white/20 p-10 text-center text-white/40">
            <p className="text-base font-semibold mb-2">Chưa chốt kịch bản nào.</p>
            <p className="text-sm">Hoàn thành bước "Thiết Kế Tương Lai" để xem Section này.</p>
        </div>
    )

    const { target_amount, target_years, expected_return, initial_capital, monthly_cashflow, plan_name } = scenario
    const rate = expected_return || 10

    const scenarios = [
        { name: 'An Toàn', rate: Math.max(5, rate - 4), color: '#10b981' },
        { name: 'Kịch Bản', rate: rate, color: '#38bdf8' },
        { name: 'Tăng Trưởng', rate: rate + 4, color: '#f59e0b' },
    ]

    const chartData = Array.from({ length: target_years + 1 }, (_, i) => {
        const point: Record<string, number | string> = { year: `N${i}` }
        scenarios.forEach(s => {
            point[s.name] = Math.round(calcFV(initial_capital || 0, monthly_cashflow || 0, s.rate, i))
        })
        point['Mục Tiêu'] = target_amount
        return point
    })

    const committedFV = calcFV(initial_capital || 0, monthly_cashflow || 0, rate, target_years)
    const gap = target_amount - committedFV
    const achievePct = Math.min(100, (committedFV / target_amount) * 100).toFixed(0)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-violet-400 to-rose-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 5 — CFP: Goal-Based Projections</p>
                    <h2 className="text-xl font-black text-white">Lộ Trình Đạt Mục Tiêu</h2>
                </div>
            </div>

            {/* Goal header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900/50 to-slate-900/60 border border-violet-500/20 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="relative">
                    <p className="text-xs text-violet-300 font-bold uppercase tracking-wider mb-2">Mục Tiêu Cam Kết</p>
                    <h3 className="text-2xl font-black text-white mb-4">{plan_name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Cần Đạt', value: fmtVND(target_amount) },
                            { label: 'Thời Hạn', value: `${target_years} Năm` },
                            { label: 'Vốn Ban Đầu', value: fmtVND(initial_capital) },
                            { label: 'Góp Hàng Tháng', value: `${fmtVND(monthly_cashflow)}/th` },
                        ].map(item => (
                            <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">{item.label}</p>
                                <p className="text-sm font-black text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feasibility summary */}
            <div className={`rounded-2xl border p-5 flex items-center gap-5 ${gap <= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="text-center shrink-0 w-20">
                    <p className={`text-4xl font-black ${gap <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>{achievePct}%</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold mt-1">Khả thi</p>
                </div>
                <div>
                    <p className="text-white font-bold text-base mb-1">
                        Dự kiến đạt <span className={gap <= 0 ? 'text-emerald-400' : 'text-amber-400'}>{fmtVND(committedFV)}</span> sau {target_years} năm
                    </p>
                    {gap > 0 ? (
                        <p className="text-white/50 text-sm">Còn thiếu <strong className="text-amber-400">{fmtVND(gap)}</strong> — cần tăng thêm {fmtVND(Math.ceil(gap / (target_years * 12)))}/tháng hoặc điều chỉnh kịch bản.</p>
                    ) : (
                        <p className="text-white/50 text-sm">Kịch bản hiện tại đủ để đạt mục tiêu. Dư <strong className="text-emerald-400">{fmtVND(-gap)}</strong>.</p>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-sm font-bold text-white mb-4">So Sánh 3 Kịch Bản Lãi Kép</p>
                <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={v => fmtVND(v)} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(v: number, n: string) => [fmtVND(v), n]} contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                            {scenarios.map(s => <Line key={s.name} type="monotone" name={s.name} dataKey={s.name} stroke={s.color} strokeWidth={2} dot={false} />)}
                            <Line type="monotone" name="Mục Tiêu" dataKey="Mục Tiêu" stroke="#f87171" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
