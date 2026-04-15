'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Flame, CheckCircle2, Clock, ChevronRight, Zap, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

interface AccumulationTrackerProps {
  totalInvested: number
  currentNAV: number
  transactionsThisMonth: number
  amountThisMonth: number
  totalStocks: number
  hasSIPData: boolean
  streak: number
  latestSIPReturn: number | null
  latestVNIReturn: number | null
  earliestStart: string
  latestEnd: string
}

const fmtBig = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' triệu'
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + 'đ'
}

const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

function streakMessage(streak: number) {
  if (streak >= 12) return { text: `${streak} tháng không gián đoạn — bạn đang ở nhóm top 5% nhà đầu tư kỷ luật nhất.`, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' }
  if (streak >= 6) return { text: `${streak} tháng liên tiếp — thói quen đang định hình. Không dừng lại bây giờ nhé.`, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' }
  if (streak >= 3) return { text: `${streak} tháng kiên định — bạn vừa vượt qua giai đoạn dễ bỏ cuộc nhất!`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  if (streak >= 1) return { text: `${streak} tháng khởi đầu — mỗi kỳ giải ngân là một bước tới tự do tài chính.`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  return { text: 'Tháng này chưa có giao dịch — đây là thời điểm lý tưởng để duy trì kỷ luật!', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' }
}

export function AccumulationTracker({
  totalInvested,
  currentNAV,
  transactionsThisMonth,
  amountThisMonth,
  totalStocks,
  hasSIPData,
  streak,
  latestSIPReturn,
  latestVNIReturn,
  earliestStart,
  latestEnd,
}: AccumulationTrackerProps) {
  if (!hasSIPData) return null

  const hasDeployedThisMonth = transactionsThisMonth > 0
  const pnl = currentNAV > 0 ? currentNAV - totalInvested : 0
  const pnlPct = totalInvested > 0 && currentNAV > 0 ? (pnl / totalInvested) * 100 : 0
  const beatMarket = latestSIPReturn !== null && latestVNIReturn !== null && latestSIPReturn > latestVNIReturn
  const alpha = latestSIPReturn !== null && latestVNIReturn !== null ? latestSIPReturn - latestVNIReturn : null

  // Journey progress
  const startDate = earliestStart ? new Date(earliestStart) : null
  const endDate = latestEnd ? new Date(latestEnd) : null
  const now = new Date()
  const totalMonths = startDate && endDate ? Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))) : null
  const elapsedMonths = startDate ? Math.max(0, Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))) : null
  const progressPct = totalMonths && elapsedMonths !== null ? Math.min(100, Math.round((elapsedMonths / totalMonths) * 100)) : null

  const msg = streakMessage(streak)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-none mb-0.5">Hành Trình Tích Sản</h3>
            <p className="text-[11px] text-slate-400">Đang tích {totalStocks} mã cổ phiếu cùng FinPeace</p>
          </div>
        </div>
        <Link href="/dashboard/wealth-planning"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-colors">
          Xem chi tiết →
        </Link>
      </div>

      <div className="p-6 space-y-5">
        {/* Row 1: Tháng này + Streak */}
        <div className="grid grid-cols-2 gap-4">

          {/* Tháng này */}
          <div className={`rounded-2xl p-4 border ${hasDeployedThisMonth
            ? 'bg-emerald-50 border-emerald-100'
            : 'bg-amber-50 border-amber-100'}`}>
            <div className="flex items-center gap-2 mb-3">
              {hasDeployedThisMonth
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                : <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              <span className={`text-xs font-bold uppercase tracking-wide ${hasDeployedThisMonth ? 'text-emerald-700' : 'text-amber-700'}`}>
                Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
              </span>
            </div>
            {hasDeployedThisMonth ? (
              <>
                <p className="text-2xl font-black text-slate-800 leading-none">{fmtBig(amountThisMonth)}</p>
                <p className="text-xs text-emerald-600 mt-1.5 font-medium">
                  ✓ {transactionsThisMonth} giao dịch đã thực hiện
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-black text-slate-600 leading-none">Chưa giải ngân</p>
                <p className="text-xs text-amber-600 mt-1.5 font-medium">Kỳ này vẫn còn thời gian</p>
              </>
            )}
          </div>

          {/* Streak */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wide text-orange-700">Streak Kỷ Luật</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-black text-orange-600 leading-none">{streak}</p>
              <p className="text-sm font-semibold text-orange-400">tháng</p>
            </div>
            <p className="text-xs text-orange-600 mt-1.5 font-medium">
              {streak >= 6 ? '🏆 Nhà đầu tư kỷ luật' : streak >= 3 ? '💪 Đang hình thành thói quen' : '🌱 Giữ đà này nhé!'}
            </p>
          </div>
        </div>

        {/* Row 2: Tổng danh mục + Performance */}
        <div className="grid grid-cols-3 gap-3">

          {/* Tổng đã giải ngân */}
          <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Giải Ngân</p>
            <p className="text-xl font-black text-slate-800 leading-none">{fmtBig(totalInvested)}</p>
            <p className="text-[11px] text-slate-400 mt-1.5">{totalStocks} mã · đang tích</p>
          </div>

          {/* P&L hoặc Return vs VNI */}
          <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {currentNAV > 0 ? 'Lãi/Lỗ' : 'SIP Return'}
            </p>
            {currentNAV > 0 ? (
              <>
                <p className={`text-xl font-black leading-none ${pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pnl >= 0 ? '+' : ''}{fmtBig(Math.abs(pnl))}
                </p>
                <p className={`text-[11px] mt-1.5 font-semibold ${pnl >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                  {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}% vs vốn gốc
                </p>
              </>
            ) : latestSIPReturn !== null ? (
              <>
                <p className={`text-xl font-black leading-none ${latestSIPReturn >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {fmtPct(latestSIPReturn * 100)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5">kỳ gần nhất</p>
              </>
            ) : (
              <>
                <p className="text-xl font-black text-slate-300 leading-none">—</p>
                <p className="text-[11px] text-slate-400 mt-1.5">Chờ cập nhật NAV</p>
              </>
            )}
          </div>

          {/* Beat market badge */}
          <div className={`rounded-2xl p-4 border ${beatMarket ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">vs VN-Index</p>
            {alpha !== null ? (
              <>
                <div className="flex items-center gap-1">
                  {beatMarket
                    ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                    : <TrendingDown className="w-4 h-4 text-red-400" />}
                  <p className={`text-xl font-black leading-none ${beatMarket ? 'text-emerald-600' : 'text-red-500'}`}>
                    {alpha >= 0 ? '+' : ''}{(alpha * 100).toFixed(1)}%
                  </p>
                </div>
                <p className={`text-[11px] mt-1.5 font-medium ${beatMarket ? 'text-emerald-500' : 'text-red-400'}`}>
                  {beatMarket ? '🎯 Đang beat thị trường' : 'Thị trường tốt hơn'}
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-black text-slate-300 leading-none">—</p>
                <p className="text-[11px] text-slate-400 mt-1.5">Chưa có dữ liệu</p>
              </>
            )}
          </div>
        </div>

        {/* Journey Progress */}
        {progressPct !== null && elapsedMonths !== null && totalMonths !== null && (
          <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiến Độ Hành Trình</p>
              <span className="text-xs font-bold text-emerald-600">{progressPct}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>Tháng {elapsedMonths}/{totalMonths}</span>
              {endDate && <span>Kết thúc {endDate.getMonth() + 1}/{endDate.getFullYear()}</span>}
            </div>
          </div>
        )}

        {/* Streak message */}
        <div className={`rounded-2xl p-3.5 ${msg.bg} border ${msg.border} flex items-start gap-2.5`}>
          <Flame className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className={`text-xs leading-relaxed font-medium ${msg.color}`}>{msg.text}</p>
        </div>

        {/* CTA row */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard/wealth-planning">
            <div className="group bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm shadow-emerald-600/20">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 opacity-80" />
                <span className="font-semibold text-sm">Xem Hành Trình</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
          <Link href="/dashboard/sip-portfolio">
            <div className="group bg-slate-800 hover:bg-slate-900 transition-colors cursor-pointer text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-sm">Kho Cổ Phiếu</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
