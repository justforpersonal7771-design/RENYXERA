const CACHE_NAME = "gateos-pwa-cache-v6";

// App pages that must open offline (their data lives in IndexedDB). Each page's HTML is
// precached together with the /_next/static scripts and styles it references, so an
// offline visit to a page the user hasn't opened yet still works instead of falling back
// to the dashboard.
const APP_ROUTES = [
  "/",
  "/setup",
  "/exam/session",
  "/exam/results",
  "/exam/results/review",
  "/mistakes",
  "/bookmarks",
  "/revision",
  "/revision/session",
  "/analytics",
  "/downloads",
  "/downloads/view",
];
const STATIC_ASSETS = ["/manifest.json", "/data/questions.json", "/data/image-manifest.json"];

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  const put = (url) =>
    fetch(url, { credentials: "same-origin" })
      .then((res) => {
        // A redirect (e.g. a signed-out visit to /downloads → /login) must not be cached
        // under the page's own URL.
        if (res.ok && !res.redirected) return cache.put(url, res.clone()).then(() => res);
        console.warn("SW precache skipped (non-OK response):", url, res.status);
      })
      .catch((err) => console.warn("SW precache skipped (fetch failed):", url, err));

  // Each entry independently: one failing URL must not drop the rest.
  await Promise.all(STATIC_ASSETS.map(put));
  const assetUrls = new Set();
  await Promise.all(
    APP_ROUTES.map(async (route) => {
      const res = await put(route);
      if (!res) return;
      const html = await res.text();
      for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assetUrls.add(m[1]);
    })
  );
  await Promise.all([...assetUrls].map(put));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined))))
  );
  self.clients.claim();
});

// Network first, cache only as an offline fallback — online users always get what's
// actually deployed. API calls are never cached (answers, grading, AI are private).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic" && !networkResponse.redirected) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const exact = await cache.match(req);
        if (exact) return exact;
        if (req.mode === "navigate") {
          // Pages like /exam/results?id=… render from IndexedDB: the cached page shell
          // for the path works for any query.
          const page = await cache.match(url.pathname, { ignoreSearch: true });
          if (page) return page;
          const home = await cache.match("/");
          if (home) return home;
        }
        return new Response("Offline mode active. Please connect to the internet.", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "text/html" }),
        });
      })
  );
});
