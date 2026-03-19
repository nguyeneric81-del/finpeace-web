import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

    // --- TỐI ƯU HIỆU NĂNG CHO ADVISOR SUBDOMAIN ---
    // Bypass hoàn toàn Supabase Auth Check để tăng tốc độ tải
    if (isAdvisorFlow) {
        // Rewrite ngầm request (giữ nguyên URL của người dùng) để gọi nội dung từ thư mục /advisor
        if (!effectivePath.startsWith('/advisor')) {
            const advisorUrl = request.nextUrl.clone()
            advisorUrl.pathname = `/advisor${effectivePath === '/' ? '' : effectivePath}`
            return NextResponse.rewrite(advisorUrl)
        }

        // Bảo vệ /advisor/admin — phải check role
        const rawPath = effectivePath.startsWith('/advisor') ? effectivePath : `/advisor${effectivePath}`
        if (rawPath.startsWith('/advisor/admin')) {
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
            const isAdmin = user?.app_metadata?.role === 'admin'
            if (!user) {
                const loginUrl = request.nextUrl.clone()
                loginUrl.pathname = '/advisor/login'
                return NextResponse.redirect(loginUrl)
            }
            if (!isAdmin) {
                const forbiddenUrl = request.nextUrl.clone()
                forbiddenUrl.pathname = '/advisor'
                forbiddenUrl.searchParams.set('error', 'unauthorized')
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
