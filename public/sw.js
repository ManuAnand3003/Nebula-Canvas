const CACHE_NAME = 'nebula-canvas-v1';

// On install, cache the offline page.
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Try to get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // If we have a cached response, return it.
        // Then, try to fetch a fresh version from the network to update the cache.
        fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
        });
        return cachedResponse;
      }
      
      try {
        // If the resource is not in the cache, try to fetch it from the network.
        const networkResponse = await fetch(event.request);
        // If the fetch is successful, cache the response for future offline use.
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // If the fetch fails (e.g., the user is offline),
        // you could return a fallback offline page here.
        console.error('Fetch failed; returning offline page instead.', error);
        // For now, just let the browser handle the error.
        return Response.error();
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
