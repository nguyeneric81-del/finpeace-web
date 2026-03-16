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

    // Get the site URL for redirect (works on both local and production)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://finpeace.cloud'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name },
            emailRedirectTo: `${siteUrl}/auth/callback`,
        }
    })

    if (error) {
        redirect('/login?tab=signup&message=' + encodeURIComponent(`Lỗi tạo tài khoản: ${error.message}`))
    }

    // Email confirmation enabled: data.session = null → chờ xác nhận email
    // Email confirmation disabled: data.session exists → auto login
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
    } else {
        redirect('/login?message=' + encodeURIComponent(
            `✅ Tài khoản đã tạo! Kiểm tra email ${email} và click link xác nhận để đăng nhập.`
        ))
    }
}

