/**
 * Script tạo tài khoản Agent trên Supabase Auth
 * Dùng service_role key để bypass trigger UI
 * 
 * Chạy: node scripts/create_agent_accounts.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const AGENTS = [
    { email: 'quangnm@finpeace.vn',        password: '123456', name: 'Minh Quang' },
    { email: 'ducha@finpeace.vn',           password: '123456', name: 'Anh Đức' },
    { email: 'Lelethuy150801@gmail.com',    password: '123456', name: 'Lê Thủy' },
]

async function createAgents() {
    console.log('🚀 Tạo tài khoản Agent...\n')

    for (const agent of AGENTS) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: agent.email,
            password: agent.password,
            email_confirm: true,          // Bỏ qua xác nhận email
            user_metadata: { full_name: agent.name },
        })

        if (error) {
            if (error.message.includes('already registered') || error.message.includes('already been registered')) {
                console.log(`⚠️  ${agent.name} (${agent.email}) — đã tồn tại, bỏ qua`)
            } else {
                console.error(`❌ ${agent.name} (${agent.email}) — Lỗi: ${error.message}`)
            }
        } else {
            console.log(`✅ ${agent.name} (${agent.email}) — Tạo thành công! ID: ${data.user.id}`)
        }
    }

    console.log('\n✅ Xong! Bây giờ chạy phase18_agent_portal_seed.sql trên Supabase SQL Editor.')
}

createAgents()
