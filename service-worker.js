const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
];

self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Cached offline page during install");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("add page to offline cache: " + response.url);

        // If request was successful, add or update it in the cache
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(function (error) {
        console.log("Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

// Check to make sure Sync is supported.
if ('serviceWorker' in navigator && 'SyncManager' in window) {

  // Get our service worker registration.
  const registration = await navigator.serviceWorker.registration;

  try {
    // This is where we request our sync. 
    // We give it a "tag" to allow for differing sync behavior.
    await registration.sync.register('database-sync');

  } catch {
    console.log("Background Sync failed.")
  }
}




function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        if (request.destination !== "document" || request.mode !== "navigate") {
          return caches.match('/offline.html');
        }

        return caches.match('/offline.html');
      }

      return matching;
    });
  });
}
