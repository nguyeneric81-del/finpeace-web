export type CTAType = '🟢 MUA TỐT' | '🟡 MUA' | '🔴 TẠM DỪNG MUA' | '🟠 THEO DÕI';

export type DISCType = 'D' | 'I' | 'S' | 'C';

export type FinancialLandType = 'wasteland' | 'control_growth' | 'peace_oasis';

export interface SIPStock {
  ticker: string;
  name: string;
  sector: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  status: string;
  currentPrice: number;
  oldIntrinsicValue: number;
  newIntrinsicValue: number;
  maxBuyPrice: number;
  expectedIntrinsicValue: number;
  expectedGrowthPct: number; // e.g. 10, 15, 20
  expectedGrowthLabel: string; // '> 10%', '> 20%'
  cta: CTAType;
  upsidePct: number;
  businessOutlook: string;
  sipOutlook: string;
  plan2026: string;
  bctcLink: string;
  quickReview: string;
  updateDate: string;
  grahamPoints?: string[];
  salesScript?: string;
  stockType?: 'defensive' | 'core_growth' | 'super_cycle'; // Phân loại theo Tháp tài sản CFP
  canvasPresentationUrl?: string; // Link đến bản thuyết trình thể chế Canvas LV3
  canvasReportTitle?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  type: 'retirement' | 'education' | 'real_estate' | 'wealth_freedom' | 'custom';
  targetAmount: number; // Số tiền mục tiêu (VND)
  years: number; // Thời gian tích lũy (Năm)
  initialCapital: number; // Vốn ban đầu sẵn có (VND)
  monthlyContribution: number; // Dòng tiền tích sản hàng tháng (VND)
  
  // Kết quả tính toán TVM
  requiredAnnualReturn: number; // CAGR % cần thiết mỗi năm (ví dụ: 12.5)
  feasibility: 'easy' | 'optimal' | 'aggressive' | 'high_risk';
  feasibilityNote: string;
  suggestedPortfolio: RecommendedAllocation[];
}

export interface RecommendedAllocation {
  ticker: string;
  name: string;
  sector: string;
  tier: string;
  cta: CTAType;
  maxBuyPrice: number;
  currentPrice: number;
  upsidePct: number;
  expectedGrowthPct: number;
  weightPct: number; // e.g. 25%
  monthlyAmount: number; // VND
  rationale: string;
}

export interface ClientKYCInfo {
  clientId: string; // Unique Client ID: FP-KH-2026-XXXX
  fullName: string;
  phone: string;
  email: string;
  birthYear: number;
  monthlyIncome: number; // Tổng thu nhập hàng tháng
  monthlyExpense: number; // Chi phí sinh hoạt tối thiểu hàng tháng
  emergencyFundMonths: number; // Quỹ khẩn cấp hiện có (số tháng chi tiêu: 0 - 12+)
  riskTolerance: 'conservative' | 'moderate' | 'growth';
  discType: DISCType; // Hồ sơ tâm lý tài chính DISC từ sách Bình An Tài Chính
  currentLand: FinancialLandType; // Vùng đất tài chính hiện tại
  advisorName: string;
  advisorPhone: string;
  notes?: string;
}
