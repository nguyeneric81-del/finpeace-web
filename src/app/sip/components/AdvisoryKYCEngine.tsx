'use client';

import React, { useState, useMemo } from 'react';
import {
  User, Plus, Trash2, Calculator, CheckCircle2, TrendingUp,
  Shield, Sparkles, ArrowRight, RefreshCw, AlertCircle, PieChart,
  HelpCircle, ChevronDown, Award, HeartHandshake, ShieldAlert,
  Compass, Flame, ShieldCheck
} from 'lucide-react';
import { ClientKYCInfo, FinancialGoal, RecommendedAllocation, SIPStock, DISCType, FinancialLandType } from '../types';
import { solveRequiredReturn, generateRecommendedPortfolio, calculateFV, evaluateCFPHealth } from '../utils/tvmEngine';

interface Props {
  stocks: SIPStock[];
  clientKYC: ClientKYCInfo;
  onUpdateKYC: (kyc: ClientKYCInfo) => void;
  goals: FinancialGoal[];
  onUpdateGoals: (goals: FinancialGoal[]) => void;
  onNavigateToSummary: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

export default function AdvisoryKYCEngine({
  stocks,
  clientKYC,
  onUpdateKYC,
  goals,
  onUpdateGoals,
  onNavigateToSummary
}: Props) {
  // Tạo unique client ID ngẫu nhiên nếu chưa có
  const generateNewClientId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `FP-KH-2026-${randomNum}`;
    onUpdateKYC({ ...clientKYC, clientId: newId });
  };

  // Tổng dòng tiền tích sản hàng tháng cho tất cả các mục tiêu
  const totalMonthlyCommitment = useMemo(() => {
    return goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  }, [goals]);

  // Đánh giá sức khỏe tài chính CFP & Sách Bình An Tài Chính
  const cfpHealth = useMemo(() => {
    return evaluateCFPHealth(clientKYC, totalMonthlyCommitment);
  }, [clientKYC, totalMonthlyCommitment]);

  // Thêm một mục tiêu mới
  const handleAddGoal = () => {
    const newGoalId = `goal-${Date.now()}`;
    const defaultGoal: FinancialGoal = {
      id: newGoalId,
      name: goals.length === 0 ? 'Mục tiêu Hưu trí An nhàn (Tuổi 60)' : `Mục tiêu Tài chính #${goals.length + 1}`,
      type: goals.length === 0 ? 'retirement' : 'custom',
      targetAmount: 3000000000, // 3 tỷ
      years: 10,
      initialCapital: 100000000, // 100 triệu
      monthlyContribution: 12000000, // 12 triệu
      requiredAnnualReturn: 0,
      feasibility: 'optimal',
      feasibilityNote: '',
      suggestedPortfolio: []
    };

    const calc = solveRequiredReturn(
      defaultGoal.targetAmount,
      defaultGoal.years,
      defaultGoal.initialCapital,
      defaultGoal.monthlyContribution
    );
    defaultGoal.requiredAnnualReturn = calc.rate;
    defaultGoal.feasibility = calc.feasibility;
    defaultGoal.feasibilityNote = calc.note;
    defaultGoal.suggestedPortfolio = generateRecommendedPortfolio(
      calc.rate,
      defaultGoal.monthlyContribution,
      stocks,
      clientKYC
    );

    onUpdateGoals([...goals, defaultGoal]);
  };

