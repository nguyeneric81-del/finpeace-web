import { NextResponse } from 'next/server'
// import { createClient } from '@/utils/supabase/server' // Remove unused import for now, as we don't have magic link logic written.

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        // Logic cho xử lý callback auth (như Google/Facebook login hoặc email confirm).
        // Do dùng signInWithPassword trực tiếp nên bỏ qua.
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
}
