import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dùng Service Role Key để bypass RLS — chỉ gọi từ internal bot/agent
const getSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025'

export async function POST(req: Request) {
    const supabase = getSupabaseClient();
    try {
        // 1. Xác thực Agent Secret
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${AGENT_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized. Agent Token is invalid or missing.' },
                { status: 401 }
            )
        }

        // 2. Parse body
        const body = await req.json()
        const { email, client_name, action, data } = body

        if (!action) {
            return NextResponse.json(
                { error: 'Thiếu trường bắt buộc: action.' },
                { status: 400 }
            )
        }

        if (!email && !client_name) {
            return NextResponse.json(
                { error: 'Thiếu thông tin định danh khách hàng (email hoặc client_name).' },
                { status: 400 }
            )
        }

        // 3. Tra cứu profile khách hàng
        // Ưu tiên email (chính xác), fallback sang client_name (ilike)
        let profile: { id: string; full_name: string } | null = null;

        if (email) {
            const { data: userData, error } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('email', email)
                .single()
            if (!error && userData) profile = userData;
        }

        if (!profile && client_name) {
            const { data: userData } = await supabase
                .from('profiles')
                .select('id, full_name')
                .ilike('full_name', `%${client_name.trim()}%`)
                .limit(1)
            if (userData && userData.length > 0) profile = userData[0];
        }

        if (!profile) {
            const identifier = email || client_name;
            return NextResponse.json(
                { error: `Không tìm thấy khách hàng "${identifier}" trong hệ thống. Vui lòng kiểm tra lại tên hoặc email.` },
                { status: 404 }
            )
        }

        // 4. Xử lý theo action
        if (action === 'add_client_asset') {
            const { error: insertError } = await supabase
                .from('client_assets')
                .insert({
                    user_id: profile.id,
                    asset_group: data.asset_group,
                    asset_name: data.asset_name,
                    amount: data.amount,
                    risk_level: data.risk_level || 3,
                    expected_return: data.expected_return || 0,
                    notes: data.notes || 'Agent tự động nhập từ Telegram',
                })
            if (insertError) throw insertError

            return NextResponse.json({
                success: true,
                full_name: profile.full_name,
                message: `Thêm "${data.asset_name}" thành công cho ${profile.full_name}`
            })
        }

        if (action === 'update_wealth_scenario') {
            // Unselect tất cả scenario cũ của user
            await supabase
                .from('wealth_scenarios')
                .update({ is_selected: false })
                .eq('user_id', profile.id);

            const { error: insertError } = await supabase
                .from('wealth_scenarios')
                .insert({
                    user_id: profile.id,
                    plan_name: data.plan_name || 'Kịch bản mới',
                    target_amount: data.target_amount,
                    target_years: data.target_years || 15,
                    monthly_cashflow: data.monthly_cashflow || 0,
                    initial_capital: data.initial_capital || 0,
                    inflation_rate: data.inflation_rate || 3.5,
                    is_selected: true
                })
            if (insertError) throw insertError

            return NextResponse.json({
                success: true,
                full_name: profile.full_name,
                message: `Đã cập nhật kế hoạch tài chính cho ${profile.full_name}`
            })
        }

        return NextResponse.json(
            { error: `Action "${action}" không hợp lệ. Dùng "add_client_asset" hoặc "update_wealth_scenario".` },
            { status: 400 }
        )

    } catch (error: any) {
        console.error("❌ Lỗi update-financial-data:", error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống nội bộ' }, { status: 500 })
    }
}
