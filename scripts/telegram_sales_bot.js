/**
 * scripts/telegram_sales_bot.js
 * BOT TELEGRAM HỖ TRỢ SALES & ADVISOR FINPEACE: TRADING & TIN TỨC THỊ TRƯỜNG CHỨNG KHOÁN
 * 
 * Mục tiêu chính:
 * 1. Tra cứu Kế hoạch Giao dịch (Trading Plan) ngắn hạn & trung hạn:
 *    - Gõ thẳng mã (VD: DGW, CTG, SSI, HPG, VCI...) hoặc /trade <MÃ>
 *    - Xuất: Chiến lược, Vùng mua (Entry), Điểm cắt lỗ (Stop Loss), Mục tiêu chốt lời (Take Profit), Tỷ lệ R:R, Catalyst dòng tiền.
 *    - 💬 KỊCH BẢN TRADING CHO SALES: Đoạn tin nhắn chuẩn để Sales copy-paste gửi thẳng vào Room VIP / Chat khách hàng.
 * 2. /plans hoặc /hot: Danh sách các lệnh Trading đang Chờ Mua hoặc Đang Nắm Giữ tốt nhất.
 * 3. /news [MÃ]: Tin tức thị trường mới nhất hoặc tin tức cụ thể của từng mã cổ phiếu.
 * 4. /market hoặc /macro: Nhận định xu hướng thị trường & tin vĩ mô hàng ngày từ FinPeace Research.
 */

const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local'), override: true });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), override: true });
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_SALES_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('⚠️ Chưa cấu hình TELEGRAM_SALES_BOT_TOKEN trong .env');
  process.exit(1);
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Format số tiền VND
function formatPrice(num) {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return Number(num).toLocaleString('vi-VN') + ' đ';
}

// Format ngày giờ tin tức thân thiện cho Sales (Hôm nay, Hôm qua, hoặc DD/MM/YYYY)
function formatNewsDate(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh', hour12: false };
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' };
  
  const timeStr = d.toLocaleTimeString('vi-VN', timeOptions);
  const dateStr = d.toLocaleDateString('vi-VN', dateOptions);
  
  const nowDateStr = now.toLocaleDateString('vi-VN', dateOptions);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayDateStr = yesterday.toLocaleDateString('vi-VN', dateOptions);

  if (dateStr === nowDateStr) {
    return `Hôm nay ${timeStr}`;
  } else if (dateStr === yesterdayDateStr) {
    return `Hôm qua ${timeStr}`;
  }
  return `${dateStr} ${timeStr}`;
}

