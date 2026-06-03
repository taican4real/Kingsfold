// Kingsfold International Academy - Service Worker for Offline Resilience
const CACHE_VERSION = 'kia-v1';
const CACHE_NAME = `kingsfold-cache-${CACHE_VERSION}`;

// Core assets to cache immediately on installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/robots.txt'
];

// Install Event: Precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Dynamic Precaching started');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Helper: Check if a request is for internal static assets or navigation
const isStaticAsset = (url) => {
  return (
    url.origin === self.location.origin &&
    (url.pathname.includes('/assets/') ||
     url.pathname.endsWith('.js') ||
     url.pathname.endsWith('.css') ||
     url.pathname.endsWith('.woff2') ||
     url.pathname.endsWith('.woff') ||
     url.pathname.endsWith('.ttf') ||
     url.pathname.endsWith('.ico') ||
     url.pathname.endsWith('.png') ||
     url.pathname.endsWith('.jpg') ||
     url.pathname.endsWith('.jpeg') ||
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.webp'))
  );
};

// Helper: Check if request is for cloud images (e.g. Cloudinary, Unsplash, Google Drive)
const isExternalImage = (url) => {
  return (
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('lh3.googleusercontent.com')
  );
};

// Fetch Event: Direct strategies for different assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Immediately bypass the service worker for all API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip non-GET requests (e.g., POST contact forms, CMS updates)
  if (request.method !== 'GET') {
    return;
  }

  // Skip browser extensions or local development hot reloads (e.g., chrome-extension:// or sockjs-node)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Strategy 1: NAVIGATION requests (HTML Pages like /admissions, /about)
  // Serve with Network-First with /index.html cache fallback (crucial for Single Page Application client-side routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Keep a fresh copy of the index.html or document in the cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('/', responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, serve the main index.html ('/') so client-side routing takes over perfectly
          return caches.match('/').then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Strategy 2: INTERNAL STATIC ASSETS (JS/CSS built bundles, internal fonts, and assets)
  // Use Stale-While-Revalidate: Instant load from cache first, then fetch in background to verify & update
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Quietly ignore network failures during background fetch
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 3: EXTERNAL IMAGES (Cloudinary, Unsplash, Google Drive images used in design)
  // Cache-First with Network Fallback: Good for heavy media assets that don't change often
  if (isExternalImage(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached image, but optionally update it in background
          fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback image or blank transparent pixel if completely offline and not in cache
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1"><rect width="1" height="1" fill="#f3f4f6"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // Strategy 4: ALL OTHER REQUESTS (API queries, general web requests)
  // Default to Network-First, Falling Back to Cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Only cache successful status 200 responses for standard HTTP(S) requests
        if (networkResponse.status === 200 && (url.protocol === 'http:' || url.protocol === 'https:')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
