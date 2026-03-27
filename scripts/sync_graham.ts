import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Khởi tạo Supabase client
dotenv.config({ path: '.env.local' })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

async function syncGraham() {
  console.log('Bắt đầu upload ảnh...')
  // Upload Mr Market
  const image1Path = '/Users/tuananhnguyen/.gemini/antigravity/brain/1715e419-0584-4ea7-837f-4233370686c9/graham_mr_market_1774575960224.png'
  const image1Name = 'graham_mr_market_' + Date.now() + '.png'
  const image1Buffer = fs.readFileSync(image1Path)
  await supabase.storage.from('advisor-charts').upload(image1Name, image1Buffer, { contentType: 'image/png' })
  const { data: url1Data } = supabase.storage.from('advisor-charts').getPublicUrl(image1Name)
  const image1Url = url1Data.publicUrl

  // Upload Portrait
  const image2Path = '/Users/tuananhnguyen/.gemini/antigravity/brain/1715e419-0584-4ea7-837f-4233370686c9/graham_portrait_1774575945242.png'
  const image2Name = 'graham_portrait_' + Date.now() + '.png'
  const image2Buffer = fs.readFileSync(image2Path)
  await supabase.storage.from('advisor-charts').upload(image2Name, image2Buffer, { contentType: 'image/png' })
  const { data: url2Data } = supabase.storage.from('advisor-charts').getPublicUrl(image2Name)
  const image2Url = url2Data.publicUrl

  console.log('Upload ảnh thành công!')
  console.log('Image 1:', image1Url)
  console.log('Image 2:', image2Url)

  // Load nội dung bài viết
  // import as ES module dynamically
  const { content } = await import('../src/app/knowledgebase/content/huyen-thoai-dau-tu/graham-intelligent-investor')
  
  let contentArray = [...content]

  // Thêm block image vào vị trí phù hợp
  const marketIndex = contentArray.findIndex((c:any) => c.title && c.title.includes('Mr. Market'))
  if (marketIndex !== -1) {
      contentArray.splice(marketIndex, 0, {
          type: 'intro', // using intro or any generic layout
          content: `![Mr Market](${image1Url})`
      })
  }

  // Prepend hình đại diện
  contentArray.unshift({
      type: 'intro',
      content: `![Benjamin Graham](${image2Url})`
  })

  const payload = {
    slug: 'graham-intelligent-investor',
    pillar: 'huyen-thoai-dau-tu',
    title: 'Benjamin Graham — "The Intelligent Investor"',
    summary: 'Cha Đẻ Của Value Investing & Người Thầy Của Warren Buffett',
    content: contentArray,
    updated_at: new Date().toISOString()
  }

  console.log('Đang đẩy nội dung lên DB...')
  
  // Kiểm tra xem bài đã có chưa
  const { data: existing } = await supabase.from('kb_articles').select('id').eq('slug', payload.slug).maybeSingle()
  
  if (existing) {
    const {error} = await supabase.from('kb_articles').update(payload).eq('id', existing.id)
    if(error) console.error(error)
    else console.log('✅ Updated existing article:', existing.id)
  } else {
    const {error} = await supabase.from('kb_articles').insert(payload)
    if(error) console.error(error)
    else console.log('✅ Inserted new article')
  }
}

syncGraham().catch(err => console.error(err))
