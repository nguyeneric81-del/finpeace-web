'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Plus, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

interface AccumulationTrackerProps {
  monthlyTarget: number;
  monthlyInvested: number;
  totalAccumulated: number;
  totalPrincipal: number;
  nextMilestone: string;
  milestoneProgress: number; // 0-100
}

export function AccumulationTracker({
  monthlyTarget,
  monthlyInvested,
  totalAccumulated,
  totalPrincipal,
  nextMilestone,
  milestoneProgress
}: AccumulationTrackerProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const monthlyProgress = Math.min((monthlyInvested / (monthlyTarget || 1)) * 100, 100);
  const pnl = totalAccumulated - totalPrincipal;
  const pnlPercent = totalPrincipal > 0 ? (pnl / totalPrincipal) * 100 : 0;
  const isPnlPositive = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800">Hành Trình Tích Sản</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">Đều đặn giải ngân hàng tháng tiến tới tự do tài chính.</p>
        </div>
        <button className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors">
          Xem Báo Cáo
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Kỷ luật tháng này */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kỷ Luật Tháng Này</p>
            <span className="text-[10px] font-bold px-2 py-1 bg-white rounded-lg text-slate-600 border border-slate-200 shadow-sm">Tháng 4</span>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-black text-slate-800">{formatCurrency(monthlyInvested)}</p>
            <p className="text-xs text-slate-500 mt-1">Mục tiêu: {formatCurrency(monthlyTarget)}</p>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${monthlyProgress}%` }}
              className={`h-full rounded-full ${monthlyProgress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-[10px] font-medium text-slate-400">Đã hoàn thành</p>
            <p className="text-[10px] font-bold text-slate-700">{monthlyProgress.toFixed(0)}%</p>
          </div>
        </div>

        {/* Tổng quy mô */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quy Mô Tích Sản</p>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border shadow-sm bg-white ${isPnlPositive ? 'text-emerald-600 border-emerald-100' : 'text-red-600 border-red-100'}`}>
              <TrendingUp className={`w-3 h-3 ${!isPnlPositive && 'rotate-180'}`} />
              {isPnlPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{formatCurrency(totalAccumulated)}</p>
            <p className="text-xs text-slate-500 mt-1">Vốn gốc: {formatCurrency(totalPrincipal)}</p>
          </div>
          <p className={`text-xs mt-4 font-medium ${isPnlPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPnlPositive ? 'Lãi' : 'Lỗ'} dự kiến: {isPnlPositive ? '+' : ''}{formatCurrency(pnl)}
          </p>
        </div>

        {/* Cột 3: Call to actions */}
        <div className="flex flex-col gap-3 justify-center">
          <div className="bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer text-white rounded-2xl p-4 flex items-center justify-between group shadow-sm shadow-emerald-600/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm">Ghi nhận giải ngân</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition" />
          </div>

          <div className="bg-slate-800 hover:bg-slate-900 transition cursor-pointer text-white rounded-2xl p-4 flex items-center justify-between group shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Kho Cổ Phiếu Tích Sản</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
