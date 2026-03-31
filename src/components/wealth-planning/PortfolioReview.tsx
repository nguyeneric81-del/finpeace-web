"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion } from "framer-motion"
import {
    ShieldCheck, Droplets, Sprout, Flame, AlertCircle,
    TrendingUp, TrendingDown, Minus, MapPin, HeartPulse,
    Layers, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Zap, Brain, Crosshair
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
    monthly_debt_payment?: number
    passive_income?: number
}

// ============================================================
// CONSTANTS
// ============================================================
const GROUP = {
    DEBT: "Nợ",
    LIQUIDITY: "Thanh Khoản",
    PROTECTION: "Bảo Vệ",
    INVESTMENT: "Đầu Tư",
    CONSUMPTION: "Tiêu Dùng",
}

const GROUP_STYLE: Record<string, { color: string; bg: string; glow: string; icon: React.ReactNode }> = {
    "Bảo Vệ": { color: "text-slate-200", bg: "bg-slate-700/50", glow: "shadow-slate-500/20", icon: <ShieldCheck className="w-4 h-4" /> },
    "Thanh Khoản": { color: "text-sky-300", bg: "bg-sky-500/15", glow: "shadow-sky-500/20", icon: <Droplets className="w-4 h-4" /> },
    "Đầu Tư": { color: "text-emerald-300", bg: "bg-emerald-500/15", glow: "shadow-emerald-500/20", icon: <Sprout className="w-4 h-4" /> },
    "Tiêu Dùng": { color: "text-amber-300", bg: "bg-amber-500/15", glow: "shadow-amber-500/20", icon: <Layers className="w-4 h-4" /> },
    "Nợ": { color: "text-rose-300", bg: "bg-rose-500/15", glow: "shadow-rose-500/20", icon: <Flame className="w-4 h-4" /> },
}

// ============================================================
// HELPERS
// ============================================================
const fmtVND = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(v)

