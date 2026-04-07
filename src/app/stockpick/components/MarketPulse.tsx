'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Newspaper, TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react'

interface MarketPulseProps {
  tier: 'FREE' | 'BRONZE'
}

// Mock market pulse data - in production, pull from macro_insights table
const MOCK_PULSE = {
  date: new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  vnindexSummary: 'VNINDEX sideway quanh 1,230 điểm, áp lực bán nhẹ từ khối ngoại. Dòng tiền phòng thủ sang nhóm Ngân hàng và Thực phẩm.',
  marketSentiment: 'neutral' as 'bullish' | 'bearish' | 'neutral',
  highlights: [
    { text: 'Nhóm Ngân hàng tích lũy tốt, BID, VCB hold vùng hỗ trợ', type: 'positive' },
    { text: 'Real estate tiếp tục giảm, NVL, DXG áp lực phân phối', type: 'negative' },
    { text: 'VN30 futures premium thu hẹp, thị trường chờ catalyst', type: 'neutral' },
  ],
  aiAction: 'HOLD — Chưa có tín hiệu rõ ràng. Giữ nguyên allocation, theo dõi phiên chiều.',
}

const SENTIMENT_CONFIG = {
  bullish:  { label: 'Tích cực', color: '#34d399', icon: TrendingUp },
  bearish:  { label: 'Tiêu cực', color: '#f87171', icon: TrendingDown },
  neutral:  { label: 'Trung lập', color: '#f59e0b', icon: Minus },
}

export default function MarketPulse({ tier }: MarketPulseProps) {
  const isBronze = tier === 'BRONZE'
  const sentiment = SENTIMENT_CONFIG[MOCK_PULSE.marketSentiment]
  const SentimentIcon = sentiment.icon

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-amber-400" />
          Daily Market Pulse
        </h2>
        {isBronze && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
            LIVE
          </span>
        )}
      </div>

      {isBronze ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Date header */}
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {MOCK_PULSE.date}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${sentiment.color}15`, color: sentiment.color }}>
              <SentimentIcon className="w-3 h-3" />
              {sentiment.label}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Summary */}
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {MOCK_PULSE.vnindexSummary}
            </p>

            {/* Highlights */}
            <div className="space-y-2">
              {MOCK_PULSE.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                    style={{
                      background: h.type === 'positive' ? 'rgba(52,211,153,0.12)' :
                        h.type === 'negative' ? 'rgba(248,113,113,0.12)' : 'rgba(245,158,11,0.12)',
                      color: h.type === 'positive' ? '#34d399' : h.type === 'negative' ? '#f87171' : '#f59e0b'
                    }}>
                    {h.type === 'positive' ? '↑' : h.type === 'negative' ? '↓' : '—'}
                  </span>
                  {h.text}
                </div>
              ))}
            </div>

            {/* AI Action */}
            <div className="rounded-xl px-3 py-3 flex items-start gap-2"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest mb-1">AI Khuyến nghị hôm nay</p>
                <p className="text-xs font-medium text-amber-300">{MOCK_PULSE.aiAction}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Locked state for FREE */
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
          {/* Blurred fake content */}
          <div className="opacity-15 blur-[3px] pointer-events-none select-none space-y-3">
            <div className="h-4 w-3/4 rounded bg-white/20" />
            <div className="h-3 w-full rounded bg-white/15" />
            <div className="h-3 w-5/6 rounded bg-white/15" />
            <div className="h-8 w-full rounded-xl bg-amber-500/20" />
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Lock className="w-5 h-5 text-amber-400/50 mb-2" />
            <p className="text-xs font-semibold text-amber-400/60">Tính năng BRONZE</p>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Nhận định thị trường hàng ngày
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
