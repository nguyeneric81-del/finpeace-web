import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { InvestmentGarden } from '@/components/dashboard/InvestmentGarden'
import { StressTestPanel } from '@/components/dashboard/StressTestPanel'
import { AccumulationTracker } from '@/components/dashboard/AccumulationTracker'

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

    // SIP data
    const { data: sipTransactions } = await supabase
        .from('sip_transactions')
        .select('stock_code, order_date, total_value')
        .eq('user_id', user.id)

    const { data: sipSnapshots } = await supabase
        .from('sip_performance_snapshots')
        .select('stock_code, month, cumulative_nav, sip_return_pct, vnindex_return_pct')
        .eq('user_id', user.id)
        .order('month', { ascending: false })

    const { data: sipPlans } = await supabase
        .from('sip_service_plans')
        .select('stock_code, start_date, end_date, monthly_cashflow')
        .eq('user_id', user.id)

    const hasSIPData = (sipPlans?.length ?? 0) > 0

    // SIP calculations
    const totalInvested = sipTransactions?.reduce((s, t) => s + Number(t.total_value || 0), 0) ?? 0

    const now = new Date()
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const txThisMonth = sipTransactions?.filter(t => t.order_date?.startsWith(currentYM)) ?? []
    const amountThisMonth = txThisMonth.reduce((s, t) => s + Number(t.total_value || 0), 0)
    const transactionsThisMonth = txThisMonth.length
    const totalStocks = new Set(sipTransactions?.map(t => t.stock_code)).size

    // Latest NAV per stock
    const latestNAVByStock: Record<string, number> = {}
    sipSnapshots?.forEach(s => {
        if (!latestNAVByStock[s.stock_code]) latestNAVByStock[s.stock_code] = Number(s.cumulative_nav || 0)
    })
    const currentNAV = Object.values(latestNAVByStock).reduce((s, v) => s + v, 0)

    // Streak: count consecutive months with at least 1 transaction going back from current month
    const txMonthSet = new Set(sipTransactions?.map(t => t.order_date?.slice(0, 7)) ?? [])
    let streak = 0
    let checkYM = currentYM
    // Also count last month if current month has no tx yet (still in progress)
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevYM = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`
    const startCheck = transactionsThisMonth > 0 ? currentYM : prevYM
    checkYM = startCheck
    for (let i = 0; i < 24; i++) {
        if (!txMonthSet.has(checkYM)) break
        streak++
        const [y, m] = checkYM.split('-').map(Number)
        const p = m === 1 ? new Date(y - 1, 11, 1) : new Date(y, m - 2, 1)
        checkYM = `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, '0')}`
    }

    // Latest monthly performance (most recent non-zero snapshot)
    const latestSnap = sipSnapshots?.find(s => Number(s.sip_return_pct) !== -1)
    const latestSIPReturn = latestSnap ? Number(latestSnap.sip_return_pct) : null
    const latestVNIReturn = latestSnap ? Number(latestSnap.vnindex_return_pct) : null

    // Earliest start date across all plans
    const earliestStart = sipPlans?.reduce((min, p) => (!min || p.start_date < min) ? p.start_date : min, '')
    const latestEnd = sipPlans?.reduce((max, p) => (!max || (p.end_date ?? '') > max) ? (p.end_date ?? max) : max, '')

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
        <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Xin chào, {profile?.full_name || user.email?.split('@')[0]} 👋
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">
                        Đây là bức tranh tài chính cá nhân của bạn hôm nay.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <a href="/dashboard/wealth-planning">
                        <button className="flex items-center gap-2 text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all shadow-sm">
                            ✧ Lập Kế Hoạch Tài Chính
                        </button>
                    </a>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="text-xs font-bold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-all shadow-sm">
                            Đăng xuất
                        </button>
                    </form>
                </div>
            </div>

            {/* VÙNG 1: Vital Signs */}
            <section>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700/70 mb-4">Chỉ Số Sinh Tồn — CFP Standards</p>
                <OverviewCards
                    netWorth={netWorth}
                    debtRatio={debtRatio}
                    emergencyMonths={emergencyMonths}
                    pyfRate={pyfRate}
                />
            </section>

            {/* VÙNG 2: Khu Vườn Khởi Sinh + Stress Test */}
            <section>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-700/70 mb-4">Phân Tích Sức Mạnh &amp; Sức Chịu Đựng</p>
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

            {/* VÙNG 3: Hành Trình Tích Sản */}
            {hasSIPData && (
                <section>
                    <AccumulationTracker
                        totalInvested={totalInvested}
                        currentNAV={currentNAV}
                        transactionsThisMonth={transactionsThisMonth}
                        amountThisMonth={amountThisMonth}
                        totalStocks={totalStocks}
                        hasSIPData={hasSIPData}
                        streak={streak}
                        latestSIPReturn={latestSIPReturn}
                        latestVNIReturn={latestVNIReturn}
                        earliestStart={earliestStart ?? ''}
                        latestEnd={latestEnd ?? ''}
                    />
                </section>
            )}
        </div>
    )
}
