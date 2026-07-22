// Bullwhip Effect Simulator — service worker (v1.0)
// Strategy: NETWORK-FIRST with cache fallback. Online students always get
// the newest deployed version; offline students (classroom wifi is not to
// be trusted) still get a fully working game from cache.
var CACHE = 'bw-v1.0';
var ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  // Delete caches from older versions (bump CACHE name on each release)
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      // Opportunistically refresh the cache with whatever we fetched
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      // Offline: serve from cache, fall back to the game shell
      return caches.match(e.request, { ignoreSearch: true }).then(function (m) {
        return m || caches.match('./index.html');
      });
    })
  );
});
