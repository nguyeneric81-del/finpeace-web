"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wallet, ShieldAlert, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export function OverviewCards() {
    // Mock data - eventually fetched from Supabase
    const netWorth = 1500000000 // 1.5 tỷ
    const netWorthGrowth = 5.2 // %
    const emergencyFund = 100000000 // 100 triệu (Mục tiêu: 150 tr)
    const emergencyGoal = 150000000
    const debtRatio = 35 // % (Trạng thái trung bình)

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Thẻ 1: Tài sản ròng */}
            <Card className="shadow-sm border-l-4 border-l-primary/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tài sản ròng</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(netWorth)}
                    </div>
                    <p className="flex items-center text-xs text-muted-foreground mt-1">
                        {netWorthGrowth > 0 ? (
                            <span className="text-emerald-500 font-medium flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{netWorthGrowth}%
                            </span>
                        ) : (
                            <span className="text-rose-500 font-medium flex items-center mr-1">
                                <ArrowDownRight className="h-3 w-3 mr-0.5" /> {netWorthGrowth}%
                            </span>
                        )}
                        {" "}so với tháng trước
                    </p>
                </CardContent>
            </Card>

            {/* Thẻ 2: Quỹ khẩn cấp */}
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quỹ dự phòng bão tố</CardTitle>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(emergencyFund)}
                    </div>
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Tiến độ an toàn</span>
                            <span className="font-medium">{Math.round((emergencyFund / emergencyGoal) * 100)}%</span>
                        </div>
                        <Progress value={(emergencyFund / emergencyGoal) * 100} className="h-2 bg-muted/50 [&>div]:bg-emerald-500" />
                    </div>
                </CardContent>
            </Card>

            {/* Thẻ 3: Đầm lầy nợ nần */}
            <Card className="shadow-sm border-orange-100 dark:border-orange-950">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đầm lầy nợ nần</CardTitle>
                    {debtRatio > 40 ? (
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                    ) : debtRatio > 30 ? (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    ) : (
                        <ShieldAlert className="h-4 w-4 text-emerald-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{debtRatio}%
                        <span className="text-sm font-normal text-muted-foreground ml-2">Tổng thu nhập</span>
                    </div>
                    <div className="mt-2">
                        {debtRatio > 40 ? (
                            <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200">Báo động: Tỷ lệ nợ cao</Badge>
                        ) : debtRatio > 30 ? (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200">Chú ý: Nợ ở mức trung bình</Badge>
                        ) : (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">An toàn: Tỷ lệ nợ thấp</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
