"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const chartData = [
    { month: "T1", thu_nhap: 50, hieu_qua: 30, lang_phi: 15 },
    { month: "T2", thu_nhap: 55, hieu_qua: 35, lang_phi: 10 },
    { month: "T3", thu_nhap: 48, hieu_qua: 28, lang_phi: 18 },
    { month: "T4", thu_nhap: 60, hieu_qua: 40, lang_phi: 8 },
    { month: "T5", thu_nhap: 52, hieu_qua: 32, lang_phi: 15 },
    { month: "T6", thu_nhap: 58, hieu_qua: 38, lang_phi: 12 },
]

export function CashflowChart() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Dòng sông chi tiêu</CardTitle>
                <CardDescription>Phân tích hiệu suất sử dụng dòng tiền 6 tháng qua (Triệu VNĐ)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Bar dataKey="thu_nhap" name="Tổng thu nhập" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="hieu_qua" name="Dòng chảy sinh lời" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="lang_phi" name="Dòng chảy lãng phí" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
