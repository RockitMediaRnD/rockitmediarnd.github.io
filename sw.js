/* Service worker for the browser testbed.
   Caches the shell so the offline check on the Storage page has something to serve. */
var CACHE = 'testbed-v1';
var ASSETS = [
  './', './index.html', './assets/css/testbed.css',
  './assets/js/testbed.js', './assets/js/nav-data.js',
  './pages/storage.html', './assets/media/thumb.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (u) {
      return c.add(u).catch(function () { /* a missing asset must not fail the install */ });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || new Response('Offline and not in cache.', {
          status: 503, headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'ping' && e.source) e.source.postMessage('pong from the service worker');
});
