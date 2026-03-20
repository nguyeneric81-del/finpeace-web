import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/cron/kb-requests-expire
// Vercel Cron or manual trigger — runs daily to expire stale requests
export async function GET(req: Request) {
  // Simple security: check cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('kb_account_requests')
    .update({ status: 'expired' })
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString())
    .select('id')

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 })

  return NextResponse.json({ ok: true, expired_count: data?.length ?? 0 })
}
