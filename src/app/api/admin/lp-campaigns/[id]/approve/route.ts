import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type Params = { params: Promise<{ id: string }> }

// POST /api/admin/lp-campaigns/[id]/approve
export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agent_landing_pages')
    .update({
      status: 'active',
      approved_at: new Date().toISOString(),
      preview_token: null, // invalidate preview token once live
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign: data, message: 'Campaign approved and live!' })
}
