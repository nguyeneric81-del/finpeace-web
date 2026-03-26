import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADVISOR_JWT_SECRET = new TextEncoder().encode(
  (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').slice(0, 32)
)

async function verifyAdvisorToken(token: string): Promise<{ role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, ADVISOR_JWT_SECRET)
    return { role: payload.role as string }
  } catch {
    return null
  }
}

// Roles cho phép truy cập Zone 2 (Trading) — advisor subdomain
const TRADING_ROLES = ['admin', 'agent', 'customer_trading', 'customer_trading_kb']

// Routes trong advisor không yêu cầu auth (public)
const ADVISOR_PUBLIC_PATHS = [
  '/advisor/login',
  '/advisor/register',
  '/advisor/landing-discipline',
  '/advisor/landing-plan',
  '/advisor/landing-trust',
  '/advisor/agent/login',   // Agent login — public
]

// Roles cho phép vào Agent Portal
const AGENT_ROLES = ['admin', 'agent']


export async function updateSession(request: NextRequest) {
    const url = request.nextUrl.clone()
    let supabaseResponse = NextResponse.next({ request });

    // Trả về luôn nếu là request tới next js assets / api
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
        return supabaseResponse;
    }

    const hostname = request.headers.get('host') || ''
    const forwardedHost = request.headers.get('x-forwarded-host') || ''
    const isAdvisorFlow = hostname === 'advisor.finpeace.cloud' || forwardedHost === 'advisor.finpeace.cloud' || hostname.startsWith('advisor.localhost')
    const effectivePath = request.nextUrl.pathname;
    const isProd = process.env.NODE_ENV === 'production';

    // --- ADVISOR SUBDOMAIN (advisor.finpeace.cloud) ---
    if (isAdvisorFlow) {
        // Rewrite ngầm request (giữ nguyên URL của người dùng)
        if (!effectivePath.startsWith('/advisor')) {
            const advisorUrl = request.nextUrl.clone()
            advisorUrl.pathname = `/advisor${effectivePath === '/' ? '' : effectivePath}`
            return NextResponse.rewrite(advisorUrl)
        }

        const rawPath = effectivePath.startsWith('/advisor') ? effectivePath : `/advisor${effectivePath}`

        // Routes public — không cần auth (login, register, landing pages)
        const isAdvisorPublic = ADVISOR_PUBLIC_PATHS.some(p => rawPath.startsWith(p))
        if (isAdvisorPublic) return supabaseResponse

        // ── AUTH: Verify advisor_token JWT (nguồn sự thật duy nhất) ──
        // Role được lấy từ advisor_users table lúc login → in vào JWT
        // Thêm/xóa admin: chỉ cần đổi role trong DB, token mới sẽ reflect ngay
        const advisorToken = request.cookies.get('advisor_token')?.value
        const tokenPayload = advisorToken ? await verifyAdvisorToken(advisorToken) : null
        const advisorRole = tokenPayload?.role

        const redirect = (path: string, errorKey?: string) => {
            const u = request.nextUrl.clone()
            u.pathname = path
            if (errorKey) u.searchParams.set('error', errorKey)
            return NextResponse.redirect(u)
        }

        // /advisor/admin — yêu cầu role admin (advisor_token)
        if (rawPath.startsWith('/advisor/admin')) {
            if (!advisorRole) return redirect('/advisor/login')
            if (advisorRole !== 'admin') return redirect('/advisor', 'unauthorized')
        }

        // /advisor/agent/dashboard — Agent dùng Supabase Auth riêng (không phải advisor_token)
        if (rawPath.startsWith('/advisor/agent/dashboard')) {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookieOptions: { name: 'finpeace-auth', domain: '.finpeace.cloud' },
                    cookies: {
                        getAll() { return request.cookies.getAll() },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                            supabaseResponse = NextResponse.next({ request })
                            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
                        },
                    },
                }
            )
            const { data: { user } } = await supabase.auth.getUser()
            const agentRole = user?.app_metadata?.role as string | undefined
            if (!user) return redirect('/advisor/agent/login')
            if (!agentRole || !AGENT_ROLES.includes(agentRole)) return redirect('/advisor/agent/login', 'access_denied')
        }

        // /advisor/dashboard, /advisor/trading-plan — yêu cầu role trong TRADING_ROLES (advisor_token)
        const requiresTrading =
            rawPath.startsWith('/advisor/dashboard') ||
            rawPath.startsWith('/advisor/trading-plan') ||
            rawPath.startsWith('/advisor/macro-insights')
        if (requiresTrading) {
            if (!advisorRole) return redirect('/advisor/login')
            if (!TRADING_ROLES.includes(advisorRole)) return redirect('/advisor/login', 'access_denied')
        }

        return supabaseResponse
    }



    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: isProd ? { name: 'finpeace-auth', domain: '.finpeace.cloud' } : { name: 'finpeace-auth' },
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value)
                    })
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Gọi api để tự động refresh token nếu cần
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Danh sách các route public (không yêu cầu đăng nhập)
    const isPublicRoute =
        effectivePath.startsWith('/login') ||
        effectivePath.startsWith('/auth') ||
        effectivePath.startsWith('/api/agent') ||
        (effectivePath.startsWith('/advisor') && !effectivePath.startsWith('/advisor/admin')) || // admin cần auth
        effectivePath.startsWith('/knowledgebase') || // KB là public content
        effectivePath.startsWith('/training') || // Training Deck là public content
        effectivePath.startsWith('/lp') || // Sales landing pages - public
        effectivePath.startsWith('/monitor') || // Monitor & agent performance pages - public
        effectivePath === '/monitor.html' ||
        effectivePath === '/'

    // Bảo vệ /advisor/admin trên main domain
    if (effectivePath.startsWith('/advisor/admin')) {
        const isAdmin = user?.app_metadata?.role === 'admin'
        if (!user) {
            const loginUrl = request.nextUrl.clone()
            loginUrl.pathname = '/login'
            return NextResponse.redirect(loginUrl)
        }
        if (!isAdmin) {
            const forbiddenUrl = request.nextUrl.clone()
            forbiddenUrl.pathname = '/'
            forbiddenUrl.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(forbiddenUrl)
        }
    }

    if (!user && !isPublicRoute) {
        // Không có user, điều hướng về trang chủ hoặc trang đăng nhập
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        return NextResponse.redirect(redirectUrl)
    }

    // Khỏi vào login nếu đã đăng nhập
    if (user && effectivePath.startsWith('/login')) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}
