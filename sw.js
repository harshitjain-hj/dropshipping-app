const staticCacheName = 'site-static';
const imagesCacheName = 'site-images';
const dynamicCacheName = 'site-dynamic';

const assets = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/offline.html',
  '/css/ui.css',
  '/css/materialize.min.css',
  '/scripts/app.js',
  '/scripts/auth.js',
  '/scripts/config.js',
  '/scripts/index.js',
  '/scripts/item.js',
  '/scripts/materialize.min.js',
  '/scripts/ui.js',
  '/account-background.jpg',
  '/guest.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// handeling the images cache
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}; 

// install service worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});


// activate service worker
self.addEventListener('activate', evt => {
  // console.log('service worker has been activated');
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1 && evt.request.url.indexOf('analytics') === -1 && evt.request.url.indexOf('gtag') === -1 ){

    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          if(evt.request.url.indexOf('firebasestorage.googleapis.com/') > -1){
            return caches.open(imagesCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(imagesCacheName, 20);
              return fetchRes;
            });
          }
          else {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 10);
              return fetchRes;
            })
          }  
        });
      }).catch(() => caches.match('/offline.html'))
    );
  }

});