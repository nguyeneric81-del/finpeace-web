import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { CashflowChart } from '@/components/dashboard/CashflowChart'
import { InvestmentGarden } from '@/components/dashboard/InvestmentGarden'
import { GoalTracker } from '@/components/dashboard/GoalTracker'
import { WhatIfPanel } from '@/components/dashboard/WhatIfPanel'

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
                    {/* Nút vào Công cụ thiết kế Wealth Planning mới */}
                    <a href="/dashboard/wealth-planning" className="mr-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow">
                            ✧ Khởi tạo Kế Hoạch Tài Chính
                        </Button>
                    </a>

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

            {/* Tầng 2: Điểm chạm Phân tích & Tương tác "What-if" */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Bộ điều khiển thông số Tương Lai */}
                <div className="col-span-2">
                    <WhatIfPanel />
                </div>

                {/* Biểu đồ Sức mạnh Lãi kép Realtime */}
                <div className="col-span-5">
                    <InvestmentGarden />
                </div>
            </div>

            {/* Tầng 3: Khả năng Hành động (Sông tiền, Cột mốc) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CashflowChart />
                </div>
                <div className="col-span-3">
                    <GoalTracker />
                </div>
            </div>

        </div>
    )
}
