import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Bỏ qua xác thực cho các file nội dung tĩnh và ảnh,
         * và các API Webhook công khai (Telegram Bot, Zalo, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/telegram-webhook|api/zalo-webhook|api/assistant-webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ogg)$).*)',
    ],
}
