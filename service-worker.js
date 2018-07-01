const cacheName = 'free-currency-cache';

const CachedFiles = [
    './',                
    './currency.js',
    './jquery-1.9.1.min.js',
    './currency.css',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.info('serviceWorker caching files');
            return cache.addAll(CachedFiles);
        })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(
      caches.keys()
        .then(keyList => Promise.all(keyList.map(thisCacheName => {
        if (thisCacheName !== cacheName){
            console.log("serviceWorker removing cached files from", thisCacheName);
            return caches.delete(thisCacheName);        
        }}
       ))
      )
  );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
        .then(cache => {
          cache.put(event.request, response.clone());
            return response;
          }))
          .catch(event => {
          console.log('serviceWorker error caching and fetching');
        }))
      );
    });