import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KBSV_OPENID_URL = process.env.KBSV_OPENID_URL ?? 'https://openiduat.kbsec.com.vn/keycloak'
const KBSV_CLIENT_ID = process.env.KBSV_CLIENT_ID ?? 'kbsv-openid'
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/kbsv/callback`

/**
 * GET /api/kbsv/auth?advisor_user_id=xxx
 * 
 * Tạo KBSV OAuth2 authorization URL và redirect KH đến trang login KBSV.
 * 
 * Flow:
 * 1. FinPeace gọi endpoint này khi KH click "Kết nối tài khoản KBSV"
 * 2. Tạo state = base64(advisor_user_id + csrf_token)
 * 3. Redirect sang KBSV consent screen
 * 4. KBSV redirect về /api/kbsv/callback với code + state
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const advisorUserId = searchParams.get('advisor_user_id')

    if (!advisorUserId) {
      return NextResponse.json(
        { ok: false, error: 'Thiếu advisor_user_id' },
        { status: 400 }
      )
    }

    // Verify advisor user exists
    const { data: user, error } = await supabase
      .from('advisor_users')
      .select('id, email')
      .eq('id', advisorUserId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { ok: false, error: 'Không tìm thấy user' },
        { status: 404 }
      )
    }

    // Generate CSRF state token: base64(userId:timestamp:random)
    const csrfRaw = `${advisorUserId}:${Date.now()}:${Math.random().toString(36).slice(2)}`
    const state = Buffer.from(csrfRaw).toString('base64url')

    // Store state temporarily in DB (expires 10 minutes)
    await supabase.from('kbsv_oauth_states').upsert({
      state,
      advisor_user_id: advisorUserId,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })

    // Build KBSV authorization URL
    const params = new URLSearchParams({
      client_id: KBSV_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid',
      state,
    })

    const authUrl = `${KBSV_OPENID_URL}/realms/kbsv/protocol/openid-connect/auth?${params.toString()}`

    // Redirect trực tiếp đến KBSV consent screen
    return NextResponse.redirect(authUrl)
  } catch (err) {
    console.error('[kbsv/auth] Error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
