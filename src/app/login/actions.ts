'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?message=' + encodeURIComponent('Sai thông tin đăng nhập hoặc tài khoản không tồn tại'))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name }
        }
    })

    if (error) {
        redirect('/login?tab=signup&message=' + encodeURIComponent(`Lỗi tạo tài khoản: ${error.message}`))
    }

    // Nếu Supabase bật email confirmation: data.session = null, data.user.confirmed_at = null
    // → redirect sang trang thông báo check email
    // Nếu tắt confirmation (auto login): data.session tồn tại → vào dashboard
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
    } else {
        // Email confirmation required
        redirect('/login?message=' + encodeURIComponent('✅ Tài khoản đã tạo! Kiểm tra email và xác nhận trước khi đăng nhập.'))
    }
}

