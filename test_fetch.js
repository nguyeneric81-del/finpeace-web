require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function go() {
    const { data: plans } = await supabase.from('trading_plans').select('*').eq('status','active')
    console.log(plans?.length, 'plans')
}
go()
