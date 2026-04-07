'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StockPickEntry() {
  const router = useRouter()

  useEffect(() => {
    const user = sessionStorage.getItem('stockpick_user')
    if (user) {
      router.replace('/stockpick/dashboard')
    } else {
      router.replace('/stockpick/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
