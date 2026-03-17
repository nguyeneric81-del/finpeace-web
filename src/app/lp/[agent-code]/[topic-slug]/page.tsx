import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import SalesLandingPageClient from './SalesLandingPageClient'

// Agent codes that default to Korean (no SQL column needed)
const KO_DEFAULT_AGENTS = new Set(['huyen04'])

interface Props {
  params: Promise<{ 'agent-code': string; 'topic-slug': string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { 'topic-slug': slug } = await params
  const { lang } = await searchParams
  const supabase = await createClient()
  const { data: story } = await supabase
    .from('macro_insights')
    .select('title, data_point, translations')
    .eq('topic_slug', slug)
    .single()
  if (!story) return { title: 'FinPeace Research' }
  const ko = (story.translations as any)?.ko
  const isKo = lang === 'ko' || (!lang && KO_DEFAULT_AGENTS.has(slug))
  return {
    title: isKo && ko?.title ? `${ko.title} | FinPeace` : `${story.title} | Phân tích Vĩ mô`,
    description: isKo && ko?.data_point ? ko.data_point : story.data_point,
  }
}

export default async function SalesLandingPage({ params, searchParams }: Props) {
  const { 'agent-code': code, 'topic-slug': slug } = await params
  const { lang: langParam } = await searchParams
  const supabase = await createClient()

  // Fetch agent
  const { data: agent } = await supabase
    .from('sales_agents')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single()
  if (!agent) notFound()

  // Determine language: URL param > agent default > 'vi'
  const lang: string = langParam ?? (KO_DEFAULT_AGENTS.has(code) ? 'ko' : 'vi')

  // Fetch LP config
  const { data: lpConfig } = await supabase
    .from('agent_landing_pages')
    .select('*')
    .eq('agent_id', agent.id)
    .eq('slug', slug)
    .maybeSingle()

  const contentType = lpConfig?.content_type || 'macro_insight'

  let story = null
  if (contentType === 'macro_insight') {
    const { data } = await supabase
      .from('macro_insights')
      .select('*')
      .eq('topic_slug', slug)
      .eq('published', true)
      .single()

    if (data && lang === 'ko') {
      // Apply Korean translations on top of story
      const ko = (data.translations as any)?.ko ?? {}
      story = {
        ...data,
        title:           ko.title ?? data.title,
        category:        ko.category ?? data.category,
        date_label:      ko.date_label ?? data.date_label,
        data_point:      ko.data_point ?? data.data_point,
        narrow_industry: ko.narrow_industry ?? data.narrow_industry,
        impact_value:    ko.impact_value ?? data.impact_value,
        analyst_view:    ko.analyst_view ?? data.analyst_view,
        analyst_sources: ko.analyst_sources ?? data.analyst_sources,
        behind_story:    ko.behind_story ?? data.behind_story,
        key_stats:       ko.key_stats ?? data.key_stats,
        cycle_lagging:   ko.cycle_lagging ?? data.cycle_lagging,
        cycle_leading:   ko.cycle_leading ?? data.cycle_leading,
      }
    } else {
      story = data
    }
  }

  if (!story) notFound()

  return (
    <SalesLandingPageClient
      agent={agent}
      lpConfig={lpConfig}
      story={story}
      agentCode={code}
      topicSlug={slug}
      lpId={lpConfig?.id || null}
      contentType={contentType}
      lang={lang}
    />
  )
}
