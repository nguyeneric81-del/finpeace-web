import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// PATCH /api/admin/leads/[id]/note
// Update notes and crm_stage for a single lead
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminClient()
  const { id } = await params
  const body = await req.json()
  const { notes, crm_stage } = body

  const updates: Record<string, unknown> = {}
  if (notes !== undefined) updates.notes = notes
  if (crm_stage !== undefined) updates.crm_stage = crm_stage

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('agent_leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lead: data })
}
