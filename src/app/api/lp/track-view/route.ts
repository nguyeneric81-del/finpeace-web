import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    const { lpId, agentCode, topicSlug } = await request.json()

    const supabase = await createClient()

    if (lpId) {
        await supabase.rpc('increment_lp_views', { page_id: lpId })
    } else if (agentCode && topicSlug) {
        // Try to find and increment by agent+slug
        const { data: agentData } = await supabase
            .from('sales_agents')
            .select('id')
            .eq('code', agentCode)
            .single()

        if (agentData) {
            await supabase
                .from('agent_landing_pages')
                .update({ views: 1 }) // will use rpc for proper increment
                .eq('agent_id', agentData.id)
                .eq('slug', topicSlug)
        }
    }

    return NextResponse.json({ ok: true })
}
