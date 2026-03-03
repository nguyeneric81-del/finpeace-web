import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

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
        // Xác thực JWT từ cookie
        const token = req.cookies.get('advisor_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        let userId: string
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET)
            userId = payload.sub as string
        } catch {
            return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
        }

        const { current_password, new_password } = await req.json()

        if (!current_password || !new_password) {
            return NextResponse.json({ error: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' }, { status: 400 })
        }

        if (new_password.length < 6) {
            return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
        }

        // Lấy user từ DB
        const { data: user, error: fetchErr } = await supabase
            .from('advisor_users')
            .select('password_hash')
            .eq('id', userId)
            .single()

        if (fetchErr || !user) {
            return NextResponse.json({ error: 'Không tìm thấy tài khoản' }, { status: 404 })
        }

        // Verify mật khẩu hiện tại
        const hashedCurrent = await hashPassword(current_password)
        if (hashedCurrent !== user.password_hash) {
            return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
        }

        // Cập nhật mật khẩu mới
        const hashedNew = await hashPassword(new_password)
        const { error: updateErr } = await supabase
            .from('advisor_users')
            .update({ password_hash: hashedNew })
            .eq('id', userId)

        if (updateErr) {
            return NextResponse.json({ error: 'Không thể cập nhật mật khẩu' }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công!' })

    } catch (err) {
        console.error('Change password error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
