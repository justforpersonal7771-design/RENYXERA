const CACHE_NAME = "gateos-pwa-cache-v4";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/api/dataset",
  "/api/image-manifest",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // cache.addAll() is all-or-nothing — a single failing URL (e.g. a stale entry that
      // no longer resolves) silently drops precaching for every other entry too, with no
      // visible error. Cache each entry independently instead so one bad URL can't take
      // the rest down; genuinely missing entries just get skipped (and logged).
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
              console.warn("SW precache skipped (non-OK response):", url, res.status);
            })
            .catch((err) => console.warn("SW precache skipped (fetch failed):", url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy (Network First, cache as an offline fallback only).
// This app ships multiple deploys per session — cache-first (the previous
// strategy) meant every visitor was served yesterday's cached shell first,
// with a fresh copy only quietly updated in the background for *next* time,
// so fixes never actually reached anyone no matter how often they reloaded.
// Network-first means online users always get what's actually deployed;
// the cache only kicks in once a request genuinely fails (offline).
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        const cache = await caches.open(CACHE_NAME);
        const fallback = await cache.match("/");
        return fallback || new Response("Offline mode active. Please connect to the internet.", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "text/html" })
        });
      })
  );
});
