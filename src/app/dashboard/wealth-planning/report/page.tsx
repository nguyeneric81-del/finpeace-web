import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { WealthReportClient } from './WealthReportClient'

export default async function WealthReportPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    return <WealthReportClient user={user} profile={profile} />
}
