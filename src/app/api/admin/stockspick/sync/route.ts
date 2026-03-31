/**
 * api/admin/stockspick/sync/route.ts
 * Endpoint trigger Stockspick integration
 * 
 * POST /api/admin/stockspick/sync
 * Body: { action, ...params }
 * 
 * Actions:
 * - sync_trading_plan: Sync 1 plan từ Supabase → Stockspick
 * - recommend: Trigger BUY/SELL/HOLD
 * - query_plans: Query trading plans trên Stockspick
 * - sync_all_active: Sync tất cả active plans
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  syncTradingPlanToStockspick,
  triggerRecommendation,
  queryStockspickTradingPlans,
  SupabaseTradingPlan,
  RecommendationAction,
} from '@/lib/stockspick'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...params } = body

    // ── ACTION 1: Sync 1 Trading Plan ────────────────────────────────────────
    if (action === 'sync_trading_plan') {
      const { plan_id, ticker } = params

      // Lấy plan từ Supabase
      let query = supabase.from('trading_plans').select('*')
      if (plan_id) query = query.eq('id', plan_id)
      else if (ticker) query = query.eq('ticker', ticker).eq('status', 'active')
      else return NextResponse.json({ error: 'Cần plan_id hoặc ticker' }, { status: 400 })

      const { data: plans, error } = await query.limit(1)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      if (!plans || plans.length === 0) {
        return NextResponse.json({ error: 'Không tìm thấy Trading Plan' }, { status: 404 })
      }

      const plan = plans[0] as SupabaseTradingPlan

      // Sync lên Stockspick
      const result = await syncTradingPlanToStockspick(plan, supabase)

      // Nếu sync thành công → lưu Stockspick IDs vào Supabase
      if (result.success) {
        const updateData: Record<string, string> = {}
        if (result.tradingPlanId) updateData.stockspick_trading_plan_id = result.tradingPlanId
        if (result.technicalAnalysisId) updateData.stockspick_technical_analysis_id = result.technicalAnalysisId
        if (result.fundamentalAnalysisId) updateData.stockspick_fundamental_analysis_id = result.fundamentalAnalysisId

        if (Object.keys(updateData).length > 0) {
          await supabase.from('trading_plans').update(updateData).eq('id', plan.id)
        }
      }

      return NextResponse.json({
        success: result.success,
        ticker: plan.ticker,
        stockspickIds: {
          tradingPlanId: result.tradingPlanId,
          technicalAnalysisId: result.technicalAnalysisId,
          fundamentalAnalysisId: result.fundamentalAnalysisId,
        },
        error: result.error,
      })
    }

    // ── ACTION 2: Sync tất cả active plans ───────────────────────────────────
    if (action === 'sync_all_active') {
      const { data: plans, error } = await supabase
        .from('trading_plans')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      if (!plans || plans.length === 0) {
        return NextResponse.json({ message: 'Không có plan active nào', synced: 0 })
      }

      const results = []
      let successCount = 0

      for (const plan of plans as SupabaseTradingPlan[]) {
        const result = await syncTradingPlanToStockspick(plan, supabase)

        if (result.success) {
          successCount++
          const updateData: Record<string, string> = {}
          if (result.tradingPlanId) updateData.stockspick_trading_plan_id = result.tradingPlanId
          if (result.technicalAnalysisId) updateData.stockspick_technical_analysis_id = result.technicalAnalysisId
          if (result.fundamentalAnalysisId) updateData.stockspick_fundamental_analysis_id = result.fundamentalAnalysisId

          if (Object.keys(updateData).length > 0) {
            await supabase.from('trading_plans').update(updateData).eq('id', plan.id)
          }
        }

        results.push({
          ticker: plan.ticker,
          success: result.success,
          tradingPlanId: result.tradingPlanId,
          error: result.error,
        })

        // Rate limit — chờ 300ms giữa các requests
        await new Promise(r => setTimeout(r, 300))
      }

      return NextResponse.json({
        total: plans.length,
        success: successCount,
        failed: plans.length - successCount,
        results,
      })
    }

    // ── ACTION 3: Trigger Recommendation ─────────────────────────────────────
    if (action === 'recommend') {
      const { stockspick_trading_plan_id, recommendation_action, take_profit } = params

      if (!stockspick_trading_plan_id || !recommendation_action) {
        return NextResponse.json(
          { error: 'Cần stockspick_trading_plan_id và recommendation_action' },
          { status: 400 }
        )
      }

      const result = await triggerRecommendation({
        tradingPlanId: stockspick_trading_plan_id,
        action: recommendation_action as RecommendationAction,
        takeProfit: take_profit,
      })

      return NextResponse.json(result)
    }

    // ── ACTION 4: Query Trading Plans trên Stockspick ─────────────────────────
    if (action === 'query_plans') {
      const { status = 'waiting', symbol, waveType, valuationType } = params

      const result = await queryStockspickTradingPlans({
        status,
        symbol,
        waveType,
        valuationType,
      })

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err: any) {
    console.error('[Stockspick Sync API Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET: Test kết nối và lấy status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'status'

    if (type === 'waiting') {
      const result = await queryStockspickTradingPlans({ status: 'waiting' })
      return NextResponse.json(result)
    }

    if (type === 'active_plans_sync_status') {
      // Lấy các plan Supabase đã/chưa sync
      const { data, error } = await supabase
        .from('trading_plans')
        .select('id, ticker, company_name, status, stockspick_trading_plan_id, stockspick_technical_analysis_id, updated_at')
        .eq('status', 'active')
        .order('updated_at', { ascending: false })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({
        total: data?.length || 0,
        synced: data?.filter(p => p.stockspick_trading_plan_id).length || 0,
        unsynced: data?.filter(p => !p.stockspick_trading_plan_id).length || 0,
        plans: data,
      })
    }

    // Default: test auth
    const { getBackofficeToken } = await import('@/lib/stockspick')
    const token = await getBackofficeToken()
    return NextResponse.json({
      connected: true,
      tokenPreview: `${token.substring(0, 20)}...`,
    })
  } catch (err: any) {
    return NextResponse.json({ connected: false, error: err.message }, { status: 500 })
  }
}
