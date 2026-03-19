import { NextResponse } from 'next/server'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// GET /api/admin/news-today
// Reads the latest news_analyzed_YYYYMMDD.json from finpeace-listening-bot/
// Returns top news articles with impact scoring for the admin dashboard
export async function GET() {
  const botDir = join(process.cwd(), '..', 'finpeace-listening-bot')
  
  // Build today's filename
  const now = new Date()
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const todayFile = `news_analyzed_${yyyymmdd}.json`
  
  try {
    // Try today first, then find most recent file
    let filePath = join(botDir, todayFile)
    let fileDate = yyyymmdd
    
    try {
      readFileSync(filePath, 'utf-8') // probe
    } catch {
      // Fallback: find most recent news_analyzed_*.json
      const files = readdirSync(botDir)
        .filter(f => f.startsWith('news_analyzed_') && f.endsWith('.json'))
        .sort()
        .reverse()
      
      if (files.length === 0) {
        return NextResponse.json({ articles: [], date: null, fallback: false })
      }
      
      const latestFile = files[0]
      filePath = join(botDir, latestFile)
      fileDate = latestFile.replace('news_analyzed_', '').replace('.json', '')
    }
    
    const raw = readFileSync(filePath, 'utf-8')
    const articles: Record<string, unknown>[] = JSON.parse(raw)
    
    // Enrich with impact score and campaign suggestion
    const enriched = articles.map((a, idx) => ({
      id: `news-${fileDate}-${idx}`,
      topic_slug: a.topic_slug,
      title: a.title,
      category: a.category,
      date_label: a.date_label,
      data_point: a.data_point,
      analyst_view: a.analyst_view,
      impact_value: a.impact_value,
      companies: a.companies ?? [],
      key_stats: a.key_stats ?? [],
      kb_article: a.kb_article ?? null,         // field added by news_analyzer.py
      kb_article_slug: a.kb_article_slug ?? null,
      // Derive a simple impact score (0-3) from position in list (AI sorts by impact)
      impact_score: Math.max(1, 3 - Math.floor(idx / 2)),
    }))
    
    const isToday = fileDate === yyyymmdd
    const displayDate = `${fileDate.slice(6, 8)}/${fileDate.slice(4, 6)}/${fileDate.slice(0, 4)}`
    
    return NextResponse.json({
      articles: enriched,
      date: displayDate,
      source_file: `news_analyzed_${fileDate}.json`,
      is_today: isToday,
    })
    
  } catch (err) {
    console.error('[/api/admin/news-today] Error:', err)
    return NextResponse.json({ articles: [], date: null, error: 'Could not read news data' })
  }
}
