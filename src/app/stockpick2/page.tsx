'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StockPick2RootPage() {
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('stockpick2_user')
    if (stored) {
      router.replace('/stockpick2/dashboard')
    } else {
      router.replace('/stockpick2/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#060b14] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
