'use client'

import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react'

const fmtVND = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const INS_LABELS: Record<string, string> = {
    life_term: 'Bảo Hiểm Tử Kỳ',
    life_whole: 'Bảo Hiểm Nhân Thọ Hỗn Hợp',
    health: 'Bảo Hiểm Sức Khoẻ',
    accident: 'Bảo Hiểm Tai Nạn',
    bhxh: 'BHXH Nhà Nước',
    other: 'Bảo Hiểm Khác',
}

export function ReportSection6Risk({ insurance, profile, cashflow }: any) {
    const annualIncome = cashflow?.annual_income || 0
    const age = profile?.date_of_birth
        ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
        : 35
    const retirementHorizon = Math.max(0, 65 - age)
    const humanCapital = annualIncome * retirementHorizon
    const idealLifeCoverage = annualIncome * 10

    const totalLifeCoverage = (insurance || [])
        .filter((i: any) => ['life_term', 'life_whole'].includes(i.insurance_type))
        .reduce((s: number, i: any) => s + (i.coverage_amount || 0), 0)
    const hasHealth = (insurance || []).some((i: any) => i.insurance_type === 'health')
    const hasBHXH = (insurance || []).some((i: any) => i.insurance_type === 'bhxh')
    const bhxhYears = (insurance || []).filter((i: any) => i.insurance_type === 'bhxh').reduce((s: number, i: any) => s + (i.years_paid || 0), 0)

    const lifeCovGap = idealLifeCoverage - totalLifeCoverage
    const totalAnnualPremium = (insurance || []).reduce((s: number, i: any) => s + (i.annual_premium || 0), 0)

    const risks = [
        {
            label: 'Rủi Ro Tử Vong Sớm',
            status: totalLifeCoverage >= idealLifeCoverage ? 'covered' : totalLifeCoverage > 0 ? 'partial' : 'gap',
            detail: `Mệnh giá hiện có: ${fmtVND(totalLifeCoverage)} / Cần: ${fmtVND(idealLifeCoverage)} (10× thu nhập)`,
            action: lifeCovGap > 0 ? `Cần bổ sung ${fmtVND(lifeCovGap)} bảo hiểm tử kỳ.` : 'Đã đủ mệnh giá bảo hiểm tử kỳ.',
        },
        {
            label: 'Rủi Ro Bệnh & Tai Nạn',
            status: hasHealth ? 'covered' : 'gap',
            detail: hasHealth ? 'Đã có bảo hiểm sức khoẻ.' : 'Chưa khai báo bảo hiểm sức khoẻ.',
            action: hasHealth ? 'Kiểm tra hạn mức thanh toán viện phí mỗi năm.' : 'Ưu tiên mua BH sức khoẻ để bảo vệ thu nhập.',
        },
        {
            label: 'Rủi Ro Hưu Trí (BHXH)',
            status: hasBHXH && bhxhYears >= 20 ? 'covered' : hasBHXH ? 'partial' : 'gap',
            detail: hasBHXH ? `Đã đóng ${bhxhYears} năm BHXH.` : 'Chưa khai báo BHXH.',
            action: hasBHXH && bhxhYears < 20 ? `Cần đóng thêm ${20 - bhxhYears} năm để hưởng hưu trí đầy đủ.` : !hasBHXH ? 'Cân nhắc BHXH tự nguyện nếu tự kinh doanh.' : 'Đủ điều kiện hưu trí.',
        },
        {
            label: 'Rủi Ro Quỹ Khẩn Cấp',
            status: (cashflow?.annual_expense > 0 && (cashflow?.annual_saving / 12) >= cashflow?.annual_expense / 12 * 6) ? 'covered' : 'partial',
            detail: cashflow ? `Quỹ thanh khoản ước tính bao phủ dòng chi` : 'Chưa đủ dữ liệu.',
            action: 'Đảm bảo tài sản thanh khoản ≥ 6 tháng chi tiêu.',
        },
    ]

    const coverCount = risks.filter(r => r.status === 'covered').length
    const STATUS_CONFIG = {
        covered: { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Đã Bảo Vệ' },
        partial: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Bảo Vệ Một Phần' },
        gap: { icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', label: 'Khoảng Trống Nguy Hiểm' },
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-rose-400 to-orange-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 6 — CFP: Risk Management Plan</p>
                    <h2 className="text-xl font-black text-white">Kế Hoạch Quản Trị Rủi Ro</h2>
                </div>
            </div>

            {/* Human Capital */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Human Capital (Vốn Con Người)</p>
                    <p className="text-2xl font-black text-white">{fmtVND(humanCapital)}</p>
                    <p className="text-white/40 text-sm mt-1">{annualIncome > 0 ? `${fmtVND(annualIncome)}/năm × ${retirementHorizon} năm còn lại` : 'Cần nhập thu nhập'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Phí BH / Năm</p>
                    <p className="text-xl font-black text-white">{fmtVND(totalAnnualPremium)}</p>
                    {annualIncome > 0 && <p className="text-xs text-white/40">{(totalAnnualPremium / annualIncome * 100).toFixed(1)}% thu nhập</p>}
                </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-3">
                {risks.map(r => {
                    const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG]
                    const Icon = cfg.icon
                    return (
                        <div key={r.label} className={`rounded-2xl border p-5 flex items-start gap-4 ${cfg.bg}`}>
                            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.color}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <p className="text-white font-bold text-sm">{r.label}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                                </div>
                                <p className="text-white/50 text-xs">{r.detail}</p>
                                <p className={`text-xs mt-1.5 font-semibold ${cfg.color}`}>→ {r.action}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Insurance table */}
            {(insurance || []).length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/10">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Danh Sách Bảo Hiểm Hiện Có</p>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-5 py-2 text-xs text-white/30 font-bold">Loại</th>
                                <th className="text-left px-5 py-2 text-xs text-white/30 font-bold">Công Ty</th>
                                <th className="text-right px-5 py-2 text-xs text-white/30 font-bold">Mệnh Giá</th>
                                <th className="text-right px-5 py-2 text-xs text-white/30 font-bold">Phí/Năm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insurance.map((ins: any, i: number) => (
                                <tr key={i} className="border-b border-white/5 last:border-0">
                                    <td className="px-5 py-3 text-white/70">{INS_LABELS[ins.insurance_type] || ins.insurance_type}</td>
                                    <td className="px-5 py-3 text-white/50 text-xs">{ins.insurer || '—'}</td>
                                    <td className="px-5 py-3 text-right text-emerald-400 font-semibold">{fmtVND(ins.coverage_amount)}</td>
                                    <td className="px-5 py-3 text-right text-white/60 text-xs">{fmtVND(ins.annual_premium)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
