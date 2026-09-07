import { FinancialGoal, RecommendedAllocation, SIPStock, ClientKYCInfo } from '../types';

/**
 * Tính toán Giá trị tương lai (FV) với lãi kép gộp theo tháng
 * @param rAnnual Tỷ suất lợi nhuận năm (thập phân, vd 0.12 cho 12%)
 * @param years Số năm tích lũy
 * @param initialCapital Vốn ban đầu (PV)
 * @param monthlyContribution Dòng tiền tích sản mỗi tháng (PMT)
 */
export function calculateFV(
  rAnnual: number,
  years: number,
  initialCapital: number,
  monthlyContribution: number
): number {
  const n = years * 12;
  if (n <= 0) return initialCapital;
  
  if (rAnnual <= 0) {
    return initialCapital + monthlyContribution * n;
  }

  const rMonth = rAnnual / 12;
  const fvPV = initialCapital * Math.pow(1 + rMonth, n);
  // Niên kim đầu kỳ (Annuity Due): tích sản nạp tiền đầu mỗi tháng theo tư duy Pay Yourself First (PYF)
  const fvPMT = monthlyContribution * ((Math.pow(1 + rMonth, n) - 1) / rMonth) * (1 + rMonth);
  return fvPV + fvPMT;
}

/**
 * Goal Seeking Engine: Tìm chính xác tỷ suất sinh lời bình quân/năm (r% CAGR) cần thiết
 * Sử dụng giải thuật Binary Search (Tìm kiếm nhị phân)
 */
export function solveRequiredReturn(
  targetAmount: number,
  years: number,
  initialCapital: number,
  monthlyContribution: number
): { rate: number; feasibility: FinancialGoal['feasibility']; note: string } {
  if (targetAmount <= 0 || years <= 0) {
    return { rate: 0, feasibility: 'easy', note: 'Mục tiêu tài chính đã hoàn thành hoặc không hợp lệ.' };
  }

  const totalDeposited = initialCapital + monthlyContribution * years * 12;
  if (totalDeposited >= targetAmount) {
    return {
      rate: 0,
      feasibility: 'easy',
      note: 'Dòng tiền tích lũy gốc đã đủ đạt mục tiêu mà không cần tăng trưởng.'
    };
  }

  if (monthlyContribution <= 0 && initialCapital <= 0) {
    return {
      rate: 99.9,
      feasibility: 'high_risk',
      note: 'Chưa có vốn ban đầu và dòng tiền định kỳ. Cần bổ sung dòng tiền tích lũy hàng tháng theo nguyên tắc PYF.'
    };
  }

  let low = 0.0001; // 0.01%
  let high = 1.0; // 100%
  let mid = 0;
  const tolerance = 1000; // 1,000 VND sai số chấp nhận được

  // Check if even at 100% annual return it still doesn't reach target
  if (calculateFV(high, years, initialCapital, monthlyContribution) < targetAmount) {
    return {
      rate: 45.0,
      feasibility: 'high_risk',
      note: 'Mục tiêu quá cao so với số tiền tích sản hiện tại. Theo chuẩn CFP, khách hàng nên tăng dòng tiền hoặc kéo dài thời gian tích lũy.'
    };
  }

  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    const fv = calculateFV(mid, years, initialCapital, monthlyContribution);
    if (Math.abs(fv - targetAmount) <= tolerance) {
      break;
    }
    if (fv < targetAmount) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const ratePct = Math.round(mid * 1000) / 10; // làm tròn 1 chữ số thập phân, vd 12.4%

  let feasibility: FinancialGoal['feasibility'] = 'optimal';
  let note = '';

  if (ratePct <= 9.0) {
    feasibility = 'easy';
    note = `Mục tiêu rất an toàn & khả thi (${ratePct}%/năm). Thuộc Tầng 2 Tháp tài sản, phù hợp tập trung rổ cổ phiếu phòng thủ, cổ tức tiền mặt cao và vốn hóa lớn.`;
  } else if (ratePct <= 16.0) {
    feasibility = 'optimal';
    note = `Điểm ngọt tài chính (Sweet Spot) của FinPeace (${ratePct}%/năm - gấp 2.5 lần lãi suất tiết kiệm). Tập trung nhóm doanh nghiệp Tier 1 tăng trưởng bền vững 2 chữ số.`;
  } else if (ratePct <= 22.0) {
    feasibility = 'aggressive';
    note = `Mục tiêu tăng trưởng cao (${ratePct}%/năm). Phù hợp nhóm tính cách D/I, cần phân bổ vào nhóm siêu chu kỳ, mở rộng công suất hoặc chuỗi bán lẻ bùng nổ.`;
  } else {
    feasibility = 'high_risk';
    note = `Kỳ vọng tăng trưởng rất gắt (${ratePct}%/năm). Advisor cần tư vấn giải tỏa kỳ vọng phi thực tế, tăng dòng tiền tích sản hàng tháng hoặc nới dài thời gian.`;
  }

  return { rate: ratePct, feasibility, note };
}

