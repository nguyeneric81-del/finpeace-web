import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { CashflowChart } from '@/components/dashboard/CashflowChart'
import { InvestmentGarden } from '@/components/dashboard/InvestmentGarden'
import { GoalTracker } from '@/components/dashboard/GoalTracker'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Lấy dữ liệu profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400">
                        Xin chào, {profile?.full_name || user.email?.split('@')[0]} 👋
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Chào mừng bạn trở lại với <b>Ốc Đảo Bình Yên</b> tài chính của mình!
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Nút Đăng xuất */}
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" type="submit" className="border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                            Đăng xuất
                        </Button>
                    </form>
                </div>
            </div>

            {/* Tầng 1: Góc nhìn sinh tồn */}
            <div className="space-y-4">
                <OverviewCards />
            </div>

            {/* Tầng 2: Điểm chạm Phân tích (Sông tiền & Vườn đầu tư) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CashflowChart />
                </div>
                <div className="col-span-3">
                    <InvestmentGarden />
                </div>
            </div>

            {/* Tầng 3: Khả năng Hành động */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-1">
                    <GoalTracker />
                </div>
                <div className="col-span-1">
                    {/* Placeholder tính năng AI Cố vấn */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col justify-center items-center p-6 text-center space-y-3 bg-emerald-500/5 dark:bg-emerald-900/10 border-emerald-500/20">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold mb-2">AI</div>
                        <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-300">Cố vấn FinPeace AI</h3>
                        <p className="text-sm text-muted-foreground max-w-[80%]">
                            Trợ lý AI đang học hỏi dữ liệu của bạn và sẽ sớm đưa ra các khuyến nghị tối ưu dòng tiền, đầu tư sinh lời kép và dập nợ hiệu quả nhất.
                        </p>
                        <Button disabled variant="secondary" className="mt-4">Đang kích hoạt chức năng (Phase 4)</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
