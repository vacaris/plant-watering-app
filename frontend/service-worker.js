const CACHE_NAME = 'plant-water-pwa-v1';
const urlsToCache = [ '/', '/index.html' /* można dodać inne zasoby statyczne */ ];

// Instalacja service workera – cache'owanie niezbędnych zasobów
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Strategia fetch – najpierw sprawdzaj cache, potem sieć
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // zwróć z cache
      }
      return fetch(event.request); // inaczej pobierz z sieci
    })
  );
});

// Aktualizacja service workera – usuń stare cache gdy pojawi się nowy worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }));
    })
  );
});
