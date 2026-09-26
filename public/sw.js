const CACHE_NAME = "gateos-pwa-cache-v7";
// Content-hashed build files (/_next/static/*) never change, so they live in their own
// cache that survives deploys: a tab opened on the previous version can still load the
// chunks it needs instead of failing with "Loading chunk … failed" or losing its styles.
const STATIC_CACHE = "renyxera-static-v1";
const STATIC_MAX_ENTRIES = 800;

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
  const staticCache = await caches.open(STATIC_CACHE);
  await Promise.all([...assetUrls].map((u) =>
    fetch(u).then((res) => (res.ok ? staticCache.put(u, res) : undefined)).catch(() => {})
  ));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME && key !== STATIC_CACHE ? caches.delete(key) : undefined))))
      .then(trimStatic)
  );
  self.clients.claim();
});

async function trimStatic() {
  const cache = await caches.open(STATIC_CACHE);
  const keys = await cache.keys();
  // Oldest first (insertion order); drop the overflow so storage stays bounded.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - STATIC_MAX_ENTRIES)).map((k) => cache.delete(k)));
}

async function staticAsset(req) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await caches.match(req)) || new Response("", { status: 504 });
  }
}

// Network first, cache only as an offline fallback — online users always get what's
// actually deployed. API calls are never cached (answers, grading, AI are private).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staticAsset(req));
    return;
  }

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
