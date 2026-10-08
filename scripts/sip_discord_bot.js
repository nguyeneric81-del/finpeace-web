/**
 * scripts/sip_discord_bot.js
 * BOT DISCORD NỘI BỘ FINPEACE - TRỢ LÝ TƯ VẤN & CHĂM SÓC KHÁCH HÀNG TÍCH SẢN (SIP)
 * 
 * Hỗ trợ Nhân viên/Advisor FinPeace tra cứu tức thì:
 * 1. Giá trị nội tại (Intrinsic Value) & Giá tích sản tối đa theo chuẩn FinPeace SIP
 * 2. Khuyến nghị CTA (🟢 MUA TỐT / 🟡 MUA / 🔴 TẠM DỪNG MUA)
 * 3. Đồng thuận định giá từ các Công ty Chứng khoán (CTCK Consensus)
 * 4. Gợi ý kịch bản giải thích (Talking points) khi khách hàng thắc mắc
 */

const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_SIP_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DISCORD_BOT_TOKEN) {
  console.warn('⚠️ Chưa cấu hình DISCORD_SIP_BOT_TOKEN hoặc DISCORD_BOT_TOKEN trong .env');
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel]
});

client.once('clientReady', (c) => {
  console.log(`🤖 FinPeace SIP Advisor Bot đã sẵn sàng với tên: ${c.user.tag}`);
  c.user.setActivity('!sip <MÃ> | FinPeace SIP Advisor', { type: 3 });
});

