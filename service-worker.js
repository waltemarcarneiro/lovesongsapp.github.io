const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
];

self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Cached offline page during install");

      try {
        await cache.addAll(urlsToCache);
      } catch (error) {
        console.error("Cache addAll error:", error);
      }
    })()
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        console.log("Adding page to offline cache: " + response.url);

        // If request was successful, add or update it in the cache
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());

        return response;
      } catch (error) {
        console.error("Network request failed. Serving content from cache:", error);
        return fromCache(event.request);
      }
    })()
  );
});

// Check to make sure Sync is supported.
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  // Get our service worker registration.
  navigator.serviceWorker.ready.then(async (registration) => {
    try {
      // This is where we request our sync. 
      // We give it a "tag" to allow for differing sync behavior.
      await registration.sync.register('database-sync');
    } catch {
      console.error("Background Sync failed.");
    }
  });
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
// Add an event listener for the `sync` event in your service worker.
self.addEventListener('sync', event => {

  // Check for correct tag on the sync event.
  if (event.tag === 'database-sync') {

    // Execute the desired behavior with waitUntil().
    event.waitUntil(

      // This is just a hypothetical function for the behavior we desire.
      pushLocalDataToDatabase();
    );
    }
});
// Query the user for permission.
const periodicSyncPermission = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
// Check if permission was properly granted.
if (periodicSyncPermission.state == 'granted') {

  // Register a new periodic sync.
  await registration.periodicSync.register('fetch-new-content', {
    // Set the sync to happen no more than once a day.
    minInterval: 24 * 60 * 60 * 1000
  });
} 
// Listen for the `periodicsync` event.
self.addEventListener('periodicsync', event => {

  // Check for correct tag on the periodicSyncPermissionsync event.
  if (event.tag === 'fetch-new-content') {

    // Execute the desired behavior with waitUntil().
    event.waitUntil(

      // This is just a hypothetical function for the behavior we desire.
      fetchNewContent();
    );
  }
});
