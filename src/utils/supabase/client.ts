import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = isProd ? { name: 'finpeace-auth', domain: '.finpeace.cloud' } : { name: 'finpeace-auth' };

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookieOptions }
    )
}
