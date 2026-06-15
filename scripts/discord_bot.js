// scripts/discord_bot.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
require('dotenv').config({ path: '.env.local' })

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!DISCORD_BOT_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing environment variables. Make sure .env.local is configured.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once('ready', () => {
  console.log(`✅ FinPeace Bot đã sẵn sàng as ${client.user.tag}`)
})

// ─── Allowed category name (Discord category = channel group) ───────────────
const ALLOWED_CATEGORY_NAME = 'StockPicks'

client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return

  // ✅ Only respond inside the StockPicks category
  // StockPicks channel names visible in Discord sidebar
  const STOCKPICKS_CHANNELS = [
    'thông-báo', 'watchlist-đầu-cơ', 'watchlist-cơ-bản',
    'quality-stocks-ptcb', 'câu-chuyện-thị-trường',
    'hỏi-đáp', 'hỏi-đáp-học-viên',
    'hỗ-trợ-dịch-vụ', 'hỗ-trợ-dùng-app',
    'kênh-loãng-hỏi-bot-thoải-mái',
    'tra-cứu-trading-plan',
  ]
  const parentCategory = message.channel.parent
  const channelName = message.channel.name || ''
  console.log(`[DEBUG] ch="${channelName}" cat="${parentCategory?.name}" msg="${message.content.substring(0,40)}"`)

  const inStockPicksByCategory = parentCategory && parentCategory.name === ALLOWED_CATEGORY_NAME
  const inStockPicksByChannelName = STOCKPICKS_CHANNELS.some(ch => channelName.includes(ch))

  if (!inStockPicksByCategory && !inStockPicksByChannelName) return

  const text = message.content.trim()
  const lowerText = text.toLowerCase()

  let commandType = null
  let ticker = ''
  let kbQuery = ''

  if (lowerText.startsWith('!fa ') || lowerText.startsWith('!coban ')) {
    commandType = 'FA'
    ticker = text.split(' ')[1]?.trim().toUpperCase()
  } else if (lowerText.startsWith('!ta ') || lowerText.startsWith('!kythuat ') || lowerText.startsWith('!tuvan ')) {
    commandType = 'TA'
    ticker = text.split(' ')[1]?.trim().toUpperCase()
  } else if (lowerText.startsWith('!kb ')) {
    commandType = 'KB'
    kbQuery = text.substring(4).trim()
  }

  if (commandType) {
    if (commandType === 'KB') {
      if (!kbQuery) return message.reply('Vui lòng nhập câu hỏi sau lệnh `!kb`. VD: `!kb Mẫu hình VCP là gì?`')
      
      const thinkingMsg = await message.reply('⏳ **Bot đang lục lọi bộ não 23.000 trang sách Local để trả lời...**')
      
      try {
        const res = await fetch('https://rag.finpeace.cloud/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: kbQuery })
        })
        
        if (!res.ok) {
          return thinkingMsg.edit('❌ Giao thức đường hầm về Mac Mini (Local RAG) đang tắt hoặc bị gián đoạn.')
        }
        
        const data = await res.json()
        let replyText = `**🧠 TRẢ LỜI TỪ KHO SÁCH FINPEACE**\n\n${data.answer}`
        
        if (data.sources && data.sources.length > 0) {
          replyText += `\n\n📚 **Nguồn trích xuất (Tài liệu nội bộ):**\n${data.sources.map(s => `- ${s}`).join('\n')}`
        }
        
        // CHUNKING LOGIC: Vượt ngục Discord 2000 chars limit
        const maxLength = 1900;
        let chunks = [];
        
        if (replyText.length <= maxLength) {
            chunks.push(replyText);
        } else {
            const lines = replyText.split('\n');
            let currentStr = '';
            for (const line of lines) {
                if (currentStr.length + line.length + 1 > maxLength) {
                    if (currentStr) chunks.push(currentStr);
                    if (line.length > maxLength) { // Edge case: dòng quá dài
                        for (let j = 0; j < line.length; j += maxLength) {
                            chunks.push(line.substring(j, j + maxLength));
                        }
                        currentStr = '';
                    } else {
                        currentStr = line + '\n';
                    }
                } else {
                    currentStr += line + '\n';
                }
            }
            if (currentStr.trim().length > 0) chunks.push(currentStr);
        }
        
        await thinkingMsg.edit(chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
            await message.channel.send(chunks[i]);
        }
        
      } catch (err) {
        console.error('KB API Error:', err)
        await thinkingMsg.edit('❌ Gặp sự cố đường truyền về trung tâm dữ liệu Local. Vui lòng check lại Cloudflare Tunnel.')
      }
      return
    }

    if (!ticker) {
      await message.reply(`Vui lòng nhập mã cổ phiếu. Ví dụ: \`${lowerText.split(' ')[0]} HPG\``)
      return
    }

    try {
      await message.channel.sendTyping()

      if (commandType === 'FA') {
        const KB_ARTICLES = {
          'MBB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-mbb-2026', title: 'Đánh giá MBB', summary: 'Định giá TMCP Quân Đội (MBB). Lợi thế vô địch CASA liệu có làm lu mờ rủi ro bao phủ nợ xấu?' },
          'VCB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-vcb-2026', title: 'Đánh giá VCB (Vietcombank)', summary: 'Ông vua định giá hệ thống nhờ lợi thế CASA công vụ vĩnh cửu và bộ bao phủ nợ xấu vô song.' },
          'TCB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-tcb-2026', title: 'Đánh giá TCB (Techcombank)', summary: 'Kẻ săn đuổi vương miện CASA với hệ sinh thái khách hàng VIP và cuộc chơi Trái phiếu/BĐS.' },
          'VPB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-vpb-2026', title: 'Đánh giá VPB (VPBank)', summary: 'Cỗ máy đốt cháy giai đoạn bằng tín dụng tiêu dùng rủi ro cao: High Risk - High Return.' },
          'ACB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-acb-2026', title: 'Đánh giá ACB (Á Châu)', summary: 'Bức tường thành phòng thủ tuyệt đối trước trái phiếu doanh nghiệp rác.' },
          'CTG': { slug: 'phan-tich-doanh-nghiep/vvia-bank-ctg-2026', title: 'Đánh giá CTG (VietinBank)', summary: 'Gã khổng lồ đang thức giấc sau khi làm sạch toàn bộ nợ rác yếu kém.' },
          'BID': { slug: 'phan-tich-doanh-nghiep/vvia-bank-bid-2026', title: 'Đánh giá BID (BIDV)', summary: 'Quái vật khổng lồ về dư nợ với sự gột rửa thành công từ bàn tay KEB Hana.' },
          'STB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-stb-2026', title: 'Đánh giá STB (Sacombank)', summary: 'Canh bạc đổi đời tái cơ cấu, cuộc chơi giành lại vinh quang thuở nào.' },
          'VIB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-vib-2026', title: 'Đánh giá VIB', summary: 'Ngôi vương bán lẻ đánh cược trọn vẹn sức mạnh vào tài chính hộ gia đình mảng nhà xe.' },
          'TPB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-tpb-2026', title: 'Đánh giá TPB (TPBank)', summary: 'Biểu tượng ngân hàng thời đại số 4.0 và nhóm nợ khuất lấp phía sau cánh gà.' },
          'HDB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-hdb-2026', title: 'Đánh giá HDB (HDBank)', summary: 'Kẻ độc quyền tín dụng nông thôn kết nối từ hệ sinh thái chuỗi Vietjet khổng lồ.' },
          'LPB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-lpb-2026', title: 'Đánh giá LPB (LPBank)', summary: 'Mãnh hổ lột xác thần tốc dưới chế độ quản trị mới nhưng kéo theo thách thức pha loãng.' },
          'SHB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-shb-2026', title: 'Đánh giá SHB (Sài Gòn Hà Nội)', summary: 'Ông lớn "Bo cung" - Ngân hàng tư nhân quy mô siêu tạ với áp lực LLR thiếu hụt.' },
          'EIB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-eib-2026', title: 'Đánh giá EIB (Eximbank)', summary: 'Ông hoàng một thời kẹt trong "Chiến tranh vương quyền" - Bộ đệm thủng đáy.' },
          'MSB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-msb-2026', title: 'Đánh giá MSB (Maritime Bank)', summary: 'Ngôi sao CASA tàng hình có đáng giá? Chướng ngại vật nợ xấu SMEs quy mô vừa.' },
          'OCB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-ocb-2026', title: 'Đánh giá OCB (Phương Đông)', summary: 'Viên ngọc miền Nam và quả táo đắng của những khoản trái phiếu BĐS dở dang.' },
          'SSB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-ssb-2026', title: 'Đánh giá SSB (SeABank)', summary: 'Giao dịch thuật toán bo cung và vương quyền bảo hộ vững chãi.' },
          'NAB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-nab-2026', title: 'Đánh giá NAB (Nam Á)', summary: 'Ngân hàng mới nổi phía Nam, nỗ lực số hóa đẩy tốc độ vay cá nhân.' },
          'ABB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-abb-2026', title: 'Đánh giá ABB (An Bình)', summary: 'Lớp rêu phong chậm tiến phủ lên lợi thế sinh thái nghìn tỷ của Geleximco.' },
          'BAB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-bab-2026', title: 'Đánh giá BAB (Bắc Á)', summary: 'Bến đỗ an toàn tĩnh lặng dốc lòng vì một TH True Milk vững chãi.' },
          'NVB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-nvb-2026', title: 'Đánh giá NVB (Quốc Dân)', summary: 'Bệnh nhân chờ giải phẫu. Lỗ kỷ lục và cuộc chiến sinh tồn tìm nguồn vốn máu.' },
          'KLB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-klb-2026', title: 'Đánh giá KLB (Kiên Long)', summary: 'Chiếc ghế nóng luân chuyển ở khu vực Đồng Bằng Tây Nam Bộ.' },
          'BVB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-bvb-2026', title: 'Đánh giá BVB (Bản Việt)', summary: 'Viet Capital tí hon ở sàn ngân hàng nhưng ôm trọn bí quyết từ đế chế.' },
          'PGB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-pgb-2026', title: 'Đánh giá PGB (PGBank)', summary: 'Thành Công Group cầm lái, một công cuộc tái thiết lập từ con số 0.' },
          'VAB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-vab-2026', title: 'Đánh giá VAB (Việt Á Bank)', summary: 'Lớp băng cuối bảng chật vật níu giữ tăng trưởng và CASA cạn kiệt.' },
          'SGB': { slug: 'phan-tich-doanh-nghiep/vvia-bank-sgb-2026', title: 'Đánh giá SGB (Saigonbank)', summary: 'Hóa thạch đứng yên thời bao cấp - Tín dụng siêu phẳng lặng nhưng LLR đáng giá.' },
          'FPT': { slug: 'phan-tich-doanh-nghiep/vvia-tech-fpt-2026', title: 'Đánh giá FPT', summary: 'Kịch bản AI bào mòn Outsourcing nhân công giá rẻ và góc nhìn đà phanh gấp.' },
          'HPG': { slug: 'phan-tich-doanh-nghiep/vvia-steel-hpg-2026', title: 'Đánh giá HPG', summary: 'Xác định chu kỳ Phục hồi và Cạm bẫy lợi nhuận từ siêu dự án Dung Quất 2.' },
          'SSI': { slug: 'phan-tich-doanh-nghiep/vvia-securities-ssi-2026', title: 'Đánh giá SSI', summary: 'Ông trùm Chứng khoán với game tăng vốn kinh điển và sự thật về mảng tự doanh.' },
          'VHM': { slug: 'phan-tich-doanh-nghiep/vvia-re-vhm-2026', title: 'Đánh giá VHM', summary: 'Vị vua BĐS sỉ lẻ và gánh nặng dòng tiền nuôi VinFast.' },
          'NVL': { slug: 'phan-tich-doanh-nghiep/vvia-re-nvl-2026', title: 'Đánh giá NVL', summary: 'Quả bom nợ trái phiếu và nút thắt pháp lý của hệ thống đòn bẩy tỷ đô.' },
          'DIG': { slug: 'phan-tich-doanh-nghiep/vvia-re-dig-2026', title: 'Đánh giá DIG', summary: 'Kỳ vọng quỹ đất khổng lồ vs hiện thực đếm cua trong lỗ của phe đầu cơ.' },
          'PDR': { slug: 'phan-tich-doanh-nghiep/vvia-re-pdr-2026', title: 'Đánh giá PDR', summary: 'Sự trở lại từ cửa tử thanh khoản và nước đi cắt đuôi trái phiếu.' },
          'DXG': { slug: 'phan-tich-doanh-nghiep/vvia-re-dxg-2026', title: 'Đánh giá DXG', summary: 'Đế chế môi giới ôm mộng CĐT và vết sẹo kẹt pháp lý Gem Riverside.' },
          'NLG': { slug: 'phan-tich-doanh-nghiep/vvia-re-nlg-2026', title: 'Đánh giá NLG', summary: 'Lá chắn phòng thủ kiên cố của dòng nhà ở phân khúc thật, dòng tiền float dồi dào.' },
          'KDH': { slug: 'phan-tich-doanh-nghiep/vvia-re-kdh-2026', title: 'Đánh giá KDH', summary: 'Nhà vua pháp lý TPHCM với đòn bẩy tài chính mỏng tựa sương mai.' }
        };

        // Fetch the most recent macro insight containing this ticker
        const { data, error } = await supabase
          .from('macro_insights')
          .select('*')
          .eq('published', true)
          .contains('companies', `[{"ticker": "${ticker}"}]`)
          .order('id', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Supabase Error:', error)
          await message.reply('Đã có lỗi xảy ra khi truy xuất dữ liệu. Vui lòng thử lại sau.')
          return
        }

        if (!data || data.length === 0) {
          if (KB_ARTICLES[ticker]) {
            const arti = KB_ARTICLES[ticker];
            const embedKb = new EmbedBuilder()
              .setColor(0x3b82f6)
              .setAuthor({ name: `Phân tích Cơ bản (FA) | ${ticker}` })
              .setTitle(`${arti.title}`)
              .setDescription(`${arti.summary}\n\n👉 **Xem chi tiết bản X-Ray và Stress Test:** [Đọc bài viết tại Knowledgebase](https://finpeace.cloud/knowledgebase/${arti.slug})`)
              .setTimestamp().setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })
            await message.reply({ embeds: [embedKb] });
            return;
          }

          await message.reply(`Hiện hệ thống chưa có góc nhìn nào cho mã **${ticker}**. Team phân tích sẽ cập nhật sớm nhất nhé!`)
          return
        }

        const insight = data[0]
        const company = insight.companies.find((c) => c.ticker === ticker)
        
        const statFields = (insight.key_stats ?? []).slice(0, 4).map(s => ({
          name: (s.positive ? '📈 ' : '📉 ') + s.label,
          value: '**' + s.value + '**',
          inline: true,
        }))

        const analystView = insight.analyst_view || 'Chưa có thông tin nền tảng vĩ mô cụ thể.'

        const maxLength = 4000;
        let chunks = [];
        const lines = analystView.split('\n');
        let currentStr = '';
        for (const line of lines) {
            if (currentStr.length + line.length + 1 > maxLength) {
                if (currentStr) chunks.push(currentStr);
                if (line.length > maxLength) { 
                    for (let j = 0; j < line.length; j += maxLength) {
                        chunks.push(line.substring(j, j + maxLength));
                    }
                    currentStr = '';
                } else {
                    currentStr = line + '\n';
                }
            } else {
                currentStr += line + '\n';
            }
        }
        if (currentStr.trim().length > 0) chunks.push(currentStr);

        let extraLinkDesc = '';
        if (KB_ARTICLES[ticker]) {
          const arti = KB_ARTICLES[ticker];
          extraLinkDesc = `\n\n👉 **Xem chi tiết bản X-Ray và Stress Test:** [${arti.title}](https://finpeace.cloud/knowledgebase/${arti.slug})`;
        }

        const embed1 = new EmbedBuilder()
          .setColor(0x3b82f6) // Blue for FA
          .setAuthor({ name: `Phân tích Cơ bản (FA) | ${ticker}` })
          .setTitle(company ? `${company.ticker} — ${company.name}` : `Cổ phiếu ${ticker}`)
          .setDescription((chunks[0] || 'Chưa có thông tin nền tảng vĩ mô cụ thể.') + (chunks.length === 1 ? extraLinkDesc : ''))
        
        if (statFields.length > 0) {
          embed1.addFields(statFields)
        }
        
        if (chunks.length === 1) {
          embed1.setTimestamp().setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })
        }
        
        await message.reply({ embeds: [embed1] })

        // Send subsequent chunks as separate embeds to keep styling consistent
        for (let i = 1; i < chunks.length; i++) {
          const isLastChunk = i === chunks.length - 1;
          const followUpEmbed = new EmbedBuilder()
            .setColor(0x3b82f6)
            .setDescription(chunks[i] + (isLastChunk ? extraLinkDesc : ''))
          
          if (isLastChunk) {
             followUpEmbed.setTimestamp().setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })
          }
          await message.channel.send({ embeds: [followUpEmbed] })
        }

      } else {
        const embed = new EmbedBuilder()
          .setTimestamp()
          .setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })

        // Build TA Embed using `trading_plans` table
        const { data: tpData, error: tpError } = await supabase
          .from('trading_plans')
          .select('*')
          .eq('ticker', ticker)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)

        if (tpError) {
          console.error('Supabase TP Error:', tpError)
          await message.reply('Đã có lỗi xảy ra khi truy xuất dữ liệu phân tích kỹ thuật.')
          return
        }

        if (!tpData || tpData.length === 0) {
          // Bổ sung vào pending_tickers
          try {
            const hash = crypto.createHash('md5').update(message.author.id).digest('hex');
            const userUuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}-${hash.slice(16,20)}-${hash.slice(20,32)}`;
            const { data: pendingData, error: checkErr } = await supabase.from('pending_tickers').select('*').eq('ticker', ticker).maybeSingle()
            if (checkErr) console.error('Lỗi check pending_tickers:', checkErr)
            
            if (pendingData) {
              const newRequesters = [...new Set([...(pendingData.requester_ids || []), userUuid])]
              const { error: updErr } = await supabase.from('pending_tickers').update({ 
                requested_count: pendingData.requested_count + 1,
                requester_ids: newRequesters,
                status: 'pending'
              }).eq('ticker', ticker)
              if (updErr) console.error('Lỗi update pending_tickers:', updErr)
            } else {
              const { error: insErr } = await supabase.from('pending_tickers').insert({
                ticker: ticker,
                requested_count: 1,
                requester_ids: [userUuid],
                status: 'pending'
              })
              if (insErr) console.error('Lỗi insert pending_tickers:', insErr)
            }
          } catch (upsertErr) {
            console.error('Lỗi unhandled khi lưu pending_tickers:', upsertErr)
          }

          await message.reply(`Hiện hệ thống chưa có Bản Kế Hoạch Giao Dịch (Trading Plan) nào cho mã **${ticker}**. Mật vụ FinPeace đã ghi nhận yêu cầu của bác và sẽ cập nhật phân tích sớm nhất nhé!`)
          return
        }

        const plan = tpData[0]

        embed
          .setColor(0x10b981) // Green for TA
          .setAuthor({ name: `Kế hoạch Giao dịch (TA) | ${ticker}` })
          .setTitle(`${plan.ticker} — ${plan.company_name || 'Trading Plan'}`)
          .setDescription(`> **Chiến lược:** ${plan.strategy_name}\n\n**Mô tả:** ${plan.analyst_note || 'Không có ghi chú thêm'}`)
          .addFields(
            { name: '🟢 Vùng mua (Entry)', value: plan.entry_zone || '-', inline: false },
            { name: '🔴 Cắt lỗ (Stop loss)', value: plan.stop_loss || '-', inline: true },
            { name: '🎯 Chốt lời (Take profit)', value: plan.take_profit || '-', inline: true },
            { name: '⚖️ Tỷ lệ R:R', value: `**${plan.risk_reward || '-'}**`, inline: true },
          )
        
        if (plan.timeframe) {
          embed.addFields({ name: '⏱ Thời gian dự kiến', value: plan.timeframe, inline: true })
        }
        if (plan.conviction_level) {
          embed.addFields({ name: '🔥 Độ tự tin', value: plan.conviction_level, inline: true })
        }

        // Xử lý an toàn link ảnh chart (Discord yêu cầu full URL)
        if (plan.chart_image_url) {
          try {
            if (plan.chart_image_url.startsWith('http')) {
              embed.setImage(plan.chart_image_url)
            } else if (plan.chart_image_url.startsWith('/')) {
              embed.setImage(`https://advisor.finpeace.cloud${plan.chart_image_url}`)
            }
          } catch (imgErr) {
            console.error('Invalid image URL:', plan.chart_image_url)
          }
        }

        await message.reply({ embeds: [embed] })
      }

    } catch (err) {
      console.error('Bot Error:', err)
      await message.reply('Oops, Bot đang gặp chút sự cố kỹ thuật. Báo admin nhé!')
    }
  }
})

// Bật bot
client.login(DISCORD_BOT_TOKEN)
