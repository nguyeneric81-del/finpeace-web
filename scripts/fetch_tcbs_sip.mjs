import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TICKERS = ['SSI', 'TLG', 'VNM', 'HPG', 'BCM', 'FOX', 'FPT', 'GAS', 'IMP', 'MBB', 'MIG', 'NLG', 'PNJ', 'TPB', 'VPB'];

const TCBS_OVERVIEW_URL = (ticker) => `https://apipubaws.tcbs.com.vn/tcanalysis/v1/ticker/${ticker}/overview`;
const TCBS_FINANCE_URL = (ticker) => `https://apipubaws.tcbs.com.vn/tcanalysis/v1/finance/${ticker}?yearly=0&isAll=false`;

async function fetchTickerData(ticker) {
    try {
        console.log(`📡 Fetching ${ticker}...`);
        
        // Overview
        const overviewRes = await fetch(TCBS_OVERVIEW_URL(ticker));
        const overviewData = await overviewRes.json();
        
        // Finance Quarters
        const financeRes = await fetch(TCBS_FINANCE_URL(ticker));
        const financeData = await financeRes.json();
        
        return {
            ticker,
            overview: overviewData,
            recent_quarters: financeData.slice(0, 4) // Giữ 4 quý gần nhất
        };
    } catch (e) {
        console.error(`❌ Error fetching ${ticker}`, e);
        return { ticker, error: e.message };
    }
}

async function main() {
    const results = {};
    for (const ticker of TICKERS) {
        results[ticker] = await fetchTickerData(ticker);
        // Ngủ nhỏ để không bị Rate Limit
        await new Promise(r => setTimeout(r, 500));
    }
    
    const outPath = path.join(__dirname, 'tcbs_sip_data.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n✅ Hoàn tất lưu dữ liệu tại: ${outPath}`);
}

main().catch(console.error);
