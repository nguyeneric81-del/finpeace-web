import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const VPS_BASE = 'https://histdatafeed.vps.com.vn/tradingview/history'

function getMonthsInRange(startMStr, endMStr) {
    const list = [];
    let [sy, sm] = [parseInt(startMStr.substring(1,3)), parseInt(startMStr.substring(3,5))];
    let [ey, em] = [parseInt(endMStr.substring(1,3)), parseInt(endMStr.substring(3,5))];
    sy += 2000;
    ey += 2000;

    let currY = sy;
    let currM = sm;
    while (currY < ey || (currY === ey && currM <= em)) {
        list.push(`M${(currY-2000).toString().padStart(2,'0')}${currM.toString().padStart(2,'0')}`);
        currM++;
        if (currM > 12) {
            currM = 1;
            currY++;
        }
    }
    return list;
}

async function fetchHistoricalPrices(ticker, fromTs, toTs) {
    const url = `${VPS_BASE}?symbol=${ticker}&resolution=1D&from=${fromTs}&to=${toTs}`
    try {
        const res = await fetch(url)
        const data = await res.json()
        if (!data.t || data.s !== 'ok') return {}

        const pricesMap = {}
        for (let i = 0; i < data.t.length; i++) {
            const date = new Date(data.t[i] * 1000)
            const YY = (date.getFullYear() % 100).toString().padStart(2, '0')
            const MM = (date.getMonth() + 1).toString().padStart(2, '0')
            const label = `M${YY}${MM}`
            pricesMap[label] = data.c[i]
        }
        return pricesMap
    } catch (e) {
        return {}
    }
}

async function main() {
    console.log(`\n⏳ Bắt đầu tính toán và đồng bộ Tích Sản (DCA Model) - ${new Date().toLocaleString('vi-VN')}`);
    
    // 1. Fetch baselines from existing
    const { data: allSnaps } = await supabase.from('sip_performance_snapshots').select('stock_code, month');
    const startMonths = {};
    for (const row of allSnaps) {
        if (!startMonths[row.stock_code] || row.month.localeCompare(startMonths[row.stock_code]) < 0) {
            startMonths[row.stock_code] = row.month;
        }
    }

    const now = new Date();
    const currYY = (now.getFullYear() % 100).toString().padStart(2, '0');
    const currMM = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentMonthLabel = `M${currYY}${currMM}`;

    console.log(`📌 Tháng hiện tại: ${currentMonthLabel}`);
    
    // 2. Tải VNINDEX để set benchmark
    const fromTs = Math.floor(new Date('2023-01-01').getTime() / 1000);
    const toTs = Math.floor(now.getTime() / 1000);
    const vnindexPrices = await fetchHistoricalPrices('VNINDEX', fromTs, toTs);

    const tickers = Object.keys(startMonths);
    const globalPcts = {}; 

    // 3. Tính toán đường DCA tiêu chuẩn
    console.log(`🧮 Đang fetch dữ liệu VPS và tính toán DCA (${tickers.length} tickers)...`);
    for (const ticker of tickers) {
        let tp = await fetchHistoricalPrices(ticker, fromTs, toTs);
        if (ticker === 'E1VFVN30' && Object.keys(tp).length === 0) tp = await fetchHistoricalPrices('E1VFVN30', fromTs, toTs);

        const startM = startMonths[ticker];
        const monthsRange = getMonthsInRange(startM, currentMonthLabel);

        globalPcts[ticker] = {};
        
        let totalInvested = 0;
        let totalShares = 0;
        
        let vniInvested = 0;
        let vniShares = 0;

        for (const m of monthsRange) {
            const price = tp[m];
            const vniP = vnindexPrices[m];

            // Ticker return
            if (price) {
                totalInvested += 1000;
                totalShares += 1000 / price;
                const nav = totalShares * price;
                let pct = (nav / totalInvested) - 1;
                // Nếu tháng đầu tiên chưa có lãi/lỗ
                if (totalInvested === 1000) pct = 0.0;
                globalPcts[ticker][m] = { sip: pct, vni: 0 };
            } else {
                let pKeys = Object.keys(globalPcts[ticker]);
                if (pKeys.length > 0) globalPcts[ticker][m] = { sip: globalPcts[ticker][pKeys[pKeys.length - 1]].sip, vni: 0 };
                else globalPcts[ticker][m] = { sip: 0.0, vni: 0 };
            }

            // Benchmark return (VN-Index)
            if (vniP) {
                if (vniInvested === 0 && m !== startM) {
                    // Start VNINDEX matching the exact start month of the ticker
                }
                vniInvested += 1000;
                vniShares += 1000 / vniP;
                const vniNav = vniShares * vniP;
                let vPct = (vniNav / vniInvested) - 1;
                if (vniInvested === 1000) vPct = 0.0;
                globalPcts[ticker][m].vni = vPct;
            } else {
                let pKeys = Object.keys(globalPcts[ticker]);
                if (pKeys.length > 1) globalPcts[ticker][m].vni = globalPcts[ticker][pKeys[pKeys.length - 2]].vni;
            }
        }
    }

    // 4. Update Database
    console.log(`💾 Đang xoá dữ liệu bảng snapshot rác cũ...`);
    await supabase.from('sip_performance_snapshots').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Wipe all

    console.log(`📋 Nạp lại lịch sử Snapshot cho tất cả các user active...`);
    const { data: plansResp } = await supabase.from('sip_service_plans').select('user_id, stock_code');
    
    // Group by user & generate payloads
    const payload = [];
    for (const plan of plansResp) {
        const sc = plan.stock_code.trim().toUpperCase();
        if (!globalPcts[sc]) continue;

        for (const [month, metrics] of Object.entries(globalPcts[sc])) {
            payload.push({
                user_id: plan.user_id,
                month: month,
                stock_code: sc,
                cumulative_nav: 0, // Ignored logic
                sip_return_pct: metrics.sip,
                vnindex_return_pct: metrics.vni
            });
        }
    }

    console.log(`🚀 Thực hiện chia nhỏ Insert ${payload.length} records...`);
    // Batch insert ~500 at a time
    const BATCH_SIZE = 500;
    for (let i=0; i<payload.length; i+=BATCH_SIZE) {
        const batch = payload.slice(i, i+BATCH_SIZE);
        const { error } = await supabase.from('sip_performance_snapshots').insert(batch);
        if (error) console.error(`❌ Batch error: `, error);
    }

    console.log(`✅ Hoàn thành! ${payload.length} tháng hiệu suất được đẩy lên hệ thống.`);
}

main().catch(console.error);
