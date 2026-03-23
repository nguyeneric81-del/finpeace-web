import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/agent/campaigns — campaigns của logged-in agent only
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = user.app_metadata?.role
  if (role !== 'agent' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const adminSupabase = createAdminClient()

  // Lấy agent record của user này
  const { data: agent } = await adminSupabase
    .from('sales_agents')
    .select('id, code, full_name')
    .eq('auth_user_id', user.id)
    .single()

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Lấy campaigns chỉ của agent này
  const { data: campaigns, error } = await adminSupabase
    .from('agent_landing_pages')
    .select(`
      id, slug, campaign_name, content_type, status,
      budget_allocated, budget_spent, utm_source, utm_campaign,
      approved_at, generated_hook, views_7d, leads_7d, leads_total
    `)
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false })

  if (error) {
    // Fallback nếu thiếu column views_7d (dùng view)
    const { data: raw } = await adminSupabase
      .from('agent_landing_pages')
      .select('id, slug, campaign_name, content_type, status, budget_allocated, budget_spent, utm_source, utm_campaign, approved_at, generated_hook')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })
    return NextResponse.json({ campaigns: raw ?? [], agent })
  }

  return NextResponse.json({ campaigns: campaigns ?? [], agent })
}
