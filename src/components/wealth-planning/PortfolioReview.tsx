"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion } from "framer-motion"
import {
    ShieldCheck, Droplets, Sprout, Flame, AlertCircle,
    TrendingUp, TrendingDown, Minus, MapPin, HeartPulse,
    Layers, ArrowRight, CheckCircle2, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ============================================================
// TYPES
// ============================================================
interface Asset {
    id: string
    asset_group: string
    asset_name: string
    amount: number
    risk_level: number
    expected_return?: number
}

interface Cashflow {
    annual_income: number
    annual_expense: number
    annual_saving: number
}

// ============================================================
// CONSTANTS
// ============================================================
const GROUP = {
    DEBT: "Nợ",
    LIQUIDITY: "Thanh khoản",
    PROTECTION: "Bảo vệ",
    INVESTMENT: "Đầu tư",
    CONSUMPTION: "Tiêu dùng",
}

const GROUP_STYLE: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    "Bảo vệ": { color: "text-slate-700", bg: "bg-slate-100", icon: <ShieldCheck className="w-4 h-4" /> },
    "Thanh khoản": { color: "text-sky-700", bg: "bg-sky-50", icon: <Droplets className="w-4 h-4" /> },
    "Đầu tư": { color: "text-emerald-700", bg: "bg-emerald-50", icon: <Sprout className="w-4 h-4" /> },
    "Tiêu dùng": { color: "text-amber-700", bg: "bg-amber-50", icon: <Layers className="w-4 h-4" /> },
    "Nợ": { color: "text-rose-700", bg: "bg-rose-50", icon: <Flame className="w-4 h-4" /> },
}

// ============================================================
// HELPERS
// ============================================================
const fmtVND = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(v)

const fmtVNDShort = (v: number) => {
    if (Math.abs(v) >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} tỷ`
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} tr`
    return fmtVND(v)
}

// ============================================================
// LOGIC: XÁC ĐỊNH VÙNG ĐẤT TÀI CHÍNH
// ============================================================
type Zone = "hoang-vu" | "kiem-soat" | "phat-trien" | "binh-an"

function getFinancialZone(netWorth: number, debtRatio: number, hasInvestment: boolean, emergencyMonths: number): Zone {
    if (netWorth < 0 || emergencyMonths < 2) return "hoang-vu"
    if (netWorth >= 0 && debtRatio > 50) return "kiem-soat"
    if (netWorth >= 0 && debtRatio <= 50 && hasInvestment) {
        if (debtRatio < 20) return "binh-an"
        return "phat-trien"
    }
    return "kiem-soat"
}

const ZONES: Record<Zone, { label: string; emoji: string; color: string; ring: string; bg: string; desc: string }> = {
    "hoang-vu": {
        label: "Vùng Hoang Vu",
        emoji: "🔴",
        color: "text-rose-700",
        ring: "ring-rose-300",
        bg: "bg-rose-50",
        desc: "Bạn đang đối mặt với áp lực tài chính. Mảnh vườn cần được dọn dẹp trước khi gieo hạt.",
    },
    "kiem-soat": {
        label: "Vùng Kiểm Soát",
        emoji: "🟡",
        color: "text-amber-700",
        ring: "ring-amber-300",
        bg: "bg-amber-50",
        desc: "Bạn đã dọn được nửa mảnh vườn. Đang trên đà kiểm soát — phía trước là những hạt mầm xanh.",
    },
    "phat-trien": {
        label: "Vùng Phát Triển",
        emoji: "🟢",
        color: "text-emerald-700",
        ring: "ring-emerald-300",
        bg: "bg-emerald-50",
        desc: "Cỗ máy tài chính đang hoạt động. Bạn đang gieo trồng và thu hoạch từng ngày.",
    },
    "binh-an": {
        label: "Vùng Bình An",
        emoji: "✨",
        color: "text-teal-700",
        ring: "ring-teal-300",
        bg: "bg-teal-50",
        desc: "Tài chính tự thân — vốn tài chính đang làm việc thay vốn con người. Bạn đã đến đây.",
    },
}

const ZONE_ORDER: Zone[] = ["hoang-vu", "kiem-soat", "phat-trien", "binh-an"]