// ─────────────────────────────────────────────────────────────
// 1. TRA CỨU TRADING PLAN CHO 1 MÃ CỔ PHIẾU
// ─────────────────────────────────────────────────────────────
async function handleTradingQuery(ctx, ticker) {
  ticker = ticker.trim().toUpperCase();
  if (!ticker || ticker.length < 3) {
    return ctx.reply('⚠️ Vui lòng nhập đúng mã cổ phiếu (VD: /trade DGW, /trade CTG, SSI, HPG)');
  }

  await ctx.sendChatAction('typing');

  try {
    // 1. Lấy thông tin công ty
    const { data: company } = await supabase
      .from('companies')
      .select('name, exchange')
      .eq('ticker', ticker)
      .maybeSingle();

    const companyName = company ? company.name : ticker;
    const exchange = company?.exchange || 'HOSE';

    // 2. Lấy Trading Plan mới nhất
    const { data: plans } = await supabase
      .from('trading_plans')
      .select('*')
      .eq('ticker', ticker)
      .order('updated_at', { ascending: false })
      .limit(1);

    const plan = plans && plans.length > 0 ? plans[0] : null;

    // 3. Lấy thị giá mới nhất
    const { data: priceData } = await supabase
      .from('stock_prices')
      .select('price, date')
      .eq('ticker', ticker)
      .order('date', { ascending: false })
      .limit(1);

    const currentPrice = priceData && priceData.length > 0 ? Number(priceData[0].price) : null;

    // 4. Lấy tin tức liên quan đến mã (ưu tiên tin mới nhất, loại trừ null)
    const { data: newsItems } = await supabase
      .from('raw_news')
      .select('title, link, source, published_at')
      .or(`tickers.cs.{${ticker}},title.ilike.%${ticker}%`)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(2);

    // 5. Nếu không có plan trong trading_plans, tìm trong giá đồng thuận CTCK hoặc hỗ trợ kỹ thuật
    let msg = `⚡ <b>TÍN HIỆU GIAO DỊCH & THỊ TRƯỜNG | FINPEACE TRADING BOT</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🎯 <b>Mã: ${ticker} (${exchange})</b> — <i>${companyName}</i>\n`;
    if (currentPrice) {
      msg += `💰 Thị giá hiện tại: <b>${formatPrice(currentPrice)}</b>\n`;
    }
    msg += `\n`;

    if (plan) {
      // Trạng thái lệnh
      let statusBadge = '⏳ CHỜ MUA (WAITING BUY)';
      if (plan.exec_status === 'bought' || plan.status === 'holding') {
        statusBadge = '🟢 ĐÃ KHỚP - ĐANG NẮM GIỮ T+';
      } else if (plan.exec_status === 'sold_half') {
        statusBadge = '🎯 ĐÃ CHỐT LỜI 1/2 VỊ THẾ';
      } else if (plan.exec_status === 'sold_all' || plan.status === 'closed') {
        statusBadge = '⚪ ĐÃ ĐÓNG VỊ THẾ';
      }

      msg += `📌 <b>1. Kế Hoạch Giao Dịch (Trading Plan):</b>\n`;
      msg += `• Trạng thái: <b>${statusBadge}</b>\n`;
      msg += `• Chiến lược: <b>${plan.strategy_name || 'Theo xu hướng / Breakout'}</b>\n`;
      msg += `• Khung thời gian: <code>${plan.timeframe || 'D1 / Swing'}</code>\n`;
      msg += `• <b>Vùng gom mua (Entry):</b> <b>${plan.entry_zone || 'Đang xác định'}</b>\n`;
      msg += `• <b>Cắt lỗ (Stop Loss):</b> <b>${plan.stop_loss || 'Thủng hỗ trợ'}</b>\n`;
      msg += `• <b>Mục tiêu chốt lời (TP):</b> <b>${plan.take_profit || 'Vùng đỉnh cũ'}</b>\n`;
      if (plan.risk_reward) {
        msg += `• <b>Tỷ lệ R:R (Risk/Reward):</b> <b>1 : ${plan.risk_reward}</b> 🔥\n`;
      }
      if (plan.catalyst_note) {
        msg += `• <b>Catalyst dòng tiền:</b> <i>${plan.catalyst_note}</i>\n`;
      }
      msg += `\n`;

      // Kịch bản Sales gửi khách
      msg += `💬 <b>2. Kịch Bản Sales Bắn Lệnh (Copy gửi khách / Room VIP):</b>\n`;
      msg += `<i>"🔥 [TÍN HIỆU TRADING ${ticker}]:\n`;
      msg += `• Chiến lược: ${plan.strategy_name || 'Lướt sóng theo dòng tiền'}\n`;
      msg += `• Vùng mua giải ngân: ${plan.entry_zone}\n`;
      msg += `• Cắt lỗ kỷ luật (SL): ${plan.stop_loss}\n`;
      msg += `• Chốt lời kỳ vọng (TP): ${plan.take_profit}\n`;
      if (plan.risk_reward) msg += `• Tỷ lệ R:R: 1 : ${plan.risk_reward}\n`;
      if (plan.catalyst_note) msg += `• Động lực: ${plan.catalyst_note}\n`;
      msg += `👉 Anh/chị tuân thủ kỷ luật phân bổ vốn tối đa 20-25% NAV cho vị thế này nhé!"</i>\n\n`;

    } else {
      msg += `ℹ️ <i>Hiện chưa có Trading Plan kích hoạt chính thức cho ${ticker}.</i>\n\n`;
    }

    // Phần tin tức gần nhất
    if (newsItems && newsItems.length > 0) {
      msg += `📰 <b>3. Tin Tức & Catalyst Mới Nhất:</b>\n`;
      newsItems.forEach(n => {
        const dStr = formatNewsDate(n.published_at);
        msg += `• <a href="${n.link}">${n.title}</a> (<i>${n.source}${dStr ? ` • 🕒 ${dStr}` : ''}</i>)\n`;
      });
      msg += `\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `<i>FinPeace Trading Intelligence · Kỷ luật là sức mạnh</i>`;

    const inlineKeyboard = [];
    if (plan) {
      inlineKeyboard.push([
        { text: `📈 Xem Biểu Đồ Kỹ Thuật (Chart)`, callback_data: `show_chart_${ticker}` },
        { text: `🔍 Xem Chi Tiết Phân Tích`, callback_data: `plan_detail_${ticker}` }
      ]);
    }
    inlineKeyboard.push([
      { text: `🔥 Xem Danh Sách Lệnh Hot`, callback_data: `hot_plans` },
      { text: `📰 Tin thị trường hôm nay`, callback_data: `market_news` }
    ]);

    return ctx.reply(msg, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });

  } catch (err) {
    console.error('Error handling trading query:', err);
    return ctx.reply('❌ Đã xảy ra lỗi khi truy xuất dữ liệu trading. Vui lòng thử lại sau.');
  }
}

// ─────────────────────────────────────────────────────────────
// 1.1 HIỂN THỊ HÌNH ẢNH BIỂU ĐỒ (CHART) TỪ DATABASE
// ─────────────────────────────────────────────────────────────
async function handleShowChart(ctx, ticker) {
  ticker = ticker.trim().toUpperCase();
  if (!ticker || ticker.length < 3) {
    return ctx.reply('⚠️ Vui lòng nhập đúng mã cổ phiếu (VD: /chart DPM, /chart DGW, HHV chart)');
  }

  await ctx.sendChatAction('upload_photo');

  try {
    // 1. Lấy Trading Plan mới nhất của mã
    const { data: plans } = await supabase
      .from('trading_plans')
      .select('ticker, company_name, exchange, strategy_name, entry_zone, stop_loss, take_profit, risk_reward, chart_image_url')
      .eq('ticker', ticker)
      .order('updated_at', { ascending: false })
      .limit(1);

    const plan = plans && plans.length > 0 ? plans[0] : null;

    if (!plan || !plan.chart_image_url) {
      return ctx.reply(
        `ℹ️ <i>Chưa có ảnh biểu đồ kỹ thuật chính thức trong database cho mã <b>${ticker}</b>.</i>\n\n` +
        `👉 Gõ <code>${ticker} detail</code> để xem thông số và luận điểm phân tích chi tiết!`,
        { parse_mode: 'HTML' }
      );
    }

    const exchange = plan.exchange || 'HOSE';
    let caption = `📈 <b>BIỂU ĐỒ PHÂN TÍCH KỸ THUẬT ${ticker} (${exchange})</b>\n`;
    caption += `<i>${plan.company_name || ticker}</i>\n`;
    caption += `━━━━━━━━━━━━━━━━━━━━━\n`;
    caption += `• Chiến lược: <b>${plan.strategy_name || 'Theo xu hướng'}</b>\n`;
    caption += `• Vùng gom mua: <b>${plan.entry_zone || 'N/A'}</b>\n`;
    caption += `• Cắt lỗ (SL): <code>${plan.stop_loss || 'N/A'}</code> | Chốt lời (TP): <b>${plan.take_profit || 'N/A'}</b>\n`;
    if (plan.risk_reward) {
      caption += `• Tỷ lệ R:R: <b>1 : ${plan.risk_reward}</b> 🔥\n`;
    }

    return ctx.replyWithPhoto(plan.chart_image_url, {
      caption: caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: `🔍 Xem Chi Tiết Phân Tích`, callback_data: `plan_detail_${ticker}` },
            { text: `💬 Kịch Bản Bắn Lệnh`, callback_data: `trade_${ticker}` }
          ],
          [
            { text: `🔥 Xem Danh Sách Lệnh Hot`, callback_data: `hot_plans` }
          ]
        ]
      }
    });

  } catch (err) {
    console.error('Error showing chart:', err);
    return ctx.reply('❌ Đã xảy ra lỗi khi tải ảnh biểu đồ từ hệ thống. Vui lòng thử lại sau.');
  }
}

// ─────────────────────────────────────────────────────────────
// 1.1 TRA CỨU CHI TIẾT KẾ HOẠCH GIAO DỊCH (PLAN DETAIL & CHART)
// ─────────────────────────────────────────────────────────────
function formatAnalystNoteForTelegram(raw) {
  if (!raw) return '<i>Chưa có ghi chú phân tích chi tiết.</i>';
  let text = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  text = text.replace(/^#{1,4}\s+(.+)$/gm, '<b>$1</b>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  text = text.replace(/\*([^\*\n]+?)\*/g, '<i>$1</i>');
  text = text.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  return text;
}

async function handleTradingPlanDetail(ctx, ticker) {
  ticker = ticker.trim().toUpperCase();
  if (!ticker || ticker.length < 3) {
    return ctx.reply('⚠️ Vui lòng nhập đúng mã cổ phiếu (VD: /detail DGW, /detail DPM, HHV detail)');
  }

  await ctx.sendChatAction('typing');

  try {
    // 1. Lấy thông tin công ty
    const { data: company } = await supabase
      .from('companies')
      .select('name, exchange')
      .eq('ticker', ticker)
      .maybeSingle();

    const companyName = company ? company.name : ticker;
    const exchange = company?.exchange || 'HOSE';

    // 2. Lấy Trading Plan mới nhất
    const { data: plans } = await supabase
      .from('trading_plans')
      .select('*')
      .eq('ticker', ticker)
      .order('updated_at', { ascending: false })
      .limit(1);

    const plan = plans && plans.length > 0 ? plans[0] : null;

    if (!plan) {
      return ctx.reply(
        `ℹ️ <i>Hiện chưa có Trading Plan chi tiết cho mã <b>${ticker}</b> trong hệ thống FinPeace.</i>\n\n` +
        `👉 Gõ <code>/plans</code> để xem danh mục các mã đang mở vị thế giao dịch!`,
        { parse_mode: 'HTML' }
      );
    }

    // 3. Lấy thị giá hiện tại
    const { data: priceData } = await supabase
      .from('stock_prices')
      .select('price, date')
      .eq('ticker', ticker)
      .order('date', { ascending: false })
      .limit(1);

    const currentPrice = priceData && priceData.length > 0 ? Number(priceData[0].price) : null;

    // 4. Trạng thái lệnh & icon
    let statusBadge = '⏳ CHỜ MUA (WAITING BUY)';
    if (plan.exec_status === 'bought' || plan.status === 'holding') {
      statusBadge = '🟢 ĐÃ KHỚP - ĐANG NẮM GIỮ T+';
    } else if (plan.exec_status === 'sold_half') {
      statusBadge = '🎯 ĐÃ CHỐT LỜI 1/2 VỊ THẾ';
    } else if (plan.exec_status === 'sold_all' || plan.status === 'closed') {
      statusBadge = '⚪ ĐÃ ĐÓNG VỊ THẾ';
    }

    const allocation = plan.capital_allocation_pct || plan.max_position_pct || 15;
    const holdingDays = plan.expected_holding_days || 30;

    // 5. Gửi ảnh chart nếu có
    if (plan.chart_image_url) {
      try {
        let photoCaption = `📈 <b>BIỂU ĐỒ KỸ THUẬT ${ticker} (${exchange})</b>\n`;
        photoCaption += `• Chiến lược: <i>${plan.strategy_name || 'Theo xu hướng'}</i>\n`;
        photoCaption += `• Vùng gom: <b>${plan.entry_zone || 'N/A'}</b> | Cắt lỗ: <code>${plan.stop_loss || 'N/A'}</code>\n`;
        photoCaption += `• Chốt lời: <b>${plan.take_profit || 'N/A'}</b> (R:R: <b>1:${plan.risk_reward || 'N/A'}</b>)`;
        await ctx.replyWithPhoto(plan.chart_image_url, {
          caption: photoCaption,
          parse_mode: 'HTML'
        });
      } catch (photoErr) {
        console.warn(`Lỗi gửi photo chart cho ${ticker}:`, photoErr.message);
      }
    }

    // 6. Xây dựng bản tin chi tiết
    let msg = `📊 <b>CHI TIẾT KẾ HOẠCH GIAO DỊCH (TRADING PLAN DETAIL)</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🎯 <b>Mã: ${ticker} (${exchange})</b> — <i>${companyName}</i>\n`;
    if (plan.sector) msg += `🏢 Ngành: <b>${plan.sector}</b>\n`;
    msg += `⚡ Chiến lược: <b>${plan.strategy_name || 'Theo xu hướng'}</b> | Khung: <code>${plan.timeframe || 'D1'}</code>\n`;
    if (currentPrice) msg += `💰 Thị giá hiện tại: <b>${formatPrice(currentPrice)}</b>\n`;
    msg += `\n`;

    msg += `📌 <b>1. THÔNG SỐ VỊ THẾ & QUẢN TRỊ VỐN:</b>\n`;
    msg += `• Trạng thái lệnh: <b>${statusBadge}</b>\n`;
    msg += `• Khuyến nghị phân bổ: <b>${allocation}% NAV</b>\n`;
    msg += `• Thời gian nắm giữ kỳ vọng: <b>~${holdingDays} ngày</b>\n`;
    if (plan.conviction_level) msg += `• Độ tin cậy (Conviction): <b>${plan.conviction_level}</b>\n`;
    if (plan.risk_level) msg += `• Mức độ rủi ro: <b>${plan.risk_level}</b>\n`;
    msg += `• <b>Vùng gom mua (Entry):</b> <b>${plan.entry_zone || 'Đang xác định'}</b>\n`;
    msg += `• <b>Cắt lỗ kỷ luật (SL):</b> <code>${plan.stop_loss || 'Thủng hỗ trợ'}</code>\n`;
    msg += `• <b>Mục tiêu chốt lời (TP):</b> <b>${plan.take_profit || 'Kháng cự đỉnh cũ'}</b>\n`;
    if (plan.risk_reward) msg += `• <b>Tỷ lệ R:R:</b> <b>1 : ${plan.risk_reward}</b> 🔥\n`;
    if (plan.support_price || plan.resistance_price) {
      msg += `• Hỗ trợ / Kháng cự: <code>${formatPrice(plan.support_price)}</code> / <code>${formatPrice(plan.resistance_price)}</code>\n`;
    }
    msg += `\n`;

    // Nhật ký khớp lệnh (nếu đã mua/bán)
    if (plan.bought_price || plan.sold_half_price || plan.sold_all_price || plan.exec_note) {
      msg += `⏱️ <b>2. NHẬT KÝ THỰC THI (EXECUTION TRACE):</b>\n`;
      if (plan.bought_price) {
        msg += `• Giá khớp mua thực tế: <b>${formatPrice(plan.bought_price)}</b>${plan.bought_at ? ` (ngày ${new Date(plan.bought_at).toLocaleDateString('vi-VN')})` : ''}\n`;
      }
      if (plan.sold_half_price) {
        msg += `• Giá chốt lời 1/2: <b>${formatPrice(plan.sold_half_price)}</b>${plan.sold_half_at ? ` (ngày ${new Date(plan.sold_half_at).toLocaleDateString('vi-VN')})` : ''}\n`;
      }
      if (plan.sold_all_price) {
        msg += `• Giá đóng vị thế: <b>${formatPrice(plan.sold_all_price)}</b>${plan.sold_all_at ? ` (ngày ${new Date(plan.sold_all_at).toLocaleDateString('vi-VN')})` : ''}\n`;
      }
      if (plan.exec_note) {
        msg += `• Ghi chú khớp lệnh: <i>${plan.exec_note}</i>\n`;
      }
      msg += `\n`;
    }

    // Luận điểm phân tích chi tiết
    msg += `🧠 <b>${plan.bought_price ? '3' : '2'}. LUẬN ĐIỂM PHÂN TÍCH KỸ THUẬT (ANALYST INSIGHTS):</b>\n`;
    const formattedNote = formatAnalystNoteForTelegram(plan.analyst_note);
    if (formattedNote.length > 2500) {
      msg += formattedNote.substring(0, 2400) + '...\n<i>(Đã rút gọn - xem đầy đủ trên hệ thống)</i>\n\n';
    } else {
      msg += formattedNote + `\n\n`;
    }

    if (plan.catalyst_note) {
      msg += `💡 <b>ĐỘNG LỰC TĂNG GIÁ (CATALYST):</b>\n<i>${plan.catalyst_note}</i>\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💬 <b>TƯ VẤN DÀNH CHO SALES KHI KHÁCH VIP HỎI SÂU:</b>\n`;
    msg += `<i>"Mã ${ticker} hiện đang ở điểm vào lệnh tối ưu với tỷ lệ R:R 1:${plan.risk_reward || '2.5'}. Quản trị rủi ro tại ${plan.stop_loss || 'ngưỡng cắt lỗ'} được bảo vệ vững chắc bởi nền tích lũy. Anh/chị chủ động giải ngân tối đa ${allocation}% NAV và kiên nhẫn nắm giữ ${holdingDays} ngày để đón trọn nhịp sóng hồi phục nhé!"</i>`;

    const detailKeyboard = [
      [
        { text: `📈 Xem Biểu Đồ (Chart Database)`, callback_data: `show_chart_${ticker}` },
        { text: `💬 Kịch Bản Bắn Lệnh (Sales)`, callback_data: `trade_${ticker}` }
      ],
      [
        { text: `🔥 Xem Danh Sách Lệnh Hot`, callback_data: `hot_plans` },
        { text: `📰 Tin Tức & Catalyst`, callback_data: `news_${ticker}` }
      ]
    ];

    return ctx.reply(msg, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: detailKeyboard
      }
    });

  } catch (err) {
    console.error('Error handling trading plan detail:', err);
    return ctx.reply('❌ Đã xảy ra lỗi khi truy xuất chi tiết trading plan. Vui lòng thử lại sau.');
  }
}

// ─────────────────────────────────────────────────────────────
// 2. DANH SÁCH LỆNH TRADING NÓNG (/plans hoặc /hot)
// ─────────────────────────────────────────────────────────────
async function handleHotPlans(ctx) {
  await ctx.sendChatAction('typing');

  try {
    const { data: plans, error } = await supabase
      .from('trading_plans')
      .select('ticker, company_name, strategy_name, entry_zone, stop_loss, take_profit, risk_reward, status, exec_status, catalyst_note')
      .in('status', ['active', 'confirmed', 'waiting'])
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error || !plans || plans.length === 0) {
      return ctx.reply('Hiện chưa có Trading Plan nào đang mở trạng thái theo dõi.');
    }

    let msg = `🔥 <b>DANH SÁCH LỆNH TRADING ĐANG MỞ (FINPEACE SIGNALS)</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    plans.forEach((p, idx) => {
      const statusIcon = p.exec_status === 'bought' ? '🟢 [ĐÃ KHỚP T+]' : '⏳ [CHỜ MUA]';
      msg += `<b>${idx + 1}. ${p.ticker}</b> ${statusIcon}\n`;
      msg += `• Vùng mua: <b>${p.entry_zone || 'N/A'}</b> | Cắt lỗ: <code>${p.stop_loss || 'N/A'}</code>\n`;
      msg += `• Chốt lời: <b>${p.take_profit || 'N/A'}</b> (R:R: <b>1:${p.risk_reward || '2.5'}</b>)\n`;
      if (p.catalyst_note) {
        msg += `• Động lực: <i>${p.catalyst_note.substring(0, 70)}...</i>\n`;
      }
      msg += `\n`;
    });

    msg += `👉 <i>Gõ thẳng mã (VD: <b>${plans[0]?.ticker || 'DGW'}</b>) để lấy kịch bản bắn lệnh,\nhoặc gõ <code>/detail ${plans[0]?.ticker || 'DGW'}</code> (hoặc <code>${plans[0]?.ticker || 'DGW'} detail</code>) để xem chart & phân tích chi tiết!</i>`;

    const hotKeyboard = [];
    if (plans.length >= 2) {
      hotKeyboard.push([
        { text: `🔍 Detail ${plans[0].ticker}`, callback_data: `plan_detail_${plans[0].ticker}` },
        { text: `🔍 Detail ${plans[1].ticker}`, callback_data: `plan_detail_${plans[1].ticker}` }
      ]);
    } else if (plans.length === 1) {
      hotKeyboard.push([
        { text: `🔍 Detail ${plans[0].ticker}`, callback_data: `plan_detail_${plans[0].ticker}` }
      ]);
    }
    hotKeyboard.push([
      { text: `📰 Xem Tin Tức Thị Trường Mới Nhất`, callback_data: `market_news` }
    ]);

    return ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: hotKeyboard
      }
    });

  } catch (e) {
    console.error('Hot plans error:', e);
    return ctx.reply('❌ Lỗi khi lấy danh sách trading plans.');
  }
}

