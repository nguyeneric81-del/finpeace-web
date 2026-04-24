import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KBSV_API_URL = process.env.KBSV_API_URL ?? 'https://mablesasapiuat.kbsec.com.vn/kb-connect-api-2'
const KBSV_OPENID_URL = process.env.KBSV_OPENID_URL ?? 'https://openiduat.kbsec.com.vn/keycloak'
const KBSV_CLIENT_ID = process.env.KBSV_CLIENT_ID ?? 'finpeace'
const KBSV_CLIENT_SECRET = process.env.KBSV_CLIENT_SECRET ?? ''
const KBSV_DEVICE_ID = process.env.KBSV_DEVICE_ID ?? 'FINPEACE-SERVER-0001'

// Mapping endpoint → KBSV service path
const ENDPOINT_MAP: Record<string, { service: 'profile' | 'order', path: string, method: 'GET' | 'POST' }> = {
  'accounts':          { service: 'profile', path: '/api/v1/accounts',           method: 'GET' },
  'portfolio':         { service: 'profile', path: '/api/v1/portfolio',           method: 'GET' },
  'account-assets':    { service: 'profile', path: '/api/v1/account-assets',      method: 'GET' },
  'available-trade':   { service: 'profile', path: '/api/v1/available-trade',     method: 'GET' },
  'orders':            { service: 'profile', path: '/api/v1/orders',              method: 'GET' },
  'order-match':       { service: 'profile', path: '/api/v1/order-match',         method: 'GET' },
  'cash-statement-his':{ service: 'profile', path: '/api/v1/cash-statement-his',  method: 'GET' },
  'get-account-trans': { service: 'profile', path: '/api/v1/get-account-trans',   method: 'GET' },
  'encrypt':           { service: 'order',   path: '/api/v1/encrypt',             method: 'POST' },
  'otp-send':          { service: 'order',   path: '/api/v1/otp/send',            method: 'POST' },
  'place-order':       { service: 'order',   path: '/api/v1/place-order',         method: 'POST' },
  'cancel-order':      { service: 'order',   path: '/api/v1/cancel-order',        method: 'POST' },
  'update-order':      { service: 'order',   path: '/api/v1/update-order',        method: 'POST' },
}

async function refreshTokenIfNeeded(userId: string, tokenRow: Record<string, string>) {
  const accessExpiry = new Date(tokenRow.access_expires_at)
  const now = new Date()
  
  // Còn > 5 phút thì dùng luôn
  if (accessExpiry.getTime() - now.getTime() > 5 * 60 * 1000) {
    return tokenRow.access_token
  }

  // Refresh token
  console.log(`[kbsv/proxy] Refreshing token for user ${userId}`)
  const refreshUrl = `${KBSV_OPENID_URL}/realms/kbsv/protocol/openid-connect/token`
  const resp = await fetch(refreshUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokenRow.refresh_token,
      client_id: KBSV_CLIENT_ID,
      client_secret: KBSV_CLIENT_SECRET,
    }).toString(),
  })

  if (!resp.ok) {
    console.error(`[kbsv/proxy] Token refresh failed: ${resp.status}`)
    // Mark token as expired in DB
    await supabase.from('kbsv_tokens')
      .update({ status: 'expired' })
      .eq('advisor_user_id', userId)
    throw new Error('token_expired')
  }

  const newTokens = await resp.json()
  const newExpiry = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()
  const newRefreshExpiry = new Date(Date.now() + newTokens.refresh_expires_in * 1000).toISOString()

  await supabase.from('kbsv_tokens').update({
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token,
    access_expires_at: newExpiry,
    refresh_expires_at: newRefreshExpiry,
    status: 'active',
  }).eq('advisor_user_id', userId)

  return newTokens.access_token as string
}

