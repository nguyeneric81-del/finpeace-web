import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import Parser from 'rss-parser'
import * as cheerio from 'cheerio'

const RSS_SOURCES = [
  { name: "CafeF", url: "https://cafef.vn/chung-khoan.rss" },
  { name: "VnEconomy", url: "https://vneconomy.vn/chung-khoan.rss" },
  { name: "ĐTCK", url: "https://tinnhanhchungkhoan.vn/rss/tin-moi-nhat.rss" },
]

const STOCK_KEYWORDS = [
  "vnindex", "vn-index", "chứng khoán", "cổ phiếu", "thị trường",
  "tăng điểm", "giảm điểm", "thanh khoản", "dòng tiền", "nhà đầu tư",
  "tự doanh", "khối ngoại", "bán ròng", "mua ròng", "kết quả kinh doanh",
  "chia cổ tức", "phát hành", "niêm yết", "ftse", "msci", "nâng hạng",
  "lãi suất", "tỷ giá", "fed", "chính sách tiền tệ", "trái phiếu",
]

const MAX_ARTICLE_CHARS = 800

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: 'follow', next: { revalidate: 3600 } })
    const html = await res.text()
    const $ = cheerio.load(html)
    
    let text = ''
    const selectors = ['article', '.article-content', '.content-detail', '.article-body', 'main p']
    for (const sel of selectors) {
      const elem = $(sel).first()
      if (elem.length > 0) {
        text = elem.text()
        break
      }
    }
    
    if (!text) {
      const pTags = $('p').slice(0, 5)
      text = pTags.map((i, el) => $(el).text()).get().join(' ')
    }
    
    text = text.replace(/\s+/g, ' ').trim()
    return text.length > MAX_ARTICLE_CHARS ? text.substring(0, MAX_ARTICLE_CHARS) + '...' : text
  } catch (error) {
    return ''
  }
}

function isRelevantToStockMarket(title: string, description: string): boolean {
  const text = (title + ' ' + description).toLowerCase()
  return STOCK_KEYWORDS.some(kw => text.includes(kw))
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const parser = new Parser()
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let allNews: any[] = []
    
    // Fetch all RSS sources
    await Promise.all(RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url)
        
        feed.items.forEach(entry => {
          let pubDate: Date | null = null
          if (entry.pubDate) {
            pubDate = new Date(entry.pubDate)
          }
          
          // Only today's news
          if (pubDate && pubDate.getTime() < today.getTime()) {
            return
          }
          
          let desc = entry.summary || entry.contentSnippet || ''
          desc = cheerio.load(desc).text().trim()
          
          if (isRelevantToStockMarket(entry.title || '', desc)) {
            allNews.push({
              title: entry.title,
              link: entry.link,
              description: desc.substring(0, 300),
              published_at: pubDate ? pubDate.toISOString() : null,
              source: source.name,
              status: 'pending'
            })
          }
        })
      } catch (err) {
        console.error(`RSS Error for ${source.name}:`, err)
      }
    }))
    
    // Deduplicate by title
    const seenTitles = new Set<string>()
    const uniqueNews = allNews.filter(item => {
      const key = item.title.substring(0, 40).toLowerCase()
      if (seenTitles.has(key)) return false
      seenTitles.add(key)
      return true
    })
    
    // Fetch full content for top 20 news
    const topNews = uniqueNews.slice(0, 20)
    await Promise.all(topNews.map(async (item) => {
      const fullText = await fetchArticleContent(item.link)
      if (fullText) {
        item.description = (item.description + '\n\n' + fullText).substring(0, 1500)
      }
      item.crawl_date = new Date().toISOString().split('T')[0]
    }))
    
    // Save to Supabase raw_news table
    if (topNews.length > 0) {
      // Fetch existing links for today to avoid duplicates
      const todayIso = new Date().toISOString().split('T')[0]
      const { data: existingNews } = await supabase
        .from('raw_news')
        .select('link')
        .gte('crawl_date', todayIso)
        
      const existingLinks = new Set(existingNews?.map(n => n.link) || [])
      const newNews = topNews.filter(n => !existingLinks.has(n.link))
      
      if (newNews.length > 0) {
        const { error } = await supabase.from('raw_news').insert(newNews)
        if (error) throw error
      }
      
      return NextResponse.json({ success: true, count: newNews.length, news: newNews })
    }
    
    return NextResponse.json({ success: true, count: 0, news: [] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
