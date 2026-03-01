/**
 * Thư viện Toán Tài Chính (Time Value of Money - TVM) cho Dự án FinPeace
 * Phỏng theo công thức lõi của Google Sheets / Excel
 */

/**
 * Tính số kỳ (số năm) cần thiết để đạt tới Giá trị Tương lai (Target Amount)
 * Dựa trên Lãi suất Kép, Giá trị Hiện tại (Vốn đầu tư ban đầu), và Dòng tiền đều đặn (Cashflow)
 * Tương đương với hàm =NPER() trong Excel.
 *
 * @param rate Lãi suất mỗi kỳ (ví dụ: nếu 8%/năm thì truyền 0.08)
 * @param pmt Khoản đóng góp đều đặn vào mỗi kỳ (ví dụ: Góp 100tr/năm). Phải là SỐ ÂM (dòng tiền ra).
 * @param pv Giá trị hiện tại (Vốn ban đầu). Phải là SỐ ÂM (dòng tiền ra).
 * @param fv Giá trị tương lai mong muốn đạt được (Ví dụ: 10 Tỷ VND)
 * @param type Lịch thanh toán dòng tiền: 0 (Cuối kỳ - Default), 1 (Đầu kỳ)
 * @returns Số kỳ (Số năm) cần thiết để đạt mục tiêu
 */
export function calculateNPER(rate: number, pmt: number, pv: number, fv: number, type: 0 | 1 = 0): number {
    if (rate === 0) {
        return -(fv + pv) / pmt;
    }

    const num = (pmt * (1 + rate * type) - fv * rate) / (pv * rate + pmt * (1 + rate * type));

    if (num <= 0) {
        // Dòng tiền hoặc vốn không đủ sức đạt mục tiêu (Return warning hoặc log lỗi)
        return NaN;
    }

    return Math.log(num) / Math.log(1 + rate);
}


/**
 * Tính Giá trị Tương lai (Future Value) của khoản đầu tư
 * Tương đương với hàm =FV() trong Excel.
 * 
 * @param rate Lãi suất mỗi kỳ (Nếu lãi theo năm: rate = 8%, nper = năm)
 * @param nper Tổng số kỳ đóng tiền đầu tư
 * @param pmt Khoản góp thêm đều đặn mỗi kỳ. Phải là SỐ ÂM
 * @param pv Số vốn ban đầu đang có. Phải là SỐ ÂM
 * @param type Hình thức trả góp (0 - Cuối kỳ, 1 - Đầu kỳ)
 * @returns Giá trị gộp cuối cùng
 */
export function calculateFV(rate: number, nper: number, pmt: number, pv: number, type: 0 | 1 = 0): number {
    if (rate === 0) {
        return -(pv + pmt * nper);
    }

    const factor = Math.pow(1 + rate, nper);
    return -(pv * factor + (pmt * (1 + rate * type) * (factor - 1)) / rate);
}

/**
 * Tính tỉ lệ Sinh lời Thực (Real Rate of Return) - Sau khi trừ đi Lạm phát
 * Áp dụng Phương trình Fisher: 1 + Tỉ suất Thực = (1 + Tỉ suất Danh nghĩa) / (1 + Tỉ lệ Lạm phát)
 * @param nominalRate Tỉ suất Sinh lời danh nghĩa (VD: 10%)
 * @param inflationRate Tỉ lệ lạm phát (VD: 4%)
 * @returns Tỉ suất Sinh lời thực tế
 */
export function calculateRealRate(nominalRate: number, inflationRate: number): number {
    return ((1 + nominalRate) / (1 + inflationRate)) - 1;
}
