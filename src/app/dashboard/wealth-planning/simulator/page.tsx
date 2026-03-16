import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SimulatorClient } from './SimulatorClient'

export default async function SimulatorPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: cashflow } = await supabase.from('client_cashflow').select('*').eq('user_id', user.id).maybeSingle()
    const { data: assets } = await supabase.from('client_assets').select('*').eq('user_id', user.id)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    return <SimulatorClient user={user} cashflow={cashflow} assets={assets || []} profile={profile} />
}
