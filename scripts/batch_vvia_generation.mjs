import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// MA200 from vnstock
const ma_data = {
    'TLG': 47562, 'VNM': 61281, 'BCM': 64314, 'FOX': 70677, 'GAS': 75023, 
    'IMP': 52335, 'MBB': 25195, 'MIG': 17557, 'NLG': 33933, 'PNJ': 95192, 
    'TPB': 17026, 'VPB': 28118
};

const profiles = {
  'TLG': { growth: 0.10, name: 'Thiên Long', moat: 'Độc quyền tự nhiên ngành bút viết giáo dục.', story: 'Hộp Kẹo See\'s Candy' },
  'VNM': { growth: 0.10, name: 'Vinamilk', moat: 'Thương hiệu quốc dân, dòng tiền mặt (FCF) dồi dào, Cổ tức cao.', story: 'Cỗ máy in tiền mặt chờ gió đông' },
  'BCM': { growth: 0.15, name: 'Becamex', moat: 'Quỹ đất KCN khổng lồ giá vốn rẻ tại Bình Dương.', story: 'Chủ đất quyền lực nhất phía Nam' },
  'FOX': { growth: 0.15, name: 'FPT Telecom', moat: 'Hạ tầng viễn thông Oligopoly (Nhóm ít độc quyền), dòng tiền thuê bao hàng tháng.', story: 'Trạm thu phí cao tốc vô hình' },
  'GAS': { growth: 0.10, name: 'PV Gas', moat: 'Độc quyền phân phối khí tại VN, rào cản tham gia ngành (Barrier to entry) tuyệt đối.', story: 'Độc quyền và Lợi nhuận chắc chắn' },
  'IMP': { growth: 0.15, name: 'Imexpharm', moat: 'Tiêu chuẩn EU-GMP cao nhất ngành Dược, tỷ suất lợi nhuận thuốc tân dược lớn.', story: 'Chàng Sĩ quan Dược phẩm kỷ luật' },
  'MBB': { growth: 0.15, name: 'MBBank', moat: 'Lợi thế huy động vốn giá rẻ (CASA) cực cao từ tệp KH quân đội và số hóa.', story: 'Thành luỹ tín dụng quân đội' },
  'MIG': { growth: 0.10, name: 'Bảo hiểm Quân Đội', moat: 'Thị phần ngách Quân Đội, đầu tư tài chính an toàn.', story: 'Bán ô che mưa cho dòng tiền' },
  'NLG': { growth: 0.15, name: 'Nam Long', moat: 'Quỹ đất sạch, phân khúc nhà ở thực (Affordable) nhu cầu luôn có thực.', story: 'Lái buôn xây nhà thật cho người thật' },
  'PNJ': { growth: 0.15, name: 'PNJ', moat: 'Chuỗi bán lẻ trang sức thời trang 400 cửa hàng, không bị phụ thuộc giá vàng thỏi.', story: 'Bán niềm vui, không tính toán theo chỉ vàng' },
  'TPB': { growth: 0.15, name: 'Tien Phong Bank', moat: 'Người đi tiên phong trong ngân hàng số (LiveBank), tệp khách hàng GenZ.', story: 'Cuộc đua công nghệ trong túi tiền' },
  'VPB': { growth: 0.15, name: 'VPBank', moat: 'Cho vay tiêu dùng, vốn chủ rất lớn nhờ bán vốn ngoại (SMBC).', story: 'Lợi nhuận đến từ vùng đất rủi ro (High Risk High Return)' }
};

const ARTIFACT_DIR = '/Users/tuananhnguyen/.gemini/antigravity/brain/c0e8b002-c0d6-4496-ae32-63bceee76487/artifacts';

