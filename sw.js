// Self-destruct service worker.
// The old books PWA is retired; bookkeeping lives at gardenfaery.love/admin.
// This SW unregisters itself and clears all caches so old home-screen installs
// stop serving stale offline content and get the redirect page instead.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    const clients = await self.clients.matchAll();
    clients.forEach(c => c.navigate(c.url));
  })());
});
