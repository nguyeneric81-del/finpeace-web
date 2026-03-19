import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/leads?agent_code=mq01&status=new&limit=100
// Returns leads grouped info for admin reporting
export async function GET(req: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const agent_code = searchParams.get('agent_code')  // optional filter
  const status = searchParams.get('status')            // optional filter
  const limit = parseInt(searchParams.get('limit') ?? '200')

  let query = supabase
    .from('agent_leads')
    .select(`
      id,
      email,
      full_name,
      phone,
      ref_code,
      utm_source,
      status,
      registered_at,
      converted_at,
      landing_page_id,
      agent_landing_pages!landing_page_id (
        slug,
        campaign_name,
        content_type
      ),
      sales_agents!agent_id (
        code,
        full_name,
        brand_color_accent
      )
    `)
    .order('registered_at', { ascending: false })
    .limit(limit)

  if (agent_code) query = query.eq('ref_code', agent_code)
  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ leads: data ?? [] })
}

// PATCH /api/admin/leads/:id — update lead status
export async function PATCH(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, status } = body

  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

  const { data, error } = await supabase
    .from('agent_leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lead: data })
}