  // Cập nhật thông số của một mục tiêu và tự động chạy lại TVM engine
  const handleUpdateGoalField = (goalId: string, updates: Partial<FinancialGoal>) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id !== goalId) return goal;

      const merged = { ...goal, ...updates };
      const calc = solveRequiredReturn(
        merged.targetAmount,
        merged.years,
        merged.initialCapital,
        merged.monthlyContribution
      );

      const portfolio = generateRecommendedPortfolio(
        calc.rate,
        merged.monthlyContribution,
        stocks,
        clientKYC
      );

      return {
        ...merged,
        requiredAnnualReturn: calc.rate,
        feasibility: calc.feasibility,
        feasibilityNote: calc.note,
        suggestedPortfolio: portfolio
      };
    });

    onUpdateGoals(updatedGoals);
  };

  // Cập nhật tỷ trọng phân bổ của một mã trong rổ cổ phiếu mục tiêu
  const handleUpdateStockWeight = (goalId: string, ticker: string, newWeight: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id !== goalId) return goal;

      const updatedPortfolio = goal.suggestedPortfolio.map(item => {
        if (item.ticker !== ticker) return item;
        const newMonthly = Math.round((goal.monthlyContribution * (newWeight / 100)) / 10000) * 10000;
        return { ...item, weightPct: newWeight, monthlyAmount: newMonthly };
      });

      return { ...goal, suggestedPortfolio: updatedPortfolio };
    });

    onUpdateGoals(updatedGoals);
  };

  // Xóa mục tiêu
  const handleDeleteGoal = (goalId: string) => {
    if (goals.length <= 1) return;
    onUpdateGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <div className="space-y-8">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. KHỐI THÔNG TIN KHÁCH HÀNG & CHẨN ĐOÁN CFP / BÌNH AN        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <User className="w-4 h-4" />
              <span>HỒ SƠ KHÁCH HÀNG & CHẨN ĐOÁN CFP (BÌNH AN TÀI CHÍNH)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ứng dụng khung chẩn đoán 6 bước CFP và bản đồ tâm lý học hành vi từ tác phẩm <i>"Bình An Tài Chính"</i> (Nguyễn Tuấn Anh).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Unique Client ID:</span>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-black text-sm">
              {clientKYC.clientId || 'FP-KH-2026-0000'}
            </div>
            <button
              onClick={generateNewClientId}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-750 transition"
              title="Tạo mã khách hàng mới ngẫu nhiên"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form nhập thông tin cơ bản */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Họ và Tên Khách Hàng</label>
            <input
              type="text"
              value={clientKYC.fullName}
              onChange={e => onUpdateKYC({ ...clientKYC, fullName: e.target.value })}
              placeholder="VD: Nguyễn Văn An"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Số Điện Thoại / Zalo</label>
            <input
              type="text"
              value={clientKYC.phone}
              onChange={e => onUpdateKYC({ ...clientKYC, phone: e.target.value })}
              placeholder="VD: 0912 345 678"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Năm Sinh / Độ Tuổi</label>
            <input
              type="number"
              value={clientKYC.birthYear || ''}
              onChange={e => onUpdateKYC({ ...clientKYC, birthYear: Number(e.target.value) })}
              placeholder="VD: 1988 (38 tuổi)"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tổng Thu Nhập Hàng Tháng</label>
            <div className="relative">
              <input
                type="number"
                step={5000000}
                value={clientKYC.monthlyIncome || ''}
                onChange={e => onUpdateKYC({ ...clientKYC, monthlyIncome: Number(e.target.value) })}
                placeholder="VD: 40000000"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">VND</span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PHÂN HỆ TÂM LÝ HỌC HÀNH VI: 3 VÙNG ĐẤT & DISC                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Định Vị Tâm Lý Khách Hàng (Sách Bình An Tài Chính)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 3 Vùng đất tài chính */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Vị Trí Hiện Tại Trên Bản Đồ Tài Chính:
              </label>
              <select
                value={clientKYC.currentLand}
                onChange={e => onUpdateKYC({ ...clientKYC, currentLand: e.target.value as FinancialLandType })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="wasteland">🏜️ Vùng Đất Hoang (Bất an, mơ hồ về tiền, né tránh nhìn tài khoản)</option>
                <option value="control_growth">🌱 Vùng Đất Kiểm Soát & Phát Triển (Đang lập ngân sách, tích sản & đầu tư)</option>
                <option value="peace_oasis">🏝️ Vùng Đất Bình An (Tự do tài chính tự thân, an yên trong hiện tại)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {clientKYC.currentLand === 'wasteland' && '👉 Ưu tiên: Trấn an tâm lý, giúp khách hàng thấy rõ bức tranh tài chính và lập Quỹ khẩn cấp.'}
                {clientKYC.currentLand === 'control_growth' && '👉 Ưu tiên: Tối ưu hóa cỗ máy Tích sản SIP đều đặn theo nguyên tắc Pay Yourself First.'}
                {clientKYC.currentLand === 'peace_oasis' && '👉 Ưu tiên: Quản trị gia sản bền vững, tạo dòng tiền cổ tức an nhàn và chuyển giao thế hệ.'}
              </p>
            </div>

            {/* Hồ sơ DISC */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nhóm Tính Cách Đầu Tư DISC:
              </label>
              <select
                value={clientKYC.discType}
                onChange={e => onUpdateKYC({ ...clientKYC, discType: e.target.value as DISCType })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="S">🛡️ Nhóm S - Người Nuôi Dưỡng (An toàn, kiên định, thích hợp nhất cho SIP)</option>
                <option value="D">🚀 Nhóm D - Người Kiến Tạo (Quyết đoán, thích bứt phá, dễ mạo hiểm)</option>
                <option value="I">🤝 Nhóm I - Người Kết Nối (Sôi nổi, thích xu hướng mới, dễ FOMO)</option>
                <option value="C">📊 Nhóm C - Nhà Hoạch Định (Yêu số liệu, chuẩn mực, cầu toàn BCTC)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {clientKYC.discType === 'S' && '💡 Khách hàng nhóm S: Dễ đồng hành tích sản dài hạn nhất, cần nhấn mạnh sự an tâm của VCB, VNM, ACB.'}
                {clientKYC.discType === 'D' && '💡 Khách hàng nhóm D: Thích cổ phiếu bứt phá chu kỳ (HPG, FRT), cần nhắc nhở không dùng margin.'}
                {clientKYC.discType === 'I' && '💡 Khách hàng nhóm I: Cần kỷ luật ngày gom cố định hàng tháng để tránh bị cuốn theo tin đồn thị trường.'}
                {clientKYC.discType === 'C' && '💡 Khách hàng nhóm C: Cung cấp đầy đủ định giá P/E Fair, Sanity Check BCTC để giải tỏa tê liệt phân tích.'}
              </p>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* CFP HEALTH CHECK: HẦM TRÚ ẨN & THÁP TÀI SẢN 3 TẦNG            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quỹ khẩn cấp */}
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Tầng 1: Hầm Trú Ẩn (Quỹ Khẩn Cấp)</span>
              <Shield className={`w-4 h-4 ${
                cfpHealth.emergencyStatus === 'secure' ? 'text-emerald-400' : cfpHealth.emergencyStatus === 'warning' ? 'text-amber-400' : 'text-rose-400'
              }`} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={24}
                value={clientKYC.emergencyFundMonths}
                onChange={e => onUpdateKYC({ ...clientKYC, emergencyFundMonths: Number(e.target.value) })}
                className="w-20 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-mono font-bold text-white text-center"
              />
              <span className="text-xs text-slate-400">tháng chi tiêu</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {cfpHealth.emergencyNote}
            </p>
          </div>

          {/* Tỷ lệ tiết kiệm PYF */}
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Tỷ Lệ Tiết Kiệm (PYF Rate)</span>
              <HeartHandshake className="w-4 h-4 text-amber-400" />
            </div>

            <div className="text-lg font-black font-mono text-amber-400">
              {cfpHealth.pyfRate}% <span className="text-xs font-normal text-slate-400">thu nhập khả dụng</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {cfpHealth.pyfNote}
            </p>
          </div>

          {/* Công thức 100 - Tuổi */}
          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Phân Bổ CFP (100 - Tuổi)</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>

            <div className="text-xs text-slate-200">
              Tuổi: <strong className="font-mono text-white">{cfpHealth.age}</strong> ➔ Mục tiêu phân bổ:
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${cfpHealth.growthAllocationTarget}%` }}
                className="bg-amber-500 h-full"
                title={`Tăng trưởng: ${cfpHealth.growthAllocationTarget}%`}
              />
              <div
                style={{ width: `${cfpHealth.defensiveAllocationTarget}%` }}
                className="bg-sky-500 h-full"
                title={`Phòng thủ / Cổ tức: ${cfpHealth.defensiveAllocationTarget}%`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>🚀 Tăng trưởng: {cfpHealth.growthAllocationTarget}%</span>
              <span>🛡️ Phòng thủ: {cfpHealth.defensiveAllocationTarget}%</span>
            </div>
          </div>
        </div>

        {/* Advisor info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Chuyên Viên Tư Vấn FinPeace</label>
            <input
              type="text"
              value={clientKYC.advisorName}
              onChange={e => onUpdateKYC({ ...clientKYC, advisorName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Số Điện Thoại / Hotline Advisor</label>
            <input
              type="text"
              value={clientKYC.advisorPhone}
              onChange={e => onUpdateKYC({ ...clientKYC, advisorPhone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CẤU HÌNH ĐA MỤC TIÊU & TVM ENGINE                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>CẤU HÌNH ĐA MỤC TIÊU & TÍNH TOÁN TVM GOAL-SEEKING</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phân bổ dòng tiền tích sản định kỳ theo triết lý Tháp Tài Sản (Hưu trí, Du học con, Mua BĐS...).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Tổng dòng tiền tích sản:</span>
              <div className="text-base font-black font-mono text-emerald-400">
                {fmt(totalMonthlyCommitment)} <span className="text-xs font-normal">đ/tháng</span>
              </div>
            </div>

            <button
              onClick={handleAddGoal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Mục Tiêu</span>
            </button>
          </div>
        </div>

        {/* List of Goals */}
        <div className="space-y-6">
          {goals.map((goal, gIndex) => {
            const isFeasibleOptimal = goal.feasibility === 'optimal';
            const isFeasibleEasy = goal.feasibility === 'easy';
            const isFeasibleAggressive = goal.feasibility === 'aggressive';
            const isFeasibleHighRisk = goal.feasibility === 'high_risk';

            const totalDeposited = goal.initialCapital + goal.monthlyContribution * goal.years * 12;
            const interestGained = Math.max(0, goal.targetAmount - totalDeposited);

            return (
              <div
                key={goal.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden"
              >
                {/* Ribbon number */}
                <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-slate-800 text-[11px] font-mono font-bold text-slate-400 border-l border-b border-slate-750">
                  Mục tiêu #{gIndex + 1}
                </div>

                {/* Header of Goal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-24">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={goal.name}
                      onChange={e => handleUpdateGoalField(goal.id, { name: e.target.value })}
                      className="text-lg font-black text-amber-400 bg-transparent border-b border-dashed border-slate-700 hover:border-amber-400 focus:outline-none focus:border-amber-400 transition w-full max-w-md pb-1"
                    />
                  </div>

                  {goals.length > 1 && (
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Xóa mục tiêu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Goal Parameters Input Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-850/60 border border-slate-750">
                  {/* Target Amount */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Số tiền mục tiêu (FV)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={50000000}
                        value={goal.targetAmount}
                        onChange={e => handleUpdateGoalField(goal.id, { targetAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">VND</span>
                    </div>
                    <div className="text-[11px] text-amber-300/80 mt-1 font-mono">
                      ≈ {(goal.targetAmount / 1e9).toFixed(2)} tỷ đồng
                    </div>
                  </div>

                  {/* Years */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Thời gian tích lũy (Năm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={goal.years}
                        onChange={e => handleUpdateGoalField(goal.id, { years: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Năm</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Tương đương {goal.years * 12} tháng gom tích sản
                    </div>
                  </div>

                  {/* Initial Capital */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Vốn ban đầu sẵn có (PV)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={10000000}
                        value={goal.initialCapital}
                        onChange={e => handleUpdateGoalField(goal.id, { initialCapital: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">VND</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      ≈ {(goal.initialCapital / 1e6).toFixed(0)} triệu đồng
                    </div>
                  </div>

                  {/* Monthly Contribution */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Dòng tiền tích sản / Tháng (PMT)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={1000000}
                        value={goal.monthlyContribution}
                        onChange={e => handleUpdateGoalField(goal.id, { monthlyContribution: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-800 border border-emerald-500/40 rounded-xl font-mono text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">VND</span>
                    </div>
                    <div className="text-[11px] text-emerald-300 mt-1 font-mono">
                      ≈ {(goal.monthlyContribution / 1e6).toFixed(1)} triệu đồng / tháng
                    </div>
                  </div>
                </div>

                {/* TVM Calculation Result Bar */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[130px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Tăng trưởng cần thiết</div>
                      <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                        {goal.requiredAnnualReturn}% <span className="text-xs font-normal text-slate-400">/năm</span>
                      </div>
                      <div className="text-[10px] text-slate-400">CAGR yêu cầu</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          isFeasibleOptimal
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isFeasibleEasy
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : isFeasibleAggressive
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {isFeasibleOptimal && '⭐ ĐIỂM NGỌT TÀI CHÍNH (SWEET SPOT)'}
                          {isFeasibleEasy && '🛡️ DỄ ĐẠT - RỦI RO THẤP'}
                          {isFeasibleAggressive && '🚀 MỤC TIÊU TĂNG TRƯỞNG CAO'}
                          {isFeasibleHighRisk && '⚠️ CẢNH BÁO: KỲ VỌNG QUÁ CAO'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        {goal.feasibilityNote}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown Numbers */}
                  <div className="text-xs space-y-1 text-right self-end md:self-center border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4 min-w-[200px]">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Vốn tự tích lũy:</span>
                      <span className="font-mono font-semibold text-slate-200">{fmt(totalDeposited)} đ</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Lãi kép sinh sôi:</span>
                      <span className="font-mono font-semibold text-emerald-400">+{fmt(interestGained)} đ</span>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-slate-800 pt-1 font-bold">
                      <span className="text-slate-300">Tổng tài sản kỳ vọng:</span>
                      <span className="font-mono text-amber-400">{fmt(goal.targetAmount)} đ</span>
                    </div>
                  </div>
                </div>

                {/* Recommended Stock Portfolio for this Goal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <PieChart className="w-4 h-4 text-emerald-400" />
                      <span>RỔ CỔ PHIẾU TÍCH SẢN FINPEACE (TẦNG 2 THÁP TÀI SẢN)</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Tối ưu hóa theo DISC ({clientKYC.discType}) & CAGR {goal.requiredAnnualReturn}%/năm
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {goal.suggestedPortfolio.map(item => (
                      <div
                        key={item.ticker}
                        className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-750 hover:border-amber-500/40 transition space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-base text-amber-400">{item.ticker}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                              {item.tier}
                            </span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                            {item.cta}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 truncate">{item.name}</div>

                        <div className="flex items-center justify-between text-xs border-t border-slate-700/60 pt-2">
                          <span className="text-slate-400">Thị giá hiện tại:</span>
                          <span className="font-mono font-semibold text-white">{fmt(item.currentPrice)} đ</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Giá mua tối đa:</span>
                          <span className="font-mono font-semibold text-emerald-400">{fmt(item.maxBuyPrice)} đ</span>
                        </div>

                        {/* Editable Weight % */}
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Tỷ trọng:</span>
                            <span className="font-mono font-bold text-amber-400">{item.weightPct}%</span>
                          </div>
                          <input
                            type="range"
                            min={5}
                            max={60}
                            step={5}
                            value={item.weightPct}
                            onChange={e => handleUpdateStockWeight(goal.id, item.ticker, Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-700 rounded-lg"
                          />
                          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 pt-0.5">
                            <span>Giải ngân:</span>
                            <span>{fmt(item.monthlyAmount)} đ/tháng</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 italic line-clamp-2 leading-tight">
                          "{item.rationale}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. NÚT CHUYỂN TIẾP SANG BẢN TÓM TẮT & XUẤT PDF                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Kế hoạch tư vấn chuẩn CFP đã sẵn sàng!</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Chuyển sang bước Xuất Summary PDF để in ấn hoặc tạo tin nhắn gửi Zalo/Telegram cho khách hàng ({clientKYC.fullName || 'Khách hàng'}).
          </p>
        </div>

        <button
          onClick={onNavigateToSummary}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Xem & Xuất Báo Cáo Summary PDF</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
