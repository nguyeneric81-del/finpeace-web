import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// POST /api/admin/kb-requests/[id]/complete
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createAdminClient()
  const { id } = await params

  const { error } = await supabase
    .from('kb_account_requests')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ ok: false }, { status: 500 })
  return NextResponse.json({ ok: true })
}
