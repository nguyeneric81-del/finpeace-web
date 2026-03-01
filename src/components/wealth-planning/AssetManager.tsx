'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Asset = {
    id: string;
    asset_group: string;
    asset_name: string;
    amount: number;
    risk_level: number;
    expected_return: number;
}

export function AssetManager({ userId }: { userId: string }) {
    const supabase = createClient()
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)

    // Form states
    const [group, setGroup] = useState('Thanh khoản')
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [risk, setRisk] = useState('1')
    const [returnRate, setReturnRate] = useState('')

    useEffect(() => {
        fetchAssets()
    }, [])

    async function fetchAssets() {
        setLoading(true)
        const { data, error } = await supabase
            .from('client_assets')
            .select('*')
            .order('created_at', { ascending: true })

        if (data) setAssets(data)
        setLoading(false)
    }

    async function handleAddAsset(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('client_assets').insert({
            user_id: userId,
            asset_group: group,
            asset_name: name,
            amount: Number(amount) || 0,
            risk_level: Number(risk) || 1,
            expected_return: Number(returnRate) || 0
        })

        if (!error) {
            setName('')
            setAmount('')
            setReturnRate('')
            fetchAssets()
        } else {
            alert("Lỗi thêm tài sản: " + error.message)
        }
    }

    async function handleDelete(id: string) {
        const { error } = await supabase.from('client_assets').delete().eq('id', id)
        if (!error) fetchAssets()
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Thêm mới */}
            <Card className="shadow-sm border-emerald-100">
                <CardHeader className="bg-emerald-50/50 pb-4 border-b border-emerald-50">
                    <CardTitle className="text-emerald-800">Thêm Tài Sản Mới</CardTitle>
                    <CardDescription>Khai báo danh mục đầu tư, thanh khoản hoặc nợ.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleAddAsset} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nhóm Tài Sản</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={group} onChange={e => setGroup(e.target.value)}
                            >
                                <option value="Thanh khoản">Thanh khoản (Tiền mặt, TK Ngân hàng)</option>
                                <option value="Đầu tư">Đầu tư (Cổ phiếu, Quỹ, BĐS Đầu tư)</option>
                                <option value="Tiêu dùng">Tiêu dùng (Nhà ở, Xe cộ)</option>
                                <option value="Nợ">Khoản Nợ (Thẻ tín dụng, Vay NH)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên Tài Sản / Hạng mục</label>
                            <Input required value={name} onChange={e => setName(e.target.value)} placeholder="VD: Sổ tiết kiệm VCB..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá trị (VNĐ)</label>
                            <Input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="VD: 100000000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Độ Rủi Ro (1-5)</label>
                                <Input required type="number" min="1" max="5" value={risk} onChange={e => setRisk(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lãi/Lỗ kỳ vọng (%)</label>
                                <Input required type="number" step="0.1" value={returnRate} onChange={e => setReturnRate(e.target.value)} placeholder="VD: 6.5" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Lưu Tài Sản</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danh sách */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b">
                    <CardTitle>Danh Mục Hiện Tại (KYC)</CardTitle>
                    <CardDescription>Bức tranh cấu trúc tài sản tổng thể.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {loading ? <p className="text-slate-500">Đang tải dữ liệu...</p> : (
                        assets.length === 0 ? <p className="text-slate-500">Chưa có tài sản nào được khai báo.</p> : (
                            <div className="space-y-4">
                                {assets.map(a => (
                                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800">{a.asset_name}</p>
                                            <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                                <span className="bg-slate-200 px-2 py-0.5 rounded">{a.asset_group}</span>
                                                <span>Rủi ro: Lvl {a.risk_level}</span>
                                                <span>Lãi: {a.expected_return}%</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="font-bold text-emerald-700">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a.amount)}
                                            </span>
                                            <button onClick={() => handleDelete(a.id)} className="text-xs text-red-500 hover:underline mt-1">
                                                Xoá
                                            </button>
                                        </div>
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
