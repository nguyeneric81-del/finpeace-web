'use client'

import React from 'react'
import { TrendingUp, Bell, Crown, Zap, Radar, Shield } from 'lucide-react'

interface StockPickHeaderProps {
  user: { name: string; tier: 'FREE' | 'BRONZE' | 'SILVER'; email: string }
  totalDeals: number
  lockedCount: number
  credits: number
}

const TIER_CONFIG = {
  FREE: {
    label: 'FREE',
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.12)',
    text: 'rgba(255,255,255,0.6)',
    icon: Zap,
  },
  BRONZE: {
    label: 'BRONZE',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(180,83,9,0.15))',
    border: 'rgba(245,158,11,0.35)',
    text: '#f59e0b',
    icon: Crown,
  },
  SILVER: {
    label: 'SILVER',
    bg: 'linear-gradient(135deg, rgba(161,161,170,0.2), rgba(113,113,122,0.15))',
    border: 'rgba(161,161,170,0.35)',
    text: '#d4d4d8',
    icon: Shield,
  },
}

export default function StockPickHeader({ user, totalDeals, lockedCount, credits }: StockPickHeaderProps) {
  const tier = TIER_CONFIG[user.tier]
  const TierIcon = tier.icon

  return (
    <div className="sticky top-0 z-40 px-4 pt-safe-top"
      style={{
        background: 'rgba(18,18,18,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Bioluminescent Pulse (Radar Sweep) */}
      <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#00D16E] to-transparent animate-pulse" 
             style={{ animationDuration: '3s' }} />
      </div>
      <div className="max-w-lg mx-auto flex items-center justify-between py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,209,110,0.2), rgba(0,209,110,0.05))',
              border: '1px solid rgba(0,209,110,0.3)',
            }}
          >
            <Radar className="w-4 h-4 text-[#00D16E] animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">StockPicks 2.0</p>
            <p className="text-[10px] mt-0.5 tracking-widest uppercase font-bold" style={{ color: '#00D16E' }}>by FinPeace</p>
          </div>
        </div>

        {/* Right: Tier badge + notification */}
        <div className="flex items-center gap-2">
          {/* FOMO counter - only show for FREE */}
          {user.tier === 'FREE' && lockedCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              +{lockedCount} deals ẩn
            </div>
          )}

          {/* Tier badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: tier.bg,
              border: `1px solid ${tier.border}`,
              color: tier.text,
            }}
          >
            <TierIcon className="w-3 h-3" />
            {tier.label}
          </div>

          {/* Credits remaining (BRONZE & SILVER only) */}
          {(user.tier === 'BRONZE' || user.tier === 'SILVER') && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(0,209,110,0.08)',
                border: '1px solid rgba(0,209,110,0.2)',
                color: '#00D16E',
              }}
            >
              <Zap className="w-3 h-3 text-[#00D16E]" />
              {credits} CR
            </div>
          )}
        </div>
      </div>

      {/* User greeting strip */}
      <div className="max-w-lg mx-auto pb-3">
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Xin chào, <span className="text-white font-medium">{user.name}</span> · {totalDeals} deal đang hoạt động
        </p>
      </div>
    </div>
  )
}
