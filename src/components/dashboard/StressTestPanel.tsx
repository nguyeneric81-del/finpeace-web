"use client"

import { Shield, TrendingDown, Briefcase, HeartPulse } from "lucide-react"

interface StressTestPanelProps {
    liquidAssets: number
    investmentAssets: number
    monthlyExpense: number
    totalDebt: number
    avgDebtRate: number
}

type TestStatus = 'pass' | 'warning' | 'fail'

export function StressTestPanel({
    liquidAssets = 0,
    investmentAssets = 0,
    monthlyExpense = 0,
    totalDebt = 0,
    avgDebtRate = 0.1
}: StressTestPanelProps) {
    const fmtVND = (val: number) => {
        if (Math.abs(val) >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + ' Tỷ'
        if (Math.abs(val) >= 1_000_000) return Math.round(val / 1_000_000) + ' Tr'
        return new Intl.NumberFormat('vi-VN').format(val)
    }

    const jobLossMonths = monthlyExpense > 0 ? liquidAssets / monthlyExpense : 0
    const jobLossStatus: TestStatus = jobLossMonths >= 6 ? 'pass' : jobLossMonths >= 3 ? 'warning' : 'fail'

    const extraMonthlyInterest = (totalDebt * 0.03) / 12
    const interestStatus: TestStatus = extraMonthlyInterest === 0 ? 'pass' : extraMonthlyInterest < monthlyExpense * 0.1 ? 'pass' : extraMonthlyInterest < monthlyExpense * 0.2 ? 'warning' : 'fail'

    const marketLoss = investmentAssets * 0.30
    const marketLossStatus: TestStatus = liquidAssets >= marketLoss * 0.5 ? 'pass' : marketLoss < investmentAssets * 0.15 ? 'warning' : 'fail'

    const medicalCost = 200_000_000
    const medicalStatus: TestStatus = liquidAssets >= medicalCost ? 'pass' : liquidAssets >= medicalCost * 0.5 ? 'warning' : 'fail'

    const results = [
        {
            icon: Briefcase,
            title: "Mất Nguồn Thu Nhập",
            scenario: "Đột ngột mất việc, không có thu nhập",
            result: `Cầm cự được ${jobLossMonths.toFixed(1)} tháng`,
            detail: jobLossStatus === 'pass'
                ? `Quỹ thanh khoản ${fmtVND(liquidAssets)} đủ vượt 6 tháng không lương`
                : `Cần tích thêm, mục tiêu ${fmtVND(monthlyExpense * 6)}`,
            status: jobLossStatus,
        },
        {
            icon: TrendingDown,
            title: "Lãi Suất Tăng Vọt +3%",
            scenario: "Ngân hàng tăng lãi thêm 3%/năm",
            result: totalDebt === 0 ? "Không bị ảnh hưởng" : `Tăng thêm ${fmtVND(extraMonthlyInterest)}/tháng`,
            detail: totalDebt === 0 ? "Bạn không có nợ — an toàn tuyệt đối" : interestStatus === 'pass' ? `Mức tăng ${((extraMonthlyInterest / monthlyExpense) * 100).toFixed(1)}% chi phí tháng, ổn` : "Ảnh hưởng đáng kể dòng tiền. Cân nhắc trả bớt nợ.",
            status: interestStatus,
        },
        {
            icon: Shield,
            title: "Thị Trường Sụp Đổ −30%",
            scenario: "Danh mục đầu tư giảm 30%",
            result: investmentAssets === 0 ? "Không bị ảnh hưởng" : `Danh mục mất ${fmtVND(marketLoss)} tạm thời`,
            detail: investmentAssets === 0 ? "Chưa có danh mục đầu tư cần lo" : marketLossStatus === 'pass' ? "Quỹ thanh khoản đủ để không bán lỗ" : "Cần tăng Quỹ Thanh Khoản để tránh bán tháo",
            status: marketLossStatus,
        },
        {
            icon: HeartPulse,
            title: "Chi Phí Y Tế Đột Xuất",
            scenario: "Viện phí khẩn cấp 200 triệu đồng",
            result: liquidAssets >= medicalCost ? `Đủ trang trải (còn dư ${fmtVND(liquidAssets - medicalCost)})` : `Thiếu ${fmtVND(medicalCost - liquidAssets)}`,
            detail: medicalStatus === 'pass' ? "Quỹ thanh khoản bao phủ tình huống y tế khẩn cấp" : "Ưu tiên mua Bảo hiểm Sức khoẻ và Nhân thọ ngay!",
            status: medicalStatus,
        },
    ]

    const statusCfg = {
        pass: {
            border: 'border-l-emerald-400',
            bg: 'bg-emerald-50/50',
            badge: 'bg-emerald-100 border-emerald-200 text-emerald-700',
            icon: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
            label: 'AN TOÀN',
            text: 'text-emerald-800',
        },
        warning: {
            border: 'border-l-amber-400',
            bg: 'bg-amber-50/50',
            badge: 'bg-amber-100 border-amber-200 text-amber-700',
            icon: 'bg-amber-50 text-amber-600 border border-amber-100',
            label: 'CHÚ Ý',
            text: 'text-amber-800',
        },
        fail: {
            border: 'border-l-rose-400',
            bg: 'bg-rose-50/50',
            badge: 'bg-rose-100 border-rose-200 text-rose-700',
            icon: 'bg-rose-50 text-rose-600 border border-rose-100',
            label: 'RỦI RO',
            text: 'text-rose-800',
        },
    }

    const passCount = results.filter(r => r.status === 'pass').length

    return (
        <div className="glass-card rounded-2xl p-2 border border-white/60 h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100/50">
                <div>
                    <p className="text-sm font-black text-slate-800">Kiểm Tra Sức Chịu Đựng</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Tài chính của bạn có thể chống chịu cú sốc?</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-800">{passCount}<span className="text-sm font-medium text-slate-400">/4</span></p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">kịch bản vượt qua</p>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 p-4 space-y-2.5">
                {results.map((r, i) => {
                    const cfg = statusCfg[r.status]
                    const Icon = r.icon
                    return (
                        <div key={i} className={`flex gap-3 p-3.5 rounded-xl border-l-4 ${cfg.border} ${cfg.bg}`}>
                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${cfg.icon}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className={`text-sm font-bold ${cfg.text}`}>{r.title}</p>
                                    <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mb-1">{r.scenario}</p>
                                <p className="text-xs font-semibold text-slate-700">{r.result}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{r.detail}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
