import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { lookupClient } from '@/lib/agent-helpers'

const getSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025'

export async function POST(req: Request) {
    const supabase = getSupabaseClient();
    try {
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${AGENT_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
        }

        const body = await req.json()
        const { email, client_name, action, data } = body

        if (!action) {
            return NextResponse.json({ error: 'Thiếu trường bắt buộc: action.' }, { status: 400 })
        }

        // Lookup: email → full_name → alias
        const { profile, error: lookupError } = await lookupClient(supabase, { email, client_name });
        if (!profile) {
            return NextResponse.json(
                { error: `❌ ${lookupError || 'Không tìm thấy khách hàng trong hệ thống.'}` },
                { status: 404 }
            )
        }

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
                matched_by: profile.matched_by,
                message: `Thêm "${data.asset_name}" thành công cho ${profile.full_name}`
            })
        }

        if (action === 'update_wealth_scenario') {
            await supabase.from('wealth_scenarios').update({ is_selected: false }).eq('user_id', profile.id);

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
                matched_by: profile.matched_by,
                message: `Đã cập nhật kế hoạch tài chính cho ${profile.full_name}`
            })
        }

        return NextResponse.json(
            { error: `Action "${action}" không hợp lệ.` },
            { status: 400 }
        )

    } catch (error: any) {
        console.error("❌ Lỗi update-financial-data:", error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống nội bộ' }, { status: 500 })
    }
}
