import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const forwardedHost = request.headers.get('x-forwarded-host') || ''
    const isAdvisorFlow = hostname === 'advisor.finpeace.cloud' || forwardedHost === 'advisor.finpeace.cloud' || hostname.startsWith('advisor.localhost')
    const url = request.nextUrl.clone()

    // THAY ĐỔI LỚN: Nếu đây là luồng Advisor, ta lập tức cắt đường truyền lưu lượng và trả thẳng về NextResponse.rewrite, 
    // không thèm khởi tạo CreateServerClient Supabase để kiểm tra Cookie Auth làm gì nữa.
    if (isAdvisorFlow) {
        // Trừ khi url gọi API thì thả qua để app hoạt động bình thường
        if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
            if (!url.pathname.startsWith('/advisor')) {
                url.pathname = `/advisor${url.pathname === '/' ? '' : url.pathname}`
                return NextResponse.rewrite(url, { request })
            }
            return NextResponse.next({ request });
        }
    }

    // Khởi tạo Response mặc định cho luồng User thông thường
    let supabaseResponse = NextResponse.next({ request });

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
                    supabaseResponse = NextResponse.next({
                        request,
                    })
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

    // Lấy đường dẫn thực tế 
    const effectivePath = request.nextUrl.pathname;

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
