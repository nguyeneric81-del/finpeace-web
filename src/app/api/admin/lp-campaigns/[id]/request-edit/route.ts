import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// POST /api/admin/lp-campaigns/[id]/request-edit
export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = createAdminClient()
  const { notes } = await req.json()

  const { data, error } = await supabase
    .from('agent_landing_pages')
    .update({
      status: 'pending_review',
      admin_notes: notes,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign: data, message: 'Edit requested. AI will re-generate.' })
}
