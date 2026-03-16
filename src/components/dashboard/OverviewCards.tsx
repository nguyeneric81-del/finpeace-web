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

function KPICard({ icon: Icon, label, value, unit, sub, status, gradient }: {
    icon: any; label: string; value: string; unit?: string; sub: string;
    status: 'good' | 'warn' | 'bad'; gradient: string
}) {
    const statusColor = {
        good: 'text-emerald-400',
        warn: 'text-amber-400',
        bad: 'text-rose-400',
    }[status]
    const badgeColor = {
        good: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        warn: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
        bad: 'bg-rose-500/20 border-rose-500/30 text-rose-300',
    }[status]
    const badgeLabel = { good: '✓ Tốt', warn: '⚠ Chú ý', bad: '✗ Cần Fix' }[status]

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${gradient} p-5 backdrop-blur hover:-translate-y-0.5 transition-all duration-300`}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white/70" />
                    </div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badgeLabel}</span>
            </div>
            <p className={`text-2xl font-black ${statusColor}`}>
                {value}<span className="text-base font-normal text-white/40 ml-1">{unit}</span>
            </p>
            <p className="text-xs text-white/40 mt-2">{sub}</p>
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
                gradient="from-emerald-900/60 via-emerald-800/20 to-slate-900/40"
            />
            <KPICard
                icon={ShieldAlert}
                label="Quỹ Dự Phòng Bão Tố"
                value={emergencyMonths.toFixed(1)}
                unit="tháng"
                status={emergencyMonths >= 6 ? 'good' : emergencyMonths >= 3 ? 'warn' : 'bad'}
                sub={emergencyMonths >= 6 ? '✓ Đủ an toàn (≥ 6 tháng)' : 'Mục tiêu ≥ 6 tháng chi tiêu'}
                gradient="from-sky-900/60 via-sky-800/20 to-slate-900/40"
            />
            <KPICard
                icon={AlertCircle}
                label="Tỷ Lệ Nợ/Tài Sản"
                value={debtRatio.toFixed(1)}
                unit="%"
                status={debtRatio < 35 ? 'good' : debtRatio < 50 ? 'warn' : 'bad'}
                sub={debtRatio < 35 ? '✓ Lành mạnh (< 35% CFP)' : 'Ngưỡng CFP: < 35%'}
                gradient="from-violet-900/60 via-violet-800/20 to-slate-900/40"
            />
            <KPICard
                icon={PiggyBank}
                label="Tỷ Lệ Tự Do PYF"
                value={pyfRate.toFixed(1)}
                unit="%"
                status={pyfRate >= 20 ? 'good' : pyfRate >= 10 ? 'warn' : 'bad'}
                sub={pyfRate >= 20 ? '✓ Kỷ luật tốt (≥ 20%)' : 'Mục tiêu PYF ≥ 20% thu nhập'}
                gradient="from-amber-900/60 via-amber-800/20 to-slate-900/40"
            />
        </div>
    )
}