const fmtVNDShort = (v: number) => {
    if (Math.abs(v) >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(0)} Tr`
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

const ZONES: Record<Zone, {
    label: string; icon: React.ReactNode; gradient: string; glow: string;
    badgeBg: string; badgeText: string; desc: string; ringColor: string
}> = {
    "hoang-vu": {
        label: "Vùng Hoang Vu",
        icon: <Flame className="w-6 h-6" />,
        gradient: "from-rose-600/30 via-rose-500/10 to-transparent",
        glow: "shadow-rose-500/30",
        badgeBg: "bg-rose-500/20", badgeText: "text-rose-300",
        ringColor: "ring-rose-500/40",
        desc: "Bạn đang đối mặt với áp lực tài chính. Mảnh vườn cần được dọn dẹp trước khi gieo hạt.",
    },
    "kiem-soat": {
        label: "Vùng Kiểm Soát",
        icon: <AlertCircle className="w-6 h-6" />,
        gradient: "from-amber-500/30 via-amber-400/10 to-transparent",
        glow: "shadow-amber-500/30",
        badgeBg: "bg-amber-500/20", badgeText: "text-amber-300",
        ringColor: "ring-amber-500/40",
        desc: "Bạn đã dọn được nửa mảnh vườn. Đang trên đà kiểm soát — phía trước là những hạt mầm xanh.",
    },
    "phat-trien": {
        label: "Vùng Phát Triển",
        icon: <Sprout className="w-6 h-6" />,
        gradient: "from-emerald-600/30 via-emerald-500/10 to-transparent",
        glow: "shadow-emerald-500/30",
        badgeBg: "bg-emerald-500/20", badgeText: "text-emerald-300",
        ringColor: "ring-emerald-500/40",
        desc: "Cỗ máy tài chính đang hoạt động. Bạn đang gieo trồng và thu hoạch từng ngày.",
    },
    "binh-an": {
        label: "Vùng Bình An",
        icon: <Sparkles className="w-6 h-6" />,
        gradient: "from-violet-600/30 via-teal-500/10 to-transparent",
        glow: "shadow-violet-500/30",
        badgeBg: "bg-violet-500/20", badgeText: "text-violet-300",
        ringColor: "ring-violet-500/40",
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
): { icon: React.ReactNode; title: string; detail: string; cta: string; color: string }[] {
    const recs = []
    if (emergencyMonths < 3) {
        recs.push({
            icon: <ShieldCheck className="w-5 h-5" />, title: "Xây Hầm Trú Ẩn",
            detail: `Quỹ khẩn cấp hiện đủ ${emergencyMonths.toFixed(1)} tháng — cần đạt tối thiểu 6 tháng chi tiêu.`,
            cta: "Ưu tiên 1", color: "from-sky-500/20 to-sky-600/5 border-sky-500/20",
        })
    }
    if (debtRatio > 50) {
        recs.push({
            icon: <TrendingDown className="w-5 h-5" />, title: "Dọn Sỏi Nợ Xấu",
            detail: `Tỷ lệ nợ đang ở ${debtRatio.toFixed(0)}% — trên ngưỡng an toàn 40%.`,
            cta: "Ưu tiên 2", color: "from-rose-500/20 to-rose-600/5 border-rose-500/20",
        })
    }
    if (protectionRatio < 5) {
        recs.push({
            icon: <ShieldCheck className="w-5 h-5" />, title: "Mặc Áo Giáp Bảo Hiểm",
            detail: "Tài sản bảo vệ chiếm dưới 5% danh mục. Rà soát bảo hiểm sức khỏe và nhân thọ.",
            cta: "Ưu tiên 3", color: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
        })
    }
    if (pyfRate < 20 && recs.length < 3) {
        recs.push({
            icon: <Sprout className="w-5 h-5" />, title: "Tăng Tỷ Lệ PYF",
            detail: `Bạn đang gieo ${pyfRate.toFixed(0)}% thu nhập. Đặt mục tiêu đạt 20% để lãi kép phát huy.`,
            cta: "Quan trọng", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
        })
    }
    if (recs.length === 0) {
        recs.push({
            icon: <Zap className="w-5 h-5" />, title: "Tối Ưu Phân Bổ",
            detail: "Nền tảng tài chính đã vững. Xem xét tái cân bằng danh mục theo công thức 100 - Tuổi.",
            cta: "Cải tiến", color: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
        })
    }
    return recs.slice(0, 3)
}

// ============================================================
// HEALTH INDICATOR COMPONENT
// ============================================================
function HealthCard({
    label, value, unit, target, status, note, delay = 0, gradient
}: {
    label: string; value: number | string; unit?: string; target: string
    status: "good" | "warn" | "danger"; note: string; delay?: number; gradient: string
}) {
    const cfg = {
        good: { bar: "bg-emerald-400", glow: "shadow-emerald-500/30", text: "text-emerald-300", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
        warn: { bar: "bg-amber-400", glow: "shadow-amber-500/30", text: "text-amber-300", icon: <AlertCircle className="w-4 h-4 text-amber-400" /> },
        danger: { bar: "bg-rose-400", glow: "shadow-rose-500/30", text: "text-rose-300", icon: <AlertCircle className="w-4 h-4 text-rose-400" /> },
    }[status]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} backdrop-blur border border-white/10 shadow-lg ${cfg.glow} hover:-translate-y-1 transition-all duration-300 cursor-default`}
        >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -mr-6 -mt-6" />
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</p>
                {cfg.icon}
            </div>
            <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-2xl font-black ${cfg.text}`}>{value}</span>
                {unit && <span className="text-sm text-white/40">{unit}</span>}
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 mb-3">
                <motion.div
                    initial={{ width: 0 }} animate={{ width: status === "good" ? "85%" : status === "warn" ? "50%" : "20%" }}
                    transition={{ duration: 0.8, delay: delay + 0.2 }}
                    className={`h-1 rounded-full ${cfg.bar}`}
                />
            </div>
            <p className="text-xs text-white/60 leading-relaxed">{note}</p>
            <p className="text-[10px] text-white/30 mt-1">Ngưỡng: {target}</p>
        </motion.div>
    )
}

// ============================================================
// PROTECTION DASHBOARD COMPONENT (Persona Engine Output)
// ============================================================
function ProtectionDashboard({ data }: { data: any }) {
    if (!data || data.error) return <div className="text-center py-10 text-white/50">Đang tải cấu trúc bảo vệ...</div>
    
    const {
        grossSA, netSA, saRounded, eliteTier, eliteBenefits,
        personaBreakdown, bestPersona, recommendedProduct,
        financialMetrics
    } = data

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Persona Match */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mt-20"></div>
                <div className="relative z-10 w-full md:w-2/3">
                    <div className="flex items-center gap-2 mb-2 text-indigo-300">
                        <Brain className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Mô Hình Dữ Liệu AIA HNW · Chân Dung Tối Ưu</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">{bestPersona}</h2>
                    <p className="text-white/60 mb-6 text-sm">Thuật toán Persona Engine phân tích các yếu tố tâm lý, rủi ro, và di sản để khớp chân dung cá tính của bạn với gói bảo vệ phù hợp nhất.</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(personaBreakdown).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3).map(([key, score]: [string, any], idx) => (
                            <div key={key} className={`p-3 rounded-xl border ${idx === 0 ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-white/5 border-white/10'}`}>
                                <div className="text-[10px] text-white/50 uppercase truncate mb-1">{key}</div>
                                <div className={`text-xl font-bold ${idx === 0 ? 'text-indigo-400' : 'text-white/80'}`}>{score} đ</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="relative z-10 bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-5 md:w-1/3 text-center shrink-0">
                    <p className="text-xs text-white/50 uppercase mb-2">Đề Xuất Phân Bổ Kiến Trúc</p>
                    <p className="text-2xl font-bold text-emerald-400 mb-2">{recommendedProduct}</p>
                    <p className="text-xs text-white/40">Giải pháp khớp nhất với phân bố rủi ro & khát vọng di sản của {bestPersona}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Needs-Based Analysis (Gross SA Waterfall) */}
                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Crosshair className="w-5 h-5 text-sky-400" />
                        <h3 className="text-lg font-bold text-white">Needs-Based Analysis (Gap Protection)</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <div>
                                <p className="text-xs text-white/50 mb-1">Thanh toán Nợ (Kinh doanh & Cá nhân)</p>
                                <p className="text-sm font-semibold text-rose-300">{fmtVNDShort(financialMetrics.totalDebt)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50 mb-1">Bảo lãnh sống (10 năm)</p>
                                <p className="text-sm font-semibold text-amber-300">{fmtVNDShort(financialMetrics.annualExpense * 10)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <div>
                                <p className="text-xs text-white/50 mb-1">Quỹ bảo lãnh Y Tế (Reserve)</p>
                                <p className="text-sm font-semibold text-teal-300">2.0 Tỷ (Ước tính Elite)</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50 mb-1">Truyền thừa di sản (40% Tài sản)</p>
                                <p className="text-sm font-semibold text-violet-300">{fmtVNDShort(financialMetrics.totalAssetValue * 0.4)}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 my-4"></div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-white/50">TỔNG NHU CẦU BẢO VỆ (Gross SA)</p>
                                <p className="text-2xl font-bold text-white mt-1">{fmtVNDShort(grossSA)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50">ĐÃ CÓ (Trừ đi)</p>
                                <p className="text-lg font-bold text-emerald-400 mt-1">- {fmtVNDShort(financialMetrics.totalLifeCoverage)}</p>
                            </div>
                        </div>

                        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mt-4 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/5 to-transparent animate-pulse"></div>
                            <p className="text-xs text-rose-300 font-bold tracking-wide uppercase">Cần thiết kế thêm (Net SA Gap)</p>
                            <p className="text-4xl font-black text-rose-400 mt-1">{fmtVNDShort(netSA)}</p>
                            <p className="text-[10px] text-rose-300/60 mt-2">Dựa trên chuẩn CFP: Đủ để xóa nợ, bảo bọc 10 năm sinh hoạt, quỹ y tế và cam kết di sản.</p>
                        </div>
                    </div>
                </div>

                {/* AIA Elite Tier Qualification */}
                <div className="bg-slate-800/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-bold text-white">Xếp Hạng AIA Elite Membership</h3>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-end gap-3 mb-6">
                            <div className="text-4xl font-black bg-gradient-to-r from-amber-200 to-amber-500 text-transparent bg-clip-text">
                                {eliteTier !== 'None' ? eliteTier : 'Tiêu chuẩn'}
                            </div>
                            <div className="text-sm text-white/50 pb-1">Dựa trên Mệnh giá thiết kế: <strong className="text-white">{fmtVNDShort(saRounded)}</strong> (Làm tròn)</div>
                        </div>

                        {eliteTier === 'None' ? (
                            <p className="text-slate-400 text-sm">Gói thiết kế dưới 4 Tỷ VND không áp dụng chuỗi đặc quyền HNW Elite Club. Nhưng vẫn tiếp cận chất lượng tư vấn chuẩn CFP.</p>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-amber-400 uppercase">Đặc Quyền Kèm Theo (Không thu phí)</p>
                                {eliteBenefits.map((b: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                        </div>
                                        <span className="text-sm text-amber-100">{b}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {saRounded < 40_000_000_000 && eliteTier !== 'None' && (
                            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-xs text-white/50 italic mb-2">Thăng hạng Elite kế tiếp: Cần thêm mức bảo vệ để chạm tới <strong className="text-white">{eliteTier === 'Elite Premier' ? '15 Tỷ' : '40 Tỷ'}</strong>.</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(saRounded / (eliteTier === 'Elite Premier' ? 15_000_000_000 : 40_000_000_000)) * 100}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================
// MAIN WRAPPER TABS
// ============================================================
export function PortfolioReview({ userId, onNavigateToScenarios }: { userId: string, onNavigateToScenarios?: () => void }) {
    const supabase = createClient()
    const [assets, setAssets] = useState<Asset[]>([])
    const [cashflow, setCashflow] = useState<Cashflow | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Tabs
    const [activeTab, setActiveTab] = useState<'overview' | 'protection'>('overview')
    const [personaData, setPersonaData] = useState<any>(null)

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
        const [assetsRes, cashRes, personaRes] = await Promise.all([
            supabase.from("client_assets").select("*").eq("user_id", userId).order("created_at"),
            supabase.from("client_cashflow").select("*").eq("user_id", userId).single(),
            // Fetch Persona Engine logic via Post
            fetch('/api/wealth/persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            }).then(r => r.json()).catch(() => null)
        ])
        if (assetsRes.data) setAssets(assetsRes.data)
        if (cashRes.data) setCashflow(cashRes.data)
        if (personaRes && !personaRes.error) setPersonaData(personaRes)
        setIsLoading(false)
    }

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
        const computedSaving = annualIncome > 0 && annualSaving === 0
            ? Math.max(0, annualIncome + (cashflow?.passive_income || 0) - (cashflow?.annual_expense || 0))
            : annualSaving
        const pyfRate = annualIncome > 0 ? (computedSaving / annualIncome) * 100 : 0
        const hasInvestment = investment > 0
        const zone = getFinancialZone(netWorth, debtRatio, hasInvestment, emergencyMonths)
        const recommendations = getRecommendations(debtRatio, emergencyMonths, protectionRatio, investRatio, pyfRate)

        const groupedAssets = assets.reduce((acc, a) => {
            const key = a.asset_group
            if (!acc[key]) acc[key] = []
            acc[key].push(a)
            return acc
        }, {} as Record<string, Asset[]>)

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
                    <div key={i} className="h-32 animate-pulse bg-white/5 rounded-2xl border border-white/10" />
                ))}
            </div>
        )
    }

    const zone = ZONES[computed.zone]
    const zoneIndex = ZONE_ORDER.indexOf(computed.zone)

    const healthCards = [
        {
            label: "Tài Sản Ròng", value: fmtVNDShort(computed.netWorth), unit: undefined,
            target: "> 0 và tăng dần",
            status: computed.netWorth > 0 ? "good" : "danger" as any,
            note: computed.netWorth >= 0 ? "Gốc rễ đang vươn sâu vào đất." : "Hầm rễ chưa chạm đất — bắt đầu từ hôm nay.",
            gradient: "from-emerald-900/60 via-emerald-800/20 to-slate-900/40",
        },
        {
            label: "Tỷ Lệ Nợ", value: `${computed.debtRatio.toFixed(0)}%`, unit: undefined,
            target: "< 35% (CFP)",
            status: computed.debtRatio < 35 ? "good" : computed.debtRatio < 50 ? "warn" : "danger" as any,
            note: computed.debtRatio < 35 ? "Gánh nặng nhẹ nhàng." : "Cần dọn bớt sỏi nợ.",
            gradient: "from-sky-900/60 via-sky-800/20 to-slate-900/40",
        },
        {
            label: "Quỹ Khẩn Cấp", value: computed.emergencyMonths > 0 ? computed.emergencyMonths.toFixed(1) : "—",
            unit: computed.emergencyMonths > 0 ? "tháng" : "",
            target: "≥ 6 tháng",
            status: computed.emergencyMonths >= 6 ? "good" : computed.emergencyMonths >= 3 ? "warn" : "danger" as any,
            note: computed.emergencyMonths >= 6 ? "Hầm trú ẩn đã vững chắc." : "Hầm đang xây — cần thêm đồ dự phòng.",
            gradient: "from-violet-900/60 via-violet-800/20 to-slate-900/40",
        },
        {
            label: "Tỷ Lệ Bảo Vệ", value: `${computed.protectionRatio.toFixed(0)}%`, unit: undefined,
            target: "10–20% Tổng TS",
            status: computed.protectionRatio >= 10 ? "good" : computed.protectionRatio >= 5 ? "warn" : "danger" as any,
            note: computed.protectionRatio >= 10 ? "Áo giáp đang mặc vừa vặn." : "Cần kiểm tra lại bảo hiểm.",
            gradient: "from-amber-900/60 via-amber-800/20 to-slate-900/40",
        },
        {
            label: "Tỷ Lệ PYF", value: `${computed.pyfRate.toFixed(0)}%`, unit: "tiết kiệm",
            target: "≥ 20% Thu Nhập",
            status: computed.pyfRate >= 20 ? "good" : computed.pyfRate >= 10 ? "warn" : "danger" as any,
            note: computed.pyfRate >= 20 ? "Gieo hạt đều đặn — lãi kép đang làm việc." : "Đã có hạt mầm, cần tăng thêm.",
            gradient: "from-rose-900/60 via-rose-800/20 to-slate-900/40",
        },
        {
            label: "Debt Service Ratio",
            value: (() => {
                const mdp = cashflow?.monthly_debt_payment
                const inc = cashflow?.annual_income
                if (mdp != null && inc != null && inc > 0) {
                    return `${(mdp * 12 / inc * 100).toFixed(0)}%`
                }
                return '—'
            })(),
            unit: undefined,
            target: "≤ 35% (CFP)",
            status: (() => {
                const mdp = cashflow?.monthly_debt_payment
                const inc = cashflow?.annual_income
                if (mdp != null && inc != null && inc > 0) {
                    const dsr = mdp * 12 / inc * 100
                    return dsr <= 35 ? 'good' : dsr <= 50 ? 'warn' : 'danger' as any
                }
                return 'good' as any  // no debt = good
            })(),
            note: cashflow?.monthly_debt_payment
                ? `Trả nợ ${fmtVNDShort(cashflow.monthly_debt_payment)}/tháng — DSR=${cashflow.annual_income > 0 ? (cashflow.monthly_debt_payment * 12 / cashflow.annual_income * 100).toFixed(0) : '?'}%`
                : 'Cập nhật dòng tiền để tính DSR.',
            gradient: "from-indigo-900/60 via-indigo-800/20 to-slate-900/40",
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-center mb-8">
                <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-white/10 shadow-lg">
                    <button onClick={() => setActiveTab('overview')} 
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <TrendingUp className="w-4 h-4" /> Tổng Quan Tài Sản
                    </button>
                    <button onClick={() => setActiveTab('protection')} 
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'protection' ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <ShieldCheck className="w-4 h-4" /> Giải Pháp Bảo Vệ
                    </button>
                </div>
            </div>

            {activeTab === 'protection' ? (
                <ProtectionDashboard data={personaData} />
            ) : (
                <div className="space-y-10 animate-in fade-in duration-500">
                    {/* ZONE HERO */}
                    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${zone.gradient} border border-white/10 backdrop-blur p-7 shadow-2xl ${zone.glow}`}>
                            {/* Glow orb */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/3 blur-2xl" />

                            <div className="relative flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-4 h-4 text-white/50" />
                                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Vị Trí Tài Chính Hiện Tại</span>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${zone.badgeBg} border border-white/10 mb-4`}>
                                        <span className={zone.badgeText}>{zone.icon}</span>
                                        <span className={`text-sm font-bold ${zone.badgeText}`}>{zone.label}</span>
                                    </div>
                                    <p className="text-white/70 text-sm max-w-lg leading-relaxed">{zone.desc}</p>
                                </div>
                                {/* Net Worth highlight */}
                                <div className="shrink-0 text-right">
                                    <p className="text-xs text-white/40 mb-1">Tài Sản Ròng</p>
                                    <p className={`text-3xl font-black ${computed.netWorth >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                                        {fmtVNDShort(computed.netWorth)}
                                    </p>
                                </div>
                            </div>

                            {/* Zone progress track */}
                            <div className="relative mt-6 grid grid-cols-4 gap-2">
                                {ZONE_ORDER.map((z, i) => {
                                    const zd = ZONES[z]
                                    const isActive = i === zoneIndex
                                    const isPast = i < zoneIndex
                                    return (
                                        <div key={z} className={`relative rounded-xl p-3 text-center border transition-all duration-300 ${isActive ? `ring-2 ${zd.ringColor} ${zd.badgeBg} border-white/20` : isPast ? "bg-white/5 border-white/10" : "bg-white/3 border-white/5 opacity-40"}`}>
                                            <div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center mb-1.5 ${isActive ? zd.badgeBg : "bg-white/10"}`}>
                                                <span className={`${isActive ? zd.badgeText : "text-white/30"} [&>svg]:w-3.5 [&>svg]:h-3.5`}>{zd.icon}</span>
                                            </div>
                                            <p className={`text-[10px] font-semibold ${isActive ? zd.badgeText : "text-white/30"}`}>{zd.label}</p>
                                            {isActive && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full ring-2 ring-slate-900" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.section>

                    {/* HEALTH INDICATORS */}
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <HeartPulse className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Xét Nghiệm Sức Khỏe Tài Chính</h2>
                                <p className="text-xs text-white/40">6 chỉ số sinh tồn — chuẩn CFP</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {healthCards.map((card, i) => (
                                <HealthCard key={card.label} {...card} delay={i * 0.08} />
                            ))}
                        </div>
                    </section>

                    {/* ASSET TOWER */}
                    <section>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Cơ Cấu Tài Sản — Tháp Sinh Mệnh</h2>
                                <p className="text-xs text-white/40">Từ Gốc Rễ lên Tán Lá</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pyramid */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur p-6 shadow-xl">
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-violet-500/5 blur-3xl" />
                                <p className="text-xs text-white/40 mb-6 font-medium">Cấu trúc từ Gốc Rễ (Móng) lên Tán Lá (Tăng Trưởng)</p>
                                <div className="flex flex-col items-center gap-1.5 w-full">
                                    <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4 }}
                                        className="w-1/4 min-w-[90px] h-14 bg-gradient-to-r from-rose-500 to-orange-500 rounded-t-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-rose-500/30 group cursor-pointer hover:w-1/3 transition-all duration-300 relative">
                                        <Flame className="w-3.5 h-3.5 mb-0.5" />
                                        <span className="text-[10px] font-bold">Tăng Trưởng</span>
                                        <span className="text-[10px] opacity-80">{fmtVNDShort(computed.pyramid.growthInvest)}</span>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.3 }}
                                        className="w-2/4 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/30 group cursor-pointer hover:w-7/12 transition-all duration-300 relative">
                                        <Sprout className="w-3.5 h-3.5 mb-0.5" />
                                        <span className="text-[10px] font-bold">Lõi Đầu Tư</span>
                                        <span className="text-[10px] opacity-80">{fmtVNDShort(computed.pyramid.coreInvest)}</span>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2 }}
                                        className="w-3/4 h-14 bg-gradient-to-r from-sky-500 to-blue-500 flex flex-col items-center justify-center text-white shadow-lg shadow-sky-500/30 group cursor-pointer hover:w-5/6 transition-all duration-300 relative">
                                        <Droplets className="w-3.5 h-3.5 mb-0.5" />
                                        <span className="text-[10px] font-bold">Thanh Khoản</span>
                                        <span className="text-[10px] opacity-80">{fmtVNDShort(computed.pyramid.liquidity)}</span>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.1 }}
                                        className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-b-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-violet-500/30 group cursor-pointer hover:scale-[1.01] transition-all duration-300">
                                        <ShieldCheck className="w-3.5 h-3.5 mb-0.5" />
                                        <span className="text-[10px] font-bold">Dự Phòng & Bảo Vệ</span>
                                        <span className="text-[10px] opacity-80">{fmtVNDShort(computed.pyramid.protection)}</span>
                                    </motion.div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-white/40">Tổng Tài Sản</p>
                                        <p className="text-sm font-bold text-emerald-400">{fmtVND(computed.totalAssets)}</p>
                                    </div>
                                    <Minus className="w-4 h-4 text-white/20" />
                                    <div>
                                        <p className="text-xs text-white/40">Tổng Nợ</p>
                                        <p className="text-sm font-bold text-rose-400">{fmtVND(computed.totalLiabilities)}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20" />
                                    <div className="text-right">
                                        <p className="text-xs text-white/40">Tài Sản Ròng</p>
                                        <p className={`text-sm font-bold ${computed.netWorth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                            {fmtVND(computed.netWorth)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Asset list */}
                            <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur p-6 space-y-4 overflow-y-auto max-h-[480px] shadow-xl">
                                <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Chi Tiết Từng Hạng Mục</p>
                                {Object.entries(GROUP_STYLE)
                                    .filter(([g]) => computed.groupedAssets[g] && computed.groupedAssets[g].length > 0)
                                    .map(([group, style]) => (
                                        <div key={group}>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${style.bg} mb-2 ${style.glow} shadow`}>
                                                <span className={style.color}>{style.icon}</span>
                                                <span className={`text-xs font-bold ${style.color}`}>{group}</span>
                                            </div>
                                            <div className="space-y-1.5 pl-1">
                                                {computed.groupedAssets[group].map(a => (
                                                    <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                                        <div>
                                                            <p className="text-xs font-medium text-white/80">{a.asset_name}</p>
                                                            {a.risk_level > 0 && a.asset_group !== GROUP.DEBT && (
                                                                <p className="text-[10px] text-white/30">Rủi ro Lvl {a.risk_level}</p>
                                                            )}
                                                        </div>
                                                        <span className={`text-xs font-bold ${group === GROUP.DEBT ? "text-rose-400" : "text-white/80"}`}>
                                                            {group === GROUP.DEBT ? "-" : ""}{fmtVND(Number(a.amount))}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>

                    {/* CASHFLOW */}
                    {cashflow && (
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                                    <Droplets className="w-4 h-4 text-sky-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white">Sức Khỏe Dòng Tiền</h2>
                                    <p className="text-xs text-white/40">Thu chi & tỷ lệ PYF</p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 backdrop-blur p-6 space-y-6 shadow-xl">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="flex items-center gap-1.5 text-white/50"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" />Thu Nhập / Năm</span>
                                            <span className="font-bold text-emerald-400">{fmtVND(cashflow.annual_income)}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.2 }}
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="flex items-center gap-1.5 text-white/50"><TrendingDown className="w-3.5 h-3.5 text-amber-400" />Chi Tiêu / Năm</span>
                                            <span className="font-bold text-amber-400">{fmtVND(cashflow.annual_expense)}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((cashflow.annual_expense / cashflow.annual_income) * 100, 100)}%` }}
                                                transition={{ duration: 0.8, delay: 0.3 }}
                                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <p className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                                                <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Đồng Hồ PYF — Trả Cho Mình Trước
                                            </p>
                                        </div>
                                        <span className={`text-2xl font-black ${computed.pyfRate >= 20 ? "text-emerald-400" : computed.pyfRate >= 10 ? "text-amber-400" : "text-rose-400"}`}>
                                            {computed.pyfRate.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(computed.pyfRate, 100)}%` }}
                                            transition={{ duration: 1, delay: 0.4 }}
                                            className={`h-full rounded-full ${computed.pyfRate >= 20 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : computed.pyfRate >= 10 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-rose-400 to-rose-600"}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* RECOMMENDATIONS */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white">Bước Tiếp Theo</h2>
                                    <p className="text-xs text-white/40">Ưu tiên hành động ngay</p>
                                </div>
                            </div>
                            {onNavigateToScenarios && (
                                <Button
                                    onClick={onNavigateToScenarios}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs px-4 py-2 h-auto rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
                                >
                                    Thiết Kế Tương Lai <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {computed.recommendations.map((rec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${rec.color} border backdrop-blur p-5 shadow-lg`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">{rec.icon}</div>
                                        <span className="text-[10px] font-bold bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{rec.cta}</span>
                                    </div>
                                    <p className="text-sm font-bold text-white mb-1">{rec.title}</p>
                                    <p className="text-xs text-white/60 leading-relaxed">{rec.detail}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            )}
        </div>
    )
}
