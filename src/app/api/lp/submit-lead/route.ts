import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    const body = await request.json()
    const { full_name, email, phone, agentCode, topicSlug, lpId, agentId } = body

    if (!agentCode || (!email && !phone)) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('agent_leads').insert({
        agent_id: agentId,
        landing_page_id: lpId || null,
        full_name: full_name || null,
        email: email || null,
        phone: phone || null,
        ref_code: agentCode,
        utm_source: topicSlug,
        status: 'new',
    })

    if (error) {
        console.error('[LP Lead Submit]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
