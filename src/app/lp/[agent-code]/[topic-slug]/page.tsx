import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import SalesLandingPageClient from './SalesLandingPageClient'

interface Props {
  params: Promise<{ 'agent-code': string; 'topic-slug': string }>
}

export async function generateMetadata({ params }: Props) {
  const { 'topic-slug': slug } = await params
  const supabase = await createClient()
  const { data: story } = await supabase
    .from('macro_insights')
    .select('title, data_point')
    .eq('topic_slug', slug)
    .single()
  if (!story) return { title: 'FinPeace Research' }
  return { title: `${story.title} | Phân tích Vĩ mô`, description: story.data_point }
}

export default async function SalesLandingPage({ params }: Props) {
  const { 'agent-code': code, 'topic-slug': slug } = await params
  const supabase = await createClient()

  // Fetch agent
  const { data: agent } = await supabase
    .from('sales_agents')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single()
  if (!agent) notFound()

  // Fetch LP config (custom hook/cta per agent+slug)
  const { data: lpConfig } = await supabase
    .from('agent_landing_pages')
    .select('*')
    .eq('agent_id', agent.id)
    .eq('slug', slug)
    .maybeSingle()

  // Fetch content from Supabase — supports any content_type
  // Currently: macro_insight. Future: product, event, etc.
  const contentType = lpConfig?.content_type || 'macro_insight'

  let story = null
  if (contentType === 'macro_insight') {
    const { data } = await supabase
      .from('macro_insights')
      .select('*')
      .eq('topic_slug', slug)
      .eq('published', true)
      .single()
    story = data
  }
  // Future: else if (contentType === 'product') { ... }
  // Future: else if (contentType === 'event') { ... }

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
    />
  )
}
