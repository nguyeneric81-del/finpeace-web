import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// POST /api/agent/lp/[id]/request-approval
// Agent xin Admin duyệt LP — đổi status draft → pending_review
export async function POST(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = user.app_metadata?.role
  if (role !== 'agent' && role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const adminSupabase = createAdminClient()

  // Verify LP belongs to this agent
  const { data: agent } = await adminSupabase
    .from('sales_agents')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // Fetch and validate LP ownership
  const { data: lp } = await adminSupabase
    .from('agent_landing_pages')
    .select('id, agent_id, status')
    .eq('id', id)
    .single()

  if (!lp) return NextResponse.json({ error: 'Landing page not found' }, { status: 404 })
  if (lp.agent_id !== agent.id) return NextResponse.json({ error: 'Forbidden — not your LP' }, { status: 403 })
  if (lp.status !== 'draft') {
    return NextResponse.json({ error: `Cannot request approval from status: ${lp.status}` }, { status: 400 })
  }

  const { data: updated, error } = await adminSupabase
    .from('agent_landing_pages')
    .update({ status: 'pending_review' })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, campaign: updated })
}
