import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Khu vực riêng tư</h2>
                <div className="flex items-center space-x-2">
                    {/* Nút Đăng xuất. Ở đây làm đơn giản bằng form để trigger Server Action hoặc làm Client. Ta sẽ để tạm HTML basic */}
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" type="submit">Đăng xuất</Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder cho dashboard thật */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Xin chào</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">{profile?.full_name || user.email}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {profile?.role === 'admin' ? 'Tài khoản Quản trị' : 'Tài khoản Khách hàng'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
