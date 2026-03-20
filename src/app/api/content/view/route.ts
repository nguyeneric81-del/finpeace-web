import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/content/view — track page open
export async function POST(req: Request) {
  try {
    const { content_type, slug, pillar } = await req.json()
    if (!content_type || !slug) return NextResponse.json({ ok: false }, { status: 400 })

    await supabase.from('content_views').insert({ content_type, slug, pillar: pillar ?? null })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
