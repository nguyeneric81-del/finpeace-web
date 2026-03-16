import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); sevenDaysAgo.setHours(0, 0, 0, 0)

    // 1. Agent profile
    const { data: agent } = await supabase
        .from('sales_agents')
        .select('*')
        .eq('code', code)
        .single()

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    // 2. Landing pages with views
    const { data: landingPages } = await supabase
        .from('agent_landing_pages')
        .select('id, slug, topic, views, custom_hook, created_at')
        .eq('agent_id', agent.id)
        .order('views', { ascending: false })

    // 3. All leads for this agent
    const { data: leads } = await supabase
        .from('agent_leads')
        .select('id, full_name, email, phone, ref_code, utm_source, status, registered_at, landing_page_id')
        .eq('agent_id', agent.id)
        .order('registered_at', { ascending: false })

    // 4. Leads today
    const { count: leadsToday } = await supabase
        .from('agent_leads')
        .select('id', { count: 'exact', head: true })
        .eq('agent_id', agent.id)
        .gte('registered_at', today.toISOString())

    // 5. Leads last 7 days (group by date)
    const { data: recentLeads } = await supabase
        .from('agent_leads')
        .select('registered_at')
        .eq('agent_id', agent.id)
        .gte('registered_at', sevenDaysAgo.toISOString())

    const leadsByDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        leadsByDay[d.toISOString().slice(0, 10)] = 0
    }
    ;(recentLeads || []).forEach(l => {
        const day = new Date(l.registered_at).toISOString().slice(0, 10)
        if (leadsByDay[day] !== undefined) leadsByDay[day]++
    })

    // 6. Also pull kb_leads attributed to old-style ref code (backward compat)
    const { data: kbLeads } = await supabase
        .from('kb_leads')
        .select('id, name, email, pillar, sales_code, created_at')
        .eq('sales_code', code)   // old attribution format
        .order('created_at', { ascending: false })
        .limit(20)

    return NextResponse.json({
        agent,
        landing_pages: landingPages || [],
        leads: leads || [],
        leads_today: leadsToday || 0,
        leads_total: (leads || []).length,
        leads_by_day: leadsByDay,
        kb_leads: kbLeads || [],    // backward compat
        converted: (leads || []).filter(l => l.status === 'converted').length,
    }, { headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } })
}
