/**
 * lib/stockspick.ts
 * Client tích hợp Stockspick (finpeace.vn) BO (Backoffice) API
 * Tự động đồng bộ luồng PTCB -> PTKT -> Trading Plan giả lập Analyst
 */

import { SupabaseClient } from '@supabase/supabase-js'

const BO_BASE_URL = 'https://apiprod.finpeace.vn/backoffice-service'
const BO_EMAIL = process.env.STOCKSPICK_BO_EMAIL || 'quangnm@finpeace.vn'
const BO_PASS = process.env.STOCKSPICK_BO_PASS || 'GCbh#4'

let _cachedToken: string | null = null
let _tokenExpiry = 0

// ─────────────────────────────────────────────────────────────────────────────
// 🔐 AUTH
// ─────────────────────────────────────────────────────────────────────────────

export async function getBackofficeToken(): Promise<string> {
  const now = Date.now()
  if (_cachedToken && now < _tokenExpiry) return _cachedToken

  const res = await fetch(`${BO_BASE_URL}/v1/users/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: BO_EMAIL, password: BO_PASS }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`[Stockspick Auth] Đăng nhập thất bại: ${res.status} — ${text}`)
  }

  const data = await res.json()
  const token: string = data.accessToken
  if (!token) throw new Error('[Stockspick Auth] Không nhận được accessToken')

  _cachedToken = token
  _tokenExpiry = now + 50 * 60 * 1000 // cache 50 phút
  return token
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 XỬ LÝ LƯU TRỮ HÌNH ẢNH SUPABASE -> BO STORAGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tải ảnh PTKT từ đường link Supabase về định dạng Blob.
 */
async function fetchImageBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`[Stockspick Storage] Không thể tải ảnh từ Supabase Cloud (${res.status}) - URL: ${url}`)
  return await res.blob()
}

// ─────────────────────────────────────────────────────────────────────────────
// 📊 USE CASE 1: AUTO-SYNC TRADING PLAN BẰNG GIẢ LẬP BACKOFFICE
// ─────────────────────────────────────────────────────────────────────────────

export interface SupabaseTradingPlan {
  id: string
  ticker: string
  company_name?: string
  strategy_name?: string
  entry_zone?: string
  stop_loss?: string
  take_profit?: string
  risk_reward?: string
  timeframe?: string
  analyst_note?: string
  chart_image_url?: string
  wave_index?: string
  status?: string
  stockspick_trading_plan_id?: string
  stockspick_technical_analysis_id?: string
  stockspick_fundamental_analysis_id?: string
  win_rate?: number
  support_price?: number
  resistance_price?: number
  created_at?: string
}

export interface StockspickSyncResult {
  success: boolean
  tradingPlanId?: string
  technicalAnalysisId?: string
  fundamentalAnalysisId?: string
  error?: string
}

export interface SupabaseFundamentalAnalysis {
  id: string
  ticker: string
  start_valuation_date: string
  end_valuation_date: string
  ev: number
  bv: number
  valuation_type: string
  valuation_price: number
  fundamental_insight: string
  bo_fundamental_id?: string
}

// ── Parse helpers ──────────────────────────────────────────────────────────────

function pVal(v: number): number {
  if (isNaN(v)) return 0;
  return v < 1000 && v > 0 ? v * 1000 : v;
}

function parseEntryZone(s?: string): { buyLow: number; buyHigh: number } {
  if (!s) return { buyLow: 0, buyHigh: 0 }
  const parts = s.replace(/,/g, '').split(/[-\u2013]/).map((x: string) => parseFloat(x.trim()))
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]))
    return { buyLow: pVal(parts[0]), buyHigh: pVal(parts[1]) }
  const v = pVal(parseFloat(s.replace(/,/g, '').trim()))
  return { buyLow: v, buyHigh: v === 0 ? 0 : Math.round(v * 1.02) }
}

function parseTakeProfit(s?: string): { sellLow: number; sellHigh: number; takeProfit: number } {
  if (!s) return { sellLow: 0, sellHigh: 0, takeProfit: 0 }
  const parts = s.replace(/,/g, '').split(/[-\u2013]/).map((x: string) => parseFloat(x.trim()))
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]))
    return { sellLow: pVal(parts[0]), sellHigh: pVal(parts[1]), takeProfit: pVal(parts[1]) }
  const v = pVal(parseFloat(s.replace(/,/g, '').trim()))
  return { sellLow: v === 0 ? 0 : Math.round(v * 0.98), sellHigh: v, takeProfit: v }
}

function parseCutLoss(s?: string): number {
  if (!s) return 0
  const v = parseFloat(s.replace(/,/g, '').trim())
  return pVal(v)
}

function parseRiskReward(s?: string): { riskRate: number; profitRate: number; rewardPortion: string } {
  if (!s) return { riskRate: 5, profitRate: 10, rewardPortion: '10:5' }
  const parts = s.split(':').map(x => parseFloat(x.trim()))
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const risk = Math.round(parts[0] * 5)
    const profit = Math.round(parts[1] * 5)
    return { riskRate: risk, profitRate: profit, rewardPortion: `${profit}:${risk}` }
  }
  return { riskRate: 5, profitRate: 10, rewardPortion: '10:5' }
}

function detectWaveType(s?: string): 'TRENDING' | 'SIDEWAY' {
  return s?.toLowerCase().includes('sideway') ? 'SIDEWAY' : 'TRENDING'
}

function getTradingDates(timeframe?: string): { startTradingDate: string; endTradingDate: string } {
  const today = new Date()
  const start = today.toISOString().split('T')[0]
  let months = 6
  if (timeframe) {
    const t = timeframe.toLowerCase()
    if (t.includes('ngắn') || t.includes('1-3')) months = 3
    else if (t.includes('dài') || t.includes('12')) months = 12
  }
  const end = new Date(today)
  end.setMonth(end.getMonth() + months)
  return { startTradingDate: start, endTradingDate: end.toISOString().split('T')[0] }
}

// ── BO API Sync Helper Functions ───────────────────────────────────────────────

/**
 * Xử lý Bước 1: Khởi tạo/Lấy ID Phân Tích Cơ Bản (PTCB)
 */
async function ensureFundamentalAnalysis(
  plan: SupabaseTradingPlan,
  supabase: SupabaseClient,
  token: string,
  startTradingDate: string,
  endTradingDate: string,
  targetPrice: number
): Promise<string> {
  // 1. Kiểm tra trong Supabase
  const { data: ptcbList } = await supabase.from('fundamental_analyses').select('*').eq('ticker', plan.ticker).limit(1)
  let ptcb = ptcbList?.[0] as SupabaseFundamentalAnalysis

  if (ptcb && ptcb.bo_fundamental_id) {
    return ptcb.bo_fundamental_id
  }

  // 2. Nếu chưa có, thu thập API TCB từ hệ thống BO
  const stockRes = await fetch(`${BO_BASE_URL}/v1/stocks/${plan.ticker}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  const ev = 50000;
  const bv = 10000;
  
  if (stockRes.ok) {
    const stockData = await stockRes.json()
    if (stockData.basicFinance) {
        // Fallbacks backoffice data
        if (stockData.basicFinance.marketCap) ptcb = { ...ptcb, ev: stockData.basicFinance.marketCap }
        if (stockData.basicFinance.bv) ptcb = { ...ptcb, bv: stockData.basicFinance.bv }
    }
  }

  // 3. Chuẩn bị Payload tạo PTCB
  const payload = {
    symbol: plan.ticker,
    startValuationDate: startTradingDate,
    endValuationDate: endTradingDate,
    ev: ptcb?.ev || ev, 
    bv: ptcb?.bv || bv,
    valuationType: "VALUE", 
    valuationPrice: targetPrice,
    fundamentalInsight: "AUTO_GENERATED_BY_FINPEACE_AGENT",
    isWatchList: true
  }

  // 4. KIỂM TRA TRÊN BACKOFFICE CÓ TỒN TẠI PTCB CHƯA TRƯỚC KHI TẠO MỚI (Tránh 400 trùng lặp)
  let newBoId: string | null = null;
  let existingItem: any = null;

  const getClosedRes = await fetch(`${BO_BASE_URL}/v1/fundamental-analysis:getClosed?symbol=${plan.ticker}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (getClosedRes.ok) {
    const closedText = (await getClosedRes.text()).replace(/"id":\s*(\d+)/g, '"id":"$1"')
    const closedData = JSON.parse(closedText)
    if (closedData.content?.[0]?.id) {
      existingItem = closedData.content[0]
      newBoId = String(existingItem.id)
    }
  }

  // 5. NẾU CHƯA CÓ TRÊN BO THÌ GỌI API TẠO MỚI (POST /v1/fundamental-analysis)
  if (!newBoId) {
    const createRes = await fetch(`${BO_BASE_URL}/v1/fundamental-analysis`, {
      method: 'POST',
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    
    // Nếu lỗi do trùng lặp (dù đã check, có thể ở waiting list), ta thử search waiting
    if (!createRes.ok) {
        const waitingRes = await fetch(`${BO_BASE_URL}/v1/fundamental-analysis?symbol=${plan.ticker}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const waitingText = (await waitingRes.text()).replace(/"id":\s*(\d+)/g, '"id":"$1"')
        const waitingData = JSON.parse(waitingText)
        if (waitingData.content?.[0]?.id) {
            existingItem = waitingData.content[0]
            newBoId = String(existingItem.id)
        } else {
            throw new Error(`[BO API] Lỗi khởi tạo PTCB: ${await createRes.text()}`)
        }
    } else {
        // Fetch new item just created
        const tkTextSafe = (await (await fetch(`${BO_BASE_URL}/v1/fundamental-analysis?symbol=${plan.ticker}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })).text()).replace(/"id":\s*(\d+)/g, '"id":"$1"')
        const listData = JSON.parse(tkTextSafe)
        existingItem = listData?.content?.[0]
        if (existingItem?.id) newBoId = String(existingItem.id)
    }
  }

  if (!newBoId) throw new Error(`[BO API] Không tìm thấy PTCB vừa tạo hoặc trích xuất cho ${plan.ticker} trên hệ thống BO.`)

  // 5. Duyệt PTCB nếu nó chưa được duyệt (POST {id}:check)
  if (existingItem?.status === 'NEW' || existingItem?.status === 'WAITING' || !existingItem?.status) {
    const checkPayload = { ...existingItem }
    await fetch(`${BO_BASE_URL}/v1/fundamental-analysis/${newBoId}:check`, {
      method: 'POST',
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(checkPayload)
    })
  }

  // Removed duplicates below

  // 6. Ghi lại vào Supabase
  await supabase.from('fundamental_analyses').upsert({
    ticker: plan.ticker,
    start_valuation_date: startTradingDate,
    end_valuation_date: endTradingDate,
    ev: payload.ev,
    bv: payload.bv,
    valuation_type: payload.valuationType,
    valuation_price: payload.valuationPrice,
    fundamental_insight: payload.fundamentalInsight,
    is_watch_list: true,
    bo_fundamental_id: newBoId,
    updated_at: new Date().toISOString()
  })

  return newBoId
}

/**
 * Xử lý Bước 2: Khởi tạo/Lấy ID Phân Tích Kỹ Thuật (PTKT)
 */
async function ensureTechnicalAnalysis(
  plan: SupabaseTradingPlan,
  token: string,
  fundamentalId: string,
  startTradingDate: string,
  endTradingDate: string,
  waveType: string,
  parsedRisks?: any
): Promise<string> {
// 1. Ánh xạ ID PTCB sang Watchlist ID (Cực kỳ quan trọng để lách qua Validation BO)
  let watchlistId = fundamentalId
  const wlRes = await fetch(`${BO_BASE_URL}/v1/watchlist:getFundamentalAnalysis?symbol=${plan.ticker}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (wlRes.ok) {
    const text = await wlRes.text()
    const safeText = text.replace(/"id":\s*(\d+)/g, '"id":"$1"')
    const wlData = JSON.parse(safeText)
    const matched = wlData.content?.[0]
    if (matched && matched.id) {
      watchlistId = String(matched.id)
    }
  }

  // 2. Lấy ảnh PTKT và bọc vào FormData
  const formData = new FormData()
  if (plan.chart_image_url) {
    const blob = await fetchImageBlob(plan.chart_image_url)
    formData.append('file', blob, `chart-${plan.ticker}.png`)
  }

  // 3. Nhúng Payload vào FormData
  const createPayload = {
    symbol: plan.ticker,
    startTrendDate: startTradingDate,
    endTrendDate: endTradingDate,
    advisory: (plan.analyst_note || `Lệnh tự động từ FinPeace Agent. Mở vị thế ở vùng Entry ${plan.ticker}.`).substring(0, 300),
    fundamentalWatchlistId: watchlistId, // <--- BẮT BUỘC PHẢI DÙNG WATCHLIST ID CỦA PTCB
    isWatchList: true,
    supportPrice: plan.support_price || parsedRisks?.cutLoss || 0,
    resistancePrice: plan.resistance_price || parsedRisks?.takeProfit || 0,
    growthRange: plan.win_rate || parsedRisks?.profitRate || 10,
    waveType: waveType
  }

  formData.append('create', new Blob([JSON.stringify(createPayload)], { type: 'application/json' }))

  // 3. POST Tạo PTKT qua BO API (Sử dụng multipart/form-data)
  const createRes = await fetch(`${BO_BASE_URL}/v1/technical-analysis`, {
    method: 'POST',
    headers: { "Authorization": `Bearer ${token}` }, // Bỏ Content-Type để Node tự gen boundary multipart
    body: formData
  })

  if (!createRes.ok) throw new Error(`[BO API] Lỗi tạo PTKT Multipart: ${await createRes.text()}`)

  // 4. Truy xuất ID PTKT vừa chèn (Mảng Waiting/Hoặc Danh sách theo Mã)
  let ptktId: string | null = null;
  const getListRes = await fetch(`${BO_BASE_URL}/v1/technical-analysis?symbol=${plan.ticker}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  const tkTextSafe = (await getListRes.text()).replace(/"id":\s*(\d+)/g, "\"id\":\"$1\"");
  const listData = JSON.parse(tkTextSafe);
  const items: any[] = listData?.content || []
  if (items[0]?.id) ptktId = String(items[0].id)

  if (!ptktId) throw new Error(`[BO API] Không tìm thấy PTKT vừa tạo cho ${plan.ticker} trên hệ thống BO.`)

  // 5. Duyệt PTKT (POST {id}:check)
  // Payload khi check phải chứa các Entity Fields mà BO tự khởi tạo (như fundamentalId, fileName, fId)
  const checkPayload = { ...items[0], id: ptktId }
  const cRes = await fetch(`${BO_BASE_URL}/v1/technical-analysis/${ptktId}:check`, {
    method: 'POST',
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(checkPayload)
  })
  
  if (!cRes.ok) console.warn(`[WARNING] Lỗi duyệt PTKT ${ptktId}:`, await cRes.text())

  return ptktId
}


/**
 * Xử lý Bước 3: Tạo Trading Plan
 */
async function ensureTradingPlan(
  plan: SupabaseTradingPlan,
  token: string,
  technicalId: string,
  startTradingDate: string,
  endTradingDate: string,
  waveType: string,
  parsedRisks: any
): Promise<string> {
  // 1. Ánh xạ ID PTKT sang Watchlist ID
  let watchlistId = technicalId
  const wlRes = await fetch(`${BO_BASE_URL}/v1/watchlist:getTechnicalAnalysis?symbol=${plan.ticker}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (wlRes.ok) {
    const text = await wlRes.text()
    const safeText = text.replace(/"id":\s*(\d+)/g, '"id":"$1"')
    const wlData = JSON.parse(safeText)
    const matched = wlData.content?.[0]
    if (matched && matched.id) {
      watchlistId = String(matched.id)
    }
  }

  const tpPayload = {
    technicalWatchlistId: watchlistId,
    tradingMethod: waveType === 'TRENDING' ? 'T01' : 'S01',
    startTradingDate,
    endTradingDate,
    riskRate: parsedRisks.riskRate,
    profitRate: parsedRisks.profitRate,
    rewardPortion: parsedRisks.rewardPortion,
    advisory: (plan.analyst_note || `Trading Plan (AI Agent) cho ${plan.ticker}`).substring(0, 500),
    buyLow: parsedRisks.buyLow,
    buyHigh: parsedRisks.buyHigh,
    sellLow: parsedRisks.sellLow,
    sellHigh: parsedRisks.sellHigh,
    cutLoss: parsedRisks.cutLoss
    // Symbol không còn cần thiết đi kèm technicalWatchlistId, nhưng BO API có thể yêu cầu 1 form-data trắng.
  }

  // Trading plan BO sử dụng Multipart/form-data
  const formData = new FormData()
  formData.append('create', new Blob([JSON.stringify(tpPayload)], { type: 'application/json' }))
  
  if (plan.chart_image_url) {
    const blob = await fetchImageBlob(plan.chart_image_url)
    formData.append('file', blob, `chart-${plan.ticker}.png`)
  }

  const createRes = await fetch(`${BO_BASE_URL}/v1/trading-plans`, {
    method: 'POST',
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  })

  if (!createRes.ok) throw new Error(`[BO API] Lỗi tạo Kịch Bản Giao Dịch: ${await createRes.text()}`)

  // Lấy ID
  let tpId: string | null = null;
  const getListRes = await fetch(`${BO_BASE_URL}/v1/trading-plans?symbol=${plan.ticker}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  const tkTextSafe = (await getListRes.text()).replace(/"id":\s*(\d+)/g, "\"id\":\"$1\"");
  const listData = JSON.parse(tkTextSafe);
  const items: any[] = listData?.content || []
  if (items[0]?.id) tpId = String(items[0].id)

  if (!tpId) throw new Error(`[BO API] Không tìm thấy Kịch Bản GD vừa tạo cho ${plan.ticker}.`)

  // Duyệt Plan (POST {id}:approve)
  const approvePayload = { ...items[0], id: tpId }
  const aRes = await fetch(`${BO_BASE_URL}/v1/trading-plans/${tpId}:approve`, {
    method: 'POST',
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(approvePayload)
  })
  
  if (!aRes.ok) console.warn(`[WARNING] Lỗi duyệt Trading Plan ${tpId}:`, await aRes.text())

  return tpId
}


/**
 * TÍCH HỢP TOÀN BỘ WORKFLOW SYNC CHO 1 TRADING PLAN
 */
export async function syncTradingPlanToStockspick(
  plan: SupabaseTradingPlan,
  supabase: SupabaseClient
): Promise<StockspickSyncResult> {
  try {
    const token = await getBackofficeToken()
    
    // Parsers
    const { buyLow, buyHigh } = parseEntryZone(plan.entry_zone)
    const { sellLow, sellHigh, takeProfit } = parseTakeProfit(plan.take_profit)
    const cutLoss = parseCutLoss(plan.stop_loss)
    const { riskRate, profitRate, rewardPortion } = parseRiskReward(plan.risk_reward)
    const { startTradingDate, endTradingDate } = getTradingDates(plan.timeframe)
    const waveType = detectWaveType(plan.wave_index)

    const parsedRisks = { buyLow, buyHigh, sellLow, sellHigh, takeProfit, cutLoss, riskRate, profitRate, rewardPortion }

    // ── STEP 1: PTCB ──
    const fundamentalId = await ensureFundamentalAnalysis(
      plan, supabase, token, startTradingDate, endTradingDate, takeProfit
    )

    // ── STEP 2: PTKT ──
    const technicalId = plan.stockspick_technical_analysis_id || await ensureTechnicalAnalysis(
      plan, token, fundamentalId, startTradingDate, endTradingDate, waveType, parsedRisks
    )

    // ── STEP 3: Trading Plan ──
    const tradingPlanId = plan.stockspick_trading_plan_id || await ensureTradingPlan(
      plan, token, technicalId, startTradingDate, endTradingDate, waveType, parsedRisks
    )

    return {
      success: true,
      tradingPlanId,
      technicalAnalysisId: technicalId,
      fundamentalAnalysisId: fundamentalId
    }

  } catch (err: any) {
    console.error('[Stockspick Sync Error]', err)
    return { success: false, error: err.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📣 USE CASE 2: TRIGGER RECOMMENDATION (BUY / SELL / CUT_LOSS)
// ─────────────────────────────────────────────────────────────────────────────

export type RecommendationAction = 'BUY' | 'SELL' | 'HALF_SELL' | 'CUT_LOSS' | 'HOLD'

export interface TriggerRecommendationParams {
  tradingPlanId: string       // Stockspick Trading Plan ID
  action: RecommendationAction
  takeProfit?: number
}

export async function triggerRecommendation(
  params: TriggerRecommendationParams
): Promise<{ success: boolean; recommendationId?: string; error?: string }> {
  try {
    const token = await getBackofficeToken()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    const listRes = await fetch(`${BO_BASE_URL}/v1/stock-recommendations:getWaiting?symbol=&action=`, { headers })

    let recommendationId: string | undefined
    if (listRes.ok) {
      const d = await listRes.json()
      const items: any[] = Array.isArray(d) ? d : d?.content || []
      const matched = items.find((r: any) => String(r.tradingPlan?.id) === params.tradingPlanId)
      if (matched) recommendationId = String(matched.id)
    }

    if (!recommendationId) {
      return { success: false, error: `Không tìm thấy Recommendation đang chờ cho Trading Plan: ${params.tradingPlanId}` }
    }

    const recRes = await fetch(`${BO_BASE_URL}/v1/stock-recommendations/${recommendationId}:recommend`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          ...(params.takeProfit ? { takeProfit: params.takeProfit } : {}),
        }),
      }
    )

    if (!recRes.ok) return { success: false, error: `Phím recommendation thất bại (${recRes.status}): ${await recRes.text()}` }

    return { success: true, recommendationId }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📋 USE CASE 3: QUERY TRADING PLANS TRÊN STOCKSPICK
// ─────────────────────────────────────────────────────────────────────────────

export interface StockspickTradingPlanQuery {
  status: 'waiting' | 'closed' | 'withRecommendations'
  symbol?: string
  waveType?: 'TRENDING' | 'SIDEWAY'
  valuationType?: 'VALUE' | 'GROWTH' | 'SPECULATION'
}

export async function queryStockspickTradingPlans(
  query: StockspickTradingPlanQuery
): Promise<{ success: boolean; data?: any[]; total?: number; error?: string }> {
  try {
    const token = await getBackofficeToken()
    const params = new URLSearchParams({
      waveType: query.waveType || '',
      ...(query.symbol ? { symbol: query.symbol } : {}),
      ...(query.valuationType ? { valuationType: query.valuationType } : {}),
    })

    let endpoint = `${BO_BASE_URL}/v1/trading-plans:getClosed?${params}`
    if (query.status === 'waiting') endpoint = `${BO_BASE_URL}/v1/trading-plans:getWaiting?${params}`
    else if (query.status === 'withRecommendations') endpoint = `${BO_BASE_URL}/v1/trading-plans:withRecommendations`

    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return { success: false, error: `Query thất bại: ${await res.text()}` }

    const d = await res.json()
    const items: any[] = Array.isArray(d) ? d : d?.content || []
    return { success: true, data: items, total: d?.totalElements ?? items.length }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
