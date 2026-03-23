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
        // Rewrite ngầm request (giữ nguyên URL của người dùng) để gọi nội dung từ thư mục /advisor
        if (!effectivePath.startsWith('/advisor')) {
            const advisorUrl = request.nextUrl.clone()
            advisorUrl.pathname = `/advisor${effectivePath === '/' ? '' : effectivePath}`
            return NextResponse.rewrite(advisorUrl)
        }

        const rawPath = effectivePath.startsWith('/advisor') ? effectivePath : `/advisor${effectivePath}`

        // Routes public — không cần auth
        const isAdvisorPublic = ADVISOR_PUBLIC_PATHS.some(p => rawPath.startsWith(p))
        if (isAdvisorPublic) return supabaseResponse;

        // Các trang cần auth — tạo supabase client
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
        const userRole = user?.app_metadata?.role as string | undefined

        // Guard: /advisor/admin — chỉ admin
        if (rawPath.startsWith('/advisor/admin')) {
            // Kiểm tra advisor_token (custom auth từ advisor login)
            const advisorToken = request.cookies.get('advisor_token')?.value
            if (advisorToken) {
                const payload = await verifyAdvisorToken(advisorToken)
                if (payload?.role === 'admin') return supabaseResponse // ✅ Pass
            }
            // Fallback: Supabase Auth
            if (!user) {
                const loginUrl = request.nextUrl.clone()
                loginUrl.pathname = '/advisor/login'
                return NextResponse.redirect(loginUrl)
            }
            if (userRole !== 'admin') {
                const forbiddenUrl = request.nextUrl.clone()
                forbiddenUrl.pathname = '/advisor'
                forbiddenUrl.searchParams.set('error', 'unauthorized')
                return NextResponse.redirect(forbiddenUrl)
            }
        }

        // Guard: /advisor/dashboard, /advisor/trading-plan, /advisor/macro-insights
        // Yêu cầu role thuộc zone Trading
        const requiresTradingZone =
            rawPath.startsWith('/advisor/dashboard') ||
            rawPath.startsWith('/advisor/trading-plan') ||
            rawPath.startsWith('/advisor/macro-insights')

        if (requiresTradingZone) {
            if (!user) {
                const loginUrl = request.nextUrl.clone()
                loginUrl.pathname = '/advisor/login'
                return NextResponse.redirect(loginUrl)
            }
            if (!userRole || !TRADING_ROLES.includes(userRole)) {
                const forbiddenUrl = request.nextUrl.clone()
                forbiddenUrl.pathname = '/advisor/login'
                forbiddenUrl.searchParams.set('error', 'access_denied')
                return NextResponse.redirect(forbiddenUrl)
            }
        }

        // Guard: /advisor/agent/dashboard — chỉ agent + admin
        if (rawPath.startsWith('/advisor/agent/dashboard')) {
            if (!user) {
                const loginUrl = request.nextUrl.clone()
                loginUrl.pathname = '/advisor/agent/login'
                return NextResponse.redirect(loginUrl)
            }
            if (!userRole || !AGENT_ROLES.includes(userRole)) {
                const forbiddenUrl = request.nextUrl.clone()
                forbiddenUrl.pathname = '/advisor/agent/login'
                forbiddenUrl.searchParams.set('error', 'access_denied')
                return NextResponse.redirect(forbiddenUrl)
            }
        }

        return supabaseResponse;
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
