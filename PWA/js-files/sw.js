const CACHE_NAME = 'eslem-nur-v1';
const urlsToCache = [
  
  '/official/',
  '/official/index.html',
  '/official/de.html',
  '/official/fr.html',
  '/official/en.html',
  '/official/ar.html',
  '/official/PWA/icon/favicon.ico',
  '/official/PWA/png/favicon-96x96.png',
  '/official/PWA/manifest/site.webmanifest',
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