// ============================================================
// LOGIC: GỢI Ý HÀNH ĐỘNG
// ============================================================
function getRecommendations(
    debtRatio: number,
    emergencyMonths: number,
    protectionRatio: number,
    investRatio: number,
    pyfRate: number,
): { icon: string; title: string; detail: string; cta: string }[] {
    const recs = []

    if (emergencyMonths < 3) {
        recs.push({
            icon: "🛡️",
            title: "Xây Hầm Trú Ẩn",
            detail: `Quỹ khẩn cấp hiện đủ ${emergencyMonths.toFixed(1)} tháng — cần đạt tối thiểu 6 tháng chi tiêu.`,
            cta: "Ưu tiên 1",
        })
    }
    if (debtRatio > 50) {
        recs.push({
            icon: "🪨",
            title: "Dọn Sỏi Nợ Xấu",
            detail: `Tỷ lệ nợ đang ở ${debtRatio.toFixed(0)}% — trên ngưỡng an toàn 40%. Dùng phương pháp Snowball để thoát nhanh.`,
            cta: "Ưu tiên 2",
        })
    }
    if (protectionRatio < 5) {
        recs.push({
            icon: "🧥",
            title: "Mặc Áo Giáp Bảo Hiểm",
            detail: "Tài sản bảo vệ chiếm dưới 5% danh mục. Rà soát bảo hiểm sức khỏe và bảo hiểm nhân thọ.",
            cta: "Ưu tiên 3",
        })
    }
    if (pyfRate < 20 && recs.length < 3) {
        recs.push({
            icon: "🌱",
            title: "Tăng Tỷ Lệ PYF",
            detail: `Bạn đang gieo ${pyfRate.toFixed(0)}% thu nhập. Đặt mục tiêu đạt 20% để lãi kép phát huy sức mạnh.`,
            cta: "Quan trọng",
        })
    }
    if (recs.length === 0) {
        recs.push({
            icon: "🍃",
            title: "Tối Ưu Phân Bổ",
            detail: "Nền tảng tài chính đã vững. Xem xét tái cân bằng danh mục đầu tư theo công thức 100 - Tuổi.",
            cta: "Cải tiến",
        })
    }
    return recs.slice(0, 3)
}

