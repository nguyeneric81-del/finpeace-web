import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/admin/lp-campaigns/[id] — update budget/status/hook/cta
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = createAdminClient()
  const updates = await req.json()

  const { data, error } = await supabase
    .from('agent_landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign: data })
}
