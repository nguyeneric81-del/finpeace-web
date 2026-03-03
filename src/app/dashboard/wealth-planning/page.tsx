import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { WealthPlanningClient } from './WealthPlanningClient' // Sẽ tạo file này

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

    return <WealthPlanningClient user={user} profile={profile} />
}
