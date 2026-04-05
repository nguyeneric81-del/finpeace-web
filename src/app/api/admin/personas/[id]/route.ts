import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// PATCH /api/admin/personas/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await req.json()
    const { name, pain_points, content_triggers, tone_of_voice } = body

    const { data, error } = await supabase
      .from('m2_personas')
      .update({
        name,
        pain_points,
        content_triggers,
        tone_of_voice,
        updated_by: 'ceo',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, persona: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/personas/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const { error } = await supabase
      .from('m2_personas')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