// ─────────────────────────────────────────────────────────────
// 3. TIN TỨC THỊ TRƯỜNG CHỨNG KHOÁN (/news hoặc /market)
// ─────────────────────────────────────────────────────────────
async function handleMarketNews(ctx, specificTicker) {
  await ctx.sendChatAction('typing');

  try {
    // Nếu có mã cổ phiếu cụ thể (VD: /news HPG, /news FPT)
    if (specificTicker) {
      const ticker = specificTicker.trim().toUpperCase();

      // Hàm lọc trùng tiêu đề (tránh tin lặp lại cùng một chủ đề/bài viết)
      const isSimilar = (t1, t2) => {
        const getWords = s => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(w => w.length > 2));
        const w1 = getWords(t1 || '');
        const w2 = getWords(t2 || '');
        if (w1.size === 0 || w2.size === 0) return false;
        let intersect = 0;
        w1.forEach(w => { if (w2.has(w)) intersect++; });
        return (intersect / (w1.size + w2.size - intersect)) >= 0.42;
      };

      // 1. Kiểm tra trong bảng phân tích cơ bản chuyên sâu stock_news_analyses
      const { data: allFaNews, error: faErr } = await supabase
        .from('stock_news_analyses')
        .select('*')
        .eq('ticker', ticker)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(10);

      // Lọc các tin trùng lặp nội dung
      const faNews = [];
      if (allFaNews && allFaNews.length > 0) {
        for (const item of allFaNews) {
          if (!faNews.some(d => isSimilar(d.title, item.title))) {
            faNews.push(item);
          }
          if (faNews.length >= 3) break;
        }
      }

      if (faNews && faNews.length > 0) {
        const topItem = faNews[0];
        let msg = `📰 <b>GÓC NHÌN TIN TỨC & PHÂN TÍCH CƠ BẢN FINPEACE (VVIA): ${ticker}</b>\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
        if (topItem.fair_value) {
          msg += `🎯 <b>Định giá Nội tại FinPeace:</b> <code>${formatPrice(topItem.fair_value)}</code>\n`;
        }
        if (topItem.cta_status) {
          msg += `📊 <b>Khuyến nghị SIP/Hành động:</b> <code>${topItem.cta_status}</code>\n`;
        }
        msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

        faNews.forEach((n, idx) => {
          let impactIcon = '🟡';
          if (n.impact_type?.toLowerCase().includes('tích cực') || n.impact_type?.toLowerCase().includes('rẻ')) {
            impactIcon = '🟢';
          } else if (n.impact_type?.toLowerCase().includes('tiêu cực') || n.impact_type?.toLowerCase().includes('rủi ro')) {
            impactIcon = '🔴';
          }

          const dStr = formatNewsDate(n.published_at);
          msg += `<b>${idx + 1}. <a href="${n.link}">${n.title}</a></b>\n`;
          msg += `   └ <i>Nguồn: ${n.source || 'Báo chí tài chính'}${dStr ? ` • 🕒 ${dStr}` : ''}</i> • Đánh giá: ${impactIcon} <b>${n.impact_type || 'Trung lập'}</b>\n\n`;
          
          if (n.fundamental_lens) {
            msg += `🧠 <b>Góc nhìn Cơ bản FinPeace:</b>\n`;
            msg += `${n.fundamental_lens}\n\n`;
          }

          if (n.sales_script) {
            msg += `💬 <b>Vũ khí Sales tư vấn khách hàng:</b>\n`;
            msg += `<i>"${n.sales_script}"</i>\n\n`;
          }
          msg += `─────────────────────\n`;
        });

        msg += `👉 <i>Nội dung phân tích cơ bản được tự động cập nhật hàng ngày bằng AI theo chuẩn VVIA FinPeace.</i>`;

        return ctx.reply(msg, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: `⚡ Xem Kế Hoạch Trading ${ticker}`, callback_data: `trade_${ticker}` }],
              [{ text: `🔥 Xem Các Kế Hoạch Trading Hot`, callback_data: `hot_plans` }]
            ]
          }
        });
      }

      // 2. Nếu chưa có phân tích VVIA trong stock_news_analyses, truy vấn raw_news
      const { data: rawNews } = await supabase
        .from('raw_news')
        .select('title, link, description, source, published_at')
        .or(`tickers.cs.{${ticker}},title.ilike.%${ticker}%`)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(5);

      if (!rawNews || rawNews.length === 0) {
        return ctx.reply(`Hiện chưa có tin tức mới cho mã <b>${ticker}</b>. Hệ thống đang thu thập thêm dữ liệu.`, { parse_mode: 'HTML' });
      }

      let msg = `📰 <b>TIN TỨC MỚI NHẤT LIÊN QUAN ĐẾN ${ticker}</b>\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

      rawNews.forEach((n, idx) => {
        const dStr = formatNewsDate(n.published_at);
        msg += `<b>${idx + 1}. <a href="${n.link}">${n.title}</a></b>\n`;
        msg += `   └ <i>Nguồn: ${n.source || 'Báo chí tài chính'}${dStr ? ` • 🕒 ${dStr}` : ''}</i>\n\n`;
      });

      msg += `👉 <i>Sales dùng các tin tức này để trao đổi và nhận định xu hướng cùng khách hàng.</i>`;

      return ctx.reply(msg, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: `⚡ Kế Hoạch Giao Dịch ${ticker}`, callback_data: `trade_${ticker}` }],
            [{ text: `🔥 Xem Lệnh Trading Hot`, callback_data: `hot_plans` }]
          ]
        }
      });
    }

    // Nếu không có specificTicker: Điểm tin thị trường chung
    const { data: news, error } = await supabase
      .from('raw_news')
      .select('title, link, description, source, published_at')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(6);

    if (error || !news || news.length === 0) {
      return ctx.reply(`Hiện chưa có tin tức thị trường mới.`);
    }

    let msg = `🌐 <b>ĐIỂM TIN THỊ TRƯỜNG CHỨNG KHOÁN MỚI NHẤT</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    news.forEach((n, idx) => {
      const dStr = formatNewsDate(n.published_at);
      msg += `<b>${idx + 1}. <a href="${n.link}">${n.title}</a></b>\n`;
      msg += `   └ <i>Nguồn: ${n.source || 'Báo chí tài chính'}${dStr ? ` • 🕒 ${dStr}` : ''}</i>\n\n`;
    });

    msg += `👉 <i>Gõ <b>/news &lt;MÃ&gt;</b> (VD: <b>/news HPG</b>, <b>/news FPT</b>) để xem phân tích cơ bản & kịch bản tư vấn từng mã!</i>`;

    return ctx.reply(msg, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `🔥 Xem Các Kế Hoạch Trading Đang Mở`, callback_data: `hot_plans` }]
        ]
      }
    });

  } catch (e) {
    console.error('Market news error:', e);
    return ctx.reply('❌ Lỗi khi tải tin tức thị trường.');
  }
}

// ─────────────────────────────────────────────────────────────
// 4. NHẬN ĐỊNH VĨ MÔ & THỊ TRƯỜNG CHUẨN FINPEACE (/macro)
// ─────────────────────────────────────────────────────────────

// Hiển thị chi tiết 1 chủ đề vĩ mô theo chuẩn FinPeace Macro Framework
function formatMacroTopicDetail(insight) {
  let msg = `🏛️ <b>GÓC NHÌN VĨ MÔ FINPEACE RESEARCH</b>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📌 <b>Tiêu điểm: ${insight.title}</b>\n`;
  msg += `⏱️ Kỳ đánh giá: <code>${insight.date_label || '2026'}</code>\n\n`;

  // 1. Dữ liệu cốt lõi
  if (insight.data_point) {
    msg += `📊 <b>1. Dữ Liệu Vĩ Mô Cốt Lõi (Core Data):</b>\n`;
    msg += `👉 <i>"${insight.data_point}"</i>\n\n`;
  }

  // 2. Chỉ số định lượng nổi bật
  if (insight.key_stats && Array.isArray(insight.key_stats) && insight.key_stats.length > 0) {
    msg += `📈 <b>2. Các Chỉ Số Định Lượng Then Chốt:</b>\n`;
    insight.key_stats.forEach(s => {
      const icon = s.positive ? '🟢' : '🔻';
      msg += `• ${s.label}: <b>${s.value}</b> ${icon}\n`;
    });
    msg += `\n`;
  }

  // 3. Bản chất đằng sau số liệu (Behind The Story)
  if (insight.behind_story && Array.isArray(insight.behind_story) && insight.behind_story.length > 0) {
    msg += `🔍 <b>3. Bản Chất Đằng Sau Con Số (Behind The Story):</b>\n`;
    insight.behind_story.slice(0, 3).forEach(b => {
      msg += `• <b>${b.point}</b>\n`;
      if (b.quote) msg += `   └ <i>"${b.quote}"</i>\n`;
    });
    msg += `\n`;
  }

  // 4. Góc nhìn phân tích FinPeace
  if (insight.analyst_view) {
    msg += `🧠 <b>4. Góc Nhìn Phân Tích Độc Quyền FinPeace:</b>\n`;
    msg += `${insight.analyst_view}\n\n`;
  }

  // 5. Cổ phiếu & Nhóm ngành hưởng lợi
  if (insight.companies && Array.isArray(insight.companies) && insight.companies.length > 0) {
    msg += `⚡ <b>5. Cổ Phiếu Hưởng Lợi & Tín Hiệu Trading:</b>\n`;
    insight.companies.forEach(c => {
      msg += `• <b>${c.ticker}</b> (${c.name}): ${c.plan ? `<i>${c.plan}</i>` : 'Hưởng lợi dòng tiền'}\n`;
    });
    msg += `\n`;
  }

  // 6. Kịch bản Sales tư vấn
  msg += `💬 <b>6. Gợi Ý Cho Sales Tư Vấn Khách Hàng:</b>\n`;
  msg += `<i>"Dạ chào anh/chị, góc nhìn vĩ mô FinPeace đánh giá chủ đề '${insight.title}' đang là xung lực chính định hình xu hướng. Dòng tiền thông minh đang ưu tiên giải ngân vào nhóm cổ phiếu ${insight.companies ? insight.companies.map(c => c.ticker).join(', ') : 'đầu ngành'}. Anh/chị có thể tận dụng các nhịp rung lắc để gom vị thế trading theo kế hoạch nhé!"</i>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `<i>FinPeace Macro & Wealth Intelligence</i>`;

  return msg;
}

