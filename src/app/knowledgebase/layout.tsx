import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Thư Viện Kiến Thức | FinPeace — Bình An Tài Chính',
    description: 'Hệ thống kiến thức toàn diện về đầu tư & giao dịch: từ Graham, Buffett, Fisher đến Darvas và Turtle Traders. T-Shaped learning cho Nhà Đầu Tư và Nhà Giao Dịch Việt Nam.',
}

export default function KnowledgebaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {children}
            </div>
        </>
    )
}
