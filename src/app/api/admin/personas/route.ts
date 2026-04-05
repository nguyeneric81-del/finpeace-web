import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/personas
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('m2_personas')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ success: true, personas: data || [] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/admin/personas — seed multiple personas
export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { personas } = body

    if (!Array.isArray(personas) || personas.length === 0) {
      return NextResponse.json({ error: 'personas array là bắt buộc' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('m2_personas')
      .upsert(personas, { onConflict: 'avatar_slug', ignoreDuplicates: false })
      .select()

    if (error) throw error
    return NextResponse.json({ success: true, personas: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
