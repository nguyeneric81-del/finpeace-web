'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// 4 sales codes hợp lệ
const VALID_SALES_CODES = ['Quang01', 'duc02', 'thuy03', 'huyen04']

export function SalesRefCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')?.toUpperCase()
    if (ref && VALID_SALES_CODES.includes(ref)) {
      // Lưu cookie 30 ngày
      document.cookie = `fp_ref=${ref}; max-age=${30 * 24 * 3600}; path=/; SameSite=Lax`
    }
    // Nếu không có ref trong URL, giữ nguyên cookie cũ (không xoá)
  }, [searchParams])

  return null
}

/** Đọc sales code từ cookie (dùng trong form submit) */
export function getSalesCode(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/fp_ref=([^;]+)/)
  return match ? match[1] : null
}
