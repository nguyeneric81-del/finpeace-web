"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingDown, Briefcase, HeartPulse } from "lucide-react"

interface StressTestPanelProps {
    // Tài sản thanh khoản (Quỹ Khẩn Cấp + Tích lũy thấp rủi ro)
    liquidAssets: number
    // Tài sản đầu tư (Cổ phiếu, Quỹ...)
    investmentAssets: number
    // Chi phí tháng
    monthlyExpense: number
    // Dư nợ tổng
    totalDebt: number
    // Lãi suất trung bình trên nợ (VD: 0.08 = 8%)
    avgDebtRate: number
}

type TestStatus = 'pass' | 'warning' | 'fail'

interface StressResult {
    icon: React.ReactNode
    title: string
    scenario: string
    result: string
    detail: string
    status: TestStatus
}

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

    // ── Kịch bản 1: Mất việc làm ──
    const jobLossMonths = monthlyExpense > 0 ? liquidAssets / monthlyExpense : 0
    const jobLossStatus: TestStatus = jobLossMonths >= 6 ? 'pass' : jobLossMonths >= 3 ? 'warning' : 'fail'

    // ── Kịch bản 2: Lãi suất tăng thêm 3% ──
    const extraAnnualInterest = totalDebt * 0.03
    const extraMonthlyInterest = extraAnnualInterest / 12
    const interestStatus: TestStatus = extraMonthlyInterest === 0 ? 'pass' : extraMonthlyInterest < monthlyExpense * 0.1 ? 'pass' : extraMonthlyInterest < monthlyExpense * 0.2 ? 'warning' : 'fail'

    // ── Kịch bản 3: Thị trường giảm 30% ──
    const marketLoss = investmentAssets * 0.30
    const marketLossStatus: TestStatus = liquidAssets >= marketLoss * 0.5 ? 'pass' : marketLoss < investmentAssets * 0.15 ? 'warning' : 'fail'

    // ── Kịch bản 4: Chi phí y tế đột xuất 200 triệu ──
    const medicalCost = 200_000_000
    const medicalStatus: TestStatus = liquidAssets >= medicalCost ? 'pass' : liquidAssets >= medicalCost * 0.5 ? 'warning' : 'fail'

    const results: StressResult[] = [
        {
            icon: <Briefcase className="w-5 h-5" />,
            title: "Mất Nguồn Thu Nhập",
            scenario: "Đột ngột mất việc làm, không có thu nhập",
            result: `Cầm cự được ${jobLossMonths.toFixed(1)} tháng`,
            detail: jobLossStatus === 'pass'
                ? `Quỹ thanh khoản ${fmtVND(liquidAssets)}₫ đủ vượt qua 6 tháng không lương`
                : `Cần tích thêm vào Quỹ Khẩn Cấp, mục tiêu ${fmtVND(monthlyExpense * 6)}₫`,
            status: jobLossStatus
        },
        {
            icon: <TrendingDown className="w-5 h-5" />,
            title: "Lãi Suất Tăng Vọt +3%",
            scenario: "Ngân hàng tăng lãi suất thêm 3%/năm",
            result: totalDebt === 0
                ? "Không bị ảnh hưởng (không có nợ)"
                : `Tăng thêm ${fmtVND(extraMonthlyInterest)}₫/tháng`,
            detail: totalDebt === 0
                ? "Bạn không có nợ, kịch bản này hoàn toàn an toàn"
                : interestStatus === 'pass'
                    ? `Mức tăng chỉ chiếm ${((extraMonthlyInterest / monthlyExpense) * 100).toFixed(1)}% chi phí tháng, chấp nhận được`
                    : `Mức tăng này ảnh hưởng đáng kể đến dòng tiền tháng. Cân nhắc trả bớt nợ`,
            status: interestStatus
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Thị Trường Sụp Đổ −30%",
            scenario: "Tài sản đầu tư (cổ phiếu, quỹ) giảm 30%",
            result: investmentAssets === 0
                ? "Không bị ảnh hưởng (chưa đầu tư)"
                : `Danh mục mất ${fmtVND(marketLoss)}₫ tạm thời`,
            detail: investmentAssets === 0
                ? "Bạn chưa có danh mục đầu tư nào cần lo"
                : marketLossStatus === 'pass'
                    ? "Quỹ thanh khoản đủ để không cần bán cổ phiếu lúc lỗ"
                    : "Nếu cần tiền, sẽ phải bán tài sản đang lỗ. Cần tăng Quỹ Thanh Khoản trước",
            status: marketLossStatus
        },
        {
            icon: <HeartPulse className="w-5 h-5" />,
            title: "Chi Phí Y Tế Đột Xuất",
            scenario: "Phát sinh viện phí khẩn cấp 200 triệu đồng",
            result: liquidAssets >= medicalCost
                ? `Đủ trang trải (còn dư ${fmtVND(liquidAssets - medicalCost)}₫)`
                : `Thiếu ${fmtVND(medicalCost - liquidAssets)}₫`,
            detail: medicalStatus === 'pass'
                ? "Quỹ thanh khoản đủ bao phủ phần lớn tình huống y tế khẩn cấp"
                : "Hãy ưu tiên mua Bảo hiểm Sức khỏe và Bảo hiểm Nhân thọ ngay!",
            status: medicalStatus
        }
    ]

    const statusConfig = {
        pass: {
            border: 'border-l-emerald-500',
            bg: 'bg-emerald-50',
            badge: 'bg-emerald-100 text-emerald-700',
            iconBg: 'bg-emerald-100 text-emerald-600',
            label: 'AN TOÀN'
        },
        warning: {
            border: 'border-l-amber-500',
            bg: 'bg-amber-50/50',
            badge: 'bg-amber-100 text-amber-700',
            iconBg: 'bg-amber-100 text-amber-600',
            label: 'CHÚ Ý'
        },
        fail: {
            border: 'border-l-rose-500',
            bg: 'bg-rose-50/50',
            badge: 'bg-rose-100 text-rose-700',
            iconBg: 'bg-rose-100 text-rose-600',
            label: 'RỦI RO'
        }
    }

    const passCount = results.filter(r => r.status === 'pass').length

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="bg-slate-50/80 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-slate-800">Kiểm Tra Sức Chịu Đựng</CardTitle>
                        <CardDescription className="mt-1">Tài chính của bạn có thể chống đỡ các cú sốc?</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{passCount}<span className="text-base text-slate-500">/4</span></p>
                        <p className="text-xs text-slate-500">kịch bản vượt qua</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
                {results.map((r, idx) => {
                    const cfg = statusConfig[r.status]
                    return (
                        <div key={idx} className={`flex gap-3 p-3.5 rounded-xl border-l-4 ${cfg.border} ${cfg.bg}`}>
                            <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${cfg.iconBg}`}>
                                {r.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-1">{r.scenario}</p>
                                <p className="text-xs font-semibold text-slate-700">{r.result}</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.detail}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
