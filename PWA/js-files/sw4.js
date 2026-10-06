const CACHE_NAME = 'eslem-nur-v4';
const urlsToCache = [
  
  '/eslemnur_notes/ipod-kuran.html',
  '/eslemnur_notes/PWA/icon/favicon3.ico',
  '/eslemnur_notes/PWA/png/favicon3-96x96.png',
  '/eslemnur_notes/PWA/manifest/site3.webmanifest',
  // İstersen diğer CSS/JS dosyalarını da buraya ekleyebilirsin
];

// Service Worker'ı kaydet
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbelleğe alındı');
        return cache.addAll(urlsToCache);
      })
  );
});

// Eski sürümleri sil
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// İstekleri yakala ve önbellekten döndür
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
