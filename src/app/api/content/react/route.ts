import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/content/react — like or love a content piece
export async function POST(req: Request) {
  try {
    const { content_type, slug, pillar, reaction, user_email } = await req.json()
    if (!content_type || !slug || !reaction) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    if (!['like', 'love'].includes(reaction)) {
      return NextResponse.json({ ok: false, error: 'Invalid reaction' }, { status: 400 })
    }

    await supabase.from('content_reactions').insert({
      content_type,
      slug,
      pillar: pillar ?? null,
      reaction,
      user_email: user_email ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
