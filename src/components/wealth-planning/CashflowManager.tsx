'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, PiggyBank, BarChart3 } from 'lucide-react'

type Cashflow = {
    annual_income: number;
    annual_expense: number;
    annual_saving: number;
}

function formatVND(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 4 }).format(value)
}

function parseNumber(str: string): number {
    return Number(str.replace(/[^0-9.-]/g, '')) || 0
}

export function CashflowManager({ userId }: { userId: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [income, setIncome] = useState('')
    const [expense, setExpense] = useState('')
    const [savingTarget, setSavingTarget] = useState('')
    const [savingAutoFill, setSavingAutoFill] = useState(true) // Auto-fill tiết kiệm

    // Tính toán tự động
    const incomeNum = parseNumber(income)
    const expenseNum = parseNumber(expense)
    const savingNum = savingAutoFill ? Math.max(0, incomeNum - expenseNum) : parseNumber(savingTarget)
    const savingRate = incomeNum > 0 ? ((savingNum / incomeNum) * 100).toFixed(1) : '0.0'

    useEffect(() => {
        fetchCashflow()
    }, [])

    // Khi income hoặc expense thay đổi, auto-fill saving nếu đang ở chế độ auto
    useEffect(() => {
        if (savingAutoFill) {
            setSavingTarget(Math.max(0, incomeNum - expenseNum).toString())
        }
    }, [income, expense, savingAutoFill])

    async function fetchCashflow() {
        setLoading(true)
        const { data } = await supabase
            .from('client_cashflow')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        if (data) {
            setIncome(data.annual_income?.toString() || '0')
            setExpense(data.annual_expense?.toString() || '0')
            setSavingTarget(data.annual_saving?.toString() || '0')
            setSavingAutoFill(false) // Khi đã có data lưu, tắt auto-fill để giữ giá trị
        }
        setLoading(false)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        const payload = {
            user_id: userId,
            annual_income: incomeNum,
            annual_expense: expenseNum,
            annual_saving: savingNum,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('client_cashflow')
            .upsert(payload, { onConflict: 'user_id' })

        if (error) {
            alert('Lỗi lưu dòng tiền: ' + error.message)
        }
        setSaving(false)
    }

    if (loading) {
        return <p className="text-slate-500 text-sm py-4">Đang tải dữ liệu dòng tiền...</p>
    }

    return (
        <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                {/* Thu nhập */}
                <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Thu Nhập / Năm
                        </CardTitle>
                        <CardDescription className="text-xs">Tổng thu nhập gộp hàng năm (lương, kinh doanh...)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="number"
                            min={0}
                            step={1000000}
                            value={income}
                            onChange={e => setIncome(e.target.value)}
                            placeholder="VD: 240000000"
                            className="border-blue-200 focus-visible:ring-blue-400"
                        />
                        {incomeNum > 0 && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                                ≈ {formatVND(incomeNum / 12)} / tháng
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Chi phí */}
                <Card className="border-rose-100 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Chi Phí / Năm
                        </CardTitle>
                        <CardDescription className="text-xs">Tổng chi phí sinh hoạt &amp; cố định hàng năm</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="number"
                            min={0}
                            step={1000000}
                            value={expense}
                            onChange={e => setExpense(e.target.value)}
                            placeholder="VD: 120000000"
                            className="border-rose-200 focus-visible:ring-rose-400"
                        />
                        {expenseNum > 0 && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
                                ≈ {formatVND(expenseNum / 12)} / tháng
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Tiết kiệm */}
                <Card className="border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <PiggyBank className="h-4 w-4" />
                            Tiết Kiệm / Năm
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Mục tiêu tiết kiệm năm&nbsp;
                            <button
                                type="button"
                                onClick={() => setSavingAutoFill(!savingAutoFill)}
                                className="underline text-emerald-600 hover:text-emerald-800 text-xs"
                            >
                                {savingAutoFill ? '(tự tính ✓)' : '(nhập tay)'}
                            </button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="number"
                            min={0}
                            step={1000000}
                            value={savingAutoFill ? Math.max(0, incomeNum - expenseNum).toString() : savingTarget}
                            onChange={e => {
                                setSavingAutoFill(false)
                                setSavingTarget(e.target.value)
                            }}
                            placeholder="VD: 60000000"
                            className="border-emerald-200 focus-visible:ring-emerald-400"
                        />
                        {incomeNum > 0 && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                                ≈ {formatVND(savingNum / 12)} / tháng
                            </p>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Tóm tắt + nút lưu */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-slate-500" />
                    <div>
                        <p className="text-xs text-slate-500">Tỷ lệ Tiết kiệm</p>
                        <p className={`text-2xl font-bold ${Number(savingRate) >= 20 ? 'text-emerald-600' : Number(savingRate) >= 10 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {savingRate}%
                        </p>
                    </div>
                    <div className="ml-4 text-xs text-slate-500 space-y-0.5">
                        <p>Thu: <span className="font-semibold text-blue-600">{formatVND(incomeNum)}</span></p>
                        <p>Chi: <span className="font-semibold text-rose-600">{formatVND(expenseNum)}</span></p>
                        <p>Còn lại: <span className="font-semibold text-emerald-600">{formatVND(savingNum)}</span></p>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {saving ? 'Đang lưu...' : 'Lưu Dòng Tiền'}
                </Button>
            </div>
        </form>
    )
}
