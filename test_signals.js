require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function go() {
    const { data: signals, error } = await supabase.from('price_signals').select('*').order('generated_at', { ascending: false }).limit(5)
    console.log(error || signals)
}
go()
