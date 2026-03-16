'use client'

const fmtVND = (v: number) => {
    if (!v) return '0 ₫'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} Tỷ`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v) + ' ₫'
}

const GROUP_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'Thanh Khoản': { label: 'Tài Sản Thanh Khoản', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    'Bảo Vệ': { label: 'Tài Sản Bảo Vệ', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    'Đầu Tư': { label: 'Tài Sản Đầu Tư', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    'Nợ': { label: 'Các Khoản Nợ', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
}

export function ReportSection2NetWorth({ assets }: any) {
    const grouped: Record<string, any[]> = {}
    for (const a of (assets || [])) {
        if (!grouped[a.asset_group]) grouped[a.asset_group] = []
        grouped[a.asset_group].push(a)
    }

    const totalAssets = (assets || []).filter((a: any) => a.asset_group !== 'Nợ').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const totalDebt = (assets || []).filter((a: any) => a.asset_group === 'Nợ').reduce((s: number, a: any) => s + (a.amount || 0), 0)
    const netWorth = totalAssets - totalDebt
    const debtRatio = totalAssets > 0 ? ((totalDebt / totalAssets) * 100).toFixed(0) : '0'

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-violet-400 to-sky-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 2 — CFP: Statement of Financial Position</p>
                    <h2 className="text-xl font-black text-white">Bảng Cân Đối Tài Sản Ròng (Net Worth Statement)</h2>
                </div>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 text-center">
                    <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-2">Tổng Tài Sản</p>
                    <p className="text-2xl font-black text-white">{fmtVND(totalAssets)}</p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-center">
                    <p className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-2">Tổng Nợ</p>
                    <p className="text-2xl font-black text-white">{fmtVND(totalDebt)}</p>
                    <p className="text-xs text-rose-400 mt-1">Tỉ lệ nợ/TS: {debtRatio}%</p>
                </div>
                <div className={`${netWorth >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} border rounded-2xl p-5 text-center`}>
                    <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Tài Sản Ròng</p>
                    <p className={`text-2xl font-black ${netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{netWorth < 0 ? '-' : ''}{fmtVND(Math.abs(netWorth))}</p>
                </div>
            </div>

            {/* Grouped tables */}
            {Object.entries(grouped).map(([group, items]) => {
                const cfg = GROUP_CONFIG[group] || { label: group, color: 'text-white', bg: 'bg-white/5 border-white/10' }
                const subtotal = items.reduce((s, a) => s + (a.amount || 0), 0)
                return (
                    <div key={group} className={`rounded-2xl border overflow-hidden ${cfg.bg}`}>
                        <div className="px-5 py-3 flex justify-between items-center border-b border-white/10">
                            <p className={`text-xs font-black uppercase tracking-wider ${cfg.color}`}>{cfg.label}</p>
                            <p className={`text-sm font-bold ${cfg.color}`}>{fmtVND(subtotal)}</p>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left px-5 py-2 text-xs text-white/30 font-bold">Tên Tài Sản</th>
                                    <th className="text-right px-5 py-2 text-xs text-white/30 font-bold">Giá Trị</th>
                                    {group === 'Nợ' && <th className="text-right px-5 py-2 text-xs text-white/30 font-bold">Trả/tháng</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((a, i) => (
                                    <tr key={i} className="border-b border-white/5 last:border-0">
                                        <td className="px-5 py-3 text-white/70">{a.asset_name}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-white/90">{fmtVND(a.amount)}</td>
                                        {group === 'Nợ' && <td className="px-5 py-3 text-right text-orange-400 text-xs">{a.monthly_payment ? fmtVND(a.monthly_payment) + '/th' : '—'}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            })}
        </div>
    )
}
