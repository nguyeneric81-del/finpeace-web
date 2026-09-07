'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Target, FileText, BookOpen, ShieldCheck,
  UserCheck, Sparkles, RefreshCw, LayoutDashboard, Award
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SIPStock, ClientKYCInfo, FinancialGoal } from './types';
import { SIP_STOCKS_DATA } from './data/sipStocksData';
import { solveRequiredReturn, generateRecommendedPortfolio } from './utils/tvmEngine';
import WatchlistDashboard from './components/WatchlistDashboard';
import AdvisoryKYCEngine from './components/AdvisoryKYCEngine';
import SummaryPDFView from './components/SummaryPDFView';
import SIPManualGuide from './components/SIPManualGuide';

export default function SIPSalesPortalPage() {
  const supabase = useMemo(() => createClient(), []);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'watchlist' | 'advisory' | 'summary' | 'guide'>('watchlist');

  // Danh mục cổ phiếu SIP 2026
  const [stocks, setStocks] = useState<SIPStock[]>(SIP_STOCKS_DATA);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  // Hồ sơ Khách hàng (Unique Client ID)
  const [clientKYC, setClientKYC] = useState<ClientKYCInfo>({
    clientId: 'FP-KH-2026-8899',
    fullName: 'Trần Hoàng Nam',
    phone: '0982 345 678',
    email: 'hoangnam.tran@gmail.com',
    birthYear: 1986,
    monthlyIncome: 65000000, // 65 triệu
    monthlyExpense: 30000000, // 30 triệu
    emergencyFundMonths: 6, // 6 tháng chi tiêu an toàn
    riskTolerance: 'moderate',
    discType: 'S', // Người Nuôi Dưỡng (thích hợp nhất cho SIP)
    currentLand: 'control_growth', // Vùng đất kiểm soát & phát triển
    advisorName: 'Nguyễn Tuấn Anh',
    advisorPhone: '0988 888 888',
    notes: 'Kế hoạch tích sản dài hạn kết hợp hưu trí an nhàn và quỹ học vấn con gái.'
  });

  // Danh sách các mục tiêu tài chính (Multiple Goals)
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    // Mục tiêu 1: Hưu trí
    const goal1: FinancialGoal = {
      id: 'goal-1',
      name: 'Quỹ Hưu Trí An Nhàn Tuổi 55',
      type: 'retirement',
      targetAmount: 4000000000, // 4 tỷ
      years: 12,
      initialCapital: 200000000, // 200 triệu
      monthlyContribution: 15000000, // 15 triệu/tháng
      requiredAnnualReturn: 0,
      feasibility: 'optimal',
      feasibilityNote: '',
      suggestedPortfolio: []
    };
    const c1 = solveRequiredReturn(goal1.targetAmount, goal1.years, goal1.initialCapital, goal1.monthlyContribution);
    goal1.requiredAnnualReturn = c1.rate;
    goal1.feasibility = c1.feasibility;
    goal1.feasibilityNote = c1.note;
    goal1.suggestedPortfolio = generateRecommendedPortfolio(c1.rate, goal1.monthlyContribution, SIP_STOCKS_DATA);

    // Mục tiêu 2: Học vấn con
    const goal2: FinancialGoal = {
      id: 'goal-2',
      name: 'Quỹ Du Học Đại Học Cho Con Gái',
      type: 'education',
      targetAmount: 1500000000, // 1.5 tỷ
      years: 8,
      initialCapital: 50000000, // 50 triệu
      monthlyContribution: 8000000, // 8 triệu/tháng
      requiredAnnualReturn: 0,
      feasibility: 'optimal',
      feasibilityNote: '',
      suggestedPortfolio: []
    };
    const c2 = solveRequiredReturn(goal2.targetAmount, goal2.years, goal2.initialCapital, goal2.monthlyContribution);
    goal2.requiredAnnualReturn = c2.rate;
    goal2.feasibility = c2.feasibility;
    goal2.feasibilityNote = c2.note;
    goal2.suggestedPortfolio = generateRecommendedPortfolio(c2.rate, goal2.monthlyContribution, SIP_STOCKS_DATA);

    return [goal1, goal2];
  });

  // Tự động đồng bộ giá thị trường mới nhất từ bảng stock_prices trên Supabase
  const refreshLivePrices = async () => {
    try {
      setIsUpdatingPrices(true);
      const tickers = stocks.map(s => s.ticker);

      const { data: priceData, error } = await supabase
        .from('stock_prices')
        .select('ticker, price, date')
        .in('ticker', tickers)
        .order('date', { ascending: false });

      if (priceData && priceData.length > 0) {
        const latestPriceMap = new Map<string, number>();
        priceData.forEach((row: any) => {
          if (!latestPriceMap.has(row.ticker)) {
            latestPriceMap.set(row.ticker, Number(row.price));
          }
        });

        const updated = stocks.map(s => {
          const livePrice = latestPriceMap.get(s.ticker);
          if (livePrice && livePrice > 0) {
            const upside = Math.round(((s.newIntrinsicValue - livePrice) / livePrice) * 1000) / 10;
            // Cập nhật CTA theo quy tắc nếu giá vượt max buy
            let cta = s.cta;
            if (livePrice >= s.maxBuyPrice) {
              cta = '🔴 TẠM DỪNG MUA';
            } else {
              cta = '🟢 MUA TỐT';
            }
            return {
              ...s,
              currentPrice: livePrice,
              upsidePct: upside,
              cta
            };
          }
          return s;
        });

        setStocks(updated);
      }
    } catch (err) {
      console.error('Error refreshing prices:', err);
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  useEffect(() => {
    refreshLivePrices();
  }, []);

  // Xử lý khi Sales chọn 1 mã từ Watchlist Drawer muốn đưa vào tư vấn
  const handleSelectForAdvisory = (selectedStock: SIPStock) => {
    setActiveTab('advisory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* GLOBAL NAVBAR (PRINT HIDDEN)                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="print:hidden sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              FP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white">FINPEACE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 uppercase tracking-wider">
                  SIP Sales Portal
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Hệ thống Trợ lý Tư vấn Tích sản & Quản trị Mục tiêu</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'watchlist'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Watchlist</span>
              <span>2026</span>
            </button>

            <button
              onClick={() => setActiveTab('advisory')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'advisory'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Tư Vấn KYC</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xuất PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cẩm Nang</span>
            </button>
          </nav>

          {/* Quick Info & Refresh */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={refreshLivePrices}
              disabled={isUpdatingPrices}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-850 transition"
              title="Làm mới thị giá cổ phiếu từ hệ thống"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdatingPrices ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <div className="text-right">
              <div className="text-xs font-semibold text-white">{clientKYC.advisorName}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Advisor Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>FinPeace Watchlist Tích Sản © 2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Bảng Điều Khiển Định Giá & Khuyến Nghị Tích Sản Cổ Phiếu
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  Dữ liệu soát xét KQKD và chuẩn hóa định giá mới nhất Quý 2/2026. Bấm vào từng dòng để xem chi tiết KQKD, kế hoạch kinh doanh và luận điểm bán hàng dành cho Sales Advisor.
                </p>
              </div>

              <WatchlistDashboard
                stocks={stocks}
                onSelectForAdvisory={handleSelectForAdvisory}
              />
            </motion.div>
          )}

          {activeTab === 'advisory' && (
            <motion.div
              key="advisory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Target className="w-4 h-4" />
                  <span>Quy Trình Tư Vấn Tức Thì (Instant Advisory)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Khám Sức Khỏe Tài Chính, Đa Mục Tiêu & TVM Goal-Seeking
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  Nhập thông tin khách hàng, phân bổ dòng tiền hàng tháng cho từng mục tiêu cụ thể. Thuật toán TVM sẽ tự động tính toán tỷ suất tăng trưởng (CAGR) cần thiết và đề xuất rổ cổ phiếu tích sản phù hợp.
                </p>
              </div>

              <AdvisoryKYCEngine
                stocks={stocks}
                clientKYC={clientKYC}
                onUpdateKYC={setClientKYC}
                goals={goals}
                onUpdateGoals={setGoals}
                onNavigateToSummary={() => setActiveTab('summary')}
              />
            </motion.div>
          )}

          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SummaryPDFView
                clientKYC={clientKYC}
                goals={goals}
                stocks={stocks}
                onBackToKYC={() => setActiveTab('advisory')}
              />
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SIPManualGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
