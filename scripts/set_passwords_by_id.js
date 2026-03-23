/**
 * Set passwords cho các accounts vừa tạo qua Dashboard
 * + Set role admin cho nguyeneric81
 * Chạy: node scripts/set_passwords_by_id.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const ALL_EMAILS = [
    'quangnm@finpeace.vn',
    'ducha@finpeace.vn',
    'thuylt@finpeace.vn',
    'nguyeneric81@gmail.com',
    'yenle@finpeace.vn',
    'tienvinh0108@gmail.com',
]

async function run() {
    console.log('🔑 Getting user IDs from profiles table...\n')

    const { data: users, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .in('email', ALL_EMAILS)

    if (error) { console.error('profiles query failed:', error.message); return }
    console.log('Users found:', users.map(u => u.email).join(', '))

    console.log('\n🔑 Setting passwords via updateUserById...\n')

    for (const user of users) {
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: '123456',
            email_confirm: true,
        })

        if (updateErr) console.error(`❌ ${user.email}: ${updateErr.message}`)
        else console.log(`✅ ${user.email}: password set OK`)
    }

    console.log('\n✅ Done! Thử login lại.')
}

run()
