'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ActionPlan = {
    id: string;
    category: string;
    task_name: string;
    amount_required: number;
    status: string;
}

export function ActionPlanManager({ userId }: { userId: string }) {
    const supabase = createClient()
    const [plans, setPlans] = useState<ActionPlan[]>([])
    const [loading, setLoading] = useState(true)

    const [category, setCategory] = useState('Tái cấu trúc rủi ro')
    const [task, setTask] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        fetchPlans()
    }, [])

    async function fetchPlans() {
        setLoading(true)
        const { data, error } = await supabase
            .from('action_plans')
            .select('*')
            .order('created_at', { ascending: true })

        if (data) setPlans(data)
        setLoading(false)
    }

    async function handleAddPlan(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('action_plans').insert({
            user_id: userId,
            category: category,
            task_name: task,
            amount_required: Number(amount) || 0,
            status: 'pending' // Chờ xử lý
        })

        if (!error) {
            setTask('')
            setAmount('')
            fetchPlans()
        } else {
            alert("Lỗi thêm công việc: " + error.message)
        }
    }

    async function handleDelete(id: string) {
        const { error } = await supabase.from('action_plans').delete().eq('id', id)
        if (!error) fetchPlans()
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        await supabase.from('action_plans').update({ status: newStatus }).eq('id', id)
        fetchPlans()
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-amber-100">
                <CardHeader className="bg-amber-50/50 pb-4 border-b border-amber-50">
                    <CardTitle className="text-amber-800">Thêm Mục Tiêu Hành Động</CardTitle>
                    <CardDescription>Các bước cụ thể để biến Kế hoạch Tài chính thành sự thật.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleAddPlan} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nhóm Công Việc</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={category} onChange={e => setCategory(e.target.value)}
                            >
                                <option value="Tái cấu trúc nợ">Cắt Nợ Tiêu Dùng / Trả Vay</option>
                                <option value="Lập quỹ">Xây Quỹ Khẩn Cấp</option>
                                <option value="Đầu tư">Đầu tư Kỳ Vọng Lãi Kép</option>
                                <option value="Mua Bảo Hiểm">Tham gia Bảo hiểm Rủi ro</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên Nhiệm Vụ Cụ Thể</label>
                            <Input required value={task} onChange={e => setTask(e.target.value)} placeholder="VD: Tất toán thẻ tín dụng Shinhan..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số tiền cần thiết (VNĐ - Khuyến nghị)</label>
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="VD: 50000000" />
                        </div>
                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">Tạo Phiếu Tác Vụ</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b">
                    <CardTitle>Bảng Nhiệm Vụ (Action Plan)</CardTitle>
                    <CardDescription>Những đầu việc cần làm tháng này / năm này.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {loading ? <p className="text-slate-500">Đang tải nhiệm vụ...</p> : (
                        plans.length === 0 ? <p className="text-slate-500">Kế hoạch tạm thời cất trong đầu, chưa viết ra.</p> : (
                            <div className="space-y-3">
                                {plans.map(p => (
                                    <div key={p.id} className={`flex items-start gap-4 p-4 rounded-lg border ${p.status === 'completed' ? 'bg-slate-50/50 opacity-60' : 'bg-white shadow-sm'}`}>
                                        <button
                                            onClick={() => handleToggleStatus(p.id, p.status)}
                                            className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                                                ${p.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}
                                        >
                                            {p.status === 'completed' && <span className="text-xs">✓</span>}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${p.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                                {p.task_name}
                                            </p>
                                            <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">{p.category}</span>
                                                {p.amount_required > 0 && (
                                                    <span className="font-semibold text-emerald-600">
                                                        Cần: {new Intl.NumberFormat('vi-VN').format(p.amount_required)} ₫
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(p.id)} className="shrink-0 text-xs text-red-400 hover:text-red-600 transition-colors">
                                            Xoá
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
