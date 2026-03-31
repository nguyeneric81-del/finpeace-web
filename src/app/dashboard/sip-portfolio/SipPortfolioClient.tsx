'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { LucideTrendingUp, LucideInfo, LucideTarget } from 'lucide-react';

interface SipPortfolioClientProps {
  plans: any[];
  performanceData: any[];
  insights: any[];
}

export default function SipPortfolioClient({ plans, performanceData, insights }: SipPortfolioClientProps) {
  
  if (plans.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center shadow-sm">
        <LucideTarget className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You haven't enrolled in a SIP plan yet!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Start building your long term wealth systematically today.</p>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-md shadow-emerald-500/20">
          Talk to an Advisor
        </button>
      </div>
    );
  }

  // Deduplicate unique active stock codes for the lines
  const uniqueStocks = Array.from(new Set(plans.map(p => p.stock_code)));
  const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#a855f7'];

  // Filter out invalid future months (Excel formula artifacts where formula evaluates to exactly -100%)
  const cleanPerformanceData = performanceData.filter(d => Number(d.sip_return_pct) !== -1);

  // Format data for Recharts (group by month, plot individual tickers)
  const groupedByMonth = cleanPerformanceData.reduce((acc: any, curr: any) => {
    if (!acc[curr.month]) {
      acc[curr.month] = {
        name: curr.month,
        'VN-Index (%)': curr.vnindex_return_pct ? Number((curr.vnindex_return_pct * 100).toFixed(2)) : 0,
        tempSipReturnSum: 0,
        stockCount: 0,
        rawNavTotal: 0,
      };
    }
    
    // Set dynamic stock KPI key
    const returnVal = curr.sip_return_pct ? Number((curr.sip_return_pct * 100).toFixed(2)) : 0;
    acc[curr.month][curr.stock_code] = returnVal;
    
    // Tracking average and total metrics per month node
    acc[curr.month].tempSipReturnSum += returnVal;
    acc[curr.month].stockCount += 1;
    acc[curr.month].rawNavTotal += Number(curr.cumulative_nav || 0);

    return acc;
  }, {});

  const chartData: any[] = Object.values(groupedByMonth).sort((a: any, b: any) => a.name.localeCompare(b.name));
  
  // Calculate final KPI values derived from the newest chronological month
  const latestMonthData = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const averageYtdReturn = latestMonthData && latestMonthData.stockCount > 0 
    ? (latestMonthData.tempSipReturnSum / latestMonthData.stockCount).toFixed(2) 
    : '0.00';

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollment</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{uniqueStocks.length} Tickers</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Portfolio NAV</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {latestMonthData ? `${Number(latestMonthData.rawNavTotal).toLocaleString()} VND` : 'Pending Data'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Portfolio Return</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
            <LucideTrendingUp className="w-6 h-6 mr-2" />
            {averageYtdReturn}%
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm h-96">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance relative to VN-Index</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} unit="%" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              {uniqueStocks.map((stock, i) => (
                <Line 
                  key={stock} 
                  type="monotone" 
                  dataKey={stock} 
                  stroke={COLORS[i % COLORS.length]} 
                  strokeWidth={3} 
                  activeDot={{ r: 8 }} 
                  isAnimationActive={true}
                />
              ))}
              <Line type="monotone" dataKey="VN-Index (%)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col">
            <LucideInfo className="w-8 h-8 mb-2 opacity-50" />
            <p>We are aggregating your performance data. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Research Insights */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">FinPeace Research Insights</h3>
        {insights.length > 0 ? (
          <div className="space-y-6">
            {insights.map(item => (
              <div key={item.id} className="border-l-4 border-emerald-500 pl-4 py-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-bold text-gray-900 dark:text-white">{item.stock_code} Quarter Update</h4>
                  <span className="text-xs text-gray-500">{new Date(item.update_date).toLocaleDateString()}</span>
                </div>
                {item.business_outlook && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Kinh doanh:</span> {item.business_outlook}
                  </p>
                )}
                {item.sip_outlook && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Tích sản:</span> {item.sip_outlook}
                  </p>
                )}
                <div className="mt-3 flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${item.cta?.toLowerCase().includes('dừng') ? 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400' : 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    Action: {item.cta || 'Neutral'}
                  </span>
                  {item.expected_growth && (
                    <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                      Growth: {Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(Number(item.expected_growth))}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent insights from the Research Team.</p>
        )}
      </div>
    </div>
  );
}
