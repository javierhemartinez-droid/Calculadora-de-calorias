const CACHE = 'calorias-v2';
const BASE = ['./', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
// Red primero (siempre la versión nueva); si no hay conexión, usa lo guardado.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.hostname.includes('googleapis.com') && !u.hostname.startsWith('fonts')) return; // Firestore/Auth: sin caché
  e.respondWith(
    fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request))
  );
});
