import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Thư Viện Kiến Thức | FinPeace — Bình An Tài Chính',
    description: 'Hệ thống kiến thức toàn diện về đầu tư & giao dịch: từ Graham, Buffett, Fisher đến Darvas và Turtle Traders. T-Shaped learning cho Nhà Đầu Tư và Nhà Giao Dịch Việt Nam.',
}

export default function KnowledgebaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans">
            {children}
        </div>
    )
}
