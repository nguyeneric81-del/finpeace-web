require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, `pipeline_${new Date().toISOString().split('T')[0]}.log`);

// ─── LOGGER ───────────────────────────────────────────────────────────────────
function log(msg) {
  const ts = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const line = `[${ts}] ${msg}`;
  console.log(line);
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  log('🚀 ===== BẮT ĐẦU MACRO PIPELINE =====');
  log(`📅 Thời gian chạy: ${new Date().toISOString()}`);

  try {
    log('📡 Bước 1/1: Cào báo cáo Vĩ mô từ VietStock...');
    // Load & run crawler inline (reuse the same logic)
    const crawlerPath = path.join(__dirname, 'vietstock_reports_crawler.js');
    require(crawlerPath);
    log('✅ Pipeline hoàn tất thành công!');
  } catch (err) {
    log(`❌ Lỗi pipeline: ${err.message}`);
    process.exit(1);
  }

  log('🏁 ===== KẾT THÚC MACRO PIPELINE =====\n');
}

main();
