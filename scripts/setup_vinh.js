const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    const email = 'tienvinh0108@gmail.com';
    const password = 'Password@123';
    const fullName = 'Nguyễn Tiến Vinh';

    console.log(`🚀 Bắt đầu khởi tạo dữ liệu cho khách hàng: ${fullName} (${email})`);

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    let userId;
    if (authErr && authErr.message.includes("already registered")) {
        console.log("ℹ️ Tài khoản đã tồn tại, tiến hành lấy ID...");
        const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', email).single();
        userId = existingUser.id;
    } else if (authErr) {
        console.error("❌ Lỗi tạo tài khoản:", authErr.message);
        return;
    } else {
        userId = authData.user.id;
        console.log("✅ Đã tạo tài khoản Auth thành công. ID:", userId);
        await new Promise(r => setTimeout(r, 2000));
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId);
    }

    await supabase.from('client_assets').delete().eq('user_id', userId);
    await supabase.from('wealth_scenarios').delete().eq('user_id', userId);

    console.log("⏳ Đang bơm dữ liệu Tài Sản (Assets)...");
    const assets = [
        { user_id: userId, asset_group: 'Bảo vệ', asset_name: 'Bảo hiểm nhân thọ Dai-ichi', amount: 50000000, risk_level: 1, notes: 'Đóng phí năm 15tr' },
        { user_id: userId, asset_group: 'Thanh khoản', asset_name: 'Sổ Tiết kiệm Vietcombank', amount: 200000000, risk_level: 1, notes: 'Lãi 5%/năm' },
        { user_id: userId, asset_group: 'Thanh khoản', asset_name: 'Tiền mặt & Momo', amount: 30000000, risk_level: 1, notes: 'Dự phòng sinh hoạt' },
        { user_id: userId, asset_group: 'Đầu tư', asset_name: 'Chứng chỉ quỹ VinaCapital VESAF', amount: 150000000, risk_level: 3, notes: 'Đầu tư định kỳ' },
        { user_id: userId, asset_group: 'Đầu tư', asset_name: 'Cổ phiếu FPT', amount: 300000000, risk_level: 3, notes: 'Cổ phiếu dài hạn' },
        { user_id: userId, asset_group: 'Đầu tư', asset_name: 'Crypto (Bitcoin & ETH)', amount: 100000000, risk_level: 5, notes: 'Hold ngắn hạn' },
        { user_id: userId, asset_group: 'Nợ', asset_name: 'Vay trả góp Ô tô Shinhan', amount: 450000000, risk_level: 1, notes: 'Lãi 8.5%, còn 3 năm' }
    ];

    const { error: insertErr } = await supabase.from('client_assets').insert(assets);
    if (insertErr) {
        console.error("❌ Lỗi bơm tài sản:", insertErr.message);
    } else {
        console.log("✅ Đã tạo Tháp phân bổ 830 Triệu / Nợ 450 Triệu thành công!");
    }

    console.log("⏳ Đang bơm dữ liệu Kịch Bản Mục tiêu (Scenarios)...");
    const scenario = {
        user_id: userId,
        plan_name: 'Kế hoạch Mua Trại Heo Hưu Trí',
        target_amount: 5000000000,
        target_years: 15,
        monthly_cashflow: 15000000,
        initial_capital: 380000000
    };

    const { error: pErr } = await supabase.from('wealth_scenarios').insert([scenario]);
    if (!pErr) console.log("✅ Đã thiết lập Goal 5 Tỷ Tự do tài chính!");

    console.log("\n🎉 HOÀN TẤT SETUP KHÁCH HÀNG VIP NGUYỄN TIẾN VINH. SẴN SÀNG MEETING!");
}
seed();
