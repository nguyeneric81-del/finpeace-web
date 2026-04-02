import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { syncLeadToGoogleSheet } from '@/utils/googleSheetsSync'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, pillar, article_slug, track, sales_code, source } = await req.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
        }

        // Upsert — nếu email đã tồn tại thì cập nhật thêm dữ liệu, không tạo duplicate
        const { error } = await supabase
            .from('kb_leads')
            .upsert({
                email,
                name: name || null,
                phone: phone || null,
                pillar: pillar || null,
                article_slug: article_slug || null,
                track: track || null,
                sales_code: sales_code || null,
                source: source || 'knowledgebase',
                created_at: new Date().toISOString(),
            }, { onConflict: 'email' })

        if (error) {
            console.error('kb_leads insert error:', error)
            return NextResponse.json({ error: 'Lỗi lưu dữ liệu' }, { status: 500 })
        }

        // Bắn webhook Google Sheets
        syncLeadToGoogleSheet({
            email,
            phone: phone || '',
            name: name || '',
            agent: sales_code || 'Org (KB)',
            source: `KB: ${article_slug || pillar || source}`
        });

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('kb_leads route error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
