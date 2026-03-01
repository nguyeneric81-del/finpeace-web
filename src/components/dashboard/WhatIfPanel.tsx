"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useFinanceStore } from "@/store/useFinanceStore"
import { calculateFV, calculateRealRate } from "@/utils/math/financial-math"
import { Sparkles, Sprout, HandCoins, TrendingUp } from "lucide-react"

export function WhatIfPanel() {
    const {
        monthlySaving, setMonthlySaving,
        expectedReturn, setExpectedReturn,
        debtPayment, setDebtPayment,
        inflationRate, setInflationRate
    } = useFinanceStore()

    const TARGET_YEARS = 20; // Mô phỏng chung 20 năm
    // Tính lãi thực (đã trừ lạm phát)
    const realReturnRate = calculateRealRate(expectedReturn / 100, inflationRate / 100);
    // Tính số dư (Future Value) sau 20 năm với Lãi thực (Trả mỗi tháng = pmt)
    const futureWealth = calculateFV(realReturnRate / 12, TARGET_YEARS * 12, -monthlySaving, 0, 0);

    return (
        <Card className="shadow-sm border-emerald-100 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/30 dark:from-zinc-950 dark:to-emerald-950/20">
            <CardHeader>
                <CardTitle className="text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Kịch bản Tương lai (What-If)
                </CardTitle>
                <CardDescription>Kéo thanh trượt để thay đổi "vận mệnh" Khu vườn Đầu tư bên cạnh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pb-6">

                {/* Thanh trượt 1: Tiền tiết kiệm đầu tư */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                            <Sprout className="h-4 w-4 text-emerald-500" />
                            Tiền Gieo hạt (Tiết kiệm/tháng)
                        </Label>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumSignificantDigits: 3 }).format(monthlySaving)}
                        </span>
                    </div>
                    <Slider
                        value={[monthlySaving]}
                        min={0}
                        max={100000000}
                        step={1000000}
                        onValueChange={(val) => setMonthlySaving(val[0])}
                        className="[&_[role=slider]]:bg-emerald-500"
                    />
                </div>

                {/* Thanh trượt 2: Lãi suất kỳ vọng (Sinh lời kép) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            Tốc độ Sinh lời (Lãi suất/năm)
                        </Label>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{expectedReturn}%</span>
                    </div>
                    <Slider
                        value={[expectedReturn]}
                        min={1}
                        max={30}
                        step={0.5}
                        onValueChange={(val) => setExpectedReturn(val[0])}
                        className="[&_[role=slider]]:bg-blue-500 [&>.relative>.absolute]:bg-blue-200"
                    />
                </div>

                {/* Thanh trượt 3: Tiền trả nợ */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                            <HandCoins className="h-4 w-4 text-orange-500" />
                            Nỗ lực Trả nợ (VND/tháng)
                        </Label>
                        <span className="font-bold text-orange-600 dark:text-orange-400">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumSignificantDigits: 3 }).format(debtPayment)}
                        </span>
                    </div>
                    <Slider
                        value={[debtPayment]}
                        min={0}
                        max={50000000}
                        step={1000000}
                        onValueChange={(val) => setDebtPayment(val[0])}
                        className="[&_[role=slider]]:bg-orange-500 [&>.relative>.absolute]:bg-orange-200"
                    />
                </div>

            </CardContent>

            <CardFooter className="bg-emerald-50/50 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900 flex justify-between items-center py-4 px-6 rounded-b-xl mt-auto">
                <div>
                    <Label className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1 block text-sm">Quả ngọt Tương Lai (Sau {TARGET_YEARS} năm)</Label>
                    <p className="text-xs text-muted-foreground">Lãi suất Thực Tế: {(realReturnRate * 100).toFixed(1)}%</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumSignificantDigits: 3 }).format(futureWealth > 0 ? futureWealth : 0)}
                    </p>
                </div>
            </CardFooter>
        </Card>
    )
}
