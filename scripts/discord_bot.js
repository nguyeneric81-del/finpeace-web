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

client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return

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

        const embed1 = new EmbedBuilder()
          .setColor(0x3b82f6) // Blue for FA
          .setAuthor({ name: `Phân tích Cơ bản (FA) | ${ticker}` })
          .setTitle(company ? `${company.ticker} — ${company.name}` : `Cổ phiếu ${ticker}`)
          .setDescription(chunks[0] || 'Chưa có thông tin nền tảng vĩ mô cụ thể.')
        
        if (statFields.length > 0) {
          embed1.addFields(statFields)
        }
        
        if (chunks.length === 1) {
          embed1.setTimestamp().setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })
        }
        
        await message.reply({ embeds: [embed1] })

        // Send subsequent chunks as separate embeds to keep styling consistent
        for (let i = 1; i < chunks.length; i++) {
          const followUpEmbed = new EmbedBuilder()
            .setColor(0x3b82f6)
            .setDescription(chunks[i])
          
          if (i === chunks.length - 1) {
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
