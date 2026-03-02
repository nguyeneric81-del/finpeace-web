import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dùng Service Role Key để bypass RLS — chỉ gọi từ internal bot/agent
const getSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025'

function formatCurrency(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
    } else if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(0)} triệu`;
    }
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

function buildReport(
    fullName: string,
    assets: any[] | null,
    scenarios: any[] | null,
    queryType: string
): string {
    const lines: string[] = [];
    const today = new Date().toLocaleDateString('vi-VN');

    lines.push(`📊 <b>BÁO CÁO TÀI CHÍNH</b>`);
    lines.push(`👤 <b>${fullName}</b>`);
    lines.push(`📅 ${today}`);
    lines.push('');

    // ── TÀI SẢN & NỢ ──
    if (queryType !== 'scenarios' && assets) {
        if (assets.length === 0) {
            lines.push('💼 <b>TÀI SẢN & NỢ:</b> Chưa có dữ liệu');
        } else {
            // Nhóm theo asset_group
            const grouped: Record<string, any[]> = {};
            for (const a of assets) {
                if (!grouped[a.asset_group]) grouped[a.asset_group] = [];
                grouped[a.asset_group].push(a);
            }

            const groupEmoji: Record<string, string> = {
                'Thanh khoản': '💵',
                'Đầu tư': '📈',
                'Bảo vệ': '🛡️',
                'Tiêu dùng': '🏠',
                'Nợ': '🔴',
            };

            // Tính tổng tài sản và nợ
            let totalAsset = 0, totalDebt = 0;
            for (const a of assets) {
                if (a.asset_group === 'Nợ') totalDebt += Number(a.amount);
                else totalAsset += Number(a.amount);
            }

            lines.push('💼 <b>TÀI SẢN & NỢ:</b>');
            for (const [group, items] of Object.entries(grouped)) {
                const emoji = groupEmoji[group] || '📋';
                lines.push(`  ${emoji} <b>${group}:</b>`);
                for (const item of items) {
                    const sign = group === 'Nợ' ? '-' : '';
                    lines.push(`    • ${item.asset_name}: ${sign}${formatCurrency(item.amount)}`);
                    if (item.notes && item.notes !== 'Agent tự động nhập từ Telegram') {
                        lines.push(`      ↳ ${item.notes}`);
                    }
                }
            }
            lines.push('');
            lines.push(`  📌 Tổng tài sản: <b>${formatCurrency(totalAsset)}</b>`);
            lines.push(`  📌 Tổng nợ: <b>-${formatCurrency(totalDebt)}</b>`);
            lines.push(`  📌 Tài sản ròng: <b>${formatCurrency(totalAsset - totalDebt)}</b>`);
        }
        lines.push('');
    }

    // ── KẾ HOẠCH TƯƠNG LAI ──
    if (queryType !== 'assets' && scenarios) {
        if (scenarios.length === 0) {
            lines.push('🎯 <b>KẾ HOẠCH TÀI CHÍNH:</b> Chưa có dữ liệu');
        } else {
            lines.push('🎯 <b>KẾ HOẠCH TÀI CHÍNH:</b>');
            for (const s of scenarios) {
                const selectedTag = s.is_selected ? ' ✅ <i>(đang chọn)</i>' : '';
                lines.push(`  📌 <b>${s.plan_name}</b>${selectedTag}`);
                lines.push(`    • Mục tiêu: ${formatCurrency(s.target_amount)}`);
                lines.push(`    • Thời hạn: ${s.target_years} năm`);
                if (s.monthly_cashflow > 0) {
                    lines.push(`    • Tích luỹ hàng tháng: ${formatCurrency(s.monthly_cashflow)}`);
                }
                if (s.initial_capital > 0) {
                    lines.push(`    • Vốn ban đầu: ${formatCurrency(s.initial_capital)}`);
                }
            }
        }
    }

    return lines.join('\n');
}

export async function POST(req: Request) {
    const supabase = getSupabaseClient();
    try {
        // 1. Xác thực Agent Secret
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${AGENT_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
        }

        // 2. Parse body
        const body = await req.json()
        const { email, client_name, query_type = 'summary' } = body

        if (!email && !client_name) {
            return NextResponse.json(
                { error: 'Thiếu thông tin định danh khách hàng (email hoặc client_name).' },
                { status: 400 }
            )
        }

        // 3. Tra cứu profile
        let profile: { id: string; full_name: string } | null = null;

        if (email) {
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('email', email)
                .single()
            if (data) profile = data;
        }

        if (!profile && client_name) {
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name')
                .ilike('full_name', `%${client_name.trim()}%`)
                .limit(1)
            if (data && data.length > 0) profile = data[0];
        }

        if (!profile) {
            const identifier = email || client_name;
            return NextResponse.json(
                { error: `❌ Không tìm thấy khách hàng <b>"${identifier}"</b> trong hệ thống.` },
                { status: 404 }
            )
        }

        // 4. Lấy dữ liệu theo query_type
        let assets: any[] | null = null;
        let scenarios: any[] | null = null;

        if (query_type === 'assets' || query_type === 'summary') {
            const { data } = await supabase
                .from('client_assets')
                .select('*')
                .eq('user_id', profile.id)
                .order('asset_group', { ascending: true })
                .order('created_at', { ascending: false })
            assets = data || [];
        }

        if (query_type === 'scenarios' || query_type === 'summary') {
            const { data } = await supabase
                .from('wealth_scenarios')
                .select('*')
                .eq('user_id', profile.id)
                .order('is_selected', { ascending: false })
                .order('created_at', { ascending: false })
            scenarios = data || [];
        }

        // 5. Build báo cáo dạng text
        const report = buildReport(profile.full_name, assets, scenarios, query_type);

        return NextResponse.json({ success: true, report, full_name: profile.full_name })

    } catch (error: any) {
        console.error("❌ Lỗi get-financial-data:", error);
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống nội bộ' }, { status: 500 })
    }
}
