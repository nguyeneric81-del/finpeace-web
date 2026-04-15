'use client';

import { useState, useEffect } from 'react';

export default function TestPushPage() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => {
          console.log('Service Worker registered', reg);
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) setSubscription(sub);
          });
        },
        (err) => console.error('Service Worker registration failed', err)
      );
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    try {
      setMessage('⏳ Đang xin quyền từ trình duyệt...');
      
      // Xin quyền Notification tường minh
      if (!('Notification' in window)) {
        setMessage('❌ Trình duyệt của bạn không hỗ trợ Web Push!');
        return;
      }
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage('❌ Bạn đã từ chối hoặc trình duyệt chặn gửi Thông báo (Kiểm tra chặn ẩn danh/incognito)!');
        return;
      }

      setMessage('⏳ Đang kết nối Service Worker...');
      const reg = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        setMessage('❌ Lỗi: Chưa cấu hình NEXT_PUBLIC_VAPID_PUBLIC_KEY trong file .env');
        return;
      }

      setMessage('⏳ Đang đăng ký Token với Google/Apple...');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(sub);
      setMessage('✅ Đã cấp quyền nhận thông báo thành công!');
    } catch (e: any) {
      console.error(e);
      setMessage(`❌ Lỗi cấp quyền: ${e.message}`);
    }
  };

  const testUnlockDeal = async () => {
    if (!subscription) {
      setMessage('Vui lòng bật thông báo trước!');
      return;
    }

    setMessage('Đang xử lý mở khoá và gửi thông báo...');
    try {
      const res = await fetch('/api/test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          dealName: 'HPG',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('🎉 Thông báo đã được gửi thành công. Hãy kiểm tra màn hình của bạn!');
      } else {
        setMessage('❌ Lỗi gửi thông báo từ Server.');
      }
    } catch (e: any) {
      setMessage(`❌ Lỗi API: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-700">Test Web Push - FinPeace</h1>
        
        <p className="text-gray-600 text-sm">
          Luồng test: Khách hàng cho phép nhận thông báo, sau đó giả lập hành động "Mở khoá Deal HPG" để hệ thống tự động bắn Push Noti về trình duyệt ngay lập tức.
        </p>

        <div className="space-y-4">
          <button
            onClick={subscribe}
            disabled={subscription !== null}
            className={`w-full py-2 px-4 rounded font-semibold ${
              subscription 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {subscription ? 'Đã bật thông báo' : '1. Bật nhận thông báo'}
          </button>

          <button
            onClick={testUnlockDeal}
            className="w-full py-2 px-4 rounded font-semibold bg-green-600 hover:bg-green-700 text-white"
          >
            2. Mở khoá Deal "HPG" (Gửi Push)
          </button>
        </div>

        {message && (
          <div className="p-3 bg-gray-100 border rounded text-sm text-gray-800 text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
