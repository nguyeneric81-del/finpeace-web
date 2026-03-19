import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// PATCH /api/admin/raw-news/[id]/action
// { action: 'approve' | 'ignore', tags?: string[], category?: string, relevance?: number }
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { action, tags, category, relevance } = body

  const supabase = createAdminClient()

  const updates: Record<string, unknown> = {}
  if (action === 'approve') updates.status = 'approved'
  if (action === 'ignore') updates.status = 'ignored'
  if (action === 'pending') updates.status = 'pending'
  if (tags !== undefined) updates.tags = tags
  if (category !== undefined) updates.category = category
  if (relevance !== undefined) updates.relevance = relevance

  const { error } = await supabase
    .from('raw_news')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