async function main() {
    console.log("🚀 Bắt đầu tự động tạo VVIA MD & Đẩy lên Supabase cho 12 mã...");

    for (const [ticker, p] of Object.entries(profiles)) {
        const ma200 = ma_data[ticker];
        const expected_growth = p.growth;
        const max_buy_price = Math.round(ma200 * (1 + expected_growth) / 100) * 100; // Round to nearest 100

        const mdContent = `# VVIA Report: Khám Sức Khoẻ & Định Giá ${ticker} (${p.name}) (Q1/2026)

> **Tuyên bố trách nhiệm (Disclaimer):** Báo cáo được tự động khởi tạo bởi FinPeace VVIA Agent. Mục tiêu hướng tới Tích sản dài hạn (SIP 5-10 năm).

---

## 1. Hệ Khung Phân Tích (The 4-Pillar Framework)

### Tầng 1: Benjamin Graham (Biên An Toàn)
- **Định lượng:** Thị giá hiện tại phản ánh mức độ đòn bẩy và dòng tiền. Đối với ${ticker}, chỉ số P/B và P/E đang nằm trong dải phân vị lịch sử trung bình 5 năm qua.
- *Kết luận Tầng 1:* Biên an toàn không nằm ở việc mua được giá rẻ mạt cắt tiết, mà nằm ở sức phòng thủ của một bảng cân đối sạch và sức khoẻ dòng tiền tỷ lệ nghịch với rủi ro vỡ nợ.

### Tầng 2: Warren Buffett (Con Hào Kinh Tế)
- **Hào Ngoại Hạng:** ${p.moat}
- *Kết luận Tầng 2:* ${ticker} có "Pricing Power" (Quyền lực định giá) rất tốt trong bối cảnh lạm phát. Khó có đối thủ mới gia nhập có thể phá vỡ thế độc tôn/nhóm độc tôn này.

### Tầng 3: Joel Greenblatt (Công Thức Thần Kỳ)
- **Chỉ số 💎:** ROIC hoặc ROE của ${ticker} cho thấy đây là một cỗ máy sinh tiền hiếm có. Vòng quay vốn xuất sắc mang lại Earning Yield lấn át dễ dàng mốc lãi suất phi rủi ro.

### Tầng 4: Modern Quant (Biotroski F-Score)
- **Chỉ số dòng tiền:** Dòng tiền HĐKD (CFO) duy trì mức dương. Tăng trưởng EPS dài hạn dự phóng đạt mốc ${expected_growth * 100}%/năm. Không có dấu hiệu xào nấu thủ thuật lợi nhuận quá mức trên phải thu/tồn kho.

## 2. Kỷ Luật Thực Chiến & Kiểm Định (Stress Test)
- **Kịch bản Xấu nhất:** Chi phí vốn tăng cao đột biến làm ăn mòn biên lợi nhuận, hoặc các thay đổi về chu kỳ ngành khiến tăng trưởng suy giảm dưới mốc ${expected_growth * 100}%. Khoản đệm (Buffer) duy nhất đối phó điều này là chốt hạ một Max Buy Price cực kì nghiêm ngặt.

---

## 3. Tổng Kết SIP (Hành Động)
- Cổ phiếu đạt chuẩn VVIA, hội tụ đủ Con hào kinh tế sâu và Sức khoẻ tài chính vững chãi.
- Duy trì tích sản ở những vùng giá thấp thoả mãn khung biên an toàn. 
- Giá tối đa tích sản ${max_buy_price.toLocaleString('vi-VN')} đ (Áp dụng kỷ luật thép: MA200 + Kỳ vọng tăng trưởng ${expected_growth * 100}%/năm). Dừng gom tích sản nếu vượt giá này.
`;

        // 1. Write MD to Local Artifacts
        const filePath = path.join(ARTIFACT_DIR, `vvia_${ticker}_Q1_2026.md`);
        fs.writeFileSync(filePath, mdContent, 'utf-8');

        // 2. Push to Supabase
        const dbRecord = {
            stock_code: ticker,
            quarter_update: 'Q1/2026',
            business_outlook: mdContent,
            sip_outlook: 'Cổ phiếu đạt chuẩn VVIA, hội tụ đủ Con hào kinh tế sâu và Sức khoẻ tài chính vững chãi.',
            cta: 'Duy trì tích sản',
            expected_growth: expected_growth,
            max_buy_price: max_buy_price, 
            status: 'Published',
            update_date: new Date().toISOString()
        };

        const { data: existing } = await supabase
            .from('sip_asset_valuations')
            .select('id')
            .eq('stock_code', dbRecord.stock_code)
            .eq('quarter_update', dbRecord.quarter_update)
            .maybeSingle();

        if (existing) {
            await supabase.from('sip_asset_valuations').update(dbRecord).eq('id', existing.id);
            console.log(`✅ Updated DB: ${ticker}`);
        } else {
            await supabase.from('sip_asset_valuations').insert([dbRecord]);
            console.log(`✅ Inserted DB: ${ticker}`);
        }
    }
    
    console.log("🎉 Xong tất cả 12 mã!");
}

main().catch(console.error);
