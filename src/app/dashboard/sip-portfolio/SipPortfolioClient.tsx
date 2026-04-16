'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  Shield, BarChart3, Clock, CheckCircle2, AlertTriangle, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  plans: any[];
  transactions: any[];
  performanceData: any[];
  insights: any[];
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(n));
const fmtBig = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' tỷ';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' triệu';
  return fmt(n);
};

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];

export default function SipPortfolioClient({ plans, transactions, performanceData, insights }: Props) {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const uniqueStocks = [...new Set(plans.map(p => p.stock_code))];
  const cleanPerf = performanceData.filter(d => Number(d.sip_return_pct) !== -1);

  // Group performance by month for chart
  const groupedByMonth = cleanPerf.reduce((acc: any, curr: any) => {
    if (!acc[curr.month]) {
      acc[curr.month] = { name: curr.month, 'VN-Index (%)': Number((Number(curr.vnindex_return_pct || 0) * 100).toFixed(2)) };
    }
    acc[curr.month][curr.stock_code] = Number((Number(curr.sip_return_pct || 0) * 100).toFixed(2));
    return acc;
  }, {});
  const chartData = Object.values(groupedByMonth).sort((a: any, b: any) => a.name.localeCompare(b.name));
  const latestData: any = chartData[chartData.length - 1];

  // Total invested per stock
  const investedByStock: Record<string, number> = {};
  transactions.forEach(t => {
    investedByStock[t.stock_code] = (investedByStock[t.stock_code] || 0) + Number(t.total_value || 0);
  });
  const totalInvested = Object.values(investedByStock).reduce((s, v) => s + v, 0);

  // Latest return per stock
  const latestReturnByStock: Record<string, number> = {};
  cleanPerf.slice().reverse().forEach(s => {
    if (latestReturnByStock[s.stock_code] === undefined) {
      latestReturnByStock[s.stock_code] = Number(s.sip_return_pct || 0) * 100;
    }
  });

  // Insights by stock (kept latest because it's ordered DESC)
  const insightsByStock: Record<string, any> = {};
  insights.forEach(ins => { 
    if (!insightsByStock[ins.stock_code]) {
      insightsByStock[ins.stock_code] = ins; 
    }
  });
  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
        <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Bạn chưa đăng ký tích sản</h2>
        <p className="text-slate-500 mb-6">Liên hệ advisor FinPeace để bắt đầu hành trình tích lũy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Đang Tích</p>
          <p className="text-2xl font-black text-slate-800">{uniqueStocks.length} mã</p>
          <p className="text-xs text-slate-400 mt-1">{uniqueStocks.join(' · ')}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Giải Ngân</p>
          <p className="text-2xl font-black text-slate-800">{fmtBig(totalInvested)}</p>
          <p className="text-xs text-slate-400 mt-1">{transactions.length} giao dịch</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Return</p>
          {latestData ? (() => {
            const vals = uniqueStocks.map(s => latestData[s]).filter(v => v !== undefined);
            const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
            return (
              <>
                <p className={`text-2xl font-black ${avg >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {avg >= 0 ? '+' : ''}{avg.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-1">so với vốn gốc ban đầu</p>
              </>
            );
          })() : <p className="text-2xl font-black text-slate-300">—</p>}
        </div>
      </div>

      {/* Per-stock cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Chi Tiết Từng Mã</h2>
        <div className="space-y-3">
          {uniqueStocks.map((stock, i) => {
            const txList = transactions.filter(t => t.stock_code === stock);
            const invested = investedByStock[stock] || 0;
            const ret = latestReturnByStock[stock];
            const ins = insightsByStock[stock];
            const isExpanded = expandedTx === stock;
            const isDung = ins?.cta?.toLowerCase().includes('dừng');

            return (
              <motion.div key={stock} layout className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Stock header */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedTx(isExpanded ? null : stock)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    >
                      {stock.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{stock}</p>
                      <p className="text-xs text-slate-400">{txList.length} giao dịch · {fmtBig(invested)} đã giải ngân</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Return badge */}
                    {ret !== undefined && (
                      <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl ${ret >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {ret >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {ret >= 0 ? '+' : ''}{ret.toFixed(1)}%
                      </div>
                    )}
                    {/* CTA badge */}
                    {ins && (
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${isDung ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isDung ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isDung ? 'Quan sát' : 'Duy trì'}
                      </div>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded: Research insight + transaction list */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-slate-50 space-y-4 pt-4">
                        {/* Research insight */}
                        {ins && (
                          <div className={`rounded-xl p-4 ${isDung ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-emerald-100/50">
                              <p className="text-xs font-bold text-slate-600">Nhận Định FinPeace · {ins.quarter_update}</p>
                              <div className="flex gap-2">
                                {ins.max_buy_price && (
                                  <span className="text-[10px] px-2 py-0.5 bg-white rounded-lg border border-red-200 text-red-600 font-bold flex items-center gap-1 shadow-sm">
                                    <Shield className="w-3 h-3" />
                                    Max Buy: {Number(ins.max_buy_price).toLocaleString('vi-VN')}đ
                                  </span>
                                )}
                                {ins.expected_growth && (
                                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100/50 rounded-lg border border-emerald-200 text-emerald-700 font-bold">
                                    Mục tiêu TT: {(Number(ins.expected_growth) * 100).toFixed(0)}%/năm
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {ins.business_outlook ? (
                              <article className="prose prose-sm prose-slate max-w-none prose-headings:text-emerald-800 prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-p:text-slate-700 prose-li:text-slate-700 marker:text-emerald-500 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50 prose-blockquote:px-3 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-emerald-800">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {ins.business_outlook}
                                </ReactMarkdown>
                              </article>
                            ) : (
                              <p className="text-sm text-slate-700 leading-relaxed">{ins.sip_outlook}</p>
                            )}
                          </div>
                        )}

                        {/* Transaction history */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lịch Sử Giải Ngân</p>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {txList.map((tx, j) => (
                              <div key={j} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className="text-slate-500">{tx.order_date}</span>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                  <span className="text-slate-400">{Number(tx.unit || 0).toLocaleString('vi-VN')} CP @ {Number(tx.buy_price || 0).toLocaleString('vi-VN')}đ</span>
                                  <span className="font-bold text-slate-700">{fmtBig(Number(tx.total_value || 0))}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800">Hiệu Suất so với VN-Index</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: 12 }}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend />
              {uniqueStocks.map((stock, i) => (
                <Line key={stock} type="monotone" dataKey={stock}
                  stroke={COLORS[i % COLORS.length]} strokeWidth={2.5}
                  dot={false} activeDot={{ r: 6 }} />
              ))}
              <Line type="monotone" dataKey="VN-Index (%)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
