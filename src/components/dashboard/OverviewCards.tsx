"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ShieldAlert, AlertCircle, TrendingUp, PiggyBank } from "lucide-react"

interface OverviewCardsProps {
    netWorth: number
    debtRatio: number
    emergencyMonths: number  // Số tháng Quỹ Khẩn Cấp có thể cầm cự
    pyfRate: number          // Pay Yourself First Rate (%) = Tiết kiệm / Thu nhập
}

export function OverviewCards({ netWorth = 0, debtRatio = 0, emergencyMonths = 0, pyfRate = 0 }: OverviewCardsProps) {
    const fmtVND = (val: number) => {
        if (Math.abs(val) >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + ' Tỷ ₫'
        if (Math.abs(val) >= 1_000_000) return Math.round(val / 1_000_000) + ' Tr ₫'
        return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
    }

    const emergencyStatus = emergencyMonths >= 6 ? 'safe' : emergencyMonths >= 3 ? 'warning' : 'danger'
    const debtStatus = debtRatio <= 30 ? 'safe' : debtRatio <= 50 ? 'warning' : 'danger'
    const pyfStatus = pyfRate >= 20 ? 'safe' : pyfRate >= 10 ? 'warning' : 'danger'

    const statusBg = { safe: 'bg-emerald-50 border-emerald-200', warning: 'bg-amber-50 border-amber-200', danger: 'bg-rose-50 border-rose-200' }
    const statusText = { safe: 'text-emerald-700', warning: 'text-amber-700', danger: 'text-rose-700' }
    const statusBadge = { safe: 'bg-emerald-100 text-emerald-800', warning: 'bg-amber-100 text-amber-800', danger: 'bg-rose-100 text-rose-800' }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 1. Tài Sản Ròng (Net Worth) */}
            <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-600">Tài Sản Ròng</CardTitle>
                    <Wallet className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {fmtVND(netWorth)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Tổng tài sản trừ đi toàn bộ nợ</p>
                </CardContent>
            </Card>

            {/* 2. Quỹ Khẩn Cấp (Emergency Fund — tính bằng Tháng) */}
            <Card className={`shadow-sm border ${statusBg[emergencyStatus]}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-600">Quỹ Dự Phòng Bão Tố</CardTitle>
                    <ShieldAlert className={`h-4 w-4 ${statusText[emergencyStatus]}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${statusText[emergencyStatus]}`}>
                        {emergencyMonths.toFixed(1)} <span className="text-base font-normal">tháng</span>
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${statusText[emergencyStatus]}`}>
                        {emergencyStatus === 'safe' && '✓ Đủ an toàn (≥ 6 tháng)'}
                        {emergencyStatus === 'warning' && '⚡ Cần tích thêm (mục tiêu 6 tháng)'}
                        {emergencyStatus === 'danger' && '🚨 Khẩn cấp! Chưa đủ 3 tháng'}
                    </p>
                </CardContent>
            </Card>

            {/* 3. Tỷ Lệ Nợ (Debt-to-Asset Ratio) */}
            <Card className={`shadow-sm border ${statusBg[debtStatus]}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-600">Tỷ Lệ Nợ/Tài Sản</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${statusText[debtStatus]}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${statusText[debtStatus]}`}>
                        {debtRatio.toFixed(1)}<span className="text-base font-normal">%</span>
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${statusText[debtStatus]}`}>
                        {debtStatus === 'safe' && '✓ Lành mạnh (< 30%)'}
                        {debtStatus === 'warning' && '⚡ Chú ý quản lý nợ (30–50%)'}
                        {debtStatus === 'danger' && '🚨 Nguy hiểm! Nợ vượt kiểm soát'}
                    </p>
                </CardContent>
            </Card>

            {/* 4. PYF Rate (Pay Yourself First) */}
            <Card className={`shadow-sm border ${statusBg[pyfStatus]}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-600">Tỷ Lệ Tự Do (PYF)</CardTitle>
                    <PiggyBank className={`h-4 w-4 ${statusText[pyfStatus]}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${statusText[pyfStatus]}`}>
                        {pyfRate.toFixed(1)}<span className="text-base font-normal">%</span>
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${statusText[pyfStatus]}`}>
                        {pyfStatus === 'safe' && '✓ Kỷ luật tốt (≥ 20% thu nhập)'}
                        {pyfStatus === 'warning' && '⚡ Có thể tiết kiệm thêm'}
                        {pyfStatus === 'danger' && '🚨 Chưa đủ kỷ luật tài chính'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
