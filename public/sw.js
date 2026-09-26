const CACHE_NAME = "gateos-pwa-cache-v8";
// Content-hashed build files (/_next/static/*) never change, so they live in their own
// cache that survives deploys: a tab opened on the previous version can still load the
// chunks it needs instead of failing with "Loading chunk … failed" or losing its styles.
const STATIC_CACHE = "renyxera-static-v1";
const STATIC_MAX_ENTRIES = 800;

// App pages that must open offline (their data lives in IndexedDB).
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

// Install stays tiny so a new version never competes with the page for bandwidth (a big
// burst here used to delay the page's own stylesheet, leaving it unstyled for seconds).
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(STATIC_ASSETS.map((u) => fetch(u).then((r) => (r.ok ? cache.put(u, r) : undefined)).catch(() => {})))
    )
  );
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

// The page asks for the offline warm-up once it's loaded and idle; it runs two requests
// at a time so it never crowds out what the user is doing.
let warming = null;
self.addEventListener("message", (event) => {
  if (event.data === "warm-offline" && !warming) {
    warming = warmOffline().finally(() => { warming = null; });
    event.waitUntil(warming);
  }
});

async function pool(items, limit, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: limit }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

async function warmOffline() {
  const pages = await caches.open(CACHE_NAME);
  const statics = await caches.open(STATIC_CACHE);
  const assets = new Set();
  await pool(APP_ROUTES, 2, async (route) => {
    try {
      const res = await fetch(route, { credentials: "same-origin" });
      // A redirect (e.g. a signed-out visit to /downloads → /login) must not be cached
      // under the page's own URL.
      if (!res.ok || res.redirected) return;
      await pages.put(route, res.clone());
      const html = await res.text();
      for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);
    } catch {}
  });
  const missing = [];
  for (const u of assets) if (!(await statics.match(u))) missing.push(u);
  await pool(missing, 2, async (u) => {
    try {
      const res = await fetch(u);
      if (res.ok) await statics.put(u, res);
    } catch {}
  });
}

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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  // Next.js router data / prefetches: always straight to the network, never through here
  // (routing them via the worker left prefetches hanging and pages never finishing load).
  if (url.searchParams.has("_rsc") || req.headers.get("RSC") || req.headers.get("Next-Router-Prefetch")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staticAsset(req));
    return;
  }

  // Everything else: network first; the cache is only an offline fallback.
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
