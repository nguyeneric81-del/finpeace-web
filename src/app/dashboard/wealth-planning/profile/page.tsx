import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileUpdateClient } from './ProfileUpdateClient'

export default async function WealthProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: cashflow } = await supabase.from('client_cashflow').select('*').eq('user_id', user.id).maybeSingle()
    const { data: insurance } = await supabase.from('client_insurance').select('*').eq('user_id', user.id)

    return (
        <ProfileUpdateClient
            user={user}
            profile={profile}
            cashflow={cashflow}
            insurance={insurance || []}
        />
    )
}
