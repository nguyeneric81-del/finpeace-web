import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { InvestmentGarden } from '@/components/dashboard/InvestmentGarden'
import { StressTestPanel } from '@/components/dashboard/StressTestPanel'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    // Lấy profile
    const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

    // Fetch tài sản
    const { data: assets } = await supabase
        .from('client_assets').select('*').eq('user_id', user.id)

    // Fetch dòng tiền
    const { data: cashflow } = await supabase
        .from('client_cashflow').select('*').eq('user_id', user.id).single()

    // ── Tính toán Vital Signs ──
    let totalAssets = 0
    let totalLiabilities = 0
    let liquidAssets = 0       // Quỹ Thanh khoản (dùng cho Stress Test)
    let investmentAssets = 0   // Tài sản đầu tư (Cổ phiếu, Quỹ...)
    let avgDebtRate = 0.10     // Lãi suất nợ trung bình giả định 10%

    if (assets) {
        assets.forEach((a: any) => {
            const amount = Number(a.amount || 0)
            if (a.asset_group === 'Nợ') {
                totalLiabilities += amount
            } else {
                totalAssets += amount
                if (a.asset_group === 'Thanh khoản') liquidAssets += amount
                if (a.asset_group === 'Tích lũy & Đầu tư') investmentAssets += amount
            }
        })
    }

    const netWorth = totalAssets - totalLiabilities
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0

    // ── Dòng tiền ──
    const annualIncome = Number(cashflow?.annual_income || 0)
    const annualSaving = Number(cashflow?.annual_saving || 0)
    const annualExpense = Number(cashflow?.annual_expense || 0)
    const monthlyExpense = annualExpense / 12
    const monthlySaving = annualSaving / 12

    // PYF Rate = Tiết kiệm / Thu nhập
    const pyfRate = annualIncome > 0 ? (annualSaving / annualIncome) * 100 : 0

    // Số tháng Quỹ Khẩn Cấp = Quỹ Thanh khoản / Chi phí tháng
    const emergencyMonths = monthlyExpense > 0 ? liquidAssets / monthlyExpense : 0

    // Vốn đầu tư ban đầu (Thanh khoản + Tích lũy)
    const totalInvestment = liquidAssets + investmentAssets

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400">
                        Xin chào, {profile?.full_name || user.email?.split('@')[0]} 👋
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Đây là bức tranh tài chính cá nhân của bạn hôm nay.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <a href="/dashboard/wealth-planning" className="mr-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow">
                            ✧ Lập Kế Hoạch Tài Chính
                        </Button>
                    </a>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" type="submit" className="border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                            Đăng xuất
                        </Button>
                    </form>
                </div>
            </div>

            {/* VÙNG 1: Vital Signs — 4 chỉ số sinh tồn */}
            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Chỉ Số Sinh Tồn</h3>
                <OverviewCards
                    netWorth={netWorth}
                    debtRatio={debtRatio}
                    emergencyMonths={emergencyMonths}
                    pyfRate={pyfRate}
                />
            </section>

            {/* VÙNG 2: Khu Vườn Khởi Sinh + Stress Test */}
            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Phân Tích Sức Mạnh & Sức Chịu Đựng</h3>
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Dự phóng Lãi kép — 3/5 */}
                    <div className="lg:col-span-3">
                        <InvestmentGarden
                            initialInvestment={totalInvestment}
                            monthlySaving={monthlySaving}
                            expectedReturnRate={0.10}
                            years={20}
                        />
                    </div>
                    {/* Stress Test — 2/5 */}
                    <div className="lg:col-span-2">
                        <StressTestPanel
                            liquidAssets={liquidAssets}
                            investmentAssets={investmentAssets}
                            monthlyExpense={monthlyExpense}
                            totalDebt={totalLiabilities}
                            avgDebtRate={avgDebtRate}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
