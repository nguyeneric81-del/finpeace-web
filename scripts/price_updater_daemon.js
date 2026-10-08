const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const TradingView = require('@mathieuc/tradingview');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Lỗi: Không tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cấu hình chu kỳ
const UPDATE_INTERVAL_SEC = 180; // 3 phút / chu kỳ trong giờ giao dịch
const BATCH_SIZE = 50;           // 50 mã / batch
const BATCH_DELAY_MS = 1500;     // Nghỉ 1.5s giữa các batch

function getTodayString() {
  const d = new Date();
  // Timezone Vietnam UTC+7
  const vnTime = new Date(d.getTime() + 7 * 3600 * 1000);
  return vnTime.toISOString().split('T')[0];
}

function getTradingStatus() {
  const now = new Date();
  const vnTime = new Date(now.getTime() + 7 * 3600 * 1000);
  const day = vnTime.getUTCDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const hours = vnTime.getUTCHours();
  const minutes = vnTime.getUTCMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Cuối tuần: Thứ 7 (6) hoặc Chủ Nhật (0)
  if (day === 0 || day === 6) {
    return { isTrading: false, reason: 'Cuối tuần (Thị trường đóng cửa)', sleepMinutes: 60 };
  }

  // 09:00 - 11:30 (540 - 690)
  if (totalMinutes >= 540 && totalMinutes <= 690) {
    return { isTrading: true, session: 'Phiên Sáng' };
  }

  // Nghỉ trưa: 11:30 - 12:58 (690 - 778)
  if (totalMinutes > 690 && totalMinutes < 778) {
    const sleepMins = 778 - totalMinutes;
    return { isTrading: false, reason: 'Nghỉ trưa', sleepMinutes: sleepMins };
  }

  // 13:00 - 15:02 (780 - 902)
  if (totalMinutes >= 778 && totalMinutes <= 902) {
    return { isTrading: true, session: 'Phiên Chiều' };
  }

  // Ngoài giờ giao dịch (sau 15:02 chiều đến trước 08:58 sáng hôm sau)
  let sleepMins = 0;
  if (totalMinutes > 902) {
    sleepMins = (24 * 60 - totalMinutes) + 538; // Đến 08:58 sáng mai
  } else {
    sleepMins = 538 - totalMinutes; // Đến 08:58 sáng nay
  }

  return { isTrading: false, reason: 'Ngoài giờ giao dịch', sleepMinutes: Math.max(sleepMins, 15) };
}

// Lấy danh sách toàn bộ mã từ Supabase
async function getAllTickers() {
  let allCompanies = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('ticker, exchange')
      .order('ticker')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    allCompanies = allCompanies.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  return allCompanies;
}

// Fetch batch từ TradingView Websocket
function fetchBatchPrices(tvSymbols) {
  return new Promise((resolve) => {
    const client = new TradingView.Client();
    global.TW_DEBUG = false;
    const quoteSession = new client.Session.Quote({ fields: 'all' });
    const results = {};
    let loadedCount = 0;

    const timeout = setTimeout(() => {
      client.end();
      resolve(results);
    }, 8000); // 8 giây timeout cho 1 batch

    tvSymbols.forEach((symObj) => {
      const tvSymbol = symObj.tvSymbol;
      const ticker = symObj.ticker;

      const market = new quoteSession.Market(tvSymbol);

      market.onData((data) => {
        if (data.lp) {
          results[ticker] = {
            ticker: ticker,
            price: data.lp,
            change: data.ch || 0,
            change_percent: data.chp || 0,
            volume: data.volume || 0,
            source: 'tradingview'
          };
          loadedCount++;
          market.close();

          if (loadedCount >= tvSymbols.length) {
            clearTimeout(timeout);
            client.end();
            resolve(results);
          }
        }
      });

      market.onError(() => {
        loadedCount++;
        market.close();
        if (loadedCount >= tvSymbols.length) {
          clearTimeout(timeout);
          client.end();
          resolve(results);
        }
      });
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1 vòng cập nhật toàn thị trường
async function runUpdateCycle() {
  const startTime = Date.now();
  const today = getTodayString();
  console.log(`\n⏰ [${new Date().toLocaleTimeString('vi-VN')}] BẮT ĐẦU CẬP NHẬT GIÁ TOÀN THỊ TRƯỜNG (Ngày: ${today})`);

  const companies = await getAllTickers();
  if (companies.length === 0) {
    console.log('⚠️ Không tìm thấy mã nào trong bảng companies');
    return;
  }

  console.log(`📋 Tổng số mã niêm yết: ${companies.length} mã. Đang chia thành các batch ${BATCH_SIZE} mã...`);

  // Map sang format TradingView
  const mappedList = companies.map((c) => {
    let exPrefix = 'HOSE';
    if (c.exchange === 'HNX' || c.exchange === 'UPCOM' || c.exchange === 'UPCoM') {
      exPrefix = 'HNX';
    }
    return {
      ticker: c.ticker,
      tvSymbol: `${exPrefix}:${c.ticker}`
    };
  });

  let totalSuccess = 0;
  const allUpsertRecords = [];

  for (let i = 0; i < mappedList.length; i += BATCH_SIZE) {
    const batch = mappedList.slice(i, i + BATCH_SIZE);
    const batchResults = await fetchBatchPrices(batch);

    Object.values(batchResults).forEach((res) => {
      if (res && res.price) {
        allUpsertRecords.push({
          ticker: res.ticker,
          price: res.price,
          date: today,
          source: 'tradingview',
          updated_at: new Date().toISOString()
        });
        totalSuccess++;
      }
    });

    await sleep(BATCH_DELAY_MS);
  }

  // Bulk upsert vào Supabase (chỉ 1 row/ngày/mã, update in-place)
  if (allUpsertRecords.length > 0) {
    for (let i = 0; i < allUpsertRecords.length; i += 200) {
      const chunk = allUpsertRecords.slice(i, i + 200);
      await supabase.from('stock_prices').upsert(chunk, { onConflict: 'ticker,date' });
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ HOÀN THÀNH VÒNG QUÉT: Đã cập nhật ${totalSuccess}/${companies.length} mã trong ${durationSec}s.`);
}

async function main() {
  const isOnce = process.argv.includes('--once');

  console.log('=====================================================');
  console.log('🚀 FINPEACE SMART REALTIME PRICE UPDATER DAEMON');
  console.log(`⏱️ Chu kỳ: ${UPDATE_INTERVAL_SEC}s/lần trong giờ GD (09:00 - 15:00)`);
  console.log('🛡️ Cơ chế: In-place Upsert 1 row/mã/ngày (Không phình DB)');
  console.log('=====================================================');

  if (isOnce) {
    await runUpdateCycle();
    process.exit(0);
  }

  while (true) {
    const status = getTradingStatus();

    if (status.isTrading) {
      console.log(`\n🟢 Thị trường đang mở (${status.session}). Tiến hành cập nhật...`);
      try {
        await runUpdateCycle();
      } catch (err) {
        console.error('❌ Lỗi trong vòng quét:', err.message);
      }
      console.log(`⏳ Nghỉ ${UPDATE_INTERVAL_SEC}s trước vòng quét tiếp theo...`);
      await sleep(UPDATE_INTERVAL_SEC * 1000);
    } else {
      console.log(`\n💤 ${status.reason}. Daemon sẽ tạm ngủ ${status.sleepMinutes} phút...`);
      await sleep(status.sleepMinutes * 60 * 1000);
    }
  }
}

main();
