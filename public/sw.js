self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      // Mở link được gửi kèm trong thông báo
      clients.openWindow(event.notification.data.url)
    );
  }
});
