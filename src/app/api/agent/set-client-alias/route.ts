import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const getSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025'

export async function POST(req: Request) {
    const supabase = getSupabaseClient();
    try {
        // 1. Xác thực
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${AGENT_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
        }

        // 2. Parse body: { client_name | email, alias }
        const body = await req.json()
        const { email, client_name, alias } = body

        if (!alias) {
            return NextResponse.json({ error: 'Thiếu trường "alias".' }, { status: 400 })
        }
        if (!email && !client_name) {
            return NextResponse.json({ error: 'Thiếu định danh khách hàng (email hoặc client_name).' }, { status: 400 })
        }

        // 3. Tìm profile KH
        let profile: { id: string; full_name: string } | null = null;

        if (email) {
            const { data } = await supabase.from('profiles').select('id, full_name').eq('email', email).single()
            if (data) profile = data;
        }
        if (!profile && client_name) {
            const { data } = await supabase.from('profiles').select('id, full_name').ilike('full_name', `%${client_name.trim()}%`).limit(1)
            if (data && data.length > 0) profile = data[0];
        }

        if (!profile) {
            return NextResponse.json(
                { error: `❌ Không tìm thấy khách hàng "${email || client_name}" trong hệ thống.` },
                { status: 404 }
            )
        }

        // 4. Upsert alias (nếu alias đã tồn tại của chính KH này thì update, không thì insert)
        // Kiểm tra alias đã thuộc về KH khác chưa
        const { data: existingAlias } = await supabase
            .from('client_aliases')
            .select('user_id')
            .ilike('alias', alias.trim())
            .single()

        if (existingAlias && existingAlias.user_id !== profile.id) {
            return NextResponse.json(
                { error: `❌ Alias "${alias}" đã được dùng bởi khách hàng khác. Vui lòng chọn alias khác.` },
                { status: 409 }
            )
        }

        // Insert alias mới (nếu chưa có)
        if (!existingAlias) {
            const { error: insertError } = await supabase
                .from('client_aliases')
                .insert({ user_id: profile.id, alias: alias.trim() })
            if (insertError) throw insertError;
        }

        // Lấy tất cả alias của KH này để trả về
        const { data: allAliases } = await supabase
            .from('client_aliases')
            .select('alias')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: true })

        return NextResponse.json({
            success: true,
            full_name: profile.full_name,
            alias: alias.trim(),
            all_aliases: allAliases?.map(a => a.alias) || []
        })

    } catch (error: any) {
        console.error("❌ Lỗi set-client-alias:", error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống nội bộ' }, { status: 500 })
    }
}
