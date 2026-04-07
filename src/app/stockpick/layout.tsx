import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StockPick 2.0 — AI Trading Tool | FinPeace',
  description: 'Công cụ giao dịch AI thông minh. Nhận trading plan, tín hiệu realtime và phân tích chuyên sâu từ FinPeace.',
}

export default function StockPickLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stockpick-root">
      {children}
    </div>
  )
}
