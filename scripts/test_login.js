/**
 * Test login với NHIỀU accounts để phân loại lỗi
 * Chạy: node scripts/test_login.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const TEST_ACCOUNTS = [
    { email: 'quangnm@finpeace.vn', password: '123456', label: 'Agent mới' },
    { email: 'nguyeneric81@gmail.com', password: '123456', label: 'Admin mới (tạo qua SQL)' },
]

async function run() {
    console.log('Testing signInWithPassword for multiple accounts...\n')
    for (const acc of TEST_ACCOUNTS) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: acc.email, password: acc.password
        })
        if (error) {
            console.error(`❌ [${acc.label}] ${acc.email}: ${error.message} (${error.status})`)
        } else {
            console.log(`✅ [${acc.label}] ${acc.email}: OK — role: ${data.user.app_metadata?.role}`)
            await supabase.auth.signOut()
        }
    }
}

run()
