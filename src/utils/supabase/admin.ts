import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client — uses SERVICE ROLE key to bypass RLS.
 * Only use in server-side API routes, never expose to client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