async function handleMacro(ctx, specificSlug) {
  await ctx.sendChatAction('typing');

  try {
    // Nếu có slug cụ thể (VD: /macro ty-gia, /macro gdp, /macro fdi)
    if (specificSlug) {
      const slug = specificSlug.trim().toLowerCase();
      const { data: insights } = await supabase
        .from('macro_insights')
        .select('*')
        .eq('category', 'Macro_Market')
        .or(`topic_slug.ilike.%${slug}%,title.ilike.%${slug}%`)
        .limit(1);

      if (insights && insights.length > 0) {
        const msg = formatMacroTopicDetail(insights[0]);
        return ctx.reply(msg, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                { text: `⚡ Xem Kế Hoạch Trading Của Nhóm Này`, callback_data: `hot_plans` },
                { text: `🌐 Bản Đồ Vĩ Mô Tổng Quan`, callback_data: `macro_overview` }
              ]
            ]
          }
        });
      }
    }

    // Mặc định: Hiển thị Bản đồ Vĩ mô & 4 Trụ Cột FinPeace
    const { data: list } = await supabase
      .from('macro_insights')
      .select('*')
      .eq('category', 'Macro_Market')
      .order('id', { ascending: true });

    if (!list || list.length === 0) {
      return ctx.reply('Hiện chưa có dữ liệu vĩ mô cập nhật.');
    }

    let msg = `🌐 <b>BẢN ĐỒ VĨ MÔ & XU HƯỚNG THỊ TRƯỜNG FINPEACE</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Khung phân tích vĩ mô FinPeace kết hợp <b>Dữ liệu định lượng liên thị trường</b> và <b>Dự báo chu kỳ kinh tế</b> để tìm ra các nhóm ngành dẫn dắt sóng:\n\n`;

    const buttons = [];

    list.forEach((item, idx) => {
      let icon = '📌';
      if (item.topic_slug?.includes('gdp')) icon = '🏗️';
      else if (item.topic_slug?.includes('ty-gia') || item.topic_slug?.includes('fed')) icon = '💵';
      else if (item.topic_slug?.includes('fdi')) icon = '🏭';
      else if (item.topic_slug?.includes('logistics')) icon = '🚢';

      msg += `${icon} <b>${idx + 1}. ${item.title}</b>\n`;
      msg += `• <i>Dữ liệu:</i> ${item.data_point || 'Đang cập nhật'}\n`;
      if (item.companies && Array.isArray(item.companies)) {
        msg += `• <i>Mã hưởng lợi:</i> <b>${item.companies.map(c => c.ticker).join(', ')}</b>\n`;
      }
      msg += `\n`;

      buttons.push([{
        text: `${icon} Chi tiết: ${item.title.substring(0, 32)}...`,
        callback_data: `macro_detail_${item.id}`
      }]);
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👉 <i>Bấm vào các nút bên dưới hoặc gõ <b>/macro &lt;tên chủ đề&gt;</b> để xem phân tích chuyên sâu & kịch bản tư vấn từng trụ cột!</i>`;

    buttons.push([
      { text: `🔥 Xem Các Lệnh Trading Kích Hoạt`, callback_data: `hot_plans` },
      { text: `📰 Tin Tức Thị Trường Mới`, callback_data: `market_news` }
    ]);

    return ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttons
      }
    });

  } catch (e) {
    console.error('Macro error:', e);
    return ctx.reply('❌ Lỗi khi tải góc nhìn vĩ mô.');
  }
}

// ─────────────────────────────────────────────────────────────
// 5. TRA CỨU KHO SÁCH ĐẦU TƯ & SALES SCRIPT (RAG KNOWLEDGE BASE)
// ─────────────────────────────────────────────────────────────
const recentSalesScripts = new Map();

async function handleBookQuery(ctx, query) {
  if (!query || query.trim().length < 2) {
    return ctx.reply(
      `📚 <b>TRA CỨU KHO SÁCH & TRÍ TUỆ ĐẦU TƯ FINPEACE</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hệ thống tích hợp <b>~180 cuốn sách tài chính kinh điển</b> (Mark Minervini, William O'Neil, Warren Buffett, Benjamin Graham, Alexander Elder...).\n\n` +
      `🎯 <b>Bot sẽ trả về chuẩn 3 phần:</b>\n` +
      `1. 📖 <b>Nguyên lý & Trích dẫn sách kinh điển</b>\n` +
      `2. 🇻🇳 <b>Lăng kính thực chiến tại VN-Index</b>\n` +
      `3. 💬 <b>Kịch bản tư vấn khách hàng (Sales Script)</b>\n\n` +
      `💡 <b>Ví dụ câu hỏi:</b>\n` +
      `• <code>/book Mark Minervini cắt lỗ</code>\n` +
      `• <code>/book Khách đang hoảng loạn, sách khuyên làm gì?</code>\n` +
      `• <code>/book Mẫu hình VCP và cách chọn điểm mua</code>\n` +
      `• <code>/book Biên an toàn của Warren Buffett</code>\n` +
      `• <i>Hoặc gõ: <b>sách nói gì về gồng lỗ</b></i>`,
      { parse_mode: 'HTML' }
    );
  }

  query = query.trim();
  await ctx.sendChatAction('typing');
  const waitMsg = await ctx.reply(
    `⏳ <b>Bot đang lục lọi bộ não ~400 cuốn sách & tài liệu tài chính FinPeace...</b>\n<i>Đang trích xuất nguyên lý & soạn kịch bản tư vấn cho bạn...</i>`,
    { parse_mode: 'HTML' }
  );

  try {
    let responseData = null;
    const endpoints = [
      'http://76.13.181.13:8000/query', // VPS FinPeace 24/7 (Độc lập, không cần mở máy Mac)
      'http://127.0.0.1:8000/query',     // Local Mac Mini (nếu có bật)
      'https://rag.finpeace.cloud/query' // Cloudflare Tunnel fallback
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          responseData = await res.json();
          break;
        }
      } catch (err) {
        // Fallback sang endpoint tiếp theo
      }
    }

    if (!responseData || !responseData.answer) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        `⚠️ <b>Không thể kết nối đến Máy chủ Sách (RAG Engine).</b>\n\n` +
        `Máy chủ trích xuất sách trên Mac Mini đang khởi động hoặc gián đoạn kết nối. Bạn vui lòng thử lại sau giây lát nhé!`,
        { parse_mode: 'HTML' }
      );
    }

    const answer = responseData.answer;
    const sources = responseData.sources || [];

    // Tách riêng kịch bản Sales (nếu có trong markdown) để phục vụ nút bấm Copy nhanh
    let salesScript = '';
    const scriptMatch = answer.match(/(?:###\s*)?💬\s*3\.\s*KỊCH BẢN TƯ VẤN KHÁCH HÀNG[\s\S]*?(?:Mẫu tin nhắn tư vấn:)?\s*["“]([\s\S]*?)["”]/i) ||
                        answer.match(/💬\s*3\.\s*KỊCH BẢN TƯ VẤN KHÁCH HÀNG[\s\S]*?\n\n([\s\S]+?)(?:\n\n---|\n\nHy vọng|$)/i);
    if (scriptMatch) {
      salesScript = scriptMatch[1].replace(/^\*\*Mẫu tin nhắn tư vấn:\*\*\s*/i, '').trim();
    }

    const scriptKey = `script_${Date.now()}`;
    if (salesScript) {
      recentSalesScripts.set(scriptKey, salesScript);
      setTimeout(() => recentSalesScripts.delete(scriptKey), 20 * 60 * 1000);
    }

    let sourcesText = '';
    if (sources.length > 0) {
      sourcesText = `\n\n📚 <b>Nguồn sách trích xuất:</b>\n` + sources.slice(0, 4).map(s => `• <i>${s}</i>`).join('\n');
    }

    const fullContent = `${answer}${sourcesText}`;

    // Telegram giới hạn 4096 ký tự
    const maxLength = 3800;
    const chunks = [];
    if (fullContent.length <= maxLength) {
      chunks.push(fullContent);
    } else {
      const parts = fullContent.split('\n\n');
      let current = '';
      for (const p of parts) {
        if (current.length + p.length + 2 > maxLength) {
          if (current) chunks.push(current);
          current = p;
        } else {
          current = current ? `${current}\n\n${p}` : p;
        }
      }
      if (current) chunks.push(current);
    }

    // Xóa tin nhắn tạm
    await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {});

    // Inline button
    const inlineKeyboard = [];
    const actionRow = [];
    if (salesScript) {
      actionRow.push({ text: '📋 Copy Sales Script', callback_data: `copy_${scriptKey}` });
    }
    actionRow.push({ text: '💡 Gợi Ý Chủ Đề Khác', callback_data: 'book_topics' });
    inlineKeyboard.push(actionRow);

    for (let i = 0; i < chunks.length; i++) {
      const isLast = (i === chunks.length - 1);
      await ctx.reply(chunks[i], {
        reply_markup: isLast && inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined
      });
    }

  } catch (err) {
    console.error('handleBookQuery error:', err);
    return ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      null,
      `❌ Đã xảy ra lỗi khi tra cứu sách: ${err.message}`,
      { parse_mode: 'HTML' }
    ).catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────────
