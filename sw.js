const CACHE_NAME = 'garden-faery-books-v7';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Don't intercept Firebase Auth or Google sign-in requests
  if (url.hostname.includes('firebaseapp.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('google.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('cloudfunctions.net') ||
      url.pathname.startsWith('/__/auth/')) {
    return;
  }

  // Network-first strategy: try fresh version, fall back to cache
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
  );
});