/**
 * GET/POST /api/kbsv/proxy/[endpoint]?advisor_user_id=xxx&...params
 * 
 * Server-side proxy đến KBSV APIs. Request xuất phát từ server finpeace.cloud
 * → bypass WAF của KBSV (KBSV chỉ accept request từ server IP đã whitelist).
 * 
 * Token được lấy từ Supabase (KHÔNG expose ra client).
 * Auto-refresh nếu access_token sắp hết hạn.
 */
async function handleRequest(
  req: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params
  const url = new URL(req.url)
  const advisorUserId = url.searchParams.get('advisor_user_id')

  // Validate endpoint
  const endpointConfig = ENDPOINT_MAP[endpoint]
  if (!endpointConfig) {
    return NextResponse.json({ ok: false, error: `Unknown endpoint: ${endpoint}` }, { status: 400 })
  }

  if (!advisorUserId) {
    return NextResponse.json({ ok: false, error: 'Missing advisor_user_id' }, { status: 400 })
  }

  try {
    // 1. Load token từ Supabase
    const { data: tokenRow, error: tokenError } = await supabase
      .from('kbsv_tokens')
      .select('access_token, refresh_token, access_expires_at, refresh_expires_at, status')
      .eq('advisor_user_id', advisorUserId)
      .single()

    if (tokenError || !tokenRow) {
      return NextResponse.json({ 
        ok: false, error: 'KBSV account not connected. Please connect via /api/kbsv/auth' 
      }, { status: 401 })
    }

    if (tokenRow.status === 'expired' || tokenRow.status === 'revoked') {
      return NextResponse.json({ 
        ok: false, error: 'KBSV token expired. Please reconnect.' 
      }, { status: 401 })
    }

    // 2. Auto-refresh nếu cần
    const accessToken = await refreshTokenIfNeeded(advisorUserId, tokenRow)

    // 3. Build KBSV request
    const kbsvBase = `${KBSV_API_URL.replace(/\/$/, '')}/${endpointConfig.service}`
    let kbsvUrl = `${kbsvBase}${endpointConfig.path}`

    // Forward query params (trừ advisor_user_id)
    const forwardParams = new URLSearchParams()
    url.searchParams.forEach((value, key) => {
      if (key !== 'advisor_user_id') forwardParams.append(key, value)
    })
    if (endpointConfig.method === 'GET' && forwardParams.toString()) {
      kbsvUrl += `?${forwardParams.toString()}`
    }

    const kbsvHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-device': KBSV_DEVICE_ID,
      'x-devicetype': 'UDID',
      'x-client-id': '1.1.1.1',
      'x-lang': 'vi',
    }

    let kbsvBody: string | undefined = undefined
    if (endpointConfig.method === 'POST') {
      const reqBody = await req.json().catch(() => ({}))
      kbsvBody = JSON.stringify(reqBody)
    }

    // 4. Gọi KBSV (từ server → IP finpeace.cloud)
    console.log(`[kbsv/proxy] ${endpointConfig.method} ${kbsvUrl}`)
    const kbsvResp = await fetch(kbsvUrl, {
      method: endpointConfig.method,
      headers: kbsvHeaders,
      body: kbsvBody,
    })

    const kbsvData = await kbsvResp.json().catch(() => ({ s: 'error', em: 'Invalid JSON response' }))

    // 5. Log lỗi nếu có
    if (kbsvData.s === 'error') {
      console.warn(`[kbsv/proxy] KBSV error for ${endpoint}:`, kbsvData)
    }

    return NextResponse.json({
      ok: kbsvData.s === 'ok',
      data: kbsvData.d ?? null,
      kbsv_status: kbsvData.s,
      kbsv_ec: kbsvData.ec,
      kbsv_em: kbsvData.em,
    }, { status: kbsvResp.status === 200 ? 200 : 400 })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    if (message === 'token_expired') {
      return NextResponse.json({ ok: false, error: 'KBSV token expired. Please reconnect.' }, { status: 401 })
    }
    console.error(`[kbsv/proxy] Unexpected error:`, err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export const GET = handleRequest
export const POST = handleRequest
