'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, QrCode, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
  }
  onSuccess: () => void
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function PaymentModal({ isOpen, onClose, user, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'info' | 'qr' | 'success'>('info')
  const [loading, setLoading] = useState(false)
  const [qrInfo, setQrInfo] = useState<{ qrUrl: string, orderId: string, transferCode: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes for QR

  useEffect(() => {
    if (isOpen) {
      setStep('info')
      setQrInfo(null)
      setTimeLeft(300)
    }
  }, [isOpen])

  // Countdown timer
  useEffect(() => {
    if (step === 'qr' && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(t)
    }
  }, [step, timeLeft])

  // Realtime subscription
  useEffect(() => {
    if (step !== 'qr' || !qrInfo?.orderId) return

    const channel = supabase
      .channel(`payment_order_${qrInfo.orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payment_orders',
          filter: `id=eq.${qrInfo.orderId}`
        },
        (payload) => {
          if (payload.new.status === 'paid') {
            setStep('success')
            setTimeout(() => {
              onSuccess() 
              onClose()
            }, 3000)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [step, qrInfo, onSuccess, onClose])

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stockpick/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tierToUpgrade: 'BRONZE',
          amount: 295000 
        })
      })
      const data = await res.json()
      
      if (res.ok && data.qrUrl) {
        setQrInfo(data)
        setStep('qr')
      } else {
        alert('Có lỗi xảy ra: ' + (data.error || 'Server error'))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'success' ? undefined : onClose}
          className="absolute inset-0"
          style={{ background: 'rgba(6,11,20,0.8)', backdropFilter: 'blur(8px)' }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #10B981, #059669)' }} />
          
          {step !== 'success' && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-6">
            {step === 'info' && (
              <div className="text-center space-y-6 mt-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl relative"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Nâng cấp BRONZE</h3>
                  <p className="text-sm mt-2 text-slate-300">
                    Mở khoá toàn bộ lệnh giao dịch, nhận cảnh báo tự động và phân tích chuyên sâu từ FinPeace.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-200">Không giới hạn các lệnh phím</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-200">Cảnh báo chốt lời / cắt lỗ qua Zalo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-200">Truy cập kịch bản thị trường (Video)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 8px 20px rgba(16,185,129,0.25)' }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                    {loading ? 'Đang tạo giao dịch...' : 'Thanh toán 295,000 VND'}
                  </motion.button>
                  <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Thanh toán an toàn, mở khoá tự động 24/7
                  </p>
                </div>
              </div>
            )}

            {step === 'qr' && qrInfo && (
              <div className="text-center space-y-5 mt-2">
                <div>
                  <h3 className="text-lg font-bold text-white">Quét mã để thanh toán</h3>
                  <p className="text-sm text-slate-300 mt-1">Sử dụng App Ngân hàng của bạn để quét mã</p>
                </div>

                <div className="bg-white rounded-2xl p-4 mx-auto w-fit inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrInfo.qrUrl} alt="SePay QR Code" className="w-[200px] h-[200px] object-contain" />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm">
                  <p className="text-slate-300 mb-1">Số tiền: <strong className="text-emerald-400 font-bold text-base">295.000 VNĐ</strong></p>
                  <p className="text-slate-300">Nội dung: <strong className="text-white bg-white/10 px-2 py-0.5 rounded ml-1 tracking-wider">{qrInfo.transferCode}</strong></p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 animate-pulse pt-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang chờ thanh toán ({mins}:{secs.toString().padStart(2, '0')})</span>
                </div>
                <p className="text-xs text-slate-400">Không đóng cửa sổ này. Trạng thái sẽ cập nhật ngay khi bạn thanh toán.</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-6 mt-8 mb-4 py-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                  className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400">Thanh toán thành công!</h3>
                  <p className="text-slate-300 mt-3 max-w-[250px] mx-auto text-sm leading-relaxed">
                    Tài khoản đã được nâng cấp lên <strong>BRONZE</strong>. Xin cảm ơn bạn đã đồng hành cùng FinPeace!
                  </p>
                </div>

                <div className="pt-4">
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-emerald-400/60 mt-2">Đang nạp tính năng mới...</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
