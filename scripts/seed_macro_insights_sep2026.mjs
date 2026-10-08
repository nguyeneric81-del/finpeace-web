import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slooouceqcarcccryjyt.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateMacroInsights() {
  console.log('🚀 Đang cập nhật Macro Insights Tháng 9/2026 lên Supabase...')

  const insights = [
    {
      id: '2',
      topic_slug: 'ty-gia',
      title: 'Vì sao Lãi suất huy động tăng mạnh & Cú sốc Địa chính trị Dầu 95 USD',
      category: 'Macro_Market',
      date_label: 'Tháng 9, 2026',
      data_point: 'Kho bạc Nhà nước khóa cứng ~196,5 nghìn tỷ ngoài hệ thống. Dầu Brent tăng vọt lên 95 USD do xung đột Mỹ - Iran. Lợi suất US 30Y chạm đỉnh 19 năm 5.33%.',
      behind_story: [
        {
          point: 'Mô hình 3 Bình chứa tiền & Bội thu ngân sách 419,1 nghìn tỷ',
          quote: 'Tổng M2 chỉ nằm ở 3 nơi: Tiền mặt, Ngân hàng, Kho bạc. Thu ngân sách H1 vượt chi 419,1k tỷ, nhưng kênh gửi lại Big4 đã CHẠM TRẦN quy định (~715k tỷ), khiến ~196,5k tỷ bị khóa cứng tại NHNN không thể quay lại vòng quay tín dụng.',
          source: 'BCTC Big4 & Ngân hàng Nhà nước H1/2026'
        },
        {
          point: 'Thiếu hụt thanh khoản ~150 nghìn tỷ ép lãi suất huy động tăng',
          quote: 'Nhu cầu tín dụng tăng 1.350 - 1.400k tỷ phục vụ mục tiêu GDP, trong khi nguồn vốn tự nhiên thiếu hụt ròng gần 150 - 196,5k tỷ. Ngân hàng buộc phải tăng lãi suất huy động để tranh giành tiền gửi dân cư bù đắp phần vốn bị đóng băng ở Kho bạc.',
          source: 'FinPeace Research - Dòng tiền VNĐ 2026'
        },
        {
          point: 'Căng thẳng Mỹ - Iran leo thang đẩy dầu Brent lên 95 USD & US 30Y đỉnh 19 năm',
          quote: 'Xung đột quân sự trực tiếp Mỹ - Iran trong kỳ nghỉ lễ đẩy giá dầu Brent từ 78 lên 95 USD/thùng ngay trước bầu cử giữa kỳ Mỹ. Lợi suất TPCP Mỹ 30 năm chạm 5.33% do lạm phát dai dẳng, nợ công kỷ lục và cạnh tranh vốn với hạ tầng AI.',
          source: 'FinPeace Macro Strategy Desk'
        },
        {
          point: 'Điểm tựa Việt Nam: Tấm đệm Nâng hạng thị trường (Non-prefunding)',
          quote: 'Lợi suất Mỹ cao thường hút dòng vốn rút ròng khỏi thị trường mới nổi, nhưng Việt Nam đang đón đầu dòng vốn tổ chức từ quy chế Non-prefunding và kỳ vọng nâng hạng FTSE Russell, giúp giảm thiểu rủi ro rút vốn cực đoan.',
          source: 'Báo cáo Chuyên gia FinPeace'
        }
      ],
      analyst_view: 'Thanh khoản nội địa đang bị thắt chặt cơ học do gần 200 nghìn tỷ ngân sách bị "giam lỏng" ở Kho bạc, cộng hưởng với cú sốc giá dầu 95 USD và lợi suất US 30Y đỉnh 19 năm. Dòng tiền sẽ phân hóa cực mạnh: Ưu tiên nhóm Dầu khí (PVS, PVD, BSR), nhóm Tiền mặt ròng dồi dào không nợ vay (DPM, VEA, VTP) và rổ VN30 đón sóng Nâng hạng.',
      analyst_sources: ['FinPeace Research', 'NHNN', 'Bộ Tài chính', 'Big4 Banks'],
      analyst_quotes: [
        {
          firm: 'FinPeace Research',
          metric: 'Vốn kẹt tại Kho bạc',
          stat: '~196,5 nghìn tỷ',
          color: 'red',
          quote: 'Toàn bộ bội thu ngân sách mới không còn được trả lại hệ thống do Big4 đã chạm trần nhận tiền gửi KBNN. Ngân hàng buộc phải tăng lãi suất huy động để gom vốn.'
        },
        {
          firm: 'FinPeace Macro Desk',
          metric: 'Lợi suất US 30Y & Dầu Brent',
          stat: '5.33% / 95 USD',
          color: 'amber',
          quote: 'Xung đột Mỹ - Iran có chủ đích trước bầu cử giữa kỳ Mỹ sẽ giữ nền giá dầu cao, kích hoạt rủi ro lạm phát toàn cầu.'
        }
      ],
      key_stats: [
        { label: 'Bội thu ngân sách H1/2026', value: '419,1k tỷ', positive: false },
        { label: 'Tiền kẹt ngoài hệ thống NHTM', value: '~196,5k tỷ', positive: false },
        { label: 'Giá dầu Brent thế giới', value: '95 USD/thùng', positive: false },
        { label: 'Lợi suất TPCP Mỹ 30 năm', value: '5.33% (Đỉnh 19 năm)', positive: false },
        { label: 'Dòng vốn đón đầu Nâng hạng', value: 'Tấm đệm đỡ rút ròng', positive: true }
      ],
      companies: [
        { ticker: 'PVS', name: 'Dịch vụ Dầu khí PVS', plan: 'Hưởng lợi trực tiếp từ chu kỳ giá dầu 95 USD và chiến dịch khoan thăm dò' },
        { ticker: 'PVD', name: 'Khoan Dầu khí PVD', plan: 'Giá thuê giàn khoan neo cao kỷ lục' },
        { ticker: 'BSR', name: 'Lọc hóa dầu Bình Sơn', plan: 'Biên lọc dầu crack spread mở rộng' },
        { ticker: 'DPM', name: 'Đạm Phú Mỹ', plan: 'Hưởng lợi kép: Tiền mặt ròng dồi dào hưởng lãi suất cao và mùa vụ Đông Xuân' },
        { ticker: 'HPG', name: 'Hòa Phát', plan: 'VN30 trụ cột đón dòng vốn Nâng hạng thị trường' },
        { ticker: 'FPT', name: 'Tập đoàn FPT', plan: 'Dòng tiền tổ chức và tăng trưởng AI bền vững' }
      ],
      impact_value: 'Lãi suất huy động tiếp tục neo cao do nghẽn dòng tiền ngân sách; Dầu khí và DN tiền mặt lớn dẫn sóng.',
      cycle_lagging: 'Lãi suất cho vay đầu ra bắt đầu tăng phản ánh chi phí vốn huy động nhích lên.',
      cycle_leading: 'Giá dầu Brent và lợi suất US 30Y dẫn dắt tâm lý dòng tiền toàn cầu.',
      translations: {
        ko: {
          title: '2026년 9월 베트남 예금금리 급등 원인 및 중동 유가 95달러 충격',
          category: '거시경제 & 시장',
          date_label: '2026년 9월',
          data_point: '국고 재정흑자로 약 196.5조 동 은행권 밖 동결. 미-이란 직접 충돌로 브렌트유 95달러 급등, 미 30년물 국채금리 19년 만에 최고치(5.33%) 기록.',
          behind_story: [
            {
              point: '3가지 돈의 흐름 및 419.1조 동 국고 재정흑자 동결',
              quote: '상반기 국고 재정흑자 419.1조 동 중 국영 4대 은행 예치 한도(715조 동) 도달로 약 196.5조 동이 중앙은행에 묶여 시중 유동성 고갈.',
              source: '베트남 중앙은행 및 재무부 통계'
            },
            {
              point: '미-이란 군사 충돌 및 유가 95달러 돌파',
              quote: '미국 중간선거를 앞두고 유가 급등 및 미 30년물 국채금리 5.33% 급등. 그러나 베트남은 FTSE 시장 승격(Non-prefunding) 모멘텀이 완충재 역할.',
              source: 'FinPeace 거시경제 리서치'
            }
          ],
          analyst_view: '국고 예금 동결에 따른 국내 유동성 긴축과 글로벌 유가 95달러 충격이 겹침. 에너지/정유주(PVS, PVD, BSR) 및 무차입 현금 부자 기업(DPM, VEA), 시장 승격 수혜 대형주(HPG, FPT) 압축 대응 권장.',
          analyst_sources: ['FinPeace Research', '베트남 중앙은행', '재무부'],
          key_stats: [
            { label: '상반기 국고 재정흑자', value: '419.1조 동', positive: false },
            { label: '은행권 밖 동결 자금', value: '~196.5조 동', positive: false },
            { label: '브렌트유 선물', value: '95 USD/배럴', positive: false },
            { label: '미국 30년물 국채금리', value: '5.33% (19년래 최고)', positive: false }
          ],
          impact_value: '국내 금리 상승 압력 지속, 에너지주 및 시장 승격 대형주 중심 차별화 장세.',
          cycle_lagging: '조달금리 상승에 따른 대출금리 점진적 인상.',
          cycle_leading: '국제 유가 및 미국 장기 국채금리'
        }
      },
      published: true
    },
    {
      id: '4',
      topic_slug: 'gdp-10-sieu-du-an',
      title: 'Chiến dịch 500 ngày đêm nước rút Đầu tư công — Động lực kép bảo đảm mục tiêu GDP',
      category: 'Macro_Market',
      date_label: 'Tháng 9, 2026',
      data_point: 'Kế hoạch giải ngân hơn 650.000 tỷ đồng vốn NSNN: Sân bay Long Thành và Cao tốc Bắc - Nam bước vào pha tiêu thụ thực tế.',
      behind_story: [
        {
          point: 'Chiến dịch 500 ngày đêm hoàn thành 3.000 km cao tốc',
          quote: 'Thủ tướng phát động đợt cao điểm thi công 3 ca 4 kíp, cơ chế đặc thù tháo gỡ triệt để mỏ cát san lấp ĐBSCL.',
          source: 'Bộ Giao thông Vận tải'
        },
        {
          point: 'Pha tiêu thụ vật liệu thực tế thay thế cho kỳ vọng trên giấy',
          quote: 'Sản lượng tiêu thụ thép xây dựng và đá xây dựng công trình quốc gia tăng trưởng mạnh mẽ trong Q3/2026.',
          source: 'Hiệp hội Thép Việt Nam (VSA)'
        }
      ],
      analyst_view: 'Đầu tư công là dòng tiền tươi bơm trực tiếp vào nền kinh tế để đạt mục tiêu tăng trưởng GDP. HPG hưởng lợi lớn nhất ở mảng thép dự án, HHV và VCG có lượng backlog khổng lồ.',
      analyst_sources: ['FinPeace Research', 'Bộ Kế hoạch & Đầu tư'],
      analyst_quotes: [
        {
          firm: 'FinPeace Research',
          metric: 'Vốn giải ngân NSNN',
          stat: '>650k tỷ đồng',
          color: 'green',
          quote: 'Dòng tiền đầu tư công tăng tốc quý 3 và 4 đóng vai trò đầu tàu kéo tăng trưởng kinh tế.'
        }
      ],
      key_stats: [
        { label: 'Kế hoạch vốn đầu tư công 2026', value: '>650.000 tỷ', positive: true },
        { label: 'Mục tiêu GDP cả năm', value: '6.5% - 7.0%', positive: true }
      ],
      companies: [
        { ticker: 'HPG', name: 'Hòa Phát', plan: 'Cung cấp thép xây dựng chủ lực cho Sân bay Long Thành' },
        { ticker: 'HHV', name: 'Đèo Cả', plan: 'Tổng thầu thi công hạ tầng giao thông trọng điểm' },
        { ticker: 'VCG', name: 'Vinaconex', plan: 'Gói thầu nhà ga Long Thành và cao tốc' }
      ],
      impact_value: 'Dòng tiền giải ngân thực kích thích chuỗi giá trị vật liệu và xây lắp.',
      cycle_lagging: 'Doanh thu và lợi nhuận DN xây lắp phản ánh sau 1-2 quý.',
      cycle_leading: 'Tiến độ giải ngân vốn Kho bạc Nhà nước.',
      translations: {
        ko: {
          title: '2026년 9월 베트남 인프라 공공투자 500일 총력전 및 GDP 견인',
          category: '거시경제 & 시장',
          date_label: '2026년 9월',
          data_point: '650조 동 규모 공공투자 본격 집행: 롱탄 신공항 및 남북고속도로 실질 자재 투입 가속.',
          behind_story: [
            {
              point: '3,000km 고속도로 달성을 위한 500일 총력전',
              quote: '베트남 정부의 공공투자 집행 가속화로 건설용 철강 및 인프라 건설사 실적 가시화.',
              source: '베트남 교통부'
            }
          ],
          analyst_view: '공공투자는 금리 인상기 유동성을 보완하는 확실한 재정 정책. HPG, HHV, VCG 수혜 지속.',
          analyst_sources: ['FinPeace Research'],
          key_stats: [
            { label: '2026년 공공투자 예산', value: '650조 동+', positive: true }
          ]
        }
      },
      published: true
    }
  ]

  for (const item of insights) {
    console.log(`Đang cập nhật insight ID: ${item.id} (${item.topic_slug})...`)
    const { error } = await supabase
      .from('macro_insights')
      .update({
        title: item.title,
        category: item.category,
        date_label: item.date_label,
        data_point: item.data_point,
        behind_story: item.behind_story,
        analyst_view: item.analyst_view,
        analyst_sources: item.analyst_sources,
        analyst_quotes: item.analyst_quotes,
        key_stats: item.key_stats,
        companies: item.companies,
        impact_value: item.impact_value,
        cycle_lagging: item.cycle_lagging,
        cycle_leading: item.cycle_leading,
        translations: item.translations,
        published: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id)

    if (error) {
      console.error(`Lỗi cập nhật ID ${item.id}:`, error)
    } else {
      console.log(`✅ Cập nhật thành công ID ${item.id}!`)
    }
  }

  console.log('🎉 ĐÃ CẬP NHẬT HOÀN TẤT MACRO INSIGHTS THÁNG 9/2026 LÊN SUPABASE!')
}

updateMacroInsights()
