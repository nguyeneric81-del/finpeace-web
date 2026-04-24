import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KBSV_API_URL    = process.env.KBSV_API_URL    ?? 'https://mablesasapiuat.kbsec.com.vn/kb-connect-api-2'
const KBSV_OPENID_URL = process.env.KBSV_OPENID_URL ?? 'https://openiduat.kbsec.com.vn/keycloak'
const KBSV_CLIENT_ID  = process.env.KBSV_CLIENT_ID  ?? 'finpeace'
const KBSV_CLIENT_SECRET = process.env.KBSV_CLIENT_SECRET ?? ''
const KBSV_DEVICE_ID  = process.env.KBSV_DEVICE_ID  ?? 'FINPEACE-SERVER-0001'

// Endpoints that require JWE-encrypted body (auto-encrypted by proxy)
const ENCRYPTED_ENDPOINTS = new Set(['otp-send', 'place-order', 'cancel-order', 'update-order'])

const ENDPOINT_MAP: Record<string, { service: 'profile' | 'order', path: string, method: 'GET' | 'POST' }> = {
  // Read-only (profile service)
  'accounts':           { service: 'profile', path: '/api/v1/accounts',           method: 'GET'  },
  'portfolio':          { service: 'profile', path: '/api/v1/portfolio',           method: 'GET'  },
  'account-assets':     { service: 'profile', path: '/api/v1/account-assets',      method: 'GET'  },
  'available-trade':    { service: 'profile', path: '/api/v1/available-trade',     method: 'GET'  },
  'orders':             { service: 'profile', path: '/api/v1/orders',              method: 'GET'  },
  'order-match':        { service: 'profile', path: '/api/v1/order-match',         method: 'GET'  },
  'cash-statement-his': { service: 'profile', path: '/api/v1/cash-statement-his',  method: 'GET'  },
  'get-account-trans':  { service: 'profile', path: '/api/v1/get-account-trans',   method: 'GET'  },
  // Encrypt helper (order service, UAT only)
  'encrypt':            { service: 'order',   path: '/api/v1/encrypt',             method: 'POST' },
  // Mutations (order service, auto-encrypted by proxy)
  'otp-send':           { service: 'order',   path: '/api/v1/otp/send',            method: 'POST' },
  'place-order':        { service: 'order',   path: '/api/v1/place-order',         method: 'POST' },
  'cancel-order':       { service: 'order',   path: '/api/v1/cancel-order',        method: 'POST' },
  'update-order':       { service: 'order',   path: '/api/v1/update-order',        method: 'POST' },
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function makeKbsvHeaders(token: string, contentType = 'application/json'): HeadersInit {
  return {
    'Content-Type': contentType,
    'Authorization': `Bearer ${token}`,
    'x-device': KBSV_DEVICE_ID,
    'x-devicetype': 'UDID',
    'x-client-id': '1.1.1.1',
    'x-lang': 'vi',
  }
}

/** Call KBSV /api/v1/encrypt — returns raw encrypted string/object */
async function kbsvEncrypt(token: string, plaintext: object): Promise<string | null> {
  const encryptUrl = `${KBSV_API_URL}/order/api/v1/encrypt`
  const resp = await fetch(encryptUrl, {
    method: 'POST',
    headers: makeKbsvHeaders(token),
    body: JSON.stringify(plaintext),
  })

  const text = await resp.text()
  console.log(`[kbsv/encrypt] status=${resp.status} body=${text.slice(0, 200)}`)

  if (!resp.ok) return null

  // Try parse as JSON — if KBSV wraps in {s,d}, extract d
  try {
    const json = JSON.parse(text)
    if (json.d !== undefined) return typeof json.d === 'string' ? json.d : JSON.stringify(json.d)
    if (json.data !== undefined) return typeof json.data === 'string' ? json.data : JSON.stringify(json.data)
    // Return the whole JSON as string if no wrapper
    return text
  } catch {
    // Raw string (JWE compact)
    return text
  }
}

// ─── TOKEN MANAGEMENT ─────────────────────────────────────────────────────────

async function refreshTokenIfNeeded(userId: string, tokenRow: Record<string, string>) {
  const accessExpiry = new Date(tokenRow.access_expires_at)
  if (accessExpiry.getTime() - Date.now() > 5 * 60 * 1000) return tokenRow.access_token

  console.log(`[kbsv/proxy] Refreshing token for user ${userId}`)
  const resp = await fetch(
    `${KBSV_OPENID_URL}/realms/kbsv/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token: tokenRow.refresh_token,
        client_id:     KBSV_CLIENT_ID,
        client_secret: KBSV_CLIENT_SECRET,
      }).toString(),
    }
  )

  if (!resp.ok) {
    await supabase.from('kbsv_tokens').update({ status: 'expired' }).eq('advisor_user_id', userId)
    throw new Error('token_expired')
  }

  const t = await resp.json()
  await supabase.from('kbsv_tokens').update({
    access_token:       t.access_token,
    refresh_token:      t.refresh_token,
    access_expires_at:  new Date(Date.now() + t.expires_in * 1000).toISOString(),
    refresh_expires_at: new Date(Date.now() + t.refresh_expires_in * 1000).toISOString(),
    status: 'active',
  }).eq('advisor_user_id', userId)

  return t.access_token as string
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

/**
 * GET/POST /api/kbsv/proxy/[endpoint]?advisor_user_id=xxx&...params
 *
 * Server-side proxy to KBSV APIs.
 * - Loads token from Supabase (never exposed to client)
 * - Auto-refreshes access_token when near expiry
 * - For mutation endpoints (otp-send, place-order, etc.): auto-encrypts body via /api/v1/encrypt
 * - For `encrypt` endpoint: returns raw KBSV response
 */
async function handleRequest(req: Request, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params
  const url = new URL(req.url)
  const advisorUserId = url.searchParams.get('advisor_user_id')

  const endpointConfig = ENDPOINT_MAP[endpoint]
  if (!endpointConfig) {
    return NextResponse.json({ ok: false, error: `Unknown endpoint: ${endpoint}` }, { status: 400 })
  }
  if (!advisorUserId) {
    return NextResponse.json({ ok: false, error: 'Missing advisor_user_id' }, { status: 400 })
  }

  try {
    // Load token
    const { data: tokenRow, error: tokenError } = await supabase
      .from('kbsv_tokens')
      .select('access_token, refresh_token, access_expires_at, refresh_expires_at, status')
      .eq('advisor_user_id', advisorUserId)
      .single()

    if (tokenError || !tokenRow) {
      return NextResponse.json({ ok: false, error: 'KBSV account not connected. Please connect via /api/kbsv/auth' }, { status: 401 })
    }
    if (tokenRow.status === 'expired' || tokenRow.status === 'revoked') {
      return NextResponse.json({ ok: false, error: 'KBSV token expired. Please reconnect.' }, { status: 401 })
    }

    const accessToken = await refreshTokenIfNeeded(advisorUserId, tokenRow)

    // Build KBSV URL
    const kbsvBase = `${KBSV_API_URL.replace(/\/$/, '')}/${endpointConfig.service}`
    let kbsvUrl = `${kbsvBase}${endpointConfig.path}`

    // Forward query params (exclude advisor_user_id)
    const forwardParams = new URLSearchParams()
    url.searchParams.forEach((v, k) => { if (k !== 'advisor_user_id') forwardParams.append(k, v) })
    if (endpointConfig.method === 'GET' && forwardParams.toString()) {
      kbsvUrl += `?${forwardParams.toString()}`
    }

    let kbsvBody: string | undefined
    let kbsvContentType = 'application/json'

    if (endpointConfig.method === 'POST') {
      const reqBody = await req.json().catch(() => ({}))

      if (ENCRYPTED_ENDPOINTS.has(endpoint)) {
        // Auto-encrypt via KBSV helper (UAT) before sending
        console.log(`[kbsv/proxy] Auto-encrypting body for ${endpoint}`)
        const encrypted = await kbsvEncrypt(accessToken, reqBody)
        if (!encrypted) {
          return NextResponse.json({ ok: false, error: 'Encrypt step failed. KBSV /api/v1/encrypt returned no data.' }, { status: 502 })
        }
        kbsvBody = encrypted
        kbsvContentType = 'text/plain'  // KBSV expects encrypted body as text/plain
      } else {
        // Regular JSON body (e.g., encrypt endpoint itself)
        kbsvBody = JSON.stringify(reqBody)
      }
    }

    // Call KBSV
    console.log(`[kbsv/proxy] ${endpointConfig.method} ${kbsvUrl}`)
    const kbsvResp = await fetch(kbsvUrl, {
      method:  endpointConfig.method,
      headers: makeKbsvHeaders(accessToken, kbsvContentType),
      body:    kbsvBody,
    })

    const respText = await kbsvResp.text()
    console.log(`[kbsv/proxy] ${endpoint} → ${kbsvResp.status}: ${respText.slice(0, 300)}`)

    // Special case: encrypt endpoint returns raw JWE string
    if (endpoint === 'encrypt') {
      return NextResponse.json({
        ok:        kbsvResp.ok,
        encrypted: respText,  // raw JWE compact or JSON string
        status:    kbsvResp.status,
      })
    }

    // Standard JSON response
    let kbsvData: Record<string, unknown> = {}
    try { kbsvData = JSON.parse(respText) } catch { kbsvData = { raw: respText } }

    if (kbsvData.s === 'error') {
      console.warn(`[kbsv/proxy] KBSV error for ${endpoint}:`, kbsvData)
    }

    return NextResponse.json({
      ok:          kbsvData.s === 'ok',
      data:        kbsvData.d ?? null,
      kbsv_status: kbsvData.s,
      kbsv_ec:     kbsvData.ec,
      kbsv_em:     kbsvData.em,
    }, { status: kbsvResp.ok ? 200 : 400 })

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error'
    if (msg === 'token_expired') {
      return NextResponse.json({ ok: false, error: 'KBSV token expired. Please reconnect.' }, { status: 401 })
    }
    console.error('[kbsv/proxy] Unexpected error:', err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export const GET  = handleRequest
export const POST = handleRequest
