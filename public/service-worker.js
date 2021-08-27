const PRE_CACHE = 'precache-v1';
const RUN_TIME = 'runtime';

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/styles.css",
    "/db.js",
    "/service-worker.js",
    "/webpackConfig.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener('install', function (evt) {

  evt.waitUntil(
    caches.open(PRE_CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", function(evt) {
  const current_caches = [PRE_CACHE, RUN_TIME];
  evt.waitUntil(
    caches.keys().then(cache_names => {
      return cache_names.filter((cache_name) => !current_caches.includes(cache_name));
    })
      .then((caches_to_delete) => {
          return Promise.all(
              caches_to_delete.map((cache_to_delete) => {
                  return caches.delete(cache_to_delete);
              })
          );
      })
      .then(() => 
      
      self.clients.claim())
  );
});

// Fetch
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api")) {
    evt.respondWith(
      caches.open(RUN_TIME).then(cache => {
        return fetch(evt.request)

          .then(response => {

            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(() => caches.match(evt.request));
          })
    );

    return;
  }

  evt.respondWith(
    caches.match(evt.request).then(cached_response => {
      if (cached_response) {
        return cached_response;
      }
      
      return caches.open(RUN_TIME).then(cache => {
          return fetch(evt.request).then(response => {
              return cache.put(evt.request, response.clone()).then(() => {
                  return response;
              });
          });
      });
    })
  );
});