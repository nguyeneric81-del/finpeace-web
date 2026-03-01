import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Môi trường Node.js Backend Server (không phải Browser) 
// nên ta dùng Thư viện JS cốt lõi của Supabase cùng Service Role Key (để bypass RLS của bảng)
// Tại môi trường Serverless (Route Handler), ta gọi khởi tạo bên trong Handle Function
// để tránh việc Next.js Build tĩnh lúc chưa load file .env.local
const getSupabaseClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Khóa bí mật giao tiếp giữa Agent và Hệ thống
const AGENT_SECRET = process.env.AGENT_SECRET_KEY || 'finpeace-agent-secret-key-2025'

export async function POST(req: Request) {
    const supabase = getSupabaseClient();
    try {
        // 1. Kiểm tra xác thực Token từ Headers
        const authHeader = req.headers.get('authorization')
        if (authHeader !== `Bearer ${AGENT_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized. Agent Token is invalid hay missing.' },
                { status: 401 }
            )
        }

        // 2. Phân tích nội dung JSON từ Body Request của Agent
        const body = await req.json()
        const { email, action, data } = body

        if (!email || !action) {
            return NextResponse.json(
                { error: 'Thiếu trường bắt buộc (email khách hàng hoặc action).' },
                { status: 400 }
            )
        }

        // 3. Tra cứu ID Customer từ Email
        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('email', email) // Lưu ý anh sẽ cần báo em thêm schema email vào bảng profile nếu chưa có
            .single()

        if (userError || !user) {
            // Để dễ xử lý ban đầu, ta có thể dùng trực tiếp user_id thay vì email, nếu email chưa map.
            // Tạm thời em sẽ fallback nếu profile chưa lưu email.
            return NextResponse.json(
                { error: `Khách hàng có email ${email} không tồn tại trong hệ thống. Agent hãy check lại!`, raw: userError },
                { status: 404 }
            )
        }

        // 4. Xử lý logic theo Action Name
        if (action === 'add_client_asset') {
            // Lệnh khai báo hoặc cập nhật một món tài sản / khoản nợ
            const { error: insertError } = await supabase
                .from('client_assets')
                .insert({
                    user_id: user.id,
                    asset_group: data.asset_group, // 'Thanh khoản', 'Đầu tư', 'Bảo vệ', 'Nợ', 'Tiêu dùng'
                    asset_name: data.asset_name,
                    amount: data.amount,
                    risk_level: data.risk_level || 3,
                    expected_return: data.expected_return || 0,
                    notes: data.notes || 'Agent tự động nhập từ chia sẻ khách hàng',
                })
            if (insertError) throw insertError

            return NextResponse.json({ success: true, message: `Thêm ${data.asset_name} thành công cho ${user.full_name}` })
        }
        else if (action === 'update_wealth_scenario') {
            // Lệnh cập nhật tổng quan số liệu tài chính thời gian thực
            // Đầu tiên, set tất cả các scenarios cũ của user này thành is_selected = false
            await supabase.from('wealth_scenarios').update({ is_selected: false }).eq('user_id', user.id);

            // Sau đó thêm 1 scenario mới được chọn
            const { error: insertError } = await supabase
                .from('wealth_scenarios')
                .insert({
                    user_id: user.id,
                    plan_name: data.plan_name || 'Kịch bản Vô cực (Mặc định)',
                    target_amount: data.target_amount,
                    target_years: data.target_years || 15,
                    monthly_cashflow: data.monthly_cashflow || 0,
                    initial_capital: data.initial_capital || 0,
                    inflation_rate: data.inflation_rate || 3.5,
                    is_selected: true
                })
            if (insertError) throw insertError

            return NextResponse.json({ success: true, message: `Đã cập nhật mục tiêu Tài chính (${data.target_amount}) mới thành công` })
        }

        // Action không hợp lệ
        return NextResponse.json({ error: `Action '${action}' chưa được lập trình. Chỉ dùng 'add_client_asset' hoặc 'update_wealth_scenario'.` }, { status: 400 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Lỗi hệ thống Nội bộ API' }, { status: 500 })
    }
}
