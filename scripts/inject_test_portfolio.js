require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function go() {
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === 'tuananhfinpeace@gmail.com')
    if (!user) return console.log('user not found')
    
    await supabase.from('customer_portfolios').insert({
        user_id: user.id,
        extracted_tickers: ['VHM', 'SSI', 'VPB'],
        raw_ocr_text: 'TEST MOCK',
        allocation_assessment: {
            summary: "Mô phỏng danh mục",
            sectors: ["Bất động sản", "Ngân hàng", "Chứng khoán"],
            advice: "Mô phỏng danh mục để test hiển thị Trading Plan VHM."
        }
    })
    console.log('done inserted for', user.id)
}
go()
