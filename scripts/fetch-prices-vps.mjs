#!/usr/bin/env node
/**
 * fetch-prices-vps.mjs
 * Cron script: lấy giá current từ VPS TradingView API → POST vào update-prices API
 * 
 * Run: node scripts/fetch-prices-vps.mjs
 * Cron (PM2 or crontab): *\/15 9-15 * * 1-5 (mỗi 15 phút trong giờ giao dịch)
 * 
 * VPS API: https://histdatafeed.vps.com.vn/tradingview/history
 *   - resolution=5  → intraday 5-min bars
 *   - resolution=1D → daily close
 *   - c[]          → close price (ngàn VND)
 *   - Works for HOSE, HNX, UPCOM — no auth required
 */

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

const PRICE_UPDATE_URL = process.env.PRICE_UPDATE_URL || 'https://finpeace.vn/api/advisor/update-prices'
const PRICE_UPDATE_SECRET = process.env.PRICE_UPDATE_SECRET || 'finpeace-price-secret-2026'
const VPS_BASE = 'https://histdatafeed.vps.com.vn/tradingview/history'

// ── Fetch current price from VPS ──
async function fetchPrice(ticker) {
  const now = Math.floor(Date.now() / 1000)
  const from = now - 86400 * 2 // 2 days ago (covers weekends)
  
  // Try intraday first (5-min bars) for live price during market hours
  const url = `${VPS_BASE}?symbol=${ticker}&resolution=5&from=${from}&to=${now}`
  
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    
    if (data.s === 'ok' && data.c && data.c.length > 0) {
      const latestClose = data.c[data.c.length - 1]
      const latestTime = data.t[data.t.length - 1]
      return {
        ticker,
        price: latestClose,     // already in ngàn VND (e.g. 12.6 = 12,600đ)
        timestamp: latestTime,
        source: 'vps_5m'
      }
    }
    
    // Fallback to daily if no intraday data
    const urlDaily = `${VPS_BASE}?symbol=${ticker}&resolution=1D&from=${from}&to=${now}`
    const resD = await fetch(urlDaily, { signal: AbortSignal.timeout(8000) })
    const dataD = await resD.json()
    if (dataD.s === 'ok' && dataD.c?.length > 0) {
      return {
        ticker,
        price: dataD.c[dataD.c.length - 1],
        timestamp: dataD.t[dataD.t.length - 1],
        source: 'vps_1d'
      }
    }
    return null
  } catch (err) {
    console.warn(`  ⚠️  ${ticker}: ${err.message}`)
    return null
  }
}

// ── Main ──
async function main() {
  console.log(`\n🔄 VPS Price Fetcher — ${new Date().toLocaleString('vi-VN')}`)
  console.log('━'.repeat(50))

  // 1. Lấy tất cả tickers đang active từ trading_plans
  const { data: plans, error } = await supabase
    .from('trading_plans')
    .select('ticker')
    .eq('status', 'active')
  
  if (error || !plans?.length) {
    console.error('❌ Không lấy được danh sách tickers:', error)
    process.exit(1)
  }

  // Deduplicate
  const tickers = [...new Set(plans.map(p => p.ticker))]
  console.log(`📋 ${tickers.length} tickers cần cập nhật: ${tickers.join(', ')}`)

  // 2. Fetch prices từ VPS (parallel, max 5 at a time to avoid rate limit)
  const prices = []
  const failed = []
  
  for (let i = 0; i < tickers.length; i += 5) {
    const batch = tickers.slice(i, i + 5)
    const results = await Promise.all(batch.map(fetchPrice))
    
    for (const r of results) {
      if (r) {
        prices.push(r)
        const timeStr = new Date(r.timestamp * 1000).toLocaleTimeString('vi-VN')
        console.log(`  ✅ ${r.ticker.padEnd(6)} ${String(r.price).padEnd(8)} ngàn VND  [${r.source}@${timeStr}]`)
      } else {
        failed.push(batch[results.indexOf(r)])
      }
    }
    
    // Small delay between batches
    if (i + 5 < tickers.length) await new Promise(r => setTimeout(r, 200))
  }

  if (failed.length) console.log(`\n  ❌ Không lấy được: ${failed.join(', ')}`)

  if (!prices.length) {
    console.log('\n⚠️  Không có giá nào để cập nhật')
    return
  }

  // 3. POST to update-prices API
  console.log(`\n📡 Gửi ${prices.length} giá lên API...`)
  
  try {
    const res = await fetch(PRICE_UPDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: PRICE_UPDATE_SECRET,
        prices: prices.map(p => ({ ticker: p.ticker, price: p.price }))
      }),
      signal: AbortSignal.timeout(15000)
    })
    
    const json = await res.json()
    
    if (res.ok && json.success) {
      console.log(`✅ Thành công: ${json.message}`)
      console.log(`   → Giá: ${json.prices_count} | Tín hiệu: ${json.signals_count}`)
    } else {
      console.error('❌ API lỗi:', json)
    }
  } catch (err) {
    console.error('❌ Không gọi được API:', err.message)
  }

  console.log(`\n⏱  Hoàn thành lúc ${new Date().toLocaleTimeString('vi-VN')}\n`)
}

main().catch(console.error)
