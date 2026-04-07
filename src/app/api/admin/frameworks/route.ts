import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/frameworks
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('m3_content_frameworks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ success: true, frameworks: data || [] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST /api/admin/frameworks — seed/create multiple
export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { frameworks } = body

    if (!Array.isArray(frameworks) || frameworks.length === 0) {
      return NextResponse.json({ error: 'frameworks array là bắt buộc' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('m3_content_frameworks')
      .upsert(frameworks, { onConflict: 'slug', ignoreDuplicates: false })
      .select()

    if (error) throw error
    return NextResponse.json({ success: true, frameworks: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