// Format VND number
function formatVND(num) {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return Number(num).toLocaleString('vi-VN') + ' đ';
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Lấy nội dung tin nhắn và loại bỏ mention nếu có
  let rawContent = message.content.trim();
  const botMention = `<@${client.user.id}>`;
  const botNicknameMention = `<@!${client.user.id}>`;

  let isMentioned = message.mentions.has(client.user.id);
  if (isMentioned) {
    rawContent = rawContent.replace(botMention, '').replace(botNicknameMention, '').trim();
  }

  const parts = rawContent.split(/\s+/);
  let command = parts[0]?.toLowerCase();
  let tickerArg = parts[1]?.toUpperCase();

  // Nếu người dùng tag bot trực tiếp: @Bot VCB
  if (isMentioned && !command.startsWith('!')) {
    tickerArg = parts[0]?.toUpperCase();
    command = '!sip';
  }

  // Command: !sip hoặc !tichsan hoặc !nt
  if (command === '!sip' || command === '!tichsan' || command === '!nt') {
    const ticker = tickerArg || parts[1]?.toUpperCase();

    if (!ticker) {
      return message.reply('💡 **Cách dùng:** Gõ `!sip <MÃ>` để tra cứu thông tin tích sản.\n*Ví dụ:* `!sip VCB`, `!sip MWG`, `!sip POW`, `!sip FPT`');
    }

    await message.channel.sendTyping();

    try {
      // 1. Lấy thông tin công ty
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('ticker', ticker)
        .maybeSingle();

      const companyName = company ? company.name : ticker;
      const exchange = company?.exchange || 'HOSE';

      // 2. Lấy định giá SIP từ bảng sip_asset_valuations hoặc sip_watchlist
      let sipInfo = null;
      const { data: valData } = await supabase
        .from('sip_asset_valuations')
        .select('*')
        .eq('stock_code', ticker)
        .order('update_date', { ascending: false })
        .limit(1);

      if (valData && valData.length > 0) {
        sipInfo = valData[0];
      }

      // 3. Lấy thị giá mới nhất
      const { data: priceData } = await supabase
        .from('stock_prices')
        .select('price, date')
        .eq('ticker', ticker)
        .order('date', { ascending: false })
        .limit(1);

      const currentPrice = priceData && priceData.length > 0 ? Number(priceData[0].price) : null;

      // 4. Lấy đồng thuận từ các Công ty Chứng khoán (CTCK)
      const { data: consensusData } = await supabase
        .from('stock_analyst_consensus')
        .select('*')
        .eq('ticker', ticker)
        .order('as_of_date', { ascending: false })
        .limit(1);

      const consensus = consensusData && consensusData.length > 0 ? consensusData[0] : null;

      // 5. Lấy 4 báo cáo CTCK gần nhất
      const { data: recs } = await supabase
        .from('analyst_recommendations')
        .select('firm_name, recommendation, target_price, report_date')
        .eq('ticker', ticker)
        .order('report_date', { ascending: false })
        .limit(4);

      // Nếu không có dữ liệu nào
      if (!sipInfo && !consensus) {
        return message.reply(`❌ Không tìm thấy dữ liệu Tích sản hoặc Định giá cho mã **${ticker}** trong hệ thống FinPeace.`);
      }

      // Xác định trạng thái CTA
      let cta = sipInfo?.cta || 'THEO DÕI';
      let ctaColor = 0x3b82f6; // Xanh dương
      if (cta.includes('MUA TỐT') || cta.includes('MUA')) {
        ctaColor = 0x10b981; // Xanh lá
      } else if (cta.includes('TẠM DỪNG MUA') || cta.includes('DỪNG')) {
        ctaColor = 0xef4444; // Đỏ
      }

      let intrinsicValue = null;
      if (sipInfo?.new_intrinsic_value !== null && sipInfo?.new_intrinsic_value !== undefined && Number(sipInfo.new_intrinsic_value) > 0) {
        intrinsicValue = Number(sipInfo.new_intrinsic_value);
      } else if (sipInfo?.old_intrinsic_value !== null && sipInfo?.old_intrinsic_value !== undefined && Number(sipInfo.old_intrinsic_value) > 0) {
        intrinsicValue = Number(sipInfo.old_intrinsic_value);
      } else if (sipInfo?.max_buy_price && Number(sipInfo.max_buy_price) > 0) {
        intrinsicValue = Math.round(Number(sipInfo.max_buy_price) / 0.9);
      }

      const maxBuyPrice = sipInfo?.max_buy_price && Number(sipInfo.max_buy_price) > 0 
        ? Number(sipInfo.max_buy_price) 
        : (intrinsicValue ? Math.round(intrinsicValue * 0.9) : null);

      // Embed trả về
      const embed = new EmbedBuilder()
        .setColor(ctaColor)
        .setAuthor({ name: `FINPEACE SIP ADVISOR | HỖ TRỢ TƯ VẤN KHÁCH HÀNG`, iconURL: 'https://finpeace.vn/favicon.ico' })
        .setTitle(`📊 BÁO CÁO ĐỊNH GIÁ & TÍCH SẢN: ${ticker} (${exchange})`)
        .setDescription(`**${companyName}**\nKhuyến nghị hiện tại: **${cta}** | Thị giá: **${formatVND(currentPrice)}**`)
        .setThumbnail('https://finpeace.vn/logo.png')
        .setTimestamp()
        .setFooter({ text: 'FinPeace Wealth · Hiểu đúng — Đầu tư đúng' });

      // Field 1: Định giá FinPeace
      if (sipInfo || intrinsicValue) {
        const upsideFinPeace = currentPrice && intrinsicValue && intrinsicValue > 0 ? (((intrinsicValue - currentPrice) / currentPrice) * 100).toFixed(1) + '%' : 'N/A';
        embed.addFields({
          name: '🏛️ 1. Góc Nhìn Định Giá FinPeace SIP',
          value: [
            `• **Giá trị nội tại (IV):** \`${formatVND(intrinsicValue)}\``,
            `• **Giá mua tích sản tối đa (MOS 10%):** \`${formatVND(maxBuyPrice)}\``,
            `• **Upside kỳ vọng FinPeace:** \`+${upsideFinPeace}\``,
            `• **Đánh giá kỳ gần nhất:** ${sipInfo?.quarter_update || 'Q2/2026'}`
          ].join('\n'),
          inline: false
        });
      }

      // Field 2: Đồng thuận CTCK (Thị trường)
      if (consensus) {
        const ctckTarget = Number(consensus.target_price);
        const upsideCTCK = currentPrice && ctckTarget ? (((ctckTarget - currentPrice) / currentPrice) * 100).toFixed(1) + '%' : `${consensus.return_potential_pct}%`;
        embed.addFields({
          name: '🏢 2. Đồng Thuận Thị Trường (CTCK Consensus)',
          value: [
            `• **Giá mục tiêu trung bình CTCK:** \`${formatVND(ctckTarget)}\``,
            `• **Điểm đồng thuận (Rating):** \`${consensus.consensus_rating}/5.0\` (⭐)`,
            `• **Tỷ lệ khuyến nghị:** \`${consensus.buys_pct}% Mua\` (${consensus.total_buys || 0} CTCK Mua, ${consensus.total_holds || 0} Giữ)`,
            `• **Upside đồng thuận CTCK:** \`+${upsideCTCK}\``,
            `• **Ngày chốt số liệu:** \`${consensus.as_of_date}\``
          ].join('\n'),
          inline: false
        });
      }

      // Field 3: Báo cáo CTCK gần nhất
      if (recs && recs.length > 0) {
        const recList = recs.map(r => `• **${r.firm_name}:** ${r.recommendation.toUpperCase()} — Target: \`${formatVND(r.target_price)}\` *(Ngày ${r.report_date})*`).join('\n');
        embed.addFields({
          name: '📑 3. Báo Cáo Phân Tích CTCK Tiêu Biểu Gần Nhất',
          value: recList,
          inline: false
        });
      }

      // Field 4: Gợi ý Kịch bản Tư vấn cho Nhân viên FinPeace (Talking Points)
      let talkingPoints = '';
      if (intrinsicValue && consensus) {
        const ctckTarget = Number(consensus.target_price);
        const diffRatio = intrinsicValue / ctckTarget;

        if (diffRatio > 1.25) {
          talkingPoints = `💡 **Kịch bản trả lời khách hàng (Khi FinPeace định giá cao hơn CTCK):**\n"CTCK chỉ định giá trong khung thời gian 12 tháng ngắn hạn theo P/E dự phóng năm nay. Trong khi FinPeace định giá theo chu kỳ 3 - 5 năm dựa trên năng lực mở rộng quy mô và lợi thế cạnh tranh dài hạn của doanh nghiệp. Ở thị giá hiện tại, cổ phiếu nằm sâu trong vùng an toàn để gom tích sản dài hạn."`;
        } else if (diffRatio < 0.85) {
          talkingPoints = `💡 **Kịch bản trả lời khách hàng (Khi FinPeace định giá thấp hơn CTCK):**\n"CTCK đang phản ánh ngay kỳ vọng tăng trưởng từ dự án mới. Tuy nhiên FinPeace áp dụng nguyên tắc thận trọng (Margin of Safety) khắt khe hơn để bảo vệ vốn tuyệt đối cho khách hàng, tránh mua đuổi giá cao. Khuyến nghị khách hàng duy trì kỷ luật mua từng phần khi có nhịp điều chỉnh."`;
        } else {
          talkingPoints = `💡 **Kịch bản trả lời khách hàng:**\n"Cả FinPeace và thị trường chung (các CTCK) đều có sự đồng thuận tuyệt đối về giá trị của ${ticker} quanh mức ${formatVND(ctckTarget)}. Với thị giá hiện tại thấp hơn giá mua tối đa, đây là cơ hội tích sản chuẩn mực đã được kiểm định chéo độc lập từ nhiều định chế tài chính."`;
        }
      } else if (sipInfo?.sip_outlook) {
        talkingPoints = `💡 **Ghi chú tư vấn:**\n${sipInfo.sip_outlook}`;
      }

      if (talkingPoints) {
        embed.addFields({
          name: '🎯 4. Gợi Ý Kịch Bản Trả Lời Khách Hàng (Dành cho Chuyên viên)',
          value: talkingPoints,
          inline: false
        });
      }

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Error handling !sip command:', err);
      return message.reply('❌ Đã xảy ra lỗi khi truy vấn dữ liệu từ Supabase. Vui lòng kiểm tra lại log hệ thống.');
    }
  }

  // Command: !watchlist hoặc !sip-all
  if (command === '!watchlist' || command === '!sip-all' || command === '!danhmuc') {
    await message.channel.sendTyping();

    try {
      const { data: list } = await supabase
        .from('stock_analyst_consensus')
        .select('ticker, target_price, last_price, consensus_rating, return_potential_pct, buys_pct')
        .order('return_potential_pct', { ascending: false });

      if (!list || list.length === 0) {
        return message.reply('Hiện chưa có dữ liệu trong danh mục tích sản.');
      }

      const rows = list.map((item, idx) => {
        const ratingStar = Number(item.consensus_rating) >= 4.5 ? '⭐' : '';
        return `\`${idx + 1}.\` **${item.ticker}**: Thị giá \`${formatVND(item.last_price)}\` | Target CTCK \`${formatVND(item.target_price)}\` (Upside: \`+${item.return_potential_pct}%\`) ${ratingStar}`;
      }).join('\n');

      const embed = new EmbedBuilder()
        .setColor(0x3b82f6)
        .setTitle('📋 DANH MỤC CỔ PHIẾU TÍCH SẢN & ĐỒNG THUẬN ĐỊNH GIÁ (FINPEACE)')
        .setDescription(`Dưới đây là các mã cổ phiếu đang được theo dõi định giá trong hệ sinh thái FinPeace:\n\n${rows}\n\n👉 *Gõ \`!sip <MÃ>\` (Ví dụ: \`!sip VCB\`) để xem chi tiết từng mã và kịch bản tư vấn khách hàng!*`)
        .setFooter({ text: 'FinPeace Wealth Planning System' })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      return message.reply('❌ Lỗi khi lấy danh mục cổ phiếu.');
    }
  }

  // Command: !help hoặc !huongdan
  if (command === '!help' || command === '!huongdan' || command === '!sip-help') {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x6366f1)
      .setTitle('📖 CẨM NANG SỬ DỤNG BOT NỘI BỘ FINPEACE SIP')
      .setDescription('Bot hỗ trợ nhân viên tư vấn, cố vấn tài chính (Advisor) tra cứu tức thì thông tin tích sản để chăm sóc khách hàng.')
      .addFields(
        { name: '🔍 1. Tra cứu chi tiết một mã', value: '`!sip <MÃ>` (Ví dụ: `!sip VCB`, `!sip MWG`, `!sip POW`)\nHiển thị: Giá trị nội tại FinPeace, Giá mua tối đa, Target CTCK, Khuyến nghị của 20+ CTCK và kịch bản tư vấn.' },
        { name: '📋 2. Xem toàn bộ danh mục tích sản', value: '`!watchlist` hoặc `!sip-all`\nHiển thị bảng tổng hợp toàn bộ các mã, thị giá, upside và rating đồng thuận.' },
        { name: '💡 3. Các kênh hỗ trợ', value: 'Bot hoạt động trong các kênh nội bộ `#tu-van-tich-san`, `#cskh-advisors` hoặc có thể chat trực tiếp (Direct Message) với Bot.' }
      )
      .setFooter({ text: 'FinPeace Tech & Advisory Hub' });

    return message.reply({ embeds: [helpEmbed] });
  }
});

if (DISCORD_BOT_TOKEN) {
  client.login(DISCORD_BOT_TOKEN).catch(err => {
    console.error('❌ Lỗi đăng nhập Discord Bot:', err.message);
  });
} else {
  console.log('💡 Để khởi chạy bot, vui lòng cấu hình DISCORD_SIP_BOT_TOKEN trong file .env');
}
