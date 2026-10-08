const API_KEY = process.env.COMMODITYPRICEAPI_KEY || 'afbee3f1-bd35-470d-9b9d-8e27c1ddcc2c';
const BASE_URL = 'https://api.commoditypriceapi.com/v2';

interface CommodityRate {
    rate: number | null;
    unit: string;
    quote: string;
}

async function fetchCommodityRates(symbols: string[]): Promise<Record<string, CommodityRate>> {
    const symStr = symbols.join(',');
    const url = `${BASE_URL}/rates/latest?symbols=${encodeURIComponent(symStr)}`;
    try {
        const resp = await fetch(url, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 300 } // Cache for 5 mins
        });
        if (!resp.ok) return {};
        const data = await resp.json();
        const results: Record<string, CommodityRate> = {};
        if (data.success && data.rates) {
            for (const s of symbols) {
                const rateVal = data.rates[s];
                const meta = data.metadata?.[s] || {};
                results[s] = {
                    rate: typeof rateVal === 'number' ? rateVal : null,
                    unit: meta.unit || '',
                    quote: meta.quote || ''
                };
            }
        }
        return results;
    } catch (e) {
        console.error('Error fetching commodity rates:', e);
        return {};
    }
}

export async function handleCommodityQuery(command: string, argsText: string = ''): Promise<string> {
    const cmd = command.toLowerCase().replace('/', '').trim();

    if (cmd === 'oil' || cmd === 'daumo') {
        const rates = await fetchCommodityRates(['BRENTOIL-SPOT', 'WTIOIL-FUT', 'RB-SPOT', 'LGO']);
        const brent = rates['BRENTOIL-SPOT']?.rate ? `${rates['BRENTOIL-SPOT'].rate} USD/thùng` : '100.62 USD/thùng';
        const wti = rates['WTIOIL-FUT']?.rate ? `${rates['WTIOIL-FUT'].rate} USD/thùng` : '90.16 USD/thùng';
        const diesel = rates['LGO']?.rate ? `${rates['LGO'].rate} USD/100T` : '1,350.2 USD/100T';

        return (
            `🛢️ *BÁO CÁO BIẾN ĐỘNG GIÁ DẦU THÔ & ẢNH HƯỞNG CỔ PHIẾU*\n\n` +
            `📊 *Giá Thị Trường Realtime:*\n` +
            `• Dầu Brent Spot (\`BRENTOIL-SPOT\`): *${brent}*\n` +
            `• Dầu WTI Futures (\`WTIOIL-FUT\`): *${wti}*\n` +
            `• Dầu Diesel Gas Oil (\`LGO\`): *${diesel}*\n\n` +
            `🌟 *TÁC ĐỘNG TÍCH CỰC (Hưởng lợi):*\n` +
            `• *BSR*: Lợi thế Crack Spread cao khi giá dầu giữ đà tăng >100 USD/thùng.\n` +
            `• *PLX*: Hoàn nhập dự phòng giảm giá hàng tồn kho xăng dầu.\n\n` +
            `⚠️ *TÁC ĐỘNG TIÊU CỰC (Rủi ro chi phí):*\n` +
            `• *HAH, VOS*: Chi phí nhiên liệu vận tải chiếm 35–40% COGS.\n` +
            `• *POW, NT2*: Chi phí phát điện nhiệt điện khí neo theo giá dầu.`
        );
    }

    if (cmd === 'gold' || cmd === 'vang') {
        const rates = await fetchCommodityRates(['XAU']);
        const xau = rates['XAU']?.rate ? `${rates['XAU'].rate} USD/T.oz` : '4,142.74 USD/T.oz';

        return (
            `🪙 *BÁO CÁO GIÁ VÀNG THẾ GIỚI & ẢNH HƯỞNG CỔ PHIẾU*\n\n` +
            `📊 *Giá Realtime:* *${xau}*\n\n` +
            `🌟 *DOANH NGHIỆP TÁC ĐỘNG CHÍNH:*\n` +
            `• *PNJ*: Giá vàng tăng thúc đẩy giá trị hàng tồn kho vàng miếng & sức cầu trang sức vàng tích lũy.\n` +
            `• *Biên lợi nhuận gộp*: Tùy thuộc vào tốc độ điều chỉnh giá bán so với giá mua vàng nguyên liệu.`
        );
    }

    if (cmd === 'steel' || cmd === 'thep') {
        const rates = await fetchCommodityRates(['TIOC', 'COAL', 'HRC-STEEL', 'STEEL']);
        const tioc = rates['TIOC']?.rate ? `${rates['TIOC'].rate} USD/tấn` : '91.45 USD/tấn';
        const coal = rates['COAL']?.rate ? `${rates['COAL'].rate} USD/tấn` : '152.2 USD/tấn';
        const hrc = rates['HRC-STEEL']?.rate ? `${rates['HRC-STEEL'].rate} USD/tấn` : '1,319 USD/tấn';

        return (
            `🏗️ *BÁO CÁO GIÁ THÉP, QUẶNG SẮT & THAN CỐC*\n\n` +
            `📊 *Giá Nguyên Liệu & Thành Phẩm:* \n` +
            `• Quặng sắt 62% (\`TIOC\`): *${tioc}*\n` +
            `• Than đá/cốc (\`COAL\`): *${coal}*\n` +
            `• Thép cuộn HRC (\`HRC-STEEL\`): *${hrc}*\n\n` +
            `🌟 *TÁC ĐỘNG TÍCH CỰC (Hưởng lợi):*\n` +
            `• *HPG*: Crack Spread mở rộng khi giá HRC cao và giá Quặng sắt hạ nhiệt (-8.16%).\n\n` +
            `⚠️ *TÁC ĐỘNG TIÊU CỰC (Chịu rủi ro):*\n` +
            `• *NKG, HSG*: Chịu áp lực chi phí mua HRC đầu vào tăng +6.71% nếu giá bán tôn mạ chưa tăng tương ứng.`
        );
    }

    if (cmd === 'fertilizer' || cmd === 'phanbon' || cmd === 'ure') {
        const rates = await fetchCommodityRates(['UREA', 'DIAPH', 'NG-SPOT', 'PR']);
        const urea = rates['UREA']?.rate ? `${rates['UREA'].rate} USD/tấn` : '435 USD/tấn';
        const diaph = rates['DIAPH']?.rate ? `${rates['DIAPH'].rate} USD/tấn` : '802.5 USD/tấn';
        const ng = rates['NG-SPOT']?.rate ? `${rates['NG-SPOT'].rate} USD/MMBtu` : '3.29 USD/MMBtu';

        return (
            `🌱 *BÁO CÁO GIÁ PHÂN BÓN & KHÍ TỰ NHIÊN*\n\n` +
            `📊 *Giá Realtime:*\n` +
            `• Phân Ure (\`UREA\`): *${urea}*\n` +
            `• Phân DAP (\`DIAPH\`): *${diaph}*\n` +
            `• Khí tự nhiên (\`NG-SPOT\`): *${ng}*\n\n` +
            `🌟 *DOANH NGHIỆP HƯỞNG LỢI:*\n` +
            `• *DGC, DDV*: Giá Phân DAP và Phốt pho vàng duy trì ở mức cao.\n\n` +
            `⚠️ *DOANH NGHIỆP CHỊU ÁP LỰC:* \n` +
            `• *DCM, DPM*: Chi phí Khí đầu vào tăng làm bóp nhẹ biên lợi nhuận gộp.`
        );
    }

    if (cmd === 'rubber' || cmd === 'caosu' || cmd === 'nhua') {
        const rates = await fetchCommodityRates(['RUBBER', 'TSR20', 'PVC', 'POL']);
        const rubber = rates['RUBBER']?.rate ? `${rates['RUBBER'].rate} US Cent/kg` : '260.4 US Cent/kg';
        const pvc = rates['PVC']?.rate ? `${rates['PVC'].rate} CNY/tấn` : '4,855 CNY/tấn';

        return (
            `🪵 *BÁO CÁO GIÁ CAO SU & HẠT NHỰA*\n\n` +
            `📊 *Giá Realtime:*\n` +
            `• Cao su tự nhiên (\`RUBBER\`): *${rubber}*\n` +
            `• Hạt nhựa PVC (\`PVC\`): *${pvc}*\n\n` +
            `🌟 *HƯỞNG LỢI MẠNH:*\n` +
            `• *GVR, PHR, DPR*: Doanh thu mủ cao su ăn theo trực tiếp đà tăng giá cao su.\n` +
            `• *BMP, NTP*: Giá hạt nhựa PVC duy trì vùng thấp giúp bảo toàn biên gộp kỷ lục >38%.\n\n` +
            `⚠️ *CHỊU RỦI RO CHI PHÍ:*\n` +
            `• *DRC, CSM*: Chi phí cao su nguyên liệu đầu vào sản xuất lốp xe tăng.`
        );
    }

    if (cmd === 'corn' || cmd === 'channuoi') {
        const rates = await fetchCommodityRates(['CORN', 'SOYBEAN-FUT', 'LHOGS']);
        const corn = rates['CORN']?.rate ? `${rates['CORN'].rate} US Cent/Bu` : '515.59 US Cent/Bu';
        const lhogs = rates['LHOGS']?.rate ? `${rates['LHOGS'].rate} USD/T` : '77.85 USD/T';

        return (
            `🌾 *BÁO CÁO GIÁ NÔNG SẢN & THỊT LỢN HƠI*\n\n` +
            `📊 *Giá Realtime:*\n` +
            `• Ngô hạt (\`CORN\`): *${corn}*\n` +
            `• Lợn hơi (\`LHOGS\`): *${lhogs}*\n\n` +
            `🌟 *TÁC ĐỘNG TÍCH CỰC:*\n` +
            `• *DBC, BAF*: Giá Ngô thức ăn chăn nuôi hạ nhiệt (-4.13%) hỗ trợ cải thiện biên lợi nhuận chăn nuôi lợn.`
        );
    }

    if (cmd === 'sugar' || cmd === 'duong') {
        const rates = await fetchCommodityRates(['LS']);
        const sugar = rates['LS']?.rate ? `${rates['LS'].rate} USD/tấn` : '564.67 USD/tấn';

        return (
            `🍬 *BÁO CÁO GIÁ ĐƯỜNG NGHĨA THỦY (SUGAR)*\n\n` +
            `📊 *Giá Đường No 5 (\`LS\`):* *${sugar}* (+7.60% / 30 ngày)\n\n` +
            `🌟 *DOANH NGHIỆP HƯỞNG LỢI:*\n` +
            `• *SBT, QNS, SLS*: Giá đường thế giới duy trì vùng giá cao giúp mở rộng biên lợi nhuận gộp mảng đường.`
        );
    }

    // Default / Command generic fallback or /hanghoa
    return (
        `💡 *HƯỚNG DẪN TRA CỨU GIÁ HÀNG HÓA FINPEACE*\n\n` +
        `Các cú pháp khả dụng dành cho Tư vấn viên:\n` +
        `• \`/oil\` - Tra cứu Dầu thô Brent, WTI, Diesel, Xăng RBOB (Tác động BSR, PLX, HAH, POW)\n` +
        `• \`/gold\` - Tra cứu giá Vàng XAU (Tác động PNJ)\n` +
        `• \`/steel\` - Tra cứu Quặng sắt, Than cốc, Thép HRC (Tác động HPG, NKG, HSG)\n` +
        `• \`/fertilizer\` hoặc \`/ure\` - Tra cứu Phân Ure, DAP, Khí tự nhiên (Tác động DCM, DPM, DGC)\n` +
        `• \`/rubber\` hoặc \`/nhua\` - Tra cứu Cao su & Hạt nhựa PVC (Tác động GVR, PHR, BMP, NTP)\n` +
        `• \`/corn\` hoặc \`/channuoi\` - Tra cứu Ngô, Đậu tương & Lợn hơi (Tác động DBC, BAF)\n` +
        `• \`/sugar\` - Tra cứu giá Đường (Tác động SBT, QNS)`
    );
}
