import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(req: Request) {
  try {
    const { subscription, userId, userName, type } = await req.json();

    const vapidPub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPriv = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPub || !vapidPriv) {
       return NextResponse.json({ success: false, error: 'Missing VAPID keys' }, { status: 500 });
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:hello@finpeace.vn',
      vapidPub,
      vapidPriv
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && subscription && userId) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Lưu DB
      await supabase.from('push_subscriptions').insert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      });
    }

    if (type === 'welcome') {
      const displayName = userName ? userName : 'bạn';
      const payload = JSON.stringify({
        title: `Chào mừng ${displayName} sử dụng StockPicks 2.0`,
        body: 'Hãy giữ notification thông suốt để khi có tin nhắn quan trọng về lệnh giao dịch FinPeace có thể kết nối đến bạn nhé.',
        data: {
          url: '/stockpick/dashboard' // Có thể trỏ thẳng sang route /stockpick/profile nếu có
        }
      });
      await webpush.sendNotification(subscription, payload);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in push API', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
