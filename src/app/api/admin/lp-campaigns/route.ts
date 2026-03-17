import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/admin/lp-campaigns — list all campaigns with stats
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lp_campaign_stats')
    .select('*')
    .order('approved_at', { ascending: false, nullsFirst: false })

  if (error) {
    // Fallback if view doesn't exist yet (migration pending)
    const { data: raw } = await supabase
      .from('agent_landing_pages')
      .select(`
        id, slug, campaign_name, content_type, status,
        budget_allocated, budget_spent, utm_source, utm_campaign,
        approved_at, generated_hook,
        sales_agents!agent_id(code, full_name, brand_color_accent)
      `)
    return NextResponse.json({ campaigns: raw ?? [], fallback: true })
  }

  return NextResponse.json({ campaigns: data })
}

// POST /api/admin/lp-campaigns — create draft (without AI)
export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const { agent_code, content_type, content_slug, campaign_name, budget_allocated, utm_source, utm_campaign } = body

  const { data: agent } = await supabase
    .from('sales_agents')
    .select('id')
    .eq('code', agent_code)
    .single()

  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('agent_landing_pages')
    .upsert({
      agent_id: agent.id,
      slug: content_slug,
      topic: content_slug,
      content_type: content_type ?? 'macro_insight',
      status: 'draft',
      campaign_name,
      budget_allocated: budget_allocated ?? 0,
      utm_source,
      utm_campaign,
    }, { onConflict: 'agent_id,slug' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign: data })
}
