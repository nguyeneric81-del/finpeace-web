"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useFinanceStore } from "@/store/useFinanceStore"
import { Sparkles, Sprout, HandCoins, TrendingUp } from "lucide-react"

export function WhatIfPanel() {
    const {
        monthlySaving, setMonthlySaving,
        expectedReturn, setExpectedReturn,
        debtPayment, setDebtPayment,
        inflationRate, setInflationRate
    } = useFinanceStore()

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
        </Card>
    )
}
