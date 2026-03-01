import { calculateRealRate } from "@/utils/math/financial-math";

export function calculateWealth(
  initialInvest: number,
  monthlyInvest: number,
  debtYears: number,
  debtPayment: number,
  expectedReturn: number,
  inflationRate: number,
  years: number,
  targetAmount: number
) {
  const months = years * 12;
  const realReturnRate = calculateRealRate(expectedReturn / 100, inflationRate / 100);
  const monthlyRate = realReturnRate / 12;

  let currentWealth = 0;
  let totalInvested = 0;

  const chartData = [];

  for (let m = 1; m <= months; m++) {
    // Logic đầu tư hàng tháng
    let monthlyInput = monthlyInvest;

    // Nếu hết nợ -> Cộng tiền trả nợ vào đầu tư
    if (m > debtYears * 12) {
      monthlyInput += debtPayment;
    }

    // Công thức lãi kép
    currentWealth = (currentWealth + monthlyInput) * (1 + monthlyRate);
    totalInvested += monthlyInput;

    // Ghi dữ liệu vào mảng (cho biểu đồ)
    // Chỉ ghi 1 năm 1 lần cho đỡ dày (nếu muốn) hoặc ghi từng tháng
    // Ở đây ghi từng tháng để vẽ mượt
    chartData.push({
      month: m,
      wealth: Math.round(currentWealth),
      goal: targetAmount, // Đường mục tiêu ngang
      invested: Math.round(totalInvested) // Vốn gốc
    });
  }

  return {
    finalWealth: Math.round(currentWealth),
    gap: targetAmount - Math.round(currentWealth),
    chartData
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
