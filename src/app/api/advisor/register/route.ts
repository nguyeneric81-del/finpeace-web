import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

function generatePassword(length = 8): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 12))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
    try {
        const { email, phone, full_name } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
        }

        // Kiểm tra email đã tồn tại chưa
        const { data: existing } = await supabase
            .from('advisor_users')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Email đã được đăng ký. Vui lòng đăng nhập.' }, { status: 409 })
        }

        // Tạo mật khẩu ngẫu nhiên
        const plainPassword = generatePassword()
        const hashedPassword = await hashPassword(plainPassword)

        // Lưu vào Supabase
        const { data: newUser, error: insertError } = await supabase
            .from('advisor_users')
            .insert({
                email,
                phone: phone || null,
                full_name: full_name || null,
                password_hash: hashedPassword,
                role: 'customer'
            })
            .select('id, email')
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            return NextResponse.json({ error: 'Không thể tạo tài khoản. Thử lại sau.' }, { status: 500 })
        }

        // Gửi email chào mừng qua Resend (non-critical — không block nếu lỗi)
        try {
            const emailResult = await resend.emails.send({
                from: 'FinPeace Advisor <onboarding@resend.dev>',
                to: [email],
                subject: '🌱 Tài khoản FinPeace Advisor của bạn đã sẵn sàng!',
                html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #f0fdf4; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 32px; text-align: center;">
                        <h1 style="color: white; font-size: 24px; margin: 0;">🌿 FinPeace Advisor</h1>
                        <p style="color: #a7f3d0; margin: 8px 0 0;">Bình An Tài Chính · Chứng Khoán Thông Minh</p>
                    </div>
                    <div style="padding: 32px; background: white;">
                        <p style="font-size: 16px; color: #374151;">Xin chào${full_name ? ' <strong>' + full_name + '</strong>' : ''},</p>
                        <p style="color: #6b7280; line-height: 1.6;">
                            Tài khoản <strong>FinPeace Advisor</strong> của bạn đã được tạo thành công.
                            Dưới đây là thông tin đăng nhập:
                        </p>
                        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 24px 0;">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">📧 EMAIL</p>
                            <p style="margin: 0 0 16px; font-weight: 600; color: #111827;">${email}</p>
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">🔑 MẬT KHẨU TẠM THỜI</p>
                            <p style="margin: 0; font-size: 24px; font-weight: 700; color: #059669; letter-spacing: 4px;">${plainPassword}</p>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">⚠️ Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.</p>
                        <a href="https://advisor.finpeace.cloud/advisor/login" 
                           style="display: block; background: #059669; color: white; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 24px;">
                            🚀 Đăng Nhập Ngay
                        </a>
                    </div>
                    <div style="padding: 16px; text-align: center; background: #f0fdf4;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">FinPeace · Đồng hành ở mọi chu kỳ thị trường</p>
                    </div>
                </div>
            `
            })
            console.log('[Resend] Email sent:', emailResult)
        } catch (emailErr) {
            // Lỗi email không block đăng ký — KH vẫn nhận mật khẩu qua màn hình
            console.error('[Resend] Email failed:', emailErr)
        }

        // Trả về temp_password để hiện trực tiếp trên màn hình (không phụ thuộc email)
        return NextResponse.json({
            success: true,
            temp_password: plainPassword,
            message: 'Tài khoản đã được tạo thành công!'
        })

    } catch (err) {
        console.error('Register error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ, vui lòng thử lại.' }, { status: 500 })
    }
}
