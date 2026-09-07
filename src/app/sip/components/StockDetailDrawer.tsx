'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, TrendingUp, ShieldCheck, CheckCircle2,
  Calendar, Building2, Target, DollarSign, Award, BookOpen,
  ArrowUpRight, AlertCircle, MessageSquare
} from 'lucide-react';
import { SIPStock } from '../types';

interface Props {
  stock: SIPStock | null;
  onClose: () => void;
  onSelectForAdvisory?: (stock: SIPStock) => void;
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

export default function StockDetailDrawer({ stock, onClose, onSelectForAdvisory }: Props) {
  if (!stock) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black tracking-tight text-amber-400 font-mono">
                    {stock.ticker}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    stock.cta.includes('TỐT')
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : stock.cta.includes('TẠM DỪNG')
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {stock.cta}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {stock.tier}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{stock.name}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{stock.sector}</span>
                  <span>•</span>
                  <span>Review: {stock.updateDate}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Key Valuation Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750">
                  <div className="text-xs text-slate-400">Thị giá hiện tại</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {fmt(stock.currentPrice)} <span className="text-xs text-slate-400 font-normal">đ</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750">
                  <div className="text-xs text-slate-400">Giá mua tối đa (0.9x)</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                    {fmt(stock.maxBuyPrice)} <span className="text-xs text-slate-400 font-normal">đ</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750">
                  <div className="text-xs text-slate-400">Giá trị Nội tại (NT)</div>
                  <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                    {fmt(stock.newIntrinsicValue)} <span className="text-xs text-slate-400 font-normal">đ</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750">
                  <div className="text-xs text-slate-400">Upside Kỳ Vọng</div>
                  <div className={`text-lg font-bold font-mono mt-1 ${stock.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.upsidePct >= 0 ? `+${stock.upsidePct}%` : `${stock.upsidePct}%`}
                  </div>
                </div>
              </div>

              {/* Lịch sử định giá & Tăng trưởng */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400">NT Cũ (2025): </span>
                  <span className="font-mono font-semibold text-slate-300">{fmt(stock.oldIntrinsicValue)} đ</span>
                </div>
                <div className="text-slate-600">➔</div>
                <div>
                  <span className="text-slate-400">NT Mới (2026): </span>
                  <span className="font-mono font-semibold text-amber-400">{fmt(stock.newIntrinsicValue)} đ</span>
                </div>
                <div className="text-slate-600">➔</div>
                <div>
                  <span className="text-slate-400">NT Kỳ vọng 1Y: </span>
                  <span className="font-mono font-semibold text-emerald-400">{fmt(stock.expectedIntrinsicValue)} đ</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold">
                  Tăng trưởng {stock.expectedGrowthLabel}
                </div>
              </div>

              {/* Sales Pitch Weapon (Vũ khí tư vấn) */}
              {stock.salesScript && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Luận Điểm Tư Vấn Sales (Sales Script)</span>
                  </div>
                  <p className="text-slate-200 text-sm italic leading-relaxed">
                    "{stock.salesScript}"
                  </p>
                </div>
              )}

              {/* Đánh giá nhanh KQKD */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Điểm Nhấn Kết Quả Kinh Doanh Q2/2026</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {stock.businessOutlook}
                </p>
              </div>

              {/* Nhận định Tích sản FinPeace */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Nhận Định Tích Sản Chuyên Gia FinPeace</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {stock.sipOutlook}
                </p>
              </div>

              {/* Kế hoạch 2026 */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>Kế Hoạch Kinh Doanh Cả Năm 2026</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {stock.plan2026}
                </p>
              </div>

              {/* Tiêu chí Graham & Sức khỏe tài chính */}
              {stock.grahamPoints && stock.grahamPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-3">
                    <Award className="w-4 h-4" />
                    <span>Bộ Tiêu Chí Chất Lượng Doanh Nghiệp (FinPeace Moat)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stock.grahamPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BCTC Link */}
              {stock.bctcLink && (
                <div className="pt-2">
                  <a
                    href={stock.bctcLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xem BCTC & Tài liệu Quan hệ Cổ đông chính thức ({stock.ticker})</span>
                  </a>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition"
              >
                Đóng
              </button>

              {onSelectForAdvisory && (
                <button
                  onClick={() => {
                    onSelectForAdvisory(stock);
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Đưa Vào Kế Hoạch Tư Vấn Khách Hàng</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