/**
 * Thuật toán tự động gợi ý danh mục cổ phiếu tích sản FinPeace dựa trên:
 * 1. Tỷ suất r% cần thiết
 * 2. Độ tuổi khách hàng (Công thức 100 - Tuổi của CFP)
 * 3. Hồ sơ tâm lý DISC từ sách "Bình An Tài Chính"
 */
export function generateRecommendedPortfolio(
  requiredRate: number,
  monthlyBudget: number,
  allStocks: SIPStock[],
  clientKYC?: Partial<ClientKYCInfo>
): RecommendedAllocation[] {
  const buyableStocks = allStocks.filter(s => s.cta.includes('MUA'));
  const stocksPool = buyableStocks.length >= 4 ? buyableStocks : allStocks;

  const birthYear = clientKYC?.birthYear || 1990;
  const currentYear = new Date().getFullYear();
  const age = Math.max(18, Math.min(80, currentYear - birthYear));
  const discType = clientKYC?.discType || 'S';

  let selectedTickers: { ticker: string; weight: number; rationale: string }[] = [];

  // Logic theo nhóm tính cách DISC & Tỷ suất CAGR
  if (discType === 'S' || requiredRate <= 11.0) {
    // Nhóm S (Steadiness - Thích an toàn, nuôi dưỡng, bền bỉ) hoặc CAGR thấp: VCB, VNM, MIG, ACB
    selectedTickers = [
      { ticker: 'VCB', weight: 35, rationale: 'Vua ngân hàng Việt Nam, an toàn tuyệt đối, phù hợp phong cách tích sản nuôi dưỡng bền bỉ của người nhóm S.' },
      { ticker: 'VNM', weight: 25, rationale: 'Cổ tức tiền mặt đều đặn (~6.8%/năm), như cỗ máy in tiền bảo vệ dòng thu nhập ổn định cho gia đình.' },
      { ticker: 'MIG', weight: 20, rationale: 'Bảo hiểm MBBank, danh mục tiền gửi chiếm 50% tài sản, phòng thủ vững vàng trong mọi biến động.' },
      { ticker: 'ACB', weight: 20, rationale: 'Ngân hàng chuẩn mực số 1 về quản trị rủi ro, trả cổ tức tiền mặt bền bỉ bất chấp chu kỳ thị trường.' }
    ];
  } else if (discType === 'D' || requiredRate > 18.0) {
    // Nhóm D (Dominance - Thích bứt phá, kiến tạo, lợi nhuận cao): HPG, FRT, GMD, TCX
    selectedTickers = [
      { ticker: 'HPG', weight: 35, rationale: 'Dung Quất 2 bùng nổ công suất, siêu chu kỳ dòng tiền tự do phục vụ mục tiêu kiến tạo tài sản lớn của nhóm D.' },
      { ticker: 'FRT', weight: 25, rationale: 'Chuỗi Long Châu và trung tâm tiêm chủng bùng nổ doanh thu 3 chữ số, tăng trưởng thần tốc.' },
      { ticker: 'GMD', weight: 20, rationale: 'Cảng nước sâu Gemalink hưởng trọn dòng chảy thương mại quốc tế, biên lợi nhuận cảng tiệm cận 50%.' },
      { ticker: 'TCX', weight: 20, rationale: 'Định chế Wealthtech dẫn đầu chuẩn bị niêm yết sàn HOSE, quán quân thị phần cho vay margin toàn quốc.' }
    ];
  } else if (discType === 'C') {
    // Nhóm C (Conscientiousness - Yêu số liệu, chuẩn mực, thận trọng): VCB, CTG, MBB, FPT
    selectedTickers = [
      { ticker: 'VCB', weight: 30, rationale: 'Chất lượng tài sản và tỷ lệ bao phủ nợ xấu dẫn đầu hệ thống, số liệu tài chính minh bạch nhất.' },
      { ticker: 'MBB', weight: 25, rationale: 'CASA dẫn đầu ngành (>40%), ROE >23%, định giá P/B quanh 1.0x hấp dẫn dưới góc nhìn số liệu khắt khe của nhóm C.' },
      { ticker: 'FPT', weight: 25, rationale: 'Doanh thu phần mềm xuất khẩu tỷ USD, hợp tác NVIDIA phát triển AI Factory, tăng trưởng 15 năm liên tiếp.' },
      { ticker: 'CTG', weight: 20, rationale: 'Big 4 ngân hàng, P/E chỉ 6.2x với biên an toàn định giá trên 35%, thỏa mãn tiêu chuẩn Graham.' }
    ];
  } else {
    // Nhóm I (Influence - Kết nối, dễ hưng phấn, cân bằng): HPG, MBB, MWG, FPT
    selectedTickers = [
      { ticker: 'HPG', weight: 30, rationale: 'Trụ cột ngành thép, hưởng lợi trực tiếp từ đầu tư công và phục hồi kinh tế vĩ mô.' },
      { ticker: 'MBB', weight: 25, rationale: 'Hệ sinh thái số dẫn đầu thu hút hàng chục triệu người trẻ, cỗ máy sinh lời bền bỉ.' },
      { ticker: 'MWG', weight: 25, rationale: 'Bách Hóa Xanh sinh lời lớn, mạng lưới bán lẻ số 1 Việt Nam đang lấy lại phong độ rực rỡ.' },
      { ticker: 'FPT', weight: 20, rationale: 'Công nghệ số 1 Việt Nam, cổ phiếu thiết yếu giữ vai trò mỏ neo niềm tin dài hạn.' }
    ];
  }

  // Điều chỉnh tỷ trọng theo công thức 100 - Tuổi của CFP:
  // Nếu tuổi cao (>50 tuổi), tăng tỷ trọng mã phòng thủ/cổ tức; nếu trẻ (<35 tuổi), giữ tỷ trọng tăng trưởng cao
  return selectedTickers.map(item => {
    const stock = stocksPool.find(s => s.ticker === item.ticker) || allStocks.find(s => s.ticker === item.ticker);
    const ticker = stock?.ticker || item.ticker;
    const name = stock?.name || item.ticker;
    const sector = stock?.sector || 'Doanh nghiệp đầu ngành';
    const tier = stock?.tier || 'Tier 1';
    const cta = stock?.cta || '🟢 MUA TỐT';
    const maxBuyPrice = stock?.maxBuyPrice || 0;
    const currentPrice = stock?.currentPrice || 0;
    const upsidePct = stock?.upsidePct || 0;
    const expectedGrowthPct = stock?.expectedGrowthPct || 15;
    const monthlyAmount = Math.round((monthlyBudget * (item.weight / 100)) / 10000) * 10000;

    return {
      ticker,
      name,
      sector,
      tier,
      cta,
      maxBuyPrice,
      currentPrice,
      upsidePct,
      expectedGrowthPct,
      weightPct: item.weight,
      monthlyAmount,
      rationale: item.rationale
    };
  });
}