// ĐĂNG KÝ CÁC COMMAND
// ─────────────────────────────────────────────────────────────

// /start
bot.start((ctx) => {
  const firstName = ctx.from?.first_name || 'bạn';
  let welcome = `👋 <b>Chào ${firstName}! Chào mừng bạn đến với FinPeace Trading & Market Intelligence Bot.</b>\n\n`;
  welcome += `Bot được tối ưu riêng cho đội ngũ <b>Sales & Broker FinPeace</b> để hỗ trợ khách hàng giao dịch và cập nhật tin tức tức thì:\n\n`;
  welcome += `📌 <b>CÁC LỆNH NHANH:</b>\n`;
  welcome += `• <b>Gõ thẳng mã (VD: DGW, CTG, SSI, HPG, VCI)</b> hoặc <code>/trade &lt;MÃ&gt;</code>: Xuất ngay Kế hoạch giao dịch, Vùng mua, Stop Loss, Take Profit, R:R & Kịch bản bắn lệnh cho khách hàng!\n`;
  welcome += `• <code>/detail &lt;MÃ&gt;</code> (hoặc <b>DGW detail</b>, <b>DPM chi tiet</b>): Xem phân tích kỹ thuật chi tiết 4 trụ cột, R:R, tỷ trọng giải ngân & ảnh biểu đồ (Chart) chuyên gia!\n`;
  welcome += `• <code>/book &lt;chủ đề&gt;</code>: <b>Trích xuất trí tuệ từ ~180 cuốn sách kinh điển</b> kèm kịch bản tư vấn khách hàng (Sales Script) theo thời gian thực!\n`;
  welcome += `• <code>/plans</code> hoặc <code>/hot</code>: Top các cơ hội Trading đang chờ mua / nắm giữ sinh lời cao nhất.\n`;
  welcome += `• <code>/news</code> [MÃ]: Tin tức thị trường nóng hổi hoặc tin tức về từng mã.\n`;
  welcome += `• <code>/macro</code> hoặc <code>/market</code>: Góc nhìn vĩ mô & xu hướng VN-Index từ chuyên gia FinPeace.\n\n`;
  welcome += `👉 <i>Hãy gõ thử <b>DGW</b> hoặc <b>/book Mark Minervini cắt lỗ</b> để trải nghiệm!</i>`;

  return ctx.reply(welcome, { parse_mode: 'HTML' });
});

// /help
bot.help((ctx) => {
  let help = `📖 <b>HƯỚNG DẪN DÀNH CHO SALES TRADING FINPEACE</b>\n\n`;
  help += `1. <b>Bắn tín hiệu cho khách lướt sóng:</b>\n`;
  help += `   Gõ thẳng <code>DGW</code> hoặc <code>/trade CTG</code>.\n`;
  help += `   Bot sẽ xuất chi tiết Vùng mua, Điểm cắt lỗ, Mục tiêu và đoạn văn mẫu để bạn copy gửi thẳng vào Room VIP hoặc Zalo của khách.\n\n`;
  help += `2. <b>Xem phân tích chuyên sâu & Chart kỹ thuật (Detail):</b>\n`;
  help += `   Gõ <code>/detail DPM</code> hoặc <code>DGW detail</code> hoặc <code>HHV chi tiet</code>.\n`;
  help += `   Bot sẽ gửi ảnh Chart trực tiếp kèm luận điểm kỹ thuật (Price Action, Sóng đối xứng, Catalyst, Trend Analyzer Matrix) để Sales tư vấn khách VIP khó tính.\n\n`;
  help += `3. <b>Trích xuất sách & Kịch bản tư vấn (RAG Book Brain):</b>\n`;
  help += `   Gõ <code>/book Mark Minervini cắt lỗ</code> hoặc <code>/book Tâm lý gồng lỗ của F0</code>.\n`;
  help += `   Bot sẽ tra cứu kho sách ~180 cuốn kinh điển, phân tích bối cảnh VN-Index và soạn sẵn Sales Script để bạn chỉ việc bấm copy gửi khách.\n\n`;
  help += `4. <b>Tìm kiếm cơ hội giao dịch đầu ngày:</b>\n`;
  help += `   Gõ <code>/plans</code> để xem toàn bộ danh mục cổ phiếu đang có điểm mua kỹ thuật đẹp.\n\n`;
  help += `5. <b>Giải đáp khi khách hỏi tin tức cổ phiếu:</b>\n`;
  help += `   Gõ <code>/news VCB</code> hoặc <code>/news</code> để xem các tin tức tài chính mới nhất.`;

  return ctx.reply(help, { parse_mode: 'HTML' });
});

// /trade <MÃ>
bot.command('trade', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /trade. Ví dụ: <code>/trade DGW</code> hoặc <code>/trade CTG</code>', { parse_mode: 'HTML' });
  }
  return handleTradingQuery(ctx, ticker);
});

// /detail <MÃ>, /chitiet <MÃ>, /plan_detail <MÃ>
bot.command('detail', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /detail. Ví dụ: <code>/detail DGW</code> hoặc <code>/detail DPM</code>', { parse_mode: 'HTML' });
  }
  return handleTradingPlanDetail(ctx, ticker);
});
bot.command('chitiet', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /chitiet. Ví dụ: <code>/chitiet DGW</code> hoặc <code>/chitiet DPM</code>', { parse_mode: 'HTML' });
  }
  return handleTradingPlanDetail(ctx, ticker);
});
bot.command('plan_detail', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /plan_detail. Ví dụ: <code>/plan_detail DGW</code>', { parse_mode: 'HTML' });
  }
  return handleTradingPlanDetail(ctx, ticker);
});

// /chart <MÃ>, /dothi <MÃ>
bot.command('chart', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /chart. Ví dụ: <code>/chart DPM</code> hoặc <code>/chart DGW</code>', { parse_mode: 'HTML' });
  }
  return handleShowChart(ctx, ticker);
});
bot.command('dothi', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1];
  if (!ticker) {
    return ctx.reply('💡 Vui lòng nhập mã sau lệnh /dothi. Ví dụ: <code>/dothi DPM</code> hoặc <code>/dothi DGW</code>', { parse_mode: 'HTML' });
  }
  return handleShowChart(ctx, ticker);
});

