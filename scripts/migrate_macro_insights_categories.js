const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Superbase URL or Key in .env.local")
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrate() {
  console.log("🔍 Đang tải toàn bộ dữ liệu từ bảng macro_insights...")
  const { data, error } = await supabase.from('macro_insights').select('id, category')
  
  if (error) {
    console.error("❌ Lỗi khi tải dữ liệu:", error)
    return
  }
  
  console.log(`📊 Tìm thấy ${data.length} bản ghi.`)
  
  let updatedCount = 0;
  
  for (const record of data) {
    // Chỉ cập nhật nếu category bị rỗng (null) hoặc khác Company_VVIA và Macro_Market
    if (record.category !== 'Company_VVIA' && record.category !== 'Macro_Market') {
      const { error: updateErr } = await supabase
        .from('macro_insights')
        .update({ category: 'Macro_Market' })
        .eq('id', record.id)
        
      if (updateErr) {
        console.error(`❌ Lỗi cập nhật bản ghi ${record.id}:`, updateErr)
      } else {
        updatedCount++
      }
    }
  }
  
  console.log(`✅ Hoàn tất quy hoạch! Đã cập nhật thành công ${updatedCount} bản tin cũ sang nhóm 'Macro_Market'.`)
}

migrate()
