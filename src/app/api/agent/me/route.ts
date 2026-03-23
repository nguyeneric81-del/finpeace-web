import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    const supabase = await createClient()

    // Lấy user hiện tại từ session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kiểm tra role = agent hoặc admin
    const role = user.app_metadata?.role as string | undefined
    if (!role || !['agent', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Lấy thông tin agent từ sales_agents
    const { data: agent, error } = await supabase
        .from('sales_agents')
        .select(`
            id, code, full_name, brand_name, brand_tagline,
            brand_color_primary, brand_color_accent,
            avatar_url, title, contact_phone, contact_zalo,
            active, agent_type
        `)
        .eq('auth_user_id', user.id)
        .single()

    if (error || !agent) {
        return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    // Lấy stats leads
    const { data: leads, error: leadsError } = await supabase
        .from('agent_leads')
        .select('id, full_name, phone, email, status, registered_at, converted_at, utm_source')
        .eq('agent_id', agent.id)
        .order('registered_at', { ascending: false })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const stats = {
        total: leads?.length ?? 0,
        today: leads?.filter(l => new Date(l.registered_at) >= today).length ?? 0,
        converted: leads?.filter(l => l.status === 'converted').length ?? 0,
    }

    return NextResponse.json({
        agent,
        leads: leads ?? [],
        stats,
    })
}
