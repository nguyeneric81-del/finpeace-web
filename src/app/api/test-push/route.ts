import { NextResponse } from 'next/server';
import webpush from 'web-push';

export async function POST(req: Request) {
  try {
    const { subscription, dealName } = await req.json();

    // Ensure VAPID keys are configured
    const vapidPub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPriv = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPub || !vapidPriv) {
       console.error("Missing VAPID keys!");
       return NextResponse.json({ success: false, error: 'Missing VAPID keys' }, { status: 500 });
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:test@finpeace.vn',
      vapidPub,
      vapidPriv
    );

    const payload = JSON.stringify({
      title: '📈 FinPeace - Mở khoá thành công!',
      body: `Bạn vừa mở khoá deal "${dealName}". Bấm để xem chi tiết Trading Plan.`,
    });

    // Send the notification
    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
