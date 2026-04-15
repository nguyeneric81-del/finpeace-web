/**
 * Bulk reset password + confirm email for all SIP customers
 * Usage: node scripts/reset_sip_passwords.js
 */
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  // Step 1: Get all unique user_ids from sip_service_plans
  const { data: sipPlans, error: sipErr } = await supabase
    .from('sip_service_plans')
    .select('user_id')
  
  if (sipErr) { console.error('Error fetching sip_service_plans:', sipErr.message); return }

  const sipUserIds = [...new Set(sipPlans.map(p => p.user_id))]
  console.log(`\nFound ${sipUserIds.length} unique SIP user IDs`)

  // Step 2: Get profile info for each
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', sipUserIds)
  
  if (profErr) { console.error('Error fetching profiles:', profErr.message); return }
  console.log(`Found ${profiles.length} profiles to reset\n`)

  let success = 0
  let failed = 0

  for (const profile of profiles) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(profile.id, {
        password: '123456',
        email_confirm: true
      })
      if (error) {
        console.log(`❌ ${profile.email} — ${error.message}`)
        failed++
      } else {
        console.log(`✅ ${profile.email} (${profile.full_name || '-'})`)
        success++
      }
    } catch (e) {
      console.log(`❌ ${profile.email} — ${e.message}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 120))
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Thành công: ${success}`)
  console.log(`❌ Thất bại:   ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`\nTất cả SIP customers giờ đăng nhập được với password: 123456`)
}

main().catch(console.error)
