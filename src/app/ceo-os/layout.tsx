'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const NAV_ITEMS = [
  { href: '/ceo-os', label: 'Tổng quan', icon: '⚡', exact: true },
  { href: '/ceo-os/trading-plans', label: 'Quản lý Lệnh', icon: '📊' },
  { href: '/ceo-os/signals', label: 'Tín hiệu thị trường', icon: '📡' },
  { href: '/ceo-os/personas', label: 'Chân dung KH', icon: '🎯' },
  { href: '/ceo-os/content-frameworks', label: 'Khung nội dung', icon: '✍️' },
  { href: '/ceo-os/performance', label: 'Hiệu suất', icon: '📊' },
]

export default function CeoOsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
              👑
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400">CEO OS</p>
              <p className="text-[11px] text-white/40">FinPeace Command Center</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-[11px] text-white/40">Đang đăng nhập với vai trò</p>
            <p className="text-xs font-bold text-amber-300 mt-0.5">CEO / Chị Yến 👑</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
