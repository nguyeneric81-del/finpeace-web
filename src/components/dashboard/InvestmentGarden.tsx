"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
    { year: "2024", tai_san: 1.5 },
    { year: "2026", tai_san: 2.1 },
    { year: "2028", tai_san: 3.2 },
    { year: "2030", tai_san: 5.5 },
    { year: "2032", tai_san: 8.9 },
    { year: "2034", tai_san: 14.2 },
]

export function InvestmentGarden() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-emerald-500">Khu vườn Đầu tư</CardTitle>
                <CardDescription>Dự phóng tăng trưởng tài sản dài hạn nhờ Lãi suất kép (Tỷ VNĐ)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTaiSan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                formatter={(value: number) => [`${value} Tỷ VND`, "Tài sản ròng"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="tai_san"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTaiSan)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
