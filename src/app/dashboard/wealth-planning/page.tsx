import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetManager } from '@/components/wealth-planning/AssetManager'
import { CashflowManager } from '@/components/wealth-planning/CashflowManager'
import { ScenarioManager } from '@/components/wealth-planning/ScenarioManager'
import { ActionPlanManager } from '@/components/wealth-planning/ActionPlanManager'
import { PortfolioReview } from '@/components/wealth-planning/PortfolioReview'

export default async function WealthPlanningPage() {
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
            <div className="flex items-center justify-between space-y-2 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400">
                        Hệ Sinh Thái Kế Hoạch Tài Chính 💎
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Chào {profile?.full_name || user.email?.split('@')[0]}, đây là công cụ Kiến trúc Tài sản thay thế cho Google Sheets.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <a href="/dashboard">
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                            Quay lại Dashboard
                        </button>
                    </a>
                </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="kyc" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-slate-100 rounded-xl p-1">
                    <TabsTrigger value="kyc" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg">1. Tài sản &amp; Dòng tiền</TabsTrigger>
                    <TabsTrigger value="portfolio" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg">2. Báo Cáo Danh Mục</TabsTrigger>
                    <TabsTrigger value="scenarios" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg">3. Tùy Chỉnh Kịch Bản</TabsTrigger>
                    <TabsTrigger value="actions" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 rounded-lg">4. Kế Hoạch Hành Động</TabsTrigger>
                </TabsList>

                <div className="mt-6 border-none bg-transparent min-h-[500px]">
                    <TabsContent value="kyc" className="m-0 focus-visible:outline-none focus-visible:ring-0 bg-white border rounded-xl p-6 shadow-sm space-y-8">

                        {/* Section 1: Dòng Tiền */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">📊</span>
                                <div>
                                    <h3 className="text-base font-bold text-blue-800 dark:text-blue-400">Dòng Tiền Hàng Năm</h3>
                                    <p className="text-xs text-muted-foreground">Khai báo thu nhập, chi phí và mục tiêu tiết kiệm của bạn</p>
                                </div>
                            </div>
                            <CashflowManager userId={user.id} />
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white dark:bg-zinc-900 px-3 text-xs text-slate-400">✦</span>
                            </div>
                        </div>

                        {/* Section 2: Tài Sản */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">🏦</span>
                                <div>
                                    <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-400">Tài Sản &amp; Danh Mục</h3>
                                    <p className="text-xs text-muted-foreground">Khai báo toàn bộ tài sản, khoản đầu tư và khoản nợ hiện tại</p>
                                </div>
                            </div>
                            <AssetManager userId={user.id} />
                        </div>

                    </TabsContent>

                    <TabsContent value="portfolio" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <PortfolioReview userId={user.id} />
                    </TabsContent>

                    <TabsContent value="scenarios" className="m-0 focus-visible:outline-none focus-visible:ring-0 bg-white border rounded-xl p-6 shadow-sm">
                        <ScenarioManager userId={user.id} />
                    </TabsContent>

                    <TabsContent value="actions" className="m-0 focus-visible:outline-none focus-visible:ring-0 bg-white border rounded-xl p-6 shadow-sm">
                        <ActionPlanManager userId={user.id} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
