import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SignJWT } from 'jose'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = new TextEncoder().encode(
    process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 32)
)

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 12))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
        }

        // Tìm user
        const { data: user, error } = await supabase
            .from('advisor_users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single()

        if (error || !user) {
            return NextResponse.json({ error: 'Email không tồn tại trong hệ thống' }, { status: 401 })
        }

        // Verify password
        const hashedInput = await hashPassword(password)
        if (hashedInput !== user.password_hash) {
            return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
        }

        // Tạo JWT token (7 ngày)
        const token = await new SignJWT({
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.full_name
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET)

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, role: user.role, name: user.full_name }
        })

        // Set HTTP-only cookie
        response.cookies.set('advisor_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 ngày
        })

        return response

    } catch (err) {
        console.error('Login error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
