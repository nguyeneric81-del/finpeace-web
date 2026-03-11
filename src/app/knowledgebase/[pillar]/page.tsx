import type { Metadata } from 'next'
import { getPillarBySlug } from '../data'
import PillarPageClient from './PillarPageClient'
import { notFound } from 'next/navigation'

// SEO per-pillar descriptions
const PILLAR_SEO: Record<string, { description: string; keywords: string }> = {
    'tam-ly-thi-truong': {
        description: 'Vượt qua FOMO, loss aversion và bầy đàn để đưa ra quyết định đầu tư lý trí. Tâm lý học hành vi áp dụng vào thị trường chứng khoán Việt Nam.',
        keywords: 'tâm lý đầu tư, FOMO chứng khoán, loss aversion, kỷ luật giao dịch, tâm lý thị trường',
    },
    'co-che-thi-truong': {
        description: 'Hiểu cổ phiếu là gì, cách đặt lệnh ATO/ATC/MP và cơ chế khớp lệnh trên HOSE/HNX. Nền tảng bắt buộc cho mọi nhà đầu tư Việt Nam.',
        keywords: 'cổ phiếu là gì, cách đặt lệnh chứng khoán, ATO ATC, khớp lệnh HOSE, cơ chế thị trường',
    },
    'phan-tich-co-ban': {
        description: 'Học cách đọc báo cáo tài chính, tính toán biên lợi nhuận và định giá cổ phiếu theo phương pháp Graham, Buffett. Phân tích cơ bản cho nhà đầu tư Việt Nam.',
        keywords: 'phân tích cơ bản, đọc báo cáo tài chính, P/E ratio, định giá cổ phiếu, EPS ROE',
    },
    'dau-tu-gia-tri': {
        description: 'Triết lý đầu tư giá trị của Benjamin Graham và Warren Buffett: biên độ an toàn, lợi thế cạnh tranh bền vững và đầu tư dài hạn.',
        keywords: 'đầu tư giá trị, margin of safety, moat lợi thế cạnh tranh, Warren Buffett, Benjamin Graham',
    },
    'dau-tu-tang-truong': {
        description: '15 tiêu chí Fisher và triết lý "mua những gì bạn biết" của Peter Lynch để tìm cổ phiếu tăng trưởng vượt trội thị trường.',
        keywords: 'đầu tư tăng trưởng, Philip Fisher, Peter Lynch, growth stock, cổ phiếu tăng trưởng Việt Nam',
    },
    'phan-tich-ky-thuat': {
        description: 'Nến Nhật, hỗ trợ kháng cự, khối lượng giao dịch và các chỉ báo MACD/RSI. Phân tích kỹ thuật thực chiến cho thị trường chứng khoán Việt Nam.',
        keywords: 'phân tích kỹ thuật, nến nhật, hỗ trợ kháng cự, MACD RSI, volume giao dịch',
    },
    'giao-dich-theo-xu-huong': {
        description: 'Lý thuyết hộp Darvas và phương pháp Turtle Traders: giao dịch theo xu hướng với kỷ luật sắt đá và quản trị vốn.',
        keywords: 'giao dịch xu hướng, Darvas box, Turtle Traders, trend following, breakout trading',
    },
    'quan-ly-danh-muc': {
        description: 'Đa dạng hóa đúng cách, Dollar-Cost Averaging và tái cân bằng danh mục theo 3 trường phái Bogle, Lynch và Buffett.',
        keywords: 'quản lý danh mục đầu tư, đa dạng hóa, DCA dollar cost averaging, tái cân bằng danh mục',
    },
    'quan-tri-rui-ro': {
        description: 'Cắt lỗ khoa học, Position Sizing theo Quy tắc 2% và Kelly Criterion. Bảo vệ tài khoản là điều kiện tiên quyết để sống sót trên thị trường.',
        keywords: 'quản trị rủi ro, cắt lỗ stop loss, position sizing, quy tắc 2%, quản lý vốn',
    },
    'ke-hoach-thuc-chien': {
        description: 'Viết Investment Policy Statement và lộ trình Paper Trading 90 ngày trước khi dùng tiền thật. Kế hoạch thực chiến cho nhà đầu tư nghiêm túc.',
        keywords: 'kế hoạch đầu tư, investment policy statement IPS, paper trading, kế hoạch thực chiến',
    },
}

export async function generateMetadata(
    { params }: { params: Promise<{ pillar: string }> }
): Promise<Metadata> {
    const { pillar: pillarSlug } = await params
    const pillar = getPillarBySlug(pillarSlug)

    if (!pillar) return { title: 'Không tìm thấy | FinPeace' }

    const seo = PILLAR_SEO[pillarSlug]
    const title = `${pillar.title} | FinPeace — Thư Viện Kiến Thức`
    const description = seo?.description ?? pillar.description
    const url = `https://finpeace.cloud/knowledgebase/${pillarSlug}`

    return {
        title,
        description,
        keywords: seo?.keywords,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            siteName: 'FinPeace',
            locale: 'vi_VN',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    }
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
    const { pillar: pillarSlug } = await params
    const pillar = getPillarBySlug(pillarSlug)

    if (!pillar) notFound()

    return <PillarPageClient pillar={pillar} />
}
