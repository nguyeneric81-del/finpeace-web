"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface InvestmentGardenProps {
    // Total investment assets hiện tại (vốn gốc ban đầu)
    initialInvestment: number
    // Tiết kiệm tháng thực tế (annual_saving / 12)
    monthlySaving: number
    // Lãi suất giả định là trung bình thị trường Vietnam danh mục hỗn hợp ~10%/năm
    expectedReturnRate?: number
    // Số năm dự phóng
    years?: number
}

function calculateFV(principal: number, monthlyContrib: number, annualRate: number, years: number) {
    const r = annualRate / 12
    const n = years * 12
    const fvPrincipal = principal * Math.pow(1 + r, n)
    const fvContrib = r > 0 ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) : monthlyContrib * n
    return fvPrincipal + fvContrib
}

export function InvestmentGarden({
    initialInvestment = 0,
    monthlySaving = 0,
    expectedReturnRate = 0.10,
    years = 20
}: InvestmentGardenProps) {
    const fmtVND = (val: number) => {
        if (Math.abs(val) >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + ' Tỷ ₫'
        if (Math.abs(val) >= 1_000_000) return Math.round(val / 1_000_000) + ' Tr ₫'
        return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
    }

    const chartData = useMemo(() => {
        const data = []
        for (let y = 0; y <= years; y += 1) {
            const tai_san = calculateFV(initialInvestment, monthlySaving, expectedReturnRate, y)
            const von_goc = initialInvestment + monthlySaving * 12 * y
            data.push({
                year: y === 0 ? 'Hiện tại' : `Năm ${y}`,
                tai_san: Math.round(tai_san),
                von_goc: Math.round(von_goc),
            })
        }
        return data
    }, [initialInvestment, monthlySaving, expectedReturnRate, years])

    const finalWealth = chartData[chartData.length - 1]?.tai_san ?? 0
    const totalContrib = chartData[chartData.length - 1]?.von_goc ?? 0
    const gain = finalWealth - totalContrib
    const gainRatio = totalContrib > 0 ? ((gain / totalContrib) * 100).toFixed(0) : '∞'
    const hasData = initialInvestment > 0 || monthlySaving > 0

    return (
        <Card className="shadow-sm border-blue-100 h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50/70 to-white border-b">
                <CardTitle className="text-blue-800">Khu Vườn Khởi Sinh 🌱</CardTitle>
                <CardDescription>
                    Với tài sản và tiết kiệm <strong>hiện tại</strong>, trong {years} năm tới bạn sẽ có...
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                {!hasData ? (
                    <div className="h-[260px] flex items-center justify-center text-center p-8">
                        <div>
                            <p className="text-4xl mb-3">🌱</p>
                            <p className="text-slate-600 font-medium">Chưa có dữ liệu Tài sản hoặc Tiết kiệm</p>
                            <p className="text-slate-400 text-sm mt-1">Hãy khai báo tài sản & dòng tiền ở Tab 1 để xem vườn lớn như thế nào!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTaiSan" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorVon" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} dy={8}
                                        interval={Math.floor(years / 4)} />
                                    <YAxis hide domain={[0, 'auto']} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }}
                                        formatter={(value: any, name: string) => {
                                            const fmtVal = value >= 1_000_000_000
                                                ? (value / 1_000_000_000).toFixed(2) + ' Tỷ ₫'
                                                : Math.round(value / 1_000_000) + ' Tr ₫'
                                            if (name === "tai_san") return [fmtVal, "🌳 Tài sản sinh lời"]
                                            if (name === "von_goc") return [fmtVal, "🪨 Vốn gốc đã góp"]
                                            return [fmtVal, name]
                                        }}
                                    />
                                    <Area type="monotone" dataKey="tai_san" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTaiSan)" />
                                    <Area type="monotone" dataKey="von_goc" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorVon)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Vốn gốc góp vào</p>
                                <p className="text-sm font-semibold text-slate-600 mt-0.5">{fmtVND(totalContrib)}</p>
                            </div>
                            <div className="text-center border-x border-dashed border-slate-200">
                                <p className="text-xs text-slate-400">Lãi kép tạo ra</p>
                                <p className="text-sm font-semibold text-emerald-600 mt-0.5">+{fmtVND(gain)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Tổng tài sản</p>
                                <p className="text-base font-bold text-blue-700 mt-0.5">{fmtVND(finalWealth)}</p>
                            </div>
                        </div>

                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-xs text-blue-700">
                                💡 Dự phóng với lãi suất <strong>{(expectedReturnRate * 100).toFixed(0)}%/năm</strong> (danh mục hỗn hợp thị trường).
                                Vốn gốc của bạn sinh lời thêm <strong>{gainRatio}%</strong> nhờ sức mạnh lãi kép.
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
