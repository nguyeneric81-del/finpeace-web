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
        const normalizedEmail = email?.toLowerCase().trim()

        if (!normalizedEmail || !password) {
            return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
        }

        // ── Path 1: Tìm trong advisor_users (custom auth) ──
        const { data: advisorUser } = await supabase
            .from('advisor_users')
            .select('*')
            .eq('email', normalizedEmail)
            .single()

        if (advisorUser) {
            const hashedInput = await hashPassword(password)
            if (hashedInput !== advisorUser.password_hash) {
                return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
            }
            const token = await new SignJWT({
                sub: advisorUser.id, email: advisorUser.email,
                role: advisorUser.role, name: advisorUser.full_name,
                investor_type: advisorUser.investor_type
            }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(JWT_SECRET)

            const response = NextResponse.json({
                success: true,
                user: { id: advisorUser.id, email: advisorUser.email, role: advisorUser.role, name: advisorUser.full_name, investor_type: advisorUser.investor_type }
            })
            response.cookies.set('advisor_token', token, {
                httpOnly: true, secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', maxAge: 60 * 60 * 24 * 7
            })
            return response
        }

        // ── Path 2: Fallback — Supabase Auth (cho admin từ hệ thống chính) ──
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail, password
        })

        if (authError || !authData?.user) {
            return NextResponse.json({ error: 'Email không tồn tại trong hệ thống' }, { status: 401 })
        }

        // Lấy role từ profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', authData.user.id)
            .single()

        const role = profile?.role ?? 'customer'
        const fullName = profile?.full_name ?? ''

        // Sign out khỏi Supabase Auth session (chỉ dùng JWT internal)
        await supabase.auth.signOut()

        const token = await new SignJWT({
            sub: authData.user.id, email: normalizedEmail,
            role, name: fullName, investor_type: null
        }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(JWT_SECRET)

        const response = NextResponse.json({
            success: true,
            user: { id: authData.user.id, email: normalizedEmail, role, name: fullName, investor_type: null }
        })
        response.cookies.set('advisor_token', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', maxAge: 60 * 60 * 24 * 7
        })
        return response

    } catch (err) {
        console.error('Login error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
