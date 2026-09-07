'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Filter, ArrowUpDown, ChevronRight, TrendingUp,
  ShieldCheck, AlertCircle, Sparkles, Building2, Eye, Award
} from 'lucide-react';
import { SIPStock } from '../types';
import StockDetailDrawer from './StockDetailDrawer';

interface Props {
  stocks: SIPStock[];
  onSelectForAdvisory?: (stock: SIPStock) => void;
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

export default function WatchlistDashboard({ stocks, onSelectForAdvisory }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'buy' | 'pause' | 'tier1' | 'bank' | 'sec' | 'retail'>('all');
  const [sortBy, setSortBy] = useState<'ticker' | 'upside' | 'growth' | 'price'>('upside');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeStock, setActiveStock] = useState<SIPStock | null>(null);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = stocks.length;
    const buyCount = stocks.filter(s => s.cta.includes('MUA')).length;
    const pauseCount = stocks.filter(s => s.cta.includes('TẠM DỪNG')).length;
    const avgUpside = Math.round((stocks.reduce((acc, s) => acc + s.upsidePct, 0) / total) * 10) / 10;
    return { total, buyCount, pauseCount, avgUpside };
  }, [stocks]);

  // Bộ lọc và sắp xếp
  const filteredStocks = useMemo(() => {
    return stocks
      .filter(stock => {
        // Search query
        const q = searchQuery.trim().toLowerCase();
        const matchSearch =
          !q ||
          stock.ticker.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q) ||
          stock.sector.toLowerCase().includes(q);

        if (!matchSearch) return false;

        // Filter tab
        if (selectedFilter === 'buy') return stock.cta.includes('MUA');
        if (selectedFilter === 'pause') return stock.cta.includes('TẠM DỪNG');
        if (selectedFilter === 'tier1') return stock.tier === 'Tier 1';
        if (selectedFilter === 'bank') return stock.sector.toLowerCase().includes('ngân hàng');
        if (selectedFilter === 'sec') return stock.sector.toLowerCase().includes('chứng khoán');
        if (selectedFilter === 'retail') return stock.sector.toLowerCase().includes('bán lẻ') || stock.sector.toLowerCase().includes('dược');

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'ticker') diff = a.ticker.localeCompare(b.ticker);
        else if (sortBy === 'upside') diff = a.upsidePct - b.upsidePct;
        else if (sortBy === 'growth') diff = a.expectedGrowthPct - b.expectedGrowthPct;
        else if (sortBy === 'price') diff = a.currentPrice - b.currentPrice;

        return sortAsc ? diff : -diff;
      });
  }, [stocks, searchQuery, selectedFilter, sortBy, sortAsc]);

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Danh Mục SIP 2026</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            {stats.total} <span className="text-sm font-normal text-slate-400">Mã Cổ Phiếu</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Sàng lọc 4 tiêu chí cốt lõi</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Vùng Mua Tốt</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
            {stats.buyCount} <span className="text-sm font-normal text-emerald-300/70">Mã (Giá &lt; 0.9x NT)</span>
          </div>
          <div className="text-xs text-emerald-400/80 mt-1">Biên an toàn định giá &gt;10%</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Tạm Dừng Mua</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 font-mono">
            {stats.pauseCount} <span className="text-sm font-normal text-rose-300/70">Mã (Sát Định Giá)</span>
          </div>
          <div className="text-xs text-rose-400/80 mt-1">Chờ nhịp điều chỉnh chiết khấu</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Upside Trung Bình</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
            +{stats.avgUpside}%
          </div>
          <div className="text-xs text-amber-400/80 mt-1">Kỳ vọng tịnh tiến 12–24 tháng</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã CP, tên cty, ngành..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Tất cả ({stocks.length})
          </button>

          <button
            onClick={() => setSelectedFilter('buy')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'buy'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            🟢 Mua Tốt ({stats.buyCount})
          </button>

          <button
            onClick={() => setSelectedFilter('pause')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'pause'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            🔴 Tạm Dừng ({stats.pauseCount})
          </button>

          <button
            onClick={() => setSelectedFilter('tier1')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'tier1'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Tier 1 Cốt Lõi
          </button>

          <button
            onClick={() => setSelectedFilter('bank')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'bank'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Ngân hàng
          </button>

          <button
            onClick={() => setSelectedFilter('sec')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedFilter === 'sec'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Chứng khoán
          </button>
        </div>
      </div>

      {/* Main Watchlist Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('ticker')}>
                  <div className="flex items-center gap-1.5">
                    <span>Mã / Doanh Nghiệp</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Ngành / Tier</th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Thị Giá (Live)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">NT Mới (2026)</th>
                <th className="py-3.5 px-4 text-right">Giá Mua Tối Đa</th>
                <th className="py-3.5 px-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('growth')}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Tăng Trưởng</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('upside')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Upside %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Khuyến Nghị CTA</th>
                <th className="py-3.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredStocks.map(stock => {
                const isBuyGood = stock.cta.includes('TỐT');
                const isPause = stock.cta.includes('TẠM DỪNG');

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => setActiveStock(stock)}
                    className="hover:bg-slate-800/40 cursor-pointer transition group"
                  >
                    {/* Ticker & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-base text-amber-400 group-hover:text-amber-300">
                          {stock.ticker}
                        </span>
                        <div>
                          <div className="font-medium text-slate-200 text-xs sm:text-sm">{stock.name}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{stock.quickReview}</div>
                        </div>
                      </div>
                    </td>

                    {/* Sector & Tier */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-300">{stock.sector}</div>
                      <span className="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {stock.tier}
                      </span>
                    </td>

                    {/* Live Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-white">
                      {fmt(stock.currentPrice)} <span className="text-xs text-slate-500 font-normal">đ</span>
                    </td>

                    {/* New Intrinsic Value */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-300">
                      {fmt(stock.newIntrinsicValue)} <span className="text-xs text-slate-500 font-normal">đ</span>
                    </td>

                    {/* Max Buy Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-400">
                      {fmt(stock.maxBuyPrice)} <span className="text-xs text-slate-500 font-normal">đ</span>
                    </td>

                    {/* Expected Growth */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold text-slate-300">
                      <span className="px-2 py-1 rounded-md bg-slate-800 text-amber-300/90 border border-slate-700">
                        {stock.expectedGrowthLabel}
                      </span>
                    </td>

                    {/* Upside % */}
                    <td className="py-3.5 px-4 text-right font-mono font-black">
                      <span className={stock.upsidePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {stock.upsidePct >= 0 ? `+${stock.upsidePct}%` : `${stock.upsidePct}%`}
                      </span>
                    </td>

                    {/* CTA Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${
                        isBuyGood
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isPause
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {stock.cta}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStock(stock);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-750 transition"
                        title="Xem Factsheet chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStocks.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            Không tìm thấy cổ phiếu tích sản nào phù hợp với từ khóa "{searchQuery}".
          </div>
        )}

        <div className="p-4 bg-slate-850/50 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            💡 <i>Ghi chú: Giá mua tích sản tối đa = NT Mới × 0.9 (Bảo toàn biên an toàn tối thiểu 10% theo cẩm nang SIP FinPeace).</i>
          </div>
          <div className="text-slate-500">
            Dữ liệu đồng bộ: Q2/2026 • Nguồn: BCTC & Kiểm toán độc lập
          </div>
        </div>
      </div>

      {/* Stock Detail Slide-Over Drawer */}
      <StockDetailDrawer
        stock={activeStock}
        onClose={() => setActiveStock(null)}
        onSelectForAdvisory={onSelectForAdvisory}
      />
    </div>
  );
}
