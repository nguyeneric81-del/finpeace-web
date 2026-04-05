import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// PATCH /api/admin/signals/news — approve hoặc reject 1 tin
export async function PATCH(req: Request) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, status } = body // status: 'approved' | 'rejected'

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'id và status (approved|rejected) là bắt buộc' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('raw_news')
      .update({ status })
      .eq('id', id)
      .select('id, title, status')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, news: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// GET /api/admin/signals/news?status=pending&limit=30
export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'analyzed'
    const limit = parseInt(searchParams.get('limit') || '30')

    const { data, error } = await supabase
      .from('raw_news')
      .select('id, title, description, source, link, published_at, status, relevance, tags, tickers, category, crawl_date')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({ success: true, news: data || [] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
