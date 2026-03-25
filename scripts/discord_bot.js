// scripts/discord_bot.js
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const { createClient } = require('@supabase/supabase-js')
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

  if (lowerText.startsWith('!fa ') || lowerText.startsWith('!coban ')) {
    commandType = 'FA'
    ticker = text.split(' ')[1]?.trim().toUpperCase()
  } else if (lowerText.startsWith('!ta ') || lowerText.startsWith('!kythuat ') || lowerText.startsWith('!tuvan ')) {
    commandType = 'TA'
    ticker = text.split(' ')[1]?.trim().toUpperCase()
  }

  if (commandType) {
    if (!ticker) {
      await message.reply(`Vui lòng nhập mã cổ phiếu. Ví dụ: \`${lowerText.split(' ')[0]} HPG\``)
      return
    }

    try {
      await message.channel.sendTyping()

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
      const planText = (company && company.plan) ? company.plan : (insight.impact_value || 'Chưa có Trading Plan cụ thể cho mã này.')

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: 'FinPeace · Hiểu đúng — Đầu tư đúng', iconURL: 'https://finpeace.cloud/logo.png' })

      if (commandType === 'FA') {
        // Build FA Embed
        const shortView = analystView.length > 500
          ? analystView.slice(0, 497) + '...'
          : analystView

        embed
          .setColor(0x3b82f6) // Blue for FA
          .setAuthor({ name: `Phân tích Cơ bản (FA) | ${ticker}` })
          .setTitle(company ? `${company.ticker} — ${company.name}` : `Cổ phiếu ${ticker}`)
          .setDescription(`> ${shortView}`)
        
        if (statFields.length > 0) {
          embed.addFields(statFields)
        }
        await message.reply({ embeds: [embed] })

      } else {
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
            const { data: pendingData } = await supabase.from('pending_tickers').select('*').eq('ticker', ticker).maybeSingle()
            
            if (pendingData) {
              const newRequesters = [...new Set([...(pendingData.requester_ids || []), message.author.id])]
              await supabase.from('pending_tickers').update({ 
                requested_count: pendingData.requested_count + 1,
                requester_ids: newRequesters,
                status: 'pending'
              }).eq('ticker', ticker)
            } else {
              await supabase.from('pending_tickers').insert({
                ticker: ticker,
                requested_count: 1,
                requester_ids: [message.author.id],
                status: 'pending'
              })
            }
          } catch (upsertErr) {
            console.error('Lỗi khi lưu pending_tickers:', upsertErr)
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

        if (plan.chart_image_url) {
          embed.setImage(plan.chart_image_url)
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
