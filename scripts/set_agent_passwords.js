/**
 * Set passwords dùng listUsers với pagination
 * Chạy: node scripts/set_agent_passwords.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const TARGET_EMAILS = [
    'quangnm@finpeace.vn',
    'ducha@finpeace.vn',
    'Lelethuy150801@gmail.com',
    'nguyeneric81@gmail.com',
    'yenle@finpeace.vn',
    'tienvinh0108@gmail.com',
]

async function run() {
    console.log('📋 Fetching users...')

    // Lấy danh sách users với pagination
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 50 })

    if (error) {
        console.error('❌ listUsers failed:', error.message)
        console.log('\n--- FALLBACK: Dùng Management REST API ---')
        await fallbackRestAPI()
        return
    }

    console.log(`Found ${data.users.length} users\n`)

    for (const email of TARGET_EMAILS) {
        const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        if (!user) {
            console.log(`⚠️  ${email} — không tìm thấy`)
            continue
        }

        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: '123456',
            email_confirm: true,
        })

        if (updateErr) console.error(`❌ ${email} — ${updateErr.message}`)
        else console.log(`✅ ${email} — password set OK`)
    }

    console.log('\n✅ Xong! Thử đăng nhập lại.')
}

// Fallback: dùng Management REST API trực tiếp
async function fallbackRestAPI() {
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1]
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!projectRef || !serviceKey) { console.error('Missing env vars'); return }

    const baseUrl = `https://${projectRef}.supabase.co/auth/v1/admin/users`
    const headers = {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
    }

    // List users
    const listRes = await fetch(`${baseUrl}?page=1&per_page=50`, { headers })
    const listData = await listRes.json()

    if (!listRes.ok) { console.error('REST list failed:', listData); return }

    const users = listData.users || listData
    console.log(`Found ${users.length} users via REST\n`)

    for (const email of TARGET_EMAILS) {
        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        if (!user) { console.log(`⚠️  ${email} — not found`); continue }

        const updateRes = await fetch(`${baseUrl}/${user.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ password: '123456', email_confirm: true }),
        })
        const updateData = await updateRes.json()

        if (updateRes.ok) console.log(`✅ ${email} — password set OK`)
        else console.error(`❌ ${email} — ${JSON.stringify(updateData)}`)
    }
    console.log('\n✅ Xong via REST!')
}

run()
