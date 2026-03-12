const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log("🚀 Bắt đầu test bơm dữ liệu Vĩ mô (GDP) vào Supabase...");

    // 1. Tạo Chỉ báo Góc (Root Indicator) cho GDP danh nghĩa
    const { error: indErr1 } = await supabase
        .from('macro_indicators')
        .upsert({
            id: 'gdp_nominal',
            category_id: 1,
            parent_id: null,
            name: 'GDP danh nghĩa',
            unit: 'Tỷ VNĐ',
            frequency: 'quarterly'
        }, { onConflict: 'id' });

    if (indErr1) {
        console.error("❌ Lỗi tạo Chỉ báo Góc:", indErr1);
        return;
    }
    console.log("✅ Đã tạo Chỉ báo Mẹ: 'GDP danh nghĩa' (id: gdp_nominal)");

    // 2. Tạo Chỉ báo Nhánh (Branch Indicator) cho Công nghiệp và Xây dựng
    const { error: indErr2 } = await supabase
        .from('macro_indicators')
        .upsert({
            id: 'gdp_industry_construction',
            category_id: 1,
            parent_id: 'gdp_nominal', // Parent-child mapping
            name: 'Công nghiệp và xây dựng',
            unit: 'Tỷ VNĐ',
            frequency: 'quarterly'
        }, { onConflict: 'id' });

    if (indErr2) {
        console.error("❌ Lỗi tạo Chỉ báo Con:", indErr2);
        return;
    }
    console.log("✅ Đã tạo Chỉ báo Con: 'Công nghiệp và xây dựng' (Mẹ: gdp_nominal)");

    // 3. Bơm Data Lịch Sử (Từ ảnh WiChart cung cấp)
    const macroData = [
        // GDP Tổng
        {
            indicator_id: 'gdp_nominal',
            period_type: 'quarter',
            period_value: '2024-Q2',
            value: 2732153.13,
            yoy_growth: 6.93
        },
        {
            indicator_id: 'gdp_nominal',
            period_type: 'quarter',
            period_value: '2024-Q3',
            value: 2894998.48,
            yoy_growth: 7.40
        },
        // Phân nhánh Công nghiệp - Xây dựng
        {
            indicator_id: 'gdp_industry_construction',
            period_type: 'quarter',
            period_value: '2024-Q2',
            value: 1011483.92,
            yoy_growth: 8.5
        },
        {
            indicator_id: 'gdp_industry_construction',
            period_type: 'quarter',
            period_value: '2024-Q3',
            value: 1119474.46,
            yoy_growth: 9.1
        }
    ];

    const { error: dataErr } = await supabase
        .from('macro_data')
        .upsert(macroData, { onConflict: 'indicator_id,period_value' });

    if (dataErr) {
        console.error("❌ Lỗi bơm dữ liệu GDP:", dataErr);
    } else {
        console.log("✅ Bơm thành công 4 Record dữ liệu GDP (Tổng & Phân lớp) cho Q2 và Q3 2024 vào Database!");
    }
}

run();
