import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { PILLARS, Article } from '@/app/knowledgebase/data'

// GET /api/admin/content-list?type=macro_insight|knowledgebase
// Returns list of available content for LP campaign creation
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'macro_insight'

  if (type === 'knowledgebase') {
    // Flatten all articles from all pillars
    const items = PILLARS.flatMap((pillar) =>
      (pillar.articles as Article[]).map((a) => ({
        slug: a.slug,
        title: a.title,
        pillar: pillar.title,
        difficulty: a.difficulty,
        readTime: a.readTime,
      }))
    )
    return NextResponse.json({ items })
  }

  // macro_insight: read from Supabase
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('macro_insights')
    .select('id, topic_slug, title, category, date_label')
    .eq('published', true)
    .order('id', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ items: [], error: error.message })

  const items = (data ?? []).map((d) => ({
    slug: d.topic_slug,
    title: d.title,
    pillar: d.category ?? 'Vĩ Mô',
    date_label: d.date_label,
  }))

  return NextResponse.json({ items })
}