// ============================================================
// HEALTH INDICATOR COMPONENT
// ============================================================
function HealthIndicator({
    label, value, unit, target, status, note, delay = 0,
}: {
    label: string; value: number | string; unit?: string; target: string
    status: "good" | "warn" | "danger"; note: string; delay?: number
}) {
    const statusCfg = {
        good: { color: "text-emerald-700", bg: "bg-emerald-500", trackBg: "bg-emerald-100", badge: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
        warn: { color: "text-amber-700", bg: "bg-amber-400", trackBg: "bg-amber-100", badge: "bg-amber-100 text-amber-700", icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
        danger: { color: "text-rose-700", bg: "bg-rose-400", trackBg: "bg-rose-100", badge: "bg-rose-100 text-rose-700", icon: <AlertCircle className="w-4 h-4 text-rose-600" /> },
    }[status]

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide leading-tight">{label}</p>
                {statusCfg.icon}
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${statusCfg.color}`}>{value}</span>
                {unit && <span className="text-sm text-slate-500">{unit}</span>}
            </div>
            <div className={`w-full h-1.5 rounded-full ${statusCfg.trackBg}`}>
                <div className={`h-1.5 rounded-full ${statusCfg.bg}`} style={{ width: status === "good" ? "85%" : status === "warn" ? "50%" : "20%" }} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{note}</p>
            <p className="text-[10px] text-slate-400">Ngưỡng lành mạnh: {target}</p>
        </motion.div>
    )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function PortfolioReview({ userId }: { userId: string }) {
    const supabase = createClient()
    const [assets, setAssets] = useState<Asset[]>([])
    const [cashflow, setCashflow] = useState<Cashflow | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAll()
        const sub = supabase
            .channel("portfolio_realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "client_assets", filter: `user_id=eq.${userId}` }, fetchAll)
            .on("postgres_changes", { event: "*", schema: "public", table: "client_cashflow", filter: `user_id=eq.${userId}` }, fetchAll)
            .subscribe()
        return () => { supabase.removeChannel(sub) }
    }, [userId])

    const fetchAll = async () => {
        setIsLoading(true)
        const [assetsRes, cashRes] = await Promise.all([
            supabase.from("client_assets").select("*").eq("user_id", userId).order("created_at"),
            supabase.from("client_cashflow").select("*").eq("user_id", userId).single(),
        ])
        if (assetsRes.data) setAssets(assetsRes.data)
        if (cashRes.data) setCashflow(cashRes.data)
        setIsLoading(false)
    }

    // -------------------------------------------------------
    // DATA AGGREGATION
    // -------------------------------------------------------
    const computed = useMemo(() => {
        let totalAssets = 0, totalLiabilities = 0
        let protection = 0, liquidity = 0, investment = 0, consumption = 0

        assets.forEach(a => {
            const val = Number(a.amount) || 0
            if (a.asset_group === GROUP.DEBT) {
                totalLiabilities += val
            } else {
                totalAssets += val
                if (a.asset_group === GROUP.PROTECTION) protection += val
                if (a.asset_group === GROUP.LIQUIDITY) liquidity += val
                if (a.asset_group === GROUP.INVESTMENT) investment += val
                if (a.asset_group === GROUP.CONSUMPTION) consumption += val
            }
        })

        const netWorth = totalAssets - totalLiabilities
        const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0
        const protectionRatio = totalAssets > 0 ? (protection / totalAssets) * 100 : 0
        const investRatio = totalAssets > 0 ? (investment / totalAssets) * 100 : 0

        const monthlyExpense = cashflow ? cashflow.annual_expense / 12 : 0
        const emergencyMonths = monthlyExpense > 0 ? liquidity / monthlyExpense : 0

        const annualIncome = cashflow?.annual_income || 0
        const annualSaving = cashflow?.annual_saving || 0
        const pyfRate = annualIncome > 0 ? (annualSaving / annualIncome) * 100 : 0

        const hasInvestment = investment > 0
        const zone = getFinancialZone(netWorth, debtRatio, hasInvestment, emergencyMonths)
        const recommendations = getRecommendations(debtRatio, emergencyMonths, protectionRatio, investRatio, pyfRate)

        // Nhóm tài sản cho danh sách
        const groupedAssets = assets.reduce((acc, a) => {
            const key = a.asset_group
            if (!acc[key]) acc[key] = []
            acc[key].push(a)
            return acc
        }, {} as Record<string, Asset[]>)

        // Pyramid data
        const pyramid = {
            protection,
            liquidity,
            coreInvest: assets.filter(a => a.asset_group === GROUP.INVESTMENT && a.risk_level <= 3).reduce((s, a) => s + Number(a.amount || 0), 0),
            growthInvest: assets.filter(a => a.asset_group === GROUP.INVESTMENT && a.risk_level >= 4).reduce((s, a) => s + Number(a.amount || 0), 0),
        }

        return {
            totalAssets, totalLiabilities, netWorth, debtRatio,
            protection, liquidity, investment, consumption,
            protectionRatio, investRatio, emergencyMonths, pyfRate,
            annualIncome, zone, recommendations, groupedAssets, pyramid,
        }
    }, [assets, cashflow])

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 animate-pulse bg-slate-100 rounded-2xl" />
                ))}
            </div>
        )
    }

    const zone = ZONES[computed.zone]
    const zoneIndex = ZONE_ORDER.indexOf(computed.zone)

    return (
        <div className="space-y-10 animate-in fade-in duration-500 p-1">

            {/* ===================================================
                VÙNG 1: BẢN ĐỒ VỊ TRÍ TÀI CHÍNH
            =================================================== */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-800">Tôi Đang Đứng Ở Đâu?</h2>
                </div>

                <div className={`rounded-2xl p-6 ring-2 ${zone.ring} ${zone.bg} mb-4`}>
                    <p className="text-sm text-slate-600 mb-1 font-medium">Vùng đất hiện tại của bạn</p>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{zone.emoji}</span>
                        <div>
                            <p className={`text-xl font-bold ${zone.color}`}>{zone.label}</p>
                            <p className="text-sm text-slate-600 mt-1">{zone.desc}</p>
                        </div>
                    </div>
                </div>

                {/* Journey bar */}
                <div className="grid grid-cols-4 gap-2">
                    {ZONE_ORDER.map((z, i) => {
                        const zd = ZONES[z]
                        const isActive = i === zoneIndex
                        const isPast = i < zoneIndex
                        return (
                            <div key={z} className={`rounded-xl p-3 text-center border transition-all ${isActive ? `ring-2 ${zd.ring} ${zd.bg}` : isPast ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100 opacity-50"}`}>
                                <p className="text-lg">{zd.emoji}</p>
                                <p className={`text-xs font-semibold mt-1 ${isActive ? zd.color : "text-slate-500"}`}>{zd.label}</p>
                            </div>
                        )
                    })}
                </div>
            </motion.section>

            {/* ===================================================
                VÙNG 2: 5 CHỈ SỐ SINH TỒN
            =================================================== */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <HeartPulse className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-800">Xét Nghiệm Sức Khỏe Tài Chính</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <HealthIndicator
                        delay={0.0} label="Tài Sản Ròng"
                        value={fmtVNDShort(computed.netWorth)}
                        target="> 0 và tăng dần"
                        status={computed.netWorth > 0 ? "good" : "danger"}
                        note={computed.netWorth >= 0 ? "Gốc rễ đang vươn sâu vào đất." : "Hầm rễ chưa chạm đất — bắt đầu từ hôm nay."}
                    />
                    <HealthIndicator
                        delay={0.08} label="Tỷ Lệ Nợ"
                        value={`${computed.debtRatio.toFixed(0)}%`}
                        target="< 40%"
                        status={computed.debtRatio < 40 ? "good" : computed.debtRatio < 60 ? "warn" : "danger"}
                        note={computed.debtRatio < 40 ? "Gánh nặng nhẹ nhàng." : computed.debtRatio < 60 ? "Cần dọn bớt sỏi nợ." : "Hố đen đang kéo ngược — ưu tiên dọn dẹp."}
                    />
                    <HealthIndicator
                        delay={0.16} label="Quỹ Khẩn Cấp"
                        value={computed.emergencyMonths > 0 ? computed.emergencyMonths.toFixed(1) : "—"}
                        unit={computed.emergencyMonths > 0 ? "tháng" : ""}
                        target="≥ 6 tháng chi tiêu"
                        status={computed.emergencyMonths >= 6 ? "good" : computed.emergencyMonths >= 3 ? "warn" : "danger"}
                        note={computed.emergencyMonths >= 6 ? "Hầm trú ẩn đã vững chắc." : computed.emergencyMonths > 0 ? "Hầm đang xây — cần thêm đồ dự phòng." : "Chưa có dữ liệu chi tiêu hàng năm."}
                    />
                    <HealthIndicator
                        delay={0.24} label="Tỷ Lệ Bảo Vệ"
                        value={`${computed.protectionRatio.toFixed(0)}%`}
                        target="10–20% Tổng Tài Sản"
                        status={computed.protectionRatio >= 10 ? "good" : computed.protectionRatio >= 5 ? "warn" : "danger"}
                        note={computed.protectionRatio >= 10 ? "Áo giáp đang mặc vừa vặn." : "Cần kiểm tra lại bảo hiểm sức khỏe & nhân thọ."}
                    />
                    <HealthIndicator
                        delay={0.32} label="Tỷ Lệ PYF"
                        value={`${computed.pyfRate.toFixed(0)}%`}
                        unit="tiết kiệm"
                        target="≥ 20% Thu Nhập"
                        status={computed.pyfRate >= 20 ? "good" : computed.pyfRate >= 10 ? "warn" : "danger"}
                        note={computed.pyfRate >= 20 ? "Gieo hạt đều đặn — lãi kép đang âm thầm làm việc." : computed.pyfRate > 0 ? "Đã có hạt mầm, cần tăng thêm." : "Chưa có dữ liệu thu nhập."}
                    />
                </div>
            </section>

            {/* ===================================================
                VÙNG 3: CƠ CẤU TÀI SẢN — THÁP SINH MỆNH
            =================================================== */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-800">Cơ Cấu Tài Sản — Tháp Sinh Mệnh</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tháp 4 tầng */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <p className="text-xs text-slate-500 mb-6 font-medium">Cấu trúc từ Gốc Rễ (Móng) lên Tán Lá (Tăng Trưởng)</p>
                        <div className="flex flex-col items-center gap-1.5 w-full">
                            {/* Tầng 4 - Tăng trưởng */}
                            <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4 }}
                                className="w-1/4 min-w-[90px] h-14 bg-gradient-to-br from-rose-400 to-rose-300 rounded-t-2xl flex flex-col items-center justify-center text-white shadow relative group cursor-pointer hover:w-1/3 transition-all duration-300">
                                <Flame className="w-3.5 h-3.5 mb-0.5" />
                                <span className="text-[10px] font-semibold">Tăng Trưởng</span>
                                <span className="text-[10px] opacity-90">{fmtVNDShort(computed.pyramid.growthInvest)}</span>
                                <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs p-2 rounded -top-10 whitespace-nowrap z-10 transition-opacity">
                                    Đầu tư rủi ro cao (Lvl 4–5)
                                </div>
                            </motion.div>
                            {/* Tầng 3 - Lõi đầu tư */}
                            <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.3 }}
                                className="w-2/4 h-14 bg-gradient-to-br from-emerald-500 to-emerald-400 flex flex-col items-center justify-center text-white shadow relative group cursor-pointer hover:w-7/12 transition-all duration-300">
                                <Sprout className="w-3.5 h-3.5 mb-0.5" />
                                <span className="text-[10px] font-semibold">Lõi Đầu Tư</span>
                                <span className="text-[10px] opacity-90">{fmtVNDShort(computed.pyramid.coreInvest)}</span>
                                <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs p-2 rounded -top-10 whitespace-nowrap z-10 transition-opacity">
                                    Tài sản sinh lời ổn định (Lvl 1–3)
                                </div>
                            </motion.div>
                            {/* Tầng 2 - Thanh khoản */}
                            <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2 }}
                                className="w-3/4 h-14 bg-gradient-to-br from-sky-500 to-sky-400 flex flex-col items-center justify-center text-white shadow relative group cursor-pointer hover:w-5/6 transition-all duration-300">
                                <Droplets className="w-3.5 h-3.5 mb-0.5" />
                                <span className="text-[10px] font-semibold">Thanh Khoản</span>
                                <span className="text-[10px] opacity-90">{fmtVNDShort(computed.pyramid.liquidity)}</span>
                            </motion.div>
                            {/* Tầng 1 - Bảo vệ (nền móng) */}
                            <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.1 }}
                                className="w-full h-14 bg-gradient-to-br from-slate-700 to-slate-600 rounded-b-2xl flex flex-col items-center justify-center text-white shadow-md relative group cursor-pointer hover:scale-[1.01] transition-all duration-300">
                                <ShieldCheck className="w-3.5 h-3.5 mb-0.5" />
                                <span className="text-[10px] font-semibold">Dự Phòng & Bảo Vệ</span>
                                <span className="text-[10px] opacity-90">{fmtVNDShort(computed.pyramid.protection)}</span>
                            </motion.div>
                        </div>

                        {/* Net Worth summary */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-500">Tổng Tài Sản</p>
                                <p className="text-sm font-bold text-emerald-700">{fmtVND(computed.totalAssets)}</p>
                            </div>
                            <Minus className="w-4 h-4 text-slate-300" />
                            <div>
                                <p className="text-xs text-slate-500">Tổng Nợ</p>
                                <p className="text-sm font-bold text-rose-600">{fmtVND(computed.totalLiabilities)}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Tài Sản Ròng</p>
                                <p className={`text-sm font-bold ${computed.netWorth >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                    {fmtVND(computed.netWorth)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách tài sản nhóm theo loại */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 overflow-y-auto max-h-[480px]">
                        <p className="text-xs text-slate-500 font-medium">Chi Tiết Từng Hạng Mục</p>
                        {Object.entries(GROUP_STYLE)
                            .filter(([g]) => computed.groupedAssets[g] && computed.groupedAssets[g].length > 0)
                            .map(([group, style]) => (
                                <div key={group}>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${style.bg} mb-2`}>
                                        <span className={style.color}>{style.icon}</span>
                                        <span className={`text-xs font-bold ${style.color}`}>{group}</span>
                                    </div>
                                    <div className="space-y-1.5 pl-1">
                                        {computed.groupedAssets[group].map(a => (
                                            <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-700">{a.asset_name}</p>
                                                    {a.risk_level > 0 && a.asset_group !== GROUP.DEBT && (
                                                        <p className="text-[10px] text-slate-400">Rủi ro Lvl {a.risk_level}</p>
                                                    )}
                                                </div>
                                                <span className={`text-xs font-bold ${group === GROUP.DEBT ? "text-rose-600" : "text-slate-800"}`}>
                                                    {group === GROUP.DEBT ? "-" : ""}{fmtVND(Number(a.amount))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        {assets.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-8">Chưa có tài sản nào được khai báo</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ===================================================
                VÙNG 4: SỨC KHỎE DÒNG TIỀN
            =================================================== */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-800">Sức Khỏe Dòng Tiền</h2>
                </div>

                {cashflow ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                        {/* Thu / Chi cân bằng */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Thu Nhập Hàng Năm</span>
                                    <span className="font-bold text-emerald-700">{fmtVND(cashflow.annual_income)}</span>
                                </div>
                                <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.2 }}
                                        className="h-full bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-amber-500" /> Chi Tiêu Hàng Năm</span>
                                    <span className="font-bold text-amber-700">{fmtVND(cashflow.annual_expense)}</span>
                                </div>
                                <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cashflow.annual_expense / cashflow.annual_income) * 100, 100)}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="h-full bg-amber-400 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* PYF Meter */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-xs font-bold text-slate-700">🌱 Đồng Hồ PYF — Trả Cho Mình Trước</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Tỷ lệ Thu Nhập đang được Gieo Hạt mỗi năm</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${computed.pyfRate >= 20 ? "text-emerald-600" : computed.pyfRate >= 10 ? "text-amber-600" : "text-rose-600"}`}>
                                        {computed.pyfRate.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(computed.pyfRate, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className={`h-full rounded-full ${computed.pyfRate >= 20 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : computed.pyfRate >= 10 ? "bg-gradient-to-r from-amber-300 to-amber-500" : "bg-gradient-to-r from-rose-300 to-rose-500"}`}
                                />
                                {/* Mốc 20% */}
                                <div className="absolute top-0 bottom-0 border-l-2 border-white/70 border-dashed" style={{ left: "20%" }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>0%</span>
                                <span className="text-emerald-600 font-medium">↑ Mục tiêu 20%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        {/* Tiết kiệm thực tế */}
                        <div className="flex gap-4 pt-2 border-t border-slate-100">
                            <div className="flex-1 bg-emerald-50 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-600 font-semibold mb-1">💰 Tiết Kiệm Mục Tiêu / Năm</p>
                                <p className="text-sm font-bold text-emerald-800">{fmtVND(cashflow.annual_saving)}</p>
                            </div>
                            <div className="flex-1 bg-sky-50 rounded-xl p-3">
                                <p className="text-[10px] text-sky-600 font-semibold mb-1">📈 Dòng Tiền Còn Lại / Năm</p>
                                <p className="text-sm font-bold text-sky-800">{fmtVND(cashflow.annual_income - cashflow.annual_expense)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                        <p className="text-slate-400 text-sm">Chưa có dữ liệu dòng tiền.</p>
                        <p className="text-slate-400 text-xs mt-1">Khai báo Thu nhập & Chi phí ở tab "Tài sản & Dòng tiền" để mở rộng vùng này.</p>
                    </div>
                )}
            </section>

            {/* ===================================================
                VÙNG 5: GỢI Ý HÀNH ĐỘNG
            =================================================== */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-800">Bước Tiếp Theo — Ưu Tiên Hành Động</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {computed.recommendations.map((rec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between">
                                <span className="text-2xl">{rec.icon}</span>
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{rec.cta}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{rec.title}</p>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1">{rec.detail}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-auto group-hover:gap-2 p-0 h-auto justify-start hover:bg-transparent"
                                onClick={() => document.querySelector<HTMLElement>('[role="tab"][value="scenarios"]')?.click()}
                            >
                                Lên kế hoạch <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Chú thích triết lý */}
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                    <p className="text-xs text-emerald-800 leading-relaxed italic">
                        🌿 <strong>Nhắc nhở từ Bình An Tài Chính:</strong> Bạn không cần đợi đến khi có 5 tỷ mới hạnh phúc.
                        Ngay khoảnh khắc bạn biết mình đang đứng ở đâu, và chọn một hành động nhỏ hôm nay —
                        bạn đã bước vào Vùng Đất Bình An rồi.
                    </p>
                </div>
            </motion.section>
        </div>
    )
}
