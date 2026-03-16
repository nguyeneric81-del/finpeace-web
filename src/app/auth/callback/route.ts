import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')

    const supabase = await createClient()

    if (code) {
        // OAuth callback
        await supabase.auth.exchangeCodeForSession(code)
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }

    if (token_hash && type === 'signup') {
        // Email confirmation callback
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: 'signup' })
        if (!error) {
            // Confirm thành công → về login với thông báo
            return NextResponse.redirect(
                new URL('/login?message=' + encodeURIComponent('✅ Xác nhận thành công! Đăng nhập bằng email và mật khẩu vừa tạo.'), requestUrl.origin)
            )
        }
        // Lỗi xác nhận
        return NextResponse.redirect(
            new URL('/login?message=' + encodeURIComponent('❌ Link xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.'), requestUrl.origin)
        )
    }

    // Default fallback
    return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
