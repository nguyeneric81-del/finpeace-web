const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadCharts() {
  const tickers = ['CTD', 'MSN', 'NKG', 'TCB', 'VDS', 'VND']
  
  for (const ticker of tickers) {
    const localPath = path.join(__dirname, `../public/charts/${ticker}.png`)
    if (!fs.existsSync(localPath)) {
      console.log(`Skipping ${ticker}, file not found`)
      continue
    }
    
    const fileBuffer = fs.readFileSync(localPath)
    const filePath = `charts/${ticker}_${Date.now()}.png`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('advisor-charts')
      .upload(filePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      })
      
    if (uploadError) {
      console.error(`Error uploading ${ticker}:`, uploadError)
      continue
    }

    const { data: urlData } = supabase.storage
      .from('advisor-charts')
      .getPublicUrl(filePath)
      
    const publicUrl = urlData.publicUrl
    console.log(`Uploaded ${ticker} to ${publicUrl}`)

    const { error: dbError } = await supabase
      .from('trading_plans')
      .update({ chart_image_url: publicUrl })
      .eq('ticker', ticker)

    if (dbError) {
      console.error(`Error updating DB for ${ticker}:`, dbError)
    } else {
      console.log(`Updated DB for ${ticker}`)
    }
  }
}

uploadCharts()
