import { createClient } from '@/utils/supabase/server'
import MacroInsightsListClient from './MacroInsightsListClient'

// Helper: hex accent → semi-transparent bg
function accentBg(hex: string) {
  const percentToHex = (p: number) => Math.round(p * 255 / 100).toString(16).padStart(2, '0')
  return hex + percentToHex(10) // 10% opacity
}

export default async function MacroInsightsPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('macro_insights')
    .select('id, title, date_label, category, accent_color, data_point, narrow_industry, impact_value, impact_positive, companies')
    .eq('published', true)
    .order('id', { ascending: false })

  const stories = (rows || []).map(r => ({
    id: String(r.id),
    title: r.title,
    date: r.date_label,
    category: r.category,
    accent: r.accent_color || '#10B981',
    accentBg: accentBg(r.accent_color || '#10B981'),
    dataPoint: r.data_point,
    narrowIndustry: r.narrow_industry || '',
    quantifiedImpact: {
      positive: r.impact_positive ?? true,
      value: r.impact_value || '',
    },
    companies: (r.companies || []).map((c: { ticker: string; name: string; plan?: string }) => ({
      ticker: c.ticker,
      name: c.name,
    })),
  }))

  return <MacroInsightsListClient stories={stories} />
}
