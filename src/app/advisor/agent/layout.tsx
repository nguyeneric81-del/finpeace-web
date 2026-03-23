import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const role = user?.app_metadata?.role as string | undefined
    const isAgent = role === 'agent' || role === 'admin'

    // Cho phép truy cập login mà không cần auth
    // Layout này chỉ bảo vệ các trang con, redirect xử lý trong từng page nếu cần
    // Nhưng nếu đã login và vào login page → redirect về dashboard (xử lý trong login page)

    return <>{children}</>
}
