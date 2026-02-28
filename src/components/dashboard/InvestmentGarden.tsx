"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "@/store/useFinanceStore"
import { calculateWealth, formatCurrency } from "@/lib/calculator"

export function InvestmentGarden() {
    const { monthlySaving, expectedReturn, debtPayment } = useFinanceStore()

    // Tính toán sinh lời trong 20 năm dựa trên thông số từ Slider
    // Lấy hàm thư viện cũ của tác giả đã viết
    // Giả định nợ trả hết trong 5 năm (debtYears = 5)
    // Mục tiêu: 10 Tỷ VND (targetAmount = 10_000_000_000)
    const result = calculateWealth(
        0, // initialInvest
        monthlySaving,
        5, // debtYears 
        debtPayment,
        expectedReturn,
        20, // years 
        10000000000 // targetAmount
    )

    // Lấy dữ liệu mỗi năm thay vì mỗi tháng từ hàm cũ để biểu đồ đỡ lag
    const annualData = result.chartData.filter(d => d.month % 12 === 0).map(d => ({
        year: `Năm ${d.month / 12}`,
        tai_san: d.wealth,
        von_goc: d.invested,
        muc_tieu: d.goal
    }))

    return (
        <Card className="shadow-sm border-blue-100 dark:border-blue-900 bg-white dark:bg-zinc-950">
            <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400">Khu vườn Khởi sinh</CardTitle>
                <CardDescription>
                    Mô phỏng sức mạnh Lãi Kép dựa trên thông số bạn thay đổi (trong 20 năm)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={annualData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTaiSan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVon" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                            <YAxis
                                hide
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                formatter={(value: any, name: string) => {
                                    if (name === "tai_san") return [formatCurrency(value), "Tài sản sinh lời"];
                                    if (name === "von_goc") return [formatCurrency(value), "Vốn gốc đã góp"];
                                    return [formatCurrency(value), name];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="tai_san"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTaiSan)"
                            />
                            <Area
                                type="monotone"
                                dataKey="von_goc"
                                stroke="#64748b"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorVon)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center px-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Dự kiến vốn góp (20 năm):</p>
                        <p className="font-semibold text-slate-700">{formatCurrency(annualData[annualData.length - 1]?.von_goc || 0)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Tổng tài sản nhận được:</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(result.finalWealth)}
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
