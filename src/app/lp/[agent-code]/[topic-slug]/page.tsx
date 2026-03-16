import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import SalesLandingPageClient from './SalesLandingPageClient'

// Macro insights data (matches /advisor/macro-insights)
export const MACRO_STORIES: Record<string, {
  id: string; title: string; category: string; date: string
  dataPoint: string; narrowIndustry: string
  quantifiedImpact: { positive: boolean; value: string }
  accent: string
  behindStory: { point: string; quote: string; source: string }[]
  analystView: string
  keyStats: { label: string; value: string; positive?: boolean }[]
}> = {
  'ty-gia': {
    id: '2',
    title: 'FED chần chừ hạ lãi suất — Đồng USD tiếp tục duy trì sức mạnh',
    category: 'Chính sách Tiền tệ',
    date: 'Tháng 3, 2026',
    accent: '#F59E0B',
    dataPoint: 'DXY neo vững vùng 104.5. Tỷ giá USD/VND chợ đen vượt 25,500. TPCP Mỹ 10Y = 4.3%.',
    narrowIndustry: 'Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ',
    quantifiedImpact: {
      positive: false,
      value: 'DN vay nợ USD cao chịu lỗ tỷ giá -3% LNST. Xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%.',
    },
    behindStory: [
      { point: 'Lạm phát lõi (Core PCE) của Mỹ bất ngờ dâng cao, triệt tiêu kỳ vọng hạ lãi suất sớm.', quote: 'Core PCE tháng 1/2026 tăng 2.8% YoY. Non-Farm tạo 275,000 việc làm — vượt xa dự báo.', source: 'Bloomberg / BLS' },
      { point: 'Chênh lệch lãi suất USD-VNĐ kích hoạt dòng vốn đầu cơ ngoại tệ.', quote: 'DXY neo vững trên 104.5, USD/VND tự do vượt mốc 25,500.', source: 'MBS Research — T3/2026' },
    ],
    analystView: 'Thị trường định giá FED chỉ hạ lãi suất sớm nhất tháng 9/2026. Nhóm xuất khẩu Gỗ, Thủy sản hưởng lợi kép từ đơn hàng và tỷ giá.',
    keyStats: [
      { label: 'DXY Index', value: '104.5', positive: false },
      { label: 'USD/VND tự do', value: '25,500', positive: false },
      { label: 'Buff doanh thu VHC', value: '+4.5%', positive: true },
      { label: 'FED hạ lãi suất dự kiến', value: 'T9/2026', positive: false },
    ],
  },
  'logistics': {
    id: '1',
    title: 'Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị',
    category: 'Chuỗi Cung Ứng',
    date: 'Tháng 3, 2026',
    accent: '#10B981',
    dataPoint: 'SCFI tăng +35% YTD, chạm 2,800 điểm — cao nhất 18 tháng.',
    narrowIndustry: 'Vận tải biển Quốc tế & Cho thuê tàu',
    quantifiedImpact: {
      positive: true,
      value: 'Biên lợi nhuận ròng ngành tăng +8–12% trong Q2/2026 nhờ cước giá cao.',
    },
    behindStory: [
      { point: 'Căng thẳng Biển Đỏ làm thay đổi toàn bộ cấu trúc tuyến vận tải Á–Âu.', quote: 'Khối lượng tàu qua kênh Suez trong Q1/2026 giảm 42% so cùng kỳ, hành trình dài thêm 14–21 ngày.', source: 'SSI Research T2/2026' },
      { point: 'Chỉ số SCFI xuyên thủng mốc 2,800 điểm — cao nhất 18 tháng.', quote: 'Tắc nghẽn container rỗng tại Singapore, Thượng Hải — vòng quay tàu chậm 40%.', source: 'Drewry Shipping T3/2026' },
    ],
    analystView: 'VCBS, KIS nhấn mạnh dư địa tăng giá cước Spot vẫn còn. Đà tăng sẽ hạ nhiệt Q4/2026 khi 2 triệu TEU tàu mới hạ thủy.',
    keyStats: [
      { label: 'SCFI Index', value: '2,800', positive: true },
      { label: 'Tàu qua Suez', value: '-42%', positive: false },
      { label: 'Doanh thu HAH', value: '+18%', positive: true },
      { label: 'LNST HAH Q2 dự phóng', value: '+45%', positive: true },
    ],
  },
  'fdi-ban-dan': {
    id: '3',
    title: 'Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn',
    category: 'Đầu tư Nước ngoài',
    date: 'Tháng 3, 2026',
    accent: '#818CF8',
    dataPoint: 'FDI đăng ký mới lũy kế 2T/2026 đạt 4.29B USD (+38% YoY). 60% vào chế biến cao.',
    narrowIndustry: 'BĐS Khu Công Nghiệp (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu',
    quantifiedImpact: {
      positive: true,
      value: 'Giá thuê đất CN tăng +6-8%/năm. Tỷ lệ lấp đầy KCN phía Bắc chạm 90%.',
    },
    behindStory: [
      { point: 'Các đạo luật chip Mỹ ép FDI công nghệ cao đa dạng hóa chuỗi lắp ráp (China + 1).', quote: 'FDI lũy kế 2T/2026 đạt 4.29B USD (+38.6% YoY), 60% rót vào chế tạo, đóng gói bán dẫn.', source: 'Bộ KH&ĐT / GSO' },
      { point: 'Tỷ lệ lấp đầy KCN phía Bắc chạm 90%, đẩy giá thuê lên 140 USD/m².', quote: 'Amkor Technology & Hana Micron giải ngân giai đoạn 2 hơn 1.5B USD tại Bắc Ninh, Bắc Giang.', source: 'Nikkei Asia' },
    ],
    analystView: 'KBSV & Vietcap: đây là Secular Trend thập kỷ của Việt Nam. DN có quỹ đất thương phẩm 2026-2027 nắm độc quyền định giá.',
    keyStats: [
      { label: 'FDI 2T/2026', value: '$4.29B', positive: true },
      { label: 'Lấp đầy KCN phía Bắc', value: '90%', positive: true },
      { label: 'Giá thuê đất KCN', value: '$140/m²', positive: true },
      { label: 'LNST KBC 2026 dự báo', value: '+120%', positive: true },
    ],
  },
}

interface Props {
  params: Promise<{ 'agent-code': string; 'topic-slug': string }>
}

export async function generateMetadata({ params }: Props) {
  const { 'agent-code': code, 'topic-slug': slug } = await params
  const story = MACRO_STORIES[slug]
  if (!story) return { title: 'FinPeace Research' }
  return {
    title: `${story.title} | Phân tích Vĩ mô`,
    description: story.dataPoint,
  }
}

export default async function SalesLandingPage({ params }: Props) {
  const { 'agent-code': code, 'topic-slug': slug } = await params

  // Get agent from Supabase
  const supabase = await createClient()
  const { data: agent } = await supabase
    .from('sales_agents')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single()

  if (!agent) notFound()

  // Get landing page config (if exists, for custom hook/cta)
  const { data: lpConfig } = await supabase
    .from('agent_landing_pages')
    .select('*')
    .eq('agent_id', agent.id)
    .eq('slug', slug)
    .single()

  // Get macro story
  const story = MACRO_STORIES[slug]
  if (!story) notFound()

  return (
    <SalesLandingPageClient
      agent={agent}
      lpConfig={lpConfig}
      story={story}
      agentCode={code}
      topicSlug={slug}
      lpId={lpConfig?.id || null}
    />
  )
}
