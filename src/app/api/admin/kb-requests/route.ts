import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/kb-requests — list all requests
export async function GET(req: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending'

  const { data, error } = await supabase
    .from('kb_account_requests')
    .select('*')
    .eq('status', status)
    .order('requested_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ ok: false }, { status: 500 })
  return NextResponse.json({ ok: true, requests: data })
}
