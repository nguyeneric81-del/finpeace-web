import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const url = request.nextUrl.clone()
    let supabaseResponse = NextResponse.next({ request });

    // Trả về luôn nếu là request tới next js assets / api
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
        return supabaseResponse;
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
        effectivePath.startsWith('/advisor') || // Cho phép route advisor tư do
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
