import { NextResponse } from 'next/server'

/**
 * POST /api/cron/crawl-signals
 * Được gọi bởi cron job trên VPS: 3 lần/ngày (6am, 12pm, 6pm)
 * Bảo vệ bằng header x-cron-secret
 */
export async function POST(req: Request) {
  // Verify cron secret
  const secret = req.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finpeace.cloud'
  const results: { step: string; success: boolean; data?: any; error?: string }[] = []

  // Step 1: Crawl RSS
  try {
    const crawlRes = await fetch(`${baseUrl}/api/admin/signals/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const crawlData = await crawlRes.json()
    results.push({ step: 'crawl', success: crawlData.success, data: { count: crawlData.count } })
  } catch (e: any) {
    results.push({ step: 'crawl', success: false, error: e.message })
  }

  // Step 2: AI Analyze (chỉ nếu crawl có tin mới)
  const crawlOk = results[0]?.success && (results[0]?.data?.count ?? 0) > 0
  if (crawlOk) {
    try {
      const analyzeRes = await fetch(`${baseUrl}/api/admin/signals/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const analyzeData = await analyzeRes.json()
      results.push({ step: 'analyze', success: analyzeData.success, data: { analyzed: analyzeData.analyzed } })
    } catch (e: any) {
      results.push({ step: 'analyze', success: false, error: e.message })
    }
  } else {
    results.push({ step: 'analyze', success: true, data: { skipped: 'no new news to analyze' } })
  }

  const timestamp = new Date().toISOString()
  console.log(`[CRON ${timestamp}] Crawl signals result:`, JSON.stringify(results))

  return NextResponse.json({
    success: true,
    timestamp,
    results,
  })
}

// GET /api/cron/crawl-signals — health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Crawl Signals Cron Endpoint — POST với x-cron-secret header để trigger',
    schedule: '6am / 12pm / 6pm VN time (UTC+7)',
  })
}
