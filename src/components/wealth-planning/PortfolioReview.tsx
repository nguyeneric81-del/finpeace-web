"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, PiggyBank, Briefcase, TrendingUp, AlertTriangle, ArrowRight, Wallet } from "lucide-react"

// Types & Interfaces
interface Asset {
    id: string
    asset_group: string // 'Tiêu dùng', 'Thanh khoản', 'Bảo vệ', 'Đầu tư', 'Nợ'
    asset_name: string
    amount: number
    risk_level: number
}

const SUPABASE_ASSET_GROUPS = {
    DEBT: 'Nợ',
    LIQUIDITY: 'Thanh khoản',
    PROTECTION: 'Bảo vệ',
    INVESTMENT: 'Đầu tư',
    CONSUMPTION: 'Tiêu dùng'
}

// Design System Colors (Healing Theme)
const COLORS = {
    emerald: ['#059669', '#10b981', '#34d399', '#6ee7b7'], // Đầu tư, Thanh khoản
    rose: ['#e11d48', '#f43f5e', '#fb7185'], // Nợ, Rủi ro cao
    slate: ['#475569', '#64748b', '#94a3b8'], // Base
    amber: ['#d97706', '#f59e0b', '#fbbf24'] // Cảnh báo nhẹ
}

export function PortfolioReview({ userId }: { userId: string }) {
    const supabase = createClient()
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAssets()
        const subscription = supabase
            .channel('portfolio_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'client_assets', filter: `user_id=eq.${userId}` }, fetchAssets)
            .subscribe()
        return () => { supabase.removeChannel(subscription) }
    }, [userId])

    const fetchAssets = async () => {
        setIsLoading(true)
        const { data } = await supabase.from('client_assets').select('*').eq('user_id', userId).order('created_at', { ascending: true })
        if (data) setAssets(data)
        setIsLoading(false)
    }

    // --- 1. DATA AGGREGATION (Chuẩn bị số liệu) ---
    const { totalAssets, totalLiabilities, netWorth, allocationData, pyramidData } = useMemo(() => {
        let tA = 0, tL = 0
        const allocMap = new Map<string, number>()

        // Dữ liệu cho Tháp Tài Sản (Wealth Pyramid)
        const pyrData = {
            protection: 0, // Đáy 1
            savings: 0,    // Tầng 2 (Thanh khoản)
            core: 0,       // Tầng 3 (Đầu tư Rủi ro thấp 1-3)
            trading: 0     // Chóp (Đầu tư Rủi ro cao 4-5)
        }

        assets.forEach(a => {
            const val = Number(a.amount) || 0
            if (a.asset_group === SUPABASE_ASSET_GROUPS.DEBT) {
                tL += val
            } else {
                tA += val
                // Gom nhóm cho Biểu đồ Tròn
                const groupName = a.asset_group
                allocMap.set(groupName, (allocMap.get(groupName) || 0) + val)

                // Phân bổ Tháp Tài Sản
                if (groupName === SUPABASE_ASSET_GROUPS.PROTECTION) pyrData.protection += val
                if (groupName === SUPABASE_ASSET_GROUPS.LIQUIDITY) pyrData.savings += val
                if (groupName === SUPABASE_ASSET_GROUPS.INVESTMENT) {
                    if (a.risk_level >= 4) pyrData.trading += val
                    else pyrData.core += val
                }
            }
        })

        const formattedAlloc = Array.from(allocMap, ([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)

        return {
            totalAssets: tA,
            totalLiabilities: tL,
            netWorth: tA - tL,
            allocationData: formattedAlloc,
            pyramidData: pyrData
        }
    }, [assets])

    const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

    if (isLoading) return <div className="animate-pulse h-64 bg-slate-100 rounded-2xl"></div>

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Mục 1: Bảng Cân Đối Kế Toán Cá Nhân */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-slate-100 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-emerald-50/50">
                        <CardDescription className="flex items-center text-emerald-800 font-medium"><Wallet className="w-4 h-4 mr-2" /> Tổng Tài Sản</CardDescription>
                        <CardTitle className="text-2xl text-slate-800">{formatVND(totalAssets)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="shadow-sm border-slate-100 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 bg-rose-50/50">
                        <CardDescription className="flex items-center text-rose-800 font-medium"><AlertTriangle className="w-4 h-4 mr-2" /> Tổng Nợ</CardDescription>
                        <CardTitle className="text-2xl text-slate-800">{formatVND(totalLiabilities)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className={`shadow-sm border-slate-100 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-md transition-shadow ${netWorth < 0 ? 'ring-1 ring-rose-200' : 'ring-1 ring-emerald-200'}`}>
                    <CardHeader className="pb-2 bg-slate-50">
                        <CardDescription className="flex items-center text-slate-600 font-medium">Tài Sản Ròng (Net Worth)</CardDescription>
                        <CardTitle className={`text-3xl ${netWorth < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {formatVND(netWorth)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mục 2: Tháp Tài Sản (Wealth Pyramid) */}
                <Card className="shadow-sm border-slate-100 rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center text-slate-800"><TrendingUp className="w-5 h-5 mr-2 text-emerald-600" /> Tháp Phân Bổ Rủi Ro (Wealth Pyramid)</CardTitle>
                        <CardDescription>Cấu trúc tài sản hiện tại từ Gốc rễ tới Bề nổi</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-end h-80 pb-4 space-y-1">
                        {/* Tầng 4: Chóp */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                            className="w-1/4 h-16 bg-gradient-to-t from-rose-400 to-rose-300 rounded-t-xl flex items-center justify-center text-white font-medium shadow-md relative group cursor-pointer hover:w-1/3 transition-all">
                            <span className="text-xs z-10 text-center">Tăng Trưởng<br />{formatVND(pyramidData.trading)}</span>
                            <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs p-2 rounded -top-12 whitespace-nowrap pointer-events-none transition-opacity">Đầu tư rủi ro cao (Level 4-5)</div>
                        </motion.div>
                        {/* Tầng 3 */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                            className="w-2/4 h-16 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-sm flex items-center justify-center text-white font-medium shadow-md relative group cursor-pointer hover:w-7/12 transition-all">
                            <span className="text-sm z-10 text-center flex items-center"><Briefcase className="w-4 h-4 mr-1" /> Lõi Đầu Tư ({formatVND(pyramidData.core)})</span>
                            <div className="absolute opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs p-2 rounded -top-8 whitespace-nowrap pointer-events-none transition-opacity">Tài sản sinh lời đều (Level 1-3)</div>
                        </motion.div>
                        {/* Tầng 2 */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            className="w-3/4 h-16 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-sm flex items-center justify-center text-white font-medium shadow-md relative group cursor-pointer hover:w-5/6 transition-all">
                            <span className="text-sm z-10 text-center flex items-center"><PiggyBank className="w-4 h-4 mr-1" /> Tiết Kiệm & Thanh Khoản ({formatVND(pyramidData.savings)})</span>
                        </motion.div>
                        {/* Tầng 1: Lõi */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                            className="w-full h-16 bg-gradient-to-t from-slate-700 to-slate-600 rounded-b-xl flex items-center justify-center text-white font-medium shadow-md relative group cursor-pointer hover:scale-105 transition-all">
                            <span className="text-sm z-10 text-center flex items-center"><ShieldAlert className="w-4 h-4 mr-1" /> Dự Phòng & Bảo Vệ ({formatVND(pyramidData.protection)})</span>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Mục 3: Biểu đồ Phân bổ Danh mục (Pie Chart) */}
                <Card className="shadow-sm border-slate-100 rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">Cơ Cấu Tài Sản (Asset Allocation)</CardTitle>
                        <CardDescription>Tỷ trọng từng nhóm tài sản trong Tổng Tài Sản</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        {allocationData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.emerald[index % COLORS.emerald.length]} className="stroke-white stroke-2 outline-none" />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value: number) => formatVND(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">Chưa có dữ liệu Tài sản</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
