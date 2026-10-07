const CACHE_NAME = 'eslem-nur-v4';
const urlsToCache = [
  
  'official/tr/',
  'official/de/',
  'official/en/',
  'official/fr/',
  'official/tr/arapca.html',
  'official/de/arabisch.html',
  'official/en/arabic-words.html',
  '/official/tr/gelisim.html',
  'official/de/ilm-ibadah.html',
  'official/en/tracker-en.html',
  '/official/tr/umre-hac.html',
  'official/en/hajj-umrah-en.html',
  'official/de/hajj-umrah.html',
  'official/tr/zikir.html',
  'official/de/Zikirz.html',
  'official/en/dhikr.html',
  'official/tr/kuran.html',
  'official/de/nur-kuran-de.html',
  'official/en/nur-kuran.html',
  'official/fr/nur-kuran-fr.html',
  'official/tr/kelime-oyunu.html',
  'official/de/wortspiel.html',
  'official/en/word-hunt.html',
  'official/tr/planner.html',
  'official/de/ilm-ibadah-Planer.html',
  'official/en/planner.html',
  'official/tr/ikuran-pink.html',
  'official/de/ikuran-pink.html',
  'official/en/ikuran-pink.html',
  '/official/PWA/icon/favicon4.ico',
  '/official/PWA/png/favicon4-96x96.png',
  '/official/PWA/manifest/site4.webmanifest',
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
