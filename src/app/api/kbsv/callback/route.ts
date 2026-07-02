import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KBSV_OPENID_URL = process.env.KBSV_OPENID_URL ?? 'https://openiduat.kbsec.com.vn/keycloak'
const KBSV_CLIENT_ID = process.env.KBSV_CLIENT_ID ?? 'kbsv-openid'
const KBSV_CLIENT_SECRET = process.env.KBSV_CLIENT_SECRET ?? ''
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/kbsv/callback`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://finpeace.cloud'

/**
 * GET /api/kbsv/callback?code=xxx&state=xxx
 * 
 * KBSV OAuth2 Callback — nhận authorization code từ KBSV sau khi KH đồng ý consent.
 * 
 * Flow:
 * 1. KBSV redirect về đây với ?code=xxx&state=xxx
 * 2. Verify state (CSRF protection)
 * 3. Exchange code → access_token + refresh_token
 * 4. Encrypt và lưu tokens server-side (KHÔNG expose ra client)
 * 5. Redirect KH về app với success/error message
 * 
 * Redirect URI cần whitelist tại KBSV: https://finpeace.cloud/api/kbsv/callback
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Decode state to get the redirect source
  let source = 'advisor'
  if (state) {
    try {
      const decoded = Buffer.from(state, 'base64url').toString('utf8')
      const parts = decoded.split(':')
      if (parts[3]) source = parts[3]
    } catch {}
  }
  const dashboardPath = source === 'stockpick' ? '/stockpick/dashboard' : '/advisor/dashboard'

  // Handle KBSV error redirect (ví dụ KH nhấn Cancel)
  if (error) {
    console.warn('[kbsv/callback] KBSV returned error:', error)
    return NextResponse.redirect(
      `${APP_URL}${dashboardPath}?kbsv=cancelled&reason=${encodeURIComponent(error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${APP_URL}${dashboardPath}?kbsv=error&reason=missing_params`
    )
  }

  try {
    // 1. Verify state — CSRF protection
    const { data: stateRecord, error: stateError } = await supabase
      .from('kbsv_oauth_states')
      .select('advisor_user_id, expires_at')
      .eq('state', state)
      .single()

    if (stateError || !stateRecord) {
      console.error('[kbsv/callback] Invalid or expired state:', state)
      return NextResponse.redirect(
        `${APP_URL}${dashboardPath}?kbsv=error&reason=invalid_state`
      )
    }

    if (new Date(stateRecord.expires_at) < new Date()) {
      console.warn('[kbsv/callback] State expired:', state)
      // Cleanup
      await supabase.from('kbsv_oauth_states').delete().eq('state', state)
      return NextResponse.redirect(
        `${APP_URL}${dashboardPath}?kbsv=error&reason=state_expired`
      )
    }

    const advisorUserId = stateRecord.advisor_user_id

    // 2. Exchange code → tokens
    const tokenUrl = `${KBSV_OPENID_URL}/realms/kbsv/protocol/openid-connect/token`
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: KBSV_CLIENT_ID,
      client_secret: KBSV_CLIENT_SECRET,
    })

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString(),
    })

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text()
      console.error('[kbsv/callback] Token exchange failed:', errBody)
      return NextResponse.redirect(
        `${APP_URL}${dashboardPath}?kbsv=error&reason=token_exchange_failed`
      )
    }

    const tokens = await tokenRes.json() as {
      access_token: string
      refresh_token: string
      expires_in: number              // ~17999s (~5h)
      refresh_expires_in: number     // ~1727963s (~20 ngày)
      token_type: string
      session_state: string
    }

    // 3. Lưu tokens vào Supabase (encrypted bởi Supabase RLS + service role)
    // Token KHÔNG được expose ra client bao giờ
    const accessExpiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    const refreshExpiresAt = new Date(Date.now() + tokens.refresh_expires_in * 1000).toISOString()

    const { error: upsertError } = await supabase
      .from('kbsv_tokens')
      .upsert({
        advisor_user_id: advisorUserId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        access_expires_at: accessExpiresAt,
        refresh_expires_at: refreshExpiresAt,
        session_state: tokens.session_state ?? null,
        connected_at: new Date().toISOString(),
        status: 'active',
        // Sync flags — reset về false để trigger sync mới
        order_history_enabled: true,
        portfolio_enabled: true,
        last_order_sync_at: null,
        last_portfolio_sync_at: null,
      }, {
        onConflict: 'advisor_user_id'
      })

    if (upsertError) {
      console.error('[kbsv/callback] Failed to store tokens:', upsertError)
      return NextResponse.redirect(
        `${APP_URL}${dashboardPath}?kbsv=error&reason=storage_failed`
      )
    }

    // 4. Cleanup state record (dùng 1 lần)
    await supabase.from('kbsv_oauth_states').delete().eq('state', state)

    console.log(`[kbsv/callback] ✅ Connected KBSV for user: ${advisorUserId}`)

    // Upgrade user to SILVER tier and grant 200 credits
    const { error: upgradeError } = await supabase
      .from('advisor_users')
      .update({
        stockpick_plan: 'silver',
        stockspick_credits: 200
      })
      .eq('id', advisorUserId)

    if (upgradeError) {
      console.error('[kbsv/callback] Failed to upgrade user to SILVER:', upgradeError)
    }

    // 5. Redirect về dashboard với success flag
    return NextResponse.redirect(
      `${APP_URL}${dashboardPath}?kbsv=connected`
    )
  } catch (err) {
    console.error('[kbsv/callback] Unexpected error:', err)
    return NextResponse.redirect(
      `${APP_URL}${dashboardPath}?kbsv=error&reason=internal_error`
    )
  }
}