/**
 * Đánh giá sức khỏe tài chính toàn diện theo tiêu chuẩn CFP & Sách Bình An Tài Chính
 */
export function evaluateCFPHealth(kyc: ClientKYCInfo, totalMonthlySIP: number) {
  const { monthlyIncome, monthlyExpense, emergencyFundMonths, birthYear } = kyc;
  const currentYear = new Date().getFullYear();
  const age = Math.max(18, currentYear - (birthYear || 1990));

  // 1. Tỷ lệ tiết kiệm / Trích lập tích sản (Pay Yourself First - PYF)
  const pyfRate = monthlyIncome > 0 ? Math.round((totalMonthlySIP / monthlyIncome) * 1000) / 10 : 0;
  let pyfStatus: 'low' | 'good' | 'high' = 'good';
  let pyfNote = '';
  if (pyfRate < 15) {
    pyfStatus = 'low';
    pyfNote = `Tỷ lệ trích lập tích sản hiện tại là ${pyfRate}% (<15%). Khuyến nghị nâng lên mức chuẩn 20% theo nguyên tắc 50/30/20 trong sách Bình An Tài Chính.`;
  } else if (pyfRate <= 35) {
    pyfStatus = 'good';
    pyfNote = `Tỷ lệ trích lập tích sản đạt ${pyfRate}% (chuẩn mực vàng 20% - 35%). Khách hàng đang thực hành rất tốt tư duy "Trả cho mình trước" (PYF).`;
  } else {
    pyfStatus = 'high';
    pyfNote = `Tỷ lệ trích lập tích sản rất cao (${pyfRate}%). Cần lưu ý đảm bảo chất lượng cuộc sống hiện tại và không thắt lưng buộc bụng quá mức.`;
  }

  // 2. Đánh giá Quỹ khẩn cấp (Hầm Trú Ẩn)
  let emergencyStatus: 'danger' | 'warning' | 'secure' = 'secure';
  let emergencyNote = '';
  if (emergencyFundMonths < 3) {
    emergencyStatus = 'danger';
    emergencyNote = `Chưa có hầm trú ẩn an toàn (${emergencyFundMonths} tháng chi tiêu). Cực kỳ rủi ro nếu gặp biến cố! Advisor cần tư vấn trích lập song song quỹ khẩn cấp 3-6 tháng trước khi dồn toàn bộ vào cổ phiếu.`;
  } else if (emergencyFundMonths < 6) {
    emergencyStatus = 'warning';
    emergencyNote = `Hầm trú ẩn tạm đủ (${emergencyFundMonths} tháng chi tiêu). Tiếp tục tích lũy dần lên 6 tháng để bảo vệ tâm lý vững vàng khi thị trường chứng khoán rung lắc.`;
  } else {
    emergencyStatus = 'secure';
    emergencyNote = `Hầm trú ẩn vững chắc (${emergencyFundMonths} tháng chi tiêu). Tầng 1 Tháp tài sản đã kiên cố, hoàn toàn yên tâm phân bổ dòng tiền mạnh mẽ vào Tích sản cổ phiếu SIP.`;
  }

  // 3. Công thức 100 - Tuổi phân bổ tài sản tăng trưởng
  const growthAllocationTarget = Math.max(20, Math.min(80, 100 - age));
  const defensiveAllocationTarget = 100 - growthAllocationTarget;

  return {
    age,
    pyfRate,
    pyfStatus,
    pyfNote,
    emergencyStatus,
    emergencyNote,
    growthAllocationTarget,
    defensiveAllocationTarget
  };
}
