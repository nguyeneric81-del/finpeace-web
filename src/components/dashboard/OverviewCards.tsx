"use client"

import { Wallet, ShieldAlert, AlertCircle, PiggyBank } from "lucide-react"

interface OverviewCardsProps {
    netWorth: number
    debtRatio: number
    emergencyMonths: number
    pyfRate: number
}

const fmtVND = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + ' Tỷ ₫'
    if (Math.abs(val) >= 1_000_000) return Math.round(val / 1_000_000) + ' Tr ₫'
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
}

function KPICard({ icon: Icon, label, value, unit, sub, status }: {
    icon: any; label: string; value: string; unit?: string; sub: string;
    status: 'good' | 'warn' | 'bad';
}) {
    const statusColor = {
        good: 'text-emerald-700',
        warn: 'text-amber-600',
        bad: 'text-rose-600',
    }[status]
    const badgeColor = {
        good: 'bg-emerald-100 border-emerald-200 text-emerald-700',
        warn: 'bg-amber-100 border-amber-200 text-amber-700',
        bad: 'bg-rose-100 border-rose-200 text-rose-700',
    }[status]
    const badgeLabel = { good: '✓ Tốt', warn: '⚠ Chú ý', bad: '✗ Cần Fix' }[status]

    return (
        <div className="glass-card relative overflow-hidden rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-sm">
                        <Icon className="w-4 h-4 text-emerald-700" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badgeLabel}</span>
            </div>
            <p className={`text-2xl font-black ${statusColor}`}>
                {value}<span className="text-base font-medium text-slate-400 ml-1">{unit}</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">{sub}</p>
        </div>
    )
}

export function OverviewCards({ netWorth = 0, debtRatio = 0, emergencyMonths = 0, pyfRate = 0 }: OverviewCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
                icon={Wallet}
                label="Tài Sản Ròng"
                value={fmtVND(netWorth)}
                status={netWorth >= 0 ? 'good' : 'bad'}
                sub="Tổng tài sản trừ toàn bộ nợ"
            />
            <KPICard
                icon={ShieldAlert}
                label="Quỹ Dự Phòng Bão Tố"
                value={emergencyMonths.toFixed(1)}
                unit="tháng"
                status={emergencyMonths >= 6 ? 'good' : emergencyMonths >= 3 ? 'warn' : 'bad'}
                sub={emergencyMonths >= 6 ? '✓ Đủ an toàn (≥ 6 tháng)' : 'Mục tiêu ≥ 6 tháng chi tiêu'}
            />
            <KPICard
                icon={AlertCircle}
                label="Tỷ Lệ Nợ/Tài Sản"
                value={debtRatio.toFixed(1)}
                unit="%"
                status={debtRatio < 35 ? 'good' : debtRatio < 50 ? 'warn' : 'bad'}
                sub={debtRatio < 35 ? '✓ Lành mạnh (< 35% CFP)' : 'Ngưỡng CFP: < 35%'}
            />
            <KPICard
                icon={PiggyBank}
                label="Tỷ Lệ Tự Do PYF"
                value={pyfRate.toFixed(1)}
                unit="%"
                status={pyfRate >= 20 ? 'good' : pyfRate >= 10 ? 'warn' : 'bad'}
                sub={pyfRate >= 20 ? '✓ Kỷ luật tốt (≥ 20%)' : 'Mục tiêu PYF ≥ 20% thu nhập'}
            />
        </div>
    )
}
