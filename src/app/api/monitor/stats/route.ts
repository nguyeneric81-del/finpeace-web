import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [leadsRes, advisorsRes, leadsCountRes] = await Promise.all([
        supabase
            .from('kb_leads')
            .select('id, name, email, pillar, article_slug, track, created_at')
            .order('created_at', { ascending: false })
            .limit(20),
        supabase
            .from('advisor_users')
            .select('id', { count: 'exact', head: true }),
        supabase
            .from('kb_leads')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', today.toISOString()),
    ])

    return NextResponse.json({
        leads: leadsRes.data || [],
        advisor_count: advisorsRes.count || 0,
        leads_today: leadsCountRes.count || 0,
        total_leads: leadsRes.data?.length || 0,
    }, {
        headers: {
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
        }
    })
}
