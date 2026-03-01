import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const isAdvisorFlow = hostname === 'advisor.finpeace.cloud' || hostname.startsWith('advisor.localhost')
    const url = request.nextUrl.clone()

    // Khởi tạo Response mặc định hoặc Cấu hình Rewrite URL nếu là Subdomain Advisor
    let supabaseResponse: NextResponse;
    const shouldRewriteToAdvisor = isAdvisorFlow && !url.pathname.startsWith('/advisor') && !url.pathname.startsWith('/_next') && !url.pathname.startsWith('/api');

    if (shouldRewriteToAdvisor) {
        url.pathname = `/advisor${url.pathname === '/' ? '' : url.pathname}`
        supabaseResponse = NextResponse.rewrite(url, { request })
    } else {
        supabaseResponse = NextResponse.next({ request })
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

                    if (shouldRewriteToAdvisor) {
                        const rewriteUrl = request.nextUrl.clone()
                        rewriteUrl.pathname = `/advisor${rewriteUrl.pathname === '/' ? '' : rewriteUrl.pathname}`
                        supabaseResponse = NextResponse.rewrite(rewriteUrl, { request })
                    } else {
                        supabaseResponse = NextResponse.next({ request })
                    }

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Gọi api để tự động refresh token nếu cần
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Lấy đường dẫn thực tế (đã rewrite hoặc chưa)
    const effectivePath = shouldRewriteToAdvisor ? url.pathname : request.nextUrl.pathname;

    // Nếu đang ở luồng Advisor Flow, ta Bypass auth ở cấp độ Middleware 
    // Hệ thống Subdomain này phục vụ trình chiếu trên iPad, không cần đăng nhập auth cứng ngắc.
    if (isAdvisorFlow) {
        return supabaseResponse;
    }

    // Danh sách các route public (không yêu cầu đăng nhập)
    const isPublicRoute =
        effectivePath.startsWith('/login') ||
        effectivePath.startsWith('/auth') ||
        effectivePath.startsWith('/api/agent') ||
        effectivePath === '/';

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