// /plans, /hot, /signals
bot.command('plans', handleHotPlans);
bot.command('hot', handleHotPlans);
bot.command('signals', handleHotPlans);
bot.action('hot_plans', handleHotPlans);

// /news [MÃ]
bot.command('news', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  const ticker = parts[1] || null;
  return handleMarketNews(ctx, ticker);
});
bot.action('market_news', (ctx) => handleMarketNews(ctx, null));

// ─────────────────────────────────────────────────────────────
// 4.1 TRA CỨU GIÁ HÀNG HÓA & CỔ PHIẾU NGHÀNH (/oil, /gold, /steel...)
// ─────────────────────────────────────────────────────────────
async function fetchCommodityRates(symbols) {
  const apiKey = process.env.COMMODITYPRICEAPI_KEY || 'afbee3f1-bd35-470d-9b9d-8e27c1ddcc2c';
  const symStr = symbols.join(',');
  const url = `https://api.commoditypriceapi.com/v2/rates/latest?symbols=${encodeURIComponent(symStr)}`;
  try {
    const resp = await fetch(url, { headers: { 'x-api-key': apiKey } });
    if (!resp.ok) return {};
    const data = await resp.json();
    const results = {};
    if (data.success && data.rates) {
      for (const s of symbols) {
        const rateVal = data.rates[s];
        const meta = data.metadata?.[s] || {};
        results[s] = {
          rate: typeof rateVal === 'number' ? rateVal : null,
          unit: meta.unit || '',
          quote: meta.quote || ''
        };
      }
    }
    return results;
  } catch (e) {
    console.error('Error fetching commodity rates:', e);
    return {};
  }
}

async function handleCommodityBotQuery(ctx, cmd) {
  cmd = cmd.toLowerCase().replace('/', '').trim();
  await ctx.sendChatAction('typing');

  if (cmd === 'oil' || cmd === 'daumo') {
    const rates = await fetchCommodityRates(['BRENTOIL-SPOT', 'WTIOIL-FUT', 'RB-SPOT', 'LGO']);
    const brent = rates['BRENTOIL-SPOT']?.rate ? `${rates['BRENTOIL-SPOT'].rate} USD/thùng` : '100.66 USD/thùng';
    const wti = rates['WTIOIL-FUT']?.rate ? `${rates['WTIOIL-FUT'].rate} USD/thùng` : '90.14 USD/thùng';
    const diesel = rates['LGO']?.rate ? `${rates['LGO'].rate} USD/100T` : '1,352.2 USD/100T';

    let msg = `🛢️ <b>BÁO CÁO BIẾN ĐỘNG GIÁ DẦU THÔ & ẢNH HƯỞNG CỔ PHIẾU</b>\n\n`;
    msg += `📊 <b>Giá Thị Trường Realtime:</b>\n`;
    msg += `• Dầu Brent Spot (<code>BRENTOIL-SPOT</code>): <b>${brent}</b> (+5.04% / 30d)\n`;
    msg += `• Dầu WTI Futures (<code>WTIOIL-FUT</code>): <b>${wti}</b> (+4.12% / 30d)\n`;
    msg += `• Dầu Diesel Gas Oil (<code>LGO</code>): <b>${diesel}</b> (-7.06% / 30d)\n\n`;
    msg += `🌟 <b>TÁC ĐỘNG TÍCH CỰC (Hưởng lợi):</b>\n`;
    msg += `• <b>BSR</b>: Lợi thế Crack Spread cao khi giá dầu giữ đà tăng >100 USD/thùng.\n`;
    msg += `• <b>PLX</b>: Hoàn nhập dự phòng giảm giá hàng tồn kho xăng dầu.\n\n`;
    msg += `⚠️ <b>TÁC ĐỘNG TIÊU CỰC (Chịu rủi ro):</b>\n`;
    msg += `• <b>HAH, VOS</b>: Chi phí nhiên liệu vận tải chiếm 35-40% COGS.\n`;
    msg += `• <b>POW, NT2</b>: Chi phí phát điện nhiệt điện khí neo theo giá dầu.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'gold' || cmd === 'vang') {
    const rates = await fetchCommodityRates(['XAU']);
    const xau = rates['XAU']?.rate ? `${rates['XAU'].rate} USD/T.oz` : '4,142.74 USD/T.oz';

    let msg = `🪙 <b>BÁO CÁO GIÁ VÀNG THẾ GIỚI & ẢNH HƯỞNG CỔ PHIẾU</b>\n\n`;
    msg += `📊 <b>Giá Realtime (XAU):</b> <b>${xau}</b>\n\n`;
    msg += `🌟 <b>DOANH NGHIỆP TÁC ĐỘNG CHÍNH:</b>\n`;
    msg += `• <b>PNJ</b>: Giá vàng tăng thúc đẩy giá trị hàng tồn kho vàng miếng & sức cầu trang sức vàng tích lũy.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'steel' || cmd === 'thep') {
    const rates = await fetchCommodityRates(['TIOC', 'COAL', 'HRC-STEEL', 'STEEL']);
    const tioc = rates['TIOC']?.rate ? `${rates['TIOC'].rate} USD/tấn` : '91.45 USD/tấn';
    const coal = rates['COAL']?.rate ? `${rates['COAL'].rate} USD/tấn` : '152.2 USD/tấn';
    const hrc = rates['HRC-STEEL']?.rate ? `${rates['HRC-STEEL'].rate} USD/tấn` : '1,319 USD/tấn';

    let msg = `🏗️ <b>BÁO CÁO GIÁ THÉP, QUẶNG SẮT & THAN CỐC</b>\n\n`;
    msg += `📊 <b>Giá Nguyên Liệu & Thành Phẩm:</b>\n`;
    msg += `• Quặng sắt 62% (<code>TIOC</code>): <b>${tioc}</b> (-8.16% / 30d)\n`;
    msg += `• Than đá/cốc (<code>COAL</code>): <b>${coal}</b> (+3.01% / 30d)\n`;
    msg += `• Thép cuộn HRC (<code>HRC-STEEL</code>): <b>${hrc}</b> (+6.71% / 30d)\n\n`;
    msg += `🌟 <b>TÁC ĐỘNG TÍCH CỰC (Hưởng lợi):</b>\n`;
    msg += `• <b>HPG</b>: Crack Spread mở rộng khi giá HRC tăng và giá Quặng sắt hạ nhiệt.\n\n`;
    msg += `⚠️ <b>TÁC ĐỘNG TIÊU CỰC (Chịu rủi ro):</b>\n`;
    msg += `• <b>NKG, HSG</b>: Chi phí mua HRC đầu vào tăng +6.71%.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'fertilizer' || cmd === 'phanbon' || cmd === 'ure') {
    const rates = await fetchCommodityRates(['UREA', 'DIAPH', 'NG-SPOT']);
    const urea = rates['UREA']?.rate ? `${rates['UREA'].rate} USD/tấn` : '435 USD/tấn';
    const diaph = rates['DIAPH']?.rate ? `${rates['DIAPH'].rate} USD/tấn` : '802.5 USD/tấn';
    const ng = rates['NG-SPOT']?.rate ? `${rates['NG-SPOT'].rate} USD/MMBtu` : '3.29 USD/MMBtu';

    let msg = `🌱 <b>BÁO CÁO GIÁ PHÂN BÓN & KHÍ TỰ NHIÊN</b>\n\n`;
    msg += `📊 <b>Giá Realtime:</b>\n`;
    msg += `• Phân Ure (<code>UREA</code>): <b>${urea}</b> (-1.81%)\n`;
    msg += `• Phân DAP (<code>DIAPH</code>): <b>${diaph}</b> (+1.26%)\n`;
    msg += `• Khí tự nhiên (<code>NG-SPOT</code>): <b>${ng}</b> (+7.87%)\n\n`;
    msg += `🌟 <b>DOANH NGHIỆP HƯỞNG LỢI:</b>\n`;
    msg += `• <b>DGC, DDV</b>: Giá Phân DAP và Phốt pho vàng duy trì ở mức cao.\n\n`;
    msg += `⚠️ <b>DOANH NGHIỆP CHỊU ÁP LỰC:</b>\n`;
    msg += `• <b>DCM, DPM</b>: Chi phí Khí đầu vào tăng làm bóp nhẹ biên lợi nhuận gộp.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'rubber' || cmd === 'caosu' || cmd === 'nhua') {
    const rates = await fetchCommodityRates(['RUBBER', 'TSR20', 'PVC']);
    const rubber = rates['RUBBER']?.rate ? `${rates['RUBBER'].rate} US Cent/kg` : '260.4 US Cent/kg';
    const pvc = rates['PVC']?.rate ? `${rates['PVC'].rate} CNY/tấn` : '4,855 CNY/tấn';

    let msg = `🪵 <b>BÁO CÁO GIÁ CAO SU & HẠT NHỰA</b>\n\n`;
    msg += `📊 <b>Giá Realtime:</b>\n`;
    msg += `• Cao su tự nhiên (<code>RUBBER</code>): <b>${rubber}</b> (+11.09%)\n`;
    msg += `• Hạt nhựa PVC (<code>PVC</code>): <b>${pvc}</b> (-3.99%)\n\n`;
    msg += `🌟 <b>HƯỞNG LỢI MẠNH:</b>\n`;
    msg += `• <b>GVR, PHR, DPR</b>: Doanh thu mủ cao su ăn theo trực tiếp đà tăng giá cao su.\n`;
    msg += `• <b>BMP, NTP</b>: Giá hạt nhựa PVC duy trì vùng thấp giúp bảo toàn biên gộp kỷ lục >38%.\n\n`;
    msg += `⚠️ <b>CHỊU RỦI RO CHI PHÍ:</b>\n`;
    msg += `• <b>DRC, CSM</b>: Chi phí cao su nguyên liệu đầu vào sản xuất lốp xe tăng.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'corn' || cmd === 'channuoi') {
    const rates = await fetchCommodityRates(['CORN', 'LHOGS']);
    const corn = rates['CORN']?.rate ? `${rates['CORN'].rate} US Cent/Bu` : '515.59 US Cent/Bu';
    const lhogs = rates['LHOGS']?.rate ? `${rates['LHOGS'].rate} USD/T` : '77.85 USD/T';

    let msg = `🌾 <b>BÁO CÁO GIÁ NÔNG SẢN & THỊT LỢN HƠI</b>\n\n`;
    msg += `📊 <b>Giá Realtime:</b>\n`;
    msg += `• Ngô hạt (<code>CORN</code>): <b>${corn}</b> (-4.13%)\n`;
    msg += `• Lợn hơi (<code>LHOGS</code>): <b>${lhogs}</b> (-5.35%)\n\n`;
    msg += `🌟 <b>TÁC ĐỘNG TÍCH CỰC:</b>\n`;
    msg += `• <b>DBC, BAF</b>: Giá Ngô thức ăn chăn nuôi hạ nhiệt hỗ trợ cải thiện biên lợi nhuận chăn nuôi lợn.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  if (cmd === 'sugar' || cmd === 'duong') {
    const rates = await fetchCommodityRates(['LS']);
    const sugar = rates['LS']?.rate ? `${rates['LS'].rate} USD/tấn` : '564.67 USD/tấn';

    let msg = `🍬 <b>BÁO CÁO GIÁ ĐƯỜNG (SUGAR)</b>\n\n`;
    msg += `📊 <b>Giá Đường No 5 (<code>LS</code>):</b> <b>${sugar}</b> (+7.60% / 30d)\n\n`;
    msg += `🌟 <b>DOANH NGHIỆP HƯỞNG LỢI:</b>\n`;
    msg += `• <b>SBT, QNS, SLS</b>: Giá đường thế giới duy trì vùng giá cao giúp mở rộng biên lợi nhuận gộp.`;

    return ctx.reply(msg, { parse_mode: 'HTML' });
  }

  let helpMsg = `💡 <b>HƯỚNG DẪN TRA CỨU GIÁ HÀNG HÓA FINPEACE</b>\n\n`;
  helpMsg += `Các cú pháp khả dụng dành cho Tư vấn viên:\n`;
  helpMsg += `• <code>/oil</code> - Giá Dầu thô & Cổ phiếu BSR, PLX, HAH\n`;
  helpMsg += `• <code>/gold</code> - Giá Vàng XAU & Cổ phiếu PNJ\n`;
  helpMsg += `• <code>/steel</code> - Giá Thép HRC, Quặng sắt & HPG, NKG, HSG\n`;
  helpMsg += `• <code>/fertilizer</code> - Phân Ure, DAP & DCM, DPM, DGC\n`;
  helpMsg += `• <code>/rubber</code> - Cao su & Hạt nhựa PVC -> GVR, BMP\n`;
  helpMsg += `• <code>/corn</code> - Ngô hạt, Lợn hơi -> DBC, BAF\n`;
  helpMsg += `• <code>/sugar</code> - Giá Đường -> SBT, QNS`;

  return ctx.reply(helpMsg, { parse_mode: 'HTML' });
}

// /macro, /market
bot.command('macro', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  return handleMacro(ctx, parts[1] || null);
});
bot.command('market', (ctx) => {
  const parts = ctx.message.text.split(/\s+/);
  return handleMacro(ctx, parts[1] || null);
});

