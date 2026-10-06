const CACHE_NAME = 'eslem-nur-v4';
const urlsToCache = [
  
  'eslemnur_notes/tr/',
  'eslemnur_notes/de/',
  'eslemnur_notes/en/',
  'eslemnur_notes/fr/',
  'eslemnur_notes/tr/arapca.html',
  'eslemnur_notes/de/arabisch.html',
  'eslemnur_notes/en/arabic-words.html',
  '/eslemnur_notes/tr/gelisim.html',
  'eslemnur_notes/de/ilm-ibadah.html',
  'eslemnur_notes/en/tracker-en.html',
  '/eslemnur_notes/tr/umre-hac.html',
  'eslemnur_notes/en/hajj-umrah-en.html',
  'eslemnur_notes/de/hajj-umrah.html',
  'eslemnur_notes/tr/zikir.html',
  'eslemnur_notes/de/Zikirz.html',
  'eslemnur_notes/en/dhikr.html',
  'eslemnur_notes/tr/kuran.html',
  'eslemnur_notes/de/nur-kuran-de.html',
  'eslemnur_notes/en/nur-kuran.html',
  'eslemnur_notes/fr/nur-kuran-fr.html',
  'eslemnur_notes/tr/kelime-oyunu.html',
  'eslemnur_notes/de/wortspiel.html',
  'eslemnur_notes/en/word-hunt.html',
  'eslemnur_notes/tr/planner.html',
  'eslemnur_notes/de/ilm-ibadah-Planer.html',
  'eslemnur_notes/en/planner.html',
  'eslemnur_notes/tr/ikuran-pink.html',
  'eslemnur_notes/de/ikuran-pink.html',
  'eslemnur_notes/en/ikuran-pink.html',
  '/eslemnur_notes/PWA/icon/favicon4.ico',
  '/eslemnur_notes/PWA/png/favicon4-96x96.png',
  '/eslemnur_notes/PWA/manifest/site4.webmanifest',
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
