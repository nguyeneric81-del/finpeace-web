import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: list all insights
export async function GET() {
  const { data, error } = await supabase
    .from('macro_insights')
    .select('*')
    .order('id', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: create or update
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action, ...insight } = body

  if (action === 'delete') {
    const { error } = await supabase.from('macro_insights').delete().eq('id', insight.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Upsert
  const { id, ...fields } = insight
  let result
  if (id) {
    // Update existing
    const { data, error } = await supabase
      .from('macro_insights')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  } else {
    // Insert new — auto-generate id
    const { data: maxRow } = await supabase
      .from('macro_insights')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single()
    const nextId = String((parseInt(maxRow?.id || '0') + 1))
    const { data, error } = await supabase
      .from('macro_insights')
      .insert({ id: nextId, ...fields })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  }

  return NextResponse.json(result)
}
