import { create } from 'zustand'

interface FinanceState {
    // --- Các thông số giả định "What-If" ---
    monthlySaving: number;      // Tiền tiết kiệm & đem đi đầu tư mỗi tháng (VND)
    expectedReturn: number;     // Lãi suất kỳ vọng / Tỷ suất sinh lời (%/năm)
    debtPayment: number;        // Tiền trả nợ mỗi tháng (VND)
    inflationRate: number;      // Tỷ lệ lạm phát kỳ vọng (%/năm)

    // --- Các hành động cập nhật state ---
    setMonthlySaving: (amount: number) => void;
    setExpectedReturn: (rate: number) => void;
    setDebtPayment: (amount: number) => void;
    setInflationRate: (rate: number) => void;
}

export const useFinanceStore = create<FinanceState>()((set) => ({
    // Giá trị khởi tạo mặc định (Có thể lấy từ DB sau khi User login)
    monthlySaving: 15000000, // 15 triệu
    expectedReturn: 8.5,     // 8.5% năm
    debtPayment: 5000000,    // 5 triệu
    inflationRate: 3.5,      // 3.5% năm

    setMonthlySaving: (amount) => set({ monthlySaving: amount }),
    setExpectedReturn: (rate) => set({ expectedReturn: rate }),
    setDebtPayment: (amount) => set({ debtPayment: amount }),
    setInflationRate: (rate) => set({ inflationRate: rate }),
}))
