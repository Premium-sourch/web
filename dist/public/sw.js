// Notification counter — persists across push events via SW lifetime
let notifCount = 0;

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Lamix SMS", body: event.data.text() };
  }

  notifCount += (payload.newCount || 1);

  const title = notifCount > 1
    ? `📩 ${notifCount} New Messages`
    : (payload.title || "📩 Lamix SMS");

  const options = {
    body: payload.body || "New SMS received",
    icon: "/sms-dashboard/favicon.svg",
    badge: "/sms-dashboard/favicon.svg",
    tag: "lamix-sms",          // same tag collapses into one notification
    renotify: true,             // still plays sound/vibrate on update
    silent: false,              // use OS notification sound
    vibrate: [200, 80, 200, 80, 400],
    data: {
      url: payload.url || "/sms-dashboard/",
      timestamp: Date.now(),
      count: notifCount,
    },
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    notifCount = 0;
    return;
  }

  // Reset counter when user opens the app
  notifCount = 0;
  const targetUrl = event.notification.data?.url || "/sms-dashboard/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes("/sms-dashboard") && "focus" in client) {
            client.postMessage({ type: "NOTIF_OPENED" });
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
  );
});

// Reset counter when app is visible/focused
self.addEventListener("message", (event) => {
  if (event.data?.type === "APP_FOCUSED") notifCount = 0;
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));
