const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:hello@finpeace.vn',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role
);

async function run() {
  console.log("Tìm kiếm Token của user...");
  // Lấy subscription mới nhất (bỏ qua bản ghi test '123')
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .neq('user_id', '123')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
     console.log("Chưa thấy Token của Tuấn Anh trong DB! Khả năng do lỗi cache.");
     return;
  }
  
  const sub = data[0];
  console.log("Đã tìm thấy Token cho user:", sub.user_id);
  
  const pushSubscription = {
    endpoint: sub.endpoint,
    keys: {
      auth: sub.auth,
      p256dh: sub.p256dh
    }
  };

  const payload = JSON.stringify({
    title: '👋 Hệ thống FinPeace',
    body: 'chao ban tuan anh! Test Notification Web Push đã hoạt động hoàn hảo!',
    data: { url: '/stockpick/dashboard' }
  });

  try {
    console.log("Đang bắn Notification...");
    const result = await webpush.sendNotification(pushSubscription, payload);
    console.log("✅ Bắn thành công!", result.statusCode);
  } catch (err) {
    console.error("❌ Lỗi khi bắn", err);
  }
}

run();
