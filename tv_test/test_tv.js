const TradingView = require('@mathieuc/tradingview');

const symbols = [
  'HOSE:FPT', 'HOSE:HPG', 'HOSE:VCB', 'HOSE:VNM',
  'HNX:SHS', 'HNX:PVS', 'HNX:IDC',
  'UPCOM:BSR', 'UPCOM:VEA', 'UPCOM:MCH',
];

console.log('Khởi tạo kết nối TradingView...');
const client = new TradingView.Client(); // Creates a websocket client

// Request all fields to get fundamentals
const quoteSession = new client.Session.Quote({ fields: 'all' });

console.log(`Đang lấy giá realtime cho ${symbols.length} mã chứng khoán...\n`);

let loadedCount = 0;

symbols.forEach(symbol => {
  const market = new quoteSession.Market(symbol);
  
  market.onLoaded(() => {
    // We wait for data
  });

  market.onData((data) => {
    if (data.lp) {
      console.log(`✅ ${symbol.padEnd(10)} | Giá: ${data.lp.toLocaleString()} ${data.currency_id || 'VND'} | Biến động: ${data.ch?.toFixed(2) || '-'} (${data.chp?.toFixed(2) || '-'}%)`);
      console.log(`   👉 Khối lượng: ${data.volume?.toLocaleString() || '-'}`);
      
      if (data.market_cap_basic) console.log(`   👉 Vốn hóa (Market Cap): ${data.market_cap_basic.toLocaleString()}`);
      if (data.basic_eps_net_income) console.log(`   👉 EPS TTM: ${data.basic_eps_net_income.toLocaleString()}`);
      if (data.price_earnings_ttm) console.log(`   👉 P/E TTM: ${data.price_earnings_ttm.toLocaleString()}`);
      if (data.dividends_yield) console.log(`   👉 Dividend Yield: ${data.dividends_yield.toLocaleString()}%`);
      
      console.log('----------------------------------------------------');
      
      loadedCount++;
      // Once we have a hit for this symbol, we can close the market to prevent spam
      market.close();
      
      if (loadedCount >= symbols.length) {
        console.log('\nĐã lấy đủ 10 mã. Đóng kết nối...');
        client.end();
      }
    }
  });

  market.onError((err) => {
    console.error(`Error for ${symbol}:`, err);
  });
});

// Fallback timeout
setTimeout(() => {
  console.log('\nTimeout 15 giây. Đóng kết nối...');
  client.end();
}, 15000);
