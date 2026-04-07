import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// PATCH /api/admin/frameworks/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient()
    const { id } = await params
    const body = await req.json()

    const { data, error } = await supabase
      .from('m3_content_frameworks')
      .update({
        ...body,
        updated_by: 'ceo',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, framework: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
