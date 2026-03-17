'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LangToggleInner({ currentLang }: { currentLang: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggle = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (lang === 'vi') params.delete('lang')
    else params.set('lang', lang)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-xl p-1"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {(['vi', 'ko'] as const).map(lang => {
        const active = currentLang === lang
        const label = lang === 'vi' ? '🇻🇳 VN' : '🇰🇷 KR'
        return (
          <button
            key={lang}
            onClick={() => toggle(lang)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: active ? '#f8fafc' : '#64748b',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function LangToggle({ currentLang }: { currentLang: string }) {
  return (
    <Suspense>
      <LangToggleInner currentLang={currentLang} />
    </Suspense>
  )
}