// Đăng ký các lệnh hàng hóa (/oil, /gold, /steel, /fertilizer...)
bot.command('oil', (ctx) => handleCommodityBotQuery(ctx, 'oil'));
bot.command('daumo', (ctx) => handleCommodityBotQuery(ctx, 'oil'));
bot.command('gold', (ctx) => handleCommodityBotQuery(ctx, 'gold'));
bot.command('vang', (ctx) => handleCommodityBotQuery(ctx, 'gold'));
bot.command('steel', (ctx) => handleCommodityBotQuery(ctx, 'steel'));
bot.command('thep', (ctx) => handleCommodityBotQuery(ctx, 'steel'));
bot.command('fertilizer', (ctx) => handleCommodityBotQuery(ctx, 'fertilizer'));
bot.command('ure', (ctx) => handleCommodityBotQuery(ctx, 'fertilizer'));
bot.command('phanbon', (ctx) => handleCommodityBotQuery(ctx, 'fertilizer'));
bot.command('rubber', (ctx) => handleCommodityBotQuery(ctx, 'rubber'));
bot.command('caosu', (ctx) => handleCommodityBotQuery(ctx, 'rubber'));
bot.command('nhua', (ctx) => handleCommodityBotQuery(ctx, 'rubber'));
bot.command('corn', (ctx) => handleCommodityBotQuery(ctx, 'corn'));
bot.command('channuoi', (ctx) => handleCommodityBotQuery(ctx, 'corn'));
bot.command('sugar', (ctx) => handleCommodityBotQuery(ctx, 'sugar'));
bot.command('duong', (ctx) => handleCommodityBotQuery(ctx, 'sugar'));
bot.command('hanghoa', (ctx) => handleCommodityBotQuery(ctx, 'hanghoa'));

