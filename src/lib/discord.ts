// lib/discord.ts — Discord Webhook utilities for FinPeace

const DISCORD_WEBHOOK_MACRO = process.env.DISCORD_WEBHOOK_MACRO_INSIGHTS ?? ''

type MacroInsight = {
  id: string
  topic_slug: string
  title: string
  category?: string
  date_label?: string
  analyst_view?: string
  impact_value?: string
  data_point?: string
  key_stats?: { label: string; value: string; positive: boolean }[]
  companies?: { ticker: string; name: string; plan: string }[]
}

export async function postMacroInsightToDiscord(insight: MacroInsight) {
  if (!DISCORD_WEBHOOK_MACRO) return

  const statFields = (insight.key_stats ?? []).slice(0, 6).map(s => ({
    name: (s.positive ? '📈 ' : '📉 ') + s.label,
    value: '**' + s.value + '**',
    inline: true,
  }))

  const companiesText = (insight.companies ?? [])
    .map(c => '**`' + c.ticker + '`** ' + c.name + '\n└ ' + c.plan)
    .join('\n\n')

  const analystView = insight.analyst_view ?? ''
  const shortView = analystView.length > 350
    ? analystView.slice(0, 347) + '...'
    : analystView

  const payload: Record<string, unknown> = {
    thread_name: insight.title,
    username: 'FinPeace Insights',
    embeds: [
      {
        color: 0x10b981,
        author: {
          name: '📊 ' + (insight.category ?? 'Vĩ Mô') + ' · ' + (insight.date_label ?? ''),
        },
        title: insight.title,
        description: insight.impact_value ? '> ' + insight.impact_value : undefined,
        fields: [
          ...statFields,
          ...(shortView ? [{
            name: '🔍 Góc nhìn chuyên gia',
            value: shortView,
            inline: false,
          }] : []),
          ...(companiesText ? [{
            name: '📋 Cổ phiếu liên quan',
            value: companiesText,
            inline: false,
          }] : []),
        ],
        footer: {
          text: 'FinPeace · Hiểu đúng — Đầu tư đúng',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    await fetch(DISCORD_WEBHOOK_MACRO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[Discord] Failed to post macro insight:', err)
  }
}
