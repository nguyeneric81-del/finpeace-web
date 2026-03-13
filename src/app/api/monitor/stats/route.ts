import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SALES_MAP: Record<string, string> = {
    QUANGXX: 'Minh Quang',
    DUCXX: 'Anh Đức',
    HUYENXX: 'Huyền',
    THUYXX: 'Thuỷ',
}

export async function GET() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [leadsRes, advisorsRes, leadsCountRes, salesBreakdownRes] = await Promise.all([
        supabase
            .from('kb_leads')
            .select('id, name, email, pillar, article_slug, track, sales_code, source, created_at')
            .order('created_at', { ascending: false })
            .limit(20),
        supabase
            .from('advisor_users')
            .select('id', { count: 'exact', head: true }),
        supabase
            .from('kb_leads')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', today.toISOString()),
        supabase
            .from('kb_leads')
            .select('sales_code')
            .not('sales_code', 'is', null),
    ])

    // Tính breakdown theo sales
    const salesBreakdown: Record<string, { name: string; count: number; today: number }> = {}
    Object.entries(SALES_MAP).forEach(([code, name]) => {
        salesBreakdown[code] = { name, count: 0, today: 0 }
    })

    const todayStr = today.toISOString()
    const allLeads = salesBreakdownRes.data || []
    
    // Count tổng leads theo sales (cần query riêng today)
    allLeads.forEach((row: { sales_code: string }) => {
        const code = row.sales_code
        if (salesBreakdown[code]) {
            salesBreakdown[code].count++
        }
    })

    // Count leads today theo sales 
    const { data: todayLeads } = await supabase
        .from('kb_leads')
        .select('sales_code')
        .not('sales_code', 'is', null)
        .gte('created_at', todayStr)

    ;(todayLeads || []).forEach((row: { sales_code: string }) => {
        const code = row.sales_code
        if (salesBreakdown[code]) {
            salesBreakdown[code].today++
        }
    })

    return NextResponse.json({
        leads: leadsRes.data || [],
        advisor_count: advisorsRes.count || 0,
        leads_today: leadsCountRes.count || 0,
        total_leads: leadsRes.data?.length || 0,
        sales_breakdown: salesBreakdown,
    }, {
        headers: {
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
        }
    })
}
