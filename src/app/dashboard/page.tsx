import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { InvestmentGarden } from '@/components/dashboard/InvestmentGarden'
import { StressTestPanel } from '@/components/dashboard/StressTestPanel'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()

    const { data: assets } = await supabase
        .from('client_assets').select('*').eq('user_id', user.id)

    const { data: cashflow } = await supabase
        .from('client_cashflow').select('*').eq('user_id', user.id).single()

    let totalAssets = 0
    let totalLiabilities = 0
    let liquidAssets = 0
    let investmentAssets = 0
    const avgDebtRate = 0.10

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
    const annualIncome = Number(cashflow?.annual_income || 0)
    const annualSaving = Number(cashflow?.annual_saving || 0)
    const annualExpense = Number(cashflow?.annual_expense || 0)
    const monthlyExpense = annualExpense / 12
    const monthlySaving = annualSaving / 12
    const pyfRate = annualIncome > 0 ? (annualSaving / annualIncome) * 100 : 0
    const emergencyMonths = monthlyExpense > 0 ? liquidAssets / monthlyExpense : 0
    const totalInvestment = liquidAssets + investmentAssets

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Xin chào, {profile?.full_name || user.email?.split('@')[0]} 👋
                    </h2>
                    <p className="text-white/40 mt-1 text-sm">
                        Đây là bức tranh tài chính cá nhân của bạn hôm nay.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/dashboard/wealth-planning">
                        <button className="flex items-center gap-2 text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-xl transition-all">
                            ✧ Lập Kế Hoạch Tài Chính
                        </button>
                    </a>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="text-xs font-bold text-white/40 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all">
                            Đăng xuất
                        </button>
                    </form>
                </div>
            </div>

            {/* VÙNG 1: Vital Signs */}
            <section>
                <p className="text-xs font-black uppercase tracking-widest text-white/25 mb-4">Chỉ Số Sinh Tồn — CFP Standards</p>
                <OverviewCards
                    netWorth={netWorth}
                    debtRatio={debtRatio}
                    emergencyMonths={emergencyMonths}
                    pyfRate={pyfRate}
                />
            </section>

            {/* VÙNG 2: Khu Vườn Khởi Sinh + Stress Test */}
            <section>
                <p className="text-xs font-black uppercase tracking-widest text-white/25 mb-4">Phân Tích Sức Mạnh &amp; Sức Chịu Đựng</p>
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <InvestmentGarden
                            initialInvestment={totalInvestment}
                            monthlySaving={monthlySaving}
                            expectedReturnRate={0.10}
                            years={20}
                        />
                    </div>
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
