'use client';

import React, { useState } from 'react';
import { calculateWealth, formatCurrency } from '@/lib/calculator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, Sprout, TrendingUp, DollarSign } from 'lucide-react';

export default function GardenDashboard({ initialData }: { initialData: any }) {
  // State quản lý Input
  const [inputs, setInputs] = useState({
    income: initialData.income,
    expense: initialData.expense,
    debtPayment: initialData.debt_payment,
    debtYears: initialData.debt_years,
    monthlyInvest: initialData.current_invest,
    targetAmount: initialData.target_amount,
    years: initialData.years_to_goal,
    expectedReturn: initialData.expected_return
  });

  // Tính toán lại mỗi khi Input thay đổi
  const result = calculateWealth(
    0, // Vốn ban đầu (tạm tính là 0)
    inputs.monthlyInvest,
    inputs.debtYears,
    inputs.debtPayment,
    inputs.expectedReturn,
    3.5, // Thêm chỉ số Lạm phát tĩnh (3.5%) để đồng bộ
    inputs.years,
    inputs.targetAmount
  );

  const netCashflow = inputs.income - inputs.expense - inputs.debtPayment;
  const isDeficit = netCashflow < 0;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-green-50">
      {/* SIDEBAR: INPUT ĐIỀU CHỈNH */}
      <div className="w-full lg:w-1/3 bg-white p-6 shadow-xl overflow-y-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
          <Sprout className="w-6 h-6" /> Khu Vườn Của Bạn
        </h2>

        <div className="space-y-6">
          {/* SECTION 1: DÒNG CHẢY */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Dòng Chảy Nước (Cashflow)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Thu nhập (VND)</label>
                <input
                  type="number"
                  value={inputs.income}
                  onChange={(e) => setInputs({ ...inputs, income: Number(e.target.value) })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Chi phí Sinh hoạt (VND)</label>
                <input
                  type="number"
                  value={inputs.expense}
                  onChange={(e) => setInputs({ ...inputs, expense: Number(e.target.value) })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Trả nợ / Lãi vay (VND)</label>
                <input
                  type="number"
                  value={inputs.debtPayment}
                  onChange={(e) => setInputs({ ...inputs, debtPayment: Number(e.target.value) })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 border-red-200 bg-red-50"
                />
              </div>

              <div className={`p-3 rounded text-center font-bold ${isDeficit ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Dư: {formatCurrency(netCashflow)} / tháng
              </div>
            </div>
          </div>

          {/* SECTION 2: GIEO TRỒNG */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Gieo Trồng Tương Lai
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Thời gian trả nợ (Năm)</label>
                <input
                  type="range" min="0" max="20"
                  value={inputs.debtYears}
                  onChange={(e) => setInputs({ ...inputs, debtYears: Number(e.target.value) })}
                  className="w-full accent-green-600"
                />
                <div className="text-right text-sm font-bold text-green-700">{inputs.debtYears} Năm</div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Đầu tư thêm (VND)</label>
                <input
                  type="number"
                  value={inputs.monthlyInvest}
                  onChange={(e) => setInputs({ ...inputs, monthlyInvest: Number(e.target.value) })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Lãi suất kỳ vọng (%/năm)</label>
                <input
                  type="range" min="5" max="25" step="0.5"
                  value={inputs.expectedReturn}
                  onChange={(e) => setInputs({ ...inputs, expectedReturn: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <div className="text-right text-sm font-bold text-blue-700">{inputs.expectedReturn}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN: BIỂU ĐỒ & KẾT QUẢ */}
      <div className="w-full lg:w-2/3 p-8 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 h-96">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" /> Sự Sinh Trưởng Của Tài Sản
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData}>
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <YAxis tickFormatter={(val) => `${val / 1000000}M`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip formatter={(value: any) => value ? formatCurrency(value) : 'N/A'} labelFormatter={(label) => `Tháng ${label}`} />
              <Area type="monotone" dataKey="wealth" stroke="#82ca9d" fillOpacity={1} fill="url(#colorWealth)" name="Tài sản" />
              <Area type="monotone" dataKey="goal" stroke="#ff7300" strokeDasharray="5 5" fill="none" name="Mục tiêu" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* KẾT QUẢ CUỐI CÙNG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105">
            <div className="text-sm opacity-80 mb-1">Tài sản sau {inputs.years} năm</div>
            <div className="text-3xl font-bold">{formatCurrency(result.finalWealth)}</div>
          </div>

          <div className={`p-6 rounded-xl shadow-lg transform transition hover:scale-105 text-white ${result.gap > 0 ? 'bg-orange-500' : 'bg-blue-500'}`}>
            <div className="text-sm opacity-80 mb-1">So với Mục tiêu ({formatCurrency(inputs.targetAmount)})</div>
            <div className="text-3xl font-bold">
              {result.gap > 0 ? `Thiếu ${formatCurrency(result.gap)}` : `Dư ${formatCurrency(Math.abs(result.gap))}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