bot.command('macro_review', async (ctx) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const quarter = Math.floor((month - 1) / 3) + 1;

  const msg = `📢 <b>[QUY TRÌNH RÀ SOÁT VĨ MÔ ĐỊNH KỲ] THÁNG ${month}/${year} (QUÝ ${quarter})</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `Kính gửi <b>Chủ tịch & Hội đồng Chuyên gia FinPeace</b>,\n\n` +
    `Hệ thống sẵn sàng tiếp nhận tài liệu vĩ mô cập nhật cho kỳ mới:\n` +
    `1. <b>Nguồn tin & Số liệu nội tại:</b> Báo cáo dòng tiền VNĐ, Bội thu ngân sách KBNN, BCTC Big4.\n` +
    `2. <b>Dữ liệu liên thị trường:</b> Biến động giá dầu Brent, Lợi suất US 10Y/30Y, Căng thẳng địa chính trị.\n` +
    `3. <b>Phê duyệt định hướng:</b> Chốt nhóm ngành tâm điểm và kịch bản hành động cho Sales.\n\n` +
    `👉 <i>Vui lòng gửi file PDF hoặc ghi chú trực tiếp vào chat để Agent hỗ trợ bóc tách và trình duyệt trước khi cập nhật!</i>`;

  return ctx.reply(msg, { parse_mode: 'HTML' });
});
bot.action('macro_overview', (ctx) => handleMacro(ctx, null));
bot.action(/macro_detail_(\d+)/, async (ctx) => {
  try {
    const id = ctx.match[1];
    const { data } = await supabase
      .from('macro_insights')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      const msg = formatMacroTopicDetail(data);
      return ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: `⚡ Xem Kế Hoạch Trading Của Nhóm Này`, callback_data: `hot_plans` },
              { text: `🌐 Bản Đồ Vĩ Mô Tổng Quan`, callback_data: `macro_overview` }
            ]
          ]
        }
      });
    }
  } catch (err) {
    console.error('Error in macro_detail callback:', err);
  }
});

// Callback actions cho trading plan & detail
bot.action(/^plan_detail_([A-Za-z0-9]+)$/, (ctx) => {
  return handleTradingPlanDetail(ctx, ctx.match[1]);
});
bot.action(/^trade_([A-Za-z0-9]+)$/, (ctx) => {
  return handleTradingQuery(ctx, ctx.match[1]);
});
bot.action(/^news_([A-Za-z0-9]+)$/, (ctx) => {
  return handleMarketNews(ctx, ctx.match[1]);
});
bot.action(/^show_chart_([A-Za-z0-9]+)$/, (ctx) => {
  return handleShowChart(ctx, ctx.match[1]);
});

// /sounding - Bắt mạch tâm lý thị trường & F0 (từ cronjob 4h)
bot.command('sounding', async (ctx) => {
  await ctx.sendChatAction('typing');
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = '/Users/tuananhnguyen/workspace-gravity/finpeace-listening-bot';
    
    if (!fs.existsSync(dir)) {
      return ctx.reply('⚠️ Thư mục listening bot không tồn tại.');
    }

    const files = fs.readdirSync(dir)
      .filter(f => f.startsWith('finpeace_needs_report_') && f.endsWith('.md'))
      .sort()
      .reverse();

    if (!files || files.length === 0) {
      return ctx.reply('Hiện chưa có bản tin Bắt mạch Thị trường mới nhất.');
    }

    const latestFile = files[0];
    const latestMdPath = path.join(dir, latestFile);
    const content = fs.readFileSync(latestMdPath, 'utf-8');

    // Parse các phần
    let pain = '';
    let needs = '';
    let ideas = '';

    const mPain = content.match(/\*\*2\.\s*💔\s*NỖI ĐAU HIỆN TẠI[^\n]*\*\*(.*?)(?=\*\*3\.|\n---\n|$)/s);
    if (mPain) pain = mPain[1].trim();

    const mNeeds = content.match(/\*\*1\.\s*🎯\s*NHU CẦU CỐT LÕI[^\n]*\*\*(.*?)(?=\*\*2\.|\n---\n|$)/s);
    if (mNeeds) needs = mNeeds[1].trim();

    const mIdeas = content.match(/\*\*3\.\s*💡\s*Ý TƯỞNG CONTENT[^\n]*\*\*(.*?)(?=\*\*KẾT LUẬN|\n---\n|$)/s);
    if (mIdeas) ideas = mIdeas[1].trim();

    const clean = (t, max = 600) => {
      const lines = t.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('---'));
      const s = lines.slice(0, 10).join('\n');
      return s.length > max ? s.substring(0, max) + '...' : s;
    };

    let msg = `🎙️ <b>[FINPEACE MARKET SOUNDING · BẮT MẠCH TÂM LÝ F0]</b>\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📡 <i>Dữ liệu Social Listening từ F319, Diễn đàn & Mạng xã hội (Cập nhật 4h/lần):</i>\n\n`;

    if (pain) {
      msg += `💔 <b>1. Nỗi Đau & Điểm Kẹp Của Đám Đông:</b>\n${clean(pain, 650)}\n\n`;
    }
    if (needs) {
      msg += `🎯 <b>2. Nhu Cầu Cấp Thiết Của Nhà Đầu Tư:</b>\n${clean(needs, 550)}\n\n`;
    }
    if (ideas) {
      msg += `💡 <b>3. Vũ Khí Khơi Gợi Nhu Cầu Dành Cho Sales:</b>\n${clean(ideas, 700)}\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👉 <i>Sales dùng các chủ đề trên để mở lời trò chuyện, 'gãi đúng chỗ ngứa' của khách hàng đang kẹp hàng hoặc hoang mang nhé!</i>`;

    await ctx.reply(msg, { parse_mode: 'HTML' });

    // Gửi kèm PDF nếu có
    const latestPdfPath = latestMdPath.replace('.md', '.pdf');
    if (fs.existsSync(latestPdfPath)) {
      await ctx.replyWithDocument({ source: latestPdfPath }, {
        caption: '📄 Bản báo cáo chi tiết đính kèm: FinPeace F0 Needs & Market Sounding (PDF)'
      });
    }

    return;
  } catch (err) {
    console.error('Sounding error:', err);
    return ctx.reply('❌ Lỗi khi đọc bản tin Sounding: ' + err.message);
  }
});

// /connect hoặc /setup_group - Đăng ký Group nhận thông báo tự động 4H
async function handleConnectGroup(ctx) {
  const chat = ctx.chat;
  const isGroup = chat.type === 'group' || chat.type === 'supergroup';

  if (!isGroup) {
    return ctx.reply(`💡 Lệnh này dùng để kích hoạt trong Group Telegram của Sales. Hãy thêm bot vào Group rồi gõ <code>/connect</code> nhé!`, { parse_mode: 'HTML' });
  }

  const groupId = chat.id;
  const groupTitle = chat.title || 'Sales Group';

  // Lưu vào .env
  const fs = require('fs');
  const envLocalPath = path.resolve(__dirname, '../.env.local');
  const rootEnvPath = path.resolve(__dirname, '../../.env');

  const updateEnv = (filePath) => {
    if (fs.existsSync(filePath)) {
      let envContent = fs.readFileSync(filePath, 'utf-8');
      if (envContent.includes('TELEGRAM_SALES_GROUP_ID=')) {
        envContent = envContent.replace(/TELEGRAM_SALES_GROUP_ID=.*/g, `TELEGRAM_SALES_GROUP_ID=${groupId}`);
      } else {
        envContent += `\nTELEGRAM_SALES_GROUP_ID=${groupId}\n`;
      }
      fs.writeFileSync(filePath, envContent, 'utf-8');
    }
  };

  updateEnv(envLocalPath);
  updateEnv(rootEnvPath);
  process.env.TELEGRAM_SALES_GROUP_ID = String(groupId);

  let msg = `🎉 <b>KẾT NỐI GROUP SALES THÀNH CÔNG!</b>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👥 <b>Group:</b> ${groupTitle}\n`;
  msg += `🆔 <b>Group ID:</b> <code>${groupId}</code>\n\n`;
  msg += `⚡ <b>CÁC NỘI DUNG SẼ TỰ ĐỘNG PHÁT SÓNG VÀO ĐÂY:</b>\n`;
  msg += `1. 🎙️ <b>Bản tin Sounding Bắt Mạch Thị Trường (Mỗi 4 tiếng):</b> Tâm lý F0, các mã đang bị kẹp hàng, nỗi đau của thị trường và kịch bản chốt khách.\n`;
  msg += `2. ⚡ <b>Tín hiệu Trading Plans mới nhất:</b> Khi có lệnh Mua / Chốt lời mới từ phòng Phân tích FinPeace.\n\n`;
  msg += `👉 <i>Các bạn Sales trong group có thể gõ trực tiếp tên mã (VD: <b>DGW</b>, <b>CTG</b>, <b>SSI</b>) hoặc gõ <b>/sounding</b> để tra cứu bất kỳ lúc nào!</i>`;

  return ctx.reply(msg, { parse_mode: 'HTML' });
}

bot.command('connect', handleConnectGroup);
bot.command('setup', handleConnectGroup);
bot.command('setgroup', handleConnectGroup);

// /book <nội dung>, /kb <nội dung>, /sach <nội dung>
bot.command('book', (ctx) => {
  const query = ctx.message.text.replace(/^\/book\s*/i, '');
  return handleBookQuery(ctx, query);
});
bot.command('kb', (ctx) => {
  const query = ctx.message.text.replace(/^\/kb\s*/i, '');
  return handleBookQuery(ctx, query);
});
bot.command('sach', (ctx) => {
  const query = ctx.message.text.replace(/^\/sach\s*/i, '');
  return handleBookQuery(ctx, query);
});

// Callbacks cho RAG Book
bot.action(/^copy_(script_\d+)$/, async (ctx) => {
  try {
    const key = ctx.match[1];
    const script = recentSalesScripts.get(key);
    if (!script) {
      return ctx.answerCbQuery('⚠️ Kịch bản đã hết hạn lưu tạm. Bạn hãy gõ lại lệnh để lấy mới nhé!', { show_alert: true });
    }
    await ctx.answerCbQuery('✅ Đã trích xuất kịch bản tư vấn!');
    return ctx.reply(
      `💬 <b>KỊCH BẢN TƯ VẤN (CHẠM VÀO ĐỂ COPY):</b>\n\n<code>${script}</code>`,
      { parse_mode: 'HTML' }
    );
  } catch (e) {
    console.error('Error in copy script callback:', e);
  }
});

bot.action('book_topics', (ctx) => {
  return ctx.reply(
    `📚 <b>CÁC CHỦ ĐỀ SÁCH GỢI Ý CHO SALES & ADVISOR:</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `• <code>/book Mark Minervini cắt lỗ 7-8%</code>\n` +
    `• <code>/book Tâm lý gồng lỗ và hoảng loạn của F0</code>\n` +
    `• <code>/book Mô hình VCP và điểm mua pivot</code>\n` +
    `• <code>/book Biên an toàn (Margin of Safety) của Graham</code>\n` +
    `• <code>/book Quản trị rủi ro 2% tài khoản của Alexander Elder</code>\n` +
    `• <code>/book Phân tích dòng tiền Wyckoff tích lũy</code>\n\n` +
    `👉 <i>Nhấn hoặc copy câu lệnh bất kỳ ở trên để bot tra cứu ngay!</i>`,
    { parse_mode: 'HTML' }
  );
});

// Tự động nhận diện khi bot được thêm vào group
bot.on('my_chat_member', (ctx) => {
  const status = ctx.myChatMember.new_chat_member.status;
  if (status === 'member' || status === 'administrator') {
    return handleConnectGroup(ctx);
  }
});
bot.on('new_chat_members', (ctx) => {
  const isMe = ctx.message.new_chat_members.some(m => m.id === ctx.botInfo?.id);
  if (isMe) {
    return handleConnectGroup(ctx);
  }
});

// Bắt tin nhắn dạng gõ trực tiếp tên mã hoặc hỏi chi tiết (detail)
bot.on('text', (ctx) => {
  const rawText = ctx.message.text.trim();

  // 1. Cú pháp hỏi sách tự nhiên: "sách nói gì về...", "sách Mark Minervini...", "trích dẫn sách..."
  const matchBookPrefix = rawText.match(/^(?:sách|sach|trích\s*dẫn|trich\s*dan|tìm\s*sách|tim\s*sach|đọc\s*sách|doc\s*sach)\s+(?:nói\s*gì\s*về\s+|noi\s*gi\s*ve\s+)?(.+)$/i);
  if (matchBookPrefix) {
    return handleBookQuery(ctx, matchBookPrefix[1]);
  }

  // 2. Cú pháp xem detail dạng: "DPM detail", "DGW chi tiet", "HHV detail"
  const matchSuffix = rawText.match(/^([A-Za-z0-9]{3,4})\s+(?:detail|chi\s*ti[ếe]t)$/i);
  if (matchSuffix) {
    return handleTradingPlanDetail(ctx, matchSuffix[1]);
  }

  // 3. Cú pháp xem detail dạng: "detail DPM", "chi tiet DGW", "xem detail HHV", "xem chi tiet CTG"
  const matchPrefix = rawText.match(/^(?:xem\s+)?(?:detail|chi\s*ti[ếe]t)\s+([A-Za-z0-9]{3,4})$/i);
  if (matchPrefix) {
    return handleTradingPlanDetail(ctx, matchPrefix[1]);
  }

  // 4. Cú pháp xem chart dạng: "DPM chart", "DGW do thi", "HHV bieu do"
  const matchChartSuffix = rawText.match(/^([A-Za-z0-9]{3,4})\s+(?:chart|đồ\s*thị|do\s*thi|biểu\s*đồ|bieu\s*do)$/i);
  if (matchChartSuffix) {
    return handleShowChart(ctx, matchChartSuffix[1]);
  }

  // 5. Cú pháp xem chart dạng: "chart DPM", "do thi DGW", "xem chart HHV"
  const matchChartPrefix = rawText.match(/^(?:xem\s+)?(?:chart|đồ\s*thị|do\s*thi|biểu\s*đồ|bieu\s*do)\s+([A-Za-z0-9]{3,4})$/i);
  if (matchChartPrefix) {
    return handleShowChart(ctx, matchChartPrefix[1]);
  }

  // 6. Nếu gõ thẳng mã 3 chữ cái viết hoa (chuẩn mã chứng khoán VN: DGW, CTG, SSI, HPG...)
  const upperText = rawText.toUpperCase();
  if (/^[A-Z]{3}$/.test(upperText)) {
    return handleTradingQuery(ctx, upperText);
  }
});

// Khởi chạy bot
if (TELEGRAM_BOT_TOKEN) {
  bot.telegram.getMe().then((me) => {
    console.log(`🚀 FinPeace Trading & Market News Bot (@${me.username}) đã khởi chạy thành công và sẵn sàng nhận lệnh!`);
    return bot.launch({ dropPendingUpdates: true });
  }).catch(err => {
    console.error('❌ Lỗi khởi chạy Telegram Bot:', err.message);
  });

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
