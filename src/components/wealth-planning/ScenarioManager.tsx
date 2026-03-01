'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Scenario = {
    id: string;
    plan_name: string;
    initial_capital: number;
    monthly_cashflow: number;
    target_amount: number;
    target_years: number;
    inflation_rate: number;
    is_selected: boolean;
}

export function ScenarioManager({ userId }: { userId: string }) {
    const supabase = createClient()
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [loading, setLoading] = useState(true)

    const [planName, setPlanName] = useState('Phương Án A (An Toàn)')
    const [initialCapital, setInitialCapital] = useState('')
    const [monthlyCashflow, setMonthlyCashflow] = useState('')
    const [targetAmount, setTargetAmount] = useState('')
    const [targetYears, setTargetYears] = useState('10')
    const [inflationRate, setInflationRate] = useState('3.5')

    useEffect(() => {
        fetchScenarios()
    }, [])

    async function fetchScenarios() {
        setLoading(true)
        const { data, error } = await supabase
            .from('wealth_scenarios')
            .select('*')
            .order('created_at', { ascending: true })

        if (data) setScenarios(data)
        setLoading(false)
    }

    async function handleAddScenario(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('wealth_scenarios').insert({
            user_id: userId,
            plan_name: planName,
            initial_capital: Number(initialCapital) || 0,
            monthly_cashflow: Number(monthlyCashflow) || 0,
            target_amount: Number(targetAmount) || 0,
            target_years: Number(targetYears) || 10,
            inflation_rate: Number(inflationRate) || 3.5,
            is_selected: scenarios.length === 0 // Tự động chọn kịch bản đầu tiên
        })

        if (!error) {
            setPlanName('')
            setInitialCapital('')
            setMonthlyCashflow('')
            setTargetAmount('')
            fetchScenarios()
        } else {
            alert("Lỗi thêm kịch bản: " + error.message)
        }
    }

    async function handleDelete(id: string) {
        const { error } = await supabase.from('wealth_scenarios').delete().eq('id', id)
        if (!error) fetchScenarios()
    }

    async function handleSelect(id: string) {
        // Unselect all first
        await supabase.from('wealth_scenarios').update({ is_selected: false }).eq('user_id', userId)
        // Select the chosen one
        await supabase.from('wealth_scenarios').update({ is_selected: true }).eq('id', id)
        fetchScenarios()
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-blue-100">
                <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-50">
                    <CardTitle className="text-blue-800">Cấu hình Kịch bản Đầu tư (Wealth Scenarios)</CardTitle>
                    <CardDescription>Thiết lập Mục tiêu & Dữ kiện đầu vào cho Phương án A, B, C...</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleAddScenario} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên Phương Án</label>
                                <Input required value={planName} onChange={e => setPlanName(e.target.value)} placeholder="VD: Plan A (Thận Trọng)" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lạm Phát Kỳ vọng (%)</label>
                                <Input required type="number" step="0.1" value={inflationRate} onChange={e => setInflationRate(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vốn Đầu Tư Ban Đầu (VNĐ)</label>
                                <Input required type="number" value={initialCapital} onChange={e => setInitialCapital(e.target.value)} placeholder="VD: 500000000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Dòng tiền Góp Đều / Tháng (VNĐ)</label>
                                <Input required type="number" value={monthlyCashflow} onChange={e => setMonthlyCashflow(e.target.value)} placeholder="VD: 10000000" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mục Tiêu Tài Chính Cần Đạt (VNĐ)</label>
                                <Input required type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="VD: 10000000000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số Năm Mục Tiêu (Years)</label>
                                <Input required type="number" value={targetYears} onChange={e => setTargetYears(e.target.value)} />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Thêm Kịch Bản (Scenario)</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? <p>Đang tải kịch bản...</p> : (
                    scenarios.map(s => (
                        <Card key={s.id} className={`shadow-sm relative ${s.is_selected ? 'border-2 border-emerald-500 bg-emerald-50/20' : ''}`}>
                            {s.is_selected && (
                                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow">Đang Chốt</div>
                            )}
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{s.plan_name}</CardTitle>
                                <CardDescription>Trong {s.target_years} năm</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm z-10 relative">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-slate-500">Mục tiêu:</span>
                                    <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(s.target_amount)} đ</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 pt-1">
                                    <span className="text-slate-500">Vốn gốc:</span>
                                    <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(s.initial_capital)} đ</span>
                                </div>
                                <div className="flex justify-between border-b pb-2 pt-1">
                                    <span className="text-slate-500">Góp tháng:</span>
                                    <span className="font-semibold text-emerald-600">+{new Intl.NumberFormat('vi-VN').format(s.monthly_cashflow)} đ</span>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    {!s.is_selected && (
                                        <Button variant="outline" size="sm" onClick={() => handleSelect(s.id)} className="flex-1">Chọn Kịch Bản Này</Button>
                                    )}
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)} className="flex-none px-3">Xoá</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
