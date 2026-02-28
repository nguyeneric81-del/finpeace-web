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
        redirect('/login?message=Sai thông tin đăng nhập hoặc tài khoản không tồn tại')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/login?message=Không thể tạo tài khoản: ${error.message}`)
    }

    revalidatePath('/', 'layout')
    // Sau khi đăng ký, nếu Supabase cấu hình tự click mail thì sẽ không login thẳng được.
    // Nhưng mặc định test cứ điều hướng về báo thành công hoặc dashboard.
    redirect('/dashboard')
}
